/**
 * components/sections/Results.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Rezultati" (v2: "Brojke koje možete provjeriti").
 *
 * Filozofija v2: umjesto izmišljenih prosjeka (98% zadovoljstva itd.) koje
 * mlada agencija ne može imati, sekcija pokazuje STVARNA, PROVJERLJIVA
 * mjerenja s Maximum projekta:
 *
 *   1. TRKA UČITAVANJA (centerpiece): stari sajt (21,6s) i naša aplikacija
 *      (3,2s) se utrkuju uživo, trake se pune u stvarnom omjeru, brojači
 *      broje sekunde. Aplikacija završi dok se stari sajt još vuče. 6,7× brže.
 *   2. GAUGES: prave Google PageSpeed ocjene (100/100/100, mobitel 90),
 *      s napomenom da mjerenje svako može ponoviti sam.
 *   3. TRI ISKRENE ČINJENICE u pilulama (projekti uživo, 0 poziva, 24h).
 *
 * Animacije se pokreću kad blok uđe u ekran (jednom), poštuju reduced-motion,
 * i preživljavaju promjenu jezika/teme (isti princip kao useReveal; ovdje je
 * boolean "go" lokalan jer pokreće i trake/brojače, ne samo reveal).
 *
 * Self-contained (BS/EN), dark/light, bez crtica, id ostaje "rezultati".
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Rocket, PhoneOff, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

/* ── Sadržaj ────────────────────────────────────────────────────────────────── */
type Content = {
  label: string; heading1: string; headingAccent: string; sub: string;
  raceTitle: string; raceSub: string;
  oldLabel: string; newLabel: string; loadedLabel: string; stillLabel: string;
  fasterBadge: string; raceNote: string;
  gaugesCaptionPre: string; gaugesLink: string;
  gauges: { v: number; l: string; s: string }[];
  facts: { t: string }[];
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Rezultati",
    heading1: "Brojke koje",
    headingAccent: "možete provjeriti",
    sub: "Bez izmišljenih prosjeka i procenata. Ovo su stvarna Google mjerenja s našeg zadnjeg projekta, ista koja možete izmjeriti i sami.",
    raceTitle: "Koliko brzo se otvara?",
    raceSub: "Isti biznis, prije i poslije. Mjereno na telefonu, Google PageSpeed alatom.",
    oldLabel: "Stari sajt klijenta",
    newLabel: "Naša aplikacija",
    loadedLabel: "Učitano",
    stillLabel: "još se učitava…",
    fasterBadge: "6,7× brže",
    raceNote: "Više od polovine posjetilaca odustane ako se stranica ne otvori za oko 3 sekunde. Na staroj brzini, ti ljudi nikad ne vide ponudu.",
    gaugesCaptionPre: "Google PageSpeed ocjene, Maximum Rent a Car. Mjerenje možete ponoviti sami na",
    gaugesLink: "pagespeed.web.dev",
    gauges: [
      { v: 100, l: "Performanse", s: "desktop" },
      { v: 100, l: "SEO", s: "vidljivost na Googlu" },
      { v: 100, l: "Pristupačnost", s: "za sve korisnike" },
      { v: 90,  l: "Na telefonu", s: "performanse, mobitel" },
    ],
    facts: [
      { t: "Svi naši projekti su uživo i rade u produkciji" },
      { t: "0 telefonskih poziva potrebno da klijent rezerviše" },
      { t: "Odgovaramo u roku od 24 sata, obično isti dan" },
    ],
  },
  en: {
    label: "Results",
    heading1: "Numbers you can",
    headingAccent: "verify yourself",
    sub: "No invented averages or percentages. These are real Google measurements from our latest project, the same ones you can run yourself.",
    raceTitle: "How fast does it open?",
    raceSub: "The same business, before and after. Measured on mobile with Google PageSpeed.",
    oldLabel: "Client's old website",
    newLabel: "Our application",
    loadedLabel: "Loaded",
    stillLabel: "still loading…",
    fasterBadge: "6.7× faster",
    raceNote: "More than half of visitors give up if a page doesn't open within about 3 seconds. At the old speed, those people never even see the offer.",
    gaugesCaptionPre: "Google PageSpeed scores, Maximum Rent a Car. You can re-run the measurement yourself at",
    gaugesLink: "pagespeed.web.dev",
    gauges: [
      { v: 100, l: "Performance", s: "desktop" },
      { v: 100, l: "SEO", s: "Google visibility" },
      { v: 100, l: "Accessibility", s: "for all users" },
      { v: 90,  l: "On mobile", s: "performance, phone" },
    ],
    facts: [
      { t: "All of our projects are live and running in production" },
      { t: "0 phone calls needed for a customer to book" },
      { t: "We reply within 24 hours, usually the same day" },
    ],
  },
};

