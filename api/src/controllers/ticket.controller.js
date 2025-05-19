const { Tiquet, Usuario, HistorialTiquet, ComentarioTiquet, ArchivoTicket, ArchivoComentario, sequelize } = require('../models');
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

// Función para generar código de seguridad (año+mes+día) x 7 - 128
const generarCodigoSeguridad = () => {
  const fecha = new Date();
  const anio = fecha.getFullYear() % 100; // Últimos dos dígitos del año
  const mes = fecha.getMonth() + 1; // Mes (1-12)
  const dia = fecha.getDate(); // Día del mes
  
  // Formato para obtener AAMMDD
  const fechaCombinada = anio * 10000 + mes * 100 + dia;
  
  // Aplicar la fórmula: (AAMMDD) x 7 - 128
  return fechaCombinada * 7 - 128;
};

// Función para enviar email al usuario cuando cambia el estado de un tiquet
const enviarEmailCambioEstado = async (tiquet, usuario) => {
  try {
    const transporter = configurarTransporteEmail();
    
    // Mapeo de estados para texto más amigable
    const estadosTexto = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado'
    };

    const estadoTexto = estadosTexto[tiquet.estado] || tiquet.estado;
    const clientURL = process.env.CLIENT_URL || 'http://localhost';
    
    // Generar código de seguridad para auto-login
    const codigoSeguridad = generarCodigoSeguridad();
    
    // Construir URL con parámetros para auto-login
    let autoLoginParams = new URLSearchParams();
    autoLoginParams.append('codigoSeguridad', codigoSeguridad);
    autoLoginParams.append('usuario', usuario.nombre);
    
    // Añadir parámetros especiales dependiendo del tipo de cliente
    if (usuario.codcli) {
      autoLoginParams.append('codcli', usuario.codcli);
    }
    
    if (usuario.Codw) {
      autoLoginParams.append('Codw', usuario.Codw);
      // Si tiene Codw, agregar el parámetro Vista=w para el tema webcar
      autoLoginParams.append('Vista', 'w');
    }
    
    // URL completa con auto-login y redirección al tiquet específico
    const baseUrl = `${clientURL}/?${autoLoginParams.toString()}`;
    
    await transporter.sendMail({
      from: `"Sistema de Tiquets" <${process.env.SMTP_USER}>`,
      to: usuario.email,
      subject: `Actualización de su Tiquet #${tiquet.id}: ${tiquet.titulo}`,
      html: `
        <h1>Actualización de su Tiquet</h1>
        <p><strong>ID:</strong> ${tiquet.id}</p>
        <p><strong>Título:</strong> ${tiquet.titulo}</p>
        <p><strong>Estado Actual:</strong> <span style="font-weight: bold; color: ${tiquet.estado === 'resuelto' ? 'green' : tiquet.estado === 'en_proceso' ? 'blue' : 'orange'}">${estadoTexto}</span></p>
        <p>El estado de su tiquet ha sido actualizado. Puede ver los detalles completos haciendo clic en el siguiente enlace:</p>
        <p><a href="${baseUrl}" style="display: inline-block; background-color: #4a6bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Tiquets</a></p>
        <p>Si tiene alguna consulta adicional, puede responder agregando un comentario en el tiquet.</p>
        <p>Gracias por utilizar nuestro sistema de soporte.</p>
      `
    });
    
    console.log(`Email de cambio de estado enviado al usuario para tiquet #${tiquet.id}`);
  } catch (error) {
    console.error('Error al enviar email de cambio de estado:', error);
  }
};

