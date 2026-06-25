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
  eyebrow: string; heading: string; sub: string; top: string;
  gauges: Gauge[]; chartTitle: string; chartSub: string; growthLabel: string; months: string[];
};
const T: { bs: Content; en: Content } = {
  bs: {
    eyebrow: "REZULTATI",
    heading: "Rezultati koji govore sami za sebe",
    sub: "Ne vjerujte nam na riječ — vjerujte brojevima koje isporučujemo svakom klijentu.",
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
    heading: "Results that speak for themselves",
    sub: "Don't take our word for it — trust the numbers we deliver to every client.",
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
  const dots = [
    [40, 200], [192, 170], [344, 140], [496, 95], [648, 55],
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
          <p className="text-brand-600 dark:text-brand-400 text-sm font-bold tracking-widest uppercase mb-3.5">{d.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">{d.heading}</h2>
          <p className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">{d.sub}</p>
        </div>

        {/* Gauges */}
        <div ref={gaugesRef} className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {d.gauges.map((g, i) => (
            <div
              key={g.lbl}
              className="group relative text-center rounded-[22px] p-7 bg-[var(--surface)] border border-[var(--border)]
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
              <div className="relative w-[130px] h-[130px] mx-auto mb-4">
                <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
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
                <div className="absolute inset-0 flex items-center justify-center text-[30px] font-extrabold tracking-tight text-[var(--text)]">
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

          <div className="relative h-[240px]">
            <svg viewBox="0 0 800 240" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              {/* gridlines */}
              {[60, 120, 180].map((y) => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
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
                style={{
                  strokeDasharray: 1400,
                  strokeDashoffset: chartIn ? 0 : 1400,
                  transition: "stroke-dashoffset 2s cubic-bezier(.4,0,.2,1) .2s",
                }}
              />
              {/* dots */}
              {dots.map(([x, y], i) => (
                <circle
                  key={i} cx={x} cy={y} r="5" fill="var(--bg)" stroke="#60A5FA" strokeWidth="3"
                  style={{ opacity: chartIn ? 1 : 0, transition: `opacity .4s ease ${0.3 + i * 0.18}s` }}
                />
              ))}
              {/* end glow dot */}
              <circle
                cx="760" cy="25" r="7" fill="#60A5FA"
                style={{ opacity: chartIn ? 1 : 0, transition: "opacity .5s ease 1.6s", filter: "drop-shadow(0 0 8px #60A5FA)" }}
              />
            </svg>
            <svg viewBox="0 0 800 20" preserveAspectRatio="none" className="w-full h-5 mt-1.5">
              {d.months.map((m, i) => {
                const xs = [40, 192, 344, 496, 648, 760];
                return (
                  <text key={m} x={xs[i]} y="14" textAnchor="middle" className="fill-[var(--text-muted)]" style={{ fontSize: "12px", fontWeight: 500 }}>
                    {m}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
