import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/context/auth-context';
import { useToast } from '../../shared/context/toast-context';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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

    if (!formData.name.trim()) newErrors.name = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Por favor, completa los campos requeridos correctamente', 'error');
      return;
    }

    login({ email: formData.email, name: formData.name });
    addToast(`¡Cuenta creada con éxito! Bienvenido, ${formData.name}`, 'success');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <h2>Crear Cuenta</h2>
      <p className="form-subtitle">Comienza a dominar las pizarras modernas hoy</p>

      <Input
        label="Nombre Completo"
        name="name"
        placeholder="Juan Pérez"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="juan@ejemplo.com"
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

      <Input
        label="Confirmar Contraseña"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" className="w-full">
        Registrarse
      </Button>

      <p className="form-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </form>
  );
};
