# Base Node.js
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o código e o schema
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Rodar migrations e iniciar aplicação
CMD npx prisma migrate deploy && node src/index.js
