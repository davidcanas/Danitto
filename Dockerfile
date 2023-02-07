FROM node:hydrogen

RUN mkdir -p /usr/danitto
WORKDIR /usr/danitto

COPY package.json /usr/danitto
COPY tsconfig.json /usr/danitto
COPY . /usr/danitto
RUN yarn 
RUN yarn tsc


CMD ["node", "--expose-gc", "./dist/main.js"]
