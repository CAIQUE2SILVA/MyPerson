# Stage 1: Build - NEXT
FROM node:20-alpine AS build

WORKDIR /app

# Instalar curl para o healthcheck funcionar
RUN apk add --no-cache curl

# # Copiar apenas arquivos de dependências primeiro (para cache)
COPY package.json package-lock.json* ./

# # Instalar dependências (com cache otimizado)
RUN npm ci || npm install

# Copiar código fonte restante
COPY . .

# Build Produção
# RUN npm run build

# Porta Produção
EXPOSE 3000
# Porta Desenvolvimento
# EXPOSE 3000

#Produção - Next.js
# CMD ["npm", "start"]

# Desenvolvimento
CMD ["npm", "run", "dev"]

