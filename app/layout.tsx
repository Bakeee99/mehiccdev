/**
 * app/layout.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root layout — wraps app with ThemeProvider + LanguageProvider,
 * loads Plus Jakarta Sans, sets SEO metadata.
 */

import type { Metadata } from "next";
import { ThemeProvider }    from "@/components/ui/ThemeProvider";
import { LanguageProvider } from "@/components/ui/LanguageProvider";
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
            {/* ── Potpisni pozadinski sistem: "inženjerski papir + studijsko svjetlo"
                   Tri statična, fiksna sloja iza cijelog sajta (nula JS, nula blur
                   filtera). Redom: jedan izvor svjetla s vrha, editorijalne šine
                   uz rubove sadržajnog stupca, i zrno preko svega. ── */}
            <div aria-hidden className="fixed inset-x-0 top-0 h-[85vh] z-0 pointer-events-none
                                        bg-[radial-gradient(120%_75%_at_50%_-15%,rgba(37,99,235,0.13),transparent_62%)]
                                        dark:bg-[radial-gradient(120%_75%_at_50%_-15%,rgba(59,130,246,0.16),transparent_62%)]" />
            <div aria-hidden className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 lg:px-8 z-0 pointer-events-none hidden md:block">
              <div className="h-full border-x border-[color-mix(in_srgb,var(--border)_45%,transparent)]" />
            </div>
            <div aria-hidden className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.035] dark:opacity-[0.05]" />

            {/* sav sadržaj iznad potpisnih slojeva */}
            <div className="relative z-10">
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
