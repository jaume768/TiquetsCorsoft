import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import archivoService from '../services/archivoService';
import '../styles/ComentariosSection.css';

const ComentariosSection = ({ tiquetId, usuario }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [descargandoArchivo, setDescargandoArchivo] = useState(false);

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

  // Descargar un archivo adjunto de comentario
  const handleDescargarArchivo = async (archivoId) => {
    try {
      setDescargandoArchivo(true);
      // Usar el método específico para archivos de comentarios
      const blob = await archivoService.descargarArchivoComentario(archivoId);
      
      // Crear URL para la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `archivo_${archivoId}`);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar archivo de comentario:', error);
      alert('No se pudo descargar el archivo. Intente nuevamente más tarde.');
    } finally {
      setDescargandoArchivo(false);
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
              
              {/* Mostrar archivos adjuntos si el comentario tiene */}
              {comentario.archivos && comentario.archivos.length > 0 && (
                <div className="comentario-archivos">
                  <h4 className="comentario-archivos-titulo">
                    <i className="fas fa-paperclip"></i> Archivos adjuntos ({comentario.archivos.length})
                  </h4>
                  <div className="comentario-archivos-lista">
                    {comentario.archivos.map(archivo => (
                      <div className="comentario-archivo-item" key={archivo.id}>
                        {/* Icono según tipo de archivo */}
                        <div className="comentario-archivo-icon">
                          <i className={`fas ${archivo.tipo.includes('image') ? 'fa-file-image' : 
                                        archivo.tipo.includes('pdf') ? 'fa-file-pdf' : 
                                        archivo.tipo.includes('word') ? 'fa-file-word' : 
                                        archivo.tipo.includes('zip') ? 'fa-file-archive' : 'fa-file'}`}></i>
                        </div>
                        <div className="comentario-archivo-info">
                          <span className="comentario-archivo-nombre" title={archivo.nombre_original}>
                            {archivo.nombre_original.length > 20 ? 
                              archivo.nombre_original.substring(0, 17) + '...' : 
                              archivo.nombre_original}
                          </span>
                          <span className="comentario-archivo-size">
                            {(archivo.tamanio / 1024).toFixed(1)} KB
                          </span>
                          {/* Botón de descarga directamente junto a la información del archivo */}
                          <button 
                            className="comentario-archivo-descargar" 
                            onClick={() => handleDescargarArchivo(archivo.id)}
                          >
                            Descargar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
