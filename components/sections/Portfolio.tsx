/**
 * components/sections/Portfolio.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Naš rad" — Hero Case Study Fuzija (Koncept 1, v2).
 *
 * • Maximum Rent a Car: featured blok s laptop mockupom (naslovna aplikacije)
 *   i telefon mockupom preko njega (admin panel).
 * • Bočni projekti: vertikalne kartice čiji vizual popunjava visinu
 *   (nema više praznog prostora).
 *
 * SCREENSHOTOVI: slike spremi u /public/portfolio/ pa upiši putanje ispod:
 *   SCREEN_DESKTOP → screenshot naslovne (širi format, npr. 1600×1000)
 *   SCREEN_MOBILE  → screenshot admin panela u USPRAVNOM (telefon) formatu
 * Dok su prazne, prikazuju se uredni CSS placeholderi.
 *
 * Self-contained (BS/EN u ovom fajlu), useReveal pattern, dark/light tema.
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Star, ZoomIn, X } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ── Screenshot slotovi (prazno = CSS placeholder) ────────────────────────────
const SCREEN_DESKTOP = "/portfolio/maximum-naslovna.png";
const SCREEN_MOBILE  = "/portfolio/maximum-admin-mobitel.png";
const FEATURE_URL = "https://maximum-rent.vercel.app";

// ── Bilingual content ────────────────────────────────────────────────────────
type Mini = { title: string; cat: string; desc: string; live?: boolean };
type Content = {
  label: string; heading: string; headingAccent: string; subtitle: string;
  badge: string; title: string; desc: string;
  stats: { v: string; l: string }[];
  features: string[];
  ctaLive: string; ctaWant: string; livePill: string;
  zoomHint: string; closeLabel: string;
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
    zoomHint: "Klikni za uvećanje",
    closeLabel: "Zatvori",
    minis: [
      { title: "OxyBaric Mostar", cat: "Custo Website · Medicina", desc: "Medicinski sajt koji dovodi pacijente iz Google pretrage.", live: true },
      { title: "Roobet Rewards", cat: "UI/UX Dizajn · Crypto Casino", desc: "Dizajn rewards sistema za gaming platformu: nivoi, nagrade i progresija koja igrača vodi naprijed.", live: true },
      { title: "Fitness Trainer", cat: "UI/UX & Development", desc: "Lični brend s online zakazivanjem umjesto prepiske porukama." },
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
    zoomHint: "Click to enlarge",
    closeLabel: "Close",
    minis: [
      { title: "OxyBaric Mostar", cat: "Custom Website · Medicine", desc: "A medical site that brings patients in from Google search.", live: true },
      { title: "Roobet Rewards", cat: "UI/UX Design · Crypto Casino", desc: "Rewards system design for a gaming platform: tiers, perks and a progression that pulls players forward.", live: true },
      { title: "Fitness Trainer", cat: "UI/UX & Development", desc: "A personal brand site with online booking instead of endless messaging." },
    ],
  },
};

// Visual meta for mini cards (order matches T.minis)
// img: putanja do screenshota u /public/portfolio/ (npr. "/portfolio/oxybaric.png").
// Ostavi "" da se prikazuje gradijent. Slika se sama pojavi kad upišeš putanju.
const MINI_META = [
  { img: "/portfolio/oxybaric.png", gradient: "from-sky-400 via-blue-500 to-indigo-600",  href: "https://oxybaricmostar.ba" },
  { img: "/portfolio/roobet.png", gradient: "from-yellow-400 via-amber-500 to-orange-600", href: "https://roobet.com/" },
  { img: "", gradient: "from-indigo-500 via-blue-600 to-blue-700", href: "#portfolio" },
];

/* ── Placeholder ekrani (dok ne stignu pravi screenshotovi) ─────────────────
   Namjerno tamni bez obzira na temu sajta: glume screenshot aplikacije.    */

function DesktopPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0B1533] to-[#070C1D] p-[6%] flex flex-col" aria-hidden>
      {/* nav */}
      <div className="flex items-center justify-between mb-[7%]">
        <div className="h-[8px] w-[22%] rounded bg-white/25" />
        <div className="flex gap-[4%] w-[40%] justify-end">
          <span className="h-[6px] w-[18%] rounded bg-white/12" />
          <span className="h-[6px] w-[18%] rounded bg-white/12" />
          <span className="h-[6px] w-[18%] rounded bg-white/12" />
        </div>
      </div>
      {/* hero naslov + CTA */}
      <div className="h-[10px] w-[55%] rounded bg-white/30 mb-[3%]" />
      <div className="h-[10px] w-[38%] rounded bg-blue-400/50 mb-[5%]" />
      <div className="h-[7px] w-[46%] rounded bg-white/12 mb-[7%]" />
      <div className="h-[22px] w-[26%] rounded-md bg-blue-600 shadow-lg shadow-blue-600/50 mb-auto" />
      {/* red kartica vozila */}
      <div className="grid grid-cols-3 gap-[4%]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-white/[.04] p-[6%]">
            <div className="aspect-[16/9] rounded bg-gradient-to-br from-blue-400/30 to-blue-600/10 mb-[8%]" />
            <div className="h-[6px] w-[70%] rounded bg-white/18 mb-[6%]" />
            <div className="h-[6px] w-[42%] rounded bg-blue-400/45" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobilePlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0C1631] to-[#070B1A] p-[8%] flex flex-col gap-[6%]" aria-hidden>
      <div className="h-[7px] w-[58%] rounded bg-white/28 mb-[2%]" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-white/[.05] p-[7%] flex items-center gap-[6%]">
          <span className={`w-[9px] h-[9px] rounded-full flex-shrink-0 ${i === 0 ? "bg-amber-400" : "bg-green-500"}`} />
          <span className="flex-1">
            <span className="block h-[6px] w-[75%] rounded bg-white/22 mb-[8%]" />
            <span className="block h-[5px] w-[50%] rounded bg-white/10" />
          </span>
        </div>
      ))}
      <div className="mt-auto h-[18px] rounded-md bg-blue-600/90" />
    </div>
  );
}

