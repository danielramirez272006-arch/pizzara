import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/navbar';
import { PrivateRoute } from './private-route';
import { PublicOnlyRoute } from './public-route';

// Páginas Públicas
import { HomePage } from '../../pages/public/home-page';
import { LoginPage } from '../../pages/public/login-page';
import { RegisterPage } from '../../pages/public/register-page';

// Páginas Privadas
import { DashboardPage } from '../../pages/private/dashboard-page';
import { ProfilePage } from '../../pages/private/profile-page';
import { NotFoundPage } from '../../pages/private/not-found-page';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Barra de navegación siempre visible */}
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />

          {/* Rutas Públicas para no autenticados */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Route>

          {/* Rutas Privadas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* Ruta Comodín 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
