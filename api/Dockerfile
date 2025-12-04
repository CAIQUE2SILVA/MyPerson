# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto
COPY *.csproj ./

# Restaurar dependências
RUN dotnet restore

# Copiar todo o código e fazer build
COPY . ./
RUN dotnet build -c Release -o /app/build

# Publicar aplicação
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Instalar curl para healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiar arquivos publicados do stage de build
COPY --from=build /app/publish .

# Expor porta 5000
EXPOSE 5000

# Variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Executar aplicação
ENTRYPOINT ["dotnet", "MyPerson.Api.dll"]
