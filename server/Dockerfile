FROM alpine:latest AS builder

WORKDIR /app
RUN apk add --no-cache --update nodejs yarn

COPY package.json .
RUN yarn install --prod

FROM builder

WORKDIR /app
COPY --from=builder /app .
COPY . .

RUN yarn build

CMD ["yarn", "start"]
EXPOSE 3000
