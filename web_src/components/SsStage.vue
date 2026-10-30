<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { renderStage } from "../stage/renderer.js";
import { bindStage } from "../stage/input.js";
const props=defineProps({session:{type:Object,required:true}});
const canvas=ref(null),host=ref(null);
let observer,intersection,unbind,unsubscribe,scheduled=0,visible=true;
function draw(){
  scheduled=0;
  if(!visible)return;
  const drawStart=performance.now(),element=canvas.value,rect=host.value.getBoundingClientRect();
  if(rect.width<=0||rect.height<=0)return;
  const ratio=window.devicePixelRatio||1;
  const width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);
  if(element.width!==width||element.height!==height){element.width=width;element.height=height;}
  props.session.setViewport(width,height);
  if(!props.session.entry)return;
  try{renderStage(element,props.session.entry,props.session.model.state.stickers,props.session.frames,props.session.sources,props.session.model.selected,props.session.model.dragging);element.dataset.selectionReady=String(props.session.frames.has(props.session.model.selected));
    const selected=props.session.model.state.stickers.find(s=>s.id===props.session.model.selected);
    element.dataset.renderedAnchor=selected?.anchor.join(",")??"";element.dataset.renderedAt=String(performance.now());element.dataset.renderDuration=String(performance.now()-drawStart);}
  catch(e){props.session.error(e);}
}
function request(){if(!scheduled&&visible)scheduled=requestAnimationFrame(draw);}
onMounted(()=>{
  unbind=bindStage(canvas.value,props.session);unsubscribe=props.session.subscribe(request);
  observer=new ResizeObserver(request);observer.observe(host.value);
  intersection=new IntersectionObserver(entries=>{
    // Reattachment can batch hidden and visible notifications for the same stage.
    visible=entries[entries.length-1].isIntersecting;if(visible)request();
  });intersection.observe(host.value);
  request();
});
onBeforeUnmount(()=>{unbind?.();unsubscribe?.();observer?.disconnect();intersection?.disconnect();cancelAnimationFrame(scheduled);});
</script>
<template>
  <div ref="host" class="ss-stage">
    <canvas ref="canvas" class="ss-canvas" tabindex="0" data-testid="surface-stage" aria-label="Image surface. Drop an image to add a sticker, then drag it to move it." />
    <div v-if="session.model.missing.length" class="ss-recovery" role="status">
      <span>Unavailable images: {{session.model.missing.map(item=>item.name).join(', ')}}</span>
      <button type="button" class="ss-button" @click.stop="session.removeUnavailable">Remove unavailable images</button>
    </div>
    <span v-if="session.model.phase==='ready'&&!session.model.state.stickers.length&&!session.model.message" class="ss-empty">Drop an image or press Add</span>
    <span v-if="session.model.message" class="ss-empty" role="status">{{session.model.message}}</span>
  </div>
</template>