const FACT_ICONS: LucideIcon[] = [Rocket, PhoneOff, Clock];

const OLD_SEC = 21.6;
const NEW_SEC = 3.2;
// trajanje animacije trke (ms): aplikacija završi za ~1s, stari sajt u istom
// omjeru izgleda beskonačno spor (~6,75s)
const NEW_MS = 1000;
const OLD_MS = Math.round(NEW_MS * (OLD_SEC / NEW_SEC));

/* ── Brojač sekundi (rAF), staje na cilju ──────────────────────────────────── */
function useSecondsCounter(go: boolean, target: number, durationMs: number, reduce: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!go) return;
    if (reduce) { setVal(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / durationMs, 1);
      setVal(target * p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, target, durationMs, reduce]);
  return val;
}

/* ── Jedna traka u trci ─────────────────────────────────────────────────────── */
function RaceBar({
  go, label, seconds, durationMs, isNew, loadedLabel, stillLabel, reduce, decimalComma,
}: {
  go: boolean; label: string; seconds: number; durationMs: number;
  isNew: boolean; loadedLabel: string; stillLabel: string; reduce: boolean; decimalComma: boolean;
}) {
  const val = useSecondsCounter(go, seconds, durationMs, reduce);
  const done = go && (reduce || val >= seconds - 0.001);
  const fmt = (n: number) => {
    const s = (Math.round(n * 10) / 10).toFixed(1);
    return decimalComma ? s.replace(".", ",") : s;
  };
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-colors duration-500
                     ${isNew
                       ? "bg-brand-600/[.06] border-brand-600/30"
                       : "bg-[var(--bg)]/60 border-[var(--border)]"}`}>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <span className={`text-[12.5px] font-bold uppercase tracking-wider
                          ${isNew ? "text-brand-600 dark:text-brand-400" : "text-[var(--text-muted)]"}`}>
          {label}
        </span>
        <span className="flex items-baseline gap-1.5">
          <b className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums
                         ${isNew ? "text-brand-600 dark:text-brand-400" : "text-[var(--text)]"}`}>
            {fmt(val)}s
          </b>
        </span>
      </div>
      {/* traka */}
      <div className="relative h-3 rounded-full bg-[var(--border)]/60 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full
                      ${isNew
                        ? "bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_14px_rgba(96,165,250,0.6)]"
                        : "bg-gradient-to-r from-red-500/70 to-orange-400/70"}`}
          style={{
            width: go ? "100%" : "0%",
            transition: reduce ? "none" : `width ${durationMs}ms linear`,
          }}
        />
      </div>
      {/* status */}
      <div className="mt-2.5 h-5 text-[11.5px] font-semibold">
        {done ? (
          <span className={`inline-flex items-center gap-1.5 ${isNew ? "text-green-600 dark:text-green-400" : "text-[var(--text-muted)]"}`}>
            <CheckCircle2 size={13} /> {loadedLabel} · {fmt(seconds)}s
          </span>
        ) : go ? (
          <span className="text-[var(--text-muted)] animate-pulse">{stillLabel}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ── Gauge s brojačem ───────────────────────────────────────────────────────── */
function Gauge({ go, value, label, sub, reduce }: { go: boolean; value: number; label: string; sub: string; reduce: boolean }) {
  const C = 2 * Math.PI * 54;
  const val = useSecondsCounter(go, value, 1400, reduce);
  return (
    <div className="group text-center rounded-[22px] p-4 sm:p-6 bg-[var(--surface)] border border-[var(--border)]
                    transition-[border-color,transform] duration-300 hover:border-brand-600/40 hover:-translate-y-1">
      <div className="relative w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] mx-auto mb-3">
        <svg className="w-full h-full" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="65" cy="65" r="54" fill="none" stroke="var(--border)" strokeWidth="9" />
          <circle
            cx="65" cy="65" r="54" fill="none" stroke="url(#resGrad)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={go ? C * (1 - value / 100) : C}
            style={{ transition: reduce ? "none" : "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[22px] sm:text-[27px] font-extrabold tracking-tight text-[var(--text)] tabular-nums">
          {Math.round(val)}
        </div>
      </div>
      <div className="text-[13.5px] font-bold text-[var(--text)]">{label}</div>
      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{sub}</div>
    </div>
  );
}

export function Results() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;
  const reduce = useReducedMotion() ?? false;

  const revealHead  = useReveal();
  const revealFacts = useReveal();

  // "go" pokreće i reveal i trke/brojače, jednom, i preživljava re-render
  const [raceGo, setRaceGo]     = useState(false);
  const [gaugesGo, setGaugesGo] = useState(false);

  return (
    <section id="rezultati" className="py-28 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -left-56 top-24 w-96 h-96 rounded-full bg-brand-600/5 blur-3xl pointer-events-none" aria-hidden />

      <svg width="0" height="0" aria-hidden><defs>
        <linearGradient id="resGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60A5FA" /><stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs></svg>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-14">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.label}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {d.heading1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {d.sub}
          </motion.p>
        </motion.div>

        {/* ── 1 · Trka učitavanja ────────────────────────────────────────── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={raceGo ? "visible" : "hidden"}
          viewport={viewportOnce}
          onViewportEnter={() => setRaceGo(true)}
          className="relative rounded-3xl p-6 sm:p-9 overflow-hidden mb-6
                     bg-[var(--surface)] border border-brand-600/25"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" aria-hidden />
          <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.035] pointer-events-none" aria-hidden />

          <div className="relative flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">{d.raceTitle}</h3>
              <p className="text-[13px] text-[var(--text-muted)] mt-1">{d.raceSub}</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-sm font-extrabold
                             text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/30">
              {d.fasterBadge}
            </span>
          </div>

          <div className="relative grid gap-4">
            <RaceBar go={raceGo} label={d.newLabel} seconds={NEW_SEC} durationMs={NEW_MS}
                     isNew loadedLabel={d.loadedLabel} stillLabel={d.stillLabel} reduce={reduce}
                     decimalComma={lang !== "en"} />
            <RaceBar go={raceGo} label={d.oldLabel} seconds={OLD_SEC} durationMs={OLD_MS}
                     isNew={false} loadedLabel={d.loadedLabel} stillLabel={d.stillLabel} reduce={reduce}
                     decimalComma={lang !== "en"} />
          </div>

          <p className="relative text-[12.5px] text-[var(--text-muted)] leading-relaxed mt-5 max-w-2xl">
            {d.raceNote}
          </p>
        </motion.div>

        {/* ── 2 · Gauges: prave Google ocjene ───────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={gaugesGo ? "visible" : "hidden"}
          viewport={viewportOnce}
          onViewportEnter={() => setGaugesGo(true)}
        >
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-4">
            {d.gauges.map((g) => (
              <Gauge key={g.l} go={gaugesGo} value={g.v} label={g.l} sub={g.s} reduce={reduce} />
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-center text-[11.5px] text-[var(--text-muted)] mb-12">
            {d.gaugesCaptionPre}{" "}
            <a href="https://pagespeed.web.dev" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              {d.gaugesLink} <ExternalLink size={10} />
            </a>
          </motion.p>
        </motion.div>

        {/* ── 3 · Tri iskrene činjenice ─────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealFacts} className="grid sm:grid-cols-3 gap-3.5">
          {d.facts.map((f, i) => {
            const Icon = FACT_ICONS[i];
            return (
              <motion.div
                key={f.t}
                variants={fadeUp}
                className="flex items-center gap-3.5 p-4 rounded-2xl
                           bg-[var(--surface)] border border-[var(--border)]
                           transition-[border-color,transform] duration-300
                           hover:border-brand-600/40 hover:-translate-y-1"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                 bg-brand-600/10 border border-brand-600/25 text-brand-600 dark:text-brand-400">
                  <Icon size={16} />
                </span>
                <span className="text-[13px] font-semibold text-[var(--text)] leading-snug">{f.t}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
