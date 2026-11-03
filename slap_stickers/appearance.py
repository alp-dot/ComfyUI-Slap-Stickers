"""Background-only, linear-light analysis. Serialized half-float maps feed both renderers."""
import math
from dataclasses import replace
import numpy as np
import torch
import torch.nn.functional as F
from .lighting import linear
from .geometry_input import nearest
from .grid import build_grid

WEIGHTS=(.2126,.7152,.0722)
ANALYSIS_VERSION=1


def gaussian(value,sigma):
    if sigma<.05:return value
    radius=max(1,math.ceil(3*sigma))
    x=torch.arange(-radius,radius+1,device=value.device,dtype=value.dtype)
    kernel=torch.exp(-x*x/(2*sigma*sigma));kernel/=kernel.sum()
    channels=value.shape[1]
    value=F.conv2d(F.pad(value,(radius,radius,0,0),mode='replicate'),kernel[None,None,None].expand(channels,1,1,-1),groups=channels)
    return F.conv2d(F.pad(value,(0,0,radius,radius),mode='replicate'),kernel[None,None,:,None].expand(channels,1,-1,1),groups=channels)


def _box(value,radius):
    # Separable box filtering keeps the guided filter independent of radius squared.
    value=F.avg_pool2d(F.pad(value,(radius,radius,0,0),mode='replicate'),(1,2*radius+1),stride=1)
    return F.avg_pool2d(F.pad(value,(0,0,radius,radius),mode='replicate'),(2*radius+1,1),stride=1)


def _maximum(value,radius):
    value=F.max_pool2d(value,(1,2*radius+1),1,(0,radius))
    return F.max_pool2d(value,(2*radius+1,1),1,(radius,0))


def guided(value,radius,epsilon=.002):
    mean=_box(value,radius);variance=(_box(value*value,radius)-mean*mean).clamp(min=0)
    a=variance/(variance+epsilon);b=mean*(1-a)
    return _box(a,radius)*value+_box(b,radius)


def _derivatives(value):
    padded=F.pad(value,(1,1,1,1),mode='replicate')
    dx=(padded[:,:,1:-1,2:]-padded[:,:,1:-1,:-2])*.5
    dy=(padded[:,:,2:,1:-1]-padded[:,:,:-2,1:-1])*.5
    return dx,dy


def _gradient(value):
    return torch.hypot(*_derivatives(value))


def blur_width(luma):
    clean=gaussian(luma,.8);g=_gradient(clean);g2=_gradient(gaussian(clean,1.5))
    ratio=g/g2.clamp(min=1e-6)
    sigma=(2.25/(ratio*ratio-1).clamp(min=.01)-.64).clamp(min=0).sqrt().clamp(max=12)
    # Measure at ridge centers, not the wings of the same edge.
    peak=g>=F.max_pool2d(g,5,1,2)*.98
    reliable=peak&(g>.008)&(ratio>1.015)&(ratio<8)
    return sigma,reliable.float()


