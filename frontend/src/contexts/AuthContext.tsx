import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, CreateUserRequest, AuthContextType } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: CreateUserRequest): Promise<void> => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        // After successful registration, automatically log in
        await login(userData.email, userData.password);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
