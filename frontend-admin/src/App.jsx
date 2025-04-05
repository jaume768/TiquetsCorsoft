import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/Notification';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TiquetsPage from './pages/TiquetsPage';
import DetalleTiquetPage from './pages/DetalleTiquetPage';
import UsuariosPage from './pages/UsuariosPage';
import NotFoundPage from './pages/NotFoundPage';
// Estilos propios sin dependencias de Bootstrap
import './styles/main.css';
import './styles/spinners.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationContainer />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas (solo admin) */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/tiquets" element={<ProtectedRoute><TiquetsPage /></ProtectedRoute>} />
          <Route path="/tiquets/:id" element={<ProtectedRoute><DetalleTiquetPage /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><UsuariosPage /></ProtectedRoute>} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
