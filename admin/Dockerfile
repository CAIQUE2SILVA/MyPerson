# Stage 1: Build - ANGULAR
FROM node:20-alpine AS build

WORKDIR /app

# Instalar curl para o healthcheck funcionar
RUN apk add --no-cache curl

# Copiar apenas arquivos de dependências primeiro (para cache)
COPY package.json package-lock.json* ./

# Limpar cache do npm e instalar dependências (incluindo devDependencies para Angular CLI)
RUN npm cache clean --force && \
    npm install --legacy-peer-deps || npm install

# Copiar código fonte restante
COPY . .

# Build Produção
# RUN npx ng build

# Porta Produção
# EXPOSE 4000
# Porta Desenvolvimento
EXPOSE 4200

#Produção - SSR
# CMD ["node", "dist/admin/server/server.mjs"]

# Desenvolvimento
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]



