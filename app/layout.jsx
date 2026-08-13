import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import AmbientBackground from '@/components/AmbientBackground';
import SiteChrome from '@/components/SiteChrome';
import './globals.css';

<body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} min-h-screen font-sans text-[#14231C] antialiased`}>
  <AmbientBackground />
  <SiteChrome>{children}</SiteChrome>
</body>


const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// ⚠️ Remplacez metadataBase par votre nom de domaine réel une fois choisi
// (nécessaire pour que les images de partage og:image s'affichent correctement
// sur WhatsApp/Facebook). Ajoutez aussi /public/og-image.png (1200×630px).
export const metadata = {
  metadataBase: new URL('https://votre-domaine.tld'),
  title: "Trouve ta voie après le BAC — Bourse d'État & Orientation (Bénin)",
  description:
    "Calculez vos chances de bourse d'État et découvrez les filières publiques et privées compatibles avec votre série au BAC. Toutes séries, dès 325 FCFA.",
  openGraph: {
    title: "Trouve ta voie après le BAC",
    description: "Simulateur d'orientation et de bourse d'État pour les bacheliers du Bénin.",
    locale: 'fr_BJ',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Trouve ta voie après le BAC",
    description: "Simulateur d'orientation et de bourse d'État pour les bacheliers du Bénin.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-[#F5F7F2] font-sans text-[#14231C] antialiased`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
