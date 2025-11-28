import { apiClient, handleApiError } from '@/lib/api-client';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  CheckoutResponse,
  ApiResponse,
} from '@/types/api';

export class CartService {
  /**
   * Obtiene el carrito activo del usuario
   */
  static async getCart(): Promise<ApiResponse<Cart>> {
    try {
      return await apiClient.get<Cart>('/cart/');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Agrega un producto al carrito
   */
  static async addItem(data: AddToCartRequest): Promise<ApiResponse<CartItem>> {
    try {
      return await apiClient.post<CartItem>('/cart/add-item/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza la cantidad de un item en el carrito
   */
  static async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<ApiResponse<CartItem>> {
    try {
      return await apiClient.put<CartItem>(`/cart/items/${itemId}/`, data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Elimina un item del carrito
   */
  static async removeItem(itemId: string): Promise<ApiResponse<null>> {
    try {
      return await apiClient.delete<null>(`/cart/items/${itemId}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Procesa el checkout del carrito
   */
  static async checkout(data: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> {
    try {
      return await apiClient.post<CheckoutResponse>('/cart/checkout/', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Limpia todo el carrito
   */
  static async clearCart(): Promise<ApiResponse<null>> {
    try {
      return await apiClient.delete<null>('/cart/clear/');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene el número total de items en el carrito
   */
  static async getCartItemsCount(): Promise<number> {
    try {
      const response = await this.getCart();
      return response.data.items_count || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Verifica si un producto está en el carrito
   */
  static async isProductInCart(productId: string, variant?: { color: string; size: string }): Promise<boolean> {
    try {
      const response = await this.getCart();
      const item = response.data.items.find(
        item => item.product_id === productId && 
        (!variant || (
          item.selected_variant.color === variant.color && 
          item.selected_variant.size === variant.size
        ))
      );
      return !!item;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene la cantidad de un producto específico en el carrito
   */
  static async getProductQuantity(productId: string, variant?: { color: string; size: string }): Promise<number> {
    try {
      const response = await this.getCart();
      const item = response.data.items.find(
        item => item.product_id === productId && 
        (!variant || (
          item.selected_variant.color === variant.color && 
          item.selected_variant.size === variant.size
        ))
      );
      return item?.quantity || 0;
    } catch (error) {
      return 0;
    }
  }
}

