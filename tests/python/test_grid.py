import numpy as np
import pytest
import torch

from slap_stickers.geometry_input import read_geometry
from slap_stickers.grid import build_grid, encode_grid, decode_grid


def geometry(h=4, w=6):
    return {"points": torch.zeros(1, h, w, 3), "depth": torch.full((1, h, w), 2.0),
            "intrinsics": torch.tensor([[[1., 0, .5], [0, 1., .5], [0, 0, 1.]]]),
            "mask": torch.ones(1, h, w, dtype=torch.bool), "image": torch.full((1, h, w, 3), .5)}


def test_rebuilds_points_and_roundtrips_the_wire_grid():
    packet = geometry()
    grid = build_grid(read_geometry(packet), long_side=3)
    assert (grid.width, grid.height) == (3, 2)
    # Sampling chooses source pixel (1,1), regardless of the supplied zero point map.
    np.testing.assert_allclose(grid.points[0, 0], [-.5, -.25, 2.])
    np.testing.assert_allclose(grid.normals[0, 0], [0, 0, -1])
    wire = encode_grid(grid)
    assert len(wire) == 3 * 2 * 25
    decoded = decode_grid(wire, 3, 2, grid.intrinsics)
    np.testing.assert_array_equal(decoded.points, grid.points)
    np.testing.assert_array_equal(decoded.valid, grid.valid)
    np.testing.assert_array_equal(decoded.normals, grid.normals)


def test_invalid_points_never_reach_the_browser_and_mask_is_applied():
    packet = geometry()
    packet["depth"][0, 0, 0] = float("inf")
    packet["depth"][0, 0, 1] = -1
    mask = torch.ones(1, 8, 12)
    mask[:, 4:] = 0
    grid = build_grid(read_geometry(packet, mask=mask))
    assert not grid.valid[0, :2].any()
    assert not grid.valid[2:].any()
    assert np.isfinite(grid.points).all()
    assert (grid.points[~grid.valid.astype(bool)] == 0).all()
    assert (grid.normals[~grid.valid.astype(bool)] == 0).all()


def test_single_cell_and_missing_normal_are_safe():
    grid = build_grid(read_geometry(geometry(1, 1)))
    np.testing.assert_array_equal(grid.normals, [[[0, 0, 0]]])


def test_half_up_grid_size_and_no_upscaling():
    g = build_grid(read_geometry(geometry(3, 6)), long_side=3)
    assert (g.width, g.height) == (3, 2)
    assert build_grid(read_geometry(geometry(2, 3))).points.shape == (2, 3, 3)


@pytest.mark.parametrize("change, message", [
    (lambda g: g.pop("intrinsics"), "regular camera"),
    (lambda g: g.update(depth=torch.ones(2, 4, 6)), "one image"),
    (lambda g: g.update(points=torch.ones(1, 4, 6, 2)), "point map"),
    (lambda g: g.update(intrinsics=torch.zeros(1, 3, 3)), "camera"),
])
def test_rejects_unusable_geometry(change, message):
    packet = geometry()
    change(packet)
    with pytest.raises(ValueError, match=message):
        read_geometry(packet)


def test_optional_image_keeps_full_resolution_rgb_and_checks_aspect():
    image = torch.ones(1, 8, 12, 4)
    data = read_geometry(geometry(), image=image)
    assert data.image.shape == (1, 8, 12, 3)
    with pytest.raises(ValueError, match="6 × 4.*10 × 10"):
        read_geometry(geometry(), image=torch.ones(1, 10, 10, 3))
    with pytest.raises(ValueError, match="one image"):
        read_geometry(geometry(), image=torch.ones(2, 4, 6, 3))


def test_decoder_rejects_truncated_files():
    with pytest.raises(ValueError, match="surface data"):
        decode_grid(b"", 2, 2, np.eye(3))
