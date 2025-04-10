const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tiquet = sequelize.define('Tiquet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
    defaultValue: 'pendiente',
    allowNull: false
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente','pendiente'),
    defaultValue: 'pendiente',
    allowNull: false
  },
  imagen_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tiquets',
  timestamps: false
});

module.exports = Tiquet;
