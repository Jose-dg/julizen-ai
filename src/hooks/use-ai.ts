import { useState, useCallback } from 'react';
import { AIService } from '@/services/ai.service';
import {
  AIRecommendationRequest,
  AIRecommendationsResponse,
  StyleAnalysisRequest,
  StyleAnalysisResponse,
  ProductDescriptionRequest,
  ProductDescriptionResponse,
  ApiError,
} from '@/types/api';

interface UseAIReturn {
  // Estado
  recommendations: AIRecommendationsResponse | null;
  styleAnalysis: StyleAnalysisResponse | null;
  productDescription: ProductDescriptionResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  getRecommendations: (data: AIRecommendationRequest) => Promise<void>;
  analyzeStyle: (data: StyleAnalysisRequest) => Promise<void>;
  generateProductDescription: (data: ProductDescriptionRequest) => Promise<void>;
  getHomepageRecommendations: (userId: string, limit?: number) => Promise<void>;
  getProductPageRecommendations: (userId: string, productId: string, limit?: number) => Promise<void>;
  getCartRecommendations: (userId: string, limit?: number) => Promise<void>;
  analyzeStyleFromPurchases: (userId: string) => Promise<void>;
  generateProductDescriptionForAudience: (
    productId: string,
    targetAudience: 'joven' | 'adulto' | 'profesional',
    style?: 'formal' | 'casual' | 'deportivo'
  ) => Promise<void>;
  
  // Helpers
  clearError: () => void;
  clearRecommendations: () => void;
  clearStyleAnalysis: () => void;
  clearProductDescription: () => void;
}

export const useAI = (): UseAIReturn => {
  const [recommendations, setRecommendations] = useState<AIRecommendationsResponse | null>(null);
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisResponse | null>(null);
  const [productDescription, setProductDescription] = useState<ProductDescriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (data: AIRecommendationRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.getRecommendations(data);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeStyle = useCallback(async (data: StyleAnalysisRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.analyzeStyle(data);
      setStyleAnalysis(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al analizar el estilo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateProductDescription = useCallback(async (data: ProductDescriptionRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.generateProductDescription(data);
      setProductDescription(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al generar descripción del producto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHomepageRecommendations = useCallback(async (userId: string, limit: number = 10): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.getHomepageRecommendations(userId, limit);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones para la página de inicio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProductPageRecommendations = useCallback(async (
    userId: string, 
    productId: string, 
    limit: number = 5
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.getProductPageRecommendations(userId, productId, limit);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones para el producto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCartRecommendations = useCallback(async (userId: string, limit: number = 5): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.getCartRecommendations(userId, limit);
      setRecommendations(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al obtener recomendaciones para el carrito');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeStyleFromPurchases = useCallback(async (userId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.analyzeStyleFromPurchases(userId);
      setStyleAnalysis(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al analizar el estilo desde las compras');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateProductDescriptionForAudience = useCallback(async (
    productId: string,
    targetAudience: 'joven' | 'adulto' | 'profesional',
    style: 'formal' | 'casual' | 'deportivo' = 'casual'
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AIService.generateProductDescriptionForAudience(productId, targetAudience, style);
      setProductDescription(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al generar descripción para la audiencia');
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

  const clearStyleAnalysis = useCallback(() => {
    setStyleAnalysis(null);
  }, []);

  const clearProductDescription = useCallback(() => {
    setProductDescription(null);
  }, []);

  return {
    recommendations,
    styleAnalysis,
    productDescription,
    isLoading,
    error,
    getRecommendations,
    analyzeStyle,
    generateProductDescription,
    getHomepageRecommendations,
    getProductPageRecommendations,
    getCartRecommendations,
    analyzeStyleFromPurchases,
    generateProductDescriptionForAudience,
    clearError,
    clearRecommendations,
    clearStyleAnalysis,
    clearProductDescription,
  };
};

