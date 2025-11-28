import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/api';
import { CartService } from '@/services/cart.service';

interface CartState {
  // Estado
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchCart: () => Promise<void>;
  addItem: (data: AddToCartRequest) => Promise<void>;
  updateItem: (itemId: string, data: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Helpers
  getItemsCount: () => number;
  getTotalPrice: () => string;
  isProductInCart: (productId: string, variant?: { color: string; size: string }) => boolean;
  getProductQuantity: (productId: string, variant?: { color: string; size: string }) => number;
  
  // Estado local
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cart: null,
      isLoading: false,
      error: null,

      // Acciones
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await CartService.getCart();
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Error al cargar el carrito', 
            isLoading: false 
          });
        }
      },

      addItem: async (data: AddToCartRequest) => {
        set({ isLoading: true, error: null });
        try {
          await CartService.addItem(data);
          // Recargar el carrito después de agregar un item
          await get().fetchCart();
        } catch (error: any) {
          set({ 
            error: error.message || 'Error al agregar producto al carrito', 
            isLoading: false 
          });
        }
      },

      updateItem: async (itemId: string, data: UpdateCartItemRequest) => {
        set({ isLoading: true, error: null });
        try {
          await CartService.updateItem(itemId, data);
          // Recargar el carrito después de actualizar un item
          await get().fetchCart();
        } catch (error: any) {
          set({ 
            error: error.message || 'Error al actualizar el producto', 
            isLoading: false 
          });
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
          await CartService.removeItem(itemId);
          // Recargar el carrito después de eliminar un item
          await get().fetchCart();
        } catch (error: any) {
          set({ 
            error: error.message || 'Error al eliminar el producto', 
            isLoading: false 
          });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await CartService.clearCart();
          set({ cart: null, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Error al limpiar el carrito', 
            isLoading: false 
          });
        }
      },

      // Helpers
      getItemsCount: () => {
        const { cart } = get();
        return cart?.items_count || 0;
      },

      getTotalPrice: () => {
        const { cart } = get();
        return cart?.total_price || '0.00';
      },

      isProductInCart: (productId: string, variant?: { color: string; size: string }) => {
        const { cart } = get();
        if (!cart) return false;
        
        return cart.items.some(
          item => item.product_id === productId && 
          (!variant || (
            item.selected_variant.color === variant.color && 
            item.selected_variant.size === variant.size
          ))
        );
      },

      getProductQuantity: (productId: string, variant?: { color: string; size: string }) => {
        const { cart } = get();
        if (!cart) return 0;
        
        const item = cart.items.find(
          item => item.product_id === productId && 
          (!variant || (
            item.selected_variant.color === variant.color && 
            item.selected_variant.size === variant.size
          ))
        );
        
        return item?.quantity || 0;
      },

      // Estado local
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'cart-storage',
      // Solo persistir el carrito, no el estado de loading/error
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

