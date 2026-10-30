import {test,expect} from '@playwright/test';

test('the editor can add and duplicate images without secure-context randomUUID',async({page})=>{
  await page.route('http://slap-stickers.test/**',async route=>{
    const request=new URL(route.request().url());
    const response=await route.fetch({url:'http://127.0.0.1:5187'+request.pathname+request.search});
    await route.fulfill({response});
  });
  await page.goto('http://slap-stickers.test/tests/browser/pages/fixture/');
  expect(await page.evaluate(()=>({secure:isSecureContext,uuid:typeof crypto.randomUUID}))).toEqual({secure:false,uuid:'undefined'});
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
  const ids=await page.evaluate(()=>window.demo.session.model.state.stickers.map(s=>s.id));
  expect(new Set(ids).size).toBe(2);
  for(const id of ids)expect(id).toMatch(/^st_[a-f0-9]{12}$/);
});

for(const action of ['Duplicate','Send to back','Bring to front'])test(`Escape deselects after ${action} without changing the saved stickers`,async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  const duplicate=page.getByRole('button',{name:'Duplicate',exact:true});
  await duplicate.click();
  if(action==='Bring to front')await page.getByRole('button',{name:'Send to back',exact:true}).click();
  const button=page.getByRole('button',{name:action,exact:true});
  if(action!=='Duplicate')await button.click();
  await expect(button).toBeFocused();
  const before=await page.evaluate(()=>window.demo.commits.slice());
  await page.keyboard.press('Escape');
  await expect(duplicate).toBeDisabled();
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','false');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
  expect(await page.evaluate(()=>window.demo.commits)).toEqual(before);
});

test('Add opens one picker without leaking clicks to the graph or changing the editor size',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  const surface=page.locator('.ss-surface'),before=await surface.boundingBox();
  await page.evaluate(()=>{window.outsidePickerClicks=0;document.querySelector('.ss-surface').parentElement.addEventListener('click',()=>window.outsidePickerClicks++);});
  const [picker]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:'Add image',exact:true}).click()]);
  expect(await page.evaluate(()=>window.outsidePickerClicks)).toBe(0);
  expect(await surface.boundingBox()).toEqual(before);
  await picker.setFiles([]);
  expect(await surface.boundingBox()).toEqual(before);
});

test('icon names appear on hover and keyboard focus, and Add has a separate island immediately left of Duplicate',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  const add=page.getByRole('button',{name:'Add image',exact:true});
  await add.hover();await expect(page.getByRole('tooltip')).toHaveText('Add image');
  const names=['Add image','Duplicate','Opacity','Send to back','Bring to front','Delete'];
  const positions=[];
  for(const name of names){const b=page.getByRole('button',{name,exact:true});await expect(b).toBeVisible();positions.push(await b.boundingBox());if(name!=='Add image')await expect(b).toBeDisabled();}
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  for(let i=0;i<names.length;i++)expect(await page.getByRole('button',{name:names[i],exact:true}).boundingBox()).toEqual(positions[i]);
  expect(await add.evaluate(button=>!!button.closest('.ss-add-island'))).toBe(true);
  const plus=await add.boundingBox(),duplicate=await page.getByRole('button',{name:'Duplicate',exact:true}).boundingBox(),stage=await page.getByTestId('surface-stage').boundingBox();
  expect(Math.abs(plus.y+plus.height/2-duplicate.y-duplicate.height/2)).toBeLessThan(1);
  expect(duplicate.x-plus.x-plus.width).toBeGreaterThan(4);
  expect(duplicate.x-plus.x-plus.width).toBeLessThan(30);
  expect(plus.y).toBeGreaterThan(stage.y+stage.height/2);
  expect(await add.evaluate(b=>!!b.closest('[aria-label="Selected sticker"]'))).toBe(false);
  const shapes=[];
  for(const name of ['Duplicate','Send to back','Bring to front','Delete']){
    const button=page.getByRole('button',{name,exact:true});
    shapes.push(await button.locator('svg').innerHTML());
    // Hover remains useful when layer order makes an action unavailable.
    await button.locator('..').hover();await expect(page.getByRole('tooltip')).toHaveText(name);
  }
  expect(new Set(shapes).size).toBe(4);
  await page.mouse.move(1100,880);await add.focus();await expect(page.getByRole('tooltip')).toHaveText('Add image');
  await page.keyboard.press('Escape');await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.screenshot({path:'test-results/controls.png'});
});

