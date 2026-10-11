# ====================================================================
# Multi-stage Dockerfile for Spring Boot Backend (Root context)
# ====================================================================

FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and dependencies from the backend folder
COPY food-redistribution-backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source code and build jar
COPY food-redistribution-backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/food-redistribution-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
