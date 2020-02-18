ローカルバッチテストを実行するためのモジュール群

```
cd local_test
docker-compose up -d
```

で postgres が構築される

```
docker-compose exec db psql -U testuser testdb
```

で接続確認ができる

```
# notification discord
DISCORD_WEBHOOK_URL_INFO
DISCORD_WEBHOOK_URL_WARNING
DISCORD_WEBHOOK_URL_ERROR

# db settings
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=testuser
DB_PASSWORD=testpassword
DB_DATABASE=testdb

# ethereum
WEB3_URL
APPROVAL=30
```

上記環境変数が必要なため、設定する

実行コマンドは
./node_modules/.bin/ts-node -r tsconfig-paths/register src/batch/event/policy-factory/test.ts
と言うイメージ

参考
https://daichan.club/container/78908
