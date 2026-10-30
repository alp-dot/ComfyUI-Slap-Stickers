<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import SsSurface from '../web_src/components/SsSurface.vue';
import { createSession } from '../web_src/session.js';
import { serializeState } from '../web_src/state.js';
import { execute, models, upload, viewUrl } from './api.js';
const background=ref(null),picker=ref(null),busy=ref(false),message=ref('Connecting to local ComfyUI…'),available=ref([]),model=ref(''),result=ref(null);
const session=createSession({upload,urlFor:viewUrl});
async function connect(){
  try{available.value=await models();model.value=available.value.find(s=>s.includes('moge_3'))??available.value[0]??'';message.value=model.value?'Choose a background image to estimate its surface.':'No MoGe model found in ComfyUI/models/geometry_estimation.';}
  catch{message.value='Cannot connect to local ComfyUI. Start the MoGe server, then retry.';}
}
async function choose(event){
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  busy.value=true;result.value=null;message.value='Uploading background…';
  try{
    const next=await upload(file);
    const output=await execute(next,model.value,'',text=>message.value=text);
    session.setState('');await session.load(output.descriptor);
    if(session.model.phase!=='ready')throw new Error(session.model.message);
    background.value=next;message.value=`${file.name} · MoGe surface ready`;
  }catch(e){message.value=e.message;}finally{busy.value=false;}
}
async function render(){
  if(!background.value)return;busy.value=true;message.value='Rendering composite…';
  try{
    const output=await execute(background.value,model.value,serializeState(session.model.state),text=>message.value=text);
    result.value=output.image?viewUrl(output.image):null;message.value='Composite ready.';
  }catch(e){message.value=e.message;}finally{busy.value=false;}
}
onMounted(connect);onBeforeUnmount(()=>session.dispose());
// Public test seam: same session and API as the real node, with real uploads.
if(import.meta.env.DEV)window.surfaceWorkspace={session};
</script>
<template>
  <div class="ss-workspace">
    <div class="workspace-toolbar">
      <button class="ss-button" :disabled="busy||!model" @click="picker.click()">Choose background</button>
      <select v-model="model" aria-label="MoGe model" :disabled="busy"><option v-for="name in available" :key="name">{{name}}</option></select>
      <button class="ss-button" :disabled="busy||!background" @click="render">Render composite</button>
      <a v-if="result" :href="result" target="_blank" rel="noopener">Open composite</a>
      <button v-if="!model" class="ss-button" @click="connect">Retry connection</button>
    </div>
    <p class="workspace-message" role="status">{{message}}</p>
    <div class="workspace-node" :inert="busy||undefined"><SsSurface :session="session" /></div>
    <input ref="picker" class="ss-file" type="file" accept="image/*" aria-label="Background image" @change="choose" />
    <p class="workspace-caption">Drag to move · Corners to resize · Top handle to rotate. Wrap follows the surface.</p>
  </div>
</template>
