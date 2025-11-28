import { cache } from 'react';

// Tipos para el scraping
export interface ScrapedProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  variants: ProductVariant[];
  vendor: string;
  tags: string[];
  available: boolean;
  shopDomain: string;
  scrapedAt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
  sku?: string;
}

export interface ScrapingOptions {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  ttl?: number; // Time to live in minutes
}

// Cache en memoria para optimizar scraping
const memoryCache = new Map<string, { data: ScrapedProduct; timestamp: number }>();

// Función para limpiar cache expirado
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of memoryCache.entries()) {
    if (now - value.timestamp > 15 * 60 * 1000) { // 15 minutos
      memoryCache.delete(key);
    }
  }
};

// Función para obtener cache key
const getCacheKey = (shopDomain: string, productHandle: string) => 
  `product:${shopDomain}:${productHandle}`;

// Función para scrapear un producto individual
export const scrapeSingleProduct = cache(async (
  shopDomain: string, 
  productHandle: string,
  options: ScrapingOptions = {}
): Promise<ScrapedProduct> => {
  const { timeout = 10000, retries = 3, cache = true, ttl = 15 } = options;
  
  // Verificar cache primero
  if (cache) {
    cleanExpiredCache();
    const cacheKey = getCacheKey(shopDomain, productHandle);
    const cached = memoryCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < ttl * 60 * 1000) {
      return cached.data;
    }
  }

  // Construir URL del producto
  const productUrl = `https://${shopDomain}/products/${productHandle}.js`;
  
  let lastError: Error | null = null;
  
  // Reintentos
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(productUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ProductScraper/1.0)',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const productData = await response.json();
      
      // Transformar datos de Shopify a nuestro formato
      const scrapedProduct: ScrapedProduct = {
        id: productData.id?.toString() || `${shopDomain}-${productHandle}`,
        handle: productHandle,
        title: productData.title || 'Producto sin título',
        description: productData.description || '',
        price: productData.price || 0,
        originalPrice: productData.compare_at_price || undefined,
        currency: productData.price ? 'USD' : 'COP', // Detectar moneda
        images: productData.images?.map((img: any) => img.src || img) || [],
        variants: productData.variants?.map((variant: any) => ({
          id: variant.id?.toString() || '',
          title: variant.title || 'Default Title',
          price: variant.price || 0,
          compareAtPrice: variant.compare_at_price || undefined,
          available: variant.available || false,
          option1: variant.option1,
          option2: variant.option2,
          option3: variant.option3,
          sku: variant.sku,
        })) || [],
        vendor: productData.vendor || shopDomain,
        tags: productData.tags || [],
        available: productData.available || false,
        shopDomain,
        scrapedAt: new Date().toISOString(),
      };

      // Guardar en cache
      if (cache) {
        const cacheKey = getCacheKey(shopDomain, productHandle);
        memoryCache.set(cacheKey, {
          data: scrapedProduct,
          timestamp: Date.now(),
        });
      }

      return scrapedProduct;

    } catch (error) {
      lastError = error as Error;
      console.warn(`Intento ${attempt} falló para ${shopDomain}/${productHandle}:`, error);
      
      if (attempt < retries) {
        // Esperar antes del siguiente intento (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // Si todos los intentos fallaron, lanzar error
  throw new Error(`No se pudo scrapear el producto ${shopDomain}/${productHandle} después de ${retries} intentos. Último error: ${lastError?.message}`);
});

// Función para scrapear múltiples productos
export const scrapeMultipleProducts = async (
  products: Array<{ shopDomain: string; productHandle: string }>,
  options: ScrapingOptions = {}
): Promise<ScrapedProduct[]> => {
  const results: ScrapedProduct[] = [];
  const errors: Array<{ shopDomain: string; productHandle: string; error: string }> = [];

  // Procesar en lotes para evitar sobrecargar
  const batchSize = 5;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async ({ shopDomain, productHandle }) => {
      try {
        const product = await scrapeSingleProduct(shopDomain, productHandle, options);
        return { success: true, product };
      } catch (error) {
        return { 
          success: false, 
          error: (error as Error).message,
          shopDomain,
          productHandle 
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(result => {
      if (result.success) {
        results.push(result.product);
      } else {
        errors.push({
          shopDomain: result.shopDomain,
          productHandle: result.productHandle,
          error: result.error,
        });
      }
    });

    // Pequeña pausa entre lotes
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (errors.length > 0) {
    console.warn('Errores en scraping:', errors);
  }

  return results;
};

// Función para obtener información de la tienda
export const scrapeShopInfo = async (shopDomain: string): Promise<{
  name: string;
  description: string;
  currency: string;
  domain: string;
  logo?: string;
}> => {
  try {
    const shopUrl = `https://${shopDomain}/shop.json`;
    
    const response = await fetch(shopUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShopScraper/1.0)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const shopData = await response.json();
    
    return {
      name: shopData.name || shopDomain,
      description: shopData.description || '',
      currency: shopData.currency || 'USD',
      domain: shopDomain,
      logo: shopData.logo?.src,
    };
  } catch (error) {
    console.warn(`No se pudo obtener información de la tienda ${shopDomain}:`, error);
    return {
      name: shopDomain,
      description: '',
      currency: 'USD',
      domain: shopDomain,
    };
  }
};

// Función para validar si una URL es de Shopify
export const isValidShopifyUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('myshopify.com') || 
           urlObj.hostname.includes('shopify.com') ||
           urlObj.pathname.includes('/products/');
  } catch {
    return false;
  }
};

// Función para extraer shopDomain y productHandle de una URL
export const parseShopifyUrl = (url: string): { shopDomain: string; productHandle: string } | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/products\/([^\/\?]+)/);
    
    if (pathMatch) {
      return {
        shopDomain: urlObj.hostname,
        productHandle: pathMatch[1],
      };
    }
    
    return null;
  } catch {
    return null;
  }
};

// Función para generar URL de imagen proxy (sin almacenar)
export const getProxiedImageUrl = (originalUrl: string, width?: number, height?: number): string => {
  if (!originalUrl) return '/placeholder-product.jpg';
  
  // Si es una URL relativa, convertir a absoluta
  if (originalUrl.startsWith('//')) {
    originalUrl = 'https:' + originalUrl;
  } else if (originalUrl.startsWith('/')) {
    // URL relativa, necesitaríamos el dominio de la tienda
    return originalUrl;
  }
  
  // Para URLs absolutas, usar un proxy de imágenes
  const params = new URLSearchParams();
  params.set('url', originalUrl);
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  
  return `/api/image-proxy?${params.toString()}`;
};

// Función para limpiar cache manualmente
export const clearScrapingCache = (shopDomain?: string, productHandle?: string) => {
  if (shopDomain && productHandle) {
    const cacheKey = getCacheKey(shopDomain, productHandle);
    memoryCache.delete(cacheKey);
  } else if (shopDomain) {
    // Limpiar todos los productos de una tienda
    for (const key of memoryCache.keys()) {
      if (key.includes(shopDomain)) {
        memoryCache.delete(key);
      }
    }
  } else {
    // Limpiar todo el cache
    memoryCache.clear();
  }
};

// Función para obtener estadísticas del cache
export const getCacheStats = () => {
  cleanExpiredCache();
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
};

