import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import '@/styles/main.scss';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://paulagualtieri.com'),
  title: {
    default: 'Dra. Paula Gualtieri | Odontología de Vanguardia',
    template: '%s | Dra. Paula Gualtieri',
  },
  description:
    'Consultorio odontológico en Buenos Aires con atención en rehabilitación, ortodoncia invisible, estética dental, endodoncia y odontología pediátrica.',
  keywords: [
    'odontología',
    'dentista',
    'rehabilitación oral',
    'ortodoncia invisible',
    'estética dental',
    'Paula Gualtieri',
    'clínica dental',
  ],
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
    url: 'https://paulagualtieri.com',
    siteName: 'Dra. Paula Gualtieri',
    title: 'Dra. Paula Gualtieri | Odontología de Vanguardia',
    description:
      'Excelencia clínica y calidez humana con atención odontológica coordinada en Buenos Aires.',
    images: [
      {
        url: '/images/isologo.png',
        width: 1080,
        height: 1080,
        alt: 'Dra. Paula Gualtieri - Clínica Odontológica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Paula Gualtieri | Odontología de Vanguardia',
    description: 'Excelencia clínica y calidez humana en Buenos Aires.',
    images: ['/images/isologo.png'],
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
    icon: '/images/p-solo.svg',
    apple: '/images/isologo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable}`}>
      <body id="site-content" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
