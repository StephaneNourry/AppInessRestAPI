FROM node:12-alpine

WORKDIR /api

COPY ./src .

RUN npm install

EXPOSE 8080

CMD ["node", "app.js"]