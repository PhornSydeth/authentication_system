# ==========================================
# STAGE 1: Build the Spring Boot Application
# ==========================================
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml to download dependencies (Cache Layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and compile the project
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/springsecurity-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 for Render
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
