// context/auth_context.tsx
import { createContext, ReactNode, useEffect, useState } from "react";
import { authService } from "../services/auth_service";
import { ApiUser } from "@/services/api/apiTypes";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/services/api/config";
import { getStoredToken, saveToken, clearTokens } from "../services/apiClient";

interface AuthContextType {
  token: string | null;
  user: ApiUser | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch (error) {
        await clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authService.login(credentials);
    setToken(data.access);
    // Save to all token keys for cross-compatibility
    await saveToken(data.access);
    const userData = await authService.getMe();
    setUser(userData);
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    await authService.register(userData);
    await login({ email: userData.email, password: userData.password });
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
