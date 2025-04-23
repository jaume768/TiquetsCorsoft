import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../components/Notification';
import ticketService from '../services/ticketService';
import AuthContext from '../context/AuthContext';
import emailjs from '@emailjs/browser';
import {
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaFileArchive,
  FaFile,
  FaTrashAlt,
  FaPaperPlane,
  FaTicketAlt
} from 'react-icons/fa';
import '../styles/CrearTiquetPage.css';

const CrearTiquetPage = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'incidencia',
    prioridad: 'pendiente',
    archivos: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const tipos = [
    { value: 'incidencia', label: 'Incidencia' },
    { value: 'consulta', label: 'Consulta' },
    { value: 'mejora', label: 'Solicitud de Mejora' },
    { value: 'otro', label: 'Otro' }
  ];

  const tiposPermitidos = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip'
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFiles = e => {
    const files = Array.from(e.target.files);
    const validos = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        showError(`El archivo ${file.name} supera 2MB`);
        return false;
      }
      if (!tiposPermitidos.includes(file.type)) {
        showError(`Tipo no permitido: ${file.name}`);
        return false;
      }
      return true;
    });

    const nuevosPreviews = validos.map(file => {
      const isImg = file.type.startsWith('image/');
      return {
        nombre: file.name,
        tipo: file.type,
        url: isImg ? URL.createObjectURL(file) : null,
        esImagen: isImg,
        esPdf: file.type === 'application/pdf',
        esDoc: /word|plain/.test(file.type),
        esZip: file.type === 'application/zip'
      };
    });

    setForm(prev => ({
      ...prev,
      archivos: [...prev.archivos, ...validos]
    }));
    setPreviews(prev => [...prev, ...nuevosPreviews]);
  };

  const removePreview = index => {
    const pv = previews[index];
    if (pv.url) URL.revokeObjectURL(pv.url);

    setForm(prev => {
      const archivos = [...prev.archivos];
      archivos.splice(index, 1);
      return { ...prev, archivos };
    });
    setPreviews(prev => {
      const arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.titulo.trim()) {
      errs.titulo = 'Título obligatorio';
    } else if (form.titulo.length < 5) {
      errs.titulo = 'Mínimo 5 caracteres';
    }
    if (!form.descripcion.trim()) {
      errs.descripcion = 'Descripción obligatoria';
    } else if (form.descripcion.length < 10) {
      errs.descripcion = 'Mínimo 10 caracteres';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendEmail = async ticket => {
    if (process.env.REACT_APP_ENABLE_EMAILS !== 'true') return;
    try {
      const {
        REACT_APP_EMAILJS_SERVICE_ID: svc,
        REACT_APP_EMAILJS_TEMPLATE_ID: tpl,
        REACT_APP_EMAILJS_PUBLIC_KEY: key,
        REACT_APP_ADMIN_EMAIL: admin
      } = process.env;
      if (!svc || !tpl || !key) return;

      await emailjs.send(
        svc,
        tpl,
        {
          to_email: admin,
          ticket_id: ticket.id,
          user_name: usuario.nombre,
          user_email: usuario.email,
          ticket_title: ticket.titulo,
          ticket_description: ticket.descripcion,
          ticket_type: ticket.tipo,
          ticket_priority: ticket.prioridad,
          ticket_date: new Date().toLocaleString()
        },
        key
      );
    } catch (err) {
      console.error('Error enviando email:', err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('descripcion', form.descripcion);
      formData.append('tipo', form.tipo);
      formData.append('prioridad', form.prioridad);
      form.archivos.forEach(file => formData.append('archivos', file));

      const res = await ticketService.crearTiquet(formData);

      // liberar previews
      previews.forEach(p => p.url && URL.revokeObjectURL(p.url));

      if (res.data?.id) {
        await sendEmail(res.data);
        showSuccess('¡Ticket creado con éxito!');
        navigate(`/tiquets/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-tiquet-page">
      <div className="crear-tiquet-card">
        <div className="crear-tiquet-header">
          <FaTicketAlt className="header-icon" />
          <h1 className="crear-tiquet-title">Crear Nuevo Ticket</h1>
          <p className="crear-tiquet-subtitle">
            Complete el formulario para enviar su solicitud de soporte
          </p>
        </div>

        <form className="crear-tiquet-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">
              Título <span className="campo-requerido">*</span>
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
              placeholder="Resumen breve de su solicitud"
              value={form.titulo}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.titulo && (
              <div className="invalid-feedback">{errors.titulo}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción <span className="campo-requerido">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''
                }`}
              placeholder="Describa detalladamente su solicitud, problema o consulta"
              value={form.descripcion}
              onChange={handleChange}
              disabled={loading}
            ></textarea>
            {errors.descripcion && (
              <div className="invalid-feedback">{errors.descripcion}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Ticket</label>
            <select
              id="tipo"
              name="tipo"
              className="form-control"
              value={form.tipo}
              onChange={handleChange}
              disabled={loading}
            >
              {tipos.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="archivos">
              Adjuntar archivo <small>(opcional)</small>
            </label>
            <div className="file-upload-container">
              <input
                id="archivos"
                type="file"
                multiple
                accept={tiposPermitidos.join(',')}
                className="file-upload-input"
                onChange={handleFiles}
                disabled={loading || previews.length >= 5}
              />
              <div className="file-upload-button">
                <FaUpload className="icon-upload" />
                <span>Seleccionar archivo</span>
              </div>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="archivos-preview">
              <h5>Archivos adjuntos ({previews.length})</h5>
              <div className="archivos-grid">
                {previews.map((p, i) => (
                  <div className="archivo-item" key={i}>
                    <div className="archivo-preview">
                      {p.esImagen ? (
                        <img src={p.url} alt={p.nombre} />
                      ) : p.esPdf ? (
                        <span className="icon-pdf">
                          <FaFilePdf /> PDF
                        </span>
                      ) : p.esDoc ? (
                        <span className="icon-doc">
                          <FaFileWord /> DOC
                        </span>
                      ) : p.esZip ? (
                        <span className="icon-zip">
                          <FaFileArchive /> ZIP
                        </span>
                      ) : (
                        <span className="icon-file">
                          <FaFile /> Archivo
                        </span>
                      )}
                    </div>
                    <div className="archivo-info">
                      <span className="archivo-nombre" title={p.nombre}>
                        {p.nombre}
                      </span>
                      <button
                        type="button"
                        className="archivo-eliminar"
                        onClick={() => removePreview(i)}
                        disabled={loading}
                      >
                        <FaTrashAlt />
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
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                'Creando...'
              ) : (
                <>
                  <FaPaperPlane /> Enviar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearTiquetPage;
