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
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
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
    pause: "Pauza", play: "Pokreni", replay: "Ispočetka",
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
    pause: "Pause", play: "Play", replay: "Replay",
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
  const [playing, setPlaying] = useState(false); // za ikonicu Pauza / Pokreni

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

  /* 3) Prezentacija javlja da li se trenutno vrti, za dugme na traci. */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "demo-state") setPlaying(!!e.data.playing);
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
            {d.h1} <span className="text-[#0F3554]">{d.accent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[#475569]">
            {d.sub}
          </p>
        </div>

        {/* ── plejer ────────────────────────────────────────────────────────
            Prezentacija i sve što uz nju ide u jednoj kartici: scena gore,
            a ispod jedna traka s kontrolama, cijenom i dugmetom. Ranije su
            kontrole bile unutar prezentacije, a dugme i cijena ispod nje,
            odvojeno, pa je izgledalo kao da su slučajno tu.

            Sjena je postavljena kroz style, jer stranica ima pravilo koje
            utišava sve klase sa sjenom. */}
        <div
          ref={wrapRef}
          className="mt-14 sm:mt-16 -mx-6 sm:mx-0 overflow-hidden bg-white sm:rounded-[20px] border-y sm:border border-[#E5E7EB]"
          style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 24px 48px -24px rgba(15,23,42,0.18)" }}
        >
          {/* scena: tačno 16:9, kao prezentacija, pa nema klizača ni praznine */}
          <div className="relative aspect-video bg-[#0F3554]">
            {load && (
              <iframe
                ref={frameRef}
                src={`${SRC}?embed&lang=${l}`}
                title={d.frameTitle}
                loading="lazy"
                scrolling="no"
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

          {/* traka: kontrole lijevo, cijena u sredini, dugme desno */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 sm:px-6 py-4 sm:py-5 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => send({ type: "toggle" })}
                  aria-label={playing ? d.pause : d.play}
                  title={playing ? d.pause : d.play}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#0F172A] text-white
                             transition-colors duration-200 hover:bg-[#1E293B]"
                >
                  {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => send({ type: "replay" })}
                  aria-label={d.replay}
                  title={d.replay}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] text-[#475569]
                             transition-colors duration-200 hover:bg-[#F9FAFB] hover:text-[#0F172A]"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <span className="h-8 w-px bg-[#E5E7EB]" aria-hidden />

              <div className="min-w-0 text-left">
                <p className="text-[15px] font-semibold leading-tight text-[#0F172A]">{d.priceTag}</p>
                <p className="mt-0.5 text-[13px] leading-tight text-[#64748B]">{d.ctaSub}</p>
              </div>
            </div>

            <a
              href="/rjesenja/rent-a-car"
              className="sm:ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3
                         text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#1E293B]"
            >
              {d.cta}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
