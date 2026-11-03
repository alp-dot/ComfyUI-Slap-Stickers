import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { flatSurface,decodeGrid } from "../../web_src/surface.js";

test('grid decoding follows the transmitted dimensions rather than a second resolution limit',()=>{
  const grid=decodeGrid(new ArrayBuffer(1025*25),{format:1,grid_w:1025,grid_h:1,intrinsics:[[1,0,.5],[0,1,.5],[0,0,1]]});
  assert.equal(grid.width,1025);assert.equal(grid.height,1);
  assert.throws(()=>decodeGrid(new ArrayBuffer(25),{format:1,grid_w:2,grid_h:1}),/incomplete/);
});

const cases = JSON.parse(readFileSync(new URL("../fixtures/geometry/flat.json", import.meta.url)));
test('the grabbed UV point is the surface attachment, not the center',async()=>{
  const c=JSON.parse(readFileSync(new URL('../fixtures/geometry/grip.json',import.meta.url))),grid=cases[0];
  const surface=flatSurface(grid,c,c.aspect);
  for(let i=0;i<4;i++)for(let j=0;j<2;j++)assert.ok(Math.abs(surface.corners[i][j]-c.corners[i][j])<1e-6);
  const {stickerUV}=await import('../../web_src/stage/live.js');
  const uv=stickerUV(surface,c,c.anchor,grid.intrinsics);
  uv.forEach((v,i)=>assert.ok(Math.abs(v-c.uvAtGrip[i])<1e-6));
});
test('a saved accepted surface frame is restored without fitting another plane',()=>{
  const pose=JSON.parse(readFileSync(new URL('../fixtures/geometry/pose.json',import.meta.url)));
  const frame=flatSurface({...cases[0],key:pose.scene},{anchor:[.5,.5],size:.4,rotation:0,edge:.04,pose},1);
  for(const key of ['p0','n','e1','e2'])assert.deepEqual(frame[key],pose[key]);
  assert.equal(frame.w,pose.w);assert.equal(frame.h,pose.h);
});
for (const c of cases) test(`Python/JS Flat parity: ${c.name}`, () => {
  const result = flatSurface(c, c.sticker, c.aspect);
  if (!c.expected) return assert.equal(result, null);
  for (const key of ["p0", "n", "e1", "e2", "bounds"]) {
    result[key].forEach((x, i) => assert.ok(Math.abs(x - c.expected[key][i]) < 1e-6, `${key}[${i}]: ${x}`));
  }
  for (const key of ["w", "h"]) assert.ok(Math.abs(result[key] - c.expected[key]) < 1e-6);
  assert.deepEqual([...result.region], c.expected.region.flat());
});