/* ── Laptop + telefon kompozicija ───────────────────────────────────────── */
function DeviceShowcase({
  title, zoomHint, onOpen,
}: { title: string; zoomHint: string; onOpen: (src: string, alt: string) => void }) {
  return (
    <div className="relative pr-[13%] sm:pr-[15%]">
      {/* LAPTOP */}
      <div className="relative">
        <div className="rounded-t-2xl border border-[var(--border)] bg-zinc-900 dark:bg-zinc-950 p-2 sm:p-2.5 pb-0">
          <div className="relative rounded-t-lg overflow-hidden aspect-[16/10] bg-[#070C1D]">
            {SCREEN_DESKTOP ? (
              <button
                type="button"
                onClick={() => onOpen(SCREEN_DESKTOP, title)}
                aria-label={zoomHint}
                className="group/zoom block w-full h-full cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SCREEN_DESKTOP} alt={title} className="w-full h-full object-cover object-top" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0
                                 transition-all duration-300 group-hover/zoom:bg-black/35 group-hover/zoom:opacity-100">
                  <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white
                                   bg-black/50 border border-white/20">
                    <ZoomIn size={13} /> {zoomHint}
                  </span>
                </span>
              </button>
            ) : (
              <DesktopPlaceholder />
            )}
          </div>
        </div>
        {/* baza laptopa */}
        <div className="relative h-3 sm:h-3.5 rounded-b-xl bg-zinc-800 dark:bg-zinc-900 border border-t-0 border-[var(--border)]
                        shadow-[0_24px_50px_-18px_rgba(37,99,235,0.45)]">
          <span className="absolute left-1/2 -translate-x-1/2 top-0 w-[14%] h-1.5 rounded-b-md bg-zinc-700 dark:bg-zinc-800" aria-hidden />
        </div>
      </div>

      {/* TELEFON (admin panel), preklapa laptop zdesna */}
      <div className="absolute right-0 -bottom-3 sm:-bottom-4 w-[24%] min-w-[86px] max-w-[150px] rotate-[2.5deg]
                      rounded-[20px] border border-[var(--border)] bg-zinc-900 dark:bg-zinc-950 p-1.5
                      shadow-[0_22px_44px_-14px_rgba(2,8,30,0.85)]">
        <div className="relative rounded-[14px] overflow-hidden aspect-[9/19] bg-[#070B1A]">
          {/* notch */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 w-[36%] h-[9px] rounded-full bg-black/80 z-10" aria-hidden />
          {SCREEN_MOBILE ? (
            <button
              type="button"
              onClick={() => onOpen(SCREEN_MOBILE, `${title} · admin`)}
              aria-label={zoomHint}
              className="group/zoom block w-full h-full cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SCREEN_MOBILE} alt={`${title} · admin`} className="w-full h-full object-cover object-top" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0
                               transition-all duration-300 group-hover/zoom:bg-black/35 group-hover/zoom:opacity-100">
                <span className="p-2 rounded-lg bg-black/50 border border-white/20 text-white">
                  <ZoomIn size={13} />
                </span>
              </span>
            </button>
          ) : (
            <MobilePlaceholder />
          )}
        </div>
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

  // Lightbox: klik na screenshot u mockupu otvara sliku preko cijelog ekrana
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section id="portfolio" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -left-48 top-1/3 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />

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
                               text-xs font-semibold tracking-wider uppercase">
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
            <div className="absolute -top-24 -right-24 w-[420px] h-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent_72%)] pointer-events-none" aria-hidden />
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
                    className="flex flex-col gap-0.5 px-4 py-2.5 rounded-xl bg-[color-mix(in_srgb,var(--bg)_60%,transparent)] border border-[var(--border)]
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
              <div className="flex flex-wrap gap-3 mb-9">
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

              {/* laptop + telefon, blagi 3D nagib koji se ispravi na hover */}
              <div
                className="[transform:perspective(1300px)_rotateX(4deg)] group-hover:[transform:perspective(1300px)_rotateX(0deg)_translateY(-4px)]
                           transition-transform duration-500 will-change-transform"
              >
                <DeviceShowcase
                  title={d.title}
                  zoomHint={d.zoomHint}
                  onOpen={(imgSrc, imgAlt) => setLightbox({ src: imgSrc, alt: imgAlt })}
                />
              </div>
            </div>
          </motion.article>

          {/* BOČNE KARTICE: vertikalne, vizual popunjava visinu */}
          <motion.div
            variants={staggerContainerSlow}
            {...revealSide}
            className="flex flex-col gap-6"
          >
            {d.minis.map((m, i) => {
              const meta = MINI_META[i];
              const isExternal = meta.href.startsWith("http");
              return (
                <motion.a
                  key={m.title}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  href={meta.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group/mini relative flex flex-col flex-1 min-h-[200px] rounded-2xl overflow-hidden
                             bg-[var(--surface)] border border-[var(--border)]
                             transition-[border-color,box-shadow] duration-300
                             hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10"
                >
                  {/* vizual popunjava svu preostalu visinu: screenshot ili gradijent */}
                  <span className={`relative flex-1 min-h-[110px] bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
                    {meta.img ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={meta.img}
                          alt={m.title}
                          className="absolute inset-0 w-full h-full object-cover object-top
                                     transition-transform duration-500 group-hover/mini:scale-105"
                        />
                        <span className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/45 to-transparent" aria-hidden />
                      </>
                    ) : (
                      <span className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20 transition-transform duration-500 group-hover/mini:scale-110" aria-hidden />
                    )}
                    <span className="absolute top-3.5 left-4 px-2.5 py-1 rounded-full bg-black/45 text-white text-[10.5px] font-semibold">
                      {m.cat}
                    </span>
                    {m.live && (
                      <span className="absolute top-3.5 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45
                                       text-[10px] font-bold uppercase tracking-wider text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden /> {d.livePill}
                      </span>
                    )}
                  </span>
                  {/* sadržaj */}
                  <span className="flex items-center gap-3 p-5">
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-[var(--text)] mb-0.5">{m.title}</span>
                      <span className="block text-[12.5px] text-[var(--text-muted)] leading-snug">{m.desc}</span>
                    </span>
                    <span className="ml-auto flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                                     bg-brand-600/10 border border-brand-600/25 text-brand-600 dark:text-brand-400
                                     transition-[background-color,transform] duration-300
                                     group-hover/mini:bg-brand-600/25 group-hover/mini:translate-x-0.5 group-hover/mini:-translate-y-0.5">
                      <ArrowUpRight size={16} />
                    </span>
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Lightbox: uvećani screenshot preko cijelog ekrana ─────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label={d.closeLabel}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-xl flex items-center justify-center
                         bg-white/10 border border-white/20 text-white
                         transition-colors duration-200 hover:bg-white/20"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[94vw] max-h-[88vh] rounded-xl border border-white/15 shadow-2xl object-contain cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
