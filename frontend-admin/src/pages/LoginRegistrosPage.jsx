import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loginRegistroService from '../services/loginRegistroService';
import userService from '../services/userService';
import '../styles/LoginRegistrosPage.css';
import '../styles/components/icons.css';
import '../styles/components/dashboard-icons.css';

const LoginRegistrosPage = () => {
  const [registros, setRegistros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    pagina: 1,
    limite: 10
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    pagina: 1,
    limite: 10,
    totalPaginas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalRegistros: 0,
    loginsPorDia: [],
    loginsPorUsuario: [],
    loginsPorMetodo: []
  });
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarUsuarios();
    cargarEstadisticas();
  }, []);

  // Cargar registros cuando cambien los filtros
  useEffect(() => {
    cargarRegistros();
  }, [filtros]);

  // Cargar lista de usuarios para el filtro
  const cargarUsuarios = async () => {
    try {
      const response = await userService.getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Cargar registros de login
  const cargarRegistros = async () => {
    try {
      setLoading(true);
      const response = await loginRegistroService.getLoginRegistros(filtros);
      setRegistros(response.data.registros);
      setPaginacion(response.data.paginacion);
      setError(null);
    } catch (error) {
      console.error('Error al cargar registros de login:', error);
      setError('No se pudieron cargar los registros de login. Por favor, intente nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas de login
  const cargarEstadisticas = async () => {
    try {
      const response = await loginRegistroService.getLoginEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Manejar cambios en los filtros
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value,
      pagina: 1 // Resetear a la primera página al cambiar filtros
    });
  };

  // Resetear filtros
  const resetFiltros = () => {
    setFiltros({
      usuario_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      pagina: 1,
      limite: 10
    });
  };

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setFiltros({
      ...filtros,
      pagina: numeroPagina
    });
  };

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Obtener etiqueta para el método de login
  const getMetodoLoginLabel = (metodo) => {
    const metodos = {
      'normal': 'Login normal',
      'auto': 'Login automático',
      'auto_nuevo': 'Auto-registro'
    };
    
    return metodos[metodo] || metodo;
  };

  return (
    <div className="login-registros-page">
      <header className="page-header">
        <h1 className="page-title">Registros de Inicio de Sesión</h1>
        <div className="header-actions">
          <button 
            className={`toggle-stats-button ${mostrarEstadisticas ? 'active' : ''}`}
            onClick={() => setMostrarEstadisticas(!mostrarEstadisticas)}
          >
            <i className="icon icon-dashboard"></i>
            {mostrarEstadisticas ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}
          </button>
        </div>
      </header>

      {mostrarEstadisticas && (
        <div className="estadisticas-section">
          <div className="estadisticas-grid">
            <div className="estadistica-card total">
              <div className="estadistica-icon">
                <i className="icon icon-users icon-2x"></i>
              </div>
              <div className="estadistica-content">
                <h3 className="estadistica-number">{estadisticas.totalRegistros}</h3>
                <p className="estadistica-label">Total de inicios de sesión</p>
              </div>
            </div>
            
            <div className="estadistica-card metodos">
              <h3 className="card-title">Métodos de Inicio de Sesión</h3>
              <div className="metodos-list">
                {estadisticas.loginsPorMetodo?.map((item, index) => (
                  <div key={index} className="metodo-item">
                    <span className="metodo-name">{getMetodoLoginLabel(item.metodo_login || 'Desconocido')}</span>
                    <span className="metodo-count">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="estadistica-card usuarios">
              <h3 className="card-title">Top Usuarios</h3>
              <div className="usuarios-list">
                {estadisticas.loginsPorUsuario?.slice(0, 5).map((item, index) => (
                  <div key={index} className="usuario-item">
                    <span className="usuario-name">{item.usuario?.nombre || 'Usuario ' + item.usuario_id}</span>
                    <span className="usuario-count">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="filtros-section">
        <form className="filtros-form">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label htmlFor="usuario_id" className="filtro-label">Usuario:</label>
              <select
                id="usuario_id"
                name="usuario_id"
                className="filtro-select"
                value={filtros.usuario_id}
                onChange={handleInputChange}
              >
                <option value="">Todos los usuarios</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filtro-group">
              <label htmlFor="fecha_inicio" className="filtro-label">Fecha Inicio:</label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                className="filtro-input"
                value={filtros.fecha_inicio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="filtro-group">
              <label htmlFor="fecha_fin" className="filtro-label">Fecha Fin:</label>
              <input
                type="date"
                id="fecha_fin"
                name="fecha_fin"
                className="filtro-input"
                value={filtros.fecha_fin}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="filtro-actions">
              <button 
                type="button" 
                className="reset-button"
                onClick={resetFiltros}
              >
                <i className="icon icon-close"></i> Limpiar filtros
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="registros-content">
        {loading ? (
          <div className="loading-container">
            <i className="icon icon-loading icon-spin icon-2x"></i>
            <p>Cargando registros...</p>
          </div>
        ) : registros.length === 0 ? (
          <div className="no-registros">
            <i className="icon icon-search icon-2x"></i>
            <p>No se encontraron registros con los filtros seleccionados</p>
            {(filtros.usuario_id || filtros.fecha_inicio || filtros.fecha_fin) && (
              <button 
                className="reset-button mt-3"
                onClick={resetFiltros}
              >
                <i className="icon icon-search"></i> Mostrar todos los registros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="registros-table-container">
              <table className="registros-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Fecha y Hora</th>
                    <th>Método</th>
                    <th>IP</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map(registro => (
                    <tr key={registro.id}>
                      <td>{registro.id}</td>
                      <td>
                        <Link to={`/usuarios/${registro.usuario_id}`} className="usuario-link">
                          {registro.usuario?.nombre || `Usuario ${registro.usuario_id}`}
                        </Link>
                      </td>
                      <td>{formatearFecha(registro.fecha_login)}</td>
                      <td>
                        <span className={`metodo-badge metodo-${registro.metodo_login}`}>
                          {getMetodoLoginLabel(registro.metodo_login)}
                        </span>
                      </td>
                      <td>{registro.ip_address || 'N/A'}</td>
                      <td className="user-agent-cell">
                        <div className="user-agent-content">
                          {registro.user_agent || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {paginacion.totalPaginas > 1 && (
              <div className="paginacion">
                <button 
                  className="pagination-button"
                  onClick={() => cambiarPagina(paginacion.pagina - 1)}
                  disabled={paginacion.pagina === 1}
                >
                  <i className="icon icon-chevron-left"></i>
                </button>
                
                {[...Array(paginacion.totalPaginas).keys()].map(numero => (
                  <button
                    key={numero + 1}
                    className={`pagination-button ${paginacion.pagina === numero + 1 ? 'active' : ''}`}
                    onClick={() => cambiarPagina(numero + 1)}
                  >
                    {numero + 1}
                  </button>
                ))}
                
                <button 
                  className="pagination-button"
                  onClick={() => cambiarPagina(paginacion.pagina + 1)}
                  disabled={paginacion.pagina === paginacion.totalPaginas}
                >
                  <i className="icon icon-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginRegistrosPage;
