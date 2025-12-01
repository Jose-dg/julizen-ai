'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import Image from 'next/image';

export function StickyAddToCart() {
    const { addItem, openCart } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    const handleAddToCart = () => {
        addItem({
            id: 'psn-card-sticky',
            variantId: 'var-sticky-50',
            title: 'PlayStation Store Gift Card',
            price: { amount: 50, currencyCode: 'EUR' },
            quantity: 1,
            image: 'https://placehold.co/600x600/00439c/ffffff?text=PSN+Card',
            variantTitle: '$50'
        });
        openCart();
    };

    useEffect(() => {
        const handleScroll = () => {
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                setIsVisible(heroBottom < 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 md:flex items-center justify-between hidden"
                >
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src="https://placehold.co/600x600/00439c/ffffff?text=PSN+Card"
                                    alt="Product"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">PlayStation Store Gift Card</h3>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-blue-600 text-lg">From €10.00</span>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">In Stock</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 md:flex-none md:w-auto w-full">
                            <Button onClick={handleAddToCart} className="w-full md:w-64 h-12 text-base font-bold uppercase bg-blue-600 hover:bg-blue-700 shadow-lg">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