// Obtener todos los tiquets (solo admin)
const getTodosTiquets = async (req, res) => {
  try {
    const { estado, prioridad, usuario_id, busqueda, pagina = 1, limite = 10 } = req.query;
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
    
    // Calcular offset para paginación
    const offset = (pagina - 1) * limite;
    
    // Obtener tiquets con paginación
    const { count, rows: tiquets } = await Tiquet.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['fecha_creacion', 'DESC']],
      limit: parseInt(limite),
      offset: offset
    });
    
    // Calcular total de páginas
    const totalPaginas = Math.ceil(count / limite);
    
    return res.status(200).json({
      success: true,
      data: {
        tiquets,
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          totalPaginas
        }
      }
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
            },
            {
              model: ArchivoComentario,
              as: 'archivos'
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
    const { titulo, descripcion, prioridad = 'pendiente' } = req.body;
    const usuario_id = req.usuario.id;
    const nombre_usuario = req.body.nombre_usuario;
    
    // Validar campos requeridos
    if (!titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Título y descripción son requeridos'
      });
    }
    
    // Crear directorio uploads si no existe
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Procesar imagen si existe (para compatibilidad con código existente)
    let imagen_url = null;
    if (req.file) {
      // Guardar la ruta de la imagen
      imagen_url = `/uploads/${req.file.filename}`;
    }
    
    // Crear el tiquet
    const nuevoTiquet = await Tiquet.create({
      titulo,
      descripcion,
      prioridad,
      imagen_url,
      usuario_id,
      nombre_usuario,
      estado: 'pendiente'
    });
    
    // Procesar archivos adjuntos si existen
    if (req.files && req.files.length > 0) {
      // Crear directorio para los archivos del ticket
      const ticketDir = path.join(__dirname, '../../uploads/tickets', nuevoTiquet.id.toString());
      if (!fs.existsSync(ticketDir)) {
        fs.mkdirSync(ticketDir, { recursive: true });
      }
      
      // Guardar cada archivo en la base de datos y moverlo de la carpeta temp a la carpeta del ticket
      const archivosPromises = req.files.map(async (file) => {
        // Log para depuración
        console.log('Archivo recibido:', file);
        console.log('Destino del archivo:', file.path);
        
        // Construir las rutas de origen y destino
        const origenPath = file.path; // Ruta actual (probablemente en temp)
        const destinoPath = path.join(ticketDir, file.filename); // Nueva ruta en la carpeta del ticket
        
        // Mover el archivo de temp a la carpeta del ticket
        if (origenPath !== destinoPath) {
          console.log(`Moviendo archivo: ${origenPath} -> ${destinoPath}`);
          try {
            if (fs.existsSync(origenPath)) {
              fs.copyFileSync(origenPath, destinoPath);
              fs.unlinkSync(origenPath); // Eliminar el archivo original
              console.log('Archivo movido correctamente');
            } else {
              console.error('El archivo origen no existe:', origenPath);
            }
          } catch (err) {
            console.error('Error al mover el archivo:', err);
          }
        }
        
        return ArchivoTicket.create({
          ticket_id: nuevoTiquet.id,
          nombre_original: file.originalname,
          nombre_servidor: file.filename,
          tipo: file.mimetype,
          tamanio: file.size,
          ruta: `/uploads/tickets/${nuevoTiquet.id}/${file.filename}`
        });
      });
      
      await Promise.all(archivosPromises);
    }
    
    // Obtener el ticket completo con sus archivos
    const ticketCompleto = await Tiquet.findByPk(nuevoTiquet.id, {
      include: [
        {
          model: ArchivoTicket,
          as: 'archivos'
        }
      ]
    });
    
    // Obtener información del usuario para el email
    const usuario = await Usuario.findByPk(usuario_id);
    
    // Enviar email al administrador
    await enviarEmailNotificacion(ticketCompleto, usuario);
    
    return res.status(201).json({
      success: true,
      message: 'Tiquet creado exitosamente',
      data: ticketCompleto
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
    const tiquet = await Tiquet.findByPk(id, { 
      transaction,
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email', 'codcli', 'Codw']
      }]
    });
    
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
    
    // Si el estado cambió, enviar email al usuario
    if (estado && estado !== estadoAnterior && tiquet.usuario && tiquet.usuario.email) {
      // Enviamos el email fuera de la transacción para no bloquear la respuesta
      enviarEmailCambioEstado(tiquet, tiquet.usuario).catch(err => {
        console.error('Error al enviar email de cambio de estado:', err);
      });
    }
    
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

// Función para enviar email de notificación cuando se agrega un comentario
const enviarEmailComentario = async (tiquet, comentario, usuario, usuarioAdmin) => {
  try {
    const transporter = configurarTransporteEmail();
    
    // Si no hay correo del usuario o no hay transporte, no enviamos correo
    if (!usuario.email) {
      console.log('No se puede enviar email: el usuario no tiene correo electrónico registrado');
      return;
    }
    
    // Generar código de seguridad para auto-login
    const codigoSeguridad = generarCodigoSeguridad();
    
    // Construir URL con parámetros para auto-login
    let autoLoginParams = new URLSearchParams();
    autoLoginParams.append('codigoSeguridad', codigoSeguridad);
    autoLoginParams.append('usuario', usuario.nombre);
    
    // Añadir parámetros especiales dependiendo del tipo de cliente
    if (usuario.codcli) {
      autoLoginParams.append('codcli', usuario.codcli);
    }
    
    if (usuario.Codw) {
      autoLoginParams.append('Codw', usuario.Codw);
      // Si tiene Codw, agregar el parámetro Vista=w para el tema webcar
      autoLoginParams.append('Vista', 'w');
    }
    
    // URL completa con auto-login
    const clientURL = process.env.CLIENT_URL || 'http://localhost';
    const baseUrl = `${clientURL}/?${autoLoginParams.toString()}`;
    
    // Enviar email
    await transporter.sendMail({
      from: `"Sistema de Tiquets" <${process.env.SMTP_USER}>`,
      to: usuario.email,
      subject: `Nuevo comentario en su Tiquet #${tiquet.id}: ${tiquet.titulo}`,
      html: `
        <h1>Nuevo comentario en su Tiquet</h1>
        <p><strong>ID:</strong> ${tiquet.id}</p>
        <p><strong>Título:</strong> ${tiquet.titulo}</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4a6bff; margin: 10px 0;">
          <p><strong>${usuarioAdmin.nombre} (Administrador) escribió:</strong></p>
          <p>${comentario.texto.replace(/\n/g, '<br>')}</p>
        </div>
        <p>Para ver el comentario completo y responder, por favor visite su panel de tiquets haciendo clic en el siguiente enlace:</p>
        <p><a href="${baseUrl}" style="display: inline-block; background-color: #4a6bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Tiquets</a></p>
        <p>Gracias por utilizar nuestro sistema de soporte.</p>
      `
    });
    
    console.log(`Email de notificación de comentario enviado al usuario para tiquet #${tiquet.id}`);
  } catch (error) {
    console.error('Error al enviar email de notificación de comentario:', error);
  }
};

