import { test, expect } from "@playwright/test";

let diagnostics=[];
test.beforeEach(async({page})=>{
  diagnostics=[];
  page.on('console',message=>{if(message.type()==='error')diagnostics.push(message.text());});
  page.on('pageerror',error=>diagnostics.push(error.message));
});
test.afterEach(()=>expect(diagnostics).toEqual([]));

async function delayWorkerBitmap(page){
  await page.addInitScript(()=>{
    const Native=Worker;
    window.Worker=class extends Native{
      set onmessage(fn){super.onmessage=event=>{
        if(window.holdBitmap&&event.data.result?.bitmap){window.holdBitmap=false;window.bitmapHeld=true;window.resumeBitmap=()=>fn(event);}
        else fn(event);
      };}
    };
  });
}

test("drop, drag, cancellation and committed state", async ({ page }) => {
  const errors = [];
  page.on("pageerror", e => errors.push(String(e)));
  await page.goto("/tests/browser/pages/fixture/");
  await expect(page.getByTestId("surface-status")).toHaveAttribute('data-sticker-count','0');
  const target = page.getByTestId("surface-stage");
  await target.evaluate(async element => {
    const response = await fetch("/tests/browser/fixtures/sticker.png");
    const file = new File([await response.blob()], "logo.png", { type: "image/png" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer, clientX: rect.x+rect.width*.5, clientY: rect.y+rect.height*.5 }));
  });
  await expect(page.getByTestId("surface-status")).toHaveAttribute('data-sticker-count','1');
  await expect.poll(() => page.evaluate(() => window.demo.session.frames.size)).toBe(1);
  const before = await page.evaluate(() => JSON.parse(JSON.stringify(window.demo.session.model.state)));
  const rect = await target.boundingBox();
  const x = rect.x+rect.width*.5, y = rect.y+rect.height*.5;
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+35,y+20,{steps:4});
  await page.keyboard.press("Escape"); await page.mouse.up();
  expect(await page.evaluate(() => window.demo.session.model.state)).toEqual(before);
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+35,y+20,{steps:4}); await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.demo.commits.length)).toBe(2);
  const after = await page.evaluate(() => window.demo.session.model.state.stickers[0]);
  expect(after.anchor[0]).toBeGreaterThan(.5);
  expect(after.mode).toBe("wrap");
  expect(errors).toEqual([]);
  await page.screenshot({ path: "test-results/flat-demo.png" });
});

test("missing surface stays actionable and corrupt state is retained", async ({ page }) => {
  await page.goto("/tests/browser/pages/fixture/?empty=1");
  await expect(page.getByTestId("surface-status")).toContainText("Run the workflow once");
  await expect(page.getByRole("button", {name:"Add image"})).toBeDisabled();
  await page.goto("/tests/browser/pages/fixture/?corrupt=1");
  await expect(page.getByTestId("surface-status")).toContainText("The sticker data is damaged.");
  await expect(page.getByRole("button",{name:"Add image",exact:true})).toBeDisabled();
  expect(await page.evaluate(()=>window.demo.commits)).toEqual([]);
});

