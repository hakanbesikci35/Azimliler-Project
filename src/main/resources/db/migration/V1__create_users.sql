CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL CHECK (role IN ('CUSTOMER', 'OWNER')),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);