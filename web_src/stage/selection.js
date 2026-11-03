// Shared drawing/hit-test geometry; coordinates are in stage canvas pixels.
export function selectionControls(box,frame,pixelRatio=1){
  if(!frame.handles&&frame.corners.length!==4)return null;
  const project=([u,v])=>[box.left+u*box.width,box.top+v*box.height];
  const handles=(frame.handles??frame.corners).map(p=>p?project(p):null),corners=handles.filter(Boolean);
  if(!corners.length)return null;
  const center=frame.center?project(frame.center):corners.reduce((sum,p)=>sum.map((v,i)=>v+p[i]/corners.length),[0,0]);
  const midpoint=(a,b)=>a&&b?a.map((v,i)=>(v+b[i])/2):null;
  const top=frame.top?project(frame.top):frame.top===null?null:midpoint(handles[0],handles[1]);
  const bottom=frame.bottom?project(frame.bottom):midpoint(handles[2],handles[3]);
  const padding=10*pixelRatio,distance=24*pixelRatio;
  const inside=p=>p&&p[0]>=box.left+padding&&p[0]<=box.left+box.width-padding&&p[1]>=box.top+padding&&p[1]<=box.top+box.height-padding;
  for(const edge of [top,bottom,midpoint(handles[0],handles[3]),midpoint(handles[1],handles[2])]){
    if(!edge)continue;
    const direction=edge.map((v,i)=>v-center[i]),length=Math.hypot(...direction)||1;
    const rotate=edge.map((v,i)=>v+direction[i]/length*distance);
    if(inside(edge)&&inside(rotate))return {corners,handles,top:edge,rotate};
  }
  // Large or camera-clipped stickers still need a reachable, short rotate control.
  const rotate=[Math.max(box.left+padding,Math.min(box.left+box.width-padding,(bottom??center)[0])),
    Math.max(box.top+padding+distance,Math.min(box.top+box.height-padding,(bottom??[0,box.top+box.height])[1]+distance))];
  return {corners,handles,top:[rotate[0],rotate[1]-distance],rotate};
}
