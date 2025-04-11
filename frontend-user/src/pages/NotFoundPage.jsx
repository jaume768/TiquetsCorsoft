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
          Lo sentimos, la página solicitada no está disponible o no existe.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
