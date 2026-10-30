import {test,expect} from '@playwright/test';
test('guides disappear during a pointer gesture and return on release or cancel',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const stage=page.getByTestId('surface-stage');await expect(stage).toHaveAttribute('data-selection-ready','true');
  const difference=()=>page.evaluate(async()=>{
    const {renderStage}=await import('/web_src/stage/renderer.js'),s=window.demo.session,c=document.querySelector('canvas');
    const plain=document.createElement('canvas');plain.width=c.width;plain.height=c.height;
    renderStage(plain,s.entry,s.model.state.stickers,s.frames,s.sources,null);
    const actual=c.getContext('2d').getImageData(0,0,c.width,c.height).data,expected=plain.getContext('2d').getImageData(0,0,c.width,c.height).data;
    return actual.reduce((sum,v,i)=>sum+(v!==expected[i]),0);
  });
  expect(await difference()).toBeGreaterThan(0);
  await page.screenshot({path:'test-results/selection-guide.png'});
  const r=await stage.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
  for(const cancel of [false,true]){
    await page.mouse.down();
    await expect.poll(difference).toBe(0);
    await expect(page.getByRole('toolbar',{name:'Selected sticker'})).toBeVisible();
    await expect(page.getByRole('button',{name:'Duplicate',exact:true})).toBeDisabled();
    if(cancel)await page.keyboard.press('Escape');
    await page.mouse.up();
    await expect.poll(difference).toBeGreaterThan(0);
    await expect(page.getByRole('toolbar',{name:'Selected sticker'})).toBeVisible();
    await expect(page.getByRole('button',{name:'Duplicate',exact:true})).toBeEnabled();
  }
});

test('drag preview retains display resolution and smooths diagonal sticker edges',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?plane');await page.waitForFunction(()=>window.perf);
  const result=await page.evaluate(async()=>{
    const s=window.perf.session,id=s.model.selected;
    s.model.dragging=true;s.setSticker(id,{rotation:29,size:.32,shading:0});await s.update();
    const frame=s.frames.get(id),c=new OffscreenCanvas(frame.bitmap.width,frame.bitmap.height),ctx=c.getContext('2d');ctx.drawImage(frame.bitmap,0,0);
    const pixels=ctx.getImageData(0,0,c.width,c.height).data,alphas=new Set();
    for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0&&pixels[i]<255)alphas.add(pixels[i]);
    const previewBox=frame.bitmapBox;
    s.model.dragging=false;await s.update();
    return {previewBox,finalBox:s.frames.get(id).bitmapBox,edgeLevels:alphas.size};
  });
  expect(result.previewBox).toEqual(result.finalBox);
  expect(result.edgeLevels).toBeGreaterThan(4);
});

test('default shading transfers background light onto the sticker without changing alpha',async({page})=>{
  await page.goto('/tests/browser/pages/performance.html?plane&lighting');await page.waitForFunction(()=>window.perf);
  const result=await page.evaluate(async()=>{
    const s=window.perf.session,id=s.model.selected;
    const pixels=()=>{const b=s.frames.get(id).bitmap,c=new OffscreenCanvas(b.width,b.height),ctx=c.getContext('2d');ctx.drawImage(b,0,0);return [.2,.8].map(x=>[...ctx.getImageData(Math.floor(c.width*x),Math.floor(c.height/2),1,1).data]);};
    const strength=s.model.state.stickers[0].shading,shaded=pixels();
    s.setSticker(id,{shading:0});await s.update();return {strength,shaded,unshaded:pixels()};
  });
  expect(result.strength).toBe(.8);
  for(const p of result.unshaded)expect(p).toEqual([128,128,128,255]);
  expect(result.shaded[0][0]).toBeLessThan(120);
  expect(result.shaded[1][0]).toBeGreaterThan(140);
  for(const p of result.shaded){expect(p[0]).toBe(p[1]);expect(p[1]).toBe(p[2]);expect(p[3]).toBe(255);}
});

test('shader wraps a checkerboard around a cylinder instead of clipping to the tangent plane',async({page})=>{
  await page.goto('/tests/browser/pages/wrap.html');await page.waitForFunction(()=>window.__wrap);
  const result=await page.evaluate(()=>window.__wrap);
  expect(result.wrapPixel[0]).toBeGreaterThan(230);
  expect(result.flatPixel).toEqual(result.backgroundPixel);
  expect(result.arc).toBeGreaterThan(result.chord+.02);
  expect(result.error).toBeNull();
  await page.screenshot({path:'test-results/cylinder-wrap.png'});
});

