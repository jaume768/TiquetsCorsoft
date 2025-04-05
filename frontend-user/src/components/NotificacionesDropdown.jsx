import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/NotificacionesDropdown.css';

// Este servicio debería implementarse para gestionar notificaciones
const notificacionesService = {
  getNotificaciones: async () => {
    // Simulación de datos para mostrar la estructura
    return {
      success: true,
      data: [
        {
          id: 1,
          tipo: 'comentario',
          mensaje: 'Nuevo comentario en tu ticket #123',
          tiquet_id: 123,
          leido: false,
          fecha: '2023-07-15T14:30:00Z',
          remitente: 'Soporte Técnico'
        },
        {
          id: 2,
          tipo: 'estado',
          mensaje: 'Tu ticket #145 ha sido marcado como "En proceso"',
          tiquet_id: 145,
          leido: true,
          fecha: '2023-07-14T09:15:00Z',
          remitente: 'Sistema'
        },
        {
          id: 3,
          tipo: 'comentario',
          mensaje: 'Nuevo comentario en tu ticket #123',
          tiquet_id: 123,
          leido: false,
          fecha: '2023-07-13T16:45:00Z',
          remitente: 'Soporte Técnico'
        }
      ]
    };
  },
  marcarComoLeida: async (id) => {
    return { success: true };
  },
  marcarTodasComoLeidas: async () => {
    return { success: true };
  }
};

const NotificacionesDropdown = () => {
  const { usuario } = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (usuario) {
      cargarNotificaciones();
    }
  }, [usuario]);

  useEffect(() => {
    // Cerrar el dropdown al hacer clic fuera de él
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cargarNotificaciones = async () => {
    try {
      setCargando(true);
      const response = await notificacionesService.getNotificaciones();
      setNotificaciones(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setCargando(false);
    }
  };

  const handleMarcarComoLeida = async (id, event) => {
    // Prevenir la propagación para que no active el enlace
    event.stopPropagation();
    
    try {
      await notificacionesService.marcarComoLeida(id);
      setNotificaciones(notificaciones.map(notif => 
        notif.id === id ? { ...notif, leido: true } : notif
      ));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const handleMarcarTodasComoLeidas = async () => {
    try {
      await notificacionesService.marcarTodasComoLeidas();
      setNotificaciones(notificaciones.map(notif => ({ ...notif, leido: true })));
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const notificacionesNoLeidas = notificaciones.filter(notif => !notif.leido).length;

  return (
    <div className="notificaciones-dropdown" ref={dropdownRef}>
      <button
        className="notificaciones-toggle"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="icon-bell">🔔</span>
        {notificacionesNoLeidas > 0 && (
          <span className="notificaciones-badge">{notificacionesNoLeidas}</span>
        )}
      </button>

      {isOpen && (
        <div className="notificaciones-menu">
          <div className="notificaciones-header">
            <h3 className="notificaciones-title">Notificaciones</h3>
            {notificacionesNoLeidas > 0 && (
              <button
                className="marcar-todas-btn"
                onClick={handleMarcarTodasComoLeidas}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notificaciones-content">
            {cargando ? (
              <div className="notificaciones-loading">
                <div className="loading-spinner-small"></div>
                <span>Cargando notificaciones...</span>
              </div>
            ) : error ? (
              <div className="notificaciones-error">{error}</div>
            ) : notificaciones.length === 0 ? (
              <div className="notificaciones-empty">
                <span className="icon-bell-slash">🔕</span>
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              <ul className="notificaciones-list">
                {notificaciones.map(notificacion => (
                  <li
                    key={notificacion.id}
                    className={`notificacion-item ${!notificacion.leido ? 'no-leido' : ''}`}
                  >
                    <Link
                      to={`/tiquet/${notificacion.tiquet_id}`}
                      className="notificacion-link"
                    >
                      <div className="notificacion-icon">
                        {notificacion.tipo === 'comentario' ? (
                          <span className="icon-comment">💬</span>
                        ) : notificacion.tipo === 'estado' ? (
                          <span className="icon-refresh">🔄</span>
                        ) : (
                          <span className="icon-info">ℹ️</span>
                        )}
                      </div>
                      <div className="notificacion-content">
                        <p className="notificacion-mensaje">{notificacion.mensaje}</p>
                        <div className="notificacion-meta">
                          <span className="notificacion-remitente">{notificacion.remitente}</span>
                          <span className="notificacion-tiempo">
                            {new Date(notificacion.fecha).toLocaleString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      {!notificacion.leido && (
                        <button
                          className="marcar-leida-btn"
                          onClick={(e) => handleMarcarComoLeida(notificacion.id, e)}
                          title="Marcar como leída"
                        >
                          <span className="icon-check">✅</span>
                        </button>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="notificaciones-footer">
            <Link to="/notificaciones" className="ver-todas-link">
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesDropdown;
