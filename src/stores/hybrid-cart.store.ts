import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos para el carrito híbrido
export interface HybridCartItem {
  id: string;
  productId: string;
  shopDomain: string;
  productHandle: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  variant?: {
    id: string;
    title: string;
    option1?: string;
    option2?: string;
    option3?: string;
  };
  addedAt: string;
}

export interface FavoriteItem {
  id: string;
  productId: string;
  shopDomain: string;
  productHandle: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  addedAt: string;
}

interface HybridCartState {
  // Estado local
  items: HybridCartItem[];
  favorites: FavoriteItem[];
  lastSync: string | null;
  syncInProgress: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: HybridCartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  clearFavorites: () => void;
  
  // Getters
  getItemsCount: () => number;
  getTotalPrice: () => number;
  getFavoritesCount: () => number;
  
  // Sincronización
  syncWithBackend: (userId: string) => Promise<void>;
  scheduleSync: (userId: string) => void;
  fetchCart: () => Promise<void>;
  
  // Utilidades
  isItemInCart: (productId: string, variantId?: string) => boolean;
  isItemInFavorites: (productId: string) => boolean;
}

// Variable para el timer de sincronización
let syncTimer: NodeJS.Timeout | null = null;

export const useHybridCartStore = create<HybridCartState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      favorites: [],
      lastSync: null,
      syncInProgress: false,
      isLoading: false,
      error: null,

      // Acciones del carrito
      addItem: (item: HybridCartItem) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return {
            items: [...state.items, item],
          };
        });
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      updateItem: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        }));
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      clearCart: () => {
        set({ items: [] });
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      // Acciones de favoritos
      addToFavorites: (item: FavoriteItem) => {
        set((state) => {
          const exists = state.favorites.some(fav => fav.id === item.id);
          if (exists) return state;
          
          return {
            favorites: [...state.favorites, item],
          };
        });
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      removeFromFavorites: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter(item => item.id !== id),
        }));
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      clearFavorites: () => {
        set({ favorites: [] });
        
        // Programar sincronización
        const userId = localStorage.getItem('user_id');
        if (userId) {
          get().scheduleSync(userId);
        }
      },

      // Getters
      getItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getFavoritesCount: () => {
        return get().favorites.length;
      },

      // Sincronización con backend
      syncWithBackend: async (userId: string) => {
        if (get().syncInProgress) return;
        
        set({ syncInProgress: true, error: null });
        
        try {
          const { items, favorites } = get();
          
          // Sincronizar carrito
          if (items.length > 0) {
            const cartData = {
              localCart: {
                items,
                lastSync: get().lastSync,
                total: get().getTotalPrice(),
                itemsCount: get().getItemsCount(),
              },
              userId,
              direction: 'toBackend'
            };
            
            const response = await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cartData),
            });
            
            if (!response.ok) {
              throw new Error('Error al sincronizar carrito');
            }
          }
          
          // Sincronizar favoritos
          if (favorites.length > 0) {
            const favoritesData = {
              userId,
              type: 'all',
              preferences: {
                favoriteBrands: [...new Set(favorites.map(fav => fav.shopDomain))],
                recentlyViewed: favorites.map(fav => ({
                  shopDomain: fav.shopDomain,
                  productHandle: fav.productHandle,
                  viewedAt: fav.addedAt,
                })),
              }
            };
            
            await fetch('/api/preferences', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(favoritesData),
            });
          }
          
          set({ 
            lastSync: new Date().toISOString(),
            syncInProgress: false 
          });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error de sincronización',
            syncInProgress: false 
          });
          console.error('Error en sincronización:', error);
        }
      },

      // Programar sincronización (debounced)
      scheduleSync: (userId: string) => {
        if (syncTimer) {
          clearTimeout(syncTimer);
        }
        
        syncTimer = setTimeout(() => {
          get().syncWithBackend(userId);
        }, 30000); // 30 segundos
      },

      // Obtener carrito del backend
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const userId = localStorage.getItem('user_id');
          if (!userId) {
            set({ isLoading: false });
            return;
          }
          
          // Obtener carrito del backend
          const response = await fetch(`/api/cart/sync?userId=${userId}`, {
            method: 'GET',
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.data.backendCart) {
              // Convertir items del backend al formato local
              const backendItems: HybridCartItem[] = (data.data.backendCart.items || []).map((item: any) => ({
                id: item.id,
                productId: item.product_id,
                shopDomain: item.product_data?.shop_domain || 'unknown',
                productHandle: item.product_data?.product_handle || 'unknown',
                title: item.product_name || item.product_data?.title || 'Producto',
                price: parseFloat(item.product_price || item.product_data?.price || '0'),
                currency: item.product_data?.currency || 'USD',
                image: item.product_image || item.product_data?.image || '',
                quantity: item.quantity,
                variant: item.selected_variant,
                addedAt: item.created_at || new Date().toISOString(),
              }));
              
              set({ 
                items: backendItems,
                lastSync: data.data.lastSync,
                isLoading: false 
              });
            }
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error desconocido',
            isLoading: false 
          });
        }
      },

      // Utilidades
      isItemInCart: (productId: string, variantId?: string) => {
        const { items } = get();
        return items.some(item => 
          item.productId === productId && 
          (!variantId || item.variant?.id === variantId)
        );
      },

      isItemInFavorites: (productId: string) => {
        const { favorites } = get();
        return favorites.some(item => item.productId === productId);
      },
    }),
    {
      name: 'hybrid-cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        favorites: state.favorites,
        lastSync: state.lastSync,
      }),
    }
  )
);

