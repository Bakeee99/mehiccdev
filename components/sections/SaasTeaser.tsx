/**
 * components/sections/SaasTeaser.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Flagship: Real Estate SaaS platforma (v3, premium redizajn).
 *
 * Kompozicija:
 *   1. Header (eyebrow + naslov sa serif akcentom)
 *   2. Showcase: lijevo priča (badge, naslov, opis, tržišta, ROADMAP s dva
 *      čvora: početak razvoja → lansiranje), desno MOCKUP platforme (browser
 *      okvir s feedom oglasa) + tri plutajuće glass kartice koje pokazuju
 *      AI opis, XML sync i kreditni kalkulator "uživo"
 *   3. Bento grid: 6 funkcionalnosti kao mini kartice s ikonicama
 *   4. Early access traka s formom preko cijele širine
 *
 * Self-contained (BS/EN), useReveal pattern, dark/light tema, bez crtica.
 * Plutanje kartica ide kroz framer-motion i poštuje reduced-motion.
 */

"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2, Hammer, Rocket, CheckCircle2, ArrowRight, Sparkles,
  RefreshCw, Landmark, Globe2, TrendingUp, Gauge, Search, Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

const MARKETS = ["🇧🇦 BiH", "🇷🇸 Srbija", "🇭🇷 Hrvatska", "🇲🇪 Crna Gora"];
const FEATURE_ICONS: LucideIcon[] = [Sparkles, RefreshCw, Landmark, Globe2, TrendingUp, Gauge];

type Content = {
  label: string; heading1: string; headingAccent: string;
  badge: string; title: string; desc: string;
  roadmap: { icon: "start" | "launch"; date: string; label: string }[];
  chips: [string, string][];           // plutajuće kartice: [naslov, vrijednost]
  mockSearch: string;
  features: { t: string; d: string }[];
  earlyAccess: string; earlyAccessDesc: string;
  placeholder: string; submit: string; submitting: string; success: string;
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Naš flagship produkt",
    heading1: "Nova generacija",
    headingAccent: "oglašavanja nekretnina",
    badge: "Real Estate SaaS Platforma",
    title: "Sve-u-jednom platforma za nekretnine, građena za Balkan",
    desc: "Agencije gube sate na ručni unos oglasa i pisanje tekstova, a kupci se muče sa sporim i nepreglednim oglasnicima. Gradimo platformu koja to mijenja: AI piše prodajne opise, oglasi velikih agencija se sinhronizuju sami, a sve se učitava trenutno i na telefonu. Dizajnirano u Mostaru, napravljeno za cijeli Balkan.",
    roadmap: [
      { icon: "start",  date: "Novembar 2026", label: "Početak razvoja" },
      { icon: "launch", date: "Oktobar 2027",  label: "Planirano lansiranje" },
    ],
    chips: [
      ["AI opis oglasa", "generisan jednim klikom"],
      ["XML sync", "142 oglasa objavljena sama"],
      ["Kreditni kalkulator", "rata od 486 KM/mj"],
    ],
    mockSearch: "Trosoban stan, Mostar…",
    features: [
      { t: "AI opisi oglasa",     d: "Agent unese parametre, prodajni tekst je gotov jednim klikom." },
      { t: "XML sinhronizacija",  d: "Za velike agencije: oglasi se objavljuju potpuno sami." },
      { t: "Kreditni kalkulator", d: "Bankama donosi spremne klijente, direktno iz oglasa." },
      { t: "4 tržišta od starta", d: "Više valuta i jezika: BiH, Srbija, Hrvatska i Crna Gora." },
      { t: "Boost oglasa",        d: "Isticanje i promocija za privatne korisnike." },
      { t: "Ispod sekunde",       d: "Čist mobile-first dizajn sa savršenim tamnim modom." },
    ],
    earlyAccess: "Rani pristup za agencije",
    earlyAccessDesc: "Prijavite se prije lansiranja i testirajte besplatno prva 2 mjeseca.",
    placeholder: "vasa@email.com",
    submit: "Prijavi se",
    submitting: "Slanje…",
    success: "Hvala na prijavi! Javit ćemo vam se prije lansiranja.",
  },
  en: {
    label: "Our flagship product",
    heading1: "The next generation of",
    headingAccent: "real estate listings",
    badge: "Real Estate SaaS Platform",
    title: "An all-in-one real estate platform, built for the Balkans",
    desc: "Agencies lose hours on manual listing entry and copywriting, while buyers struggle with slow, cluttered listing sites. We're building a platform that changes that: AI writes the sales copy, large agencies' listings sync themselves, and everything loads instantly, even on a phone. Designed in Mostar, made for the whole Balkan region.",
    roadmap: [
      { icon: "start",  date: "November 2026", label: "Development starts" },
      { icon: "launch", date: "October 2027",  label: "Planned launch" },
    ],
    chips: [
      ["AI listing copy", "generated in one click"],
      ["XML sync", "142 listings published on their own"],
      ["Mortgage calculator", "payment from €248/mo"],
    ],
    mockSearch: "2-bedroom apartment, Mostar…",
    features: [
      { t: "AI listing copy",      d: "The agent enters the parameters, sales copy is ready in one click." },
      { t: "XML synchronization",  d: "For large agencies: listings publish themselves." },
      { t: "Mortgage calculator",  d: "Delivers ready leads to partner banks, straight from the listing." },
      { t: "4 markets from day 1", d: "Multiple currencies and languages: Bosnia, Serbia, Croatia, Montenegro." },
      { t: "Listing boost",        d: "Featuring and promotion for private users." },
      { t: "Under a second",       d: "Clean mobile-first design with a flawless dark mode." },
    ],
    earlyAccess: "Early access for agencies",
    earlyAccessDesc: "Sign up before launch and test free for the first 2 months.",
    placeholder: "your@email.com",
    submit: "Sign up",
    submitting: "Sending…",
    success: "Thanks for signing up! We'll reach out before launch.",
  },
};

