'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';

export function WholesaleCheckout() {
    const { items, totalPrice, clearCart } = useCart();
    const cartTotal = totalPrice.amount;
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [notes, setNotes] = useState('');

    const handlePlaceOrder = async () => {
        setLoading(true);

        // Simulate API call to Django backend
        // In real implementation: await apiClient.post('/orders/wholesale/', { items, notes })

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            clearCart();
        }, 2000);
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto text-center py-12 space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-24 h-24 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h2>
                <p className="text-gray-600">
                    Your wholesale order has been received and is being processed.
                    You will receive a confirmation email shortly at <strong>{session?.user?.email}</strong>.
                </p>
                <Button onClick={() => window.location.href = '/products'} className="bg-blue-600 hover:bg-blue-700">
                    Return to Products
                </Button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="text-gray-600 mt-2">Add products to your cart to place a wholesale order.</p>
                <Button onClick={() => window.location.href = '/products'} className="mt-6 bg-blue-600 hover:bg-blue-700">
                    Browse Products
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Wholesale Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-bold">{item.title}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.price.currencyCode }).format(item.price.amount * item.quantity)}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-xl font-black text-blue-600">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: items[0]?.price.currencyCode || 'USD' }).format(cartTotal)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Email</Label>
                                <Input value={session?.user?.email || ''} disabled className="bg-gray-50" />
                            </div>
                            <div>
                                <Label>Account Type</Label>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Wholesale
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Order Notes (Optional)</Label>
                                <Input
                                    id="notes"
                                    placeholder="Any special instructions..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={handlePlaceOrder}
                        className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Place Wholesale Order'
                        )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        By placing this order, you agree to our wholesale terms and conditions.
                        Payment will be processed according to your account terms.
                    </p>
                </div>
            </div>
        </div>
    );
}
