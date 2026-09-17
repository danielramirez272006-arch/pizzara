import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/navbar';
import { PrivateRoute } from './private-route';
import { GuestRoute } from './guest-route';

// Páginas Públicas
import { HomePage } from '../../pages/public/home-page';
import { LoginPage } from '../../pages/public/login-page';
import { RegisterPage } from '../../pages/public/register-page';

// Páginas Privadas
import { DashboardPage } from '../../pages/private/dashboard-page';
import { ProfilePage } from '../../pages/private/profile-page';
import { ConfiguracionPage } from '../../pages/private/configuracion-page';
import { AdminUsuariosPage } from '../../pages/private/admin-usuarios-page';
import { NotFoundPage } from '../../pages/private/not-found-page';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Barra de navegación superior fija */}
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Ruta Pública de Inicio */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Rutas SOLO Invitado (GuestRoute): Si ya está logueado, redirige a /dashboard */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Route>

          {/* 3 y 5. Rutas Privadas Generales (Cualquier usuario autenticado) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/perfil/configuracion" element={<ConfiguracionPage />} />
          </Route>

          {/* 3 y 5. Rutas Privadas de Administración (Solo rol 'admin' - De lo contrario muestra 403 Forbidden) */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard/usuarios" element={<AdminUsuariosPage />} />
          </Route>

          {/* Ruta Comodín 404 para URLs no encontradas */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
