'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function BenefitsSection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
            {/* Left: Image & Overlay */}
            <div className="relative bg-gray-900 flex items-center justify-center p-12 text-center text-white overflow-hidden group">
                <Image
                    src="https://placehold.co/800x800/333333/ffffff?text=Woman+Working"
                    alt="Woman working with massager"
                    fill
                    className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="relative z-10 space-y-6 max-w-md">
                    <h2 className="text-5xl md:text-6xl font-black uppercase leading-none">
                        Sooo Many<br />Benefits
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-gray-200">
                        Better than expensive red light therapy sessions. Get professional relief at home.
                    </p>
                    <Button className="h-14 px-8 text-lg font-bold uppercase bg-red-600 hover:bg-red-700 text-white border-none">
                        I Want It Now!
                    </Button>
                </div>
            </div>

            {/* Right: Red Block */}
            <div className="bg-[#D00000] flex flex-col justify-center p-12 relative overflow-hidden">
                <div className="space-y-2">
                    {[
                        "HIGH QUALITY",
                        "SELF APPLICATION",
                        "1 YEAR WARRANTY",
                        "KNOT & PAIN RELIEF",
                        "30 DAY GUARANTEE",
                        "IMPROVED CIRCULATION"
                    ].map((text, i) => (
                        <div
                            key={i}
                            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter opacity-90 hover:opacity-100 hover:translate-x-4 transition-all duration-300 cursor-default"
                            style={{
                                textShadow: i % 2 === 0 ? '4px 4px 0px rgba(0,0,0,0.1)' : 'none',
                                marginLeft: i % 2 !== 0 ? '2rem' : '0'
                            }}
                        >
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
