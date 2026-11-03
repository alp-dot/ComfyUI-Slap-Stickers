// Sliding within a solved intrinsic chart preserves its full-resolution curvature.
import {savedFrame} from './placement.js';
export function sampleChart(frame,uv){
  const [gw,gh]=frame.gridSize,[left,top,width,height]=frame.fieldRect,f=frame.field;
  const x=uv[0]*gw-.5-left,y=uv[1]*gh-.5-top,ix=Math.floor(x),iy=Math.floor(y),sum=[0,0,0];
  if(ix<0||iy<0||ix+1>=width||iy+1>=height)return null;
  for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
    const i=((iy+dy)*width+ix+dx)*4;if(!f[i+3])return null;
    const weight=(dx?x-ix:1-x+ix)*(dy?y-iy:1-y+iy);
    for(let c=0;c<3;c++)sum[c]+=f[i+c]*weight;
  }
  return sum;
}
export function relocateChart(chart,grid,sticker,aspect,physicalWidth){
  const saved=savedFrame(grid,sticker,aspect);
  const sample=sampleChart(chart,sticker.anchor);if(!sample)return null;
  const index=Math.min(grid.height-1,Math.floor(sticker.anchor[1]*grid.height))*grid.width+Math.min(grid.width-1,Math.floor(sticker.anchor[0]*grid.width));
  if(!grid.valid[index]||Math.abs(grid.points[index*3+2]-sample[2])>sticker.edge*sample[2])return null;
  const width=physicalWidth??saved?.w??sticker.size*sample[2]/grid.intrinsics[0][0],height=saved&&physicalWidth==null?saved.h:width/aspect,pivot=sticker.pivot??[.5,.5],offset=saved?.shift??sample.slice(0,2);
  const turn=saved?.turn??(sticker.rotation-chart.baseRotation)*Math.PI/180,c=Math.cos(turn),s=Math.sin(turn);
  const radius=Math.max(...[[0,0],[1,0],[1,1],[0,1]].map(([u,v])=>{
    const x=(u-pivot[0])*width,y=(v-pivot[1])*height;return Math.hypot(offset[0]+x*c-y*s,offset[1]+x*s+y*c);
  }));
  if(radius+(chart.blurPad??0)>chart.reach*.94)return null;
  const region=new Uint8Array(grid.width*grid.height);
  const [left,top,fw,fh]=chart.fieldRect,f=chart.field;let xmin=grid.width,ymin=grid.height,xmax=0,ymax=0;
  for(let y=0;y<fh;y++)for(let x=0;x<fw;x++){
    const i=(y*fw+x)*4;if(!f[i+3])continue;
    const dx=f[i]-offset[0],dy=f[i+1]-offset[1],u=(dx*c+dy*s)/width+pivot[0],v=(-dx*s+dy*c)/height+pivot[1];
    if(u>=0&&u<=1&&v>=0&&v<=1){region[(y+top)*grid.width+x+left]=1;xmin=Math.min(xmin,x+left);xmax=Math.max(xmax,x+left);ymin=Math.min(ymin,y+top);ymax=Math.max(ymax,y+top);}
  }
  if(xmin>xmax||ymin>ymax)return null;
  return {...chart,timings:{reused:true},w:width,h:height,pivot,offset,turn,gripDepth:sample[2],region,
    bounds:[Math.max(0,(xmin-2)/grid.width),Math.max(0,(ymin-2)/grid.height),Math.min(1,(xmax+3)/grid.width),Math.min(1,(ymax+3)/grid.height)]};
}
