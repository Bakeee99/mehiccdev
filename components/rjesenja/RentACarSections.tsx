/**
 * components/rjesenja/RentACarSections.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Sve prikazne sekcije rent-a-car landing stranice (forma je zasebno, u
 * RcForm.tsx, jer nosi validaciju i slanje).
 *
 * Redoslijed: Hero → Problem → Rješenje → Case study → Paketi → Poređenje
 *             → (forma) → FAQ
 *
 * Poštuje projektna pravila: useReveal za scroll animacije, useCoarsePointer
 * za gašenje dekoracije na touchu, transition-[border-color,box-shadow] na
 * motion karticama, backdrop-blur tek od md:, color-mix() za prozirnost CSS
 * varijabli, sav tekst iz rentACarCopy.ts na oba jezika.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, Phone, Percent, MoonStar, CalendarX2,
  Languages, CalendarCheck, LayoutDashboard, Send, MapPinned, Search,
  Plus, Minus, Gauge, Car, Zap, Hand, CalendarDays, Info, Server, Gift, BellRing,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, slideInLeft, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useCoarsePointer } from "@/lib/useCoarsePointer";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { COPY } from "@/components/rjesenja/rentACarCopy";
import { RcForm } from "@/components/rjesenja/RcForm";
import { RcHowItWorks } from "@/components/rjesenja/RcHowItWorks";
import { SectionRail } from "@/components/ui/SectionRail";

const PROBLEM_ICONS: LucideIcon[]  = [Phone, Percent, MoonStar, CalendarX2];
const SOLUTION_ICONS: LucideIcon[] = [Languages, CalendarCheck, LayoutDashboard, Send, MapPinned, Search];

/* ── Zajednički header sekcije ───────────────────────────────────────────────
   align="center" je zadano; align="left" koristе sekcije koje treba da razbiju
   ritam, pa naslov ide lijevo a uvodni tekst desno od njega. Redni broj
   (01, 02...) daje osjećaj poglavlja umjesto niza istih blokova.            */
