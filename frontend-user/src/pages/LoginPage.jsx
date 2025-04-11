import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { generateSecurityCode } from '../utils/securityCode';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, usuario, isAutenticado } = useContext(AuthContext);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigirlo a la página principal
    if (isAutenticado) {
      navigate('/mis-tiquets');
    }
  }, [isAutenticado, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    
    // Limpiar mensaje de error al modificar campos
    if (error) setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Generar el código de seguridad
      const codigoSeguridad = generateSecurityCode();
      
      // Añadir el código de seguridad a las credenciales
      const credentialsWithCode = {
        ...credentials,
        codigoSeguridad
      };
      
      await login(credentialsWithCode);
      // Si login es exitoso, AuthContext actualizará isAutenticado y el useEffect redirigirá
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al iniciar sesión. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">Ingrese sus credenciales para acceder al sistema de tickets</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error-alert">
                <span className="icon-alert">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="nombre@empresa.com"
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-container">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Su contraseña"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span className="loading-text">Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span className="login-icon">➡️</span>
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p>¿No tiene una cuenta? <Link to="/registro" className="register-link">Regístrese aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
