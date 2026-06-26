/**
 * components/sections/Pricing.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Pricing section — fully bilingual (BS/EN) + dark/light theme aware.
 * Two blocks:
 *   1. Web packages (Basic / Standard / Premium) with free-marketing gift banner
 *   2. Marketing add-on packages (continue after the free month)
 *
 * Fully responsive: 3 columns on desktop, stacks to 1 column on mobile.
 * Subtle on-brand background glow. Edit all text/prices in lib/i18n.ts → pricing.
 */

"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Gift, Check, Star, Rocket, Diamond, Megaphone, TrendingUp, Crown, CalendarDays, ArrowRight } from "lucide-react";

// Self-contained bilingual copy for the pricing CTA (no i18n changes needed)
const PRICING_CTA = {
  bs: {
    title: "Niste sigurni koji paket je pravi za vas?",
    sub: "Javite nam šta vam treba — predložimo najbolje rješenje, bez obaveze.",
    btn: "Zatražite besplatnu ponudu",
  },
  en: {
    title: "Not sure which package is right for you?",
    sub: "Tell us what you need — we'll suggest the best solution, no obligation.",
    btn: "Get a free quote",
  },
} as const;

// Computes an approximate per-day cost from a one-time price string,
// amortized over the first year (365 days). Strips currency symbol and
// thousand separators so "€1,499" / "€1.499" both parse to 1499.
function perDayCost(price: string): string {
  const n = parseInt(price.replace(/[^0-9]/g, ""), 10);
  if (!n || isNaN(n)) return "";
  return (n / 365).toFixed(2);
}

// Computes an approximate per-day cost from a MONTHLY price string
// (e.g. maintenance "€25/mo" → ≈ €0.83/day), based on a 30-day month.
function perDayFromMonthly(price: string): string {
  const n = parseInt(price.replace(/[^0-9]/g, ""), 10);
  if (!n || isNaN(n)) return "";
  return (n / 30).toFixed(2);
}
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// Icons per web plan (order matches i18n webPlans)
const WEB_ICONS = [Rocket, Star, Diamond];
// Icons per marketing plan (order matches i18n mktPlans)
const MKT_ICONS = [Megaphone, TrendingUp, Crown];

export function Pricing() {
  const { t, lang } = useLanguage();
  // Keeps sections visible after a language/theme switch (no re-hide on re-render)
  const [seen, setSeen] = useState(false);
  const p = t.pricing;
  const cta = PRICING_CTA[lang as "bs" | "en"] || PRICING_CTA.bs;

  return (
    <section id="cjenovnik" className="py-28 lg:py-36 relative overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      {/* Subtle background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full
                      bg-brand-600/8 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* ════ WEB PACKAGES ════ */}
        <motion.div
          variants={staggerContainer}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {p.label}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {p.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {p.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {p.webPlans.map((plan, i) => {
            const Icon = WEB_ICONS[i] ?? Star;
            const popular = i === 1;
            return (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`relative flex flex-col p-7 rounded-3xl bg-[var(--surface)]/80 backdrop-blur-sm
                            transition-all duration-300 hover:-translate-y-2
                            ${popular
                              ? "border-2 border-brand-600 shadow-2xl shadow-brand-600/20"
                              : "border border-[var(--border)] hover:shadow-xl hover:shadow-brand-600/10"}`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                      <Star size={11} fill="currentColor" /> {p.popular}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1">
                  <Icon size={20} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="text-lg font-bold text-[var(--text)]">{plan.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-5 min-h-[40px]">{plan.tag}</p>

                <div className="mb-1">
                  <span className="text-4xl font-extrabold text-[var(--text)]">{plan.price}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3">{p.once}</p>

                {/* Daily-cost framing — makes the FULL price feel approachable */}
                <div className="inline-flex items-center gap-2 self-start mb-5 px-3 py-1.5 rounded-full
                                bg-brand-600/10 dark:bg-brand-500/10 border border-brand-600/15">
                  <CalendarDays size={13} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
                  <span className="text-xs text-[var(--text)] font-semibold">
                    {p.dailyApprox} €{perDayCost(plan.price)}
                    <span className="text-[var(--text-muted)] font-normal">{p.perDay}</span>
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">· {p.dailyNote}</span>
                </div>

                {/* Free marketing banner */}
                <div className="rounded-xl bg-green-500/10 p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Gift size={13} className="text-green-600 dark:text-green-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-green-600 dark:text-green-400">{p.gratis}</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 leading-snug">
                    {p.inclFreePre} <strong>{plan.gift}</strong> {p.inclFreePost}
                  </p>
                </div>

                {/* Optional maintenance — with daily breakdown for easy comparison */}
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 mb-5">
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {p.maintLabel} <strong className="text-[var(--text)]">{plan.maint}</strong>
                    <span className="text-[var(--text-muted)]"> · {p.dailyApprox} €{perDayFromMonthly(plan.maint)}{p.perDay}</span>
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-600/10 dark:bg-brand-500/15 flex items-center justify-center text-brand-600 dark:text-brand-400 mt-0.5">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-[var(--text-muted)] leading-snug">
                  {p.contNotePre} <strong>{plan.cont}</strong> {p.contNotePost}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          {p.webFooter}
        </motion.p>

        {/* ════ MARKETING PACKAGES ════ */}
        <motion.div
          variants={staggerContainer}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center mb-14 mt-24"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {p.mktLabel}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {p.mktHeading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {p.mktSubtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {p.mktPlans.map((plan, i) => {
            const Icon = MKT_ICONS[i] ?? Megaphone;
            const popular = i === 1;
            return (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`relative flex flex-col p-7 rounded-3xl bg-[var(--surface)]/80 backdrop-blur-sm
                            transition-all duration-300 hover:-translate-y-2
                            ${popular
                              ? "border-2 border-brand-600 shadow-2xl shadow-brand-600/20"
                              : "border border-[var(--border)] hover:shadow-xl hover:shadow-brand-600/10"}`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                      <Star size={11} fill="currentColor" /> {p.popular}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1">
                  <Icon size={20} className="text-brand-600 dark:text-brand-400" />
                  <h3 className="text-lg font-bold text-[var(--text)]">{plan.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-5 min-h-[40px]">{plan.tag}</p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-[var(--text)]">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)] font-medium">{p.perMonth}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-5">{plan.note}</p>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-600/10 dark:bg-brand-500/15 flex items-center justify-center text-brand-600 dark:text-brand-400 mt-0.5">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          {p.mktFooter}
        </motion.p>

        {/* CTA below pricing */}
        <motion.div
          variants={fadeUp}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="mt-12 sm:mt-14 rounded-[26px] p-7 sm:p-10 text-center
                     bg-[linear-gradient(135deg,rgba(37,99,235,0.16),rgba(37,99,235,0.04))]
                     border border-brand-600/30"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2.5 leading-snug">
            {cta.title}
          </h3>
          <p className="text-[var(--text-muted)] text-[15px] sm:text-base mb-7 max-w-lg mx-auto">
            {cta.sub}
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4
                       bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm sm:text-[15px]
                       transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40"
          >
            <span>{cta.btn}</span>
            <ArrowRight size={18} className="flex-shrink-0" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
