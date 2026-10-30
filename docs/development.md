# Development guide

**English** | [日本語](development.ja.md)

Start here to contribute to Slap Stickers. For the node's behavior and model setup, see the [reference](reference.md) and [README](../README.md).

## Directory structure

```text
ComfyUI-Slap-Stickers/
├── .github/workflows/   # CI and manual Registry publishing
├── __init__.py          # ComfyUI entry point
├── slap_stickers/       # Python node, geometry, rendering and editor files
├── web_src/             # Frontend source
│   ├── components/      # Vue editor components
│   ├── stage/           # Canvas rendering, selection and pointer interaction
│   ├── worker/          # Worker client and off-thread rendering
│   └── extension.js     # ComfyUI integration
├── web/                 # Built extension distributed with the node
├── dev/                 # Vite development UI and ComfyUI API adapter
├── tests/
│   ├── python/          # Python tests
│   ├── js/              # JavaScript tests
│   ├── browser/         # Browser and ComfyUI integration tests
│   └── fixtures/        # Shared parity and compositing fixtures
├── tools/               # Development host, fixture generation and bundle checks
├── example_workflows/   # Packaged workflow templates
└── docs/                # Reference and development guides in both languages
```

## Prerequisites

- A working ComfyUI installation with the built-in MoGe nodes. Use its Python environment so the backend has the same PyTorch, NumPy and Pillow dependencies as ComfyUI. Python 3.10 or later is required.
- Node.js 20.19 or later in the 20.x series, or 22.12 or later.
- A GPU supported by your ComfyUI installation and a MoGe model for inference and integration tests. The fixture-based browser tests do not need either.

The commands below use a Unix-style shell. Run them from the repository root unless stated otherwise.

## Set up the checkout

Clone the repository, then install the JavaScript development dependencies:

```bash
npm ci
npx playwright install chromium
```

On Linux, if Playwright reports missing browser system libraries, install them with `npx playwright install-deps chromium`.

Point these variables at your ComfyUI checkout and its Python executable. Adjust the executable path if your installation uses a different environment:

```bash
export COMFY_DIR=/absolute/path/to/ComfyUI
export COMFY_PYTHON="$COMFY_DIR/venv/bin/python"
"$COMFY_PYTHON" -m pip install pytest
```

These variables are used in the examples below; they are not application settings.

## Run the development UI

Start the dedicated ComfyUI host:

```bash
"$COMFY_PYTHON" tools/start_moge_workspace.py --comfy-dir "$COMFY_DIR"
```

The helper registers this checkout as a custom node and starts ComfyUI on `http://127.0.0.1:8199`. Its inputs, outputs, user data and temporary files live in the ignored `.runtime/comfy/` directory.

The private host also uses `.runtime/comfy/models/` as its default model location. Make your MoGe model available there, or configure shared models in your ComfyUI installation's `extra_model_paths.yaml`. See the [README](../README.md#2-set-up-moge) for the model filename and download link.

In a second terminal, start Vite:

```bash
npm run dev -- --port 5187 --strictPort
```

Open **http://127.0.0.1:5187/dev/**. Choose a background to run MoGe, add a sticker, then use **Render composite** to check the Python output. Vite proxies `/comfy` requests to the dedicated host on port 8199. Keep that port when using this UI.

Changes to Vue components and JavaScript modules appear through Vite. Restart the dedicated ComfyUI process after changing Python code.

## Check the actual node

The development UI uses the same editor, but ComfyUI handles node layout, workflow state and Undo/Redo. Check those features in the host itself:

1. Build the extension with `npm run build:web`.
2. Open **http://127.0.0.1:8199/** and load `example_workflows/slap_stickers_moge.json`.
3. Choose a background and run once to load the surface. Edit, then run again to check the outputs.
4. Check both the classic renderer and Nodes 2.0. Hard-reload the browser after rebuilding `web/`.

The dedicated host loads this checkout automatically; a second copy in your regular ComfyUI installation is unnecessary for this workflow.

## Run checks

Run the Python and JavaScript tests, rebuild the extension, and verify that the distributed files match the source:

```bash
"$COMFY_PYTHON" -m pytest -q
npm test
npm run build:web
npm run check:web
```

Run browser tests with the synthetic fixtures:

```bash
npm run test:browser
```

Playwright starts Vite on port 5187. Stop any manually started Vite process first. Host-dependent tests are skipped unless the variables below are provided. Performance tests use the browser and hardware of the machine running them.

To include real MoGe inference and node integration, leave the dedicated host running and provide an absolute path to a local photo:

```bash
SS_COMFY_URL=http://127.0.0.1:8199 \
SS_REAL_BACKGROUND=/absolute/path/to/photo.png \
npm run test:browser -- --grep-invert 'interactive maps stay responsive'
```

This runs the functional tests, including both node renderers; the performance cases can be run separately with `npm run test:browser -- --grep 'interactive maps stay responsive'`.

If Vite is already running on port 5187, prefix either command with `SS_EXTERNAL_SERVER=1`. Use a dedicated ComfyUI host: integration tests upload files and execute workflows.

Some render tests support checking ComfyUI's GPU device explicitly:

```bash
SS_TEST_DEVICE=cuda "$COMFY_PYTHON" -m pytest -q tests/python/test_render.py
```

## Prepare a contribution

Work on a separate branch and open a pull request against `main`. Merging requires the **Python tests** and **Frontend checks** jobs to pass on an up-to-date branch and all review conversations to be resolved. CI runs CPU Python tests, JavaScript tests, bundle verification and fixture-based Chromium tests. GPU, real ComfyUI integration and performance checks remain local checks as described above.

- Read [AGENTS.md](../AGENTS.md) for repository constraints. Preserve saved node identifiers, ports and the `state_json` format.
- Keep behavior documented in both reference files. For a bug fix, add a regression test that fails before the fix and passes after it.
- Geometry and state rules shared by Python and JavaScript are checked against `tests/fixtures/`. Review both implementations when changing these rules.
- Include the rebuilt `web/` files whenever `web_src/` changes. `npm run check:web` detects stale bundles.
- Describe what changed and how you tested it. Include host checks for layout or workflow changes, and GPU checks for GPU-dependent rendering.

## Publish a version (maintainers)

The Registry package ID is `comfyui-slap-stickers`, under publisher `alp-dot`. Set the publishing API key as the GitHub Actions repository secret `REGISTRY_ACCESS_TOKEN`; keep its value out of source files and discussions.

1. Update `version` in `pyproject.toml` to an unused version and push the reviewed changes to `main`.
2. Open GitHub Actions, select **Publish to Comfy Registry**, then **Run workflow** on `main`.
3. Check the workflow result and the version's status on the Registry. A successful upload does not itself confirm that review and indexing have finished.

The workflow checks the frontend bundle and runs `comfy node validate` before publishing. `.comfyignore` excludes development files and tests while keeping the built editor, node code, workflow and user reference docs. For local packaging, install `comfy-cli==1.17.0` and run `comfy node pack`; it creates the ignored `node.zip` file from Git-tracked files.
