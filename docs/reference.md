# Slap Stickers reference

**English** | [日本語](reference.ja.md)

Details for using the Slap Stickers node. For installation and first steps, see the [README](../README.md).

## Controls

Click the photo to give the node focus. Keyboard shortcuts work while the node has focus.

| Action | How |
|---|---|
| Add a sticker | Drop an image file or image URL onto the photo, or click **+** |
| Select | Click a sticker or thumbnail. Shift-click toggles multiple selection; click an empty spot to deselect |
| Move | Drag the sticker; the point you grab follows the surface under the cursor |
| Resize | Drag a corner. The aspect ratio and the center stay fixed |
| Rotate | Drag the round handle. Hold <kbd>Shift</kbd> to snap to 15° steps |
| Duplicate | Toolbar button or <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>D</kbd> |
| Opacity | Toolbar button, then the slider (0–100%) |
| Layer order | **Send to back** / **Bring to front** in the toolbar |
| Delete | Toolbar button, <kbd>Delete</kbd> or <kbd>Backspace</kbd> |
| Cancel a drag | <kbd>Esc</kbd>. When nothing is being dragged, <kbd>Esc</kbd> deselects |
| Undo / Redo | ComfyUI's Undo/Redo. Each finished edit is one step |
| Blend | The slider below the photo controls all five appearance effects together (0–1, initially 1) |
| Inline graph gestures | The wheel and empty-space drag control the ComfyUI graph |

The point you grab chooses the surface. To keep a sticker behind a foreground object, grab an exposed part over the background. To move it onto the foreground, move the grabbed point onto that object. Moving between surfaces keeps its apparent size. Sky is also supported; outside the photo or allowed area, the sticker stays at its last valid position.

Use thumbnails to select hidden stickers. Multiple selection supports deletion; move, resize and rotate one sticker at a time. The rotate handle moves below the sticker when the top is cut off.

**Blend** adjusts lighting, texture, blur, grain and color together: 0 leaves the sticker's appearance unchanged, and 1 applies the estimated effects. It does not change opacity or clipping.

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
- Placement is saved in the workflow. Existing workflows remain supported; moving a sticker or using Blend enables the new blending behavior.
- `image` is composited in linear light. Mixing `stickers` and `mask` in sRGB can produce a different result.

## Sticker files

Added images are uploaded to `ComfyUI/input/slap_stickers/`. The workflow stores references to these files, not the images.
When you share a workflow, share the sticker files with it. Existing workflows can still use files in their original input subfolder.

PNG, JPEG, WebP, GIF and BMP are supported; animated files use the first frame. Other browser-readable formats are converted to PNG on upload. If an image URL cannot be downloaded, save the image and drop the file instead.

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

## Requirements and limitations

- One still photo from a regular camera. Panoramas, video, image batches and depth-only input are not supported.
- Use a browser with WebGL2 and floating-point color buffers. Maximum image size depends on the browser and GPU.
- Automatic blending estimates appearance from one photo; it cannot create new reflections or cast shadows. Fine edges and strong blur may remain imperfect.
- Verified on Linux with an NVIDIA GPU, ComfyUI 0.41.0 (frontend 1.55.17), MoGe-3 ViT-g, in both classic and Nodes 2.0. Windows and macOS/Safari have not been validated on hardware.

## Troubleshooting

| Symptom | What to do |
|---|---|
| The node says "Run the workflow once to load the surface" | Run the workflow. After restarting ComfyUI, run it once more if the photo does not appear. |
| The model is not listed in `Load MoGe Model` | Place it in `ComfyUI/models/geometry_estimation/` and restart ComfyUI. |
| "This geometry has no point map from a regular camera" | Connect `Run MoGe Inference`. Panorama geometry is not supported. |
| "Slap Stickers takes one image (got N)" | Pass a single image, not a batch. |
| "No usable surface in this image" | MoGe found no valid surface. Check the allowed-area mask; unmeasured sky itself is supported. |
| Later nodes do not run, and missing images are reported | Restore the files in `ComfyUI/input/slap_stickers/`, or use **Remove unavailable images**. |
| A **Retry surface** button appears instead of the editor | Click it to attach the editor again. |
| The UI looks outdated after an update | Restart ComfyUI and hard-reload the browser tab. |
