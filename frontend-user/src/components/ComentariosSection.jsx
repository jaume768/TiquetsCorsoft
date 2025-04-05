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

  // Verificar si el usuario puede eliminar un comentario
  const puedeEliminarComentario = (comentario) => {
    return usuario.rol === 'admin' || comentario.usuario_id === usuario.id;
  };

  return (
    <div className="comentarios-section">
      <h3 className="comentarios-title">Comentarios</h3>
      
      {error && <div className="comentarios-error">{error}</div>}
      
      <div className="comentarios-list">
        {comentarios.length === 0 ? (
          <p className="no-comentarios">No hay comentarios en este tiquet.</p>
        ) : (
          comentarios.map(comentario => (
            <div key={comentario.id} className={`comentario ${comentario.usuario.rol === 'admin' ? 'comentario-admin' : 'comentario-usuario'}`}>
              <div className="comentario-header">
                <span className="comentario-autor">{comentario.usuario.nombre}</span>
                <span className="comentario-rol">{comentario.usuario.rol === 'admin' ? '(Administrador)' : '(Usuario)'}</span>
                <span className="comentario-fecha">
                  {new Date(comentario.fecha_creacion).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="comentario-contenido">{comentario.texto}</div>
              
              {puedeEliminarComentario(comentario) && (
                <button 
                  className="comentario-eliminar-btn" 
                  onClick={() => handleEliminarComentario(comentario.id)}
                  disabled={cargando}
                >
                  <span className="icon-trash">🗑️</span> Eliminar
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      <form className="comentario-form" onSubmit={handleSubmitComentario}>
        <textarea
          className="comentario-textarea"
          rows="3"
          placeholder="Escriba un comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          disabled={cargando}
          required
        />
        <button 
          type="submit" 
          className="comentario-enviar-btn"
          disabled={cargando || !nuevoComentario.trim()}
        >
          {cargando ? (
            <>
              <div className="loading-spinner-small"></div>
              <span>Enviando...</span>
            </>
          ) : 'Enviar comentario'}
        </button>
      </form>
      

    </div>
  );
};

export default ComentariosSection;
