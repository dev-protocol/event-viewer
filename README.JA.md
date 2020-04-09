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
cd local_test/db
docker-compose up -d
```

下記コマンドで DB に接続することができる

```
psql postgresql://testuser@localhost:5432/testdb
パスワード：testpassword
```

## 環境変数

設定するファイルは local.settings.json。下記の 4 つ以外はそのままで大丈夫。

```
WEB3_URL: web3.js に渡す URL
DISCORD_WEBHOOK_URL_INFO：Discord に info 情報を通知するための URL
DISCORD_WEBHOOK_URL_WARNING：Discord に warning 情報を通知するための URL
DISCORD_WEBHOOK_URL_ERROR：Discord に error 情報を通知するための URL
HASERA_REQUEST_DESTINATION：HasuraのAPI URL
HASERA_ROLE：クエリを実行するHasuraロール名
HASURA_SECRET：Hasuraのシークレットキー
```

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

```
npm start
```

今すぐテスト実行したいときは下記コマンドを実行するといい

```
market-factory-createを実行したい場合

curl --request POST -H "Content-Type:application/json" --data '{}' http://localhost:7071/admin/functions/market-factory-create

イベントデータを取得したい場合
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ allocator_before_allocation { blocks mint token_value market_value assets total_assets} }" }' http://localhost:7071/events/v1/graphql
```

## コンソールセットアップ

Linux、Windows の場合は必要に応じてパラメータを変更してください。
https://hasura.io/docs/1.0/graphql/manual/deployment/docker/index.html

```
cd local_test/console
docker-compose up -d
```

下記 URL をブラウザで開くとコンソールが起動する

```
http://localhost:8080/console
```

また下記コマンドでもデータを取得することができる

```
curl -X POST -H "Content-Type: application/json" -H "x-hasura-admin-secret: hasurakey" --data '{ "query": "{ market_factory_create { block_number } }" }' http://localhost:8080/v1/graphql
```

# 新規関数を追加する場合

新しいコントラクトがデプロイされたり、新しいイベントの情報を取得したい場合の手順を記述する

## 関数パッケージ作成

カレントで下記コマンドを実行する。(タイマー実行の場合)

```
hogehoge-factoryコントラクトのcreateイベントの場合

func new --template "Timer trigger"  --language TypeScript --name hogehoge-factory-create

httpリクエストで実行される関数を作成する場合
func new --name events --template "HTTP trigger" --language TypeScript
```

## テーブル定義の追加

local_test/docker/db/init 　以下に create の SQL 文を追加する
entities 　以下に テーブル定義を追加する

あとは他の関数をみてよしなにやってください。
