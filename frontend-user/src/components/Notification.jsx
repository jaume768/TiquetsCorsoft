import React, { useState, useEffect } from 'react';
import '../styles/Notification.css';

// Sistema de notificaciones global
const notificaciones = [];
let setNotificacionesFunction = null;

// Exportar funciones para usar en otros componentes
export const showNotification = (mensaje, tipo = 'info', duracion = 3000) => {
  const id = Date.now();
  const nuevaNotificacion = { id, mensaje, tipo, duracion };
  
  notificaciones.push(nuevaNotificacion);
  
  if (setNotificacionesFunction) {
    setNotificacionesFunction([...notificaciones]);
  }
  
  // Eliminar automáticamente después de la duración
  setTimeout(() => {
    removeNotification(id);
  }, duracion);
  
  return id;
};

export const removeNotification = (id) => {
  const index = notificaciones.findIndex(notif => notif.id === id);
  if (index !== -1) {
    notificaciones.splice(index, 1);
    
    if (setNotificacionesFunction) {
      setNotificacionesFunction([...notificaciones]);
    }
  }
};

// Funciones de ayuda para diferentes tipos
export const showSuccess = (mensaje, duracion) => showNotification(mensaje, 'success', duracion);
export const showError = (mensaje, duracion) => showNotification(mensaje, 'error', duracion);
export const showWarning = (mensaje, duracion) => showNotification(mensaje, 'warning', duracion);
export const showInfo = (mensaje, duracion) => showNotification(mensaje, 'info', duracion);

// Componente para mostrar notificaciones
const NotificationContainer = () => {
  const [notificacionesActivas, setNotificacionesActivas] = useState([]);
  
  useEffect(() => {
    setNotificacionesFunction = setNotificacionesActivas;
    return () => {
      setNotificacionesFunction = null;
    };
  }, []);
  
  if (notificacionesActivas.length === 0) {
    return null;
  }
  
  return (
    <div className="notification-container">
      {notificacionesActivas.map(notif => (
        <div
          key={notif.id}
          className={`notification notification-${notif.tipo}`}
          onClick={() => removeNotification(notif.id)}
        >
          <div className="notification-content">
            {notif.tipo === 'success' && <span className="notification-icon">✅</span>}
            {notif.tipo === 'error' && <span className="notification-icon">❌</span>}
            {notif.tipo === 'warning' && <span className="notification-icon">⚠️</span>}
            {notif.tipo === 'info' && <span className="notification-icon">ℹ️</span>}
            <span className="notification-message">{notif.mensaje}</span>
          </div>
          <button className="notification-close">×</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
