import type { Metadata } from "next";
import { MaximumCaseStudy } from "@/components/portfolio/MaximumCaseStudy";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

const PAGE_URL = "https://mehiccdev.com/maximum";

export const metadata: Metadata = {
  metadataBase: new URL("https://mehiccdev.com"),
  title: "Maximum Rent a Car - Case Study | mehiccdev",
  description:
    "Pregled arhitekture i razvoja SaaS rješenja za rent-a-car agencije.",
  keywords: [
    "maximum rent a car",
    "case study rent a car sistem",
    "rezervacioni sistem rent a car",
    "web aplikacija za iznajmljivanje vozila",
    "mehiccdev",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Maximum Rent a Car - Case Study | mehiccdev",
    description: "Pregled arhitekture i razvoja SaaS rješenja za rent-a-car agencije.",
    url: PAGE_URL,
    siteName: "mehiccdev",
    locale: "bs_BA",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maximum Rent a Car - Case Study | mehiccdev",
    description: "Pregled arhitekture i razvoja SaaS rješenja za rent-a-car agencije.",
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Maximum Rent a Car",
  headline: "Maximum Rent a Car - Case Study",
  description: "Pregled arhitekture i razvoja SaaS rješenja za rent-a-car agencije.",
  url: PAGE_URL,
  author: { "@type": "Organization", name: "mehiccdev", url: "https://mehiccdev.com" },
  inLanguage: ["bs", "en"],
};

export default function MaximumCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Navbar />
      <MaximumCaseStudy />
      <Footer />
    </>
  );
}
