const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No se proporcionó token de autenticación'
    });
  }

  try {
    // Quitar el prefijo 'Bearer ' si existe
    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar si el usuario es administrador
const esAdmin = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: se requiere rol de administrador'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar el rol del usuario',
      error: error.message
    });
  }
};

module.exports = {
  verificarToken,
  esAdmin
};
