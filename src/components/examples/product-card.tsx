'use client';

import { useState } from 'react';
import { Product } from '@/types/api';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onAddToWishlist }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<{
    color: string;
    size: string;
  } | null>(null);
  
  const { addItem, isLoading, isProductInCart, getProductQuantity } = useCartStore();

  // Determinar variantes disponibles
  const availableColors = product.variants.colors?.map(c => c.name) || [];
  const availableSizes = product.variants.sizes?.map(s => s.size) || [];

  // Seleccionar primera variante disponible por defecto
  if (!selectedVariant && availableColors.length > 0 && availableSizes.length > 0) {
    setSelectedVariant({
      color: availableColors[0],
      size: availableSizes[0],
    });
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      await addItem({
        product_id: product.id,
        quantity: 1,
        selected_variant: selectedVariant,
      });
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const isInCart = selectedVariant ? isProductInCart(product.id, selectedVariant) : false;
  const quantityInCart = selectedVariant ? getProductQuantity(product.id, selectedVariant) : 0;

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(price));
  };

  const hasDiscount = product.original_price && parseFloat(product.original_price) > parseFloat(product.price);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Badge de descuento */}
      {hasDiscount && (
        <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
          -{Math.round(((parseFloat(product.original_price!) - parseFloat(product.price)) / parseFloat(product.original_price!)) * 100)}%
        </Badge>
      )}

      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={() => onAddToWishlist?.(product)}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={() => onViewDetails?.(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-sm font-medium">
          {product.name}
        </CardTitle>
        
        {/* Precio */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.original_price!)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {/* Variantes */}
        {availableColors.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">Color:</p>
            <div className="flex gap-1">
              {availableColors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  className={`h-4 w-4 rounded-full border-2 transition-all ${
                    selectedVariant?.color === color
                      ? 'border-primary scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedVariant(prev => prev ? { ...prev, color } : null)}
                />
              ))}
              {availableColors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{availableColors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">Talla:</p>
            <div className="flex gap-1">
              {availableSizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  className={`h-6 w-6 text-xs rounded border transition-all ${
                    selectedVariant?.size === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  onClick={() => setSelectedVariant(prev => prev ? { ...prev, size } : null)}
                >
                  {size}
                </button>
              ))}
              {availableSizes.length > 5 && (
                <span className="text-xs text-muted-foreground">+{availableSizes.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* Tags de IA */}
        {product.ai_tags && product.ai_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.ai_tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant || !product.in_stock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isInCart ? `En carrito (${quantityInCart})` : 'Agregar al carrito'}
        </Button>
      </CardFooter>

      {/* Estado de stock */}
      {!product.in_stock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Badge variant="destructive">Agotado</Badge>
        </div>
      )}
    </Card>
  );
}

