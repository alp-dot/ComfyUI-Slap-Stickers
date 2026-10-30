import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {wrapSurface,surfaceTopology} from '../../web_src/wrap.js';
const cases=JSON.parse(readFileSync(new URL('../fixtures/geometry/wrap.json',import.meta.url)));
test('different edge thresholds share one grid workspace',()=>{
  const grid=cases[0],first=surfaceTopology(grid,.04),second=surfaceTopology(grid,.08);
  for(const key of ['normals','dist','basis','heap','positions'])assert.equal(first[key],second[key],key);
  assert.notEqual(first.links,second.links);
  assert.equal(surfaceTopology(grid,.04),first);
});
for(const c of cases)test('Wrap parity '+c.name,()=>{
  const s=wrapSurface(c,c.sticker,c.aspect);
  assert.deepEqual([...s.reached],c.expected.reached.flat());
  assert.deepEqual([...s.region],c.expected.region.flat());
  for(let i=0;i<s.reached.length;i++)if(s.reached[i])for(let axis=0;axis<2;axis++)assert.ok(Math.abs(s.xy[i*2+axis]-c.expected.xy.flat(1)[i][axis])<1e-6,'xy at '+i);
});
test('a proven connected plane uses the same UV and Wrap shading region without a geodesic traversal',async()=>{
  const {interactiveSurface,surfaceTopology}=await import('../../web_src/wrap.js');
  const c=cases[0],grid={...c,points:Float32Array.from(c.points),normals:Float32Array.from(c.normals),valid:Uint8Array.from(c.valid)};
  assert.equal(surfaceTopology(grid).planar,true);
  const fast=interactiveSurface(grid,{...c.sticker,mode:'wrap'},c.aspect),reference=wrapSurface(grid,c.sticker,c.aspect);
  assert.equal(fast.planeShortcut,true);assert.deepEqual([...fast.region],[...reference.region]);
  assert.equal(surfaceTopology({...grid,valid:Uint8Array.from(grid.valid,(v,i)=>i===25?0:v)}).planar,false);
});
