/**
 * components/sections/Value.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Vrijednost / Why it pays off" — value-framing section that sits below Pricing.
 *
 *   • Two value cards (project payoff per day + monthly support/hosting per day)
 *     with animated count-up numbers and a relatable "coffee a day" comparison.
 *   • A Before → After comparison that shows the transformation (chaos → automated).
 *   • A closing CTA banner.
 *
 * Fully self-contained: bilingual text lives in this file (no i18n changes needed)
 * and it reads the current language from your LanguageProvider. Colors use your
 * CSS theme variables, so dark/light works automatically.
 *
 * USAGE: place this file in components/sections/, then render <Value /> in
 *        app/page.tsx — ideally right AFTER your <Pricing /> section.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, Coffee, Sparkles, Table2, Zap, Clock, CircleCheck, TriangleAlert, ShieldCheck, RefreshCw, MousePointerClick } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

/* ── Types & bilingual content ─────────────────────────────────────────────── */
type Cap = { pre: string; strong: string; post: string };
type Item = [string, string];
type Card = { label: string; lt: string; big: number; per: string; cap: Cap; coffee: string; items: Item[] };
type Pair = { bIcon: LucideIcon; b: string; bd: string; aIcon: LucideIcon; a: string; ad: string };
type Content = {
  eyebrow: string;
  h: [string, string, string];
  sub: string;
  project: Card;
  support: Card;
  trHead: string; trSub: string; beforeH: string; afterH: string;
  pairs: Pair[];
  summary: [string, string, string];
  banner: [string, string, string];
  bannerSub: string; btn: string;
};

const T: { bs: Content; en: Content } = {
  bs: {
    eyebrow: "ZAŠTO SE ISPLATI",
    h: ["Manje od ", "kafe dnevno", ". Vrijednost za cijeli biznis."],
    sub: "Razvučeno na dan, vaš sajt košta sitnicu. A radi za vas non-stop — donosi klijente, štedi vrijeme i sam se isplati.",
    project: {
      label: "KOMPLETAN PROJEKAT", lt: "manje od", big: 4.5, per: "/dan",
      cap: { pre: "u prvoj godini · zatim je ", strong: "zauvijek vaše", post: "" },
      coffee: "≈ kao dvije kafe dnevno za kompletan sajt",
      items: [
        ["Custom dizajn", "optimizovan za konverzije i prodaju"],
        ["100% vaše vlasništvo", "sajt je vaš, bez skrivenih uslova"],
        ["Sam se isplati", "kroz nove upite i klijente"],
      ],
    },
    support: {
      label: "PODRŠKA + HOSTING", lt: "manje od", big: 2.63, per: "/dan",
      cap: { pre: "mjesečno · ", strong: "otkažite bilo kad", post: "" },
      coffee: "manje od jedne kafe dnevno",
      items: [
        ["Podrška 24/7", "tu smo čim nešto zatreba"],
        ["Hosting uključen", "sajt uvijek živ, brz i online"],
        ["Izmjene u 2 klika", "bez čekanja i bez muke"],
      ],
    },
    trHead: "Od haosa do potpune kontrole",
    trSub: "Svaki problem koji ste imali — mi smo zamijenili rješenjem koje radi samo.",
    beforeH: "PRIJE", afterH: "SA NAMA",
    pairs: [
      { bIcon: Table2, b: "Excel tabele i ručne bilješke", bd: "sve razbacano na više mjesta", aIcon: Zap, a: "Sve automatizovano", ad: "jedan sistem, radi samo" },
      { bIcon: Clock, b: "Sati izgubljeni na administraciju", bd: "vrijeme koje nikad ne vratite", aIcon: CircleCheck, a: "Vrijeme za ono što je važno", ad: "fokus na rast biznisa" },
      { bIcon: TriangleAlert, b: "Propušteni upiti i greške", bd: "klijenti koji odu konkurenciji", aIcon: ShieldCheck, a: "Ništa se ne gubi", ad: "svaki upit zabilježen i siguran" },
      { bIcon: RefreshCw, b: "Sve ručno, sve sporo", bd: "svaka izmjena je muka", aIcon: MousePointerClick, a: "Gotovo u 2 klika", ad: "brzo, jednostavno, odmah" },
    ],
    summary: ["Rezultat: ", "više vremena, manje stresa", " i sistem koji radi za vas — non-stop."],
    banner: ["Plaćate manje od kafe dnevno — a dobijate ", "digitalnu mašinu", " koja radi za vas 24/7."],
    bannerSub: "Investicija koja se vrati već u prvih mjesec dana.",
    btn: "Zakaži besplatne konsultacije",
  },
  en: {
    eyebrow: "WHY IT PAYS OFF",
    h: ["Less than ", "a coffee a day", ". Value for your whole business."],
    sub: "Spread over a day, your website costs pennies. But it works for you non-stop — brings clients, saves time and pays for itself.",
    project: {
      label: "COMPLETE PROJECT", lt: "less than", big: 4.5, per: "/day",
      cap: { pre: "in the first year · then it's ", strong: "yours forever", post: "" },
      coffee: "≈ like two coffees a day for a full website",
      items: [
        ["Custom design", "optimized for conversions and sales"],
        ["100% your ownership", "the site is yours, no hidden terms"],
        ["Pays for itself", "through new inquiries and clients"],
      ],
    },
    support: {
      label: "SUPPORT + HOSTING", lt: "less than", big: 2.63, per: "/day",
      cap: { pre: "monthly · ", strong: "cancel anytime", post: "" },
      coffee: "less than one coffee a day",
      items: [
        ["24/7 support", "we're here the moment you need us"],
        ["Hosting included", "site always live, fast and online"],
        ["Edits in 2 clicks", "no waiting, no hassle"],
      ],
    },
    trHead: "From chaos to full control",
    trSub: "Every problem you used to have — we replaced it with a solution that runs itself.",
    beforeH: "BEFORE", afterH: "WITH US",
    pairs: [
      { bIcon: Table2, b: "Spreadsheets and manual notes", bd: "everything scattered everywhere", aIcon: Zap, a: "Everything automated", ad: "one system, runs itself" },
      { bIcon: Clock, b: "Hours lost on admin", bd: "time you never get back", aIcon: CircleCheck, a: "Time for what matters", ad: "focus on growing the business" },
      { bIcon: TriangleAlert, b: "Missed inquiries and errors", bd: "clients who go to competitors", aIcon: ShieldCheck, a: "Nothing gets lost", ad: "every inquiry captured and safe" },
      { bIcon: RefreshCw, b: "All manual, all slow", bd: "every change is a hassle", aIcon: MousePointerClick, a: "Done in 2 clicks", ad: "fast, simple, instant" },
    ],
    summary: ["The result: ", "more time, less stress", " and a system that works for you — non-stop."],
    banner: ["You pay less than a coffee a day — and get a ", "digital machine", " that works for you 24/7."],
    bannerSub: "An investment that pays off in the very first month.",
    btn: "Book a free consultation",
  },
};

