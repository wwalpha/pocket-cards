# Build Stage
FROM node:14-alpine as build

# source folder
WORKDIR /app

COPY . .

RUN yarn install && \
  mv configs/tsconfig.ecs.json . && \
  yarn build

# Release Stage
FROM node:14-alpine
WORKDIR /app

COPY --from=build /app/dist .
COPY package.json .

RUN yarn install --production --no-lockfile

# Entry Point
ENTRYPOINT ["node", "app.js"]
