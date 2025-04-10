import React, { useState } from 'react';
import { showSuccess, showError } from './Notification';
import archivoService from '../services/archivoService';
import '../styles/ArchivosAdjuntos.css';

// Componente para mostrar y gestionar los archivos adjuntos de un ticket
const ArchivosAdjuntos = ({ archivos, ticketId, onEliminar, esAdministrador = false }) => {
  const [cargando, setCargando] = useState(false);

  // Si no hay archivos, mostrar mensaje
  if (!archivos || archivos.length === 0) {
    return (
      <div className="archivos-adjuntos-container">
        <h3 className="archivos-title">Archivos adjuntos</h3>
        <p className="no-archivos">No hay archivos adjuntos para este ticket</p>
      </div>
    );
  }

  // Función para descargar un archivo
  const handleDescargar = async (archivo) => {
    try {
      setCargando(true);
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
      setCargando(false);
    }
  };

  // Función para eliminar un archivo (solo admin o propietario)
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

  return (
    <div className="archivos-adjuntos-container">
      <h3 className="archivos-title">Archivos adjuntos ({archivos.length})</h3>
      <div className="archivos-lista">
        {archivos.map((archivo) => (
          <div className="archivo-item" key={archivo.id}>
            <div className="archivo-icon">
              {getIcono(archivo.tipo)}
            </div>
            <div className="archivo-info">
              <span className="archivo-nombre" title={archivo.nombre_original}>
                {archivo.nombre_original.length > 25 
                  ? archivo.nombre_original.substring(0, 22) + '...' 
                  : archivo.nombre_original}
              </span>
              <span className="archivo-tipo">
                {archivo.tipo.split('/')[1]}
              </span>
              <span className="archivo-tamanio">
                {(archivo.tamanio / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="archivo-acciones">
              <button 
                className="btn-descargar"
                onClick={() => handleDescargar(archivo)}
                disabled={cargando}
              >
                <i className="fas fa-download"></i>
              </button>
              
              {esAdministrador && (
                <button 
                  className="btn-eliminar"
                  onClick={() => handleEliminar(archivo.id)}
                  disabled={cargando}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivosAdjuntos;
