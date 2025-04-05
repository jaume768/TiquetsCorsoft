const { Tiquet, Usuario, HistorialTiquet, ComentarioTiquet, sequelize } = require('../models');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuración del transporte de email
const configurarTransporteEmail = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Función para enviar email al administrador
const enviarEmailNotificacion = async (tiquet, usuario) => {
  try {
    const transporter = configurarTransporteEmail();
    
    await transporter.sendMail({
      from: `"Sistema de Tiquets" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo Tiquet #${tiquet.id}: ${tiquet.titulo}`,
      html: `
        <h1>Nuevo Tiquet Creado</h1>
        <p><strong>ID:</strong> ${tiquet.id}</p>
        <p><strong>Usuario:</strong> ${usuario.nombre} (${usuario.email})</p>
        <p><strong>Título:</strong> ${tiquet.titulo}</p>
        <p><strong>Descripción:</strong> ${tiquet.descripcion}</p>
        <p><strong>Prioridad:</strong> ${tiquet.prioridad}</p>
        <p><strong>Fecha:</strong> ${new Date(tiquet.fecha_creacion).toLocaleString()}</p>
        <p>Acceda al panel de administración para gestionar este tiquet.</p>
      `
    });
    
    console.log(`Email de notificación enviado para tiquet #${tiquet.id}`);
  } catch (error) {
    console.error('Error al enviar email de notificación:', error);
  }
};

// Obtener todos los tiquets (solo admin)
const getTodosTiquets = async (req, res) => {
  try {
    const { estado, prioridad, usuario_id, busqueda } = req.query;
    const filtro = {};
    
    // Aplicar filtros si existen
    if (estado) filtro.estado = estado;
    if (prioridad) filtro.prioridad = prioridad;
    if (usuario_id) filtro.usuario_id = usuario_id;
    
    let whereCondition = { ...filtro };
    
    // Búsqueda en título o descripción
    if (busqueda) {
      whereCondition = {
        ...whereCondition,
        [sequelize.Op.or]: [
          { titulo: { [sequelize.Op.like]: `%${busqueda}%` } },
          { descripcion: { [sequelize.Op.like]: `%${busqueda}%` } }
        ]
      };
    }
    
    const tiquets = await Tiquet.findAll({
      where: whereCondition,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: tiquets
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los tiquets',
      error: error.message
    });
  }
};

// Obtener tiquets del usuario autenticado
const getMisTiquets = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { estado } = req.query;
    
    const filtro = { usuario_id };
    if (estado) filtro.estado = estado;
    
    const tiquets = await Tiquet.findAll({
      where: filtro,
      order: [['fecha_creacion', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: tiquets
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los tiquets',
      error: error.message
    });
  }
};

// Obtener un tiquet por su ID
const getTiquetPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const esAdministrador = req.usuario.rol === 'admin';
    
    const tiquet = await Tiquet.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: HistorialTiquet,
          as: 'historial',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nombre', 'email']
            }
          ]
        },
        {
          model: ComentarioTiquet,
          as: 'comentarios',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nombre', 'email', 'rol']
            }
          ],
          order: [['fecha_creacion', 'ASC']]
        }
      ]
    });
    
    if (!tiquet) {
      return res.status(404).json({
        success: false,
        message: 'Tiquet no encontrado'
      });
    }
    
    // Verificar que el tiquet pertenezca al usuario o sea administrador
    if (!esAdministrador && tiquet.usuario_id !== usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este tiquet'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: tiquet
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el tiquet',
      error: error.message
    });
  }
};

// Crear un nuevo tiquet
const crearTiquet = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad = 'media' } = req.body;
    const usuario_id = req.usuario.id;
    
    // Validar campos requeridos
    if (!titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Título y descripción son requeridos'
      });
    }
    
    // Procesar imagen si existe
    let imagen_url = null;
    if (req.file) {
      // Guardar la ruta de la imagen
      imagen_url = `/uploads/${req.file.filename}`;
      
      // Crear directorio uploads si no existe
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    }
    
    // Crear el tiquet
    const nuevoTiquet = await Tiquet.create({
      titulo,
      descripcion,
      prioridad,
      imagen_url,
      usuario_id,
      estado: 'pendiente'
    });
    
    // Obtener información del usuario para el email
    const usuario = await Usuario.findByPk(usuario_id);
    
    // Enviar email al administrador
    await enviarEmailNotificacion(nuevoTiquet, usuario);
    
    return res.status(201).json({
      success: true,
      message: 'Tiquet creado exitosamente',
      data: nuevoTiquet
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al crear el tiquet',
      error: error.message
    });
  }
};

