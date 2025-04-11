import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/components/Header.css';
import '../styles/components/icons.css';

const Header = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="page-title">
        <h1>Panel de Administración</h1>
      </div>
    </header>
  );
};

export default Header;
