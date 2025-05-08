const path = require('path');
const fs = require('fs');
const { ArchivoTicket, Tiquet, ArchivoComentario, ComentarioTiquet } = require('../models');

// Descargar un archivo adjunto
const descargarArchivo = async (req, res) => {
  try {
    const { archivoId } = req.params;
    
    console.log('Solicitud de descarga para archivo ID:', archivoId);
    console.log('Usuario solicitante:', req.usuario.id, req.usuario.rol);
    
    // Buscar archivo
    const archivo = await ArchivoTicket.findByPk(archivoId, {
      include: [{
        model: Tiquet,
        as: 'ticket',
        attributes: ['id', 'usuario_id']
      }]
    });
    
    if (!archivo) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }
    
    // Verificar permiso (usuario propietario o admin)
    if (req.usuario.rol !== 'admin' && req.usuario.id !== archivo.ticket.usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para acceder a este archivo'
      });
    }
    
    // Construir ruta completa del archivo
    const filePath = path.join(__dirname, '../../uploads/tickets', archivo.ticket_id.toString(), archivo.nombre_servidor);
    
    // Log para depuración
    console.log('Ruta del archivo a descargar:', filePath);
    
    // Verificar si existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el servidor'
      });
    }
    
    // Enviar archivo para descarga
    res.download(filePath, archivo.nombre_original);
    
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al descargar archivo',
      error: error.message
    });
  }
};

// Obtener todos los archivos de un ticket
const getArchivosPorTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // Buscar ticket
    const ticket = await Tiquet.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }
    
    // Verificar permisos (admin o propietario)
    if (req.usuario.rol !== 'admin' && req.usuario.id !== ticket.usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para ver los archivos de este ticket'
      });
    }
    
    // Obtener archivos
    const archivos = await ArchivoTicket.findAll({
      where: { ticket_id: ticketId },
      order: [['fecha_subida', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: archivos
    });
    
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener archivos',
      error: error.message
    });
  }
};

// Eliminar un archivo
const eliminarArchivo = async (req, res) => {
  try {
    const { archivoId } = req.params;
    
    // Buscar archivo
    const archivo = await ArchivoTicket.findByPk(archivoId, {
      include: [{
        model: Tiquet,
        as: 'ticket',
        attributes: ['id', 'usuario_id']
      }]
    });
    
    if (!archivo) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }
    
    // Verificar permiso (solo admin o propietario)
    if (req.usuario.rol !== 'admin' && req.usuario.id !== archivo.ticket.usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para eliminar este archivo'
      });
    }
    
    // Eliminar archivo físico
    const filePath = path.join(__dirname, '../..', archivo.ruta);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Eliminar de la base de datos
    await archivo.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Archivo eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar archivo',
      error: error.message
    });
  }
};

// Descargar un archivo adjunto de comentario
const descargarArchivoComentario = async (req, res) => {
  try {
    const { archivoId } = req.params;
    
    console.log('Solicitud de descarga para archivo de comentario ID:', archivoId);
    console.log('Usuario solicitante:', req.usuario.id, req.usuario.rol);
    
    // Buscar archivo de comentario
    const archivo = await ArchivoComentario.findByPk(archivoId, {
      include: [{
        model: ComentarioTiquet,
        as: 'comentario',
        include: [{
          model: Tiquet,
          as: 'tiquet',
          attributes: ['id', 'usuario_id']
        }]
      }]
    });
    
    if (!archivo) {
      return res.status(404).json({
        success: false,
        message: 'Archivo de comentario no encontrado'
      });
    }
    
    // Verificar permiso (usuario propietario del ticket o admin)
    if (req.usuario.rol !== 'admin' && req.usuario.id !== archivo.comentario.tiquet.usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para acceder a este archivo'
      });
    }
    
    // Construir ruta completa del archivo
    const filePath = path.join(__dirname, '../../uploads/comentarios', archivo.comentario_id.toString(), archivo.nombre_servidor);
    
    // Log para depuración
    console.log('Ruta del archivo de comentario a descargar:', filePath);
    
    // Verificar si existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el servidor'
      });
    }
    
    // Enviar archivo para descarga
    res.download(filePath, archivo.nombre_original);
    
  } catch (error) {
    console.error('Error al descargar archivo de comentario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al descargar archivo de comentario',
      error: error.message
    });
  }
};

module.exports = {
  descargarArchivo,
  getArchivosPorTicket,
  eliminarArchivo,
  descargarArchivoComentario
};
