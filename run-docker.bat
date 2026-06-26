@echo off
echo ==========================================
echo  PH Transparente - Ejecutar en Docker
echo ==========================================
echo.
echo Levantando: PostgreSQL + pgAdmin + API + Frontend
echo.
pause
cd /d "%~dp0"
docker-compose down
docker-compose up -d --build
echo.
echo ==========================================
echo  Servicios iniciados:
echo   - Frontend:     http://localhost:5173
echo   - Backend API:  http://localhost:8081/api
echo   - pgAdmin DB:   http://localhost:5050
echo ==========================================
echo.
pause
