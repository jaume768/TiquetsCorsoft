import React, { useState, useEffect } from 'react';
import '../styles/UsuariosPage.css';

// Este servicio debería ser implementado para gestionar usuarios
const userService = {
  getUsuarios: async () => {
    // Simulación de datos para mostrar la estructura
    return {
      success: true,
      data: [
        { 
          id: 1, 
          nombre: 'Administrador', 
          email: 'admin@example.com', 
          rol: 'admin',
          codigoPrograma: null,
          codigoCliente: null,
          codigoUsuario: null,
          fecha_creacion: '2025-01-01T00:00:00.000Z'
        },
        { 
          id: 2, 
          nombre: 'Juan Pérez', 
          email: 'juan@example.com', 
          rol: 'usuario',
          codigoPrograma: 'PROG001',
          codigoCliente: 'CLI123',
          codigoUsuario: 'USR456',
          fecha_creacion: '2025-01-15T00:00:00.000Z'
        },
        { 
          id: 3, 
          nombre: 'María López', 
          email: 'maria@example.com', 
          rol: 'usuario',
          codigoPrograma: 'PROG002',
          codigoCliente: 'CLI456',
          codigoUsuario: 'USR789',
          fecha_creacion: '2025-02-01T00:00:00.000Z'
        }
      ]
    };
  }
};

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsuarios();
      setUsuarios(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('No se pudieron cargar los usuarios. Por favor, intente nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const abrirModal = (usuario = null) => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
  };

  // Filtrar usuarios basados en la búsqueda
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    (usuario.codigoUsuario && usuario.codigoUsuario.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="usuarios-page-container">
      <header className="usuarios-header">
        <h1 className="usuarios-title">Gestión de Usuarios</h1>
        <button 
          className="btn-nuevo-usuario"
          onClick={() => abrirModal()}
        >
          <i className="bi bi-person-plus-fill"></i> Nuevo Usuario
        </button>
      </header>
      
      <div className="usuarios-search-container">
        <div className="search-input-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar usuarios..."
            value={busqueda}
            onChange={handleBusquedaChange}
          />
          {busqueda && (
            <button 
              className="clear-search-btn"
              onClick={() => setBusqueda('')}
              title="Limpiar búsqueda"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="usuarios-error">
          {error}
        </div>
      )}
      
      <div className="usuarios-content">
        {loading ? (
          <div className="usuarios-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="no-usuarios">
            <i className="bi bi-people"></i>
            <p>No se encontraron usuarios{busqueda ? ' que coincidan con la búsqueda' : ''}</p>
            {busqueda && (
              <button 
                className="btn-reset-search"
                onClick={() => setBusqueda('')}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="usuarios-table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Código Usuario</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td className="usuario-id">{usuario.id}</td>
                    <td className="usuario-nombre">{usuario.nombre}</td>
                    <td className="usuario-email">{usuario.email}</td>
                    <td className="usuario-rol">
                      <span className={`rol-badge ${usuario.rol === 'admin' ? 'rol-admin' : 'rol-usuario'}`}>
                        {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td className="usuario-codigo">{usuario.codigoUsuario || '-'}</td>
                    <td className="usuario-fecha">
                      {new Date(usuario.fecha_creacion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="usuario-acciones">
                      <button 
                        className="btn-editar-usuario"
                        onClick={() => abrirModal(usuario)}
                        title="Editar usuario"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button 
                        className="btn-ver-usuario"
                        onClick={() => console.log('Ver detalles de', usuario.nombre)}
                        title="Ver detalles"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      <button 
                        className="btn-eliminar-usuario"
                        onClick={() => console.log('Eliminar', usuario.nombre)}
                        title="Eliminar usuario"
                        disabled={usuario.rol === 'admin'}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal para crear/editar usuario */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button 
                className="modal-close-btn"
                onClick={cerrarModal}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <form className="usuario-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    className="form-control"
                    defaultValue={usuarioSeleccionado?.nombre || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-control"
                    defaultValue={usuarioSeleccionado?.email || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rol">Rol</label>
                  <select 
                    id="rol" 
                    className="form-control"
                    defaultValue={usuarioSeleccionado?.rol || 'usuario'}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="codigoPrograma">Código Programa</label>
                  <input 
                    type="text" 
                    id="codigoPrograma" 
                    className="form-control"
                    defaultValue={usuarioSeleccionado?.codigoPrograma || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="codigoCliente">Código Cliente</label>
                  <input 
                    type="text" 
                    id="codigoCliente" 
                    className="form-control"
                    defaultValue={usuarioSeleccionado?.codigoCliente || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="codigoUsuario">Código Usuario</label>
                  <input 
                    type="text" 
                    id="codigoUsuario" 
                    className="form-control"
                    defaultValue={usuarioSeleccionado?.codigoUsuario || ''}
                  />
                </div>
                {!usuarioSeleccionado && (
                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input 
                      type="password" 
                      id="password" 
                      className="form-control"
                    />
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancelar"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar"
                onClick={() => {
                  console.log('Guardar usuario');
                  cerrarModal();
                }}
              >
                {usuarioSeleccionado ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
