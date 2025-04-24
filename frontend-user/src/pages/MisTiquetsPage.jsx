import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ticketService from '../services/ticketService';
import Header from '../components/Header';
import { FaPlus, FaTimesCircle, FaExclamationTriangle, FaTicketAlt, FaComments, FaSearch } from 'react-icons/fa';
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
  
  const cargarTiquets = async (useFiltros = filtros) => {
    try {
      setCargando(true);
      const response = await ticketService.getMisTiquets(useFiltros);
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
    const nuevosFiltros = { ...filtros, [name]: value };
    setFiltros(nuevosFiltros);
    cargarTiquets(nuevosFiltros);
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
      <Header usuario={usuario} />
      
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <FaTicketAlt className="page-icon" />
            <h2 className="page-title">Mis Tickets</h2>
            <Link to="/tiquets/nuevo" className="btn-nuevo-tiquet">
              <FaPlus className="icon-modern" /> Nuevo Ticket
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
                
                {/* Filtro de prioridad oculto para usuarios */}
                
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
                  <button type="button" className="buscar-button" onClick={() => cargarTiquets()}>
                    <FaSearch className="icon-modern" /> Buscar
                  </button>
                  <button
                    type="button"
                    className="reset-button"
                    onClick={() => {
                      resetFiltros();
                      cargarTiquets();
                    }}
                  >
                    <FaTimesCircle className="icon-modern" /> Limpiar filtros
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {error && (
            <div className="error-alert">
              <FaExclamationTriangle className="icon-modern" />
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
                  <FaTicketAlt className="icon-modern ticket-large" />
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
                  <FaPlus className="icon-modern" /> Crear nuevo ticket
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
                        className="tiquet-card-page"
                        key={tiquet.id}
                      >
                        <div className="tiquet-card-header">
                          <span className={`tiquet-estado ${getEstadoClase(tiquet.estado)}`}>
                            {getEstadoLabel(tiquet.estado)}
                          </span>
                          {/* Prioridad oculta para usuarios */}
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
                          {/* Prioridad oculta para usuarios */}
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
