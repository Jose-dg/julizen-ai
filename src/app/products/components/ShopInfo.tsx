'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, MapPin, Clock, Shield } from 'lucide-react';

interface ShopInfoProps {
  shopInfo: {
    name: string;
    description: string;
    currency: string;
    domain: string;
    logo?: string;
  };
  shopDomain: string;
}

export function ShopInfo({ shopInfo, shopDomain }: ShopInfoProps) {
  const handleVisitShop = () => {
    window.open(`https://${shopDomain}`, '_blank');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {shopInfo.logo && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                <img
                  src={shopInfo.logo}
                  alt={`Logo de ${shopInfo.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900">{shopInfo.name}</h3>
              <p className="text-slate-600 text-sm">{shopDomain}</p>
            </div>
          </div>
          <Button onClick={handleVisitShop} variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visitar tienda
          </Button>
        </div>

        {shopInfo.description && (
          <p className="text-slate-700 mb-4">{shopInfo.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-slate-600">4.8/5 (1,234 reseñas)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm text-slate-600">Tienda verificada</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-slate-600">Activa desde 2020</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Envío rápido</Badge>
          <Badge variant="secondary">Devoluciones</Badge>
          <Badge variant="secondary">Soporte 24/7</Badge>
          <Badge variant="secondary">Pago seguro</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

