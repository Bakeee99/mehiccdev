/**
 * components/sections/Value.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Zašto se isplati" — kompaktna value sekcija ispod cjenovnika (v2).
 *
 * v2 promjene:
 *   • Znatno kraća na mobitelu: dvije cjenovne kartice stoje JEDNA UZ DRUGU
 *     i na telefonu, check-stavke su spojene u jedan red čipova, a
 *     PRIJE → SA NAMA tabela je sabijena u 4 jednolinijska reda.
 *   • Brojke usklađene s paketima web aplikacija iz Pricing sekcije:
 *       Starter €900 + €49/mj  →  prva godina = €1.488  →  od €4,10/dan
 *       samo podrška €50/mj →  od €1,70/dan (manje od jedne kafe)
 *     Uz napomenu da je računica za Starter, a Business/Premium su iznad.
 *
 * Self-contained (BS/EN u fajlu), useReveal pattern, dark/light tema.
 */

"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Coffee } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, scaleIn } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

/* ── Types & bilingual content ─────────────────────────────────────────────── */
type Card = { label: string; lt: string; big: string; per: string; capPre: string; capStrong: string };
type Pair = { b: string; a: string };
type Content = {
  eyebrow: string;
  h: [string, string, string];
  sub: string;
  cards: [Card, Card];
  coffee: string;
  chips: string[];
  note: string;
  trHead: string;
  pairs: Pair[];
  summary: [string, string, string];
  banner: [string, string, string];
  bannerSub: string;
  btn: string;
};

const T: { bs: Content; en: Content } = {
  bs: {
    eyebrow: "ZAŠTO SE ISPLATI",
    h: ["Zvuči kao velika investicija? ", "Nije", "."],
    sub: "Starter aplikacija razvučena na prvu godinu ispadne oko tri eura dnevno, a mjesečno održavanje manje od jedne kafe. I radi za vas non-stop.",
    cards: [
      { label: "KOMPLETNA APLIKACIJA", lt: "od", big: "€3,20", per: "/dan", capPre: "prva godina · zatim je ", capStrong: "zauvijek vaša" },
      { label: "MJESEČNA PODRŠKA", lt: "od", big: "€1,70", per: "/dan", capPre: "€50 mjesečno · ", capStrong: "otkažite bilo kad" },
    ],
    coffee: "održavanje košta manje od jedne kafe dnevno",
    chips: ["Dizajn po mjeri", "Aplikacija je vaša", "3 mjeseca podrške", "Hosting i domena podešeni", "Izmjene bez developera"],
    note: "Računica za Starter paket (€550 + €50/mj podrška, koja je opciona). Hosting se plaća zasebno po potrošnji. Business i Premium paketi su u cjenovniku iznad.",
    trHead: "Od haosa do potpune kontrole",
    pairs: [
      { b: "Excel tabele i ručne bilješke", a: "Sve na jednom mjestu" },
      { b: "Sati izgubljeni na administraciju", a: "Vrijeme za rast biznisa" },
      { b: "Propušteni upiti i greške", a: "Svaki upit zabilježen" },
      { b: "Sve ručno, sve sporo", a: "Gotovo u 2 klika" },
    ],
    summary: ["Rezultat: ", "više vremena, manje stresa", " i sistem koji radi za vas, non-stop."],
    banner: ["Održavanje manje od kafe dnevno, a dobijate ", "sistem koji radi 24/7", "."],
    bannerSub: "Računicu za vaš slučaj napravimo na besplatnim konsultacijama.",
    btn: "Zakaži besplatne konsultacije",
  },
  en: {
    eyebrow: "WHY IT PAYS OFF",
    h: ["Sounds like a big investment? ", "It isn't", "."],
    sub: "Spread over the first year, a Starter app comes to about three euros a day, and monthly support costs less than a coffee. And it works for you non-stop.",
    cards: [
      { label: "COMPLETE APP", lt: "from", big: "€3.20", per: "/day", capPre: "first year · then it's ", capStrong: "yours forever" },
      { label: "MONTHLY SUPPORT", lt: "from", big: "€1.70", per: "/day", capPre: "€50 monthly · ", capStrong: "cancel anytime" },
    ],
    coffee: "support costs less than one coffee a day",
    chips: ["Design made for you", "The app is yours", "3 months of support", "Hosting and domain set up", "Edits without a developer"],
    note: "Based on the Starter package (€550 + €50/mo optional support). Hosting is billed separately based on usage. Business and Premium packages are in the pricing above.",
    trHead: "From chaos to full control",
    pairs: [
      { b: "Spreadsheets and manual notes", a: "Everything automated" },
      { b: "Hours lost on admin", a: "Time to grow the business" },
      { b: "Missed inquiries and errors", a: "Every inquiry captured" },
      { b: "All manual, all slow", a: "Done in 2 clicks" },
    ],
    summary: ["The result: ", "more time, less stress", " and a system that works for you, non-stop."],
    banner: ["Support for less than a coffee a day, and you get ", "a system that works 24/7", "."],
    bannerSub: "We'll run the numbers for your case in a free consultation.",
    btn: "Book a free consultation",
  },
};

