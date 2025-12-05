import { MetadataRoute } from 'next';
import { ProductsService } from '@/services/products.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://moneyforgamers.com';

    let productUrls: MetadataRoute.Sitemap = [];
    try {
        // Fetch products
        // Assuming getting all products for sitemap. In a real large scale app, this might need pagination handling or a specific sitemap endpoint.
        // For now, fetching first 100 or so.
        const response = await ProductsService.getProducts({ page_size: 100 });
        const products = response.data.results;

        productUrls = products.map((product) => ({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: new Date(product.updated_at || product.created_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Error generating sitemap products:', error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productUrls,
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
