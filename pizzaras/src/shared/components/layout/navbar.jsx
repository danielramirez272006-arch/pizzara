import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { useToast } from '../../context/toast-context';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    addToast(newTheme === 'light' ? 'Modo Claro activado ☀️' : 'Modo Oscuro activado 🌙', 'info');
  };

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
                end
              >
                Panel
              </NavLink>

              {/* Enlace visible para administradores */}
              {user?.role === 'admin' && (
                <NavLink
                  to="/dashboard/usuarios"
                  className={({ isActive }) => (isActive ? 'nav-item nav-admin active' : 'nav-item nav-admin')}
                >
                  👑 Admin Usuarios
                </NavLink>
              )}

              <NavLink
                to="/perfil"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                end
              >
                Perfil
              </NavLink>

              <NavLink
                to="/perfil/configuracion"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                ⚙️ Configuración
              </NavLink>

              <span className={`user-role-badge ${user?.role === 'admin' ? 'badge-admin-role' : 'badge-user-role'}`}>
                {user?.role?.toUpperCase()}
              </span>

              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          )}

          {/* Selector de Modo Oscuro / Claro */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};
