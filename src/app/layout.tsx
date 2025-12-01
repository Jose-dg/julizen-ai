import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { GlobalProvider } from "@/lib/global-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money for gamers - Tu tienda de gaming",
  description: "Encuentra los mejores códigos, gift cards y productos para gamers. PlayStation, Xbox, Steam y más. Compra segura y entrega instantánea.",
  keywords: ["gaming", "gift cards", "códigos", "PlayStation", "Xbox", "Steam", "Nintendo", "gamers", "tienda gaming"],
  authors: [{ name: "Money for gamers Team" }],
  creator: "Money for gamers",
  publisher: "Money for gamers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://moneyforgamers.ing'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Money for gamers - Tu tienda de gaming",
    description: "Encuentra los mejores códigos, gift cards y productos para gamers. Compra segura y entrega instantánea.",
    url: 'https://moneyforgamers.com',
    siteName: 'Money for gamers',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Money for gamers - Tu tienda de gaming',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Money for gamers - Tu tienda de gaming",
    description: "Encuentra los mejores códigos, gift cards y productos para gamers. Compra segura y entrega instantánea.",
    images: ['/og-image.jpg'],
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
  },
};

import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';

import { CartSidebar } from "@/components/cart/CartSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GlobalProvider>
            <CartProvider>
              <Header />
              <CartSidebar />
              {children}
            </CartProvider>
          </GlobalProvider>
        </Providers>
      </body>
    </html>
  );
}