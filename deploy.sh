#!/usr/bin/env sh

docker-compose down

docker container prune -f

docker image rm blurple-canvas-web-backend
docker image rm blurple-canvas-web-frontend

git pull

docker-compose up -d
