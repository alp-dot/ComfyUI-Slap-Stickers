import {test,expect} from '@playwright/test';

for(const density of [1,2])test.describe(`screen pixel density ${density}`,()=>{
test.use({deviceScaleFactor:density});
test('corner and rotate handles stay the same screen size when only an ancestor zoom transform changes',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?plane');await page.waitForFunction(()=>window.perf);
  await page.evaluate(async()=>{const s=window.perf.session;s.setSticker(s.model.selected,{mode:'flat',size:.12});await s.update();});
  await expect.poll(()=>page.evaluate(()=>window.perf.session.frames.get(window.perf.session.model.selected)?.size)).toBe(.12);
  const commits=await page.evaluate(()=>window.perf.commits.length);
  const measure=()=>page.evaluate(async()=>{
    const c=document.querySelector('canvas'),r=c.getBoundingClientRect(),s=window.perf.session,f=s.frames.get(s.model.selected),{fitRect}=await import('/web_src/stage/renderer.js'),b=fitRect(c,s.entry.meta),corner=f.guide.handles[0];
    const x=b.left+corner[0]*b.width,y=b.top+corner[1]*b.height,ratio=c.width/r.width,bytes=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    const white=(x,y)=>{const i=(Math.floor(y)*c.width+Math.floor(x))*4;return bytes[i]>240&&bytes[i+1]>240&&bytes[i+2]>240;};
    let end=Math.ceil(x+3*ratio);while(end<x+30*ratio&&white(end,y))end++;
    const lineX=x+5*ratio;let top=Math.floor(y),bottom=top;
    while(top>y-10*ratio&&white(lineX,top))top--;
    while(bottom<y+10*ratio&&white(lineX,bottom))bottom++;
    const tx=b.left+f.guide.top[0]*b.width,ty=b.top+f.guide.top[1]*b.height;
    let diameter=0;
    for(let yy=Math.ceil(ty-35*ratio);yy<ty-4*ratio;yy++){
      let count=0;for(let xx=Math.floor(tx-12*ratio);xx<tx+12*ratio;xx++)if(white(xx,yy))count++;
      diameter=Math.max(diameter,count/ratio);
    }
    return {arm:(end-x)/ratio,thickness:(bottom-top-1)/ratio,diameter,rotate:[r.x+tx/ratio,r.y+ty*r.height/c.height-24]};
  });
  for(const scale of [1,.5,1.75]){
    await page.locator('#app').evaluate((e,scale)=>{e.style.transformOrigin='0 0';e.style.transform=`scale(${scale})`;},scale);
    // Fractional CSS sizes and antialiasing leave roughly two fully white
    // pixels inside the three-pixel stroke, rather than an integer count.
    await expect.poll(async()=>{const m=await measure();return {arm:m.arm>16&&m.arm<20,thickness:m.thickness>1.9&&m.thickness<4.1,diameter:m.diameter>=7&&m.diameter<=10};}).toMatchObject({arm:true,thickness:true,diameter:true});
    const metrics=await measure();expect(metrics.arm).toBeLessThan(20);expect(metrics.thickness).toBeGreaterThan(1.9);expect(metrics.thickness).toBeLessThan(4.1);
    await page.mouse.move(metrics.rotate[0]+9,metrics.rotate[1]);await expect(page.getByTestId('surface-stage')).toHaveCSS('cursor','crosshair');
  }
  expect(await page.evaluate(()=>window.perf.commits.length)).toBe(commits);
});
});

test('a top-clipped sticker can be rotated with the handle below it',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?plane');await page.waitForFunction(()=>window.perf);
  await page.evaluate(async()=>{const s=window.perf.session;s.setSticker(s.model.selected,{mode:'flat',size:.5,anchor:[.5,.15]});await s.update();});
  await expect.poll(()=>page.evaluate(()=>{const s=window.perf.session;return s.frames.get(s.model.selected)?.guide?.top?.[1]??1;})).toBeLessThan(0);
  const point=await page.evaluate(async()=>{
    const s=window.perf.session;
    const c=document.querySelector('canvas'),r=c.getBoundingClientRect(),{fitRect}=await import('/web_src/stage/renderer.js'),b=fitRect(c,s.entry.meta),f=s.frames.get(s.model.selected);
    if(!(f.guide.top[1]<0))throw new Error('Fixture top must be clipped.');
    return [r.x+(b.left+f.guide.bottom[0]*b.width)*r.width/c.width,r.y+(b.top+f.guide.bottom[1]*b.height)*r.height/c.height+24];
  });
  const stage=page.getByTestId('surface-stage');await page.mouse.move(...point);await expect(stage).toHaveCSS('cursor','crosshair');
  await page.mouse.down();await page.mouse.move(point[0]+20,point[1],{steps:3});
  await expect.poll(()=>page.evaluate(()=>window.perf.session.model.state.stickers[0].rotation)).not.toBe(0);
  await page.mouse.up();await page.screenshot({path:'test-results/bottom-rotate-handle.png'});
});

