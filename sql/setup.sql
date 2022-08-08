-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS secrets;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE secrets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT REQUIRED,
    description TEXT REQUIRED,
    created_at TIMESTAMP
)

INSERT INTO secrets (
    title,
    description
)
VALUES
('Julie''s Secret', 'Benny is a good boy'),
('Kashi''s Secret', 'Chi chis love celery'),
('David Rigby''s Secret', 'Bringing donuts for vibranium!');
