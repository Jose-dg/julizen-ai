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
  title: "DaydreamShop - Descubre tu Estilo",
  description: "Encuentra productos únicos y personalizados con la ayuda de nuestra IA inteligente. Tu tienda de ensueño con las mejores marcas y tendencias.",
  keywords: ["moda", "estilo", "productos únicos", "IA", "recomendaciones", "shopping", "tienda online"],
  authors: [{ name: "DaydreamShop Team" }],
  creator: "DaydreamShop",
  publisher: "DaydreamShop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://daydream.ing'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DaydreamShop - Descubre tu Estilo",
    description: "Encuentra productos únicos y personalizados con la ayuda de nuestra IA inteligente.",
    url: 'https://daydream.ing',
    siteName: 'DaydreamShop',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DaydreamShop - Descubre tu Estilo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DaydreamShop - Descubre tu Estilo",
    description: "Encuentra productos únicos y personalizados con la ayuda de nuestra IA inteligente.",
    images: ['/og-image.jpg'],
    creator: '@daydreamshop',
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
        <GlobalProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}