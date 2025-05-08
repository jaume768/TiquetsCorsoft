# TiquetsCorsoft

Sistema de gestión de tiquets para usuarios y administradores. Esta aplicación permite a los usuarios generar tiquets, enviarlos por email al administrador y hacer seguimiento de sus solicitudes, mientras que los administradores pueden gestionar todos los tiquets desde un dashboard centralizado.

## Características Principales

- **Autenticación**: Sistema de login tradicional y login automático mediante código de cliente
- **Creación de Tiquets**: Los usuarios pueden crear tiquets con título, descripción y opcionalmente adjuntar una imagen
- **Notificaciones por Email**: Envío automático de correos al administrador cuando se crea un nuevo tiquet
- **Dashboard de Usuario**: Interfaz para que los usuarios vean y gestionen sus propios tiquets
- **Dashboard de Administrador**: Panel de control para que los administradores gestionen todos los tiquets
- **Registro de Cambios**: Historial de modificaciones para seguimiento y auditoría
- **Adjuntos en Comentarios**: Los administradores pueden adjuntar archivos en los comentarios de los tiquets y los usuarios finales pueden descargarlos fácilmente

## Arquitectura

El proyecto utiliza una arquitectura de microservicios contenerizada:

- **Base de Datos**: MySQL para almacenamiento persistente
- **API Backend**: Node.js con Express
- **Frontend Usuario**: React con CSS
- **Frontend Administrador**: React con CSS
- **Infraestructura**: Docker para orquestación de servicios

## Requisitos Previos
- Docker y Docker Compose
- Node.js (v14 o superior) y npm
- MySQL (local o en contenedor)
- [Opcional] CLI de Sequelize (`npm install -g sequelize-cli`) para migraciones

## Dependencias del Proyecto
- **Backend**: express, sequelize, mysql2, multer, jsonwebtoken, bcryptjs, nodemailer
- **Frontend**: react, react-dom, axios, react-router-dom, bootstrap/fontawesome

## Configuración de la Base de Datos
1. Crear la base de datos en MySQL: `tiquetsdb`
2. Ejecutar migraciones:
   ```bash
   cd api
   npx sequelize db:migrate
   # [Opcional] Ejecutar seeders:
   npx sequelize db:seed:all
   ```

## Configuración del Servicio de Email
En `api/.env` definir las siguientes variables para notificaciones:
```bash
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=usuario@mail.com
MAIL_PASS=tu_contraseña
MAIL_FROM="Tiquets Corsoft <no-reply@mail.com>"
```

## Scripts Disponibles
- **API (Backend)**
  - `npm run dev` : inicia servidor en modo desarrollo con nodemon
  - `npm start` : inicia servidor en modo producción
  - `npm test` : ejecuta pruebas unitarias (si existen)

- **Frontend (Usuario/Admin)**
  - `npm start` : inicia servidor de desarrollo (React Fast Refresh)
  - `npm run build` : construye aplicación para producción

## Volúmenes y Persistencia
- La carpeta de uploads (`/uploads`) está mapeada como volumen en el contenedor `api` para conservar archivos adjuntos.
- La base de datos MySQL utiliza volumen Docker para persistencia de datos.

## Contribuciones
1. Hacer un fork del repositorio
2. Crear una rama feature/bugfix con un nombre descriptivo
3. Realizar cambios y pruebas
4. Abrir un Pull Request describiendo la funcionalidad

## Configuración inicial

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd TiquetsCorsoft
   ```

2. Configurar variables de entorno:
   ### API Backend (`api/.env`)
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=tiquetsdb
   DB_USER=root
   DB_PASSWORD=secret
   JWT_SECRET=tu_secreto_jwt
   UPLOAD_DIR=./uploads
   ```
   ### Frontends (`frontend-user/.env` y `frontend-admin/.env`)
   ```bash
   REACT_APP_API_URL=http://localhost:3000
   ```

3. Iniciar los servicios con Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Endpoints de la API

**Tiquets**
- GET `/tickets`: listar todos los tiquets
- GET `/tickets/:id`: obtener detalle de un tiquet
- POST `/tickets`: crear un nuevo tiquet (multipart/form-data para incluir imagen)
- PUT `/tickets/:id`: actualizar un tiquet
- DELETE `/tickets/:id`: eliminar un tiquet

**Comentarios**
- GET `/tickets/:id/comentarios`: listar comentarios de un tiquet
- POST `/tickets/:id/comentarios`: agregar comentario con archivos adjuntos (multipart/form-data)

## Manejo de Archivos Adjuntos
**Backend**
- POST `/tickets/:id/comentarios` (multipart/form-data): subir comentarios con archivos
- GET `/archivos/archivos/:archivoId`: descargar archivo de tiquet
- GET `/comentarios/archivos/:archivoId`: descargar archivo de comentario
- DELETE `/archivos/:archivoId`: eliminar archivo

**Frontend Administrador**
- En la sección de comentarios, formulario para adjuntar uno o varios archivos

**Frontend Usuario**
- Botón de descarga en cada archivo adjunto de comentario

## Acceder a las aplicaciones:
   - Frontend Usuario: http://localhost
   - Frontend Admin: http://localhost:8080
   - API: http://localhost:3000

## Desarrollo local

Para desarrollar componentes individuales:

### API
```bash
cd api
npm install
npm run dev
```

### Frontend Usuario
```bash
cd frontend-user
npm install
npm start
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm start
```

## Uso del login automático

Para utilizar el login automático, acceda a la siguiente URL con el código de cliente:
```
http://localhost/?codcli=0700&codigoSeguridad=111&usuario=NombreUsuario
```

El sistema creará automáticamente un usuario asociado a este código de cliente si no existe.

## Estructura del proyecto
```
TiquetsCorsoft/
├── api/                  # Backend Node.js
│   ├── src/              # Código fuente
│   │   ├── controllers/  # Controladores
│   │   ├── models/       # Modelos de datos
│   │   ├── routes/       # Definición de rutas
│   │   ├── middleware/   # Middleware (autenticación y permisos)
│   │   └── config/       # Configuración
│   ├── Dockerfile        # Para contenerizar la API
│   └── package.json      # Dependencias (incluye multer para uploads)
├── frontend-user/        # Frontend para usuarios
│   ├── src/              # Código fuente React
│   ├── public/           # Archivos estáticos
│   ├── Dockerfile        # Para contenerizar el frontend
│   └── package.json      # Dependencias (incluye axios para descargas)
├── frontend-admin/       # Frontend para administradores
│   ├── src/              # Código fuente React
│   ├── public/           # Archivos estáticos
│   ├── Dockerfile        # Para contenerizar el frontend
│   └── package.json      # Dependencias (incluye FormData para uploads)
├── db/                   # Configuración de base de datos
│   └── init/             # Scripts de inicialización
├── docker-compose.yml    # Configuración de Docker Compose
└── README.md             # Documentación del proyecto

## Licencia
Este proyecto está bajo la [MIT License](LICENSE).
