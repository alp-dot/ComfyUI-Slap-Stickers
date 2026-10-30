<script setup>
import { computed, ref } from 'vue';
import SsStage from './SsStage.vue';
import SsIconButton from './SsIconButton.vue';
import SsOpacity from './SsOpacity.vue';
import {fitRect} from '../stage/renderer.js';
import {stickerId} from '../state.js';
const props=defineProps({session:{type:Object,required:true},canvasWheel:Function});
const file=ref(null),stage=ref(null);
const selected=computed(()=>props.session.model.state.stickers.find(s=>s.id===props.session.model.selected));
const index=computed(()=>props.session.model.state.stickers.findIndex(s=>s.id===props.session.model.selected));
const canEdit=computed(()=>!!selected.value&&props.session.model.phase==='ready'&&!props.session.model.dragging);
function wheel(event){if(props.canvasWheel){event.preventDefault();event.stopPropagation();props.canvasWheel(event);}}
async function choose(event){
  const chosen=event.target.files?.[0];event.target.value='';if(!chosen)return;
  let anchor=[.5,.5];
  if(!props.session.validAnchor(anchor)&&props.session.entry){
    const {grid}=props.session.entry;let nearest=-1,distance=Infinity;
    for(let i=0;i<grid.valid.length;i++)if(grid.valid[i]){const d=(i%grid.width-grid.width/2)**2+(Math.floor(i/grid.width)-grid.height/2)**2;if(d<distance){distance=d;nearest=i;}}
    if(nearest>=0)anchor=[(nearest%grid.width+.5)/grid.width,(Math.floor(nearest/grid.width)+.5)/grid.height];
  }
  try{await props.session.addFile(chosen,anchor);}catch(e){props.session.error(e);}
}
function remove(){
  if(!canEdit.value)return;
  props.session.setState(JSON.stringify({...props.session.model.state,stickers:props.session.model.state.stickers.filter(s=>s.id!==selected.value.id)}));
  props.session.model.selected=null;props.session.save();
}
function duplicate(){
  if(!canEdit.value||!props.session.entry)return;
  const rect=stage.value.$el.getBoundingClientRect(),box=fitRect(rect,props.session.entry.meta);
  let anchor=null;
  const directions=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  for(let distance=20;!anchor&&distance>=20/1024;distance/=2){
    for(const [x,y]of directions){
      const candidate=[selected.value.anchor[0]+x*distance/box.width,selected.value.anchor[1]+y*distance/box.height];
      if(props.session.validAnchor(candidate)){anchor=candidate;break;}
    }
  }
  if(!anchor){props.session.error(new Error('No nearby surface for a copy. Move the sticker onto a larger surface first.'));return;}
  const st={...selected.value,anchor,id:stickerId(),name:selected.value.name+' copy'};
  props.session.setState(JSON.stringify({...props.session.model.state,stickers:[...props.session.model.state.stickers,st]}));
  props.session.model.selected=st.id;props.session.save();
}
async function reorder(front){
  if(!canEdit.value)return;
  const stickers=props.session.model.state.stickers.filter(s=>s.id!==selected.value.id);
  front?stickers.push(selected.value):stickers.unshift(selected.value);
  props.session.replaceState({...props.session.model.state,stickers});await props.session.update();props.session.save();
}
function key(event){
  if(event.target.matches('input,select,textarea')){
    if(event.target.type==='range'&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){
      // Comfy ignores shortcuts whose target is an input, even after bubbling.
      // Return focus to the node and forward this one key through its usual handler.
      event.preventDefault();event.stopPropagation();event.currentTarget.focus({preventScroll:true});
      event.currentTarget.dispatchEvent(new KeyboardEvent('keydown',{key:event.key,code:event.code,ctrlKey:event.ctrlKey,metaKey:event.metaKey,shiftKey:event.shiftKey,altKey:event.altKey,bubbles:true,cancelable:true}));
      return;
    }
    event.stopPropagation();return;
  }
  if(event.key==='Escape'&&!props.session.model.dragging&&props.session.model.selected){
    event.preventDefault();event.stopPropagation();
    props.session.model.selected=null;props.session.notify();
  }
  if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();event.stopPropagation();remove();}
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='d'){event.preventDefault();event.stopPropagation();duplicate();}
}
</script>
<template>
  <section class="ss-surface" tabindex="0" @keydown="key" @pointerdown.stop @wheel="wheel">
    <span class="ss-status" data-testid="surface-status" role="status" :data-sticker-count="session.model.phase==='ready'?session.model.state.stickers.length:null">{{session.model.message}}</span>
    <SsStage ref="stage" :session="session" />
    <div class="ss-action-dock">
      <div class="ss-add-island"><SsIconButton icon="add" label="Add image" :disabled="session.model.phase!=='ready'||session.model.dragging" @click.stop="file.click()" /></div>
      <div class="ss-selection-bar" role="toolbar" aria-label="Selected sticker">
        <SsIconButton icon="duplicate" label="Duplicate" :disabled="!canEdit" @click="duplicate" />
        <SsOpacity :key="selected?.id??'none'" :session="session" :sticker="selected" />
        <span class="ss-separator" />
        <SsIconButton icon="back" label="Send to back" :disabled="!canEdit||index<=0" @click="reorder(false)" />
        <SsIconButton icon="front" label="Bring to front" :disabled="!canEdit||index===session.model.state.stickers.length-1" @click="reorder(true)" />
        <span class="ss-separator" />
        <SsIconButton icon="delete" label="Delete" :disabled="!canEdit" @click="remove" />
      </div>
    </div>
    <input ref="file" class="ss-file" type="file" accept="image/*" @click.stop @change.stop="choose" />
  </section>
</template>
