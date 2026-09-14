import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { getStoredToken, saveToken, clearTokens } from '../services/apiClient';

interface User {
  id: string | number;
  email: string;
  username: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getStoredToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (e: any) {
          const status = e?.response?.status;
          if (status === 401 || status === 403) {
            await clearTokens();
            setUser(null);
          } else {
            // Network error - don't clear token, just show no user
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      // Storage read error (shouldn't happen with safe wrapper)
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    const response = await authService.login(data);
    if (!response.access) throw new Error('No access token returned from server');

    await saveToken(response.access);

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (e) {
      // Fallback: minimal user so app can navigate to home
      setUser({ id: '', email: data.email, username: '' });
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    const response = await authService.register(data);

    if (response?.access) {
      await saveToken(response.access);
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch {
        setUser({ id: '', email: data.email, username: data.username });
      }
    }
    // If no token returned, caller (signup.tsx) will call login() separately
  };

  const logout = async () => {
    await clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
