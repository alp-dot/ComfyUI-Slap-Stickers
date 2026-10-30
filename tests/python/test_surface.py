import json
from pathlib import Path

import numpy as np
import pytest

from slap_stickers.grid import Grid
from slap_stickers.surface import flat_surface, flat_uv


def plane_grid(h=24, w=32, tilt=0):
    yy, xx = np.mgrid[:h, :w]
    rays = np.stack(((xx + .5) / w - .5, (yy + .5) / h - .5, np.ones_like(xx)), axis=-1)
    depth = 2 / (1 - tilt * rays[..., 0])
    points = (rays * depth[..., None]).astype(np.float32)
    n = np.array([tilt, 0, -1.], dtype=np.float32)
    n /= np.linalg.norm(n)
    return Grid(points, np.broadcast_to(n, points.shape).copy(), np.ones((h, w), np.uint8), np.array([[1, 0, .5], [0, 1, .5], [0, 0, 1.]]))


def sticker(**kwargs):
    return {"anchor": [.5, .5], "size": .25, "rotation": 0, "edge": .04, **kwargs}


@pytest.mark.parametrize(
    "case",
    json.loads((Path(__file__).parents[1] / "fixtures/geometry/flat.json").read_text()),
    ids=lambda case: case["name"],
)
def test_flat_matches_the_shared_geometry_fixture(case):
    h, w = case["height"], case["width"]
    grid = Grid(
        np.array(case["points"], dtype=np.float32).reshape(h, w, 3),
        np.array(case["normals"], dtype=np.float32).reshape(h, w, 3),
        np.array(case["valid"], dtype=np.uint8).reshape(h, w),
        np.array(case["intrinsics"]),
    )
    result = flat_surface(grid, case["sticker"], case["aspect"])
    expected = case["expected"]
    if expected is None:
        assert result is None
        return
    assert result is not None
    for key in ("p0", "n", "e1", "e2", "w", "h", "bounds", "corners"):
        np.testing.assert_allclose(result[key], expected[key], atol=1e-6, rtol=0, err_msg=key)
    np.testing.assert_array_equal(result["region"], expected["region"])
    assert result["cell"] == expected["cell"]


def test_front_facing_plane_has_no_mirror_and_center_is_subpixel():
    surface = flat_surface(plane_grid(), sticker(anchor=[.513, .487]), aspect=2)
    np.testing.assert_allclose(surface["p0"], [.026, -.026, 2], atol=1e-7)
    np.testing.assert_allclose(surface["e1"], [1, 0, 0], atol=1e-7)
    np.testing.assert_allclose(surface["e2"], [0, 1, 0], atol=1e-7)
    assert surface["w"] == pytest.approx(.5)
    assert surface["h"] == pytest.approx(.25)
    np.testing.assert_allclose(flat_uv(surface, [[.513, .487], [.638, .487]], plane_grid().intrinsics), [[.5, .5], [1, .5]], atol=1e-7)


def test_sloping_plane_fit_and_clockwise_rotation():
    grid = plane_grid(tilt=.3)
    surface = flat_surface(grid, sticker(rotation=90), aspect=1)
    np.testing.assert_allclose(surface["n"], [.3 / np.sqrt(1.09), 0, -1 / np.sqrt(1.09)], atol=1e-6)
    assert surface["e1"][1] > .99
    assert surface["e2"][0] < -.95


def test_region_stops_at_depth_discontinuity_and_mask():
    grid = plane_grid()
    grid.points[:, 16:] *= 2
    grid.valid[12] = 0
    surface = flat_surface(grid, sticker(anchor=[.45, .35], size=1), aspect=1)
    assert not surface["region"][:, 16:].any()
    assert not surface["region"][12:].any()


def test_drag_keeps_physical_width():
    surface = flat_surface(plane_grid(), sticker(size=.1), aspect=1, physical_width=.7)
    assert surface["w"] == .7


def test_empty_surface_and_invalid_anchor_are_safe():
    grid = plane_grid()
    grid.valid[:] = 0
    assert flat_surface(grid, sticker(), aspect=1) is None
