FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MODEL_URL=https://storage.googleapis.com/pr567-ml-model/model.json

ENV PORT=8080

EXPOSE 8080

CMD [ "npm", "start"]