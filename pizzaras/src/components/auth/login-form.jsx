import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/context/auth-context';
import { useToast } from '../../shared/context/toast-context';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: 'docente@pizarras.com',
    password: '••••••••',
    role: 'usuario', // 'usuario' | 'admin'
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 4. Leer ruta previa solicitada (o /dashboard por defecto)
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
    }
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    const userName = formData.email.split('@')[0];
    
    // Login guardando rol
    login({
      email: formData.email,
      name: userName,
      role: formData.role,
    });

    addToast(`¡Bienvenido! Sesión iniciada como "${formData.role.toUpperCase()}"`, 'success');
    
    // Redirección inteligente al origen exacto
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <h2>Iniciar Sesión</h2>
      <p className="form-subtitle">Ingresa para acceder a la plataforma de pizarras</p>

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

      {/* 4. Selector de Simulación de Rol */}
      <div className="input-group">
        <label htmlFor="role" className="input-label">
          Simular Rol de Usuario *
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-field role-select"
        >
          <option value="usuario">👤 Docente / Estudiante (Rol: usuario)</option>
          <option value="admin">👑 Administrador del Sistema (Rol: admin)</option>
        </select>
        <small className="field-hint">
          Selecciona "admin" para tener acceso a la ruta protegida <code>/dashboard/usuarios</code>.
        </small>
      </div>

      <Button type="submit" className="w-full">
        Entrar a la plataforma
      </Button>
    </form>
  );
};
