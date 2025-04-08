const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoginRegistro = sequelize.define('LoginRegistro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  fecha_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metodo_login: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Método utilizado para el login (normal, auto, etc.)'
  }
}, {
  tableName: 'login_registros',
  timestamps: false
});

module.exports = LoginRegistro;
