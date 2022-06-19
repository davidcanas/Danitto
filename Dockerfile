FROM node:gallium

RUN mkdir -p /usr/danitto
WORKDIR /usr/danitto

COPY package.json /usr/danitto
COPY tsconfig.json /usr/danitto
COPY . /usr/danitto
RUN npm install -g typescript
RUN yarn 
RUN tsc


CMD ["node", "./dist/main.js"]