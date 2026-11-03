// Invert the same bilinear intrinsic field used by the shader, once per accepted map.
const inverses=new WeakMap();
function inverseField(frame){
  if(!frame.field)return null;
  if(inverses.has(frame.field))return inverses.get(frame.field);
  const [left,top,width,height]=frame.fieldRect,[gw,gh]=frame.gridSize,bins=Array.from({length:256},()=>[]),f=frame.field;
  const lo=[Infinity,Infinity],hi=[-Infinity,-Infinity];
  for(let i=0;i<f.length;i+=4)if(f[i+3])for(let axis=0;axis<2;axis++){lo[axis]=Math.min(lo[axis],f[i+axis]);hi[axis]=Math.max(hi[axis],f[i+axis]);}
  const bin=(v,axis)=>Math.max(0,Math.min(15,Math.floor((v-lo[axis])/Math.max(1e-12,hi[axis]-lo[axis])*16)));
  for(let y=0;y<height-1;y++)for(let x=0;x<width-1;x++){
    const i=(y*width+x)*4,a=i,b=i+4,c=i+width*4,d=c+4;
    if(!f[a+3]||!f[b+3]||!f[c+3]||!f[d+3])continue;
    const xmin=Math.min(f[a],f[b],f[c],f[d]),xmax=Math.max(f[a],f[b],f[c],f[d]);
    const ymin=Math.min(f[a+1],f[b+1],f[c+1],f[d+1]),ymax=Math.max(f[a+1],f[b+1],f[c+1],f[d+1]);
    for(let by=bin(ymin,1);by<=bin(ymax,1);by++)for(let bx=bin(xmin,0);bx<=bin(xmax,0);bx++)bins[by*16+bx].push(y*width+x);
  }
  const inverse=target=>{
    for(const index of bins[bin(target[1],1)*16+bin(target[0],0)]){
      const cell={x:index%width,y:Math.floor(index/width)},i=index*4;
      const a=i,b=i+4,c=i+width*4,d=c+4;
      if(target[0]<Math.min(f[a],f[b],f[c],f[d])-1e-7||target[0]>Math.max(f[a],f[b],f[c],f[d])+1e-7||target[1]<Math.min(f[a+1],f[b+1],f[c+1],f[d+1])-1e-7||target[1]>Math.max(f[a+1],f[b+1],f[c+1],f[d+1])+1e-7)continue;
      const q=[i,i+4,i+width*4,i+width*4+4].map(i=>[f[i],f[i+1],f[i+2]]);let x=.5,y=.5;
      for(let iteration=0;iteration<7;iteration++){
        const p=q[0].map((v,i)=>v*(1-x)*(1-y)+q[1][i]*x*(1-y)+q[2][i]*(1-x)*y+q[3][i]*x*y);
        const dx=q[0].map((v,i)=>(q[1][i]-v)*(1-y)+(q[3][i]-q[2][i])*y),dy=q[0].map((v,i)=>(q[2][i]-v)*(1-x)+(q[3][i]-q[1][i])*x);
        const det=dx[0]*dy[1]-dx[1]*dy[0];if(Math.abs(det)<1e-16)break;
        const ex=p[0]-target[0],ey=p[1]-target[1];
        x-=(ex*dy[1]-ey*dy[0])/det;y-=(dx[0]*ey-dx[1]*ex)/det;
        if(x< -2||x>3||y< -2||y>3)break;
      }
      if(x< -1e-5||x>1.00001||y< -1e-5||y>1.00001)continue;
      const p=q[0].map((v,i)=>v*(1-x)*(1-y)+q[1][i]*x*(1-y)+q[2][i]*(1-x)*y+q[3][i]*x*y);
      if(Math.hypot(p[0]-target[0],p[1]-target[1])>1e-5)continue;
      return {uv:[(left+cell.x+.5+x)/gw,(top+cell.y+.5+y)/gh],depth:p[2]};
    }
    return null;
  };
  inverses.set(frame.field,inverse);return inverse;
}
export function buildGuides(grid,frame){
  const inverse=inverseField(frame),pivot=frame.pivot??[.5,.5],offset=frame.offset??[0,0],angle=frame.turn??0,c=Math.cos(angle),s=Math.sin(angle);
  function point(u,v){
    const x=(u-pivot[0])*frame.w,y=(v-pivot[1])*frame.h,target=[offset[0]+x*c-y*s,offset[1]+x*s+y*c];
    let p=inverse?.(target);
    if(!p){
      const q=frame.p0.map((v,i)=>v+frame.e1[i]*target[0]+frame.e2[i]*target[1]);if(q[2]<frame.p0[2]*.05)return null;
      const projected=grid.intrinsics.map(row=>row.reduce((v,a,i)=>v+a*q[i],0));
      p={uv:[projected[0]/projected[2],projected[1]/projected[2]],depth:q[2]};
    }
    return p;
  }
  const corners=[[0,0],[1,0],[1,1],[0,1]];
  return {handles:corners.map(p=>point(...p)?.uv??null),center:point(.5,.5)?.uv,top:point(.5,0)?.uv??null,bottom:point(.5,1)?.uv??null};
}
