import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import '../styles/TiquetsPage.css';
import '../styles/components/icons.css';

const TiquetsPage = () => {
  const [tiquets, setTiquets] = useState([]);
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    busqueda: '',
    pagina: 1,
    limite: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState({
    total: 0,
    pagina: 1,
    limite: 10,
    totalPaginas: 0
  });

  useEffect(() => {
    cargarTiquets();
  }, [filtros]);

  const cargarTiquets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTodosTiquets(filtros);
      
      // Manejar diferentes estructuras de respuesta posibles
      if (response.success && response.data && response.data.tiquets) {
        // Nueva estructura con paginación
        setTiquets(response.data.tiquets);
        setPaginacion(response.data.paginacion);
        setError(null);
      } else if (response.success && Array.isArray(response.data)) {
        // Estructura antigua (array de tiquets sin paginación)
        setTiquets(response.data);
        setPaginacion({
          total: response.data.length,
          pagina: 1,
          limite: response.data.length,
          totalPaginas: 1
        });
        setError(null);
      } else {
        console.error('Formato de respuesta inesperado:', response);
        setError('Formato de respuesta inesperado del servidor.');
      }
    } catch (error) {
      console.error('Error al cargar tiquets:', error);
      setError('No se pudieron cargar los tickets. Por favor, intente nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value,
      pagina: 1 // Resetear a la primera página al cambiar filtros
    });
  };

  const handleBusquedaSubmit = (e) => {
    e.preventDefault();
    cargarTiquets();
  };

  const resetFiltros = () => {
    setFiltros({
      estado: '',
      prioridad: '',
      busqueda: '',
      pagina: 1,
      limite: 10
    });
  };

  const getEstadoLabel = (estado) => {
    const estados = {
      'pendiente': { label: 'Pendiente', className: 'estado-pendiente' },
      'en_proceso': { label: 'En Proceso', className: 'estado-proceso' },
      'resuelto': { label: 'Resuelto', className: 'estado-resuelto' },
      'cerrado': { label: 'Cerrado', className: 'estado-cerrado' }
    };
    
    return estados[estado] || { label: estado, className: 'estado-default' };
  };

  const getPrioridadLabel = (prioridad) => {
    const prioridades = {
      'baja': { label: 'Baja', className: 'prioridad-baja' },
      'media': { label: 'Media', className: 'prioridad-media' },
      'alta': { label: 'Alta', className: 'prioridad-alta' },
      'urgente': { label: 'Urgente', className: 'prioridad-urgente' }
    };
    
    return prioridades[prioridad] || { label: prioridad, className: 'prioridad-default' };
  };

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setFiltros({
      ...filtros,
      pagina: numeroPagina
    });
  };

  return (
    <div className="tiquets-page-container">
      <header className="tiquets-header">
        <h1 className="tiquets-title">Gestión de Tickets</h1>
      </header>
      
      <div className="tiquets-filters-container">
        <form className="filtros-form" onSubmit={handleBusquedaSubmit}>
          <div className="filtros-grid">
            <div className="filtro-group">
              <label htmlFor="estado" className="filtro-label">Estado:</label>
              <select
                id="estado"
                name="estado"
                className="filtro-select"
                value={filtros.estado}
                onChange={handleInputChange}
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
            
            <div className="filtro-group">
              <label htmlFor="prioridad" className="filtro-label">Prioridad:</label>
              <select
                id="prioridad"
                name="prioridad"
                className="filtro-select"
                value={filtros.prioridad}
                onChange={handleInputChange}
              >
                <option value="">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            
            <div className="filtro-group busqueda-group">
              <label htmlFor="busqueda" className="filtro-label">Búsqueda:</label>
              <div className="busqueda-container">
                <input
                  type="text"
                  id="busqueda"
                  name="busqueda"
                  className="filtro-input"
                  placeholder="Buscar por título o descripción..."
                  value={filtros.busqueda}
                  onChange={handleInputChange}
                />
                <button type="submit" className="busqueda-button">
                  <i className="icon icon-search"></i>
                </button>
              </div>
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
        <div className="tiquets-error">
          {error}
        </div>
      )}
      
      <div className="tiquets-content">
        {loading ? (
          <div className="tiquets-loading">
            <i className="icon icon-loading icon-spin icon-2x"></i>
            <p>Cargando tickets...</p>
          </div>
        ) : tiquets.length === 0 ? (
          <div className="no-tiquets">
            <i className="icon icon-tickets icon-2x"></i>
            <p>No se encontraron tickets con los filtros seleccionados</p>
            {(filtros.estado || filtros.prioridad || filtros.busqueda) && (
              <button 
                className="reset-button mt-3"
                onClick={resetFiltros}
              >
                <i className="icon icon-search"></i> Mostrar todos los tickets
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="tiquets-table-container">
              <table className="tiquets-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiquets.map(tiquet => (
                    <tr key={tiquet.id}>
                      <td className="tiquet-id">#{tiquet.id}</td>
                      <td className="tiquet-titulo">{tiquet.titulo}</td>
                      <td className="tiquet-usuario">{tiquet.usuario?.nombre || 'N/A'}</td>
                      <td className="tiquet-estado">
                        <span className={`estado-badge ${getEstadoLabel(tiquet.estado).className}`}>
                          {getEstadoLabel(tiquet.estado).label}
                        </span>
                      </td>
                      <td className="tiquet-prioridad">
                        <span className={`prioridad-badge ${getPrioridadLabel(tiquet.prioridad).className}`}>
                          {getPrioridadLabel(tiquet.prioridad).label}
                        </span>
                      </td>
                      <td className="tiquet-fecha">
                        {new Date(tiquet.fecha_creacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="tiquet-acciones">
                        <Link to={`/tiquets/${tiquet.id}`} className="btn-ver">
                          <i className="icon icon-eye"></i> Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Información de paginación */}
            {tiquets.length > 0 && (
              <div className="paginacion-info">
                Mostrando {tiquets.length} de {paginacion.total} tickets - Página {paginacion.pagina} de {paginacion.totalPaginas}
              </div>
            )}
            
            {/* Paginación */}
            {paginacion.totalPaginas > 1 && (
              <div className="tiquets-pagination">
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

export default TiquetsPage;
