import { shallowReactive } from "vue";
import { newSticker, parseState, serializeState, randomId } from "./state.js";
import { acquireSurface, imageFromBlob, viewUrl } from "./media.js";
import { workerCall } from "./worker/client.js";
import { releaseTexture, disposeRenderer } from "./stage/renderer.js";
let sessions = 0;
export function createSession({state="",commit=()=>{},upload,urlFor=viewUrl}={}) {
  let parsed,stateError=null;
  try{parsed=parseState(state);}catch(e){parsed={version:1,stickers:[]};stateError=e;}
  const sourcePrefix=randomId()+":";let viewport=null;
  let disposed=false, lease=null, entry=null, generation=0, sourceGeneration=0, computing=false, pending=null;
  const frameKeys=new Map(),frames=new Map(),sources=new Map(),sourceKeys=new Map(),listeners=new Set();
  const addingSources=new Set();
  let sourceRevisions=new Map();
  const sourceKey=source=>JSON.stringify([source,sourceRevisions.get(JSON.stringify(source))]);
  const model=shallowReactive({state:parsed,phase:stateError?"error":"empty",message:stateError?.message??"Run the workflow once to load the surface",missing:[],selected:null,invalid:false,dragging:false});
  sessions++;
  const notify=()=>{ for(const fn of listeners) fn(); };
  function error(e){ if(!disposed && e.name!=="AbortError" && model.message!==e.message){model.message=e.message;notify();} }
  function replaceState(next){model.state=next;notify();}
  function save(){if(!disposed) commit(serializeState(model.state));}
  function releaseFrame(frame){
    if(!frame)return;
    releaseTexture(frame.region);
    if(frame.field)releaseTexture(frame.field);
    frame.bitmap?.close();
  }
  async function installSource(id,bitmap){
    const copy=await createImageBitmap(bitmap,{premultiplyAlpha:"none",colorSpaceConversion:"none"});
    if(disposed||sources.get(id)!==bitmap){copy.close();return;}
    await workerCall({type:"source",key:sourcePrefix+id,bitmap:copy},[copy]);
  }
  async function syncSources() {
    if(!entry||disposed)return;
    const epoch=generation,revision=++sourceGeneration,missing=[];
    await Promise.all(model.state.stickers.map(async st=>{
      const key=sourceKey(st.source);
      if(sourceKeys.get(st.id)===key) return;
      let bitmap;
      try{
        const shared=[...sourceKeys].find(([id,value])=>value===key&&sources.has(id));
        if(shared)bitmap=await createImageBitmap(sources.get(shared[0]),{premultiplyAlpha:'none',colorSpaceConversion:'none'});
        else{
          const response=await fetch(urlFor(st.source),{cache:'no-store'});
          if(!response.ok)throw new Error(`Cannot read ${st.name}.`);
          bitmap=await imageFromBlob(await response.blob());
        }
      }catch(e){
        if(!disposed&&epoch===generation&&revision===sourceGeneration){missing.push({id:st.id,name:st.name});forgetSticker(st.id);}
        return;
      }
      const current=model.state.stickers.find(item=>item.id===st.id);
      if(disposed || epoch!==generation || revision!==sourceGeneration || !current || sourceKey(current.source)!==key){bitmap.close();return;}
      forgetSticker(st.id);
      sources.set(st.id,bitmap);sourceKeys.set(st.id,key);await installSource(st.id,bitmap);
    }));
    if(disposed||epoch!==generation||revision!==sourceGeneration)return;
    for(const id of sources.keys())if(!addingSources.has(id)&&!model.state.stickers.some(s=>s.id===id))forgetSticker(id);
    model.missing=missing;
  }
  function forgetSticker(id){
    const bitmap=sources.get(id);
    if(bitmap){releaseTexture(bitmap);bitmap.close();sources.delete(id);void workerCall({type:'releaseSource',key:sourcePrefix+id}).catch(()=>{});}
    sourceKeys.delete(id);releaseFrame(frames.get(id));frames.delete(id);frameKeys.delete(id);
  }
  async function pump() {
    if(computing || !pending || !entry || disposed) return;
    computing=true;
    const job=pending;pending=null;
    try {
      const epoch=generation;
      const results=await Promise.all(job.state.stickers.filter(s=>s.visible).map(async st=>{
        const image=sources.get(st.id);
        if(!image)return null;
        const physicalWidth=job.physical?.id===st.id?job.physical.width:null;
        const signature=JSON.stringify([st.anchor,st.size,st.rotation,st.edge,st.mode,image.width,image.height,physicalWidth,st.source,st.shading]);
        const key=signature+(job.coarse?"coarse":"full"),oldKey=frameKeys.get(st.id);
        const cached=frames.get(st.id),sameShape=oldKey===key||(job.coarse&&oldKey===signature+"full");
        if(sameShape){
          if(!cached||JSON.stringify(cached.viewport)===JSON.stringify(job.viewport))return null;
          const shape={...cached};delete shape.bitmap;
          const raster=await workerCall({type:'raster',key:entry.key,frame:shape,sticker:st,viewport:job.viewport,sourceKey:sourcePrefix+st.id});
          return {id:st.id,frame:{...cached,...raster,viewport:job.viewport},key:oldKey};
        }
        const frame=await workerCall({type:"flat",key:entry.key,sticker:st,aspect:image.width/image.height,physicalWidth,coarse:job.coarse,viewport:job.viewport,sourceKey:sourcePrefix+st.id});
        if(frame)frame.viewport=job.viewport;
        return {id:st.id,frame,key};
      }));
      if(disposed||epoch!==generation){for(const result of results)result?.frame?.bitmap?.close();}
      if(!disposed&&epoch===generation){
        // Publish finished maps even when a newer pointer request is pending.
        // The live transform follows the current pointer until that newer map arrives.
        for(const result of results)if(result){
          if(!model.state.stickers.some(s=>s.id===result.id)){result.frame?.bitmap?.close();continue;}
          const old=frames.get(result.id);releaseFrame(old);
          if(result.frame)frames.set(result.id,result.frame);else frames.delete(result.id);
          frameKeys.set(result.id,result.key);
        }
        notify();
      }
      job.resolve();
    }catch(e){job.reject(e);error(e);}
    finally{computing=false;if(pending)void pump();}
  }
  function update(physical=null){
    if(!entry || disposed)return Promise.resolve();

    if(pending)pending.resolve();
    return new Promise((resolve,reject)=>{pending={state:model.state,physical,coarse:model.dragging,viewport,resolve,reject};void pump();});
  }
  function setViewport(width,height){
    if(viewport?.[0]===width&&viewport?.[1]===height)return;
    viewport=[width,height];void update().catch(error);
  }
  async function load(descriptor){
    if(disposed)return;
    if(stateError){model.phase="error";model.message=stateError.message;notify();return;}
    sourceRevisions=new Map((descriptor.source_revisions??[]).map(item=>[JSON.stringify(item.source),item.digest]));
    if(entry?.key===descriptor.meta.key&&model.phase==='ready'){
      generation++;
      await syncSources();await update();notify();return;
    }
    const epoch=++generation;frameKeys.clear();entry=null;lease?.release();lease=null;
    model.phase="loading";model.message="Loading surface…";notify();
    const handle=acquireSurface(descriptor,urlFor);lease=handle;
    try{
      const loaded=await handle.ready;
      if(disposed||epoch!==generation)return;
      entry=loaded;await syncSources();
      if(disposed||epoch!==generation)return;
      model.phase="ready";model.message=entry.grid.valid.some(Boolean)?"":"No usable surface in this image";
      await update();notify();
    }catch(e){
      if(!disposed&&epoch===generation){model.phase="error";error(e);}
    }
  }
  async function addFile(file,anchor=[.5,.5]){
    if(!entry || model.phase!=="ready"){model.message="Run the workflow once to load the surface";notify();return;}
    if(!/^image\//.test(file.type)&&! /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)) throw new Error("Choose an image file to add a sticker.");
    if(!validAnchor(anchor))throw new Error("Drop the image on a usable surface.");
    const surface=lease,bitmap=await imageFromBlob(file);let st;
    function cancelled(){
      if(!disposed&&lease===surface)return false;
      if(st)forgetSticker(st.id);else bitmap.close();
      if(!disposed){model.message='The surface changed during upload. Add the image again.';notify();}
      return true;
    }
    try{
      if(cancelled())return;
      model.message="Uploading image…";notify();
      const source=await upload(file);
      if(cancelled())return;
      // Validate the host response through the same public state contract before retaining it.
      st=parseState(JSON.stringify({stickers:[newSticker({filename:source.name,subfolder:source.subfolder??"",type:source.type},file.name,anchor)]})).stickers[0];
      addingSources.add(st.id);
      sources.set(st.id,bitmap);sourceKeys.set(st.id,sourceKey(st.source));await installSource(st.id,bitmap);
      if(cancelled())return;
      addingSources.delete(st.id);
      model.selected=st.id;model.message="";replaceState({...model.state,stickers:[...model.state.stickers,st]});
      save();await update();
    }catch(e){if(st)forgetSticker(st.id);bitmap.close();model.message="";error(e);throw e;}
    finally{if(st)addingSources.delete(st.id);}
  }
  function validAnchor([u,v]){
    if(!entry || u<0||u>1||v<0||v>1)return false;
    const {grid}=entry;
    return !!grid.valid[Math.min(grid.height-1,Math.floor(v*grid.height))*grid.width+Math.min(grid.width-1,Math.floor(u*grid.width))];
  }
  function setSticker(id,changes){replaceState({...model.state,stickers:model.state.stickers.map(st=>st.id===id?{...st,...changes}:st)});}
  function setState(raw){
    if(disposed)return;
    try{replaceState(parseState(raw));stateError=null;if(model.phase!=='loading'){model.phase=entry?"ready":"empty";model.message=entry?"":"Run the workflow once to load the surface";}void syncSources().then(()=>update()).catch(error);}
    catch(e){stateError=e;model.phase="error";error(e);}
  }
  function removeUnavailable(){
    const missing=new Set(model.missing.map(item=>item.id));
    setState(JSON.stringify({...model.state,stickers:model.state.stickers.filter(st=>!missing.has(st.id))}));save();
  }
  function dispose(){
    if(disposed)return;disposed=true;generation++;pending?.resolve();pending=null;
    lease?.release();lease=null;entry=null;if(sources.size)void workerCall({type:"releaseSources",key:sourcePrefix}).catch(()=>{});
    for(const frame of frames.values())releaseFrame(frame);frames.clear();frameKeys.clear();
    for(const bitmap of sources.values()){releaseTexture(bitmap);bitmap.close();}sources.clear();listeners.clear();
    if(--sessions===0)disposeRenderer();
  }
  return {model,frames,sources,get entry(){return entry;},load,addFile,validAnchor,setSticker,setState,replaceState,update,save,error,dispose,removeUnavailable,
    setViewport,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},notify};
}
