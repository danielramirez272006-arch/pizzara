import React from 'react';
import { LoginForm } from '../../components/auth/login-form';

export const LoginPage = () => {
  return (
    <div className="page auth-page">
      <div className="auth-card">
        <LoginForm />
      </div>
    </div>
  );
};
