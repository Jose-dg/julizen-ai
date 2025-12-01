'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { useGlobal } from '@/lib/global-context';
import { EXCHANGE_RATES } from '@/lib/pricing-data';

export function CartSidebar() {
    const { items, removeItem, addItem, totalPrice, isCartOpen, closeCart } = useCart();
    const { currency } = useGlobal();

    if (!isCartOpen) return null;

    const rate = EXCHANGE_RATES[currency] || 1;
    const symbol = currency === 'COP' ? '$' : (currency === 'EUR' ? '€' : '$');

    const formatPrice = (amount: number) => {
        const converted = amount * rate;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(converted);
    };

    const handleQuantityChange = (item: any, change: number) => {
        if (item.quantity + change > 0) {
            addItem({ ...item, quantity: change });
        } else {
            removeItem(item.variantId);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({items.reduce((acc, item) => acc + item.quantity, 0)} items)
                        </span>
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                            <p className="text-gray-500 max-w-xs">
                                Looks like you haven&apos;t added anything to your cart yet.
                            </p>
                            <Button onClick={closeCart} className="mt-4">
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.variantId} className="flex gap-4">
                                {/* Image */}
                                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-900 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <button
                                                onClick={() => removeItem(item.variantId)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatPrice(item.price.amount)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => handleQuantityChange(item, -1)}
                                                className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item, 1)}
                                                className="p-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            {formatPrice(item.price.amount * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(totalPrice.amount)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(totalPrice.amount)}</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                Shipping and taxes calculated at checkout.
                            </p>
                        </div>

                        <Button
                            className="w-full h-12 text-lg font-bold bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                            onClick={() => {
                                closeCart();
                                window.location.href = '/checkout';
                            }}
                        >
                            Checkout
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
