/**
 * components/portfolio/MaximumCaseStudy.tsx
 * Case study: Maximum Rent a Car. Sve u jednom fajlu, lokalne podkomponente.
 * Navbar i Footer se montiraju u app/portfolio/maximum/page.tsx.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight, ArrowRight, Check, Gauge, ShieldCheck, Car, FileSignature,
  ScanLine, MapPinned, AlertTriangle, Clock, Languages,
} from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

const once = { once: true, amount: 0.25 } as const;
const up = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const T = {
  bs: {
    eyebrow: "Case study · Rent a car",
    h1a: "Maximum SaaS,",
    h1b: "digitalna transformacija rent-a-cara",
    sub: "Rent-a-car firma iz Mostara koja je rezervacije vodila kroz poruke i svesku dobila je sistem koji radi sam. Gost bira vozilo i datume, sistem provjerava dostupnost, vlasnik potvrđuje jednim klikom.",
    meta: ["Next.js i TypeScript", "Dvojezično, HR i EN", "Uživo od 2025."],
    visit: "Otvorite sajt",
    stats: [
      { v: "100", l: "Google ocjena performansi" },
      { v: "3,2 s", l: "učitavanje na telefonu, ranije 21,6 s" },
      { v: "0", l: "duplih rezervacija od lansiranja" },
      { v: "2", l: "jezika za domaće i strane goste" },
    ],
    storyLabel: "Kako je nastao",
    storyH1: "Rezervacije koje",
    storyH2: "ne pucaju",
    storyBody: "Dvije godine sam radio manualno i API testiranje prije nego što sam napisao prvu liniju ovog sistema. Ta navika je presudila dizajnu: prije nego što sam gradio ekrane, popisao sam načine na koje rezervacija može pući. Preklapanje termina, gost koji osvježi stranicu dva puta, datum povratka prije datuma preuzimanja, vozilo koje ode na servis usred rezervisanog perioda.",
    storySub: "Zato provjere ne stoje samo u pregledniku nego i na serveru, pa se ista pravila ne mogu zaobići ni ručnim mijenjanjem podataka.",
    storySteps: [
      { t: "Popis rubnih slučajeva prije koda", d: "Lista načina na koje rezervacija može propasti nastala je prva, pa je sistem građen oko nje umjesto da se krpi poslije prijava." },
      { t: "Provjera dostupnosti na serveru", d: "Preklapanje termina se odbija na serveru, ne samo u formi. Dvije osobe koje istovremeno šalju isti termin ne mogu obje proći." },
      { t: "Stanje vozila je jedan izvor istine", d: "Servis, blokada i rezervacija dijele istu evidenciju, pa vozilo ne može biti slobodno na sajtu a zauzeto u panelu." },
      { t: "Testirano kao da će neko pokušati srušiti", d: "Prazna polja, obrnuti datumi, dupli klik, prekid veze usred slanja. Sve što bi tester prijavio riješeno je prije isporuke." },
    ],
    bentoLabel: "Moduli sistema",
    bentoH1: "Šta sve",
    bentoH2: "sistem radi",
    modules: {
      checkin: { t: "Smart preuzimanje i povrat", d: "Preuzimanje i vraćanje vozila prolaze kroz isti tok: stanje goriva, kilometraža, bilješka o oštećenju i potpis. Sve ostaje uz rezervaciju, pa naknadnih rasprava nema.", chips: ["Stanje goriva", "Kilometraža", "Bilješka o oštećenju"] },
      fleet: {
        t: "Pregled flote uživo",
        d: "Vlasnik u jednom pogledu vidi koje je vozilo na terenu, koje se vraća danas i koje kasni. Kašnjenja se boje, pa se primijete bez traženja.",
        rows: [
          { car: "VW Golf 8", state: "Na terenu", tone: "ok" as const },
          { car: "Škoda Octavia", state: "Vraća se danas", tone: "warn" as const },
          { car: "Renault Clio", state: "Kasni 2 h", tone: "late" as const },
        ],
      },
      pdf: { t: "Ugovori se pišu sami", d: "Iz potvrđene rezervacije nastaje gotov ugovor s podacima gosta, vozila i termina. Bez prekucavanja i bez grešaka u imenima.", chips: ["Podaci gosta", "Vozilo i termin", "Spremno za potpis"] },
      lang: { t: "Dvojezično od prvog dana", d: "Domaći i strani gosti čitaju istu ponudu na svom jeziku." },
      speed: { t: "Brzina kao funkcija", d: "Stranica se otvara ispod tri sekunde na mobilnoj mreži, jer gost koji čeka odlazi kod konkurencije." },
    },
    ctaH: "Vodite rent-a-car firmu?",
    ctaSub: "Isti sistem prilagođavamo vašoj floti. Cijene i paketi su na jednoj stranici.",
    ctaBtn: "Pogledajte sistem i cijene",
    imgAlt: "Maximum Rent a Car, naslovna stranica",
  },
  en: {
    eyebrow: "Case study · Car rental",
    h1a: "Maximum SaaS,",
    h1b: "digital transformation of a car rental company",
    sub: "A car rental company from Mostar that ran bookings through chat messages and a notebook now has a system that runs itself. The guest picks a vehicle and dates, the system checks availability, the owner confirms in one click.",
    meta: ["Next.js and TypeScript", "Bilingual, HR and EN", "Live since 2025"],
    visit: "Open the site",
    stats: [
      { v: "100", l: "Google performance score" },
      { v: "3.2 s", l: "mobile load time, was 21.6 s" },
      { v: "0", l: "double bookings since launch" },
      { v: "2", l: "languages for local and foreign guests" },
    ],
    storyLabel: "How it was built",
    storyH1: "Bookings that",
    storyH2: "do not break",
    storyBody: "I spent two years doing manual and API testing before writing the first line of this system. That habit shaped the design: before building any screen, I listed the ways a booking can fail. Overlapping dates, a guest refreshing twice, a return date before the pickup date, a car going into service in the middle of a booked period.",
    storySub: "That is why the checks do not live only in the browser but on the server as well, so the same rules cannot be bypassed by editing data by hand.",
    storySteps: [
      { t: "Edge cases listed before the code", d: "The list of ways a booking can fail came first, so the system was built around it instead of being patched after bug reports." },
      { t: "Availability checked on the server", d: "Overlapping dates are rejected server side, not just in the form. Two people submitting the same slot cannot both succeed." },
      { t: "One source of truth per vehicle", d: "Service, manual blocks and bookings share one record, so a car cannot be free on the site and taken in the panel." },
      { t: "Tested as if someone will try to break it", d: "Empty fields, reversed dates, double clicks, a dropped connection mid submit. Everything a tester would report was handled before delivery." },
    ],
    bentoLabel: "System modules",
    bentoH1: "What the",
    bentoH2: "system does",
    modules: {
      checkin: { t: "Smart check in and check out", d: "Pickup and return follow the same flow: fuel level, mileage, damage note and signature. It all stays attached to the booking, so there are no arguments later.", chips: ["Fuel level", "Mileage", "Damage note"] },
      fleet: {
        t: "Live fleet overview",
        d: "The owner sees at a glance which car is out, which returns today and which is running late. Delays are colour coded, so nothing has to be searched for.",
        rows: [
          { car: "VW Golf 8", state: "Out", tone: "ok" as const },
          { car: "Škoda Octavia", state: "Returns today", tone: "warn" as const },
          { car: "Renault Clio", state: "2 h late", tone: "late" as const },
        ],
      },
      pdf: { t: "Contracts write themselves", d: "A confirmed booking turns into a finished contract with guest, vehicle and date details. No retyping and no misspelled names.", chips: ["Guest details", "Vehicle and dates", "Ready to sign"] },
      lang: { t: "Bilingual from day one", d: "Local and foreign guests read the same offer in their own language." },
      speed: { t: "Speed as a feature", d: "The page opens in under three seconds on mobile data, because a guest who waits goes to a competitor." },
    },
    ctaH: "Running a car rental company?",
    ctaSub: "We adapt the same system to your fleet. Pricing and packages are on one page.",
    ctaBtn: "See the system and pricing",
    imgAlt: "Maximum Rent a Car home page",
  },
} as const;

const SITE = "https://maximum-rent.vercel.app";

function Hero({ d, calm }: { d: typeof T.bs; calm: boolean }) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(37,99,235,0.18),transparent_72%)]" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once} className="max-w-3xl">
          <motion.span variants={up}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6
                       border border-brand-600/30 bg-brand-600/10 text-brand-300
                       text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            {d.eyebrow}
          </motion.span>

          <motion.h1 variants={up}
            className="text-[40px] leading-[1.05] sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[var(--text)]">
            {d.h1a}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.h1b}</span>
          </motion.h1>

          <motion.p variants={up} className="mt-7 max-w-2xl text-[16px] sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {d.sub}
          </motion.p>

          <motion.div variants={up} className="mt-8 flex flex-wrap items-center gap-2.5">
            {d.meta.map((m) => (
              <span key={m} className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text)]
                                       bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] border border-[var(--border)]">
                {m}
              </span>
            ))}
            <a href={SITE} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold
                          bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25
                          transition-transform duration-300 hover:-translate-y-0.5">
              {d.visit} <ArrowUpRight size={13} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={once}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 lg:mt-20"
        >
          <motion.div
            animate={calm ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto max-w-4xl rounded-3xl border border-brand-500/25 bg-[#070C1A] overflow-hidden
                       shadow-[0_60px_120px_-40px_rgba(37,99,235,0.5)]"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[.07]">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-[11px] text-white/35">maximum-rent.vercel.app</span>
            </div>
            <Image src="/portfolio/maximum-naslovna.png" alt={d.imgAlt}
                   width={1600} height={1000} priority
                   sizes="(max-width: 1024px) 100vw, 900px"
                   className="w-full h-auto object-cover object-top" />
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once}
            className="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            {d.stats.map((s) => (
              <motion.div key={s.l} variants={up}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">{s.v}</p>
                <p className="text-[11px] text-[var(--text-muted)] leading-snug mt-1.5">{s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Story({ d }: { d: typeof T.bs }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(Number((vis.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.4, 1] }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">

          <div className="lg:sticky lg:top-28">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once}>
              <motion.span variants={up}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                           border border-brand-600/30 bg-brand-600/10 text-brand-300
                           text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck size={12} /> {d.storyLabel}
              </motion.span>
              <motion.h2 variants={up} className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.1]">
                {d.storyH1}{" "}
                <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.storyH2}</span>
              </motion.h2>
              <motion.p variants={up} className="text-[var(--text-muted)] leading-relaxed mt-5">{d.storyBody}</motion.p>
              <motion.p variants={up} className="text-[var(--text)] leading-relaxed mt-4 text-[15px] font-medium">
                {d.storySub}
              </motion.p>
              <motion.div variants={up} className="hidden lg:flex gap-1.5 mt-8" aria-hidden>
                {d.storySteps.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-all duration-500
                                            ${i === active ? "w-8 bg-brand-500" : "w-3 bg-[var(--border)]"}`} />
                ))}
              </motion.div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            {d.storySteps.map((s, i) => (
              <motion.div
                key={s.t}
                data-i={i}
                ref={(el) => { refs.current[i] = el; }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={once}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl border p-6 sm:p-7 transition-[border-color,background-color] duration-500
                            ${i === active
                              ? "border-brand-600/45 bg-brand-600/[.06]"
                              : "border-[var(--border)] bg-[var(--surface)]"}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
                                    text-[13px] font-extrabold transition-colors duration-500
                                    ${i === active
                                      ? "bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-600/30"
                                      : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]"}`}>
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-extrabold text-[var(--text)] leading-tight mb-2">{s.t}</h3>
                    <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Bento({ d }: { d: typeof T.bs }) {
  const m = d.modules;
  const toneCls = {
    ok: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    warn: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    late: "text-red-400 bg-red-500/10 border-red-500/35",
  } as const;

  return (
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once} className="text-center mb-14">
          <motion.span variants={up}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                       border border-brand-600/30 bg-brand-600/10 text-brand-300
                       text-xs font-semibold tracking-wider uppercase">
            {d.bentoLabel}
          </motion.span>
          <motion.h2 variants={up} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {d.bentoH1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.bentoH2}</span>
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once}
          className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">

          <motion.article variants={up} whileHover={{ y: -5 }}
            className="lg:col-span-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7
                       transition-[border-color,box-shadow] duration-300
                       hover:border-brand-600/40 hover:shadow-2xl hover:shadow-brand-600/10">
            <span className="inline-flex w-11 h-11 rounded-2xl items-center justify-center mb-4
                             bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-600/25">
              <MapPinned size={19} />
            </span>
            <h3 className="text-[19px] font-extrabold text-[var(--text)] mb-2">{m.fleet.t}</h3>
            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed mb-5 max-w-lg">{m.fleet.d}</p>

            <div className="rounded-2xl border border-white/10 bg-[#070C1A] p-3 space-y-2">
              {m.fleet.rows.map((r) => (
                <div key={r.car} className="flex items-center gap-3 rounded-xl border border-white/[.06] px-3.5 py-2.5">
                  <span className="w-8 h-8 rounded-lg bg-white/[.05] flex items-center justify-center flex-shrink-0">
                    <Car size={14} className="text-blue-200/80" />
                  </span>
                  <span className="text-[12.5px] font-bold text-white/85">{r.car}</span>
                  <span className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
                                    text-[10px] font-bold whitespace-nowrap ${toneCls[r.tone]}`}>
                    {r.tone === "late" && <AlertTriangle size={10} />}
                    {r.tone === "warn" && <Clock size={10} />}
                    {r.state}
                  </span>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article variants={up} whileHover={{ y: -5 }}
            className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6
                       transition-[border-color,box-shadow] duration-300
                       hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10">
            <span className="inline-flex w-10 h-10 rounded-2xl items-center justify-center mb-4
                             bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-600/25">
              <FileSignature size={17} />
            </span>
            <h3 className="text-[16px] font-extrabold text-[var(--text)] mb-2">{m.pdf.t}</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">{m.pdf.d}</p>
            <ul className="flex flex-col gap-2">
              {m.pdf.chips.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[12.5px] text-[var(--text)]">
                  <Check size={11} strokeWidth={3} className="text-brand-400 flex-shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article variants={up} whileHover={{ y: -5 }}
            className="lg:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7
                       transition-[border-color,box-shadow] duration-300
                       hover:border-brand-600/40 hover:shadow-xl hover:shadow-brand-600/10">
            <span className="inline-flex w-10 h-10 rounded-2xl items-center justify-center mb-4
                             bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-600/25">
              <ScanLine size={17} />
            </span>
            <h3 className="text-[17px] font-extrabold text-[var(--text)] mb-2">{m.checkin.t}</h3>
            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed mb-4">{m.checkin.d}</p>
            <div className="flex flex-wrap gap-2">
              {m.checkin.chips.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-[var(--text)]
                                         bg-[var(--bg)] border border-[var(--border)]">{c}</span>
              ))}
            </div>
          </motion.article>

          <motion.article variants={up} whileHover={{ y: -5 }}
            className="lg:col-span-1 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6
                       transition-[border-color,box-shadow] duration-300 hover:border-brand-600/40">
            <span className="inline-flex w-10 h-10 rounded-2xl items-center justify-center mb-3
                             bg-brand-600/12 border border-brand-600/30 text-brand-300">
              <Languages size={17} />
            </span>
            <h3 className="text-[14.5px] font-extrabold text-[var(--text)] leading-tight mb-1.5">{m.lang.t}</h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">{m.lang.d}</p>
          </motion.article>

          <motion.article variants={up} whileHover={{ y: -5 }}
            className="lg:col-span-2 rounded-3xl border border-emerald-500/25 bg-[var(--surface)] p-6
                       transition-[border-color,box-shadow] duration-300 hover:border-emerald-500/45">
            <span className="inline-flex w-10 h-10 rounded-2xl items-center justify-center mb-3
                             bg-emerald-500/12 border border-emerald-500/35 text-emerald-400">
              <Gauge size={17} />
            </span>
            <h3 className="text-[15px] font-extrabold text-[var(--text)] leading-tight mb-1.5">{m.speed.t}</h3>
            <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">{m.speed.d}</p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

function Cta({ d }: { d: typeof T.bs }) {
  return (
    <section className="py-24 lg:py-28 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={once}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[32px] overflow-hidden p-8 sm:p-12 text-center"
          style={{
            background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #2563EB, #60A5FA, #818CF8) border-box",
            border: "1.5px solid transparent",
          }}
        >
          <span aria-hidden className="absolute -top-28 -right-20 w-80 h-80 rounded-full pointer-events-none
                                       bg-[radial-gradient(closest-side,rgba(37,99,235,0.2),transparent_72%)]" />
          <h2 className="relative text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] mb-3">{d.ctaH}</h2>
          <p className="relative text-[var(--text-muted)] leading-relaxed mb-7 max-w-xl mx-auto">{d.ctaSub}</p>
          <a href="/rjesenja/rent-a-car"
             className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                        bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[15px] font-bold
                        shadow-xl shadow-brand-600/30
                        transition-[box-shadow,transform] duration-300 hover:shadow-2xl hover:shadow-brand-600/45 hover:-translate-y-0.5">
            {d.ctaBtn}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function MaximumCaseStudy() {
  const { lang } = useLanguage();
  const d = (T[(lang as "bs" | "en")] ?? T.bs) as typeof T.bs;
  const calm = useReducedMotion() ?? false;

  return (
    <main className="relative">
      <Hero d={d} calm={calm} />
      <Story d={d} />
      <Bento d={d} />
      <Cta d={d} />
    </main>
  );
}
