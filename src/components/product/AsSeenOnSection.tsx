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
                {/* Logos */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {['IGN', 'KOTAKU', 'GAMESPOT', 'POLYGON', 'EUROGAMER'].map((brand) => (
                        <span key={brand} className="text-2xl font-black text-gray-400 hover:text-blue-600 cursor-default">
                            {brand}
                        </span>
                    ))}
                </div>
            </div>

            {/* Scrolling Ticker */}
            <div className="bg-blue-600 py-3 overflow-hidden whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex gap-8 text-white font-bold text-sm uppercase tracking-widest"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="flex items-center gap-8">
                            INSTANT DIGITAL DELIVERY • OFFICIAL RETAILER • NO EXPIRATION DATE • SECURE PAYMENT •
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Stats / Lifestyle */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight">
                            TRUSTED BY <span className="text-blue-600">MILLIONS</span> OF GAMERS WORLDWIDE
                        </h2>
                        <p className="text-gray-600 text-lg">
                            We are the #1 destination for digital gift cards. Join our community and start playing your favorite games instantly.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Codes Delivered', value: '1M+' },
                                { label: 'Happy Gamers', value: '500K+' },
                                { label: 'Support', value: '24/7' },
                                { label: 'Rating', value: '4.9/5' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                                >
                                    <div className="text-3xl font-black text-blue-600 mb-1">{stat.value}</div>
                                    <div className="text-sm font-bold text-gray-500 uppercase">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://placehold.co/800x1000/00439c/ffffff?text=Gaming+Setup"
                            alt="Gaming Setup"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