/* ── Mockup: feed oglasa u browser okviru (namjerno taman, glumi proizvod) ── */
function PlatformMock({ search }: { search: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-brand-500/25 bg-[#080D1E]
                    shadow-[0_44px_90px_-30px_rgba(37,99,235,0.5)]">
      {/* traka browsera */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/8 bg-white/[.03]">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="flex-1 ml-2 h-[18px] rounded-md bg-white/[.06]" />
      </div>
      <div className="p-4 sm:p-5">
        {/* pretraga */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[.05] border border-white/10 mb-4">
          <Search size={13} className="text-blue-300/80 flex-shrink-0" />
          <span className="text-[11px] text-blue-100/60 truncate">{search}</span>
          <span className="ml-auto w-14 h-5 rounded-md bg-blue-600 flex-shrink-0" />
        </div>
        {/* feed oglasa 2×2 */}
        <div className="grid grid-cols-2 gap-3" aria-hidden>
          {[
            "from-blue-400/50 to-indigo-600/30",
            "from-sky-400/50 to-blue-600/30",
            "from-indigo-400/50 to-blue-700/30",
            "from-cyan-400/45 to-blue-600/30",
          ].map((g, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[.04] overflow-hidden">
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${g}`}>
                <span className="absolute inset-0 opacity-30
                                 bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)]
                                 bg-[size:16px_16px]" />
                <Heart size={11} className="absolute top-2 right-2 text-white/70" />
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold
                                   bg-blue-600 text-white uppercase tracking-wide">Boost</span>
                )}
              </div>
              <div className="p-2.5">
                <div className="h-[7px] w-3/4 rounded bg-white/20 mb-1.5" />
                <div className="h-[7px] w-1/2 rounded bg-blue-400/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Plutajuća glass kartica ────────────────────────────────────────────────── */
function FloatChip({
  title, value, className, delay, icon: Icon,
}: { title: string; value: string; className: string; delay: number; icon: LucideIcon }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute z-10 flex items-center gap-2.5 pl-2.5 pr-3.5 py-2.5 rounded-2xl
                  border border-brand-500/30 bg-[var(--surface)]/85 backdrop-blur-md
                  shadow-[0_18px_40px_-12px_rgba(2,8,30,0.6)] ${className}`}
    >
      <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                       bg-brand-600/15 border border-brand-600/30 text-brand-600 dark:text-brand-400">
        <Icon size={14} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 leading-tight">
          {title}
        </span>
        <span className="block text-[11.5px] font-semibold text-[var(--text)] leading-tight whitespace-nowrap">
          {value}
        </span>
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" aria-hidden />
    </motion.div>
  );
}

export function SaasTeaser() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealHead  = useReveal();
  const revealStory = useReveal();
  const revealMock  = useReveal();
  const revealBento = useReveal();
  const revealCta   = useReveal();

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

  const CHIP_ICONS: LucideIcon[] = [Sparkles, RefreshCw, Landmark];

  return (
    <section id="saas" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      {/* pozadina: grid + radijalni sjaj, kontinuitet s Hero sekcijom */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.04] pointer-events-none
                      [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_70%_35%,rgba(37,99,235,0.09),transparent)]
                      dark:bg-[radial-gradient(ellipse_55%_45%_at_70%_35%,rgba(59,130,246,0.14),transparent)]" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── 1 · Header ─────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-16">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.label}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {d.heading1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </motion.h2>
        </motion.div>

        {/* ── 2 · Showcase: priča + mockup ───────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-10 items-center mb-16">

          {/* Priča */}
          <motion.div variants={staggerContainer} {...revealStory}>
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-brand-600/10 dark:bg-brand-500/15 border border-brand-600/25
                         text-brand-700 dark:text-brand-300 text-sm font-semibold mb-6">
              <Building2 size={15} />
              {d.badge}
            </motion.div>

            <motion.h3 variants={fadeUp} className="text-2xl lg:text-[32px] font-extrabold text-[var(--text)] mb-4 leading-tight tracking-tight">
              {d.title}
            </motion.h3>
            <motion.p variants={fadeUp} className="text-[var(--text-muted)] leading-relaxed mb-6">
              {d.desc}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
              {MARKETS.map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full text-xs font-semibold
                                         border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]">
                  {m}
                </span>
              ))}
            </motion.div>

            {/* Roadmap: dva čvora povezana gradijentnom linijom */}
            <motion.div variants={fadeUp} className="relative pl-1">
              <div className="absolute left-[22px] top-6 bottom-6 w-px bg-gradient-to-b from-brand-600 via-brand-500/60 to-brand-400/30" aria-hidden />
              {d.roadmap.map((r) => {
                const Icon = r.icon === "start" ? Hammer : Rocket;
                return (
                  <div key={r.date} className="relative flex items-center gap-4 py-2.5">
                    <span className="relative z-10 w-[44px] h-[44px] rounded-2xl flex items-center justify-center flex-shrink-0
                                     bg-[var(--surface)] border border-brand-600/35 text-brand-600 dark:text-brand-400
                                     shadow-lg shadow-brand-600/10">
                      <Icon size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-[var(--text)] leading-tight">{r.date}</span>
                      <span className="block text-xs text-[var(--text-muted)] mt-0.5">{r.label}</span>
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Mockup + plutajuće kartice */}
          <motion.div variants={slideInRight} {...revealMock} className="relative lg:pl-4">
            <div className="relative px-2 sm:px-6 pt-8 pb-10">
              {/* sjaj iza mockupa */}
              <div className="absolute inset-x-8 top-10 bottom-4 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" aria-hidden />

              <div className="relative [transform:perspective(1400px)_rotateY(-5deg)_rotateX(2deg)]
                              hover:[transform:perspective(1400px)_rotateY(0deg)_rotateX(0deg)]
                              transition-transform duration-700 will-change-transform">
                <PlatformMock search={d.mockSearch} />
              </div>

              <FloatChip icon={CHIP_ICONS[0]} title={d.chips[0][0]} value={d.chips[0][1]}
                         className="-top-1 -left-1 sm:left-0" delay={0} />
              <FloatChip icon={CHIP_ICONS[1]} title={d.chips[1][0]} value={d.chips[1][1]}
                         className="top-[38%] -right-1 sm:right-0" delay={2.1} />
              <FloatChip icon={CHIP_ICONS[2]} title={d.chips[2][0]} value={d.chips[2][1]}
                         className="-bottom-1 left-6 sm:left-10" delay={4.2} />
            </div>
          </motion.div>
        </div>

        {/* ── 3 · Bento: funkcionalnosti ─────────────────────────────────── */}
        <motion.div
          variants={staggerContainerSlow}
          {...revealBento}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-14"
        >
          {d.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <motion.div
                key={f.t}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-4 sm:p-5 overflow-hidden
                           bg-[var(--surface)] border border-[var(--border)]
                           transition-[border-color,box-shadow] duration-300
                           hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10"
              >
                <span className="inline-flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl items-center justify-center mb-3
                                 bg-brand-600/10 border border-brand-600/25 text-brand-600 dark:text-brand-400
                                 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={16} />
                </span>
                <h4 className="text-[13.5px] sm:text-[15px] font-extrabold text-[var(--text)] mb-1 leading-tight">{f.t}</h4>
                <p className="text-[11.5px] sm:text-[12.5px] text-[var(--text-muted)] leading-snug">{f.d}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── 4 · Early access traka ─────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealCta}>
          <motion.div
            variants={scaleIn}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #2563EB, #60A5FA, #818CF8) border-box",
              border: "1.5px solid transparent",
            }}
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-600/12 blur-3xl pointer-events-none" aria-hidden />
            <div className="relative px-6 py-7 sm:px-10 sm:py-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles size={15} className="text-brand-600 dark:text-brand-400" />
                  <p className="text-base sm:text-lg font-extrabold text-[var(--text)]">{d.earlyAccess}</p>
                </div>
                <p className="text-[13px] text-[var(--text-muted)]">{d.earlyAccessDesc}</p>
              </div>

              {submitted ? (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold lg:justify-end">
                  <CheckCircle2 size={16} />
                  {d.success}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 lg:min-w-[420px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={d.placeholder}
                    required
                    className="flex-1 px-4 py-3 rounded-xl text-sm bg-[var(--bg)]
                               border border-[var(--border)] text-[var(--text)]
                               placeholder:text-[var(--text-muted)] focus:outline-none
                               focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl
                               bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold
                               transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                               shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 whitespace-nowrap"
                  >
                    {loading ? d.submitting : (<>{d.submit} <ArrowRight size={13} /></>)}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
