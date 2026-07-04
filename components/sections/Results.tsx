/**
 * components/sections/Results.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Rezultati" — modern, animated results section.
 *   • 4 animated circular gauges (count-up + ring draw + gradient stroke + glow)
 *   • Growth line chart with gradient fill, animated draw and a "+312%" badge
 *
 * Fully self-contained: bilingual text lives in this file (no i18n changes needed)
 * and it reads the current language from your LanguageProvider. Colors use your
 * CSS theme variables, so dark/light works automatically.
 *
 * USAGE: put this file in components/sections/, then in app/page.tsx render
 *        <Results /> where your old results/satisfaction section used to be.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/ui/LanguageProvider";

/* ── Bilingual content ─────────────────────────────────────────────────────── */
type Gauge = { val: number; lbl: string; desc: string; top?: boolean };
type Content = {
  eyebrow: string; heading: string; headingAccent: string; sub: string; top: string;
  gauges: Gauge[]; chartTitle: string; chartSub: string; growthLabel: string; months: string[];
};
const T: { bs: Content; en: Content } = {
  bs: {
    eyebrow: "REZULTATI",
    heading: "Rezultati koji govore",
    headingAccent: "sami za sebe",
    sub: "Ne vjerujte nam na riječ, vjerujte brojevima koje isporučujemo svakom klijentu.",
    top: "TOP",
    gauges: [
      { val: 98, lbl: "Zadovoljstvo klijenata", desc: "koji bi nas preporučili", top: true },
      { val: 95, lbl: "Projekti na vrijeme", desc: "isporučeni u roku" },
      { val: 92, lbl: "Povrat investicije", desc: "prosječan ROI klijenata" },
      { val: 90, lbl: "Ponovna saradnja", desc: "klijenata se vraća" },
    ],
    chartTitle: "Rast online prisustva klijenata",
    chartSub: "Prosječan rast u prvih 6 mjeseci saradnje",
    growthLabel: "prosječan\nrast",
    months: ["Mj 1", "Mj 2", "Mj 3", "Mj 4", "Mj 5", "Mj 6"],
  },
  en: {
    eyebrow: "RESULTS",
    heading: "Results that speak",
    headingAccent: "for themselves",
    sub: "Don't take our word for it, trust the numbers we deliver to every client.",
    top: "TOP",
    gauges: [
      { val: 98, lbl: "Client satisfaction", desc: "who would recommend us", top: true },
      { val: 95, lbl: "On-time projects", desc: "delivered within deadline" },
      { val: 92, lbl: "Return on investment", desc: "average client ROI" },
      { val: 90, lbl: "Repeat collaboration", desc: "of clients come back" },
    ],
    chartTitle: "Client online presence growth",
    chartSub: "Average growth in the first 6 months",
    growthLabel: "average\ngrowth",
    months: ["M1", "M2", "M3", "M4", "M5", "M6"],
  },
};

