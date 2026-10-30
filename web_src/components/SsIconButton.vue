<script setup>
import {nextTick,onBeforeUnmount,ref} from 'vue';
import SsIcon from './SsIcon.vue';
import {randomId} from '../state.js';
defineOptions({inheritAttrs:false});
defineProps({icon:String,label:String});
const control=ref(null),tip=ref(null),shown=ref(false),position=ref({left:'-9999px',top:'0px'}),id='ss-tip-'+randomId();
function hide(){shown.value=false;}
async function show(){
  shown.value=true;await nextTick();
  if(!shown.value||!control.value||!tip.value)return;
  const r=control.value.getBoundingClientRect(),t=tip.value.getBoundingClientRect();
  const left=Math.max(8,Math.min(window.innerWidth-t.width-8,r.left+(r.width-t.width)/2));
  position.value={left:left+'px',top:(r.top>t.height+12?r.top-t.height-8:r.bottom+8)+'px'};
}
function focus(event){if(event.target.matches(':focus-visible'))void show();}
// A scroll/zoom must not leave a detached label hovering over another node.
window.addEventListener('scroll',hide,true);
onBeforeUnmount(()=>window.removeEventListener('scroll',hide,true));
</script>
<template>
  <span ref="control" class="ss-icon-control" @pointerenter="show" @pointerleave="hide">
    <button type="button" class="ss-icon-button" v-bind="$attrs" :aria-label="label" :aria-describedby="shown?id:undefined" @focus="focus" @blur="hide" @pointerdown="hide" @keydown.esc="hide"><SsIcon :name="icon" /></button>
    <Teleport to="body"><span v-if="shown" :id="id" ref="tip" role="tooltip" class="ss-tooltip" :style="position">{{label}}</span></Teleport>
  </span>
</template>
