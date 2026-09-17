import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();

  // Si ya tiene sesión activa, no tiene sentido que entre a /login o /registro
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
