'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const LOGOS = ["SHAPE", "APTA", "USA TODAY", "BBC"];

const STATS = [
    { pct: "93%", text: "Pain relief in 20 minutes" },
    { pct: "87%", text: "Improved joint mobility" },
    { pct: "91%", text: "Faster post-workout recovery" },
];

export function AsSeenOnSection() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            {/* Logos */}
            <div className="container mx-auto px-4 text-center mb-12">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">As Seen On</h3>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
                    {LOGOS.map((logo) => (
                        <span key={logo} className="text-2xl md:text-3xl font-black font-serif text-gray-800">
                            {logo}
                        </span>
                    ))}
                </div>
            </div>

            {/* Ticker */}
            <div className="bg-black text-white py-3 overflow-hidden whitespace-nowrap mb-16">
                <div className="animate-marquee inline-block">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="mx-4 text-sm font-bold uppercase tracking-widest">
                            EMPOWER YOUR LIFE · REVITALIZE YOUR BODY ·
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                        <Image
                            src="https://placehold.co/600x800/f0f0f0/333333?text=Lifestyle+Image"
                            alt="Woman using Renoheal"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Right: Stats */}
                    <div className="space-y-6">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-600 font-black text-2xl shrink-0">
                                    {stat.pct}
                                </div>
                                <p className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                                    {stat.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
