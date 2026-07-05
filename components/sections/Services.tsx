/**
 * components/sections/Services.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Šta radimo" (v2, premium bento redizajn).
 *
 * Umjesto 4 identične kartice u redu: asimetrični bento raspored (velika +
 * mala u prvom redu, mala + velika u drugom), editorial redni brojevi u serif
 * italic gradijentu, i MINI VIZUAL u svakoj kartici koji uslugu pokazuje na
 * djelu (admin tabela, browser blok, rastući graf, chat mjehurići).
 * Web aplikacije su prva i najveća kartica jer su glavni proizvod.
 *
 * Na mobitelu: jedna kolona, svaka kartica sa svojim vizualom, kompaktno.
 * Self-contained (BS/EN u fajlu), useReveal pattern, dark/light, bez crtica.
 */

"use client";

import { motion } from "framer-motion";
import { Globe, AppWindow, LineChart, BrainCircuit, Sparkles, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

type Service = { title: string; desc: string; features: string[]; badge?: string };
type Content = {
  label: string; heading1: string; headingAccent: string; subtitle: string;
  items: [Service, Service, Service, Service]; // redoslijed: Apps, Webflow, Marketing, AI
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Šta radimo",
    heading1: "Usluge koje",
    headingAccent: "rade zajedno",
    subtitle: "Sajt, aplikacija i marketing na jednom mjestu, umjesto da žonglirate između tri različita izvođača.",
    items: [
      {
        title: "Custom Web Aplikacije",
        desc: "Rezervacije, evidencije, admin paneli. Aplikacija građena oko načina na koji vaša firma stvarno radi, i spremna da raste s njom.",
        features: ["React / Next.js 14", "REST & GraphQL API", "Autentifikacija", "Deployment & DevOps"],
        badge: "Najtraženije",
      },
      {
        title: "Webflow Development",
        desc: "Brzi, moderni sajtovi koje kasnije sami uređujete, bez zvanja programera za svaku sitnicu.",
        features: ["CMS & e-commerce", "SEO optimizacija", "Animacije", "Performanse 95+"],
      },
      {
        title: "Digitalni Marketing",
        desc: "Objave, reklame i strategija koje dovode upite, a ne samo lajkove. Svaki mjesec znate šta je urađeno i šta je od toga stiglo.",
        features: ["Paid Ads (Meta, Google)", "Content strategija", "Community", "Analitika & izvještaji"],
      },
      {
        title: "AI Prompting & Integracije",
        desc: "Chatbot koji odgovara kupcima, automatski izvještaji, brža obrada upita. AI uposlen tamo gdje vam stvarno štedi vrijeme.",
        features: ["GPT / Claude integracije", "AI automatizacija", "Custom chatboti", "Prompt optimizacija"],
      },
    ],
  },
  en: {
    label: "What we do",
    heading1: "Services that",
    headingAccent: "work together",
    subtitle: "Website, app and marketing under one roof, instead of juggling three different vendors.",
    items: [
      {
        title: "Custom Web Apps",
        desc: "Bookings, records, admin panels. An app built around how your business actually works, and ready to grow with it.",
        features: ["React / Next.js 14", "REST & GraphQL API", "Authentication", "Deployment & DevOps"],
        badge: "Most popular",
      },
      {
        title: "Webflow Development",
        desc: "Fast, modern websites you can edit yourself, without calling a developer for every small change.",
        features: ["CMS & e-commerce", "SEO optimization", "Animations", "Performance 95+"],
      },
      {
        title: "Digital Marketing",
        desc: "Posts, ads and strategy that bring in inquiries, not just likes. Every month you know what was done and what came of it.",
        features: ["Paid Ads (Meta, Google)", "Content strategy", "Community", "Analytics & reporting"],
      },
      {
        title: "AI Prompting & Integrations",
        desc: "A chatbot that answers customers, automated reports, faster inquiry handling. AI put to work where it actually saves you time.",
        features: ["GPT / Claude integrations", "AI automation", "Custom chatbots", "Prompt optimization"],
      },
    ],
  },
};

const ICONS: LucideIcon[] = [AppWindow, Globe, LineChart, BrainCircuit];
// raspored na velikim ekranima: 7+5 / 5+7 kolona (asimetrični bento)
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/* ── Mini vizuali (aria-hidden, namjerno tamni: glume aplikaciju) ──────────── */

function VisualApps() {
  // admin tabela: rezervacije sa statusima i dugmadima (eho Maximuma)
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-3" aria-hidden>
      {[["bg-amber-400", "w-24"], ["bg-green-500", "w-20"], ["bg-green-500", "w-28"]].map(([dot, w], i) => (
        <div key={i} className={`flex items-center gap-2.5 py-2 ${i < 2 ? "border-b border-white/[.06]" : ""}`}>
          <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
          <span className={`h-1.5 ${w} rounded bg-white/20`} />
          <span className="h-1.5 w-10 rounded bg-white/10 hidden sm:block" />
          <span className="ml-auto flex gap-1.5 flex-shrink-0">
            <span className="w-9 h-4 rounded bg-blue-600/90" />
            <span className="w-9 h-4 rounded bg-white/10" />
          </span>
        </div>
      ))}
    </div>
  );
}

