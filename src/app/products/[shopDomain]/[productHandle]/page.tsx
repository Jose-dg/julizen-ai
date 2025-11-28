import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { scrapeSingleProduct, scrapeShopInfo } from '@/lib/scraping';
import { ProductGallery } from '../../components/ProductGallery';
import { ProductInfo } from '../../components/ProductInfo';
import { AddToCartClient } from '../../components/AddToCartClient';
import { RelatedProducts } from '../../components/RelatedProducts';
import { ShopInfo } from '../../components/ShopInfo';

interface ProductPageProps {
  params: {
    shopDomain: string;
    productHandle: string;
  };
}

// Generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { shopDomain, productHandle } = params;
  
  try {
    const product = await scrapeSingleProduct(shopDomain, productHandle, {
      timeout: 5000,
      retries: 1,
    });

    const shopInfo = await scrapeShopInfo(shopDomain);

    return {
      title: `${product.title} | ${shopInfo.name}`,
      description: product.description || `Compra ${product.title} en ${shopInfo.name}. Precio: ${product.currency} ${product.price}`,
      keywords: [
        product.title,
        shopInfo.name,
        product.vendor,
        ...product.tags,
        'comprar online',
        'ecommerce',
      ].join(', '),
      openGraph: {
        title: product.title,
        description: product.description || `Compra ${product.title} en ${shopInfo.name}`,
        images: product.images.slice(0, 4).map(image => ({
          url: image,
          width: 800,
          height: 600,
          alt: product.title,
        })),
        type: 'website',
        siteName: shopInfo.name,
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description || `Compra ${product.title} en ${shopInfo.name}`,
        images: product.images.slice(0, 1),
      },
      alternates: {
        canonical: `/products/${shopDomain}/${productHandle}`,
      },
    };
  } catch (error) {
    console.error('Error generando metadatos:', error);
    
    return {
      title: `Producto | ${shopDomain}`,
      description: `Producto de ${shopDomain}`,
    };
  }
}

// Página del producto con Server Component
export default async function ProductPage({ params }: ProductPageProps) {
  const { shopDomain, productHandle } = params;

  try {
    // Scraping server-side para mejor SEO y performance
    const [product, shopInfo] = await Promise.all([
      scrapeSingleProduct(shopDomain, productHandle, {
        timeout: 10000,
        retries: 2,
        cache: true,
        ttl: 15, // 15 minutos de cache
      }),
      scrapeShopInfo(shopDomain),
    ]);

    if (!product) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header con breadcrumbs */}
        <div className="bg-white/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-slate-600">
              <a href="/" className="hover:text-slate-900">Inicio</a>
              <span>/</span>
              <a href="/products" className="hover:text-slate-900">Productos</a>
              <span>/</span>
              <span className="text-slate-900 font-medium">{shopInfo.name}</span>
              <span>/</span>
              <span className="text-slate-900 font-medium truncate max-w-xs">
                {product.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              <ProductGallery 
                images={product.images}
                title={product.title}
                shopDomain={shopDomain}
              />
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <ProductInfo 
                product={product}
                shopInfo={shopInfo}
              />
              
              <AddToCartClient 
                product={product}
                shopDomain={shopDomain}
                productHandle={productHandle}
              />
            </div>
          </div>

          {/* Información de la tienda */}
          <div className="mb-12">
            <ShopInfo 
              shopInfo={shopInfo}
              shopDomain={shopDomain}
            />
          </div>

          {/* Productos relacionados */}
          <div className="mb-12">
            <RelatedProducts 
              product={product}
              shopDomain={shopDomain}
            />
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Descripción del producto */}
            {product.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Descripción</h3>
                <div 
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Detalles del producto */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Detalles del Producto</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Marca:</dt>
                  <dd className="font-medium">{product.vendor}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Disponibilidad:</dt>
                  <dd className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.available ? 'Disponible' : 'Agotado'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Moneda:</dt>
                  <dd className="font-medium">{product.currency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Variantes:</dt>
                  <dd className="font-medium">{product.variants.length}</dd>
                </div>
                {product.tags.length > 0 && (
                  <div>
                    <dt className="text-slate-600 mb-2">Etiquetas:</dt>
                    <dd className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Información de scraping */}
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>
              Información actualizada el {new Date(product.scrapedAt).toLocaleString('es-ES')}
            </p>
            <p className="mt-1">
              Los precios y disponibilidad pueden cambiar. Verifica en la tienda original.
            </p>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error cargando producto:', error);
    
    // Página de error personalizada
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-slate-600 mb-6">
            No pudimos cargar el producto de {shopDomain}. 
            Puede que la tienda no esté disponible o el producto no exista.
          </p>
          <div className="space-x-4">
            <a 
              href="/products" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todos los productos
            </a>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }
}

// Generar rutas estáticas para productos populares (opcional)
export async function generateStaticParams() {
  // En una implementación real, esto vendría de una base de datos
  // o de una lista de productos populares
  return [
    // Ejemplos de productos populares
    // { shopDomain: 'nike.myshopify.com', productHandle: 'air-force-1' },
    // { shopDomain: 'adidas.myshopify.com', productHandle: 'stan-smith' },
  ];
}

