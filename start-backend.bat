@echo off
title Food Waste Redistribution - Backend (Spring Boot)
echo ===================================================
echo Starting Food Waste Redistribution Backend...
echo ===================================================

echo Checking if port 8080 is already occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r /c:":8080 .*LISTENING"') do (
    echo Freeing port 8080 - terminating PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

if exist "%USERPROFILE%\.jdks\temurin-17.0.20.1" (
    set "JAVA_HOME=%USERPROFILE%\.jdks\temurin-17.0.20.1"
    set "PATH=%USERPROFILE%\.jdks\temurin-17.0.20.1\bin;%PATH%"
)

cd /d "%~dp0food-redistribution-backend"

set "MAVEN_CMD=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.8.5-bin\5i5jha092a3i37g0paqnfr15e0\apache-maven-3.8.5\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" spring-boot:run
) else (
    mvn spring-boot:run
)
pause
