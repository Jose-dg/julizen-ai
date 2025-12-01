'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

import { useGlobal } from '@/lib/global-context';
import { EXCHANGE_RATES } from '@/lib/pricing-data';

// Production
const WOMPI_PUBLIC_KEY = 'pub_prod_qtAXfUVyN0Qsqo7ccx2h6ZXf1goGHaRr';

// Sandbox
// const WOMPI_PUBLIC_KEY = 'pub_test_lAgGicdsUuDbioGdH4vOGZxQAbjCO2Eq';

const WOMPI_INTEGRITY_SECRET = 'prod_integrity_58O2Ew7ULrkgmNMtCNTKyHHWuSBW9TH2';
// const WOMPI_INTEGRITY_SECRET = 'test_integrity_j3sdrimTRdQDcbUzbqU419m7Xixxqtu0';

export function CheckoutForm() {
    const { totalPrice } = useCart();
    const { currency } = useGlobal();
    const [loading, setLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');

    // Tasa de cambio simple para pruebas
    // const EXCHANGE_RATES: Record<string, number> = {
    //     USD: 3800,
    //     EUR: 4300,
    //     COP: 1,
    //     BRL: 800,
    //     MXN: 230,
    //     GBP: 5000,
    // };

    const rate = EXCHANGE_RATES[currency] || 4000;
    const totalCOP = Math.round(totalPrice.amount * rate);
    const totalCents = totalCOP * 100;

    // Generar firma de integridad
    const generateSignature = async (
        reference: string,
        amountInCents: number,
        currency: string,
        secret: string,
    ) => {
        const textToSign = `${reference}${amountInCents}${currency}${secret}`;
        const encodedText = new TextEncoder().encode(textToSign);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleWompiPayment = async () => {
        if (totalCents <= 0) {
            alert('Total amount must be greater than 0. Please add items to your cart.');
            return;
        }

        if (!email || !firstName || !lastName || !phone) {
            alert('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        const reference = `ORD-${Date.now()}`;
        const signatureHash = await generateSignature(
            reference,
            totalCents,
            'COP',
            WOMPI_INTEGRITY_SECRET,
        );

        // Save customer info to localStorage for the thanks page
        localStorage.setItem('customer_info', JSON.stringify({
            email,
            firstName,
            lastName,
            phone,
            address,
            city
        }));

        const checkout = new (window as any).WidgetCheckout({
            currency: 'COP',
            amountInCents: totalCents,
            reference,
            publicKey: WOMPI_PUBLIC_KEY,
            // 👇 Forma correcta de enviar la firma
            signature: {
                integrity: signatureHash,
            },
            redirectUrl: `${window.location.origin}/thanks`,
            customerData: {
                email,
                fullName: `${firstName} ${lastName}`,
                phoneNumber: phone,
                phoneNumberPrefix: '+57',
                legalId: '1234567890',
                legalIdType: 'CC',
            },
        });

        checkout.open((result: any) => {
            const transaction = result.transaction;
            console.log('Transaction result:', transaction);
            setLoading(false);
        });
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="max-w-xl mx-auto py-4 md:py-8 space-y-8">

            {/* Contact Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Contact</h2>
                    {/* <Link href="/login" className="text-sm text-blue-600 hover:underline">Log in</Link> */}
                </div>
                <Input
                    placeholder="Email or mobile phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                />
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="newsletter" className="rounded border-gray-300" />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">Email me with news and offers</label>
                </div>
            </div>

            {/* Delivery Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold">Delivery</h2>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                            <Mail className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Email Delivery</span>
                            <span className="text-xs text-gray-500">Digital Code sent immediately</span>
                        </div>
                    </div>
                    <span className="font-bold text-sm">Free</span>
                </div>
            </div>

            {/* Billing Address Section */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold">Billing address</h2>
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12" />
                        <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12" />
                    </div>
                    <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="h-12" />
                    <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-12" />
                    <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12" />
                </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold">Payment</h2>
                <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-medium">Wompi Secure Payment</span>

                    </div>
                    {/* <div className="p-3 bg-gray-50/50 flex flex-col items-center justify-center text-center space-y-4">
                        <Lock className="w-12 h-12 text-gray-300" />
                        <p className="text-sm text-gray-600 max-w-xs">
                            After clicking "Pay now", you will be redirected to Wompi to complete your purchase securely.
                        </p>
                    </div> */}
                </div>
            </div>

            {/* Pay Button */}
            <Button
                onClick={handleWompiPayment}
                disabled={loading || totalCents <= 0}
                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-lg"
            >
                {loading ? 'Processing...' : 'Pay now'}
            </Button>

            <p className="text-xs text-center text-gray-400">
                By clicking Pay now, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
}


// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/lib/cart-context';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Lock, Mail } from 'lucide-react';
// import Link from 'next/link';

// import { useGlobal } from '@/lib/global-context';

// // Wompi Test Key
// const WOMPI_PUBLIC_KEY = 'pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGObFh';

// export function CheckoutForm() {
//     const { totalPrice } = useCart();
//     const { currency } = useGlobal();
//     const [loading, setLoading] = useState(false);

//     // Form State
//     const [email, setEmail] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [address, setAddress] = useState('');
//     const [city, setCity] = useState('');
//     const [phone, setPhone] = useState('');

//     // Calculate Total in COP for Wompi
//     const EXCHANGE_RATES: Record<string, number> = {
//         USD: 4000,
//         EUR: 4300,
//         COP: 1,
//         BRL: 800,
//         MXN: 230,
//         GBP: 5000
//     };

//     const rate = EXCHANGE_RATES[currency] || 4000;
//     const totalCOP = Math.round(totalPrice.amount * rate);
//     const totalCents = totalCOP * 100;

//     const handleWompiPayment = () => {
//         if (totalCents <= 0) {
//             alert("Total amount must be greater than 0. Please add items to your cart.");
//             return;
//         }

//         if (!email || !firstName || !lastName || !phone) {
//             alert("Please fill in all required fields.");
//             return;
//         }

//         setLoading(true);

//         const checkout = new (window as any).WidgetCheckout({
//             currency: 'COP',
//             amountInCents: totalCents,
//             reference: `ORD-${Date.now()}`,
//             publicKey: WOMPI_PUBLIC_KEY,
//             redirectUrl: 'http://localhost:3000/thank-you',
//             customerData: {
//                 email: email,
//                 fullName: `${firstName} ${lastName}`,
//                 phoneNumber: phone,
//                 phoneNumberPrefix: '+57',
//                 legalId: '1234567890',
//                 legalIdType: 'CC'
//             }
//         });

//         checkout.open((result: any) => {
//             const transaction = result.transaction;
//             console.log('Transaction result:', transaction);
//             setLoading(false);
//         });
//     };

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.wompi.co/widget.js';
//         script.async = true;
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

//     return (
//         <div className="max-w-xl mx-auto py-4 md:py-8 space-y-8">

//             {/* Contact Section */}
//             <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                     <h2 className="text-lg font-bold">Contact</h2>
//                     <Link href="/login" className="text-sm text-blue-600 hover:underline">Log in</Link>
//                 </div>
//                 <Input
//                     placeholder="Email or mobile phone number"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-12"
//                 />
//                 <div className="flex items-center gap-2">
//                     <input type="checkbox" id="newsletter" className="rounded border-gray-300" />
//                     <label htmlFor="newsletter" className="text-sm text-gray-600">Email me with news and offers</label>
//                 </div>
//             </div>

//             {/* Delivery Section */}
//             <div className="space-y-4">
//                 <h2 className="text-lg font-bold">Delivery</h2>
//                 <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
//                             <Mail className="w-4 h-4 text-gray-600" />
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-sm font-medium">Email Delivery</span>
//                             <span className="text-xs text-gray-500">Digital Code sent immediately</span>
//                         </div>
//                     </div>
//                     <span className="font-bold text-sm">Free</span>
//                 </div>
//             </div>

//             {/* Billing Address Section */}
//             <div className="space-y-4">
//                 <h2 className="text-lg font-bold">Billing address</h2>
//                 <div className="space-y-3">
//                     <div className="grid grid-cols-2 gap-3">
//                         <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12" />
//                         <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12" />
//                     </div>
//                     <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="h-12" />
//                     <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-12" />
//                     <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12" />
//                 </div>
//             </div>

//             {/* Payment Section */}
//             <div className="space-y-4">
//                 <h2 className="text-lg font-bold">Payment</h2>
//                 <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>

//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                     <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
//                         <span className="text-sm font-medium">Wompi Secure Payment</span>
//                         <div className="flex gap-1">
//                             {/* Icons placeholder */}
//                             <div className="w-8 h-5 bg-white border rounded"></div>
//                             <div className="w-8 h-5 bg-white border rounded"></div>
//                         </div>
//                     </div>
//                     <div className="p-3 bg-gray-50/50 flex flex-col items-center justify-center text-center space-y-4">
//                         <Lock className="w-12 h-12 text-gray-300" />
//                         <p className="text-sm text-gray-600 max-w-xs">
//                             After clicking "Pay now", you will be redirected to Wompi to complete your purchase securely.
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Pay Button */}
//             <Button
//                 onClick={handleWompiPayment}
//                 disabled={loading || totalCents <= 0}
//                 className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-lg"
//             >
//                 {loading ? 'Processing...' : 'Pay now'}
//             </Button>

//             <p className="text-xs text-center text-gray-400">
//                 By clicking Pay now, you agree to our Terms of Service and Privacy Policy.
//             </p>
//         </div>
//     );
// }


// 4242 4242 4242 4242