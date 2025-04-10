import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import AuthContext from '../context/AuthContext';
import NotificacionesDropdown from '../components/NotificacionesDropdown';
import '../styles/MisTiquetsPage.css';

const MisTiquetsPage = () => {
  const { usuario, logout } = useContext(AuthContext);
  const [tiquets, setTiquets] = useState([]);
  const [ultimosTiquets, setUltimosTiquets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    busqueda: ''
  });
  
  useEffect(() => {
    cargarTiquets();
  }, []);
  
  const cargarTiquets = async () => {
    try {
      setCargando(true);
      const response = await ticketService.getMisTiquets(filtros);
      setTiquets(response.data);
      
      // Obtener los 4 últimos tickets para mostrar como tarjetas
      const ticketsOrdenados = [...response.data].sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      setUltimosTiquets(ticketsOrdenados.slice(0, 4));
      
      setError(null);
    } catch (error) {
      console.error('Error al cargar tiquets:', error);
      setError('Ocurrió un error al cargar sus tickets. Por favor, intente nuevamente más tarde.');
    } finally {
      setCargando(false);
    }
  };
  
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };
  
  const handleBusquedaChange = (e) => {
    setFiltros({
      ...filtros,
      busqueda: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    cargarTiquets();
  };
  
  const resetFiltros = () => {
    setFiltros({
      estado: '',
      prioridad: '',
      busqueda: ''
    });
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const getEstadoClase = (estado) => {
    const estados = {
      'pendiente': 'estado-pendiente',
      'en_proceso': 'estado-proceso',
      'resuelto': 'estado-resuelto',
      'cerrado': 'estado-cerrado'
    };
    
    return estados[estado] || '';
  };
  
  const getEstadoLabel = (estado) => {
    const estados = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado'
    };
    
    return estados[estado] || estado;
  };
  
  const getPrioridadClase = (prioridad) => {
    const prioridades = {
      'baja': 'prioridad-baja',
      'media': 'prioridad-media',
      'alta': 'prioridad-alta',
      'urgente': 'prioridad-urgente',
      'pendiente': 'prioridad-pendiente'
    };
    
    return prioridades[prioridad] || '';
  };
  
  const getPrioridadLabel = (prioridad) => {
    const prioridades = {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta',
      'urgente': 'Urgente',
      'pendiente': 'Pendiente'
    };
    
    return prioridades[prioridad] || prioridad;
  };
  
  return (
    <div className="mis-tiquets-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">
              Tickets<span>Corsoft</span>
            </h1>
            <nav className="nav">
              <Link to="/mis-tiquets" className="nav-link active">
                <span className="icon-tickets">🎟️</span>
                <span>Mis Tickets</span>
              </Link>
              <Link to="/tiquets/nuevo" className="nav-link">
                <span className="icon-new-ticket">➕</span>
                <span>Nuevo Ticket</span>
              </Link>
            </nav>
            <div className="header-actions">
              <NotificacionesDropdown />
              <div className="user-dropdown">
                <button className="user-dropdown-toggle">
                  <div className="user-avatar">
                    <span>{usuario?.nombre?.[0] || 'U'}</span>
                  </div>
                  <span className="user-name">{usuario?.nombre || 'Usuario'}</span>
                  <span className="icon-chevron-down">▼</span>
                </button>
                <div className="user-dropdown-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      <span>{usuario?.nombre?.[0] || 'U'}</span>
                    </div>
                    <div className="user-details">
                      <p className="user-fullname">{usuario?.nombre || 'Usuario'}</p>
                      <p className="user-email">{usuario?.email || 'usuario@example.com'}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="user-action-btn" onClick={handleLogout}>
                      <span className="icon-logout">🚪</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h2 className="page-title">Mis Tickets</h2>
            <Link to="/tiquets/nuevo" className="btn-nuevo-tiquet">
              <span className="icon-plus">➕</span> Nuevo Ticket
            </Link>
          </div>
          
          <div className="filtros-container">
            <form onSubmit={handleSubmit} className="filtros-form">
              <div className="filtros-grid">
                <div className="filtro-group">
                  <label htmlFor="estado" className="filtro-label">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    className="filtro-select"
                    value={filtros.estado}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
                
                <div className="filtro-group">
                  <label htmlFor="prioridad" className="filtro-label">Prioridad</label>
                  <select
                    id="prioridad"
                    name="prioridad"
                    className="filtro-select"
                    value={filtros.prioridad}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todas</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                
                <div className="filtro-group busqueda-group">
                  <label htmlFor="busqueda" className="filtro-label">Buscar</label>
                  <div className="busqueda-container">
                    <input
                      type="text"
                      id="busqueda"
                      name="busqueda"
                      className="filtro-input"
                      placeholder="Buscar por título, descripción..."
                      value={filtros.busqueda}
                      onChange={handleBusquedaChange}
                    />
                    <button type="submit" className="busqueda-button">
                      <span className="icon-search">🔍</span>
                    </button>
                  </div>
                </div>
                
                <div className="filtro-actions">
                  <button
                    type="button"
                    className="reset-button"
                    onClick={() => {
                      resetFiltros();
                      cargarTiquets();
                    }}
                  >
                    <span className="icon-x-circle">❌</span> Limpiar filtros
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {error && (
            <div className="error-alert">
              <span className="icon-alert">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="tiquets-container">
            {cargando ? (
              <div className="loading-container">
                <div className="loading-spinner-container">
                  <div className="loading-spinner-large"></div>
                </div>
                <p>Cargando sus tickets...</p>
              </div>
            ) : tiquets.length === 0 ? (
              <div className="no-tiquets">
                <div className="no-tiquets-icon">
                  <span className="icon-ticket-large">🎟️</span>
                </div>
                <h3 className="no-tiquets-title">No tiene tickets</h3>
                <p className="no-tiquets-message">
                  No se encontraron tickets {filtros.estado || filtros.prioridad || filtros.busqueda ? 'con los filtros seleccionados' : ''}
                </p>
                {(filtros.estado || filtros.prioridad || filtros.busqueda) && (
                  <button
                    className="no-tiquets-reset-btn"
                    onClick={() => {
                      resetFiltros();
                      cargarTiquets();
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
                <Link to="/tiquets/nuevo" className="no-tiquets-action-btn">
                  <span className="icon-plus">➕</span> Crear nuevo ticket
                </Link>
              </div>
            ) : (
              <>
                {/* Sección de últimos tickets como tarjetas */}
                <div className="ultimos-tiquets-section">
                  <h3 className="section-title">Últimos Tickets</h3>
                  <div className="tiquets-grid">
                    {ultimosTiquets.map(tiquet => (
                      <Link
                        to={`/tiquets/${tiquet.id}`}
                        className="tiquet-card"
                        key={tiquet.id}
                      >
                        <div className="tiquet-card-header">
                          <span className={`tiquet-estado ${getEstadoClase(tiquet.estado)}`}>
                            {getEstadoLabel(tiquet.estado)}
                          </span>
                          <span className={`tiquet-prioridad ${getPrioridadClase(tiquet.prioridad)}`}>
                            {getPrioridadLabel(tiquet.prioridad)}
                          </span>
                        </div>
                        <div className="tiquet-card-body">
                          <h3 className="tiquet-titulo">{tiquet.titulo}</h3>
                          <p className="tiquet-descripcion">{tiquet.descripcion}</p>
                        </div>
                        <div className="tiquet-card-footer">
                          <div className="tiquet-footer-info">
                            <span className="tiquet-id">#{tiquet.id}</span>
                            <span className="tiquet-fecha">
                              {new Date(tiquet.fecha_creacion).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="tiquet-comentarios">
                            <span className="icon-comments">💬</span>
                            <span>{tiquet.num_comentarios || 0}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Sección de todos los tickets como tabla */}
                <div className="todos-tiquets-section">
                  <h3 className="section-title">Todos tus Tickets</h3>
                  <div className="tiquets-table-container">
                    <table className="tiquets-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Título</th>
                          <th>Estado</th>
                          <th>Prioridad</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tiquets.map(tiquet => (
                          <tr key={tiquet.id}>
                            <td>#{tiquet.id}</td>
                            <td>{tiquet.titulo}</td>
                            <td>
                              <span className={`tiquet-estado-badge ${getEstadoClase(tiquet.estado)}`}>
                                {getEstadoLabel(tiquet.estado)}
                              </span>
                            </td>
                            <td>
                              <span className={`tiquet-prioridad-badge ${getPrioridadClase(tiquet.prioridad)}`}>
                                {getPrioridadLabel(tiquet.prioridad)}
                              </span>
                            </td>
                            <td>
                              {new Date(tiquet.fecha_creacion).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td>
                              <Link to={`/tiquets/${tiquet.id}`} className="ver-tiquet-btn">
                                Ver detalles
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MisTiquetsPage;
