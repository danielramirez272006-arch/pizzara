import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const STORAGE_KEY = 'pizarra_auth_session';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).isAuthenticated : false;
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).user : null;
    } catch {
      return null;
    }
  });

  const login = (userData = { email: 'docente@pizarras.com', name: 'Profesor Maestro' }) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: userData }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
