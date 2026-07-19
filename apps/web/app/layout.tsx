import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Amal Yatri — The lifelong wellness companion',
    template: '%s · Amal Yatri',
  },
  description:
    'Your lifelong digital home for the wellness journey that begins at Amal Tamara Ayurveda. Connect with your doctors, continue your practices, and walk alongside a calm community.',
  metadataBase: new URL('https://amalyatri.com'),
  openGraph: {
    title: 'Amal Yatri',
    description: 'The lifelong wellness companion for every Amal Tamara guest.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#3f5b46',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
