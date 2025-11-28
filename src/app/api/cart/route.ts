import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

// Tipos para el carrito local
export interface LocalCartItem {
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

export interface LocalCart {
  items: LocalCartItem[];
  lastSync: string | null;
  total: number;
  itemsCount: number;
}

// GET /api/cart - Obtener carrito local
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const syncWithBackend = searchParams.get('sync') === 'true';

    // Si hay userId y se solicita sync, obtener del backend
    if (userId && syncWithBackend) {
      try {
        const backendCart = await apiClient.get('/cart/');
        return NextResponse.json({
          success: true,
          data: backendCart.data,
          source: 'backend',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Error al sincronizar con backend:', error);
        // Continuar con carrito local
      }
    }

    // Por defecto, retornar carrito local vacío
    // En una implementación real, esto vendría de localStorage o una base de datos local
    const localCart: LocalCart = {
      items: [],
      lastSync: null,
      total: 0,
      itemsCount: 0,
    };

    return NextResponse.json({
      success: true,
      data: localCart,
      source: 'local',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en GET /api/cart:', error);
    
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

// POST /api/cart - Agregar item al carrito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productId,
      shopDomain,
      productHandle,
      title,
      price,
      currency,
      image,
      quantity = 1,
      variant,
      userId
    } = body;

    // Validar datos requeridos
    if (!productId || !shopDomain || !productHandle || !title || !price) {
      return NextResponse.json(
        { error: 'Datos del producto incompletos' },
        { status: 400 }
      );
    }

    // Crear item del carrito
    const cartItem: LocalCartItem = {
      id: `${shopDomain}-${productHandle}-${variant?.id || 'default'}`,
      productId,
      shopDomain,
      productHandle,
      title,
      price,
      currency,
      image,
      quantity,
      variant,
      addedAt: new Date().toISOString(),
    };

    // Si hay userId, intentar sincronizar con backend
    if (userId) {
      try {
        const backendResponse = await apiClient.post('/cart/add-item/', {
          product_id: productId,
          quantity,
          selected_variant: variant,
          product_data: {
            title,
            price,
            currency,
            image,
            shop_domain: shopDomain,
            product_handle: productHandle,
          }
        });

        return NextResponse.json({
          success: true,
          data: backendResponse.data,
          source: 'backend',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Error al sincronizar con backend:', error);
        // Continuar con carrito local
      }
    }

    // Retornar item agregado (en una implementación real, se guardaría en localStorage)
    return NextResponse.json({
      success: true,
      data: cartItem,
      source: 'local',
      message: 'Item agregado al carrito local',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en POST /api/cart:', error);
    
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

// PUT /api/cart - Actualizar item del carrito
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      itemId,
      quantity,
      userId
    } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'itemId y quantity son requeridos' },
        { status: 400 }
      );
    }

    // Si hay userId, intentar sincronizar con backend
    if (userId) {
      try {
        const backendResponse = await apiClient.put(`/cart/items/${itemId}/`, {
          quantity
        });

        return NextResponse.json({
          success: true,
          data: backendResponse.data,
          source: 'backend',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Error al sincronizar con backend:', error);
        // Continuar con carrito local
      }
    }

    // Retornar item actualizado (en una implementación real, se actualizaría en localStorage)
    return NextResponse.json({
      success: true,
      data: { itemId, quantity },
      source: 'local',
      message: 'Item actualizado en carrito local',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en PUT /api/cart:', error);
    
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

// DELETE /api/cart - Eliminar item del carrito
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = searchParams.get('userId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId es requerido' },
        { status: 400 }
      );
    }

    // Si hay userId, intentar sincronizar con backend
    if (userId) {
      try {
        const backendResponse = await apiClient.delete(`/cart/items/${itemId}/`);

        return NextResponse.json({
          success: true,
          data: backendResponse.data,
          source: 'backend',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Error al sincronizar con backend:', error);
        // Continuar con carrito local
      }
    }

    // Retornar confirmación de eliminación (en una implementación real, se eliminaría de localStorage)
    return NextResponse.json({
      success: true,
      data: { itemId },
      source: 'local',
      message: 'Item eliminado del carrito local',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en DELETE /api/cart:', error);
    
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

