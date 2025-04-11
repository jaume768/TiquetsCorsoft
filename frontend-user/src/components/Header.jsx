import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ usuario }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/mis-tiquets" className="logo-link">
              <h1 className="logo">
                <img src="/logo-corsoft.svg" alt="Corsoft Logo" className="logo-image" />
              </h1>
            </Link>
          </div>
          
          <nav className="nav">
            <Link to="/mis-tiquets" className="nav-link">
              <span className="icon-tickets">🎟️</span>
              <span>Mis Tickets</span>
            </Link>
            <Link to="/tiquets/nuevo" className="nav-link">
              <span className="icon-new-ticket">➕</span>
              <span>Nuevo Ticket</span>
            </Link>
          </nav>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-text">+34 971 845 624</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span className="contact-text">Via Palma 100, 2ºF, Manacor (I. Balears)</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span className="contact-text">info@corsoft.es</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
