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
import { Check, X, ArrowRight, Coffee, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

/* ── Types & bilingual content ─────────────────────────────────────────────── */
type Cap = { pre: string; strong: string; post: string };
type Item = [string, string];
type Card = { label: string; lt: string; big: number; per: string; cap: Cap; coffee: string; items: Item[] };
type Content = {
  eyebrow: string;
  h: [string, string, string];
  sub: string;
  project: Card;
  support: Card;
  baHead: string; beforeH: string; afterH: string;
  before: string[]; after: string[];
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
    baHead: "Šta se mijenja kad radite s nama",
    beforeH: "PRIJE", afterH: "SA NAMA",
    before: ["Excel tabele i ručne bilješke", "Sati izgubljeni na administraciju", "Propušteni upiti i greške", "Sve ručno, sve sporo"],
    after: ["Sve automatizovano — radi samo", "Vrijeme za ono što je važno", "Ništa se ne gubi, sve pod kontrolom", "Gotovo u 2 klika"],
    banner: ["Plaćate manje od kafe dnevno — a dobijate ", "digitalnu mašinu", " koja radi za vas 24/7."],
    bannerSub: "Investicija koja se vrati već u prvih mjesec dana.",
    btn: "Zakaži besplatne konsultacije →",
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
    baHead: "What changes when you work with us",
    beforeH: "BEFORE", afterH: "WITH US",
    before: ["Spreadsheets and manual notes", "Hours lost on admin", "Missed inquiries and errors", "All manual, all slow"],
    after: ["Everything automated — runs itself", "Time for what actually matters", "Nothing lost, all under control", "Done in 2 clicks"],
    banner: ["You pay less than a coffee a day — and get a ", "digital machine", " that works for you 24/7."],
    bannerSub: "An investment that pays off in the very first month.",
    btn: "Book a free consultation →",
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
      className={`group relative rounded-[26px] p-9 backdrop-blur-md overflow-hidden
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

        {/* Before / After */}
        <div ref={baRef} className={`rounded-[26px] p-9 bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md mb-8 ${revealCls(baIn)}`}>
          <h3 className="text-center text-xl font-bold mb-7">{d.baHead}</h3>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="p-5">
              <h4 className="text-[13px] font-bold uppercase tracking-wide text-red-400 mb-4 flex items-center gap-2">
                <X size={15} strokeWidth={3} /> {d.beforeH}
              </h4>
              <ul className="flex flex-col gap-3">
                {d.before.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                    <X size={15} strokeWidth={2.5} className="text-red-400 flex-shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center md:rotate-0 rotate-90 my-1">
              <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/40">
                <ArrowRight size={20} />
              </div>
            </div>

            <div className="p-5 rounded-[18px] bg-[linear-gradient(160deg,rgba(74,222,128,0.08),transparent)] border border-green-500/20">
              <h4 className="text-[13px] font-bold uppercase tracking-wide text-green-500 mb-4 flex items-center gap-2">
                <Check size={15} strokeWidth={3} /> {d.afterH}
              </h4>
              <ul className="flex flex-col gap-3">
                {d.after.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                    <Check size={15} strokeWidth={2.5} className="text-green-500 flex-shrink-0 mt-0.5" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div
          ref={ctaRef}
          className={`rounded-[26px] p-11 text-center bg-[linear-gradient(135deg,rgba(37,99,235,0.2),rgba(37,99,235,0.05))] border border-brand-600/30 ${revealCls(ctaIn)}`}
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 leading-snug">
            {d.banner[0]}
            <span className="text-brand-600 dark:text-brand-400">{d.banner[1]}</span>
            {d.banner[2]}
          </h3>
          <p className="text-[var(--text-muted)] text-base mb-7">{d.bannerSub}</p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40"
          >
            {d.btn}
          </a>
        </div>
      </div>
    </section>
  );
}
