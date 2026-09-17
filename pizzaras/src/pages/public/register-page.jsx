import React from 'react';
import { RegisterForm } from '../../components/auth/register-form';

export const RegisterPage = () => {
  return (
    <div className="page auth-page">
      <div className="auth-card">
        <RegisterForm />
      </div>
    </div>
  );
};
