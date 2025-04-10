const { sequelize } = require('../config/database');
const Usuario = require('./usuario.model');
const Tiquet = require('./tiquet.model');
const HistorialTiquet = require('./historialTiquet.model');
const ComentarioTiquet = require('./comentarioTiquet.model');
const LoginRegistro = require('./loginRegistro.model');
const ArchivoTicket = require('./archivoTicket.model');

// Definir relaciones entre modelos
Usuario.hasMany(Tiquet, { foreignKey: 'usuario_id', as: 'tiquets' });
Tiquet.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Tiquet.hasMany(HistorialTiquet, { foreignKey: 'tiquet_id', as: 'historial' });
HistorialTiquet.belongsTo(Tiquet, { foreignKey: 'tiquet_id', as: 'tiquet' });

Usuario.hasMany(HistorialTiquet, { foreignKey: 'usuario_id', as: 'historial' });
HistorialTiquet.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones para comentarios
Tiquet.hasMany(ComentarioTiquet, { foreignKey: 'tiquet_id', as: 'comentarios' });
ComentarioTiquet.belongsTo(Tiquet, { foreignKey: 'tiquet_id', as: 'tiquet' });

Usuario.hasMany(ComentarioTiquet, { foreignKey: 'usuario_id', as: 'comentarios' });
ComentarioTiquet.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones para registros de login
Usuario.hasMany(LoginRegistro, { foreignKey: 'usuario_id', as: 'login_registros' });
LoginRegistro.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones para archivos de tickets
Tiquet.hasMany(ArchivoTicket, { foreignKey: 'ticket_id', as: 'archivos' });
ArchivoTicket.belongsTo(Tiquet, { foreignKey: 'ticket_id', as: 'ticket' });

// Sincronizar modelos con la base de datos
// En producción, se recomienda usar { force: false } o migrations
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
  }
};

// Sincronizar modelos al iniciar la aplicación
syncModels();

module.exports = {
  sequelize,
  Usuario,
  Tiquet,
  HistorialTiquet,
  ComentarioTiquet,
  LoginRegistro,
  ArchivoTicket
};
