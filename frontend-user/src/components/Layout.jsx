import React, { useContext, useEffect } from 'react';
import ThemeContext from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  
  // Usar useEffect para aplicar la clase directamente al elemento body
  // para garantizar que los estilos se apliquen globalmente
  useEffect(() => {
    if (theme === 'webcar') {
      document.body.classList.add('webcar-theme');
    } else {
      document.body.classList.remove('webcar-theme');
    }
    
    // Limpieza al desmontar
    return () => {
      document.body.classList.remove('webcar-theme');
    };
  }, [theme]);
  
  return (
    <div className="app-container">
      {children}
    </div>
  );
};

export default Layout;
