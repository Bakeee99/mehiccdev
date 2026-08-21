/**
 * components/sections/Hero.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Hero (v2, premium redizajn).
 *
 * Staro: split layout s 3D sferom tačkica (canvas). Novo:
 *   • AURORA pozadina: tri velika, spora, providna gradijentna oblaka u brand
 *     plavoj + fini grid s radijalnom maskom. Nema canvasa, nema biblioteka.
 *   • Centrirani tipografski hero sa snažnim naslovom:
 *       "Vašem biznisu ne treba sajt. Treba mu sistem."
 *   • ISKREN dokazni red umjesto izmišljenih brojki (15+, 100%…):
 *     "Uživo u produkciji" pilule (Maximum, OxyBaric) + PageSpeed 100 značka
 *     koja vodi na sekciju Rezultati.
 *   • Dvije plutajuće glass kartice (samo desktop): notifikacija o novoj
 *     rezervaciji i PageSpeed prsten, vizuelni jezik flagship sekcije.
 *
 * Animacije poštuju reduced-motion. Self-contained (BS/EN), dark/light,
 * bez crtica, mobile-first (kartice sakrivene ispod lg, sve centrirano).
 */

"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, BellRing, Gauge, CarFront } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useCoarsePointer } from "@/lib/useCoarsePointer";
import { useLanguage } from "@/components/ui/LanguageProvider";

type Content = {
  status: string; announceTag: string; announceText: string;
  h1a: string; h1b: string;
  sub: string;
  ctaPrimary: string; ctaSecondary: string;
  liveLabel: string; liveProjects: string[];
  psBadge: string;
  teaserTag: string; teaserText: string; teaserCta: string;
  notifTitle: string; notifBody: string;
  gaugeLabel: string;
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    status: "Dostupni za nove projekte",
    announceTag: "Novo",
    announceText: "Rezervacioni sistem za rent-a-car firme",
    h1a: "Vašem biznisu ne treba sajt.",
    h1b: "Treba mu sistem.",
    sub: "Web aplikacije koje primaju rezervacije, sajtovi koje sami uređujete i marketing koji dovodi upite. Sve iz jedne ruke, iz Mostara za cijeli region.",
    ctaPrimary: "Besplatne konsultacije",
    ctaSecondary: "Šta smo napravili",
    liveLabel: "Uživo u produkciji",
    liveProjects: ["Maximum Rent a Car", "OxyBaric Mostar"],
    psBadge: "Google PageSpeed 100",
    teaserTag: "Novo",
    teaserText: "Rezervacioni sistem za rent-a-car firme",
    teaserCta: "Pogledajte",
    notifTitle: "Nova rezervacija",
    notifBody: "Upit stigao vlasniku za 2 sekunde",
    gaugeLabel: "PageSpeed",
  },
  en: {
    status: "Available for new projects",
    announceTag: "New",
    announceText: "Booking system for car rental companies",
    h1a: "Your business doesn't need a website.",
    h1b: "It needs a system.",
    sub: "Web apps that take bookings, websites you can edit yourself, and marketing that brings inquiries. All from one team, from Mostar for the whole region.",
    ctaPrimary: "Free consultation",
    ctaSecondary: "See what we\u0027ve built",
    liveLabel: "Live in production",
    liveProjects: ["Maximum Rent a Car", "OxyBaric Mostar"],
    psBadge: "Google PageSpeed 100",
    teaserTag: "Novo",
    teaserText: "Rezervacioni sistem za rent-a-car firme",
    teaserCta: "Pogledajte",
    notifTitle: "New booking",
    notifBody: "Inquiry reached the owner in 2 seconds",
    gaugeLabel: "PageSpeed",
  },
};

/* ── Plutajuća kartica: dubinski parallax na miš + mekano lebdenje ──────────
   Dva sloja transformacija:
     • vanjski sloj prati miš kroz spring (opruga: bez trzaja, s inercijom);
       "depth" određuje koliko se kartica pomjera, različit depth po kartici
       daje osjećaj dubine (bliže = više, dalje = manje)
     • unutrašnji sloj sporo lebdi po y osi uz jedva vidljivu rotaciju,
       dugačak period (10s+) i easeInOut daju organski, gladak pokret
   Reduced motion: sve statično.                                             */
