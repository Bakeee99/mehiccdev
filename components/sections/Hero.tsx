/**
 * components/sections/Hero.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-viewport hero with grid background, radial glow, staggered reveal,
 * tech pills, and an animated stats bar below.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

const TECH_PILLS = ["Next.js", "React", "Webflow", "AI / LLM", "Tailwind CSS", "Framer Motion"];

export function Hero() {
  const { t } = useLanguage();

  const STATS = [
    { value: t.stats.projectsValue, label: t.stats.projects },
    { value: t.stats.clientsValue,  label: t.stats.clients  },
    { value: t.stats.marketsValue,  label: t.stats.markets  },
    { value: t.stats.supportValue,  label: t.stats.support  },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.18),transparent)]
                   dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(59,130,246,0.22),transparent)]"
        aria-hidden
      />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" aria-hidden />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center"
      >
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           border border-brand-600/30 dark:border-brand-500/30
                           bg-brand-600/8 dark:bg-brand-500/10
                           text-brand-700 dark:text-brand-300
                           text-xs font-semibold tracking-wider uppercase">
            <Sparkles size={12} />
            {t.hero.badge}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
        >
          {t.hero.title1}{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient">{t.hero.titleAccent}</span>
          <br className="hidden sm:block" />
          {t.hero.title2}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed text-[var(--text-muted)] mb-10"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                       bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base
                       transition-all duration-200 hover:shadow-xl hover:shadow-brand-600/30
                       hover:-translate-y-0.5"
          >
            {t.hero.ctaPrimary}
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                       border border-[var(--border)] bg-[var(--surface)]/60
                       hover:bg-[var(--surface)] hover:border-brand-600/40
                       text-[var(--text)] font-semibold text-base
                       transition-all duration-200 hover:-translate-y-0.5"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-16">
          {TECH_PILLS.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)]
                         bg-[var(--surface)]/50 text-[var(--text-muted)] backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm"
            >
              <p className="text-2xl sm:text-3xl font-extrabold text-gradient mb-1">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={20} className="text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
