'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Placeholder images - in a real app these would be real URLs
// Using generic placeholders for now as I don't have the original images
const IMAGES = [
    { id: 1, src: 'https://placehold.co/600x600/d00000/ffffff?text=Cupping+Massager+1', alt: 'Renoheal Cupping Massager Main' },
    { id: 2, src: 'https://placehold.co/600x600/d00000/ffffff?text=Close+Up', alt: 'Renoheal Close Up' },
    { id: 3, src: 'https://placehold.co/600x600/d00000/ffffff?text=Product+Only', alt: 'Renoheal Product Only' },
];

export function HeroGallery() {
    const [activeImage, setActiveImage] = useState(IMAGES[0]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-red-50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={activeImage.src}
                            alt={activeImage.alt}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {IMAGES.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => setActiveImage(img)}
                        className={cn(
                            "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                            activeImage.id === img.id
                                ? "border-red-600 ring-2 ring-red-100"
                                : "border-transparent hover:border-red-200"
                        )}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