test('guides use bold corners and a subtle straight border',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  const result=await page.evaluate(async()=>{
    const s=window.demo.session;s.setSticker(s.model.selected,{mode:'flat'});await s.update();
    const {renderStage,fitRect}=await import('/web_src/stage/renderer.js'),c=document.querySelector('canvas'),b=fitRect(c,s.entry.meta),f=s.frames.get(s.model.selected);
    const plain=document.createElement('canvas');plain.width=c.width;plain.height=c.height;renderStage(plain,s.entry,s.model.state.stickers,s.frames,s.sources,null);
    const guided=document.createElement('canvas');guided.width=c.width;guided.height=c.height;guided.getBoundingClientRect=()=>c.getBoundingClientRect();renderStage(guided,s.entry,s.model.state.stickers,s.frames,s.sources,s.model.selected);
    const diff=uv=>{
      const x=Math.round(b.left+uv[0]*b.width),y=Math.round(b.top+uv[1]*b.height),a=plain.getContext('2d').getImageData(x-2,y-2,5,5).data,d=guided.getContext('2d').getImageData(x-2,y-2,5,5).data;
      return Math.max(...a.map((v,i)=>Math.abs(v-d[i])));
    };
    return {corner:diff(f.guide.handles[0]),side:diff(f.guide.handles[0].map((v,i)=>(v+f.guide.handles[3][i])/2))};
  });
  expect(result.corner).toBeGreaterThan(10);expect(result.side).toBeGreaterThan(1);expect(result.side).toBeLessThan(result.corner);
});

test('guide ink is black on bright photo regions and white on dark regions at either pixel density',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  const samples=await page.evaluate(async()=>{
    const s=window.demo.session,{renderStage,fitRect}=await import('/web_src/stage/renderer.js'),stage=document.querySelector('canvas'),r=stage.getBoundingClientRect(),f=s.frames.get(s.model.selected);
    const photo=new OffscreenCanvas(320,240),paint=photo.getContext('2d');paint.fillStyle='white';paint.fillRect(0,0,160,240);paint.fillStyle='black';paint.fillRect(160,0,160,240);
    const image=await createImageBitmap(photo),entry={...s.entry,image},result=[];
    try{for(const density of [1,2]){
      const c=document.createElement('canvas');c.width=Math.round(r.width*density);c.height=Math.round(r.height*density);c.getBoundingClientRect=()=>r;
      renderStage(c,entry,s.model.state.stickers,s.frames,s.sources,s.model.selected);
      const b=fitRect(c,entry.meta),ctx=c.getContext('2d'),pixel=corner=>{
        const a=f.guide.handles[corner],neighbor=f.guide.handles[corner===0?1:0],dx=(neighbor[0]-a[0])*b.width,dy=(neighbor[1]-a[1])*b.height,length=Math.hypot(dx,dy);
        const x=b.left+a[0]*b.width+dx/length*7*density,y=b.top+a[1]*b.height+dy/length*7*density;
        return [...ctx.getImageData(Math.floor(x),Math.floor(y),1,1).data].slice(0,3);
      };
      result.push({bright:pixel(0),dark:pixel(1)});
    }}finally{image.close();}
    return result;
  });
  for(const sample of samples){expect(Math.max(...sample.bright)).toBeLessThan(50);expect(Math.min(...sample.dark)).toBeGreaterThan(220);}
});

test('moving from background to foreground preserves apparent size and the displayed release pose',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?depth-step');await page.waitForFunction(()=>window.perf);
  await page.evaluate(async()=>{const s=window.perf.session;s.setSticker(s.model.selected,{anchor:[.3,.5],size:.2});await s.update();});
  const points=await page.evaluate(async()=>{
    const c=document.querySelector('canvas'),r=c.getBoundingClientRect(),{fitRect}=await import('/web_src/stage/renderer.js'),b=fitRect(c,window.perf.session.entry.meta);
    return [.3,.72].map(u=>[r.x+(b.left+u*b.width)*r.width/c.width,r.y+(b.top+b.height*.5)*r.height/c.height]);
  });
  await page.mouse.move(...points[0]);await page.mouse.down();await page.mouse.move(...points[1],{steps:8});
  await expect.poll(()=>page.evaluate(()=>window.perf.session.model.state.stickers[0].anchor[0])).toBeCloseTo(.72,5);
  const shown=await page.evaluate(()=>JSON.parse(JSON.stringify(window.perf.session.model.state)));
  expect(shown.stickers[0].size).toBeCloseTo(.2,5);
  await page.mouse.up();
  expect(await page.evaluate(()=>JSON.parse(window.perf.commits.at(-1)))).toEqual(shown);
});

