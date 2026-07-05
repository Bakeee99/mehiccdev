/**
 * components/sections/About.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Tim / Ko smo mi" (v2, premium redizajn).
 *
 * Najvažnija promjena: foto prostor je sada KVADRATAN (aspect-square), pa
 * LinkedIn profilne slike (koje su kvadratne, obično 400×400) sjedaju
 * savršeno, bez rezanja. Stari široki baner je odsijecao većinu portreta.
 *
 * KAKO UBACITI SLIKE:
 *   1. Skini profilnu sliku s LinkedIn-a (otvori profil → klik na sliku →
 *      desni klik → Sačuvaj sliku) i spremi je u  public/team/
 *      npr. bakir.jpg i nedim.jpg  (folder public/team već postoji).
 *   2. U PHOTOS ispod upiši:  src: "/team/bakir.jpg"  itd.
 *   3. Placeholder s inicijalima se sam sakrije.
 *
 * Self-contained (BS/EN u fajlu), useReveal pattern, dark/light, bez crtica.
 */

"use client";

import { motion } from "framer-motion";
import { Code2, Megaphone, Linkedin, ArrowUpRight, ImagePlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, slideInLeft, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ── Foto konfiguracija: ostavi src prazan ("") za placeholder ────────────────
const PHOTOS = [
  { src: "/team/bakir.jpg", gradient: "from-blue-600 to-blue-400",   initials: "BM", icon: Code2 as LucideIcon,     linkedin: "https://www.linkedin.com/in/bakir-mehic-qa-engineer/" },
  { src: "/team/nedim.jpg", gradient: "from-indigo-500 to-blue-500", initials: "NK", icon: Megaphone as LucideIcon, linkedin: "https://www.linkedin.com/in/nedim-kupusija-4632a533b/" },
];

type Member = { name: string; role: string; bio: string; tags: string[] };
type Content = {
  label: string; heading1: string; headingAccent: string; subtitle: string;
  photoHint: string; linkedinBtn: string;
  members: [Member, Member];
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Tim",
    heading1: "Ljudi iza",
    headingAccent: "mehiccdev-a",
    subtitle: "Developer i marketer u istom timu: jedan gradi, drugi dovodi klijente. Razgovarate direktno s ljudima koji rade posao, bez posrednika.",
    photoHint: "Kvadratna slika, npr. s LinkedIn-a",
    linkedinBtn: "LinkedIn profil",
    members: [
      {
        name: "Bakir Mehić",
        role: "Lead Developer & UI/UX Architect",
        bio:  "Vodim projekat od prve skice do objave: Webflow sajtovi, custom Next.js aplikacije i QA testiranje koje hvata greške prije nego što ih vaši kupci vide. Zadnji veći projekat: kompletna rent-a-car aplikacija koja danas radi u produkciji.",
        tags: ["Webflow & Next.js", "AI Prompt Engineering", "QA Automatizacija"],
      },
      {
        name: "Nedim Kupusija",
        role: "Digital Marketing & Social Media Manager",
        bio:  "Vodim društvene mreže i reklame tako da se svaki uloženi euro može pratiti: šta je objavljeno, ko je to vidio i koliko je upita stiglo. Bez marketinškog žargona, samo jasan plan i mjesečni izvještaj koji se razumije iz prve.",
        tags: ["Brand Scaling", "Content Strategija", "Online Optimizacija"],
      },
    ],
  },
  en: {
    label: "Team",
    heading1: "The people behind",
    headingAccent: "mehiccdev",
    subtitle: "A developer and a marketer on the same team: one builds, the other brings in clients. You talk directly to the people doing the work, with no middlemen.",
    photoHint: "Square photo, e.g. from LinkedIn",
    linkedinBtn: "LinkedIn profile",
    members: [
      {
        name: "Bakir Mehić",
        role: "Lead Developer & UI/UX Architect",
        bio:  "I take projects from first sketch to launch: Webflow sites, custom Next.js apps, and QA testing that catches bugs before your customers do. Most recent build: a complete rent-a-car application now running in production.",
        tags: ["Webflow & Next.js", "AI Prompt Engineering", "QA Automation"],
      },
      {
        name: "Nedim Kupusija",
        role: "Digital Marketing & Social Media Manager",
        bio:  "I run social media and ads so every euro can be tracked: what was posted, who saw it, and how many inquiries it brought. No marketing jargon, just a clear plan and a monthly report you can actually read.",
        tags: ["Brand Scaling", "Content Strategy", "Online Optimization"],
      },
    ],
  },
};

export function About() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealHead = useReveal();
  const revealGrid = useReveal();

  return (
    <section id="o-nama" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -left-56 top-1/4 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />
      <div className="absolute -right-56 bottom-10 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-16">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.label}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {d.heading1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {d.subtitle}
          </motion.p>
        </motion.div>

        {/* ── Kartice ────────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainerSlow} {...revealGrid} className="grid lg:grid-cols-2 gap-6">
          {d.members.map((m, i) => {
            const p = PHOTOS[i];
            const RoleIcon = p.icon;
            return (
              <motion.article
                key={m.name}
                variants={i === 0 ? slideInLeft : slideInRight}
                whileHover={{ y: -5 }}
                className="group relative rounded-3xl p-6 sm:p-7 overflow-hidden
                           bg-[var(--surface)] border border-[var(--border)]
                           transition-[border-color,box-shadow] duration-300
                           hover:border-brand-600/40 hover:shadow-2xl hover:shadow-brand-600/12"
              >
                {/* dekor */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.15),transparent_72%)] pointer-events-none
                                transition-opacity duration-500 opacity-60 group-hover:opacity-100" aria-hidden />
                <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.035] pointer-events-none" aria-hidden />

                <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-7">

                  {/* KVADRATNA slika: LinkedIn format sjeda bez rezanja */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className={`relative w-40 h-40 sm:w-[176px] sm:h-[176px] rounded-2xl p-[2.5px]
                                     bg-gradient-to-br ${p.gradient}
                                     shadow-xl shadow-brand-600/20
                                     transition-transform duration-500 group-hover:scale-[1.03]`}>
                      <div className="w-full h-full rounded-[13px] overflow-hidden bg-[var(--bg)]">
                        {p.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.src}
                            alt={m.name}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center gap-2
                                           bg-gradient-to-br ${p.gradient}`}>
                            <span className="text-3xl font-extrabold text-white/90 tracking-wide">{p.initials}</span>
                            <span className="flex items-center gap-1.5 text-[9.5px] font-semibold text-white/75 px-3 text-center leading-tight">
                              <ImagePlus size={11} className="flex-shrink-0" /> {d.photoHint}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sadržaj */}
                  <div className="min-w-0 text-center sm:text-left">
                    <h3 className="text-xl sm:text-[22px] font-extrabold tracking-tight text-[var(--text)]">
                      {m.name}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 dark:text-brand-400 mt-1 mb-3">
                      <RoleIcon size={13} className="flex-shrink-0" /> {m.role}
                    </p>
                    <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed mb-4">
                      {m.bio}
                    </p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
                      {m.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold
                                                   text-[var(--text)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] border border-[var(--border)]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                                 text-brand-700 dark:text-brand-300
                                 bg-brand-600/10 border border-brand-600/30
                                 transition-[background-color,border-color,transform] duration-300
                                 hover:bg-brand-600/20 hover:border-brand-600/50 hover:-translate-y-0.5"
                    >
                      <Linkedin size={13} /> {d.linkedinBtn} <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
