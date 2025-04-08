import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/components/Sidebar.css';
import '../styles/components/icons.css';

const Sidebar = ({ onToggle, isCollapsed }) => {
  const { logout, usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    onToggle && onToggle(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed ? (
            <>
              <i className="icon icon-headset"></i>
              <span>Corsoft Tickets</span>
            </>
          ) : (
            <i className="icon icon-headset"></i>
          )}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`icon icon-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>
      
      <div className="sidebar-user">
        {!isCollapsed && (
          <>
            <div className="user-avatar">
              <span>{usuario?.nombre?.charAt(0) || 'A'}</span>
            </div>
            <div className="user-info">
              <div className="user-name-sidebar">{usuario?.nombre || 'Admin'}</div>
              <div className="user-role">Administrador</div>
            </div>
          </>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <NavLink to="/dashboard" className={({isActive}) => `sidebar-menu-link ${isActive ? 'active' : ''}`}>
              <i className="icon icon-dashboard sidebar-menu-icon"></i>
              {!isCollapsed && <span className="sidebar-menu-text">Dashboard</span>}
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink to="/tiquets" className={({isActive}) => `sidebar-menu-link ${isActive ? 'active' : ''}`}>
              <i className="icon icon-tickets sidebar-menu-icon"></i>
              {!isCollapsed && <span className="sidebar-menu-text">Tickets</span>}
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink to="/usuarios" className={({isActive}) => `sidebar-menu-link ${isActive ? 'active' : ''}`}>
              <i className="icon icon-users sidebar-menu-icon"></i>
              {!isCollapsed && <span className="sidebar-menu-text">Usuarios</span>}
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink to="/login-registros" className={({isActive}) => `sidebar-menu-link ${isActive ? 'active' : ''}`}>
              <i className="icon icon-loading sidebar-menu-icon"></i>
              {!isCollapsed && <span className="sidebar-menu-text">Registros Login</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <i className="icon icon-logout sidebar-menu-icon"></i>
          {!isCollapsed && <span className="sidebar-menu-text">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
