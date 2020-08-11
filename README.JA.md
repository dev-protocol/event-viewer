# 概要

event-saver で取得した Dev Protocol のイベントデータを GraphQL で取得する。Azure Functions で動作する。

# ローカル開発セットアップ

## コアツールインストール

Azure Functions をローカルで動作させるために、下記コマンドでツールをインストールする。

```
brew tap azure/functions
brew install azure-functions-core-tools@3
```

## 環境変数

設定するファイルは local.settings.json。下記の 4 つ以外はそのままで大丈夫。

```
HASERA_REQUEST_DESTINATION：HasuraのAPI URL
HASERA_ROLE：クエリを実行するHasuraロール名
HASURA_SECRET：Hasuraのシークレットキー
```

## 関連ライブラリインストール

```
npm install
```

## azurite 起動

別画面などで起動する。

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
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ account_lockup_sum_values { account_address sum_values} }" }' http://localhost:7071/v1/graphql
```

# 新規関数を追加する場合

## 関数パッケージ作成

カレントで下記コマンドを実行する。

```
httpリクエストで実行される関数を作成する場合
func new --name events --template "HTTP trigger" --language TypeScript
```

あとは他の関数をみてよしなにやってください。
