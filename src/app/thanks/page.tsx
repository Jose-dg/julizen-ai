'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ThanksContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('id');
    const amountParam = searchParams.get('amount');
    const { items, totalPrice, clearCart } = useCart();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const processedRef = useRef(false);

    useEffect(() => {
        if (!transactionId || processedRef.current) return;

        const sendWebhook = async () => {
            processedRef.current = true;

            try {
                // Get customer info and order items from localStorage
                const customerInfoStr = localStorage.getItem('customer_info');
                const customerInfo = customerInfoStr ? JSON.parse(customerInfoStr) : {};

                const orderItemsStr = localStorage.getItem('order_items');
                const orderItems = orderItemsStr ? JSON.parse(orderItemsStr) : items;

                // Construct payload for Django Backend
                const payload = {
                    name: transactionId, // Using transaction ID as order reference
                    store_id: "97e3d8ad-8376-454a-9133-5d13c7a7af85",
                    customer: {
                        first_name: customerInfo.firstName || "Guest",
                        last_name: customerInfo.lastName || "User",
                        email: customerInfo.email,
                        phone: customerInfo.phone
                    },
                    billing_address: {
                        company: "N/A", // Placeholder as we don't collect company
                        phone: customerInfo.phone
                    },
                    total_price: amountParam === '0' ? "0" : totalPrice.amount.toString(),
                    line_items: orderItems.map((item: any) => ({
                        sku: item.sku || item.id, // Use SKU if available, fallback to ID
                        quantity: item.quantity,
                        price: item.price.amount.toString()
                    }))
                };

                console.log('Sending order to Django:', payload);

                // Send to Django Backend
                const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;
                // const response = await fetch(`${apiUrl}/api/webhook/order/create/`, {
                const response = await fetch(`http://localhost:8000/api/webhook/order/create/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    console.log('Order created successfully in Django');
                    setStatus('success');
                    clearCart();
                    localStorage.removeItem('customer_info');
                    localStorage.removeItem('order_items');
                } else {
                    console.error('Django order creation failed:', response.statusText);
                    // Even if backend fails, we might want to show success to user if payment was real?
                    // But for now, let's show error or handle gracefully.
                    // Ideally we should retry or log this error securely.
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error creating order:', error);
                setStatus('error');
            }
        };

        sendWebhook();
    }, [transactionId, items, totalPrice, clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    {status === 'loading' ? (
                        <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                    ) : (
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    )}
                </div>

                <h1 className="text-3xl font-black text-gray-900">
                    {status === 'loading' ? 'Processing...' : 'Thank You!'}
                </h1>

                <p className="text-gray-600 text-lg">
                    {status === 'loading'
                        ? 'We are confirming your payment details.'
                        : 'Your order has been received and is being processed.'}
                </p>

                {transactionId && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Transaction ID</p>
                        <p className="font-mono text-lg font-bold text-gray-900">{transactionId}</p>
                    </div>
                )}

                <div className="pt-6">
                    <Link href="/">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12">
                            Return to Store
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ThanksPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ThanksContent />
        </Suspense>
    );
}
