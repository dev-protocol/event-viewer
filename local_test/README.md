ローカルテストを実行するためのモジュール群

```
cd local_test
docker-compose up -d
```

でpostgresが構築される

```
docker-compose exec db psql -U testuser testdb
```

で接続確認ができる

```
sh env.sh
```

で必要な環境変数が設定される

実行コマンドは
./node_modules/.bin/ts-node -r tsconfig-paths/register src/batch/event/policy-factory/test.ts
と言うイメージ


参考
https://daichan.club/container/78908
