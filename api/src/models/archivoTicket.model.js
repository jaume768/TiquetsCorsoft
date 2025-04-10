const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ArchivoTicket = sequelize.define('ArchivoTicket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tiquets',
      key: 'id'
    }
  },
  nombre_original: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nombre_servidor: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tamanio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ruta: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fecha_subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'archivos_tickets',
  timestamps: false
});

module.exports = ArchivoTicket;
