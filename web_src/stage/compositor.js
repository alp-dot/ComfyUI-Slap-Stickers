// Composite cached layers in linear light; the stage's 2D canvas only presents pixels and guides.
import {liveTransform} from './live.js';
let engine=null;
const vertex=`#version 300 es
uniform mat3 transform;out vec2 uv;
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));uv=p;vec3 q=transform*vec3(p,1.);gl_Position=vec4(q.x*2.-1.,1.-q.y*2.,0.,1.);}`;
const fragment=`#version 300 es
precision highp float;in vec2 uv;out vec4 outputColor;uniform sampler2D picture;uniform bool encode;uniform float opacity;
vec3 linearize(vec3 v){return mix(v/12.92,pow((v+.055)/1.055,vec3(2.4)),step(vec3(.04045),v));}
vec3 srgb(vec3 v){return mix(v*12.92,1.055*pow(max(v,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),v));}
void main(){if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.))))discard;vec4 c=texture(picture,encode?vec2(uv.x,1.-uv.y):uv);if(encode)outputColor=vec4(srgb(c.rgb),c.a);else outputColor=vec4(linearize(c.a>0.?c.rgb/c.a:vec3(0.))*c.a,c.a)*opacity;}`;
function create(){
  const canvas=new OffscreenCanvas(1,1),gl=canvas.getContext('webgl2',{alpha:false,premultipliedAlpha:true,antialias:false});
  if(!gl||!gl.getExtension('EXT_color_buffer_float'))throw new Error('Linear-light compositing needs WebGL2 with floating-point color buffers. Enable hardware acceleration.');
  const program=gl.createProgram();
  for(const [type,source]of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));gl.attachShader(program,shader);gl.deleteShader(shader);}
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
  return {canvas,gl,program,textures:new Map(),target:null,framebuffer:gl.createFramebuffer(),transform:gl.getUniformLocation(program,'transform'),encode:gl.getUniformLocation(program,'encode'),opacity:gl.getUniformLocation(program,'opacity')};
}
function texture(image){
  const {gl,textures}=engine;if(textures.has(image))return textures.get(image);
  const result=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,result);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const canvas=new OffscreenCanvas(image.width,image.height);canvas.getContext('2d').drawImage(image,0,0);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);textures.set(image,result);return result;
}
export function releaseCompositeTexture(image){if(engine?.textures.has(image)){engine.gl.deleteTexture(engine.textures.get(image));engine.textures.delete(image);}}
export function disposeCompositor(){if(!engine)return;for(const image of engine.textures.keys())releaseCompositeTexture(image);const {gl}=engine;gl.deleteTexture(engine.target);gl.deleteFramebuffer(engine.framebuffer);gl.deleteProgram(engine.program);gl.getExtension('WEBGL_lose_context')?.loseContext();engine=null;}
export function composite(entry,stickers,frames,box){
  engine??=create();const e=engine,{gl}=e;
  if(e.canvas.width!==box.width||e.canvas.height!==box.height||!e.target){
    e.canvas.width=box.width;e.canvas.height=box.height;gl.deleteTexture(e.target);e.target=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,e.target);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,box.width,box.height,0,gl.RGBA,gl.HALF_FLOAT,null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,e.framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,e.target,0);
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('The linear-light image buffer is unavailable.');
  }
  gl.useProgram(e.program);gl.viewport(0,0,box.width,box.height);gl.bindFramebuffer(gl.FRAMEBUFFER,e.framebuffer);gl.disable(gl.BLEND);gl.uniform1i(e.encode,0);
  const identity=[1,0,0,0,1,0,0,0,1];
  function draw(image,transform,opacity){gl.bindTexture(gl.TEXTURE_2D,texture(image));gl.uniformMatrix3fv(e.transform,false,transform);gl.uniform1f(e.opacity,opacity);gl.drawArrays(gl.TRIANGLES,0,3);}
  draw(entry.image,identity,1);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  const aspect=box.width/box.height;
  for(const st of stickers){const frame=frames.get(st.id);if(!st.visible||!frame?.bitmap)continue;
    const t=liveTransform(frame,st),a=frame.anchor??st.anchor,c=t.cos*t.scale,s=t.sin*t.scale;
    const x=frame.bitmapRect[0]/frame.bitmapBox[0],y=frame.bitmapRect[1]/frame.bitmapBox[1],w=frame.bitmap.width/frame.bitmapBox[0],h=frame.bitmap.height/frame.bitmapBox[1];
    draw(frame.bitmap,[c*w,s*aspect*w,0,-s/aspect*h,c*h,0,a[0]+t.offset[0]+c*(x-a[0])-s/aspect*(y-a[1]),a[1]+t.offset[1]+s*aspect*(x-a[0])+c*(y-a[1]),1],st.opacity);
  }
  gl.disable(gl.BLEND);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.bindTexture(gl.TEXTURE_2D,e.target);gl.uniformMatrix3fv(e.transform,false,identity);gl.uniform1i(e.encode,1);gl.drawArrays(gl.TRIANGLES,0,3);return e.canvas;
}
