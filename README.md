Azure Functionsサンプル（node.js）

## 概要
- blob storageにテキストファイルアップロード
- blob storage triggerでfunctions（blob-trigger-js）を起動して、テキストの中身をstorage queueに書き込む
- sotrage queue triggerでfunctions（queue-trigger-js）を起動して、skypeに書き込む

## 準備
- Azureのアカウント作成
- 汎用ストレージアカウントを作成
  + blob storageでコンテナ"trigger"を作成
- bot frameworkからbotを登録（割愛）
- 書き込み先のskype chatにbotを招待し、conversation_idを取得（"/get name"を発行）

## デプロイ
### functionsの作成
- 新規 -> Function Appを検索して作成
  + ホスティングプランは従量課金プランとする
- 関数を２つ作成
  + blob-trigger-js
    - JavaScript -> BlobTrigger-JavaScript
    - パスは"trigger/*.txt"、ストレージアカウント接続で作成したストレージを選択
    - 統合 -> 新しい出力 -> Azure Queue Storageで、キュー名には"skype-message"を指定
  + queue-trigger-js
    - JavaScript -> QueueTrigger-JavaScript
    - パスは"skype-message"、ストレージアカウント接続で作成したストレージを選択

### ローカルgitデプロイを設定
azure portal上でソースを編集してもよいが、npm installが若干面倒なので、ローカルgitデプロイする
https://docs.microsoft.com/ja-jp/azure/app-service-web/app-service-deploy-local-git

- デプロイ資格情報を作成する
  + Function Appの設定 -> App Serviceの設定に移動 -> デプロイ資格情報
- ローカルgitを有効にする
  + Function Appの設定 -> App Serviceの設定に移動 -> デプロイオプション -> ローカルGitリポジトリ
- GIT URLの確認
  + Function Appの設定 -> App Serviceの設定に移動 -> 概要 -> GIT URL
  + ローカルにclone

### デプロイ
- ソースの編集
  + 各ディレクトリの中身をコピー
  + npm installを実行
- デプロイ
  + git add .
  + git commit -am 'initial commit'
  + git push
- 環境変数の設定
  + Function Appの設定 -> アプリケーション設定 -> アプリ設定
    - CLIENT_ID
    - CLIENT_SECRET
    - CONVERSATION_ID

### 実行
- 作成したblob storageのtriggerコンテナにテキストファイルをアップロード
- skypeにテキストの内容が書き込まれれば成功！
