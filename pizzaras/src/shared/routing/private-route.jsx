import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Guarda la ruta original para que luego del login se pueda volver automáticamente
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
