# TiquetsCorsoft

Sistema de gestión de tiquets para usuarios y administradores. Esta aplicación permite a los usuarios generar tiquets, enviarlos por email al administrador y hacer seguimiento de sus solicitudes, mientras que los administradores pueden gestionar todos los tiquets desde un dashboard centralizado.

## Características Principales

- **Autenticación**: Sistema de login tradicional y login automático mediante código de cliente
- **Creación de Tiquets**: Los usuarios pueden crear tiquets con título, descripción y opcionalmente adjuntar una imagen
- **Notificaciones por Email**: Envío automático de correos al administrador cuando se crea un nuevo tiquet
- **Dashboard de Usuario**: Interfaz para que los usuarios vean y gestionen sus propios tiquets
- **Dashboard de Administrador**: Panel de control para que los administradores gestionen todos los tiquets
- **Registro de Cambios**: Historial de modificaciones para seguimiento y auditoría

## Arquitectura

El proyecto utiliza una arquitectura de microservicios contenerizada:

- **Base de Datos**: MySQL para almacenamiento persistente
- **API Backend**: Node.js con Express
- **Frontend Usuario**: React con CSS
- **Frontend Administrador**: React con CSS
- **Infraestructura**: Docker para orquestación de servicios

## Requisitos previos

- Docker y Docker Compose
- Node.js y npm (para desarrollo local)
- Git

## Configuración inicial

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd TiquetsCorsoft
```

2. Configurar variables de entorno:
```bash
cp api/.env.example api/.env
# Editar el archivo .env con las credenciales correctas
```

3. Iniciar los servicios con Docker Compose:
```bash
docker-compose up -d
```

4. Acceder a las aplicaciones:
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
│   │   ├── middleware/   # Middleware
│   │   └── config/       # Configuración
│   ├── Dockerfile        # Para contenerizar la API
│   └── package.json      # Dependencias
├── frontend-user/        # Frontend para usuarios
│   ├── src/              # Código fuente React
│   ├── public/           # Archivos estáticos
│   ├── Dockerfile        # Para contenerizar el frontend
│   └── package.json      # Dependencias
├── frontend-admin/       # Frontend para administradores
│   ├── src/              # Código fuente React
│   ├── public/           # Archivos estáticos
│   ├── Dockerfile        # Para contenerizar el frontend
│   └── package.json      # Dependencias
├── db/                   # Configuración de base de datos
│   └── init/             # Scripts de inicialización
├── docker-compose.yml    # Configuración de Docker Compose
└── README.md             # Documentación del proyecto
```
