'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// Wompi Test Key
const WOMPI_PUBLIC_KEY = 'pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGObFh'; // Replace with your key if needed, this is a generic test key format, user might need to provide theirs.
// Actually, I should use a placeholder or the one from documentation if available. 
// Using a generic placeholder for now, user can replace.
// Wait, I will use a known test key structure or ask user. 
// For now I will use a dummy key and let the user know.

export function CheckoutForm() {
    const { totalPrice } = useCart();
    const [step, setStep] = useState<'info' | 'shipping' | 'payment'>('info');
    const [loading, setLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');

    // Shipping State
    const [shippingMethod, setShippingMethod] = useState('free');

    // Calculate Total in COP (Approx 1 EUR = 4500 COP)
    const exchangeRate = 4500;
    const totalCOP = Math.round(totalPrice.amount * exchangeRate);
    const totalCents = totalCOP * 100; // Wompi expects cents

    const handleWompiPayment = () => {
        if (totalCents <= 0) {
            alert("Total amount must be greater than 0. Please add items to your cart.");
            return;
        }

        setLoading(true);

        const checkout = new (window as any).WidgetCheckout({
            currency: 'COP',
            amountInCents: totalCents,
            reference: `ORD-${Date.now()}`,
            publicKey: 'pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGObFh', // DEMO KEY
            redirectUrl: 'http://localhost:3000/thank-you', // Redirect after payment
            customerData: {
                email: email,
                fullName: `${firstName} ${lastName}`,
                phoneNumber: phone,
                phoneNumberPrefix: '+57',
                legalId: '1234567890',
                legalIdType: 'CC'
            }
        });

        checkout.open((result: any) => {
            const transaction = result.transaction;
            console.log('Transaction result:', transaction);
            setLoading(false);
            // Handle result here if not redirecting
        });
    };

    useEffect(() => {
        // Load Wompi Script
        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="max-w-xl mx-auto py-8 px-4 md:px-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <span className={step === 'info' ? 'text-black font-bold' : ''}>Information</span>
                <ChevronRight className="w-4 h-4" />
                <span className={step === 'shipping' ? 'text-black font-bold' : ''}>Shipping</span>
                <ChevronRight className="w-4 h-4" />
                <span className={step === 'payment' ? 'text-black font-bold' : ''}>Payment</span>
            </div>

            {/* Step 1: Information */}
            {step === 'info' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Contact</h2>
                            <Link href="/login" className="text-sm text-red-600 hover:underline">Log in</Link>
                        </div>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">Shipping address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={() => setStep('shipping')}
                            className="bg-black hover:bg-gray-800 text-white h-12 px-8 rounded-md"
                        >
                            Continue to shipping
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Shipping */}
            {step === 'shipping' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <div className="flex gap-4">
                                <span className="text-gray-400">Contact</span>
                                <span>{email}</span>
                            </div>
                            <button onClick={() => setStep('info')} className="text-red-600 hover:underline text-xs">Change</button>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-4">
                                <span className="text-gray-400">Ship to</span>
                                <span>{address}, {city}</span>
                            </div>
                            <button onClick={() => setStep('info')} className="text-red-600 hover:underline text-xs">Change</button>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold">Shipping method</h2>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-black transition-colors">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="free" id="free" />
                                <Label htmlFor="free" className="cursor-pointer">Standard Shipping</Label>
                            </div>
                            <span className="font-bold">Free</span>
                        </div>
                        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-black transition-colors">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="priority" id="priority" />
                                <Label htmlFor="priority" className="cursor-pointer">Priority Processing</Label>
                            </div>
                            <span className="font-bold">€4.95</span>
                        </div>
                    </RadioGroup>

                    <div className="flex justify-between items-center pt-4">
                        <button onClick={() => setStep('info')} className="flex items-center text-sm text-red-600 hover:underline">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Return to information
                        </button>
                        <Button
                            onClick={() => setStep('payment')}
                            className="bg-black hover:bg-gray-800 text-white h-12 px-8 rounded-md"
                        >
                            Continue to payment
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <div className="flex gap-4">
                                <span className="text-gray-400">Contact</span>
                                <span>{email}</span>
                            </div>
                            <button onClick={() => setStep('info')} className="text-red-600 hover:underline text-xs">Change</button>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <div className="flex gap-4">
                                <span className="text-gray-400">Ship to</span>
                                <span>{address}, {city}</span>
                            </div>
                            <button onClick={() => setStep('info')} className="text-red-600 hover:underline text-xs">Change</button>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-4">
                                <span className="text-gray-400">Method</span>
                                <span>{shippingMethod === 'free' ? 'Standard' : 'Priority'} · {shippingMethod === 'free' ? 'Free' : '€4.95'}</span>
                            </div>
                            <button onClick={() => setStep('shipping')} className="text-red-600 hover:underline text-xs">Change</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">Payment</h2>
                        <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>

                        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
                            <p className="mb-4 text-sm text-gray-600">
                                After clicking "Pay now", you will be redirected to Wompi to complete your purchase securely.
                            </p>
                            <div className="flex justify-center gap-2 mb-4">
                                {/* Payment Icons Placeholder */}
                                <div className="h-6 w-10 bg-white border rounded"></div>
                                <div className="h-6 w-10 bg-white border rounded"></div>
                                <div className="h-6 w-10 bg-white border rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <button onClick={() => setStep('shipping')} className="flex items-center text-sm text-red-600 hover:underline">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Return to shipping
                        </button>
                        <Button
                            onClick={handleWompiPayment}
                            disabled={loading || totalCents <= 0}
                            className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 rounded-md w-full md:w-auto font-bold text-lg shadow-lg"
                        >
                            {loading ? 'Processing...' : 'Pay now'}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        By clicking Pay now, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            )}
        </div>
    );
}
