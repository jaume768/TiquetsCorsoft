const { LoginRegistro, Usuario, sequelize } = require('../models');

// Obtener todos los registros de login (solo admin)
const getLoginRegistros = async (req, res) => {
  try {
    const { usuario_id, fecha_inicio, fecha_fin, limite = 100, pagina = 1 } = req.query;
    
    // Construir condiciones de filtro
    const where = {};
    
    if (usuario_id) {
      where.usuario_id = usuario_id;
    }
    
    // Filtro por rango de fechas
    if (fecha_inicio || fecha_fin) {
      where.fecha_login = {};
      
      if (fecha_inicio) {
        where.fecha_login[sequelize.Op.gte] = new Date(fecha_inicio);
      }
      
      if (fecha_fin) {
        where.fecha_login[sequelize.Op.lte] = new Date(fecha_fin);
      }
    }
    
    // Calcular offset para paginación
    const offset = (pagina - 1) * limite;
    
    // Obtener registros con paginación
    const { count, rows: registros } = await LoginRegistro.findAndCountAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'rol', 'codcli', 'nif', 'direccion']
        }
      ],
      order: [['fecha_login', 'DESC']],
      limit: parseInt(limite),
      offset: offset
    });
    
    // Calcular total de páginas
    const totalPaginas = Math.ceil(count / limite);
    
    return res.status(200).json({
      success: true,
      data: {
        registros,
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
      message: 'Error al obtener los registros de login',
      error: error.message
    });
  }
};

// Obtener estadísticas de login (solo admin)
const getLoginEstadisticas = async (req, res) => {
  try {
    // Estadísticas generales
    const totalRegistros = await LoginRegistro.count();
    
    let loginsPorDia = [];
    let loginsPorUsuario = [];
    let loginsPorMetodo = [];
    
    try {
      // Logins por día (últimos 30 días)
      loginsPorDia = await LoginRegistro.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('fecha_login')), 'fecha'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        where: {
          fecha_login: {
            [sequelize.Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        group: [sequelize.fn('DATE', sequelize.col('fecha_login'))],
        order: [[sequelize.fn('DATE', sequelize.col('fecha_login')), 'ASC']]
      });
    } catch (err) {
      console.error('Error al obtener logins por día:', err);
      // Si falla, devolver un array vacío para no bloquear toda la respuesta
    }
    
    try {
      // Logins por usuario (top 10)
      loginsPorUsuario = await LoginRegistro.findAll({
        attributes: [
          'usuario_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'email']
          }
        ],
        group: ['usuario_id', 'usuario.id', 'usuario.nombre', 'usuario.email'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
    } catch (err) {
      console.error('Error al obtener logins por usuario:', err);
      // Si falla, devolver un array vacío para no bloquear toda la respuesta
    }
    
    try {
      // Logins por método
      loginsPorMetodo = await LoginRegistro.findAll({
        attributes: [
          'metodo_login',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        group: ['metodo_login'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
      });
    } catch (err) {
      console.error('Error al obtener logins por método:', err);
      // Si falla, devolver un array vacío para no bloquear toda la respuesta
    }
    
    return res.status(200).json({
      success: true,
      data: {
        totalRegistros,
        loginsPorDia,
        loginsPorUsuario,
        loginsPorMetodo
      }
    });
  } catch (error) {
    console.error('Error general en getLoginEstadisticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas de login',
      error: error.message
    });
  }
};

// Registrar un nuevo login
const registrarLogin = async (usuarioId, ipAddress, userAgent, metodoLogin) => {
  try {
    const registro = await LoginRegistro.create({
      usuario_id: usuarioId,
      ip_address: ipAddress,
      user_agent: userAgent,
      metodo_login: metodoLogin
    });
    
    return registro;
  } catch (error) {
    console.error('Error al registrar login:', error);
    return null;
  }
};

module.exports = {
  getLoginRegistros,
  getLoginEstadisticas,
  registrarLogin
};