for(const waitAt of ['upload','install'])test(`an upload survives same-surface synchronization during ${waitAt}`,async({page})=>{
  await page.addInitScript(()=>{
    const Native=Worker;
    window.Worker=class extends Native{
      postMessage(data,...args){if(data.type==='source'&&window.holdInstall)window.installId=data.id;return super.postMessage(data,...args);}
      set onmessage(fn){super.onmessage=event=>{
        if(event.data.id===window.installId){window.installHeld=true;window.resumeInstall=()=>{window.installId=null;fn(event);};}
        else fn(event);
      };}
    };
  });
  await page.goto('/tests/browser/pages/fixture/?empty=1');
  const result=await page.evaluate(async waitAt=>{
    const {createSession}=await import('/web_src/session.js');
    let finish;const uploaded=new Promise(resolve=>finish=resolve),commits=[];
    const s=createSession({upload:()=>uploaded,commit:value=>commits.push(value),urlFor:file=>file.type==='temp'?`/tests/browser/fixtures/${file.subfolder}/${file.filename}`:'/tests/browser/fixtures/sticker.png'});
    try{
      const descriptor=await(await fetch('/tests/browser/fixtures/surface.json')).json();await s.load(descriptor);
      const file=new File([await(await fetch('/tests/browser/fixtures/sticker.png')).blob()],'upload.png',{type:'image/png'});
      window.holdInstall=waitAt==='install';
      const adding=s.addFile(file);
      while(s.model.message!=='Uploading image…')await new Promise(requestAnimationFrame);
      if(waitAt==='install'){
        finish({name:'uploaded.png',type:'input',subfolder:'slap_stickers'});
        while(!window.installHeld)await new Promise(requestAnimationFrame);
      }
      descriptor.source_revisions=[];await s.load(descriptor);
      if(waitAt==='install')window.resumeInstall();else finish({name:'uploaded.png',type:'input',subfolder:'slap_stickers'});
      await adding;
      return {count:s.model.state.stickers.length,saved:commits.map(raw=>JSON.parse(raw).stickers.length),message:s.model.message,bitmap:!!s.frames.get(s.model.selected)?.bitmap?.width};
    }finally{s.dispose();}
  },waitAt);
  expect(result).toEqual({count:1,saved:[1],message:'',bitmap:true});
});

for(const change of ['background','dispose'])test(`a pending upload cleans up after ${change}`,async({page})=>{
  await page.goto('/tests/browser/pages/fixture/?empty=1');
  const result=await page.evaluate(async change=>{
    const {createSession}=await import('/web_src/session.js');let finish;
    const uploaded=new Promise(resolve=>finish=resolve),commits=[];
    const s=createSession({upload:()=>uploaded,commit:value=>commits.push(value),urlFor:file=>file.type==='temp'?`/tests/browser/fixtures/${file.subfolder}/${file.filename}`:'/tests/browser/fixtures/sticker.png'});
    try{
      const descriptor=await(await fetch('/tests/browser/fixtures/surface.json')).json();await s.load(descriptor);
      const file=new File([await(await fetch('/tests/browser/fixtures/sticker.png')).blob()],'upload.png',{type:'image/png'}),adding=s.addFile(file);
      while(s.model.message!=='Uploading image…')await new Promise(requestAnimationFrame);
      if(change==='dispose')s.dispose();else{descriptor.meta.key+='-different-background';await s.load(descriptor);}
      finish({name:'uploaded.png',type:'input',subfolder:'slap_stickers'});await adding;
      return {count:s.model.state.stickers.length,saved:commits.length,sources:s.sources.size,message:s.model.message};
    }finally{s.dispose();}
  },change);
  expect(result.count).toBe(0);expect(result.saved).toBe(0);expect(result.sources).toBe(0);
  if(change==='background')expect(result.message).toBe('The surface changed during upload. Add the image again.');
});

