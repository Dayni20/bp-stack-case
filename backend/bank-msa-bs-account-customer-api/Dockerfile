# Dockerfile para aplicación Spring Boot
FROM openjdk:21-jdk-slim

# Crear directorio de la aplicación
WORKDIR /app

# Copiar el jar de la aplicación
COPY build/libs/*.jar app.jar

# Exponer el puerto
EXPOSE 8081

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=docker

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]