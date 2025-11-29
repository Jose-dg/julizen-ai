'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // Added import for framer-motion
import { Check } from 'lucide-react'; // Added import for lucide-react Check icon

export function BenefitsSection() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <div className="relative h-[600px] rounded-3xl overflow-hidden group">
                        <Image
                            src="https://placehold.co/800x1000/00439c/ffffff?text=Happy+Gamer"
                            alt="Happy Gamer"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-10">
                            <div className="text-white">
                                <h3 className="text-4xl font-black mb-4">LEVEL UP YOUR<br />EXPERIENCE</h3>
                                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 h-12 rounded-full">
                                    GET YOUR CODE
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Benefits List */}
                    <div className="bg-blue-600 text-white p-10 md:p-16 rounded-3xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 opacity-10 font-black text-9xl leading-none select-none pointer-events-none">
                            PLAY<br />STATION
                        </div>

                        <div className="relative z-10 space-y-8">
                            {[
                                "INSTANT DELIVERY",
                                "OFFICIAL RETAILER",
                                "SECURE CHECKOUT",
                                "NO EXPIRATION",
                                "GLOBAL REGIONS",
                                "24/7 SUPPORT"
                            ].map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                                        <Check className="w-6 h-6 text-white" strokeWidth={4} />
                                    </div>
                                    <span className="text-2xl md:text-3xl font-black tracking-tight">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
