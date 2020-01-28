FROM node:13.7

WORKDIR /home/node

COPY package.json ./package.json

RUN npm install

RUN mkdir -m 777 src

CMD ["npm","start"]