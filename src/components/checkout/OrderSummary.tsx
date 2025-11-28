'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

export function OrderSummary() {
    const { items, totalPrice } = useCart();
    const [discountCode, setDiscountCode] = useState('');

    // Dummy shipping calculation
    const shipping = totalPrice.amount > 90 ? 0 : 4.95;
    const finalTotal = totalPrice.amount + shipping;

    return (
        <div className="bg-gray-50 p-6 md:p-8 rounded-lg md:h-screen md:sticky md:top-0 border-l border-gray-200">
            <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                    <div key={`${item.variantId}-${i}`} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain p-1"
                            />
                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center z-10">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.variantTitle}</p>
                        </div>
                        <div className="font-bold text-sm text-gray-800">
                            €{(item.price.amount * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-6">
                <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="bg-white"
                />
                <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 border-transparent">
                    Apply
                </Button>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-6 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">€{totalPrice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-6 mt-6">
                <span className="font-bold text-lg">Total</span>
                <div className="text-right">
                    <span className="text-xs text-gray-500 mr-2">EUR</span>
                    <span className="font-bold text-2xl">€{finalTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
