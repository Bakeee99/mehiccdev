/**
 * components/rjesenja/RcHowItWorks.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Kako to radi": interaktivni prikaz cijelog toka rezervacije u četiri stanja.
 *
 * RASPORED
 *   Lijevo  koraci s opisima; aktivni korak je istaknut i ima traku napretka
 *           koja pokazuje kada slijedi prelazak. Klik na korak preuzima
 *           kontrolu i zaustavlja automatsko vrtenje.
 *   Desno   mockup koji se mijenja po stanju:
 *             1. sajt s kalendarom, kursor bira datume i klikne dugme
 *             2. isti sajk zatamnjen, uklize obavijest na email i na Telegram
 *             3. admin panel, kursor klikne "Odobri", red postane zelen
 *             4. telefon, spusti se potvrda s kvačicom
 *
 * PROJEKTNA PRAVILA
 *   • bez novih biblioteka: samo framer-motion, Tailwind i lucide-react
 *   • sav tekst iz rentACarCopy.ts, oba jezika, ništa nije zakucano
 *   • animira se samo transform i opacity, nigdje blur (mobilna dijeta)
 *   • useReveal za ulaznu animaciju, useCoarsePointer za touch uređaje
 *   • na touchu i uz reduced-motion nema automatskog vrtenja ni kursora,
 *     ali korisnik i dalje može tapnuti korak i vidjeti svako stanje
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, Send, Check, Car, CalendarDays, MousePointer2 } from "lucide-react";
import { staggerContainer, fadeUp, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useCoarsePointer } from "@/lib/useCoarsePointer";
import { COPY } from "@/components/rjesenja/rentACarCopy";

const STEP_MS  = 4200;   // koliko traje jedan korak dok se vrti samo
const PAUSE_MS = 9000;   // koliko duže stoji korak koji je posjetilac kliknuo
type Ui = typeof COPY.bs.howItWorks.ui;

/* ── Kursor koji putuje po mockupu ─────────────────────────────────────────── */
function Cursor({ path, show }: { path: { x: number; y: number }[]; show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      aria-hidden
      initial={{ x: path[0].x, y: path[0].y, opacity: 0 }}
      animate={{ x: path.map((p) => p.x), y: path.map((p) => p.y), opacity: [0, 1, 1, 1] }}
      transition={{ duration: 2.2, times: [0, 0.25, 0.7, 1], ease: "easeInOut" }}
      className="absolute left-0 top-0 z-30 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
    >
      <MousePointer2 size={18} className="fill-white" />
    </motion.span>
  );
}

/* ── Okvir prozora, zajednički za stanja 1 do 3 ───────────────────────────── */
function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#080D1E] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[.07]">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] text-white/35 tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ── Stanje 1: gost bira datume i rezerviše ───────────────────────────────── */
function StateBooking({ ui, animate, cursor = false }: { ui: Ui; animate: boolean; cursor?: boolean }) {
  return (
    <div className="relative">
      <Window title={ui.site}>
        <div className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200/60 mb-1">{ui.calendar}</p>
          <p className="text-[11px] text-white/35 mb-3">{ui.july}</p>

          <div className="grid grid-cols-7 gap-1.5 mb-5" aria-hidden>
            {Array.from({ length: 21 }).map((_, i) => {
              const inRange = i >= 9 && i <= 12;
              return (
                <motion.span
                  key={i}
                  initial={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  animate={{ backgroundColor: inRange ? "rgba(37,99,235,0.9)" : "rgba(255,255,255,0.05)" }}
                  transition={{ duration: 0.3, delay: animate && inRange ? 0.9 + (i - 9) * 0.12 : 0 }}
                  className="h-7 rounded-md flex items-center justify-center text-[10px] font-semibold text-white/70"
                >
                  {i + 1}
                </motion.span>
              );
            })}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-3.5 py-2.5 mb-4">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/40 to-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <Car size={14} className="text-blue-200" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-bold text-white/90 leading-tight">{ui.car}</span>
              <span className="block text-[10.5px] text-white/40 leading-tight">{ui.price}</span>
            </span>
          </div>

          <motion.div
            animate={animate ? { scale: [1, 1, 0.96, 1] } : {}}
            transition={{ duration: 2.4, times: [0, 0.78, 0.85, 1] }}
            className="h-10 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 flex items-center justify-center
                       text-[12.5px] font-bold text-white shadow-lg shadow-brand-600/30"
          >
            {ui.bookBtn}
          </motion.div>
        </div>
      </Window>

      <Cursor show={cursor} path={[{ x: 40, y: 200 }, { x: 120, y: 120 }, { x: 150, y: 300 }, { x: 150, y: 300 }]} />
    </div>
  );
}

/* ── Stanje 2: obavijesti vlasniku ────────────────────────────────────────── */
function StateAlerts({ ui, animate }: { ui: Ui; animate: boolean }) {
  return (
    <div className="relative">
      <div className="opacity-40 pointer-events-none">
        <StateBooking ui={ui} animate={false} />
      </div>

      <motion.div
        initial={animate ? { opacity: 0, x: 30, y: -10 } : false}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute top-6 -right-2 sm:-right-5 w-[250px] max-w-[calc(100%-1rem)] rounded-2xl p-3.5
                   border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)]
                   shadow-[0_20px_45px_-12px_rgba(2,8,30,0.7)]"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand-600/15 border border-brand-600/35 text-brand-300">
            <Mail size={13} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11.5px] font-bold text-[var(--text)] leading-tight">{ui.emailTitle}</span>
            <span className="block text-[10px] text-[var(--text-muted)] leading-tight truncate">{ui.emailFrom}</span>
          </span>
          <span className="ml-auto text-[9.5px] text-[var(--text-muted)]">{ui.now}</span>
        </div>
        <p className="text-[11.5px] text-[var(--text-muted)]">{ui.emailBody}</p>
      </motion.div>

      <motion.div
        initial={animate ? { opacity: 0, x: 30, y: 10 } : false}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.45, delay: 0.5, ease: "easeOut" }}
        className="absolute -bottom-4 -left-2 sm:-left-5 w-[236px] max-w-[calc(100%-1rem)] rounded-2xl p-3.5
                   border border-[#229ED9]/35 bg-[color-mix(in_srgb,var(--surface)_95%,transparent)]
                   shadow-[0_20px_45px_-12px_rgba(2,8,30,0.7)]"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#229ED9]/15 border border-[#229ED9]/40 text-[#5FC7F0]">
            <Send size={13} />
          </span>
          <span className="text-[11px] font-bold text-[var(--text)]">{ui.tgApp}</span>
          <span className="ml-auto text-[9.5px] text-[var(--text-muted)]">{ui.now}</span>
        </div>
        <p className="text-[11.5px] text-[var(--text)] leading-snug">🔔 {ui.tgBody}</p>
      </motion.div>
    </div>
  );
}

