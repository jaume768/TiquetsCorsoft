const { Usuario } = require('../models');

// Obtener el perfil del usuario autenticado
const getPerfil = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    
    const usuario = await Usuario.findByPk(usuario_id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: error.message
    });
  }
};

// Actualizar el perfil del usuario autenticado
const actualizarPerfil = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { nombre, email, password } = req.body;
    
    const usuario = await Usuario.findByPk(usuario_id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar solo los campos proporcionados
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    
    await usuario.save();
    
    // Excluir password de la respuesta
    const usuarioActualizado = await Usuario.findByPk(usuario_id, {
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      error: error.message
    });
  }
};

// Obtener todos los usuarios (solo admin)
const getTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['fecha_creacion', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: error.message
    });
  }
};

// Obtener un usuario por su ID (solo admin)
const getUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message
    });
  }
};

// Actualizar un usuario (solo admin)
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol, codprg, codcli, codusu } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar solo los campos proporcionados
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    if (rol) usuario.rol = rol;
    if (codprg) usuario.codprg = codprg;
    if (codcli) usuario.codcli = codcli;
    if (codusu) usuario.codusu = codusu;
    
    await usuario.save();
    
    // Excluir password de la respuesta
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error.message
    });
  }
};

// Eliminar un usuario (solo admin)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const admin_id = req.usuario.id;
    
    // Evitar que un admin se elimine a sí mismo
    if (id == admin_id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta de administrador'
      });
    }
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    await usuario.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      error: error.message
    });
  }
};

module.exports = {
  getPerfil,
  actualizarPerfil,
  getTodosUsuarios,
  getUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
