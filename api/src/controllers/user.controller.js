const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

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

// Obtener todos los usuarios con paginación y filtros (solo admin)
const getTodosUsuarios = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, busqueda = '', rol } = req.query;
    
    // Convertir a números
    const paginaNum = parseInt(pagina, 10);
    const limiteNum = parseInt(limite, 10);
    
    // Calcular offset para paginación
    const offset = (paginaNum - 1) * limiteNum;
    
    // Construir condiciones de búsqueda
    const where = {};
    
    // Filtrar por rol si se especifica
    if (rol && (rol === 'admin' || rol === 'usuario')) {
      where.rol = rol;
    }
    
    // Búsqueda por nombre, email o codcli
    if (busqueda) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { email: { [Op.like]: `%${busqueda}%` } },
        { codcli: { [Op.like]: `%${busqueda}%` } }
      ];
    }
    
    // Obtener total de usuarios y datos paginados
    const { count, rows: usuarios } = await Usuario.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['fecha_creacion', 'DESC']],
      limit: limiteNum,
      offset: offset
    });
    
    return res.status(200).json({
      success: true,
      data: usuarios,
      total: count,
      pagina: paginaNum,
      limite: limiteNum,
      totalPaginas: Math.ceil(count / limiteNum)
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
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
    const { nombre, email, password, rol, codcli, nif, direccion } = req.body;
    
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
    
    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }
    
    if (rol) usuario.rol = rol;
    if (codcli !== undefined) usuario.codcli = codcli;
    if (nif !== undefined) usuario.nif = nif;
    if (direccion !== undefined) usuario.direccion = direccion;
    
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

// Crear un nuevo usuario (solo admin)
const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, codcli, nif, direccion } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son campos obligatorios'
      });
    }
    
    // Verificar si el email ya está en uso
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está en uso'
      });
    }
    
    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'usuario',
      codcli,
      nif,
      direccion
    });
    
    // Excluir la contraseña de la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    
    return res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
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
  eliminarUsuario,
  createUsuario
};
