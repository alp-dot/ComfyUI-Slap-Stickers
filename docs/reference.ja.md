# Slap Stickers 詳細ドキュメント

[English](reference.md) | **日本語**

Slap Stickersノードの使い方の詳細です。インストールと最初の手順は[README](../README.ja.md)を参照してください。

## 操作一覧

写真をクリックするとノードにフォーカスが移ります。キーボード操作はフォーカス中に使えます。

| 操作 | 方法 |
|---|---|
| ステッカーを追加 | 画像ファイルや画像URLを写真へドロップするか、**+** を押す |
| 選択 | ステッカーかサムネイルをクリック。Shiftクリックで複数選択を切り替え、何もない所で選択解除 |
| 移動 | ステッカーをドラッグ。掴んだ点がカーソル下の面に付く |
| 拡縮 | 四隅をドラッグ。縦横比と中心は保たれる |
| 回転 | 丸いハンドルをドラッグ。<kbd>Shift</kbd> を押すと15度刻み |
| 複製 | 操作バーのボタン、または <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>D</kbd> |
| 不透明度 | 操作バーのボタンを押し、スライダーで0〜100%を調整 |
| 重なり順 | 操作バーの **Send to back**（最背面へ）／**Bring to front**（最前面へ） |
| 削除 | 操作バーのボタン、<kbd>Delete</kbd>、<kbd>Backspace</kbd> |
| ドラッグの取り消し | <kbd>Esc</kbd>。ドラッグしていないときは選択を外す |
| 元に戻す・やり直し | ComfyUIのUndo/Redo。確定した操作一回が一段になる |
| 馴染ませ度 | 写真の下の **Blend** で5つの処理を一括調整（0〜1、初期値1） |
| ノード内のグラフ操作 | ホイールと空いた所のドラッグはComfyUIのグラフを操作する |

貼り付く面は掴んだ点で決まります。手前の物体の後ろに置いたまま動かすには、背景側に出ている部分を掴みます。手前へ移すには、掴んだ点をその物体へ乗せます。面をまたいでも見た目の大きさを保ちます。空にも配置できます。写真や許可範囲の外では、最後に置けた位置を保ちます。

隠れたステッカーはサムネイルから選べます。複数選択は一括削除に対応し、移動・拡縮・回転は1枚ずつ行います。上の回転ハンドルが見切れた場合は下へ移ります。

**Blend** は陰影・質感・ボケ・粒子・色合わせをまとめて調整します。0で素材の見た目を保ち、1で推定した効果を適用します。不透明度や輪郭の切り取りは変わりません。

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
- 配置はワークフローに保存されます。既存ワークフローも使えます。ステッカーを動かすかBlendを操作すると、新しい馴染ませに切り替わります。
- `image` はリニア空間で合成します。`stickers` と `mask` をsRGBで合成すると、結果が異なる場合があります。

## ステッカーのファイル

追加した画像は `ComfyUI/input/slap_stickers/` にアップロードされます。ワークフローには画像そのものではなく、ファイルへの参照を保存します。

PNG・JPEG・WebP・GIF・BMPに対応し、アニメーションは先頭フレームを使います。その他のブラウザで読める形式は、アップロード時にPNGへ変換します。画像URLから取得できない場合は、保存したファイルをドロップしてください。
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

## 必要な環境と制限

- 通常のカメラで撮った静止画1枚に対応します。パノラマ・動画・画像バッチ・深度だけの入力には対応していません。
- WebGL2と浮動小数点カラーバッファに対応したブラウザが必要です。画像サイズの上限はブラウザとGPUによります。
- 馴染ませは1枚の写真からの推定です。新しい反射や落ち影は生成せず、細かい輪郭や強いボケには限界があります。
- Linux・NVIDIA GPU・ComfyUI 0.41.0（frontend 1.55.17）・MoGe-3 ViT-gで、旧表示とNodes 2.0を確認済みです。WindowsとmacOS／Safariの実機検証は未実施です。

## 困ったとき

| 症状 | 対処 |
|---|---|
| ノードに「Run the workflow once to load the surface」と表示される | ワークフローを実行します。ComfyUIの再起動後に写真が表示されない場合も、一度実行してください。 |
| `Load MoGe Model` にモデルが表示されない | `ComfyUI/models/geometry_estimation/` に置き、ComfyUIを再起動します。 |
| 「This geometry has no point map from a regular camera」 | `Run MoGe Inference` をつなぎます。パノラマの幾何には対応していません。 |
| 「Slap Stickers takes one image (got N)」 | バッチではなく画像を1枚だけ渡します。 |
| 「No usable surface in this image」 | 貼り付け許可マスクを確認してください。深度のない空自体には配置できます。 |
| 後段のノードが実行されず、欠落した画像が報告される | `ComfyUI/input/slap_stickers/` にファイルを戻すか、**Remove unavailable images** を使います。 |
| エディタの代わりに **Retry surface** ボタンが表示される | ボタンを押して、エディタを取り付け直します。 |
| 更新後もUIが古いまま | ComfyUIを再起動し、ブラウザのタブをキャッシュを無視して再読み込みします。 |
