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

/* Meka sjena telefona: kratki sloj uz rub i dugi, blijedi ispod. */
const PHONE_SHADOW =
  "0 1px 2px rgba(15,23,42,0.08), 0 24px 50px -18px rgba(15,23,42,0.30)";

/* ── Okvir telefona, po uzoru na referencu ──────────────────────────────────
   Tri sloja, od spolja prema unutra:
     1. srebrni okvir (svijetli gradijent, kao aluminijum)
     2. tanak crni bezel
     3. ekran: statusna traka s vremenom, ostrvom i ikonicama, pa slika

   Statusnu traku crtamo sami, jer screenshotovi je nemaju. Boja trake prati
   vrh stranice na slici, a ikonice su tamne na svijetloj ili svijetle na
   tamnoj traci. Slika se servira netaknuta (unoptimized), oštra na Retini. */
function Phone({ src, alt, bar = "light", priority = false }: {
  src: string; alt: string; bar?: "light" | "dark"; priority?: boolean;
}) {
  const ink = bar === "dark" ? "#FFFFFF" : "#0F172A";
  return (
    <div
      className="rounded-[2.9rem] p-[4px]"
      style={{ background: "linear-gradient(145deg, #F4F5F7 0%, #D9DCE1 45%, #EEF0F3 100%)", boxShadow: PHONE_SHADOW }}
    >
      <div className="rounded-[2.65rem] bg-black p-[6px]">
        <div className="relative overflow-hidden rounded-[2.2rem]">
          {/* statusna traka */}
          <div className={`relative flex items-center justify-between px-[9%] h-[30px] sm:h-[38px] ${bar === "dark" ? "bg-[#0A0A0A]" : "bg-white"}`}>
            <span className="text-[9px] sm:text-[12px] font-semibold tracking-tight" style={{ color: ink }}>9:41</span>
            <span aria-hidden className="absolute top-[7px] sm:top-[9px] left-1/2 -translate-x-1/2 w-[30%] h-[15px] sm:h-[20px] rounded-full bg-black" />
            <span className="flex items-center gap-[3px]" aria-hidden>
              <svg width="15" height="10" viewBox="0 0 17 12" className="w-[11px] sm:w-[15px]"><g fill={ink}><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="4.5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="9" y="3" width="3" height="9" rx=".8"/><rect x="13.5" y="0" width="3" height="12" rx=".8"/></g></svg>
              <svg width="20" height="10" viewBox="0 0 26 12" className="w-[14px] sm:w-[20px]"><rect x=".75" y=".75" width="21.5" height="10.5" rx="3" fill="none" stroke={ink} strokeOpacity=".45" strokeWidth="1.5"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.6" fill={ink}/><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill={ink} fillOpacity=".45"/></svg>
            </span>
          </div>
          {/* ekran */}
          <div className="relative aspect-[1179/2556] bg-white">
            <Image src={src} alt={alt} fill unoptimized priority={priority}
                   className="object-cover object-top" />
          </div>
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
          Po referenci: stoje JEDAN PORED DRUGOG s malim razmakom, bez
          preklapanja. Srednji je najveći i najviši, bočni su manji, spušteni
          i blago nagnuti prema van. Vidi se gornji dio, a dno se postepeno
          zamućuje i nestaje u bijelom. */}
      <motion.div {...rise(0.28)} className="relative mx-auto mt-16 sm:mt-20 max-w-5xl px-4 sm:px-6">
        <div className="relative flex items-start justify-center gap-[3%] sm:gap-[2.5%] pt-2
                        h-[300px] sm:h-[440px] lg:h-[520px] overflow-hidden">
          {/* lijevi: manji, niže, nagnut ulijevo */}
          <div className="w-[28%] sm:w-[30%] max-w-[250px] mt-[7%] -rotate-[3deg] sm:-rotate-[5deg] origin-bottom">
            <Phone src="/portfolio/maximum-admin-mob-svijetla.webp" alt={d.shots.left} />
          </div>

          {/* srednji: najveći i najviši */}
          <div className="w-[33%] sm:w-[35%] max-w-[300px]">
            <Phone src="/portfolio/maximum-poslije-mob.webp" alt={d.shots.center} priority />
          </div>

          {/* desni: manji, niže, nagnut udesno */}
          <div className="w-[28%] sm:w-[30%] max-w-[250px] mt-[7%] rotate-[3deg] sm:rotate-[5deg] origin-bottom">
            <Phone src="/portfolio/maximum-hero-mob.webp" alt={d.shots.right} bar="dark" />
          </div>
        </div>

        {/* Zamućenje pri dnu, u dva sloja:
              1. zamućenje koje jača prema dnu (maska ga postepeno uvodi)
              2. preliv u bijelo preko njega, da donja ivica potpuno nestane
            Zamućenje je u style, jer stranica ima pravilo koje gasi klase
            sa zamućenjem. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
             style={{
               backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
               maskImage: "linear-gradient(to bottom, transparent 0%, black 65%)",
               WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 65%)",
             }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
             style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 55%, #FFFFFF 100%)" }} />
      </motion.div>

      {/* sekcija se završava ispod telefona, bez dodatnog prostora */}
      <div className="h-6 sm:h-10" aria-hidden />
    </section>
  );
}
