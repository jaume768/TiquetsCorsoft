import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-error">404</div>
        <h1 className="not-found-title">Página no encontrada</h1>
        <p className="not-found-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="not-found-button">
            <i className="bi bi-house-door-fill"></i> Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