export function Value() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealHead   = useReveal();
  const revealCards  = useReveal();
  const revealTrans  = useReveal();
  const revealBanner = useReveal();

  return (
    <section id="vrijednost" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute -right-48 top-1/4 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />

      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-10">
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.eyebrow}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
            {d.h[0]}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.h[1]}</span>
            {d.h[2]}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[var(--text-muted)] max-w-xl mx-auto mt-4 text-[15px] leading-relaxed">
            {d.sub}
          </motion.p>
        </motion.div>

        {/* ── Cijena po danu: dvije kartice jedna uz drugu i na mobitelu ── */}
        <motion.div variants={staggerContainerSlow} {...revealCards}>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {d.cards.map((c, i) => (
              <motion.div
                key={c.label}
                variants={scaleIn}
                className={`relative rounded-2xl p-4 sm:p-6 overflow-hidden border
                            transition-[border-color,box-shadow] duration-300
                            ${i === 0
                              ? "bg-[var(--surface)] border-brand-600/30 hover:border-brand-600/50 hover:shadow-xl hover:shadow-brand-600/10"
                              : "bg-[var(--surface)] border-[var(--border)] hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"}`}
              >
                <span className={`text-[10px] sm:text-[11px] font-bold tracking-widest ${i === 0 ? "text-brand-600 dark:text-brand-400" : "text-green-600 dark:text-green-400"}`}>
                  {c.label}
                </span>
                <div className="flex items-baseline gap-1.5 mt-2 mb-1 flex-wrap">
                  <span className="text-xs text-[var(--text-muted)]">{c.lt}</span>
                  <b className="text-[26px] sm:text-4xl font-extrabold tracking-tight text-[var(--text)] leading-none">{c.big}</b>
                  <span className="text-xs sm:text-sm text-[var(--text-muted)]">{c.per}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-snug">
                  {c.capPre}<b className="text-[var(--text)] font-semibold">{c.capStrong}</b>
                </p>
              </motion.div>
            ))}
          </div>

          {/* kafa poređenje + čipovi + napomena */}
          <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
                             text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/30">
              <Coffee size={13} /> {d.coffee}
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {d.chips.map((ch) => (
                <span key={ch} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium
                                          text-[var(--text)] bg-[var(--surface)] border border-[var(--border)]">
                  <Check size={11} strokeWidth={3.5} className="text-brand-600 dark:text-brand-400" /> {ch}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] text-center max-w-md">{d.note}</p>
          </motion.div>
        </motion.div>

        {/* ── Transformacija: 4 kompaktna reda ───────────────────────────── */}
        <motion.div variants={staggerContainerSlow} {...revealTrans} className="mt-12">
          <motion.h3 variants={fadeUp} className="text-center text-xl sm:text-2xl font-extrabold tracking-tight mb-6">
            {d.trHead}
          </motion.h3>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
            {d.pairs.map((p) => (
              <motion.div
                key={p.a}
                variants={fadeUp}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5"
              >
                <span className="flex-1 text-[12.5px] sm:text-sm text-[var(--text-muted)] line-through decoration-red-500/50 decoration-[1.5px] leading-snug">
                  {p.b}
                </span>
                <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                                 bg-brand-600/10 border border-brand-600/25 text-brand-600 dark:text-brand-400">
                  <ArrowRight size={13} />
                </span>
                <span className="flex-1 inline-flex items-center gap-2 text-[12.5px] sm:text-sm font-semibold text-green-600 dark:text-green-400 leading-snug">
                  <Check size={13} strokeWidth={3.5} className="flex-shrink-0" /> {p.a}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeUp} className="text-center text-[12.5px] sm:text-sm text-[var(--text-muted)] mt-4">
            {d.summary[0]}<b className="text-[var(--text)] font-semibold">{d.summary[1]}</b>{d.summary[2]}
          </motion.p>
        </motion.div>

        {/* ── CTA traka ──────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealBanner} className="mt-12">
          <motion.div
            variants={scaleIn}
            className="relative rounded-2xl overflow-hidden border border-brand-600/30
                       bg-[var(--surface)] px-6 py-6 sm:px-9 sm:py-7
                       flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent_72%)] pointer-events-none" aria-hidden />
            <div className="relative flex-1">
              <p className="text-base sm:text-lg font-bold leading-snug">
                {d.banner[0]}
                <span className="text-gradient font-serif italic font-semibold">{d.banner[1]}</span>
                {d.banner[2]}
              </p>
              <p className="text-[12.5px] text-[var(--text-muted)] mt-1.5">{d.bannerSub}</p>
            </div>
            <a
              href="#kontakt"
              className="relative flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                         bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold
                         shadow-lg shadow-brand-600/30
                         transition-[background-color,transform,box-shadow] duration-300
                         hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40"
            >
              {d.btn} <ArrowRight size={15} />
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
