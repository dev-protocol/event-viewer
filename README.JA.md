# 概要
Event-Viewerで参照するイベント情報をブロックチェーンから取得し、Postgresに保存するツール。Azure Functionsで動作する。

# ローカル開発セットアップ
## コアツールインストール
Azure Functionsをローカルで動作させるために、下記コマンドでツールをインストールする。
```
brew tap azure/functions
brew install azure-functions-core-tools@3
```
## azuriteインストール&起動
Time Triggerなどで必要なツールをインストールし、起動する。
```
npm install -g azurite
azurite -l ~/azurite
```
## DBセットアップ
データを保存するためのデータベースをローカルに構築する。事前にdocker desktopなど、dockerが稼働する環境の構築を完了しておくこと。
```
cd local_test
docker-compose up -d
```
下記コマンドでDBに接続することができる
```
docker-compose exec db psql -U testuser testdb
```
## 環境変数
Discordへのメッセージ通知Webhookなどの設定を行う。設定するファイルはlocal.settings.json。下記の4つ以外はそのままで大丈夫。

WEB3_URL: web3.jsに渡すURL
DISCORD_WEBHOOK_URL_INFO：Discordにinfo情報を通知するためのURL
DISCORD_WEBHOOK_URL_WARNING：Discordにwarning情報を通知するためのURL
DISCORD_WEBHOOK_URL_ERROR：Discordにerror情報を通知するためのURL

## Azure Functions稼働
下記コマンドでAzure Functionsが稼働する。
なお、全てのFunctionsはタイマー起動となっており、現状は一時間に一回稼働する。
```
npm install
npm start
```

今すぐテスト実行したいときは下記コマンドを実行するといい
```
market-factory-createを実行したい場合

curl --request POST -H "Content-Type:application/json" --data '{}' http://localhost:7071/admin/functions/market-factory-create
```

# 新規関数を追加する場合
新しいコントラクトがデプロイされたり、新しいイベントの情報を取得したい場合の手順を記述する

## 関数パッケージ作成
カレントで下記コマンドを実行する。(タイマー実行の場合)
```
hogehoge-factoryコントラクトのcreateイベントの場合

func new --template "Timer trigger"  --language TypeScript --name hogehoge-factory-create
```

## テーブル定義の追加
local_test/docker/db/init　以下にcreateのSQL文を追加する

あとは他の関数をみてよしなにやってください。
