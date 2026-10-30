"""Local discrete exponential maps, surface wrapping."""
import heapq
import math
import numpy as np
from .surface import flat_surface

_DIRECTIONS=tuple((dx,dy) for dy in (-1,0,1) for dx in (-1,0,1) if dx or dy)
_BITS=tuple(tuple(k for k in range(8) if bits&(1<<k)) for bits in range(256))


def _slices(h,w,dx,dy):
    source=(slice(max(0,-dy),min(h,h-dy)),slice(max(0,-dx),min(w,w-dx)))
    target=(slice(max(0,dy),min(h,h+dy)),slice(max(0,dx),min(w,w+dx)))
    return source,target


def surface_topology(grid,edge):
    """Vectorize edge tests once; the heap loop uses only integer neighbors."""
    h,w=grid.height,grid.width
    z=grid.points[...,2].astype(np.float64);valid=grid.valid.astype(bool)
    links=np.zeros((h,w),np.uint8);lengths=np.zeros((h,w,8),np.float64)
    p=grid.points.astype(np.float64)
    for k,(dx,dy) in enumerate(_DIRECTIONS):
        src,dst=_slices(h,w,dx,dy)
        def connected(a,b):
            return valid[a]&valid[b]&(np.abs(z[a]-z[b])<=edge*np.minimum(z[a],z[b]))
        good=connected(src,dst)
        if dx and dy:
            horizontal=(src[0],dst[1]);vertical=(dst[0],src[1])
            good&=connected(src,horizontal)&connected(src,vertical)&connected(dst,horizontal)&connected(dst,vertical)
        links[src]|=good.astype(np.uint8)<<k
        d=p[dst]-p[src]
        lengths[src+(k,)]=np.sqrt((d*d).sum(axis=-1))
    return links,lengths


def wrap_surface(grid, sticker, aspect, physical_width=None, *, topology=None):
    frame = flat_surface(grid, sticker, aspect, physical_width, frame_only=True)
    if frame is None:
        return None
    h,w=grid.height,grid.width
    p=grid.points.reshape(-1,3).astype(np.float64)
    a=frame['cell'];radius=.5*math.hypot(frame['w'],frame['h'])*1.25
    # Graph distance is never shorter than the straight 3D distance.
    active=(np.linalg.norm(p-p[a],axis=1)<=radius*(1+1e-12)+1e-12)&grid.valid.reshape(-1).astype(bool)
    ids=np.flatnonzero(active)
    normals=grid.normals.reshape(-1,3)[ids].astype(np.float64)
    good=np.linalg.norm(normals,axis=1)>1e-12
    normals[~good]=frame["n"]
    normals /= np.maximum(np.linalg.norm(normals,axis=1,keepdims=True),1e-12)
    normals[np.searchsorted(ids,a)]=frame["n"]
    cosine=normals@frame["n"]
    eligible=np.zeros(h*w,bool);eligible[ids]=cosine>=0
    # Rodrigues in its non-singular form: R(v)=v+k×v+k×(k×v)/(1+cos).
    axis=np.cross(frame["n"],normals)
    def transport(v):
        return v+np.cross(axis,v)+np.cross(axis,np.cross(axis,v))/(1+cosine[:,None]).clip(min=1e-12)
    e1=np.zeros((h*w,3));e2=np.zeros((h*w,3))
    e1[ids]=transport(frame["e1"]);e2[ids]=transport(frame["e2"])
    distance=np.full(h*w,np.inf)
    reached=np.zeros(h*w,np.uint8)
    xy=np.zeros((h*w,2))
    xy[a]=[(p[a]-frame["p0"])@frame["e1"],(p[a]-frame["p0"])@frame["e2"]]
    distance[a]=0
    links,lengths=topology if topology is not None else surface_topology(grid,sticker['edge'])
    steps=np.zeros((h,w,8,2),np.float64)
    pp=p.reshape(h,w,3);basis1=e1.reshape(h,w,3);basis2=e2.reshape(h,w,3)
    rows,cols=np.divmod(ids,w);ymin,ymax=int(rows.min()),int(rows.max())+1;xmin,xmax=int(cols.min()),int(cols.max())+1
    for k,(dx,dy) in enumerate(_DIRECTIONS):
        src=(slice(max(ymin,-dy),min(ymax,h-dy)),slice(max(xmin,-dx),min(xmax,w-dx)))
        dst=(slice(src[0].start+dy,src[0].stop+dy),slice(src[1].start+dx,src[1].stop+dx));d=pp[src]-pp[dst]
        steps[src+(k,0)]=(basis1[dst]*d).sum(axis=-1)
        steps[src+(k,1)]=(basis2[dst]*d).sum(axis=-1)
    links=memoryview(links.reshape(-1));lengths=memoryview(lengths.reshape(-1));steps=memoryview(steps.reshape(-1))
    distances=memoryview(distance);seen=memoryview(reached);coordinates=memoryview(xy.reshape(-1));allowed=memoryview(eligible)
    offsets=tuple(dx+dy*w for dx,dy in _DIRECTIONS)
    heap=[(0.,a)]
    pop,push=heapq.heappop,heapq.heappush
    while heap:
        dist,q=pop(heap)
        if seen[q] or not allowed[q] or dist!=distances[q]:
            continue
        if dist>radius:
            break
        adjacent=_BITS[links[q]];base=q*8
        total=xsum=ysum=0.
        for k in adjacent:
            i=q+offsets[k];length=lengths[base+k]
            if seen[i]:
                if q==a:continue
                weight=1/(length if length>1e-12 else 1e-12);step=(base+k)*2
                xsum+=(coordinates[i*2]+steps[step])*weight
                ysum+=(coordinates[i*2+1]+steps[step+1])*weight
                total+=weight
            else:
                candidate=dist+length
                if candidate<distances[i] and candidate<=radius:
                    distances[i]=candidate;push(heap,(candidate,i))
        if q!=a:
            if not total:
                continue
            coordinates[q*2]=xsum/total;coordinates[q*2+1]=ysum/total
        seen[q]=1
    region=(reached.astype(bool)&(np.abs(xy[:,0])<=frame["w"]/2)&(np.abs(xy[:,1])<=frame["h"]/2)).reshape(h,w).astype(np.uint8)
    yy,xx=np.where(reached.reshape(h,w))
    bounds=[max(0.,(xx.min()-.5)/w),max(0.,(yy.min()-.5)/h),min(1.,(xx.max()+1.5)/w),min(1.,(yy.max()+1.5)/h)]
    return {**frame,"xy":xy.reshape(h,w,2),"reached":reached.reshape(h,w),"region":region,"bounds":bounds}
