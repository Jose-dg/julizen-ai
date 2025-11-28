import React from 'react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import Link from 'next/link';

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Left Column: Form */}
            <div className="flex-1 flex flex-col">
                <header className="p-6 border-b md:border-none">
                    <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center">
                        <span className="text-gray-800">RENO</span>
                        <span className="text-black">HEAL</span>
                    </Link>
                </header>
                <main className="flex-1">
                    <CheckoutForm />
                </main>
                <footer className="p-6 text-xs text-gray-400 border-t md:border-none mt-auto">
                    &copy; 2024 Renoheal. All rights reserved.
                </footer>
            </div>

            {/* Right Column: Summary */}
            <div className="md:w-[45%] lg:w-[40%] bg-gray-50 border-l border-gray-200 hidden md:block">
                <OrderSummary />
            </div>

            {/* Mobile Summary Toggle (Optional, could be added later) */}
        </div>
    );
}
