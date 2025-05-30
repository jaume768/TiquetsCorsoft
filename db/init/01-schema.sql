-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS tiquets_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tiquets_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    codcli VARCHAR(10) DEFAULT NULL,
    Codw VARCHAR(20) DEFAULT NULL,
    nif VARCHAR(15) DEFAULT NULL,
    direccion VARCHAR(255) DEFAULT NULL,
    rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de tiquets
CREATE TABLE IF NOT EXISTS tiquets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') NOT NULL DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta', 'urgente','pendiente') NOT NULL DEFAULT 'pendiente',
    imagen_url VARCHAR(255) DEFAULT NULL,
    usuario_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de archivos adjuntos
CREATE TABLE IF NOT EXISTS archivos_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_servidor VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    tamanio INT NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tiquets(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de comentarios de tiquets
CREATE TABLE IF NOT EXISTS comentarios_tiquets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiquet_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tiquet_id) REFERENCES tiquets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de registros de login
CREATE TABLE IF NOT EXISTS login_registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    metodo_login VARCHAR(50) DEFAULT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@example.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'admin');
-- Nota: El password es "jaume2002" hasheado con bcrypt