/* ── Stanje 3: vlasnik odobrava u panelu ──────────────────────────────────── */
function StateApprove({ ui, animate, cursor = false }: { ui: Ui; animate: boolean; cursor?: boolean }) {
  const [done, setDone] = useState(!animate);

  useEffect(() => {
    if (!animate) { setDone(true); return; }
    setDone(false);
    const t = setTimeout(() => setDone(true), 2300);
    return () => clearTimeout(t);
  }, [animate]);

  return (
    <div className="relative">
      <Window title={ui.panel}>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={13} className="text-blue-300/70" />
            <span className="text-[11px] font-semibold text-white/50">{ui.panel}</span>
          </div>

          {/* red rezervacije */}
          <div className="rounded-xl border border-white/10 bg-white/[.03] p-3.5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/40 to-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <Car size={15} className="text-blue-200" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-bold text-white/90 leading-tight">{ui.car}</span>
                <span className="block text-[10.5px] text-white/40 leading-tight">{ui.guest} · {ui.dates}</span>
              </span>
              <motion.span
                animate={{ opacity: 1 }}
                className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap
                            ${done ? "text-green-400 bg-green-500/10 border-green-500/30"
                                   : "text-amber-400 bg-amber-500/10 border-amber-500/30"}`}
              >
                {done ? ui.approved : ui.pending}
              </motion.span>
            </div>

            <motion.div
              animate={animate ? { scale: [1, 1, 0.96, 1] } : {}}
              transition={{ duration: 2.4, times: [0, 0.85, 0.92, 1] }}
              className={`h-9 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-bold text-white
                          ${done ? "bg-green-600" : "bg-gradient-to-r from-brand-600 to-brand-500 shadow-lg shadow-brand-600/25"}`}
            >
              {done ? <><Check size={13} strokeWidth={3} /> {ui.approved}</> : ui.approveBtn}
            </motion.div>
          </div>

          {/* dva prigušena reda, da panel izgleda kao pravi */}
          <div className="mt-3 space-y-2" aria-hidden>
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/[.06] px-3 py-2.5 opacity-40">
                <span className="w-2 h-2 rounded-full bg-green-500/70" />
                <span className="h-1.5 w-24 rounded bg-white/15" />
                <span className="ml-auto h-1.5 w-10 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Cursor show={cursor} path={[{ x: 60, y: 60 }, { x: 150, y: 150 }, { x: 165, y: 232 }, { x: 165, y: 232 }]} />
    </div>
  );
}

/* ── Stanje 4: gost dobija potvrdu na telefon ─────────────────────────────── */
function StateConfirmed({ ui, animate }: { ui: Ui; animate: boolean }) {
  return (
    <div className="flex justify-center">
      <div className="relative w-[236px] rounded-[30px] border border-white/12 bg-[#080D1E] p-3 pt-6
                      shadow-[0_44px_90px_-30px_rgba(37,99,235,0.45)]">
        <span aria-hidden className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-white/15" />

        <div className="rounded-[22px] bg-gradient-to-b from-[#0B1226] to-[#070B18] h-[330px] p-3 overflow-hidden">
          {/* obavijest koja se spusti */}
          <motion.div
            initial={animate ? { y: -70, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: animate ? 0.5 : 0 }}
            className="rounded-2xl border border-green-500/35 bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-500/15 border border-green-500/40 text-green-400">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="text-[11.5px] font-bold text-[var(--text)] leading-tight">{ui.phoneTitle}</span>
              <span className="ml-auto text-[9.5px] text-[var(--text-muted)]">{ui.now}</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-snug">{ui.phoneBody}</p>
          </motion.div>

          {/* prigušen sadržaj ekrana ispod */}
          <div className="mt-4 space-y-2.5 opacity-25" aria-hidden>
            <div className="h-2 w-2/3 rounded bg-white/20" />
            <div className="h-2 w-1/2 rounded bg-white/15" />
            <div className="h-20 rounded-xl bg-white/[.05]" />
            <div className="h-2 w-3/5 rounded bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sekcija ──────────────────────────────────────────────────────────────── */
export function RcHowItWorks({ c }: { c: typeof COPY.bs }) {
  const d = c.howItWorks;
  const reduce = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();

  /* Dvije različite stvari, ranije su bile spojene u jedno:
       reduce  korisnik je ISKLJUČIO animacije → sve stoji
       coarse  touch uređaj → animacije rade (lagane su, samo pomak i
               prozirnost), ali se gasi lažni kursor, jer na telefonu
               nema kursora pa nema ni smisla.                          */
  const still  = reduce;            // potpuno statično
  const cursor = !reduce && !coarse; // pokazivač miša samo na desktopu

  const revealHead = useReveal();
  const revealBody = useReveal();

  const [step, setStep]   = useState(0);
  const [paused, setPaused] = useState(false);

  /* Kada posjetilac klikne korak, prikaz stane na njemu duže (PAUSE_MS), a
     zatim se automatsko vrtenje samo nastavi. Tako korisnik ima vremena da
     pogleda što ga zanima, a sekcija nikad ne ostane statična.
     Ključ "step" u zavisnostima resetuje odbrojavanje pri svakoj promjeni. */
  useEffect(() => {
    if (still) return;
    const wait = paused ? PAUSE_MS : STEP_MS;
    const t = setTimeout(() => {
      setPaused(false);
      setStep((s) => (s + 1) % 4);
    }, wait);
    return () => clearTimeout(t);
  }, [step, paused, still]);

  const pick = (i: number) => { setPaused(true); setStep(i); };
  const animate = !still;

  return (
    <section id="kako-radi" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* header */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-14">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full
                             border border-brand-600/30 bg-brand-600/10
                             text-brand-300 text-xs font-semibold tracking-wider uppercase">
              <span className="font-serif italic text-[13px] text-brand-400 leading-none">03</span>
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

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-14 items-center">

          {/* ── lijevo: koraci ── */}
          <motion.div variants={staggerContainer} {...revealBody} className="flex flex-col gap-3"
                      role="tablist" aria-label={d.label}>
            {d.steps.map((s, i) => {
              const on = step === i;
              return (
                <motion.button
                  key={s.t}
                  variants={fadeUp}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  className={`relative overflow-hidden text-left rounded-2xl p-5 border
                              transition-[border-color,background-color] duration-300
                              ${on ? "bg-brand-600/[.07] border-brand-600/40"
                                   : "bg-[var(--surface)] border-[var(--border)] hover:border-brand-600/30"}`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-extrabold
                                      transition-colors duration-300
                                      ${on ? "bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-600/30"
                                           : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]"}`}>
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[15px] font-extrabold leading-tight
                                        ${on ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                        {s.t}
                      </span>
                      {on && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="block text-[13px] text-[var(--text-muted)] leading-relaxed mt-1.5"
                        >
                          {s.d}
                        </motion.span>
                      )}
                    </span>
                  </span>

                  {/* traka napretka dok se vrti samo */}
                  {on && !still && (
                    <motion.span
                      key={`p-${step}-${paused ? "long" : "auto"}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: (paused ? PAUSE_MS : STEP_MS) / 1000, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[2.5px] w-full origin-left bg-brand-500/60"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── desno: mockup ── */}
          <motion.div variants={slideInRight} {...revealBody} className="relative lg:pl-2">
            <div aria-hidden className="absolute -inset-8 rounded-[40px] pointer-events-none
                                        bg-[radial-gradient(closest-side,rgba(37,99,235,0.14),transparent_75%)]" />
            <div className="relative min-h-[400px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full"
                >
                  {step === 0 && <StateBooking   ui={d.ui} animate={animate} cursor={cursor} />}
                  {step === 1 && <StateAlerts    ui={d.ui} animate={animate} />}
                  {step === 2 && <StateApprove   ui={d.ui} animate={animate} cursor={cursor} />}
                  {step === 3 && <StateConfirmed ui={d.ui} animate={animate} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
