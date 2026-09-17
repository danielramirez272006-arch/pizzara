import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Mientras verifica la persistencia, muestra el loader para evitar parpadeos
  if (isLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Si ya está autenticado, redirige automáticamente a /dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Si es invitado (no autenticado), permite ver el formulario de login/registro
  return <Outlet />;
};
