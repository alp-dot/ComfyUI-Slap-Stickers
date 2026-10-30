import { fitRect } from "./renderer.js";
import { dot, inverse3 } from "../surface.js";
import {stickerUV,displayFrame} from "./live.js";
import { selectionControls } from "./selection.js";
import { serializeState, normalizeValue, normalizeRotation } from "../state.js";

export function bindStage(canvas,session) {
  let drag=null;
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
    const old=drag;drag=null;session.model.dragging=false;session.model.invalid=false;canvas.style.cursor="";
    if(old&&canvas.hasPointerCapture(old.pointer))canvas.releasePointerCapture(old.pointer);
    session.notify();return old;
  }
  function cancel(){
    const old=clearCapture();if(!old)return false;
    session.replaceState(old.snapshot);void session.update().catch(session.error);return true;
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
  on(canvas,"pointerdown",event=>{
    if(event.button!==0||!session.entry)return;
    canvas.focus({preventScroll:true});
    const uv=position(event),control=controlAt(event),st=control?.st??pick(uv);
    session.model.selected=st?.id??null;session.notify();
    event.preventDefault();event.stopPropagation();
    if(!st||st.locked)return;
    const frame=session.frames.get(st.id),plane=planePosition(uv,frame);
    drag={id:st.id,pointer:event.pointerId,type:control?.type??'move',frame,size:st.size,rotation:st.rotation,
      startAngle:plane?Math.atan2(plane[1],plane[0]):0,offset:st.anchor.map((v,i)=>v-uv[i]),width:frame.w,
      snapshot:session.model.state,before:serializeState(session.model.state)};
    session.model.dragging=true;canvas.setPointerCapture(event.pointerId);canvas.style.cursor=drag.type==='move'?'grabbing':drag.type==='resize'?'nwse-resize':'crosshair';
  });
  on(canvas,"pointermove",event=>{
    if(!drag){const control=session.entry&&controlAt(event);canvas.style.cursor=control?.type==='resize'?'nwse-resize':control?'crosshair':'';return;}
    if(event.pointerId!==drag.pointer)return;
    const uv=position(event);
    if(drag.type==='move'){
      const anchor=uv.map((v,i)=>v+drag.offset[i]);
      session.model.invalid=!session.validAnchor(anchor);canvas.style.cursor=session.model.invalid?'not-allowed':'grabbing';
      if(!session.model.invalid){session.setSticker(drag.id,{anchor});void session.update({id:drag.id,width:drag.width}).catch(session.error);}
    }else{
      const p=planePosition(uv,drag.frame);if(!p)return;
      if(drag.type==='resize'){
        const scale=Math.max(2*Math.abs(p[0])/drag.frame.w,2*Math.abs(p[1])/drag.frame.h);
        session.setSticker(drag.id,{size:normalizeValue('size',drag.size*scale)});
      }else{
        let rotation=drag.rotation+(Math.atan2(p[1],p[0])-drag.startAngle)*180/Math.PI;
        if(event.shiftKey)rotation=Math.round(rotation/15)*15;
        session.setSticker(drag.id,{rotation:normalizeRotation(rotation)});
      }
      void session.update().catch(session.error);
    }
    session.notify();event.stopPropagation();
  });
  on(canvas,"pointerup",async event=>{
    if(!drag||event.pointerId!==drag.pointer)return;
    const old=clearCapture();event.stopPropagation();
    try{
      await session.update(old.type==='move'?{id:old.id,width:old.width}:null);
      const f=session.frames.get(old.id);
      if(f&&old.type==='move'){
        const size=normalizeValue('size',old.width*session.entry.grid.intrinsics[0][0]/f.p0[2]);
        session.setSticker(old.id,{size});f.size=size;
      }
      if(serializeState(session.model.state)!==old.before)session.save();
    }catch(e){session.error(e);}
  });
  on(canvas,"pointercancel",cancel);on(canvas,"lostpointercapture",()=>{if(drag)cancel();});on(window,"blur",cancel);
  on(canvas,"keydown",event=>{
    if(event.key!=="Escape")return;
    if(cancel()){event.preventDefault();event.stopPropagation();}
  });
  const hasImage=event=>[...(event.dataTransfer?.items??[])].some(item=>item.kind==="file"&&item.type.startsWith("image/"));
  on(canvas,"dragover",event=>{
    if(!hasImage(event))return;
    event.preventDefault();event.stopImmediatePropagation();
    event.dataTransfer.dropEffect=session.entry&&session.validAnchor(position(event))?"copy":"none";
  },true);
  on(canvas,"drop",event=>{
    const files=[...(event.dataTransfer?.files??[])].filter(file=>file.type.startsWith("image/"));
    if(!files.length)return;
    event.preventDefault();event.stopImmediatePropagation();
    const anchor=position(event)??[.5,.5];
    void (async()=>{for(const file of files)await session.addFile(file,anchor);})().catch(session.error);
  },true);
  return ()=>{cancel();for(const cleanup of cleanups)cleanup();};
}
