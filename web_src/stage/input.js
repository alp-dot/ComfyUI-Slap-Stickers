import { fitRect } from "./renderer.js";
import { dot, inverse3 } from "../surface.js";
import {stickerUV,displayFrame} from "./live.js";
import { selectionControls } from "./selection.js";
import { serializeState, normalizeValue, normalizeRotation } from "../state.js";

export function bindStage(canvas,session) {
  let drag=null,previewFrame=0,queuedPreview=null;
  const cleanups=[];
  function on(target,event,fn,options){target.addEventListener(event,fn,options);cleanups.push(()=>target.removeEventListener(event,fn,options));}
  function position(event){
    if(!session.entry)return null;
    const r=canvas.getBoundingClientRect(),box=fitRect(canvas,session.entry.meta);
    return [((event.clientX-r.left)*canvas.width/r.width-box.left)/box.width,((event.clientY-r.top)*canvas.height/r.height-box.top)/box.height];
  }
  function pick(uv){
    for(const st of [...session.model.state.stickers].reverse()){
      const f=session.frames.get(st.id);if(!st.visible||!f||st.opacity<=0)continue;
      const hit=stickerUV(f,st,uv,session.entry.grid.intrinsics);
      if(hit&&hit.every(v=>v>=0&&v<=1))return st;
    }
    return null;
  }
  function clearCapture(){
    cancelAnimationFrame(previewFrame);previewFrame=0;queuedPreview=null;
    const old=drag;drag=null;session.endPreview();session.model.dragging=false;session.model.invalid=false;canvas.style.cursor="";
    if(old&&canvas.hasPointerCapture(old.pointer))canvas.releasePointerCapture(old.pointer);
    session.notify();return old;
  }
  function cancel(){
    const old=clearCapture();if(!old)return false;
    session.replaceState(old.snapshot);void session.update().catch(session.error);return true;
  }
  function preview(changes,physical=null){
    queuedPreview={id:drag.id,changes,physical};
    if(!previewFrame)previewFrame=requestAnimationFrame(()=>{
      previewFrame=0;const latest=queuedPreview;queuedPreview=null;
      if(drag&&latest)void session.previewSticker(latest.id,latest.changes,latest.physical).catch(session.error);
    });
  }
  function controlAt(event){
    const st=session.model.state.stickers.find(s=>s.id===session.model.selected),frame=st&&session.frames.get(st.id);
    if(!st||st.locked||!st.visible||!frame)return null;
    const rect=canvas.getBoundingClientRect(),ratio=canvas.width/rect.width;
    const controls=selectionControls(fitRect(canvas,session.entry.meta),displayFrame(frame,st,session.entry.grid.intrinsics),ratio);
    if(!controls)return null;
    const p=[(event.clientX-rect.left)*ratio,(event.clientY-rect.top)*canvas.height/rect.height];
    if(Math.hypot(...p.map((v,i)=>v-controls.rotate[i]))<11*ratio)return {st,frame,type:'rotate'};
    if(controls.corners.some(c=>Math.hypot(...p.map((v,i)=>v-c[i]))<10*ratio))return {st,frame,type:'resize'};
    return null;
  }
  function planePosition(uv,frame){
    const ray=inverse3(session.entry.grid.intrinsics).map(row=>dot(row,[...uv,1])),denominator=dot(frame.n,ray);
    if(Math.abs(denominator)<1e-12)return null;
    const t=dot(frame.n,frame.p0)/denominator;if(t<=0)return null;
    const d=ray.map((v,i)=>v*t-frame.p0[i]);
    return [dot(d,frame.e1),dot(d,frame.e2)];
  }
  function controlPosition(uv,frame,st){
    const point=stickerUV(frame,st,uv,session.entry.grid.intrinsics);
    if(point)return [(point[0]-.5)*frame.w,(point[1]-.5)*frame.h];
    const p=planePosition(uv,frame);if(!p)return null;
    const [ox,oy]=frame.offset??[0,0],co=Math.cos(frame.turn??0),si=Math.sin(frame.turn??0),x=p[0]-ox,y=p[1]-oy,pivot=frame.pivot??[.5,.5];
    return [x*co+y*si+(pivot[0]-.5)*frame.w,-x*si+y*co+(pivot[1]-.5)*frame.h];
  }
  on(canvas,"pointerdown",event=>{
    if(event.button!==0||!session.entry)return;
    canvas.focus({preventScroll:true});
    const uv=position(event),control=controlAt(event),st=control?.st??pick(uv);
    session.select(st?.id??null,event.shiftKey);
    if(!st)return;
    event.preventDefault();event.stopPropagation();
    if(event.shiftKey)return;
    if(!st||st.locked)return;
    const frame=session.frames.get(st.id),plane=controlPosition(uv,frame,st);
    drag={id:st.id,pointer:event.pointerId,type:control?.type??'move',frame,size:st.size,rotation:st.rotation,
      startAngle:plane?Math.atan2(plane[1],plane[0]):0,center:frame.guide?.center??st.anchor,st,grip:stickerUV(frame,st,uv,session.entry.grid.intrinsics),start:uv,width:frame.w,
      snapshot:session.model.state,before:serializeState(session.model.state)};
    session.beginPreview();
    session.model.dragging=true;canvas.setPointerCapture(event.pointerId);canvas.style.cursor=drag.type==='move'?'grabbing':drag.type==='resize'?'nwse-resize':'crosshair';
  });
  on(canvas,"pointermove",event=>{
    if(!drag){const control=session.entry&&controlAt(event);canvas.style.cursor=control?.type==='resize'?'nwse-resize':control?'crosshair':'';return;}
    if(event.pointerId!==drag.pointer)return;
    const uv=position(event);
    if(drag.type==='move'){
      if(uv.every((v,i)=>Math.abs(v-drag.start[i])<1e-12))return;
      const anchor=uv;
      session.model.invalid=!session.validAnchor(anchor);canvas.style.cursor=session.model.invalid?'not-allowed':'grabbing';
      if(!session.model.invalid)preview({anchor,pivot:drag.grip,size:drag.size});
    }else{
      const p=controlPosition(uv,drag.frame,drag.st);if(!p)return;
      if(drag.type==='resize'){
        const scale=Math.max(2*Math.abs(p[0])/drag.frame.w,2*Math.abs(p[1])/drag.frame.h);
        const size=normalizeValue('size',drag.size*scale),factor=size/drag.size;
        preview({anchor:drag.center,pivot:[.5,.5],size},{id:drag.id,width:drag.width*factor});
      }else{
        let rotation=drag.rotation+(Math.atan2(p[1],p[0])-drag.startAngle)*180/Math.PI;
        if(event.shiftKey)rotation=Math.round(rotation/15)*15;
        preview({anchor:drag.center,pivot:[.5,.5],rotation:normalizeRotation(rotation)},{id:drag.id,width:drag.width});
      }
    }
    session.notify();event.stopPropagation();
  });
  on(canvas,"pointerup",event=>{
    if(!drag||event.pointerId!==drag.pointer)return;
    const old=clearCapture();event.stopPropagation();
    if(serializeState(session.model.state)!==old.before)session.save();
  });
  on(canvas,"pointercancel",cancel);on(canvas,"lostpointercapture",()=>{if(drag)cancel();});on(window,"blur",cancel);
  on(canvas,"keydown",event=>{
    if(event.key!=="Escape")return;
    if(cancel()){event.preventDefault();event.stopPropagation();}
  });
  const hasImage=event=>[...(event.dataTransfer?.items??[])].some(item=>item.kind==="file"&&item.type.startsWith("image/"));
  const hasUrl=event=>[...(event.dataTransfer?.types??[])].some(type=>['text/uri-list','text/html'].includes(type));
  on(canvas,"dragover",event=>{
    if(!hasImage(event)&&!hasUrl(event))return;
    event.preventDefault();event.stopImmediatePropagation();
    event.dataTransfer.dropEffect=session.entry&&session.validAnchor(position(event))?"copy":"none";
    if(session.entry)session.previewDrop(position(event));
  },true);
  on(canvas,'dragleave',()=>session.clearDrop());
  on(canvas,"drop",event=>{
    const files=[...(event.dataTransfer?.files??[])].filter(file=>file.type.startsWith("image/"));
    if(!files.length&&!hasUrl(event))return;
    event.preventDefault();event.stopImmediatePropagation();
    const anchor=position(event)??[.5,.5];session.clearDrop();
    const html=event.dataTransfer?.getData('text/html'),uri=event.dataTransfer?.getData('text/uri-list');
    const url=html?new DOMParser().parseFromString(html,'text/html').querySelector('img')?.getAttribute('src'):null;
    void (async()=>{if(files.length){for(const file of files)await session.addFile(file,anchor);}else{const value=url??uri?.split('\n').find(line=>line.trim()&&!line.startsWith('#'));if(value)await session.addUrl(value.trim(),anchor);}})().catch(session.error);
  },true);
  return ()=>{cancel();for(const cleanup of cleanups)cleanup();};
}
