// Local ComfyUI only, through Vite's same-origin proxy (one SSH forward).
import {surfaceDescriptor} from '../web_src/media.js';
export const viewUrl=file=>`/comfy/view?${new URLSearchParams(file)}`;
async function json(path,options){
  const response=await fetch(`/comfy${path}`,options);
  if(!response.ok){let detail;try{detail=await response.json();}catch{}throw new Error(detail?.error?.message??`ComfyUI request failed (${response.status}).`);}
  return response.json();
}
export async function upload(file){
  const body=new FormData();body.append('image',file);body.append('type','input');body.append('subfolder','slap_stickers');
  return json('/upload/image',{method:'POST',body});
}
export async function models(){
  const info=await json('/object_info/LoadMoGeModel');
  const field=info.LoadMoGeModel?.input?.required?.model_name;
  return Array.isArray(field?.[0])?field[0]:(field?.[1]?.options??[]);
}
export function graph(background,model,state=''){
  const image=background.subfolder?`${background.subfolder}/${background.name}`:background.name;
  return {
    '1':{class_type:'LoadImage',inputs:{image}},
    '2':{class_type:'LoadMoGeModel',inputs:{model_name:model}},
    '3':{class_type:'MoGeInference',inputs:{moge_model:['2',0],image:['1',0],resolution_level:9,fov_x_degrees:0,batch_size:1,force_projection:true,apply_mask:true,refine_steps:3}},
    '4':{class_type:'SurfaceStickers',inputs:{geometry:['3',0],image:['1',0],state_json:state}},
    '5':{class_type:'PreviewImage',inputs:{images:['4',0]}}
  };
}
export async function execute(background,model,state,onProgress=()=>{}){
  const result=await json('/prompt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:graph(background,model,state)})});
  const started=Date.now();
  while(Date.now()-started<10*60*1000){
    const history=await json(`/history/${result.prompt_id}`),item=history[result.prompt_id];
    if(item){
      if(item.status?.status_str==='error'){
        const detail=item.status.messages?.find(([type])=>type==='execution_error')?.[1];
        throw new Error(detail?.exception_message??'MoGe execution failed. Check the ComfyUI log.');
      }
      if(item.status?.completed){
        const descriptor=surfaceDescriptor(item.outputs?.['4']);
        if(!descriptor)throw new Error('ComfyUI returned no surface.');
        return {descriptor,image:item.outputs?.['5']?.images?.[0]};
      }
    }
    onProgress(`MoGe · ${Math.floor((Date.now()-started)/1000)}s`);
    await new Promise(resolve=>setTimeout(resolve,700));
  }
  throw new Error('MoGe is taking too long. Check the ComfyUI queue.');
}
