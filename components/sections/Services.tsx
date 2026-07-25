/**
 * components/sections/Services.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Šta radimo" (v3: interaktivna pozornica + ljudski jezik).
 *
 * Dvije ključne promjene u odnosu na v2 (bento):
 *   1. JEZIK: nula developerskog žargona. Svaka usluga ima naslov i koristi
 *      napisane za vlasnika biznisa, ne za programera ("Gosti sami provjere
 *      šta je slobodno" umjesto "REST & GraphQL API"). Tehnologija je svedena
 *      na jednu malu liniju povjerenja na dnu.
 *   2. FORMA: desktop ima POZORNICU: lijevo 4 reda za izbor usluge, desno
 *      veliki vizual + "Šta dobijate" lista za aktivnu uslugu. Pozornica se
 *      sama rotira svakih 7s (traka napretka na aktivnom redu) dok korisnik
 *      prvi put ne klikne; tada preuzima kontrolu. Na telefonu: jednostavne
 *      naslagane kartice bez interakcije (sve se vidi odmah).
 *
 * Performanse: bez blura, animacije su transform/opacity, autoplay se gasi
 * za reduced-motion. Self-contained BS/EN, id ostaje "usluge".
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AppWindow, Globe, LineChart, BrainCircuit, Check, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

const ICONS: LucideIcon[] = [AppWindow, Globe, LineChart, BrainCircuit];
const ROTATE_MS = 7000;

type Service = { title: string; hook: string; benefits: string[]; trust: string; caption: string };
type Content = {
  label: string; heading1: string; headingAccent: string; subtitle: string;
  benefitsTitle: string;
  items: [Service, Service, Service, Service];
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Šta radimo",
    heading1: "Usluge koje",
    headingAccent: "rade zajedno",
    subtitle: "Sajt, aplikacija i marketing na jednom mjestu, objašnjeno bez tehničkog žargona.",
    benefitsTitle: "Šta dobijate",
    items: [
      {
        title: "Aplikacija za vaš biznis",
        hook: "Program u kojem vodite rezervacije, klijente i posao. Umjesto sveske, poziva i Excela.",
        benefits: [
          "Gosti sami provjere šta je slobodno i pošalju upit, i u 3 ujutro",
          "Vi sve potvrdite jednim klikom, s telefona",
          "Raste s vama: od 5 do 500 rezervacija, isti sistem",
        ],
        trust: "Građeno na tehnologiji koju koriste Nike i TikTok",
        caption: "Ovako izgleda vaš admin panel",
      },
      {
        title: "Sajt koji sami uređujete",
        hook: "Moderan sajt na kojem cijene, slike i tekst mijenjate sami, bez zvanja programera.",
        benefits: [
          "Promijenite ponudu za dvije minute, s bilo kojeg računara",
          "Izgleda vrhunski i na telefonu, gdje je većina vaših gostiju",
          "Google ga lako pronađe, pa vas nalaze i novi klijenti",
        ],
        trust: "Webflow: platforma koju koriste Dell i The New York Times",
        caption: "Vaš sajt, vaša kontrola",
      },
      {
        title: "Marketing koji dovodi goste",
        hook: "Objave i reklame koje vode do upita i rezervacija, ne samo do lajkova.",
        benefits: [
          "Reklame na Instagramu i Googlu vođene ispravno, bez bacanja budžeta",
          "Svaki mjesec jasan izvještaj: šta je urađeno i šta je stiglo od toga",
          "Sadržaj koji zvuči kao vi, ne kao agencija",
        ],
        trust: "Meta i Google oglašavanje, mjerljivo do zadnjeg upita",
        caption: "Rast upita, mjesec po mjesec",
      },
      {
        title: "AI koji radi za vas",
        hook: "Pametni pomoćnici koji preuzmu ono što vam krade vrijeme: odgovore, izvještaje, obradu upita.",
        benefits: [
          "Chatbot odgovara gostima i kad vi spavate",
          "Izvještaji se pišu sami umjesto ručnog prekucavanja",
          "Uvodimo AI samo tamo gdje vam stvarno štedi sate",
        ],
        trust: "GPT i Claude integracije, uposlene s razlogom",
        caption: "Vaš AI asistent u razgovoru s gostom",
      },
    ],
  },
  en: {
    label: "What we do",
    heading1: "Services that",
    headingAccent: "work together",
    subtitle: "Website, app and marketing under one roof, explained without tech jargon.",
    benefitsTitle: "What you get",
    items: [
      {
        title: "An app for your business",
        hook: "A system where you run bookings, clients and daily work. Instead of notebooks, calls and Excel.",
        benefits: [
          "Guests check availability and send inquiries on their own, even at 3 AM",
          "You confirm everything in one click, from your phone",
          "Grows with you: from 5 to 500 bookings, same system",
        ],
        trust: "Built on technology used by Nike and TikTok",
        caption: "This is what your admin panel looks like",
      },
      {
        title: "A website you edit yourself",
        hook: "A modern site where you change prices, photos and text yourself, without calling a developer.",
        benefits: [
          "Update your offer in two minutes, from any computer",
          "Looks premium on phones, where most of your guests are",
          "Google finds it easily, so new clients find you",
        ],
        trust: "Webflow: the platform used by Dell and The New York Times",
        caption: "Your website, your control",
      },
      {
        title: "Marketing that brings guests",
        hook: "Posts and ads that lead to inquiries and bookings, not just likes.",
        benefits: [
          "Instagram and Google ads run properly, without wasted budget",
          "A clear monthly report: what was done and what came of it",
          "Content that sounds like you, not like an agency",
        ],
        trust: "Meta and Google advertising, measurable to the last inquiry",
        caption: "Inquiry growth, month by month",
      },
      {
        title: "AI that works for you",
        hook: "Smart assistants that take over what steals your time: replies, reports, inquiry handling.",
        benefits: [
          "A chatbot answers guests while you sleep",
          "Reports write themselves instead of manual retyping",
          "We add AI only where it truly saves you hours",
        ],
        trust: "GPT and Claude integrations, employed with a purpose",
        caption: "Your AI assistant talking to a guest",
      },
    ],
  },
};

/* ── Vizuali (isti jezik kao flagship: aplikacija "na djelu") ─────────────── */