test('Opacity previews without recomputing the surface, saves one slider gesture and cancels unfinished changes',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  const pixel=()=>page.getByTestId('surface-stage').evaluate(c=>[...c.getContext('2d').getImageData(c.width/2,c.height/2,1,1).data]);
  const full=await pixel(),before=await page.evaluate(()=>{const s=window.demo.session;window.opacityFrame=s.frames.get(s.model.selected);return window.demo.commits.length;});
  await page.getByRole('button',{name:'Opacity',exact:true}).click();
  const slider=page.getByRole('slider',{name:'Opacity',exact:true});await expect(slider).toHaveValue('100');
  const r=await slider.boundingBox();await page.mouse.move(r.x+r.width-5,r.y+r.height/2);await page.mouse.down();
  for(const t of [.75,.25,.5])await page.mouse.move(r.x+r.width*t,r.y+r.height/2);
  await expect(slider).toHaveValue('50');
  await expect.poll(pixel).not.toEqual(full);const half=await pixel();
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(before);
  await page.mouse.up();await expect.poll(()=>page.evaluate(()=>window.demo.commits.length)).toBe(before+1);
  expect(await page.evaluate(()=>JSON.parse(window.demo.commits.at(-1)).stickers[0].opacity)).toBe(.5);
  expect(await page.evaluate(()=>{const s=window.demo.session;return s.frames.get(s.model.selected)===window.opacityFrame;})).toBe(true);
  await slider.focus();await page.keyboard.press('ArrowLeft');await expect(slider).toHaveValue('49');
  const committed=await page.evaluate(()=>window.demo.commits.length);
  await slider.evaluate(input=>{input.value='20';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.keyboard.press('Escape');await expect(slider).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Duplicate',exact:true})).toBeEnabled();
  expect(await page.evaluate(()=>window.demo.session.model.state.stickers[0].opacity)).toBe(.49);
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(committed);
  await page.getByRole('button',{name:'Opacity',exact:true}).click();
  await slider.evaluate(input=>{input.value='10';input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true}));});
  await expect(slider).toHaveCount(0);
  expect(await page.evaluate(()=>window.demo.session.model.state.stickers[0].opacity)).toBe(.49);
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(committed);
  await page.getByRole('button',{name:'Opacity',exact:true}).click();await slider.focus();await page.keyboard.press('Home');
  await expect(slider).toHaveValue('0');await expect.poll(pixel).not.toEqual(half);const empty=await pixel();
  full.forEach((v,i)=>expect(Math.abs(half[i]-(v+empty[i])/2)).toBeLessThanOrEqual(2));
  await page.keyboard.press('End');await expect(slider).toHaveValue('100');await expect.poll(pixel).toEqual(full);
  await page.screenshot({path:'test-results/opacity-control.png'});
  await page.keyboard.press('Escape');

});

test('Duplicate offsets the copy visibly, preserves its settings, and stays on a valid surface near the edge',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0');
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await expect(page.getByTestId('surface-stage')).toHaveAttribute('data-selection-ready','true');
  const before=await page.evaluate(()=>({st:window.demo.session.model.state.stickers[0],commits:window.demo.commits.length}));
  let downloads=0;
  await page.route('**/tests/browser/fixtures/sticker.png',route=>{downloads++;return route.continue();});
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','2');
  const result=await page.evaluate(()=>{
    const s=window.demo.session,c=document.querySelector('canvas'),r=c.getBoundingClientRect(),meta=s.entry.meta,scale=Math.min(r.width/meta.image_w,r.height/meta.image_h);
    const [original,copy]=s.model.state.stickers;
    return {copy,selected:s.model.selected,commits:window.demo.commits.length,offset:copy.anchor.map((v,i)=>(v-original.anchor[i])*[meta.image_w,meta.image_h][i]*scale)};
  });
  result.offset.forEach(v=>expect(v).toBeCloseTo(20,1));
  const {id,name,anchor,...settings}=result.copy;
  const {id:originalId,name:originalName,anchor:originalAnchor,...originalSettings}=before.st;
  expect(id).not.toBe(originalId);expect(result.selected).toBe(id);expect(settings).toEqual(originalSettings);
  expect(result.commits).toBe(before.commits+1);
  await expect.poll(()=>page.evaluate(()=>window.demo.session.frames.size)).toBe(2);
  expect(downloads).toBe(0);
  await page.screenshot({path:'test-results/duplicate-offset.png'});
  await page.evaluate(async()=>{const s=window.demo.session;s.setSticker(s.model.selected,{anchor:[.99,.99]});await s.update();});
  await page.locator('.ss-surface').focus();await page.keyboard.press('Control+d');
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','3');
  const edge=await page.evaluate(()=>{const s=window.demo.session,copy=s.model.state.stickers.at(-1);return {anchor:copy.anchor,valid:s.validAnchor(copy.anchor)};});
  expect(edge.valid).toBe(true);expect(edge.anchor).not.toEqual([.99,.99]);
  edge.anchor.forEach(v=>{expect(v).toBeGreaterThanOrEqual(0);expect(v).toBeLessThanOrEqual(1);});
});


test('surface has no header, debug control or layer list',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await expect(page.locator('.ss-toolbar')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Debug surface regions',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Layers',exact:true})).toHaveCount(0);
  const surface=await page.locator('.ss-surface').boundingBox(),stage=await page.getByTestId('surface-stage').boundingBox();
  expect(stage.y-surface.y).toBeLessThan(3);
});


test('bottom action islands have no border',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  for(const selector of ['.ss-add-island','.ss-selection-bar'])expect(await page.locator(selector).evaluate(e=>getComputedStyle(e).borderTopWidth)).toBe('0px');
});
