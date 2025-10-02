###IMPORTANTE: Se cargo vacio el proyecto por conflicto del .git tanto del back como el front, por ende subi de nuevo pero igual estan los commits realizados

# Customer Management System

Sistema de gestión de clientes y cuentas bancarias desarrollado con arquitectura de microservicios.

## 🛠️ Tecnologías y Versiones

### Backend
- **Lenguaje**: Java 21
- **Framework**: Spring Boot 3.4.6
- **Arquitectura**: Hexagonal (Ports & Adapters) + Microservicio REST API
- **Capas**: Domain, Application (Ports), Infrastructure (Adapters)
- **Base de Datos**: PostgreSQL 15
- **Gestión de Dependencias**: Gradle
- **Versión**: 1.0.0

### Frontend
- **Lenguaje**: JavaScript (React)
- **Framework**: React 19.1.1
- **Arquitectura**: Feature-First Architecture (organización por funcionalidades)
- **Características**: Customers, Accounts, Movements, Reports
- **Herramientas**: React Scripts 5.0.1
- **Versión**: 0.1.0

### Infraestructura
- **Containerización**: Docker & Docker Compose
- **Base de Datos**: PostgreSQL 15

## BP-STACK-CASE

### 1. Detener todo

```bash
docker compose down
```

### 2. **IMPORTANTE: Compilar el backend primero**
Antes de levantar Docker, es necesario compilar la aplicación Java del backend:

```bash
Ingresar a la carpeta del backend y ejecutar el build de Gradle:
 1. cd backend/bank-msa-bs-account-customer-api
 2. ./gradlew build
 3. cd ../..
```

### 3. Construir y levantar los servicios con Docker
Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:
```bash
docker-compose up -d --build
```


### 4. Inicializar las tablas en la base de datos
Una vez que los contenedores estén levantados, se ejecuta el script SQL para inicializar las tablas:
```bash
docker exec -it bank-postgres psql -U dayni -d bank_customer_db -f /init-scripts/BaseDatos.sql
```

### Colección Postman
`BP-Stack-Case.postman_collection.json`