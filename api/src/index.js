require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { connectWithRetry } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const userRoutes = require('./routes/user.routes');
const loginRegistroRoutes = require('./routes/loginRegistro.routes');
const archivoRoutes = require('./routes/archivo.routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas estáticas para archivos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de prueba para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Tiquets Corsoft' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login-registros', loginRegistroRoutes);
app.use('/api/archivos', archivoRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ha ocurrido un error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    // Intentar conectar con reintentos
    await connectWithRetry(10, 3000);
    
    // Sincronizar modelos una vez que la conexión está establecida
    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados correctamente');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
  }
});

module.exports = app;
