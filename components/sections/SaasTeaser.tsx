/**
 * components/sections/SaasTeaser.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Rent-a-Car SaaS featured section with gradient border + early-access form.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Car, CalendarClock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { staggerContainer, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

const MARKETS = ["🇧🇦 BiH", "🇷🇸 Srbija", "🇭🇷 Hrvatska", "🇲🇪 Crna Gora", "🇪🇺 EU (2028+)"];

export function SaasTeaser() {
  const { t } = useLanguage();
  // Keeps sections visible after a language/theme switch (no re-hide on re-render)
  const [seen, setSeen] = useState(false);
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // replace with real API
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="saas" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(37,99,235,0.08),transparent)]
                      dark:bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(59,130,246,0.12),transparent)]" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {t.saas.label}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t.saas.heading1}{" "}
            <span className="text-gradient">{t.saas.headingAccent}</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #2563EB, #60A5FA, #818CF8) border-box",
            border: "1.5px solid transparent",
          }}
        >
          <div className="p-8 lg:p-12 grid lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                              bg-brand-600/10 dark:bg-brand-500/15 border border-brand-600/20
                              text-brand-700 dark:text-brand-300 text-sm font-semibold mb-6">
                <Car size={15} />
                {t.saas.badge}
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-[var(--text)] mb-4 leading-tight">
                {t.saas.title}
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6">{t.saas.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {MARKETS.map((m) => (
                  <span key={m} className="px-3 py-1.5 rounded-full text-xs font-semibold
                                           border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]">
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <CalendarClock size={15} className="text-brand-600 dark:text-brand-400" />
                <span>{t.saas.launch} <strong className="text-[var(--text)]">{t.saas.launchDate}</strong></span>
              </div>
            </div>

            {/* Right */}
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                {t.saas.featuresTitle}
              </p>
              <ul className="grid grid-cols-1 gap-2.5 mb-8">
                {t.saas.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5 text-brand-600 dark:text-brand-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
                  <p className="text-sm font-bold text-[var(--text)]">{t.saas.earlyAccess}</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-4">{t.saas.earlyAccessDesc}</p>

                {submitted ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                    <CheckCircle2 size={16} />
                    {t.saas.success}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.saas.placeholder}
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-[var(--surface)]
                                 border border-[var(--border)] text-[var(--text)]
                                 placeholder:text-[var(--text-muted)] focus:outline-none
                                 focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
                                 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
                                 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                                 hover:shadow-lg hover:shadow-brand-600/30 whitespace-nowrap"
                    >
                      {loading ? t.saas.submitting : (<>{t.saas.submit} <ArrowRight size={13} /></>)}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
