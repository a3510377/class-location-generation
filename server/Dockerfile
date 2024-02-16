FROM alpine:latest AS node

RUN apk add --no-cache --update nodejs yarn

FROM node AS builder

WORKDIR /app

COPY package.json .
RUN yarn install --prod

FROM node

WORKDIR /app
COPY --from=builder /app .
COPY . .

RUN yarn build

CMD ["yarn", "start"]
EXPOSE 3000
