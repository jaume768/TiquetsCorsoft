import api from './api';

const ticketService = {
  getTodosTiquets: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
    if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    
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
  
  // Añadir comentario a un tiquet
  agregarComentario: async (tiquetId, texto) => {
    const response = await api.post(`/tickets/${tiquetId}/comentarios`, { texto });
    return response.data;
  },
  
  // Eliminar un comentario
  eliminarComentario: async (tiquetId, comentarioId) => {
    const response = await api.delete(`/tickets/${tiquetId}/comentarios/${comentarioId}`);
    return response.data;
  }
};

export default ticketService;
