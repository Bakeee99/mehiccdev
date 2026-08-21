/**
 * components/sections/Footer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Footer (v2, premium redizajn).
 *
 *   • Brand kolona: logo, novi tagline (bez AI fraza), lokacija i zeleni
 *     "Dostupni za nove projekte" status.
 *   • Kolone: Navigacija i Usluge (usklađene s novim redoslijedom sekcije
 *     Usluge), Kontakt s oba člana (email + Instagram + LinkedIn).
 *   • Donja traka: copyright, "Dizajnirano i razvijeno u Mostaru", "Na vrh".
 *   • Potpis: DŽINOVSKI "mehiccdev" watermark koji viri iz dna footera
 *     (providan, dekorativan, ne smeta čitanju).
 *
 * Self-contained (BS/EN u fajlu), useReveal pattern, dark/light, bez crtica.
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Instagram, Linkedin, MapPin, ArrowUp } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

const TEAM_CONTACTS = [
  {
    name: "Bakir Mehić", role: "Development", email: "bakir.mehic@mehiccdev.com",
    instagram: "https://www.instagram.com/mehicbakir",
    linkedin:  "https://www.linkedin.com/in/bakir-mehic-qa-engineer/",
  },
  {
    name: "Nedim Kupusija", role: "Marketing", email: "nedim.kupusija@mehiccdev.com",
    instagram: "https://www.instagram.com/nedim.40",
    linkedin:  "https://www.linkedin.com/in/nedim-kupusija-4632a533b/",
  },
];

type Content = {
  tagline: string; location: string; status: string;
  navHeading: string; servicesHeading: string; contactHeading: string;
  nav: { label: string; href: string }[];
  services: { label: string; href: string }[];
  rights: string; madeIn: string; toTop: string;
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    tagline: "Sajt, aplikacija i marketing iz jedne ruke. Građeno u Mostaru, za cijeli region.",
    location: "Mostar, Bosna i Hercegovina",
    status: "Dostupni za nove projekte",
    navHeading: "Navigacija",
    servicesHeading: "Usluge",
    contactHeading: "Kontakt",
    nav: [
      { label: "O nama",    href: "#o-nama"    },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Cjenovnik", href: "#cjenovnik" },
      { label: "Flagship",  href: "#saas"      },
      { label: "Kontakt",   href: "#kontakt"   },
    ],
    services: [
      { label: "Aplikacija za vaš biznis",   href: "#usluge" },
      { label: "Sajt koji sami uređujete",   href: "#usluge" },
      { label: "Marketing koji dovodi goste",href: "#usluge" },
    ],
    rights: "Sva prava zadržana.",
    madeIn: "Dizajnirano i razvijeno u Mostaru",
    toTop: "Na vrh",
  },
  en: {
    tagline: "Website, app and marketing from one team. Built in Mostar, for the whole region.",
    location: "Mostar, Bosnia and Herzegovina",
    status: "Available for new projects",
    navHeading: "Navigation",
    servicesHeading: "Services",
    contactHeading: "Contact",
    nav: [
      { label: "About",     href: "#o-nama"    },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Pricing",   href: "#cjenovnik" },
      { label: "Flagship",  href: "#saas"      },
      { label: "Contact",   href: "#kontakt"   },
    ],
    services: [
      { label: "An app for your business",   href: "#usluge" },
      { label: "A website you edit yourself",href: "#usluge" },
      { label: "Marketing that brings guests",href: "#usluge" },
    ],
    rights: "All rights reserved.",
    madeIn: "Designed and built in Mostar",
    toTop: "Back to top",
  },
};

export function Footer() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;
  const year = new Date().getFullYear();

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealMain = useReveal();

  const linkCls = `text-[13.5px] text-[var(--text-muted)] hover:text-brand-600 dark:hover:text-brand-400
                   transition-colors duration-200 inline-flex items-center gap-1.5 group/link`;

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* sjaj + džinovski watermark koji viri iz dna */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent_72%)] pointer-events-none" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 translate-y-[38%] text-center select-none pointer-events-none
                   font-extrabold tracking-tighter leading-none whitespace-nowrap
                   text-brand-600 opacity-[0.05] dark:opacity-[0.07]
                   text-[clamp(88px,17vw,250px)]"
      >
        mehiccdev
      </div>

      <motion.div
        variants={staggerContainer}
        {...revealMain}
        className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-20 pb-8"
      >
        {/* ── Gornji dio: brand + kolone ─────────────────────────────────── */}
        <div className="grid gap-12 lg:gap-8 lg:grid-cols-[1.3fr_0.8fr_1fr_1.1fr] mb-14">

          {/* Brand */}
          <motion.div variants={fadeUp}>
            <a href="#" className="inline-flex items-baseline mb-4" aria-label="mehiccdev">
              <span className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
                mehicc<span className="text-brand-600 dark:text-brand-400">dev</span>
              </span>
            </a>
            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed max-w-xs mb-5">
              {d.tagline}
            </p>
            <div className="flex flex-col items-start gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
                               text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
                {d.status}
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <MapPin size={12} className="text-brand-600 dark:text-brand-400" /> {d.location}
              </span>
            </div>
          </motion.div>

          {/* Navigacija */}
          <motion.div variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)] mb-4">{d.navHeading}</p>
            <ul className="flex flex-col gap-2.5">
              {d.nav.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkCls}>
                    <span className="w-0 group-hover/link:w-3 h-px bg-brand-500 transition-all duration-300" aria-hidden />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Usluge */}
          <motion.div variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)] mb-4">{d.servicesHeading}</p>
            <ul className="flex flex-col gap-2.5">
              {d.services.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkCls}>
                    <span className="w-0 group-hover/link:w-3 h-px bg-brand-500 transition-all duration-300" aria-hidden />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Kontakt */}
          <motion.div variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)] mb-4">{d.contactHeading}</p>
            <div className="flex flex-col gap-5">
              {TEAM_CONTACTS.map((m) => (
                <div key={m.email}>
                  <p className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13.5px] font-bold text-[var(--text)]">{m.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                                     text-brand-700 dark:text-brand-300 bg-brand-600/10 border border-brand-600/25">
                      {m.role}
                    </span>
                  </p>
                  <a href={`mailto:${m.email}`}
                     className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--text-muted)]
                                hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200 mb-2">
                    <Mail size={12} className="flex-shrink-0" />
                    <span className="break-all">{m.email}</span>
                  </a>
                  <div className="flex gap-2">
                    <a href={m.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} Instagram`}
                       className="w-8 h-8 rounded-lg flex items-center justify-center
                                  bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] border border-[var(--border)] text-[var(--text-muted)]
                                  transition-all duration-200 hover:text-brand-600 dark:hover:text-brand-400
                                  hover:border-brand-600/40 hover:-translate-y-0.5">
                      <Instagram size={13} />
                    </a>
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} LinkedIn`}
                       className="w-8 h-8 rounded-lg flex items-center justify-center
                                  bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] border border-[var(--border)] text-[var(--text-muted)]
                                  transition-all duration-200 hover:text-brand-600 dark:hover:text-brand-400
                                  hover:border-brand-600/40 hover:-translate-y-0.5">
                      <Linkedin size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Donja traka ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="pt-6 border-t border-[var(--border)]
                     flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-[var(--text-muted)] text-center sm:text-left">
            © {year} mehiccdev. {d.rights}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <MapPin size={11} className="text-brand-600 dark:text-brand-400" /> {d.madeIn}
          </p>
          <a href="#"
             className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]
                        hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200">
            {d.toTop} <ArrowUp size={12} />
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
