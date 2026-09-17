import React from 'react';
import { AuthProvider } from './shared/context/auth-context';
import { ToastProvider } from './shared/context/toast-context';
import { AppRouter } from './shared/routing/app-router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
