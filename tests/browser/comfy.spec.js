import {test,expect} from '@playwright/test';
const url=process.env.SS_COMFY_URL;
async function selectSticker(page){
  // Undo / graph reload restores widget values before the asynchronous surface and frames.
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-rendered-at',/.+/);
  await expect.poll(async()=>{
    const point=await page.evaluate(()=>{
      const node=window.ssApp.rootGraph.getNodeById(4),st=JSON.parse(node.widgets.find(w=>w.name==='state_json').value).stickers[0];
      const meta=window.ssApp.nodeOutputs['4'].slap_stickers[0].meta,r=document.querySelector('.ss-canvas').getBoundingClientRect(),scale=Math.min(r.width/meta.image_w,r.height/meta.image_h);
      return [r.x+(r.width-meta.image_w*scale)/2+st.anchor[0]*meta.image_w*scale,r.y+(r.height-meta.image_h*scale)/2+st.anchor[1]*meta.image_h*scale];
    });
    await page.mouse.click(...point);
    return page.getByRole('button',{name:'Opacity',exact:true}).isEnabled();
  }).toBe(true);
}
test.describe('ComfyUI host integration',()=>{
  test.skip(!url,'Set SS_COMFY_URL to the isolated real MoGe host.');
  for(const modern of [false,true])test(`inline editing and reload (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
    test.setTimeout(90000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const history=await(await page.request.get(`${url}/history`)).json();
    // A supplied test photo takes precedence over unrelated cached workflows.
    if(process.env.SS_REAL_BACKGROUND||!Object.values(history).some(item=>item.outputs?.['4']?.slap_stickers?.[0])){
      if(!process.env.SS_REAL_BACKGROUND)throw new Error('Set SS_REAL_BACKGROUND or analyze a photo in the workspace first.');
      await page.goto('/dev/');
      await expect(page.getByRole('button',{name:'Choose background'})).toBeEnabled();
      await page.getByLabel('Background image').setInputFiles(process.env.SS_REAL_BACKGROUND);
      await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0',{timeout:60000});
    }
    await page.route('**/settings',async route=>{
      if(route.request().method()!=='GET')return route.continue();
      const response=await route.fetch(),settings=await response.json();
      await route.fulfill({response,json:{...settings,'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern}});
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.comfyAPI?.app?.app?.canvas&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
    await page.waitForFunction(()=>window.app?.isGraphReady&&window.app.rootGraph?._nodes?.length>0);
    const initialSize=await page.evaluate(()=>{
      const node=window.LiteGraph.createNode('SurfaceStickers');
      const size=Array.from(node.size);node.onRemoved?.();return size;
    });
    expect(initialSize[0]).toBeGreaterThanOrEqual(640);
    expect(initialSize[1]).toBeGreaterThanOrEqual(600);
    await page.evaluate(async modern=>{
      const {app}=await import('/scripts/app.js');window.ssApp=app;

      const history=await(await fetch('/history')).json();
      const completed=Object.values(history).reverse().find(item=>item.outputs?.['4']?.slap_stickers?.[0]);
      if(!completed)throw new Error('Run the real MoGe photo test before host integration.');
      await app.loadGraphData({last_node_id:4,last_link_id:0,nodes:[
        {id:4,type:'SurfaceStickers',pos:[70,60],size:[800,730],flags:{},order:0,mode:0,properties:{},widgets_values:[''],inputs:[{name:'geometry',type:'MOGE_GEOMETRY',link:null}],outputs:[{name:'image',type:'IMAGE',links:[]},{name:'stickers',type:'IMAGE',links:[]},{name:'mask',type:'MASK',links:[]}]}
      ],links:[],groups:[],config:{},extra:{},version:.4});
      window.ssSurface=app.rootGraph.getNodeById(4);
      app.nodeOutputs={'4':completed.outputs['4']};
    },modern);
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0',{timeout:30000});
    await expect(page.getByTestId('surface-stage')).toHaveCount(1);
    expect(await page.evaluate(()=>window.ssApp.rootGraph.getNodeById(4).inputs.filter(i=>i.name==='image'||i.name==='mask').map(i=>i.label||i.localized_name||i.name))).toEqual(['Background override','Allowed sticker area']);
    await expect(page.locator('.ss-editor')).toHaveCount(0);
    const widgetInfo=await page.evaluate(()=>{const w=window.ssApp.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json');return {hidden:w.hidden,visible:w.element?.checkVisibility?.()??false};});
    expect(widgetInfo).toEqual({hidden:true,visible:false});
    const surface=page.locator('.ss-surface'),beforeAdd=await surface.boundingBox();
    const [picker]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:'Add image',exact:true}).click()]);
    expect(await surface.boundingBox()).toEqual(beforeAdd);
    await picker.setFiles('tests/browser/fixtures/sticker.png');
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','1');
    expect(await surface.boundingBox()).toEqual(beforeAdd);
    await expect(page.locator('.ss-surface input[type=number]')).toHaveCount(0);
    const canvas=page.getByTestId('surface-stage');
    await expect(canvas).toHaveAttribute('data-selection-ready','true');
    const rect=await canvas.boundingBox(),x=rect.x+rect.width*.5,y=rect.y+rect.height*.5;
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+30,y+15,{steps:4});await page.mouse.up();
    await expect.poll(()=>page.evaluate(()=>JSON.parse(window.ssApp.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value).stickers[0].anchor[0])).toBeGreaterThan(.5);
    await page.locator('.ss-surface').focus();await page.keyboard.press('Control+z');
    await expect.poll(()=>page.evaluate(()=>JSON.parse(window.ssApp.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value).stickers[0].anchor[0])).toBe(.5);
    await page.keyboard.press('Control+Shift+z');
    await expect.poll(()=>page.evaluate(()=>JSON.parse(window.ssApp.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value).stickers[0].anchor[0])).toBeGreaterThan(.5);
    await selectSticker(page);
    await page.getByRole('button',{name:'Opacity',exact:true}).focus();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:'Duplicate',exact:true})).toBeDisabled();
    await selectSticker(page);
    await page.getByRole('button',{name:'Opacity',exact:true}).click();
    const slider=page.getByRole('slider',{name:'Opacity',exact:true}),range=await slider.boundingBox();
    await page.mouse.move(range.x+range.width-5,range.y+range.height/2);await page.mouse.down();
    await page.mouse.move(range.x+range.width/2,range.y+range.height/2);await page.mouse.up();
    const savedOpacity=()=>page.evaluate(()=>JSON.parse(window.ssApp.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value).stickers[0].opacity);
    await expect.poll(savedOpacity).toBe(.5);
    // The range keeps focus; undo must still reach Comfy's graph history.
    await page.keyboard.press('Control+z');await expect.poll(savedOpacity).toBe(1);
    await page.keyboard.press('Control+Shift+z');await expect.poll(savedOpacity).toBe(.5);
    await page.evaluate(async()=>{
      const graph=window.ssApp.rootGraph.serialize(),outputs={...window.ssApp.nodeOutputs};
      await window.ssApp.loadGraphData(graph);window.ssApp.nodeOutputs=outputs;
    });
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','1',{timeout:15000});
    expect(await page.evaluate(()=>Array.from(window.ssApp.rootGraph.getNodeById(4).size))).toEqual([800,730]);
    await expect.poll(savedOpacity).toBe(.5);
    await selectSticker(page);
    await expect(page.getByRole('toolbar',{name:'Selected sticker'})).toBeVisible();
    await page.screenshot({path:`test-results/comfy-${modern?'modern':'classic'}.png`});
    await page.evaluate(()=>{
      const type=window.LiteGraph.registered_node_types.SurfaceStickers,original=type.prototype.addDOMWidget;
      type.prototype.addDOMWidget=function(name,...args){if(name==='slap_stickers_surface')throw new Error('Fixture: unavailable host DOM widget');return original.call(this,name,...args);};
      let node;try{node=window.LiteGraph.createNode('SurfaceStickers');}finally{type.prototype.addDOMWidget=original;}
      window.ssApp.rootGraph.add(node);window.ssRetry=node;
      node.widgets.find(w=>w.name==='Retry surface').callback();
    });
    await expect(page.getByTestId('surface-stage')).toHaveCount(2);
    await expect(page.locator('.ss-editor')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  for(const modern of [false,true])test(`picker keeps the surface size (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
    await page.route('**/settings',async route=>{
      if(route.request().method()!=='GET')return route.continue();
      const response=await route.fetch();
      await route.fulfill({response,json:{...await response.json(),'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern}});
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.app?.isGraphReady&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
    await page.evaluate(async()=>{
      const history=await(await fetch('/history')).json(),completed=Object.values(history).reverse().find(item=>item.outputs?.['4']?.slap_stickers);
      await window.app.loadGraphData({nodes:[{id:4,type:'SurfaceStickers',pos:[70,60],size:[640,600],widgets_values:[''],properties:{},flags:{}}],links:[],groups:[],version:.4});
      window.app.nodeOutputs={'4':completed.outputs['4']};
    });
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
    const surface=page.locator('.ss-surface'),before=await surface.boundingBox();
    const [picker]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:'Add image',exact:true}).click()]);
    expect(await surface.boundingBox()).toEqual(before);
    await picker.setFiles([]);
    expect(await surface.boundingBox()).toEqual(before);
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
    expect(await page.evaluate(()=>Array.from(window.app.rootGraph.getNodeById(4).size))).toEqual([640,600]);
  });
  for(const modern of [false,true])test(`properties panel cannot resize the surface after idle (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
    test.setTimeout(65000);
    await page.route('**/settings',async route=>{
      if(route.request().method()!=='GET')return route.continue();
      const response=await route.fetch();
      await route.fulfill({response,json:{...await response.json(),'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern,'Comfy.UseNewMenu':'Top','Comfy.RightSidePanel.IsOpen':true}});
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.app?.isGraphReady&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
    await page.evaluate(async()=>{
      const history=await(await fetch('/history')).json(),completed=Object.values(history).reverse().find(item=>item.outputs?.['4']?.slap_stickers);
      // Match the string node ID in the user's failing workflow.
      await window.app.loadGraphData({nodes:[{id:'4',type:'SurfaceStickers',pos:[70,60],size:[640,600],widgets_values:[''],properties:{},flags:{}}],links:[],groups:[],version:.4});
      window.app.nodeOutputs={'4':completed.outputs['4']};
      window.app.canvas.selectNode(window.app.rootGraph.getNodeById('4'));
    });
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
    const logicalWidth=()=>page.evaluate(()=>document.querySelector('.ss-surface').getBoundingClientRect().width/window.app.canvas.ds.scale);
    await expect.poll(logicalWidth).toBeGreaterThan(600);
    const before=await logicalWidth();
    const panel=page.getByTestId('properties-panel');await expect(panel).toBeVisible();
    await expect.poll(logicalWidth).toBeCloseTo(before,0);
    await expect(panel.getByText('slap_stickers_surface',{exact:true})).toHaveCount(0);
    // The reported failure appears within 30 seconds without an editor gesture.
    await page.waitForTimeout(35000);
    expect(await logicalWidth()).toBeCloseTo(before,0);
    await page.getByRole('button',{name:'Toggle properties panel',exact:true}).click();
    expect(await logicalWidth()).toBeCloseTo(before,0);
    await page.locator('.ss-surface input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
    await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
    expect(await logicalWidth()).toBeCloseTo(before,0);
  });
  for(const modern of [false,true])test(`small node contains the editor and every action (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
    await page.addInitScript(()=>{
      window.ssRasterBoxes=[];
      const NativeWorker=window.Worker;
      window.Worker=class extends NativeWorker{
        constructor(...args){super(...args);this.addEventListener('message',({data})=>{if(data.result?.bitmapBox)window.ssRasterBoxes.push(data.result.bitmapBox);});}
      };
    });
    await page.route('**/settings',async route=>{
      if(route.request().method()!=='GET')return route.continue();
      const response=await route.fetch();
      await route.fulfill({response,json:{...await response.json(),'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern,'Comfy.RightSidePanel.IsOpen':false}});
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.app?.isGraphReady&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
    await page.evaluate(async()=>{
      const history=await(await fetch('/history')).json(),completed=Object.values(history).reverse().find(item=>item.outputs?.['4']?.slap_stickers);
      await window.app.loadGraphData({nodes:[{id:'4',type:'SurfaceStickers',pos:[70,60],size:[640,600],widgets_values:[''],properties:{},flags:{}}],links:[],groups:[],version:.4});
      window.app.nodeOutputs={'4':completed.outputs['4']};
    });
    const surface=page.locator('.ss-surface');
    await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
    const initialZoom=await page.evaluate(()=>window.app.canvas.ds.scale);
    await surface.hover();await page.mouse.wheel(0,-100);
    await expect.poll(()=>page.evaluate(()=>window.app.canvas.ds.scale)).toBeGreaterThan(initialZoom);
    await page.evaluate(scale=>{window.app.canvas.ds.scale=scale;window.app.canvas.setDirty(true,true);},initialZoom);
    await page.evaluate(()=>window.app.rootGraph.getNodeById('4').setSize([220,500]));
    const fits=()=>page.evaluate(()=>{
      const s=document.querySelector('.ss-surface'),r=s.getBoundingClientRect(),n=window.app.rootGraph.getNodeById('4'),scale=window.app.canvas.ds.scale;
      const host=s.closest('[data-node-id]')?.getBoundingClientRect(),c=window.app.canvas.canvas.getBoundingClientRect();
      const bottom=host?.bottom??c.top+(n.pos[1]+window.app.canvas.ds.offset[1]+n.renderingSize[1])*scale;
      return r.bottom<=bottom+1&&r.width<=n.renderingSize[0]*scale+1&&s.scrollWidth<=s.clientWidth+1&&[...s.querySelectorAll('button')].every(b=>{
        const a=b.getBoundingClientRect();return a.left>=r.left&&a.right<=r.right&&a.top>=r.top&&a.bottom<=r.bottom;
      });
    });
    await expect.poll(fits).toBe(true);
    await page.locator('.ss-surface input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
    await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
    expect(await fits()).toBe(true);
    await page.getByRole('button',{name:'Duplicate',exact:true}).click();
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
    await page.getByRole('button',{name:'Opacity',exact:true}).click();
    await expect(page.getByRole('slider',{name:'Opacity',exact:true})).toBeVisible();
    expect(await fits()).toBe(true);
    const popup=await page.getByRole('group',{name:'Sticker opacity'}).boundingBox(),box=await surface.boundingBox();
    expect(popup.x).toBeGreaterThanOrEqual(box.x);expect(popup.x+popup.width).toBeLessThanOrEqual(box.x+box.width);
    await page.keyboard.press('Escape');
    await page.screenshot({path:`test-results/small-node-${modern?'modern':'classic'}.png`});
    // Grow, then resize with the host's real handle: the computed minimum must not ratchet up.
    const minimum=await page.evaluate(()=>Array.from(window.app.rootGraph.getNodeById('4').computeSize()));
    await page.evaluate(()=>window.app.rootGraph.getNodeById('4').setSize([640,650]));
    await expect.poll(fits).toBe(true);
    const rasterFits=()=>page.evaluate(()=>{
      const c=document.querySelector('.ss-canvas'),meta=window.app.nodeOutputs['4'].slap_stickers[0].meta;
      const scale=Math.min(c.width/meta.image_w,c.height/meta.image_h);
      return JSON.stringify(window.ssRasterBoxes.at(-1))===JSON.stringify([Math.round(meta.image_w*scale),Math.round(meta.image_h*scale)]);
    });
    await expect.poll(rasterFits).toBe(true);
    let corner;
    if(modern){
      const handle=page.locator('[data-node-id="4"] [data-corner="SE"]');await expect(handle).toHaveCount(1);
      const r=await handle.boundingBox();corner=[r.x+r.width/2,r.y+r.height/2];
    }else corner=await page.evaluate(()=>{
      const n=window.app.rootGraph.getNodeById('4'),c=window.app.canvas,r=c.canvas.getBoundingClientRect();
      return [r.x+(n.pos[0]+c.ds.offset[0]+n.renderingSize[0])*c.ds.scale-2,r.y+(n.pos[1]+c.ds.offset[1]+n.renderingSize[1])*c.ds.scale-2];
    });
    await page.mouse.move(...corner);await page.mouse.down();await page.mouse.move(corner[0]-500,corner[1]-500,{steps:12});await page.mouse.up();
    await expect.poll(fits).toBe(true);
    await expect.poll(rasterFits).toBe(true);
    const after=await page.evaluate(()=>{const n=window.app.rootGraph.getNodeById('4');return {size:Array.from(n.size),minimum:Array.from(n.computeSize())};});
    expect(after.size[0]).toBeLessThan(640);expect(after.minimum).toEqual(minimum);
    await page.screenshot({path:`test-results/resized-node-${modern?'modern':'classic'}.png`});
    await expect(surface).toBeVisible();
  });

});
