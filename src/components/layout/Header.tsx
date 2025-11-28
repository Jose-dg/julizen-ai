import React from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
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
                        <span className="text-gray-800">RENO</span>
                        <span className="text-black">HEAL</span>
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

                    <div className="flex items-center gap-3 text-gray-700">
                        <button className="hover:text-red-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="hover:text-red-600 transition-colors">
                            <User className="w-5 h-5" />
                        </button>
                        <button className="relative hover:text-red-600 transition-colors">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
