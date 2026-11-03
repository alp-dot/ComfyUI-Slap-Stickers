import {test,expect} from '@playwright/test';

test('actions stay below the image and hidden stickers remain selectable from fixed thumbnail space',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  const stage=page.getByTestId('surface-stage'),toolbar=page.getByRole('toolbar',{name:'Selected sticker'});
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await expect(page.getByRole('button',{name:'Edit larger',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Erase',exact:true})).toHaveCount(0);
  await expect(page.locator('dialog')).toHaveCount(0);
  const thumbnails=page.getByRole('list',{name:'Stickers'});
  await expect(thumbnails).toBeVisible();
  const initial=await toolbar.boundingBox(),image=await stage.boundingBox(),strip=await thumbnails.boundingBox();
  expect(initial.y).toBeGreaterThanOrEqual(image.y+image.height);
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  await expect(thumbnails.getByRole('button')).toHaveCount(2);
  expect(await toolbar.boundingBox()).toEqual(initial);
  expect(await thumbnails.boundingBox()).toEqual(strip);
  await page.evaluate(()=>{const s=window.demo.session;s.setSticker(s.model.selected,{visible:false});s.model.selected=null;s.notify();});
  await thumbnails.getByRole('button').nth(1).click();
  await expect(page.getByRole('button',{name:'Delete',exact:true})).toBeEnabled();
});

test('Shift-click thumbnails selects a set that can be deleted as one edit',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles('tests/browser/fixtures/sticker.png');
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  const thumbs=page.getByRole('list',{name:'Stickers'}).getByRole('button');
  await thumbs.first().click({modifiers:['Shift']});
  await expect(thumbs.first()).toHaveAttribute('aria-pressed','true');await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Duplicate',exact:true})).toBeDisabled();
  const before=await page.evaluate(()=>window.demo.commits.length);
  await page.getByRole('button',{name:'Delete',exact:true}).click();
  await expect(thumbs).toHaveCount(0);
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(before+1);
});

test('an image URL can be dropped with a projected placement guide',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  await expect(page.getByRole('button',{name:'Add image',exact:true})).toBeEnabled();
  const stage=page.getByTestId('surface-stage'),r=await stage.boundingBox();
  await stage.dispatchEvent('dragover',{clientX:r.x+r.width/2,clientY:r.y+r.height/2,dataTransfer:await page.evaluateHandle(()=>{const dt=new DataTransfer();dt.setData('text/uri-list',new URL('/tests/browser/fixtures/sticker.png',location.href).href);return dt;})});
  await expect(page.locator('.ss-drop-active')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>!!window.demo.session.model.dropFrame?.guide)).toBe(true);
  await stage.dispatchEvent('drop',{clientX:r.x+r.width/2,clientY:r.y+r.height/2,dataTransfer:await page.evaluateHandle(()=>{const dt=new DataTransfer();dt.setData('text/uri-list',new URL('/tests/browser/fixtures/sticker.png',location.href).href);return dt;})});
  await expect(page.getByRole('list',{name:'Stickers'}).getByRole('button')).toHaveCount(1);
  await expect(page.locator('.ss-drop-active')).toHaveCount(0);
});

test('Blend commits one gesture and Escape cancels an unfinished preview',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/');
  const slider=page.getByRole('slider',{name:'Blend',exact:true});await expect(slider).toBeEnabled();
  await slider.evaluate(input=>{input.value='.4';input.dispatchEvent(new Event('input',{bubbles:true}));input.value='.6';input.dispatchEvent(new Event('input',{bubbles:true}));});
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(0);
  await slider.dispatchEvent('change');expect(await page.evaluate(()=>window.demo.commits.length)).toBe(1);
  await slider.evaluate(input=>{input.value='.2';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await slider.focus();await page.keyboard.press('Escape');await expect(slider).toHaveValue('0.6');
  expect(await page.evaluate(()=>window.demo.commits.length)).toBe(1);
});
