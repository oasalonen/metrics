FROM node:8

WORKDIR /usr/src/app

COPY package.json package-lock*.json ./

RUN npm install

COPY . .

EXPOSE 9021

CMD ["/bin/sh", "-c", "npm start"]