'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const USAGE_AREAS = [
    { id: 'arms', label: 'Arms', image: 'https://placehold.co/800x600/f0f0f0/333333?text=Usage+on+Arms' },
    { id: 'legs', label: 'Legs', image: 'https://placehold.co/800x600/f0f0f0/333333?text=Usage+on+Legs' },
    { id: 'back', label: 'Back', image: 'https://placehold.co/800x600/f0f0f0/333333?text=Usage+on+Back' },
];

export function UsageSection() {
    const [activeTab, setActiveTab] = useState(USAGE_AREAS[0]);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8">Target Every Area</h2>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    {USAGE_AREAS.map((area) => (
                        <button
                            key={area.id}
                            onClick={() => setActiveTab(area)}
                            className={cn(
                                "px-6 py-2 rounded-full font-bold uppercase tracking-wide transition-all",
                                activeTab.id === area.id
                                    ? "bg-red-600 text-white shadow-lg scale-105"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                        >
                            {area.label}
                        </button>
                    ))}
                </div>

                {/* Image Display */}
                <div className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={activeTab.image}
                                alt={`Usage on ${activeTab.label}`}
                                fill
                                className="object-cover"
                            />

                            {/* Overlay Label */}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-lg shadow-sm">
                                <span className="text-xl font-bold uppercase text-gray-900">{activeTab.label}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
