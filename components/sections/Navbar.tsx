/**
 * components/sections/Navbar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Navbar (v2): plutajuća glass pilula.
 *
 * Ista logika kao prije (tema, jezik, mobilni drawer, scroll stanje), novi
 * vizuelni sloj: navigacija je uvijek odvojena "pilula" s blur staklom koja
 * na skrol dobije jaču pozadinu, sjenu i brand rub. Linkovi imaju hover chip,
 * CTA je gradijentan. Labele su self-contained (BS/EN).
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/ui/LanguageProvider";

const LABELS = {
  bs: { services: "Usluge", portfolio: "Portfolio", about: "O nama", saas: "Flagship", pricing: "Cjenovnik", contact: "Kontakt", solutions: "Rješenja" },
  en: { services: "Services", portfolio: "Portfolio", about: "About", saas: "Flagship", pricing: "Pricing", contact: "Contact", solutions: "Solutions" },
};

/**
 * Rješenja (dropdown). Dodavanje novog rješenja = jedan red ovdje, ništa
 * drugo se ne mijenja. Sljedeća planirana: vikendice i rezervacija termina.
 */
const SOLUTIONS = [
  {
    href: "/rjesenja/rent-a-car",
    label: { bs: "Rent-a-Car sistem", en: "Car rental system" },
    desc:  { bs: "Rezervacije, flota i kalendar", en: "Bookings, fleet and calendar" },
  },
];

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solOpen,    setSolOpen]    = useState(false);   // desktop dropdown
  const [solAccOpen, setSolAccOpen] = useState(false);   // mobilni accordion
  const { lang, setLang }           = useLanguage();
  const L = LABELS[(lang as "bs" | "en")] ?? LABELS.bs;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV_LINKS = [
    { label: L.about,     href: "/#o-nama"    },
    { label: L.services,  href: "/#usluge"    },
    { label: L.portfolio, href: "/#portfolio" },
    { label: L.pricing,   href: "/#cjenovnik", promo: true },
    { label: L.saas,      href: "/#saas"      },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
        <nav
          className={cn(
            "max-w-6xl mx-auto h-14 px-3 sm:px-4 lg:px-5 flex items-center justify-between",
            "rounded-2xl border transition-all duration-300 md:backdrop-blur-xl",
            scrolled
              ? "bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] md:bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] border-brand-600/20 shadow-lg shadow-black/10"
              : "bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] md:bg-[color-mix(in_srgb,var(--bg)_45%,transparent)] border-[color-mix(in_srgb,var(--border)_25%,transparent)]"
          )}
        >
          {/* Logo */}
          <a href="#" className="flex items-baseline group relative" aria-label="mehiccdev home">
            <span className="text-lg font-extrabold tracking-tight text-[var(--text)]">mehicc</span>
            <span className="text-lg font-extrabold tracking-tight text-brand-600 dark:text-brand-400">dev</span>
            <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100
                             transition-opacity duration-300 self-center" aria-hidden />
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {/* Rješenja: dropdown, otvara se na hover i na klik (tipkovnica) */}
            <li className="relative"
                onMouseEnter={() => setSolOpen(true)}
                onMouseLeave={() => setSolOpen(false)}>
              <button
                type="button"
                onClick={() => setSolOpen((v) => !v)}
                aria-expanded={solOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                           text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]
                           transition-colors duration-200"
              >
                {L.solutions}
                <ChevronDown size={13} className={`transition-transform duration-200 ${solOpen ? "rotate-180" : ""}`} />
              </button>

              {solOpen && (
                <div className="absolute left-0 top-full pt-2 w-72">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]
                                  md:backdrop-blur-xl shadow-2xl shadow-black/25 p-2">
                    {SOLUTIONS.map((s) => (
                      <a key={s.href} href={s.href}
                         onClick={() => setSolOpen(false)}
                         className="flex flex-col gap-0.5 px-3.5 py-3 rounded-xl
                                    transition-colors duration-200 hover:bg-[var(--surface)]">
                        <span className="text-sm font-bold text-[var(--text)]">
                          {s.label[(lang as "bs" | "en")] ?? s.label.bs}
                        </span>
                        <span className="text-[12px] text-[var(--text-muted)]">
                          {s.desc[(lang as "bs" | "en")] ?? s.desc.bs}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)]
                             hover:text-[var(--text)] hover:bg-[var(--surface)]
                             transition-all duration-200"
                >
                  {link.label}
                  {"promo" in link && link.promo && (
                    <span className="absolute -top-0.5 right-0 w-[15px] h-[15px] rounded-full
                                     flex items-center justify-center
                                     bg-red-500 text-white text-[8px] font-extrabold
                                     shadow-sm shadow-red-500/40 animate-pulse pointer-events-none"
                          aria-label="Akcijske cijene">
                      %
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Jezik: slider s zastavicama (klik na zastavicu bira jezik) */}
            <div className="relative flex items-center rounded-full border border-[var(--border)]
                            bg-[var(--surface)] p-0.5"
                 role="group" aria-label="Language">
              <span aria-hidden
                    className={`absolute top-0.5 bottom-0.5 left-0.5 w-8 rounded-full
                                bg-brand-600/15 border border-brand-600/35
                                transition-transform duration-300 ease-out
                                ${lang === "en" ? "translate-x-8" : ""}`} />
              <button onClick={() => setLang("bs")} aria-label="Bosanski"
                      className={`relative z-10 w-8 h-7 flex items-center justify-center rounded-full
                                  transition-opacity duration-200 ${lang === "en" ? "opacity-45 hover:opacity-80" : ""}`}>
                <FlagBA />
              </button>
              <button onClick={() => setLang("en")} aria-label="English"
                      className={`relative z-10 w-8 h-7 flex items-center justify-center rounded-full
                                  transition-opacity duration-200 ${lang === "bs" ? "opacity-45 hover:opacity-80" : ""}`}>
                <FlagGB />
              </button>
            </div>

            <a
              href="/#kontakt"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                         bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-bold
                         shadow-lg shadow-brand-600/25
                         transition-all duration-200 hover:shadow-xl hover:shadow-brand-600/40
                         hover:-translate-y-0.5"
            >
              {L.contact}
              <ArrowUpRight size={14} />
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)]
                         hover:bg-[var(--surface)] transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer: kartica ispod pilule */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[74px] inset-x-3 z-40 md:hidden
                       rounded-2xl border border-[var(--border)]
                       bg-[var(--bg)] shadow-2xl shadow-black/20 overflow-hidden"
          >
            <nav className="px-5 py-4 flex flex-col">
              {/* Rješenja: accordion unutar mobilnog menija */}
              <button
                type="button"
                onClick={() => setSolAccOpen((v) => !v)}
                aria-expanded={solAccOpen}
                className="flex items-center justify-between text-[15px] font-semibold text-[var(--text)] py-3.5
                           border-b border-[var(--border)]"
              >
                {L.solutions}
                <ChevronDown size={15} className={`text-[var(--text-muted)] transition-transform duration-200 ${solAccOpen ? "rotate-180" : ""}`} />
              </button>
              {solAccOpen && (
                <div className="flex flex-col border-b border-[var(--border)]">
                  {SOLUTIONS.map((s) => (
                    <a key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                       className="flex items-center justify-between py-3 pl-3 text-[14px] text-[var(--text-muted)]">
                      {s.label[(lang as "bs" | "en")] ?? s.label.bs}
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              )}

              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-[15px] font-semibold text-[var(--text)] py-3.5
                             border-b border-[var(--border)] last:border-0"
                >
                  <span className="relative inline-block">
                    {link.label}
                    {"promo" in link && link.promo && (
                      <span className="absolute -top-1.5 -right-4 w-[15px] h-[15px] rounded-full
                                       flex items-center justify-center
                                       bg-red-500 text-white text-[8px] font-extrabold pointer-events-none"
                            aria-label="Akcijske cijene">
                        %
                      </span>
                    )}
                  </span>
                  <ArrowUpRight size={14} className="text-[var(--text-muted)]" />
                </a>
              ))}
              <a
                href="/#kontakt"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl
                           bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold
                           shadow-lg shadow-brand-600/25 transition-all"
              >
                {L.contact} <ArrowUpRight size={15} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


/* ── Mini SVG zastavice (emoji zastave na Windowsu ne rade, prikažu se slova) ── */

function FlagBA() {
  // Crtano u 2x rezoluciji (viewBox 40x28) radi oštrine na malim dimenzijama.
  // 4 veće zvijezde (umjesto sitnih 9 s prave zastave) uz hipotenuzu:
  // na 20px širine manje-a-krupnije čita se kao zastava, više se ne mulja.
  return (
    <svg width="20" height="14" viewBox="0 0 40 28" aria-hidden className="rounded-[3px]">
      <rect width="40" height="28" fill="#002395" />
      <path d="M10 0 L30 0 L30 28 Z" fill="#FECB00" />
      <circle cx="7.5"  cy="4"    r="2.6" fill="#fff" />
      <circle cx="11.5" cy="9.5"  r="2.6" fill="#fff" />
      <circle cx="15.5" cy="15"   r="2.6" fill="#fff" />
      <circle cx="19.5" cy="20.5" r="2.6" fill="#fff" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden className="rounded-[3px]">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0 L20 14 M20 0 L0 14" stroke="#fff" strokeWidth="2.6" />
      <path d="M0 0 L20 14 M20 0 L0 14" stroke="#C8102E" strokeWidth="1.1" />
      <path d="M10 0 V14 M0 7 H20" stroke="#fff" strokeWidth="4.4" />
      <path d="M10 0 V14 M0 7 H20" stroke="#C8102E" strokeWidth="2.4" />
    </svg>
  );
}
