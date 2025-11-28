import { useState, useCallback } from 'react';
import { RecommendationsService } from '@/services/recommendations.service';
import {
  RecommendationRequest,
  RecommendationsResponse,
  SimilarProductsResponse,
  ApiError,
} from '@/types/api';

interface UseRecommendationsReturn {
  // Estado
  recommendations: RecommendationsResponse | null;
  similarProducts: SimilarProductsResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  getRecommendations: (filters?: RecommendationRequest) => Promise<void>;
  getSimilarProducts: (productId: string) => Promise<void>;
  getTrendingRecommendations: (limit?: number) => Promise<void>;
  getPersonalizedRecommendations: (limit?: number) => Promise<void>;
  
  // Helpers
  clearError: () => void;
  clearRecommendations: () => void;
  clearSimilarProducts: () => void;
}

export const useRecommendations = (): UseRecommendationsReturn => {
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (filters?: RecommendationRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RecommendationsService.getRecommendations(filters);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSimilarProducts = useCallback(async (productId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RecommendationsService.getSimilarProducts(productId);
      setSimilarProducts(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener productos similares');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTrendingRecommendations = useCallback(async (limit: number = 10): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RecommendationsService.getTrendingRecommendations(limit);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones trending');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPersonalizedRecommendations = useCallback(async (limit: number = 10): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RecommendationsService.getPersonalizedRecommendations(limit);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones personalizadas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRecommendations = useCallback(() => {
    setRecommendations(null);
  }, []);

  const clearSimilarProducts = useCallback(() => {
    setSimilarProducts(null);
  }, []);

  return {
    recommendations,
    similarProducts,
    isLoading,
    error,
    getRecommendations,
    getSimilarProducts,
    getTrendingRecommendations,
    getPersonalizedRecommendations,
    clearError,
    clearRecommendations,
    clearSimilarProducts,
  };
};

