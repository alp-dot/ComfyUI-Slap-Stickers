<script setup>
import {computed,nextTick,onBeforeUnmount,ref} from 'vue';
import SsIconButton from './SsIconButton.vue';
const props=defineProps({session:{type:Object,required:true},sticker:Object});
const root=ref(null),slider=ref(null),open=ref(false);
const disabled=computed(()=>!props.sticker||props.sticker.locked||props.session.model.phase!=='ready'||props.session.model.dragging);
let editing=null;
function preview(event){
  if(disabled.value)return;
  editing??={id:props.sticker.id,opacity:props.sticker.opacity};
  props.session.setSticker(editing.id,{opacity:Number(event.target.value)/100});
}
function commit(){
  const previous=editing;editing=null;if(!previous)return;
  const current=props.session.model.state.stickers.find(s=>s.id===previous.id);
  if(current&&current.opacity!==previous.opacity)props.session.save();
}
function close(){commit();open.value=false;}
function cancel(){
  const previous=editing;editing=null;
  if(previous&&props.session.model.state.stickers.some(s=>s.id===previous.id))props.session.setSticker(previous.id,{opacity:previous.opacity});
  open.value=false;
}
async function toggle(){
  if(open.value){close();return;}
  open.value=true;await nextTick();slider.value?.focus({preventScroll:true});
}
function outside(event){if(open.value&&!root.value?.contains(event.target))close();}
document.addEventListener('pointerdown',outside,true);
onBeforeUnmount(()=>document.removeEventListener('pointerdown',outside,true));
</script>
<template>
  <div ref="root" class="ss-opacity-control">
    <SsIconButton icon="opacity" label="Opacity" :disabled="disabled" :aria-expanded="open" @click="toggle" />
    <div v-if="open&&!disabled" class="ss-opacity-popover" role="group" aria-label="Sticker opacity" @keydown.esc.stop.prevent="cancel">
      <label class="ss-opacity-label">Opacity
        <input ref="slider" class="ss-opacity-slider" type="range" min="0" max="100" step="1" :value="Math.round(sticker.opacity*100)" :aria-valuetext="Math.round(sticker.opacity*100)+'%'" aria-label="Opacity" @input="preview" @change="commit" @blur="commit" @pointercancel="cancel" />
      </label>
    </div>
  </div>
</template>
