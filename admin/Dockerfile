# Stage 1: Build - ANGULAR
FROM node:20-alpine AS build

WORKDIR /app

# Instalar curl para o healthcheck funcionar
RUN apk add --no-cache curl

# Copiar código fonte
COPY . .

# Instalar dependências
RUN npm install

#Instalar Angular CLI 
RUN npm install -g @angular/cli

RUN ng build

# Porta 4200
EXPOSE 4000

CMD ["node", "dist/admin/server/server.mjs"]
# CMD ["ng", "serve", "--host", "0.0.0.0"]



