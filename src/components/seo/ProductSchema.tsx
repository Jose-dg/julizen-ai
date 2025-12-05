interface ProductSchemaProps {
    product: {
        name: string;
        description: string;
        image: string;
        price: number;
        currency: string;
        availability: string;
        brand: string;
    };
}

export default function ProductSchema({ product }: ProductSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
            '@type': 'Brand',
            name: product.brand,
        },
        offers: {
            '@type': 'Offer',
            url: typeof window !== 'undefined' ? window.location.href : '',
            priceCurrency: product.currency,
            price: product.price,
            availability: `https://schema.org/${product.availability}`,
            seller: {
                '@type': 'Organization',
                name: 'Money for Gamers',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
