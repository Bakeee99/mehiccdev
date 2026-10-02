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
import { ArrowRight, Check, CarFront, Gauge } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

type Content = {
  announceTag: string; announceText: string;
  h1a: string; h1b: string;
  sub: string;
  ctaPrimary: string; ctaSecondary: string;
  shots: { left: string; center: string; right: string };
  cardSpeed: { label: string; value: string; was: string; client: string };
  cardBooking: { title: string; detail: string; status: string };
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
    cardSpeed: { label: "Učitavanje sajta", value: "3,2 s", was: "ranije 21,6 s", client: "Maximum Rent a Car" },
    cardBooking: { title: "Nova rezervacija", detail: "VW Golf 8 · 10. do 13. jula", status: "Potvrđeno" },
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
    cardSpeed: { label: "Page load time", value: "3.2 s", was: "was 21.6 s", client: "Maximum Rent a Car" },
    cardBooking: { title: "New booking", detail: "VW Golf 8 · July 10 to 13", status: "Confirmed" },
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
    <section className="hero-light relative bg-white px-2 sm:px-3 pt-2 sm:pt-3">
      {/* ── PANEL ───────────────────────────────────────────────────────────
          Hero stoji u zaobljenom panelu uvučenom od ivica ekrana, kao na
          referenci. Pozadina je meki preliv iz svijetle nijanse naše plave
          (#0F3554) u bijelo, a preko nje dva blaga dijagonalna odsjaja.
          Navigacija je na vrhu providna, pa se stapa s panelom. */}
      <div className="relative overflow-hidden rounded-[26px] sm:rounded-[36px]"
           style={{ background: "linear-gradient(180deg, #D9E4F0 0%, #E7EEF6 34%, #F4F7FB 68%, #FFFFFF 100%)" }}>

        {/* dijagonalni odsjaji, kao staklo na referenci */}
        <div aria-hidden className="pointer-events-none absolute -left-[12%] top-0 h-[70%] w-[38%] -skew-x-[24deg] opacity-60"
             style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)" }} />
        <div aria-hidden className="pointer-events-none absolute right-[-8%] top-0 h-[60%] w-[26%] -skew-x-[24deg] opacity-50"
             style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)" }} />
        {/* fina mreža koja blijedi prema dnu */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35]"
             style={{
               backgroundImage: "linear-gradient(to right, rgba(15,53,84,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,53,84,0.06) 1px, transparent 1px)",
               backgroundSize: "56px 56px",
               maskImage: "linear-gradient(to bottom, black 0%, transparent 60%)",
               WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 60%)",
             }} />

      {/* ── PROZORČIĆI SA STRANE ─────────────────────────────────────────────
          Popunjavaju prazninu pored naslova, kao na referenci. Sadržaj nije
          izmišljen: lijevo je stvarni rezultat Maximuma, desno trenutak iz
          sistema (rezervacija potvrđena jednim klikom). Nagnuti su blago
          prema van i lagano lebde. Samo na širokim ekranima, jer na užim
          ne bi imali gdje stati. */}
      <motion.div
        {...rise(0.35)}
        className="pointer-events-none absolute left-[3%] xl:left-[6%] top-[300px] hidden lg:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[230px] -rotate-[6deg] rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left"
          style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.05), 0 18px 40px -16px rgba(15,23,42,0.22)" }}
        >
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0F3554] text-white"><Gauge size={14} /></span>
            <span className="text-[12px] font-medium text-[#64748B]">{d.cardSpeed.label}</span>
          </div>
          <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.03em] text-[#0F172A]">{d.cardSpeed.value}</p>
          {/* dvije trake: sada naspram ranije */}
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-[15%] rounded-full bg-[#16A34A]" />
            <div className="h-1.5 w-full rounded-full bg-[#E5E7EB]" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8]">{d.cardSpeed.was}</span>
            <span className="font-medium text-[#475569]">{d.cardSpeed.client}</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        {...rise(0.45)}
        className="pointer-events-none absolute right-[3%] xl:right-[6%] top-[230px] hidden lg:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="w-[240px] rotate-[6deg] rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left"
          style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.05), 0 18px 40px -16px rgba(15,23,42,0.22)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F5F9] text-[#0F3554]"><CarFront size={17} /></span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-[#0F172A]">{d.cardBooking.title}</span>
              <span className="block text-[11.5px] text-[#64748B]">{d.cardBooking.detail}</span>
            </span>
          </div>
          <div className="mt-3.5 flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-3 py-2 text-[12.5px] font-semibold text-white">
            <Check size={14} strokeWidth={3} /> {d.cardBooking.status}
          </div>
        </motion.div>
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-6 pt-32 sm:pt-36 lg:pt-40 text-center">

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
          <span className="block text-[#0F3554]">
            {/* mala ikonica rasta ispred naglašenog dijela, kao na referenci */}
            <svg viewBox="0 0 24 24" aria-hidden
                 className="hidden sm:inline-block h-[0.6em] w-[0.6em] mr-[0.16em] align-[0.02em]">
              <rect x="2"  y="13" width="5" height="9"  rx="1.5" fill="currentColor" opacity=".45" />
              <rect x="9.5" y="8" width="5" height="14" rx="1.5" fill="currentColor" opacity=".7" />
              <rect x="17" y="2"  width="5" height="20" rx="1.5" fill="currentColor" />
            </svg>
            {d.h1b}
          </span>
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
          className="relative mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
        >
          {/* isprekidana strelica koja vodi pogled do glavnog dugmeta */}
          <svg aria-hidden viewBox="0 0 120 70" fill="none"
               className="pointer-events-none absolute right-[calc(50%+188px)] top-[-14px] hidden md:block w-[104px] text-[#94A3B8]">
            <path d="M6 8 C 10 44, 46 64, 104 52" stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeDasharray="5 6" />
            <path d="M96 44 L106 52 L95 59" stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

      </div>{/* kraj panela */}
    </section>
  );
}
