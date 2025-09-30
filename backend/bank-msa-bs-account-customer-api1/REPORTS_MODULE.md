# Módulo de Reportes - Documentación

## Descripción
El módulo de reportes permite generar estados de cuenta para clientes en un rango de fechas específico. Los reportes incluyen información detallada de todas las cuentas del cliente, sus movimientos en el período solicitado, y un resumen con totales de créditos y débitos.

## Endpoint

### GET /reports
Genera el estado de cuenta para un cliente en un rango de fechas determinado.

**Parámetros de consulta:**
- `customerId` (required): ID del cliente (string)
- `startDate` (required): Fecha de inicio del reporte en formato YYYY-MM-DD
- `endDate` (required): Fecha final del reporte en formato YYYY-MM-DD

**Ejemplo de solicitud:**
```http
GET /reports?customerId=1&startDate=2023-06-01&endDate=2023-06-30
```

**Respuesta exitosa (200 OK):**
```json
{
  "customer": {
    "customerId": "1",
    "name": "Jose Lema"
  },
  "dateRange": {
    "start": "2023-06-01",
    "end": "2023-06-30"
  },
  "accounts": [
    {
      "accountNumber": "478758",
      "accountType": "SAVINGS",
      "initialBalance": 2000.0,
      "transactions": [
        {
          "date": "2023-06-15",
          "transactionType": "DEBIT",
          "amount": -575.0,
          "availableBalance": 1425.0
        },
        {
          "date": "2023-06-20",
          "transactionType": "CREDIT",
          "amount": 300.0,
          "availableBalance": 1725.0
        }
      ],
      "totals": {
        "totalDebits": 575.0,
        "totalCredits": 300.0
      }
    }
  ],
  "pdfBase64": "RVNUQURPIERFIENVRU5UQSBCQU5DQVJJT..."
}
```

**Respuestas de error:**
- `400 Bad Request`: Parámetros inválidos
- `404 Not Found`: Cliente no encontrado o sin cuentas
- `500 Internal Server Error`: Error interno del servidor

## Implementación

### Arquitectura
El módulo sigue la arquitectura hexagonal del proyecto:

1. **Puerto de entrada (Input Port)**: `ReportService`
2. **Implementación del servicio**: `ReportServiceImpl`
3. **Controlador REST**: `ReportController`
4. **Manejo de excepciones**: `GlobalExceptionHandler`

### Componentes principales

#### ReportService
Interface que define el contrato para el servicio de reportes:
```java
public interface ReportService {
    AccountStatement getAccountStatement(String customerId, LocalDate startDate, LocalDate endDate);
}
```

#### ReportServiceImpl
Implementación que:
1. Valida la existencia del cliente
2. Obtiene todas las cuentas del cliente
3. Filtra los movimientos por rango de fechas
4. Calcula totales de créditos y débitos
5. Genera un PDF (simulado) con el estado de cuenta

#### ReportController
Controlador REST que implementa la API generada desde OpenAPI spec.

### Características

1. **Filtrado por fechas**: Los movimientos se filtran exactamente por el rango de fechas solicitado
2. **Múltiples cuentas**: Soporta clientes con múltiples cuentas
3. **Cálculo de totales**: Calcula automáticamente totales de créditos y débitos
4. **Generación de PDF**: Incluye un PDF en base64 (actualmente simulado)
5. **Manejo de errores**: Respuestas apropiadas para diferentes escenarios de error

### Datos de prueba
Para probar el endpoint, puedes usar los datos de muestra incluidos en `BaseDatos.sql`:

- Cliente ID: 1 (Jose Lema)
- Cliente ID: 2 (Marianela Montalvo)
- Cliente ID: 3 (Juan Osorio)

**Ejemplo de prueba:**
```bash
curl -X GET "http://localhost:8080/reports?customerId=1&startDate=2023-01-01&endDate=2023-12-31"
```

### Tests
El módulo incluye tests unitarios y de integración:

- `ReportControllerTest`: Tests unitarios del controlador
- `ReportServiceImplTest`: Tests unitarios del servicio
- `ReportControllerIntegrationTest`: Tests de integración

### Futuras mejoras
1. **Generación real de PDF**: Integrar librería como iText para generar PDFs reales
2. **Paginación**: Agregar soporte para reportes con muchos movimientos
3. **Formatos adicionales**: Soporte para Excel, CSV, etc.
4. **Filtros avanzados**: Filtros por tipo de cuenta, tipo de movimiento, etc.
5. **Cache**: Implementar cache para reportes frecuentemente solicitados
6. **Asíncrono**: Para reportes muy grandes, implementar generación asíncrona