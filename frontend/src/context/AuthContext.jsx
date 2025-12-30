import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = authService.getCurrentUserFromStorage();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      // Update user state - this will trigger a re-render with updated isAuthenticated
      if (data && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      // Re-throw error so LoginPage can handle it
      throw error;
    }
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