function SectionHead({
  label, h1, accent, sub, align = "center", index,
}: {
  label: string; h1: string; accent: string; sub?: string;
  align?: "center" | "left"; index?: string;
}) {
  const reveal = useReveal();

  const eyebrow = (
    <motion.div variants={fadeUp} className={align === "center" ? "flex justify-center mb-5" : "mb-5"}>
      <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full
                       border border-brand-600/30 bg-brand-600/10
                       text-brand-300 text-xs font-semibold tracking-wider uppercase">
        {index ? (
          <span className="font-serif italic text-[13px] text-brand-400 leading-none">{index}</span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
        )}
        {label}
      </span>
    </motion.div>
  );

  const heading = (
    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
      {h1}{" "}
      <span className="text-gradient font-serif italic font-semibold tracking-normal">{accent}</span>
    </motion.h2>
  );

  if (align === "left") {
    return (
      <motion.div variants={staggerContainer} {...reveal}
        className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-12 items-end mb-12">
        <div>
          {eyebrow}
          {heading}
        </div>
        {sub && (
          <motion.p variants={fadeUp} className="text-[var(--text-muted)] text-base leading-relaxed lg:pb-2">
            {sub}
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} {...reveal} className="text-center mb-14">
      {eyebrow}
      {heading}
      {sub && (
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-[var(--text-muted)] text-base sm:text-lg leading-relaxed mt-4">
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ── 1 · Hero ───────────────────────────────────────────────────────────────
   Podijeljen raspored: lijevo poruka, desno ŽIVI PRIKAZ SISTEMA koji se sam
   odvija u krug (gost bira datume → upit stiže → vlasnik potvrđuje → vozilo
   se zaključa). Umjesto da opisujemo šta sistem radi, posjetilac to vidi u
   prvih pet sekundi.

   Animacija ide kroz jednostavan brojač koraka, samo transform i opacity,
   bez blura. Na touch uređajima i uz reduced-motion prikaz stoji na zadnjem
   koraku, pa se sve i dalje vidi ali ništa se ne vrti.                     */

const HERO_STEP_MS = 2600;

function BookingDemo({ calm, labels }: { calm: boolean; labels: typeof COPY.bs.hero.demo }) {
  const [step, setStep] = useState(calm ? 3 : 0);

  useEffect(() => {
    if (calm) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 4), HERO_STEP_MS);
    return () => clearInterval(t);
  }, [calm]);

  const picked    = step >= 1;   // gost odabrao datume
  const requested = step >= 2;   // upit stigao vlasniku
  const confirmed = step >= 3;   // vlasnik potvrdio

  return (
    <div className="relative">
      {/* sjaj iza prikaza */}
      <div aria-hidden className="absolute -inset-8 rounded-[40px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(37,99,235,0.16),transparent_75%)]" />

      <div className="relative rounded-3xl border border-brand-500/25 bg-[#080D1E] overflow-hidden
                      shadow-[0_44px_90px_-30px_rgba(37,99,235,0.45)]">
        {/* traka prozora */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[.07]">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="ml-2 text-[10px] text-white/35 tracking-wide">{labels.window}</span>
        </div>

        <div className="p-5 sm:p-6">
          {/* kalendar */}
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200/60 mb-3">
            {labels.calendar}
          </p>
          <div className="grid grid-cols-7 gap-1.5 mb-5" aria-hidden>
            {Array.from({ length: 21 }).map((_, i) => {
              const inRange = i >= 9 && i <= 12;
              const on = picked && inRange;
              return (
                <motion.span
                  key={i}
                  animate={{
                    backgroundColor: on ? "rgba(37,99,235,0.9)" : "rgba(255,255,255,0.05)",
                    scale: on ? 1 : 0.96,
                  }}
                  transition={{ duration: 0.35, delay: on ? (i - 9) * 0.07 : 0 }}
                  className="h-7 rounded-md flex items-center justify-center text-[10px] font-semibold text-white/70"
                >
                  {i + 1}
                </motion.span>
              );
            })}
          </div>

          {/* vozilo */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-3.5 py-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/40 to-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <Car size={15} className="text-blue-200" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-bold text-white/90 leading-tight">{labels.car}</span>
              <span className="block text-[11px] text-white/40 leading-tight">{labels.price}</span>
            </span>
            <motion.span
              key={confirmed ? "taken" : "free"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap
                          ${confirmed
                            ? "text-brand-300 bg-brand-600/15 border-brand-600/35"
                            : "text-green-400 bg-green-500/10 border-green-500/30"}`}
            >
              {confirmed ? labels.booked : labels.free}
            </motion.span>
          </div>
        </div>
      </div>

      {/* upit koji stigne vlasniku */}
      <motion.div
        animate={{
          opacity: requested ? 1 : 0,
          y: requested ? 0 : 14,
          scale: requested ? 1 : 0.97,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute -bottom-6 right-0 sm:-right-6 w-[248px] max-w-[calc(100%-1rem)] rounded-2xl p-3.5
                   border border-brand-500/30 bg-[color-mix(in_srgb,var(--surface)_94%,transparent)]
                   shadow-[0_20px_45px_-12px_rgba(2,8,30,0.7)]"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                           bg-green-500/12 border border-green-500/35 text-green-400">
            <BellRing size={13} />
          </span>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-green-400">
            {labels.newRequest}
          </span>
        </div>
        <p className="text-[12px] text-[var(--text)] font-semibold leading-snug mb-3">{labels.requestBody}</p>

        <div className="flex gap-2">
          <motion.span
            animate={{
              backgroundColor: confirmed ? "rgba(34,197,94,0.9)" : "rgba(37,99,235,0.9)",
            }}
            transition={{ duration: 0.3 }}
            className="flex-1 h-7 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold text-white"
          >
            {confirmed ? <><Check size={11} strokeWidth={3} /> {labels.confirmed}</> : labels.confirm}
          </motion.span>
          <span className="w-16 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold
                           text-[var(--text-muted)] border border-[var(--border)]">
            {labels.decline}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Hero({ c, calm }: { c: typeof COPY.bs; calm: boolean }) {
  const reveal  = useReveal();
  const revealR = useReveal();
  const d = c.hero;

  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-16 items-center">

          {/* ── lijevo: poruka ── */}
          <motion.div variants={staggerContainer} {...reveal} className="text-center lg:text-left">
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                               border border-brand-600/30 bg-brand-600/10
                               text-brand-300 text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" aria-hidden />
                {d.eyebrow}
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-[38px] leading-[1.06] sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[var(--text)]">
              {d.h1a}{" "}
              <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.h1b}</span>
            </motion.h1>

            <motion.p variants={fadeUp}
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-[15.5px] sm:text-[17px] text-[var(--text-muted)] leading-relaxed">
              {d.sub}
            </motion.p>

            <motion.div variants={fadeUp}
              className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <a href="#upit"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl
                            bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[15px] font-bold
                            shadow-xl shadow-brand-600/30
                            transition-[box-shadow,transform] duration-300 hover:shadow-2xl hover:shadow-brand-600/45 hover:-translate-y-0.5">
                {d.ctaPrimary} <ArrowRight size={16} />
              </a>
              <a href="#paketi"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl
                            border border-[var(--border)] text-[15px] font-bold text-[var(--text)]
                            transition-[border-color,background-color,transform] duration-300
                            hover:border-brand-600/50 hover:bg-brand-600/5 hover:-translate-y-0.5">
                {d.ctaSecondary}
              </a>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {d.points.map((p) => (
                <li key={p}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
                               text-[var(--text)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)]
                               border border-[var(--border)]">
                  <Check size={12} strokeWidth={3} className="text-brand-400" /> {p}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── desno: živi prikaz ── */}
          <motion.div variants={slideInRight} {...revealR} className="lg:pl-4">
            <BookingDemo calm={calm} labels={d.demo} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── 2 · Problem ────────────────────────────────────────────────────────────
   Namjerno drugačiji ritam od ostalih sekcija: naslov lijevo, kartice su
   vodoravni redovi u zajedničkom panelu, a ne mreža kvadrata. Panel daje
   dubinu i razdvaja ovu sekciju od susjednih.                              */
function Problem({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.problem;
  return (
    <section id="problem" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} align="left" index="01" />

        <motion.div variants={staggerContainerSlow} {...reveal}
          className="rounded-[28px] border border-[var(--border)] p-2 sm:p-3
                     bg-[color-mix(in_srgb,var(--surface)_55%,transparent)]">
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
            {d.items.map((item, i) => {
              const Icon = PROBLEM_ICONS[i];
              return (
                <motion.article key={item.t} variants={fadeUp}
                  className="flex gap-4 rounded-2xl p-5 bg-[var(--surface)] border border-[var(--border)]
                             transition-[border-color] duration-300 hover:border-red-500/30">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                   bg-red-500/10 border border-red-500/25 text-red-400">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-extrabold text-[var(--text)] leading-tight mb-1.5">{item.t}</span>
                    <span className="block text-[13px] text-[var(--text-muted)] leading-relaxed">{item.d}</span>
                  </span>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 3 · Rješenje ───────────────────────────────────────────────────────────
   Asimetrična mreža: prve dvije stavke su šire i krupnije (to su i najjači
   argumenti), ostale četiri manje. Time sekcija prestaje biti niz identičnih
   kvadrata, a hijerarhija govori šta je najvažnije.                        */
function Solution({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.solution;
  const SPAN = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-6"];
  return (
    <section id="rjesenje" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} index="02" />
        <motion.div variants={staggerContainerSlow} {...reveal}
          className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {d.items.map((item, i) => {
            const Icon = SOLUTION_ICONS[i];
            const big = i < 2;
            const wide = i === 5;
            return (
              <motion.article key={item.t} variants={scaleIn} whileHover={{ y: -4 }}
                className={`group rounded-3xl bg-[var(--surface)] border border-[var(--border)]
                            transition-[border-color,box-shadow] duration-300
                            hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10
                            ${SPAN[i]} ${big ? "p-7" : "p-5"}
                            ${wide ? "flex items-center gap-5" : ""}`}>
                <span className={`inline-flex rounded-2xl items-center justify-center flex-shrink-0
                                  bg-gradient-to-br from-brand-600 to-brand-400 text-white
                                  shadow-lg shadow-brand-600/25
                                  transition-transform duration-300 group-hover:scale-110
                                  ${big ? "w-12 h-12 mb-4" : wide ? "w-11 h-11" : "w-10 h-10 mb-3"}`}>
                  <Icon size={big ? 20 : 17} />
                </span>
                <span className="min-w-0 block">
                  <span className={`block font-extrabold text-[var(--text)] leading-tight mb-1.5
                                    ${big ? "text-[19px]" : "text-[15px]"}`}>
                    {item.t}
                  </span>
                  <span className={`block text-[var(--text-muted)] leading-relaxed ${big ? "text-[14px]" : "text-[12.5px]"}`}>
                    {item.d}
                  </span>
                </span>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 5 · Case study ─────────────────────────────────────────────────────────── */
function CaseStudy({ c }: { c: typeof COPY.bs }) {
  const revealL = useReveal();
  const revealR = useReveal();
  const d = c.caseStudy;
  return (
    <section id="case-study" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <motion.div variants={staggerContainer} {...revealL}>
            <motion.span variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                         border border-brand-600/30 bg-brand-600/10
                         text-brand-300 text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
              {d.label}
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {d.heading1}{" "}
              <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[var(--text-muted)] leading-relaxed mb-6">{d.desc}</motion.p>

            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-6">
              {d.stats.map((s) => (
                <div key={s.l} className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-[var(--text)] tracking-tight">{s.v}</p>
                  <p className="text-[10.5px] text-[var(--text-muted)] leading-snug mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="flex items-start gap-2 text-[12px] text-[var(--text-muted)] mb-6">
              <Gauge size={13} className="mt-0.5 flex-shrink-0 text-brand-400" /> {d.note}
            </motion.p>

            <motion.a variants={fadeUp} href={d.ctaHref} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold
                         bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25
                         transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              {d.cta} <ArrowUpRight size={14} />
            </motion.a>
          </motion.div>

          {/* TODO: kada case study dobije svoju stranicu, ovaj blok linkovati na nju,
                    a screenshot zamijeniti novijim (ili galerijom više ekrana). */}
          <motion.div variants={slideInRight} {...revealR} className="relative">
            <div className="rounded-3xl overflow-hidden border border-brand-500/25 bg-[#080D1E]
                            shadow-[0_44px_90px_-30px_rgba(37,99,235,0.45)]">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[.08]">
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="flex-1 ml-2 h-[18px] rounded-md bg-white/[.06]" />
              </div>
              <Image src="/portfolio/maximum-naslovna.png" alt={d.imageAlt}
                     width={1600} height={1000} sizes="(max-width: 1024px) 100vw, 620px"
                     className="w-full h-auto object-cover object-top" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── 6 · Paketi ─────────────────────────────────────────────────────────────
   Tri kartice, srednja (Pro) istaknuta gradijentnim rubom i blagim
   uvećanjem. Svaka kartica ima "mjerač flote": traka od 12 segmenata koja
   odmah pokazuje za koju veličinu firme je paket, bez čitanja.
   Ispod kartica ide traka s cijenom održavanja.                            */
function CapacityMeter({ filled, label, active }: { filled: number; label: string; active: boolean }) {
  return (
    <div className="mb-6">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">{label}</p>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500
                        ${i < filled
                          ? active
                            ? "bg-gradient-to-r from-brand-500 to-brand-400"
                            : "bg-brand-600/55"
                          : "bg-[var(--border)]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Packages({ c }: { c: typeof COPY.bs }) {
  const reveal     = useReveal();
  const revealNote = useReveal();
  const d = c.packages;
  const FILL = [4, 8, 12];

  return (
    <section id="paketi" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} index="05" />

        <motion.div variants={staggerContainerSlow} {...reveal}
                    className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start pt-4">
          {d.items.map((p, i) => {
            const featured = i === 1;

            /* Sve na jednom elementu: radijus, rub, pozadina i sjena. Ranije je
               gradijentni rub bio na vanjskom divu, a radijus i pozadina na
               unutrašnjem, pa se uglovi i sjena nisu poklapali (vidjelo se kao
               čudan ugao uz karticu). */
            const card = (
              <div
                className={`relative flex flex-col h-full rounded-3xl p-6 sm:p-7 overflow-hidden
                            transition-[box-shadow] duration-300
                            ${featured
                              ? "hover:shadow-2xl hover:shadow-brand-600/20"
                              : "bg-[var(--surface)] border border-[var(--border)] hover:shadow-xl hover:shadow-brand-600/10"}`}
                style={featured ? {
                  background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(150deg, #2563EB, #60A5FA, #818CF8) border-box",
                  border: "1.5px solid transparent",
                } : undefined}
              >
                {/* sjaj u uglu istaknute kartice */}
                {featured && (
                  <span aria-hidden className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none
                                               bg-[radial-gradient(closest-side,rgba(37,99,235,0.20),transparent_72%)]" />
                )}

                <div className="relative">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="text-xl font-extrabold tracking-tight text-[var(--text)]">{p.name}</h3>
                    <span className="text-[26px] leading-none font-serif italic font-semibold text-gradient opacity-40 select-none">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-muted)] mb-5">
                    <Car size={12} className="text-brand-400" /> {p.size}
                  </p>

                  <CapacityMeter filled={FILL[i]} label={d.capacityLabel} active={featured} />

                  <p className="text-[26px] sm:text-[28px] font-extrabold text-[var(--text)] tracking-tight leading-none">
                    {p.price}
                  </p>
                  <p className="text-[11.5px] text-[var(--text-muted)] mt-2">{p.priceNote}</p>

                  {/* Dnevna računica: ista cifra, pristupačnija percepcija.
                     Vlasniku je lakše odmjeriti "9,50 KM dnevno" nego 3.500 KM. */}
                  <p className={`inline-flex items-center gap-1.5 mt-3 mb-5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold
                                 ${featured
                                   ? "bg-brand-600/15 border border-brand-600/35 text-brand-200"
                                   : "bg-[color-mix(in_srgb,var(--bg)_60%,transparent)] border border-[var(--border)] text-[var(--text-muted)]"}`}>
                    <CalendarDays size={12} /> {p.perDay}
                  </p>

                  {/* Bonus: 3 mjeseca podrške uz Pro i Premium. Zeleno da se
                     odvoji od plavog i da se vidi kao poklon, ne kao stavka. */}
                  {"bonus" in p && p.bonus && (
                    <div className="flex items-center gap-2.5 rounded-xl mb-5 px-3.5 py-2.5
                                    bg-green-500/10 border border-green-500/30">
                      <Gift size={15} className="text-green-400 flex-shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[12.5px] font-bold text-green-400 leading-tight">{p.bonus}</span>
                        <span className="block text-[11px] text-[var(--text-muted)] leading-tight">{p.bonusNote}</span>
                      </span>
                    </div>
                  )}

                  <div className="h-px bg-[var(--border)] mb-5" aria-hidden />

                  <ul className="flex flex-col gap-2.5 mb-7">
                    {p.features.map((f, fi) => {
                      const inherited = fi === 0 && i > 0;
                      return (
                        <li key={f}
                            className={`flex items-start gap-2.5 leading-snug
                                        ${inherited
                                          ? "text-[12px] font-bold uppercase tracking-wider text-brand-300"
                                          : "text-[13px] text-[var(--text)]"}`}>
                          <span className={`mt-0.5 w-[17px] h-[17px] rounded-full flex items-center justify-center flex-shrink-0
                                            ${inherited
                                              ? "bg-brand-600/20 border border-brand-600/40 text-brand-300"
                                              : "bg-brand-600/12 border border-brand-600/30 text-brand-400"}`}>
                            <Check size={9} strokeWidth={3.5} />
                          </span>
                          {f}
                        </li>
                      );
                    })}
                  </ul>

                  <p className={`flex items-start gap-2 text-[12px] leading-snug mb-5 -mt-2
                                 ${featured ? "text-brand-200" : "text-[var(--text-muted)]"}`}>
                    <Info size={12} className="mt-0.5 flex-shrink-0" /> {p.catch}
                  </p>

                  <a href="#upit"
                     className={`mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl
                                 text-sm font-bold transition-[background-color,border-color,box-shadow,transform] duration-300
                                 hover:-translate-y-0.5
                                 ${featured
                                   ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/35 hover:shadow-xl hover:shadow-brand-600/45"
                                   : "border border-[var(--border)] text-[var(--text)] hover:border-brand-600/45 hover:bg-brand-600/5"}`}>
                    {p.cta} <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );

            return (
              <motion.article
                key={p.name}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                className={`relative ${featured ? "md:-mt-4 md:mb-4 z-10" : ""}`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full
                                   bg-gradient-to-r from-brand-600 to-brand-500 text-white
                                   text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-brand-600/40
                                   whitespace-nowrap">
                    ★ {d.recommended}
                  </span>
                )}
                {card}
              </motion.article>
            );
          })}
        </motion.div>

        {/* Podrška nakon isporuke: dvije opcije jedna do druge.
           Namjerno je pretplata prikazana lijevo i s računicom koliko bi
           isto vrijeme koštalo po satnici, jer je to poštena usporedba i
           istovremeno najjasniji argument za pretplatu. */}
        <motion.div variants={staggerContainer} {...revealNote} className="mt-14 max-w-4xl mx-auto">
          <motion.p variants={fadeUp} className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] mb-2">
            {d.afterHeading}
          </motion.p>
          <motion.p variants={fadeUp} className="text-center text-sm text-[var(--text-muted)] mb-7">
            {d.afterSub}
          </motion.p>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
            {/* pretplata */}
            <div className="rounded-2xl p-6 bg-[var(--surface)] border border-brand-600/35">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-300">{d.support.subLabel}</p>
                <p className="text-2xl font-extrabold text-[var(--text)] whitespace-nowrap">
                  {d.support.subPrice}
                  <span className="text-sm font-semibold text-[var(--text-muted)]">{d.support.subPer}</span>
                </p>
              </div>
              <p className="text-[13px] text-[var(--text)] leading-relaxed mb-3">{d.support.subDesc}</p>
              <p className="flex items-start gap-2 text-[11.5px] text-[var(--text-muted)]">
                <Info size={12} className="mt-0.5 flex-shrink-0 text-brand-400" /> {d.support.subAnchor}
              </p>
            </div>

            {/* po satu */}
            <div className="rounded-2xl p-6 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] border border-dashed border-[var(--border)]">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{d.support.hourLabel}</p>
                <p className="text-2xl font-extrabold text-[var(--text)] whitespace-nowrap">
                  {d.support.hourPrice}
                  <span className="text-sm font-semibold text-[var(--text-muted)]">{d.support.hourPer}</span>
                </p>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{d.support.hourDesc}</p>
            </div>
          </motion.div>

          <motion.p variants={fadeUp}
            className="mt-4 flex items-start justify-center gap-2 text-center text-[12px] text-[var(--text-muted)]">
            <Server size={12} className="mt-0.5 flex-shrink-0" /> {d.support.hostingNote}
          </motion.p>
          <motion.p variants={fadeUp} className="text-center text-[12px] text-[var(--text-muted)] mt-2">
            {d.note}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 7 · Poređenje ──────────────────────────────────────────────────────────── */
function Comparison({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.comparison;
  return (
    <section id="poredjenje" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} sub={d.body} align="left" index="06" />
        <motion.div variants={staggerContainerSlow} {...reveal} className="flex flex-col gap-3">
          {d.rows.map((r) => (
            <motion.div key={r.b} variants={fadeUp}
              className="grid sm:grid-cols-2 gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5
                         bg-[var(--surface)] border border-[var(--border)]">
              <p className="flex items-start gap-2.5 text-[13px] text-[var(--text-muted)] line-through decoration-red-500/40">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0" aria-hidden />
                {r.a}
              </p>
              <p className="flex items-start gap-2.5 text-[13px] font-semibold text-[var(--text)]">
                <Check size={14} strokeWidth={3} className="mt-0.5 flex-shrink-0 text-green-500" />
                {r.b}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 8 · FAQ ────────────────────────────────────────────────────────────────── */
function Faq({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const [open, setOpen] = useState<number | null>(0);
  const d = c.faq;
  return (
    <section id="pitanja" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} />
        <motion.div variants={staggerContainerSlow} {...reveal} className="flex flex-col gap-3">
          {d.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={item.q} variants={fadeUp}
                className={`rounded-2xl border bg-[var(--surface)] overflow-hidden
                            transition-[border-color] duration-300
                            ${isOpen ? "border-brand-600/40" : "border-[var(--border)]"}`}>
                <button type="button" onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[14.5px] font-bold text-[var(--text)]">{item.q}</span>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                    border transition-colors duration-300
                                    ${isOpen ? "bg-brand-600/15 border-brand-600/35 text-brand-400"
                                             : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 -mt-1 text-[13.5px] text-[var(--text-muted)] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Stranica ───────────────────────────────────────────────────────────────── */
export function RentACarSections() {
  const { lang } = useLanguage();
  const c = (COPY[(lang as "bs" | "en")] ?? COPY.bs) as typeof COPY.bs;
  const coarse = useCoarsePointer();
  const reduce = useReducedMotion() ?? false;
  const calm = coarse || reduce;

  return (
    <main className="relative">
      {/* dekorativni sjaj: miruje na touch uređajima i uz reduced motion */}
      {!calm && (
        <div aria-hidden className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none
                                    bg-[radial-gradient(115%_70%_at_50%_-10%,rgba(37,99,235,0.14),transparent_60%)]" />
      )}
      <SectionRail items={c.nav} />
      <Hero c={c} calm={reduce} />
      <Problem c={c} />
      <Solution c={c} />
      <RcHowItWorks c={c} />
      <CaseStudy c={c} />
      <Packages c={c} />
      <Comparison c={c} />
      <RcForm c={c} />
      <Faq c={c} />
    </main>
  );
}
