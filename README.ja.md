# ComfyUI-Slap-Stickers

[English](README.md) | **日本語**

[![Slap Stickersのデモ動画を見る](https://img.youtube.com/vi/SL36R3wVEes/hqdefault.jpg)](https://youtu.be/SL36R3wVEes)

**好きなステッカーを画像の中にペタッと貼り付ける。**

Slap Stickersは、写真の中の物へロゴ・ラベル・イラストを貼るComfyUIカスタムノードです。
MoGeで写真に写った物の形を読み取るので、ボトルや果物のような丸い物にも形に沿って貼れます。
出力は元の解像度のままで、そのまま使うことも、画像編集モデルで仕上げる下絵にすることもできます。

[Lovart](https://www.lovart.ai/)からインスピレーションを受けて開発しました。

## 特徴

- **形に沿って貼れる**：ステッカーは丸い物に沿って曲がり、物の輪郭で切れます。
- **ノードの中でそのまま編集**：画像をドロップして、写真の上でドラッグ・拡縮・回転できます。
- **写真になじむ**：写真の明暗と色がステッカーにも乗ります。

## インストール

### 1. Slap Stickersを入れる

**ComfyUI Manager** から入れます。

1. ComfyUI Managerの **Custom Nodes Manager** を開きます。
2. `Slap Stickers` を検索して **Install** を押します。
3. ComfyUIを再起動します。

comfy-cliを使う場合は、Comfy Registryから入れられます。

```bash
comfy node install comfyui-slap-stickers
```

### 2. MoGeを準備する

Slap Stickersは、1枚の画像から3Dの形を推定するモデル **MoGe** を使って、写真の中の形を読み取ります。
MoGeのノードはComfyUIに標準で入っているため、モデルファイルを置くだけで使えます。

1. **ComfyUIを最新版に更新します。** `Load MoGe Model` と `Run MoGe Inference` のノードが必要です。
2. **モデルをダウンロードします。** Hugging FaceのComfy-Org/MoGeから [`moge_3_vitg_fp16.safetensors`](https://huggingface.co/Comfy-Org/MoGe/blob/main/geometry_estimation/moge_3_vitg_fp16.safetensors)（約2.5GB）を取得します。
3. **`ComfyUI/models/geometry_estimation/` に置きます。**

   ```text
   ComfyUI/
   └── models/
       └── geometry_estimation/
           └── moge_3_vitg_fp16.safetensors
   ```

4. **ComfyUIを再起動します。** `Load MoGe Model` ノードにファイルが表示されることを確認してください。

使用例のワークフローはこのモデルを使っており、動作を確認済みです。
ほかのMoGeモデルは[詳細ドキュメント](docs/reference.ja.md#mogeモデル)と[公式のMoGe手順](https://github.com/Comfy-Org/docs/blob/main/tutorials/utility/moge.mdx)を参照してください。

## 使い方

1. [使用例のワークフロー](example_workflows/slap_stickers_moge.json)を開きます。ComfyUIのテンプレートにも `slap_stickers_moge` として表示されます。
2. `Load Image` で写真を選び、ワークフローを一度実行します。Slap Stickersのノードに写真が表示されます。
3. 写真へ画像をドロップするか、**+** を押して画像を選びます。
4. ドラッグで移動、四隅で拡縮、丸いハンドルで回転します。
5. もう一度実行すると、完成した画像が出力されます。

ステッカーの画像は `ComfyUI/input/slap_stickers/` に保存されます。ワークフローを共有する際は、これらのファイルも一緒に共有してください。

## ドキュメント

- [詳細ドキュメント](docs/reference.ja.md)：操作一覧、入出力、制限、困ったとき
- [開発ガイド](docs/development.ja.md)：環境構築、ローカル開発、テスト

## ライセンス

[MIT](LICENSE) © 2026 alp-dot。
