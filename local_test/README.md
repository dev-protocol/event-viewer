ローカルテストの時の DB を構築するための手段

https://daichan.club/container/78908

の手順をあとでまとめる

docker-compose up -d
docker-compose exec db psql -U testuser testdb
