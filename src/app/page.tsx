'use client';

import { ProductHero } from '@/components/product/ProductHero';
import { BenefitsSection } from '@/components/product/BenefitsSection';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { UsageSection } from '@/components/product/UsageSection';
import { AsSeenOnSection } from '@/components/product/AsSeenOnSection';
import { BundleSection } from '@/components/product/BundleSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section: Interactive Card & Selectors */}
      <ProductHero />

      {/* Social Proof: Logos & Stats */}
      <AsSeenOnSection />

      {/* Value Props: Instant Delivery, Secure, etc. */}
      <BenefitsSection />

      {/* Upsell: Ultimate Bundle */}
      {/* <BundleSection /> */}

      {/* How it Works: Redemption Guide */}
      <UsageSection />

      {/* Social Proof: User Reviews */}
      {/* <ReviewsSection /> */}
    </main>
  );
}