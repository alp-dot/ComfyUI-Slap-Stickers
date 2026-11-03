// One WebGL2 context per page, copied into each visible stage's 2D canvas.
import { inverse3, PLANE_TOL } from "../surface.js";
import {depthSpread} from "../wrap.js";
import {liveTransform,displayFrame} from "./live.js";
import { selectionControls } from "./selection.js";
import {sourceAppearance,sourceAppearanceKey} from '../appearance.js';
import {composite,releaseCompositeTexture,disposeCompositor} from './compositor.js';
let renderer = null;
const textures = new Map();
const byteMasks=new WeakMap(),layerImages=new WeakMap();
const guideBrightness=new WeakMap(),GUIDE_DARK='#141518',GUIDE_LIGHT='#fff';
function guideInk(image,[u,v]){
  if(u<0||u>1||v<0||v>1)return GUIDE_LIGHT;
  let map=guideBrightness.get(image);
  if(!map){
    const scale=Math.min(1,128/Math.max(image.width,image.height)),width=Math.max(1,Math.round(image.width*scale)),height=Math.max(1,Math.round(image.height*scale));
    const canvas=new OffscreenCanvas(width,height),ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(image,0,0,width,height);
    const rgba=ctx.getImageData(0,0,width,height).data,values=new Float32Array(width*height);
    for(let i=0;i<values.length;i++)values[i]=.2126*rgba[i*4]+.7152*rgba[i*4+1]+.0722*rgba[i*4+2];
    map={width,height,values};guideBrightness.set(image,map);
  }
  const x=Math.min(map.width-1,Math.floor(u*map.width)),y=Math.min(map.height-1,Math.floor(v*map.height));
  let brightness=0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)brightness+=map.values[Math.max(0,Math.min(map.height-1,y+dy))*map.width+Math.max(0,Math.min(map.width-1,x+dx))];
  return brightness/9>140?GUIDE_DARK:GUIDE_LIGHT;
}
function maskBytes(values){let bytes=byteMasks.get(values);if(!bytes){bytes=Uint8Array.from(values,v=>v?255:0);byteMasks.set(values,bytes);}return bytes;}
const vertex = `#version 300 es
out vec2 uv;
void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); uv=vec2(p.x,1.-p.y); gl_Position=vec4(p*2.-1.,0.,1.); }`;
const fragment = `#version 300 es
precision highp float;
in vec2 uv; out vec4 outputColor;
uniform sampler2D picture, points, valid, region, light, warp, spread, appearance,photoDetail,photoColor,photoFinish,normals,photoClip;
uniform bool wrapped,materialized,natural,hasMatte;
uniform vec4 sourceStats;
uniform vec2 photoSize;
uniform mat3 inverseK;
uniform vec3 p0,n,e1,e2;
uniform vec2 size,gridSize,mapGrid,pivot,fieldOffset,fieldRotation;
uniform vec4 fieldRect;
uniform float opacity,edge,shading,lref,imagePixelScale;
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
 xy-=fieldOffset;
 xy=vec2(xy.x*fieldRotation.x+xy.y*fieldRotation.y,-xy.x*fieldRotation.y+xy.y*fieldRotation.x);
 return xy/size+pivot;
}
vec3 linearize(vec3 v){return mix(v/12.92,pow((v+.055)/1.055,vec3(2.4)),step(vec3(.04045),v));}
vec3 srgb(vec3 v){return mix(v*12.92,1.055*pow(max(v,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),v));}
vec4 sourceAt(vec2 st,float lod,vec2 aa){vec2 edgeAlpha=clamp((min(st+aa*.5,vec2(1.))-max(st-aa*.5,vec2(0.)))/max(aa,vec2(.0000001)),0.,1.);return textureLod(picture,clamp(st,vec2(0.),vec2(1.)),lod)*edgeAlpha.x*edgeAlpha.y;}
float grain(ivec2 p){uint q=uint(p.x)*1973u+uint(p.y)*9277u+89173u;q=(q^(q>>16))*2246822519u;q=(q^(q>>13))*3266489917u;q^=q>>16;return (float(q&65535u)/65535.-.5)*3.464101615;}
void main(){
 vec2 geometryUV=uv;
 if(any(lessThan(geometryUV,vec2(0.)))||any(greaterThan(geometryUV,vec2(1.))))discard;
 if(texture(valid,geometryUV).r<.5)discard;
 vec3 p=texture(points,geometryUV).rgb;
 vec4 matte=hasMatte?texture(photoClip,uv):vec4(0.);bool soft=natural&&hasMatte&&matte.a>.5;float sceneCoverage=1.,expectedDepth;
 if(!soft&&texture(spread,geometryUV).r>edge)discard;
 if(wrapped){vec4 q=mapAt(geometryUV);if(q.a<=0.)discard;expectedDepth=q.z/q.a;if(!soft&&abs(p.z-expectedDepth)>edge*p.z)discard;}
 else{
  vec3 ray=inverseK*vec3(geometryUV,1.);expectedDepth=dot(n,p0)/dot(n,ray);
  float allowed=0.;ivec2 cell=ivec2(floor(geometryUV*gridSize));
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec2 q=(vec2(clamp(cell+ivec2(x,y),ivec2(0),ivec2(gridSize)-1))+.5)/gridSize;
   allowed=max(allowed,texture(region,q).r);
  }
  if(!soft&&((!natural&&allowed<.5)||abs(dot(n,p-p0))>${PLANE_TOL}*p.z))discard;
 }
 if(soft){vec2 depths=exp2(matte.rg);vec2 matchDepth=vec2(abs(expectedDepth-depths.x)<=edge*depths.x?1.:0.,abs(expectedDepth-depths.y)<=edge*depths.y?1.:0.);sceneCoverage=dot(matchDepth,vec2(matte.b,1.-matte.b));}
 vec2 st=textureUV(uv),dx=dFdx(st),dy=dFdy(st);vec2 margin=abs(dx)+abs(dy);
 float coverage=all(greaterThan(st,margin))&&all(lessThan(st,vec2(1.)-margin))?1.:0.;
 // Subpixel coverage only at the outline; derivatives avoid repeated surface lookups.
 if(coverage==0.)for(int y=0;y<4;y++) for(int x=0;x<4;x++){
   vec2 sub=st+dx*(float(x)-1.5)*.25+dy*(float(y)-1.5)*.25;
   if(all(greaterThanEqual(sub,vec2(0.)))&&all(lessThanEqual(sub,vec2(1.)))) coverage+=.0625;
 }
 if(coverage<=0.&&!natural) discard;
 vec4 color;
 if(natural){
  vec4 detail=texture(photoDetail,uv),local=texture(photoColor,uv),finish=texture(photoFinish,uv);
  vec2 dimensions=vec2(textureSize(picture,0));
  float footprint=max(length(dx*dimensions),length(dy*dimensions)),lod=max(0.,log2(max(footprint,1.)));
  // Account for the source's own enlargement blur before adding camera blur.
  float sigma=sqrt(max(0.,pow(detail.b*shading*imagePixelScale,2.)-.16/max(footprint*footprint,.000001)));
  vec2 sx=dx*sigma*1.414213562,sy=dy*sigma*1.414213562;
  color=vec4(0.);
  if(sigma<.15)color=sourceAt(st,lod,margin);
  else {lod+=log2(max(1.,sigma*.8));vec2 aa=margin*max(1.,sigma*.5);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){float weight=float((x==0?2:1)*(y==0?2:1))/16.;color+=sourceAt(st+sx*float(x)+sy*float(y),lod,aa)*weight;}}
  coverage=1.;
  color.rgb=color.a>1e-6?color.rgb/color.a:vec3(0.);
  vec3 original=color.rgb;float luminance=dot(original,vec3(.2126,.7152,.0722));
  float contrast=clamp(local.a/max(sourceStats.a,.02),.65,1.2);
  vec3 adjusted=(original-sourceStats.rgb)*contrast+sourceStats.rgb+.12*(local.rgb-sourceStats.rgb);
  float saturation=(max(max(local.r,local.g),local.b)-min(min(local.r,local.g),local.b))/max(max(max(local.r,local.g),local.b),.005);
  adjusted=vec3(luminance)+(adjusted-vec3(luminance))*(.85+.15*saturation);
  float confidence=clamp((sourceStats.a-.005)/.015,0.,1.);
  adjusted=original+(adjusted-original)*clamp(4.*luminance*(1.-luminance),0.,1.)*confidence;
  adjusted=max(adjusted,vec3(0.))*detail.r*detail.g*finish.rgb+finish.a*.3;
  color.rgb=srgb(clamp(mix(original,clamp(adjusted,0.,1.),shading)+grain(ivec2(floor(uv*photoSize)))*detail.a*shading*min(1.,imagePixelScale),0.,1.));
  vec3 surfaceNormal=texture(normals,geometryUV).rgb;float facing=soft||length(surfaceNormal)<.000001?1.:dot(normalize(surfaceNormal),n);
  coverage*=smoothstep(.087155743,.422618262,facing);
 }else{
  color=texture(picture,clamp(st,vec2(0.),vec2(1.)));color.rgb=color.a>1e-6?color.rgb/color.a:vec3(0.);
  float k=1.+shading*(clamp(texture(light,uv).r/max(lref,.0001),0.,2.)-1.);vec3 gain=vec3(k);
  if(materialized){vec4 field=texture(appearance,uv);gain*=mix(vec3(1.),field.rgb,shading)*(1.+shading*(field.a-1.));}
  color.rgb=srgb(clamp(linearize(color.rgb)*gain,0.,1.));
 }
 outputColor=vec4(color.rgb,color.a*coverage*sceneCoverage*opacity);
}`;
function createRenderer() {
  const canvas = typeof document==="undefined"?new OffscreenCanvas(1,1):document.createElement("canvas"); // Render engine, not DOM UI.
  const gl = canvas.getContext("webgl2",{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true});
  if (!gl) throw new Error("WebGL2 is unavailable. Enable hardware acceleration and reload the page.");
  gl.getExtension('EXT_color_buffer_float'); // Enables mip generation for linear RGBA16F sources.
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
    const floating=data instanceof Float32Array,half=data instanceof Uint16Array;
    gl.texImage2D(gl.TEXTURE_2D,0,half?gl.RGBA16F:floating?gl.RGBA32F:gl.RGBA,width,height,0,gl.RGBA,half?gl.HALF_FLOAT:floating?gl.FLOAT:gl.UNSIGNED_BYTE,data);
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
  releaseCompositeTexture(key);
  if (textures.has(key)) { renderer?.gl.deleteTexture(textures.get(key)); textures.delete(key); }
  const appearance=sourceAppearanceKey(key);if(appearance&&textures.has(appearance)){renderer?.gl.deleteTexture(textures.get(appearance));textures.delete(appearance);}
}
export function releaseSurfaceTextures(entry) {
  releaseTexture(entry.grid.points); releaseTexture(entry.grid.valid); releaseTexture(entry.light);releaseTexture(entry.material);releaseTexture(entry.spread);
  releaseTexture(entry.grid.normals);for(const value of Object.values(entry.appearance??{}))releaseTexture(value.data);
}
export function disposeRenderer() {
  disposeCompositor();
  if (!renderer) return;
  for (const key of [...textures.keys()]) releaseTexture(key);
  renderer.gl.deleteProgram(renderer.program);
  renderer.gl.getExtension("WEBGL_lose_context")?.loseContext(); renderer = null;
}
export function fitRect(canvas,meta) {
  const scale = Math.min(canvas.width/meta.image_w,canvas.height/meta.image_h);
  const width = Math.round(meta.image_w*scale), height = Math.round(meta.image_h*scale);
  // Integer placement avoids different half-pixel edge coverage in accelerated and
  // readback canvases, and keeps the photo's outer edge sharp while dragging.
  return {left:Math.round((canvas.width-width)/2),top:Math.round((canvas.height-height)/2),width,height};
}
function layerImage(entry,frame,source,st,box){
  const previous=layerImages.get(frame),key=JSON.stringify([box.width,box.height,st.opacity,st.shading,st.edge,frame.lref]);
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
  const natural=!!(st.natural&&entry.appearance);gl.uniform1i(location('natural'),natural);
  const matte=natural&&entry.appearance.clip;gl.uniform1i(location('hasMatte'),!!matte);
  if(matte)bind(13,'photoClip',texture(matte.data,matte.width,matte.height,matte.data,4,true));
  if(natural){
    const appearance=sourceAppearance(source),fresh=!textures.has(appearance.data);
    bind(0,'picture',texture(appearance.data,source.width,source.height,appearance.data,4,true));
    if(fresh){gl.generateMipmap(gl.TEXTURE_2D);if(gl.getError()!==gl.NO_ERROR)throw new Error('Linear image filtering is unavailable. Enable hardware acceleration.');gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);}
    gl.uniform4fv(location('sourceStats'),appearance.stats);
    for(const [unit,name,field]of [[9,'photoDetail','detail'],[10,'photoColor','color'],[11,'photoFinish','finish']]){
      const value=entry.appearance[field];bind(unit,name,texture(value.data,value.width,value.height,value.data,4,true));
    }
    gl.uniform2f(location('photoSize'),entry.meta.image_w,entry.meta.image_h);
    gl.uniform1f(location('imagePixelScale'),box.width/entry.meta.image_w);
    bind(12,'normals',texture(entry.grid.normals,entry.grid.width,entry.grid.height,entry.grid.normals,3));
  }else bind(0,"picture",texture(source,source.width,source.height,source,4,true));
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
  gl.uniform2fv(location('pivot'),frame.pivot??[.5,.5]);
  gl.uniform2fv(location('fieldOffset'),frame.offset??[0,0]);
  gl.uniform2f(location('fieldRotation'),Math.cos(frame.turn??0),Math.sin(frame.turn??0));
  for(const [name,value]of Object.entries({opacity:st.opacity,edge:st.edge,shading:st.shading,lref:frame.lref??1}))gl.uniform1f(location(name),value);
  const padding=2+(natural?Math.ceil(3*entry.blurMax*st.shading*box.width/entry.meta.image_w):0);
  const b=frame.bounds,left=Math.max(0,Math.floor(b[0]*box.width)-padding),right=Math.min(box.width,Math.ceil(b[2]*box.width)+padding);
  const top=Math.max(0,Math.floor(b[1]*box.height)-padding),bottom=Math.min(box.height,Math.ceil(b[3]*box.height)+padding);
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
  return {bitmap,bitmapRect:[layer.left,layer.top],bitmapBox:[box.width,box.height],natural:!!(st.natural&&entry.appearance)};
}
export function renderStage(canvas,entry,stickers,frames,sources,selected,dragging=false,dropFrame=null){
  const box=fitRect(canvas,entry.meta),ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.drawImage(entry.image,box.left,box.top,box.width,box.height);
  const natural=[...frames.values()].some(frame=>frame.natural);
  if(natural)ctx.drawImage(composite(entry,stickers,frames,box),box.left,box.top,box.width,box.height);
  else for(const st of stickers){
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
  if(dragging)return;
  const selection=dropFrame?['__drop']:(Array.isArray(selected)?selected:[selected]);
  for(const id of selection){
    const stored=id==='__drop'?dropFrame:frames.get(id),sticker=id==='__drop'?{anchor:stored.anchor,size:stored.size,rotation:stored.rotation}:stickers.find(st=>st.id===id);if(!stored||!sticker)continue;
    const frame=displayFrame(stored,sticker,entry.grid.intrinsics),ratio=canvas.width/canvas.getBoundingClientRect().width;
    const screen=([u,v])=>[box.left+u*box.width,box.top+v*box.height];
    const controls=selectionControls(box,frame,ratio);if(!controls)continue;
    const paths=new Map([GUIDE_DARK,GUIDE_LIGHT].map(ink=>[ink,{marks:new Path2D(),border:new Path2D()}]));
    const inkAt=point=>guideInk(entry.image,[(point[0]-box.left)/box.width,(point[1]-box.top)/box.height]);
    controls.handles.forEach((corner,i)=>{
      if(!corner)return;
      const marks=paths.get(inkAt(corner)).marks,next=controls.handles[(i+1)%4];
      if(next){
        const steps=Math.max(1,Math.min(128,Math.ceil(Math.hypot(next[0]-corner[0],next[1]-corner[1])/(24*ratio))));
        for(let j=0;j<steps;j++){
          const at=t=>corner.map((v,axis)=>v+(next[axis]-v)*t),path=paths.get(inkAt(at((j+.5)/steps))).border;
          path.moveTo(...at(j/steps));path.lineTo(...at((j+1)/steps));
        }
      }
      const ends=[controls.handles[(i+3)%4],controls.handles[(i+1)%4]].map(neighbor=>{
        const target=neighbor??screen(frame.center??sticker.anchor),d=target.map((v,j)=>v-corner[j]),length=Math.hypot(...d)||1;
        const arm=18*ratio;
        return [corner[0]+d[0]/length*arm,corner[1]+d[1]/length*arm];
      });
      marks.moveTo(...ends[0]);marks.lineTo(...corner);marks.lineTo(...ends[1]);
    });
    ctx.save();ctx.lineJoin='miter';ctx.miterLimit=2;ctx.lineCap='butt';
    ctx.globalAlpha=sticker.locked ? .2 : .4;ctx.lineWidth=ratio;
    for(const [ink,path]of paths){ctx.strokeStyle=ink;ctx.stroke(path.border);}
    ctx.globalAlpha=sticker.locked ? .5 : 1;
    ctx.lineWidth=3*ratio;
    for(const [ink,path]of paths){ctx.strokeStyle=ink;ctx.stroke(path.marks);}
    if(!sticker.locked&&selection.length===1&&id!=='__drop'){
      ctx.strokeStyle=inkAt(controls.rotate);ctx.lineWidth=1.25*ratio;
      ctx.beginPath();ctx.moveTo(...controls.top);ctx.lineTo(...controls.rotate);ctx.stroke();
      ctx.beginPath();ctx.arc(...controls.rotate,4.5*ratio,0,Math.PI*2);ctx.fillStyle=ctx.strokeStyle;ctx.fill();
    }
    ctx.restore();
  }
}
