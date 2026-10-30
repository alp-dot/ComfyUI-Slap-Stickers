"""Regenerate parity data from synthetic planes; run from the repository root."""
import json
from pathlib import Path

import numpy as np

from slap_stickers.surface import flat_surface
from tests.python.test_surface import plane_grid, sticker


cases = []
for name, tilt, anchor, rotation in [("front", 0, [.513, .487], 0), ("slope", .4, [.5, .5], 33), ("near-left", -.5, [.15, .8], -71), ("step", 0, [.45, .3], 0), ("empty", 0, [.5, .5], 0)]:
    grid = plane_grid(12, 16, tilt)
    if name == "step":
        grid.points[:, 8:] *= 2
        grid.valid[8] = 0
    if name == "empty":
        grid.valid[:] = 0
    state = sticker(anchor=anchor, rotation=rotation, size=.7)
    result = flat_surface(grid, state, 1.5)
    case = {"name": name, "width": grid.width, "height": grid.height,
            "points": grid.points.reshape(-1).tolist(), "normals": grid.normals.reshape(-1).tolist(),
            "valid": grid.valid.reshape(-1).tolist(), "intrinsics": grid.intrinsics.tolist(),
            "sticker": state, "aspect": 1.5,
            "expected": {k: v.tolist() if isinstance(v, np.ndarray) else v for k, v in result.items()} if result else None}
    cases.append(case)
Path("tests/fixtures/geometry/flat.json").write_text(json.dumps(cases, separators=(",", ":")) + "\n")
