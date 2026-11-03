// The compact accepted frame survives save/load; geometry is refitted only after a real edit.
export function savedFrame(grid,sticker,aspect){
  const pose=sticker.pose;if(!pose||pose.scene!==(grid.key??''))return null;
  const at=[...sticker.anchor,sticker.size,sticker.rotation];
  if(!pose.at?.every((v,i)=>v===at[i])||Math.abs(pose.w/pose.h/aspect-1)>1e-6)return null;
  for(const key of ['p0','n','e1','e2'])if(!Array.isArray(pose[key])||pose[key].length!==3||!pose[key].every(Number.isFinite))return null;
  const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
  for(const key of ['n','e1','e2'])if(Math.abs(dot(pose[key],pose[key])-1)>.002)return null;
  if(Math.abs(dot(pose.e1,pose.e2))>.002||Math.abs(dot(pose.n,pose.e1))>.002||Math.abs(dot(pose.n,pose.e2))>.002||!(pose.w>0&&pose.h>0&&pose.p0[2]>0))return null;
  return pose;
}
export function captureFrame(frame,sticker,scene){
  const pose={scene,at:[...sticker.anchor,sticker.size,sticker.rotation],w:frame.w,h:frame.h};
  for(const key of ['p0','n','e1','e2'])pose[key]=Array.from(frame[key],v=>v===0?0:v);
  if(frame.field){pose.baseAnchor=frame.baseAnchor;pose.baseRotation=frame.baseRotation;pose.reach=frame.reach;pose.shift=frame.offset??[0,0];pose.turn=frame.turn??0;}
  return pose;
}
