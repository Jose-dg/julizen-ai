import React from 'react';
import { HeroGallery } from './HeroGallery';
import { HeroInfo } from './HeroInfo';

export function ProductHero() {
    return (
        <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <HeroGallery />
                <HeroInfo />
            </div>
        </section>
    );
}
