'use client';

import React, { useState } from 'react';

import { HeroInfo } from './HeroInfo';
// import { HeroGallery } from './HeroGallery';

import { useGlobal } from '@/lib/global-context';
import { PLAYSTATION_PRICING } from '@/lib/pricing-data';
import { FaPlaystation } from "react-icons/fa";

function PlayStationGiftCard({ denomination, region }: { denomination: number, region: any }) {
    const { currency, formatPrice } = useGlobal();
    // const price = PLAYSTATION_PRICING[denomination]?.[currency] || denomination;
    // const formattedPrice = formatPrice(price);

    // Visual Card Value: Depends on Region + Denomination (e.g. $50)
    const cardValue = `${region.currency}${denomination}`;

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl">

                {/* Tarjeta PlayStation Gift Card */}
                <div className="flex justify-center">
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md"
                        style={{ aspectRatio: '492 / 500' }} // misma proporción que la imagen
                    >
                        <div className="flex h-full flex-col">
                            {/* Sección superior blanca */}
                            <div className="px-6 pt-6 pb-5 border-b border-gray-200 bg-gradient-to-b from-white via-white to-slate-100 flex items-start justify-between">
                                {/* GIFT CARD + puntos + flecha */}
                                <div className="flex flex-col">
                                    <span
                                        className="text-[22px] leading-none font-black tracking-tight"
                                        style={{ color: '#233878', fontFamily: '"Arial Black", system-ui, sans-serif' }}
                                    >
                                        GIFT
                                    </span>
                                    <span
                                        className="text-[22px] leading-tight font-black tracking-tight"
                                        style={{ color: '#233878', fontFamily: '"Arial Black", system-ui, sans-serif' }}
                                    >
                                        CARD
                                    </span>

                                    <div className="mt-3 flex flex-col items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#233878' }} />
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#233878' }} />
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#233878' }} />
                                        <div className="mt-1 text-lg leading-none" style={{ color: '#233878' }}>
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                {/* Precio */}
                                <div className="text-right">
                                    <div
                                        className="leading-none font-black"
                                        style={{
                                            color: '#233878',
                                            fontFamily: '"Arial Black", system-ui, sans-serif',
                                            fontSize: '40px',
                                        }}
                                    >
                                        {cardValue}
                                    </div>
                                    <div
                                        className="mt-1 text-xs font-bold tracking-[0.18em]"
                                        style={{ color: '#233878' }}
                                    >
                                        {region.name}
                                    </div>
                                </div>
                            </div>

                            {/* Cuerpo azul PlayStation */}
                            <div
                                className="flex-1 flex flex-col items-center justify-center px-6"
                                style={{ backgroundColor: '#0639A2' }} // azul muy cercano al original
                            >
                                {/* Logo PlayStation */}
                                <FaPlaystation className="w-32 h-32 text-white mb-6 p-2" />

                                {/* PlayStation Store */}
                                {/* <div className="flex items-center gap-3 mb-8">
                                    <div
                                        className="w-11 h-11 rounded-md flex items-center justify-center"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, #0070CC 0%, #0050A0 50%, #003E84 100%)',
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-6 h-6"
                                            fill="white"
                                            aria-hidden="true"
                                        >
                                            <path d="M17 7h-2.2L14 4.9C13.5 3.8 12.6 3 11.5 3S9.5 3.8 9 4.9L8.2 7H6C5.4 7 5 7.4 5 8v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1h-1zm-5.5-2c.3 0 .7.3.9.8L13 7H10l.6-1.2c.2-.5.6-.8.9-.8z" />
                                            <path d="M10 11.5c-.7.3-1.2.9-1.2 1.7 0 1 .8 1.8 1.8 1.8.8 0 1.4-.5 1.7-1.2l-2.3-.8v-1.5zM14.6 12.3l-.7 1.3 1.7.6c-.2.3-.5.5-.9.5H15v1h.2c1.1 0 2-.9 2-2 0-.8-.5-1.5-1.4-1.8l-1.2-.4z" />
                                        </svg>
                                    </div>

                                    <div
                                        className="text-white text-[22px] leading-none"
                                        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
                                    >
                                        <span className="font-light">PlayStation</span>
                                        <span className="font-normal">.Store</span>
                                    </div>
                                </div> */}
                            </div>

                            {/* Barra inferior DIGITAL CODE */}
                            <div className="bg-white border-t border-gray-200 flex items-center justify-center py-3">
                                <span
                                    className="text-[13px] font-black tracking-[0.35em]"
                                    style={{ color: '#233878', fontFamily: '"Arial Black", system-ui, sans-serif' }}
                                >
                                    DIGITAL&nbsp;CODE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Texto adicional (opcional) */}
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Vista previa de la Gift Card de PlayStation. El código digital se enviará por correo electrónico.
                </p>
            </div>
        </div>
    );
}

const REGIONS = [
    { id: 'usa', name: 'USA', flag: '🇺🇸', currency: '$', currencyCode: 'USD' },
    { id: 'eu', name: 'Spain', flag: '🇪🇸', currency: '€', currencyCode: 'EUR' },
    { id: 'co', name: 'Colombia', flag: '🇨🇴', currency: '$', currencyCode: 'COP_PSN' },
    // { id: 'jp', name: 'Brazil', flag: '🇧🇷', currency: 'R$', currencyCode: 'BRL' },
    // { id: 'latam', name: 'Canada', flag: '🇨🇦', currency: '$', currencyCode: 'CAD' },
    // { id: 'asia', name: 'Arabia Saudi', flag: '🇸🇦', currency: '﷼', currencyCode: 'SAR' },
];

export function ProductHero() {
    const [denomination, setDenomination] = useState(50);
    const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);

    return (
        <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* <HeroGallery /> */}
                <PlayStationGiftCard denomination={denomination} region={selectedRegion} />
                <HeroInfo
                    selectedDenomination={denomination}
                    onSelectDenomination={setDenomination}
                    selectedRegion={selectedRegion}
                    onSelectRegion={setSelectedRegion}
                    regions={REGIONS}
                />
            </div>
        </section>
    );
}


