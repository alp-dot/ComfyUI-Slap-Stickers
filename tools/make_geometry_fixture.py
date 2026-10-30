"""Generate original synthetic test imagery and geometry; no models or external assets."""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
import torch

from slap_stickers.editor_files import EditorFiles

root=Path("tests/browser/fixtures")
root.mkdir(exist_ok=True)
h,w=240,320
y,x=np.mgrid[:h,:w]
u,v=(x+.5)/w,(y+.5)/h
depth=2/(1+1.1*(v-.5))
block=(u>.58)&(u<.85)&(v>.25)&(v<.64)
depth[block]*=.72
grain=(np.sin(x*.7+y*.13)+np.sin(x*.11-y*.45))*.007
light=.94-.28*u+.07*np.cos(v*4)+grain
color=np.stack((light*.82,light*.77,light*.68),-1)
color[block]*=np.array([.65,.69,.70])
packet={"depth":torch.from_numpy(depth.astype(np.float32))[None],"points":torch.zeros(1,h,w,3),
        "intrinsics":torch.tensor([[[1.,0,.5],[0,1.,.5],[0,0,1.]]]),"mask":torch.ones(1,h,w,dtype=torch.bool),
        "image":torch.from_numpy(color.astype(np.float32))[None]}
descriptor=EditorFiles(root).prepare(packet)["slap_stickers"][0]
(root/"surface.json").write_text(json.dumps(descriptor,indent=2)+"\n")
sticker=Image.new("RGBA",(256,160),(0,0,0,0))
draw=ImageDraw.Draw(sticker)
draw.rounded_rectangle((5,5,251,155),radius=32,fill=(238,224,177,255))
draw.ellipse((27,38,111,122),outline=(30,36,31,255),width=10)
draw.line((52,80,72,100,91,60),fill=(30,36,31,255),width=10)
draw.text((133,59),"SLAP\nSTICKERS",fill=(30,36,31,255),font_size=19,spacing=7)
sticker.save(root/"sticker.png")
