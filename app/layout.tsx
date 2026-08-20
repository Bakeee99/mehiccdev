/**
 * app/layout.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root layout — wraps app with ThemeProvider + LanguageProvider,
 * loads Plus Jakarta Sans, sets SEO metadata.
 */

import type { Metadata } from "next";
import { ThemeProvider }    from "@/components/ui/ThemeProvider";
import { LanguageProvider } from "@/components/ui/LanguageProvider";
import { BackgroundLayers, BlueprintLayer } from "@/components/ui/BackgroundFX";
import "./globals.css";

// NOTE: Plus Jakarta Sans is loaded via @import in globals.css (not next/font).
// This avoids any build-time font fetch and keeps deployment rock-solid.

export const metadata: Metadata = {
  metadataBase: new URL("https://mehiccdev.com"),

  /* Naslov je i tekst u tabu i plavi link u Google rezultatima.
     Brend ide prvi (tab prikaže samo prvih ~20 znakova, pa se vidi
     "mehiccdev · Web apl…"), a ostatak nosi ključne riječi i grad.
     template dodaje brend na naslove podstranica automatski. */
  title: {
    default: "mehiccdev · Web aplikacije i sajtovi, Mostar",
    template: "%s · mehiccdev",
  },
  description:
    "Gradimo web aplikacije za rezervacije i najam, sajtove koje sami uređujete i marketing koji dovodi upite. Iz Mostara za cijeli region.",
  keywords: [
    "mehiccdev",
    "izrada web aplikacija Mostar",
    "izrada sajtova Mostar",
    "sistem za rezervacije",
    "rent a car sistem",
    "sistem za najam vozila",
    "web aplikacija za firmu",
    "digitalni marketing BiH",
    "Next.js razvoj",
    "web development Bosnia",
  ],
  authors: [{ name: "mehiccdev" }],
  creator: "mehiccdev",
  alternates: { canonical: "https://mehiccdev.com" },
  openGraph: {
    title: "mehiccdev · Web aplikacije, sajtovi i marketing",
    description:
      "Sistem za rezervacije i najam, sajt koji sami uređujete i marketing koji dovodi upite. Studio iz Mostara.",
    url: "https://mehiccdev.com",
    siteName: "mehiccdev",
    locale: "bs_BA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "mehiccdev · Web aplikacije, sajtovi i marketing",
    description: "Sistem za rezervacije i najam, sajt koji sami uređujete i marketing koji dovodi upite.",
  },
  robots: { index: true, follow: true },
};

/* Strukturirani podaci: ovako Google prepoznaje mehiccdev kao lokalnu
   uslužnu firmu iz Mostara, što pomaže kod pretraga tipa
   "izrada sajtova Mostar". */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "mehiccdev",
  url: "https://mehiccdev.com",
  email: "bakir.mehic@mehiccdev.com",
  description:
    "Web studio iz Mostara. Gradimo web aplikacije za rezervacije i najam, sajtove i digitalni marketing.",
  address: { "@type": "PostalAddress", addressLocality: "Mostar", addressCountry: "BA" },
  areaServed: ["Bosnia and Herzegovina", "Croatia", "Serbia", "Montenegro"],
  knowsLanguage: ["bs", "en"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" suppressHydrationWarning>
      <head>
        <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <LanguageProvider>
            {/* ── Potpisna pozadina v2 "ŽIVI SISTEM": svjetlo, šine s pulsom
                   koji putuje kroz njih, zrno, i blueprint skice po dubini
                   stranice. Sve u components/ui/BackgroundFX.tsx. ── */}
            <BackgroundLayers />

            {/* sav sadržaj iznad potpisnih slojeva */}
            <div className="relative z-10">
              <BlueprintLayer />
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
