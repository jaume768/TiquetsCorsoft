import React, { createContext, useContext, useState } from 'react';
import '../styles/Notification.css';

// Crear el contexto
const NotificationContext = createContext();

// Hook personalizado para usar el contexto
export const useNotification = () => useContext(NotificationContext);

// Componente proveedor
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  // Mostrar una notificación
  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    
    // Auto-cerrar después de la duración especificada
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  // Cerrar la notificación manualmente
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, closeNotification }}>
      {children}
      
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close" onClick={closeNotification}>
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
