"""Cached background illumination, surface detail and restrained ambient tint."""

import math

import torch
import torch.nn.functional as F


def linear(value):
    return torch.where(value <= .04045, value/12.92, ((value+.055)/1.055)**2.4)


def srgb(value):
    return torch.where(value <= .0031308, value*12.92, 1.055*value.clamp(min=0)**(1/2.4)-.055)


def lighting_fields(image):
    rgb = linear(image).permute(0, 3, 1, 2)
    weights = image.new_tensor([.2126, .7152, .0722])[None, :, None, None]
    raw = (rgb*weights).sum(1, keepdim=True)
    sigma = min(image.shape[1:3])*.015
    radius = max(1, math.ceil(sigma*3))
    x = torch.arange(-radius, radius+1, device=image.device, dtype=torch.float32)
    kernel = torch.exp(-x*x/(2*sigma*sigma))
    kernel /= kernel.sum()
    blurred = F.conv2d(F.pad(rgb, (radius, radius, 0, 0), mode="replicate"), kernel[None, None, None, :].expand(3, 1, 1, -1), groups=3)
    blurred = F.conv2d(F.pad(blurred, (0, 0, radius, radius), mode="replicate"), kernel[None, None, :, None].expand(3, 1, -1, 1), groups=3)
    light = (blurred*weights).sum(1, keepdim=True)
    denominator = light.clamp(min=1e-4)
    tint = 1 + .35*((blurred/denominator).clamp(.75, 1.25)-1)
    detail = 1 + .5*((raw/denominator).clamp(.75, 1.25)-1)
    return light, torch.cat((tint, detail), dim=1)


def shade(color, brightness, material, reference, strength):
    broad = 1 + strength*((brightness/reference).clamp(0, 2)-1)
    tint = 1 + strength*(material[..., :3]-1)
    detail = 1 + strength*(material[..., 3]-1)
    return srgb((linear(color)*(broad*detail)[..., None]*tint).clamp(0, 1))
