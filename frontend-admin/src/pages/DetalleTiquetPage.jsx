import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import archivoService from '../services/archivoService';
import ComentariosSection from '../components/ComentariosSection';
import ArchivosAdjuntos from '../components/ArchivosAdjuntos';
import AuthContext from '../context/AuthContext';
import '../styles/DetalleTiquetPage.css';

const DetalleTiquetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  
  const [tiquet, setTiquet] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [cargandoArchivos, setCargandoArchivos] = useState(false);
  const [formulario, setFormulario] = useState({
    estado: '',
    prioridad: '',
    comentario: ''
  });

  useEffect(() => {
    const cargarTiquet = async () => {
      try {
        setCargando(true);
        const response = await ticketService.getTiquetPorId(id);
        setTiquet(response.data);
        setFormulario({
          estado: response.data.estado,
          prioridad: response.data.prioridad,
          comentario: ''
        });
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
          setError('El tiquet solicitado no existe.');
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
  
  // Función para recargar los archivos
  const refrescarArchivos = async () => {
    try {
      setCargandoArchivos(true);
      const response = await archivoService.getArchivosPorTicket(id);
      if (response.success && response.data) {
        setArchivos(response.data);
      }
    } catch (error) {
      console.error('Error al recargar archivos:', error);
    } finally {
      setCargandoArchivos(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setCargando(true);
      
      // Solo enviamos los datos que hayan cambiado
      const datosActualizados = {};
      if (formulario.estado !== tiquet.estado) datosActualizados.estado = formulario.estado;
      if (formulario.prioridad !== tiquet.prioridad) datosActualizados.prioridad = formulario.prioridad;
      if (formulario.comentario.trim()) datosActualizados.comentario = formulario.comentario;
      
      if (Object.keys(datosActualizados).length > 0) {
        await ticketService.actualizarTiquet(id, datosActualizados);
        
        // Recargar tiquet con datos actualizados
        const response = await ticketService.getTiquetPorId(id);
        setTiquet(response.data);
      }
      
      setFormulario({
        ...formulario,
        comentario: ''
      });
      setEditando(false);
      setError(null);
    } catch (error) {
      console.error('Error al actualizar tiquet:', error);
      setError('Ocurrió un error al actualizar el tiquet. Por favor, intenta nuevamente más tarde.');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarTiquet = async () => {
    if (!window.confirm('¿Está seguro que desea eliminar este tiquet? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setCargando(true);
      await ticketService.eliminarTiquet(id);
      navigate('/tiquets');
    } catch (error) {
      console.error('Error al eliminar tiquet:', error);
      setError('Ocurrió un error al eliminar el tiquet. Por favor, intenta nuevamente más tarde.');
      setCargando(false);
    }
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
      'urgente': { label: 'Urgente', className: 'bg-danger' }
    };
    
    return prioridades[prioridad] || { label: prioridad, className: 'bg-light' };
  };

  if (cargando && !tiquet) {
    return (
      <div className="container mt-5 text-center">
        <div className="loading-spinner-container">
          <div className="loading-spinner-large"></div>
        </div>
        <p className="mt-3">Cargando detalles del tiquet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">¡Error!</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-primary" 
            onClick={() => navigate('/tiquets')}
          >
            Volver a la lista de tiquets
          </button>
        </div>
      </div>
    );
  }

  if (!tiquet) {
    return null;
  }

  return (
    <div className="container-fluid mt-4 mb-5 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/tiquets')}
        >
          &laquo; Volver a la lista de tiquets
        </button>
        
        <div>
          {!editando ? (
            <button 
              className="btn btn-primary me-2"
              onClick={() => setEditando(true)}
              disabled={cargando}
            >
              <span className="icon-edit">✏️</span> Editar tiquet
            </button>
          ) : (
            <button 
              className="btn btn-secondary me-2"
              onClick={() => {
                setEditando(false);
                setFormulario({
                  estado: tiquet.estado,
                  prioridad: tiquet.prioridad,
                  comentario: ''
                });
              }}
              disabled={cargando}
            >
              Cancelar edición
            </button>
          )}
          
          <button 
            className="btn btn-danger"
            onClick={handleEliminarTiquet}
            disabled={cargando}
          >
            <span className="icon-delete">🗑️</span> Eliminar tiquet
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="mb-0 fs-4">Tiquet #{tiquet.id}: {tiquet.titulo}</h2>
              <span className={`badge ${getEstadoLabel(tiquet.estado).className}`}>
                {getEstadoLabel(tiquet.estado).label}
              </span>
            </div>
            
            <div className="card-body">
              {!editando ? (
                <>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <p>
                        <strong>Estado:</strong> 
                        <span className={`badge ${getEstadoLabel(tiquet.estado).className} ms-2`}>
                          {getEstadoLabel(tiquet.estado).label}
                        </span>
                      </p>
                      <p>
                        <strong>Prioridad:</strong> 
                        <span className={`badge ${getPrioridadLabel(tiquet.prioridad).className} ms-2`}>
                          {getPrioridadLabel(tiquet.prioridad).label}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
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
                </>
              ) : (
                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="estado" className="form-label">Estado:</label>
                      <select 
                        id="estado" 
                        name="estado"
                        className="form-select"
                        value={formulario.estado}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="resuelto">Resuelto</option>
                        <option value="cerrado">Cerrado</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="prioridad" className="form-label">Prioridad:</label>
                      <select 
                        id="prioridad" 
                        name="prioridad"
                        className="form-select"
                        value={formulario.prioridad}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="comentario" className="form-label">Comentario de actualización (opcional):</label>
                    <textarea 
                      id="comentario" 
                      name="comentario"
                      className="form-control"
                      rows="3"
                      value={formulario.comentario}
                      onChange={handleInputChange}
                      placeholder="Añada un comentario sobre los cambios realizados..."
                    />
                  </div>
                  
                  <div className="text-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={cargando}
                    >
                      {cargando ? (
                        <>
                          <div className="loading-spinner-small me-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>Guardar cambios</>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              <h5 className="card-title mb-3">Descripción</h5>
              <p className="card-text mb-4" style={{ whiteSpace: 'pre-line' }}>{tiquet.descripcion}</p>
              
              {tiquet.imagen_url && (
                <div className="mb-4">
                  <h5 className="card-title mb-3">Imagen adjunta</h5>
                  <div className="text-center">
                    <a 
                      href={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${tiquet.imagen_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${tiquet.imagen_url}`} 
                        alt="Imagen adjunta al tiquet" 
                        className="img-fluid rounded" 
                        style={{ maxHeight: '300px' }} 
                      />
                    </a>
                  </div>
                </div>
              )}
              
              {/* Mostrar archivos adjuntos */}
              <ArchivosAdjuntos 
                archivos={archivos} 
                ticketId={tiquet.id}
                onEliminar={handleEliminarArchivo}
                refrescarArchivos={refrescarArchivos}
              />
              
            </div>
          </div>
          
          {/* Sección de comentarios */}
          <ComentariosSection tiquetId={id} usuario={usuario} />
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Información del usuario</h5>
            </div>
            <div className="card-body">
              <p><strong>Nombre:</strong> {tiquet.usuario?.nombre}</p>
              <p><strong>Email:</strong> {tiquet.usuario?.email}</p>
              {tiquet.usuario?.codprg && <p><strong>Programa:</strong> {tiquet.usuario.codprg}</p>}
              {tiquet.usuario?.codcli && <p><strong>Cliente:</strong> {tiquet.usuario.codcli}</p>}
              {tiquet.usuario?.codusu && <p><strong>Código de usuario:</strong> {tiquet.usuario.codusu}</p>}
            </div>
          </div>
          
          {tiquet.historial && tiquet.historial.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Historial de cambios</h5>
                <span className="badge bg-light text-dark">{tiquet.historial.length}</span>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {tiquet.historial.map(item => (
                    <div key={item.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">
                          {item.estado_anterior && item.estado_nuevo ? (
                            <>Cambio de estado: <span className="badge bg-secondary">{getEstadoLabel(item.estado_anterior).label}</span> a <span className="badge bg-primary">{getEstadoLabel(item.estado_nuevo).label}</span></>
                          ) : (
                            'Actualización'
                          )}
                        </h6>
                        <small className="text-muted">{new Date(item.fecha_creacion).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</small>
                      </div>
                      {item.comentario && <p className="mb-1">{item.comentario}</p>}
                      <small className="text-muted">Por: {item.usuario?.nombre || 'Sistema'}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleTiquetPage;
