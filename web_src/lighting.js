// Background-only work. The Worker caches these fields; pointer moves only sample them.
const linear=Float32Array.from({length:256},(_,v)=>(v/=255)<=.04045?v/12.92:((v+.055)/1.055)**2.4);
export function lightingFields(pixels,width,height){
  const count=width*height,raw=new Float32Array(count);
  let values=new Float32Array(count*3),scratch=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r=linear[pixels[i*4]],g=linear[pixels[i*4+1]],b=linear[pixels[i*4+2]];
    values[i*3]=r;values[i*3+1]=g;values[i*3+2]=b;raw[i]=.2126*r+.7152*g+.0722*b;
  }
  const sigma=Math.min(width,height)*.015,radius=Math.max(1,Math.ceil(sigma*3));
  const kernel=Array.from({length:radius*2+1},(_,i)=>Math.exp(-((i-radius)**2)/(2*sigma*sigma))),sum=kernel.reduce((a,b)=>a+b,0);
  for(let i=0;i<kernel.length;i++)kernel[i]/=sum;
  for(const axis of [0,1]){
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      let r=0,g=0,b=0;
      for(let k=-radius;k<=radius;k++){
        const xx=axis===0?Math.min(width-1,Math.max(0,x+k)):x,yy=axis===1?Math.min(height-1,Math.max(0,y+k)):y,j=(yy*width+xx)*3,weight=kernel[k+radius];
        r+=values[j]*weight;g+=values[j+1]*weight;b+=values[j+2]*weight;
      }
      const i=(y*width+x)*3;scratch[i]=r;scratch[i+1]=g;scratch[i+2]=b;
    }
    [values,scratch]=[scratch,values];
  }
  const light=new Float32Array(count),material=new Float32Array(count*4),clamp=v=>Math.min(1.25,Math.max(.75,v));
  for(let i=0;i<count;i++){
    light[i]=.2126*values[i*3]+.7152*values[i*3+1]+.0722*values[i*3+2];
    const denominator=Math.max(light[i],1e-4);
    for(let c=0;c<3;c++)material[i*4+c]=1+.35*(clamp(values[i*3+c]/denominator)-1);
    material[i*4+3]=1+.5*(clamp(raw[i]/denominator)-1);
  }
  return {light,material};
}
