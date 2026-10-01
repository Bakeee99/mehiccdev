/**
 * components/sections/Hero.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Hero (v3, minimalistički svijetli).
 *
 * Raspored, odozgo prema dolje, sve centrirano:
 *   1. bedž "Novo · Rezervacioni sistem za rent-a-car firme" (link)
 *   2. naslov u dva reda, drugi red prigušen
 *   3. podnaslov
 *   4. dva dugmeta: crveno glavno i obrubljeno sporedno
 *   5. tri telefona koja se preklapaju: srednji naprijed, bočni blago
 *      umanjeni, nagnuti i povučeni iza, a dno se utapa u bijelo
 *
 * Šta je namjerno izbačeno: plutajuće kartice sa strane, bedž dostupnosti,
 * red "Uživo u produkciji", strelica za skrol i duplirana pilula. Sve to se
 * takmičilo s naslovom.
 *
 * Bez sjaja, stakla i gradijenata. Sjene na telefonima su postavljene kroz
 * style, a ne kroz klasu, jer stranica ima pravilo koje utišava sve klase
 * sa sjenom, a telefonima treba tačno ova mekana, duboka sjena.
 */

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

type Content = {
  announceTag: string; announceText: string;
  h1a: string; h1b: string;
  sub: string;
  ctaPrimary: string; ctaSecondary: string;
  shots: { left: string; center: string; right: string };
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    announceTag: "Novo",
    announceText: "Rezervacioni sistem za rent-a-car firme",
    h1a: "Vašem biznisu ne treba sajt.",
    h1b: "Treba mu sistem.",
    sub: "Web aplikacije koje primaju rezervacije, sajtovi koje sami uređujete i marketing koji dovodi upite. Sve iz jedne ruke, iz Mostara za cijeli region.",
    ctaPrimary: "Besplatne konsultacije",
    ctaSecondary: "Šta smo napravili",
    shots: {
      left: "Admin panel s rezervacijama na čekanju",
      center: "Naslovna stranica sajta za iznajmljivanje vozila",
      right: "Ista naslovna stranica u tamnoj temi",
    },
  },
  en: {
    announceTag: "New",
    announceText: "Booking system for car rental companies",
    h1a: "Your business doesn't need a website.",
    h1b: "It needs a system.",
    sub: "Web apps that take bookings, websites you can edit yourself, and marketing that brings inquiries. All from one team, from Mostar for the whole region.",
    ctaPrimary: "Free consultation",
    ctaSecondary: "See what we\u0027ve built",
    shots: {
      left: "Admin panel with pending bookings",
      center: "Home page of a car rental website",
      right: "The same home page in dark mode",
    },
  },
};

/* Meka, duboka sjena telefona: dva sloja, kratki i dugi, bez boje. */
const PHONE_SHADOW =
  "0 2px 6px rgba(15,23,42,0.06), 0 30px 60px -20px rgba(15,23,42,0.28)";

/* ── Okvir telefona ──────────────────────────────────────────────────────────
   Tanak tamni rub i zaobljeni uglovi. Screenshotovi nemaju statusnu traku,
   pa je dodajemo iznad slike, u boji vrha same stranice, i u nju stavljamo
   dinamičko ostrvo. Tako ostrvo ništa ne prekriva, kao na pravom telefonu.
   Slika se servira netaknuta (unoptimized), oštra i na Retina ekranima.  */
