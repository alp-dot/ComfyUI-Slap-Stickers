import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const cases=JSON.parse(readFileSync(new URL('../fixtures/compositing.json',import.meta.url)));
test('Worker compositing matches shared surface texture, tint and transparent-edge fixtures',async({page})=>{
  await page.goto('/tests/browser/pages/compositing.html');await page.waitForFunction(()=>window.composites);
  const results=await page.evaluate(()=>window.composites);
  for(const c of cases)for(let i=0;i<c.probes.length;i++){
    const actual=results[c.name][i],expected=c.probes[i];
    expected.rgb.forEach((v,j)=>expect(Math.abs(actual[j]-v),c.name+' RGB channel '+j).toBeLessThanOrEqual(2));
    expect(Math.abs(actual[3]/255-expected.alpha),c.name+' alpha').toBeLessThanOrEqual(2/255);
  }
  await page.screenshot({path:'test-results/natural-compositing.png'});
});
