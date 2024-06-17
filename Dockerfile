FROM node:20

WORKDIR /app

ENV PORT 8080

COPY package*.json ./

RUN npm install

COPY . .

ENV MODEL_URL=https://storage.googleapis.com/pr567-ml-model/model.json

EXPOSE 8080

CMD [ "npm", "run", "start"]