<script setup>
import {computed,nextTick,ref,watch} from 'vue';
const props=defineProps({session:Object});
const strip=ref(null),buttons=new Map();
const ids=computed(()=>props.session.model.selection.length?props.session.model.selection:props.session.model.selected?[props.session.model.selected]:[]);
watch(()=>props.session.model.selected,async id=>{
  await nextTick();const button=buttons.get(id),element=strip.value;if(!button||!element)return;
  const left=button.offsetLeft,right=left+button.offsetWidth;
  if(left<element.scrollLeft)element.scrollLeft=left;
  else if(right>element.scrollLeft+element.clientWidth)element.scrollLeft=right-element.clientWidth;
});
</script>
<template>
  <div ref="strip" class="ss-thumbnails" role="list" aria-label="Stickers">
    <span v-for="st in session.model.state.stickers" :key="st.id" role="listitem">
      <button :ref="element=>element?buttons.set(st.id,element):buttons.delete(st.id)" type="button" class="ss-thumbnail" :class="{'ss-thumbnail-hidden':!st.visible}" :aria-label="st.name" :aria-pressed="ids.includes(st.id)" :title="st.name" @click.stop="session.select(st.id,$event.shiftKey)">
        <img v-if="session.model.thumbnails[st.id]" :src="session.model.thumbnails[st.id]" alt="" draggable="false" />
        <span v-else aria-hidden="true">!</span>
      </button>
    </span>
  </div>
</template>
