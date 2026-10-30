# Slap Stickers 詳細ドキュメント

[English](reference.md) | **日本語**

Slap Stickersノードの使い方の詳細です。インストールと最初の手順は[README](../README.ja.md)を参照してください。

## 操作一覧

写真をクリックするとノードにフォーカスが移ります。キーボード操作はフォーカス中に使えます。

| 操作 | 方法 |
|---|---|
| ステッカーを追加 | 画像ファイルを写真へドロップするか、**+** を押す |
| 選択 | ステッカーをクリック。何もない所をクリックすると選択を外す |
| 移動 | ステッカーをドラッグ |
| 拡縮 | 四隅をドラッグ。縦横比と中心は保たれる |
| 回転 | 丸いハンドルをドラッグ。<kbd>Shift</kbd> を押すと15度刻み |
| 複製 | 操作バーのボタン、または <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>D</kbd> |
| 不透明度 | 操作バーのボタンを押し、スライダーで0〜100%を調整 |
| 重なり順 | 操作バーの **Send to back**（最背面へ）／**Bring to front**（最前面へ） |
| 削除 | 操作バーのボタン、<kbd>Delete</kbd>、<kbd>Backspace</kbd> |
| ドラッグの取り消し | <kbd>Esc</kbd>。ドラッグしていないときは選択を外す |
| 元に戻す・やり直し | ComfyUIのUndo/Redo。確定した操作一回が一段になる |
| ズーム | ホイールはComfyUIのキャンバスをズームする。ノード独自のズームはない |

ステッカーの中心は、使える面の上にだけ置けます。空・貼り付け許可範囲の外・写真の外では、カーソルが禁止の形になり、ステッカーは最後に置けた位置に留まります。

## 入出力

**Slap Stickers**（`SurfaceStickers`）、カテゴリ `image/compositing`。

| 入力 | 型 | 内容 |
|---|---|---|
| `geometry` | `MOGE_GEOMETRY` | 必須。`Run MoGe Inference` の出力をつなぎます。 |
| `Background override` | `IMAGE` | 任意。同じ構図・縦横比（差は1%以内）の背景へ差し替えます。元の高解像度画像などを指定します。大きさは違っても構いません。未接続なら幾何に含まれる画像を使います。 |
| `Allowed sticker area` | `MASK` | 任意。白い部分に貼り付けを許可し、黒い部分では禁止します。未接続なら有効な面全体を使います。 |

| 出力番号 | 出力 | 型 | 内容 |
|---|---|---|---|
| 0 | `image` | `IMAGE` | 背景と、表示中のすべてのステッカーの合成画像 |
| 1 | `stickers` | `IMAGE` | ステッカーだけの色。アルファを掛ける前のRGBです。 |
| 2 | `mask` | `MASK` | 表示中のすべてのステッカーをまとめたアルファ。不透明度を含みます。 |

- 出力の大きさはすべて背景と同じです。`stickers` と `mask` を組み合わせると、ステッカーだけのRGBAレイヤーになります。
- 大きな写真は、縮小したコピーでMoGeを実行し、元の画像を `Background override` へつなぐ使い方ができます。
- ステッカーの画像参照と配置設定は、エディタが非表示の入力 `state_json` に保存します。

## ステッカーのファイル

追加した画像は `ComfyUI/input/slap_stickers/` にアップロードされます。ワークフローには画像そのものではなく、ファイルへの参照を保存します。
ワークフローを共有する際は、ステッカーのファイルも一緒に共有してください。既存ワークフローは、保存済みのinput内サブフォルダを引き続き参照できます。

ファイルが見つからない場合も、背景と残りのステッカーは編集できます。ただし、ノードは出力を止めます。
ファイルを元に戻して再実行するか、**Remove unavailable images** で欠落したステッカーを取り除いてください。

## MoGeモデル

モデルはすべて `ComfyUI/models/geometry_estimation/` に置きます。Hugging FaceのComfy-Org/MoGeからダウンロードできます。

| ファイル | パラメータ数 | 説明 |
|---|---|---|
| [`moge_3_vitg_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_3_vitg_fp16.safetensors) | 1.25B | 最も精細。使用例のワークフローが使い、Slap Stickersで動作を確認済み。 |
| [`moge_3_vitl_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_3_vitl_fp16.safetensors) | 370M | 軽量なMoGe-3。Slap Stickersでは未確認。 |
| [`moge_2_vitl_normal_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_2_vitl_normal_fp16.safetensors) | 331M | 公式のMoGe手順の推奨モデル。Slap Stickersでは未確認。 |

全モデルと設定は[公式のMoGe手順](https://github.com/Comfy-Org/docs/blob/main/tutorials/utility/moge.mdx)を参照してください。

## 確認済みの環境

ComfyUI 0.41.0（frontend 1.55.17）、MoGe-3 ViT-g、LinuxとNVIDIA GPU。Nodes 2.0と旧表示の両方で確認しています。

## 制限

- 通常のカメラで撮った静止画1枚に対応します。パノラマ・動画・画像バッチ・深度だけの入力には対応していません。
- ステッカーは画像だけです。文字のステッカーはなく、一度に選択できるのは一枚です。
- 反射や落ち影などの光の当たり方は再現しません。必要に応じて画像編集モデルで仕上げてください。
- 未実装：ノード内のズーム・パン、矢印キーでの移動、フィットのショートカット、クリップボードからの貼り付け、専用のHelpページ。
- macOSでの速度と、Safariでの描画全体は確認していません。

## 困ったとき

| 症状 | 対処 |
|---|---|
| ノードに「Run the workflow once to load the surface」と表示される | ワークフローを実行します。ComfyUIの再起動後に写真が表示されない場合も、一度実行してください。 |
| `Load MoGe Model` にモデルが表示されない | `ComfyUI/models/geometry_estimation/` に置き、ComfyUIを再起動します。 |
| 「This geometry has no point map from a regular camera」 | `Run MoGe Inference` をつなぎます。パノラマの幾何には対応していません。 |
| 「Slap Stickers takes one image (got N)」 | バッチではなく画像を1枚だけ渡します。 |
| 「No usable surface in this image」 | MoGeが有効な面を見つけられませんでした。別の写真を試してください。 |
| 後段のノードが実行されず、欠落した画像が報告される | `ComfyUI/input/slap_stickers/` にファイルを戻すか、**Remove unavailable images** を使います。 |
| エディタの代わりに **Retry surface** ボタンが表示される | ボタンを押して、エディタを取り付け直します。 |
| 更新後もUIが古いまま | ComfyUIを再起動し、ブラウザのタブをキャッシュを無視して再読み込みします。 |

## 仕組み

1. MoGeは画素ごとに3Dの点を推定します。ノードはそれを解析用の格子へ縮め、深度が途切れる所を求めます。
2. 編集中は、共有のWeb Workerがステッカーを面へ投影し、WebGL2で描画します。主スレッドの処理は止めません。
   ステッカーは中心から面に沿って巻き付きます。Schmidt et al., "Interactive Decal Compositing with Discrete Exponential Maps"（SIGGRAPH 2006）を参考にしています。
3. ワークフローの実行時は、Pythonが同じ投影をComfyUIのデバイス（通常はGPU）で元の解像度に描画します。
   試験ではPythonとJavaScriptが同じJSON fixtureを読むため、プレビューと出力は同じ規則に従います。
