import React from 'react';
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
        <>
            
            <Header />
            <main>
                <ProductHero />
                {/* <ReviewsSection /> */}
                <BundleSection />
                <AsSeenOnSection />
                {/* <BenefitsSection /> */}
                <UsageSection />
            </main>
            <StickyAddToCart />
        </>
    );
}

