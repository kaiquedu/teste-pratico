FROM node:16-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./tsconfig.json ./
COPY ./ormconfig.json ./
COPY ./src ./src

RUN yarn run tsc --pretty

FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY --from=build /app/dist ./dist
COPY --from=build /app/ormconfig.json ./

COPY wait-for-it.sh ./

RUN apk add --no-cache netcat-openbsd

RUN yarn install --production

EXPOSE 3000

CMD ["./wait-for-it.sh", "db", "5432", "yarn", "start"]
