/**
 * components/sections/HomeRail.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Navigacija kroz sekcije naslovnice. Samo lista sekcija na oba jezika;
 * sav prikaz radi zajednička komponenta SectionRail (desktop tračnica,
 * mobilna linija napretka).
 *
 * Redoslijed prati stvarni redoslijed sekcija na stranici. Ako se sekcije
 * ikad presложe, ovdje se samo promijeni redoslijed.
 */

"use client";

import { useLanguage } from "@/components/ui/LanguageProvider";
import { SectionRail } from "@/components/ui/SectionRail";

const ITEMS = {
  bs: [
    { id: "o-nama",     label: "O nama" },
    { id: "usluge",     label: "Usluge" },
    { id: "rezultati",  label: "Rezultati" },
    { id: "portfolio",  label: "Portfolio" },
    { id: "cjenovnik",  label: "Cjenovnik" },
    { id: "vrijednost", label: "Vrijednost" },
    { id: "saas",       label: "Flagship" },
    { id: "kontakt",    label: "Kontakt" },
  ],
  en: [
    { id: "o-nama",     label: "About" },
    { id: "usluge",     label: "Services" },
    { id: "rezultati",  label: "Results" },
    { id: "portfolio",  label: "Portfolio" },
    { id: "cjenovnik",  label: "Pricing" },
    { id: "vrijednost", label: "Value" },
    { id: "saas",       label: "Flagship" },
    { id: "kontakt",    label: "Contact" },
  ],
} as const;

export function HomeRail() {
  const { lang } = useLanguage();
  return <SectionRail items={ITEMS[(lang as "bs" | "en")] ?? ITEMS.bs} />;
}
