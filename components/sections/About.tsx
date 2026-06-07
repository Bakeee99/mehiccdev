/**
 * components/sections/About.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Who we are" — team cards WITH photo placeholders.
 *
 * HOW TO ADD REAL PHOTOS:
 *   1. Put your images in /public/team/ (e.g. bakir.jpg, nedim.jpg)
 *   2. In the PHOTOS array below, set src to "/team/bakir.jpg" etc.
 *   The placeholder gradient + hint disappears automatically once src is set.
 */

"use client";

import { motion } from "framer-motion";
import { Code2, Megaphone, ImageIcon, Linkedin } from "lucide-react";
import { staggerContainerSlow, fadeUp, slideInLeft, slideInRight, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ── Photo config — leave src empty ("") to show the placeholder ────────────────
const PHOTOS = [
  { src: "", gradient: "from-blue-600 to-blue-400",   initials: "BM", icon: Code2,    linkedin: "https://www.linkedin.com/in/bakir-mehic-qa-engineer/" },
  { src: "", gradient: "from-indigo-500 to-blue-500", initials: "NK", icon: Megaphone, linkedin: "https://www.linkedin.com/in/nedim-kupusija-4632a533b/" },
];

export function About() {
  const { t } = useLanguage();

  return (
    <section id="o-nama" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {t.about.label}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {t.about.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {t.about.subtitle}
          </motion.p>
        </motion.div>

        {/* Team cards */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {t.about.members.map((member, i) => {
            const photo = PHOTOS[i];
            return (
              <motion.div
                key={member.name}
                variants={i === 0 ? slideInLeft : slideInRight}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)]
                           overflow-hidden hover:border-brand-600/40 dark:hover:border-brand-500/40
                           transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/10
                           hover:-translate-y-1"
              >
                {/* ── Photo area ──────────────────────────────────────────────── */}
                <div className="relative h-72 overflow-hidden">
                  {photo.src ? (
                    // Real photo (uses <img> so no next/image config needed)
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.src}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    // Placeholder until a real photo is added
                    <div className={`w-full h-full bg-gradient-to-br ${photo.gradient} flex flex-col items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden />
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/30">
                        <span className="text-4xl font-extrabold text-white">{photo.initials}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <ImageIcon size={14} />
                        {t.about.photoHint}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Info ────────────────────────────────────────────────────── */}
                <div className="p-7">
                  <h3 className="text-xl font-bold text-[var(--text)] mb-0.5">{member.name}</h3>
                  <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">{member.role}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium
                                   bg-brand-600/10 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
