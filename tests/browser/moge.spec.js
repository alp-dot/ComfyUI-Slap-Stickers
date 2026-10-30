import {test,expect} from '@playwright/test';
test('real MoGe background, arbitrary sticker and server composite',async({page})=>{
  test.skip(!process.env.SS_REAL_BACKGROUND,'Set SS_REAL_BACKGROUND to a photo; requires the local GPU MoGe host.');
  test.setTimeout(240000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/dev/');
  await expect(page.getByRole('button',{name:'Choose background'})).toBeEnabled();
  await page.getByLabel('Background image').setInputFiles(process.env.SS_REAL_BACKGROUND);
  await expect(page.getByTestId('surface-status')).toHaveAttribute('data-sticker-count','0',{timeout:180000});
  await expect(page.getByRole('button',{name:'Render composite'})).toBeEnabled();
  await page.locator('.ss-surface input[type=file]').first().setInputFiles('tests/browser/fixtures/sticker.png');
  await expect.poll(()=>page.evaluate(()=>window.surfaceWorkspace.session.frames.size)).toBe(1);
  const pixels=await page.evaluate(async()=>{
    const c=new OffscreenCanvas(37,19),ctx=c.getContext('2d');ctx.fillStyle='#ff1122';ctx.fillRect(0,0,37,19);
    return [...new Uint8Array(await(await c.convertToBlob({type:'image/png'})).arrayBuffer())];
  });
  await page.locator('.ss-surface input[type=file]').setInputFiles({name:'arbitrary-sticker.png',mimeType:'image/png',buffer:Buffer.from(pixels)});
  await expect.poll(()=>page.evaluate(()=>{
    const s=window.surfaceWorkspace.session;return s.sources.get(s.model.selected)?.width;
  })).toBe(37);
  await expect(page.locator('input[type=number]')).toHaveCount(0);
  await page.getByRole('button',{name:'Render composite'}).click();
  await expect(page.getByRole('link',{name:'Open composite'})).toBeVisible({timeout:120000});
  const result=await page.getByRole('link',{name:'Open composite'}).getAttribute('href');
  expect((await page.request.get(result)).ok()).toBe(true);
  const rendered=await page.evaluate(async url=>{
    const image=await createImageBitmap(await(await fetch(url)).blob()),c=new OffscreenCanvas(image.width,image.height),ctx=c.getContext('2d');ctx.drawImage(image,0,0);
    const data=ctx.getImageData(0,0,c.width,c.height).data;let red=0;
    for(let i=0;i<data.length;i+=4)if(data[i]>180&&data[i+1]<80&&data[i+2]<100)red++;
    image.close();return {red,width:c.width,height:c.height};
  },result);
  expect(rendered.red).toBeGreaterThan(20);
  const meta=await page.evaluate(()=>window.surfaceWorkspace.session.entry.meta);
  expect([rendered.width,rendered.height]).toEqual([meta.image_w,meta.image_h]);
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.screenshot({path:'test-results/real-moge-inline.png'});
  console.log('real MoGe:',await page.evaluate(()=>({meta:window.surfaceWorkspace.session.entry.meta,state:window.surfaceWorkspace.session.model.state})));
  expect(errors).toEqual([]);
});
