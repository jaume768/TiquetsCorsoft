import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/Notification';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MisTiquetsPage from './pages/MisTiquetsPage';
import DetalleTiquetPage from './pages/DetalleTiquetPage';
import CrearTiquetPage from './pages/CrearTiquetPage';
import NotFoundPage from './pages/NotFoundPage';
// Estilos propios sin dependencias de Bootstrap
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationContainer />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/mis-tiquets" /></ProtectedRoute>} />
          <Route path="/mis-tiquets" element={<ProtectedRoute><MisTiquetsPage /></ProtectedRoute>} />
          <Route path="/tiquets/nuevo" element={<ProtectedRoute><CrearTiquetPage /></ProtectedRoute>} />
          <Route path="/tiquets/:id" element={<ProtectedRoute><DetalleTiquetPage /></ProtectedRoute>} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
