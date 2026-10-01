/**
 * components/sections/SystemDemo.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Naš sistem za rent-a-car": prikaz cijelog sistema u pokretu.
 *
 * Zamjenjuje staru promo sekciju (RentACarPromo). Umjesto da opisuje sistem,
 * pokazuje ga: animirana prezentacija prolazi put od pitanja gosta, preko
 * izbora vozila i datuma, do admin panela, ugovora i aktivnih rezervacija.
 *
 * KAKO JE UGRAĐENA
 *   Prezentacija je samostalan HTML fajl u public/demo/rent-a-car.html, sa
 *   svojim stilovima i skriptom. Stoji u <iframe>, pa se ništa od njenog
 *   koda ne miješa sa sajtom, i obrnuto.
 *
 *   Sajt i prezentacija razgovaraju porukama (postMessage):
 *     sajt → prezentacija  "lang"     promjena jezika na sajtu
 *     sajt → prezentacija  "visible"  sekcija je u vidnom polju, kreni
 *     sajt → prezentacija  "hidden"   sekcija je izašla iz vida, pauziraj
 *     prezentacija → sajt  "demo-height"  koliko je visoka, da okvir stane tačno
 *
 * ZAŠTO BAŠ OVAKO
 *   • okvir se učitava tek kad se posjetilac približi sekciji, pa ne
 *     usporava prvo otvaranje naslovnice
 *   • sekvenca kreće tek kad je sekcija vidljiva, pa je posjetilac gleda od
 *     početka, a ne od sredine
 *   • kad posjetilac odskrola dalje, pauzira se, i nastavlja kad se vrati
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

const SRC = "/demo/rent-a-car.html";

const T = {
  bs: {
    label: "Naš sistem za rent-a-car",
    h1: "Cijeli sistem za iznajmljivanje vozila,",
    accent: "na jednoj stranici",
    sub: "Sajt, kalendar dostupnosti i admin panel rade zajedno. Gost rezerviše sam, vi potvrđujete jednim klikom, a vozilo se zaključa za te datume.",
    cta: "Pogledajte sistem i cijene",
    priceTag: "Paketi od 1.500 KM",
    ctaSub: "Cijene, paketi i primjer iz prakse",
    frameTitle: "Prikaz rezervacijskog sistema za rent-a-car",
  },
  en: {
    label: "Our car rental system",
    h1: "A complete car rental system,",
    accent: "on one page",
    sub: "The website, availability calendar and admin panel work together. The guest books on their own, you confirm in one click, and the vehicle locks for those dates.",
    cta: "See the system and pricing",
    priceTag: "Packages from €750",
    ctaSub: "Pricing, packages and a real example",
    frameTitle: "Walkthrough of the car rental booking system",
  },
} as const;

export function SystemDemo() {
  const { lang } = useLanguage();
  const l = (lang === "en" ? "en" : "bs") as "bs" | "en";
  const d = T[l];

  const wrapRef  = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const [load,   setLoad]   = useState(false);   // je li okvir uopšte učitan
  const visibleRef = useRef(false);              // je li sekcija trenutno u vidu
  const [height, setHeight] = useState<number | null>(null);

  /* Pošalji poruku prezentaciji (samo istom domenu). */
  const send = (msg: object) =>
    frameRef.current?.contentWindow?.postMessage(msg, window.location.origin);

  /* 1) Učitaj okvir kad se posjetilac približi (600 px prije sekcije). */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect(); } },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* 2) Kreni kad je bar trećina vidljiva, pauziraj kad izađe iz vida. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !load) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        send({ type: e.isIntersecting ? "visible" : "hidden" });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  /* 3) Prezentacija javlja svoju visinu, okvir se prilagodi. */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "demo-height" && typeof e.data.h === "number") setHeight(e.data.h);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  /* 4) Promjena jezika na sajtu mijenja jezik i u prezentaciji. */
  useEffect(() => { send({ type: "lang", lang: l }); }, [l]);

  return (
    <section id="rent-a-car" className="relative bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* ── zaglavlje ── */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            {d.label}
          </p>
          <h2 className="mt-4 text-[32px] leading-[1.12] sm:text-5xl font-semibold tracking-[-0.03em] text-[#0F172A]"
              style={{ textWrap: "balance" }}>
            {d.h1} <span className="text-[#94A3B8]">{d.accent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[#475569]">
            {d.sub}
          </p>
        </div>

        {/* ── prezentacija ──
            Dok se okvir ne učita i ne javi visinu, rezerviše se prostor u
            omjeru 16:9 plus traka s kontrolama, da se stranica ne trza. */}
        <div ref={wrapRef} className="mt-14 sm:mt-16 -mx-6 sm:mx-0">  {/* na telefonu od ivice do ivice */}
          <div
            className="relative w-full"
            style={height ? { height } : { aspectRatio: "16 / 9", paddingBottom: 56 }}
          >
            {load && (
              <iframe
                ref={frameRef}
                src={`${SRC}?embed&lang=${l}`}
                title={d.frameTitle}
                loading="lazy"
                onLoad={() => {
                  // poruke poslate prije učitavanja su se izgubile, pa ih
                  // ponavljamo: jezik, i "kreni" ako je sekcija već u vidu
                  send({ type: "lang", lang: l });
                  if (visibleRef.current) send({ type: "visible" });
                }}
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
          </div>
        </div>

        {/* ── poziv na akciju ── */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/rjesenja/rent-a-car"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3.5
                         text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1E293B]"
            >
              {d.cta}
              <ArrowRight size={16} />
            </a>
            <span className="inline-flex items-center rounded-full border border-[#E5E7EB] px-4 py-2
                             text-[13px] font-semibold text-[#0F172A]">
              {d.priceTag}
            </span>
          </div>
          <p className="text-[13px] text-[#64748B]">{d.ctaSub}</p>
        </div>
      </div>
    </section>
  );
}
