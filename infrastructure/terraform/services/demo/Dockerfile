# Build Stage
FROM node:14-alpine as build

WORKDIR /app

COPY . .

RUN yarn install 
RUN yarn build

# Release Stage
FROM node:14-alpine
WORKDIR /app

COPY --from=build /app/build .
COPY package.json .

# install dependencies only
RUN yarn install --production --no-lockfile

# set express port
ENV EXPOSE_PORT=80

# expose 80 port
EXPOSE ${EXPOSE_PORT}

CMD [ "yarn", "start"]