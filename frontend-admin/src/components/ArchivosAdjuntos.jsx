import React, { useState } from 'react';
import archivoService from '../services/archivoService';
import { showSuccess, showError } from './Notification';

const ArchivosAdjuntos = ({ archivos, ticketId, onEliminar, refrescarArchivos }) => {
  const [cargando, setCargando] = useState(false);
  const [archivosCargando, setArchivosCargando] = useState({});

  // Si no hay archivos, mostrar mensaje
  if (!archivos || archivos.length === 0) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">Archivos adjuntos</h5>
        </div>
        <div className="card-body text-center text-muted py-4">
          <i className="fas fa-file fa-2x mb-3"></i>
          <p>No hay archivos adjuntos para este ticket</p>
        </div>
      </div>
    );
  }

  // Función para descargar un archivo
  const handleDescargar = async (archivo) => {
    try {
      setArchivosCargando(prev => ({ ...prev, [archivo.id]: true }));
      const blob = await archivoService.descargarArchivo(archivo.id);
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archivo.nombre_original);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess('Archivo descargado correctamente');
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      showError('Error al descargar el archivo');
    } finally {
      setArchivosCargando(prev => ({ ...prev, [archivo.id]: false }));
    }
  };

  // Función para eliminar un archivo
  const handleEliminar = async (archivoId) => {
    if (!window.confirm('¿Está seguro de eliminar este archivo? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setCargando(true);
      await archivoService.eliminarArchivo(archivoId);
      showSuccess('Archivo eliminado correctamente');
      
      // Llamar al callback para actualizar la lista de archivos
      if (onEliminar) {
        onEliminar(archivoId);
      } else if (refrescarArchivos) {
        refrescarArchivos();
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      showError('Error al eliminar el archivo');
    } finally {
      setCargando(false);
    }
  };

  // Función para determinar el icono según el tipo de archivo
  const getIcono = (tipo) => {
    if (tipo.startsWith('image/')) {
      return <i className="fas fa-file-image"></i>;
    } else if (tipo === 'application/pdf') {
      return <i className="fas fa-file-pdf"></i>;
    } else if (tipo.includes('word')) {
      return <i className="fas fa-file-word"></i>;
    } else if (tipo === 'text/plain') {
      return <i className="fas fa-file-alt"></i>;
    } else if (tipo.includes('zip')) {
      return <i className="fas fa-file-archive"></i>;
    } else {
      return <i className="fas fa-file"></i>;
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="card-title mb-0">Archivos adjuntos ({archivos.length})</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Tamaño</th>
                <th>Fecha</th>
                <th style={{ width: '100px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {archivos.map((archivo) => (
                <tr key={archivo.id}>
                  <td className="align-middle">
                    <span className="text-primary">
                      {getIcono(archivo.tipo)}
                    </span>
                  </td>
                  <td className="align-middle">
                    {archivo.nombre_original.length > 30 
                      ? archivo.nombre_original.slice(0, 27) + '...' 
                      : archivo.nombre_original}
                  </td>
                  <td className="align-middle">
                    <span className="badge bg-light text-dark">
                      {archivo.tipo.split('/')[1].toUpperCase()}
                    </span>
                  </td>
                  <td className="align-middle">{formatFileSize(archivo.tamanio)}</td>
                  <td className="align-middle">{new Date(archivo.fecha_subida).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                  <td className="align-middle">
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleDescargar(archivo)}
                        disabled={archivosCargando[archivo.id]}
                      >
                        {archivosCargando[archivo.id] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="fas fa-download"></i>
                        )}
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleEliminar(archivo.id)}
                        disabled={cargando}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArchivosAdjuntos;
