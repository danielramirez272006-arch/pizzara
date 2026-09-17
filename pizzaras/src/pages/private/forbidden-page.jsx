import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/auth-context';

export const ForbiddenPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page forbidden-page">
      <div className="forbidden-card">
        <span className="forbidden-badge">⛔ ACCESO DENEGADO (ERROR 403)</span>
        <h1 className="error-code-403">403</h1>
        <h2>Zona Restringida para Administradores</h2>
        <p className="forbidden-desc">
          Tu cuenta actual está registrada con el rol <strong>"{user?.role || 'usuario'}"</strong> y no posee permisos suficientes para acceder a este módulo.
        </p>
        <div className="forbidden-actions">
          <Link to="/dashboard" className="btn btn-primary">
            Volver a mi Dashboard
          </Link>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Regresar a la página anterior
          </button>
        </div>
      </div>
    </div>
  );
};
