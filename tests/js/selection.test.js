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
  assert.ok(controls.rotate[1]>200&&controls.rotate[1]<400);
  assert.equal(controls.rotate[1]-controls.top[1],24);
});

test('ordinary rotate handles are 24 CSS pixels outside the top edge',()=>{
  const frame={corners:[[.25,.25],[.75,.25],[.75,.75],[.25,.75]]};
  const controls=selectionControls({left:0,top:0,width:400,height:400},frame,2);
  assert.deepEqual(controls.rotate,[200,52]);
});

test('the rotate handle moves below the sticker when its top is outside the photo',()=>{
  const frame={corners:[[.25,-.2],[.75,-.2],[.75,.4],[.25,.4]]};
  const controls=selectionControls({left:0,top:0,width:400,height:400},frame);
  assert.deepEqual(controls.top,[200,160]);
  assert.deepEqual(controls.rotate,[200,184]);
});

test('wrapped guide corners follow the actual cylindrical UV mapping',async()=>{
  const {buildGuides}=await import('../../web_src/stage/guides.js');
  const width=129,height=97,field=new Float32Array(width*height*4),points=new Float32Array(width*height*3),valid=new Uint8Array(width*height).fill(1);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=y*width+x,rx=((x+.5)/width-.5)/1.6,ry=((y+.5)/height-.5)/1.6,a=1+rx*rx,z=(3-Math.sqrt(9-8*a))/a;
    points.set([rx*z,ry*z,z],i*3);field.set([Math.atan2(rx*z,3-z),ry*z,z,1],i*4);
  }
  const frame={p0:[0,0,2],n:[0,0,-1],e1:[1,0,0],e2:[0,1,0],w:1,h:.7,pivot:[.5,.5],field,fieldRect:[0,0,width,height],gridSize:[width,height]};
  const guide=buildGuides({width,height,points,valid,intrinsics:[[1.6,0,.5],[0,1.6,.5],[0,0,1]]},frame);
  const expected=[.5+1.6*Math.sin(.5)/(3-Math.cos(.5)),.5-1.6*.35/(3-Math.cos(.5))];
  guide.handles[1].forEach((v,i)=>assert.ok(Math.abs(v-expected[i])<.002));
  assert.equal(guide.handles.length,4);
});
