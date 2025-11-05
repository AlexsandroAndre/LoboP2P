# Base Node.js
FROM node:20-alpine

# Instalar netcat para verificar conexão com o banco
RUN apk add --no-cache netcat-openbsd

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

# Aguardar o banco estar pronto e rodar migrations antes de iniciar
CMD sh -c "until nc -z db 5432; do sleep 1; done && npx prisma migrate deploy && node src/start.js"