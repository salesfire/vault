FROM node:16-alpine

RUN apk update \
    && apk add --update tar

RUN mkdir -p /vault /usr/src/app

WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/

EXPOSE 3000
VOLUME /vault

CMD [ "npm", "start" ]
