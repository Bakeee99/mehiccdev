/**
 * components/sections/Services.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Four service cards with hover glow/lift. Content from i18n.
 */

"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Globe, AppWindow, LineChart, BrainCircuit } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// Icons + gradient map by index (order matches i18n items)
const META = [
  { icon: Globe,        accent: "from-blue-600 to-cyan-500"   },
  { icon: AppWindow,    accent: "from-indigo-600 to-blue-500" },
  { icon: LineChart,    accent: "from-blue-500 to-violet-500" },
  { icon: BrainCircuit, accent: "from-sky-500 to-blue-600"    },
];

export function Services() {
  const { t } = useLanguage();
  // Keeps sections visible after a language/theme switch (no re-hide on re-render)
  const [seen, setSeen] = useState(false);

  return (
    <section id="usluge" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full
                      bg-brand-600/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {t.services.label}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {t.services.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {t.services.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {t.services.items.map((service, i) => {
            const Icon = META[i].icon;
            return (
              <motion.article
                key={service.title}
                variants={scaleIn}
                className="group relative flex flex-col p-6 rounded-2xl border border-[var(--border)]
                           bg-[var(--surface)] hover:border-brand-600/40 dark:hover:border-brand-500/30
                           transition-all duration-300 hover:shadow-2xl hover:shadow-brand-600/10
                           hover:-translate-y-2 cursor-default"
              >
                <div className={`absolute top-0 inset-x-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${META[i].accent}
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} aria-hidden />
                <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center
                                 bg-gradient-to-br ${META[i].accent} shadow-lg
                                 group-hover:shadow-xl transition-shadow duration-300`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-[var(--text)] mb-2 leading-snug">{service.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5 flex-1">{service.desc}</p>
                <ul className="flex flex-col gap-1.5 mt-auto">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="flex-shrink-0 w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
