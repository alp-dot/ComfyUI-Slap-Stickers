import {test,expect} from '@playwright/test';
const url=process.env.SS_COMFY_URL;

test('an unrun session waits for its own surface lease before registering sources',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  const result=await page.evaluate(async()=>{
    const {createSession}=await import('/web_src/session.js'),loaded=window.demo.session;
    const pending=createSession({urlFor:file=>file.type==='temp'?`/tests/browser/fixtures/${file.subfolder}/${file.filename}`:'/tests/browser/fixtures/sticker.png'});
    try{
      pending.setState(JSON.stringify(loaded.model.state));
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const deferred=pending.sources.size===0;
      loaded.dispose();await new Promise(requestAnimationFrame);
      await pending.load(await(await fetch('/tests/browser/fixtures/surface.json')).json());
      const frame=[...pending.frames.values()][0];
      return {deferred,bitmap:!!frame?.bitmap?.width};
    }finally{pending.dispose();}
  });
  expect(result).toEqual({deferred:true,bitmap:true});
});

async function openHost(page,modern){
  await page.route('**/settings',async route=>{
    if(route.request().method()!=='GET')return route.continue();
    const response=await route.fetch();await route.fulfill({response,json:{...await response.json(),'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern,'Comfy.RightSidePanel.IsOpen':false}});
  });
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.app?.isGraphReady&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
}

test.describe('host lifecycle',()=>{
  test.skip(!url,'Set SS_COMFY_URL to the dedicated ComfyUI host.');
  for(const modern of [false,true]){
    test(`restoring an image recovers the same cached surface (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
      await openHost(page,modern);
      let restored=false,reads=0;
      await page.route('**/view?**',async route=>{
        if(new URL(route.request().url()).searchParams.get('filename')!=='restored-release-test.png')return route.continue();
        reads++;
        if(restored)await route.fulfill({path:'tests/browser/fixtures/sticker.png',contentType:'image/png'});
        else await route.fulfill({status:404,body:'missing image'});
      });
      const saved=await page.evaluate(async()=>{
        const app=window.app,history=await(await fetch('/history')).json(),output=Object.values(history).reverse().find(item=>item.outputs?.['4']?.slap_stickers).outputs['4'];
        const state=JSON.stringify({version:1,stickers:[{id:'restored',name:'restored image',source:{filename:'restored-release-test.png',type:'input',subfolder:''}}]});
        app.nodeOutputs={};
        await app.loadGraphData({nodes:[{id:'4',type:'SurfaceStickers',pos:[70,60],size:[640,600],widgets_values:[state],properties:{},flags:{}}],links:[],groups:[],version:.4});
        window.ssRecoveryOutput=output;app.nodeOutputs={'4':output};
        return app.rootGraph.getNodeById('4').widgets.find(w=>w.name==='state_json').value;
      });
      await expect(page.getByRole('button',{name:'Remove unavailable images',exact:true})).toBeVisible();
      const background=await page.getByTestId('surface-stage').evaluate(canvas=>canvas.toDataURL());
      restored=true;
      await page.evaluate(()=>window.app.rootGraph.getNodeById('4').onExecuted(window.ssRecoveryOutput));
      await expect(page.getByRole('button',{name:'Remove unavailable images',exact:true})).toHaveCount(0);
      await expect.poll(()=>page.getByTestId('surface-stage').evaluate(canvas=>canvas.toDataURL())).not.toBe(background);
      expect(reads).toBe(2);
      expect(await page.evaluate(()=>window.app.rootGraph.getNodeById('4').widgets.find(w=>w.name==='state_json').value)).toBe(saved);
    });

    test(`stored-output hooks share one in-flight load (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
      await openHost(page,modern);
      let requests=0,release;const gate=new Promise(resolve=>release=resolve);
      await page.route('**/view?**',async route=>{
        if(new URL(route.request().url()).searchParams.get('filename')?.startsWith('ss_grid_')){requests++;await gate;}
        await route.continue();
      });
      try{
        await Promise.all([page.waitForRequest(r=>new URL(r.url()).searchParams.get('filename')?.startsWith('ss_grid_')),page.evaluate(async()=>{
          const app=window.app,history=await(await fetch('/history')).json(),output=Object.values(history).reverse().find(item=>item.outputs?.['4']?.slap_stickers).outputs['4'];
          app.nodeOutputs={};
          await app.loadGraphData({nodes:[{id:'4',type:'SurfaceStickers',pos:[70,60],size:[640,600],widgets_values:[''],properties:{},flags:{}}],links:[],groups:[],version:.4});
          app.nodeOutputs={'4':{surface_stickers:output.slap_stickers}};
          const node=app.rootGraph.getNodeById('4');node.onConfigure?.(node.serialize());
          app.nodeOutputs={'4':output};app.nodeOutputs={'4':output};
        })]);
        await page.evaluate(()=>new Promise(requestAnimationFrame));
        expect(requests).toBe(1);
      }finally{release();}
      await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
    });

    test(`failed attachment retries keep only one widget (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
      await openHost(page,modern);
      await page.evaluate(async()=>{
        const type=window.LiteGraph.registered_node_types.SurfaceStickers,original=type.prototype.addDOMWidget;
        let failures=2;window.ssFailedAttaches=0;
        type.prototype.addDOMWidget=function(...args){
          const widget=original.apply(this,args);
          if(args[0]==='slap_stickers_surface'&&failures-->0)Object.defineProperty(widget,'computeLayoutSize',{configurable:true,get(){window.ssFailedAttaches++;throw new Error('intentional attachment failure');}});
          return widget;
        };
        await window.app.loadGraphData({nodes:[{id:'4',type:'SurfaceStickers',pos:[70,60],size:[640,600],widgets_values:[''],properties:{},flags:{}}],links:[],groups:[],version:.4});
      });
      await expect.poll(()=>page.evaluate(()=>window.ssFailedAttaches)).toBe(1);
      const count=()=>page.evaluate(()=>window.app.rootGraph.getNodeById('4').widgets.filter(w=>w.name==='slap_stickers_surface').length);
      // Legacy canvas buttons are widgets rather than DOM buttons.
      async function retryAttach(){await page.evaluate(()=>window.app.rootGraph.getNodeById('4').widgets.find(w=>w.name==='Retry surface').callback());}
      expect(await count()).toBe(0);
      await retryAttach();expect(await count()).toBe(0);
      await retryAttach();expect(await count()).toBe(1);
      await expect(page.locator('.ss-surface')).toHaveCount(1);
    });
  }
});
