# 概要

Event-Viewer で参照するイベント情報をブロックチェーンから取得し、Postgres に保存するツール。Azure Functions で動作する。

# ローカル開発セットアップ

## コアツールインストール

Azure Functions をローカルで動作させるために、下記コマンドでツールをインストールする。

```
brew tap azure/functions
brew install azure-functions-core-tools@3
```

## DB セットアップ

データを保存するためのデータベースをローカルに構築する。事前に docker desktop など、docker が稼働する環境の構築を完了しておくこと。

```
cd local_test
docker-compose up -d
```

下記コマンドで DB に接続することができる

```
docker-compose exec db psql -U testuser testdb
```

## 環境変数

Discord へのメッセージ通知 Webhook などの設定を行う。設定するファイルは local.settings.json。下記の 4 つ以外はそのままで大丈夫。

WEB3_URL: web3.js に渡す URL
DISCORD_WEBHOOK_URL_INFO：Discord に info 情報を通知するための URL
DISCORD_WEBHOOK_URL_WARNING：Discord に warning 情報を通知するための URL
DISCORD_WEBHOOK_URL_ERROR：Discord に error 情報を通知するための URL

## 関連ライブラリインストール

```
npm install
```

## azurite 起動

Time Trigger などで必要なツールを別画面などで起動する。

```
azurite -l ~/azurite
```

## Azure Functions 起動

下記コマンドで Azure Functions が稼働する。
なお、全ての Functions はタイマー起動となっており、現状は一時間に一回稼働する。

```
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

local_test/docker/db/init 　以下に create の SQL 文を追加する

あとは他の関数をみてよしなにやってください。

# デプロイ

カレントで下記コマンドを実行し、必要に応じて環境変数を設定してください。

```
func azure functionapp publish dev-protocol-event-viewer
```
