/**
 * components/portfolio/MaximumCaseStudy.tsx
 * Case study: Maximum Rent a Car. Sve u jednom fajlu, lokalne podkomponente.
 * Navbar i Footer se montiraju u app/portfolio/maximum/page.tsx.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight, ArrowRight, Check, Gauge, ShieldCheck, Car, FileSignature,
  ScanLine, MapPinned, AlertTriangle, Clock, Languages, BellRing, Fuel,
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
      { n: 100, dec: 0, suf: "", l: "Google ocjena performansi" },
      { n: 3.2, dec: 1, suf: " s", l: "učitavanje na telefonu, ranije 21,6 s" },
      { n: 0, dec: 0, suf: "", l: "duplih rezervacija od lansiranja" },
      { n: 2, dec: 0, suf: "", l: "jezika za domaće i strane goste" },
    ],
    floats: {
      req: { t: "Novi upit", d: "VW Golf 8 · 10 do 13. jula" },
      ok:  { t: "Odobreno", d: "u dva klika iz panela" },
      spd: { t: "PageSpeed", d: "100 od 100" },
    },
    storyLabel: "Kako je nastao",
    storyH1: "Rezervacije koje",
    storyH2: "ne pucaju",
    storyBody: "Dvije godine sam radio manualno i API testiranje prije nego što sam napisao prvu liniju ovog sistema. Ta navika je presudila dizajnu: prije nego što sam gradio ekrane, popisao sam načine na koje rezervacija može pući. Preklapanje termina, gost koji osvježi stranicu dva puta, datum povratka prije datuma preuzimanja, vozilo koje ode na servis usred rezervisanog perioda.",
    storySub: "Zato provjere ne stoje samo u pregledniku nego i na serveru, pa se ista pravila ne mogu zaobići ni ručnim mijenjanjem podataka.",
    storySteps: [
      {
        t: "Popis rubnih slučajeva prije koda",
        d: "Lista načina na koje rezervacija može propasti nastala je prva, pa je sistem građen oko nje umjesto da se krpi poslije prijava.",
        file: "rezervacija.rules.ts",
        code: `// datum povratka ne smije biti prije preuzimanja\nif (povratak <= preuzimanje) {\n  return odbij("DATUMI_OBRNUTI");\n}`,
        result: "Odbijeno prije upisa u bazu",
      },
      {
        t: "Provjera dostupnosti na serveru",
        d: "Preklapanje termina se odbija na serveru, ne samo u formi. Dvije osobe koje istovremeno šalju isti termin ne mogu obje proći.",
        file: "dostupnost.ts",
        code: `const zauzeto = await rezervacije.postoji({\n  vozilo, od: preuzimanje, do: povratak,\n});\n\nif (zauzeto) return odbij("TERMIN_ZAUZET");`,
        result: "Druga istovremena rezervacija odbijena",
      },
      {
        t: "Stanje vozila je jedan izvor istine",
        d: "Servis, blokada i rezervacija dijele istu evidenciju, pa vozilo ne može biti slobodno na sajtu a zauzeto u panelu.",
        file: "vozilo.status.ts",
        code: `// servis i ručna blokada ulaze u isti upit\nconst slobodno = await vozilo.slobodnoU(raspon);\n\nif (!slobodno) return odbij("VOZILO_NEDOSTUPNO");`,
        result: "Sajt i panel pokazuju isto stanje",
      },
      {
        t: "Testirano kao da će neko pokušati srušiti",
        d: "Prazna polja, obrnuti datumi, dupli klik, prekid veze usred slanja. Sve što bi tester prijavio riješeno je prije isporuke.",
        file: "rezervacija.test.ts",
        code: `test("dupli klik ne pravi dvije rezervacije", async () => {\n  const [a, b] = await Promise.all([posalji(), posalji()]);\n  expect([a.ok, b.ok]).toEqual([true, false]);\n});`,
        result: "Prolazi, jedan upit prolazi, drugi pada",
      },
    ],
    storyMetrics: [
      { v: "0", l: "duplih rezervacija od lansiranja" },
      { v: "100%", l: "provjera koje rade i na serveru" },
      { v: "4", l: "rubna slučaja pokrivena prije isporuke" },
    ],
    storyPassed: "provjera prošla",
    storyBlocked: "spriječeno",
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
      lang: { t: "Dvojezično od prvog dana", d: "Domaći i strani gosti čitaju istu ponudu na svom jeziku.", a: "Bosanski", b: "English" },
      speed: { t: "Brzina kao funkcija", d: "Stranica se otvara ispod tri sekunde na mobilnoj mreži, jer gost koji čeka odlazi kod konkurencije.", before: "prije", after: "sada" },
      ui: { fuel: "Gorivo", km: "Kilometraža", sign: "Potpis", doc: "ugovor.pdf", ready: "Spremno za potpis", generating: "Popunjavam podatke", live: "uživo" },
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
      { n: 100, dec: 0, suf: "", l: "Google performance score" },
      { n: 3.2, dec: 1, suf: " s", l: "mobile load time, was 21.6 s" },
      { n: 0, dec: 0, suf: "", l: "double bookings since launch" },
      { n: 2, dec: 0, suf: "", l: "languages for local and foreign guests" },
    ],
    floats: {
      req: { t: "New request", d: "VW Golf 8 · July 10 to 13" },
      ok:  { t: "Approved", d: "in two clicks from the panel" },
      spd: { t: "PageSpeed", d: "100 out of 100" },
    },
    storyLabel: "How it was built",
    storyH1: "Bookings that",
    storyH2: "do not break",
    storyBody: "I spent two years doing manual and API testing before writing the first line of this system. That habit shaped the design: before building any screen, I listed the ways a booking can fail. Overlapping dates, a guest refreshing twice, a return date before the pickup date, a car going into service in the middle of a booked period.",
    storySub: "That is why the checks do not live only in the browser but on the server as well, so the same rules cannot be bypassed by editing data by hand.",
    storySteps: [
      {
        t: "Edge cases listed before the code",
        d: "The list of ways a booking can fail came first, so the system was built around it instead of being patched after bug reports.",
        file: "booking.rules.ts",
        code: `// return date cannot come before pickup\nif (dropoff <= pickup) {\n  return reject("DATES_REVERSED");\n}`,
        result: "Rejected before it reaches the database",
      },
      {
        t: "Availability checked on the server",
        d: "Overlapping dates are rejected server side, not just in the form. Two people submitting the same slot cannot both succeed.",
        file: "availability.ts",
        code: `const taken = await bookings.exists({\n  vehicle, from: pickup, to: dropoff,\n});\n\nif (taken) return reject("SLOT_TAKEN");`,
        result: "The second simultaneous booking is rejected",
      },
      {
        t: "One source of truth per vehicle",
        d: "Service, manual blocks and bookings share one record, so a car cannot be free on the site and taken in the panel.",
        file: "vehicle.status.ts",
        code: `// service and manual blocks hit the same query\nconst free = await vehicle.isFreeIn(range);\n\nif (!free) return reject("VEHICLE_UNAVAILABLE");`,
        result: "Site and panel show the same state",
      },
      {
        t: "Tested as if someone will try to break it",
        d: "Empty fields, reversed dates, double clicks, a dropped connection mid submit. Everything a tester would report was handled before delivery.",
        file: "booking.test.ts",
        code: `test("double click cannot create two bookings", async () => {\n  const [a, b] = await Promise.all([submit(), submit()]);\n  expect([a.ok, b.ok]).toEqual([true, false]);\n});`,
        result: "Passing, one request succeeds and one fails",
      },
    ],
    storyMetrics: [
      { v: "0", l: "double bookings since launch" },
      { v: "100%", l: "of checks also run on the server" },
      { v: "4", l: "edge cases covered before delivery" },
    ],
    storyPassed: "check passed",
    storyBlocked: "prevented",
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
      lang: { t: "Bilingual from day one", d: "Local and foreign guests read the same offer in their own language.", a: "Bosnian", b: "English" },
      speed: { t: "Speed as a feature", d: "The page opens in under three seconds on mobile data, because a guest who waits goes to a competitor.", before: "before", after: "now" },
      ui: { fuel: "Fuel", km: "Mileage", sign: "Signature", doc: "contract.pdf", ready: "Ready to sign", generating: "Filling in the details", live: "live" },
    },
    ctaH: "Running a car rental company?",
    ctaSub: "We adapt the same system to your fleet. Pricing and packages are on one page.",
    ctaBtn: "See the system and pricing",
    imgAlt: "Maximum Rent a Car home page",
  },
} as const;

const SITE = "https://maximum-rent.vercel.app";

/* ── Brojka koja se odbroji kad uđe u vidno polje ─────────────────────────── */
function Counter({ to, dec, suf }: { to: number; dec: number; suf: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (!inView) return;
    if (reduce || to === 0) { setVal(to); return; }
    const dur = 1100;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);          // brzo krene, meko stane
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    <span ref={ref}>
      {val.toFixed(dec).replace(".", ",")}{suf}
    </span>
  );
}