function Phone({ src, alt, bar = "light", priority = false }: {
  src: string; alt: string; bar?: "light" | "dark"; priority?: boolean;
}) {
  return (
    <div className="relative rounded-[2.6rem] bg-[#0F172A] p-[7px]" style={{ boxShadow: PHONE_SHADOW }}>
      <div className="relative overflow-hidden rounded-[2.15rem]">
        <div className={`relative h-[26px] sm:h-[34px] ${bar === "dark" ? "bg-[#0A0A0A]" : "bg-white"}`}>
          <span aria-hidden
                className="absolute top-[7px] sm:top-[9px] left-1/2 -translate-x-1/2 w-[32%] h-[14px] sm:h-[18px] rounded-full bg-[#0F172A]" />
        </div>
        <div className="relative aspect-[1179/2556] bg-white">
          <Image src={src} alt={alt} fill unoptimized priority={priority}
                 className="object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;
  const reduce = useReducedMotion() ?? false;

  /* Ulazak: tekst se pojavi odozdo, telefoni malo kasnije.

     Animacija se UVIJEK zadaje, a uz reduced-motion samo traje nula sekundi.
     Da je izostavimo, server bi element iscrtao proziran (početno stanje), a
     ništa ga ne bi vratilo na vidljivo, pa bi hero ostao prazan. */
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="hero-light relative bg-white overflow-hidden pt-36 sm:pt-40 lg:pt-44">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* ── 1. bedž ── */}
        <motion.div {...rise(0)} className="flex justify-center">
          <a
            href="/rjesenja/rent-a-car"
            className="group inline-flex items-center gap-2.5 rounded-full border border-[#E5E7EB] bg-white
                       pl-1.5 pr-3.5 sm:pr-4 py-1.5 text-[12px] sm:text-[13px] text-[#0F172A] whitespace-nowrap
                       transition-colors duration-200 hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
          >
            <span className="rounded-full bg-[#16A34A] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {d.announceTag}
            </span>
            <span className="font-medium">{d.announceText}</span>
            <ArrowRight size={14} className="hidden sm:block text-[#6B7280] transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* ── 2. naslov ── */}
        <motion.h1
          {...rise(0.06)}
          className="mt-8 text-[40px] leading-[1.08] sm:text-6xl lg:text-[68px] font-semibold tracking-[-0.035em] text-[#0F172A]"
          style={{ textWrap: "balance" }}   /* redovi jednake dužine, bez usamljene riječi */
        >
          {d.h1a}
          {/* drugi dio uvijek u svom redu, i na telefonu */}
          <span className="block text-[#0F3554]">{d.h1b}</span>
        </motion.h1>

        {/* ── 3. podnaslov ── */}
        <motion.p
          {...rise(0.12)}
          className="mx-auto mt-7 max-w-2xl text-[17px] sm:text-lg leading-relaxed text-[#475569]"
        >
          {d.sub}
        </motion.p>

        {/* ── 4. dugmad ── */}
        <motion.div
          {...rise(0.18)}
          className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
        >
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3.5
                       text-[15px] font-semibold text-white
                       transition-colors duration-200 hover:bg-[#B91C1C]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]"
          >
            {d.ctaPrimary}
            <ArrowRight size={16} />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5
                       text-[15px] font-semibold text-[#0F172A]
                       transition-colors duration-200 hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
          >
            {d.ctaSecondary}
          </a>
        </motion.div>
      </div>

      {/* ── 5. tri telefona ──────────────────────────────────────────────────
          Srednji je naprijed i najveći. Bočni su umanjeni, nagnuti prema van
          i spušteni, pa izgledaju kao da stoje iza njega. Donji dio sekcije
          se utapa u bijelo, kao na referenci. */}
      <motion.div
        {...rise(0.28)}
        className="relative mx-auto mt-16 sm:mt-20 max-w-5xl px-6"
      >
        {/* visina je ograničena pa se vidi gornji dio telefona, kao na
            referenci; ostatak nestaje ispod ruba sekcije */}
        <div className="relative flex items-start justify-center overflow-hidden
                        h-[340px] sm:h-[460px] lg:h-[540px]">
          {/* lijevi */}
          <div className="relative z-0 w-[34%] max-w-[250px] -mr-[9%] mt-[9%]
                          -rotate-[7deg] scale-[0.9] origin-bottom-right">
            <Phone src="/portfolio/maximum-admin-mob-svijetla.webp" alt={d.shots.left} />
          </div>

          {/* srednji */}
          <div className="relative z-10 w-[40%] max-w-[290px]">
            <Phone src="/portfolio/maximum-poslije-mob.webp" alt={d.shots.center} priority />
          </div>

          {/* desni */}
          <div className="relative z-0 w-[34%] max-w-[250px] -ml-[9%] mt-[9%]
                          rotate-[7deg] scale-[0.9] origin-bottom-left">
            <Phone src="/portfolio/maximum-hero-mob.webp" alt={d.shots.right} bar="dark" />
          </div>
        </div>

        {/* utapanje u bijelo pri dnu */}
        <div aria-hidden
             className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]
                        bg-gradient-to-b from-white/0 via-white/80 to-white" />
      </motion.div>

      {/* sekcija se završava ispod telefona, bez dodatnog prostora */}
      <div className="h-6 sm:h-10" aria-hidden />
    </section>
  );
}
