'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export function BundleSection() {
    const { addItem } = useCart();
    const router = useRouter();

    const handleAddBundle = () => {
        addItem({
            id: 'renoheal-bundle-mid',
            variantId: 'var-bundle-mid',
            title: 'Renoheal Bundle (2x Red + Priority)',
            price: { amount: 122.95, currencyCode: 'EUR' },
            quantity: 1,
            image: 'https://placehold.co/300x300/d00000/ffffff?text=Bundle',
            variantTitle: 'Red'
        });
        router.push('/checkout');
    };
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase tracking-tight">
                    Bundle & Save
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                    {/* Left: Images */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-md p-2">
                            <Image
                                src="https://placehold.co/300x300/d00000/ffffff?text=Product+1"
                                alt="Product 1"
                                width={300}
                                height={300}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="text-2xl font-bold text-gray-300">+</div>
                        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-md p-2">
                            <Image
                                src="https://placehold.co/300x300/d00000/ffffff?text=Product+2"
                                alt="Product 2"
                                width={300}
                                height={300}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="text-2xl font-bold text-gray-300">+</div>
                        <div className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-green-100 rounded-full text-green-600">
                            <Truck className="w-8 h-8 md:w-10 md:h-10 mb-1" />
                            <span className="text-[10px] font-bold uppercase">Free Ship</span>
                        </div>
                    </div>

                    {/* Right: Checklist & CTA */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-lg">Renoheal Cupping Massager (Red) x2</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-lg">Priority Processing (€4,95)</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between mb-6 border-t border-gray-100 pt-6">
                            <span className="text-gray-500 font-medium">Total Price:</span>
                            <div className="text-right">
                                <span className="block text-sm text-gray-400 line-through">€202,95</span>
                                <span className="text-3xl font-bold text-red-600">€122,95</span>
                            </div>
                        </div>

                        <Button onClick={handleAddBundle} className="w-full h-14 text-lg font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200">
                            Add Bundle to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
