// Source analysis belongs to the image, never to a pointer frame.
const cache=new WeakMap();
const bits=new Float32Array(1),integers=new Uint32Array(bits.buffer);
export function half(value){
  bits[0]=value;const x=integers[0],sign=(x>>>16)&0x8000,exponent=((x>>>23)&255)-127+15,mantissa=x&0x7fffff;
  if(exponent<=0){if(exponent< -10)return sign;return sign|(((mantissa|0x800000)>>> (1-exponent))+0x1000)>>>13;}
  if(exponent>=31)return sign|0x7c00;
  return sign|((exponent<<10)+(mantissa+0x1000>>>13));
}
export function sourceAppearance(source){
  if(cache.has(source))return cache.get(source);
  const canvas=new OffscreenCanvas(source.width,source.height),ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);
  const bytes=ctx.getImageData(0,0,source.width,source.height).data,data=new Uint16Array(bytes.length),mean=[0,0,0];let total=0,lm=0,square=0;
  const lookup=Array.from({length:256},(_,v)=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
  for(let i=0;i<bytes.length;i+=4){
    const a=bytes[i+3]/255,rgb=[lookup[bytes[i]],lookup[bytes[i+1]],lookup[bytes[i+2]]],luma=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
    total+=a;lm+=luma*a;square+=luma*luma*a;
    for(let c=0;c<3;c++){mean[c]+=rgb[c]*a;data[i+c]=half(rgb[c]*a);}data[i+3]=half(a);
  }
  const result={data,stats:[...mean.map(v=>v/Math.max(total,1e-6)),Math.sqrt(Math.max(0,square/Math.max(total,1e-6)-(lm/Math.max(total,1e-6))**2))]};
  cache.set(source,result);return result;
}
export function sourceAppearanceKey(source){return cache.get(source)?.data;}
export function unhalf(value){const sign=value&0x8000?-1:1,e=value>>10&31,m=value&1023;return sign*(e?2**(e-15)*(1+m/1024):m*2**-24);}
