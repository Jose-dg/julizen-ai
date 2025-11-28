import { apiClient, handleApiError } from '@/lib/api-client';
import {
  User,
  UpdateProfileRequest,
  StylePassport,
  ApiResponse,
} from '@/types/api';

export class UserService {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  static async getProfile(): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<User>('/users/profile/');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    try {
      return await apiClient.put<User>('/users/profile/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene el pasaporte de estilo del usuario
   */
  static async getStylePassport(): Promise<ApiResponse<StylePassport>> {
    try {
      return await apiClient.get<StylePassport>('/users/style-passport/');
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

