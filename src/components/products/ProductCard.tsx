'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from './PriceDisplay';
import { useCart } from '@/lib/cart-context';

interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    retail_price: number;
    wholesale_price: number;
    currency: string;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            variantId: product.id, // Simple variant mapping
            title: product.name,
            price: { amount: product.retail_price, currencyCode: product.currency }, // Note: Cart might need logic to handle wholesale price too
            quantity: 1,
            image: product.image,
            variantTitle: 'Standard'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-end justify-between">
                    <PriceDisplay
                        retailPrice={product.retail_price}
                        wholesalePrice={product.wholesale_price}
                        currencyCode={product.currency}
                    />
                    <Button onClick={handleAddToCart} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
