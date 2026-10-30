// Sole JS owner of the version-1 state contract; the Python counterpart reads the same fixtures.
const DAMAGED = "The sticker data is damaged.";
const SOURCE_ERROR = "The sticker source must stay inside ComfyUI/input.";
export const DEFAULTS = Object.freeze({ mode: "wrap", size: 0.25, rotation: 0, opacity: 1, shading: 0.8, edge: 0.04, visible: true, locked: false });
const ranges = { size: [0.01, 4], opacity: [0, 1], shading: [0, 1], edge: [0.005, 0.5] };
const object = v => v !== null && typeof v === "object" && !Array.isArray(v);
const fail = (message = DAMAGED) => { throw new Error(message); };
const number = v => typeof v === "number" && Number.isFinite(v) ? v : fail();
export function randomId(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');}
export const stickerId=()=>`st_${randomId().slice(0,12)}`;
export function normalizeValue(key,value){const [lo,hi]=ranges[key];return Math.min(hi,Math.max(lo,number(value)));}
export function normalizeRotation(value){const result=((number(value)+180)%360+360)%360-180;return result===-180?180:result;}
const relative = (v, filename = false) => {
  if (typeof v !== "string" || /[\0\\:]/.test(v) || v.startsWith("/") || v.split("/").some(p => p === "." || p === "..") || (filename && (!v || v.includes("/")))) fail(SOURCE_ERROR);
  return v;
};
export function parseState(raw) {
  let state;
  try { state = raw.trim() ? JSON.parse(raw) : {}; } catch { fail(); }
  if (!object(state)) fail();
  if (!("version" in state)) state.version = 1;
  if (!Number.isInteger(state.version)) fail();
  if (state.version !== 1) fail("This workflow was saved by a newer Slap Stickers. Update the node.");
  if (!("stickers" in state)) state.stickers = [];
  if (!Array.isArray(state.stickers)) fail();
  const seen = new Set();
  for (const st of state.stickers) {
    if (!object(st)) fail();
    if (!("id" in st)) st.id = stickerId();
    if (typeof st.id !== "string" || !st.id || seen.has(st.id)) fail();
    seen.add(st.id);
    if (!object(st.source)) fail(SOURCE_ERROR);
    relative(st.source.filename, true);
    if (!("subfolder" in st.source)) st.source.subfolder = "";
    relative(st.source.subfolder);
    if (!("type" in st.source)) st.source.type = "input";
    if (st.source.type !== "input") fail(SOURCE_ERROR);
    if (!("name" in st)) st.name = st.source.filename;
    if (typeof st.name !== "string") fail();
    for (const [key, val] of Object.entries(DEFAULTS)) if (!(key in st)) st[key] = val;
    if (!["flat", "wrap"].includes(st.mode) || typeof st.visible !== "boolean" || typeof st.locked !== "boolean") fail();
    if (!("anchor" in st)) st.anchor = [0.5, 0.5];
    if (!Array.isArray(st.anchor) || st.anchor.length !== 2) fail();
    st.anchor = st.anchor.map(v => Math.min(1, Math.max(0, number(v))));
    for (const key of Object.keys(ranges)) st[key] = normalizeValue(key,st[key]);
    st.rotation = normalizeRotation(st.rotation);
  }
  return state;
}
export function serializeState(state) {
  return JSON.stringify(state, (_, v) => {
    if (typeof v !== "number") return v;
    if (!Number.isFinite(v)) fail();
    return Math.round(v * 1e6) / 1e6;
  });
}
export function newSticker(source, name, anchor) {
  return { id: stickerId(), name, source, anchor, ...DEFAULTS };
}
