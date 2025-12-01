'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProductCard } from '@/components/products/ProductCard';

// Mock data for demonstration until backend is connected
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'PlayStation Store Gift Card $10',
        description: 'Add funds to your PlayStation Network wallet.',
        image: 'https://placehold.co/400x400/00439c/ffffff?text=PSN+$10',
        retail_price: 10.00,
        wholesale_price: 8.50,
        currency: 'USD'
    },
    {
        id: '2',
        name: 'PlayStation Store Gift Card $25',
        description: 'Add funds to your PlayStation Network wallet.',
        image: 'https://placehold.co/400x400/00439c/ffffff?text=PSN+$25',
        retail_price: 25.00,
        wholesale_price: 21.25,
        currency: 'USD'
    },
    {
        id: '3',
        name: 'PlayStation Store Gift Card $50',
        description: 'Add funds to your PlayStation Network wallet.',
        image: 'https://placehold.co/400x400/00439c/ffffff?text=PSN+$50',
        retail_price: 50.00,
        wholesale_price: 42.50,
        currency: 'USD'
    },
    {
        id: '4',
        name: 'PlayStation Plus Essential 12 Month',
        description: '12 Months membership for PS Plus Essential.',
        image: 'https://placehold.co/400x400/ffcc00/000000?text=PS+Plus',
        retail_price: 79.99,
        wholesale_price: 68.00,
        currency: 'USD'
    }
];

export default function ProductsPage() {
    const { data: session } = useSession();
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    // In a real implementation, fetch from API
    // useEffect(() => {
    //   async function fetchProducts() {
    //     const res = await fetch('/api/products');
    //     const data = await res.json();
    //     setProducts(data.products);
    //   }
    //   fetchProducts();
    // }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Digital Products</h1>
                        <p className="text-gray-500">Instant delivery codes for all platforms.</p>
                    </div>
                    {session?.user?.user_type === 'wholesale' && (
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                            Wholesale Pricing Active
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