/* ── In-view hook ──────────────────────────────────────────────────────────── */
function useInView<E extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<E>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ── Decimal count-up ──────────────────────────────────────────────────────── */
function DecimalCounter({ target, inView, comma }: { target: number; inView: boolean; comma: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const dur = 1500;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setV(ease(p) * target);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  const txt = v.toFixed(2);
  return <>{comma ? txt.replace(".", ",") : txt}</>;
}

/* ── Value card ────────────────────────────────────────────────────────────── */
function ValueCard({ card, inView, comma, accent }: { card: Card; inView: boolean; comma: boolean; accent: boolean }) {
  return (
    <div
      className={`group relative rounded-[26px] p-7 sm:p-9 backdrop-blur-md overflow-hidden
                  transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-600/20
                  ${accent
                    ? "border-[1.5px] border-brand-600/35 bg-[linear-gradient(160deg,rgba(37,99,235,0.12),var(--surface)_55%)]"
                    : "border border-[var(--border)] bg-[var(--surface)]"}`}
    >
      {accent && (
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
             style={{ background: "radial-gradient(circle at top right, rgba(37,99,235,.25), transparent 70%)" }} />
      )}
      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-brand-600 dark:text-brand-400 mb-5 px-3 py-1.5 border border-[var(--border)] rounded-full bg-[var(--surface)]">
        {card.label}
      </span>

      <div className="flex items-baseline gap-1.5 flex-wrap mb-1.5">
        <span className="text-xl font-bold text-[var(--text-muted)]">{card.lt}</span>
        <span className="text-[56px] leading-none font-extrabold tracking-tight text-[var(--text)]">
          €<DecimalCounter target={card.big} inView={inView} comma={comma} />
        </span>
        <span className="text-lg font-semibold text-[var(--text-muted)]">{card.per}</span>
      </div>

      <p className="text-sm text-[var(--text-muted)] mb-4">
        {card.cap.pre}<strong className="text-[var(--text)] font-semibold">{card.cap.strong}</strong>{card.cap.post}
      </p>

      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[13px] font-semibold mb-6">
        {accent ? <Sparkles size={16} className="text-brand-500" /> : <Coffee size={16} className="text-brand-500" />}
        {card.coffee}
      </div>

      <div className="flex flex-col gap-3">
        {card.items.map(([title, desc]) => (
          <div key={title} className="flex items-start gap-3 text-sm">
            <span className={`flex-shrink-0 w-[22px] h-[22px] rounded-lg flex items-center justify-center mt-0.5
                              ${accent ? "bg-brand-600/15 text-brand-600 dark:text-brand-400" : "bg-green-500/15 text-green-500"}`}>
              <Check size={12} strokeWidth={3} />
            </span>
            <span>
              <b className="text-[var(--text)] font-semibold">{title}</b>{" "}
              <span className="text-[var(--text-muted)]">— {desc}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Value() {
  const langCtx = useLanguage() as any;
  const lang: "bs" | "en" =
    langCtx?.language || langCtx?.lang || (langCtx?.t?.nav?.contact === "Kontakt" ? "bs" : "en");
  const d = T[lang] || T.bs;
  const comma = lang === "bs";

  const [headRef, headIn] = useInView<HTMLDivElement>(0.2);
  const [cardsRef, cardsIn] = useInView<HTMLDivElement>(0.25);
  const [baRef, baIn] = useInView<HTMLDivElement>(0.2);
  const [ctaRef, ctaIn] = useInView<HTMLDivElement>(0.2);

  const revealCls = (on: boolean) =>
    `transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`;

  return (
    <section id="vrijednost" className="py-28 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-brand-600/10 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-green-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headRef} className={`text-center mb-16 ${revealCls(headIn)}`}>
          <p className="text-brand-600 dark:text-brand-400 text-sm font-bold tracking-widest uppercase mb-3.5">{d.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]">
            {d.h[0]}
            <span className="bg-[linear-gradient(120deg,#2563EB,#60A5FA)] bg-clip-text text-transparent">{d.h[1]}</span>
            {d.h[2]}
          </h2>
          <p className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">{d.sub}</p>
        </div>

        {/* Value cards */}
        <div ref={cardsRef} className={`grid md:grid-cols-2 gap-6 mb-8 ${revealCls(cardsIn)}`}>
          <ValueCard card={d.project} inView={cardsIn} comma={comma} accent />
          <ValueCard card={d.support} inView={cardsIn} comma={comma} accent={false} />
        </div>

        {/* Transformation — paired before → after rows */}
        <div ref={baRef} className={`rounded-[26px] p-7 sm:p-9 bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md mb-8 ${revealCls(baIn)}`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold tracking-tight mb-2">{d.trHead}</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">{d.trSub}</p>
          </div>

          {/* Column labels (desktop only) — pure text, no borders/lines */}
          <div className="hidden sm:grid grid-cols-[1fr_56px_1fr] gap-4 mb-5 border-0">
            <div className="flex items-center gap-2 text-[12px] font-extrabold tracking-wider uppercase text-red-400 border-0 bg-transparent">
              <span className="w-2 h-2 rounded-full bg-red-400" /> {d.beforeH}
            </div>
            <div />
            <div className="flex items-center gap-2 text-[12px] font-extrabold tracking-wider uppercase text-green-500 border-0 bg-transparent">
              <span className="w-2 h-2 rounded-full bg-green-500" /> {d.afterH}
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-7 sm:gap-4">
            {d.pairs.map((p, i) => {
              const BIcon = p.bIcon;
              const AIcon = p.aIcon;
              return (
                <div key={i} className="group grid sm:grid-cols-[1fr_56px_1fr] grid-cols-1 gap-2 sm:gap-4 items-stretch">
                  {/* Before */}
                  <div className="flex items-center gap-3.5 sm:gap-4 px-4 sm:px-5 py-4 rounded-[18px] bg-[var(--surface)] border border-[var(--border)] opacity-[0.72] group-hover:opacity-95 transition-all duration-300">
                    <span className="flex-shrink-0 w-[42px] h-[42px] rounded-xl bg-red-400/12 text-red-400 flex items-center justify-center">
                      <BIcon size={21} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold leading-tight text-[var(--text-muted)]">{p.b}</span>
                      <span className="block text-[12.5px] text-[var(--text-muted)] opacity-70 mt-0.5">{p.bd}</span>
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/40 rotate-90 sm:rotate-0 group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight size={18} />
                    </div>
                  </div>

                  {/* After */}
                  <div className="flex items-center gap-3.5 sm:gap-4 px-4 sm:px-5 py-4 rounded-[18px] border border-green-500/25 bg-[linear-gradient(120deg,rgba(74,222,128,0.1),var(--surface)_70%)] group-hover:translate-x-1 group-hover:border-green-500/45 group-hover:shadow-xl group-hover:shadow-green-500/10 transition-all duration-300">
                    <span className="flex-shrink-0 w-[42px] h-[42px] rounded-xl bg-green-500/15 text-green-500 flex items-center justify-center">
                      <AIcon size={21} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold leading-tight text-[var(--text)]">{p.a}</span>
                      <span className="block text-[12.5px] text-[var(--text-muted)] mt-0.5">{p.ad}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary strip */}
          <div className="mt-7 text-center px-6 py-5 rounded-[18px] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(74,222,128,0.06))] border border-[var(--border)]">
            <span className="text-[15px] text-[var(--text-muted)]">
              {d.summary[0]}<b className="text-[var(--text)] font-bold">{d.summary[1]}</b>{d.summary[2]}
            </span>
          </div>
        </div>

        {/* CTA banner */}
        <div
          ref={ctaRef}
          className={`rounded-[26px] p-7 sm:p-11 text-center bg-[linear-gradient(135deg,rgba(37,99,235,0.2),rgba(37,99,235,0.05))] border border-brand-600/30 ${revealCls(ctaIn)}`}
        >
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-3 leading-snug">
            {d.banner[0]}
            <span className="text-brand-600 dark:text-brand-400">{d.banner[1]}</span>
            {d.banner[2]}
          </h3>
          <p className="text-[var(--text-muted)] text-[15px] sm:text-base mb-7">{d.bannerSub}</p>
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm sm:text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40"
          >
            <span>{d.btn}</span>
            <ArrowRight size={18} className="flex-shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
