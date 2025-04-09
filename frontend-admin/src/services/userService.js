import api from './api';

const userService = {
  // Obtener usuarios con paginación y filtros
  getUsuarios: async (filtros = {}) => {
    const { busqueda, rol, pagina = 1, limite = 10 } = filtros;
    
    const params = new URLSearchParams();
    if (busqueda) params.append('busqueda', busqueda);
    if (rol) params.append('rol', rol);
    if (pagina) params.append('pagina', pagina);
    if (limite) params.append('limite', limite);
    
    try {
      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  
  // Obtener un usuario por su ID
  getUsuarioPorId: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },
  
  // Crear un nuevo usuario
  crearUsuario: async (usuario) => {
    try {
      const response = await api.post('/users', usuario);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  
  // Actualizar un usuario existente
  actualizarUsuario: async (id, usuario) => {
    try {
      const response = await api.put(`/users/${id}`, usuario);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },
  
  // Eliminar un usuario
  eliminarUsuario: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },
};

export default userService;
