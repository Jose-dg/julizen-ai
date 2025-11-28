import { useState, useEffect, useCallback } from 'react';
import { BrandsService } from '@/services/brands.service';
import { Brand, ApiError } from '@/types/api';

interface UseBrandsReturn {
  // Estado
  brands: Brand[];
  activeBrands: Brand[];
  selectedBrand: Brand | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchBrands: () => Promise<void>;
  fetchBrand: (id: string) => Promise<void>;
  fetchActiveBrands: () => Promise<void>;
  
  // Helpers
  clearError: () => void;
  clearSelectedBrand: () => void;
}

export const useBrands = (): UseBrandsReturn => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrands, setActiveBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await BrandsService.getBrands();
      setBrands(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar marcas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBrand = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await BrandsService.getBrand(id);
      setSelectedBrand(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar la marca');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActiveBrands = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await BrandsService.getActiveBrands();
      setActiveBrands(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar marcas activas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelectedBrand = useCallback(() => {
    setSelectedBrand(null);
  }, []);

  // Cargar marcas activas automáticamente al montar el hook
  useEffect(() => {
    fetchActiveBrands();
  }, [fetchActiveBrands]);

  return {
    brands,
    activeBrands,
    selectedBrand,
    isLoading,
    error,
    fetchBrands,
    fetchBrand,
    fetchActiveBrands,
    clearError,
    clearSelectedBrand,
  };
};

