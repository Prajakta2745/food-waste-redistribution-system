@echo off
title Food Waste Redistribution - Frontend (React Vite)
echo ===================================================
echo Starting Food Waste Redistribution Frontend...
echo ===================================================

cd /d "%~dp0food-redistribution-frontend"

if not exist "node_modules\" (
    echo [INFO] node_modules not found. Running npm install...
    call npm install
)

call npm run dev
pause
