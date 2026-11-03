import { shallowReactive } from "vue";
import { newSticker, parseState, serializeState, randomId,upgradeState } from "./state.js";
import { acquireSurface, imageFromBlob, viewUrl } from "./media.js";
import { workerCall } from "./worker/client.js";
import { releaseTexture, disposeRenderer } from "./stage/renderer.js";
import {captureFrame} from './placement.js';
let sessions = 0;
export function createSession({state="",commit=()=>{},upload,urlFor=viewUrl}={}) {
  let parsed,stateError=null;
  try{parsed=parseState(state);if(!state.trim())parsed=upgradeState(parsed);}catch(e){parsed={version:1,stickers:[]};stateError=e;}
  const sourcePrefix=randomId()+":";let viewport=null;
  let disposed=false, lease=null, entry=null, generation=0, sourceGeneration=0, computing=false, pending=null;
  let previewSerial=0,activePreview=0,dropSerial=0,dropPending=null,dropBusy=false;
  let previewTimer=0,lastPreview=-Infinity;
  const frameKeys=new Map(),frames=new Map(),sources=new Map(),sourceKeys=new Map(),listeners=new Set();
  const addingSources=new Set();
  let sourceRevisions=new Map();
  const sourceKey=source=>JSON.stringify([source,sourceRevisions.get(JSON.stringify(source))]);
  const model=shallowReactive({state:parsed,phase:stateError?"error":"empty",message:stateError?.message??"Run the workflow once to load the surface",missing:[],thumbnails:{},selected:null,selection:[],invalid:false,dragging:false,dropFrame:null,dropActive:false});
  sessions++;
  const notify=()=>{ for(const fn of listeners) fn(); };
  function error(e){ if(!disposed && e.name!=="AbortError" && model.message!==e.message){model.message=e.message;notify();} }
  function replaceState(next){model.state=next;notify();}
  function save(){if(!disposed) commit(serializeState(model.state));}
  const shapeKey=(st,image,width)=>JSON.stringify([st.anchor,st.size,st.rotation,st.edge,st.mode,image.width,image.height,width,st.pivot,st.pose]);
  function beginPreview(){activePreview=++previewSerial;}
  function endPreview(){
    activePreview=0;
    clearTimeout(previewTimer);previewTimer=0;
    if(pending?.preview){pending.resolve();pending=null;}
  }
  function previewSticker(id,changes,physical=null){
    if(!entry||!activePreview||disposed)return Promise.resolve();
    const state=upgradeState(model.state);
    const original=state.stickers.find(st=>st.id===id),target=changes.anchor??original.anchor,{grid}=entry;
    const sky=anchor=>grid.sky?.[Math.min(grid.height-1,Math.max(0,Math.floor(anchor[1]*grid.height)))*grid.width+Math.min(grid.width-1,Math.max(0,Math.floor(anchor[0]*grid.width)))];
    if(changes.anchor&&(sky(original.anchor)||sky(target)))physical=null; // Sky uses angular size, not finite-world dimensions.
    state.stickers=state.stickers.map(st=>st.id===id?{...st,...changes,...(st.recovered?{recovered:false}:{}),pose:undefined}:st);
    if(pending)pending.resolve();
    return new Promise((resolve,reject)=>{pending={state,physical,coarse:false,viewport,preview:activePreview,target:id,resolve,reject};void pump();});
  }
  function select(id,toggle=false){
    const previous=model.selection.length?model.selection:model.selected?[model.selected]:[];
    model.selection=toggle?(previous.includes(id)?previous.filter(value=>value!==id):[...previous,id]):id?[id]:[];
    model.selected=model.selection.includes(id)?id:model.selection.at(-1)??null;notify();
  }
  function releaseFrame(frame){
    if(!frame)return;
    releaseTexture(frame.region);
    if(frame.field)releaseTexture(frame.field);
    releaseTexture(frame.bitmap);frame.bitmap?.close();
  }
  async function installSource(id,bitmap,key){
    const copy=await createImageBitmap(bitmap,{premultiplyAlpha:"none",colorSpaceConversion:"none"});
    if(disposed||sources.get(id)!==bitmap){copy.close();return;}
    await workerCall({type:"source",key:sourcePrefix+id,bitmap:copy},[copy]);
    if(disposed||sources.get(id)!==bitmap)return;
    const scale=Math.min(1,64/Math.max(bitmap.width,bitmap.height)),canvas=new OffscreenCanvas(Math.max(1,Math.round(bitmap.width*scale)),Math.max(1,Math.round(bitmap.height*scale)));
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await canvas.convertToBlob({type:'image/png'});
    if(!disposed&&sources.get(id)===bitmap){URL.revokeObjectURL(model.thumbnails[id]);model.thumbnails={...model.thumbnails,[id]:URL.createObjectURL(blob)};sourceKeys.set(id,key);}
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
      sources.set(st.id,bitmap);await installSource(st.id,bitmap,key);
    }));
    if(disposed||epoch!==generation||revision!==sourceGeneration)return;
    for(const id of sources.keys())if(!addingSources.has(id)&&!model.state.stickers.some(s=>s.id===id))forgetSticker(id);
    model.missing=missing;
  }
  function forgetSticker(id){
    URL.revokeObjectURL(model.thumbnails[id]);const thumbnails={...model.thumbnails};delete thumbnails[id];model.thumbnails=thumbnails;
    const bitmap=sources.get(id);
    if(bitmap){releaseTexture(bitmap);bitmap.close();sources.delete(id);void workerCall({type:'releaseSource',key:sourcePrefix+id}).catch(()=>{});}
    sourceKeys.delete(id);releaseFrame(frames.get(id));frames.delete(id);frameKeys.delete(id);
  }
  async function pump() {
    if(computing || !pending || !entry || disposed) return;
    clearTimeout(previewTimer);previewTimer=0;
    const delay=pending.preview?lastPreview+1000/30-performance.now():0;
    if(delay>0){previewTimer=setTimeout(()=>{previewTimer=0;void pump();},Math.ceil(delay));return;}
    computing=true;
    const job=pending;pending=null;
    if(job.preview)lastPreview=performance.now();
    try {
      const epoch=generation;
      const results=await Promise.all(job.state.stickers.filter(s=>s.visible).map(async st=>{
        const image=sources.get(st.id);
        if(!image||sourceKeys.get(st.id)!==sourceKey(st.source))return null;
        const physicalWidth=job.physical?.id===st.id?job.physical.width:null;
        const signature=shapeKey(st,image,physicalWidth);
        const rasterKey=JSON.stringify([job.viewport,st.shading,job.state.blend]);
        const natural=job.state.version===2&&entry.appearanceReady;
        const renderSticker={...st,shading:natural?job.state.blend:st.shading,natural};
        const key=signature+(job.coarse?"coarse":"full"),oldKey=frameKeys.get(st.id);
        const cached=frames.get(st.id),sameShape=oldKey===key||(job.coarse&&oldKey===signature+"full");
        if(sameShape){
          if(!cached||cached.rasterKey===rasterKey)return null;
          const shape={...cached};delete shape.bitmap;
          const raster=await workerCall({type:'raster',key:entry.key,frame:shape,sticker:renderSticker,viewport:job.viewport,sourceKey:sourcePrefix+st.id});
          return {id:st.id,frame:{...cached,...raster,viewport:job.viewport,rasterKey},key:oldKey};
        }
        const frame=await workerCall({type:"flat",key:entry.key,sticker:renderSticker,aspect:image.width/image.height,physicalWidth,coarse:job.coarse,chart:job.state.version===2,fieldToken:cached?.fieldToken,viewport:job.viewport,sourceKey:sourcePrefix+st.id});
        if(frame){
          if(frame.reuseField){if(frame.fieldToken!==cached?.fieldToken)throw new Error('The surface chart changed. Move the sticker again.');frame.field=cached.field;}
          frame.viewport=job.viewport;frame.rasterKey=rasterKey;
        }
        return {id:st.id,frame,key};
      }));
      const valid=!disposed&&epoch===generation&&(job.preview?job.preview===activePreview:job.state===model.state);
      if(!valid){
        for(const result of results)result?.frame?.bitmap?.close();
        if(!disposed&&epoch===generation&&!job.preview&&!pending)void update().catch(error);
      }
      if(valid){
        if(job.preview||job.state.version===2&&job.state===model.state){
          const accepted=results.find(result=>result?.id===job.target);
          if(job.preview&&!accepted?.frame){model.invalid=true;job.resolve();return;}
          job.state.stickers=job.state.stickers.map(st=>{
            const result=results.find(result=>result?.id===st.id);if(!result?.frame)return st;
            const frame=result.frame;
            const updated={...st,...(job.preview&&st.id===job.target?{size:frame.resolvedSize??frame.w*entry.grid.intrinsics[0][0]/(frame.gripDepth??frame.p0[2])}:{})};
            updated.pose=captureFrame(frame,updated,entry.grid.key);
            frame.size=updated.size;
            result.key=shapeKey(updated,sources.get(st.id),null)+'full';
            return updated;
          });
          model.state=job.state;model.invalid=false;if(job.preview&&model.message.startsWith('An invalid sticker position'))model.message='';
        }
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
    return new Promise((resolve,reject)=>{pending={state:model.state,physical,coarse:false,viewport,resolve,reject};void pump();});
  }
  function setViewport(width,height){
    if(viewport?.[0]===width&&viewport?.[1]===height)return;
    viewport=[width,height];void update().catch(error);
  }
  async function load(descriptor){
    if(disposed)return;
    endPreview();
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
      model.phase="ready";model.message=model.state.stickers.some(st=>st.recovered)?'An invalid sticker position was restored to the center. Select its thumbnail to reposition it.':entry.grid.valid.some(Boolean)?"":"No usable surface in this image";
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
      if(!/\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)){
        const canvas=new OffscreenCanvas(bitmap.width,bitmap.height);canvas.getContext('2d').drawImage(bitmap,0,0);
        file=new File([await canvas.convertToBlob({type:'image/png'})],file.name.replace(/\.[^.]*$/,'')+'.png',{type:'image/png'});
      }
      model.message="Uploading image…";notify();
      const source=await upload(file);
      if(cancelled())return;
      // Validate the host response through the same public state contract before retaining it.
      st=parseState(JSON.stringify({version:model.state.version,stickers:[newSticker({filename:source.name,subfolder:source.subfolder??"",type:source.type},file.name,anchor)]})).stickers[0];
      addingSources.add(st.id);
      sources.set(st.id,bitmap);await installSource(st.id,bitmap,sourceKey(st.source));
      if(cancelled())return;
      addingSources.delete(st.id);
      select(st.id);model.message="";replaceState({...model.state,stickers:[...model.state.stickers,st]});
      save();await update();
    }catch(e){if(st)forgetSticker(st.id);bitmap.close();model.message="";error(e);throw e;}
    finally{if(st)addingSources.delete(st.id);}
  }
  async function addUrl(value,anchor){
    const url=new URL(value,document.baseURI);
    if(!['http:','https:','data:','blob:'].includes(url.protocol)||url.protocol==='data:'&&!value.startsWith('data:image/'))throw new Error('Drop an image URL.');
    let response;
    try{response=await fetch(url);}catch{throw new Error('This website does not allow image downloads. Save the image and drop the file instead.');}
    if(!response.ok)throw new Error('The image URL could not be read.');
    const blob=await response.blob();if(!blob.type.startsWith('image/'))throw new Error('That URL does not contain an image.');
    const name=decodeURIComponent(url.pathname.split('/').at(-1)||'image.png').replace(/[\\/:\0]/g,'_');
    await addFile(new File([blob],name,{type:blob.type}),anchor);
  }
  function clearDrop(){dropSerial++;dropPending=null;model.dropFrame=null;model.dropActive=false;notify();}
  async function pumpDrop(){
    if(dropBusy||!dropPending||!entry||disposed)return;
    dropBusy=true;const {anchor,serial}=dropPending;dropPending=null;const epoch=generation;
    try{
      const st={...newSticker({filename:'preview.png',type:'input',subfolder:''},'',anchor),pivot:[.5,.5]};
      const frame=await workerCall({type:'flat',key:entry.key,sticker:st,aspect:1,chart:true,guideOnly:true,sourceKey:sourcePrefix+'drop'});
      if(!disposed&&epoch===generation&&serial===dropSerial){model.dropFrame=frame;notify();}
    }catch(e){error(e);}finally{dropBusy=false;if(dropPending)void pumpDrop();}
  }
  function previewDrop(anchor){
    model.dropActive=true;
    if(!validAnchor(anchor)){dropSerial++;model.dropFrame=null;notify();return;}
    dropPending={anchor,serial:++dropSerial};void pumpDrop();notify();
  }
  function validAnchor([u,v]){
    if(!entry || u<0||u>1||v<0||v>1)return false;
    const {grid}=entry;
    return !!grid.valid[Math.min(grid.height-1,Math.floor(v*grid.height))*grid.width+Math.min(grid.width-1,Math.floor(u*grid.width))];
  }
  function setSticker(id,changes){
    const current=('pivot' in changes||'pose' in changes)?upgradeState(model.state):model.state;
    const geometry=['anchor','size','rotation','pivot','mode','edge'].some(key=>key in changes);
    replaceState(parseState(serializeState({...current,stickers:current.stickers.map(st=>st.id===id?{...st,...changes,...(geometry&&st.recovered?{recovered:false}:{}),...(geometry&&!('pose' in changes)?{pose:undefined}:{})}:st)})));
  }
  function setState(raw){
    if(disposed)return;
    endPreview();
    try{const parsed=parseState(raw);replaceState(raw.trim()?parsed:upgradeState(parsed));stateError=null;if(model.phase!=='loading'){model.phase=entry?"ready":"empty";model.message=entry?"":"Run the workflow once to load the surface";}void syncSources().then(()=>update()).catch(error);}
    catch(e){stateError=e;model.phase="error";error(e);}
  }
  function removeUnavailable(){
    const missing=new Set(model.missing.map(item=>item.id));
    setState(JSON.stringify({...model.state,stickers:model.state.stickers.filter(st=>!missing.has(st.id))}));save();
  }
  function dispose(){
    if(disposed)return;disposed=true;generation++;pending?.resolve();pending=null;
    clearTimeout(previewTimer);previewTimer=0;
    lease?.release();lease=null;entry=null;if(sources.size)void workerCall({type:"releaseSources",key:sourcePrefix}).catch(()=>{});
    for(const frame of frames.values())releaseFrame(frame);frames.clear();frameKeys.clear();
    for(const bitmap of sources.values()){releaseTexture(bitmap);bitmap.close();}sources.clear();listeners.clear();
    for(const url of Object.values(model.thumbnails))URL.revokeObjectURL(url);model.thumbnails={};
    if(--sessions===0)disposeRenderer();
  }
  return {model,frames,sources,select,beginPreview,endPreview,previewSticker,previewDrop,clearDrop,sourceUrl:urlFor,get entry(){return entry;},load,addFile,addUrl,validAnchor,setSticker,setState,replaceState,update,save,error,dispose,removeUnavailable,
    setViewport,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},notify};
}
