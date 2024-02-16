FROM node:20

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . /app
RUN yarn build

CMD yarn start
EXPOSE 3000
