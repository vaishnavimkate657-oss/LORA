# ==========================================================
# TripPartner Backend - Multi-Stage Dockerfile (Root Context)
# ==========================================================

# Stage 1: Build from Repository Root
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache Maven dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy backend source and build executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Secure Non-Root JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create unprivileged application user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy artifact from build stage
COPY --from=builder /app/target/*.jar app.jar

# Dynamic port binding for Render
EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
