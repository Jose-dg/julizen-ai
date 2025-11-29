'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export function BundleSection() {
    const { addItem } = useCart();
    const router = useRouter();

    const handleAddBundle = () => {
        addItem({
            id: 'psn-ultimate-bundle',
            variantId: 'var-bundle-ultimate',
            title: 'Ultimate Gamer Bundle ($100 Card + 12 Month PS Plus)',
            price: { amount: 159.99, currencyCode: 'EUR' },
            quantity: 1,
            image: 'https://placehold.co/300x300/00439c/ffffff?text=Ultimate+Bundle',
            variantTitle: 'Ultimate'
        });
        router.push('/checkout');
    };

    return (
        // <section className="bg-gray-50 py-16">
        <section>
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"> */}
                    <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Limited Time Offer
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                                ULTIMATE GAMER BUNDLE
                            </h2>
                            <p className="text-gray-600">
                                Get everything you need to dominate. Includes a $100 Store Card and a 12-Month PlayStation Plus Essential subscription.
                            </p>

                            <div className="space-y-3">
                                {[
                                    "$100 PlayStation Store Gift Card",
                                    "12-Month PS Plus Membership",
                                    "Exclusive Avatar Pack (Bonus)",
                                    "Instant Digital Delivery"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="font-medium text-gray-800">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <div className="text-3xl font-black text-blue-600">€159.99</div>
                                <div className="text-xl text-gray-400 line-through">€179.99</div>
                            </div>
                        </div>

                        <div className="relative h-[400px] bg-gray-100 rounded-2xl overflow-hidden">
                            <Image
                                src="https://placehold.co/600x600/00439c/ffffff?text=Ultimate+Bundle"
                                alt="Bundle"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <Button onClick={handleAddBundle} className="w-full h-14 text-lg font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 md:col-span-2">
                            Add Bundle to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
