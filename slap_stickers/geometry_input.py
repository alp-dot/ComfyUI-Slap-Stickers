"""The only adapter for the upstream MoGe packet."""

from dataclasses import dataclass

import numpy as np
import torch

CAMERA_ERROR = "This geometry has no point map from a regular camera. Connect the output of Run MoGe Inference (panoramas aren't supported)."


@dataclass
class GeometryInput:
    depth: np.ndarray
    intrinsics: np.ndarray
    valid: np.ndarray
    normal: np.ndarray | None
    image: torch.Tensor
    mask: np.ndarray | None


def _check_shape(value, dimensions, tail=None):
    if not isinstance(value, torch.Tensor) or value.ndim != dimensions:
        raise ValueError(CAMERA_ERROR)
    if value.shape[0] != 1:
        raise ValueError(f"Slap Stickers takes one image (got {value.shape[0]}). Pick a single frame first.")
    if any(n < 1 for n in value.shape) or (tail is not None and tuple(value.shape[-len(tail):]) != tail):
        raise ValueError(CAMERA_ERROR)


def _array(value, dimensions, tail=None):
    _check_shape(value, dimensions, tail)
    return value.detach().to(device="cpu", dtype=torch.float32).numpy()[0]


def _aspect(src, target):
    sh, sw = src
    th, tw = target
    if abs((tw / th) / (sw / sh) - 1) > 0.01:
        raise ValueError(f"The image sizes have different proportions: {sw} × {sh} and {tw} × {th}. Use images with the same proportions.")


def nearest(array, height, width):
    """Sample source pixel centers, never average across foreground/background."""
    sh, sw = array.shape[:2]
    y = np.minimum(((np.arange(height) + .5) * sh / height).astype(int), sh - 1)
    x = np.minimum(((np.arange(width) + .5) * sw / width).astype(int), sw - 1)
    return array[y[:, None], x[None, :]]


def read_geometry(packet, image=None, mask=None):
    if not isinstance(packet, dict) or not all(k in packet for k in ("points", "depth", "intrinsics")):
        raise ValueError(CAMERA_ERROR)
    _check_shape(packet["points"], 4, (3,))
    depth = _array(packet["depth"], 3)
    k = _array(packet["intrinsics"], 3, (3, 3)).astype(np.float64)
    if tuple(packet["points"].shape[1:3]) != depth.shape or not np.isfinite(k).all() or k[0, 0] <= 0 or k[1, 1] <= 0 or abs(np.linalg.det(k)) < 1e-12:
        raise ValueError(CAMERA_ERROR)
    valid = np.isfinite(depth) & (depth > 0)
    if "mask" in packet:
        supplied = _array(packet["mask"], 3)
        if supplied.shape != depth.shape:
            raise ValueError(CAMERA_ERROR)
        valid &= supplied.astype(bool)
    normal = None
    if "normal" in packet:
        normal = _array(packet["normal"], 4, (3,))
        if normal.shape[:2] != depth.shape:
            raise ValueError(CAMERA_ERROR)
    target = image if image is not None else packet.get("image")
    if not isinstance(target, torch.Tensor) or target.ndim != 4 or target.shape[-1] not in (3, 4) or min(target.shape[1:3]) < 1:
        raise ValueError("Connect a single RGB image to Slap Stickers.")
    if target.shape[0] != 1:
        raise ValueError(f"Slap Stickers takes one image (got {target.shape[0]}). Pick a single frame first.")
    _aspect(depth.shape, target.shape[1:3])
    user_mask = None
    if mask is not None:
        user_mask = _array(mask, 3)
        _aspect(target.shape[1:3], user_mask.shape)
        user_mask = nearest(user_mask, *target.shape[1:3])
    return GeometryInput(depth, k, valid, normal, target[..., :3], user_mask)