def _normal_light(data,luma,shape):
    grid=build_grid(replace(data,mask=None),long_side=max(shape));normal=nearest(grid.normals,*shape).astype(np.float64)
    yy=luma[0,0].detach().cpu().numpy().astype(np.float64)
    valid=nearest(data.measured_valid if data.measured_valid is not None else data.valid,*shape)&np.isfinite(normal).all(-1)&(yy>.005)&(yy<.95)
    indices=np.flatnonzero(valid.ravel())[::max(1,int(valid.sum())//20000)]
    if len(indices)<16:return None,0.
    design=np.concatenate((np.ones((*shape,1)),normal),-1);x=design.reshape(-1,4)[indices];y=yy.ravel()[indices]
    weights=np.ones_like(y)
    for _ in range(3):
        fit=np.linalg.lstsq(x*weights[:,None],y*weights,rcond=None)[0]
        residual=np.abs(y-x@fit);scale=max(.01,float(np.median(residual))*1.4826)
        weights=np.minimum(1,1.5*scale/np.maximum(residual,1e-8))
    prediction=np.maximum(design@fit,.005)
    # A nearly constant normal cannot explain illumination; retain the image estimate.
    variation=np.std(x[:,1:],axis=0).max()
    confidence=float(np.clip(variation/.12,0,1))
    return torch.as_tensor(prediction,device=luma.device,dtype=luma.dtype)[None,None],confidence


def occlusion_field(data,luma):
    h,w=luma.shape[2:]
    depth=torch.as_tensor(data.depth.copy(),device=luma.device,dtype=luma.dtype)[None,None]
    near=-F.max_pool2d(-depth,3,1,1);far=F.max_pool2d(depth,3,1,1)
    near=F.interpolate(near,size=(h,w),mode='nearest');far=F.interpolate(far,size=(h,w),mode='nearest')
    scene=F.interpolate(depth,size=(h,w),mode='nearest')
    # Extend the two depth supports beyond the filter window; a constant foreground
    # is opaque support, rather than the undefined 0/0 of a one-depth neighborhood.
    wide_near=F.interpolate(-F.max_pool2d(-depth,7,1,3),size=(h,w),mode='nearest')
    wide_far=F.interpolate(F.max_pool2d(depth,7,1,3),size=(h,w),mode='nearest')
    alpha=((wide_far-scene)/(wide_far-wide_near).clamp(min=1e-5)).clamp(0,1)
    radius=min(24,max(3,math.ceil(w/data.depth.shape[1]*1.5)))
    mean=_box(luma,radius);mean_p=_box(alpha,radius)
    variance=(_box(luma*luma,radius)-mean*mean).clamp(min=0)
    covariance=_box(luma*alpha,radius)-mean*mean_p
    a=covariance/(variance+.0001);b=mean_p-a*mean
    refined=(_box(a,radius)*luma+_box(b,radius)).clamp(0,1)
    foreground=(alpha>.95).float();background=(alpha<.05).float()
    fw,bw=_box(foreground,radius*2),_box(background,radius*2)
    fg=_box(luma*foreground,radius*2)/fw.clamp(min=1e-5)
    bg=_box(luma*background,radius*2)/bw.clamp(min=1e-5)
    difference=fg-bg
    photo_alpha=((luma-bg)/torch.where(difference.abs()>.005,difference,torch.ones_like(difference))).clamp(0,1)
    confidence=((difference.abs()-.02)/.15).clamp(0,1)*(fw>.03)*(bw>.03)
    refined=refined*(1-confidence)+photo_alpha*confidence
    boundary=(far-near)>.03*near
    return torch.cat((near.clamp(min=1e-5).log2(),far.clamp(min=1e-5).log2(),refined,boundary.float()),1)


@torch.no_grad()
def analyze(data):
    rgb=linear(data.image.detach().float()).permute(0,3,1,2)
    h,w=rgb.shape[2:];scale=min(1,1024/max(h,w));shape=(max(1,round(h*scale)),max(1,round(w*scale)))
    small=F.interpolate(rgb,size=shape,mode='area') if scale<1 else rgb
    weights=rgb.new_tensor(WEIGHTS)[None,:,None,None]
    luma=(small*weights).sum(1,keepdim=True);raw=(rgb*weights).sum(1,keepdim=True)
    radius=max(1,round(min(shape)*.025));broad=guided(luma,radius)
    local=_box(broad,max(1,radius*3)).clamp(min=.005)
    image_light=(broad/local).clamp(.25,2.5)
    fitted,confidence=_normal_light(data,luma,shape)
    if fitted is not None:
        residual=luma-fitted
        repeated=torch.zeros_like(luma)
        support=max(3,radius*3)
        # Repeated opposite edges indicate albedo pattern. A single shadow edge
        # does not: its strong gradient has no comparable opposite partner.
        for gradient in _derivatives(gaussian(residual,1)):
            positive=_maximum(gradient,support).clamp(min=0)
            negative=_maximum(-gradient,support).clamp(min=0)
            weaker=torch.minimum(positive,negative);stronger=torch.maximum(positive,negative)
            repeated=torch.maximum(repeated,((weaker>stronger*.25)&(weaker>local*.01)).float())
        fitted=(fitted/_box(fitted,max(1,radius*3)).clamp(min=.005)).clamp(.25,2.5)
        pattern=(_box(residual.abs(),radius)/local).clamp(0,1)
        mix=(pattern*8*max(.7,confidence)).clamp(0,1)*_box(repeated,radius)
        image_light=image_light*(1-mix)+fitted*mix
    mean=gaussian(small,max(1,min(shape)*.018))
    contrast=(_box((luma-_box(luma,radius))**2,radius)+1e-7).sqrt()
    mean_luma=(mean*weights).sum(1,keepdim=True).clamp(min=.005)
    tint=(1+.25*((mean/mean_luma).clamp(.65,1.35)-1)).clamp(.8,1.2)
    saturation=(small.amax(1,keepdim=True)-small.amin(1,keepdim=True))/small.amax(1,keepdim=True).clamp(min=.005)
    highlights=((luma-broad).clamp(min=0)*(1-saturation)).clamp(max=.2)
    measured,confidence=blur_width(luma)
    depth=torch.as_tensor(nearest(data.depth,*shape).copy(),device=rgb.device)[None,None]
    blur=torch.zeros_like(luma)
    # Log-depth bands exclude sharp foreground edges from the support behind them.
    log=depth.clamp(min=1e-5).log();lo,hi=log.min(),log.max()
    bands=torch.clamp(((log-lo)/(hi-lo).clamp(min=1e-6)*12).long(),0,11)
    for band in range(12):
        area=bands==band;support=area*confidence
        values=measured[support>.5]
        fallback=values.median() if values.numel() else measured.new_tensor(0)
        local_weight=_box(support.float(),max(2,radius*2))
        estimate=_box(measured*support,max(2,radius*2))/local_weight.clamp(min=1e-6)
        blur=torch.where(area,torch.where(local_weight>.002,estimate,fallback)/scale,blur)
    clean=gaussian(raw,.8);high=raw-clean;gradient=_gradient(clean)
    flat=(gradient<.004)&(raw>.01)&(raw<.9)
    residual=high[flat];noise=(residual.abs().median()*1.4826/ .75) if residual.numel() else raw.new_tensor(0)
    detail=(clean/gaussian(clean,2.5).clamp(min=.005)).clamp(.65,1.5)
    if data.sky is not None:
        sky=torch.as_tensor(nearest(data.sky,h,w),device=rgb.device)[None,None]
        detail=torch.where(sky,torch.ones_like(detail),detail)
        small_sky=torch.as_tensor(nearest(data.sky,*shape),device=rgb.device)[None,None]
        image_light=torch.where(small_sky,torch.ones_like(image_light),image_light)
    up=lambda value:F.interpolate(value,size=(h,w),mode='bilinear',align_corners=False)
    fields={'detail':torch.cat((up(image_light),detail,up(blur),torch.ones_like(raw)*noise.clamp(max=.05)),1),
            'color':torch.cat((mean,contrast),1),'finish':torch.cat((tint,highlights),1),'clip':occlusion_field(data,raw)}
    return {name:value[0].permute(1,2,0).cpu().numpy().astype('<f2') for name,value in fields.items()}


def source_statistics(rgba):
    weight=rgba[...,3:4];total=weight.sum().clamp(min=1e-6);rgb=rgba[...,:3]
    mean=(rgb*weight).sum((0,1))/total
    luma=(rgb*rgb.new_tensor(WEIGHTS)).sum(-1,keepdim=True)
    lm=(luma*weight).sum()/total
    contrast=(((luma-lm)**2*weight).sum()/total).sqrt()
    return torch.cat((mean,contrast[None]))


def match_color(color,detail,local,finish,stats,strength):
    luma=(color*color.new_tensor(WEIGHTS)).sum(-1,keepdim=True)
    ratio=(local[...,3:4]/stats[3].clamp(min=.02)).clamp(.65,1.2)
    adjusted=(color-stats[:3])*ratio+stats[:3]+.12*(local[...,:3]-stats[:3])
    saturation=(local[...,:3].amax(-1,keepdim=True)-local[...,:3].amin(-1,keepdim=True))/local[...,:3].amax(-1,keepdim=True).clamp(min=.005)
    adjusted=luma+(adjusted-luma)*(.85+.15*saturation)
    # Adapt midtones without washing out ink endpoints or flat-color graphics.
    confidence=((stats[3]-.005)/.015).clamp(0,1)
    adjusted=color+(adjusted-color)*(4*luma*(1-luma)).clamp(0,1)*confidence
    adjusted=adjusted.clamp(min=0)*detail[...,:1]*detail[...,1:2]*finish[...,:3]+finish[...,3:4]*.3
    return color*(1-strength)+adjusted.clamp(0,1)*strength


def grain(x,y):
    q=(x.to(torch.int64)*1973+y.to(torch.int64)*9277+89173)&0xffffffff
    q=((q^(q>>16))*2246822519)&0xffffffff
    q=((q^(q>>13))*3266489917)&0xffffffff;q=q^(q>>16)
    return ((q&65535).float()/65535-.5)*3.464101615


def sample_source(rgba,uv,dx,dy,sigma):
    """Premultiplied linear mip filtering, then a nine-tap Gaussian before scene clipping."""
    uv=torch.nan_to_num(uv,nan=-10,posinf=-10,neginf=-10)
    dx=torch.nan_to_num(dx,nan=0,posinf=1e6,neginf=-1e6);dy=torch.nan_to_num(dy,nan=0,posinf=1e6,neginf=-1e6)
    size=uv.new_tensor([rgba.shape[3],rgba.shape[2]])
    footprint=torch.maximum(torch.linalg.vector_norm(dx*size,dim=-1),torch.linalg.vector_norm(dy*size,dim=-1))
    lod=torch.log2(footprint.clamp(min=1)).clamp(min=0)
    sigma=(sigma*sigma-.16/(footprint*footprint).clamp(min=1e-6)).clamp(min=0).sqrt()
    lod+=torch.log2((sigma*.8).clamp(min=1))
    aa=(dx.abs()+dy.abs())*torch.maximum(torch.ones_like(sigma),sigma*.5)[...,None]
    levels=[rgba]
    for _ in range(math.floor(math.log2(max(rgba.shape[2:])))):
        shape=(max(1,levels[-1].shape[2]//2),max(1,levels[-1].shape[3]//2))
        levels.append(F.interpolate(levels[-1],size=shape,mode='area'))
    lod=lod.clamp(max=len(levels)-1);lower=lod.floor().long();fraction=lod-lower
    def sample(at):
        value=uv.new_zeros((*uv.shape[:2],4))
        for level in range(int(lower.min()),min(len(levels),int(lower.max())+2)):
            weight=torch.where(lower==level,1-fraction,torch.where(lower+1==level,fraction,0))
            if not (weight>0).any():continue
            sampled=F.grid_sample(levels[level],(at*2-1)[None],align_corners=False,padding_mode='border')[0].permute(1,2,0)
            value+=sampled*weight[...,None]
        edge_alpha=((torch.minimum(at+aa*.5,torch.ones_like(at))-torch.maximum(at-aa*.5,torch.zeros_like(at)))/aa.clamp(min=1e-7)).clamp(0,1)
        return value*(edge_alpha[...,0]*edge_alpha[...,1])[...,None]
    if not (sigma>=.15).any():return sample(uv)
    result=torch.zeros((*uv.shape[:2],4),device=uv.device)
    for y in (-1,0,1):
        for x in (-1,0,1):
            shift=(dx*x+dy*y)*(sigma*math.sqrt(2))[...,None]
            result+=sample(uv+shift)*((2 if x==0 else 1)*(2 if y==0 else 1)/16)
    return result
