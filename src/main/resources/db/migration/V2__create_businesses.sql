CREATE TABLE businesses (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT       NOT NULL REFERENCES users(id),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    phone       VARCHAR(20),
    address     VARCHAR(500),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
    id                BIGSERIAL PRIMARY KEY,
    business_id       BIGINT       NOT NULL REFERENCES businesses(id),
    name              VARCHAR(255) NOT NULL,
    duration_minutes  INT          NOT NULL,
    price             NUMERIC(10,2)
);

CREATE TABLE working_hours (
    id           BIGSERIAL PRIMARY KEY,
    business_id  BIGINT  NOT NULL REFERENCES businesses(id),
    day_of_week  VARCHAR(10) NOT NULL CHECK (day_of_week IN ('MON','TUE','WED','THURS','FRI','SAT','SUN')),
    start_time   TIME    NOT NULL,
    end_time     TIME    NOT NULL
);