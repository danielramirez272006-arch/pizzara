import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const STORAGE_KEY = 'pizarra_auth_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. PERSISTENCIA SIN PARPADEO (Flicker-Free): Lee de localStorage en el montaje inicial
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.user) {
          setUser(parsed.user);
        }
      }
    } catch (error) {
      console.error('Error al recuperar la sesión local:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData = { email: 'docente@pizarras.com', name: 'Profesor Maestro', role: 'usuario' }) => {
    const userWithRole = {
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      role: userData.role || 'usuario', // 'usuario' | 'admin'
    };
    setUser(userWithRole);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: userWithRole }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
