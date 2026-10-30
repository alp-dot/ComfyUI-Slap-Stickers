# AGENTS.md — Constitution

This file defines **non-negotiables** for coding agents working in this repo.
Put procedures, commands, and checklists in README/docs/ (or per-folder docs).

## Non-negotiables

1) **Do not break existing graphs**
- Keep **node identifiers**, **port names, order and meaning**, and the **`state_json` format** stable.
- If a breaking change is unavoidable, add an explicit **migration path** and document it.

2) **Safety / trust**
- **No network access** at runtime.
- **File I/O** only where documented: reading sticker sources from ComfyUI's input folder, writing editor files to ComfyUI's temp folder.
  Check that every user-supplied path stays inside its folder.
- **No runtime code execution** (eval/exec or similar).

3) **Dependencies & assets**
- No new dependencies beyond ComfyUI's torch, NumPy and Pillow, and the JS development dependencies declared in `package.json`.
- Never bundle model weights or large assets into the repo.

4) **Node schema**
- Use the **ComfyUI V3 node schema** (`io.ComfyNode` / `io.Schema`).

5) **UI must be Vue**
- Production DOM UI such as buttons, inspectors, menus, pickers, bars and dialogs must be **Vue components** in `web_src/components/`. Development-only Vue UI belongs in `dev/`.
- Do **not** build UI with `document.createElement`, `innerHTML`, `appendChild`, or ad-hoc `querySelector` trees in JS modules.
- Keep rendering (WebGL), math, workers, pointer state machines and ComfyUI wiring in JS modules.

6) **The built bundle is committed**
- `web/` is built from `web_src/` and committed. Every change to `web_src/` rebuilds `web/` in the same commit, and the bundle check passes.

## Working principles

1) **One rule, one owner**
- A rule (a default, a derived value, a clamp, a format, a conversion) lives in one place in code and one place in the specs.
- When Python and JS must both apply a rule, both read the same JSON fixtures in a parity test.

2) **The living spec leads the code**
- Current behavior is described in `docs/reference.md` and `docs/reference.ja.md`. A behavior change edits that spec first, as an approved diff;
  code follows it after a separate `GO` from the owner.
- The only exception is a change that keeps behavior: refactors, docs, mechanical edits. "Small" is not an exception.

3) **Fix the cause**
- A bug is fixed when a test that reproduced it fails before and passes after.
- State why the code allowed the bug, fix that, and fix the same cause elsewhere or record why not.

4) **Design before code across boundaries**
- A change that crosses Python/JS, the state format, or node surface/editor/output gets a short design agreed before code.

5) **Keep changes apart**
- Refactors and behavior changes are separate commits.

6) **Verify where it runs**
- Rendering, WebGL, workers and pointer input are verified in a real browser engine (headless Chromium counts), not only with fakes.
- Headless runs without the GPU, so GPU-dependent behavior also needs a check on the owner's real GPU.
- ComfyUI integration is checked in a real ComfyUI with both the Nodes 2.0 and the classic renderer.

7) **Delete what is obsolete**
- Superseded code, docs, flags, and dev leftovers go in the change that supersedes them.

8) **Stop early, report facts**
- When an approach is not working or a spec looks wrong, stop and report at once: what was verified and where,
  the suspected cause, and one proposed fix. Do not work around it silently.
- Keep verified facts apart from assumptions.

## Stop & ask before proceeding

- Changing **node ids**, **port meaning**, or the **state format**.
- Adding a dependency, a network access, or a new kind of file I/O; touching licensing/redistribution (fonts, icons).
- Any uncertainty about **coordinate conventions** (camera axes, pixel centers, rotation sign, size definition).
  Preserve the conventions in the existing geometry implementations and shared parity fixtures.
- Lowering output quality for speed.

## Communication with the owner

- Report to the owner in **Japanese**. Identifiers may stay in English.
- Never open, edit or comment on issues or pull requests in repositories the owner does not own (ComfyUI, the frontend, others).
  Prepare the text and hand it to the owner.
- Pull request bodies link only to things inside this repository. No external URLs.
- No AI attribution in commits or pull requests.

## Repository guidance

- Read `docs/reference.md` and `docs/reference.ja.md` for supported behavior.
- Preserve the saved node ID `SurfaceStickers`, input/output contracts and state v1 for compatibility.
- Run `python -m pytest -q`, `npm test`, `npm run build:web` and `npm run check:web` as applicable.
- Browser verification uses `npm run test:browser`; host tests require a dedicated ComfyUI instance.
- Do not create session-state or handoff files in the repository.
- Commit, push and publish only with explicit approval.