function VisualApps() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-4" aria-hidden>
      {[["bg-amber-400", "w-28"], ["bg-green-500", "w-24"], ["bg-green-500", "w-32"], ["bg-green-500", "w-20"]].map(([dot, w], i) => (
        <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 3 ? "border-b border-white/[.06]" : ""}`}>
          <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
          <span className={`h-2 ${w} rounded bg-white/20`} />
          <span className="h-2 w-12 rounded bg-white/10 hidden sm:block" />
          <span className="ml-auto flex gap-1.5 flex-shrink-0">
            <span className="w-11 h-5 rounded bg-blue-600/90" />
            <span className="w-11 h-5 rounded bg-white/10" />
          </span>
        </div>
      ))}
    </div>
  );
}
function VisualWebflow() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] overflow-hidden" aria-hidden>
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[.06]">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" /><span className="w-1.5 h-1.5 rounded-full bg-white/20" /><span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="ml-1.5 h-3 flex-1 rounded bg-white/[.07]" />
      </div>
      <div className="p-4 flex gap-4 items-center">
        <div className="flex-1">
          <div className="h-2.5 w-3/4 rounded bg-white/25 mb-2" />
          <div className="h-2.5 w-1/2 rounded bg-blue-400/50 mb-3" />
          <div className="h-5 w-20 rounded bg-blue-600/90" />
        </div>
        <div className="w-2/5 aspect-[4/3] rounded-lg bg-gradient-to-br from-blue-400/40 to-indigo-600/20" />
      </div>
    </div>
  );
}
function VisualMarketing() {
  const bars = [28, 42, 38, 56, 70, 100];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-4" aria-hidden>
      <div className="flex items-end gap-2 h-24">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }}
                className={`flex-1 rounded-t ${i === bars.length - 1
                  ? "bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]"
                  : "bg-white/12"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <span className="h-2 w-20 rounded bg-white/15" />
        <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/30">
          +184% upita
        </span>
      </div>
    </div>
  );
}
function VisualAI() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-4 flex flex-col gap-2.5" aria-hidden>
      <div className="self-end max-w-[70%] rounded-xl rounded-br-sm bg-white/[.08] px-3 py-2">
        <span className="block h-2 w-28 rounded bg-white/25" />
      </div>
      <div className="self-start max-w-[78%] rounded-xl rounded-bl-sm bg-blue-600/25 border border-blue-500/30 px-3 py-2">
        <span className="flex items-center gap-1.5 mb-1.5">
          <Sparkles size={10} className="text-blue-300" />
          <span className="h-1.5 w-10 rounded bg-blue-300/60" />
        </span>
        <span className="block h-2 w-36 rounded bg-white/25 mb-1.5" />
        <span className="block h-2 w-24 rounded bg-white/15" />
      </div>
      <div className="self-end max-w-[70%] rounded-xl rounded-br-sm bg-white/[.08] px-3 py-2">
        <span className="block h-2 w-20 rounded bg-white/25" />
      </div>
    </div>
  );
}
const VISUALS = [VisualApps, VisualWebflow, VisualMarketing, VisualAI];

