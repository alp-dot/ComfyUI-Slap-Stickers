import {test,expect} from '@playwright/test';

for(const operation of ['source','releaseSource','releaseSources'])test(`worker releases source textures on ${operation}`,async({page})=>{
  // Observe real WebGL allocation/deletion at the browser boundary, inside the real Worker.
  await page.route('**/web_src/worker/surface_worker.js*',async route=>{
    const response=await route.fetch();
    const tracker=`
      const liveTextures=new Set();
      const createTexture=WebGL2RenderingContext.prototype.createTexture;
      const deleteTexture=WebGL2RenderingContext.prototype.deleteTexture;
      WebGL2RenderingContext.prototype.createTexture=function(...args){const texture=createTexture.apply(this,args);if(texture)liveTextures.add(texture);return texture;};
      WebGL2RenderingContext.prototype.deleteTexture=function(texture){deleteTexture.call(this,texture);liveTextures.delete(texture);};
      self.addEventListener('message',event=>{
        if(event.data.type!=='test:textures')return;
        event.stopImmediatePropagation();self.postMessage({id:event.data.id,result:liveTextures.size});
      });
    `;
    await route.fulfill({response,body:tracker+await response.text()});
  });
  await page.goto('/tests/browser/pages/fixture/?empty=1');
  const result=await page.evaluate(async operation=>{
    const {workerCall,stopWorker}=await import('/web_src/worker/client.js');
    const {newSticker}=await import('/web_src/state.js');
    try{
      const descriptor=await(await fetch('/tests/browser/fixtures/surface.json')).json();
      const buffer=await(await fetch(`/tests/browser/fixtures/${descriptor.grid.subfolder}/${descriptor.grid.filename}`)).arrayBuffer();
      const background=new OffscreenCanvas(320,240),paint=background.getContext('2d');
      paint.fillStyle='#808080';paint.fillRect(0,0,320,240);
      const pixels=paint.getImageData(0,0,320,240).data,key='resources';
      await workerCall({type:'register',key,buffer,meta:descriptor.meta,pixels,width:320,height:240},[buffer,pixels.buffer]);
      const sticker={...newSticker({filename:'unused.png',type:'input'},'test',[.5,.5]),shading:0};
      async function source(key){
        const canvas=new OffscreenCanvas(16,16),ctx=canvas.getContext('2d');ctx.fillStyle='#ff0000';ctx.fillRect(0,0,16,16);
        const bitmap=await createImageBitmap(canvas);
        await workerCall({type:'source',key,bitmap},[bitmap]);
      }
      async function render(sourceKey){
        const frame=await workerCall({type:'flat',key,sticker,aspect:1,sourceKey,viewport:[320,240]});
        const canvas=new OffscreenCanvas(frame.bitmap.width,frame.bitmap.height),ctx=canvas.getContext('2d');
        ctx.drawImage(frame.bitmap,0,0);const pixel=[...ctx.getImageData(canvas.width/2,canvas.height/2,1,1).data];frame.bitmap.close();return pixel;
      }
      await source('kept:one');await render('kept:one');
      const baseline=await workerCall({type:'test:textures'});
      const keys=operation==='releaseSources'?['removed:one','removed:two']:['removed:one'];
      for(const key of keys){await source(key);await render(key);}
      const allocated=await workerCall({type:'test:textures'});
      if(operation==='source')await source(keys[0]);
      else await workerCall({type:operation,key:operation==='releaseSources'?'removed:':keys[0]});
      const released=await workerCall({type:'test:textures'}),keptPixel=await render('kept:one');
      return {baseline,allocated,released,count:keys.length,keptPixel};
    }finally{stopWorker();}
  },operation);
  expect(result.allocated).toBe(result.baseline+result.count);
  expect(result.released).toBe(result.baseline);
  expect(result.keptPixel).toEqual([255,0,0,255]);
});
