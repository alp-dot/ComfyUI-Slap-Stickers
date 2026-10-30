"""ComfyUI custom-node entry point. Heavy host imports happen only on load."""

WEB_DIRECTORY = "./web"


async def comfy_entrypoint():
    from .slap_stickers.node import SlapStickersExtension
    return SlapStickersExtension()
