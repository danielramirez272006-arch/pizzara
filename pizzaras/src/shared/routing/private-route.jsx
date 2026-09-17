import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { ForbiddenPage } from '../../pages/private/forbidden-page';

export const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Mientras verifica la sesión, muestra el loader para evitar parpadeo del contenido privado
  if (isLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Si NO está autenticado, redirige a /login guardando obligatoriamente la ruta en state.from
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si se especificaron roles permitidos y el rol del usuario no está autorizado -> Muestra ForbiddenPage (403)
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <ForbiddenPage />;
  }

  // 4. Usuario autenticado y con rol autorizado -> Renderiza las rutas hijas
  return <Outlet />;
};
