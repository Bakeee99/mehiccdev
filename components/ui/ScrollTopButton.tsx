/**
 * components/ui/ScrollTopButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dugme za povratak na vrh stranice.
 *
 * Stoji u donjem desnom uglu, IZNAD WhatsApp dugmeta, i namjerno je manje i
 * diskretnije od njega: WhatsApp donosi kontakte i mora ostati dominantan, a
 * ovo je pomoćna radnja.
 *
 * Pojavljuje se tek kad posjetilac pređe visinu jednog ekrana, pa ne smeta na
 * vrhu. Radi i na desktopu i na mobitelu. Poštuje "reduced motion": tada skače
 * na vrh bez klizanja.
 *
 * NAPOMENA O RASPOREDU: donji položaj (bottom-24) računa visinu WhatsApp
 * dugmeta. Ako se ono ikad promijeni, uskladiti i ovu vrijednost.
 */

"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { WHATSAPP } from "@/lib/contact";

export function ScrollTopButton() {
  const { lang } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const label = lang === "en" ? "Back to top" : "Na vrh stranice";

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={label}
      title={label}
      className={`fixed right-5 z-40 w-11 h-11 rounded-2xl flex items-center justify-center
                  border border-[var(--border)] text-[var(--text-muted)]
                  bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]
                  shadow-lg shadow-black/25
                  transition-[opacity,transform,border-color,color] duration-300
                  hover:text-[var(--text)] hover:border-brand-600/45 hover:-translate-y-0.5
                  ${WHATSAPP ? "bottom-24" : "bottom-5"}
                  ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
