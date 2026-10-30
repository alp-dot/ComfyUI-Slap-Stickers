import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseState, serializeState } from "../../web_src/state.js";

const cases = JSON.parse(readFileSync(new URL("../fixtures/state/normalization.json", import.meta.url)));
for (const c of cases) test(c.name, () => {
  const raw = typeof c.input === "string" ? c.input : JSON.stringify(c.input);
  if (c.error) assert.throws(() => parseState(raw), { message: c.error });
  else {
    assert.deepEqual(parseState(raw), c.expected);
    assert.deepEqual(JSON.parse(serializeState(parseState(raw))), c.expected);
  }
});
