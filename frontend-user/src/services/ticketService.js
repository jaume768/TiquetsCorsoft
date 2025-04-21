import api from './api';

// Servicio para gestionar las operaciones relacionadas con tiquets
const ticketService = {
  // Obtener todos los tiquets del usuario
  getMisTiquets: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    
    const response = await api.get(`/tickets/mis-tiquets?${params.toString()}`);
    return response.data;
  },
  
  // Obtener un tiquet específico por ID
  getTiquetPorId: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  
  // Crear un nuevo tiquet
  crearTiquet: async (tiquet) => {
    // Comprobamos si tiquet ya es un FormData
    let formData;
    if (tiquet instanceof FormData) {
      formData = tiquet;
    } else {
      // Si no es FormData, lo creamos
      formData = new FormData();
      formData.append('titulo', tiquet.titulo);
      formData.append('descripcion', tiquet.descripcion);
      
      if (tiquet.prioridad) {
        formData.append('prioridad', tiquet.prioridad);
      }
      
      if (tiquet.imagen) {
        formData.append('imagen', tiquet.imagen);
      }
    }
    
    // Incluir nombre de usuario desde localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
      formData.append('nombreUsuario', nombreUsuario);
    }
    
    const response = await api.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
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
