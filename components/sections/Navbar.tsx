/**
 * components/sections/Navbar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Sticky navbar with:
 *  • Logo (text-based)
 *  • Nav links (translated)
 *  • Language toggle (BS / EN)
 *  • Theme toggle (dark / light)
 *  • Kontakt CTA
 *  • Animated mobile drawer
 */

"use client";

import { useState, useEffect } from "react";
import { useTheme }            from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/ui/LanguageProvider";

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const { theme, setTheme }         = useTheme();
  const { t, lang, toggleLang }     = useLanguage();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV_LINKS = [
    { label: t.nav.services,  href: "#usluge"    },
    { label: t.nav.portfolio, href: "#portfolio" },
    { label: t.nav.about,     href: "#o-nama"    },
    { label: t.nav.saas,      href: "#saas"      },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-baseline group relative" aria-label="mehiccdev home">
            <span className="text-xl font-bold tracking-tight text-[var(--text)]">mehicc</span>
            <span className="text-xl font-bold tracking-tight text-brand-600 dark:text-brand-400">dev</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]
                             transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-600 dark:bg-brand-400
                                   group-hover:w-full transition-all duration-300" aria-hidden />
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold
                         text-[var(--text-muted)] hover:text-[var(--text)]
                         hover:bg-[var(--surface)] transition-all duration-200"
              aria-label="Change language"
            >
              <Globe size={15} />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
                         hover:bg-[var(--surface)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>

            {/* Kontakt CTA */}
            <a
              href="#kontakt"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                         bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
                         transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/25
                         hover:-translate-y-0.5"
            >
              {t.nav.contact}
              <ArrowUpRight size={14} />
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
                         hover:bg-[var(--surface)] transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-[var(--bg)]/95 backdrop-blur-xl
                       border-b border-[var(--border)] md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-[var(--text)] py-2
                             border-b border-[var(--border)] last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#kontakt"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl
                           bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all"
              >
                {t.nav.contact} <ArrowUpRight size={15} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
