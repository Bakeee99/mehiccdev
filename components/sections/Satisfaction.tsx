/**
 * components/sections/Satisfaction.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Client Satisfaction" section featuring custom-built animated data visuals:
 *  • Animated radial percentage gauges (SVG circles) for key metrics
 *  • Animated growth bar chart for client online-presence growth
 *
 * Built with pure SVG + Framer Motion (no chart library = no extra deps,
 * no build issues). Everything animates on scroll into view.
 */

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ── Animated radial gauge ───────────────────────────────────────────────────────
function RadialGauge({ value, label, delay }: { value: number; label: string; delay: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div ref={ref} variants={scaleIn} className="flex flex-col items-center text-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference - (value / 100) * circumference } : {}}
            transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center number (counts up) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-extrabold text-[var(--text)]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.3 }}
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--text-muted)] max-w-[140px]">{label}</p>
    </motion.div>
  );
}

// ── Animated growth bar chart ─────────────────────────────────────────────────
function GrowthChart({ months }: { months: readonly string[] }) {
  // Relative growth heights (% of max) — illustrative upward trend
  const data = [25, 38, 52, 64, 80, 100];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="flex items-end justify-between gap-2 sm:gap-4 h-56 px-2">
      {data.map((height, i) => (
        <div key={i} className="flex flex-col items-center justify-end flex-1 h-full">
          <motion.div
            className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 relative group"
            initial={{ height: 0 }}
            animate={inView ? { height: `${height}%` } : {}}
            transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tooltip on hover */}
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold
                             text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100
                             transition-opacity whitespace-nowrap">
              +{height}%
            </span>
          </motion.div>
          <span className="mt-2 text-[10px] sm:text-xs text-[var(--text-muted)] text-center">
            {months[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Satisfaction() {
  const { t } = useLanguage();

  return (
    <section className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -left-64 top-1/3 w-96 h-96 rounded-full bg-brand-600/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {t.satisfaction.label}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {t.satisfaction.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {t.satisfaction.subtitle}
          </motion.p>
        </motion.div>

        {/* Radial gauges */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {t.satisfaction.metrics.map((m, i) => (
            <RadialGauge key={m.label} value={m.value} label={m.label} delay={i * 0.15} />
          ))}
        </motion.div>

        {/* Growth chart card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="p-8 lg:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[var(--text)] mb-1">{t.satisfaction.growthTitle}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t.satisfaction.growthSub}</p>
          </div>
          <GrowthChart months={t.satisfaction.months} />
        </motion.div>
      </div>
    </section>
  );
}
