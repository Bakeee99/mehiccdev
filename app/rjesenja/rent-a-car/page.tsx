/**
 * app/rjesenja/rent-a-car/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Landing stranica za rent-a-car rezervacioni sistem.
 *
 * Server komponenta: nosi metadata i strukturirane podatke, a sam sadržaj
 * renderuje klijentska komponenta (jezik se bira na klijentu).
 *
 * NAPOMENA O JEZIKU: sajt mijenja jezik na klijentu (LanguageProvider), nema
 * odvojene /bs i /en rute, pa metadata mora biti u jednom jeziku. Bosanski je
 * primarni jer su kupci ovdje, a engleski opis je u openGraph alternativi.
 * Kada (ako) uvedemo prave locale rute, metadata se dijeli po jeziku.
 */

import type { Metadata } from "next";
import { COPY } from "@/components/rjesenja/rentACarCopy";
import { RentACarSections } from "@/components/rjesenja/RentACarSections";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

const PAGE_URL = "https://mehiccdev.com/rjesenja/rent-a-car";

export const metadata: Metadata = {
  metadataBase: new URL("https://mehiccdev.com"),
  title: COPY.bs.meta.title,
  description: COPY.bs.meta.description,
  keywords: [
    "rezervacioni sistem rent a car",
    "web aplikacija za rent a car",
    "sistem za iznajmljivanje vozila",
    "software za rent a car",
    "kalendar dostupnosti vozila",
    "car rental booking system",
    "car rental management software",
    "mehiccdev",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: COPY.bs.meta.title,
    description: COPY.bs.meta.description,
    url: PAGE_URL,
    siteName: "mehiccdev",
    locale: "bs_BA",
    type: "website",
    images: [{ url: "/portfolio/maximum-naslovna.png", width: 1200, height: 630, alt: COPY.bs.caseStudy.imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: COPY.bs.meta.title,
    description: COPY.bs.meta.description,
    images: ["/portfolio/maximum-naslovna.png"],
  },
  robots: { index: true, follow: true },
};

/* Service schema: Google ovako razumije da je ovo konkretna usluga, s
   ponuđačem, područjem i paketima. FAQ schema dolazi iz FAQ sekcije i može
   donijeti prošireni prikaz u rezultatima pretrage. */
const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Rezervacioni sistem za rent-a-car firme",
  serviceType: "Web aplikacija za iznajmljivanje vozila",
  description: COPY.bs.meta.description,
  url: PAGE_URL,
  provider: {
    "@type": "ProfessionalService",
    name: "mehiccdev",
    url: "https://mehiccdev.com",
    email: "bakir.mehic@mehiccdev.com",
    address: { "@type": "PostalAddress", addressLocality: "Mostar", addressCountry: "BA" },
  },
  areaServed: ["Bosnia and Herzegovina", "Croatia", "Serbia", "Montenegro"],
  availableLanguage: ["bs", "en"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paketi",
    itemListElement: COPY.bs.packages.items.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.size,
    })),
  },
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COPY.bs.faq.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function RentACarPage() {
  return (
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }} />
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      <Navbar />
      <RentACarSections />
      <Footer />
    </>
  );
}
