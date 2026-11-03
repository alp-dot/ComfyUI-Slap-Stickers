"""Read a finite accepted frame only for the scene and parameters that produced it."""
import numpy as np


def saved_frame(grid,sticker,aspect):
    pose=sticker.get('pose')
    if not pose or pose.get('scene')!=getattr(grid,'key',''):return None
    if pose.get('at')!=[*sticker['anchor'],sticker['size'],sticker['rotation']]:return None
    if not pose.get('w',0)>0 or not pose.get('h',0)>0 or abs(pose['w']/pose['h']/aspect-1)>1e-6:return None
    vectors={}
    for key in ('p0','n','e1','e2'):
        a=np.asarray(pose.get(key),dtype=np.float64)
        if a.shape!=(3,) or not np.isfinite(a).all():return None
        vectors[key]=a
    if vectors['p0'][2]<=0:return None
    for key in ('n','e1','e2'):
        if abs(vectors[key]@vectors[key]-1)>.002:return None
    for a,b in (('n','e1'),('n','e2'),('e1','e2')):
        if abs(vectors[a]@vectors[b])>.002:return None
    return {**pose,**vectors}
