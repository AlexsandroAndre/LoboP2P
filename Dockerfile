# Base Node.js
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json e instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar o código da aplicação
COPY . .

# Gerar Prisma Client no build (não precisa do DATABASE_URL para gerar)
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Start script: aplicar migrations e iniciar app
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
