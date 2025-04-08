import api from './api';

const loginRegistroService = {
  getLoginRegistros: async (filtros = {}) => {
    const { usuario_id, fecha_inicio, fecha_fin, pagina = 1, limite = 10 } = filtros;
    
    const params = new URLSearchParams();
    if (usuario_id) params.append('usuario_id', usuario_id);
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    params.append('pagina', pagina);
    params.append('limite', limite);
    
    const response = await api.get(`/login-registros?${params.toString()}`);
    return response.data;
  },
  
  getLoginEstadisticas: async () => {
    const response = await api.get('/login-registros/estadisticas');
    return response.data;
  }
};

export default loginRegistroService;
