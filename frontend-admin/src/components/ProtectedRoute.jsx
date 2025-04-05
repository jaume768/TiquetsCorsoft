import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { usuario, cargando, error } = useContext(AuthContext);
  
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
  
  // Si hay error de permisos, muestra mensaje
  if (error) {
    return (
      <div className="protected-route-loader">
        <div className="access-denied">
          <h4 className="access-denied-heading">¡Acceso denegado!</h4>
          <p className="access-denied-message">{error}</p>
          <button 
            className="btn btn-primary access-denied-button"
            onClick={() => window.location.href = '/login'}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado o no es admin, redirige al login
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  
  // Si es admin, muestra el contenido protegido
  return children;
};

export default ProtectedRoute;
