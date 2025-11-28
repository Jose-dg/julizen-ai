import React from 'react';
import { SaleBanner } from '@/components/layout/SaleBanner';
import { Header } from '@/components/layout/Header';
import { ProductHero } from '@/components/product/ProductHero';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { BundleSection } from '@/components/product/BundleSection';
import { AsSeenOnSection } from '@/components/product/AsSeenOnSection';
import { BenefitsSection } from '@/components/product/BenefitsSection';
import { UsageSection } from '@/components/product/UsageSection';
import { StickyAddToCart } from '@/components/product/StickyAddToCart';

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-24">
            <SaleBanner />
            <Header />
            <main>
                <ProductHero />
                <ReviewsSection />
                <BundleSection />
                <AsSeenOnSection />
                <BenefitsSection />
                <UsageSection />
            </main>
            <StickyAddToCart />
        </div>
    );
}