function FloatingCard({
  children, className, depth, floatDur, delay, reduce,
}: {
  children: React.ReactNode; className: string;
  depth: number; floatDur: number; delay: number; reduce: boolean;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, mx, my]);

  const px = useSpring(useTransform(mx, [-0.5, 0.5], [depth, -depth]),
                       { stiffness: 42, damping: 19, mass: 0.7 });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [depth * 0.65, -depth * 0.65]),
                       { stiffness: 42, damping: 19, mass: 0.7 });

  return (
    <motion.div aria-hidden style={reduce ? undefined : { x: px, y: py }} className={className}>
      <motion.div
        animate={reduce ? undefined : { y: [0, -9, 0], rotate: [0, 0.9, 0, -0.9, 0] }}
        transition={{ duration: floatDur, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ willChange: "transform" }}
        className="flex items-center gap-3 pl-2.5 pr-4 py-2.5 rounded-2xl
                   border border-brand-500/25 bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] md:bg-[var(--surface)]
                   shadow-[0_18px_40px_-12px_rgba(2,8,30,0.5)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── Aurora oblak ───────────────────────────────────────────────────────────── */
function Aurora({ className, delay, reduce, glow }: { className: string; delay: number; reduce: boolean; glow: string }) {
  return (
    <motion.div
      aria-hidden
      animate={reduce ? undefined : { y: [0, -26, 0], x: [0, 16, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ background: `radial-gradient(closest-side, ${glow}, transparent 72%)` }}
      className={`absolute rounded-full pointer-events-none ${className}`}
    />
  );
}

export function Hero() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;
  const reduce = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  // na touch uređajima dekorativne animacije miruju (performanse skrolanja)
  const calm = reduce || coarse;

  const revealMain = useReveal();

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">

      {/* ── Pozadina: grid + aurora ─────────────────────────────────────── */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.05] pointer-events-none
                      [mask-image:radial-gradient(75%_60%_at_50%_38%,black,transparent)]" aria-hidden />
      {/* Globalno "studijsko svjetlo" iz layout-a sada nosi vrh stranice;
          hero zadržava samo jedan tihi bočni akcenat radi dubine. */}
      <Aurora reduce={calm} delay={5} glow="rgba(99,102,241,0.16)"
              className="w-[460px] h-[460px] top-1/3 -right-44" />
      {/* horizontalni svjetlosni snop ispod navbara */}
      <div className="absolute top-24 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" aria-hidden />

      {/* ── Sadržaj ─────────────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        {...revealMain}
        className="relative flex-1 flex flex-col items-center justify-center text-center
                   max-w-4xl mx-auto px-6 pt-32 pb-16"
      >
        {/* status + eyebrow */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 mb-7">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
                           text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
            {d.status}
          </span>
          {/* Mamac za rent-a-car stranicu: pilula s natpisom "Novo", tekstom i
             strelicom. Preko nje s lijeva na desno prelazi tanki odsjaj, pa
             se primijeti bez treptanja i vike. Animira se samo pomak. */}
          <a
            href="/rjesenja/rent-a-car"
            className="group relative inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full overflow-hidden
                       border border-brand-600/35 bg-brand-600/10
                       transition-[border-color,transform] duration-300
                       hover:border-brand-500/60 hover:-translate-y-0.5"
          >
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { x: ["-120%", "220%"] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 skew-x-[-20deg] pointer-events-none
                         bg-gradient-to-r from-transparent via-white/12 to-transparent"
            />
            <span className="relative px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              {d.announceTag}
            </span>
            <span className="relative text-xs sm:text-[13px] font-semibold text-brand-200">
              {d.announceText}
            </span>
            <ArrowRight size={13} className="relative text-brand-300 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* naslov */}
        <motion.h1 variants={fadeUp}
          className="text-[40px] leading-[1.06] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text)]">
          {d.h1a}
          <br />
          <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.h1b}</span>
        </motion.h1>

        {/* podnaslov */}
        <motion.p variants={fadeUp}
          className="mt-6 max-w-2xl text-[15.5px] sm:text-lg text-[var(--text-muted)] leading-relaxed">
          {d.sub}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <a href="#kontakt"
             className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl
                        bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[15px] font-bold
                        shadow-xl shadow-brand-600/30
                        transition-all duration-300 hover:shadow-2xl hover:shadow-brand-600/45 hover:-translate-y-0.5">
            {d.ctaPrimary} <ArrowRight size={16} />
          </a>
          <a href="#portfolio"
             className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl
                        border border-[var(--border)] text-[15px] font-bold text-[var(--text)]
                       
                        transition-all duration-300 hover:border-brand-600/50 hover:bg-brand-600/5 hover:-translate-y-0.5">
            {d.ctaSecondary}
          </a>
        </motion.div>

        {/* Mamac za rent-a-car stranicu: pilula s gradijentnim rubom i
           svjetlosnim prelivom koji prelazi preko nje. Namjerno stoji odmah
           ispod dugmadi, jer je to prvo mjesto gdje oko traži "šta dalje". */}
        <motion.div variants={fadeUp} className="mt-7">
          <a href="/rjesenja/rent-a-car"
             className="group relative inline-flex items-center gap-3 pl-2 pr-4 py-2 rounded-full overflow-hidden
                        transition-transform duration-300 hover:-translate-y-0.5"
             style={{
               background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(120deg, #2563EB, #60A5FA, #818CF8) border-box",
               border: "1.5px solid transparent",
             }}>
            {/* preliv svjetla koji putuje preko pilule */}
            {!calm && (
              <motion.span aria-hidden
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 pointer-events-none
                           bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            )}
            <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                             bg-gradient-to-r from-brand-600 to-brand-500 text-white
                             text-[10px] font-bold uppercase tracking-wider">
              <CarFront size={11} /> {d.teaserTag}
            </span>
            <span className="relative text-[13px] font-semibold text-[var(--text)]">{d.teaserText}</span>
            <span className="relative inline-flex items-center gap-1 text-[13px] font-bold text-brand-400
                             transition-transform duration-300 group-hover:translate-x-0.5">
              {d.teaserCta} <ArrowRight size={13} />
            </span>
          </a>
        </motion.div>

        {/* iskren dokazni red (umjesto izmišljenih brojki) */}
        <motion.div variants={fadeUp} className="mt-12 flex flex-col items-center gap-3">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {d.liveLabel}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {d.liveProjects.map((p) => (
              <a key={p} href="#portfolio"
                 className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
                            text-[var(--text)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] border border-[var(--border)]
                            transition-[border-color,transform] duration-300 hover:border-brand-600/40 hover:-translate-y-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
                {p}
              </a>
            ))}
            <a href="#rezultati"
               className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold
                          text-brand-700 dark:text-brand-300 bg-brand-600/10 border border-brand-600/30
                          transition-[border-color,transform] duration-300 hover:border-brand-600/50 hover:-translate-y-0.5">
              ⚡ {d.psBadge} <ArrowUpRight size={11} />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Plutajuće kartice (samo veliki ekrani) ──────────────────────── */}
      <FloatingCard reduce={calm} depth={22} floatDur={11} delay={0}
                    className="hidden lg:block absolute left-[6%] top-[34%]">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center
                         bg-green-500/12 border border-green-500/35 text-green-500">
          <BellRing size={15} />
        </span>
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 leading-tight">
            {d.notifTitle}
          </span>
          <span className="block text-[11.5px] font-medium text-[var(--text-muted)] leading-tight">{d.notifBody}</span>
        </span>
      </FloatingCard>

      <FloatingCard reduce={calm} depth={14} floatDur={13} delay={3.5}
                    className="hidden lg:block absolute right-[7%] top-[56%]">
        <span className="relative w-10 h-10 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="3.5" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 16} strokeDashoffset="0" />
          </svg>
          <span className="absolute text-[11px] font-extrabold text-[var(--text)]">100</span>
        </span>
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 leading-tight">
            <Gauge size={10} className="inline mr-1" />{d.gaugeLabel}
          </span>
          <span className="block text-[11.5px] font-medium text-[var(--text-muted)] leading-tight">Google</span>
        </span>
      </FloatingCard>

      {/* scroll indikator */}
      <div className="relative pb-7 flex justify-center">
        <motion.a
          href="#usluge"
          aria-label="Scroll"
          animate={calm ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--text-muted)] hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ChevronDown size={22} />
        </motion.a>
      </div>
    </section>
  );
}
