// One WebGL2 context per page, copied into each visible stage's 2D canvas.
import { inverse3, PLANE_TOL } from "../surface.js";
import {depthSpread} from "../wrap.js";
import {liveTransform,displayFrame} from "./live.js";
import { selectionControls } from "./selection.js";
let renderer = null;
const textures = new Map();
const byteMasks=new WeakMap(),layerImages=new WeakMap();
function maskBytes(values){let bytes=byteMasks.get(values);if(!bytes){bytes=Uint8Array.from(values,v=>v?255:0);byteMasks.set(values,bytes);}return bytes;}
const vertex = `#version 300 es
out vec2 uv;
void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); uv=vec2(p.x,1.-p.y); gl_Position=vec4(p*2.-1.,0.,1.); }`;
const fragment = `#version 300 es
precision highp float;
in vec2 uv; out vec4 outputColor;
uniform sampler2D picture, points, valid, region, light, warp, spread, appearance;
uniform bool wrapped,materialized;
uniform mat3 inverseK;
uniform vec3 p0,n,e1,e2;
uniform vec2 size,gridSize,mapGrid;
uniform vec4 fieldRect;
uniform float opacity,edge,shading,lref;
vec4 mapTexel(ivec2 p){
 if(any(lessThan(p,ivec2(0)))||any(greaterThanEqual(p,ivec2(fieldRect.zw))))return vec4(0.);
 return texelFetch(warp,p,0);
}
vec4 mapAt(vec2 v){
 vec2 p=v*mapGrid-.5-fieldRect.xy,f=fract(p);ivec2 i=ivec2(floor(p));
 vec4 a=mapTexel(i),b=mapTexel(i+ivec2(1,0)),c=mapTexel(i+ivec2(0,1)),d=mapTexel(i+ivec2(1,1));
 return a*((1.-f.x)*(1.-f.y))+b*(f.x*(1.-f.y))+c*((1.-f.x)*f.y)+d*(f.x*f.y);
}
vec2 textureUV(vec2 v){
 vec2 xy;
 if(wrapped){vec4 q=mapAt(v);if(q.a<=0.)return vec2(-10.);xy=q.xy/q.a;}
 else{vec3 ray=inverseK*vec3(v,1.);float t=dot(n,p0)/dot(n,ray);if(t<=0.)return vec2(-10.);vec3 q=ray*t-p0;xy=vec2(dot(q,e1),dot(q,e2));}
 return xy/size+.5;
}
vec3 linearize(vec3 v){return mix(v/12.92,pow((v+.055)/1.055,vec3(2.4)),step(vec3(.04045),v));}
vec3 srgb(vec3 v){return mix(v*12.92,1.055*pow(max(v,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),v));}
void main(){
 vec2 geometryUV=uv;
 if(any(lessThan(geometryUV,vec2(0.)))||any(greaterThan(geometryUV,vec2(1.))))discard;
 if(texture(valid,geometryUV).r<.5)discard;
 vec3 p=texture(points,geometryUV).rgb;
 if(texture(spread,geometryUV).r>edge)discard;
 if(wrapped){vec4 q=mapAt(geometryUV);if(q.a<=0.||abs(p.z-q.z/q.a)>edge*p.z)discard;}
 else{
  float allowed=0.;ivec2 cell=ivec2(floor(geometryUV*gridSize));
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec2 q=(vec2(clamp(cell+ivec2(x,y),ivec2(0),ivec2(gridSize)-1))+.5)/gridSize;
   allowed=max(allowed,texture(region,q).r);
  }
  if(allowed<.5||abs(dot(n,p-p0))>${PLANE_TOL}*p.z)discard;
 }
 vec2 st=textureUV(uv),dx=dFdx(st),dy=dFdy(st);vec2 margin=abs(dx)+abs(dy);
 float coverage=all(greaterThan(st,margin))&&all(lessThan(st,vec2(1.)-margin))?1.:0.;
 // Subpixel coverage only at the outline; derivatives avoid repeated surface lookups.
 if(coverage==0.)for(int y=0;y<4;y++) for(int x=0;x<4;x++){
   vec2 sub=st+dx*(float(x)-1.5)*.25+dy*(float(y)-1.5)*.25;
   if(all(greaterThanEqual(sub,vec2(0.)))&&all(lessThanEqual(sub,vec2(1.)))) coverage+=.0625;
 }
 if(coverage<=0.) discard;
 vec4 color=texture(picture,clamp(st,vec2(0.),vec2(1.)));
 color.rgb=color.a>1e-6?color.rgb/color.a:vec3(0.);
 float k=1.+shading*(clamp(texture(light,uv).r/max(lref,.0001),0.,2.)-1.);
 vec3 gain=vec3(k);
 if(materialized){vec4 field=texture(appearance,uv);gain*=mix(vec3(1.),field.rgb,shading)*(1.+shading*(field.a-1.));}
 color.rgb=srgb(clamp(linearize(color.rgb)*gain,0.,1.));
 outputColor=vec4(color.rgb,color.a*coverage*opacity);
}`;
function createRenderer() {
  const canvas = typeof document==="undefined"?new OffscreenCanvas(1,1):document.createElement("canvas"); // Render engine, not DOM UI.
  const gl = canvas.getContext("webgl2",{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true});
  if (!gl) throw new Error("WebGL2 is unavailable. Enable hardware acceleration and reload the page.");
  const program = gl.createProgram();
  for (const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
    const shader = gl.createShader(type); gl.shaderSource(shader,source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program,shader); gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const locations = new Map();
  const location = key => { if(!locations.has(key)) locations.set(key,gl.getUniformLocation(program,key)); return locations.get(key); };
  canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); });
  return {canvas,gl,program,location};
}
function texture(key, width, height, data, channels = 4, linear = false) {
  const {gl} = renderer;
  if (textures.has(key)) return textures.get(key);
  const previous=gl.getParameter(gl.TEXTURE_BINDING_2D);
  const result = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,result);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,linear?gl.LINEAR:gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,linear?gl.LINEAR:gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  if(channels===4&&ArrayBuffer.isView(data)){
    const floating=data instanceof Float32Array;
    gl.texImage2D(gl.TEXTURE_2D,0,floating?gl.RGBA32F:gl.RGBA,width,height,0,gl.RGBA,floating?gl.FLOAT:gl.UNSIGNED_BYTE,data);
  }else if (channels === 4) {
    // ImageBitmap ignores WebGL unpack flags. A canvas upload makes associated-alpha
    // filtering explicit, so hidden RGB in transparent pixels cannot create a fringe.
    const canvas=new OffscreenCanvas(width,height);canvas.getContext("2d").drawImage(data,0,0);
    const premultiplied=gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);}
    finally{gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,premultiplied);}
  }
  else {
    const floating = data instanceof Float32Array;
    gl.texImage2D(gl.TEXTURE_2D,0,channels===3?gl.RGB32F:floating?gl.R32F:gl.R8,width,height,0,channels===3?gl.RGB:gl.RED,floating?gl.FLOAT:gl.UNSIGNED_BYTE,data);
  }
  textures.set(key,result);
  gl.bindTexture(gl.TEXTURE_2D,previous);
  return result;
}
function bind(unit, name, value) {
  const {gl,location} = renderer;
  gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,value); gl.uniform1i(location(name),unit);
}
export function releaseTexture(key) {
  if (textures.has(key)) { renderer?.gl.deleteTexture(textures.get(key)); textures.delete(key); }
}
export function releaseSurfaceTextures(entry) {
  releaseTexture(entry.grid.points); releaseTexture(entry.grid.valid); releaseTexture(entry.light);releaseTexture(entry.material);releaseTexture(entry.spread);
}
export function disposeRenderer() {
  if (!renderer) return;
  for (const key of [...textures.keys()]) releaseTexture(key);
  renderer.gl.deleteProgram(renderer.program);
  renderer.gl.getExtension("WEBGL_lose_context")?.loseContext(); renderer = null;
}
export function fitRect(canvas,meta) {
  const scale = Math.min(canvas.width/meta.image_w,canvas.height/meta.image_h);
  const width = Math.round(meta.image_w*scale), height = Math.round(meta.image_h*scale);
  return {left:(canvas.width-width)/2,top:(canvas.height-height)/2,width,height};
}
function layerImage(entry,frame,source,st,box){
  const previous=layerImages.get(frame),key=[box.width,box.height,st.opacity,st.shading,st.edge,frame.lref].join(",");
  if(previous?.key===key&&previous.source===source)return previous;
  renderer??=createRenderer();
  const {gl,location}=renderer;
  if(gl.isContextLost())throw new Error("The image display stopped. Reload the page to restore it.");
  if(renderer.canvas.width!==box.width)renderer.canvas.width=box.width;
  if(renderer.canvas.height!==box.height)renderer.canvas.height=box.height;
  gl.viewport(0,0,box.width,box.height);gl.useProgram(renderer.program);gl.disable(gl.SCISSOR_TEST);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  const inverse=inverse3(entry.grid.intrinsics);
  gl.uniformMatrix3fv(location("inverseK"),false,new Float32Array([0,1,2].flatMap(j=>[0,1,2].map(i=>inverse[i][j]))));
  gl.uniform2f(location("gridSize"),entry.grid.width,entry.grid.height);
  bind(0,"picture",texture(source,source.width,source.height,source,4,true));
  bind(1,"points",texture(entry.grid.points,entry.grid.width,entry.grid.height,entry.grid.points,3));
  bind(2,"valid",texture(entry.grid.valid,entry.grid.width,entry.grid.height,maskBytes(entry.grid.valid),1));
  bind(4,"light",texture(entry.light,entry.image.width,entry.image.height,entry.light,1));
  gl.uniform1i(location("materialized"),!!entry.material);
  if(entry.material)bind(7,"appearance",texture(entry.material,entry.image.width,entry.image.height,entry.material,4));
  entry.spread??=depthSpread(entry.grid);bind(6,"spread",texture(entry.spread,entry.grid.width,entry.grid.height,entry.spread,1));
  const [gw,gh]=frame.gridSize??[entry.grid.width,entry.grid.height];
  gl.uniform1i(location("wrapped"),!!frame.field);
  if(frame.field){
    gl.uniform4fv(location("fieldRect"),frame.fieldRect);gl.uniform2f(location("mapGrid"),gw,gh);
    bind(5,"warp",texture(frame.field,frame.fieldRect[2],frame.fieldRect[3],frame.field,4));
  }
  bind(3,"region",texture(frame.region,gw,gh,maskBytes(frame.region),1));
  for(const name of ["p0","n","e1","e2"])gl.uniform3fv(location(name),frame[name]);
  gl.uniform2f(location("size"),frame.w,frame.h);
  for(const [name,value]of Object.entries({opacity:st.opacity,edge:st.edge,shading:st.shading,lref:frame.lref??1}))gl.uniform1f(location(name),value);
  const b=frame.bounds,left=Math.max(0,Math.floor(b[0]*box.width)-2),right=Math.min(box.width,Math.ceil(b[2]*box.width)+2);
  const top=Math.max(0,Math.floor(b[1]*box.height)-2),bottom=Math.min(box.height,Math.ceil(b[3]*box.height)+2);
  const width=Math.max(1,right-left),height=Math.max(1,bottom-top);
  gl.enable(gl.SCISSOR_TEST);gl.scissor(left,box.height-bottom,width,height);gl.drawArrays(gl.TRIANGLES,0,3);gl.disable(gl.SCISSOR_TEST);
  const canvas=new OffscreenCanvas(width,height);
  canvas.getContext("2d").drawImage(renderer.canvas,left,top,width,height,0,0,width,height);
  const result={key,source,canvas,left,top};layerImages.set(frame,result);return result;
}
export function rasterizeSurface(entry,frame,source,st,viewport){
  const box=fitRect({width:viewport[0],height:viewport[1]},entry.meta),layer=layerImage(entry,frame,source,st,box);
  const bitmap=layer.canvas.transferToImageBitmap();
  releaseTexture(frame.region);if(frame.field)releaseTexture(frame.field);
  return {bitmap,bitmapRect:[layer.left,layer.top],bitmapBox:[box.width,box.height]};
}
export function renderStage(canvas,entry,stickers,frames,sources,selected,dragging=false){
  const box=fitRect(canvas,entry.meta),ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.drawImage(entry.image,box.left,box.top,box.width,box.height);
  for(const st of stickers){
    const frame=frames.get(st.id),source=sources.get(st.id);if(!st.visible||!frame||!source)continue;
    const layer=frame.bitmap?{canvas:frame.bitmap,left:frame.bitmapRect[0]*box.width/frame.bitmapBox[0],top:frame.bitmapRect[1]*box.height/frame.bitmapBox[1]}:layerImage(entry,frame,source,st,box);
    const t=liveTransform(frame,st),center=frame.anchor??st.anchor;
    const cx=center[0]*box.width,cy=center[1]*box.height;
    ctx.save();ctx.translate(box.left+cx+t.offset[0]*box.width,box.top+cy+t.offset[1]*box.height);
    ctx.globalAlpha=frame.bitmap?st.opacity:1;
    ctx.rotate(Math.atan2(t.sin,t.cos));ctx.scale(t.scale,t.scale);
    if(frame.bitmap)ctx.drawImage(layer.canvas,layer.left-cx,layer.top-cy,layer.canvas.width*box.width/frame.bitmapBox[0],layer.canvas.height*box.height/frame.bitmapBox[1]);
    else ctx.drawImage(layer.canvas,layer.left-cx,layer.top-cy);
    ctx.restore();
  }
  const stored=frames.get(selected),selectedSticker=stickers.find(s=>s.id===selected);
  const frame=stored&&selectedSticker?displayFrame(stored,selectedSticker,entry.grid.intrinsics):null;
  if (frame&&selectedSticker.visible&&!dragging) {
    const ratio=canvas.width/canvas.getBoundingClientRect().width;
    ctx.save();
    const corners=frame.corners.map(([u,v])=>[box.left+u*box.width,box.top+v*box.height]);
    ctx.lineWidth=1.5*ratio;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.strokeStyle=selectedSticker.locked?"rgba(255,255,255,.5)":"rgba(255,255,255,.95)";
    ctx.shadowColor="rgba(0,0,0,.6)";ctx.shadowBlur=2*ratio;
    // Short corner brackets leave the image itself unobstructed.
    ctx.beginPath();
    corners.forEach((corner,i)=>{
      if(frame.handles&&!frame.handles.some(p=>p&&box.left+p[0]*box.width===corner[0]&&box.top+p[1]*box.height===corner[1]))return;
      const ends=[corners[(i+corners.length-1)%corners.length],corners[(i+1)%corners.length]].map(other=>{
        const dx=other[0]-corner[0],dy=other[1]-corner[1],length=Math.hypot(dx,dy)||1,arm=Math.min(10*ratio,length*.25);
        return [corner[0]+dx/length*arm,corner[1]+dy/length*arm];
      });
      ctx.moveTo(...ends[0]);ctx.lineTo(...corner);ctx.lineTo(...ends[1]);
    });
    ctx.stroke();
    const controls=selectionControls(box,frame,ratio);
    if(controls&&!selectedSticker.locked){
      const [x,y]=controls.rotate,r=5*ratio,end=Math.PI*.15;
      ctx.beginPath();ctx.arc(x,y,r,Math.PI*.65,Math.PI*2+end);ctx.stroke();
      const tip=[x+Math.cos(end)*r,y+Math.sin(end)*r],back=end-Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(tip[0]+Math.cos(back-.65)*3*ratio,tip[1]+Math.sin(back-.65)*3*ratio);
      ctx.lineTo(...tip);ctx.lineTo(tip[0]+Math.cos(back+.65)*3*ratio,tip[1]+Math.sin(back+.65)*3*ratio);ctx.stroke();
    }

    ctx.restore();
  }
}
