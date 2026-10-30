"""Full-resolution Flat/Wrap compositing, full-resolution rendering."""

import math
import hashlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
import torch
import torch.nn.functional as F

from .surface import flat_surface, PLANE_TOL
from .wrap import wrap_surface, surface_topology
from .lighting import lighting_fields, shade


class SourceUnavailable(ValueError):
    """The editor can recover from an unreadable input asset."""


def _source_path(source, input_directory):
    root = Path(input_directory).resolve()
    path = (root / source["subfolder"] / source["filename"]).resolve()
    if not path.is_relative_to(root) or path == root:
        raise ValueError("The sticker source must stay inside ComfyUI/input.")
    return path


def source_fingerprints(state, input_directory):
    digests={}
    result=[]
    for sticker in state['stickers']:
        path=_source_path(sticker['source'],input_directory)
        if path not in digests:
            try:
                digest=hashlib.sha256()
                with path.open('rb') as file:
                    for chunk in iter(lambda:file.read(1024*1024),b''):digest.update(chunk)
                digests[path]=digest.hexdigest()
            except OSError:
                digests[path]=None
        result.append(digests[path])
    return result


def read_source(source, input_directory):
    path=_source_path(source,input_directory)
    try:
        with Image.open(path) as image:
            image.seek(0)
            return ImageOps.exif_transpose(image).convert("RGBA")
    except (OSError, ValueError):
        raise SourceUnavailable(f"Cannot read {source['filename']}. Re-add the sticker or restore it to its saved location in ComfyUI/input.") from None


def _wrap_density(samples, coverage):
    a,b,c,d=samples
    dx=(b-a)+(d-c);dy=(c-a)+(d-b)
    determinant=(dx[...,0]*dy[...,1]-dx[...,1]*dy[...,0]).abs()
    # Border padding repeats UVs; use finite neighboring footprints instead of disabling filtering.
    drawn=(coverage>0)&torch.isfinite(determinant)&(determinant>1e-12)
    if not drawn.any():
        return None
    # Columns of the inverse UV Jacobian give screen pixels per complete source axis.
    axes=torch.stack((torch.hypot(dx[...,1],dy[...,1]),torch.hypot(dx[...,0],dy[...,0])),dim=-1)
    return (axes[drawn]/determinant[drawn,None]).amax(dim=0).cpu().numpy()


def _prefilter(source, surface, intrinsics, width, height):
    axes=np.array([surface['e1']*surface['w'],surface['e2']*surface['h']])
    corners=np.array([surface['p0']+x*axes[0]+y*axes[1] for x,y in ((-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5))])
    projected=corners@intrinsics.T
    if np.any(corners[:,2]<=.05*surface['p0'][2]) or np.any(projected[:,2]<=0):
        return source
    # Bound the projection derivative over the whole rectangle, before image clipping.
    projected_axes=axes@intrinsics.T
    numerator=projected_axes[:,None,:2]*projected[None,:,2,None]-projected[None,:,:2]*projected_axes[:,None,2,None]
    density=np.linalg.norm(numerator*np.array([width,height]),axis=-1).max(axis=1)/projected[:,2].min()**2
    return _resize_source(source,density)


def _resize_source(source,density):
    scale=max(2*density[0]/source.width,2*density[1]/source.height)
    if scale>=1:
        return source
    target=(max(1,math.ceil(source.width*scale)),max(1,math.ceil(source.height*scale)))
    return source.resize(target,Image.Resampling.BOX)


