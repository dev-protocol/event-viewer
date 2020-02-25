
docker build -t event-batch:1.0 .

でイメージ作成

docker run -it -d --name name event-batch:1.0

で起動

docker exec -i -t name bash

で中に入る
