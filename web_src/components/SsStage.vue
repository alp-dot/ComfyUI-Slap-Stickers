<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { renderStage } from "../stage/renderer.js";
import { bindStage } from "../stage/input.js";
const props=defineProps({session:{type:Object,required:true}});
const canvas=ref(null),host=ref(null);
let observer,transforms,intersection,unbind,unsubscribe,scheduled=0,visible=true;
let ancestors=[],displayWidth=0,displayHeight=0;
function observeTransforms(){
  const next=[];for(let e=host.value;e;e=e.parentElement)next.push(e);
  if(next.length===ancestors.length&&next.every((e,i)=>e===ancestors[i]))return;
  transforms.disconnect();ancestors=next;
  for(const e of ancestors)transforms.observe(e,{attributes:true,attributeFilter:['style','class'],childList:true});
}
function draw(){
  scheduled=0;
  if(!visible)return;
  const drawStart=performance.now(),element=canvas.value,rect=host.value.getBoundingClientRect();
  if(rect.width<=0||rect.height<=0)return;
  observeTransforms();displayWidth=rect.width;displayHeight=rect.height;
  const ratio=window.devicePixelRatio||1;
  const width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);
  if(element.width!==width||element.height!==height){element.width=width;element.height=height;}
  props.session.setViewport(width,height);
  if(!props.session.entry)return;
  try{renderStage(element,props.session.entry,props.session.model.state.stickers,props.session.frames,props.session.sources,props.session.model.selection.length>1?props.session.model.selection:props.session.model.selected,props.session.model.dragging,props.session.model.dropFrame);element.dataset.selectionReady=String(props.session.frames.has(props.session.model.selected));
    const selected=props.session.model.state.stickers.find(s=>s.id===props.session.model.selected);
    element.dataset.renderedAnchor=selected?.anchor.join(",")??"";element.dataset.renderedAt=String(performance.now());element.dataset.renderDuration=String(performance.now()-drawStart);}
  catch(e){props.session.error(e);}
}
function request(){if(!scheduled&&visible)scheduled=requestAnimationFrame(draw);}
onMounted(()=>{
  unbind=bindStage(canvas.value,props.session);unsubscribe=props.session.subscribe(request);
  // CSS transforms do not trigger ResizeObserver. Redraw only when the on-screen
  // size changes; moving a node or opening a tooltip needs no new bitmap.
  transforms=new MutationObserver(()=>{
    observeTransforms();if(!visible)return;
    const r=host.value.getBoundingClientRect();
    if(r.width!==displayWidth||r.height!==displayHeight)request();
  });observeTransforms();
  window.addEventListener('resize',request);
  observer=new ResizeObserver(request);observer.observe(host.value);
  intersection=new IntersectionObserver(entries=>{
    // Reattachment can batch hidden and visible notifications for the same stage.
    visible=entries[entries.length-1].isIntersecting;if(visible)request();
  });intersection.observe(host.value);
  request();
});
onBeforeUnmount(()=>{unbind?.();unsubscribe?.();observer?.disconnect();transforms?.disconnect();intersection?.disconnect();window.removeEventListener('resize',request);cancelAnimationFrame(scheduled);});
</script>
<template>
  <div ref="host" class="ss-stage" :class="{'ss-drop-active':session.model.dropActive}">
    <canvas ref="canvas" class="ss-canvas" tabindex="0" data-testid="surface-stage" aria-label="Image surface. Drop an image to add a sticker, then drag it to move it." />
    <div v-if="session.model.missing.length" class="ss-recovery" role="status">
      <span>Unavailable images: {{session.model.missing.map(item=>item.name).join(', ')}}</span>
      <button type="button" class="ss-button" @click.stop="session.removeUnavailable">Remove unavailable images</button>
    </div>
    <span v-if="session.model.phase==='ready'&&!session.model.state.stickers.length&&!session.model.message" class="ss-empty">Drop an image or press Add</span>
    <span v-if="session.model.message" class="ss-empty" role="status">{{session.model.message}}</span>
  </div>
</template>
