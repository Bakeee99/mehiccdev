/**
 * components/sections/Portfolio.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Projects grid with gradient placeholders + hover overlay. Content from i18n.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// Visual meta per project (order matches i18n items)
const META = [
  { gradient: "from-sky-400 via-blue-500 to-indigo-600",  href: "https://oxybaricmostar.ba", featured: true  },
  { gradient: "from-blue-500 via-cyan-500 to-teal-500",   href: "#portfolio",                featured: false },
  { gradient: "from-indigo-500 via-blue-600 to-blue-700", href: "#portfolio",                featured: false },
];

export function Portfolio() {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
              {t.portfolio.label}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {t.portfolio.heading}
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="max-w-sm text-[var(--text-muted)] leading-relaxed">
            {t.portfolio.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {t.portfolio.items.map((project, i) => {
            const meta = META[i];
            const isExternal = meta.href !== "#portfolio";
            return (
              <motion.article
                key={project.title}
                variants={scaleIn}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)]
                           overflow-hidden hover:border-brand-600/30 dark:hover:border-brand-500/30
                           transition-all duration-300 hover:shadow-2xl hover:shadow-brand-600/10
                           hover:-translate-y-1.5"
              >
                <div className={`relative h-48 bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                  transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={meta.href}
                      target={isExternal ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900
                                 text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      {t.portfolio.viewProject}
                      <ExternalLink size={13} />
                    </a>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-semibold">
                      {project.category}
                    </span>
                  </div>
                  {meta.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold">
                        {t.portfolio.featured}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs text-[var(--text-muted)] font-medium mb-1">{project.client}</p>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">{project.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.desc}</p>
                  <a
                    href={meta.href}
                    target={isExternal ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold
                               text-brand-600 dark:text-brand-400 hover:underline underline-offset-2"
                  >
                    {t.portfolio.details}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
