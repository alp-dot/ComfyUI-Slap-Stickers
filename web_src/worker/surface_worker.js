import { decodeGrid } from "../surface.js";
import {interactiveSurface,surfaceTopology,depthSpread} from "../wrap.js";
import {rasterizeSurface,releaseTexture,releaseSurfaceTextures,disposeRenderer} from "../stage/renderer.js";
import {lightingFields} from '../lighting.js';
import {relocateChart} from '../chart.js';
import {buildGuides} from '../stage/guides.js';
import {savedFrame} from '../placement.js';
import {unhalf} from '../appearance.js';
import {normalizeValue} from '../state.js';
const grids = new Map(),sources=new Map(),charts=new Map();let fieldSerial=0;
function legacyLighting(entry,sticker){if(!sticker.natural&&entry.pixels&&!entry.material)Object.assign(entry,lightingFields(entry.pixels,entry.width,entry.height));}
function releaseSource(key){
  const bitmap=sources.get(key);if(!bitmap)return;
  releaseTexture(bitmap);bitmap.close();sources.delete(key);
  charts.delete(key);
}
function reference(entry, region) {
  const {grid, light, width, height} = entry, values = [];
  for (let i = 0; i < region.length; i++) if (region[i]) {
    const x = Math.min(width-1,Math.floor((i%grid.width+.5)*width/grid.width));
    const y = Math.min(height-1,Math.floor((Math.floor(i/grid.width)+.5)*height/grid.height));
    values.push(light[y*width+x]);
  }
  if(!values.length)return 1;
  function select(k){
    let lo=0,hi=values.length-1;
    while(lo<hi){
      const pivot=values[(lo+hi)>>1];let lt=lo,i=lo,gt=hi;
      while(i<=gt){
        if(values[i]<pivot){[values[i],values[lt]]=[values[lt],values[i]];i++;lt++;}
        else if(values[i]>pivot){[values[i],values[gt]]=[values[gt],values[i]];gt--;}
        else i++;
      }
      if(k<lt)hi=lt-1;else if(k>gt)lo=gt+1;else return {value:values[k],equalStart:lt};
    }
    return {value:values[k],equalStart:lo};
  }
  const middle=values.length>>1,{value,equalStart}=select(middle);
  if(values.length%2||middle-1>=equalStart)return Math.max(1e-4,value);
  let lower=-Infinity;for(let i=0;i<middle;i++)if(values[i]>lower)lower=values[i];
  return Math.max(1e-4,(lower+value)/2);
}
self.onmessage = ({data}) => {
  const {id, type, key} = data;
  try {
    if(type==="source"){
      releaseSource(key);sources.set(key,data.bitmap);self.postMessage({id,result:null});return;
    }else if(type==="releaseSource"){
      releaseSource(key);self.postMessage({id,result:null});return;
    }else if(type==="releaseSources"){
      for(const name of sources.keys())if(name.startsWith(key))releaseSource(name);
      self.postMessage({id,result:null});return;
    }else if (type === "register") {
      const grid = decodeGrid(data.buffer,data.meta);
      if(data.sky)grid.sky=data.sky;
      const {light,material} = data.appearance?{light:new Float32Array(data.width*data.height).fill(1),material:null}:lightingFields(data.pixels,data.width,data.height);
      surfaceTopology(grid);
      const spread=depthSpread(grid);
      let blurMax=0;const detail=data.appearance?.detail?.data;if(detail)for(let i=2;i<detail.length;i+=4)blurMax=Math.max(blurMax,detail[i]);blurMax=unhalf(blurMax);
      grids.set(key,{grid,light,material,blurMax,pixels:data.appearance?data.pixels:null,appearance:data.appearance,width:data.width,height:data.height,image:{width:data.width,height:data.height},meta:data.meta,spread});
      const result={light:light.slice(),spread:spread.slice(),appearanceReady:!!data.appearance};
      self.postMessage({id,result},[result.light.buffer,result.spread.buffer]);
    } else if(type==='raster'){
      const entry=grids.get(key),source=sources.get(data.sourceKey);
      if(!entry||!source)throw new Error('Surface data is gone — run the workflow again');
      legacyLighting(entry,data.sticker);
      const result=rasterizeSurface(entry,data.frame,source,{...data.sticker,opacity:1},data.viewport??[entry.width,entry.height]);
      self.postMessage({id,result},[result.bitmap]);
    } else if (type === "flat") {
      const entry = grids.get(key);
      if (!entry) throw new Error("Surface data is gone — run the workflow again");
      if(!data.guideOnly)legacyLighting(entry,data.sticker);
      const start=performance.now(),grid=entry.grid;
      const cached=charts.get(data.sourceKey);
      const pose=savedFrame(grid,data.sticker,data.aspect);
      const sameBasis=!pose||cached&&pose.baseAnchor&&['p0','n','e1','e2','baseAnchor'].every(name=>pose[name].every((v,i)=>v===cached.frame[name]?.[i]))&&pose.reach===cached.frame.reach&&pose.baseRotation===cached.frame.baseRotation;
      let result=data.chart&&sameBasis&&data.sticker.mode==='wrap'&&cached?.scene===key&&cached.edge===data.sticker.edge?relocateChart(cached.frame,grid,data.sticker,data.aspect,data.physicalWidth):null;
      const blur=data.sticker.natural?entry.blurMax:0;
      const reachScale=size=>Math.max(data.chart?2:1.25,1.25+6*blur/(size*entry.meta.image_w));
      let generated=!result;
      if(!result)result=interactiveSurface(grid,data.sticker,data.aspect,data.physicalWidth,reachScale(data.sticker.size));
      if(result){
        const depth=result.gripDepth??result.p0[2],apparent=data.physicalWidth==null?data.sticker.size:result.w*grid.intrinsics[0][0]/depth;
        const size=normalizeValue('size',apparent);
        if(size!==apparent){result=interactiveSurface(grid,{...data.sticker,size,pose:undefined},data.aspect,size*depth/grid.intrinsics[0][0],reachScale(size));generated=true;}
        if(result){result.resolvedSize=size;result.blurPad=3*blur*result.p0[2]/(grid.intrinsics[0][0]*entry.meta.image_w);}
        if(generated&&result?.field){
          delete result.xy;delete result.reached;
          result.fieldToken=++fieldSerial;
          charts.set(data.sourceKey,{scene:key,edge:data.sticker.edge,frame:{...result}});
        }
      }
      if(result){
        result.geometryMs=performance.now()-start;
        result.lref=data.sticker.natural||data.guideOnly?1:reference({...entry,grid},result.region);
        result.referenceMs=performance.now()-start-result.geometryMs;
        result.anchor=data.sticker.anchor;result.size=data.sticker.size;result.rotation=data.sticker.rotation;
        result.gridSize=[grid.width,grid.height];
        result.guide=buildGuides(grid,result);result.screenAspect=entry.meta.image_w/entry.meta.image_h;
        result.computeMs=performance.now()-start;
        const source=sources.get(data.sourceKey);
        if(source){
          const rasterStart=performance.now();
          // Display and saved placement use the same full-resolution chart.
          // Opacity is applied when displaying the cached bitmap, without another surface solve.
          Object.assign(result,rasterizeSurface(entry,result,source,{...data.sticker,opacity:1},data.viewport??[entry.width,entry.height]));
          result.rasterMs=performance.now()-rasterStart;
        }
        delete result.xy;delete result.reached;
      }
      const outgoing=result?{...result}:null;
      if(data.guideOnly){if(outgoing){delete outgoing.field;delete outgoing.region;}self.postMessage({id,result:outgoing});return;}
      if(outgoing?.field){
        if(data.fieldToken===outgoing.fieldToken){delete outgoing.field;outgoing.reuseField=true;}
        else outgoing.field=outgoing.field.slice();
      }
      if(outgoing?.region)outgoing.region=outgoing.region.slice();
      const transfers=outgoing?[outgoing.region.buffer,...(outgoing.field?[outgoing.field.buffer]:[]),...(outgoing.bitmap?[outgoing.bitmap]:[])]:[];
      self.postMessage({id,result:outgoing},transfers);
    } else if (type === "release") { const entry=grids.get(key);if(entry)releaseSurfaceTextures(entry);grids.delete(key);for(const [source,chart]of charts)if(chart.scene===key)charts.delete(source);if(!grids.size)disposeRenderer();self.postMessage({id,result:null}); }
  } catch (error) { self.postMessage({id,error:error.message}); }
};
