SELECT * FROM movements;
SELECT * FROM accounts;
SELECT * FROM customers;
SELECT * FROM persons;

-- =====================================================
-- DROP TABLES IF THEY EXIST
-- =====================================================
DROP TABLE IF EXISTS movements CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS persons CASCADE;

-- =====================================================
-- CREATE TABLE PERSONS
-- =====================================================
CREATE TABLE persons (
                         person_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         name VARCHAR(70) NOT NULL,
                         gender VARCHAR(9),
                         age INT,
                         identification VARCHAR(10) UNIQUE,
                         address VARCHAR(100),
                         phone VARCHAR(10) NOT NULL
);

-- =====================================================
-- CREATE TABLE CUSTOMERS
-- =====================================================
CREATE TABLE customers (
                           customer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           person_id INT NOT NULL UNIQUE,
                           password VARCHAR(20) NOT NULL,
                           status BOOLEAN NOT NULL,
                           FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE CASCADE
);

-- =====================================================
-- CREATE TABLE ACCOUNTS
-- =====================================================
CREATE TABLE accounts (
                          account_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          customer_id INT NOT NULL,
                          account_number VARCHAR(10) NOT NULL UNIQUE,
                          account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('SAVINGS', 'CHECKING')),
                          initial_balance DECIMAL(19, 4) NOT NULL,
                          status BOOLEAN NOT NULL,
                          FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- =====================================================
-- CREATE TABLE MOVEMENTS
-- =====================================================
CREATE TABLE movements (
                           movement_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           account_id INT NOT NULL,
                           date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('CREDIT', 'DEBIT')),
                           value DECIMAL(19, 4) NOT NULL,
                           available_balance DECIMAL(19, 4) NOT NULL,
                           FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- PERSONS
INSERT INTO persons (name, gender, age, identification, address, phone)
VALUES
    ('Jose Lema', 'M', 30, '1234567890', 'Otavalo sn y principal', '098254785'),
    ('Marianela Montalvo', 'F', 28, '0987654321', 'Amazonas y NNUU', '097548965'),
    ('Juan Osorio', 'M', 35, '1122334455', '13 junio y Equinoccial', '098874587');

-- CUSTOMERS
INSERT INTO customers (person_id, password, status)
VALUES
    (1, '1234', TRUE),  -- Jose Lema
    (2, '5678', TRUE),  -- Marianela Montalvo
    (3, '1245', TRUE);  -- Juan Osorio

-- ACCOUNTS
INSERT INTO accounts (customer_id, account_number, account_type, initial_balance, status)
VALUES
    (1, '478758', 'SAVINGS', 2000, TRUE),    -- Jose Lema
    (2, '225487', 'CHECKING', 100, TRUE),    -- Marianela
    (3, '495878', 'SAVINGS', 0, TRUE),       -- Juan
    (2, '496825', 'SAVINGS', 540, TRUE),     -- Marianela
    (1, '585545', 'CHECKING', 1000, TRUE);   -- New account for Jose

-- MOVEMENTS
INSERT INTO movements (account_id, date, movement_type, value, available_balance)
VALUES
-- Withdrawal of 575 from account 478758 (Jose)
(1, CURRENT_TIMESTAMP, 'DEBIT', 575, 2000 - 575),
-- Deposit of 600 into account 225487 (Marianela)
(2, CURRENT_TIMESTAMP, 'CREDIT', 600, 100 + 600),
-- Deposit of 150 into account 495878 (Juan)
(3, CURRENT_TIMESTAMP, 'CREDIT', 150, 0 + 150),
-- Withdrawal of 540 from account 496825 (Marianela)
(4, CURRENT_TIMESTAMP, 'DEBIT', 540, 540 - 540);
