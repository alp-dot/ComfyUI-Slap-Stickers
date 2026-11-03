<script setup>
import {upgradeState} from '../state.js';
const props=defineProps({session:{type:Object,required:true}});
let editing=null;
function preview(event){
  editing??=props.session.model.state;
  props.session.replaceState({...upgradeState(props.session.model.state),blend:Number(event.target.value)});
  void props.session.update().catch(props.session.error);
}
function commit(){const previous=editing;editing=null;if(previous&&(previous.blend??1)!==props.session.model.state.blend)props.session.save();}
function cancel(){const previous=editing;editing=null;if(previous){props.session.replaceState(previous);void props.session.update().catch(props.session.error);}}
</script>
<template>
  <label class="ss-blend"><span>Blend</span><input class="ss-opacity-slider" type="range" min="0" max="1" step="0.01" aria-label="Blend" :value="session.model.state.blend??1" :disabled="session.model.phase!=='ready'||session.model.dragging" @input="preview" @change="commit" @blur="commit" @pointercancel="cancel" @keydown.esc.stop.prevent="cancel" /></label>
</template>
