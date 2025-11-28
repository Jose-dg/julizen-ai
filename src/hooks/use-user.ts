import { useState, useEffect, useCallback } from 'react';
import { UserService } from '@/services/user.service';
import { User, UpdateProfileRequest, StylePassport, ApiError } from '@/types/api';

interface UseUserReturn {
  // Estado
  user: User | null;
  stylePassport: StylePassport | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  fetchStylePassport: () => Promise<void>;
  clearError: () => void;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [stylePassport, setStylePassport] = useState<StylePassport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await UserService.getProfile();
      setUser(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await UserService.updateProfile(data);
      setUser(response.data);
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al actualizar el perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStylePassport = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await UserService.getStylePassport();
      setStylePassport(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar el pasaporte de estilo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar perfil automáticamente al montar el hook
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    stylePassport,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    fetchStylePassport,
    clearError,
  };
};

