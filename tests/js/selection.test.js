import {test} from 'node:test';
import assert from 'node:assert/strict';
import {displayFrame} from '../../web_src/stage/live.js';
import {selectionControls} from '../../web_src/stage/selection.js';

test('live guides clip behind-camera corners and keep only visible handles',()=>{
  const frame={p0:[0,0,1],e1:[1,0,0],e2:[0,Math.SQRT1_2,Math.SQRT1_2],w:1,h:1,size:1,rotation:0,anchor:[.5,.5]};
  const shown=displayFrame(frame,{size:4,rotation:0,anchor:[.5,.5]},[[1,0,.5],[0,1,.5],[0,0,1]]);
  assert.ok(shown.corners.every(p=>p.every(Number.isFinite)&&p[1]<1.1));
  const controls=selectionControls({left:0,top:0,width:600,height:400},shown);
  assert.equal(controls.corners.length,2);
  assert.ok(controls.rotate[1]<200);
  assert.ok(Math.abs(Math.hypot(controls.rotate[0]-300,controls.rotate[1]-200)-Math.hypot(600,400)/4)<1e-8);
});

test('ordinary rotate handles are 24 CSS pixels outside the top edge',()=>{
  const frame={corners:[[.25,.25],[.75,.25],[.75,.75],[.25,.75]]};
  const controls=selectionControls({left:0,top:0,width:400,height:400},frame,2);
  assert.deepEqual(controls.rotate,[200,52]);
});
