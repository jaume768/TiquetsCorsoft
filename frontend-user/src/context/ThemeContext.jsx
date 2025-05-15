import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default');
  
  useEffect(() => {
    // Verificar el parámetro Vista en la URL
    const checkThemeFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const vista = params.get('Vista');
      
      if (vista === 'w') {
        setTheme('webcar');
        // Guardar en localStorage para mantener el tema durante la navegación
        localStorage.setItem('appTheme', 'webcar');
      } else {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme('default');
          localStorage.setItem('appTheme', 'default');
        }
      }
    };
    
    checkThemeFromUrl();
    
    // Listener para cambios en la URL
    const handleUrlChange = () => {
      checkThemeFromUrl();
    };
    
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);
  
  // Función para cambiar el tema manualmente si es necesario
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
