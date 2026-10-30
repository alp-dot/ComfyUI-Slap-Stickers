// Shared drawing/hit-test geometry; coordinates are in the stage canvas pixels.
export function selectionControls(box,frame,pixelRatio=1){
  if(!frame.handles&&frame.corners.length!==4)return null;
  const project=([u,v])=>[box.left+u*box.width,box.top+v*box.height];
  const corners=(frame.handles??frame.corners).filter(Boolean).map(project);
  if(!corners.length)return null;
  const center=frame.center?project(frame.center):corners[0].map((v,i)=>(v+corners[2][i])/2);
  const clipped=frame.top===null;
  const top=frame.top?project(frame.top):clipped?center:corners[0].map((v,i)=>(v+corners[1][i])/2);
  const d=clipped?[frame.up[0]*box.width,frame.up[1]*box.height]:top.map((v,i)=>v-center[i]),length=Math.hypot(...d)||1;
  const distance=clipped?Math.hypot(box.width,box.height)/4:24*pixelRatio;
  return {corners,top,rotate:top.map((v,i)=>v+d[i]/length*distance)};
}
