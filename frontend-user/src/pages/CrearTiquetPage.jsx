import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError, showWarning } from '../components/Notification';
import ticketService from '../services/ticketService';
import AuthContext from '../context/AuthContext';
import emailjs from '@emailjs/browser';
import '../styles/CrearTiquetPage.css';

const CrearTiquetPage = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'incidencia',
    prioridad: 'media',
    imagenes: []
  });
  
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [previews, setPreviews] = useState([]);
  
  const tiposTiquet = [
    { value: 'incidencia', label: 'Incidencia' },
    { value: 'consulta', label: 'Consulta' },
    { value: 'mejora', label: 'Solicitud de Mejora' },
    { value: 'otro', label: 'Otro' }
  ];
  
  const tiposArchivosPermitidos = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip'
  ];
  
  // La prioridad se establece por defecto como 'media' y no se permite al usuario modificarla
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
    
    // Limpiar error al modificar el campo
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: null
      });
    }
  };
  
  const handleImagenesChange = (e) => {
    const archivos = Array.from(e.target.files);
    
    // Validar tamaño y tipo de archivo
    const archivosFiltrados = archivos.filter(archivo => {
      // Limitar a 2MB por archivo
      if (archivo.size > 2 * 1024 * 1024) {
        showError(`El archivo ${archivo.name} supera el límite de 2MB`);
        return false;
      }
      
      // Validar tipo de archivo
      if (!tiposArchivosPermitidos.includes(archivo.type)) {
        showError(`El tipo de archivo ${archivo.name} no está permitido`);
        return false;
      }
      
      return true;
    });
    
    // Generar previsualizaciones para archivos
    const nuevasPreviews = archivosFiltrados.map(archivo => {
      if (archivo.type.startsWith('image/')) {
        return {
          nombre: archivo.name,
          tipo: archivo.type,
          url: URL.createObjectURL(archivo),
          esImagen: true,
          esPdf: false,
          esDocumento: false
        };
      } else if (archivo.type === 'application/pdf') {
        return {
          nombre: archivo.name,
          tipo: archivo.type,
          url: null,
          esImagen: false,
          esPdf: true,
          esDocumento: false
        };
      } else {
        // Para otros tipos de documentos
        return {
          nombre: archivo.name,
          tipo: archivo.type,
          url: null,
          esImagen: false,
          esPdf: false,
          esDocumento: true
        };
      }
    });
    
    setFormulario({
      ...formulario,
      imagenes: [...formulario.imagenes, ...archivosFiltrados]
    });
    
    setPreviews([...previews, ...nuevasPreviews]);
  };
  
  const eliminarImagen = (index) => {
    // Liberar URL.createObjectURL
    if (previews[index].url) {
      URL.revokeObjectURL(previews[index].url);
    }
    
    const nuevasImagenes = [...formulario.imagenes];
    nuevasImagenes.splice(index, 1);
    
    const nuevasPreviews = [...previews];
    nuevasPreviews.splice(index, 1);
    
    setFormulario({
      ...formulario,
      imagenes: nuevasImagenes
    });
    
    setPreviews(nuevasPreviews);
  };
  
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formulario.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    } else if (formulario.titulo.length < 5) {
      nuevosErrores.titulo = 'El título debe tener al menos 5 caracteres';
    }
    
    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    } else if (formulario.descripcion.length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  // Función para enviar email a través de EmailJS
  const enviarEmailNotificacion = async (ticket) => {
    // Verificar si los emails están habilitados en la configuración
    const emailsEnabled = process.env.REACT_APP_ENABLE_EMAILS === 'true';
    
    if (!emailsEnabled) {
      console.log('Envío de emails deshabilitado en modo desarrollo.');
      return;
    }

    try {
      // Configuración de EmailJS usando variables de entorno
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
      
      // Verificar que las variables de entorno estén configuradas
      if (!serviceId || !templateId || !publicKey) {
        console.error('Falta configuración de EmailJS en variables de entorno');
        return;
      }
      
      // Datos para la plantilla de EmailJS
      const templateParams = {
        to_email: adminEmail || 'admin@ejemplo.com',
        ticket_id: ticket.id,
        user_name: usuario.nombre || 'Usuario',
        user_email: usuario.email || 'No disponible',
        ticket_title: ticket.titulo,
        ticket_description: ticket.descripcion,
        ticket_type: ticket.tipo,
        ticket_priority: ticket.prioridad,
        ticket_date: new Date().toLocaleString()
      };
      
      // Enviar el email
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('Email enviado con éxito:', response.status, response.text);
    } catch (error) {
      console.error('Error al enviar email de notificación:', error);
      // No mostrar error al usuario, pues el ticket ya se creó correctamente
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    try {
      setCargando(true);
      
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('titulo', formulario.titulo);
      formData.append('descripcion', formulario.descripcion);
      formData.append('tipo', formulario.tipo);
      formData.append('prioridad', formulario.prioridad);
      
      // Agregar archivos si existen
      if (formulario.imagenes.length > 0) {
        formulario.imagenes.forEach(archivo => {
          formData.append('archivos', archivo);
        });
      }
      
      const response = await ticketService.crearTiquet(formData);
      
      // Limpiar URLs creadas para previsualizaciones
      previews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
      
      // Enviar email de notificación usando EmailJS
      if (response.data && response.data.id) {
        await enviarEmailNotificacion(response.data);
      }
      
      showSuccess('¡Ticket creado con éxito!');
      navigate(`/tiquets/${response.data.id}`);
    } catch (error) {
      console.error('Error al crear ticket:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        showError(`Error: ${error.response.data.message}`);
      } else {
        showError('Ocurrió un error al crear el ticket. Por favor, intente nuevamente más tarde.');
      }
    } finally {
      setCargando(false);
    }
  };
  
  return (
    <div className="crear-tiquet-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="crear-tiquet-card">
              <div className="crear-tiquet-header">
                <h1 className="crear-tiquet-title">Crear Nuevo Ticket</h1>
                <p className="crear-tiquet-subtitle">
                  Complete el formulario para enviar su solicitud de soporte
                </p>
              </div>
              
              <form className="crear-tiquet-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="titulo">Título <span className="campo-requerido">*</span></label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className={`form-control ${errores.titulo ? 'is-invalid' : ''}`}
                    value={formulario.titulo}
                    onChange={handleInputChange}
                    placeholder="Resumen breve de su solicitud"
                    disabled={cargando}
                  />
                  {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción <span className="campo-requerido">*</span></label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                    value={formulario.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describa detalladamente su solicitud, problema o consulta"
                    rows="6"
                    disabled={cargando}
                  ></textarea>
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label htmlFor="tipo">Tipo de Ticket</label>
                    <select
                      id="tipo"
                      name="tipo"
                      className="form-control"
                      value={formulario.tipo}
                      onChange={handleInputChange}
                      disabled={cargando}
                    >
                      {tiposTiquet.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* La selección de prioridad ha sido eliminada - se establece automáticamente como 'media' */}
                </div>
                
                <div className="form-group">
                  <label htmlFor="imagenes">Adjuntos (máx. 5 archivos, 2MB c/u)</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="imagenes"
                      name="imagenes"
                      className="file-upload-input"
                      onChange={handleImagenesChange}
                      multiple
                      accept="image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip"
                      disabled={cargando || previews.length >= 5}
                    />
                    <div className="file-upload-button">
                      <span className="icon-upload">⬆️</span>
                      <span>Seleccionar archivos</span>
                    </div>
                    <p className="file-upload-info">
                      {previews.length >= 5 ? (
                        <span className="text-warning">Límite de archivos alcanzado (5)</span>
                      ) : (
                        `Arrastre aquí o haga clic para seleccionar ${5 - previews.length} archivo(s)`
                      )}
                    </p>
                  </div>
                </div>
                
                {previews.length > 0 && (
                  <div className="archivos-preview">
                    <h5>Archivos adjuntos ({previews.length})</h5>
                    <div className="archivos-grid">
                      {previews.map((preview, index) => (
                        <div className="archivo-item" key={index}>
                          <div className="archivo-preview">
                            {preview.esImagen ? (
                              <img src={preview.url} alt={`Vista previa ${index + 1}`} />
                            ) : preview.esPdf ? (
                              <span className="icon-pdf">
                                <i className="far fa-file-pdf"></i>
                                PDF
                              </span>
                            ) : preview.tipo.includes('word') ? (
                              <span className="icon-doc">
                                <i className="far fa-file-word"></i>
                                DOC
                              </span>
                            ) : preview.tipo.includes('text/plain') ? (
                              <span className="icon-txt">
                                <i className="far fa-file-alt"></i>
                                TXT
                              </span>
                            ) : preview.tipo.includes('zip') ? (
                              <span className="icon-zip">
                                <i className="far fa-file-archive"></i>
                                ZIP
                              </span>
                            ) : (
                              <span className="icon-file">
                                <i className="far fa-file"></i>
                                Archivo
                              </span>
                            )}
                          </div>
                          <div className="archivo-info">
                            <span className="archivo-nombre" title={preview.nombre}>
                              {preview.nombre.length > 20 ? preview.nombre.substring(0, 17) + '...' : preview.nombre}
                            </span>
                            <span className="archivo-tipo">{preview.tipo.split('/')[1]}</span>
                            <button 
                              type="button" 
                              className="archivo-eliminar"
                              onClick={() => eliminarImagen(index)}
                              disabled={cargando}
                            >
                              <span className="icon-remove">❌</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => navigate('/mis-tiquets')}
                    disabled={cargando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-crear"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <div className="loading-spinner-small"></div>
                        <span className="ms-2">Creando...</span>
                      </>
                    ) : (
                      <>
                        <span className="icon-send">📩</span>
                        <span>Crear Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearTiquetPage;
