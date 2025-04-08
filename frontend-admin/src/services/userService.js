import api from './api';

const userService = {
  getUsuarios: async (filtros = {}) => {
    const { busqueda, rol, pagina, limite } = filtros;
    
    const params = new URLSearchParams();
    if (busqueda) params.append('busqueda', busqueda);
    if (rol) params.append('rol', rol);
    if (pagina) params.append('pagina', pagina);
    if (limite) params.append('limite', limite);
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },
  
  getUsuarioPorId: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  crearUsuario: async (usuario) => {
    const response = await api.post('/users', usuario);
    return response.data;
  },
  
  actualizarUsuario: async (id, usuario) => {
    const response = await api.put(`/users/${id}`, usuario);
    return response.data;
  },
  
  eliminarUsuario: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default userService;
