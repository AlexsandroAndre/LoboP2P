# Base Node.js
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Gerar Prisma Client durante o build
RUN npx prisma generate

# Expor a porta
EXPOSE 3000

# Rodar migrations e iniciar a aplicação ao iniciar o container
CMD npx prisma migrate deploy && node src/index.js