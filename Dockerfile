# ---------- BUILD STAGE ----------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Maven wrapper & config
COPY backend/mvnw .
COPY backend/pom.xml .
COPY backend/.mvn .mvn
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Source code
COPY backend/src src

# Build jar
RUN ./mvnw clean package -DskipTests

# ---------- RUN STAGE ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8185
CMD ["java", "-jar", "app.jar"]
