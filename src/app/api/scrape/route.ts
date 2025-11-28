import { NextRequest, NextResponse } from 'next/server';
import { 
  scrapeSingleProduct, 
  scrapeMultipleProducts, 
  scrapeShopInfo,
  isValidShopifyUrl,
  parseShopifyUrl,
  ScrapingOptions 
} from '@/lib/scraping';

// POST /api/scrape - Scrapear productos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type = 'single', // 'single', 'multiple', 'shop'
      url,
      shopDomain,
      productHandle,
      products,
      options = {}
    } = body;

    // Validar entrada
    if (!type || !['single', 'multiple', 'shop'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de scraping inválido. Debe ser: single, multiple, o shop' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'single':
        if (url) {
          // Parsear URL si se proporciona
          const parsed = parseShopifyUrl(url);
          if (!parsed) {
            return NextResponse.json(
              { error: 'URL de Shopify inválida' },
              { status: 400 }
            );
          }
          shopDomain = parsed.shopDomain;
          productHandle = parsed.productHandle;
        }

        if (!shopDomain || !productHandle) {
          return NextResponse.json(
            { error: 'shopDomain y productHandle son requeridos para scraping individual' },
            { status: 400 }
          );
        }

        result = await scrapeSingleProduct(shopDomain, productHandle, options as ScrapingOptions);
        break;

      case 'multiple':
        if (!products || !Array.isArray(products)) {
          return NextResponse.json(
            { error: 'products debe ser un array de objetos con shopDomain y productHandle' },
            { status: 400 }
          );
        }

        result = await scrapeMultipleProducts(products, options as ScrapingOptions);
        break;

      case 'shop':
        if (!shopDomain) {
          return NextResponse.json(
            { error: 'shopDomain es requerido para obtener información de la tienda' },
            { status: 400 }
          );
        }

        result = await scrapeShopInfo(shopDomain);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de scraping no soportado' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error en API de scraping:', error);
    
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

// GET /api/scrape - Validar URL o obtener información básica
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const action = searchParams.get('action') || 'validate';

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'validate':
        const isValid = isValidShopifyUrl(url);
        const parsed = isValid ? parseShopifyUrl(url) : null;
        
        return NextResponse.json({
          valid: isValid,
          parsed: parsed,
          timestamp: new Date().toISOString(),
        });

      case 'preview':
        if (!isValidShopifyUrl(url)) {
          return NextResponse.json(
            { error: 'URL de Shopify inválida' },
            { status: 400 }
          );
        }

        const parsedUrl = parseShopifyUrl(url);
        if (!parsedUrl) {
          return NextResponse.json(
            { error: 'No se pudo parsear la URL' },
            { status: 400 }
          );
        }

        // Obtener información básica del producto
        const product = await scrapeSingleProduct(
          parsedUrl.shopDomain, 
          parsedUrl.productHandle,
          { timeout: 5000, retries: 1 }
        );

        return NextResponse.json({
          success: true,
          data: {
            title: product.title,
            price: product.price,
            currency: product.currency,
            images: product.images.slice(0, 3), // Solo primeras 3 imágenes
            available: product.available,
            vendor: product.vendor,
          },
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: 'Acción no soportada' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error en GET /api/scrape:', error);
    
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

