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
      let codigoSeguridad = params.get('codigoSeguridad') || params.get('codigo'); // Aceptamos ambos formatos

      // Si hay parámetros de auto-login en la URL, intentamos el proceso
      if (codcli || codigoSeguridad) {
        // Si falta algún parámetro necesario, redirigimos a la página 404
        if (!codcli || !codigoSeguridad) {
          window.location.href = '/not-found';
          return;
        }

        // Guardamos los parámetros en localStorage
        localStorage.setItem('codcli', codcli);
        localStorage.setItem('codigoSeguridad', codigoSeguridad);

        try {
          const response = await api.get(`/auth/auto-login?codcli=${codcli}&codigoSeguridad=${codigoSeguridad}`);
          localStorage.setItem('token', response.data.token);
          setUsuario(response.data.usuario);
          setError(null);
          setCargando(false);
          return;
        } catch (error) {
          console.error('Error en auto-login:', error);
          // En caso de cualquier error, redirigimos a la página 404 sin mostrar detalles
          localStorage.removeItem('codigoSeguridad');
          localStorage.removeItem('codcli');
          window.location.href = '/not-found';
          return;
        }
      }
      
      // Si no hay parámetros en la URL, intentamos recuperar del localStorage
      codcli = localStorage.getItem('codcli');
      codigoSeguridad = localStorage.getItem('codigoSeguridad');
      
      if (codcli && codigoSeguridad) {
        try {
          const response = await api.get(`/auth/auto-login?codcli=${codcli}&codigoSeguridad=${codigoSeguridad}`);
          localStorage.setItem('token', response.data.token);
          setUsuario(response.data.usuario);
          setError(null);
          setCargando(false);
          return;
        } catch (error) {
          console.error('Error en auto-login desde localStorage:', error);
          // Limpiamos los códigos guardados
          localStorage.removeItem('codigoSeguridad');
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

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
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
