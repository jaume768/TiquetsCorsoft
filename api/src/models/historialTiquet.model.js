const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HistorialTiquet = sequelize.define('HistorialTiquet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tiquet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tiquets',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  estado_anterior: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
    allowNull: true
  },
  estado_nuevo: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
    allowNull: true
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'historial_tiquets',
  timestamps: false
});

module.exports = HistorialTiquet;
