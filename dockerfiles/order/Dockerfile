FROM node:12.14

WORKDIR /home/node

COPY ./* ./

RUN npm install

RUN mkdir -m 777 src

CMD ["npm","start"]