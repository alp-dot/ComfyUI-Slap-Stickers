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


def _pair(value):
    if not isinstance(value,list) or len(value)!=2:
        raise ValueError(DAMAGED)
    return [_number(v) for v in value]


def _extensions(st):
    st['pivot']=[min(1,max(0,v)) for v in _pair(st.get('pivot',[.5,.5]))]
    st.pop('erase',None) # Discard the retired development-only mask.
    pose=st.get('pose')
    if pose is not None:
        if not isinstance(pose,dict) or not isinstance(pose.get('scene'),str) or not isinstance(pose.get('at'),list) or len(pose['at'])!=4:
            raise ValueError(DAMAGED)
        pose['at']=[_number(v) for v in pose['at']]
        for key in ('p0','n','e1','e2'):
            vector=pose.get(key)
            if not isinstance(vector,list) or len(vector)!=3:raise ValueError(DAMAGED)
            for v in vector:_number(v)
        if _number(pose.get('w'))<=0 or _number(pose.get('h'))<=0 or pose['p0'][2]<=0:
            raise ValueError(DAMAGED)
        if 'baseAnchor' in pose:
            pose['baseAnchor']=[min(1,max(0,v)) for v in _pair(pose['baseAnchor'])]
            pose['shift']=_pair(pose.get('shift'));_number(pose.get('turn'));_number(pose.get('baseRotation'))
            if _number(pose.get('reach'))<=0:raise ValueError(DAMAGED)


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
    if version not in (1,2):
        raise ValueError(NEWER)
    state["version"] = int(version)
    if version==2:state['blend']=min(1,max(0,_number(state.get('blend',1))))
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
        def nonfinite(v):
            if isinstance(v,bool) or not isinstance(v,(int,float)):return False
            try:return not math.isfinite(v)
            except OverflowError:return True
        if version==2 and any(nonfinite(v) for v in [*anchor,st['size'],st['rotation']]):
            st.update(anchor=[.5,.5],size=DEFAULTS['size'],rotation=0,pivot=[.5,.5],recovered=True)
            st.pop('pose',None);anchor=st['anchor']
        st["anchor"] = [min(1, max(0, _number(v))) for v in anchor]
        for key, (lo, hi) in RANGES.items():
            st[key] = min(hi, max(lo, _number(st[key])))
        rotation = (_number(st["rotation"]) + 180) % 360 - 180
        st["rotation"] = 180 if rotation == -180 else rotation
        if version==2:_extensions(st)
    return state


def serialize_state(state):
    def rounded(value):
        if isinstance(value, float):
            if not math.isfinite(value):
                raise ValueError(DAMAGED)
            return value if state.get('version')==2 else math.floor(value * 1e6 + 0.5) / 1e6
        if isinstance(value, list):
            return [rounded(v) for v in value]
        if isinstance(value, dict):
            return {k: rounded(v) for k, v in value.items()}
        return value
    return json.dumps(rounded(state), ensure_ascii=False, separators=(",", ":"), allow_nan=False)
