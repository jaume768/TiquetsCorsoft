const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { registrarLogin } = require('./loginRegistro.controller');

// Función para generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// Controlador para login tradicional
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se enviaron los campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son requeridos'
      });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar password
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token JWT
    const token = generarToken(usuario);
    
    // Registrar el inicio de sesión
    await registrarLogin(
      usuario.id,
      req.ip,
      req.headers['user-agent'],
      'normal'
    );

    // Responder con token y datos del usuario (excepto password)
    const { password: _, ...usuarioData } = usuario.toJSON();
    
    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: usuarioData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Controlador para registro de usuarios
const register = async (req, res) => {
  try {
    const { nombre, email, password, codprg, codcli, codusu } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y password son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      codprg,
      codcli,
      codusu,
      rol: 'usuario' // Por defecto, todos los usuarios son de tipo usuario
    });

    // Generar token JWT
    const token = generarToken(nuevoUsuario);

    // Responder con token y datos del usuario (excepto password)
    const { password: _, ...usuarioData } = nuevoUsuario.toJSON();
    
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: usuarioData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Controlador para login automático por código de cliente
const autoLogin = async (req, res) => {
  try {
    const { codcli } = req.query;

    // Validar que se envió el parámetro necesario
    if (!codcli) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro codcli es requerido'
      });
    }

    // Buscar usuario por el código de cliente proporcionado
    const usuario = await Usuario.findByClientCode(codcli);

    // Si no existe el usuario, crear uno con valores predeterminados
    if (!usuario) {
      // Generar un email único basado en el código de cliente
      const email = `cliente-${codcli}@corsoft.auto`;
      // Generar una contraseña aleatoria
      const password = Math.random().toString(36).substring(2, 10);
      
      const nuevoUsuario = await Usuario.create({
        nombre: `Cliente ${codcli}`,
        email,
        password,
        codcli: codcli,
        rol: 'usuario'
      });

      const token = generarToken(nuevoUsuario);
      const { password: _, ...usuarioData } = nuevoUsuario.toJSON();
      
      // Registrar el inicio de sesión
      await registrarLogin(
        nuevoUsuario.id,
        req.ip,
        req.headers['user-agent'],
        'auto_nuevo'
      );
      
      return res.status(201).json({
        success: true,
        message: 'Usuario creado y autenticado automáticamente',
        token,
        usuario: usuarioData
      });
    }

    // Si el usuario existe, generar token y devolver datos
    const token = generarToken(usuario);
    const { password: _, ...usuarioData } = usuario.toJSON();
    
    // Registrar el inicio de sesión
    await registrarLogin(
      usuario.id,
      req.ip,
      req.headers['user-agent'],
      'auto'
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login automático exitoso',
      token,
      usuario: usuarioData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Controlador para verificar token y obtener usuario
const verificarToken = async (req, res) => {
  try {
    // El middleware auth.middleware.js ya verifica el token y añade el usuario decodificado a req.usuario
    const usuario = await Usuario.findByPk(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Devolver datos del usuario (excepto password)
    const { password: _, ...usuarioData } = usuario.toJSON();
    
    return res.status(200).json({
      success: true,
      usuario: usuarioData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: error.message
    });
  }
};

module.exports = {
  login,
  register,
  autoLogin,
  verificarToken
};
