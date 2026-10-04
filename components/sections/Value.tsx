/**
 * components/sections/Value.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Zašto se isplati" (v3).
 *
 * PROBLEM S PRETHODNOM VERZIJOM
 *   "Kompletna aplikacija 6 KM/dan" zvučalo je kao dnevna pretplata, a uz to
 *   je miješalo dvije stvari: 6 KM je aplikacija PLUS mjesečna podrška.
 *   Sama aplikacija je 1.000 KM jednom, što na prvu godinu daje ~2,74 KM/dan.
 *
 * NOVA LOGIKA, odozgo prema dolje
 *   1. vremenska linija po godinama: prva godina je tamna pločica "1.000 KM,
 *      jednom", sve poslije su "0 KM, vaša je". Na prvi pogled se vidi da se
 *      plaća jednom i da je onda vlasništvo.
 *   2. računica po danu, jasno označena kao računica, a ne cijena:
 *        samo aplikacija       1.000 KM ÷ 365 ≈ 2,74 KM dnevno, prva godina
 *        s podrškom (opciono)  (1.000 + 12 × 100) ÷ 365 ≈ 6 KM dnevno
 *   3. šta je uključeno, kao red kvačica
 *   4. "od haosa do kontrole": prije naspram sa sistemom
 *   5. tamni baner s pozivom na konsultacije
 *
 * Boje: #0F172A (tamna pločica, baner), #0F3554 (naglasak), #16A34A
 * (kvačice, "0 KM"). Sve pune, bez prozirnosti.
 */

"use client";

import { Check, ArrowRight, X, Coffee } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

type Content = {
  eyebrow: string; h1: string; hAccent: string; sub: string;
  notSub: string;
  year: string; yearOnePrice: string; yearOneNote: string;
  later: string; laterNote: string; forever: string;
  calcTitle: string;
  calcApp: { label: string; value: string; per: string; how: string };
  calcSupport: { label: string; value: string; per: string; how: string };
  calcNote: string;
  included: string[];
  trHead: string; before: string; after: string;
  pairs: { b: string; a: string }[];
  summary: [string, string, string];
  banner: [string, string, string];
  bannerSub: string; btn: string;
};

const T: { bs: Content; en: Content } = {
  bs: {
    eyebrow: "Zašto se isplati",
    h1: "Zvuči kao velika investicija?",
    hAccent: "Nije.",
    sub: "Aplikaciju plaćate jednom i ona je zauvijek vaša. Nema mjesečne pretplate na samu aplikaciju.",
    notSub: "Ovo nije pretplata",
    year: "Godina",
    yearOnePrice: "1.000 KM",
    yearOneNote: "plaćate jednom",
    later: "0 KM",
    laterNote: "aplikacija je vaša",
    forever: "i dalje",
    calcTitle: "Koliko je to po danu, raspoređeno na prvu godinu",
    calcApp:     { label: "Samo aplikacija", value: "2,74 KM", per: "dnevno", how: "1.000 KM ÷ 365 dana, samo prve godine" },
    calcSupport: { label: "S mjesečnom podrškom", value: "oko 6 KM", per: "dnevno", how: "+ 100 KM mjesečno za podršku, opciono, otkažite bilo kad" },
    calcNote: "Računica je za Starter paket (1.000 KM, oko €500). Hosting se plaća zasebno, po stvarnoj potrošnji. Business i Premium paketi su u cjenovniku iznad.",
    included: ["Dizajn po mjeri", "Aplikacija je vaša", "Hosting i domena podešeni", "Izmjene bez developera", "2 mjeseca podrške uz Business"],
    trHead: "Od haosa do potpune kontrole",
    before: "Prije",
    after: "Sa sistemom",
    pairs: [
      { b: "Excel tabele i ručne bilješke", a: "Sve na jednom mjestu" },
      { b: "Sati izgubljeni na administraciju", a: "Vrijeme za rast biznisa" },
      { b: "Propušteni upiti i greške", a: "Svaki upit zabilježen" },
      { b: "Sve ručno, sve sporo", a: "Gotovo u 2 klika" },
    ],
    summary: ["Rezultat: ", "više vremena, manje stresa", " i sistem koji radi za vas danonoćno."],
    banner: ["Platite jednom, a dobijate ", "sistem koji radi 24/7", "."],
    bannerSub: "Računicu za vaš slučaj napravimo na besplatnim konsultacijama.",
    btn: "Zakaži besplatne konsultacije",
  },
  en: {
    eyebrow: "Why it pays off",
    h1: "Sounds like a big investment?",
    hAccent: "It isn't.",
    sub: "You pay for the app once and it's yours for good. There is no monthly subscription for the app itself.",
    notSub: "This is not a subscription",
    year: "Year",
    yearOnePrice: "€500",
    yearOneNote: "paid once",
    later: "€0",
    laterNote: "the app is yours",
    forever: "and on",
    calcTitle: "What it comes to per day, spread over the first year",
    calcApp:     { label: "The app only", value: "€1.37", per: "a day", how: "€500 ÷ 365 days, first year only" },
    calcSupport: { label: "With monthly support", value: "about €3", per: "a day", how: "+ €50 a month for support, optional, cancel anytime" },
    calcNote: "Based on the Starter package (€500, about 1,000 KM). Hosting is billed separately, based on actual usage. Business and Premium packages are in the pricing above.",
    included: ["Design made for you", "The app is yours", "Hosting and domain set up", "Edits without a developer", "2 months of support with Business"],
    trHead: "From chaos to full control",
    before: "Before",
    after: "With the system",
    pairs: [
      { b: "Spreadsheets and manual notes", a: "Everything in one place" },
      { b: "Hours lost on admin", a: "Time to grow the business" },
      { b: "Missed inquiries and errors", a: "Every inquiry captured" },
      { b: "All manual, all slow", a: "Done in 2 clicks" },
    ],
    summary: ["The result: ", "more time, less stress", " and a system that works for you around the clock."],
    banner: ["Pay once, and you get ", "a system that works 24/7", "."],
    bannerSub: "We'll run the numbers for your case in a free consultation.",
    btn: "Book a free consultation",
  },
};

