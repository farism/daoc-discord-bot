FROM node:7.5-alpine

ENV PATH /root/.yarn/bin:$PATH

RUN apk update \
  && apk add curl bash gawk sed grep binutils tar inotify-tools \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils

RUN mkdir -p /app
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
WORKDIR /app

RUN yarn
