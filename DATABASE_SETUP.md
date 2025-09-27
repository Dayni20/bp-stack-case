# Bank Customer API - Configuración de Base de Datos

## Opciones de Configuración

### Opción 1: Solo Base de Datos en Docker (Recomendada para desarrollo)

Esta opción es ideal durante el desarrollo ya que permite ejecutar la aplicación directamente desde tu IDE mientras la base de datos corre en contenedores.

#### Pasos:

1. **Iniciar la base de datos:**
   ```bash
   # Ejecutar el script automático
   start-db.bat
   
   # O manualmente:
   docker-compose -f docker-compose-db.yml up -d
   ```

2. **Configurar tu aplicación:**
   - La aplicación usará el perfil `dev` por defecto
   - Configuración en `application-dev.yml`
   - Puerto de la aplicación: 8081

3. **Ejecutar la aplicación:**
   ```bash
   # Con Gradle
   ./gradlew bootRun --args='--spring.profiles.active=dev'
   
   # O desde tu IDE configurando el perfil activo como 'dev'
   ```

4. **Acceder a pgAdmin:**
   - URL: http://localhost:8080
   - Email: admin@bank.com
   - Contraseña: admin123

5. **Conectar pgAdmin a PostgreSQL:**
   - Host: postgres (o localhost si usas pgAdmin externo)
   - Puerto: 5432
   - Usuario: bank_user
   - Contraseña: bank_password
   - Base de datos: bank_customer_db

#### Detener servicios:
```bash
stop-db.bat
# O manualmente:
docker-compose -f docker-compose-db.yml down
```

### Opción 2: Todo en Docker (Para despliegue completo)

Esta opción ejecuta tanto la base de datos como la aplicación en contenedores.

#### Pasos:

1. **Construir la aplicación:**
   ```bash
   ./gradlew build
   ```

2. **Iniciar todos los servicios:**
   ```bash
   docker-compose -f docker-compose-full.yml up --build
   ```

3. **Accesos:**
   - API: http://localhost:8081
   - pgAdmin: http://localhost:8080
   - PostgreSQL: localhost:5432

#### Detener servicios:
```bash
docker-compose -f docker-compose-full.yml down
```

## Estructura de Base de Datos

La base de datos se inicializa automáticamente con:

### Tablas:
- **persona**: Datos básicos de personas
- **cliente**: Información de clientes (hereda de persona)
- **cuenta**: Cuentas bancarias
- **movimientos**: Transacciones y movimientos

### Datos de Prueba:
- 3 personas con sus respectivos clientes
- 4 cuentas de ejemplo
- Esquema: `bank_schema`

## Endpoints Principales

Basado en los requerimientos, la API debe manejar:

- `GET /clientes` - Listar clientes
- `POST /clientes` - Crear cliente
- `PUT /clientes/{id}` - Actualizar cliente
- `DELETE /clientes/{id}` - Eliminar cliente

- `GET /cuentas` - Listar cuentas
- `POST /cuentas` - Crear cuenta
- `PUT /cuentas/{id}` - Actualizar cuenta
- `DELETE /cuentas/{id}` - Eliminar cuenta

- `GET /movimientos` - Listar movimientos
- `POST /movimientos` - Crear movimiento
- `GET /reportes` - Generar reportes

## Troubleshooting

### Puerto en uso:
Si el puerto 5432 está ocupado, cambia el puerto en docker-compose:
```yaml
ports:
  - "5433:5432"  # Usa puerto 5433 localmente
```

### Problemas de conexión:
1. Verifica que los contenedores estén corriendo: `docker ps`
2. Revisa los logs: `docker-compose logs postgres`
3. Verifica conectividad: `docker exec -it bank-postgres psql -U bank_user -d bank_customer_db`

### Reiniciar base de datos:
```bash
docker-compose -f docker-compose-db.yml down -v  # Elimina también los datos
docker-compose -f docker-compose-db.yml up -d
```

## Configuración Adicional

### Variables de Entorno para Desarrollo:
```bash
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bank_customer_db
SPRING_DATASOURCE_USERNAME=bank_user
SPRING_DATASOURCE_PASSWORD=bank_password
```

### Configuración de IDE:
En tu IDE (IntelliJ, VS Code, etc.) configura:
- Perfil activo: `dev`
- Puerto: 8081
- Base de datos: PostgreSQL en localhost:5432