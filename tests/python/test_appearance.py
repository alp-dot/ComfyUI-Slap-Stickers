import numpy as np
import torch
import pytest
from slap_stickers.appearance import analyze, blur_width
from slap_stickers.geometry_input import read_geometry
from tests.python.test_grid import geometry
import json
from pathlib import Path
from PIL import Image
from PIL import ImageDraw
from slap_stickers.grid import build_grid
from slap_stickers.state import parse_state
from slap_stickers.render import render
from slap_stickers.lighting import srgb
from slap_stickers.appearance import grain


def test_uniform_surface_has_neutral_detail_no_blur_and_finite_maps():
    packet=geometry(64,48)
    packet['image'].fill_(.5)
    fields=analyze(read_geometry(packet))
    assert set(fields)=={'detail','color','finish','clip'}
    assert all(np.isfinite(v).all() and v.dtype==np.float16 for v in fields.values())
    np.testing.assert_allclose(fields['detail'][...,:2],1,atol=.003)
    assert fields['detail'][...,2:].max()<.001


def test_measured_blur_increases_for_a_blurred_edge():
    x=torch.arange(256,dtype=torch.float32)-128
    sharp=(x>=0).float()[None,None,None].expand(1,1,48,-1)
    soft=(.5*(1+torch.erf(x/(3*2**.5))))[None,None,None].expand_as(sharp)
    sharp_width,sharp_weight=blur_width(sharp)
    soft_width,soft_weight=blur_width(soft)
    assert torch.median(sharp_width[sharp_weight>.5])<.8
    assert 2.5<float(torch.median(soft_width[soft_weight>.5]))<3.5


def test_final_color_matches_shared_linear_compositing_fixture(tmp_path):
    case=json.loads(Path('tests/fixtures/render/appearance.json').read_text())
    assert abs(float(grain(torch.tensor(case['grain']['at'][0]),torch.tensor(case['grain']['at'][1])))-case['grain']['value'])<1e-6
    source=Image.new('RGBA',(32,32),tuple(case['source']))
    ImageDraw.Draw(source).rectangle((0,0,7,31),fill=tuple(case['source_alt']));source.save(tmp_path/'logo.png')
    packet=geometry(64,64);packet['image'][:]=torch.tensor(case['background'])/255
    data=read_geometry(packet)
    state=parse_state(json.dumps({'version':2,'blend':case['blend'],'stickers':[{'source':{'filename':'logo.png'},'opacity':case['opacity']}]}))
    fields={name:np.array(case[name],dtype='<f2')[None,None] for name in ('detail','color','finish')}
    out,_,_=render(data,build_grid(data),state,tmp_path,'cpu',appearance=fields)
    np.testing.assert_allclose(out[0,32,32].numpy()*255,case['center_rgb'],atol=1)


def test_occlusion_alpha_follows_the_photo_edge_inside_a_coarse_depth_boundary():
    packet=geometry(8,8);packet['depth'][:,:,:4]=1;packet['depth'][:,:,4:]=3
    packet['image']=torch.full((1,64,64,3),.1);packet['image'][:,:,:35]=.7
    matte=analyze(read_geometry(packet))['clip']
    assert matte[32,33,2]>.7
    assert matte[32,37,2]<.25


@pytest.mark.parametrize('curved',[False,True])
def test_patterned_surface_does_not_copy_dark_bands_into_illumination(curved):
    packet=geometry(256,256);x=torch.linspace(-.6,.6,256)
    if curved:packet['normal']=torch.stack((x,torch.zeros_like(x),-torch.sqrt(1-x*x)),-1)[None,None].expand(1,256,-1,3).clone()
    packet['image'][:]=torch.where((torch.arange(256)//16)%2==0,.3,.7)[None,None,:,None]
    illumination=analyze(read_geometry(packet))['detail'][128,:,0]
    assert abs(float(np.median(illumination[40:232:32]))-float(np.median(illumination[56:232:32])))<.15


def test_a_single_cast_shadow_is_retained_on_a_plain_surface():
    packet=geometry(256,256);x=torch.linspace(-.6,.6,256)
    packet['normal']=torch.stack((x,torch.zeros_like(x),-torch.sqrt(1-x*x)),-1)[None,None].expand(1,256,-1,3).clone()
    packet['image'][:,:,:128]=.2;packet['image'][:,:,128:]=.6
    illumination=analyze(read_geometry(packet))['detail'][128,:,0]
    assert illumination[118]<.8
    assert illumination[138]>1.2


def test_grain_strength_is_measured_from_a_noisy_flat_surface():
    packet=geometry(128,128)
    noise=torch.randn((1,128,128,1),generator=torch.Generator().manual_seed(4))*.02
    packet['image']=srgb((.2+noise).expand(-1,-1,-1,3))
    strength=analyze(read_geometry(packet))['detail'][...,3]
    assert .012<float(np.median(strength))<.03


def test_defocus_blurs_alpha_beyond_the_print_edge_before_occlusion(tmp_path):
    Image.new('RGBA',(128,128),'red').save(tmp_path/'red.png');data=read_geometry(geometry(256,256))
    state=parse_state(json.dumps({'version':2,'stickers':[{'source':{'filename':'red.png'},'mode':'flat','size':.1}]}))
    fields={name:np.array(value,dtype='<f2')[None,None] for name,value in {'detail':[1,1,3,0],'color':[.2,.2,.2,.1],'finish':[1,1,1,0]}.items()}
    _,_,alpha=render(data,build_grid(data),state,tmp_path,'cpu',appearance=fields)
    assert .01<float(alpha[0,128,143])<.4
    assert float(alpha[0,128,150])<.01


def test_subpixel_print_preserves_covered_area(tmp_path):
    Image.new('RGBA',(128,128),'white').save(tmp_path/'white.png');data=read_geometry(geometry(65,65))
    state=parse_state(json.dumps({'version':2,'blend':0,'stickers':[{'source':{'filename':'white.png'},'mode':'flat','size':.01}]}))
    fields={name:np.array(value,dtype='<f2')[None,None] for name,value in {'detail':[1,1,0,0],'color':[.2,.2,.2,.1],'finish':[1,1,1,0]}.items()}
    _,_,alpha=render(data,build_grid(data),state,tmp_path,'cpu',appearance=fields)
    assert abs(float(alpha.sum())-.65**2)<.01


def test_color_matching_preserves_black_and_white_ink(tmp_path):
    source=Image.new('RGBA',(128,128),'white');ImageDraw.Draw(source).rectangle((0,0,63,127),fill='black');source.save(tmp_path/'ink.png')
    data=read_geometry(geometry(64,64));state=parse_state(json.dumps({'version':2,'stickers':[{'source':{'filename':'ink.png'},'mode':'flat'}]}))
    fields={name:np.array(value,dtype='<f2')[None,None] for name,value in {'detail':[1,1,0,0],'color':[1,1,1,.001],'finish':[1,1,1,0]}.items()}
    out,_,_=render(data,build_grid(data),state,tmp_path,'cpu',appearance=fields)
    assert float(out[0,32,29].max())<.01
    assert float(out[0,32,34].min())>.99
