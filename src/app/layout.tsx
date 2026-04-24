import type {Metadata} from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: {
    default: 'Dra. Paula Gualtieri | Odontología de Vanguardia',
    template: '%s | Dra. Paula Gualtieri'
  },
  description: 'Clínica odontológica de vanguardia en Buenos Aires. Excelencia clínica y calidez humana. Especialistas en implantes, ortodoncia invisible y estética dental.',
  keywords: ['odontología', 'dentista', 'implantes dentales', 'ortodoncia invisible', 'estética dental', 'Paula Gualtieri', 'clínica dental'],
  authors: [{ name: 'Dra. Paula Gualtieri' }],
  creator: 'Dra. Paula Gualtieri',
  publisher: 'Dra. Paula Gualtieri',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://odontopau.com',
    siteName: 'Dra. Paula Gualtieri',
    title: 'Dra. Paula Gualtieri | Odontología de Vanguardia',
    description: 'Excelencia clínica y calidez humana. Especialistas en implantes, ortodoncia invisible y estética dental con tecnología de precisión.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dra. Paula Gualtieri - Clínica Odontológica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Paula Gualtieri | Odontología de Vanguardia',
    description: 'Excelencia clínica y calidez humana en Buenos Aires.',
    images: ['/images/og-image.jpg'],
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${manrope.variable}`}>
      <body suppressHydrationWarning className="font-sans">{children}</body>
    </html>
  );
}
