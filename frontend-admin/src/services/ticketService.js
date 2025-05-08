import api from './api';

const ticketService = {
  getTodosTiquets: async (filtros = {}) => {
    const { estado, prioridad, usuario_id, busqueda, pagina = 1, limite = 10 } = filtros;
    
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (prioridad) params.append('prioridad', prioridad);
    if (usuario_id) params.append('usuario_id', usuario_id);
    if (busqueda) params.append('busqueda', busqueda);
    params.append('pagina', pagina);
    params.append('limite', limite);
    
    const response = await api.get(`/tickets?${params.toString()}`);
    return response.data;
  },

  getTiquetPorId: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  
  // Actualizar un tiquet (solo admin)
  actualizarTiquet: async (id, datos) => {
    const response = await api.put(`/tickets/${id}`, datos);
    return response.data;
  },
  
  // Eliminar un tiquet (solo admin)
  eliminarTiquet: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
  
  // Obtener comentarios de un tiquet
  getComentarios: async (tiquetId) => {
    const response = await api.get(`/tickets/${tiquetId}/comentarios`);
    return response.data;
  },
  
  // Añadir comentario a un tiquet con archivos adjuntos opcionales
  agregarComentario: async (tiquetId, texto, archivos = null) => {
    let formData = null;
    
    // Si hay archivos adjuntos, usamos FormData
    if (archivos && archivos.length > 0) {
      formData = new FormData();
      formData.append('texto', texto);
      
      // Agregar cada archivo al FormData
      Array.from(archivos).forEach(archivo => {
        formData.append('archivos', archivo);
      });
      
      const response = await api.post(`/tickets/${tiquetId}/comentarios`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      // Si no hay archivos, usamos el método regular
      const response = await api.post(`/tickets/${tiquetId}/comentarios`, { texto });
      return response.data;
    }
  },
  
  // Eliminar un comentario
  eliminarComentario: async (tiquetId, comentarioId) => {
    const response = await api.delete(`/tickets/${tiquetId}/comentarios/${comentarioId}`);
    return response.data;
  }
};

export default ticketService;
