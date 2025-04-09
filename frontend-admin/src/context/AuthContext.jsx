import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCargando(false);
        return;
      }
      
      try {
        const response = await api.get('/auth/verificar');
        
        // Verificar si el usuario es admin
        if (response.data.usuario.rol !== 'admin') {
          setError('No tienes permisos para acceder al panel de administración');
          localStorage.removeItem('token');
        } else {
          setUsuario(response.data.usuario);
          setError(null);
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('token');
      } finally {
        setCargando(false);
      }
    };
    
    verificarToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Verificar si el usuario es admin
      if (response.data.usuario.rol !== 'admin') {
        setError('No tienes permisos para acceder al panel de administración');
        return { 
          success: false, 
          message: 'No tienes permisos para acceder al panel de administración'
        };
      }
      
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

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const value = {
    usuario,
    cargando,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
