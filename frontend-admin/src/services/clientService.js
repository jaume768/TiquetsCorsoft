import api from './api';

// Función para sincronizar clientes
export const syncClients = async () => {
  return api.post('/clients/sync');
};
