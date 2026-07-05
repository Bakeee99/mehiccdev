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
import { useTheme }            from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/ui/LanguageProvider";

const LABELS = {
  bs: { services: "Usluge", portfolio: "Portfolio", about: "O nama", saas: "Flagship", pricing: "Cjenovnik", contact: "Kontakt" },
  en: { services: "Services", portfolio: "Portfolio", about: "About", saas: "Flagship", pricing: "Pricing", contact: "Contact" },
};

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const { theme, setTheme }         = useTheme();
  const { lang, toggleLang }        = useLanguage();
  const L = LABELS[(lang as "bs" | "en")] ?? LABELS.bs;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV_LINKS = [
    { label: L.services,  href: "#usluge"    },
    { label: L.portfolio, href: "#portfolio" },
    { label: L.about,     href: "#o-nama"    },
    { label: L.saas,      href: "#saas"      },
    { label: L.pricing,   href: "#cjenovnik" },
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
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)]
                             hover:text-[var(--text)] hover:bg-[var(--surface)]
                             transition-all duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold
                         text-[var(--text-muted)] hover:text-[var(--text)]
                         hover:bg-[var(--surface)] transition-all duration-200"
              aria-label="Change language"
            >
              <Globe size={14} />
              <span className="uppercase">{lang}</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)]
                         hover:bg-[var(--surface)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
            </button>

            <a
              href="#kontakt"
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
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-[15px] font-semibold text-[var(--text)] py-3.5
                             border-b border-[var(--border)] last:border-0"
                >
                  {link.label}
                  <ArrowUpRight size={14} className="text-[var(--text-muted)]" />
                </a>
              ))}
              <a
                href="#kontakt"
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
