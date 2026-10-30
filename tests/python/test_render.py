import json
import os
from pathlib import Path

import numpy as np
from PIL import Image
import pytest
import torch

from slap_stickers.geometry_input import read_geometry
from slap_stickers.grid import build_grid
from slap_stickers.render import render
from slap_stickers.state import parse_state
from tests.python.test_grid import geometry


def state(filename="red.png", **overrides):
    st = {"id": "red", "source": {"filename": filename, "subfolder": "", "type": "input"},
          "anchor": [.5, .5], "size": .5, "shading": 0, **overrides}
    return parse_state(json.dumps({"stickers": [st]}))


def test_empty_state_passes_rgb_and_all_empty_outputs(tmp_path):
    data = read_geometry(geometry())
    output, colors, mask = render(data, build_grid(data), parse_state(""), tmp_path, torch.device("cpu"))
    torch.testing.assert_close(output, data.image)
    assert mask.shape == (1, 4, 6)
    assert colors.shape == (1, 4, 6, 3)
    assert not mask.any() and not colors.any()


def test_flat_source_alpha_and_straight_color_output(tmp_path):
    Image.new("RGBA", (4, 4), (255, 0, 0, 128)).save(tmp_path / "red.png")
    data = read_geometry(geometry(16, 16))
    image, colors, mask = render(data, build_grid(data), state(), tmp_path, torch.device("cpu"))
    alpha = 128/255
    assert mask[0, 8, 8].item() == pytest.approx(alpha)
    torch.testing.assert_close(image[0, 8, 8], torch.tensor([.5*(1-alpha)+alpha, .5*(1-alpha), .5*(1-alpha)]))
    torch.testing.assert_close(colors[0, 8, 8], torch.tensor([1., 0, 0]))
    assert mask.sum().item() == pytest.approx(64*alpha, abs=.01)
    assert not mask[0, :4].any()


def test_invisible_sticker_does_not_draw_but_missing_source_is_reported(tmp_path):
    data = read_geometry(geometry())
    with pytest.raises(ValueError, match="missing.png.*Re-add"):
        render(data, build_grid(data), state("missing.png", visible=False), tmp_path, torch.device("cpu"))
    Image.new("RGB", (4, 4), "red").save(tmp_path / "red.png")
    output = render(data, build_grid(data), state(visible=False), tmp_path, torch.device("cpu"))
    assert not output[2].any()


def test_sticker_source_cannot_escape_input_via_symlink(tmp_path):
    outside = tmp_path / "outside.png"
    Image.new("RGB", (4, 4), "red").save(outside)
    root = tmp_path / "input"
    root.mkdir()
    (root / "red.png").symlink_to(outside)
    data = read_geometry(geometry())
    with pytest.raises(ValueError, match="input"):
        render(data, build_grid(data), state(), root, torch.device("cpu"))


def test_union_alpha_and_layer_order(tmp_path):
    Image.new("RGBA", (4, 4), (255, 0, 0, 255)).save(tmp_path / "red.png")
    first = state(opacity=.5)
    second = {**first["stickers"][0], "id": "top"}
    first["stickers"].append(second)
    data = read_geometry(geometry(16, 16))
    _, _, mask = render(data, build_grid(data), first, tmp_path, torch.device("cpu"))
    assert mask[0, 8, 8].item() == pytest.approx(.75)


def test_no_valid_surface_returns_only_empty_combined_mask_and_colors(tmp_path):
    Image.new("RGB",(4,4),"red").save(tmp_path/"red.png")
    packet=geometry()
    packet["mask"][:]=False
    data=read_geometry(packet)
    saved=state()
    saved["stickers"].append({**saved["stickers"][0],"id":"second"})
    output=render(data,build_grid(data),saved,tmp_path,torch.device("cpu"))
    assert len(output)==3
    assert output[2].shape==(1,4,6)
    assert output[1].shape==(1,4,6,3)
    assert not output[1].any()


def test_full_resolution_image_can_use_smaller_geometry(tmp_path):
    Image.new("RGBA",(4,4),(255,0,0,255)).save(tmp_path/"red.png")
    data=read_geometry(geometry(16,16),image=torch.full((1,32,32,3),.5))
    image,_,mask=render(data,build_grid(data),state(),tmp_path,torch.device("cpu"))
    assert image.shape==(1,32,32,3)
    assert mask.sum().item()==pytest.approx(256)


