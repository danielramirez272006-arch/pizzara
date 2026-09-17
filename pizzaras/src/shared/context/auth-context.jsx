import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const STORAGE_KEY = 'pizarra_auth_session';

export const AuthProvider = ({ children }) => {
  // Inicialización síncrona (Lazy initialization): Lee de localStorage en el render inicial sin parpadeo ni retraso
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed.user || (parsed.email ? parsed : null);
        }
      }
    } catch (error) {
      console.error('Error al recuperar la sesión local:', error);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = (userData = { email: 'docente@pizarras.com', name: 'Profesor Maestro', role: 'usuario' }) => {
    const userWithRole = {
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      role: userData.role || 'usuario', // 'usuario' | 'admin'
    };
    setUser(userWithRole);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: userWithRole }));
    } catch (error) {
      console.error('Error al guardar sesión:', error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar sesión:', error);
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
