import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";
import { createApp, h } from "vue";
import SsSurface from "./components/SsSurface.vue";
import { createSession } from "./session.js";
import {serializeState} from './state.js';
import {surfaceDescriptor} from './media.js';
import "./slap_stickers.css";

const records=new WeakMap(),live=new Set();
let generation=0;
const surfaceLayout={minWidth:260,minHeight:320};
const stylesheet=document.createElement("link");
stylesheet.rel="stylesheet";
stylesheet.href=new URL(String("./slap_stickers.css"),import.meta.url).href;
document.head.appendChild(stylesheet);
const stateWidget=node=>node.widgets?.find(widget=>widget.name==="state_json");
async function upload(file){
  const body=new FormData();body.append("image",file);body.append("type","input");body.append("subfolder","slap_stickers");
  const response=await api.fetchApi("/upload/image",{method:"POST",body});
  if(!response.ok)throw new Error("The image could not be uploaded. Try adding it again.");
  return response.json();
}
function accept(node,output){
  const record=records.get(node),descriptor=surfaceDescriptor(output);
  if(!record||!descriptor)return;
  const key=JSON.stringify([descriptor.meta.key,descriptor.source_revisions]);
  if(record.key===key&&(record.loading||record.session.model.phase==="ready"&&!record.session.model.missing.length))return;
  record.key=key;
  // Cached outputs may be Vue proxies owned by the host; workers require plain data.
  const loading=record.session.load(JSON.parse(JSON.stringify(descriptor)));record.loading=loading;
  void loading.catch(record.session.error).finally(()=>{if(record.loading===loading)record.loading=null;});
}
function sessionFor(node,widget){
  return createSession({state:widget.value??"",upload,urlFor:file=>api.apiURL(`/view?${new URLSearchParams(file)}`),commit:value=>{
    if(widget.value===value)return;
    node.graph?.beforeChange?.();app.canvas?.emitBeforeChange?.();
    try{widget.value=value;widget.callback?.(value);}
    finally{node.graph?.afterChange?.();app.canvas?.emitAfterChange?.();}
    node.setDirtyCanvas?.(true,true);
  }});
}
function mountView(node,session,root,dom=null){
  const canvasWheel=event=>app.canvas?.canvas.dispatchEvent(new WheelEvent('wheel',{clientX:event.clientX,clientY:event.clientY,deltaX:event.deltaX,deltaY:event.deltaY,deltaMode:event.deltaMode,ctrlKey:event.ctrlKey,metaKey:event.metaKey,shiftKey:event.shiftKey,altKey:event.altKey,cancelable:true}));
  const vue=createApp({render:()=>h(SsSurface,{session,canvasWheel})});
  const record={session,vue,dom,key:null};records.set(node,record);live.add(node);
  try{vue.mount(root);}catch(error){records.delete(node);live.delete(node);vue.unmount();throw error;}
  return record;
}
function attach(node){
  if(records.has(node))return;
  const widget=stateWidget(node);if(!widget)return;
  widget.hidden=true;
  let fallback=node.widgets?.find(w=>w.name==="Retry surface");
  if(!fallback){fallback=node.addWidget("button","Retry surface",null,()=>attach(node));fallback.serialize=false;}
  let session,vue,dom;
  try{
    session=sessionFor(node,widget);
    // A single mount point is the host boundary; every visible element is built by Vue.
    const root=document.createElement("div");root.className="ss-widget-root";root.style.cssText=`width:100%;height:100%;min-width:0;min-height:${surfaceLayout.minHeight}px;position:relative;overflow:hidden`;
    // The properties panel's legacy renderer would overwrite this shared widget's width.
    dom=node.addDOMWidget("slap_stickers_surface",`slap-stickers:${++generation}`,root,{serialize:false,hideOnZoom:false,hideInPanel:true,getMinHeight:()=>surfaceLayout.minHeight,getHeight:()=>surfaceLayout.minHeight});
    dom.serialize=false;
    // Intrinsic widget minima, independent of the current node size.
    const previousLayout=dom.computeLayoutSize?.bind(dom);
    dom.computeLayoutSize=target=>{
      const layout=previousLayout?.(target)??{};
      return {...layout,minWidth:Math.max(surfaceLayout.minWidth,layout.minWidth??0),minHeight:Math.max(surfaceLayout.minHeight,layout.minHeight??0)};
    };
    vue=mountView(node,session,root,dom).vue;fallback.hidden=true;
    const previous=dom.onRemove;let removed=false;
    dom.onRemove=function(...args){if(removed)return;removed=true;previous?.apply(this,args);dispose(node);};
    const previousCallback=widget.callback;
    widget.callback=function(...args){const result=previousCallback?.apply(this,args);const raw=String(widget.value??'');if(args[0]!==undefined&&raw!==serializeState(session.model.state))session.setState(raw);return result;};
    const output=app.nodeOutputs?.[String(node.id)];if(output)accept(node,output);
  }catch(error){records.delete(node);live.delete(node);vue?.unmount();session?.dispose();if(dom)node.removeWidget(dom);fallback.hidden=false;console.error("[Slap Stickers] Could not attach the surface",error);}
}
function dispose(node){
  const record=records.get(node);if(!record)return;
  records.delete(node);live.delete(node);record.vue.unmount();record.session.dispose();
}
app.registerExtension({
  name:"alp-dot.SlapStickers",
  beforeRegisterNodeDef(nodeType,nodeData){
    if(nodeData.name!=="SurfaceStickers")return;
    const executed=nodeType.prototype.onExecuted,removed=nodeType.prototype.onRemoved,configured=nodeType.prototype.onConfigure;
    nodeType.prototype.onExecuted=function(output){const result=executed?.apply(this,arguments);accept(this,output);return result;};
    nodeType.prototype.onRemoved=function(){dispose(this);return removed?.apply(this,arguments);};
    const inputLabels={...nodeData.input?.required,...nodeData.input?.optional};
    nodeType.prototype.onConfigure=function(){const result=configured?.apply(this,arguments);for(const input of this.inputs??[]){const label=inputLabels[input.name]?.[1]?.display_name;if(label)input.label=label;}const record=records.get(this);if(record){record.session.setState(String(stateWidget(this)?.value??""));accept(this,app.nodeOutputs?.[String(this.id)]);}return result;};
  },
  nodeCreated(node){
    if(node.comfyClass!=="SurfaceStickers"&&node.constructor.comfyClass!=="SurfaceStickers")return;
    attach(node);
    // Graph configuration restores a saved size after node creation.
    node.setSize([Math.max(node.size[0],640),Math.max(node.size[1],600)]);
  },
  afterConfigureGraph(){for(const node of live)accept(node,app.nodeOutputs?.[String(node.id)]);},
  onNodeOutputsUpdated(outputs){for(const node of live){const output=outputs?.[String(node.id)];if(output)accept(node,output);}},
});
