FROM node:13.7

WORKDIR /home/node

COPY ./* ./

RUN npm install

RUN mkdir -m 777 src

CMD ["npm","start"]