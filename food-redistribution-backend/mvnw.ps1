if (Test-Path "$HOME\.jdks\temurin-17.0.20.1") {
    $env:JAVA_HOME = "$HOME\.jdks\temurin-17.0.20.1"
    $env:Path = "$HOME\.jdks\temurin-17.0.20.1\bin;" + $env:Path
}
$mavenCmd = "$HOME\.m2\wrapper\dists\apache-maven-3.8.5-bin\5i5jha092a3i37g0paqnfr15e0\apache-maven-3.8.5\bin\mvn.cmd"
if (Test-Path $mavenCmd) {
    & $mavenCmd $args
} else {
    mvn $args
}
