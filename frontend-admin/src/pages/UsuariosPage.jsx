import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { showSuccess, showError, showWarning } from '../components/Notification';
import '../styles/UsuariosPage.css';
import '../styles/components/icons.css';

const UsuariosPage = () => {
  const { usuario } = useAuth();
  
  // Estados para la gestión de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [limite, setLimite] = useState(10);
  const [filtroRol, setFiltroRol] = useState('');
  
  // Formulario para crear/editar usuario
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',
    codcli: '',
    nif: '',
    direccion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar usuarios al montar el componente o cuando cambian los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarUsuarios();
    }, 300); // Debounce para la búsqueda
    
    return () => clearTimeout(timer);
  }, [paginaActual, limite, busqueda, filtroRol]);

  // Función para cargar usuarios con paginación y filtros
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const filtros = {
        pagina: paginaActual,
        limite,
        busqueda,
        rol: filtroRol
      };
      
      const response = await userService.getUsuarios(filtros);
      
      if (response.success) {
        setUsuarios(response.data);
        setTotalUsuarios(response.total || response.data.length);
        setError(null);
      } else {
        setError('Error al cargar los usuarios: ' + (response.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('No se pudieron cargar los usuarios. Por favor, intente nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio en la búsqueda
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1); // Resetear a la primera página cuando se busca
  };

  // Abrir modal para crear/editar usuario
  const abrirModal = (usuario = null) => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '', // No mostrar contraseña existente
        rol: usuario.rol || 'usuario',
        codcli: usuario.codcli || '',
        nif: usuario.nif || '',
        direccion: usuario.direccion || ''
      });
    } else {
      // Resetear formulario para nuevo usuario
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'usuario',
        codcli: '',
        nif: '',
        direccion: ''
      });
    }
    
    setFormErrors({});
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
    setFormErrors({});
  };

  // Validar formulario
  const validarFormulario = () => {
    const errores = {};
    
    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errores.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errores.email = 'El formato del email no es válido';
    }
    
    if (!usuarioSeleccionado && !formData.password.trim()) {
      errores.password = 'La contraseña es obligatoria para nuevos usuarios';
    } else if (!usuarioSeleccionado && formData.password.length < 6) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setFormErrors(errores);
    return Object.keys(errores).length === 0;
  };

  // Guardar usuario (crear o actualizar)
  const guardarUsuario = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (usuarioSeleccionado) {
        // Actualizar usuario existente
        const datosActualizados = { ...formData };
        // Solo enviar password si se ha proporcionado uno nuevo
        if (!datosActualizados.password) {
          delete datosActualizados.password;
        }
        
        response = await userService.actualizarUsuario(usuarioSeleccionado.id, datosActualizados);
        
        if (response.success) {
          showSuccess('Usuario actualizado correctamente');
          cerrarModal();
          cargarUsuarios();
        } else {
          showError(response.message || 'Error al actualizar usuario');
        }
      } else {
        // Crear nuevo usuario
        response = await userService.crearUsuario(formData);
        
        if (response.success) {
          showSuccess('Usuario creado correctamente');
          cerrarModal();
          cargarUsuarios();
        } else {
          showError(response.message || 'Error al crear usuario');
        }
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      showError('Error al guardar usuario: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar eliminación de usuario
  const confirmarEliminarUsuario = (usuarioAEliminar) => {
    if (usuarioAEliminar.id === usuario.id) {
      showError('No puedes eliminar tu propia cuenta');
      return;
    }
    
    setUsuarioAEliminar(usuarioAEliminar);
    setConfirmDeleteModal(true);
  };

  // Eliminar usuario
  const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;
    
    try {
      const response = await userService.eliminarUsuario(usuarioAEliminar.id);
      
      if (response.success) {
        showSuccess('Usuario eliminado correctamente');
        setConfirmDeleteModal(false);
        setUsuarioAEliminar(null);
        cargarUsuarios();
      } else {
        showError(response.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showError('Error al eliminar usuario: ' + (error.message || 'Error desconocido'));
    }
  };

  // Cambiar página
  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  // Calcular total de páginas
  const totalPaginas = Math.ceil(totalUsuarios / limite);

  return (
    <div className="usuarios-page-container">
      <header className="usuarios-header">
        <h1 className="usuarios-title">Gestión de Usuarios</h1>
        <button 
          className="btn-nuevo-usuario"
          onClick={() => abrirModal()}
        >
          <i className="icon icon-user-plus"></i> Nuevo Usuario
        </button>
      </header>
      
      <div className="usuarios-filters-container">
        <div className="search-input-container">
          <i className="icon icon-search search-icon"></i>
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
              <span>×</span>
            </button>
          )}
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="filtroRol">Rol:</label>
            <select 
              id="filtroRol" 
              value={filtroRol} 
              onChange={(e) => {
                setFiltroRol(e.target.value);
                setPaginaActual(1);
              }}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="admin">Administrador</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="limite">Mostrar:</label>
            <select 
              id="limite" 
              value={limite} 
              onChange={(e) => {
                setLimite(Number(e.target.value));
                setPaginaActual(1);
              }}
              className="filter-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
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
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="no-usuarios">
            <i className="icon icon-users"></i>
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
                  <th>Código Cliente</th>
                  <th>NIF</th>
                  <th>Dirección</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuarioItem => (
                  <tr key={usuarioItem.id}>
                    <td className="usuario-id">{usuarioItem.id}</td>
                    <td className="usuario-nombre">{usuarioItem.nombre}</td>
                    <td className="usuario-email">{usuarioItem.email}</td>
                    <td className="usuario-rol">
                      <span className={`rol-badge ${usuarioItem.rol === 'admin' ? 'rol-admin' : 'rol-usuario'}`}>
                        {usuarioItem.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td className="usuario-codigo">{usuarioItem.codcli || '-'}</td>
                    <td className="usuario-nif">{usuarioItem.nif || '-'}</td>
                    <td className="usuario-direccion">{usuarioItem.direccion || '-'}</td>
                    <td className="usuario-fecha">
                      {usuarioItem.fecha_creacion ? new Date(usuarioItem.fecha_creacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="usuario-acciones">
                      <button 
                        className="btn-editar-usuario"
                        onClick={() => abrirModal(usuarioItem)}
                        title="Editar usuario"
                      >
                        <i className="icon icon-pencil"></i>
                      </button>
                      <button 
                        className="btn-eliminar-usuario"
                        onClick={() => confirmarEliminarUsuario(usuarioItem)}
                        title="Eliminar usuario"
                        disabled={usuarioItem.rol === 'admin' || usuarioItem.id === usuario.id}
                      >
                        <i className="icon icon-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn"
                  onClick={() => cambiarPagina(1)}
                  disabled={paginaActual === 1}
                >
                  <i className="bi bi-chevron-double-left"></i>
                </button>
                
                <button 
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <i className="icon icon-chevron-left"></i>
                </button>
                
                <div className="pagination-info">
                  Página {paginaActual} de {totalPaginas}
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  <i className="icon icon-chevron-right"></i>
                </button>
                
                <button 
                  className="pagination-btn"
                  onClick={() => cambiarPagina(totalPaginas)}
                  disabled={paginaActual === totalPaginas}
                >
                  <i className="bi bi-chevron-double-right"></i>
                </button>
              </div>
            )}
            
            <div className="usuarios-total">
              Total: {totalUsuarios} usuario{totalUsuarios !== 1 ? 's' : ''}
            </div>
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
                disabled={isSubmitting}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <form className="usuario-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre"
                    className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.nombre && <div className="error-message">{formErrors.nombre}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="rol">Rol *</label>
                  <select 
                    id="rol" 
                    name="rol"
                    className="form-control"
                    value={formData.rol}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="codcli">Código Cliente</label>
                  <input 
                    type="text" 
                    id="codcli" 
                    name="codcli"
                    className="form-control"
                    value={formData.codcli}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nif">NIF</label>
                  <input 
                    type="text" 
                    id="nif" 
                    name="nif"
                    className="form-control"
                    value={formData.nif}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input 
                    type="text" 
                    id="direccion" 
                    name="direccion"
                    className="form-control"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Mostrar campo de contraseña solo para nuevos usuarios o si se quiere cambiar */}
                <div className="form-group">
                  <label htmlFor="password">
                    {usuarioSeleccionado ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña *'}
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.password && <div className="error-message">{formErrors.password}</div>}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancelar"
                onClick={cerrarModal}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar"
                onClick={guardarUsuario}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="ms-2">{usuarioSeleccionado ? 'Actualizando...' : 'Creando...'}</span>
                  </>
                ) : (
                  usuarioSeleccionado ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar usuario */}
      {confirmDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container confirm-modal">
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Eliminación</h2>
              <button 
                className="modal-close-btn"
                onClick={() => {
                  setConfirmDeleteModal(false);
                  setUsuarioAEliminar(null);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar al usuario <strong>{usuarioAEliminar?.nombre}</strong>?</p>
              <p className="text-danger">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancelar"
                onClick={() => {
                  setConfirmDeleteModal(false);
                  setUsuarioAEliminar(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn-eliminar"
                onClick={eliminarUsuario}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
