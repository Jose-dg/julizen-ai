'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { WholesaleCheckout } from '@/components/checkout/WholesaleCheckout';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (session?.user?.user_type === 'wholesale') {
        return <WholesaleCheckout />;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Left Column: Form */}
            <div className="flex-1 md:w-[50%] flex flex-col">
                <header className="px-6 py-6 md:px-12 md:py-8">
                    <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center">
                        <span className="text-black-800">MONEY FOR GAMERS</span>

                    </Link>
                </header>
                <main className="flex-1 px-6 md:px-12">
                    <CheckoutForm />
                </main>
                <footer className="px-2 py-6 md:px-12 text-xs text-gray-500 mt-auto">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span>&copy; 2024 Maverick</span>
                        <span className="text-gray-300">•</span>
                        <Link href="/refund-policy" className="hover:text-gray-700">Refund policy</Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/privacy-policy" className="hover:text-gray-700">Privacy policy</Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/terms-of-service" className="hover:text-gray-700">Terms of service</Link>
                    </div>
                </footer>
            </div>

            {/* Right Column: Summary - Estilo Shopify */}
            {/* <div className="md:w-[50%] bg-gray-50 border-l border-gray-200 hidden md:flex flex-col"> */}
            <div className="md:w-[50%] bg-gray-50 border-l border-gray-200 hidden md:flex flex-col">
                <div className="px-12 py-8">
                    <OrderSummary />
                </div>
            </div>

            {/* Mobile Summary (mostrar arriba en mobile) */}
            <div className="md:hidden bg-gray-50 border-t border-b border-gray-200 px-6 py-4">
                <OrderSummary />
            </div>
        </div>
    );
}