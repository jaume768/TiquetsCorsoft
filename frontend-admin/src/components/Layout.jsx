import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../styles/components/Layout.css';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Actualizar estado de la barra lateral desde el componente Sidebar
  const updateSidebarState = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  };

  // Efecto para monitorear cambios de ruta
  useEffect(() => {
    // En dispositivos móviles, colapsar automáticamente la sidebar al cambiar de ruta
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
      document.body.classList.add('sidebar-collapsed');
    }
  }, [location.pathname]);

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar onToggle={updateSidebarState} isCollapsed={sidebarCollapsed} />
      <div className="main-content">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
