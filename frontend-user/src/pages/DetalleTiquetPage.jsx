import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import archivoService from '../services/archivoService';
import ComentariosSection from '../components/ComentariosSection';
import ArchivosAdjuntos from '../components/ArchivosAdjuntos';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import '../styles/DetalleTiquetPage.css';

const DetalleTiquetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  
  const [tiquet, setTiquet] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoArchivos, setCargandoArchivos] = useState(false);
  const [error, setError] = useState(null);

  // Cargar el ticket y sus archivos adjuntos
  useEffect(() => {
    const cargarTiquet = async () => {
      try {
        setCargando(true);
        const response = await ticketService.getTiquetPorId(id);
        setTiquet(response.data);
        setError(null);
        
        // Si tiene archivos adjuntos en la respuesta, usarlos
        if (response.data && response.data.archivos) {
          setArchivos(response.data.archivos);
        } else {
          // Si no, intentar cargar los archivos por separado
          cargarArchivos();
        }
      } catch (error) {
        console.error('Error al cargar tiquet:', error);
        if (error.response && error.response.status === 404) {
          setError('El tiquet solicitado no existe o no tienes permiso para verlo.');
        } else {
          setError('Ocurrió un error al cargar los detalles del tiquet. Por favor, intenta nuevamente más tarde.');
        }
      } finally {
        setCargando(false);
      }
    };

    // Función para cargar los archivos adjuntos
    const cargarArchivos = async () => {
      try {
        setCargandoArchivos(true);
        const response = await archivoService.getArchivosPorTicket(id);
        if (response.success && response.data) {
          setArchivos(response.data);
        }
      } catch (error) {
        console.error('Error al cargar archivos:', error);
        // No mostrar error al usuario, solo en consola
      } finally {
        setCargandoArchivos(false);
      }
    };

    if (id) {
      cargarTiquet();
    }
  }, [id]);
  
  // Función para eliminar un archivo adjunto
  const handleEliminarArchivo = (archivoId) => {
    setArchivos(archivos.filter(archivo => archivo.id !== archivoId));
  };

  const getEstadoLabel = (estado) => {
    const estados = {
      'pendiente': { label: 'Pendiente', className: 'bg-warning' },
      'en_proceso': { label: 'En Proceso', className: 'bg-info' },
      'resuelto': { label: 'Resuelto', className: 'bg-success' },
      'cerrado': { label: 'Cerrado', className: 'bg-secondary' }
    };
    
    return estados[estado] || { label: estado, className: 'bg-light' };
  };

  const getPrioridadLabel = (prioridad) => {
    const prioridades = {
      'baja': { label: 'Baja', className: 'bg-success' },
      'media': { label: 'Media', className: 'bg-info' },
      'alta': { label: 'Alta', className: 'bg-warning' },
      'urgente': { label: 'Urgente', className: 'bg-danger' },
      'pendiente': { label: 'Pendiente', className: 'bg-warning' }
    };
    
    return prioridades[prioridad] || { label: prioridad, className: 'bg-light' };
  };

  if (cargando) {
    return (
      <div className="tiquet-loading-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner-large"></div>
        </div>
        <p className="tiquet-loading-text">Cargando detalles del tiquet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tiquet-error-container">
        <div className="tiquet-error-message">
          <h4 className="tiquet-error-title">¡Error!</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="tiquet-back-button" 
            onClick={() => navigate('/mis-tiquets')}
          >
            Volver a mis tiquets
          </button>
        </div>
      </div>
    );
  }

  if (!tiquet) {
    return null;
  }

  const { estado } = getEstadoLabel(tiquet.estado);
  // Prioridad oculta para usuarios

  return (
    <div className="tiquet-container">
      <Header usuario={usuario} />
      <div className="tiquet-header">
        <button 
          className="tiquet-back-button"
          onClick={() => navigate('/mis-tiquets')}
        >
          &laquo; Volver a mis tiquets
        </button>
      </div>
      
      <div className="tiquet-card">
        <div className="tiquet-card-header">
          <h2 className="tiquet-title">Tiquet #{tiquet.id}: {tiquet.titulo}</h2>
        </div>
        
        <div className="tiquet-card-body">
          <div className="tiquet-info">
            <div className="tiquet-metadata">
              <p>
                <strong>Estado:</strong> 
                <span className={`tiquet-badge ${getEstadoLabel(tiquet.estado).className.replace('bg-', 'badge-')}`}>
                  {getEstadoLabel(tiquet.estado).label}
                </span>
              </p>
              {/* Prioridad oculta para usuarios */}
            </div>
            <div className="tiquet-metadata">
              <p><strong>Fecha de creación:</strong> {new Date(tiquet.fecha_creacion).toLocaleString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>Última actualización:</strong> {new Date(tiquet.fecha_actualizacion).toLocaleString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
          
          <h5 className="tiquet-section-title">Descripción</h5>
          <p className="tiquet-descripcion">{tiquet.descripcion}</p>
          
          {tiquet.imagen_url && (
            <div className="tiquet-imagen-container">
              <h5 className="tiquet-section-title">Imagen adjunta</h5>
              <div className="tiquet-imagen-wrapper">
                <img 
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${tiquet.imagen_url}`} 
                  alt="Imagen adjunta al tiquet" 
                  className="tiquet-imagen" 
                />
              </div>
            </div>
          )}
          
          {/* Mostrar archivos adjuntos */}
          <ArchivosAdjuntos 
            archivos={archivos} 
            ticketId={tiquet.id} 
            onEliminar={handleEliminarArchivo}
            esAdministrador={usuario && usuario.rol === 'admin'}
          />
          
          {tiquet.historial && tiquet.historial.length > 0 && (
            <div className="tiquet-historial">
              <h5 className="tiquet-section-title">Historial de cambios</h5>
              <div className="tiquet-historial-list">
                {tiquet.historial.map(item => (
                  <div key={item.id} className="tiquet-historial-item">
                    <div className="tiquet-historial-header">
                      <h6 className="tiquet-historial-titulo">
                        {item.estado_anterior && item.estado_nuevo ? (
                          <>Cambio de estado: <span className="tiquet-badge badge-secondary">{getEstadoLabel(item.estado_anterior).label}</span> a <span className="tiquet-badge badge-primary">{getEstadoLabel(item.estado_nuevo).label}</span></>
                        ) : (
                          'Actualización'
                        )}
                      </h6>
                      <small className="tiquet-historial-fecha">{new Date(item.fecha_creacion).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</small>
                    </div>
                    <p className="tiquet-historial-comentario">{item.comentario}</p>
                    <small className="tiquet-historial-usuario">Por: {item.usuario?.nombre || 'Sistema'}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sección de comentarios */}
          <ComentariosSection tiquetId={id} usuario={usuario} />
        </div>
      </div>
    </div>
  );
};

export default DetalleTiquetPage;