const SOFT = "0 1px 2px rgba(15,23,42,0.04)";

export function Value() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  return (
    <section id="vrijednost" className="relative bg-white scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        {/* ── zaglavlje ── */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{d.eyebrow}</p>
          <h2 className="mt-4 text-[32px] leading-[1.12] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#0F172A]">
            {d.h1} <span className="text-[#0F3554]">{d.hAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#475569]">{d.sub}</p>
        </div>

        {/* ══ 1 + 2. godine i računica, jedna kartica ══ */}
        <div className="mt-12 overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white" style={{ boxShadow: SOFT }}>

          {/* vremenska linija po godinama */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[12px] font-semibold text-[#15803D]">
                <Check size={12} strokeWidth={3} /> {d.notSub}
              </span>
            </div>

            <ol className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* prva godina: jedina koja košta */}
              <li className="rounded-2xl bg-[#0F172A] p-4 sm:p-5 text-white">
                <p className="text-[12px] font-medium text-[#94A3B8]">{d.year} 1</p>
                <p className="whitespace-nowrap mt-2 text-[22px] sm:text-[26px] font-semibold tracking-tight tabular-nums">{d.yearOnePrice}</p>
                <p className="mt-0.5 text-[12.5px] text-[#CBD5E1]">{d.yearOneNote}</p>
              </li>
              {/* sve poslije: 0 */}
              {[2, 3, 4].map((y, i) => (
                <li key={y} className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 sm:p-5">
                  <p className="text-[12px] font-medium text-[#64748B]">
                    {d.year} {y}{i === 2 && <> {d.forever}</>}
                  </p>
                  <p className="mt-2 whitespace-nowrap text-[22px] sm:text-[26px] font-semibold tracking-tight text-[#16A34A] tabular-nums">{d.later}</p>
                  <p className="mt-0.5 text-[12.5px] text-[#15803D]">{d.laterNote}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* računica po danu */}
          <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] p-6 sm:p-8">
            <p className="text-[13px] font-semibold text-[#0F172A]">{d.calcTitle}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[d.calcApp, d.calcSupport].map((c, i) => (
                <div key={c.label} className="flex gap-3.5 rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EEF3F8] text-[#0F3554]`}>
                    {i === 0 ? <Check size={16} strokeWidth={2.5} /> : <Coffee size={16} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-[#64748B]">{c.label}</p>
                    <p className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-[22px] font-semibold tracking-tight text-[#0F172A] tabular-nums">{c.value}</span>
                      <span className="text-[13px] text-[#64748B]">{c.per}</span>
                    </p>
                    <p className="mt-1 text-[12.5px] leading-snug text-[#475569]">{c.how}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-[#64748B]">{d.calcNote}</p>
          </div>
        </div>

        {/* ══ 3. šta je uključeno ══ */}
        <ul className="mt-8 lg:-mx-8 flex flex-wrap justify-center gap-x-5 gap-y-2.5">
          {d.included.map((c) => (
            <li key={c} className="flex items-center gap-2 text-[14px] text-[#334155]">
              <Check size={15} strokeWidth={2.5} className="text-[#16A34A]" /> {c}
            </li>
          ))}
        </ul>

        {/* ══ 4. od haosa do kontrole ══ */}
        <div className="mt-20">
          <h3 className="text-center text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] text-[#0F172A]">{d.trHead}</h3>
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white" style={{ boxShadow: SOFT }}>
            <div className="grid grid-cols-2 border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11.5px] font-semibold uppercase tracking-[0.12em]">
              <p className="px-5 sm:px-6 py-3 text-[#94A3B8]">{d.before}</p>
              <p className="px-5 sm:px-6 py-3 text-[#0F3554] border-l border-[#F1F5F9]">{d.after}</p>
            </div>
            {d.pairs.map((p, i) => (
              <div key={p.b} className={`grid grid-cols-2 ${i > 0 ? "border-t border-[#F1F5F9]" : ""}`}>
                <p className="flex items-start gap-2.5 px-5 sm:px-6 py-4 text-[14px] text-[#475569]">
                  <X size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#94A3B8]" />{p.b}
                </p>
                <p className="flex items-start gap-2 border-l border-[#F1F5F9] px-5 sm:px-6 py-4 text-[14px] font-medium text-[#0F172A]">
                  <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#16A34A]" /> {p.a}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[14px] text-[#475569]">
            {d.summary[0]}<span className="font-semibold text-[#0F172A]">{d.summary[1]}</span>{d.summary[2]}
          </p>
        </div>

        {/* ══ 5. tamni baner ══ */}
        <div className="mt-14 flex flex-col sm:flex-row sm:items-center gap-6 rounded-[20px] bg-[#0F172A] p-7 sm:p-9">
          <div className="flex-1">
            <p className="text-[20px] sm:text-[22px] font-semibold leading-snug tracking-tight text-white">
              {d.banner[0]}<span className="text-[#93C5FD]">{d.banner[1]}</span>{d.banner[2]}
            </p>
            <p className="mt-2 text-[14px] text-[#94A3B8]">{d.bannerSub}</p>
          </div>
          <a href="#kontakt"
             className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9]">
            {d.btn} <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
