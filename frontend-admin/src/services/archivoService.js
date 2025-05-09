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
      // Usamos el cliente API configurado que ya maneja los tokens automáticamente
      const response = await api.get(`/archivos/archivos/${archivoId}`, {
        responseType: 'blob'
      });
      
      // Axios almacena la respuesta en la propiedad data
      return response.data;
    } catch (error) {
      console.error('Error en descargarArchivo:', error);
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
