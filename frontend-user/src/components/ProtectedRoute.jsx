import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { usuario, cargando } = useContext(AuthContext);
  
  // Mientras verifica el token, muestra un loader
  if (cargando) {
    return (
      <div className="protected-route-loader">
        <div className="loader-content">
          <div className="spinner-border spinner text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="loader-text">Verificando sesión...</p>
        </div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirige al login
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  
  // Si hay usuario, muestra el contenido protegido
  return children;
};

export default ProtectedRoute;