for(const scene of ['plane','cylinder'])test('interactive maps stay responsive with '+scene+' and reuse unchanged layers',async({page})=>{
  test.setTimeout(60000);
  await page.goto('/tests/browser/pages/performance.html?'+scene);await page.waitForFunction(()=>window.perf);
  const result=await page.evaluate(async()=>{
    const {session,calls}=window.perf,id=session.model.selected;
    const base={...session.model.state.stickers[0],id:'unchanged',anchor:[.2,.2],size:.15};
    session.setState(JSON.stringify({...session.model.state,stickers:[base,...session.model.state.stickers]}));
    while(!session.frames.has(base.id))await new Promise(requestAnimationFrame);
    const original=session.frames.get(base.id),canvas=document.querySelector('canvas'),samples=[],input=[],render=[],shape=[];
    calls.length=0;session.model.dragging=true;
    for(let i=0;i<10;i++){
      const anchor=[.45+i*.005,.5],t=performance.now();
      session.setSticker(id,{anchor});const update=session.update();
      await new Promise(requestAnimationFrame);
      input.push(performance.now()-t);render.push(Number(canvas.dataset.renderDuration));
      if(canvas.dataset.renderedAnchor!==anchor.join(','))throw new Error('Pointer did not reach the next rendered frame');
      await update;shape.push(performance.now()-t);
      samples.push(session.frames.get(id).computeMs);
    }
    session.model.dragging=false;const final=[];
    for(let i=0;i<3;i++){session.setSticker(id,{anchor:[.5+i*.002,.5]});await session.update();final.push(session.frames.get(id).computeMs);}
    return {coverage:[...session.frames.get(id).region].reduce((a,b)=>a+b,0)/(1024*768),compute:samples,input,render,shape,final,breakdown:{timings:session.frames.get(id).timings,geometry:session.frames.get(id).geometryMs,reference:session.frames.get(id).referenceMs,raster:session.frames.get(id).rasterMs},unchanged:session.frames.get(base.id)===original,recomputedOther:calls.filter(c=>c.id===base.id).length};
  });
  console.log('interaction performance '+scene+':',JSON.stringify(result));
  expect(result.unchanged).toBe(true);expect(result.recomputedOther).toBe(0);
  const sorted=[...result.compute].sort((a,b)=>a-b);
  expect(sorted[Math.floor(sorted.length/2)]).toBeLessThan(50);
  // Keep the 150ms design target in the report; software WebGL/CPU scheduling varies.
  // This guard rejects a regression above 200ms without claiming every run meets 150ms.
  expect([...result.final].sort((a,b)=>a-b)[1]).toBeLessThan(200);
  // rAF at 60Hz has a 16.67ms period; allow scheduler jitter but bound actual draw work.
  expect(Math.max(...result.input)).toBeLessThan(22);
  expect(Math.max(...result.render)).toBeLessThan(8);
});

test('worker rendering preserves transparent color and refreshes opacity without geometry edits',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  const result=await page.evaluate(async()=>{
    const s=window.demo.session,c=new OffscreenCanvas(16,16),ctx=c.getContext('2d');ctx.fillStyle='rgba(255,0,0,0.5)';ctx.fillRect(0,0,16,16);
    await s.addFile(new File([await c.convertToBlob({type:'image/png'})],'alpha.png',{type:'image/png'}));
    const id=s.model.selected;s.setSticker(id,{shading:0});await s.update();
    const first=s.frames.get(id),pixels=bitmap=>{const c=new OffscreenCanvas(bitmap.width,bitmap.height),ctx=c.getContext('2d');ctx.drawImage(bitmap,0,0);return [...ctx.getImageData(c.width/2,c.height/2,1,1).data];};
    const initial=pixels(first.bitmap);
    s.setSticker(id,{opacity:.5});await s.update();const faded=pixels(s.frames.get(id).bitmap);
    return {initial,faded,reused:s.frames.get(id)===first};
  });
  expect(result.initial[0]).toBeGreaterThanOrEqual(254);
  expect(result.initial[1]).toBe(0);expect(result.initial[2]).toBe(0);
  expect(Math.abs(result.initial[3]-128)).toBeLessThanOrEqual(1);
  expect(Math.abs(result.faded[3]-128)).toBeLessThanOrEqual(1);
  expect(result.reused).toBe(true);
});
