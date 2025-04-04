const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  codprg: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  codcli: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  codusu: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  rol: {
    type: DataTypes.ENUM('usuario', 'admin'),
    defaultValue: 'usuario',
    allowNull: false
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
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      }
    }
  }
});

// Método para comparar contraseñas
Usuario.prototype.validarPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Método para encontrar usuario por parámetros de URL
Usuario.findByUrlParams = async function(codprg, codcli, codusu) {
  return await Usuario.findOne({
    where: { codprg, codcli, codusu }
  });
};

module.exports = Usuario;
