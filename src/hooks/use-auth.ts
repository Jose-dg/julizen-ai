import { useState, useCallback } from 'react';
import { AuthService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest, AuthResponse, ApiError } from '@/types/api';

interface UseAuthReturn {
  // Estado
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (data: LoginRequest) => Promise<AuthResponse | null>;
  register: (data: RegisterRequest) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginRequest): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(data);
      return response.data;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al iniciar sesión');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(data);
      return response.data;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al registrarse');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.logout();
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    isAuthenticated: AuthService.isAuthenticated(),
    login,
    register,
    logout,
    clearError,
  };
};