export function Services() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;
  const reduce = useReducedMotion() ?? false;

  const revealHead  = useReveal();
  const revealStage = useReveal();
  const revealStack = useReveal();

  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false); // korisnik preuzeo kontrolu

  // auto-rotacija dok korisnik prvi put ne klikne (i nikad uz reduced-motion)
  useEffect(() => {
    if (locked || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % 4), ROTATE_MS);
    return () => clearInterval(t);
  }, [locked, reduce]);

  const pick = (i: number) => { setLocked(true); setActive(i); };

  const ActiveVisual = VISUALS[active];
  const s = d.items[active];

  return (
    <section id="usluge" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />

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

        {/* ── DESKTOP: pozornica s izborom ───────────────────────────────── */}
        <motion.div variants={fadeUp} {...revealStage}
                    className="hidden lg:grid grid-cols-[0.85fr_1.15fr] gap-8 items-stretch">

          {/* izbor usluga */}
          <div className="flex flex-col gap-3" role="tablist" aria-label={d.label}>
            {d.items.map((item, i) => {
              const Icon = ICONS[i];
              const on = i === active;
              return (
                <button
                  key={item.title}
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  className={`relative text-left p-5 rounded-2xl border overflow-hidden
                              transition-[border-color,background-color] duration-300
                              ${on
                                ? "bg-brand-600/[.07] border-brand-600/40"
                                : "bg-[var(--surface)] border-[var(--border)] hover:border-brand-600/30"}`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`text-[28px] leading-none font-serif italic font-semibold select-none
                                      ${on ? "text-gradient" : "text-[var(--text-muted)] opacity-40"}`}>
                      0{i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`flex items-center gap-2 text-[16px] font-extrabold tracking-tight
                                        ${on ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                        <Icon size={15} className={on ? "text-brand-600 dark:text-brand-400" : ""} />
                        {item.title}
                      </span>
                      {on && (
                        <span className="block text-[12.5px] text-[var(--text-muted)] leading-snug mt-1">
                          {item.hook}
                        </span>
                      )}
                    </span>
                  </span>

                  {/* traka napretka auto-rotacije */}
                  {on && !locked && !reduce && (
                    <motion.span
                      key={`progress-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[2.5px] w-full origin-left bg-brand-500/60"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* pozornica */}
          <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full
                            bg-[radial-gradient(closest-side,rgba(37,99,235,0.15),transparent_72%)] pointer-events-none" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative"
              >
                <ActiveVisual />
                <p className="mt-3 mb-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] text-center">
                  {s.caption}
                </p>

                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
                  {d.benefitsTitle}
                </p>
                <ul className="flex flex-col gap-2.5 mb-5">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] text-[var(--text)] leading-snug">
                      <span className="mt-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0
                                       bg-brand-600/12 border border-brand-600/30 text-brand-600 dark:text-brand-400">
                        <Check size={10} strokeWidth={3.5} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="text-[11.5px] text-[var(--text-muted)] border-t border-[var(--border)] pt-3.5">
                  {s.trust}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── MOBILE: jednostavne naslagane kartice, sve vidljivo odmah ──── */}
        <motion.div variants={staggerContainer} {...revealStack} className="lg:hidden flex flex-col gap-5">
          {d.items.map((item, i) => {
            const Icon = ICONS[i];
            const Visual = VISUALS[i];
            return (
              <motion.article key={item.title} variants={fadeUp}
                              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[26px] leading-none font-serif italic font-semibold text-gradient select-none">0{i + 1}</span>
                  <h3 className="flex items-center gap-2 text-[17px] font-extrabold tracking-tight text-[var(--text)]">
                    <Icon size={15} className="text-brand-600 dark:text-brand-400" /> {item.title}
                  </h3>
                </div>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">{item.hook}</p>
                <Visual />
                <ul className="flex flex-col gap-2 mt-4">
                  {item.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12.5px] text-[var(--text)] leading-snug">
                      <Check size={12} strokeWidth={3.5} className="mt-0.5 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                      {b}
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
