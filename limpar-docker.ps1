# Script para limpar Docker e resolver problemas de I/O

Write-Host "Limpando containers parados..." -ForegroundColor Yellow
docker container prune -f

Write-Host "Limpando imagens não utilizadas..." -ForegroundColor Yellow
docker image prune -a -f

Write-Host "Limpando volumes não utilizados..." -ForegroundColor Yellow
docker volume prune -f

Write-Host "Limpando networks não utilizadas..." -ForegroundColor Yellow
docker network prune -f

Write-Host "`nLimpeza concluída! Tente executar 'docker-compose up -d' novamente." -ForegroundColor Green

