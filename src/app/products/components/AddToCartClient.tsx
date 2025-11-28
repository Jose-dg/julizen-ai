'use client';

import { useState } from 'react';
import { ScrapedProduct } from '@/lib/scraping';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/stores';

interface AddToCartClientProps {
  product: ScrapedProduct;
  shopDomain: string;
  productHandle: string;
}

export function AddToCartClient({ product, shopDomain, productHandle }: AddToCartClientProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);

  const { addItem, getItemsCount } = useCartStore();

  const handleAddToCart = async () => {
    if (!product.available) {
      setError('Este producto no está disponible');
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      // Crear item del carrito
      const cartItem = {
        id: `${shopDomain}-${productHandle}-${selectedVariant?.id || 'default'}`,
        productId: product.id,
        shopDomain,
        productHandle,
        title: product.title,
        price: selectedVariant?.price || product.price,
        currency: product.currency,
        image: product.images[0] || '',
        quantity,
        variant: selectedVariant ? {
          id: selectedVariant.id,
          title: selectedVariant.title,
          option1: selectedVariant.option1,
          option2: selectedVariant.option2,
          option3: selectedVariant.option3,
        } : undefined,
        addedAt: new Date().toISOString(),
      };

      // Agregar al carrito local
      addItem(cartItem);

      // Simular llamada a API (en una implementación real)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);

    } catch (err) {
      setError('Error al agregar al carrito. Inténtalo de nuevo.');
      console.error('Error adding to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      // En una implementación real, esto llamaría a la API de preferencias
      console.log('Agregando a favoritos:', product.id);
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const currentPrice = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.compareAtPrice || product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
    }).format(price);
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        {/* Precio destacado */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(currentPrice, product.currency)}
            </span>
            {hasDiscount && (
              <Badge className="bg-green-600 text-white text-sm">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          {hasDiscount && (
            <div className="text-lg text-slate-500 line-through">
              {formatPrice(originalPrice, product.currency)}
            </div>
          )}
        </div>

        {/* Variantes */}
        {product.variants.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Seleccionar opción:</label>
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    selectedVariant?.id === variant.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{variant.title}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPrice(variant.price, product.currency)}
                      </div>
                      <div className={`text-xs ${
                        variant.available ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {variant.available ? 'Disponible' : 'Agotado'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cantidad */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Cantidad:</label>
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-10 w-10 p-0"
            >
              -
            </Button>
            <span className="text-lg font-semibold min-w-[3rem] text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 p-0"
            >
              +
            </Button>
          </div>
        </div>

        {/* Botón principal */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.available || isAdding || !selectedVariant?.available}
          className="w-full h-12 text-lg font-semibold mb-3"
        >
          {isAdding ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Agregando...</span>
            </div>
          ) : addedToCart ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>¡Agregado!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Agregar al carrito</span>
            </div>
          )}
        </Button>

        {/* Botón de favoritos */}
        <Button
          variant="outline"
          onClick={handleAddToFavorites}
          className="w-full mb-3"
        >
          <Heart className="h-4 w-4 mr-2" />
          Guardar en favoritos
        </Button>

        {/* Error message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm mb-3">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Información del carrito */}
        <div className="text-center text-sm text-slate-600">
          <p>
            {getItemsCount()} {getItemsCount() === 1 ? 'item' : 'items'} en el carrito
          </p>
        </div>

        {/* Información de disponibilidad */}
        {!product.available && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Producto agotado</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Este producto no está disponible actualmente
            </p>
          </div>
        )}

        {/* Información de envío */}
        <div className="mt-4 text-center text-sm text-slate-600">
          <p>🚚 Envío gratis en pedidos superiores a $50.000</p>
          <p>🔄 Devoluciones gratuitas en 30 días</p>
        </div>
      </CardContent>
    </Card>
  );
}

