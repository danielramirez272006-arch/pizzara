import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/navbar';
import { PrivateRoute } from './private-route';
import { PublicOnlyRoute } from './public-route';

// Carga Perezosa (Lazy Loading) para optimización de rendimiento
const HomePage = lazy(() => import('../../pages/public/home-page').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('../../pages/public/login-page').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../../pages/public/register-page').then((m) => ({ default: m.RegisterPage })));

const DashboardPage = lazy(() => import('../../pages/private/dashboard-page').then((m) => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('../../pages/private/profile-page').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('../../pages/private/not-found-page').then((m) => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p>Cargando pizarra...</p>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Barra de navegación siempre visible */}
      <Navbar />

      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rutas Públicas accesibles por todos */}
            <Route path="/" element={<HomePage />} />

            {/* Rutas Públicas restringidas a usuarios NO autenticados */}
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
        </Suspense>
      </main>
    </BrowserRouter>
  );
};
