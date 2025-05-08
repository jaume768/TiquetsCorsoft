const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ArchivoComentario = sequelize.define('ArchivoComentario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comentario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'comentarios_tiquets',
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
  tableName: 'archivos_comentarios',
  timestamps: false
});

module.exports = ArchivoComentario;
