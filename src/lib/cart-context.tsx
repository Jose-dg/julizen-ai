'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartLineItem, IMoneyV2 } from '@/types/shopify';

type CartContextType = {
    items: ICartLineItem[];
    addItem: (item: ICartLineItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    totalPrice: IMoneyV2;
    subtotalPrice: IMoneyV2;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ICartLineItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: ICartLineItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.variantId === newItem.variantId);
            let newItems;
            if (existing) {
                newItems = prev.map((i) =>
                    i.variantId === newItem.variantId
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            } else {
                newItems = [...prev, newItem];
            }
            // Manually save to localStorage to avoid race condition with navigation
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeItem = (variantId: string) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((acc, item) => acc + item.price.amount * item.quantity, 0);

    const totalPrice: IMoneyV2 = {
        amount: totalAmount,
        currencyCode: 'EUR'
    };

    const subtotalPrice: IMoneyV2 = {
        amount: totalAmount,
        currencyCode: 'EUR'
    };

    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalPrice, subtotalPrice, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
