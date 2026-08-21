/**
 * components/sections/RentACarPromo.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Sekcija na naslovnici koja vodi na rent-a-car stranicu.
 *
 * Zadatak sekcije je jedan: da posjetilac shvati da iza ovoga stoji cijeli
 * sistem (ne "još jedan sajt"), da vidi da cijene postoje, i da klikne.
 *
 * Lijevo: naslov, tri koristi i dva dugmeta, uz pilulu s cijenom.
 * Desno: prikaz koji se sam vrti kroz tri kadra i pokazuje kako sistem radi:
 *   kalendar dostupnosti → obavijest vlasniku → potvrda gostu.
 * Cijela kartica je klikabilna, a kadar se mijenja i klikom na tačkice.
 *
 * Pravila: bez novih biblioteka, tekst na oba jezika u ovom fajlu (kao i
 * ostale sekcije naslovnice), animira se samo pomak i prozirnost, useReveal
 * za ulaz, a uz "reduced motion" prikaz miruje na prvom kadru.
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Car, BellRing, CalendarCheck, Clock } from "lucide-react";
import { staggerContainer, fadeUp, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

const FRAME_MS = 3200;
const HREF = "/rjesenja/rent-a-car";

const T = {
  bs: {
    label: "Naš sistem za rent-a-car",
    h1: "Cijeli sistem za iznajmljivanje vozila,",
    accent: "na jednoj stranici",
    sub: "Sajt, kalendar dostupnosti i admin panel rade zajedno. Gost rezerviše sam, vi potvrđujete jednim klikom, a vozilo se zaključa za te datume.",
    points: [
      "Gost vidi samo stvarno slobodna vozila",
      "Obavijest vam stiže odmah, i noću",
      "Dupla rezervacija nije moguća",
    ],
    priceTag: "Paketi od 1.500 KM",
    cta: "Pogledajte sistem i cijene",
    ctaSub: "Cijene, paketi i primjer iz prakse",
    frames: [
      { title: "Kalendar dostupnosti", body: "10 do 13. jula · VW Golf 8", tag: "Gost bira" },
      { title: "Novi upit", body: "Stigao vam je na email i telefon", tag: "Odmah" },
      { title: "Rezervacija potvrđena", body: "Vozilo zaključano za te datume", tag: "Gotovo" },
    ],
  },
  en: {
    label: "Our car rental system",
    h1: "A complete car rental system,",
    accent: "on one page",
    sub: "The website, availability calendar and admin panel work together. The guest books on their own, you confirm in one click, and the vehicle locks for those dates.",
    points: [
      "Guests only see genuinely available cars",
      "You get the alert instantly, even at night",
      "Double bookings cannot happen",
    ],
    priceTag: "Packages from €770",
    cta: "See the system and pricing",
    ctaSub: "Pricing, packages and a real example",
    frames: [
      { title: "Availability calendar", body: "July 10 to 13 · VW Golf 8", tag: "Guest picks" },
      { title: "New request", body: "Delivered to your email and phone", tag: "Instantly" },
      { title: "Booking confirmed", body: "Vehicle locked for those dates", tag: "Done" },
    ],
  },
} as const;

const FRAME_ICONS = [CalendarCheck, BellRing, Check];

export function RentACarPromo() {
  const { lang } = useLanguage();
  const d = (T[(lang as "bs" | "en")] ?? T.bs) as typeof T.bs;
  const reduce = useReducedMotion() ?? false;

  const revealL = useReveal();
  const revealR = useReveal();

  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % 3), FRAME_MS);
    return () => clearInterval(t);
  }, [reduce]);

  const Icon = FRAME_ICONS[frame];
  const f = d.frames[frame];

  return (
    <section id="rent-a-car" className="py-24 lg:py-28 relative overflow-hidden scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className="relative rounded-[32px] overflow-hidden"
          style={{
            background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #2563EB, #60A5FA, #818CF8) border-box",
            border: "1.5px solid transparent",
          }}
        >
          <span aria-hidden className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none
                                       bg-[radial-gradient(closest-side,rgba(37,99,235,0.18),transparent_72%)]" />

          <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center p-7 sm:p-10 lg:p-12">

            {/* ── lijevo ── */}
            <motion.div variants={staggerContainer} {...revealL}>
              <motion.span variants={fadeUp}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5
                           border border-brand-600/35 bg-brand-600/10 text-brand-300
                           text-[11px] font-bold uppercase tracking-wider">
                <Car size={12} /> {d.label}
              </motion.span>

              <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight leading-[1.12]">
                {d.h1}{" "}
                <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.accent}</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-[var(--text-muted)] leading-relaxed mt-4 mb-6 max-w-lg">
                {d.sub}
              </motion.p>

              <motion.ul variants={fadeUp} className="flex flex-col gap-2.5 mb-7">
                {d.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-[var(--text)] leading-snug">
                    <span className="mt-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0
                                     bg-brand-600/12 border border-brand-600/30 text-brand-400">
                      <Check size={10} strokeWidth={3.5} />
                    </span>
                    {p}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a href={HREF}
                   className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
                              bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[15px] font-bold
                              shadow-xl shadow-brand-600/30
                              transition-[box-shadow,transform] duration-300 hover:shadow-2xl hover:shadow-brand-600/45 hover:-translate-y-0.5">
                  {d.cta}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
                <span className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[12.5px] font-bold
                                 text-brand-200 bg-brand-600/10 border border-brand-600/30">
                  {d.priceTag}
                </span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-[12px] text-[var(--text-muted)] mt-3">
                {d.ctaSub}
              </motion.p>
            </motion.div>

            {/* ── desno: prikaz u tri kadra ── */}
            <motion.div variants={slideInRight} {...revealR} className="relative">
              <a href={HREF} aria-label={d.cta} className="block group">
                <div className="rounded-2xl border border-brand-500/25 bg-[#080D1E] overflow-hidden
                                shadow-[0_36px_80px_-30px_rgba(37,99,235,0.45)]
                                transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[.07]">
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                  </div>

                  <div className="p-5 sm:p-6 min-h-[220px] flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={frame}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="w-full"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider
                                           text-brand-300 bg-brand-600/15 border border-brand-600/35">
                            {f.tag}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                            <Clock size={10} /> {frame + 1}/3
                          </span>
                        </div>

                        <div className="flex items-start gap-3.5">
                          <span className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border
                                            ${frame === 2
                                              ? "bg-green-500/12 border-green-500/40 text-green-400"
                                              : "bg-brand-600/15 border-brand-600/40 text-brand-300"}`}>
                            <Icon size={19} strokeWidth={frame === 2 ? 3 : 2} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[16px] font-extrabold text-white/90 leading-tight">{f.title}</span>
                            <span className="block text-[13px] text-white/45 leading-relaxed mt-1">{f.body}</span>
                          </span>
                        </div>

                        {/* traka koja prati kadar */}
                        <div className="mt-6 h-1.5 rounded-full bg-white/[.06] overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${((frame + 1) / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </a>

              {/* tačkice za ručni odabir kadra */}
              <div className="flex justify-center gap-2 mt-4">
                {d.frames.map((fr, i) => (
                  <button
                    key={fr.title}
                    type="button"
                    onClick={() => setFrame(i)}
                    aria-label={fr.title}
                    className={`h-1.5 rounded-full transition-all duration-300
                                ${i === frame ? "w-7 bg-brand-500" : "w-2.5 bg-[var(--border)] hover:bg-brand-600/50"}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
