import {test,expect} from '@playwright/test';

test('linear compositing, deterministic grain and defocus agree with the shared output rules',async({page})=>{
  await page.goto('/tests/browser/pages/fixture/?empty=1');
  const result=await page.evaluate(async()=>{
    const {half}=await import('/web_src/appearance.js'),{createSession}=await import('/web_src/session.js'),{renderStage}=await import('/web_src/stage/renderer.js');
    const shared=await(await fetch('/tests/fixtures/render/appearance.json')).json(),w=64,h=64,n=w*h,wire=new ArrayBuffer(n*25);
    const points=new Float32Array(wire,0,n*3),normals=new Float32Array(wire,n*12,n*3),valid=new Uint8Array(wire,n*24,n);valid.fill(1);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;points[i*3]=((x+.5)/w-.5)*2;points[i*3+1]=((y+.5)/h-.5)*2;points[i*3+2]=2;normals[i*3+2]=-1;}
    const urls=[],location=data=>{const url=URL.createObjectURL(new Blob([data]));urls.push(url);return {filename:url};};
    const photo=new OffscreenCanvas(w,h),brush=photo.getContext('2d');brush.fillStyle='#808080';brush.fillRect(0,0,w,h);
    const descriptor={grid:location(wire),preview:location(await photo.convertToBlob()),meta:{format:1,grid_w:w,grid_h:h,image_w:w,image_h:h,intrinsics:[[1,0,.5],[0,1,.5],[0,0,1]]}};
    const sources=new Map(),s=createSession({urlFor:file=>sources.get(file.filename)??file.filename,upload:async file=>{const url=URL.createObjectURL(file);urls.push(url);sources.set(file.name,url);return {name:file.name,type:'input'};}});
    async function scene(values,key){const appearance={};for(const [name,value]of Object.entries(values))appearance[name]={...location(new Uint16Array(value.map(half))),width:1,height:1};await s.load({...descriptor,appearance,meta:{...descriptor.meta,key}});}
    async function add(color,name,alt){brush.fillStyle=color;brush.fillRect(0,0,w,h);if(alt){brush.fillStyle=alt;brush.fillRect(0,0,w/4,h);}await s.addFile(new File([await photo.convertToBlob()],name,{type:'image/png'}));}
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;document.body.append(canvas);
    const pixel=()=>{renderStage(canvas,s.entry,s.model.state.stickers,s.frames,s.sources,null);return [...canvas.getContext('2d').getImageData(32,32,1,1).data];};
    try{
      await scene({detail:[1,1,0,0],color:[.214,.214,.214,.1],finish:[1,1,1,0]},'neutral');await add('#000','black.png');
      s.setSticker(s.model.selected,{opacity:.5});s.replaceState({...s.model.state,blend:0});await s.update();const neutral=pixel();
      s.replaceState({...s.model.state,blend:1});await s.update();const neutralBlended=pixel();
      s.setState(JSON.stringify({version:2,blend:shared.blend,stickers:[]}));
      await scene(Object.fromEntries(['detail','color','finish'].map(name=>[name,shared[name]])),'shared');
      await add(`rgb(${shared.source.slice(0,3).join(',')})`,'color.png',`rgb(${shared.source_alt.slice(0,3).join(',')})`);s.setSticker(s.model.selected,{opacity:shared.opacity});await s.update();const matched=pixel();
      await scene({detail:[1,1,3,0],color:shared.color,finish:shared.finish},'blurred');s.replaceState({...s.model.state,blend:1});s.setSticker(s.model.selected,{mode:'flat',size:.4,opacity:1});await s.update();
      const f=s.frames.get(s.model.selected),b=f.bitmap,layer=new OffscreenCanvas(b.width,b.height);layer.getContext('2d').drawImage(b,0,0);
      const tail=layer.getContext('2d').getImageData(47-f.bitmapRect[0],32-f.bitmapRect[1],1,1).data[3];
      return {neutral,neutralBlended,matched,tail,expected:shared.center_rgb};
    }finally{s.dispose();canvas.remove();for(const url of urls)URL.revokeObjectURL(url);}
  });
  expect(result.neutral[0]).toBeGreaterThanOrEqual(91);expect(result.neutral[0]).toBeLessThanOrEqual(94);
  expect(result.neutral[1]).toBe(result.neutral[0]);expect(result.neutral[2]).toBe(result.neutral[0]);
  expect(result.neutralBlended).toEqual(result.neutral);
  for(let i=0;i<3;i++)expect(Math.abs(result.matched[i]-result.expected[i])).toBeLessThanOrEqual(1);
  expect(result.tail).toBeGreaterThan(2);expect(result.tail).toBeLessThan(102);
});
