# Build Stage
FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN yarn install 
RUN yarn build

# Release Stage
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/build .
COPY package.json .

# install dependencies only
RUN yarn install --production --no-lockfile

# expose 80 port
EXPOSE 8080

CMD [ "yarn", "start"]