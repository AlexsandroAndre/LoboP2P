# Base Node.js
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Gerar Prisma Client (não precisa do DATABASE_URL aqui)
RUN npx prisma generate

EXPOSE 3000

# Rodar migrations e iniciar a aplicação
CMD npx prisma migrate deploy && node src/index.js
