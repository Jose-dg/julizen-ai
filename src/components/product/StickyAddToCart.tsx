'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';

export function StickyAddToCart() {
    const { addItem } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    const handleAddToCart = () => {
        addItem({
            id: 'renoheal-cupping',
            variantId: 'var-sticky-red',
            title: 'Renoheal Cupping Massager',
            price: { amount: 59, currencyCode: 'EUR' },
            quantity: 1,
            image: 'https://placehold.co/600x600/d00000/ffffff?text=Cupping+Massager',
            variantTitle: 'Red'
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past hero (approx 600px)
            setIsVisible(window.scrollY > 600);
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
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 md:p-4"
                >
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <div className="font-bold text-lg uppercase">Renoheal Cupping Massager</div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-red-600 text-xl">€59,00</span>
                                <Badge className="bg-red-600">SAVE 40%</Badge>
                            </div>
                        </div>

                        <div className="flex-1 md:flex-none md:w-auto w-full">
                            <Button onClick={handleAddToCart} className="w-full md:w-64 h-12 text-base font-bold uppercase bg-red-600 hover:bg-red-700 shadow-lg">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
