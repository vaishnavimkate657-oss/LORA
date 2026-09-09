import React, { createContext, useState, useEffect } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(tokenStorage.getToken());
  const [user, setUser] = useState(tokenStorage.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenStorage.getToken();
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
            tokenStorage.setUser(res.data);
          }
        } catch (err) {
          console.warn('Failed to verify stored session:', err);
          tokenStorage.clear();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res && res.data) {
      const { token: jwtToken, user: userData } = res.data;
      tokenStorage.setToken(jwtToken);
      tokenStorage.setUser(userData);
      setToken(jwtToken);
      setUser(userData);
      return res.data;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res && res.data) {
      const { token: jwtToken, user: userProfile } = res.data;
      tokenStorage.setToken(jwtToken);
      tokenStorage.setUser(userProfile);
      setToken(jwtToken);
      setUser(userProfile);
      return res.data;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
