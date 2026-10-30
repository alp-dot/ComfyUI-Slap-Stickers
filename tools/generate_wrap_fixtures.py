"""Regenerate cross-language Wrap fixtures from the independently tested Python seam."""
import json
from pathlib import Path
import numpy as np
from tests.python.test_wrap import cylinder_grid,camera_cylinder_grid
from tests.python.test_surface import plane_grid,sticker
from slap_stickers.wrap import wrap_surface
cases=[]
normal_stop=plane_grid(17,21)
normal_stop.normals[:,13:]=np.array([1.,0,.2])/np.sqrt(1.04)
for name,grid,state in [('plane',plane_grid(17,21),sticker(size=.9)),('cylinder',cylinder_grid(17,41),sticker(size=1.1)),('rotated-cylinder',cylinder_grid(17,41),sticker(size=.8,rotation=35)),('normal-stop',normal_stop,sticker(size=.9)),('camera-cylinder',camera_cylinder_grid(),sticker(size=1.4))]:
    aspect=3.5 if name=="camera-cylinder" else 1.5
    s=wrap_surface(grid,state,aspect)
    cases.append(dict(name=name,width=grid.width,height=grid.height,points=grid.points.reshape(-1).tolist(),normals=grid.normals.reshape(-1).tolist(),valid=grid.valid.reshape(-1).tolist(),intrinsics=grid.intrinsics.tolist(),sticker=state,aspect=aspect,expected={k:(v.tolist() if isinstance(v,np.ndarray) else v) for k,v in s.items()}))
Path('tests/fixtures/geometry/wrap.json').write_text(json.dumps(cases,separators=(',',':'))+'\n')
