import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('foodshare_token');
      const savedUser = localStorage.getItem('foodshare_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh profile in background
          const freshData = await authService.getCurrentUser();
          if (freshData.success && freshData.data) {
            setUser(freshData.data);
            localStorage.setItem('foodshare_user', JSON.stringify(freshData.data));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { token, ...userData } = response.data;
      localStorage.setItem('foodshare_token', token);
      localStorage.setItem('foodshare_user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (registerData) => {
    const response = await authService.register(registerData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('foodshare_token');
    localStorage.removeItem('foodshare_user');
    setUser(null);
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('foodshare_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
