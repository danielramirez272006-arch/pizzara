import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/context/auth-context';
import { useToast } from '../../shared/context/toast-context';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Ruta previa a la que intentaba acceder el usuario (o /dashboard por defecto)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un formato de correo válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Por favor, corrige los campos del formulario', 'error');
      return;
    }

    const userName = formData.email.split('@')[0];
    login({ email: formData.email, name: userName });
    addToast(`¡Bienvenido de nuevo, ${userName}!`, 'success');
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <h2>Iniciar Sesión</h2>
      <p className="form-subtitle">Ingresa para acceder a tus cursos de pizarras</p>

      {location.state?.from && (
        <div className="alert-notice">
          ℹ️ Inicia sesión para acceder a la página solicitada: <strong>{location.state.from.pathname}</strong>
        </div>
      )}

      <Input
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="docente@pizarras.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Button type="submit" className="w-full">
        Entrar a la plataforma
      </Button>
    </form>
  );
};
