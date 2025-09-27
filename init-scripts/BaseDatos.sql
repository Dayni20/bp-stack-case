-- =====================================================
-- Script de Base de Datos para API Bancaria
-- BaseDatos.sql
-- =====================================================

DROP TABLE IF EXISTS transaction CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS person CASCADE;

CREATE TABLE person (
    identification VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    age INT NOT NULL CHECK (age > 0),
    address VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE customer (
    customer_id VARCHAR(20) PRIMARY KEY,
    identification VARCHAR(20) UNIQUE NOT NULL REFERENCES person(identification),
    password VARCHAR(100) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE account (
    account_number VARCHAR(20) PRIMARY KEY,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('Savings', 'Checking', 'Ahorro', 'Corriente')),
    initial_balance NUMERIC(12,2) NOT NULL CHECK (initial_balance >= 0),
    status BOOLEAN NOT NULL DEFAULT TRUE,
    customer_id VARCHAR(20) NOT NULL REFERENCES customer(customer_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE transaction (
    transaction_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL REFERENCES account(account_number),
    date DATE NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('CREDIT', 'DEBIT')),
    amount NUMERIC(12,2) NOT NULL,
    available_balance NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_account ON transaction(account_number);
CREATE INDEX idx_transaction_date ON transaction(date);
CREATE INDEX idx_account_customer ON account(customer_id);
CREATE INDEX idx_customer_identification ON customer(identification);

CREATE OR REPLACE FUNCTION validate_transaction() RETURNS TRIGGER AS $$
DECLARE
    current_balance NUMERIC(12,2);
    current_account RECORD;
BEGIN
    SELECT * INTO current_account FROM account WHERE account_number = NEW.account_number;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Account % does not exist', NEW.account_number;
    END IF;
    
    -- Obtener último saldo disponible de la cuenta
    SELECT COALESCE(
        (SELECT available_balance 
         FROM transaction 
         WHERE account_number = NEW.account_number 
         ORDER BY date DESC, transaction_id DESC 
         LIMIT 1),
        current_account.initial_balance
    ) INTO current_balance;
    
    -- Validar reglas de tipo de movimiento
    IF NEW.transaction_type = 'CREDIT' AND NEW.amount <= 0 THEN
        RAISE EXCEPTION 'Credits must have positive value';
    ELSIF NEW.transaction_type = 'DEBIT' AND NEW.amount >= 0 THEN
        RAISE EXCEPTION 'Debits must have negative value';
    END IF;
    
    -- Calcular saldo disponible
    IF NEW.transaction_type = 'CREDIT' THEN
        NEW.available_balance := current_balance + NEW.amount;
    ELSE -- DEBIT
        NEW.available_balance := current_balance + NEW.amount; -- amount is negative for debits
        
        -- Validate insufficient balance
        IF NEW.available_balance < 0 THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_transaction
BEFORE INSERT ON transaction
FOR EACH ROW
EXECUTE FUNCTION validate_transaction();

CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_person_timestamp
BEFORE UPDATE ON person
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_customer_timestamp
BEFORE UPDATE ON customer
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_account_timestamp
BEFORE UPDATE ON account
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


INSERT INTO person (identification, name, gender, age, address, phone)
VALUES 
    ('1010101010', 'Jose Lema', 'Male', 30, 'Otavalo sn y principal', '098254785'),
    ('2020202020', 'Marianela Montalvo', 'Female', 35, 'Amazonas y NNUU', '097548965'),
    ('3030303030', 'Juan Osorio', 'Male', 28, '13 junio y Equinoccial', '098874587');

INSERT INTO customer (customer_id, identification, password, status)
VALUES 
    ('JL-001', '1010101010', '1234', TRUE),
    ('MM-001', '2020202020', '5678', TRUE),
    ('JO-001', '3030303030', '1245', TRUE);

INSERT INTO account (account_number, account_type, initial_balance, status, customer_id)
VALUES 
    ('478758', 'Savings', 2000, TRUE, 'JL-001'),
    ('225487', 'Checking', 100, TRUE, 'MM-001'),
    ('495878', 'Savings', 0, TRUE, 'JO-001'),
    ('496825', 'Savings', 540, TRUE, 'MM-001'),
    ('585545', 'Checking', 1000, TRUE, 'JL-001');

INSERT INTO transaction (account_number, date, transaction_type, amount, available_balance)
VALUES ('478758', '2022-02-10', 'DEBIT', -575, 0);

INSERT INTO transaction (account_number, date, transaction_type, amount, available_balance)
VALUES ('225487', '2022-02-10', 'CREDIT', 600, 0);

INSERT INTO transaction (account_number, date, transaction_type, amount, available_balance)
VALUES ('495878', '2022-02-10', 'CREDIT', 150, 0);

INSERT INTO transaction (account_number, date, transaction_type, amount, available_balance)
VALUES ('496825', '2022-02-08', 'DEBIT', -540, 0);

CREATE OR REPLACE VIEW v_transaction_report AS
SELECT 
    t.date,
    p.name AS customer,
    a.account_number,
    a.account_type,
    a.initial_balance,
    a.status,
    t.amount AS transaction,
    t.available_balance
FROM 
    transaction t
    JOIN account a ON t.account_number = a.account_number
    JOIN customer c ON a.customer_id = c.customer_id
    JOIN person p ON c.identification = p.identification
ORDER BY 
    t.date DESC, p.name;

CREATE OR REPLACE FUNCTION generate_account_statement(
    p_customer_id VARCHAR(20),
    p_start_date DATE,
    p_end_date DATE
) RETURNS TABLE (
    date DATE,
    customer VARCHAR(100),
    account_number VARCHAR(20),
    account_type VARCHAR(20),
    initial_balance NUMERIC(12,2),
    status BOOLEAN,
    transaction NUMERIC(12,2),
    available_balance NUMERIC(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.date,
        p.name AS customer,
        a.account_number,
        a.account_type,
        a.initial_balance,
        a.status,
        t.amount AS transaction,
        t.available_balance
    FROM 
        transaction t
        JOIN account a ON t.account_number = a.account_number
        JOIN customer c ON a.customer_id = c.customer_id
        JOIN person p ON c.identification = p.identification
    WHERE 
        c.customer_id = p_customer_id
        AND t.date BETWEEN p_start_date AND p_end_date
    ORDER BY 
        t.date, a.account_number;
END;
$$ LANGUAGE plpgsql;


-- View person data
SELECT * FROM person;

-- View customers
SELECT * FROM customer;

-- View accounts
SELECT * FROM account;

-- View transactions with updated available balance
SELECT * FROM transaction ORDER BY date, transaction_id;

-- Test report view
SELECT * FROM v_transaction_report;

-- Test account statement function for a specific customer
SELECT * FROM generate_account_statement('MM-001', '2022-02-01', '2022-02-28');

SELECT 
    p.name AS customer,
    SUM(CASE WHEN t.transaction_type = 'CREDIT' THEN t.amount ELSE 0 END) AS total_credits,
    SUM(CASE WHEN t.transaction_type = 'DEBIT' THEN ABS(t.amount) ELSE 0 END) AS total_debits
FROM 
    transaction t
    JOIN account a ON t.account_number = a.account_number
    JOIN customer c ON a.customer_id = c.customer_id
    JOIN person p ON c.identification = p.identification
GROUP BY 
    p.name;
