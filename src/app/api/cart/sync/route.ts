import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { LocalCart, LocalCartItem } from '../route';

// POST /api/cart/sync - Sincronizar carrito local con backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      localCart,
      userId,
      direction = 'toBackend' // 'toBackend', 'fromBackend', 'bidirectional'
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido para sincronización' },
        { status: 400 }
      );
    }

    let result: any = {};

    switch (direction) {
      case 'toBackend':
        // Sincronizar carrito local hacia el backend
        result = await syncLocalToBackend(localCart, userId);
        break;

      case 'fromBackend':
        // Obtener carrito del backend
        result = await syncFromBackend(userId);
        break;

      case 'bidirectional':
        // Sincronización bidireccional
        result = await syncBidirectional(localCart, userId);
        break;

      default:
        return NextResponse.json(
          { error: 'Dirección de sincronización inválida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      direction,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en sincronización de carrito:', error);

    return NextResponse.json(
      {
        error: 'Error en sincronización',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Función para sincronizar carrito local hacia el backend
async function syncLocalToBackend(localCart: LocalCart, userId: string) {
  try {
    // Obtener carrito actual del backend
    const backendCart = await apiClient.get('/cart/');
    const backendItems = (backendCart.data as any).items || [];

    // Crear mapa de items del backend para comparación
    const backendItemsMap = new Map(
      backendItems.map((item: any) => [item.product_id, item])
    );

    const syncResults = {
      added: [] as any[],
      updated: [] as any[],
      errors: [] as any[],
    };

    // Procesar cada item del carrito local
    for (const localItem of localCart.items) {
      try {
        const backendItem = backendItemsMap.get(localItem.productId) as any;

        if (backendItem) {
          // Item existe en backend, actualizar cantidad si es diferente
          if (backendItem.quantity !== localItem.quantity) {
            await apiClient.put(`/cart/items/${backendItem.id}/`, {
              quantity: localItem.quantity
            });
            syncResults.updated.push({
              productId: localItem.productId,
              oldQuantity: backendItem.quantity,
              newQuantity: localItem.quantity,
            });
          }
        } else {
          // Item no existe en backend, agregarlo
          await apiClient.post('/cart/add-item/', {
            product_id: localItem.productId,
            quantity: localItem.quantity,
            selected_variant: localItem.variant,
            product_data: {
              title: localItem.title,
              price: localItem.price,
              currency: localItem.currency,
              image: localItem.image,
              shop_domain: localItem.shopDomain,
              product_handle: localItem.productHandle,
            }
          });
          syncResults.added.push({
            productId: localItem.productId,
            quantity: localItem.quantity,
          });
        }
      } catch (error) {
        syncResults.errors.push({
          productId: localItem.productId,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    // Obtener carrito actualizado del backend
    const updatedBackendCart = await apiClient.get('/cart/');

    return {
      syncResults,
      backendCart: updatedBackendCart.data,
      localCart,
    };

  } catch (error) {
    throw new Error(`Error al sincronizar con backend: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Función para obtener carrito del backend
async function syncFromBackend(userId: string) {
  try {
    const backendCart = await apiClient.get('/cart/');
    const data = backendCart.data as any;

    // Convertir items del backend al formato local
    const localItems: LocalCartItem[] = (data.items || []).map((item: any) => ({
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

    const localCart: LocalCart = {
      items: localItems,
      lastSync: new Date().toISOString(),
      total: parseFloat(data.total_price || '0'),
      itemsCount: data.items_count || 0,
    };

    return {
      localCart,
      backendCart: backendCart.data,
    };

  } catch (error) {
    throw new Error(`Error al obtener carrito del backend: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Función para sincronización bidireccional
async function syncBidirectional(localCart: LocalCart, userId: string) {
  try {
    // Primero sincronizar local hacia backend
    const toBackendResult = await syncLocalToBackend(localCart, userId);

    // Luego obtener el estado final del backend
    const fromBackendResult = await syncFromBackend(userId);

    return {
      toBackend: toBackendResult,
      fromBackend: fromBackendResult,
      finalCart: fromBackendResult.localCart,
    };

  } catch (error) {
    throw new Error(`Error en sincronización bidireccional: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// GET /api/cart/sync - Obtener estado de sincronización
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

    // Obtener carrito del backend
    const backendCart = await apiClient.get('/cart/');

    // En una implementación real, también obtendrías el carrito local
    // Por ahora retornamos solo el estado del backend
    return NextResponse.json({
      success: true,
      data: {
        backendCart: backendCart.data,
        lastSync: new Date().toISOString(),
        syncStatus: 'up_to_date',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error al obtener estado de sincronización:', error);

    return NextResponse.json(
      {
        error: 'Error al obtener estado de sincronización',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

