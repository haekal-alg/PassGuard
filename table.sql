CREATE TABLE IF NOT EXISTS users (
    userId          SERIAL  PRIMARY KEY,
    name            TEXT    NOT NULL,
    email           TEXT    NOT NULL,
    masterPassword  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS loginInfo (
    logInfoId       SERIAL  PRIMARY KEY,
    userId          INT     REFERENCES users (userId),
    name            TEXT    NOT NULL,
    username        TEXT    NULL,
    password        TEXT    NULL
);

CREATE TABLE IF NOT EXISTS secureNote (
    secNoteId       SERIAL  PRIMARY KEY,
    userId          INT     REFERENCES users (userId),
    name            TEXT    NOT NULL,
    notes           TEXT    NULL
);

CREATE TABLE IF NOT EXISTS creditCard (
    cardId          SERIAL  PRIMARY KEY,
    userId          INT     REFERENCES users (userId),
    name            TEXT    NOT NULL,
    holderName      TEXT    NULL,
    cardNumber      TEXT    NULL,
    brand           TEXT    NULL,
    expirationDate  TEXT    NULL
);