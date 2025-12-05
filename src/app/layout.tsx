import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { GlobalProvider } from "@/lib/global-context";
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { CartSidebar } from "@/components/cart/CartSidebar";

import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MetaPixel from '@/components/analytics/MetaPixel';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import TikTokPixel from '@/components/analytics/TikTokPixel';
import HelloBar from '@/components/marketing/HelloBar';
import NewsletterPopup from '@/components/marketing/NewsletterPopup';
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import { WebVitals } from '@/components/analytics/WebVitals';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://moneyforgamers.com'),
  title: {
    default: 'Money for Gamers - Gift Cards Digitales para Gaming',
    template: '%s | Money for Gamers',
  },
  description: 'Compra gift cards digitales para PlayStation, Xbox, Nintendo y más. Entrega instantánea. Los mejores precios en gift cards de gaming.',
  keywords: ['gift cards', 'gaming', 'playstation', 'xbox', 'nintendo', 'tarjetas de regalo', 'códigos digitales'],
  authors: [{ name: 'Money for Gamers' }],
  creator: 'Money for Gamers',
  publisher: 'Money for Gamers',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://moneyforgamers.com',
    siteName: 'Money for Gamers',
    title: 'Money for Gamers - Gift Cards Digitales',
    description: 'Compra gift cards digitales para PlayStation, Xbox, Nintendo y más. Entrega instantánea.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Money for Gamers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Money for Gamers - Gift Cards Digitales',
    description: 'Compra gift cards digitales para gaming con entrega instantánea',
    images: ['/twitter-image.jpg'],
    creator: '@moneyforgamers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HelloBar />
        <Providers>
          <GlobalProvider>
            <CartProvider>
              <Header />
              <CartSidebar />
              {children}
              <NewsletterPopup />
            </CartProvider>
          </GlobalProvider>
        </Providers>

        {/* Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <MetaPixel PIXEL_ID={process.env.NEXT_PUBLIC_FB_PIXEL_ID} />
        )}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager GTM_ID={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <MicrosoftClarity CLARITY_ID={process.env.NEXT_PUBLIC_CLARITY_ID} />
        )}
        {process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && (
          <TikTokPixel PIXEL_ID={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID} />
        )}

        {/* SEO */}
        <OrganizationSchema />

        {/* Performance */}
        <WebVitals />
      </body>
    </html>
  );
}