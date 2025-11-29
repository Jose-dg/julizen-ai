'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Monitor, Gamepad2, CreditCard } from 'lucide-react';

const STEPS = [
    {
        id: 'store',
        label: '1. Open Store',
        icon: Monitor,
        title: 'Go to PlayStation Store',
        description: 'On your console or via the website, navigate to the PlayStation Store icon on the home screen.',
        image: 'https://placehold.co/800x500/00439c/ffffff?text=Step+1:+Open+Store'
    },
    {
        id: 'code',
        label: '2. Enter Code',
        icon: CreditCard,
        title: 'Redeem Codes',
        description: 'Select "Redeem Codes" from the menu and enter the 12-digit code you received in your email.',
        image: 'https://placehold.co/800x500/003087/ffffff?text=Step+2:+Enter+Code'
    },
    {
        id: 'play',
        label: '3. Start Playing',
        icon: Gamepad2,
        title: 'Enjoy Your Funds',
        description: 'The funds will be instantly added to your wallet. Use them to buy games, add-ons, or subscriptions.',
        image: 'https://placehold.co/800x500/0070d1/ffffff?text=Step+3:+Play'
    }
];

export function UsageSection() {
    const [activeStep, setActiveStep] = useState(STEPS[0]);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        HOW TO REDEEM
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Start playing in minutes. Your code is delivered instantly and is easy to redeem.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Tabs */}
                    <div className="w-full md:w-1/3 flex flex-col gap-4">
                        {STEPS.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step)}
                                className={cn(
                                    "flex items-center gap-4 p-6 rounded-xl text-left transition-all duration-300 border-2",
                                    activeStep.id === step.id
                                        ? "bg-white border-blue-600 shadow-lg scale-105"
                                        : "bg-white border-transparent hover:bg-blue-50 text-gray-500"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                    activeStep.id === step.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                )}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={cn("font-bold text-lg", activeStep.id === step.id ? "text-blue-900" : "text-gray-900")}>
                                        {step.label}
                                    </h3>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white rounded-3xl p-2 shadow-xl border border-gray-100">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100"
                                >
                                    <Image
                                        src={activeStep.image}
                                        alt={activeStep.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                                        <div className="text-white">
                                            <h3 className="text-2xl font-bold mb-2">{activeStep.title}</h3>
                                            <p className="text-gray-200">{activeStep.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
