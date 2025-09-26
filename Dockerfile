# Etapa base
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar deps
COPY package*.json ./
RUN npm install --production

# Copiar código
COPY . .

# Gerar cliente do Prisma
RUN npx prisma generate

# Expõe porta padrão do Railway
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "build"]
