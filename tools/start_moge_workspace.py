"""Run a private GPU ComfyUI for the same-origin MoGe workspace."""
import argparse
from pathlib import Path
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument('--comfy-dir', type=Path, required=True)
parser.add_argument('--python', default=sys.executable)
parser.add_argument('--port', type=int, default=8199)
args = parser.parse_args()
comfy = args.comfy_dir.resolve()
if not (comfy / 'main.py').is_file():
    parser.error('--comfy-dir must contain main.py')
repo = Path(__file__).resolve().parents[1]
root = repo / '.runtime/comfy'
for name in ('custom_nodes', 'input', 'output', 'user', 'temp'):
    (root / name).mkdir(parents=True, exist_ok=True)
link = root / 'custom_nodes/ComfyUI-Slap-Stickers'
if not link.exists():
    link.symlink_to(repo, target_is_directory=True)
elif link.resolve() != repo:
    parser.error(f'{link} already points elsewhere')
command = [args.python, str(comfy / 'main.py'), '--base-directory', str(root),
           '--listen', '127.0.0.1', '--port', str(args.port), '--disable-all-custom-nodes',
           '--whitelist-custom-nodes', 'ComfyUI-Slap-Stickers', '--disable-assets',
           '--disable-auto-launch', '--disable-metadata']
print(f'Private MoGe host: {root}', flush=True)
try:
    subprocess.run(command, cwd=comfy, check=True)
except KeyboardInterrupt:
    pass
