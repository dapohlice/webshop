FROM node:8

WORKDIR /home/node

COPY ./* ./

RUN npm install

RUN mkdir -m 777 src

CMD ["npm","start"]