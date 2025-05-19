import React, { useState, useEffect, useRef } from 'react';
import ticketService from '../services/ticketService';
import archivoService from '../services/archivoService';
import '../styles/ComentariosSection.css';

const ComentariosSection = ({ tiquetId, usuario }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [previewArchivos, setPreviewArchivos] = useState([]);
  const [enviarEmail, setEnviarEmail] = useState(false);
  const fileInputRef = useRef(null);

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

  // Manejar selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setArchivosSeleccionados(files);
    
    // Crear previsualizaciones
    const previews = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setPreviewArchivos(previews);
  };
  
  // Eliminar un archivo seleccionado
  const handleRemoveFile = (index) => {
    const newFiles = [...archivosSeleccionados];
    newFiles.splice(index, 1);
    setArchivosSeleccionados(newFiles);
    
    const newPreviews = [...previewArchivos];
    // Revocar URL para liberar memoria
    if (newPreviews[index].preview) {
      URL.revokeObjectURL(newPreviews[index].preview);
    }
    newPreviews.splice(index, 1);
    setPreviewArchivos(newPreviews);
  };

  // Resetear los archivos seleccionados
  const resetFiles = () => {
    // Revocar todas las URLs para liberar memoria
    previewArchivos.forEach(preview => {
      if (preview.preview) {
        URL.revokeObjectURL(preview.preview);
      }
    });
    
    setArchivosSeleccionados([]);
    setPreviewArchivos([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Enviar nuevo comentario
  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.trim()) {
      return;
    }
    
    try {
      setCargando(true);
      await ticketService.agregarComentario(tiquetId, nuevoComentario, archivosSeleccionados, enviarEmail);
      setNuevoComentario('');
      resetFiles();
      setEnviarEmail(false); // Resetear el checkbox despues de enviar
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
                
                {/* Mostrar archivos adjuntos del comentario si existen */}
                {comentario.archivos && comentario.archivos.length > 0 && (
                  <div className="comentario-archivos">
                    <h6 className="comentario-archivos-titulo">
                      <i className="fas fa-paperclip"></i> Archivos adjuntos ({comentario.archivos.length})
                    </h6>
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
                          </div>
                          <div className="comentario-archivo-acciones">
                            <button 
                              className="comentario-archivo-btn" 
                              onClick={() => window.open(`/api/archivos/archivos/${archivo.id}`, '_blank')}
                              title="Descargar archivo"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {puedeEliminarComentario() && (
                  <div className="comentario-actions">
                    <button 
                      className="comentario-btn-delete" 
                      onClick={() => handleEliminarComentario(comentario.id)}
                      disabled={cargando}
                    >
                      <span className="icon-trash"></span> Eliminar
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
          
          {/* Sección de archivos adjuntos */}
          <div className="comentarios-form-archivos">
            <label className="comentarios-form-archivos-label">
              <i className="fas fa-paperclip"></i> Adjuntar archivos
              <input
                type="file"
                multiple
                className="comentarios-form-archivos-input"
                onChange={handleFileChange}
                disabled={cargando}
                ref={fileInputRef}
              />
            </label>
            
            {previewArchivos.length > 0 && (
              <div className="comentarios-form-archivos-preview">
                <h6>Archivos seleccionados:</h6>
                <div className="archivos-preview-list">
                  {previewArchivos.map((file, index) => (
                    <div className="archivo-preview-item" key={index}>
                      {file.preview ? (
                        <div className="archivo-preview-image">
                          <img src={file.preview} alt={file.name} />
                        </div>
                      ) : (
                        <div className="archivo-preview-icon">
                          <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf' : 
                                         file.type.includes('word') ? 'fa-file-word' : 
                                         file.type.includes('zip') ? 'fa-file-archive' : 'fa-file'}`}></i>
                        </div>
                      )}
                      <div className="archivo-preview-info">
                        <span className="archivo-preview-nombre">{file.name}</span>
                        <span className="archivo-preview-size">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button 
                        type="button" 
                        className="archivo-preview-remove"
                        onClick={() => handleRemoveFile(index)}
                        disabled={cargando}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="comentarios-form-options">
            <div className="comentarios-form-send-email">
              <input
                type="checkbox"
                id="enviar-email"
                checked={enviarEmail}
                onChange={(e) => setEnviarEmail(e.target.checked)}
                disabled={cargando}
              />
              <label htmlFor="enviar-email">Enviar notificación por email al cliente</label>
            </div>
          </div>
          
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
              <>
                Enviar comentario 
                {archivosSeleccionados.length > 0 && `(${archivosSeleccionados.length} archivos adjuntos)`}
                {enviarEmail && ` + notificación por email`}
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ComentariosSection;
