# Base Node.js
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar todo o projeto
COPY . .

# Expor a porta do app
EXPOSE 3000

# Rodar build (Prisma generate + migrate)
RUN npx prisma generate && npx prisma migrate deploy

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]