/* ── Small in-view hook ────────────────────────────────────────────────────── */
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ── Count-up number ───────────────────────────────────────────────────────── */
function Counter({ target, inView, prefix = "", suffix = "" }: { target: number; inView: boolean; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const dur = 1600;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setV(Math.round(ease(p) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return <>{prefix}{v}{suffix}</>;
}

const CIRC = 327; // 2 * π * 52

export function Results() {
  const langCtx = useLanguage() as any;
  const lang: "bs" | "en" =
    langCtx?.language || langCtx?.lang || (langCtx?.t?.nav?.contact === "Kontakt" ? "bs" : "en");
  const d = T[lang] || T.bs;

  const [gaugesRef, gaugesIn] = useInView<HTMLDivElement>(0.35);
  const [chartRef, chartIn] = useInView<HTMLDivElement>(0.3);

  // Chart geometry (viewBox 800 x 240)
  const linePts = "M40,200 L192,170 L344,140 L496,95 L648,55 L760,25";
  const areaPts = "M40,210 L40,200 L192,170 L344,140 L496,95 L648,55 L760,25 L760,210 Z";
  // All 6 data points (last one is the highlighted "end" dot).
  // Rendered as HTML (positioned in %), not SVG circles — with
  // preserveAspectRatio="none" SVG circles get squashed into ellipses
  // on narrow screens. HTML dots stay perfectly round at any width.
  const points: [number, number][] = [
    [40, 200], [192, 170], [344, 140], [496, 95], [648, 55], [760, 25],
  ];

  return (
    <section id="rezultati" className="py-28 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      {/* soft background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-brand-600/10 blur-3xl pointer-events-none" aria-hidden />

      {/* shared SVG gradient defs */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2563EB" stopOpacity="0.35" />
            <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.eyebrow}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {d.heading}{" "}
            <span className="bg-[linear-gradient(120deg,#2563EB,#60A5FA)] bg-clip-text text-transparent font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </h2>
          <p className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">{d.sub}</p>
        </div>

        {/* Gauges */}
        <div ref={gaugesRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-16">
          {d.gauges.map((g, i) => (
            <div
              key={g.lbl}
              className="group relative text-center rounded-[22px] p-4 sm:p-7 bg-[var(--surface)] border border-[var(--border)]
                         backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5
                         hover:border-brand-600/40 hover:shadow-2xl hover:shadow-brand-600/15"
            >
              {g.top && (
                <span
                  className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 text-[11px] font-bold text-green-500 transition-opacity duration-500"
                  style={{ opacity: gaugesIn ? 1 : 0, transitionDelay: "1s" }}
                >
                  ▲ {d.top}
                </span>
              )}
              <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="65" cy="65" r="52" fill="none" stroke="var(--border)" strokeWidth="9" />
                  <circle
                    cx="65" cy="65" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="9" strokeLinecap="round"
                    style={{
                      strokeDasharray: CIRC,
                      strokeDashoffset: gaugesIn ? CIRC * (1 - g.val / 100) : CIRC,
                      transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,.5))",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-[30px] font-extrabold tracking-tight text-[var(--text)]">
                  <Counter target={g.val} inView={gaugesIn} suffix="%" />
                </div>
              </div>
              <div className="text-sm font-semibold text-[var(--text)]">{g.lbl}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1 leading-snug">{g.desc}</div>
            </div>
          ))}
        </div>

        {/* Growth chart */}
        <div ref={chartRef} className="rounded-[26px] p-8 sm:p-9 bg-[var(--surface)] border border-[var(--border)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-7">
            <div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-1">{d.chartTitle}</h3>
              <p className="text-sm text-[var(--text-muted)]">{d.chartSub}</p>
            </div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-green-500/10 border border-green-500/30">
              <span className="text-xl font-extrabold text-green-500">
                <Counter target={312} inView={chartIn} prefix="+" suffix="%" />
              </span>
              <span className="text-[11px] text-green-500/90 font-semibold leading-tight whitespace-pre-line">{d.growthLabel}</span>
            </div>
          </div>

          <div className="relative h-[190px] sm:h-[240px]">
            <svg viewBox="0 0 800 240" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              {/* gridlines */}
              {[60, 120, 180].map((y) => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
              ))}
              {/* area */}
              <path
                d={areaPts}
                fill="url(#areaGrad)"
                style={{ opacity: chartIn ? 1 : 0, transition: "opacity 1s ease .3s" }}
              />
              {/* line */}
              <path
                d={linePts}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 1400,
                  strokeDashoffset: chartIn ? 0 : 1400,
                  transition: "stroke-dashoffset 2s cubic-bezier(.4,0,.2,1) .2s",
                }}
              />
            </svg>
            {/* data dots — HTML, positioned in % so they stay round on every screen width */}
            {points.map(([x, y], i) => {
              const isEnd = i === points.length - 1;
              return (
                <span
                  key={i}
                  aria-hidden
                  className={
                    isEnd
                      ? "absolute w-3.5 h-3.5 rounded-full bg-[#60A5FA] shadow-[0_0_10px_#60A5FA]"
                      : "absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[var(--bg)] border-[3px] border-[#60A5FA]"
                  }
                  style={{
                    left: `${(x / 800) * 100}%`,
                    top: `${(y / 240) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: chartIn ? 1 : 0,
                    transition: isEnd ? "opacity .5s ease 1.6s" : `opacity .4s ease ${0.3 + i * 0.18}s`,
                  }}
                />
              );
            })}
            <div className="relative h-5 mt-2.5" aria-hidden>
              {d.months.map((m, i) => (
                <span
                  key={m}
                  className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] sm:text-xs font-medium text-[var(--text-muted)]"
                  style={{ left: `${(points[i][0] / 800) * 100}%` }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
