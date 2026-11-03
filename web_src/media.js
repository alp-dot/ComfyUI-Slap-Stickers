import { decodeGrid } from "./surface.js";
import { workerCall, stopWorker } from "./worker/client.js";
import { releaseTexture, releaseSurfaceTextures } from "./stage/renderer.js";
const surfaces = new Map();
// Older cached node outputs use the previous project key.
export const surfaceDescriptor=output=>(output?.slap_stickers??output?.surface_stickers)?.[0];
export function viewUrl(file) {
  const url = new URL("view",document.baseURI);
  url.search = new URLSearchParams(file).toString();
  return url.href;
}
export async function imageFromBlob(blob) {
  try { return await createImageBitmap(blob,{premultiplyAlpha:"none",colorSpaceConversion:"none"}); }
  catch { throw new Error("This image could not be read. Choose a PNG, JPEG or WebP image."); }
}
export function acquireSurface(descriptor, urlFor = viewUrl) {
  const key = descriptor.meta.key;
  let item = surfaces.get(key);
  if (!item) {
    item = {refs:0,key,promise:null};
    item.promise = (async () => {
      const responses = await Promise.all([fetch(urlFor(descriptor.grid)),fetch(urlFor(descriptor.preview))]);
      if (responses.some(r => !r.ok)) throw new Error("Surface data is gone — run the workflow again");
      const [buffer,blob] = await Promise.all([responses[0].arrayBuffer(),responses[1].blob()]);
      const grid = decodeGrid(buffer,descriptor.meta), image = await imageFromBlob(blob);
      try {
        let sky=null;
        if(descriptor.sky){const response=await fetch(urlFor(descriptor.sky));if(!response.ok)throw new Error('Sky data is gone — run the workflow again');sky=new Uint8Array(await response.arrayBuffer());if(sky.length!==grid.width*grid.height)throw new Error('Sky data is incomplete — run the workflow again');grid.sky=sky;}
        const appearance=descriptor.appearance?Object.fromEntries(await Promise.all(Object.entries(descriptor.appearance).map(async([name,file])=>{
          const {width,height,...location}=file,response=await fetch(urlFor(location));
          if(!response.ok)throw new Error('Photo analysis is gone — run the workflow again');
          const data=new Uint16Array(await response.arrayBuffer());
          if(data.length!==width*height*4)throw new Error('Photo analysis is incomplete — run the workflow again');
          return [name,{data,width,height}];
        }))):null;
        // This canvas only extracts bitmap pixels for the worker; all DOM UI belongs to Vue.
        const canvas = new OffscreenCanvas(image.width,image.height), ctx = canvas.getContext("2d");
        ctx.drawImage(image,0,0);
        const pixels = ctx.getImageData(0,0,image.width,image.height).data;
        const analysis = await workerCall({type:"register",key,buffer,meta:descriptor.meta,pixels,width:image.width,height:image.height,appearance,sky},[buffer,pixels.buffer,...Object.values(appearance??{}).map(v=>v.data.buffer)]);
        return {key,grid,image,...analysis,meta:descriptor.meta};
      } catch (error) { image.close(); throw error; }
    })();
    surfaces.set(key,item);
  }
  item.refs++;
  let released = false;
  return { ready:item.promise, release() {
    if (released) return;
    released = true;
    if (--item.refs > 0) return;
    surfaces.delete(key);
    item.promise.then(entry => {
      releaseTexture(entry.image); releaseSurfaceTextures(entry); entry.image.close();
      if (!surfaces.has(key)) workerCall({type:"release",key}).catch(()=>{});
    },()=>{}).finally(() => { if (!surfaces.size) stopWorker(); });
  }};
}
