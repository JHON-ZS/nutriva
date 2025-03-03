CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    altura DECIMAL(5,2) NOT NULL,  -- Altura en cm, permite decimales
    peso DECIMAL(5,2) NOT NULL,    -- Peso en kg, permite decimales
    sexo VARCHAR(20) CHECK (sexo IN ('Masculino', 'Femenino', 'Otro')) NOT NULL,
    telefono VARCHAR(20) NOT NULL
);
