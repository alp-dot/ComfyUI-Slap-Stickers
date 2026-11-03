"""Bounded, weak-reference cache of content-addressed editor files."""

from collections import OrderedDict
import copy
import hashlib
import io
from pathlib import Path
import tempfile
import threading
import weakref

import numpy as np
from PIL import Image
import torch

from .geometry_input import read_geometry,nearest
from .grid import build_grid, encode_grid
from .scene import repair_scene
from .appearance import analyze,ANALYSIS_VERSION

UI_KEY = "slap_stickers"
SUBFOLDER = "slap_stickers"
PREVIEW_LONG_SIDE = 2048


def _signature(tensors):
    def version(t):
        try:return t._version
        except RuntimeError:return None # Inference tensors don't expose a version counter.
    return tuple((id(t), t.data_ptr(), tuple(t.shape),version(t)) if isinstance(t, torch.Tensor) else None for t in tensors)


def _atomic_write(path, content):
    if path.is_file():
        return
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=path.parent, prefix=".ss_", delete=False) as f:
            temporary = Path(f.name)
            f.write(content)
        temporary.replace(path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


class EditorFiles:
    def __init__(self, temp_directory):
        self.root = Path(temp_directory).resolve()
        self._cache = OrderedDict()
        self._lock = threading.Lock()
        self._appearance=OrderedDict()
        self._scene_analysis=None

    def appearance(self,entry):
        key=entry['meta']['key']
        with self._lock:
            if key not in self._appearance:
                self._appearance[key]={name:np.frombuffer((self.root/SUBFOLDER/file['filename']).read_bytes(),'<f2').reshape(file['height'],file['width'],4).copy() for name,file in entry['appearance'].items()}
            self._appearance.move_to_end(key)
            while len(self._appearance)>1 and sum(v.nbytes for fields in self._appearance.values() for v in fields.values())>128*1024**2:self._appearance.popitem(last=False)
            return self._appearance[key]

    @property
    def cached_count(self):
        return len(self._cache)

    def prepare(self, packet, image=None, mask=None, *, prepared=None):
        tensors = [packet.get(k) for k in ("depth", "intrinsics", "mask", "normal")] if isinstance(packet, dict) else []
        tensors += [image if image is not None else packet.get("image") if isinstance(packet, dict) else None, mask]
        key = (ANALYSIS_VERSION,_signature(tensors))
        with self._lock:
            directory = self.root / SUBFOLDER
            if directory.resolve().parent != self.root:
                raise ValueError("The editor files must stay inside ComfyUI/temp.")
            directory.mkdir(parents=True, exist_ok=True)
            old = self._cache.get(key)
            if old and all(ref is None if t is None else ref is not None and ref() is t for ref, t in zip(old[0], tensors)):
                ui = old[1]
                entry = ui[UI_KEY][0]
                if all((directory / file["filename"]).is_file() for file in [entry['grid'],entry['preview'],*entry.get('appearance',{}).values(),*([entry['sky']] if entry.get('sky') else [])]):
                    self._cache.move_to_end(key)
                    return copy.deepcopy(ui)
            if prepared is None:
                data = repair_scene(read_geometry(packet, image, mask))
                grid = build_grid(data)
            else:
                data, grid = prepared
            wire = encode_grid(grid)
            array = np.clip(data.image[0].detach().to(device="cpu", dtype=torch.float32).numpy() * 255 + .5, 0, 255).astype("uint8")
            preview = Image.fromarray(array)
            if max(preview.size) > PREVIEW_LONG_SIDE:
                preview.thumbnail((PREVIEW_LONG_SIDE, PREVIEW_LONG_SIDE), Image.Resampling.LANCZOS)
            stream = io.BytesIO()
            preview.save(stream, format="PNG")
            png = stream.getvalue()
            scene_key=(ANALYSIS_VERSION,_signature(tensors[:-1]))
            cached=self._scene_analysis
            if cached and cached[0]==scene_key and all(ref is None if t is None else ref is not None and ref() is t for ref,t in zip(cached[1],tensors[:-1])):fields=cached[2]
            else:
                fields=analyze(data)
                self._scene_analysis=(scene_key,[weakref.ref(t) if isinstance(t,torch.Tensor) else None for t in tensors[:-1]],fields)
            digest_hash=hashlib.sha1(wire+png+f'appearance-{ANALYSIS_VERSION}'.encode('ascii'))
            for value in fields.values():digest_hash.update(value.tobytes())
            sky_bytes=nearest(data.sky,grid.height,grid.width).astype('u1').tobytes() if data.sky is not None and data.sky.any() else b''
            digest_hash.update(sky_bytes)
            digest=digest_hash.hexdigest()[:16]
            geometry_digest=hashlib.sha1(wire+np.asarray(grid.intrinsics,dtype='<f8').tobytes()+np.asarray([grid.width,grid.height],dtype='<u4').tobytes()+sky_bytes).hexdigest()[:16]
            grid_name, image_name = f"ss_grid_{digest}.bin", f"ss_image_{digest}.png"
            _atomic_write(directory / grid_name, wire)
            _atomic_write(directory / image_name, png)
            descriptor = lambda filename: {"filename": filename, "subfolder": SUBFOLDER, "type": "temp"}
            ui = {UI_KEY: [{"grid": descriptor(grid_name), "preview": descriptor(image_name), "meta": {
                "key": digest, "geometry_key":geometry_digest, "grid_w": grid.width, "grid_h": grid.height,
                "image_w": int(data.image.shape[2]), "image_h": int(data.image.shape[1]),
                "intrinsics": data.intrinsics.tolist(), "has_mask": mask is not None, "format": 1,"analysis_version":ANALYSIS_VERSION,
            }}]}
            ui[UI_KEY][0]['appearance']={}
            for name,value in fields.items():
                filename=f'ss_{name}_{digest}.bin';_atomic_write(directory/filename,value.tobytes())
                ui[UI_KEY][0]['appearance'][name]={**descriptor(filename),'width':value.shape[1],'height':value.shape[0]}
            if data.sky is not None and data.sky.any():
                filename=f'ss_sky_{digest}.bin';_atomic_write(directory/filename,sky_bytes)
                ui[UI_KEY][0]['sky']=descriptor(filename)
            self._appearance[digest]=fields
            while len(self._appearance)>1 and sum(v.nbytes for maps in self._appearance.values() for v in maps.values())>128*1024**2:self._appearance.popitem(last=False)
            refs = [weakref.ref(t) if isinstance(t, torch.Tensor) else None for t in tensors]
            self._cache[key] = (refs, ui)
            self._cache.move_to_end(key)
            while len(self._cache) > 8:
                self._cache.popitem(last=False)
            return copy.deepcopy(ui)
