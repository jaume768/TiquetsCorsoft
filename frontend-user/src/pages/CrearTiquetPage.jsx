import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError, showWarning } from '../components/Notification';
import ticketService from '../services/ticketService';
import AuthContext from '../context/AuthContext';
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
  
  const prioridadesTiquet = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' }
  ];
  
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
      
      // Validar tipo de archivo (imágenes y PDFs)
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!tiposPermitidos.includes(archivo.type)) {
        showError(`El tipo de archivo ${archivo.name} no está permitido`);
        return false;
      }
      
      return true;
    });
    
    // Generar previsualizaciones para imágenes
    const nuevasPreviews = archivosFiltrados.map(archivo => {
      if (archivo.type.startsWith('image/')) {
        return {
          nombre: archivo.name,
          tipo: archivo.type,
          url: URL.createObjectURL(archivo),
          esPdf: false
        };
      } else {
        // Para PDFs mostramos un icono
        return {
          nombre: archivo.name,
          tipo: archivo.type,
          url: null,
          esPdf: true
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
        formulario.imagenes.forEach(imagen => {
          formData.append('imagenes', imagen);
        });
      }
      
      const response = await ticketService.crearTiquet(formData);
      
      // Limpiar URLs creadas para previsualizaciones
      previews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
      
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
                  
                  <div className="form-group form-group-half">
                    <label htmlFor="prioridad">Prioridad</label>
                    <select
                      id="prioridad"
                      name="prioridad"
                      className="form-control"
                      value={formulario.prioridad}
                      onChange={handleInputChange}
                      disabled={cargando}
                    >
                      {prioridadesTiquet.map(prioridad => (
                        <option key={prioridad.value} value={prioridad.value}>
                          {prioridad.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      accept="image/jpeg,image/png,image/gif,application/pdf"
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
                            {preview.esPdf ? (
                              <span className="icon-pdf">📝</span>
                            ) : (
                              <img src={preview.url} alt={`Vista previa ${index + 1}`} />
                            )}
                          </div>
                          <div className="archivo-info">
                            <span className="archivo-nombre">{preview.nombre}</span>
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
