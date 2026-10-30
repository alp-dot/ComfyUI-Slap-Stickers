# Slap Stickers reference

**English** | [日本語](reference.ja.md)

Details for using the Slap Stickers node. For installation and first steps, see the [README](../README.md).

## Controls

Click the photo to give the node focus. Keyboard shortcuts work while the node has focus.

| Action | How |
|---|---|
| Add a sticker | Drop an image file onto the photo, or click **+** |
| Select | Click a sticker. Click an empty spot to deselect |
| Move | Drag the sticker |
| Resize | Drag a corner. The aspect ratio and the center stay fixed |
| Rotate | Drag the round handle. Hold <kbd>Shift</kbd> to snap to 15° steps |
| Duplicate | Toolbar button or <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>D</kbd> |
| Opacity | Toolbar button, then the slider (0–100%) |
| Layer order | **Send to back** / **Bring to front** in the toolbar |
| Delete | Toolbar button, <kbd>Delete</kbd> or <kbd>Backspace</kbd> |
| Cancel a drag | <kbd>Esc</kbd>. When nothing is being dragged, <kbd>Esc</kbd> deselects |
| Undo / Redo | ComfyUI's Undo/Redo. Each finished edit is one step |
| Zoom | The mouse wheel zooms the ComfyUI canvas. The node has no zoom of its own |

A sticker's center can only sit on a usable surface. Over the sky, outside the allowed area or outside the photo, the cursor changes to "not allowed" and the sticker stays at the last valid point.

## Inputs and outputs

**Slap Stickers** (`SurfaceStickers`), category `image/compositing`.

| Input | Type | Description |
|---|---|---|
| `geometry` | `MOGE_GEOMETRY` | Required. Connect the output of `Run MoGe Inference`. |
| `Background override` | `IMAGE` | Optional. A background with the same composition and aspect ratio (within 1%), such as the full-resolution original. The size may differ. If disconnected, the image inside the geometry is used. |
| `Allowed sticker area` | `MASK` | Optional. White allows stickers, black blocks them. If disconnected, every valid surface is allowed. |

| Index | Output | Type | Description |
|---|---|---|---|
| 0 | `image` | `IMAGE` | The background with all visible stickers. |
| 1 | `stickers` | `IMAGE` | The sticker colors alone, as straight RGB (not multiplied by alpha). |
| 2 | `mask` | `MASK` | Combined coverage of all visible stickers, including opacity. |

- All outputs have the size of the background. `stickers` and `mask` together form an RGBA layer of the stickers.
- For a large photo, you can run MoGe on a smaller copy and connect the original to `Background override`.
- The editor stores sticker image references and placement settings in the hidden `state_json` input.

## Sticker files

Added images are uploaded to `ComfyUI/input/slap_stickers/`. The workflow stores references to these files, not the images.
When you share a workflow, share the sticker files with it. Existing workflows can still use files in their original input subfolder.

If a sticker file is missing, the background and the other stickers stay editable, but the node blocks its outputs.
Put the file back and run again, or remove the missing stickers with **Remove unavailable images**.

## MoGe models

All checkpoints go in `ComfyUI/models/geometry_estimation/` and can be downloaded from Comfy-Org/MoGe on Hugging Face.

| File | Parameters | Notes |
|---|---|---|
| [`moge_3_vitg_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_3_vitg_fp16.safetensors) | 1.25B | Most detailed. Used by the example workflow and tested with Slap Stickers. |
| [`moge_3_vitl_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_3_vitl_fp16.safetensors) | 370M | Lighter MoGe-3. Not tested with Slap Stickers. |
| [`moge_2_vitl_normal_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_2_vitl_normal_fp16.safetensors) | 331M | Recommended default in the official MoGe guide. Not tested with Slap Stickers. |

See the [official MoGe guide](https://github.com/Comfy-Org/docs/blob/main/tutorials/utility/moge.mdx) for all checkpoints and their options.

## Tested environment

ComfyUI 0.41.0 (frontend 1.55.17), MoGe-3 ViT-g, an NVIDIA GPU on Linux, in both the Nodes 2.0 and the classic renderer.

## Limitations

- One still photo from a regular camera. Panoramas, video, image batches and depth-only input are not supported.
- Stickers are images. There are no text stickers, and one sticker is selected at a time.
- The node does not simulate lighting such as reflections or cast shadows. Refine the result with an image-editing model if needed.
- Not implemented yet: zoom and pan inside the node, moving with the arrow keys, fit shortcuts, pasting from the clipboard, and a dedicated help page.
- Speed on macOS and full rendering in Safari have not been verified.

## Troubleshooting

| Symptom | What to do |
|---|---|
| The node says "Run the workflow once to load the surface" | Run the workflow. After restarting ComfyUI, run it once more if the photo does not appear. |
| The model is not listed in `Load MoGe Model` | Place it in `ComfyUI/models/geometry_estimation/` and restart ComfyUI. |
| "This geometry has no point map from a regular camera" | Connect `Run MoGe Inference`. Panorama geometry is not supported. |
| "Slap Stickers takes one image (got N)" | Pass a single image, not a batch. |
| "No usable surface in this image" | MoGe found no valid surface. Try another photo. |
| Later nodes do not run, and missing images are reported | Restore the files in `ComfyUI/input/slap_stickers/`, or use **Remove unavailable images**. |
| A **Retry surface** button appears instead of the editor | Click it to attach the editor again. |
| The UI looks outdated after an update | Restart ComfyUI and hard-reload the browser tab. |

## How it works

1. MoGe estimates a 3D point for every pixel. The node reduces it to an analysis grid and finds where the depth jumps.
2. While you edit, a shared Web Worker projects each sticker onto the surface and draws it with WebGL2, off the main thread.
   Stickers wrap along the surface from their center, based on Schmidt et al., "Interactive Decal Compositing with Discrete Exponential Maps" (SIGGRAPH 2006).
3. When the workflow runs, Python renders the same projection at full resolution on ComfyUI's device, usually the GPU.
   Python and JavaScript read the same JSON fixtures in tests, so the preview and the output follow the same rules.
