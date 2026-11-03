"""Repair small geometry holes and give unmeasured sky a farther spherical surface."""
from dataclasses import replace
import numpy as np


def _invalid_components(valid):
    h,w=valid.shape;parent=[];runs=[];previous=[]
    def root(i):
        while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
        return i
    for y in range(h):
        changes=np.diff(np.r_[0,(~valid[y]).astype(np.int8),0])
        starts=np.flatnonzero(changes==1);ends=np.flatnonzero(changes==-1)
        current=[];j=0
        for a,b in zip(starts,ends):
            label=len(parent);parent.append(label)
            while j<len(previous) and previous[j][1]<=a:j+=1
            k=j
            while k<len(previous) and previous[k][0]<b:
                ra,rb=root(label),root(previous[k][2]);parent[ra]=rb;k+=1
            current.append((int(a),int(b),label));runs.append((y,int(a),int(b),label))
        previous=current
    groups={}
    for y,a,b,label in runs:groups.setdefault(root(label),[]).append((y,a,b))
    return list(groups.values())


def repair_scene(data):
    if data.sky is not None:return data
    h,w=data.depth.shape;measured=data.valid.copy();depth=np.where(measured,data.depth,0).astype(np.float64)
    normal=None if data.normal is None else data.normal.astype(np.float64).copy()
    valid=measured.copy()
    for runs in _invalid_components(measured):
        area=sum(b-a for _,a,b in runs);touches=any(y in (0,h-1) or a==0 or b==w for y,a,b in runs)
        if not (area<=max(16,h*w*.002) or not touches and area<=h*w*.02):continue
        x0=max(0,min(a for _,a,_ in runs)-1);x1=min(w,max(b for _,_,b in runs)+1)
        y0=max(0,runs[0][0]-1);y1=min(h,runs[-1][0]+2)
        target=np.zeros((y1-y0,x1-x0),bool)
        for y,a,b in runs:target[y-y0,a-x0:b-x0]=True
        known=valid[y0:y1,x0:x1].copy();values=depth[y0:y1,x0:x1]
        normals=None if normal is None else normal[y0:y1,x0:x1]
        while np.any(target&~known):
            filled=np.zeros_like(known)
            for axis,direction in ((0,1),(1,1),(1,-1),(0,-1)):
                neighbor=np.roll(known,direction,axis=axis)
                edge=[slice(None),slice(None)];edge[axis]=0 if direction==1 else -1;neighbor[tuple(edge)]=False
                take=target&~known&~filled&neighbor
                if take.any():
                    shifted=np.roll(values,direction,axis=axis);values[take]=shifted[take]
                    if normals is not None:normals[take]=np.roll(normals,direction,axis=axis)[take]
                    filled|=take
            if not filled.any():break
            known|=filled
        valid[y0:y1,x0:x1]|=target&known
    sky=~valid
    # Cull only the measured geometry bordering sky, never the user's allowed-area mask.
    if sky.any() and valid.any():
        adjacent=np.zeros_like(sky)
        adjacent[1:]|=sky[:-1];adjacent[:-1]|=sky[1:];adjacent[:,1:]|=sky[:,:-1];adjacent[:,:-1]|=sky[:,1:]
        sky|=adjacent
    yy,xx=np.mgrid[:h,:w]
    rays=np.stack(((xx+.5)/w,(yy+.5)/h,np.ones((h,w))),-1)@np.linalg.inv(data.intrinsics).T
    lengths=np.linalg.norm(rays,axis=-1)
    radius=max(1.,float(np.max(lengths[measured]*depth[measured]))*4) if measured.any() else 100.
    depth[sky]=radius/lengths[sky]
    if normal is not None:normal[sky]=-rays[sky]/lengths[sky,None]
    return replace(data,depth=depth.astype(np.float32),valid=np.ones_like(valid),normal=normal,sky=sky,measured_valid=measured)
