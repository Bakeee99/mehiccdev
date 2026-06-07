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

import { motion } from "framer-motion";
import { Gift, Check, Star, Rocket, Diamond, Megaphone, TrendingUp, Crown } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// Icons per web plan (order matches i18n webPlans)
const WEB_ICONS = [Rocket, Star, Diamond];
// Icons per marketing plan (order matches i18n mktPlans)
const MKT_ICONS = [Megaphone, TrendingUp, Crown];

export function Pricing() {
  const { t } = useLanguage();
  const p = t.pricing;

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
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
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
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
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
                <p className="text-xs text-[var(--text-muted)] mb-4">{p.once}</p>

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

                {/* Optional maintenance */}
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/50 px-3 py-2 mb-5">
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {p.maintLabel} <strong className="text-[var(--text)]">{plan.maint}</strong>
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
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          {p.webFooter}
        </motion.p>

        {/* ════ MARKETING PACKAGES ════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
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
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
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
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          {p.mktFooter}
        </motion.p>
      </div>
    </section>
  );
}
