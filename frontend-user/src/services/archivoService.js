import api from './api';

// Servicio para gestionar las operaciones relacionadas con archivos adjuntos de tickets
const archivoService = {
  // Obtener todos los archivos de un ticket
  getArchivosPorTicket: async (ticketId) => {
    const response = await api.get(`/archivos/tickets/${ticketId}/archivos`);
    return response.data;
  },
  
  // Descargar un archivo
  descargarArchivo: async (archivoId) => {
    try {
      const response = await api.get(`/archivos/archivos/${archivoId}`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Eliminar un archivo
  eliminarArchivo: async (archivoId) => {
    const response = await api.delete(`/archivos/archivos/${archivoId}`);
    return response.data;
  }
};

export default archivoService;
