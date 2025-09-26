FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

# Rodar migrations e iniciar a aplicação no runtime
CMD npx prisma migrate deploy && node src/index.js
