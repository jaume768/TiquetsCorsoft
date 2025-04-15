import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, CircularProgress, Container } from '@mui/material';
import axios from 'axios';
import { syncClients } from '../services/clientService';

const ClientsPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSyncClients = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await syncClients();
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al sincronizar clientes');
      console.error('Error al sincronizar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Gestión de Clientes
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sincronización de Clientes
          </Typography>
          <Typography variant="body1" paragraph>
            Esta funcionalidad permite sincronizar los clientes desde el sistema externo. 
            Los nuevos clientes serán añadidos y los existentes actualizados.
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSyncClients}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sincronizar Clientes'}
          </Button>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {result && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Sincronización completada con éxito
              </Alert>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Resultados:
                </Typography>
                <Typography>
                  - Clientes actualizados: {result.stats.updated}
                </Typography>
                <Typography>
                  - Clientes nuevos: {result.stats.created}
                </Typography>
                <Typography>
                  - Errores: {result.stats.errors}
                </Typography>
              </Box>
              
              {result.newClients.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    Nuevos clientes:
                  </Typography>
                  {result.newClients.slice(0, 10).map((client, index) => (
                    <Typography key={index} variant="body2">
                      {client.codcli} - {client.nombre}
                    </Typography>
                  ))}
                  {result.newClients.length > 10 && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      ...y {result.newClients.length - 10} más
                    </Typography>
                  )}
                </Box>
              )}
              
              {result.errors.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" color="error">
                    Errores:
                  </Typography>
                  {result.errors.slice(0, 5).map((err, index) => (
                    <Typography key={index} variant="body2" color="error">
                      {err}
                    </Typography>
                  ))}
                  {result.errors.length > 5 && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      ...y {result.errors.length - 5} más
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ClientsPage;
