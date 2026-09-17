import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="page not-found-page">
      <div className="not-found-card">
        <h1 className="error-code">404</h1>
        <h2>Pizarra no encontrada</h2>
        <p>La página que estás buscando fue borrada o no existe.</p>
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};
