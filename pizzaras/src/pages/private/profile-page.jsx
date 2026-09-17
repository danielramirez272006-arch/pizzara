import React, { useState } from 'react';
import { useAuth } from '../../shared/context/auth-context';
import { useToast } from '../../shared/context/toast-context';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showCertificate, setShowCertificate] = useState(false);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
    addToast('Abriendo ventana de impresión del certificado', 'info');
  };

  return (
    <div className="page profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2>{user?.name || 'Docente Especialista'}</h2>
              <p className="profile-email">{user?.email || 'usuario@pizarras.com'}</p>
              <span className="badge-role">Instructor Certificado en Pizarras</span>
            </div>
          </div>

          <div className="profile-details">
            <h3>Información Profesional</h3>
            <div className="details-grid">
              <div className="detail-field">
                <span className="field-label">Especialidad:</span>
                <span className="field-value">Metodología Visual & Didáctica de Pizarras</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Pizarras Dominadas:</span>
                <span className="field-value">Acrílica, Tiza Clásica y Pizarra Digital Interactiva</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Estado de la cuenta:</span>
                <span className="field-value status-active">Activa y Verificada</span>
              </div>
            </div>
          </div>

          {/* Sección de Certificación */}
          <div className="certificate-section">
            <div className="certificate-banner">
              <div className="cert-info">
                <h3>🏆 Certificado de Excelencia en Pizarras</h3>
                <p>Acreditación por haber completado las técnicas docentes de dibujo y esquematización.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowCertificate(!showCertificate)}
              >
                {showCertificate ? 'Ocultar Certificado' : 'Ver y Descargar Certificado'}
              </button>
            </div>

            {showCertificate && (
              <div className="diploma-container printable-area">
                <div className="diploma-border">
                  <div className="diploma-header">
                    <span className="diploma-seal">🎖️</span>
                    <h1>CERTIFICADO DE ACREDITACIÓN</h1>
                    <p className="diploma-subtitle">Academia Internacional de PizarraMastery</p>
                  </div>

                  <p className="diploma-text">Se otorga el presente reconocimiento oficial a:</p>
                  <h2 className="diploma-student-name">{user?.name || 'Profesor Maestro'}</h2>
                  <p className="diploma-description">
                    Por haber demostrado maestría en el uso pedagógico, técnico y esquemático de
                    <strong> Pizarras Acrílicas, Tiza Tradicional y Pizarras Digitales Interactivas</strong>.
                  </p>

                  <div className="diploma-footer">
                    <div className="diploma-sign">
                      <div className="sign-line"></div>
                      <span>Dr. Andrés Morales</span>
                      <small>Director Académico</small>
                    </div>
                    <div className="diploma-date">
                      <span>Fecha de Emisión:</span>
                      <strong>{currentDate}</strong>
                    </div>
                  </div>
                </div>

                <div className="diploma-actions no-print">
                  <button onClick={handlePrint} className="btn btn-primary">
                    🖨️ Imprimir / Guardar en PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
