@echo off
if exist "%USERPROFILE%\.jdks\temurin-17.0.20.1" (
    set "JAVA_HOME=%USERPROFILE%\.jdks\temurin-17.0.20.1"
    set "PATH=%USERPROFILE%\.jdks\temurin-17.0.20.1\bin;%PATH%"
)
set "MAVEN_CMD=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.8.5-bin\5i5jha092a3i37g0paqnfr15e0\apache-maven-3.8.5\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %*
) else (
    mvn %*
)
