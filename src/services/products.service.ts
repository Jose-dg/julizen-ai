import { apiClient, handleApiError } from '@/lib/api-client';
import {
  Product,
  ProductFilters,
  ProductSearchRequest,
  ProductSearchResponse,
  Category,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

export class ProductsService {
  /**
   * Obtiene la lista de productos con filtros y paginación
   */
  static async getProducts(filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
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
      const url = queryString ? `/products/?${queryString}` : '/products/';
      
      return await apiClient.get<PaginatedResponse<Product>>(url);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene los detalles de un producto específico
   */
  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      return await apiClient.get<Product>(`/products/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Búsqueda semántica de productos usando IA
   */
  static async searchProducts(data: ProductSearchRequest): Promise<ApiResponse<ProductSearchResponse>> {
    try {
      return await apiClient.post<ProductSearchResponse>('/products/search/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      return await apiClient.get<Category[]>('/products/categories/');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene productos por categoría
   */
  static async getProductsByCategory(
    category: string,
    filters?: Omit<ProductFilters, 'category'>
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      return await this.getProducts({ ...filters, category });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene productos por marca
   */
  static async getProductsByBrand(
    brandId: string,
    filters?: Omit<ProductFilters, 'brand_id'>
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      return await this.getProducts({ ...filters, brand_id: brandId });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene productos en oferta (con descuento)
   */
  static async getProductsOnSale(filters?: Omit<ProductFilters, 'min_price' | 'max_price'>): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      // Filtrar productos que tienen original_price mayor que price
      const response = await this.getProducts(filters);
      
      if (response.data.results) {
        response.data.results = response.data.results.filter(
          product => product.original_price && parseFloat(product.original_price) > parseFloat(product.price)
        );
      }
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene productos más vendidos (simulado - en una implementación real vendría del backend)
   */
  static async getBestSellingProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.getProducts({ page_size: limit, in_stock: true });
      return {
        data: response.data.results,
        status: 'success',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene productos recientes
   */
  static async getRecentProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.getProducts({ page_size: limit });
      return {
        data: response.data.results,
        status: 'success',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

