import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAutenticado } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    codigoPrograma: '',
    codigoCliente: '',
    codigoUsuario: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigirlo a la página principal
    if (isAutenticado) {
      navigate('/mis-tiquets');
    }
  }, [isAutenticado, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al modificar un campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Limpiar error general al modificar cualquier campo
    if (submitError) setSubmitError(null);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.codigoPrograma.trim()) {
      newErrors.codigoPrograma = 'El código de programa es obligatorio';
    }
    
    if (!formData.codigoCliente.trim()) {
      newErrors.codigoCliente = 'El código de cliente es obligatorio';
    }
    
    if (!formData.codigoUsuario.trim()) {
      newErrors.codigoUsuario = 'El código de usuario es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Extraer solo los campos necesarios para el registro
      const { confirmPassword, ...registroData } = formData;
      
      await register(registroData);
      // Si el registro es exitoso, AuthContext actualizará isAutenticado y el useEffect redirigirá
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('Error al registrarse. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-content">
          <div className="register-header">
            <h1 className="register-title">Crear Cuenta</h1>
            <p className="register-subtitle">Complete el formulario para registrarse en el sistema de tickets</p>
          </div>
          
          <form className="register-form" onSubmit={handleSubmit}>
            {submitError && (
              <div className="register-error-alert">
                <span className="icon-alert">⚠️</span>
                <span>{submitError}</span>
              </div>
            )}
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo <span className="campo-requerido">*</span></label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Su nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email <span className="campo-requerido">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="nombre@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Contraseña <span className="campo-requerido">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña <span className="campo-requerido">*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Repita su contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigoPrograma">Código Programa <span className="campo-requerido">*</span></label>
                <input
                  type="text"
                  id="codigoPrograma"
                  name="codigoPrograma"
                  className={`form-control ${errors.codigoPrograma ? 'is-invalid' : ''}`}
                  placeholder="Ej: PROG001"
                  value={formData.codigoPrograma}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.codigoPrograma && <div className="invalid-feedback">{errors.codigoPrograma}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="codigoCliente">Código Cliente <span className="campo-requerido">*</span></label>
                <input
                  type="text"
                  id="codigoCliente"
                  name="codigoCliente"
                  className={`form-control ${errors.codigoCliente ? 'is-invalid' : ''}`}
                  placeholder="Ej: CLI123"
                  value={formData.codigoCliente}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.codigoCliente && <div className="invalid-feedback">{errors.codigoCliente}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="codigoUsuario">Código Usuario <span className="campo-requerido">*</span></label>
              <input
                type="text"
                id="codigoUsuario"
                name="codigoUsuario"
                className={`form-control ${errors.codigoUsuario ? 'is-invalid' : ''}`}
                placeholder="Ej: USR456"
                value={formData.codigoUsuario}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.codigoUsuario && <div className="invalid-feedback">{errors.codigoUsuario}</div>}
            </div>
            
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span className="loading-text">Registrando...</span>
                </>
              ) : (
                <>
                  <span className="register-icon">👤➕</span>
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </form>
          
          <div className="register-footer">
            <p>¿Ya tiene una cuenta? <Link to="/login" className="login-link">Inicie sesión aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
