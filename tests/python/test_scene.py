import numpy as np
import torch
from slap_stickers.geometry_input import read_geometry
from slap_stickers.scene import repair_scene
from tests.python.test_grid import geometry


def test_small_holes_are_filled_but_open_sky_stays_behind_every_measured_surface():
    packet=geometry(32,48)
    packet['mask'][:,:8]=False
    packet['depth'][:,:8]=torch.inf
    packet['mask'][:,20:22,20:22]=False
    packet['depth'][:,20:22,20:22]=torch.inf
    allowed=torch.ones((1,32,48));allowed[:,:,0]=0
    raw=read_geometry(packet,mask=allowed)
    scene=repair_scene(raw)
    assert np.isfinite(scene.depth).all() and scene.valid.all()
    np.testing.assert_allclose(scene.depth[20:22,20:22],2)
    assert not scene.sky[20:22,20:22].any()
    assert scene.sky[:7].all()
    assert scene.depth[:7].min()>scene.depth[10:].max()
    np.testing.assert_array_equal(scene.mask,raw.mask)
    assert not np.isfinite(raw.depth[:7]).any()


def test_an_all_invalid_scene_has_a_finite_deterministic_sphere():
    packet=geometry(12,16);packet['mask'][:]=False;packet['depth'][:]=torch.inf
    raw=read_geometry(packet)
    a,b=repair_scene(raw),repair_scene(raw)
    assert a.valid.all() and a.sky.all()
    assert np.isfinite(a.depth).all() and a.depth.min()>0
    np.testing.assert_array_equal(a.depth,b.depth)
