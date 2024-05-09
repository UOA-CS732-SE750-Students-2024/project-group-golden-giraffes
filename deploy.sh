#!bin/bash

docker-compose down

docker container prune -f

docker image rm blurple-canvas-web-backend
docker image rm blurple-canvas-web-frontend

git switch main

git pull

docker-compose up -d