// Actualizar un tiquet (solo admin)
const actualizarTiquet = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { estado, prioridad, comentario } = req.body;
    const usuario_id = req.usuario.id;
    
    // Buscar el tiquet
    const tiquet = await Tiquet.findByPk(id, { transaction });
    
    if (!tiquet) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tiquet no encontrado'
      });
    }
    
    // Guardar el estado anterior
    const estadoAnterior = tiquet.estado;
    
    // Actualizar campos solo si se proporcionan
    if (estado) tiquet.estado = estado;
    if (prioridad) tiquet.prioridad = prioridad;
    
    // Guardar cambios
    await tiquet.save({ transaction });
    
    // Crear registro en el historial
    if (comentario || (estado && estado !== estadoAnterior)) {
      await HistorialTiquet.create({
        tiquet_id: id,
        usuario_id,
        estado_anterior: estadoAnterior,
        estado_nuevo: estado || estadoAnterior,
        comentario
      }, { transaction });
    }
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Tiquet actualizado exitosamente',
      data: tiquet
    });
  } catch (error) {
    await transaction.rollback();
    
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el tiquet',
      error: error.message
    });
  }
};

// Eliminar un tiquet (solo admin)
const eliminarTiquet = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Buscar el tiquet
    const tiquet = await Tiquet.findByPk(id, { transaction });
    
    if (!tiquet) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tiquet no encontrado'
      });
    }
    
    // Eliminar comentarios asociados
    await ComentarioTiquet.destroy({
      where: { tiquet_id: id },
      transaction
    });
    
    // Eliminar historial asociado
    await HistorialTiquet.destroy({
      where: { tiquet_id: id },
      transaction
    });
    
    // Eliminar el tiquet
    await tiquet.destroy({ transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Tiquet eliminado exitosamente'
    });
  } catch (error) {
    await transaction.rollback();
    
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el tiquet',
      error: error.message
    });
  }
};

// Agregar comentario a un tiquet
const agregarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const usuario_id = req.usuario.id;
    const esAdministrador = req.usuario.rol === 'admin';
    
    // Validar campos requeridos
    if (!texto) {
      return res.status(400).json({
        success: false,
        message: 'El texto del comentario es requerido'
      });
    }
    
    // Verificar que existe el tiquet
    const tiquet = await Tiquet.findByPk(id);
    
    if (!tiquet) {
      return res.status(404).json({
        success: false,
        message: 'Tiquet no encontrado'
      });
    }
    
    // Verificar que el tiquet pertenezca al usuario o sea administrador
    if (!esAdministrador && tiquet.usuario_id !== usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para comentar en este tiquet'
      });
    }
    
    // Crear el comentario
    const comentario = await ComentarioTiquet.create({
      tiquet_id: id,
      usuario_id,
      texto
    });
    
    // Recuperar el comentario con datos del usuario
    const comentarioConUsuario = await ComentarioTiquet.findByPk(comentario.id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email', 'rol']
      }]
    });
    
    return res.status(201).json({
      success: true,
      data: comentarioConUsuario,
      message: 'Comentario agregado exitosamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al agregar comentario',
      error: error.message
    });
  }
};

// Obtener comentarios de un tiquet
const getComentariosTiquet = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const esAdministrador = req.usuario.rol === 'admin';
    
    // Verificar que existe el tiquet
    const tiquet = await Tiquet.findByPk(id);
    
    if (!tiquet) {
      return res.status(404).json({
        success: false,
        message: 'Tiquet no encontrado'
      });
    }
    
    // Verificar que el tiquet pertenezca al usuario o sea administrador
    if (!esAdministrador && tiquet.usuario_id !== usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver comentarios de este tiquet'
      });
    }
    
    // Obtener comentarios
    const comentarios = await ComentarioTiquet.findAll({
      where: { tiquet_id: id },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email', 'rol']
      }],
      order: [['fecha_creacion', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      data: comentarios
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener comentarios',
      error: error.message
    });
  }
};

// Eliminar un comentario
const eliminarComentario = async (req, res) => {
  try {
    const { tiquet_id, comentario_id } = req.params;
    const usuario_id = req.usuario.id;
    const esAdministrador = req.usuario.rol === 'admin';
    
    // Buscar el comentario
    const comentario = await ComentarioTiquet.findOne({
      where: { 
        id: comentario_id,
        tiquet_id: tiquet_id
      }
    });
    
    if (!comentario) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }
    
    // Verificar permisos (solo el creador del comentario o un admin pueden eliminarlo)
    if (!esAdministrador && comentario.usuario_id !== usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este comentario'
      });
    }
    
    // Eliminar el comentario
    await comentario.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el comentario',
      error: error.message
    });
  }
};

module.exports = {
  getTodosTiquets,
  getMisTiquets,
  getTiquetPorId,
  crearTiquet,
  actualizarTiquet,
  eliminarTiquet,
  agregarComentario,
  getComentariosTiquet,
  eliminarComentario
};
