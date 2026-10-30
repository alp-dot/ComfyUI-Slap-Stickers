import {dot,inverse3,projectRectangle} from '../surface.js';
export function liveTransform(frame,sticker){
  const offset=frame.anchor?sticker.anchor.map((v,i)=>v-frame.anchor[i]):[0,0];
  const angle=(sticker.rotation-(frame.rotation??sticker.rotation))*Math.PI/180;
  return {offset,scale:sticker.size/(frame.size??sticker.size),cos:Math.cos(angle),sin:Math.sin(angle)};
}
export function displayFrame(frame,sticker,intrinsics){
  const t=liveTransform(frame,sticker),c=t.cos,s=t.sin;
  const p0=[...frame.p0],e1=frame.e1.map((v,i)=>v*c+frame.e2[i]*s),e2=frame.e2.map((v,i)=>-frame.e1[i]*s+v*c);
  const width=frame.w*t.scale,height=frame.h*t.scale;
  return {...frame,...projectRectangle(p0,e1,e2,width,height,intrinsics,t.offset)};
}
export function stickerUV(frame,sticker,uv,intrinsics){
  const t=liveTransform(frame,sticker),v=uv.map((x,i)=>x-t.offset[i]);let x,y;
  if(frame.field){
    const [gw,gh]=frame.gridSize,[left,top,w,h]=frame.fieldRect,fx=v[0]*gw-.5-left,fy=v[1]*gh-.5-top,ix=Math.floor(fx),iy=Math.floor(fy);let sx=0,sy=0,total=0;
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
      const xx=ix+dx,yy=iy+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;
      const i=(yy*w+xx)*4,weight=(dx?fx-ix:1-fx+ix)*(dy?fy-iy:1-fy+iy)*frame.field[i+3];
      sx+=frame.field[i]*weight;sy+=frame.field[i+1]*weight;total+=weight;
    }
    if(!total)return null;x=sx/total;y=sy/total;
  }else{
    const ray=inverse3(intrinsics).map(row=>dot(row,[...v,1])),d=dot(frame.n,ray),distance=dot(frame.n,frame.p0)/d;if(!(distance>0))return null;
    const q=ray.map((r,i)=>r*distance-frame.p0[i]);x=dot(q,frame.e1);y=dot(q,frame.e2);
    const [gw,gh]=frame.gridSize??[0,0];if(gw&&gh&&!frame.region[Math.min(gh-1,Math.max(0,Math.floor(v[1]*gh)))*gw+Math.min(gw-1,Math.max(0,Math.floor(v[0]*gw)))])return null;
  }
  return [(x*t.cos+y*t.sin)/(frame.w*t.scale)+.5,(-x*t.sin+y*t.cos)/(frame.h*t.scale)+.5];
}
