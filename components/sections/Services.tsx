/**
 * components/sections/Services.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Šta radimo" (v4: tri kolone, sve vidljivo odmah).
 *
 * Lekcije iz prethodnih verzija:
 *   • v2 bento: djelovao šablonski.  • v3 pozornica: sakrivala 3/4 sadržaja.
 * v4: AI usluga je izbačena (odluka vlasnika), pa 3 usluge = 3 čiste kolone
 * gdje se SVE vidi na prvi pogled, bez ikakvog klikanja:
 *   broj + ljudski naslov → jedna rečenica → vizual s natpisom →
 *   "Šta dobijate" (3 stavke) → linija povjerenja na dnu.
 * Ljudski jezik iz v3 je zadržan (nula žargona).
 *
 * Mobile: iste kartice, jedna ispod druge. Bez interakcija, bez autoplaya.
 * Self-contained BS/EN, useReveal, dark/light, bez crtica, id "usluge".
 */

"use client";

import { motion } from "framer-motion";
import { AppWindow, Globe, LineChart, Check, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

const ICONS: LucideIcon[] = [AppWindow, Globe, LineChart];

type Service = { title: string; hook: string; benefits: string[]; trust: string; caption: string; badge?: string };
type Content = {
  label: string; heading1: string; headingAccent: string; subtitle: string;
  benefitsTitle: string;
  items: [Service, Service, Service];
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
        badge: "Najtraženije",
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
          "Instagram i Google reklame vođene ispravno, bez bacanja budžeta",
          "Svaki mjesec jasan izvještaj: šta je urađeno i šta je stiglo",
          "Sadržaj koji zvuči kao vi, ne kao agencija",
        ],
        trust: "Meta i Google oglašavanje, mjerljivo do zadnjeg upita",
        caption: "Rast upita, mjesec po mjesec",
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
        badge: "Most popular",
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
    ],
  },
};

/* ── Vizuali: usluga "na djelu", isti jezik kao flagship sekcija ──────────── */

function VisualApps() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-3.5" aria-hidden>
      {[["bg-amber-400", "w-24"], ["bg-green-500", "w-20"], ["bg-green-500", "w-28"]].map(([dot, w], i) => (
        <div key={i} className={`flex items-center gap-2.5 py-2.5 ${i < 2 ? "border-b border-white/[.06]" : ""}`}>
          <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
          <span className={`h-2 ${w} rounded bg-white/20`} />
          <span className="ml-auto flex gap-1.5 flex-shrink-0">
            <span className="w-10 h-5 rounded bg-blue-600/90" />
            <span className="w-10 h-5 rounded bg-white/10" />
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
        <span className="ml-1.5 h-2.5 flex-1 rounded bg-white/[.07]" />
      </div>
      <div className="p-3.5 flex gap-3 items-center">
        <div className="flex-1">
          <div className="h-2 w-3/4 rounded bg-white/25 mb-1.5" />
          <div className="h-2 w-1/2 rounded bg-blue-400/50 mb-2.5" />
          <div className="h-4 w-16 rounded bg-blue-600/90" />
        </div>
        <div className="w-2/5 aspect-[4/3] rounded-lg bg-gradient-to-br from-blue-400/40 to-indigo-600/20" />
      </div>
    </div>
  );
}
function VisualMarketing() {
  const bars = [28, 42, 38, 56, 70, 100];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A122B] p-3.5" aria-hidden>
      <div className="flex items-end gap-1.5 h-[74px]">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }}
                className={`flex-1 rounded-t ${i === bars.length - 1
                  ? "bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]"
                  : "bg-white/12"}`} />
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
const VISUALS = [VisualApps, VisualWebflow, VisualMarketing];

export function Services() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  const revealHead = useReveal();
  const revealGrid = useReveal();

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

        {/* ── Tri kolone: sve vidljivo odmah ─────────────────────────────── */}
        <motion.div variants={staggerContainerSlow} {...revealGrid}
                    className="grid md:grid-cols-3 gap-5 items-stretch">
          {d.items.map((s, i) => {
            const Icon = ICONS[i];
            const Visual = VISUALS[i];
            const featured = i === 0;
            return (
              <motion.article
                key={s.title}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className={`group relative flex flex-col rounded-3xl p-6 overflow-hidden
                            bg-[var(--surface)] border
                            transition-[border-color,box-shadow] duration-300
                            ${featured
                              ? "border-brand-600/35 hover:border-brand-600/55 hover:shadow-2xl hover:shadow-brand-600/15"
                              : "border-[var(--border)] hover:border-brand-600/40 hover:shadow-2xl hover:shadow-brand-600/10"}`}
              >
                {/* broj u uglu, editorial potpis */}
                <span className="absolute -top-2 right-4 text-[64px] leading-none font-serif italic font-semibold
                                 text-gradient opacity-[0.13] select-none pointer-events-none
                                 transition-opacity duration-500 group-hover:opacity-25" aria-hidden>
                  0{i + 1}
                </span>

                <div className="relative flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
                                   bg-gradient-to-br from-brand-600 to-brand-400 text-white
                                   shadow-lg shadow-brand-600/30
                                   transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={17} />
                  </span>
                  {s.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                     text-brand-700 dark:text-brand-300 bg-brand-600/10 border border-brand-600/30">
                      ★ {s.badge}
                    </span>
                  )}
                </div>

                <h3 className="relative text-[19px] font-extrabold tracking-tight text-[var(--text)] mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="relative text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
                  {s.hook}
                </p>

                <div className="relative">
                  <Visual />
                  <p className="mt-2.5 mb-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] text-center">
                    {s.caption}
                  </p>
                </div>

                <p className="relative text-[10.5px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2.5">
                  {d.benefitsTitle}
                </p>
                <ul className="relative flex flex-col gap-2 mb-5">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[13px] text-[var(--text)] leading-snug">
                      <span className="mt-0.5 w-[17px] h-[17px] rounded-full flex items-center justify-center flex-shrink-0
                                       bg-brand-600/12 border border-brand-600/30 text-brand-600 dark:text-brand-400">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <p className="relative mt-auto flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]
                              border-t border-[var(--border)] pt-3.5">
                  <Sparkles size={11} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
                  {s.trust}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