test('missing source images keep the background editable and can be removed explicitly',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  await page.route('**/tests/browser/fixtures/sticker.png',route=>route.fulfill({status:404,body:'missing'}));
  await page.evaluate(async()=>{
    const s=window.demo.session,st=s.model.state.stickers[0];
    s.setState(JSON.stringify({...s.model.state,stickers:[st,{...st,id:'missing',name:'lost image',source:{...st.source,filename:'missing.png'}}]}));
    await s.load(await(await fetch('/tests/browser/fixtures/surface.json')).json());
  });
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await expect(page.getByText('Unavailable images: lost image',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Remove unavailable images',exact:true}).click();
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','1');
  await expect(page.getByRole('button',{name:'Remove unavailable images',exact:true})).toHaveCount(0);
  await page.unroute('**/tests/browser/fixtures/sticker.png');
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
  expect(await page.evaluate(()=>JSON.parse(window.demo.commits.at(-1)).stickers.some(s=>s.id==='missing'))).toBe(false);
  expect(diagnostics.every(message=>message==='Failed to load resource: the server responded with a status of 404 (Not Found)')).toBe(true);
  diagnostics=[];
});

test('deleting an image before its first frame arrives releases its source',async({page})=>{
  await delayWorkerBitmap(page);
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.evaluate(()=>window.holdBitmap=true);
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await page.waitForFunction(()=>window.bitmapHeld);
  await page.getByRole('button',{name:'Delete',exact:true}).click();
  await page.evaluate(async()=>{window.resumeBitmap();await window.demo.session.update();});
  expect(await page.evaluate(()=>({stickers:window.demo.session.model.state.stickers.length,frames:window.demo.session.frames.size,sources:window.demo.session.sources.size}))).toEqual({stickers:0,frames:0,sources:0});
});

test('source revisions refresh replaced pixels and expose deleted images on the same surface',async({page})=>{
  await delayWorkerBitmap(page);
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const stage=page.getByTestId('surface-stage');await expect(stage).toHaveAttribute('data-selection-ready','true');
  const replacement=await page.evaluate(async()=>{
    const s=window.demo.session,st=s.model.state.stickers[0],image=s.sources.get(st.id),width=image.width,height=image.height;
    window.revisionDescriptor=await(await fetch('/tests/browser/fixtures/surface.json')).json();
    window.revisionDescriptor.source_revisions=[{source:st.source,digest:'original'}];
    await s.load(window.revisionDescriptor);
    const c=new OffscreenCanvas(width,height),ctx=c.getContext('2d');ctx.fillStyle='blue';ctx.fillRect(0,0,c.width,c.height);
    return [...new Uint8Array(await(await c.convertToBlob()).arrayBuffer())];
  });
  await page.evaluate(()=>new Promise(requestAnimationFrame));
  const before=await stage.evaluate(c=>c.toDataURL()),commits=await page.evaluate(()=>window.demo.commits.length);
  await page.route('**/tests/browser/fixtures/sticker.png',route=>route.fulfill({body:Buffer.from(replacement),contentType:'image/png'}));
  await page.evaluate(()=>{
    const s=window.demo.session;window.oldSource=s.sources.get(s.model.selected);window.holdBitmap=true;
    s.setSticker(s.model.selected,{rotation:13});window.oldUpdate=s.update();
  });
  await page.waitForFunction(()=>window.bitmapHeld);
  await page.evaluate(()=>{window.revisionDescriptor.source_revisions[0].digest='replaced';window.revisionLoad=window.demo.session.load(window.revisionDescriptor);});
  await page.waitForFunction(()=>window.demo.session.sources.get(window.demo.session.model.selected)!==window.oldSource);
  const color=await page.evaluate(async()=>{
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    window.resumeBitmap();await window.oldUpdate;await window.revisionLoad;
    const s=window.demo.session,b=s.frames.get(s.model.selected).bitmap,c=new OffscreenCanvas(b.width,b.height),ctx=c.getContext('2d');ctx.drawImage(b,0,0);
    return [...ctx.getImageData(Math.floor(c.width/2),Math.floor(c.height/2),1,1).data];
  });
  expect(color[2]).toBeGreaterThan(Math.max(color[0],color[1])+80);
  await expect.poll(()=>stage.evaluate(c=>c.toDataURL())).not.toBe(before);
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(commits);
  await page.unroute('**/tests/browser/fixtures/sticker.png');
  await page.route('**/tests/browser/fixtures/sticker.png',route=>route.fulfill({status:404,body:'deleted'}));
  await page.evaluate(async()=>{window.revisionDescriptor.source_revisions[0].digest=null;await window.demo.session.load(window.revisionDescriptor);});
  await expect(page.getByRole('button',{name:'Remove unavailable images',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>window.demo.session.frames.size)).toBe(0);
  expect(diagnostics.every(message=>message==='Failed to load resource: the server responded with a status of 404 (Not Found)')).toBe(true);diagnostics=[];
});

test('resizing the node refreshes sticker pixels without editing or saving state',async({page})=>{
  await page.addInitScript(()=>{
    window.surfaceCalls=[];const post=Worker.prototype.postMessage;
    Worker.prototype.postMessage=function(data,...args){if(data.type==='flat'||data.type==='raster')window.surfaceCalls.push(data.type);return post.call(this,data,...args);};
  });
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.locator('#app').evaluate(e=>{e.style.width='302px';e.style.height='400px';});
  await expect.poll(()=>page.getByTestId('surface-stage').evaluate(c=>c.width)).toBe(300);
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const box=()=>page.evaluate(()=>{const s=window.demo.session;return s.frames.get(s.model.selected)?.bitmapBox;});
  await expect.poll(box).toEqual([300,225]);
  const before=await page.evaluate(()=>({state:JSON.stringify(window.demo.session.model.state),commits:window.demo.commits.length}));
  const shapes=await page.evaluate(()=>window.surfaceCalls.filter(type=>type==='flat').length);
  for(const [width,height,expected]of [[1002,850,[1000,750]],[342,450,[340,255]],[762,620,[760,570]]]){
    await page.locator('#app').evaluate((e,[w,h])=>{e.style.width=w+'px';e.style.height=h+'px';},[width,height]);
    await expect.poll(box).toEqual(expected);
    expect(await page.evaluate(()=>window.surfaceCalls.filter(type=>type==='flat').length)).toBe(shapes);
  }
  const after=await page.evaluate(async()=>{
    const s=window.demo.session,frame=s.frames.get(s.model.selected);
    s.notify();await new Promise(requestAnimationFrame);await s.update();
    return {state:JSON.stringify(s.model.state),commits:window.demo.commits.length,reused:s.frames.get(s.model.selected)===frame};
  });
  expect(after).toEqual({...before,reused:true});
});

test("shader alpha matches the CPU reference and two stages share one WebGL context", async ({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("/tests/browser/pages/render.html");
  await page.waitForFunction(()=>window.__check);
  const result=await page.evaluate(()=>window.__check);
  console.log('renderer:',result.renderer);
  expect(result.contexts).toBe(1);
  expect(result.corner).toEqual([128,128,128,255]);
  const alpha=128/255;
  const expected=[Math.round(128*(1-alpha)+255*alpha),Math.round(128*(1-alpha)),Math.round(128*(1-alpha)),255];
  result.center.forEach((value,i)=>expect(Math.abs(value-expected[i])).toBeLessThanOrEqual(1));
  expect(errors).toEqual([]);
});

test("all editing controls stay in the node and save immediately",async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.getByRole('button',{name:'Add image',exact:true}).click();
  // Use the node's own picker; no dialog or second stage is created.
  await page.locator('input[type=file]').first().setInputFiles('tests/browser/fixtures/sticker.png');
  await expect.poll(()=>page.evaluate(()=>window.demo.session.frames.size)).toBe(1);
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Open Editor'})).toHaveCount(0);
  await expect(page.getByTestId('surface-stage')).toHaveCount(1);
  await expect(page.locator('input[type=number]')).toHaveCount(0);
  await expect(page.locator('.ss-fields')).toHaveCount(0);
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
  await page.getByRole('button',{name:'Delete',exact:true}).click();
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','1');
});

test('resize and rotate directly, cancel, and manage layer order',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const target=page.getByTestId('surface-stage');await expect(target).toHaveAttribute('data-selection-ready','true');
  const controls=()=>page.evaluate(()=>{
    const c=document.querySelector('canvas'),s=window.demo.session,f=s.frames.get(s.model.selected),r=c.getBoundingClientRect();
    const scale=Math.min(c.width/s.entry.meta.image_w,c.height/s.entry.meta.image_h),w=Math.round(s.entry.meta.image_w*scale),h=Math.round(s.entry.meta.image_h*scale);
    const corners=f.corners.map(([u,v])=>[r.x+((c.width-w)/2+u*w)*r.width/c.width,r.y+((c.height-h)/2+v*h)*r.height/c.height]);
    const top=corners[0].map((v,i)=>(v+corners[1][i])/2),bottom=corners[2].map((v,i)=>(v+corners[3][i])/2),d=top.map((v,i)=>v-bottom[i]),length=Math.hypot(...d);
    return {corner:corners[2],rotate:top.map((v,i)=>v+d[i]/length*26),center:top.map((v,i)=>(v+bottom[i])/2)};
  });
  let p=await controls();
  await page.mouse.move(...p.corner);await page.mouse.down();await page.mouse.move(p.corner[0]+30,p.corner[1]+20,{steps:4});await page.mouse.up();
  await expect.poll(()=>page.evaluate(()=>window.demo.session.model.state.stickers[0].size)).toBeGreaterThan(.25);
  await expect.poll(()=>page.evaluate(()=>window.demo.commits.length)).toBe(2);
  p=await controls();
  await page.mouse.move(...p.rotate);await page.mouse.down();await page.mouse.move(p.center[0]+100,p.center[1],{steps:5});await page.mouse.up();
  await expect.poll(()=>page.evaluate(()=>Math.abs(window.demo.session.model.state.stickers[0].rotation))).toBeGreaterThan(20);
  await expect.poll(()=>page.evaluate(()=>window.demo.commits.length)).toBe(3);
  const before=await page.evaluate(()=>window.demo.session.model.state);
  p=await controls();await page.mouse.move(...p.corner);await page.mouse.down();await page.mouse.move(p.corner[0]+20,p.corner[1]+20);await page.keyboard.press('Escape');await page.mouse.up();
  expect(await page.evaluate(()=>window.demo.session.model.state)).toEqual(before);
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>window.demo.session.frames.size)).toBe(2);
  const id=await page.evaluate(()=>window.demo.session.model.selected);
  await page.getByRole('button',{name:'Send to back',exact:true}).click();
  expect(await page.evaluate(()=>window.demo.session.model.state.stickers[0].id)).toBe(id);
  await page.getByRole('button',{name:'Bring to front',exact:true}).click();
  expect(await page.evaluate(()=>window.demo.session.model.state.stickers.at(-1).id)).toBe(id);
  await expect(page.locator('input[type=number]')).toHaveCount(0);
  await page.screenshot({path:'test-results/compact-node.png'});
});

