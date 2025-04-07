-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS tiquets_db;
USE tiquets_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    codigoPrograma VARCHAR(10) DEFAULT NULL,
    codigoCliente VARCHAR(10) DEFAULT NULL,
    codigoUsuario VARCHAR(10) DEFAULT NULL,
    rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de tiquets
CREATE TABLE IF NOT EXISTS tiquets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') NOT NULL DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') NOT NULL DEFAULT 'media',
    imagen_url VARCHAR(255) DEFAULT NULL,
    usuario_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de comentarios de tiquets
CREATE TABLE IF NOT EXISTS comentarios_tiquets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiquet_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tiquet_id) REFERENCES tiquets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de historial/logs (opcional)
CREATE TABLE IF NOT EXISTS historial_tiquets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiquet_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado_anterior ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') DEFAULT NULL,
    estado_nuevo ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') DEFAULT NULL,
    comentario TEXT DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tiquet_id) REFERENCES tiquets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@example.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'admin');
-- Nota: El password es "jaume2002" hasheado con bcrypt
