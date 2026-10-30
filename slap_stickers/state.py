"""The sole Python owner of the version-1 state contract."""

import copy
import json
import math
import uuid

DAMAGED = "The sticker data is damaged."
NEWER = "This workflow was saved by a newer Slap Stickers. Update the node."
SOURCE_ERROR = "The sticker source must stay inside ComfyUI/input."
DEFAULTS = {"mode": "wrap", "size": 0.25, "rotation": 0.0, "opacity": 1.0,
            "shading": 0.8, "edge": 0.04, "visible": True, "locked": False}
RANGES = {"size": (0.01, 4), "opacity": (0, 1), "shading": (0, 1), "edge": (0.005, 0.5)}


def _number(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(DAMAGED)
    try:
        if not math.isfinite(value):
            raise ValueError(DAMAGED)
    except OverflowError:
        raise ValueError(DAMAGED) from None
    return value


def _relative(value, filename=False):
    if not isinstance(value, str) or "\x00" in value or "\\" in value or ":" in value:
        raise ValueError(SOURCE_ERROR)
    if value.startswith("/") or any(p in (".", "..") for p in value.split("/")):
        raise ValueError(SOURCE_ERROR)
    if filename and (not value or "/" in value):
        raise ValueError(SOURCE_ERROR)
    return value


def parse_state(raw):
    def reject_constant(_):
        raise ValueError(DAMAGED)
    try:
        value = json.loads(raw, parse_constant=reject_constant) if raw.strip() else {}
    except (ValueError, AttributeError, TypeError):
        raise ValueError(DAMAGED) from None
    if not isinstance(value, dict):
        raise ValueError(DAMAGED)
    state = copy.deepcopy(value)
    version = _number(state.setdefault("version", 1))
    if version != int(version):
        raise ValueError(DAMAGED)
    if version != 1:
        raise ValueError(NEWER)
    state["version"] = int(version)
    stickers = state.setdefault("stickers", [])
    if not isinstance(stickers, list):
        raise ValueError(DAMAGED)
    seen = set()
    for st in stickers:
        if not isinstance(st, dict):
            raise ValueError(DAMAGED)
        sid = st.setdefault("id", "st_" + uuid.uuid4().hex[:12])
        if not isinstance(sid, str) or not sid or sid in seen:
            raise ValueError(DAMAGED)
        seen.add(sid)
        source = st.get("source")
        if not isinstance(source, dict):
            raise ValueError(SOURCE_ERROR)
        _relative(source.get("filename"), filename=True)
        source["subfolder"] = _relative(source.get("subfolder", ""))
        if source.setdefault("type", "input") != "input":
            raise ValueError(SOURCE_ERROR)
        st.setdefault("name", source["filename"])
        if not isinstance(st["name"], str):
            raise ValueError(DAMAGED)
        for key, default in DEFAULTS.items():
            st.setdefault(key, default)
        if st["mode"] not in ("flat", "wrap") or any(not isinstance(st[k], bool) for k in ("visible", "locked")):
            raise ValueError(DAMAGED)
        anchor = st.setdefault("anchor", [0.5, 0.5])
        if not isinstance(anchor, list) or len(anchor) != 2:
            raise ValueError(DAMAGED)
        st["anchor"] = [min(1, max(0, _number(v))) for v in anchor]
        for key, (lo, hi) in RANGES.items():
            st[key] = min(hi, max(lo, _number(st[key])))
        rotation = (_number(st["rotation"]) + 180) % 360 - 180
        st["rotation"] = 180 if rotation == -180 else rotation
    return state


def serialize_state(state):
    def rounded(value):
        if isinstance(value, float):
            if not math.isfinite(value):
                raise ValueError(DAMAGED)
            return math.floor(value * 1e6 + 0.5) / 1e6
        if isinstance(value, list):
            return [rounded(v) for v in value]
        if isinstance(value, dict):
            return {k: rounded(v) for k, v in value.items()}
        return value
    return json.dumps(rounded(state), ensure_ascii=False, separators=(",", ":"), allow_nan=False)
