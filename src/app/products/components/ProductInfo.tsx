'use client';

import { useState } from 'react';
import { ScrapedProduct } from '@/lib/scraping';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Truck, Shield, RotateCcw, Heart, Share2 } from 'lucide-react';

interface ProductInfoProps {
  product: ScrapedProduct;
  shopInfo: {
    name: string;
    description: string;
    currency: string;
    domain: string;
    logo?: string;
  };
}

export function ProductInfo({ product, shopInfo }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);

  // Calcular precio y descuento
  const currentPrice = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.compareAtPrice || product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Formatear precio
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            {product.title}
          </h1>
          <Button variant="ghost" size="icon" className="ml-4">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-slate-600">por</span>
          <span className="font-medium text-slate-900">{product.vendor}</span>
          {hasDiscount && (
            <Badge className="bg-green-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Precio */}
        <div className="flex items-baseline space-x-3 mb-4">
          <span className="text-3xl font-bold text-blue-600">
            {formatPrice(currentPrice, product.currency)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-slate-500 line-through">
              {formatPrice(originalPrice, product.currency)}
            </span>
          )}
        </div>

        {/* Rating y reviews */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">4.2 (128 reseñas)</span>
        </div>
      </div>

      {/* Variantes */}
      {product.variants.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Opciones disponibles</h3>
            <div className="space-y-3">
              {product.variants.map((variant) => (
                <div key={variant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`variant-${variant.id}`}
                      name="variant"
                      value={variant.id}
                      checked={selectedVariant?.id === variant.id}
                      onChange={() => setSelectedVariant(variant)}
                      className="text-blue-600"
                    />
                    <label 
                      htmlFor={`variant-${variant.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {variant.title}
                    </label>
                  </div>
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cantidad */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Cantidad:</label>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 p-0"
          >
            -
          </Button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          product.available ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className={`text-sm font-medium ${
          product.available ? 'text-green-600' : 'text-red-600'
        }`}>
          {product.available ? 'En stock' : 'Agotado'}
        </span>
      </div>

      {/* Información de envío */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Envío gratis</div>
                <div className="text-sm text-slate-600">
                  En pedidos superiores a $50.000
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Compra segura</div>
                <div className="text-sm text-slate-600">
                  Protección SSL y garantía de devolución
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Devoluciones</div>
                <div className="text-sm text-slate-600">
                  30 días para devoluciones
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción secundarios */}
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1">
          <Heart className="h-4 w-4 mr-2" />
          Guardar
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>

      {/* Información adicional */}
      <div className="text-sm text-slate-600 space-y-2">
        <p>
          <strong>SKU:</strong> {selectedVariant?.sku || 'N/A'}
        </p>
        <p>
          <strong>Tienda:</strong> {shopInfo.name}
        </p>
        <p>
          <strong>Última actualización:</strong> {new Date(product.scrapedAt).toLocaleString('es-ES')}
        </p>
      </div>
    </div>
  );
}

