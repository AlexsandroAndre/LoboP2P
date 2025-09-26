# Base Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências de produção
RUN npm install --production

# Copiar todo o código da aplicação
COPY . .

# Expor a porta que Railway vai usar
EXPOSE 3000

# Comando para rodar quando o container iniciar
# Gera Prisma Client, aplica migrations e inicia a aplicação
CMD npx prisma generate && npx prisma migrate deploy && node src/index.js
