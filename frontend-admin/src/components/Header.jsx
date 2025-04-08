import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/components/Header.css';
import '../styles/components/icons.css';

const Header = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="page-title">
        <h1>Panel de Administración</h1>
      </div>
      
      <div className="header-actions">
        <div className="notifications">
          <button className="notification-button">
            <i className="icon icon-bell"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        <div className="user-dropdown">
          <button className="user-dropdown-toggle">
            <div className="user-avatar">
              <span>{usuario?.nombre?.charAt(0) || 'A'}</span>
            </div>
            <div className="user-info">
              <span className="user-name">{usuario?.nombre || 'Admin'}</span>
              <i className="icon icon-chevron-right icon-sm"></i>
            </div>
          </button>
          
          <div className="user-dropdown-menu">
            <div className="user-dropdown-header">
              <div className="user-avatar">
                <span>{usuario?.nombre?.charAt(0) || 'A'}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{usuario?.nombre || 'Admin'}</span>
                <span className="user-email">{usuario?.email || 'admin@corsoft.com'}</span>
              </div>
            </div>
            
            <div className="user-dropdown-body">
              <a href="#" className="user-dropdown-item">
                <i className="icon icon-person"></i>
                <span>Mi Perfil</span>
              </a>
              <a href="#" className="user-dropdown-item">
                <i className="icon icon-gear"></i>
                <span>Configuración</span>
              </a>
              <button className="user-dropdown-item logout" onClick={handleLogout}>
                <i className="icon icon-logout"></i>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
