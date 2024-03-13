CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellidos VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    telefono VARCHAR(20)
);

CREATE TABLE Viajes (
    id SERIAL PRIMARY KEY,
    conductor VARCHAR(100) REFERENCES Usuarios(email),
    origen VARCHAR(100),
    destino VARCHAR(100),
    fechasalida TIMESTAMP,
    asientosdisponibles INTEGER,
    precio DECIMAL(10, 2),
    descripcion TEXT
);

CREATE TABLE Reservas (
    id SERIAL PRIMARY KEY,
    viaje INTEGER REFERENCES Viajes(id),
    pasajero VARCHAR(100) REFERENCES Usuarios(email),
    asientosreservados INTEGER,
    estadoreserva VARCHAR(20) DEFAULT 'pendiente'
);

CREATE TABLE Calificaciones (
    id SERIAL PRIMARY KEY,
    viaje INTEGER REFERENCES Viajes(id),
    calificador VARCHAR(100) REFERENCES Usuarios(email),
    puntuacion INTEGER CHECK (Puntuacion >= 1 AND Puntuacion <= 5),
    comentario TEXT
);

