@echo off
echo ==========================================
echo  PH Transparente - Ejecutar Localmente
echo ==========================================
echo.
echo Este script abre 3 ventanas:
echo  1. PostgreSQL + pgAdmin (Docker)
echo  2. Backend Spring Boot
echo  3. Frontend React
echo.
pause

cd /d "%~dp0"

:: Iniciar base de datos (Docker)
start "PH DB" cmd /k "docker-compose up -d postgres pgadmin && echo Base de datos lista en puerto 5432 && echo pgAdmin en http://localhost:5050 && pause"

:: Iniciar backend
start "PH Backend" cmd /k "cd backend-springboot && mvn spring-boot:run"

:: Iniciar frontend
start "PH Frontend" cmd /k "cd frontend-react && npm install && npm run dev"

echo.
echo ==========================================
echo  Ventanas abiertas. Espera unos minutos...
echo ==========================================
echo.
pause
