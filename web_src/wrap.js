import {flatSurface} from './surface.js';
const caches=new WeakMap();
const DX=[-1,0,1,-1,1,-1,0,1],DY=[-1,-1,-1,0,0,1,1,1];
export function surfaceTopology(grid,edge=.04){
  const {width:w,height:h,points:p,valid}=grid,count=w*h;
  let cache=caches.get(grid);
  if(!cache){
    const normals=new Float64Array(count*3);
    for(let i=0;i<count;i++){
      const k=i*3,len=Math.hypot(grid.normals[k],grid.normals[k+1],grid.normals[k+2]);
      if(len>1e-12)for(let c=0;c<3;c++)normals[k+c]=grid.normals[k+c]/len;
    }
    cache={entries:new Map(),workspace:{normals,offsets:DX.map((x,k)=>x+DY[k]*w),dist:new Float64Array(count),basis:new Float64Array(count*6),heap:new Int32Array(count),positions:new Int32Array(count)}};
    caches.set(grid,cache);
  }
  const {entries,workspace}=cache;
  if(entries.has(edge))return entries.get(edge);
  const links=new Uint8Array(count),{normals}=workspace;
  const connected=(i,j)=>valid[i]&&valid[j]&&Math.abs(p[i*3+2]-p[j*3+2])<=edge*Math.min(p[i*3+2],p[j*3+2]);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x;if(!valid[i])continue;
    for(let k=0;k<8;k++){
      const xx=x+DX[k],yy=y+DY[k],j=yy*w+xx;
      if(xx<0||xx>=w||yy<0||yy>=h||!connected(i,j))continue;
      if(DX[k]&&DY[k]&&!(connected(i,y*w+xx)&&connected(i,yy*w+x)&&connected(j,y*w+xx)&&connected(j,yy*w+x)))continue;
      links[i]|=1<<k;
    }
  }
  let planar=!!valid[0];
  const n0=normals.subarray(0,3),origin=p.subarray?p.subarray(0,3):p.slice(0,3);
  for(let i=0;planar&&i<count;i++){
    if(!valid[i]||Math.abs(n0[0]*(p[i*3]-origin[0])+n0[1]*(p[i*3+1]-origin[1])+n0[2]*(p[i*3+2]-origin[2]))>1e-7*p[i*3+2]){planar=false;break;}
    if(normals[i*3]*n0[0]+normals[i*3+1]*n0[1]+normals[i*3+2]*n0[2]<1-1e-12){planar=false;break;}
    if(i%w<w-1&&!(links[i]&(1<<4))||Math.floor(i/w)<h-1&&!(links[i]&(1<<6)))planar=false;
  }
  const data={links,planar,...workspace};
  entries.set(edge,data);return data;
}
export function wrapSurface(grid,sticker,aspect,physicalWidth=null){
  const started=performance.now();
  const frame=flatSurface(grid,sticker,aspect,physicalWidth,true);if(!frame)return null;
  const {width:w,height:h,points:p}=grid,count=w*h,{links,normals,offsets,dist,basis,heap,positions}=surfaceTopology(grid,sticker.edge);
  const xy=new Float64Array(count*2),reached=new Uint8Array(count),region=new Uint8Array(count);
  const frameAt=performance.now();
  dist.fill(Infinity);positions.fill(-1);
  const a=frame.cell,radius=.5*Math.hypot(frame.w,frame.h)*1.25;
  const {n,e1,e2,p0}=frame;
  xy[a*2]=e1[0]*(p[a*3]-p0[0])+e1[1]*(p[a*3+1]-p0[1])+e1[2]*(p[a*3+2]-p0[2]);
  xy[a*2+1]=e2[0]*(p[a*3]-p0[0])+e2[1]*(p[a*3+1]-p0[1])+e2[2]*(p[a*3+2]-p0[2]);
  let size=0;
  const less=(i,j)=>dist[i]<dist[j]||(dist[i]===dist[j]&&i<j);
  function up(id){
    let i=positions[id];if(i<0){i=size++;heap[i]=id;positions[id]=i;}
    while(i){const parent=(i-1)>>1,q=heap[parent];if(!less(id,q))break;heap[i]=q;positions[q]=i;i=parent;}
    heap[i]=id;positions[id]=i;
  }
  function pop(){
    const result=heap[0],last=heap[--size];positions[result]=-1;
    if(size){let i=0;while(i*2+1<size){let c=i*2+1;if(c+1<size&&less(heap[c+1],heap[c]))c++;if(!less(heap[c],last))break;heap[i]=heap[c];positions[heap[i]]=i;i=c;}heap[i]=last;positions[last]=i;}
    return result;
  }
  function localBasis(q){
    const k=q*3,b=q*6;let nx=normals[k],ny=normals[k+1],nz=normals[k+2];
    if(q===a||!(nx||ny||nz)){nx=n[0];ny=n[1];nz=n[2];}
    const cosine=nx*n[0]+ny*n[1]+nz*n[2];if(cosine<0)return false;
    const kx=n[1]*nz-n[2]*ny,ky=n[2]*nx-n[0]*nz,kz=n[0]*ny-n[1]*nx,den=1+cosine;
    for(let axis=0;axis<2;axis++){
      const v=axis?e2:e1,cx=ky*v[2]-kz*v[1],cy=kz*v[0]-kx*v[2],cz=kx*v[1]-ky*v[0],i=b+axis*3;
      basis[i]=v[0]+cx+(ky*cz-kz*cy)/den;basis[i+1]=v[1]+cy+(kz*cx-kx*cz)/den;basis[i+2]=v[2]+cz+(kx*cy-ky*cx)/den;
    }
    return true;
  }
  dist[a]=0;up(a);
  const walkAt=performance.now();
  let xmin=w,ymin=h,xmax=0,ymax=0;
  while(size){
    const q=pop(),d=dist[q];if(d>radius)break;
    if(!localBasis(q))continue;
    const kq=q*3,bits=links[q];
    if(q!==a){
      let sx=0,sy=0,weightSum=0;
      for(let k=0;k<8;k++)if(bits&(1<<k)){
        const i=q+offsets[k];if(!reached[i])continue;
        const kp=i*3,b=i*6,dx=p[kq]-p[kp],dy=p[kq+1]-p[kp+1],dz=p[kq+2]-p[kp+2],weight=1/Math.max(Math.sqrt(dx*dx+dy*dy+dz*dz),1e-12);
        sx+=(xy[i*2]+basis[b]*dx+basis[b+1]*dy+basis[b+2]*dz)*weight;
        sy+=(xy[i*2+1]+basis[b+3]*dx+basis[b+4]*dy+basis[b+5]*dz)*weight;weightSum+=weight;
      }
      if(!weightSum)continue;xy[q*2]=sx/weightSum;xy[q*2+1]=sy/weightSum;
    }
    reached[q]=1;
    if(Math.abs(xy[q*2])<=frame.w/2&&Math.abs(xy[q*2+1])<=frame.h/2)region[q]=1;
    const x=q%w,y=Math.floor(q/w);xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);
    for(let k=0;k<8;k++)if(bits&(1<<k)){
      const j=q+offsets[k];if(reached[j])continue;
      const b=j*3,dx=p[b]-p[kq],dy=p[b+1]-p[kq+1],dz=p[b+2]-p[kq+2],c=d+Math.sqrt(dx*dx+dy*dy+dz*dz);
      if(c<dist[j]&&c<=radius){dist[j]=c;up(j);}
    }
  }
  const packAt=performance.now();
  const fieldW=xmax-xmin+1,fieldH=ymax-ymin+1,field=new Float32Array(fieldW*fieldH*4);
  for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){
    const i=y*w+x,j=((y-ymin)*fieldW+x-xmin)*4;if(!reached[i])continue;
    field[j]=xy[i*2];field[j+1]=xy[i*2+1];field[j+2]=p[i*3+2];field[j+3]=1;
  }
  return {...frame,timings:{frame:frameAt-started,setup:walkAt-frameAt,walk:packAt-walkAt,pack:performance.now()-packAt},xy,reached,region,field,fieldRect:[xmin,ymin,fieldW,fieldH],gridSize:[w,h],bounds:[Math.max(0,(xmin-.5)/w),Math.max(0,(ymin-.5)/h),Math.min(1,(xmax+1.5)/w),Math.min(1,(ymax+1.5)/h)]};
}
export function halfGrid(grid){
  const width=Math.ceil(grid.width/2),height=Math.ceil(grid.height/2),count=width*height,points=new Float32Array(count*3),normals=new Float32Array(count*3),valid=new Uint8Array(count);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const xx=Math.min(grid.width-1,Math.floor((x+.5)*grid.width/width)),yy=Math.min(grid.height-1,Math.floor((y+.5)*grid.height/height)),i=y*width+x,j=yy*grid.width+xx;
    points.set(grid.points.subarray(j*3,j*3+3),i*3);normals.set(grid.normals.subarray(j*3,j*3+3),i*3);valid[i]=grid.valid[j];
  }
  return {width,height,points,normals,valid,intrinsics:grid.intrinsics};
}

