import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { useToast } from '../../context/toast-context';

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Has cerrado sesión correctamente', 'info');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">📋</span>
          <span className="brand-text">PizarraMastery</span>
        </NavLink>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Inicio
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                Iniciar Sesión
              </NavLink>
              <NavLink
                to="/registro"
                className={({ isActive }) => (isActive ? 'nav-item nav-btn-highlight active' : 'nav-item nav-btn-highlight')}
              >
                Registro
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                Panel
              </NavLink>
              <NavLink
                to="/perfil"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                Perfil ({user?.name || 'Docente'})
              </NavLink>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
