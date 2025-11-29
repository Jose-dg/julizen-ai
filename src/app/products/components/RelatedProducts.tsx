'use client';

import { useState, useEffect } from 'react';
import { ScrapedProduct } from '@/lib/scraping';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProxiedImageUrl } from '@/lib/scraping';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface RelatedProductsProps {
  product: ScrapedProduct;
  shopDomain: string;
}

export function RelatedProducts({ product, shopDomain }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<ScrapedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En una implementación real, esto haría una llamada a la API
    // para obtener productos relacionados basados en tags, vendor, etc.
    const fetchRelatedProducts = async () => {
      try {
        // Simular carga de productos relacionados
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Por ahora, retornamos un array vacío
        // En producción, esto vendría de una API que busque productos similares
        setRelatedProducts([]);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-slate-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <div className="text-center py-8">
          <p className="text-slate-600 mb-4">
            No hay productos relacionados disponibles en este momento.
          </p>
          <Button asChild>
            <Link href={`/products?shop=${shopDomain}`}>
              Ver más productos de {shopDomain}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => {
          const hasDiscount = relatedProduct.originalPrice &&
            relatedProduct.originalPrice > relatedProduct.price;
          const discountPercentage = hasDiscount
            ? Math.round(((relatedProduct.originalPrice! - relatedProduct.price) / relatedProduct.originalPrice!) * 100)
            : 0;

          return (
            <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300">
              <Link href={`/products/${relatedProduct.shopDomain}/${relatedProduct.handle}`}>
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={getProxiedImageUrl(relatedProduct.images[0], 400, 400)}
                    alt={relatedProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasDiscount && (
                    <Badge className="absolute top-2 left-2 bg-green-600">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>

              <CardContent className="p-4">
                <Link href={`/products/${relatedProduct.shopDomain}/${relatedProduct.handle}`}>
                  <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {relatedProduct.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(relatedProduct.price, relatedProduct.currency)}
                    </p>
                    {hasDiscount && (
                      <p className="text-sm text-slate-500 line-through">
                        {formatPrice(relatedProduct.originalPrice!, relatedProduct.currency)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-600">4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {relatedProduct.vendor}
                  </span>
                  <Button size="sm" variant="outline" className="h-8">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