export function depthSpread(grid){
  const {width:w,height:h,points:p,valid}=grid,spread=new Float32Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x;if(!valid[i])continue;
    let lo=p[i*3+2],hi=lo;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const j=Math.max(0,Math.min(h-1,y+dy))*w+Math.max(0,Math.min(w-1,x+dx));
      if(valid[j]){lo=Math.min(lo,p[j*3+2]);hi=Math.max(hi,p[j*3+2]);}
    }
    spread[i]=(hi-lo)/p[i*3+2];
  }
  return spread;
}

export function interactiveSurface(grid,sticker,aspect,physicalWidth=null){
  if(sticker.mode!=="wrap")return flatSurface(grid,sticker,aspect,physicalWidth);
  if(!surfaceTopology(grid,sticker.edge).planar)return wrapSurface(grid,sticker,aspect,physicalWidth);
  // On one connected plane the exponential map is exactly the plane projection.
  // The Wrap shading region is the intrinsic rectangle, not the Flat bounding box.
  const frame=flatSurface(grid,sticker,aspect,physicalWidth);if(!frame)return null;
  for(let i=0;i<frame.region.length;i++)if(frame.region[i]){
    const k=i*3,dx=grid.points[k]-frame.p0[0],dy=grid.points[k+1]-frame.p0[1],dz=grid.points[k+2]-frame.p0[2];
    if(Math.abs(dx*frame.e1[0]+dy*frame.e1[1]+dz*frame.e1[2])>frame.w/2||Math.abs(dx*frame.e2[0]+dy*frame.e2[1]+dz*frame.e2[2])>frame.h/2)frame.region[i]=0;
  }
  frame.planeShortcut=true;return frame;
}
