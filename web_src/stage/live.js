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
  const projected=projectRectangle(p0,e1,e2,width,height,intrinsics,t.offset,frame.pivot);
  if(!frame.guide)return {...frame,...projected};
  const aspect=frame.screenAspect??1,anchor=frame.anchor??sticker.anchor;
  const transform=p=>{
    if(!p)return null;const x=p[0]-anchor[0],y=(p[1]-anchor[1])/aspect;
    return [anchor[0]+t.offset[0]+t.scale*(x*c-y*s),anchor[1]+t.offset[1]+t.scale*(x*s+y*c)*aspect];
  };
  return {...frame,...projected,handles:frame.guide.handles.map(transform),corners:frame.guide.handles.filter(Boolean).map(transform),
    center:transform(frame.guide.center)??projected.center,top:transform(frame.guide.top),bottom:transform(frame.guide.bottom)};
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
  const offset=frame.offset??[0,0],angle=frame.turn??0,c=Math.cos(angle),s=Math.sin(angle),dx=x-offset[0],dy=y-offset[1];
  x=dx*c+dy*s;y=-dx*s+dy*c;
  const pivot=frame.pivot??[.5,.5];
  return [(x*t.cos+y*t.sin)/(frame.w*t.scale)+pivot[0],(-x*t.sin+y*t.cos)/(frame.h*t.scale)+pivot[1]];
}
