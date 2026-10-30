import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const url=process.env.SS_COMFY_URL,photo=process.env.SS_REAL_BACKGROUND;
const example=JSON.parse(readFileSync(new URL('../../example_workflows/slap_stickers_moge.json',import.meta.url)));

test.describe('Packaged MoGe workflow',()=>{
  test.skip(!url||!photo,'Set SS_COMFY_URL and SS_REAL_BACKGROUND to use a dedicated GPU host.');
  for(const modern of [false,true])for(const recovery of ['remove','restore'])test(`missing images block output and recover by ${recovery} (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
    test.setTimeout(90000);
    const response=await page.request.post(`${url}/upload/image`,{multipart:{image:{name:'recovery-photo.png',mimeType:'image/png',buffer:readFileSync(photo)},type:'input',subfolder:'slap_stickers_tests',overwrite:'true'}});
    const background=await response.json(),filename=`unavailable-release-${Date.now()}.png`;
    await page.route('**/settings',async route=>{
      if(route.request().method()!=='GET')return route.continue();
      const response=await route.fetch();await route.fulfill({response,json:{...await response.json(),'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern}});
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.app?.isGraphReady&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
    await page.evaluate(async({workflow,background,filename})=>{
      const app=window.app;await app.loadGraphData(workflow);
      app.rootGraph.getNodeById(1).widgets.find(w=>w.name==='image').value=[background.subfolder,background.name].filter(Boolean).join('/');
      const node=app.rootGraph.getNodeById(4),widget=node.widgets.find(w=>w.name==='state_json');
      widget.value=JSON.stringify({version:1,stickers:[{id:'missing',name:'missing file',source:{filename,type:'input',subfolder:'slap_stickers_tests'}}]});widget.callback?.(widget.value);
      app.canvas.ds.scale=1;app.canvas.centerOnNode(node);await app.queuePrompt(0,1);
    },{workflow:example,background,filename});
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','1',{timeout:20000});
    await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
    const saved=await page.evaluate(()=>window.app.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value);
    if(recovery==='remove'){
      await page.getByRole('button',{name:'Remove unavailable images',exact:true}).click();
      await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
    }else{
      const upload=await page.request.post(`${url}/upload/image`,{multipart:{image:{name:filename,mimeType:'image/png',buffer:readFileSync('tests/browser/fixtures/sticker.png')},type:'input',subfolder:'slap_stickers_tests',overwrite:'true'}});
      expect(upload.ok()).toBe(true);
    }
    const before=await(await page.request.get(`${url}/history`)).json();
    const blocked=Object.values(before).reverse().find(item=>item.outputs?.['4']?.slap_stickers);
    expect(blocked?.outputs['5']?.images).toBeUndefined();
    await page.evaluate(()=>window.app.queuePrompt(0,1));
    let completed;
    await expect.poll(async()=>{
      const history=await(await page.request.get(`${url}/history`)).json();
      completed=Object.entries(history).find(([id,item])=>!before[id]&&item.status?.completed)?.[1];
      return !!completed;
    },{timeout:20000}).toBe(true);
    expect(completed.outputs['5']?.images).toHaveLength(1);
    await expect(page.getByRole('button',{name:'Remove unavailable images',exact:true})).toHaveCount(0);
    if(recovery==='restore')expect(await page.evaluate(()=>window.app.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value)).toBe(saved);
  });
  for(const modern of [false,true])test(`queue and edit (${modern?'Nodes 2.0':'classic'})`,async({page})=>{
    test.setTimeout(90000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    const upload=await page.request.post(`${url}/upload/image`,{multipart:{
      image:{name:'workflow-photo.png',mimeType:'image/png',buffer:readFileSync(photo)},
      type:'input',subfolder:'slap_stickers_tests',overwrite:'true',
    }});
    expect(upload.ok()).toBeTruthy();
    const background=await upload.json();
    await page.route('**/settings',async route=>{
      if(route.request().method()!=='GET')return route.continue();
      const response=await route.fetch(),settings=await response.json();
      await route.fulfill({response,json:{...settings,'Comfy.TutorialCompleted':true,'Comfy.VueNodes.Enabled':modern}});
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.app?.isGraphReady&&window.LiteGraph?.registered_node_types?.SurfaceStickers);
    await page.evaluate(async({workflow,background})=>{
      const {app}=await import('/scripts/app.js');window.ssApp=app;
      await app.loadGraphData(workflow);
      app.rootGraph.getNodeById(1).widgets.find(w=>w.name==='image').value=[background.subfolder,background.name].filter(Boolean).join('/');
      app.canvas.ds.scale=1;app.canvas.centerOnNode(app.rootGraph.getNodeById(4));
      await app.queuePrompt(0,1);
    },{workflow:example,background});
    expect(await page.evaluate(()=>Array.from(window.ssApp.rootGraph.getNodeById(4).size))).toEqual([640,600]);
    expect(await page.evaluate(()=>{const n=window.ssApp.rootGraph.getNodeById(4);return {input:n.inputs[0].name,outputs:n.outputs.map(o=>o.name)};})).toEqual({input:'geometry',outputs:['image','stickers','mask']});
    await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0',{timeout:60000});
    const widgetState=()=>page.evaluate(()=>window.ssApp.rootGraph.getNodeById(4).widgets.find(w=>w.name==='state_json').value);
    await page.locator('.ss-surface input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
    await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
    await page.getByRole('button',{name:'Opacity',exact:true}).click();
    await page.getByRole('slider',{name:'Opacity',exact:true}).fill('50');
    await page.getByRole('slider',{name:'Opacity',exact:true}).press('Tab');
    await expect.poll(async()=>JSON.parse(await widgetState()).stickers[0].opacity).toBe(.5);
    const before=(await(await page.request.get(`${url}/history`)).json());
    const outputNodes=await page.evaluate(async()=>{
      const app=window.ssApp,graph=app.rootGraph,surface=graph.getNodeById(4);
      const colors=window.LiteGraph.createNode('PreviewImage'),convert=window.LiteGraph.createNode('MaskToImage'),mask=window.LiteGraph.createNode('PreviewImage');
      for(const node of [colors,convert,mask]){node.pos=[1500,900];graph.add(node);}
      surface.connect(1,colors,0);surface.connect(2,convert,0);convert.connect(0,mask,0);
      await app.queuePrompt(0,1);
      return {colors:String(colors.id),convert:String(convert.id),mask:String(mask.id)};
    });
    let completed;
    await expect.poll(async()=>{
      const history=await(await page.request.get(`${url}/history`)).json();
      completed=Object.entries(history).find(([key,item])=>!before[key]&&item.status?.completed);
      return completed?.[1]?.status?.status_str;
    },{timeout:60000}).toBe('success');
    const result=completed[1];
    expect(JSON.parse(result.prompt[2]['4'].inputs.state_json).stickers[0].opacity).toBe(.5);
    expect(result.outputs['4'].slap_stickers[0]).toBeTruthy();
    expect(result.outputs['5'].images).toHaveLength(1);
    expect(result.prompt[2]['4'].inputs.geometry).toEqual(['3',0]);
    expect(result.prompt[2][outputNodes.colors].inputs.images).toEqual(['4',1]);
    expect(result.prompt[2][outputNodes.convert].inputs.mask).toEqual(['4',2]);
    for(const id of [outputNodes.colors,outputNodes.mask])expect(result.outputs[id].images).toHaveLength(1);
    const output=result.outputs['5'].images[0];
    const image=await page.request.get(`${url}/view?${new URLSearchParams(output)}`);
    expect(image.ok()).toBeTruthy();
    const png=await image.body();
    const meta=result.outputs['4'].slap_stickers[0].meta;
    expect([png.readUInt32BE(16),png.readUInt32BE(20)]).toEqual([meta.image_w,meta.image_h]);
    await expect(page.locator('.ss-editor')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
