# Build Stage
FROM node:14-alpine as build

# source folder
WORKDIR /app

COPY . .

RUN apk add -f git && \
  yarn install && \
  mv configs/tsconfig.ecs.json . && \
  yarn build

# Release Stage
FROM node:14-alpine
WORKDIR /app

COPY --from=build /app/dist .
COPY package.json .

RUN apk add -f git && \
  yarn install --production --no-lockfile

# ENV EXPOSE_PORT=80

# # Output Port
# EXPOSE ${EXPOSE_PORT}

# Entry Point
ENTRYPOINT ["node", "app.js"]
