import { apiClient, handleApiError } from '@/lib/api-client';
import { Brand, ApiResponse } from '@/types/api';

export class BrandsService {
  /**
   * Obtiene la lista de marcas disponibles
   */
  static async getBrands(): Promise<ApiResponse<Brand[]>> {
    try {
      return await apiClient.get<Brand[]>('/brands/');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene los detalles de una marca específica
   */
  static async getBrand(id: string): Promise<ApiResponse<Brand>> {
    try {
      return await apiClient.get<Brand>(`/brands/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene marcas activas únicamente
   */
  static async getActiveBrands(): Promise<ApiResponse<Brand[]>> {
    try {
      const response = await this.getBrands();
      const activeBrands = response.data.filter(brand => brand.is_active);
      return {
        data: activeBrands,
        status: 'success',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

