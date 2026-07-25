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
  title: "mehiccdev — Digital Agency | Web, AI & Marketing",
  description:
    "We turn business goals into digital realities. Web development, AI integrations, digital marketing & SaaS solutions for the Balkans and beyond.",
  keywords: ["web development", "digital agency", "Next.js", "Webflow", "AI", "digital marketing", "Bosnia", "mehiccdev"],
  authors: [{ name: "mehiccdev" }],
  openGraph: {
    title: "mehiccdev — Digital Agency",
    description: "Web development, AI integrations & digital marketing for ambitious brands.",
    url: "https://mehiccdev.com",
    siteName: "mehiccdev",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
