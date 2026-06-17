import type { Metadata } from 'next'
import { Outfit, Cinzel, Playfair_Display, Montserrat, DM_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { GoldEmbroideryDefs } from '@/components/ui/GoldEmbroidery'
import { Preloader } from '@/components/ui/Preloader'


// ── Font loading (CSS variable method — zero CLS) ────────────────────────────
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  weight: ['400', '500'],
})

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Dollars Colony Kundapura | Premium Coastal Villa Plots',
  description:
    'Dollars Colony is a premium coastal villa plot community in Kundapura with clubhouse, lifestyle amenities and limited villa plots close to beaches, backwaters and NH66.',
  keywords: [
    'Dollars Colony Kundapura',
    'Villa plots in Kundapura',
    'Premium plots in Kundapura',
    'Coastal villa plots Karnataka',
    'Beachside plots in Kundapura',
    'Gated community plots Kundapura',
    'Plots near Kodi Beach',
    'Plots near Maravanthe Beach',
    'Holiday home plots Karnataka',
    'NRI investment property Karnataka',
  ],
  openGraph: {
    title: 'Dollars Colony Kundapura | Premium Coastal Villa Plots',
    description:
      'Premium coastal villa plot community in Kundapura, Karnataka. Clubhouse, gated security, landscaped greens. Limited plots available.',
    url: 'https://dollarscolony.in',
    type: 'website',
    siteName: 'Dollars Colony',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dollars Colony Kundapura | Premium Coastal Villa Plots',
    description: 'Premium coastal villa plot community in Kundapura, Karnataka.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://dollarscolony.in'),
}

// ── Schema.org LocalBusiness JSON-LD ─────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Dollars Colony @ Viaan Enclave',
  description: 'Premium coastal villa plot community in Kundapura, Karnataka, developed by Sri Brahmari Developers.',
  url: 'https://dollarscolony.in',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kundapura',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
    postalCode: '576201',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.6252003,
    longitude: 74.6792679,
  },
  sameAs: ['https://dollarscolony.in'],
}

const GA_ID    = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cinzel.variable} ${playfair.variable} ${montserrat.variable} ${dmMono.variable}`}
    >
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className="antialiased font-outfit" style={{ background: '#F5F0E8' }}>
        <Preloader />
        <GoldEmbroideryDefs />
        {children}

        {/* ── Google Analytics 4 ───────────────────────────────────────────── */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        {/* ── Meta Pixel ───────────────────────────────────────────────────── */}
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  )
}