/* ── Plutajuća kartica oko mockupa ────────────────────────────────────────── */
function FloatCard({
  icon, title, desc, tone, className, delay, calm,
}: {
  icon: React.ReactNode; title: string; desc: string;
  tone: "blue" | "green"; className: string; delay: number; calm: boolean;
}) {
  const tones = {
    blue:  "border-brand-500/35 text-brand-300",
    green: "border-emerald-500/40 text-emerald-400",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={once}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-20 hidden sm:block ${className}`}
    >
      <motion.div
        animate={calm ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 5.5 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}
        className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 border
                    bg-[color-mix(in_srgb,var(--surface)_94%,transparent)]
                    shadow-[0_24px_50px_-14px_rgba(2,8,30,0.8)] ${tones[tone]}`}
      >
        <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border bg-[var(--bg)] ${tones[tone]}`}>
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-[12px] font-extrabold text-[var(--text)] leading-tight">{title}</span>
          <span className="block text-[10.5px] text-[var(--text-muted)] leading-tight whitespace-nowrap">{desc}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function Hero({ d, calm }: { d: typeof T.bs; calm: boolean }) {
  /* Parallax: slojevi se pomjeraju različitom brzinom za mišem, pa kompozicija
     dobija dubinu. Samo desktop, samo transform. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const deepX  = useTransform(sx, (v) => v * 18);
  const deepY  = useTransform(sy, (v) => v * 12);
  const frontX = useTransform(sx, (v) => v * 34);
  const frontY = useTransform(sy, (v) => v * 22);

  useEffect(() => {
    if (calm) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [calm, mx, my]);

  const words = d.h1b.split(" ");

  return (
    <section className="relative pt-32 pb-28 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* pozadina: mreža koja blijedi + dva svjetla */}
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.25]
                                  [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
                                  [background-size:64px_64px]
                                  [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent_72%)]" />
      <div aria-hidden className="absolute top-40 -left-24 w-[420px] h-[420px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(45,212,167,0.12),transparent_72%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once} className="max-w-3xl">
          <motion.span variants={up}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6
                       border border-brand-600/30 bg-brand-600/10 text-brand-300
                       text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            {d.eyebrow}
          </motion.span>

          <h1 className="text-[40px] leading-[1.05] sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[var(--text)]">
            <motion.span variants={up} className="block">{d.h1a}</motion.span>
            <span className="block">
              {words.map((w, i) => (
                <motion.span
                  key={`${w}-${i}`}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={once}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-gradient font-serif italic font-semibold tracking-normal mr-[0.28em]"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

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
               className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold
                          bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25
                          transition-transform duration-300 hover:-translate-y-0.5">
              {d.visit}
              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* ── kompozicija uređaja ── */}
        <div className="relative mt-16 lg:mt-24">
          <motion.div style={calm ? undefined : { x: deepX, y: deepY }} className="relative mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 46, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={once}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border border-brand-500/25 bg-[#070C1A] overflow-hidden
                         shadow-[0_70px_140px_-45px_rgba(37,99,235,0.55)]"
              style={{ transformPerspective: 1400 }}
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
              {/* odsjaj preko ekrana */}
              {!calm && (
                <motion.span
                  aria-hidden
                  animate={{ x: ["-130%", "230%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 5.5, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/4 skew-x-[-18deg] pointer-events-none
                             bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
                />
              )}
            </motion.div>
          </motion.div>

          {/* plutajući slojevi, brži parallax */}
          <motion.div style={calm ? undefined : { x: frontX, y: frontY }} className="absolute inset-0 pointer-events-none">
            <div className="relative max-w-4xl mx-auto h-full">
              <FloatCard calm={calm} delay={0.45} tone="blue" icon={<BellRing size={15} />}
                title={d.floats.req.t} desc={d.floats.req.d}
                className="-top-6 -right-4 lg:-right-16" />
              <FloatCard calm={calm} delay={0.65} tone="green" icon={<Check size={15} strokeWidth={3} />}
                title={d.floats.ok.t} desc={d.floats.ok.d}
                className="bottom-10 -left-4 lg:-left-16" />
              <FloatCard calm={calm} delay={0.85} tone="green" icon={<Gauge size={15} />}
                title={d.floats.spd.t} desc={d.floats.spd.d}
                className="top-1/2 -right-6 lg:-right-20" />
            </div>
          </motion.div>
        </div>

        {/* brojke */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once}
          className="relative mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
          {d.stats.map((s) => (
            <motion.div key={s.l} variants={up}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center
                         transition-[border-color] duration-300 hover:border-brand-600/35">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
                <Counter to={s.n} dec={s.dec} suf={s.suf} />
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug mt-1.5">{s.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Bojenje koda: sitni isticač, bez biblioteke ──────────────────────────── */
function Code({ code }: { code: string }) {
  const tint = (line: string, key: number) => {
    if (line.trim().startsWith("//")) {
      return <span key={key} className="block text-white/30 italic">{line || "\u00A0"}</span>;
    }
    const parts = line.split(/("[^"]*"|\b(?:const|await|if|return|test|expect|async|new)\b)/g);
    return (
      <span key={key} className="block">
        {parts.map((p, i) => {
          if (!p) return null;
          if (/^"/.test(p))
            return <span key={i} className="text-emerald-300/90">{p}</span>;
          if (/^(const|await|if|return|test|expect|async|new)$/.test(p))
            return <span key={i} className="text-brand-300">{p}</span>;
          return <span key={i} className="text-white/70">{p}</span>;
        })}
      </span>
    );
  };
  return (
    <pre className="text-[11.5px] sm:text-[12.5px] leading-[1.75] font-mono overflow-x-auto">
      <code>{code.split("\n").map(tint)}</code>
    </pre>
  );
}

/* ── Sekcija: QA pozadina, interaktivno ───────────────────────────────────── */
const STORY_MS = 6000;

function Story({ d }: { d: typeof T.bs }) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % d.storySteps.length), STORY_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduce, d.storySteps.length]);

  const s = d.storySteps[active];

  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div aria-hidden className="absolute top-1/3 -right-32 w-[560px] h-[560px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(37,99,235,0.16),transparent_72%)]" />
      <div aria-hidden className="absolute bottom-0 -left-32 w-[460px] h-[460px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(45,212,167,0.10),transparent_72%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* uvod */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once} className="max-w-3xl mb-14">
          <motion.span variants={up}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                       border border-brand-600/30 bg-brand-600/10 text-brand-300
                       text-xs font-semibold tracking-wider uppercase">
            <ShieldCheck size={12} /> {d.storyLabel}
          </motion.span>
          <motion.h2 variants={up} className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.08]">
            {d.storyH1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.storyH2}</span>
          </motion.h2>
          <motion.p variants={up} className="text-[var(--text-muted)] leading-relaxed mt-5">{d.storyBody}</motion.p>
          <motion.p variants={up} className="text-[var(--text)] leading-relaxed mt-3 text-[15px] font-medium">{d.storySub}</motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-8 items-start">

          {/* ── lijevo: izbor rubnog slučaja ── */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once}
                      className="flex flex-col gap-2.5" role="tablist" aria-label={d.storyLabel}>
            {d.storySteps.map((step, i) => {
              const on = i === active;
              return (
                <motion.button
                  key={step.t}
                  variants={up}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden text-left rounded-2xl p-5 border
                              transition-[border-color,background-color,transform] duration-300
                              ${on
                                ? "border-brand-600/45 bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] md:backdrop-blur-sm"
                                : "border-[var(--border)] bg-[var(--surface)] hover:border-brand-600/30 hover:-translate-y-0.5"}`}
                >
                  {/* sjaj koji prati aktivnu stavku */}
                  {on && (
                    <motion.span layoutId="qa-glow" aria-hidden
                      transition={{ type: "spring", stiffness: 260, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-2xl
                                 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(37,99,235,0.16),transparent_60%)]" />
                  )}
                  <span className="flex items-start gap-3.5">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                                      text-[12px] font-extrabold transition-colors duration-300
                                      ${on ? "bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-600/30"
                                           : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]"}`}>
                      0{i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[14.5px] font-extrabold leading-tight
                                        ${on ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                        {step.t}
                      </span>
                      {on && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="block text-[12.5px] text-[var(--text-muted)] leading-relaxed mt-1.5"
                        >
                          {step.d}
                        </motion.span>
                      )}
                    </span>
                  </span>

                  {on && !paused && !reduce && (
                    <motion.span
                      key={`bar-${active}`}
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: STORY_MS / 1000, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[2.5px] w-full origin-left bg-brand-500/60"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── desno: editor s kodom i ishodom ── */}
          <motion.div
            initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={once}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#070C1A]/90 md:backdrop-blur-xl
                       shadow-[0_50px_100px_-40px_rgba(2,8,30,0.9)]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[.07]">
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <AnimatePresence mode="wait">
                <motion.span key={s.file}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 text-[11px] font-mono text-white/40">
                  {s.file}
                </motion.span>
              </AnimatePresence>
              <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                               text-[9.5px] font-bold uppercase tracking-wider
                               text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {d.storyPassed}
              </span>
            </div>

            <div className="p-5 sm:p-6 min-h-[236px]">
              <AnimatePresence mode="wait">
                <motion.div key={active}
                  initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}>
                  <Code code={s.code} />

                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                    className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3
                               border border-emerald-500/30 bg-emerald-500/[.06]"
                  >
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                     bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[9.5px] font-bold uppercase tracking-wider text-emerald-400/80">
                        {d.storyBlocked}
                      </span>
                      <span className="block text-[13px] font-semibold text-[var(--text)] leading-tight mt-0.5">
                        {s.result}
                      </span>
                    </span>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── metrike ── */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={once}
          className="grid sm:grid-cols-3 gap-3.5 mt-8">
          {d.storyMetrics.map((m) => (
            <motion.div key={m.l} variants={up} whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)]
                         bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] md:backdrop-blur-sm p-6
                         transition-[border-color] duration-300 hover:border-brand-600/40">
              <span aria-hidden className="absolute -top-16 -right-12 w-40 h-40 rounded-full pointer-events-none
                                           opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                           bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent_72%)]" />
              <p className="relative text-3xl font-extrabold tracking-tight text-[var(--text)]">{m.v}</p>
              <p className="relative text-[12px] text-[var(--text-muted)] leading-snug mt-2">{m.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Zajednički okvir kartice: tekstura, sjaj u uglu, podizanje na hover ──── */
function Tile({
  className = "", glow = "brand", pattern = "grid", children,
}: {
  className?: string; glow?: "brand" | "emerald" | "amber";
  pattern?: "grid" | "dots" | "none"; children: React.ReactNode;
}) {
  const glows = {
    brand:   "rgba(37,99,235,0.22)",
    emerald: "rgba(16,185,129,0.18)",
    amber:   "rgba(245,158,11,0.16)",
  } as const;

  const patterns = {
    grid: "[background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:26px_26px]",
    dots: "[background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:16px_16px]",
    none: "",
  } as const;

  return (
    <motion.article
      variants={up}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10
                  bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] md:backdrop-blur-sm
                  transition-[border-color,box-shadow] duration-300
                  hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 ${className}`}
    >
      {pattern !== "none" && (
        <span aria-hidden
          className={`absolute inset-0 pointer-events-none opacity-60 ${patterns[pattern]}
                      [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]`} />
      )}
      <span aria-hidden
        className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none
                   opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(closest-side, ${glows[glow]}, transparent 72%)` }} />
      <div className="relative h-full">{children}</div>
    </motion.article>
  );
}

