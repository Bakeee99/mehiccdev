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

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, Phone, Percent, MoonStar, CalendarX2,
  Languages, CalendarCheck, LayoutDashboard, Send, MapPinned, Search,
  Plus, Minus, Gauge, Car, Zap, Hand, CalendarDays, Info, Server, Gift,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, slideInLeft, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useCoarsePointer } from "@/lib/useCoarsePointer";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { COPY } from "@/components/rjesenja/rentACarCopy";
import { RcForm } from "@/components/rjesenja/RcForm";

const PROBLEM_ICONS: LucideIcon[]  = [Phone, Percent, MoonStar, CalendarX2];
const SOLUTION_ICONS: LucideIcon[] = [Languages, CalendarCheck, LayoutDashboard, Send, MapPinned, Search];

/* ── Zajednički header sekcije ──────────────────────────────────────────────── */
function SectionHead({ label, h1, accent, sub }: { label: string; h1: string; accent: string; sub?: string }) {
  const reveal = useReveal();
  return (
    <motion.div variants={staggerContainer} {...reveal} className="text-center mb-14">
      <motion.div variants={fadeUp} className="flex justify-center mb-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                         border border-brand-600/30 bg-brand-600/10
                         text-brand-300 text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
          {label}
        </span>
      </motion.div>
      <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
        {h1}{" "}
        <span className="text-gradient font-serif italic font-semibold tracking-normal">{accent}</span>
      </motion.h2>
      {sub && (
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-[var(--text-muted)] text-base sm:text-lg leading-relaxed">
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ── 1 · Hero ───────────────────────────────────────────────────────────────── */
function Hero({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.hero;
  return (
    <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div variants={staggerContainer} {...reveal}>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 bg-brand-600/10
                             text-brand-300 text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.eyebrow}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="text-[38px] leading-[1.08] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text)]">
            {d.h1a}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.h1b}</span>
          </motion.h1>

          <motion.p variants={fadeUp}
            className="mt-6 max-w-2xl mx-auto text-[15.5px] sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {d.sub}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
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

          <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
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
      </div>
    </section>
  );
}

/* ── 2 · Problem ────────────────────────────────────────────────────────────── */
function Problem({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.problem;
  return (
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} />
        <motion.div variants={staggerContainerSlow} {...reveal} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {d.items.map((item, i) => {
            const Icon = PROBLEM_ICONS[i];
            return (
              <motion.article key={item.t} variants={scaleIn} whileHover={{ y: -4 }}
                className="rounded-3xl p-6 bg-[var(--surface)] border border-[var(--border)]
                           transition-[border-color,box-shadow] duration-300
                           hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5">
                <span className="inline-flex w-10 h-10 rounded-2xl items-center justify-center mb-4
                                 bg-red-500/10 border border-red-500/25 text-red-400">
                  <Icon size={17} />
                </span>
                <h3 className="text-[15px] font-extrabold text-[var(--text)] leading-tight mb-2">{item.t}</h3>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item.d}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 3 · Rješenje ───────────────────────────────────────────────────────────── */
function Solution({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.solution;
  return (
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} />
        <motion.div variants={staggerContainerSlow} {...reveal} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {d.items.map((item, i) => {
            const Icon = SOLUTION_ICONS[i];
            return (
              <motion.article key={item.t} variants={scaleIn} whileHover={{ y: -4 }}
                className="group rounded-3xl p-6 bg-[var(--surface)] border border-[var(--border)]
                           transition-[border-color,box-shadow] duration-300
                           hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10">
                <span className="inline-flex w-11 h-11 rounded-2xl items-center justify-center mb-4
                                 bg-gradient-to-br from-brand-600 to-brand-400 text-white
                                 shadow-lg shadow-brand-600/25
                                 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={18} />
                </span>
                <h3 className="text-base font-extrabold text-[var(--text)] leading-tight mb-2">{item.t}</h3>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item.d}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 4 · Kako radi u praksi ─────────────────────────────────────────────────
   Poenta sekcije: pokazati koliko malo posla ostaje vlasniku. Koraci su
   obojeni po tome ko ih radi, sistem (plavo, ikonica munje) ili vlasnik
   (zeleno, ikonica ruke), pa se na prvi pogled vidi da su samo dva koraka
   njegova.                                                                 */
function Flow({ c }: { c: typeof COPY.bs }) {
  const reveal  = useReveal();
  const revealS = useReveal();
  const d = c.flow;

  return (
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} sub={d.sub} />

        <motion.div variants={staggerContainerSlow} {...reveal} className="relative">
          {/* linija koja povezuje korake */}
          <div className="absolute left-[27px] top-8 bottom-8 w-px hidden sm:block
                          bg-gradient-to-b from-brand-600 via-brand-500/40 to-green-500/40" aria-hidden />

          <div className="flex flex-col gap-3.5">
            {d.steps.map((s, i) => {
              const mine = s.by === "you";
              return (
                <motion.div key={s.t} variants={fadeUp}
                  className={`relative flex gap-4 sm:gap-5 rounded-2xl p-5 border
                              transition-[border-color,box-shadow] duration-300
                              ${mine
                                ? "bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] border-green-500/30 hover:border-green-500/50"
                                : "bg-[var(--surface)] border-[var(--border)] hover:border-brand-600/40"}`}>
                  <span className={`relative z-10 w-[38px] h-[38px] rounded-2xl flex items-center justify-center flex-shrink-0
                                    border ${mine
                                      ? "bg-green-500/12 border-green-500/40 text-green-400"
                                      : "bg-brand-600/12 border-brand-600/40 text-brand-400"}`}>
                    {mine ? <Hand size={16} /> : <Zap size={16} />}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider
                                        ${mine
                                          ? "bg-green-500/12 border border-green-500/35 text-green-400"
                                          : "bg-brand-600/12 border border-brand-600/35 text-brand-300"}`}>
                        {mine ? d.byYou : d.bySystem}
                      </span>
                      <h3 className="text-[15px] font-extrabold text-[var(--text)] leading-tight">{s.t}</h3>
                    </div>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{s.d}</p>
                  </div>

                  <span className="ml-auto self-start text-[22px] leading-none font-serif italic font-semibold
                                   text-[var(--text-muted)] opacity-25 select-none hidden sm:block" aria-hidden>
                    0{i + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.p variants={fadeUp} {...revealS}
          className="mt-8 flex items-start gap-2.5 justify-center text-center text-[13.5px] font-semibold
                     text-[var(--text)] rounded-2xl px-6 py-4
                     bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] border border-[var(--border)]">
          <Zap size={15} className="mt-0.5 flex-shrink-0 text-brand-400" />
          {d.summary}
        </motion.p>
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
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} />

        <motion.div variants={staggerContainerSlow} {...reveal}
                    className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start pt-4">
          {d.items.map((p, i) => {
            const featured = i === 1;

            const card = (
              <div className={`relative flex flex-col h-full rounded-3xl p-6 sm:p-7 overflow-hidden
                               ${featured ? "bg-[var(--surface)]" : "bg-[var(--surface)] border border-[var(--border)]"}`}>
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
                {featured ? (
                  /* gradijentni rub kroz dvostruku pozadinu, isti pristup kao na naslovnici */
                  <div className="rounded-3xl h-full transition-[box-shadow] duration-300 hover:shadow-2xl hover:shadow-brand-600/20"
                       style={{
                         background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(150deg, #2563EB, #60A5FA, #818CF8) border-box",
                         border: "1.5px solid transparent",
                       }}>
                    {card}
                  </div>
                ) : (
                  <div className="h-full transition-[box-shadow] duration-300 hover:shadow-xl hover:shadow-brand-600/10">
                    {card}
                  </div>
                )}
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
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <SectionHead label={d.label} h1={d.heading1} accent={d.headingAccent} sub={d.body} />
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
    <section className="py-24 lg:py-28 relative">
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
      <Hero c={c} />
      <Problem c={c} />
      <Solution c={c} />
      <Flow c={c} />
      <CaseStudy c={c} />
      <Packages c={c} />
      <Comparison c={c} />
      <RcForm c={c} />
      <Faq c={c} />
    </main>
  );
}
