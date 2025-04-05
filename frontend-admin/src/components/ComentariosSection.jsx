import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import '../styles/ComentariosSection.css';

const ComentariosSection = ({ tiquetId, usuario }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar comentarios
  const cargarComentarios = async () => {
    try {
      setCargando(true);
      const response = await ticketService.getComentarios(tiquetId);
      setComentarios(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setError('No se pudieron cargar los comentarios. Intente nuevamente más tarde.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (tiquetId) {
      cargarComentarios();
    }
  }, [tiquetId]);

  // Enviar nuevo comentario
  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.trim()) {
      return;
    }
    
    try {
      setCargando(true);
      await ticketService.agregarComentario(tiquetId, nuevoComentario);
      setNuevoComentario('');
      await cargarComentarios(); // Recargar comentarios después de agregar uno nuevo
      setError(null);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      setError('No se pudo agregar el comentario. Intente nuevamente más tarde.');
    } finally {
      setCargando(false);
    }
  };

  // Eliminar comentario
  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este comentario?')) {
      return;
    }
    
    try {
      setCargando(true);
      await ticketService.eliminarComentario(tiquetId, comentarioId);
      await cargarComentarios(); // Recargar comentarios después de eliminar
      setError(null);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      setError('No se pudo eliminar el comentario. Intente nuevamente más tarde.');
    } finally {
      setCargando(false);
    }
  };

  // El administrador puede eliminar cualquier comentario
  const puedeEliminarComentario = () => true;

  return (
    <div className="comentarios-section">
      <div className="comentarios-header">
        <h5 className="comentarios-title">Comentarios</h5>
        <span className="comentarios-count">{comentarios.length}</span>
      </div>
      
      <div className="comentarios-body">
        {error && <div className="comentarios-error">{error}</div>}
        
        <div className="comentarios-list">
          {comentarios.length === 0 ? (
            <p className="comentarios-empty">No hay comentarios en este tiquet.</p>
          ) : (
            comentarios.map(comentario => (
              <div key={comentario.id} className={`comentario ${comentario.usuario.rol === 'admin' ? 'comentario-border-primary comentario-bg-light' : 'comentario-border-secondary'}`}>
                <div className="comentario-header">
                  <div className="comentario-user">
                    <span className="comentario-user-name">{comentario.usuario.nombre}</span>
                    <span className={`comentario-badge ${comentario.usuario.rol === 'admin' ? 'comentario-badge-admin' : 'comentario-badge-user'}`}>
                      {comentario.usuario.rol === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </div>
                  <span className="comentario-timestamp">
                    {new Date(comentario.fecha_creacion).toLocaleString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="comentario-content">{comentario.texto}</p>
                
                {puedeEliminarComentario() && (
                  <div className="comentario-actions">
                    <button 
                      className="comentario-btn-delete" 
                      onClick={() => handleEliminarComentario(comentario.id)}
                      disabled={cargando}
                    >
                      <span className="icon-trash">🗑️</span> Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <form className="comentarios-form" onSubmit={handleSubmitComentario}>
          <label htmlFor="comentario" className="comentarios-form-label">Agregar comentario:</label>
          <textarea
            id="comentario"
            className="comentarios-form-textarea"
            placeholder="Escriba un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            disabled={cargando}
            required
          />
          <button 
            type="submit" 
            className="comentarios-form-submit"
            disabled={cargando || !nuevoComentario.trim()}
          >
            {cargando ? (
              <>
                <div className="loading-spinner-small"></div>
                Enviando...
              </>
            ) : (
              <>Enviar comentario</>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ComentariosSection;
