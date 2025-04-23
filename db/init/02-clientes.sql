-- Script para insertar clientes
USE tiquets_db;

-- Inserción de clientes
INSERT INTO usuarios (codcli, nombre, nif, direccion, email, password, rol) VALUES
('8', 'INVERSIONES GALAXIA SL', 'B-12345678', 'AVDA. DE LAS ESTRELLAS, 12 28000 MADRID', 'contacto@galaxia.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('13', 'CONSTRUCCIONES EL ROBLE', 'B-87654321', 'CALLE MAYOR, 45 41000 SEVILLA', 'info@elroble.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('14', 'ALIMENTOS FRESCOS GOMEZ', 'B-11223344', 'AV. DEL MERCADO, 9 08000 BARCELONA', 'admin@frescosgomez.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('20', 'FRUTERIA EL NARANJO', 'E-44332211', 'PLAZA DEL SOL, 22 46000 VALENCIA', 'contacto@elnaranjo.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('38', 'FERRETERÍA MARTINEZ', 'B-99887766', 'CALLE DE LA SIERRA, 18 30000 MURCIA', 'ventas@ferremartinez.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('56', 'HOTEL LA RIVIERA SA', 'A-55443322', 'PASEO MARÍTIMO, 33 29000 MALAGA', 'info@lariviera.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('58', 'PINTURAS LOPEZ SL', 'B-66778899', 'CALLE COLORIDA, 15 50000 ZARAGOZA', 'pedidos@pinturaslopez.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('59', 'ELECTRICIDAD RUEDA SL', 'B-22334455', 'AVDA. VOLTAJE, 3 15000 A CORUÑA', 'info@electricidadrueda.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('96', 'AGENCIA VIAJERA, S.A.', 'A-33445566', 'CALLE VIAJE, 89 28001 MADRID', 'reservas@viajera.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('123', 'LUIS FERNANDEZ GARCIA', NULL, 'CALLE DEL CAMINO, 12 32000 OURENSE', 'luis.fernandez@correo.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('130', 'CEREALES DEL CAMPO SL', 'B-44556677', 'CARRETERA DEL VALLE, KM 2 24000 LEON', 'info@cerealescampo.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('162', 'TALLERES FERRER SL', 'B-55667788', 'AVENIDA TALLERES, 6 34000 PALENCIA', 'contacto@tallerferrer.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('163', 'PESCADOS ATLÁNTICO SL', 'B-66779988', 'PUERTO PESQUERO, 4 15002 A CORUÑA', 'info@pescadosatlantico.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('173', 'CAFETERÍA EL FARO SL', 'B-77889900', 'CALLE DEL FARO, 21 12000 CASTELLON', 'elfaro@cafeterias.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('175', 'PANADERÍA LA MASA SL', 'B-88990011', 'CALLE HARINA, 8 13000 CIUDAD REAL', 'pedidos@panlamasa.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('176', 'SILLAS Y MESAS SUR SL', 'B-99001122', 'AVENIDA DEL SUR, 56 41010 SEVILLA', 'ventas@sillasmesasur.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('179', 'TRANSPORTES RAPIDOS SL', 'B12349876', 'AV. DEL TRANSPORTE, 30 33000 OVIEDO', 'logistica@transrapidos.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('188', 'DECORACIONES MODERNAS SL', 'B-22331100', 'CALLE DECORACIÓN, 9 18000 GRANADA', 'info@decoracionesmodernas.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('202', 'HERMANOS VERA CB', 'E33445566', 'PLAZA DEL MERCADO, 5 22000 HUESCA', 'vera.hermanos@correo.es', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('225', 'ANA BELEN MARTIN', '12345678-Z', 'CALLE DEL PINO, 12 21000 HUELVA', 'anabelen.martin@gmail.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('231', 'GRUPO KM CERO SL', 'B-33557799', 'CALLE PRINCIPAL, 14 LOCAL 1 37000 SALAMANCA', 'contacto@kmcero.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('236', 'JOSE ANTONIO CARRASCO', '87654321-X', 'AV. LOS ROBLES, 17 27000 LUGO', 'joseantonio.c@gmail.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('245', 'MIQUEL Y HERMANOS SL', 'B-44556688', 'CALLE DEL CASTILLO, 35 43000 TARRAGONA', 'info@miquelyhermanos.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('246', 'JUAN CARLOS GOMEZ', '98765432-N', 'PLAZA MAYOR, 20 25000 LLEIDA', 'jcarlosgomez@gmail.com', '$2a$10$ficticioHash12345678901234567890', 'usuario'),
('257', 'GRUPO INDUSTRIAL BISBAL SL', 'B-55667799', 'CALLE INDUSTRIAL, 3 26000 LOGROÑO', 'info@grupobisbal.com', '$2a$10$ficticioHash12345678901234567890', 'usuario');
