'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHybridCartStore, HybridCartItem } from '@/stores/hybrid-cart.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  Heart,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getProxiedImageUrl } from '@/lib/scraping';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    favorites,
    isLoading,
    error,
    getItemsCount,
    getTotalPrice,
    getFavoritesCount,
    updateItem,
    removeItem,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    syncWithBackend,
    lastSync,
    syncInProgress,
  } = useHybridCartStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Sincronizar con backend al cargar la página
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      syncWithBackend(userId);
    }
  }, [syncWithBackend]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
    }).format(price);
  };

  const handleQuantityChange = (item: HybridCartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateItem(item.id, newQuantity);
    }
  };

  const handleMoveToFavorites = (item: HybridCartItem) => {
    addToFavorites({
      id: `fav-${item.id}`,
      productId: item.productId,
      shopDomain: item.shopDomain,
      productHandle: item.productHandle,
      title: item.title,
      price: item.price,
      currency: item.currency,
      image: item.image,
      addedAt: new Date().toISOString(),
    });
    removeItem(item.id);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Sincronizar antes del checkout
      const userId = localStorage.getItem('user_id');
      if (userId) {
        await syncWithBackend(userId);
      }
      
      // Redirigir al checkout (implementar según tu sistema de pagos)
      router.push('/checkout');
    } catch (error) {
      console.error('Error en checkout:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-2xl font-bold">Carrito de Compras</h1>
              <Badge variant="secondary">
                {getItemsCount()} {getItemsCount() === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            
            {lastSync && (
              <div className="text-sm text-slate-500">
                Última sincronización: {new Date(lastSync).toLocaleTimeString('es-ES')}
                {syncInProgress && (
                  <span className="ml-2 text-blue-600">Sincronizando...</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          // Carrito vacío
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-slate-600 mb-8">
              Agrega algunos productos para comenzar tu compra
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                Explorar Productos
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Imagen del producto */}
                    <div className="w-32 h-32 flex-shrink-0">
                      <Image
                        src={getProxiedImageUrl(item.image, 200, 200)}
                        alt={item.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <Link 
                            href={`/products/${item.shopDomain}/${item.productHandle}`}
                            className="text-lg font-semibold hover:text-blue-600 transition-colors"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-slate-600">
                            {item.shopDomain}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-slate-500">
                              Variante: {item.variant.title}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatPrice(item.price, item.currency)} c/u
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveToFavorites(item)}
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Guardar para después
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link href={`https://${item.shopDomain}/products/${item.productHandle}`} target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver en tienda
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getItemsCount()} items)</span>
                    <span className="font-semibold">
                      {formatPrice(getTotalPrice(), 'COP')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-green-600 font-semibold">Gratis</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Impuestos</span>
                    <span>Calculado en checkout</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice(), 'COP')}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full h-12 text-lg"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Proceder al Pago</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Información de envío */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Envío Gratis</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    En pedidos superiores a $50.000
                  </p>
                </CardContent>
              </Card>

              {/* Garantías */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Compra Segura</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Protección SSL y garantía de devolución
                  </p>
                </CardContent>
              </Card>

              {/* Favoritos */}
              {favorites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Guardados para después</span>
                      <Badge variant="secondary">{getFavoritesCount()}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {favorites.slice(0, 3).map((fav) => (
                        <div key={fav.id} className="flex items-center space-x-3">
                          <Image
                            src={getProxiedImageUrl(fav.image, 50, 50)}
                            alt={fav.title}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fav.title}</p>
                            <p className="text-xs text-slate-500">{fav.shopDomain}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromFavorites(fav.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {favorites.length > 3 && (
                        <p className="text-sm text-slate-500 text-center">
                          Y {favorites.length - 3} más...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

