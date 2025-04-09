import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      // Primero intentamos obtener el código de cliente de la URL
      const params = new URLSearchParams(window.location.search);
      let codcli = params.get('codcli');

      // Si no hay código de cliente en la URL, intentamos obtenerlo del localStorage
      if (!codcli) {
        codcli = localStorage.getItem('codcli');
      } else {
        // Si el código de cliente está en la URL, lo guardamos en localStorage
        localStorage.setItem('codcli', codcli);
      }

      // Si tenemos el código de cliente (ya sea de URL o localStorage), intentamos el auto-login
      if (codcli) {
        try {
          const response = await api.get(`/auth/auto-login?codcli=${codcli}`);
          localStorage.setItem('token', response.data.token);
          setUsuario(response.data.usuario);
          setError(null);
          setCargando(false);
          return;
        } catch (error) {
          console.error('Error en auto-login:', error);
          setError(error.response?.data?.message || 'Error en auto-login');
          // Si falla el auto-login, limpiamos el código de cliente guardado
          localStorage.removeItem('codcli');
        }
      }

      // Si no hay parámetros o falló el auto-login, verificamos el token existente
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCargando(false);
        return;
      }
      
      try {
        const response = await api.get('/auth/verificar');
        setUsuario(response.data.usuario);
        setError(null);
      } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('token');
      } finally {
        setCargando(false);
      }
    };
    
    verificarAutenticacion();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUsuario(response.data.usuario);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Error de login:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  const registro = async (datosUsuario) => {
    try {
      const response = await api.post('/auth/registro', datosUsuario);
      localStorage.setItem('token', response.data.token);
      setUsuario(response.data.usuario);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Error de registro:', error);
      setError(error.response?.data?.message || 'Error al registrarse');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrarse'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('codcli');
    setUsuario(null);
  };

  const value = {
    usuario,
    cargando,
    error,
    login,
    registro,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