test('a near-plane crossing draws and hits the visible rotate handle',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const stage=page.getByTestId('surface-stage');await expect(stage).toHaveAttribute('data-selection-ready','true');
  const point=await page.evaluate(async()=>{
    const s=window.demo.session,id=s.model.selected,f=s.frames.get(id);
    Object.assign(f,{p0:[0,0,1],n:[0,-Math.SQRT1_2,Math.SQRT1_2],e1:[1,0,0],e2:[0,Math.SQRT1_2,Math.SQRT1_2],w:1,h:1,size:1,rotation:0,anchor:[.5,.5]});
    s.entry.grid.intrinsics=[[1,0,.5],[0,1,.5],[0,0,1]];
    s.setSticker(id,{size:4,rotation:0,anchor:[.5,.5]});
    await new Promise(requestAnimationFrame);
    const {fitRect,renderStage}=await import('/web_src/stage/renderer.js'),c=document.querySelector('canvas'),box=fitRect(c,s.entry.meta),r=c.getBoundingClientRect();
    const x=box.left+box.width/2,y=box.top+box.height/2-Math.hypot(box.width,box.height)/4;
    const plain=document.createElement('canvas');plain.width=c.width;plain.height=c.height;
    renderStage(plain,s.entry,s.model.state.stickers,s.frames,s.sources,null);
    const actual=c.getContext('2d').getImageData(Math.round(x)-8,Math.round(y)-8,16,16).data;
    const background=plain.getContext('2d').getImageData(Math.round(x)-8,Math.round(y)-8,16,16).data;
    return {x:r.left+x*r.width/c.width,y:r.top+y*r.height/c.height,guidePixels:actual.reduce((sum,v,i)=>sum+(v!==background[i]),0)};
  });
  expect(point.guidePixels).toBeGreaterThan(0);
  await page.mouse.move(point.x,point.y);
  await expect(stage).toHaveCSS('cursor','crosshair');
});


test('a failed surface load after disposal does not reject or report a stale error',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/?empty=1');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeDisabled();
  let release;const gate=new Promise(resolve=>release=resolve);
  await page.route('**/obsolete-grid.bin',async route=>{await gate;await route.fulfill({status:200,body:'invalid grid'});});
  await Promise.all([page.waitForRequest('**/obsolete-grid.bin'),page.evaluate(async()=>{
    const descriptor=await(await fetch('/tests/browser/fixtures/surface.json')).json();
    descriptor.meta.key='obsolete';descriptor.grid.filename='obsolete-grid.bin';
    window.oldLoad=window.demo.session.load(descriptor).then(()=>null,error=>error.message);
  })]);
  await page.evaluate(()=>window.demo.session.dispose());release();
  expect(await page.evaluate(()=>window.oldLoad)).toBe(null);
  await expect(page.getByTestId('surface-status')).not.toContainText('results');
});