test('drag computation is capped at 30 Hz while the grabbing cursor stays stable',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const stage=page.getByTestId('surface-stage');await expect(stage).toHaveAttribute('data-selection-ready','true');
  const r=await stage.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();
  const result=await page.evaluate(async()=>{
    const c=document.querySelector('canvas'),r=c.getBoundingClientRect(),s=window.demo.session,times=[],cursors=[],original=Worker.prototype.postMessage;
    Worker.prototype.postMessage=function(data,...args){if(data.type==='flat'&&!data.guideOnly)times.push(performance.now());return original.call(this,data,...args);};
    const unsubscribe=s.subscribe(()=>cursors.push(getComputedStyle(c).cursor));
    try{
      for(let i=1;i<=40;i++){c.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,clientX:r.x+r.width*(.5+i*.002),clientY:r.y+r.height*.5,bubbles:true}));await new Promise(resolve=>setTimeout(resolve,8));}
      await new Promise(resolve=>setTimeout(resolve,80));
      return {times,cursors,anchor:s.model.state.stickers[0].anchor};
    }finally{unsubscribe();Worker.prototype.postMessage=original;}
  });
  await page.mouse.up();
  expect(result.anchor[0]).toBeGreaterThan(.55);expect(result.times.length).toBeGreaterThan(2);
  expect(result.cursors.every(cursor=>cursor==='grabbing')).toBe(true);
  for(let i=1;i<result.times.length;i++)expect(result.times[i]-result.times[i-1]).toBeGreaterThanOrEqual(31);
});

test('releasing a drag saves exactly the placement displayed before release',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?cylinder');
  await page.waitForFunction(()=>window.perf);
  const stage=page.getByTestId('surface-stage'),r=await stage.boundingBox();
  await page.mouse.move(r.x+r.width*.5,r.y+r.height*.5);
  await page.mouse.down();
  await page.mouse.move(r.x+r.width*.58,r.y+r.height*.52,{steps:5});
  await expect.poll(()=>page.evaluate(()=>{
    const s=window.perf.session,f=s.frames.get(s.model.selected);
    return s.model.state.stickers[0].anchor[0]>.52&&f?.anchor.join(',')===s.model.state.stickers[0].anchor.join(',');
  })).toBe(true);
  const before=await page.evaluate(()=>{
    return {state:JSON.parse(JSON.stringify(window.perf.session.model.state)),commits:window.perf.commits.length};
  });
  await page.mouse.up();
  await expect(page.getByRole('button',{name:'Duplicate',exact:true})).toBeEnabled();
  await expect.poll(()=>page.evaluate(()=>window.perf.commits.length)).toBe(before.commits+1);
  expect(await page.evaluate(()=>JSON.parse(window.perf.commits.at(-1)))).toEqual(before.state);
});

test('resizing after an off-center grab preserves the visible sticker center',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?cylinder');await page.waitForFunction(()=>window.perf);
  await page.evaluate(async()=>{const s=window.perf.session;s.setSticker(s.model.selected,{pivot:[.15,.5],anchor:[.45,.5]});await s.update();});
  const controls=await page.evaluate(async()=>{
    const s=window.perf.session,c=document.querySelector('canvas'),f=s.frames.get(s.model.selected),{selectionControls}=await import('/web_src/stage/selection.js'),{displayFrame}=await import('/web_src/stage/live.js'),{fitRect}=await import('/web_src/stage/renderer.js');
    const r=c.getBoundingClientRect(),q=selectionControls(fitRect(c,s.entry.meta),displayFrame(f,s.model.state.stickers[0],s.entry.grid.intrinsics),c.width/r.width);
    return {corner:q.corners[2].map((v,i)=>[r.x,r.y][i]+v*r.width/c.width),center:f.guide.center};
  });
  await page.mouse.move(...controls.corner);await page.mouse.down();await page.mouse.move(controls.corner[0]+12,controls.corner[1]+10,{steps:3});
  await expect.poll(()=>page.evaluate(()=>window.perf.session.model.state.stickers[0].size)).not.toBe(.5);
  await page.mouse.up();
  const center=await page.evaluate(()=>window.perf.session.frames.get(window.perf.session.model.selected).guide.center);
  expect(Math.hypot(...center.map((v,i)=>v-controls.center[i]))).toBeLessThan(.004);
});

