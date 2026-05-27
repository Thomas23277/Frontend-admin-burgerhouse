@echo off
echo ===========================================
echo     INICIANDO FRONTEND ADMIN - BURGER HOUSE
echo ===========================================
echo.
cd /d "%~dp0"

:: Instalar dependencias si no existen
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

echo.
echo Cuando vea "Local: http://localhost:5174"
echo Abra el navegador en esa direccion
echo.
echo Presione Ctrl+C para detener
echo.
npm run dev
pause