@pytest.mark.parametrize('mode',['flat','wrap'])
@pytest.mark.parametrize('size,rotation,anchor,source_size,extent',[
    (.75,90,[.5,.5],(2048,512),(192,48)),
    (1,0,[.95,.5],(1024,1024),(256,256)),
])
def test_prefilter_preserves_source_axis_density_when_rotated_or_clipped(tmp_path,monkeypatch,size,rotation,anchor,source_size,extent,mode):
    Image.new('RGB',source_size,'red').save(tmp_path/'red.png')
    resized=[];resize=Image.Image.resize
    def observe(image,target,*args,**kwargs):
        resized.append(target)
        return resize(image,target,*args,**kwargs)
    monkeypatch.setattr(Image.Image,'resize',observe)
    data=read_geometry(geometry(256,256))
    output=render(data,build_grid(data),state(size=size,rotation=rotation,anchor=anchor,mode=mode),tmp_path,torch.device(os.environ.get('SS_TEST_DEVICE','cpu')))
    used=resized[-1] if resized else source_size
    assert used[0]>=2*extent[0] and used[1]>=2*extent[1]
    assert abs(used[0]/source_size[0]-used[1]/source_size[1])<=1/min(source_size)
    assert output[2].max()==1


def test_shading_transfers_background_light_without_changing_alpha(tmp_path):
    Image.new("RGB", (8, 8), (128, 128, 128)).save(tmp_path / "gray.png")
    packet = geometry(64, 64)
    packet["image"] = (.25 + .5 * (torch.arange(64) + .5) / 64)[None, None, :, None].expand(1, 64, 64, 3)
    data = read_geometry(packet)
    grid = build_grid(data)
    shaded = render(data, grid, state("gray.png", shading=.8), tmp_path, torch.device("cpu"))
    plain = render(data, grid, state("gray.png", shading=0), tmp_path, torch.device("cpu"))
    torch.testing.assert_close(shaded[2], plain[2])
    assert shaded[0][0, 32, 24, 0] < plain[0][0, 32, 24, 0] - .03
    assert shaded[0][0, 32, 40, 0] > plain[0][0, 32, 40, 0] + .03
    torch.testing.assert_close(plain[0][0, 32, 24], torch.full((3,), 128/255))


@pytest.mark.parametrize("case", json.loads((Path(__file__).parents[1] / "fixtures/compositing.json").read_text()), ids=lambda case: case["name"])
def test_natural_compositing_shared_pixels(tmp_path, case):
    packet = geometry(64, 64)
    background = case["background"]
    if background["kind"] == "solid":
        packet["image"] = torch.tensor(background["rgb"], dtype=torch.float32)[None, None, None].expand(1, 64, 64, 3)/255
    else:
        row = torch.tensor([background["dark"], background["light"]]*32, dtype=torch.float32)
        packet["image"] = row[None, None, :, None].expand(1, 64, 64, 3)/255
    source = case["source"]
    image = Image.fromarray(np.array(source["pixels"], dtype=np.uint8)) if "pixels" in source else Image.new("RGB", (8, 8), tuple(source["rgb"]))
    image.save(tmp_path / "sample.png")
    data = read_geometry(packet)
    output, colors, mask = render(data, build_grid(data), state("sample.png", shading=case["shading"]), tmp_path, torch.device(os.environ.get("SS_TEST_DEVICE", "cpu")))
    for probe in case["probes"]:
        x, y = probe["xy"]
        expected = torch.tensor(probe["rgb"], dtype=torch.float32, device=colors.device)/255
        torch.testing.assert_close(colors[0, y, x], expected, atol=2/255, rtol=0)
        assert mask[0, y, x].item() == pytest.approx(probe["alpha"], abs=2/255)
        alpha = mask[0, y, x]
        torch.testing.assert_close(output[0, y, x], data.image[0, y, x].to(output.device)*(1-alpha)+colors[0, y, x]*alpha)


