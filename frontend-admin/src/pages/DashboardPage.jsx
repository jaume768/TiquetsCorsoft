import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ticketService from '../services/ticketService';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const { usuario } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTiquets: 0,
    tiquetsPendientes: 0,
    tiquetsEnProceso: 0,
    tiquetsResueltos: 0,
    tiquetsCerrados: 0,
    prioridadAlta: 0,
    prioridadUrgente: 0
  });
  const [ultimosTiquets, setUltimosTiquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Cargar todos los tiquets para las estadísticas
        const responseTiquets = await ticketService.getTodosTiquets();
        const tiquets = responseTiquets.data;
        
        // Calcular estadísticas
        const totalTiquets = tiquets.length;
        const tiquetsPendientes = tiquets.filter(t => t.estado === 'pendiente').length;
        const tiquetsEnProceso = tiquets.filter(t => t.estado === 'en_proceso').length;
        const tiquetsResueltos = tiquets.filter(t => t.estado === 'resuelto').length;
        const tiquetsCerrados = tiquets.filter(t => t.estado === 'cerrado').length;
        const prioridadAlta = tiquets.filter(t => t.prioridad === 'alta').length;
        const prioridadUrgente = tiquets.filter(t => t.prioridad === 'urgente').length;
        
        setStats({
          totalTiquets,
          tiquetsPendientes,
          tiquetsEnProceso,
          tiquetsResueltos,
          tiquetsCerrados,
          prioridadAlta,
          prioridadUrgente
        });
        
        // Obtener los últimos 5 tiquets
        const ultimosTiquets = tiquets.slice(0, 5);
        setUltimosTiquets(ultimosTiquets);
        
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-welcome">
          <p>Bienvenido, <span className="admin-name">{usuario?.nombre}</span></p>
          <p className="fecha-actual">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>
      
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}
      
      <div className="dashboard-stats">
        <div className="stats-card total-tiquets">
          <div className="stats-icon">
            <i className="bi bi-ticket-perforated-fill"></i>
          </div>
          <div className="stats-content">
            <h3 className="stats-number">{stats.totalTiquets}</h3>
            <p className="stats-label">Total Tickets</p>
          </div>
        </div>
        
        <div className="stats-card pendientes">
          <div className="stats-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <div className="stats-content">
            <h3 className="stats-number">{stats.tiquetsPendientes}</h3>
            <p className="stats-label">Pendientes</p>
          </div>
        </div>
        
        <div className="stats-card en-proceso">
          <div className="stats-icon">
            <i className="bi bi-gear"></i>
          </div>
          <div className="stats-content">
            <h3 className="stats-number">{stats.tiquetsEnProceso}</h3>
            <p className="stats-label">En Proceso</p>
          </div>
        </div>
        
        <div className="stats-card resueltos">
          <div className="stats-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="stats-content">
            <h3 className="stats-number">{stats.tiquetsResueltos}</h3>
            <p className="stats-label">Resueltos</p>
          </div>
        </div>
        
        <div className="stats-card alta-prioridad">
          <div className="stats-icon">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div className="stats-content">
            <h3 className="stats-number">{stats.prioridadAlta + stats.prioridadUrgente}</h3>
            <p className="stats-label">Alta Prioridad</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Últimos Tickets</h2>
            <Link to="/tiquets" className="view-all-btn">
              Ver todos <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          
          <div className="ultimos-tiquets">
            {ultimosTiquets.length === 0 ? (
              <p className="no-tiquets">No hay tickets disponibles</p>
            ) : (
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
                    {ultimosTiquets.map(tiquet => (
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
                            <i className="bi bi-eye-fill"></i> Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-charts">
          <div className="chart-card">
            <h3 className="chart-title">Distribución de Tickets por Estado</h3>
            <div className="status-distribution">
              <div 
                className="status-bar pendiente" 
                style={{ width: `${(stats.tiquetsPendientes / stats.totalTiquets) * 100}%` }}
                title={`Pendientes: ${stats.tiquetsPendientes}`}
              >
                {stats.tiquetsPendientes > 0 && (
                  <span className="status-count">{stats.tiquetsPendientes}</span>
                )}
              </div>
              <div 
                className="status-bar proceso" 
                style={{ width: `${(stats.tiquetsEnProceso / stats.totalTiquets) * 100}%` }}
                title={`En Proceso: ${stats.tiquetsEnProceso}`}
              >
                {stats.tiquetsEnProceso > 0 && (
                  <span className="status-count">{stats.tiquetsEnProceso}</span>
                )}
              </div>
              <div 
                className="status-bar resuelto" 
                style={{ width: `${(stats.tiquetsResueltos / stats.totalTiquets) * 100}%` }}
                title={`Resueltos: ${stats.tiquetsResueltos}`}
              >
                {stats.tiquetsResueltos > 0 && (
                  <span className="status-count">{stats.tiquetsResueltos}</span>
                )}
              </div>
              <div 
                className="status-bar cerrado" 
                style={{ width: `${(stats.tiquetsCerrados / stats.totalTiquets) * 100}%` }}
                title={`Cerrados: ${stats.tiquetsCerrados}`}
              >
                {stats.tiquetsCerrados > 0 && (
                  <span className="status-count">{stats.tiquetsCerrados}</span>
                )}
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color pendiente"></span>
                <span className="legend-label">Pendientes</span>
              </div>
              <div className="legend-item">
                <span className="legend-color proceso"></span>
                <span className="legend-label">En Proceso</span>
              </div>
              <div className="legend-item">
                <span className="legend-color resuelto"></span>
                <span className="legend-label">Resueltos</span>
              </div>
              <div className="legend-item">
                <span className="legend-color cerrado"></span>
                <span className="legend-label">Cerrados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
