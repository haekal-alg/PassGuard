CREATE EXTENSION "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    userId                  uuid                PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    name                    TEXT                NOT NULL,
    email                   TEXT                NOT NULL    UNIQUE,
    masterPassword          VARCHAR(128)        NOT NULL, -- master password hash
    key                     TEXT                NOT NULL, -- protected symmetric key
    salt                    TEXT                NOT NULL  -- 16 bytes
);

CREATE TABLE IF NOT EXISTS loginInfo (
    loginInfoId             uuid                PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    userId                  uuid                REFERENCES  users (userId),
    name                    TEXT                NOT NULL,
    username                TEXT                NULL,
    password                TEXT                NULL
);

CREATE TABLE IF NOT EXISTS secureNote (
    secureNoteId            uuid                PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    userId                  uuid                REFERENCES  users (userId),
    name                    TEXT                NOT NULL,
    notes                   TEXT                NULL
);

CREATE TABLE IF NOT EXISTS creditCard (
    creditCardId            uuid                PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    userId                  uuid                REFERENCES  users (userId),
    name                    TEXT                NOT NULL,
    holderName              TEXT                NULL,
    cardNumber              TEXT                NULL,
    brand                   TEXT                NULL,
    expirationDate          TEXT                NULL
);