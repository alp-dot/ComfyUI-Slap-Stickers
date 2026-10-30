# 開発ガイド

[English](development.md) | **日本語**

Slap Stickersの開発に参加する方のためのガイドです。ノードの動作は[詳細ドキュメント](reference.ja.md)、モデルの準備は[README](../README.ja.md)を参照してください。

## ディレクトリ構成

```text
ComfyUI-Slap-Stickers/
├── __init__.py          # ComfyUIのエントリーポイント
├── slap_stickers/       # Pythonノード、幾何処理、描画、エディタ用ファイル
├── web_src/             # フロントエンドのソース
│   ├── components/      # Vueのエディタコンポーネント
│   ├── stage/           # キャンバス描画、選択、ポインター操作
│   ├── worker/          # Workerとの通信と別スレッドでの描画
│   └── extension.js     # ComfyUIとの接続
├── web/                 # ノードとともに配布するビルド済み拡張
├── dev/                 # Viteの開発用UIとComfyUI APIとの接続
├── tests/
│   ├── python/          # Pythonのテスト
│   ├── js/              # JavaScriptのテスト
│   ├── browser/         # ブラウザ・ComfyUI結合テスト
│   └── fixtures/        # 両言語の一致と合成を検証する共有fixture
├── tools/               # 開発環境の起動、fixture生成、バンドルの検証
├── example_workflows/   # 配布するワークフローのテンプレート
└── docs/                # 英語・日本語の詳細ドキュメントと開発ガイド
```

## 必要なもの

- MoGeの標準ノードを使えるComfyUI。バックエンドではComfyUIと同じPyTorch・NumPy・Pillowを使うため、ComfyUIのPython環境を使用します。Python 3.10以上が必要です。
- Node.js 20系の20.19以上、または22.12以上。
- 推論と結合テストには、ComfyUIが対応するGPUとMoGeモデルが必要です。fixtureを使うブラウザテストでは、どちらも不要です。

以下はUnix系シェルでの例です。特記がなければ、リポジトリのルートで実行してください。

## チェックアウトの準備

リポジトリをcloneし、JavaScriptの開発用依存をインストールします。

```bash
npm ci
npx playwright install chromium
```

LinuxでPlaywrightからブラウザ用のシステムライブラリ不足を報告された場合は、`npx playwright install-deps chromium`でインストールします。

ComfyUIの配置先と、そのPython実行ファイルを変数に設定します。Python環境の配置が異なる場合は、実行ファイルのパスを変更してください。

```bash
export COMFY_DIR=/absolute/path/to/ComfyUI
export COMFY_PYTHON="$COMFY_DIR/venv/bin/python"
"$COMFY_PYTHON" -m pip install pytest
```

これらは以降のコマンド例で使う変数で、アプリケーションの設定項目ではありません。

## 開発用UIを起動する

専用のComfyUIを起動します。

```bash
"$COMFY_PYTHON" tools/start_moge_workspace.py --comfy-dir "$COMFY_DIR"
```

このスクリプトは、現在のチェックアウトをカスタムノードとして登録し、`http://127.0.0.1:8199`でComfyUIを起動します。入力・出力・ユーザーデータ・一時ファイルは、Git管理対象外の`.runtime/comfy/`に保存されます。

専用環境のモデルの既定配置先も`.runtime/comfy/models/`になります。そこからMoGeモデルを参照できるようにするか、ComfyUI側の`extra_model_paths.yaml`でモデルを共有してください。モデルのファイル名とダウンロード先は[README](../README.ja.md#2-mogeを準備する)に記載しています。

別のターミナルでViteを起動します。

```bash
npm run dev -- --port 5187 --strictPort
```

**http://127.0.0.1:5187/dev/**を開きます。背景を選ぶとMoGeが実行されます。ステッカーを追加し、**Render composite**でPython側の出力を確認できます。Viteは`/comfy`へのリクエストを8199番の専用環境へ中継するため、このUIを使う場合は専用環境のポートを変更しないでください。

VueコンポーネントとJavaScriptの変更はVite経由で反映されます。Pythonコードを変更した場合は、専用ComfyUIを再起動してください。

## 実際のノードで確認する

開発用UIは同じエディタを使いますが、ノードのレイアウト、ワークフローの状態、Undo/RedoはComfyUIが管理します。これらはComfyUI上で確認します。

1. `npm run build:web`で拡張をビルドします。
2. **http://127.0.0.1:8199/**を開き、`example_workflows/slap_stickers_moge.json`を読み込みます。
3. 背景を選んで一度実行し、面を読み込みます。編集後にもう一度実行して、出力を確認します。
4. 旧表示とNodes 2.0の両方で確認します。`web/`の再ビルド後は、ブラウザをキャッシュを無視して再読み込みしてください。

専用環境には現在のチェックアウトが自動登録されるため、この手順では通常のComfyUI側へ別途コピーする必要はありません。

## 検証する

PythonとJavaScriptのテストを実行し、拡張をビルドして、配布ファイルとソースが一致することを確認します。

```bash
"$COMFY_PYTHON" -m pytest -q
npm test
npm run build:web
npm run check:web
```

合成画像のfixtureを使うブラウザテストを実行します。

```bash
npm run test:browser
```

Playwrightが5187番でViteを起動するため、手動起動したViteは先に停止してください。以下の変数を指定しない場合、ComfyUIを必要とするテストはスキップされます。性能テストの結果は、実行するマシンのブラウザとハードウェアに依存します。

実際のMoGe推論とノードの結合テストも含める場合は、専用ComfyUIを起動したまま、ローカルの写真を絶対パスで指定します。

```bash
SS_COMFY_URL=http://127.0.0.1:8199 \
SS_REAL_BACKGROUND=/absolute/path/to/photo.png \
npm run test:browser -- --grep-invert 'interactive maps stay responsive'
```

旧表示・Nodes 2.0を含む機能テストが実行されます。性能テストは、`npm run test:browser -- --grep 'interactive maps stay responsive'`で別途実行できます。

5187番ですでにViteを起動している場合は、どちらのコマンドにも`SS_EXTERNAL_SERVER=1`を付けてください。結合テストは画像をアップロードし、ワークフローを実行するため、専用のComfyUIを使います。

一部の描画テストでは、ComfyUIのGPUデバイスを明示して確認できます。

```bash
SS_TEST_DEVICE=cuda "$COMFY_PYTHON" -m pytest -q tests/python/test_render.py
```

## 変更を提出する前に

- リポジトリの制約を[AGENTS.md](../AGENTS.md)で確認します。保存済みのノードID、ポート、`state_json`形式との互換性を維持してください。
- 動作の説明は、英語・日本語のreference両方へ反映します。バグ修正では、修正前に失敗し、修正後に成功する回帰テストを追加します。
- PythonとJavaScriptで共有する幾何・状態の規則は、`tests/fixtures/`を使って検証しています。変更時は両実装を確認してください。
- `web_src/`を変更した場合は、再ビルドした`web/`も含めます。`npm run check:web`で更新漏れを検出できます。
- 変更内容と検証方法を記載します。レイアウトやワークフローの変更はComfyUI上で、GPU依存の描画はGPUでも確認してください。
