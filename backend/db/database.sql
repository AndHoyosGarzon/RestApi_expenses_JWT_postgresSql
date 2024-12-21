CREATE TABLE tbluser(
    id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50),
    contact VARCHAR(15),
    accounts TEXT[],
    password TEXT,
    provider VARCHAR(10) NOT NULL,
    country TEXT,
    currency VARCHAR(5) NOT NULL DEFAULT 'USD',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tblaccount (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES tbluser(id),
    account_name  VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_balance NUMERIC(10, 2) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP    
);

CREATE TABLE tbltransaction(
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES tbluser(id),
    description TEXT NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT  'Pending',
    source VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(10) NOT NULL DEFAULT 'income',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

