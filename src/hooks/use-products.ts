import { useState, useCallback } from 'react';
import { ProductsService } from '@/services/products.service';
import { 
  Product, 
  ProductFilters, 
  ProductSearchRequest, 
  ProductSearchResponse, 
  Category, 
  PaginatedResponse, 
  ApiError 
} from '@/types/api';

interface UseProductsReturn {
  // Estado
  products: Product[];
  product: Product | null;
  categories: Category[];
  searchResults: ProductSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
    total_pages: number;
  } | null;
  
  // Acciones
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  searchProducts: (data: ProductSearchRequest) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductsByCategory: (category: string, filters?: Omit<ProductFilters, 'category'>) => Promise<void>;
  fetchProductsByBrand: (brandId: string, filters?: Omit<ProductFilters, 'brand_id'>) => Promise<void>;
  fetchProductsOnSale: (filters?: Omit<ProductFilters, 'min_price' | 'max_price'>) => Promise<void>;
  fetchBestSellingProducts: (limit?: number) => Promise<void>;
  fetchRecentProducts: (limit?: number) => Promise<void>;
  
  // Helpers
  clearError: () => void;
  clearProduct: () => void;
  clearSearchResults: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<ProductSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
    total_pages: number;
  } | null>(null);

  const fetchProducts = useCallback(async (filters?: ProductFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getProducts(filters);
      setProducts(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: response.data.page,
        total_pages: response.data.total_pages,
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProduct = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getProduct(id);
      setProduct(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar el producto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (data: ProductSearchRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.searchProducts(data);
      setSearchResults(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error en la búsqueda');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getCategories();
      setCategories(response.data);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (
    category: string, 
    filters?: Omit<ProductFilters, 'category'>
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getProductsByCategory(category, filters);
      setProducts(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: response.data.page,
        total_pages: response.data.total_pages,
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar productos por categoría');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductsByBrand = useCallback(async (
    brandId: string, 
    filters?: Omit<ProductFilters, 'brand_id'>
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getProductsByBrand(brandId, filters);
      setProducts(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: response.data.page,
        total_pages: response.data.total_pages,
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar productos por marca');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductsOnSale = useCallback(async (
    filters?: Omit<ProductFilters, 'min_price' | 'max_price'>
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getProductsOnSale(filters);
      setProducts(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        page: response.data.page,
        total_pages: response.data.total_pages,
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar productos en oferta');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBestSellingProducts = useCallback(async (limit: number = 10): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getBestSellingProducts(limit);
      setProducts(response.data);
      setPagination(null);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar productos más vendidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecentProducts = useCallback(async (limit: number = 10): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ProductsService.getRecentProducts(limit);
      setProducts(response.data);
      setPagination(null);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar productos recientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);

  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
  }, []);

  return {
    products,
    product,
    categories,
    searchResults,
    isLoading,
    error,
    pagination,
    fetchProducts,
    fetchProduct,
    searchProducts,
    fetchCategories,
    fetchProductsByCategory,
    fetchProductsByBrand,
    fetchProductsOnSale,
    fetchBestSellingProducts,
    fetchRecentProducts,
    clearError,
    clearProduct,
    clearSearchResults,
  };
};

