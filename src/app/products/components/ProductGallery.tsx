'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/scraping';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, Heart, Share2 } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
  shopDomain: string;
}

export function ProductGallery({ images, title, shopDomain }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square flex items-center justify-center bg-slate-100">
        <div className="text-center text-slate-500">
          <p>Imagen no disponible</p>
        </div>
      </Card>
    );
  }

  const currentImage = images[currentImageIndex];
  const proxiedImage = getProxiedImageUrl(currentImage, 800, 800);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <Card className="relative aspect-square overflow-hidden group">
        <Image
          src={proxiedImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        
        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Botones de acción */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsZoomed(!isZoomed)}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicador de imagen actual */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const proxiedThumbnail = getProxiedImageUrl(image, 100, 100);
            
            return (
              <button
                key={index}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex 
                    ? 'border-blue-500' 
                    : 'border-transparent hover:border-slate-300'
                }`}
                onClick={() => goToImage(index)}
              >
                <Image
                  src={proxiedThumbnail}
                  alt={`${title} - Imagen ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de zoom */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={getProxiedImageUrl(currentImage, 1200, 1200)}
              alt={title}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

