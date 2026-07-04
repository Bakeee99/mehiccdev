/**
 * components/sections/Portfolio.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Naš rad" — Hero Case Study Fuzija (Koncept 1).
 *
 * Maximum Rent a Car dominira kao featured case study blok (veći dio širine):
 * badge, opis, stvarne izmjerene brojke (PageSpeed prije/poslije), lista
 * ključnih funkcionalnosti i browser mockup. Ostali projekti su svedena,
 * elegantna bočna lista.
 *
 * Self-contained: svi tekstovi (BS/EN) žive u ovom fajlu, i18n se ne dira.
 * Koristi useReveal pattern (animacija tačno jednom, preživljava promjenu
 * jezika/teme).
 *
 * SCREENSHOT: kad bude spreman pravi screenshot aplikacije, ubaci ga u
 * /public/portfolio/ (npr. maximum-hero.png) i upiši putanju u
 * FEATURE_SCREENSHOT ispod. Dok je prazno, prikazuje se CSS mockup.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ── Screenshot slot (prazno = CSS mockup placeholder) ───────────────────────
const FEATURE_SCREENSHOT = ""; // npr. "/portfolio/maximum-hero.png"
const FEATURE_URL = "https://maximum-rent.vercel.app";

// ── Bilingual content ────────────────────────────────────────────────────────
type Mini = { title: string; desc: string; live?: boolean };
type Content = {
  label: string; heading: string; headingAccent: string; subtitle: string;
  badge: string; title: string; desc: string;
  stats: { v: string; l: string }[];
  features: string[];
  ctaLive: string; ctaWant: string; livePill: string;
  minis: Mini[];
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Naš rad",
    heading: "Projekti koji",
    headingAccent: "rade posao",
    subtitle: "Sve što vidite ovdje je uživo i donosi rezultate stvarnim klijentima. Slobodno otvorite i probajte.",
    badge: "Perjanica · Business plan",
    title: "Maximum Rent a Car",
    desc: "Kompletna web aplikacija za iznajmljivanje vozila. Gost izabere auto i datume, sistem provjeri dostupnost i spriječi dupla rezervisanja, a vlasnik sve potvrđuje u dva klika iz svog privatnog panela.",
    stats: [
      { v: "3,2s", l: "učitavanje na telefonu, prije 21,6s" },
      { v: "100", l: "Google ocjena performansi" },
      { v: "2", l: "jezika, HR i EN" },
      { v: "24/7", l: "prima upite i dok vlasnik spava" },
    ],
    features: [
      "Pretraga slobodnih vozila po datumima, bez duplih rezervacija",
      "Privatni admin panel: vozila, cijene i slike bez developera",
      "Upit stiže odmah na Telegram i WhatsApp, gost dobija automatski email",
      "Dvojezično HR/EN, građeno prvo za telefon",
    ],
    ctaLive: "Pogledaj uživo",
    ctaWant: "Želim ovakvu aplikaciju",
    livePill: "Uživo",
    minis: [
      { title: "OxyBaric Mostar", desc: "Medicinski sajt koji dovodi pacijente iz Google pretrage.", live: true },
      { title: "Rent a Car Landing", desc: "Landing s rezervacijama: upit stiže spreman za odgovor." },
      { title: "Fitness Trainer", desc: "Lični brend s online zakazivanjem umjesto prepiske porukama." },
    ],
  },
  en: {
    label: "Our work",
    heading: "Projects that",
    headingAccent: "do the job",
    subtitle: "Everything you see here is live and delivering results for real clients. Feel free to open and try them.",
    badge: "Flagship · Business plan",
    title: "Maximum Rent a Car",
    desc: "A complete car rental web application. Guests pick a car and dates, the system checks availability and prevents double bookings, and the owner confirms everything in two clicks from a private panel.",
    stats: [
      { v: "3.2s", l: "mobile load time, was 21.6s" },
      { v: "100", l: "Google performance score" },
      { v: "2", l: "languages, HR and EN" },
      { v: "24/7", l: "takes inquiries while the owner sleeps" },
    ],
    features: [
      "Search available cars by dates, with no double bookings",
      "Private admin panel: cars, prices and photos without a developer",
      "Inquiries arrive instantly on Telegram and WhatsApp, guests get an automatic email",
      "Bilingual HR/EN, built mobile-first",
    ],
    ctaLive: "See it live",
    ctaWant: "I want an app like this",
    livePill: "Live",
    minis: [
      { title: "OxyBaric Mostar", desc: "A medical site that brings patients in from Google search.", live: true },
      { title: "Rent a Car Landing", desc: "Landing with a booking system: inquiries arrive ready to answer." },
      { title: "Fitness Trainer", desc: "A personal brand site with online booking instead of endless messaging." },
    ],
  },
};

// Visual meta for mini cards (order matches T.minis)
const MINI_META = [
  { gradient: "from-sky-400 via-blue-500 to-indigo-600",  href: "https://oxybaricmostar.ba" },
  { gradient: "from-blue-500 via-cyan-500 to-teal-500",   href: "#portfolio" },
  { gradient: "from-indigo-500 via-blue-600 to-blue-700", href: "#portfolio" },
];

// ── CSS mockup (placeholder dok ne stigne pravi screenshot) ──────────────────
function BrowserMock() {
  return (
    <div className="rounded-2xl overflow-hidden border border-brand-600/25 bg-[var(--surface)] shadow-2xl shadow-brand-600/25">
      {/* traka browsera */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg)]/60">
        <span className="w-2 h-2 rounded-full bg-[var(--border)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--border)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--border)]" />
        <span className="flex-1 ml-2 px-3 py-1 rounded-md bg-[var(--border)]/40 text-[10px] text-[var(--text-muted)] tracking-wide">
          maximum-rent.vercel.app
        </span>
      </div>
      {/* tijelo: naslov + kalendar dostupnosti */}
      <div className="p-5">
        <div className="h-2 w-1/2 rounded bg-[var(--text-muted)]/30 mb-2" />
        <div className="h-2 w-1/3 rounded bg-[var(--text-muted)]/20 mb-4" />
        <div className="grid grid-cols-7 gap-1.5 mb-4" aria-hidden>
          {Array.from({ length: 21 }).map((_, i) => {
            const busy = [2, 3, 9, 15].includes(i);
            const sel = [11, 12, 13].includes(i);
            return (
              <span
                key={i}
                className={`aspect-square rounded-md ${
                  sel ? "bg-brand-600" : busy ? "bg-red-500/25" : "bg-[var(--border)]/50"
                }`}
              />
            );
          })}
        </div>
        <span className="inline-block h-7 w-32 rounded-lg bg-brand-600 shadow-lg shadow-brand-600/40" />
      </div>
    </div>
  );
}