// Agregar comentario a un tiquet
const agregarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, enviarEmail } = req.body;
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
    const tiquet = await Tiquet.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email', 'codcli', 'Codw']
      }]
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
        message: 'No tienes permiso para comentar en este tiquet'
      });
    }
    
    // Crear el comentario
    const comentario = await ComentarioTiquet.create({
      tiquet_id: id,
      usuario_id,
      texto
    });
    
    // Si es un administrador y se solicita enviar email, obtener datos completos del admin
    if (esAdministrador && (enviarEmail === true || enviarEmail === 'true') && tiquet.usuario) {
      // Obtener datos del administrador
      const usuarioAdmin = await Usuario.findByPk(usuario_id);
      if (usuarioAdmin) {
        // Enviar email al propietario del ticket
        enviarEmailComentario(tiquet, comentario, tiquet.usuario, usuarioAdmin).catch(err => {
          console.error('Error al enviar email de notificación de comentario:', err);
        });
      }
    }
    
    // Procesar archivos adjuntos si existen
    if (req.files && req.files.length > 0) {
      // Crear directorio para los archivos del comentario
      const comentarioDir = path.join(__dirname, '../../uploads/comentarios', comentario.id.toString());
      if (!fs.existsSync(comentarioDir)) {
        fs.mkdirSync(comentarioDir, { recursive: true });
      }
      
      // Guardar cada archivo en la base de datos
      const archivosPromises = req.files.map(async (file) => {
        // Log para depuración
        console.log('Archivo recibido en comentario:', file);
        
        // Construir las rutas de origen y destino
        const origenPath = file.path; // Ruta actual (probablemente en temp)
        const destinoPath = path.join(comentarioDir, file.filename); // Nueva ruta en la carpeta del comentario
        
        // Mover el archivo de temp a la carpeta del comentario
        if (origenPath !== destinoPath) {
          console.log(`Moviendo archivo: ${origenPath} -> ${destinoPath}`);
          try {
            if (fs.existsSync(origenPath)) {
              fs.copyFileSync(origenPath, destinoPath);
              fs.unlinkSync(origenPath); // Eliminar el archivo original
              console.log('Archivo movido correctamente');
            } else {
              console.error('El archivo origen no existe:', origenPath);
            }
          } catch (err) {
            console.error('Error al mover el archivo:', err);
          }
        }
        
        return ArchivoComentario.create({
          comentario_id: comentario.id,
          nombre_original: file.originalname,
          nombre_servidor: file.filename,
          tipo: file.mimetype,
          tamanio: file.size,
          ruta: `/uploads/comentarios/${comentario.id}/${file.filename}`
        });
      });
      
      await Promise.all(archivosPromises);
    }
    
    // Recuperar el comentario con datos del usuario y archivos
    const comentarioConUsuario = await ComentarioTiquet.findByPk(comentario.id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'rol']
        },
        {
          model: ArchivoComentario,
          as: 'archivos'
        }
      ]
    });
    
    return res.status(201).json({
      success: true,
      data: comentarioConUsuario,
      message: 'Comentario agregado exitosamente'
    });
  } catch (error) {
    console.error('Error al agregar comentario:', error);
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
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'rol']
        },
        {
          model: ArchivoComentario,
          as: 'archivos'
        }
      ],
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
      },
      include: [{
        model: ArchivoComentario,
        as: 'archivos'
      }]
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
    
    // Eliminar archivos físicos primero si existen
    if (comentario.archivos && comentario.archivos.length > 0) {
      const directorioArchivos = path.join(__dirname, '../../uploads/comentarios', comentario_id.toString());
      
      // Eliminar cada archivo
      for (const archivo of comentario.archivos) {
        const rutaArchivo = path.join(__dirname, '../..', archivo.ruta);
        if (fs.existsSync(rutaArchivo)) {
          fs.unlinkSync(rutaArchivo);
        }
        
        // Eliminar el registro de la base de datos
        await archivo.destroy();
      }
      
      // Intentar eliminar el directorio si existe
      if (fs.existsSync(directorioArchivos)) {
        try {
          fs.rmdirSync(directorioArchivos);
        } catch (error) {
          console.error('Error al eliminar directorio de archivos:', error);
        }
      }
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