test('restoring a placement after crossing to another chart preserves its accepted pose',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?cylinder');await page.waitForFunction(()=>window.perf);
  const restored=await page.evaluate(async()=>{
    const s=window.perf.session,before=JSON.stringify(s.model.state),id=s.model.selected;
    s.beginPreview();await s.previewSticker(id,{anchor:[.72,.5],pivot:[.5,.5]},{id,width:s.frames.get(id).w*1.6});s.endPreview();
    s.setState(before);await s.update();return {before:JSON.parse(before),after:s.model.state};
  });
  expect(restored.after).toEqual(restored.before);
});

test('physical-size gestures stay reproducible at the saved size limits',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?plane');await page.waitForFunction(()=>window.perf);
  const sizes=await page.evaluate(async()=>{
    const s=window.perf.session,id=s.model.selected,{parseState}=await import('/web_src/state.js'),result=[];
    for(const width of [20,.0001]){s.beginPreview();await s.previewSticker(id,{anchor:[.5,.5]},{id,width});s.endPreview();const saved=parseState(JSON.stringify(s.model.state));result.push({size:s.model.state.stickers[0].size,restored:saved.stickers[0].size});}
    return result;
  });
  expect(sizes).toEqual([{size:4,restored:4},{size:.01,restored:.01}]);
});

test('moving from a finite surface into sky keeps angular size visible',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?sky');await page.waitForFunction(()=>window.perf);
  const stage=page.getByTestId('surface-stage'),r=await stage.boundingBox();
  await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+r.width/2,r.y+r.height*.25,{steps:5});
  await expect.poll(()=>page.evaluate(()=>window.perf.session.model.state.stickers[0].anchor[1])).toBeLessThan(.35);
  await page.mouse.up();
  const size=await page.evaluate(()=>window.perf.session.model.state.stickers[0].size);expect(size).toBeCloseTo(.5,4);
  const depth=await page.evaluate(()=>window.perf.session.frames.get(window.perf.session.model.selected).p0[2]);expect(depth).toBeGreaterThan(50);
});

test('a viewport rebuild cannot restore an older placement',async({page})=>{
  await page.addInitScript(()=>{const Native=Worker;window.Worker=class extends Native{set onmessage(fn){super.onmessage=event=>{if(window.holdBitmap&&event.data.result?.bitmap){window.holdBitmap=false;window.replyHeld=true;window.resumeBitmap=()=>fn(event);}else fn(event);};}};});
  await page.goto('/tests/browser/pages/performance.html?cylinder');await page.waitForFunction(()=>window.perf);
  await page.evaluate(()=>{const s=window.perf.session;s.beginPreview();window.holdBitmap=true;window.previewFinished=s.previewSticker(s.model.selected,{anchor:[.56,.5]});});
  await page.waitForFunction(()=>window.replyHeld);
  await page.locator('#app').evaluate(e=>{e.style.width='920px';e.style.height='760px';});
  await expect.poll(()=>page.getByTestId('surface-stage').evaluate(c=>c.width)).toBe(918);
  await page.evaluate(async()=>{window.resumeBitmap();await window.previewFinished;window.perf.session.endPreview();});
  await expect.poll(()=>page.evaluate(()=>{const s=window.perf.session;return s.frames.get(s.model.selected)?.bitmapBox[0];})).toBe(918);
  const anchors=await page.evaluate(()=>{const s=window.perf.session;return {frame:s.frames.get(s.model.selected).anchor,model:s.model.state.stickers[0].anchor};});
  expect(anchors.frame).toEqual(anchors.model);expect(anchors.model).toEqual([.56,.5]);
});

test('refreshing photo assets preserves a pose when the geometry is unchanged',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?cylinder');await page.waitForFunction(()=>window.perf);
  const states=await page.evaluate(async()=>{
    const s=window.perf.session;s.beginPreview();await s.previewSticker(s.model.selected,{anchor:[.58,.5]});s.endPreview();
    const before=JSON.parse(JSON.stringify(s.model.state)),meta={...s.entry.meta,key:'updated-photo-assets',geometry_key:s.entry.grid.key};
    await s.load({grid:{filename:'grid'},preview:{filename:'preview'},meta});
    return {before,after:s.model.state};
  });
  expect(states.after).toEqual(states.before);
});
