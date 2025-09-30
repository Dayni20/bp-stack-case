###IMPORTANTE: Se cargo vacio el proyecto por conflicto del .git tanto del back como el front, por ende subi de nuevo pero igual estan los commits realizados

## BP-STACK-CASE

### 1. Detener todo

```bash
docker compose down
```

### 2. Construir y levantar los servicios con Docker
Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:
```bash
docker-compose up -d --build
```


### 3. Inicializar las tablas en la base de datos
Una vez que los contenedores estén levantados, se ejecuta el script SQL para inicializar las tablas:
```bash
docker exec -it bank-postgres psql -U dayni -d bank_customer_db -f /init-scripts/BaseDatos.sql
```

### Colección Postman
`BP-Stack-Case.postman_collection.json`