def test_wrap_render_covers_cylinder_beyond_the_flat_tangent_tolerance(tmp_path):
    from tests.python.test_wrap import cylinder_grid
    grid=cylinder_grid(25,81)
    # This test supplies an analytic surface map directly, without MoGe or learned priors.
    from types import SimpleNamespace
    data=SimpleNamespace(image=torch.full((1,25,81,3),.5),valid=grid.valid.astype(bool),depth=grid.points[...,2],
                         intrinsics=grid.intrinsics,mask=None)
    Image.new('RGBA',(8,8),(255,0,0,255)).save(tmp_path/'red.png')
    wrap=render(data,grid,state(size=1.1,mode='wrap'),tmp_path,torch.device('cpu'))[2]
    flat=render(data,grid,state(size=1.1,mode='flat'),tmp_path,torch.device('cpu'))[2]
    assert wrap[0,12,60]>.9
    assert flat[0,12,60]==0


def test_source_fingerprints_track_restore_replace_and_reject_escape(tmp_path):
    from slap_stickers.render import source_fingerprints
    saved=state('restored.png')
    missing=source_fingerprints(saved,tmp_path)
    assert missing==[None]
    Image.new('RGB',(8,8),'red').save(tmp_path/'restored.png')
    restored=source_fingerprints(saved,tmp_path)
    assert restored!=missing and restored==source_fingerprints(saved,tmp_path)
    Image.new('RGB',(8,8),'blue').save(tmp_path/'restored.png')
    assert source_fingerprints(saved,tmp_path)!=restored
    root=tmp_path/'input';root.mkdir()
    (root/'restored.png').symlink_to(tmp_path/'restored.png')
    with pytest.raises(ValueError,match='input'):
        source_fingerprints(saved,root)


@pytest.mark.parametrize('scene',['plane','cylinder'])
@pytest.mark.parametrize('rotation,anchor',[(0,[.5,.5]),(37,[.5,.5]),(90,[.98,.5])])
def test_small_wrap_filters_high_frequency_source_without_aliasing(tmp_path,scene,rotation,anchor):
    stripe=np.broadcast_to((np.arange(4000)%2*255).astype(np.uint8),(1000,4000)).copy()
    Image.fromarray(stripe).convert('RGB').save(tmp_path/'stripes.png')
    if scene=='plane':
        data=read_geometry(geometry(129,257));grid=build_grid(data)
    else:
        from types import SimpleNamespace
        from tests.python.test_wrap import camera_cylinder_grid
        grid=camera_cylinder_grid(129,257)
        data=SimpleNamespace(image=torch.full((1,129,257,3),.5),valid=grid.valid.astype(bool),depth=grid.points[...,2],intrinsics=grid.intrinsics,mask=None)
    _,colors,mask=render(data,grid,state('stripes.png',size=.1,rotation=rotation,anchor=anchor,mode='wrap'),tmp_path,torch.device(os.environ.get('SS_TEST_DEVICE','cpu')))
    interior=mask>.99
    assert interior.sum()>8
    assert (colors[interior]-.5).abs().max().item()<.025


def test_small_wrap_filters_transparent_pixels_in_premultiplied_color(tmp_path):
    rgba=np.zeros((1000,4000,4),np.uint8);rgba[:,::2,0]=255;rgba[:,::2,3]=255
    Image.fromarray(rgba).save(tmp_path/'transparent-stripes.png')
    data=read_geometry(geometry(129,257))
    _,colors,mask=render(data,build_grid(data),state('transparent-stripes.png',size=.1,mode='wrap'),tmp_path,torch.device(os.environ.get('SS_TEST_DEVICE','cpu')))
    interior=mask>.49
    assert interior.sum()>8
    torch.testing.assert_close(colors[interior],colors.new_tensor([1.,0,0]).expand_as(colors[interior]),atol=.01,rtol=0)
    assert mask.max().item()==pytest.approx(.5,abs=.015)


def test_small_wrap_filters_when_smaller_geometry_meets_the_photo_edge(tmp_path):
    stripe=np.broadcast_to((np.arange(4000)%2*255).astype(np.uint8),(1000,4000)).copy()
    Image.fromarray(stripe).convert('RGB').save(tmp_path/'stripes.png')
    data=read_geometry(geometry(32,64),image=torch.full((1,256,512,3),.5))
    _,colors,mask=render(data,build_grid(data),state('stripes.png',size=.05,anchor=[.99,.5],mode='wrap'),tmp_path,torch.device(os.environ.get('SS_TEST_DEVICE','cpu')))
    interior=mask>.99
    assert interior.sum()>8
    assert (colors[interior]-.5).abs().max().item()<.025