function TileIcon({ children, tone = "brand" }: { children: React.ReactNode; tone?: "brand" | "emerald" }) {
  const tones = {
    brand:   "from-brand-600 to-brand-400 shadow-brand-600/30",
    emerald: "from-emerald-600 to-emerald-400 shadow-emerald-600/30",
  } as const;
  return (
    <span className={`inline-flex w-11 h-11 rounded-2xl items-center justify-center flex-shrink-0
                      bg-gradient-to-br ${tones[tone]} text-white shadow-lg
                      transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
      {children}
    </span>
  );
}

function Bento({ d }: { d: typeof T.bs }) {
  const m = d.modules;
  const reduce = useReducedMotion() ?? false;
  const toneCls = {
    ok:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    warn: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    late: "text-red-400 bg-red-500/10 border-red-500/35",
  } as const;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div aria-hidden className="absolute top-20 left-1/2 -translate-x-1/2 w-[760px] h-[420px] pointer-events-none
                                  bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent_72%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
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
          className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[minmax(0,auto)]">

          {/* ── Flota uživo ── */}
          <Tile className="lg:col-span-4 p-7" glow="brand" pattern="grid">
            <div className="flex items-start justify-between gap-4 mb-4">
              <TileIcon><MapPinned size={19} /></TileIcon>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                               text-[10px] font-bold uppercase tracking-wider
                               text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <motion.span
                  animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {m.ui.live}
              </span>
            </div>
            <h3 className="text-[19px] font-extrabold text-[var(--text)] mb-2">{m.fleet.t}</h3>
            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed mb-5 max-w-lg">{m.fleet.d}</p>

            <div className="rounded-2xl border border-white/10 bg-[#070C1A]/80 p-3 space-y-2">
              {m.fleet.rows.map((r, i) => (
                <motion.div
                  key={r.car}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={once}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex items-center gap-3 rounded-xl border border-white/[.06] px-3.5 py-2.5
                             transition-colors duration-300 hover:border-white/15 hover:bg-white/[.02]"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[.05] flex items-center justify-center flex-shrink-0
                                   transition-transform duration-300 group-hover:translate-x-0.5">
                    <Car size={14} className="text-blue-200/80" />
                  </span>
                  <span className="text-[12.5px] font-bold text-white/85">{r.car}</span>
                  <motion.span
                    animate={reduce || r.tone === "ok" ? undefined : { opacity: [1, 0.45, 1] }}
                    transition={{ duration: r.tone === "late" ? 1.4 : 2.4, repeat: Infinity }}
                    className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
                                text-[10px] font-bold whitespace-nowrap ${toneCls[r.tone]}`}
                  >
                    {r.tone === "late" && <AlertTriangle size={10} />}
                    {r.tone === "warn" && <Clock size={10} />}
                    {r.state}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </Tile>

          {/* ── PDF ugovori ── */}
          <Tile className="lg:col-span-2 p-6" glow="emerald" pattern="dots">
            <TileIcon tone="emerald"><FileSignature size={17} /></TileIcon>
            <h3 className="text-[16px] font-extrabold text-[var(--text)] mt-4 mb-2">{m.pdf.t}</h3>
            <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed mb-4">{m.pdf.d}</p>

            {/* dokument koji se popunjava */}
            <div className="rounded-2xl border border-white/10 bg-[#070C1A]/80 p-3.5">
              <div className="flex items-center gap-2 mb-3">
                <FileSignature size={11} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-white/40">{m.ui.doc}</span>
              </div>
              <div className="space-y-2">
                {m.pdf.chips.map((c, i) => (
                  <div key={c} className="flex items-center gap-2">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${62 - i * 9}%` }}
                      viewport={once}
                      transition={{ duration: 0.55, delay: 0.25 + i * 0.22, ease: "easeOut" }}
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-400/30"
                    />
                    <motion.span
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={once}
                      transition={{ duration: 0.3, delay: 0.55 + i * 0.22 }}
                      className="text-[10px] text-white/35 whitespace-nowrap"
                    >
                      {c}
                    </motion.span>
                  </div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={once}
                transition={{ duration: 0.35, delay: 1.15 }}
                className="mt-3.5 flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-400"
              >
                <Check size={11} strokeWidth={3} /> {m.ui.ready}
              </motion.div>
            </div>
          </Tile>

          {/* ── Smart preuzimanje ── */}
          <Tile className="lg:col-span-3 p-6 sm:p-7" glow="brand" pattern="grid">
            <TileIcon><ScanLine size={17} /></TileIcon>
            <h3 className="text-[17px] font-extrabold text-[var(--text)] mt-4 mb-2">{m.checkin.t}</h3>
            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed mb-5">{m.checkin.d}</p>

            <div className="rounded-2xl border border-white/10 bg-[#070C1A]/80 p-4 space-y-3.5">
              {/* gorivo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
                    <Fuel size={11} /> {m.ui.fuel}
                  </span>
                  <span className="text-[11px] font-bold text-brand-300">
                    <span className="inline-block transition-all duration-500 group-hover:hidden">45%</span>
                    <span className="hidden group-hover:inline-block">100%</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/[.06] overflow-hidden">
                  <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-brand-600 to-brand-400
                                  transition-[width] duration-700 ease-out group-hover:w-full" />
                </div>
              </div>

              {/* kilometraža */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
                  <Gauge size={11} /> {m.ui.km}
                </span>
                <span className="text-[11px] font-mono font-bold text-white/70">84 210 km</span>
              </div>

              {/* potpis */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[.06]">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
                  <FileSignature size={11} /> {m.ui.sign}
                </span>
                <svg width="76" height="20" viewBox="0 0 76 20" fill="none" aria-hidden>
                  <motion.path
                    d="M2 14c6-9 10 2 15-3s7 6 12 1 9 3 14-2 8 4 11 1"
                    stroke="rgb(96,165,250)" strokeWidth="1.6" strokeLinecap="round"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={once}
                    transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </div>
          </Tile>

          {/* ── Dvojezično ── */}
          <Tile className="lg:col-span-1 p-6 flex flex-col" glow="brand" pattern="dots">
            <TileIcon><Languages size={17} /></TileIcon>
            <h3 className="text-[14.5px] font-extrabold text-[var(--text)] leading-tight mt-4 mb-1.5">{m.lang.t}</h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed mb-4">{m.lang.d}</p>
            <div className="mt-auto flex flex-col gap-1.5">
              {[m.lang.a, m.lang.b].map((l, i) => (
                <motion.span
                  key={l}
                  initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={once}
                  transition={{ duration: 0.35, delay: 0.15 * i }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-center
                             text-[var(--text)] bg-[var(--bg)] border border-white/10"
                >
                  {l}
                </motion.span>
              ))}
            </div>
          </Tile>

          {/* ── Brzina ── */}
          <Tile className="lg:col-span-2 p-6" glow="emerald" pattern="grid">
            <TileIcon tone="emerald"><Gauge size={17} /></TileIcon>
            <h3 className="text-[15px] font-extrabold text-[var(--text)] leading-tight mt-4 mb-1.5">{m.speed.t}</h3>
            <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed mb-4">{m.speed.d}</p>

            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">{m.speed.before}</span>
                  <span className="text-[11px] font-bold text-red-400">21,6 s</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[.06] overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={once}
                    transition={{ duration: 0.8 }} className="h-full rounded-full bg-red-500/50" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">{m.speed.after}</span>
                  <span className="text-[11px] font-bold text-emerald-400">3,2 s</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[.06] overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "15%" }} viewport={once}
                    transition={{ duration: 0.8, delay: 0.25 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
                </div>
              </div>
            </div>
          </Tile>
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
