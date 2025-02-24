FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --save-dev nodemon
RUN npm install @fastify/cors --save
RUN npx sequelize-cli db:migrate

COPY . .

CMD ["npm", "run", "dev"]
