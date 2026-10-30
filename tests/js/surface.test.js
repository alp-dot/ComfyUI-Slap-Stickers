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
for (const c of cases) test(`Python/JS Flat parity: ${c.name}`, () => {
  const result = flatSurface(c, c.sticker, c.aspect);
  if (!c.expected) return assert.equal(result, null);
  for (const key of ["p0", "n", "e1", "e2", "bounds"]) {
    result[key].forEach((x, i) => assert.ok(Math.abs(x - c.expected[key][i]) < 1e-6, `${key}[${i}]: ${x}`));
  }
  for (const key of ["w", "h"]) assert.ok(Math.abs(result[key] - c.expected[key]) < 1e-6);
  assert.deepEqual([...result.region], c.expected.region.flat());
});
