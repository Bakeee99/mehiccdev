/**
 * components/rjesenja/RcCompare.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Razlika": jedna sekcija umjesto dvije (Problem + Rješenje).
 *
 * Prekidač s dvije strane, "Bez sistema" i "Sa sistemom". Za svaku stranu
 * prikazuju se isti elementi, pa je poređenje doslovno jedan naspram jednog:
 *   • četiri koraka toka rezervacije
 *   • četiri brojke (vrijeme po rezervaciji, brzina odgovora gostu, koliko
 *     sati dnevno primate upite, mogućnost duplog termina)
 *   • traka koja vizuelno pokazuje koliko vašeg vremena odlazi
 *
 * Kad je uključena strana "Sa sistemom", ispod se pojavljuju i mogućnosti
 * sistema, pa je time pokrivena i stara sekcija "Šta sistem radi".
 *
 * Prekidač se sam prebacuje svakih nekoliko sekundi dok posjetilac ne klikne;
 * poslije klika strana stoji duže, pa se vrtenje nastavi (isti obrazac kao u
 * sekciji "Kako to radi").
 *
 * Pravila projekta: bez novih biblioteka, sav tekst iz rječnika, samo pomak i
 * prozirnost, nigdje zamućenja, useReveal za ulaz.
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, Clock, Zap } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { COPY } from "@/components/rjesenja/rentACarCopy";

const AUTO_MS  = 7000;   // koliko strana stoji dok se mijenja sama
const PAUSE_MS = 14000;  // koliko stoji nakon što je posjetilac klikne

export function RcCompare({ c }: { c: typeof COPY.bs }) {
  const d = c.compare;
  const reduce = useReducedMotion() ?? false;

  const revealHead = useReveal();
  const revealBody = useReveal();

  const [withSystem, setWithSystem] = useState(false);
  const [paused, setPaused]         = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      setPaused(false);
      setWithSystem((v) => !v);
    }, paused ? PAUSE_MS : AUTO_MS);
    return () => clearTimeout(t);
  }, [withSystem, paused, reduce]);

  const pick = (v: boolean) => { setPaused(true); setWithSystem(v); };

  const side = withSystem ? d.neu : d.old;
  const tone = withSystem
    ? { text: "text-brand-300", border: "border-brand-600/35", bg: "bg-brand-600/10", dot: "bg-brand-500" }
    : { text: "text-red-400",   border: "border-red-500/30",   bg: "bg-red-500/10",   dot: "bg-red-500" };

  return (
    <section id="razlika" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* header */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-10">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full
                             border border-brand-600/30 bg-brand-600/10
                             text-brand-300 text-xs font-semibold tracking-wider uppercase">
              <span className="font-serif italic text-[13px] text-brand-400 leading-none">01</span>
              {d.label}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {d.heading1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-[var(--text-muted)] text-base sm:text-lg leading-relaxed mt-4">
            {d.sub}
          </motion.p>
        </motion.div>

        {/* prekidač */}
        <motion.div variants={fadeUp} {...revealBody} className="flex justify-center mb-10">
          <div className="relative inline-flex p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
               role="tablist" aria-label={d.label}>
            <motion.span
              aria-hidden
              layout
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className={`absolute top-1 bottom-1 rounded-xl border
                          ${withSystem ? "bg-brand-600/15 border-brand-600/40" : "bg-red-500/12 border-red-500/35"}`}
              style={{ left: withSystem ? "50%" : "0.25rem", right: withSystem ? "0.25rem" : "50%" }}
            />
            {[false, true].map((v) => (
              <button
                key={String(v)}
                role="tab"
                aria-selected={withSystem === v}
                onClick={() => pick(v)}
                className={`relative z-10 px-5 sm:px-7 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold
                            transition-colors duration-300
                            ${withSystem === v ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
              >
                {v ? d.tabNew : d.tabOld}
              </button>
            ))}
          </div>
        </motion.div>

        {/* sadržaj strane */}
        <AnimatePresence mode="wait">
          <motion.div
            key={String(withSystem)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="grid lg:grid-cols-[1fr_1fr] gap-5 lg:gap-6">

              {/* koraci */}
              <div className={`rounded-3xl border p-6 sm:p-7 bg-[var(--surface)] ${tone.border}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-5 ${tone.text}`}>
                  {withSystem ? d.stepsTitleNew : d.stepsTitleOld}
                </p>
                <div className="flex flex-col gap-4">
                  {side.steps.map((s, i) => (
                    <motion.div
                      key={s.t}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.08 * i }}
                      className="flex gap-3.5"
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border
                                        ${tone.bg} ${tone.border} ${tone.text}`}>
                        {withSystem ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-bold text-[var(--text)] leading-tight">{s.t}</span>
                        <span className="block text-[12.5px] text-[var(--text-muted)] leading-relaxed mt-1">{s.d}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* brojke + traka */}
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3.5">
                  {side.stats.map((st, i) => (
                    <motion.div
                      key={st.l}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.06 * i }}
                      className={`rounded-2xl border p-5 bg-[var(--surface)] ${tone.border}`}
                    >
                      <p className={`text-[22px] sm:text-2xl font-extrabold tracking-tight ${tone.text}`}>{st.v}</p>
                      <p className="text-[11.5px] text-[var(--text-muted)] leading-snug mt-1.5">{st.l}</p>
                    </motion.div>
                  ))}
                </div>

                {/* traka: koliko vašeg vremena odlazi */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                    <Clock size={12} /> {d.barLabel}
                  </p>
                  <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: withSystem ? "6%" : "100%" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`h-full rounded-full ${withSystem
                        ? "bg-gradient-to-r from-brand-600 to-brand-400"
                        : "bg-gradient-to-r from-red-500/80 to-orange-400/80"}`}
                    />
                  </div>
                  <p className={`text-[12.5px] font-bold mt-2.5 ${tone.text}`}>{side.stats[0].v}</p>
                </div>
              </div>
            </div>

            {/* mogućnosti sistema, samo na desnoj strani */}
            {withSystem && (
              <motion.div variants={staggerContainerSlow} initial="hidden" animate="visible"
                          className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-300 mb-4">
                  <Zap size={12} /> {c.solution.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {c.solution.items.map((it) => (
                    <motion.span
                      key={it.t}
                      variants={fadeUp}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold
                                 text-[var(--text)] bg-[var(--bg)] border border-[var(--border)]"
                    >
                      <Check size={11} strokeWidth={3} className="text-brand-400" /> {it.t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.p variants={fadeUp} {...revealBody}
          className="text-center text-[11.5px] text-[var(--text-muted)] mt-6 max-w-2xl mx-auto">
          {d.note}
        </motion.p>
      </div>
    </section>
  );
}
