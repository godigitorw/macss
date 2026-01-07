import type { Metadata } from 'next';
import { Manrope, Roboto } from 'next/font/google';
import './globals.css';
import { defaultSEO, organizationStructuredData } from '@/lib/seo';
import { Toaster } from 'sonner';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MAC SS Real Estate Rwanda - Buy, Rent & Sell Property in Kigali',
    template: '%s | MAC SS Real Estate Rwanda',
  },
  description: defaultSEO.description,
  keywords: [
    'real estate Rwanda',
    'property Rwanda',
    'houses for sale in Kigali',
    'apartments for rent Kigali',
    'furnished apartments Kigali',
    'cheap houses for rent Kigali',
    'luxury homes Kigali',
    'land for sale Rwanda',
    'plots for sale in Kigali',
    'commercial property Rwanda',
    'office space for rent Kigali',
    'warehouse for rent Rwanda',
    'real estate companies in Rwanda',
    'property management Rwanda',
    'buy house in Rwanda',
    'MAC SS Real Estate',
    'property investment Rwanda',
  ],
  authors: [{ name: 'MAC SS Real Estate Rwanda' }],
  creator: 'MAC SS Real Estate Rwanda',
  openGraph: {
    type: 'website',
    locale: 'en_RW',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'MAC SS Real Estate Rwanda',
    title: 'MAC SS Real Estate Rwanda - Property for Sale & Rent',
    description: defaultSEO.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAC SS Real Estate Rwanda',
    description: defaultSEO.description,
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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  icons: {
    icon: 'https://macss.b-cdn.net/mac%20ss%20real%20estate%20solution.png',
    shortcut: 'https://macss.b-cdn.net/mac%20ss%20real%20estate%20solution.png',
    apple: 'https://macss.b-cdn.net/mac%20ss%20real%20estate%20solution.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${roboto.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={roboto.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
