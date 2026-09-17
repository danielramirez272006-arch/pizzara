import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/context/auth-context';

export const HeroBanner = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero-banner">
      <div className="hero-content">
        <span className="badge">🎓 Formación Docente & Profesional</span>
        <h1 className="hero-title">
          Domina el Arte y Técnica de las <span className="highlight">Pizarras</span>
        </h1>
        <p className="hero-description">
          Desde pizarras acrílicas y tiza clásica hasta las herramientas interactivas y digitales más avanzadas. Eleva la claridad de tus clases, presentaciones y sesiones colaborativas.
        </p>
        <div className="hero-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/registro" className="btn btn-primary">
                Comenzar Ahora
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Ver Cursos
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">
              Ir a mi Panel de Cursos
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
