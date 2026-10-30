"""ComfyUI adapter. All host imports stay here."""

from pathlib import Path

import comfy.model_management
from comfy_api.latest import ComfyExtension, io
import folder_paths

from .editor_files import EditorFiles, UI_KEY
from .geometry_input import read_geometry
from .grid import build_grid
from .render import render, SourceUnavailable, source_fingerprints
from .state import parse_state

_files = None


class SlapStickers(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="SurfaceStickers", display_name="Slap Stickers", category="image/compositing",
            description="Place image stickers on photographed surfaces. Connect Run MoGe Inference and run once to load the surface. Drop an image on the preview to place it.",
            search_aliases=["sticker", "decal", "mockup", "logo", "label", "moge", "surface"],
            is_output_node=True, has_intermediate_output=True,
            inputs=[io.Custom("MOGE_GEOMETRY").Input("geometry", tooltip="Surface geometry for sticker projection. Currently accepts the MOGE_GEOMETRY output of Run MoGe Inference."),
                    io.Image.Input("image", display_name="Background override", optional=True,
                                   tooltip="Optional background override, not a sticker. Leave disconnected to use the MoGe image. Use the same composition and aspect ratio, for example its higher-resolution original."),
                    io.Mask.Input("mask", display_name="Allowed sticker area", optional=True,
                                  tooltip="Where stickers may be placed: white allows placement, black blocks it. Leave disconnected to allow every valid surface."),
                    io.String.Input("state_json", default="", multiline=True, dynamic_prompts=False, advanced=True)],
            outputs=[io.Image.Output("image"), io.Image.Output("stickers"), io.Mask.Output("mask", tooltip="Combined coverage of all visible stickers, including opacity.")],
        )

    @classmethod
    def fingerprint_inputs(cls, state_json="", **kwargs):
        return source_fingerprints(parse_state(state_json),folder_paths.get_input_directory())

    @classmethod
    def execute(cls, geometry, image=None, mask=None, state_json=""):
        global _files
        state = parse_state(state_json)
        data = read_geometry(geometry, image, mask)
        grid = build_grid(data)
        root = Path(folder_paths.get_temp_directory()).resolve()
        if _files is None or _files.root != root:
            _files = EditorFiles(root)
        ui = _files.prepare(geometry, image, mask, prepared=(data, grid))
        ui[UI_KEY][0]['source_revisions']=[{'source':st['source'],'digest':digest} for st,digest in zip(state['stickers'],source_fingerprints(state,folder_paths.get_input_directory()))]
        try:
            result = render(data, grid, state, folder_paths.get_input_directory(),
                            comfy.model_management.get_torch_device(),
                            comfy.model_management.throw_exception_if_processing_interrupted)
        except SourceUnavailable as error:
            return io.NodeOutput(None,None,None,ui=ui,block_execution=str(error))
        return io.NodeOutput(*result, ui=ui)


class SlapStickersExtension(ComfyExtension):
    async def get_node_list(self):
        return [SlapStickers]
