'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Truck, Zap, Globe, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useGlobal } from '@/lib/global-context';
import { PLAYSTATION_PRICING, EXCHANGE_RATES } from '@/lib/pricing-data';

const DENOMINATIONS = [5, 10, 25, 50, 75, 100, 150, 250];

interface HeroInfoProps {
    selectedDenomination: number;
    onSelectDenomination: (amount: number) => void;
    selectedRegion: any;
    onSelectRegion: (region: any) => void;
    regions: any[];
}

export function HeroInfo({
    selectedDenomination,
    onSelectDenomination,
    selectedRegion,
    onSelectRegion,
    regions
}: HeroInfoProps) {
    const { addItem, clearCart, openCart } = useCart();
    const router = useRouter();
    const { currency, formatPrice } = useGlobal();

    // const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);

    // Calculate Price based on Region Currency and Global Currency
    // Formula: (Denomination * RegionRate) / GlobalRate
    const regionRate = EXCHANGE_RATES[selectedRegion.currencyCode] || 3800;
    const globalRate = EXCHANGE_RATES[currency] || 3800;

    // Value in COP
    const valueInCOP = selectedDenomination * regionRate;

    // Price in Global Currency
    const price = valueInCOP / globalRate;

    const oldPrice = price * 1.1;



    const handleAddToCart = () => {
        addItem({
            id: `psn-card-${selectedRegion.id}-${selectedDenomination}-${currency}`,
            variantId: `var-${selectedRegion.id}-${selectedDenomination}-${currency}`,
            title: `PlayStation Store Gift Card (${selectedRegion.name})`,
            price: { amount: price, currencyCode: currency },
            quantity: 1,
            image: 'https://placehold.co/600x600/00439c/ffffff?text=PSN+Card',
            variantTitle: `${selectedRegion.currency}${selectedDenomination} - ${selectedRegion.name}`
        });
        openCart();
    };

    const handleBuyNow = () => {
        clearCart();
        handleAddToCart();
        router.push('/checkout');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Label */}
            <div className="flex items-center gap-2">
                <Badge variant="destructive" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
                    Digital Code
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs font-bold tracking-widest uppercase">
                    Instant Delivery
                </Badge>
            </div>

            {/* Title & Price */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                    PLAYSTATION STORE<br />
                </h1>
                <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-blue-600">
                        {formatPrice(price)}
                    </span>
                    <span className="text-xl text-gray-400 line-through mb-1">
                        {formatPrice(oldPrice)}
                    </span>
                    <Badge className="bg-green-500 hover:bg-green-600 mb-2">
                        SAVE 10%
                    </Badge>
                </div>
            </div>

            {/* Region Selector */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Region</span>
                    <span className="text-xs font-medium text-blue-600">{selectedRegion.name} Store</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            onClick={() => onSelectRegion(region)}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200",
                                selectedRegion.id === region.id
                                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                    : "border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-gray-50"
                            )}
                        >
                            <span className="text-2xl mb-1">{region.flag}</span>
                            <span className="text-xs font-bold">{region.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Denomination Selector */}
            <div className="space-y-3">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Amount</span>
                <div className="grid grid-cols-8 gap-2">
                    {DENOMINATIONS.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => onSelectDenomination(amount)}
                            className={cn(
                                "h-12 rounded-lg border-2 font-bold text-sm transition-all duration-200",
                                selectedDenomination === amount
                                    ? "border-blue-600 bg-blue-600 text-white shadow-md transform scale-105"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
                            )}
                        >
                            {amount}
                        </button>
                    ))}
                </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
                {[
                    "Code delivered immediately via email",
                    "Valid for all PS4 & PS5 consoles",
                    "No expiration date",
                    "Official Authorized Retailer"
                ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                        </div>
                        {benefit}
                    </div>
                ))}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
                <Button
                    onClick={handleAddToCart}
                    className="w-full h-14 text-lg font-bold uppercase tracking-wider transition-all shadow-lg bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] shadow-blue-200"
                >
                    Add to Cart
                </Button>
                <Button onClick={handleBuyNow} variant="outline" className="w-full h-12 text-base font-bold uppercase tracking-wider border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                    Buy It Now
                </Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Instant Email Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Global Activation</span>
                </div>
            </div>
        </div>
    );
}
