import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';
import { User } from '@/types/api';

interface UseAuthSSRReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para autenticación compatible con SSR
 * Utiliza cookies en lugar de localStorage para compatibilidad con Next.js
 */
export const useAuthSSR = (): UseAuthSSRReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Verificar si hay token en cookies
        const token = getCookie('access_token');
        
        if (token) {
          // Verificar si el token es válido obteniendo el perfil del usuario
          try {
            const response = await fetch('/api/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData.data);
              setIsAuthenticated(true);
            } else {
              // Token inválido, limpiar cookies
              clearAuthCookies();
            }
          } catch (err) {
            console.error('Error verificando autenticación:', err);
            clearAuthCookies();
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error verificando autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const clearAuthCookies = () => {
    if (typeof document === 'undefined') return;
    
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};

/**
 * Función helper para obtener el usuario autenticado en el servidor
 */
export const getServerSideUser = async (req: any): Promise<User | null> => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) return null;

    // Aquí harías una llamada a tu API para verificar el token
    // Por ahora retornamos null
    return null;
  } catch (error) {
    console.error('Error obteniendo usuario del servidor:', error);
    return null;
  }
};

