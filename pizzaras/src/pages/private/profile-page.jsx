import React from 'react';
import { useAuth } from '../../shared/context/auth-context';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="page profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2>{user?.name || 'Usuario'}</h2>
              <p className="profile-email">{user?.email || 'usuario@pizarras.com'}</p>
              <span className="badge-role">Docente Certificado</span>
            </div>
          </div>

          <div className="profile-details">
            <h3>Información de la Cuenta</h3>
            <div className="details-grid">
              <div className="detail-field">
                <span className="field-label">Rol:</span>
                <span className="field-value">Instructor / Estudiante</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Especialidad:</span>
                <span className="field-value">Pizarras Interactivas y Acrílicas</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Estado de la cuenta:</span>
                <span className="field-value status-active">Activa (Sesión Segura)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
