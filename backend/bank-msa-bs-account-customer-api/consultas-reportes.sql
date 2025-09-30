-- =====================================================
-- CONSULTAS PARA REPORTES - SISTEMA BANCARIO
-- =====================================================

-- 1. CONSULTA BÁSICA: Ver todos los datos relacionados
SELECT 
    p.name as customer_name,
    c.customer_id,
    c.status as customer_status,
    a.account_id,
    a.account_number,
    a.account_type,
    a.initial_balance,
    a.status as account_status,
    m.movement_id,
    m.date as movement_date,
    m.movement_type,
    m.value as movement_value,
    m.available_balance
FROM persons p
JOIN customers c ON p.person_id = c.person_id
JOIN accounts a ON c.customer_id = a.customer_id
LEFT JOIN movements m ON a.account_id = m.account_id
ORDER BY p.name, a.account_number, m.date;

-- =====================================================
-- 2. CONSULTA CON FILTROS POR CLIENTE Y FECHAS
-- (Esta es la que usa nuestro endpoint de reportes)
-- =====================================================

-- Para el cliente con ID = 1 (Jose Lema) en el rango de fechas
SELECT 
    p.name as customer_name,
    c.customer_id,
    a.account_number,
    a.account_type,
    a.initial_balance,
    m.movement_id,
    m.date as movement_date,
    m.movement_type,
    m.value as movement_value,
    m.available_balance
FROM persons p
JOIN customers c ON p.person_id = c.person_id
JOIN accounts a ON c.customer_id = a.customer_id
LEFT JOIN movements m ON a.account_id = m.account_id
WHERE c.customer_id = 1  -- Filtro por cliente
  AND (m.date IS NULL OR m.date BETWEEN '2025-08-28' AND '2025-09-30')  -- Filtro por fechas
ORDER BY a.account_number, m.date;

-- =====================================================
-- 3. RESUMEN POR CUENTA (Para el JSON de respuesta)
-- =====================================================

SELECT 
    c.customer_id,
    p.name as customer_name,
    a.account_number,
    a.account_type,
    a.initial_balance,
    COUNT(m.movement_id) as total_movements,
    COALESCE(SUM(CASE WHEN m.movement_type = 'CREDIT' THEN m.value ELSE 0 END), 0) as total_credits,
    COALESCE(SUM(CASE WHEN m.movement_type = 'DEBIT' THEN m.value ELSE 0 END), 0) as total_debits,
    MAX(m.available_balance) as current_balance
FROM persons p
JOIN customers c ON p.person_id = c.person_id
JOIN accounts a ON c.customer_id = a.customer_id
LEFT JOIN movements m ON a.account_id = m.account_id 
    AND m.date BETWEEN '2025-08-28' AND '2025-09-30'
WHERE c.customer_id = 1
GROUP BY c.customer_id, p.name, a.account_id, a.account_number, a.account_type, a.initial_balance
ORDER BY a.account_number;

-- =====================================================
-- 4. CONSULTA PARA OBTENER TODOS LOS CLIENTES
-- =====================================================

SELECT 
    c.customer_id,
    p.name,
    p.identification,
    p.phone,
    p.address,
    c.status,
    COUNT(a.account_id) as total_accounts
FROM persons p
JOIN customers c ON p.person_id = c.person_id
LEFT JOIN accounts a ON c.customer_id = a.customer_id
GROUP BY c.customer_id, p.name, p.identification, p.phone, p.address, c.status
ORDER BY c.customer_id;

-- =====================================================
-- 5. MOVIMIENTOS DETALLADOS POR CLIENTE Y RANGO DE FECHAS
-- =====================================================

SELECT 
    p.name as customer_name,
    a.account_number,
    a.account_type,
    m.date,
    m.movement_type,
    m.value,
    m.available_balance,
    CASE 
        WHEN m.movement_type = 'CREDIT' THEN '+' || m.value
        WHEN m.movement_type = 'DEBIT' THEN '-' || m.value
        ELSE '0'
    END as formatted_amount
FROM persons p
JOIN customers c ON p.person_id = c.person_id
JOIN accounts a ON c.customer_id = a.customer_id
JOIN movements m ON a.account_id = m.account_id
WHERE c.customer_id = 1
  AND m.date BETWEEN '2025-08-28' AND '2025-09-30'
ORDER BY a.account_number, m.date DESC;

-- =====================================================
-- 6. ESTADO DE CUENTA COMPLETO (Formato similar al PDF)
-- =====================================================

