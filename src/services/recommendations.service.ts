import { apiClient, handleApiError } from '@/lib/api-client';
import {
  RecommendationRequest,
  RecommendationsResponse,
  SimilarProductsResponse,
  ApiResponse,
} from '@/types/api';

export class RecommendationsService {
  /**
   * Obtiene recomendaciones personalizadas para el usuario
   */
  static async getRecommendations(filters?: RecommendationRequest): Promise<ApiResponse<RecommendationsResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const url = queryString ? `/recommendations/?${queryString}` : '/recommendations/';
      
      return await apiClient.get<RecommendationsResponse>(url);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene productos similares a uno específico
   */
  static async getSimilarProducts(productId: string): Promise<ApiResponse<SimilarProductsResponse>> {
    try {
      return await apiClient.get<SimilarProductsResponse>(`/recommendations/similar/${productId}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene recomendaciones trending
   */
  static async getTrendingRecommendations(limit: number = 10): Promise<ApiResponse<RecommendationsResponse>> {
    try {
      return await this.getRecommendations({ type: 'trending', limit });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene recomendaciones personalizadas
   */
  static async getPersonalizedRecommendations(limit: number = 10): Promise<ApiResponse<RecommendationsResponse>> {
    try {
      return await this.getRecommendations({ type: 'personalized', limit });
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

