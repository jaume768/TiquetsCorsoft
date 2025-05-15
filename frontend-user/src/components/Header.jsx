import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaPlus, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import '../styles/Header.css';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Header = () => {
  const { usuario } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const empresa = usuario?.nombre || localStorage.getItem('empresa');
  
  // Determinar el logo según el tema
  const getLogo = () => {
    if (theme === 'webcar') {
      return "/webcar.jpg"; // Asegúrate de que este archivo existe en tu carpeta public
    }
    return "/logo-corsoft.svg";
  };
  
  // Clase CSS adicional según el tema
  const headerClass = theme === 'webcar' ? 'header webcar-theme' : 'header';
  
  return (
    <header className={headerClass}>
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/mis-tiquets" className="logo-link">
              <h1 className="logo">
                <img src={getLogo()} alt="Logo" className="logo-image" />
              </h1>
            </Link>
          </div>
          
          <div className="nav-container">
            <nav className="nav">
              <Link to="/mis-tiquets" className="nav-link">
                <FaTicketAlt /> <span>Mis Tickets</span>
              </Link>
              <Link to="/tiquets/nuevo" className="nav-link">
                <FaPlus /> <span>Nuevo Ticket</span>
              </Link>
            </nav>

            {empresa && (
              <div className="company-name">
                {empresa}
              </div>
            )}
          </div>
          
          <div className="contact-info">
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <span className="contact-text">+34 971 845 624</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span className="contact-text">Via Palma 100, 2ºF, Manacor (I. Balears)</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span className="contact-text">info@corsoft.es</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
