# Base Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar todo o código da aplicação
COPY . .

# Expor a porta que Railway vai usar
EXPOSE 3000

# Rodar Prisma generate, aplicar migrations e iniciar a aplicação no runtime
CMD npx prisma generate && npx prisma migrate deploy && node src/index.js
