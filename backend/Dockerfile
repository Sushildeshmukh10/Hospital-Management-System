# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy only backend code
COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/src src

# mvnw ko executable permission do
RUN chmod +x mvnw

# Build jar
RUN ./mvnw clean package -DskipTests


# ---- Run stage ----
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8185

CMD ["java", "-jar", "app.jar"]
