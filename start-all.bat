@echo off
title Food Waste Redistribution - System Launcher
echo ===================================================
echo Launching Food Waste Redistribution Full Stack App
echo ===================================================

start "FoodShare Backend" cmd /c "%~dp0start-backend.bat"
timeout /t 5 /nobreak >nul
start "FoodShare Frontend" cmd /c "%~dp0start-frontend.bat"

echo Both services launched in separate windows!
echo Backend:  http://localhost:8080 (Swagger: http://localhost:8080/swagger-ui.html)
echo Frontend: http://localhost:5173
pause
