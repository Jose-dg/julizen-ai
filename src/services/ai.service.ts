import { apiClient, handleApiError } from '@/lib/api-client';
import {
  AIRecommendationRequest,
  AIRecommendationsResponse,
  StyleAnalysisRequest,
  StyleAnalysisResponse,
  ProductDescriptionRequest,
  ProductDescriptionResponse,
  ApiResponse,
} from '@/types/api';

export class AIService {
  /**
   * Obtiene recomendaciones personalizadas basadas en IA
   */
  static async getRecommendations(data: AIRecommendationRequest): Promise<ApiResponse<AIRecommendationsResponse>> {
    try {
      return await apiClient.post<AIRecommendationsResponse>('/ai/recommendations/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Analiza el estilo del usuario basado en sus preferencias
   */
  static async analyzeStyle(data: StyleAnalysisRequest): Promise<ApiResponse<StyleAnalysisResponse>> {
    try {
      return await apiClient.post<StyleAnalysisResponse>('/ai/style-analysis/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Genera una descripción mejorada de un producto usando IA
   */
  static async generateProductDescription(data: ProductDescriptionRequest): Promise<ApiResponse<ProductDescriptionResponse>> {
    try {
      return await apiClient.post<ProductDescriptionResponse>('/ai/product-description/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene recomendaciones para la página de inicio
   */
  static async getHomepageRecommendations(userId: string, limit: number = 10): Promise<ApiResponse<AIRecommendationsResponse>> {
    try {
      return await this.getRecommendations({
        user_id: userId,
        context: 'homepage',
        limit,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene recomendaciones para una página de producto
   */
  static async getProductPageRecommendations(
    userId: string, 
    productId: string, 
    limit: number = 5
  ): Promise<ApiResponse<AIRecommendationsResponse>> {
    try {
      return await this.getRecommendations({
        user_id: userId,
        context: 'product_page',
        limit,
        filters: {
          // Excluir el producto actual de las recomendaciones
          // Esto se manejaría en el backend
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene recomendaciones para el carrito
   */
  static async getCartRecommendations(
    userId: string, 
    limit: number = 5
  ): Promise<ApiResponse<AIRecommendationsResponse>> {
    try {
      return await this.getRecommendations({
        user_id: userId,
        context: 'cart',
        limit,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Analiza el estilo del usuario basado en sus compras recientes
   */
  static async analyzeStyleFromPurchases(userId: string): Promise<ApiResponse<StyleAnalysisResponse>> {
    try {
      // En una implementación real, esto obtendría las preferencias del usuario
      // desde su historial de compras y perfil
      return await this.analyzeStyle({
        user_id: userId,
        preferences: {
          colors: ['azul', 'negro'], // Valores por defecto
          styles: ['casual', 'deportivo'],
          budget_range: '50-200',
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Genera descripción de producto para diferentes audiencias
   */
  static async generateProductDescriptionForAudience(
    productId: string,
    targetAudience: 'joven' | 'adulto' | 'profesional',
    style: 'formal' | 'casual' | 'deportivo' = 'casual'
  ): Promise<ApiResponse<ProductDescriptionResponse>> {
    try {
      return await this.generateProductDescription({
        product_id: productId,
        style,
        target_audience: targetAudience,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