function VisualWebflow() {
  // browser s hero rasporedom
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] overflow-hidden" aria-hidden>
      <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-white/[.06]">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="ml-1.5 h-2.5 flex-1 rounded bg-white/[.07]" />
      </div>
      <div className="p-3 flex gap-3 items-center">
        <div className="flex-1">
          <div className="h-2 w-3/4 rounded bg-white/25 mb-1.5" />
          <div className="h-2 w-1/2 rounded bg-blue-400/50 mb-2" />
          <div className="h-4 w-14 rounded bg-blue-600/90" />
        </div>
        <div className="w-1/3 aspect-[4/3] rounded-lg bg-gradient-to-br from-blue-400/40 to-indigo-600/20" />
      </div>
    </div>
  );
}

function VisualMarketing() {
  // rastući graf + zeleni rezultat
  const bars = [30, 45, 40, 60, 75, 100];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-3" aria-hidden>
      <div className="flex items-end gap-1.5 h-16">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t ${i === bars.length - 1
              ? "bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]"
              : "bg-white/12"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="h-1.5 w-16 rounded bg-white/15" />
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/30">
          +184% upita
        </span>
      </div>
    </div>
  );
}

function VisualAI() {
  // chat: pitanje kupca + AI odgovor
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-3 flex flex-col gap-2" aria-hidden>
      <div className="self-end max-w-[75%] rounded-xl rounded-br-sm bg-white/[.08] px-2.5 py-1.5">
        <span className="block h-1.5 w-24 rounded bg-white/25" />
      </div>
      <div className="self-start max-w-[80%] rounded-xl rounded-bl-sm bg-blue-600/25 border border-blue-500/30 px-2.5 py-1.5">
        <span className="flex items-center gap-1.5 mb-1">
          <Sparkles size={9} className="text-blue-300" />
          <span className="h-1 w-8 rounded bg-blue-300/60" />
        </span>
        <span className="block h-1.5 w-32 rounded bg-white/25 mb-1" />
        <span className="block h-1.5 w-20 rounded bg-white/15" />
      </div>
    </div>
  );
}

const VISUALS = [VisualApps, VisualWebflow, VisualMarketing, VisualAI];

export function Services() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealHead = useReveal();
  const revealGrid = useReveal();

  return (
    <section id="usluge" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -right-56 top-16 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />
      <div className="absolute -left-56 bottom-16 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-14">
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

        {/* ── Bento grid ─────────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainerSlow}
          {...revealGrid}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {d.items.map((s, i) => {
            const Icon = ICONS[i];
            const Visual = VISUALS[i];
            const wide = i === 0 || i === 3;
            return (
              <motion.article
                key={s.title}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className={`group relative flex flex-col p-6 sm:p-7 rounded-3xl overflow-hidden
                            bg-[var(--surface)] border transition-[border-color,box-shadow] duration-300
                            ${SPANS[i]}
                            ${s.badge
                              ? "border-brand-600/30 hover:border-brand-600/50 hover:shadow-2xl hover:shadow-brand-600/15"
                              : "border-[var(--border)] hover:border-brand-600/40 hover:shadow-2xl hover:shadow-brand-600/10"}`}
              >
                {/* ogromni redni broj: editorial detalj */}
                <span className="absolute -top-3 right-5 text-[76px] leading-none font-serif italic font-semibold
                                 text-gradient opacity-[0.14] select-none pointer-events-none
                                 transition-opacity duration-500 group-hover:opacity-30" aria-hidden>
                  0{i + 1}
                </span>
                <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.03] pointer-events-none" aria-hidden />

                <div className="relative flex items-center gap-3 mb-4">
                  <span className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                                   bg-gradient-to-br from-brand-600 to-brand-400 text-white
                                   shadow-lg shadow-brand-600/30
                                   transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={19} />
                  </span>
                  {s.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                     text-brand-700 dark:text-brand-300 bg-brand-600/10 border border-brand-600/30">
                      ★ {s.badge}
                    </span>
                  )}
                </div>

                <h3 className="relative text-lg sm:text-xl font-extrabold tracking-tight text-[var(--text)] mb-2">
                  {s.title}
                </h3>
                <p className="relative text-[13.5px] text-[var(--text-muted)] leading-relaxed mb-4">
                  {s.desc}
                </p>

                <div className={`relative flex flex-wrap gap-1.5 mb-5 ${wide ? "max-w-md" : ""}`}>
                  {s.features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold
                                             text-[var(--text)] bg-[var(--bg)]/70 border border-[var(--border)]">
                      <Check size={9} strokeWidth={3.5} className="text-brand-600 dark:text-brand-400" /> {f}
                    </span>
                  ))}
                </div>

                {/* mini vizual: usluga na djelu */}
                <div className={`relative mt-auto transition-transform duration-500 group-hover:-translate-y-1 ${wide ? "lg:max-w-md" : ""}`}>
                  <Visual />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
