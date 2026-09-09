# Release Stage
FROM node:24-alpine
WORKDIR /app

COPY dist .
COPY package.json .

RUN yarn install --production --no-lockfile

EXPOSE 8080

# Entry Point
ENTRYPOINT ["yarn", "start"]
