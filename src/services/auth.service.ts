import { apiClient, handleApiError } from '@/lib/api-client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiResponse,
} from '@/types/api';

export class AuthService {
  /**
   * Registra un nuevo usuario en el sistema
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register/', data);
      
      // Guardar tokens automáticamente
      if (response.data.tokens) {
        apiClient.setTokens(response.data.tokens.access, response.data.tokens.refresh);
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   */
  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login/', data);
      
      // Guardar tokens automáticamente
      if (response.data.tokens) {
        apiClient.setTokens(response.data.tokens.access, response.data.tokens.refresh);
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Renueva el token de acceso usando el refresh token
   */
  static async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh/', data);
      
      // Actualizar el token de acceso
      if (response.data.access) {
        const refreshToken = data.refresh;
        apiClient.setTokens(response.data.access, refreshToken);
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Cierra sesión invalidando el refresh token
   */
  static async logout(): Promise<ApiResponse<null>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh: refreshToken });
      }
      
      // Limpiar tokens localmente
      apiClient.clearAuth();
      
      return {
        data: null,
        message: 'Logout exitoso',
        status: 'success',
      };
    } catch (error) {
      // Incluso si hay error en el servidor, limpiar tokens localmente
      apiClient.clearAuth();
      throw handleApiError(error);
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Obtiene el token de acceso actual
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  /**
   * Obtiene el refresh token actual
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  /**
   * Limpia todos los tokens y datos de autenticación
   */
  static clearAuth(): void {
    apiClient.clearAuth();
  }
}