WITH customer_info AS (
    SELECT 
        c.customer_id,
        p.name,
        p.identification,
        p.address,
        p.phone
    FROM persons p
    JOIN customers c ON p.person_id = c.person_id
    WHERE c.customer_id = 1
),
account_summary AS (
    SELECT 
        a.account_id,
        a.account_number,
        a.account_type,
        a.initial_balance,
        COUNT(m.movement_id) as movement_count,
        COALESCE(SUM(CASE WHEN m.movement_type = 'CREDIT' THEN m.value ELSE 0 END), 0) as total_credits,
        COALESCE(SUM(CASE WHEN m.movement_type = 'DEBIT' THEN m.value ELSE 0 END), 0) as total_debits,
        COALESCE(MAX(m.available_balance), a.initial_balance) as final_balance
    FROM accounts a
    LEFT JOIN movements m ON a.account_id = m.account_id 
        AND m.date BETWEEN '2025-08-28' AND '2025-09-30'
    WHERE a.customer_id = 1
    GROUP BY a.account_id, a.account_number, a.account_type, a.initial_balance
)
SELECT 
    '=== ESTADO DE CUENTA ===' as header,
    ci.name as cliente,
    ci.identification as cedula,
    ci.address as direccion,
    ci.phone as telefono,
    '2025-08-28 a 2025-09-30' as periodo,
    '------------------------' as separator1,
    acs.account_number as numero_cuenta,
    acs.account_type as tipo_cuenta,
    acs.initial_balance as saldo_inicial,
    acs.movement_count as total_movimientos,
    acs.total_credits as total_creditos,
    acs.total_debits as total_debitos,
    acs.final_balance as saldo_final
FROM customer_info ci
CROSS JOIN account_summary acs;

-- =====================================================
-- 7. CONSULTA PARA VALIDAR LOS DATOS DE PRUEBA
-- =====================================================

-- Verificar que los datos están correctos
SELECT 'CLIENTES' as tabla, COUNT(*) as registros FROM customers
UNION ALL
SELECT 'CUENTAS' as tabla, COUNT(*) as registros FROM accounts
UNION ALL
SELECT 'MOVIMIENTOS' as tabla, COUNT(*) as registros FROM movements
UNION ALL
SELECT 'PERSONAS' as tabla, COUNT(*) as registros FROM persons;

-- Verificar movimientos por cuenta
SELECT 
    a.account_number,
    a.account_type,
    COUNT(m.movement_id) as total_movements,
    MIN(m.date) as first_movement,
    MAX(m.date) as last_movement
FROM accounts a
LEFT JOIN movements m ON a.account_id = m.account_id
GROUP BY a.account_id, a.account_number, a.account_type
ORDER BY a.account_number;

-- =====================================================
-- 8. CONSULTA PARA PROBAR DIFERENTES RANGOS DE FECHAS
-- =====================================================

-- Movimientos del último mes
SELECT 
    p.name,
    a.account_number,
    m.date,
    m.movement_type,
    m.value,
    m.available_balance
FROM persons p
JOIN customers c ON p.person_id = c.person_id
JOIN accounts a ON c.customer_id = a.customer_id
JOIN movements m ON a.account_id = m.account_id
WHERE m.date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY p.name, m.date DESC;

-- Movimientos de hoy
SELECT 
    p.name,
    a.account_number,
    m.date,
    m.movement_type,
    m.value,
    m.available_balance
FROM persons p
JOIN customers c ON p.person_id = c.person_id
JOIN accounts a ON c.customer_id = a.customer_id
JOIN movements m ON a.account_id = m.account_id
WHERE DATE(m.date) = CURRENT_DATE
ORDER BY p.name, m.date DESC;

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================

/*
Para probar el endpoint de reportes, usa esta URL:
http://localhost:8082/reports?customerId=1&startDate=2025-08-28&endDate=2025-09-30

Los parámetros son:
- customerId: ID del cliente (1, 2, o 3 según los datos de prueba)
- startDate: Fecha de inicio en formato YYYY-MM-DD
- endDate: Fecha de fin en formato YYYY-MM-DD

Ejemplos de URLs válidas:
1. http://localhost:8082/reports?customerId=1&startDate=2025-08-28&endDate=2025-09-30
2. http://localhost:8082/reports?customerId=2&startDate=2025-09-01&endDate=2025-09-30
3. http://localhost:8082/reports?customerId=3&startDate=2025-09-01&endDate=2025-09-30

Los clientes disponibles son:
- customerId=1: Jose Lema (2 cuentas: 478758-SAVINGS, 585545-CHECKING)
- customerId=2: Marianela Montalvo (2 cuentas: 225487-CHECKING, 496825-SAVINGS)
- customerId=3: Juan Osorio (1 cuenta: 495878-SAVINGS)
*/