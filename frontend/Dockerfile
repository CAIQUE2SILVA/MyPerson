# Stage 1: Build - REACT
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação React
RUN npm run build

# Stage 2: Production - NGINX
FROM nginx:alpine

# Copiar arquivos buildados do stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

