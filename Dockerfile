FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

RUN pnpm -F backend postinstall

COPY . .

RUN pnpm run build

EXPOSE 3000
EXPOSE 8000

CMD ["pnpm", "start"]
