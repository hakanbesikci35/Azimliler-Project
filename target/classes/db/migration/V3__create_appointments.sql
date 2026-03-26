CREATE TABLE appointments (
    id           BIGSERIAL PRIMARY KEY,
    customer_id  BIGINT      NOT NULL REFERENCES users(id),
    business_id  BIGINT      NOT NULL REFERENCES businesses(id),
    service_id   BIGINT      NOT NULL REFERENCES services(id),
    start_time   TIMESTAMP   NOT NULL,
    end_time     TIMESTAMP   NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CANCELLED')),
    notes        TEXT,
    created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),

    CONSTRAINT no_overlap UNIQUE (business_id, start_time)
);