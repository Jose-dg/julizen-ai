'use client';

import React from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobal } from '@/lib/global-context';
import { useCart } from '@/lib/cart-context';
import { CURRENCIES, CurrencyCode } from '@/lib/pricing-data';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const { currency, setCurrency, language, setLanguage } = useGlobal();
    const { items, openCart } = useCart();

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left: Mobile Menu (Hidden on Desktop for now, or just simple nav) */}
                <div className="hidden md:flex items-center gap-6 w-1/3">
                    <Link href="/" className="text-sm font-medium hover:text-red-600 transition-colors">
                        Home
                    </Link>
                </div>

                {/* Center: Logo */}
                <div className="flex-1 flex justify-center items-center gap-8 w-1/3">
                    {/* Mobile Nav Placeholder if needed */}

                    <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center">
                        <span className="text-gray-800">MONEY FOR GAMERS</span>
                        {/* <span className="text-black">HEAL</span> */}
                    </Link>

                    <Button
                        asChild
                        className="hidden md:inline-flex rounded-full bg-gray-900 text-white hover:bg-red-600 px-6 h-8 text-xs uppercase font-bold tracking-wide transition-colors"
                    >
                        <Link href="/product">Shop now</Link>
                    </Button>
                </div>

                {/* Right: Support & Icons */}
                <div className="flex items-center justify-end gap-4 w-1/3">
                    <Link href="/support" className="text-sm font-medium hidden md:block hover:text-red-600 transition-colors">
                        Support
                    </Link>

                    {/* Currency Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm font-medium hover:text-red-600 transition-colors">
                                <Globe className="w-4 h-4" />
                                {currency}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.keys(CURRENCIES).map((code) => (
                                <DropdownMenuItem
                                    key={code}
                                    onClick={() => setCurrency(code as CurrencyCode)}
                                    className="cursor-pointer"
                                >
                                    {CURRENCIES[code as CurrencyCode].symbol} {code}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Language Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-sm font-medium hover:text-red-600 transition-colors uppercase">
                                {language}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                                🇺🇸 English
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('es')} className="cursor-pointer">
                                🇪🇸 Español
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('pt')} className="cursor-pointer">
                                🇧🇷 Português
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-3 text-gray-700">
                        <button className="hover:text-red-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="hover:text-red-600 transition-colors">
                            <User className="w-5 h-5" />
                        </button>
                        <button
                            onClick={openCart}
                            className="relative hover:text-red-600 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
