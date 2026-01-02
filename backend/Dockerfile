# Java 21 base image
FROM eclipse-temurin:21-jdk

# App working directory
WORKDIR /app

# Backend ka saara code copy
COPY . .

# Maven build (tests skip)
RUN ./mvnw clean package -DskipTests

# Spring Boot port
EXPOSE 8185

# App start
CMD ["java", "-jar", "target/*.jar"]
