import { decodeGrid } from "../surface.js";
import {interactiveSurface,halfGrid,surfaceTopology,depthSpread} from "../wrap.js";
import {rasterizeSurface,releaseTexture,releaseSurfaceTextures,disposeRenderer} from "../stage/renderer.js";
import {lightingFields} from '../lighting.js';
const grids = new Map(),sources=new Map();
function releaseSource(key){
  const bitmap=sources.get(key);if(!bitmap)return;
  releaseTexture(bitmap);bitmap.close();sources.delete(key);
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
      const {light,material} = lightingFields(data.pixels,data.width,data.height);
      const coarse=halfGrid(grid);
      surfaceTopology(grid);surfaceTopology(coarse);
      const spread=depthSpread(grid);
      grids.set(key,{grid,coarse,light,material,width:data.width,height:data.height,image:{width:data.width,height:data.height},meta:data.meta,spread});
      const result={light:light.slice(),spread:spread.slice()};
      self.postMessage({id,result},[result.light.buffer,result.spread.buffer]);
    } else if(type==='raster'){
      const entry=grids.get(key),source=sources.get(data.sourceKey);
      if(!entry||!source)throw new Error('Surface data is gone — run the workflow again');
      const result=rasterizeSurface(entry,data.frame,source,{...data.sticker,opacity:1},data.viewport);
      self.postMessage({id,result},[result.bitmap]);
    } else if (type === "flat") {
      const entry = grids.get(key);
      if (!entry) throw new Error("Surface data is gone — run the workflow again");
      const start=performance.now(),grid=data.coarse?entry.coarse:entry.grid;
      const result = interactiveSurface(grid,data.sticker,data.aspect,data.physicalWidth);
      if(result){
        result.geometryMs=performance.now()-start;
        result.lref=reference({...entry,grid},result.region);
        result.referenceMs=performance.now()-start-result.geometryMs;
        result.anchor=data.sticker.anchor;result.size=data.sticker.size;result.rotation=data.sticker.rotation;
        result.gridSize=[grid.width,grid.height];result.computeMs=performance.now()-start;
        const source=sources.get(data.sourceKey);
        if(source){
          const rasterStart=performance.now();
          // Keep display pixels sharp; only the expensive surface map uses the coarse grid.
          // Opacity is applied when displaying the cached bitmap, without another surface solve.
          Object.assign(result,rasterizeSurface(entry,result,source,{...data.sticker,opacity:1},data.viewport??[entry.width,entry.height]));
          result.rasterMs=performance.now()-rasterStart;
        }
        delete result.xy;delete result.reached;
      }
      const transfers=result?[result.region.buffer,...(result.field?[result.field.buffer]:[]),...(result.bitmap?[result.bitmap]:[])]:[];
      self.postMessage({id,result},transfers);
    } else if (type === "release") { const entry=grids.get(key);if(entry)releaseSurfaceTextures(entry);grids.delete(key);if(!grids.size)disposeRenderer();self.postMessage({id,result:null}); }
  } catch (error) { self.postMessage({id,error:error.message}); }
};
