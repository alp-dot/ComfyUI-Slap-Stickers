"""Produce and transport the one shared analysis grid."""

from dataclasses import dataclass
import math

import numpy as np

from .geometry_input import nearest

GRID_LONG_SIDE = 1024


@dataclass
class Grid:
    points: np.ndarray
    normals: np.ndarray
    valid: np.ndarray
    intrinsics: np.ndarray

    @property
    def width(self):
        return self.valid.shape[1]

    @property
    def height(self):
        return self.valid.shape[0]


def _normals(points, valid):
    derivatives = []
    for axis in (0, 1):
        before = np.roll(points, 1, axis=axis)
        after = np.roll(points, -1, axis=axis)
        vb = np.roll(valid, 1, axis=axis)
        va = np.roll(valid, -1, axis=axis)
        head = [slice(None), slice(None)]
        tail = head.copy()
        head[axis] = 0
        tail[axis] = -1
        vb[tuple(head)] = False
        va[tuple(tail)] = False
        derivative = np.where((va & vb)[..., None], after - before,
                              np.where(va[..., None], after - points,
                                       np.where(vb[..., None], points - before, 0)))
        derivatives.append(derivative)
    return np.cross(derivatives[0], derivatives[1])  # dy × dx, OpenCV camera axes


def build_grid(data, long_side=GRID_LONG_SIDE):
    h, w = data.depth.shape
    scale = min(1., long_side / max(h, w))
    gh, gw = max(1, math.floor(h * scale + .5)), max(1, math.floor(w * scale + .5))
    ys = np.minimum(((np.arange(gh) + .5) * h / gh).astype(int), h - 1)
    xs = np.minimum(((np.arange(gw) + .5) * w / gw).astype(int), w - 1)
    yy, xx = np.meshgrid(ys, xs, indexing="ij")
    rays = np.stack(((xx + .5) / w, (yy + .5) / h, np.ones_like(xx)), axis=-1) @ np.linalg.inv(data.intrinsics).T
    valid = nearest(data.valid, gh, gw).copy()
    depth = nearest(data.depth, gh, gw)
    points = rays * np.where(valid, depth, 0)[..., None]
    if data.mask is not None:
        valid &= nearest(data.mask, gh, gw) >= .5
    points[~valid] = 0
    normal = nearest(data.normal, gh, gw).astype(np.float64) if data.normal is not None else _normals(points, valid)
    lengths = np.linalg.norm(normal, axis=-1)
    good = valid & np.isfinite(normal).all(axis=-1) & (lengths > 1e-12)
    normal = np.divide(normal, lengths[..., None], out=np.zeros_like(normal), where=good[..., None])
    normal[np.sum(normal * points, axis=-1) > 0] *= -1
    return Grid(points.astype("<f4"), normal.astype("<f4"), valid.astype("u1"), data.intrinsics.copy())


def encode_grid(grid):
    return b"".join((np.asarray(grid.points, dtype="<f4").tobytes(),
                     np.asarray(grid.normals, dtype="<f4").tobytes(), grid.valid.astype("u1").tobytes()))


def decode_grid(wire, width, height, intrinsics):
    count = width * height
    if width < 1 or height < 1 or len(wire) != count * 25:
        raise ValueError("The surface data is incomplete. Run the workflow again.")
    p = np.frombuffer(wire, "<f4", count * 3).reshape(height, width, 3).copy()
    n = np.frombuffer(wire, "<f4", count * 3, count * 12).reshape(height, width, 3).copy()
    v = np.frombuffer(wire, "u1", count, count * 24).reshape(height, width).copy()
    return Grid(p, n, v, np.asarray(intrinsics, dtype=np.float64))
