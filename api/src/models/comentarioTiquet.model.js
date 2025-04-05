const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ComentarioTiquet = sequelize.define('ComentarioTiquet', {
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
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comentarios_tiquets',
  timestamps: false
});

module.exports = ComentarioTiquet;