def render(data, grid, state, input_directory, device, interrupt=lambda: None):
    base = data.image.detach().to(device=device, dtype=torch.float32)
    h, w = base.shape[1:3]
    out, union, accumulated = base.clone(), base.new_zeros((1,h,w)), torch.zeros_like(base)
    sources = [(st, read_source(st["source"], input_directory)) for st in state["stickers"]]
    if not any(st["visible"] for st, _ in sources) or not grid.valid.any():
        return out, accumulated, union
    depth = torch.as_tensor(np.where(data.valid, data.depth, 0), device=device, dtype=torch.float32)[None,None]
    valid = torch.as_tensor(data.valid.astype(np.float32), device=device)[None,None]
    gh, gw = data.depth.shape
    inverse = torch.as_tensor(np.linalg.inv(data.intrinsics), device=device, dtype=torch.float32)
    source_spread = F.max_pool2d(torch.where(valid.bool(),depth,-torch.inf),3,1,1) + F.max_pool2d(torch.where(valid.bool(),-depth,-torch.inf),3,1,1)
    luminance, material = lighting_fields(base) if any(st["shading"] for st,_ in sources) else (None, None)
    topologies={}
    for st, source in sources:
        interrupt()
        if not st["visible"]:
            continue
        wrapped = st["mode"] == "wrap"
        if wrapped:
            if st['edge'] not in topologies:topologies[st['edge']]=surface_topology(grid,st['edge'])
            surface=wrap_surface(grid,st,source.width/source.height,topology=topologies[st['edge']])
        else:
            surface=flat_surface(grid,st,source.width/source.height)
        if surface is None:
            continue
        x0, y0 = max(0,math.floor(surface["bounds"][0]*w)-2), max(0,math.floor(surface["bounds"][1]*h)-2)
        x1, y1 = min(w,math.ceil(surface["bounds"][2]*w)+2), min(h,math.ceil(surface["bounds"][3]*h)+2)
        if x1 <= x0 or y1 <= y0:
            continue
        yy, xx = torch.meshgrid((torch.arange(y0,y1,device=device)+.5)/h, (torch.arange(x0,x1,device=device)+.5)/w, indexing="ij")
        coords = torch.stack((xx,yy), -1)[None]
        sample = coords*2-1
        n,p0,e1,e2 = [torch.as_tensor(surface[k], device=device,dtype=torch.float32) for k in ("n","p0","e1","e2")]
        if wrapped:
            reached = surface["reached"].astype(np.float32)
            packed = np.concatenate((surface["xy"]*reached[...,None],
                                     grid.points[...,2,None]*reached[...,None],reached[...,None]),axis=-1)
            field = torch.as_tensor(packed,device=device,dtype=torch.float32).permute(2,0,1)[None]
            def field_at(uv):
                sampled = F.grid_sample(field,(uv*2-1)[None],align_corners=False,padding_mode="border")[0].permute(1,2,0)
                total=sampled[...,3].clamp(min=1e-12)
                return sampled[...,:3]/total[...,None],sampled[...,3]>1e-12
            def uv_at(uv):
                sample,good=field_at(uv)
                return sample[...,:2]/base.new_tensor([surface["w"],surface["h"]])+.5,good
        else:
            def uv_at(uv):
                rays = torch.cat((uv,torch.ones_like(uv[...,:1])), -1) @ inverse.T
                denominator = rays @ n
                distance = (n@p0)/torch.where(denominator.abs() > 1e-12, denominator, torch.full_like(denominator,float("nan")))
                offset = rays*distance[...,None]-p0
                result = torch.stack((offset@e1/surface["w"]+.5,offset@e2/surface["h"]+.5),-1)
                return result, distance > 0
        uv, _ = uv_at(coords[0])
        coverage = torch.zeros_like(xx)
        uv_samples=[]
        for dx,dy in ((-.25,-.25),(.25,-.25),(-.25,.25),(.25,.25)):
            subuv, front = uv_at(coords[0]+base.new_tensor([dx/w,dy/h]))
            if wrapped:uv_samples.append(subuv)
            coverage += ((subuv >= 0).all(-1)&(subuv <= 1).all(-1)&front).float()*.25
        # Four source pixels must all be valid, including samples with zero bilinear weight.
        sx,sy = xx*gw-.5,yy*gh-.5
        ix,iy = sx.floor().long(),sy.floor().long()
        validity = torch.ones_like(xx,dtype=torch.bool)
        pp = torch.zeros((*xx.shape,3),device=device)
        for dx,dy in ((0,0),(1,0),(0,1),(1,1)):
            px,py=(ix+dx).clamp(0,gw-1),(iy+dy).clamp(0,gh-1)
            validity &= valid[0,0,py,px] > .5
            rays = torch.stack(((px+.5)/gw,(py+.5)/gh,torch.ones_like(xx)),-1) @ inverse.T
            wx=(sx-ix) if dx else (1-(sx-ix))
            wy=(sy-iy) if dy else (1-(sy-iy))
            pp += rays*(depth[0,0,py,px]*wx*wy)[...,None]
        region = torch.as_tensor(surface["region"],device=device,dtype=torch.float32)[None,None]
        region = F.max_pool2d(region,3,stride=1,padding=1)
        allowed = F.grid_sample(region,sample,mode="nearest",align_corners=False,padding_mode="border")[0,0] > .5
        edges = source_spread > st["edge"]*depth
        on_edge = F.grid_sample(edges.float(),sample,mode="nearest",align_corners=False,padding_mode="border")[0,0] > .5
        if wrapped:
            reference_depth,reached_here=field_at(coords[0])
            allowed = reached_here & (torch.abs(pp[...,2]-reference_depth[...,2])<=st["edge"]*pp[...,2])
        else:
            allowed &= torch.abs((pp-p0)@n) <= PLANE_TOL*pp[...,2]
        allowed &= validity & ~on_edge
        if data.mask is not None:
            allowed &= torch.as_tensor(data.mask[y0:y1,x0:x1],device=device) >= .5
        coverage *= allowed
        # Pre-filter small stickers before bilinear texture lookup.
        if wrapped:
            density=_wrap_density(uv_samples,coverage)
            if density is not None:source=_resize_source(source,density)
        else:
            source = _prefilter(source,surface,data.intrinsics,w,h)
        rgba = torch.as_tensor(np.asarray(source).copy(),device=device,dtype=torch.float32).permute(2,0,1)[None]/255
        rgba[:,:3] *= rgba[:,3:4]
        sampled = F.grid_sample(rgba,(uv*2-1)[None],align_corners=False,padding_mode="border")[0].permute(1,2,0)
        color = torch.where(sampled[...,3:4]>1e-6,sampled[...,:3]/sampled[...,3:4].clamp(min=1e-6),0)
        if luminance is not None and st["shading"]:
            cells = np.argwhere(surface["region"] > 0)
            if len(cells):
                cells_uv = torch.as_tensor(np.stack(((cells[:,1]+.5)/grid.width,(cells[:,0]+.5)/grid.height),-1),device=device,dtype=torch.float32)[None,None]
                values = F.grid_sample(luminance,cells_uv*2-1,align_corners=False,padding_mode="border").flatten().sort().values
                ref = ((values[(len(values)-1)//2]+values[len(values)//2])*.5).clamp(min=1e-4)
                color = shade(color, luminance[0,0,y0:y1,x0:x1], material[0,:,y0:y1,x0:x1].permute(1,2,0), ref, st["shading"])
        alpha = sampled[...,3]*coverage*st["opacity"]
        aa = alpha[...,None]
        out[0,y0:y1,x0:x1] = out[0,y0:y1,x0:x1]*(1-aa)+color*aa
        accumulated[0,y0:y1,x0:x1] = accumulated[0,y0:y1,x0:x1]*(1-aa)+color*aa
        union[0,y0:y1,x0:x1] = 1-(1-union[0,y0:y1,x0:x1])*(1-alpha)
    colors = torch.where(union[...,None] > 1e-6,accumulated/union[...,None].clamp(min=1e-6),0)
    return out,colors,union
