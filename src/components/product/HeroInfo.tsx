'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Truck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export function HeroInfo() {
    const { addItem } = useCart();
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<'red' | 'black'>('red');
    const [selectedBundle, setSelectedBundle] = useState<1 | 2 | 4>(2);

    const handleAddToCart = () => {
        let price = 59;
        if (selectedBundle === 2) price = 98;
        if (selectedBundle === 4) price = 180;

        addItem({
            id: `renoheal-cupping-${selectedBundle}`,
            variantId: `var-${selectedBundle}-${selectedColor}`,
            title: `Renoheal Cupping Massager (${selectedBundle}x)`,
            price: { amount: price, currencyCode: 'EUR' },
            quantity: 1,
            image: 'https://placehold.co/600x600/d00000/ffffff?text=Cupping+Massager',
            variantTitle: selectedColor
        });

        // Optional: Open cart drawer or redirect. For now, redirect to checkout for "Buy It Now" flow or just show success.
        // User asked for "Add to Cart" -> usually stays on page, but for this flow I'll just add.
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/checkout');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Label */}
            <div>
                <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100 uppercase tracking-wider font-bold text-[10px] px-2 py-1">
                    Hot Product | Low Stock
                </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-none">
                Renoheal Cupping<br />Massager
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-red-600">€59,00</span>
                <span className="text-xl text-gray-400 line-through mb-1">€99,00</span>
                <Badge className="bg-red-600 hover:bg-red-700 mb-2">
                    SAVE 40%
                </Badge>
            </div>

            {/* Benefits */}
            <ul className="space-y-2">
                {[
                    "Relieve knots and aches",
                    "Increase blood flow and mobility",
                    "Improve muscle recovery"
                ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs">
                            <Check className="w-3 h-3" />
                        </span>
                        {benefit}
                    </li>
                ))}
            </ul>

            {/* Color Selector */}
            <div className="space-y-3">
                <span className="text-sm font-bold uppercase tracking-wide text-gray-500">Color</span>
                <div className="flex gap-3">
                    <button
                        onClick={() => setSelectedColor('red')}
                        className={cn(
                            "w-10 h-10 rounded-full bg-red-600 border-2 transition-all",
                            selectedColor === 'red' ? "border-black ring-2 ring-offset-2 ring-red-200" : "border-transparent"
                        )}
                        aria-label="Select Red"
                    />
                    <button
                        onClick={() => setSelectedColor('black')}
                        className={cn(
                            "w-10 h-10 rounded-full bg-black border-2 transition-all",
                            selectedColor === 'black' ? "border-black ring-2 ring-offset-2 ring-gray-200" : "border-transparent"
                        )}
                        aria-label="Select Black"
                    />
                </div>
            </div>

            {/* Bundle & Save */}
            <div className="border border-gray-200 rounded-xl p-4 md:p-6 space-y-4 bg-white shadow-sm">
                <h3 className="text-center font-bold text-lg uppercase tracking-wide">Bundle & Save</h3>

                <div className="space-y-3">
                    {/* Option 1 */}
                    <BundleOption
                        title="Buy 1"
                        subtitle="€59/per Renoheal unit"
                        price="€59"
                        oldPrice="€99"
                        isSelected={selectedBundle === 1}
                        onClick={() => setSelectedBundle(1)}
                    />

                    {/* Option 2 */}
                    <BundleOption
                        title="Buy 2"
                        subtitle="Most Popular"
                        price="€98"
                        oldPrice="€198"
                        isSelected={selectedBundle === 2}
                        onClick={() => setSelectedBundle(2)}
                        badge="Most Popular"
                        freeShipping
                    />

                    {/* Option 4 */}
                    <BundleOption
                        title="Buy 4"
                        subtitle="Best Deal"
                        price="€180"
                        oldPrice="€396"
                        isSelected={selectedBundle === 4}
                        onClick={() => setSelectedBundle(4)}
                        badge="Best Deal"
                        freeShipping
                        perUnit="€45/unit"
                    />
                </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
                <Button onClick={handleAddToCart} className="w-full h-14 text-lg font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 hover:scale-[1.02] transition-all shadow-lg shadow-red-200">
                    Add to Cart
                </Button>
                <Button onClick={handleBuyNow} variant="outline" className="w-full h-12 text-base font-bold uppercase tracking-wider border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    Buy It Now
                </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over €90</span>
            </div>
        </div>
    );
}

function BundleOption({
    title,
    subtitle,
    price,
    oldPrice,
    isSelected,
    onClick,
    badge,
    freeShipping,
    perUnit
}: {
    title: string,
    subtitle: string,
    price: string,
    oldPrice: string,
    isSelected: boolean,
    onClick: () => void,
    badge?: string,
    freeShipping?: boolean,
    perUnit?: string
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected
                    ? "border-red-600 bg-red-50/30"
                    : "border-gray-100 hover:border-red-200"
            )}
        >
            {badge && (
                <span className="absolute -top-3 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    {badge}
                </span>
            )}

            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected ? "border-red-600" : "border-gray-300"
                )}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{title}</div>
                    <div className="text-xs text-gray-500">{subtitle}</div>
                    {freeShipping && (
                        <div className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-0.5">
                            <Truck className="w-3 h-3" /> Free Shipping
                        </div>
                    )}
                </div>
            </div>

            <div className="text-right">
                <div className="font-bold text-lg text-red-600">{price}</div>
                <div className="text-xs text-gray-400 line-through">{oldPrice}</div>
                {perUnit && <div className="text-[10px] font-medium text-gray-500">{perUnit}</div>}
            </div>
        </div>
    );
}
