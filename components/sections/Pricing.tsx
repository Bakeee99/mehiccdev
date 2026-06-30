/**
 * components/sections/Pricing.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Cjenovnik — fully bilingual (BS/EN) + dark/light theme aware. Self-contained:
 * all package data lives here (no i18n changes needed).
 *
 * Two blocks:
 *   1. Web application packages (Starter / Business / Premium) — one-time build
 *      price + monthly hosting/support, each with a FREE first-month marketing pack.
 *   2. Marketing packages (Start / Rast / Dominacija) — continue after the free month.
 *
 * Responsive: 3 columns on desktop, stacks to 1 column on mobile.
 * Edit any text/price below in the PRICING object.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Car, Crown, Rocket, TrendingUp, Star,
  Gift, Check, ArrowRight,
} from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ── Types ───────────────────────────────────────────────────────────────────
type AppPlan = { name: string; tag: string; price: string; monthly: string; from?: boolean; gift: string; features: string[] };
type MktPlan = { name: string; tag: string; price: string; note: string; features: string[] };
type PricingData = {
  eyebrow: string; heading: string; subtitle: string;
  buildLabel: string; once: string; monthlyLabel: string; monthlySub: string;
  perMonth: string; from: string; popular: string;
  giftPre: string; giftPost: string; cta: string; appNote: string; apps: AppPlan[];
  mktEyebrow: string; mktHeading: string; mktSubtitle: string; mktCta: string; mktNote: string; mkt: MktPlan[];
};

// ── Content (BS / EN) ─────────────────────────────────────────────────────────
const PRICING: Record<"bs" | "en", PricingData> = {
  bs: {
    eyebrow: "WEB APLIKACIJE",
    heading: "Poslovne aplikacije po mjeri",
    subtitle:
      "Dashboard, rezervacije, evidencija ili interni alat — gradimo aplikaciju koja vodi vaš biznis. Uz svaki paket: prvi mjesec marketinga gratis.",
    buildLabel: "Razvoj (jednokratno)",
    once: "jednokratno",
    monthlyLabel: "Hosting + podrška",
    monthlySub: "hosting · održavanje · podrška",
    perMonth: "/mj",
    from: "od",
    popular: "Najpopularniji",
    giftPre: "Gratis marketing paket",
    giftPost: "— prvi mjesec",
    cta: "Zatraži ponudu",
    appNote:
      "Cijene su početne — finalna ponuda ovisi o obimu i složenosti aplikacije. Uz svaku aplikaciju prvi mjesec marketinga je besplatan; nastavlja se samo uz vašu saglasnost.",
    apps: [
      {
        name: "Starter", tag: "Jedan alat koji rješava jedan problem — npr. evidencija ili jednostavan katalog.",
        price: "900", monthly: "49", gift: "Start",
        features: [
          "Jedna glavna funkcija (npr. katalog vozila ili evidencija klijenata)",
          "Vi i vaš tim se prijavljujete lozinkom",
          "Dodavanje, izmjena i brisanje podataka kroz jednostavan panel",
          "Forma preko koje vam klijenti šalju upite na email",
          "Radi savršeno na mobitelu i računaru",
          "Hosting, SSL i domena podešeni — ništa tehničko ne radite vi",
        ],
      },
      {
        name: "Business", tag: "Kompletna aplikacija za firmu — kao Maximum Rent a Car kojeg smo izgradili.",
        price: "2.200", monthly: "99", gift: "Rast",
        features: [
          "SVE iz Startera, plus:",
          "Više povezanih dijelova (katalog + upiti + admin panel)",
          "Više uloga — vlasnik vidi sve, osoblje samo svoje",
          "Galerija slika s upload-om i pregledom",
          "Upiti s datumima, lokacijama i statusom (novo / obrađeno)",
          "Obavijesti na email i WhatsApp kad stigne novi upit",
          "Dvojezično (BS + EN) za domaće i strane klijente",
          "SEO + Google vidljivost",
        ],
      },
      {
        name: "Premium", tag: "Aplikacija bez ograničenja — kreirana tačno oko vašeg procesa.",
        price: "4.500", monthly: "179", from: true, gift: "Dominacija",
        features: [
          "SVE iz Business paketa, plus:",
          "Neograničeni dijelovi i funkcije po vašoj želji",
          "Online plaćanje i depozit",
          "Povezivanje s drugim alatima (Google Calendar, računovodstvo, API)",
          "Automatizacije — sistem sam radi rutinske poslove umjesto vas",
          "Detaljne dozvole po članu tima",
          "Prioritetna podrška i dedikovani developer",
        ],
      },
    ],
    mktEyebrow: "Gratis prvi mjesec",
    mktHeading: "Marketing paketi",
    mktSubtitle: "Prvi mjesec je gratis uz svaku aplikaciju. Nakon toga nastavljate samo ako želite:",
    mktCta: "Više o paketu",
    mktNote:
      "Marketing paketi su opcionalni. Budžet koji ide direktno Meti/Google-u za reklame plaća se zasebno.",
    mkt: [
      {
        name: "Start", tag: "Osnovno prisustvo da vas ljudi nađu.", price: "30", note: "bez ugovorne obaveze",
        features: ["1 platforma (Instagram ili Facebook)", "8 objava mjesečno", "Postavka Google Business profila", "Osnovni mjesečni izvještaj"],
      },
      {
        name: "Rast", tag: "Aktivan rast i prve reklame koje donose upite.", price: "75", note: "budžet za reklame zaseban",
        features: ["2 platforme (Instagram + Facebook)", "16 objava + Stories / Reels", "1 aktivna reklamna kampanja", "Mjesečna content strategija", "Analytics + mjesečni izvještaj"],
      },
      {
        name: "Dominacija", tag: "Pun nastup — dominacija u vašem gradu.", price: "125", note: "budžet za reklame zaseban",
        features: ["SVE iz paketa Rast, plus:", "Pun content kalendar (do 30 objava)", "Više reklamnih kampanja (Meta + Google)", "Reels produkcija + community management", "Strateški pozivi + prioritetna podrška"],
      },
    ],
  },
  en: {
    eyebrow: "WEB APPLICATIONS",
    heading: "Custom business applications",
    subtitle:
      "Dashboard, bookings, records or internal tool — we build the app that runs your business. With every package: the first month of marketing free.",
    buildLabel: "Development (one-time)",
    once: "one-time",
    monthlyLabel: "Hosting + support",
    monthlySub: "hosting · maintenance · support",
    perMonth: "/mo",
    from: "from",
    popular: "Most popular",
    giftPre: "Free marketing package",
    giftPost: "— first month",
    cta: "Request a quote",
    appNote:
      "Prices are starting points — the final quote depends on the scope and complexity of the app. With every app the first month of marketing is free; it continues only with your consent.",
    apps: [
      {
        name: "Starter", tag: "One tool that solves one problem — e.g. records or a simple catalog.",
        price: "900", monthly: "49", gift: "Start",
        features: [
          "One main feature (e.g. vehicle catalog or client records)",
          "You and your team log in with a password",
          "Add, edit and delete data through a simple panel",
          "A form your clients use to send you inquiries by email",
          "Works perfectly on mobile and desktop",
          "Hosting, SSL and domain set up — no tech work for you",
        ],
      },
      {
        name: "Business", tag: "A complete app for your company — like the Maximum Rent a Car we built.",
        price: "2,200", monthly: "99", gift: "Rast",
        features: [
          "EVERYTHING in Starter, plus:",
          "Multiple connected parts (catalog + inquiries + admin panel)",
          "Multiple roles — owner sees all, staff see their own",
          "Image gallery with upload and preview",
          "Inquiries with dates, locations and status (new / handled)",
          "Email and WhatsApp alerts on every new inquiry",
          "Bilingual (BS + EN) for local and foreign clients",
          "SEO + Google visibility",
        ],
      },
      {
        name: "Premium", tag: "An app without limits — built exactly around your process.",
        price: "4,500", monthly: "179", from: true, gift: "Dominacija",
        features: [
          "EVERYTHING in Business, plus:",
          "Unlimited parts and features to your spec",
          "Online payment and deposit",
          "Connections to other tools (Google Calendar, accounting, API)",
          "Automations — the system handles routine work for you",
          "Detailed permissions per team member",
          "Priority support and a dedicated developer",
        ],
      },
    ],
    mktEyebrow: "Free first month",
    mktHeading: "Marketing packages",
    mktSubtitle: "The first month is free with every app. After that, you continue only if you want to:",
    mktCta: "Learn more",
    mktNote:
      "Marketing packages are optional. The budget that goes directly to Meta/Google for ads is paid separately.",
    mkt: [
      {
        name: "Start", tag: "Basic presence so people can find you.", price: "30", note: "no contract commitment",
        features: ["1 platform (Instagram or Facebook)", "8 posts per month", "Google Business profile setup", "Basic monthly report"],
      },
      {
        name: "Growth", tag: "Active growth and first ads that bring inquiries.", price: "75", note: "ad budget separate",
        features: ["2 platforms (Instagram + Facebook)", "16 posts + Stories / Reels", "1 active ad campaign", "Monthly content strategy", "Analytics + monthly report"],
      },
      {
        name: "Domination", tag: "Full presence — dominate your city.", price: "125", note: "ad budget separate",
        features: ["EVERYTHING in Growth, plus:", "Full content calendar (up to 30 posts)", "Multiple ad campaigns (Meta + Google)", "Reels production + community management", "Strategy calls + priority support"],
      },
    ],
  },
};

const APP_ICONS = [LayoutDashboard, Car, Crown];
const MKT_ICONS = [Rocket, TrendingUp, Star];

const isHeader = (f: string) => f.startsWith("SVE") || f.startsWith("EVERYTHING");

export function Pricing() {
  const { lang } = useLanguage();
  // Keeps the section visible after a language/theme switch (no re-hide on re-render)
  const [seen, setSeen] = useState(false);
  const d = PRICING[(lang as "bs" | "en")] ?? PRICING.bs;

  return (
    <section id="cjenovnik" className="py-28 lg:py-36 relative overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      {/* Subtle background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full
                      bg-brand-600/8 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* ════ WEB APPLICATION PACKAGES ════ */}
        <motion.div
          variants={staggerContainer}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {d.eyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {d.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {d.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {d.apps.map((plan, i) => {
            const Icon = APP_ICONS[i] ?? Star;
            const popular = i === 1;
            return (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`relative flex flex-col p-7 rounded-3xl bg-[var(--surface)]/80 backdrop-blur-sm
                            transition-all duration-300 hover:-translate-y-2
                            ${popular
                              ? "border-2 border-brand-600 shadow-2xl shadow-brand-600/20"
                              : "border border-[var(--border)] hover:shadow-xl hover:shadow-brand-600/10"}`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                      <Star size={11} fill="currentColor" /> {d.popular}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-400 text-white flex-shrink-0">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text)]">{plan.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-5 min-h-[52px] leading-relaxed">{plan.tag}</p>

                {/* Build (one-time) price */}
                <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] mb-1">{d.buildLabel}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  {plan.from && <span className="text-base font-semibold text-[var(--text-muted)]">{d.from}</span>}
                  <span className="text-4xl font-extrabold text-[var(--text)]">€{plan.price}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-4">{d.once}</p>

                {/* Free marketing banner */}
                <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/25 px-3 py-2.5 mb-3">
                  <Gift size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-xs leading-snug">
                    <span className="font-bold text-green-600 dark:text-green-400">{d.giftPre} «{plan.gift}»</span>{" "}
                    <span className="text-[var(--text-muted)]">{d.giftPost}</span>
                  </p>
                </div>

                {/* Monthly hosting + support */}
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/40 px-3.5 py-3 mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{d.monthlyLabel}</p>
                  <p className="text-lg font-extrabold text-[var(--text)] mt-0.5">
                    {plan.from && <span className="text-sm font-semibold text-[var(--text-muted)]">{d.from} </span>}
                    €{plan.monthly}<span className="text-sm font-semibold text-[var(--text-muted)]">{d.perMonth}</span>
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{d.monthlySub}</p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) =>
                    isHeader(f) ? (
                      <li key={f} className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] mt-1">{f}</li>
                    ) : (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-600/10 dark:bg-brand-500/15 flex items-center justify-center text-brand-600 dark:text-brand-400 mt-0.5">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    )
                  )}
                </ul>

                <a
                  href="#kontakt"
                  className={`mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-semibold text-sm transition-all
                              ${popular
                                ? "bg-brand-600 hover:bg-brand-700 text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40"
                                : "border border-[var(--border)] text-[var(--text)] hover:border-brand-600/40"}`}
                >
                  <span>{d.cta}</span>
                  <ArrowRight size={17} className="flex-shrink-0" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          {d.appNote}
        </motion.p>

        {/* ════ MARKETING PACKAGES ════ */}
        <motion.div
          variants={staggerContainer}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center mb-14 mt-24"
        >
          <motion.p variants={fadeUp} className="text-green-600 dark:text-green-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {d.mktEyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {d.mktHeading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {d.mktSubtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {d.mkt.map((plan, i) => {
            const Icon = MKT_ICONS[i] ?? Rocket;
            const popular = i === 1;
            return (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`relative flex flex-col p-7 rounded-3xl bg-[var(--surface)]/80 backdrop-blur-sm
                            transition-all duration-300 hover:-translate-y-2
                            ${popular
                              ? "border-2 border-green-500 shadow-2xl shadow-green-500/20"
                              : "border border-green-500/20 hover:shadow-xl hover:shadow-green-500/10"}`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                      <Star size={11} fill="currentColor" /> {d.popular}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-600 to-green-400 text-white flex-shrink-0">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text)]">{plan.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-5 min-h-[40px] leading-relaxed">{plan.tag}</p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-[var(--text)]">€{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)] font-medium">{d.perMonth}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-5">{plan.note}</p>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) =>
                    isHeader(f) ? (
                      <li key={f} className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] mt-1">{f}</li>
                    ) : (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 dark:bg-green-500/15 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    )
                  )}
                </ul>

                <a
                  href="#kontakt"
                  className="mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-semibold text-sm
                             border border-[var(--border)] text-[var(--text)] hover:border-green-500/40 transition-all"
                >
                  <span>{d.mktCta}</span>
                  <ArrowRight size={17} className="flex-shrink-0" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial={seen ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          onViewportEnter={() => setSeen(true)}
          className="text-center text-xs text-[var(--text-muted)] mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          {d.mktNote}
        </motion.p>
      </div>
    </section>
  );
}
