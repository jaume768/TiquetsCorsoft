import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      // Primero intentamos obtener los parámetros de la URL
      const params = new URLSearchParams(window.location.search);
      let codcli = params.get('codcli');
      let codigoSeguridad = params.get('codigoSeguridad') || params.get('codigo');
      // Nuevo parámetro Codw
      let Codw = params.get('Codw');
      
      // Guardar nombre de usuario de la URL si existe
      const nombreUsuarioParam = params.get('usuario');
      if (nombreUsuarioParam) {
        localStorage.setItem('nombreUsuario', nombreUsuarioParam);
      }

      // Si hay parámetros de auto-login en la URL, intentamos el proceso
      if ((codcli || Codw) && codigoSeguridad) {
        // Si falta el código de seguridad, redirigimos a la página 404
        if (!codigoSeguridad) {
          window.location.href = '/not-found';
          return;
        }

        // Guardamos los parámetros en localStorage
        if (codcli) localStorage.setItem('codcli', codcli);
        if (Codw) localStorage.setItem('Codw', Codw);
        localStorage.setItem('codigoSeguridad', codigoSeguridad);

        try {
          // Construir la URL de auto-login manteniendo el formato original para compatibilidad
          let autoLoginUrl;
          if (codcli) {
            // Formato original con codcli primero para máxima compatibilidad
            autoLoginUrl = `/auth/auto-login?codcli=${codcli}&codigoSeguridad=${codigoSeguridad}`;
            // Añadir Codw solo si existe
            if (Codw) autoLoginUrl += `&Codw=${Codw}`;
          } else {
            // Si no hay codcli, usar Codw como parámetro principal
            autoLoginUrl = `/auth/auto-login?codigoSeguridad=${codigoSeguridad}&Codw=${Codw}`;
          }
          
          const response = await api.get(autoLoginUrl);
          localStorage.setItem('token', response.data.token);
          setUsuario(response.data.usuario);
          localStorage.setItem('empresa', response.data.usuario.nombre);
          setError(null);
          setCargando(false);
          return;
        } catch (error) {
          console.error('Error en auto-login:', error);
          // En caso de cualquier error, redirigimos a la página 404 sin mostrar detalles
          localStorage.removeItem('codigoSeguridad');
          localStorage.removeItem('codcli');
          localStorage.removeItem('Codw');
          window.location.href = '/not-found';
          return;
        }
      }
      
      // Si no hay parámetros en la URL, intentamos recuperar del localStorage
      codcli = localStorage.getItem('codcli');
      Codw = localStorage.getItem('Codw');
      codigoSeguridad = localStorage.getItem('codigoSeguridad');
      
      if ((codcli || Codw) && codigoSeguridad) {
        try {
          // Construir la URL de auto-login manteniendo el formato original para compatibilidad
          let autoLoginUrl;
          if (codcli) {
            // Formato original con codcli primero para máxima compatibilidad
            autoLoginUrl = `/auth/auto-login?codcli=${codcli}&codigoSeguridad=${codigoSeguridad}`;
            // Añadir Codw solo si existe
            if (Codw) autoLoginUrl += `&Codw=${Codw}`;
          } else {
            // Si no hay codcli, usar Codw como parámetro principal
            autoLoginUrl = `/auth/auto-login?codigoSeguridad=${codigoSeguridad}&Codw=${Codw}`;
          }
          
          const response = await api.get(autoLoginUrl);
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
          localStorage.removeItem('Codw');
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
    localStorage.removeItem('Codw');
    localStorage.removeItem('nombreUsuario');
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