export function Portfolio() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealHead    = useReveal();
  const revealFeature = useReveal();
  const revealSide    = useReveal();

  return (
    <section id="portfolio" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -left-48 top-1/3 w-96 h-96 rounded-full bg-brand-600/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          {...revealHead}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <motion.div variants={fadeUp} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                               border border-brand-600/30 dark:border-brand-500/30
                               bg-brand-600/8 dark:bg-brand-500/10
                               text-brand-700 dark:text-brand-300
                               text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
                {d.label}
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {d.heading}{" "}
              <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="max-w-sm text-[var(--text-muted)] leading-relaxed">
            {d.subtitle}
          </motion.p>
        </motion.div>

        {/* ── Feature (Maximum) + bočna lista ────────────────────────────── */}
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-6 items-stretch">

          {/* FEATURED CASE STUDY */}
          <motion.article
            variants={scaleIn}
            {...revealFeature}
            className="group relative rounded-3xl p-7 sm:p-9 overflow-hidden
                       bg-[var(--surface)] border border-brand-600/25
                       transition-[border-color,box-shadow] duration-300
                       hover:border-brand-600/45 hover:shadow-2xl hover:shadow-brand-600/15"
          >
            {/* pozadinski sjaj + grid */}
            <div className="absolute -top-24 -right-24 w-[420px] h-[320px] rounded-full bg-brand-600/12 blur-3xl pointer-events-none" aria-hidden />
            <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.045] pointer-events-none" aria-hidden />

            <div className="relative">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold
                               text-brand-700 dark:text-brand-300 bg-brand-600/10 border border-brand-600/30">
                <Star size={12} fill="currentColor" /> {d.badge}
              </span>

              <h3 className="text-2xl sm:text-[30px] font-extrabold tracking-tight mt-4 mb-3">{d.title}</h3>
              <p className="text-[15px] text-[var(--text-muted)] leading-relaxed max-w-xl">{d.desc}</p>

              {/* izmjerene brojke */}
              <div className="flex flex-wrap gap-2.5 my-6">
                {d.stats.map((s) => (
                  <div
                    key={s.l}
                    className="flex flex-col gap-0.5 px-4 py-2.5 rounded-xl bg-[var(--bg)]/60 border border-[var(--border)]
                               transition-[border-color,transform] duration-300 hover:border-brand-600/40 hover:-translate-y-0.5"
                  >
                    <b className="text-xl font-extrabold text-brand-600 dark:text-brand-400 leading-none">{s.v}</b>
                    <span className="text-[10.5px] text-[var(--text-muted)] font-medium max-w-[150px] leading-snug">{s.l}</span>
                  </div>
                ))}
              </div>

              {/* ključne funkcionalnosti */}
              <ul className="flex flex-col gap-2.5 mb-7">
                {d.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text)] leading-relaxed">
                    <span className="flex-shrink-0 w-[19px] h-[19px] mt-0.5 rounded-md flex items-center justify-center
                                     bg-green-500/12 border border-green-500/35 text-green-500">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={FEATURE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700
                             text-white text-sm font-bold shadow-lg shadow-brand-600/30
                             transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40"
                >
                  {d.ctaLive} <ArrowUpRight size={15} />
                </a>
                <a
                  href="#kontakt"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border)]
                             text-sm font-bold text-[var(--text)]
                             transition-[border-color,background-color] duration-300 hover:border-brand-600/50 hover:bg-brand-600/5"
                >
                  {d.ctaWant}
                </a>
              </div>

              {/* screenshot / mockup s blagim 3D nagibom koji se ispravlja na hover */}
              <div
                className="[transform:perspective(1200px)_rotateX(3deg)] group-hover:[transform:perspective(1200px)_rotateX(0deg)_translateY(-3px)]
                           transition-transform duration-500 will-change-transform"
              >
                {FEATURE_SCREENSHOT ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={FEATURE_SCREENSHOT}
                    alt={d.title}
                    className="rounded-2xl border border-brand-600/25 shadow-2xl shadow-brand-600/25 w-full"
                  />
                ) : (
                  <BrowserMock />
                )}
              </div>
            </div>
          </motion.article>

          {/* BOČNA LISTA */}
          <motion.div
            variants={staggerContainerSlow}
            {...revealSide}
            className="flex flex-col gap-5"
          >
            {d.minis.map((m, i) => {
              const meta = MINI_META[i];
              const isExternal = meta.href.startsWith("http");
              return (
                <motion.a
                  key={m.title}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  href={meta.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group/mini relative flex items-center gap-4 p-5 rounded-2xl flex-1
                             bg-[var(--surface)] border border-[var(--border)] overflow-hidden
                             transition-[border-color,box-shadow] duration-300
                             hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10"
                >
                  <span className={`relative flex-shrink-0 w-[86px] h-16 rounded-xl bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
                    <span className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-25" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-[var(--text)] mb-0.5">{m.title}</span>
                    <span className="block text-[12.5px] text-[var(--text-muted)] leading-snug">{m.desc}</span>
                  </span>
                  {m.live && (
                    <span className="absolute top-3 right-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden /> {d.livePill}
                    </span>
                  )}
                  <span className="ml-auto flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                                   bg-brand-600/10 border border-brand-600/25 text-brand-600 dark:text-brand-400
                                   transition-[background-color,transform] duration-300
                                   group-hover/mini:bg-brand-600/25 group-hover/mini:translate-x-0.5 group-hover/mini:-translate-y-0.5">
                    <ArrowUpRight size={16} />
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
