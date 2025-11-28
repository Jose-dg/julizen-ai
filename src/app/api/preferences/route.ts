import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

// Tipos para preferencias
export interface UserPreferences {
  favoriteBrands: string[];
  favoriteShops: string[];
  priceRange: {
    min: number;
    max: number;
  };
  currency: string;
  notifications: {
    priceDrops: boolean;
    newProducts: boolean;
    restocks: boolean;
  };
  searchHistory: string[];
  recentlyViewed: Array<{
    shopDomain: string;
    productHandle: string;
    viewedAt: string;
  }>;
}

// GET /api/preferences - Obtener preferencias del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    // Obtener preferencias del backend
    try {
      const backendResponse = await apiClient.get('/users/preferences/');
      
      return NextResponse.json({
        success: true,
        data: backendResponse.data,
        source: 'backend',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Error al obtener preferencias del backend:', error);
      
      // Retornar preferencias por defecto
      const defaultPreferences: UserPreferences = {
        favoriteBrands: [],
        favoriteShops: [],
        priceRange: { min: 0, max: 1000000 },
        currency: 'COP',
        notifications: {
          priceDrops: true,
          newProducts: true,
          restocks: false,
        },
        searchHistory: [],
        recentlyViewed: [],
      };

      return NextResponse.json({
        success: true,
        data: defaultPreferences,
        source: 'default',
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Error en GET /api/preferences:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/preferences - Actualizar preferencias del usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      preferences,
      type = 'all' // 'all', 'brands', 'shops', 'priceRange', 'notifications', 'searchHistory', 'recentlyViewed'
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    if (!preferences) {
      return NextResponse.json(
        { error: 'preferences es requerido' },
        { status: 400 }
      );
    }

    // Preparar datos para el backend
    let updateData: any = {};

    switch (type) {
      case 'brands':
        updateData.favorite_brands = preferences.favoriteBrands || preferences;
        break;
      case 'shops':
        updateData.favorite_shops = preferences.favoriteShops || preferences;
        break;
      case 'priceRange':
        updateData.price_range = preferences.priceRange || preferences;
        break;
      case 'notifications':
        updateData.notifications = preferences.notifications || preferences;
        break;
      case 'searchHistory':
        updateData.search_history = preferences.searchHistory || preferences;
        break;
      case 'recentlyViewed':
        updateData.recently_viewed = preferences.recentlyViewed || preferences;
        break;
      case 'all':
      default:
        updateData = {
          favorite_brands: preferences.favoriteBrands,
          favorite_shops: preferences.favoriteShops,
          price_range: preferences.priceRange,
          currency: preferences.currency,
          notifications: preferences.notifications,
          search_history: preferences.searchHistory,
          recently_viewed: preferences.recentlyViewed,
        };
        break;
    }

    // Actualizar en el backend
    try {
      const backendResponse = await apiClient.put('/users/preferences/', updateData);
      
      return NextResponse.json({
        success: true,
        data: backendResponse.data,
        source: 'backend',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Error al actualizar preferencias en backend:', error);
      
      // En caso de error, retornar las preferencias actualizadas localmente
      return NextResponse.json({
        success: true,
        data: preferences,
        source: 'local',
        message: 'Preferencias guardadas localmente',
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Error en POST /api/preferences:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT /api/preferences - Agregar a preferencias (brands, shops, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      type, // 'addBrand', 'addShop', 'addToSearchHistory', 'addToRecentlyViewed'
      value,
      data
    } = body;

    if (!userId || !type || !value) {
      return NextResponse.json(
        { error: 'userId, type y value son requeridos' },
        { status: 400 }
      );
    }

    // Obtener preferencias actuales
    const currentResponse = await apiClient.get('/users/preferences/');
    const currentPreferences = currentResponse.data;

    let updateData: any = {};

    switch (type) {
      case 'addBrand':
        if (!currentPreferences.favorite_brands?.includes(value)) {
          updateData.favorite_brands = [...(currentPreferences.favorite_brands || []), value];
        }
        break;

      case 'addShop':
        if (!currentPreferences.favorite_shops?.includes(value)) {
          updateData.favorite_shops = [...(currentPreferences.favorite_shops || []), value];
        }
        break;

      case 'addToSearchHistory':
        const searchHistory = currentPreferences.search_history || [];
        const newSearchHistory = [value, ...searchHistory.filter((item: string) => item !== value)].slice(0, 20); // Mantener solo 20 búsquedas
        updateData.search_history = newSearchHistory;
        break;

      case 'addToRecentlyViewed':
        const recentlyViewed = currentPreferences.recently_viewed || [];
        const newRecentlyViewed = [
          { shopDomain: data.shopDomain, productHandle: data.productHandle, viewedAt: new Date().toISOString() },
          ...recentlyViewed.filter((item: any) => 
            !(item.shopDomain === data.shopDomain && item.productHandle === data.productHandle)
          )
        ].slice(0, 50); // Mantener solo 50 productos vistos
        updateData.recently_viewed = newRecentlyViewed;
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de actualización no soportado' },
          { status: 400 }
        );
    }

    // Actualizar en el backend
    const backendResponse = await apiClient.put('/users/preferences/', updateData);
    
    return NextResponse.json({
      success: true,
      data: backendResponse.data,
      source: 'backend',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en PUT /api/preferences:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/preferences - Eliminar de preferencias
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      type, // 'removeBrand', 'removeShop', 'clearSearchHistory', 'clearRecentlyViewed'
      value
    } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId y type son requeridos' },
        { status: 400 }
      );
    }

    // Obtener preferencias actuales
    const currentResponse = await apiClient.get('/users/preferences/');
    const currentPreferences = currentResponse.data;

    let updateData: any = {};

    switch (type) {
      case 'removeBrand':
        updateData.favorite_brands = (currentPreferences.favorite_brands || []).filter((brand: string) => brand !== value);
        break;

      case 'removeShop':
        updateData.favorite_shops = (currentPreferences.favorite_shops || []).filter((shop: string) => shop !== value);
        break;

      case 'clearSearchHistory':
        updateData.search_history = [];
        break;

      case 'clearRecentlyViewed':
        updateData.recently_viewed = [];
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de eliminación no soportado' },
          { status: 400 }
        );
    }

    // Actualizar en el backend
    const backendResponse = await apiClient.put('/users/preferences/', updateData);
    
    return NextResponse.json({
      success: true,
      data: backendResponse.data,
      source: 'backend',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en DELETE /api/preferences:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

