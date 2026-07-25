/**
 * components/ui/BackgroundFX.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Potpisna pozadina v4: "ČISTI MINIMUM".
 *
 * v4 = v3 minus blueprint skice (osjećaj nabacanosti), uz stišan reflektor.
 * Ostaju tri tiha sloja: ambijent koji putuje sa skrolom, šine s pulsom
 * (naš "binarni kod, samo odrastao") i zrno.
 *
 * Novo u v3 (dva PONAŠANJA umjesto novih tekstura):
 *   • REFLEKTOR: mekan brand sjaj (~900px) koji prati miš kroz spring
 *     animaciju (samo desktop, samo transform, GPU).
 *   • AMBIJENT: svjetlo stranice se seli sa skrolom. Dva fiksna gradijentna
 *     sloja (A: plavo svjetlo s vrha, B: indigo/cijan svjetlo iz dna) čija
 *     se prozirnost ukršta prema dubini skrola: vrh sajta i dno sajta imaju
 *     potpuno različit ambijent, i nijedan ekran između nije isti.
 *     Mijenja se SAMO opacity (GPU, jeftino), nikad sam gradijent.
 *
 * Zadržano iz v2: editorijalne šine s pulsom, blueprint skice po dubini
 * stranice, zrno. Na telefonu / uz reduced-motion: statični sloj A + zrno
 * (reflektor i ukrštanje isključeni), mobilna dijeta netaknuta.
 */

"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useCoarsePointer } from "@/lib/useCoarsePointer";

const SPOT = 900; // prečnik reflektora u px

export function BackgroundLayers() {
  const reduce = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  const calm = reduce || coarse;

  /* ── Reflektor: prati miš kroz oprugu ─────────────────────────────────── */
  const mx = useMotionValue(-SPOT);
  const my = useMotionValue(-SPOT);
  const sx = useSpring(mx, { stiffness: 55, damping: 24, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 55, damping: 24, mass: 0.7 });

  useEffect(() => {
    if (calm) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX - SPOT / 2);
      my.set(e.clientY - SPOT / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [calm, mx, my]);

  /* ── Ambijent: ukrštanje dva svjetla prema dubini skrola ──────────────── */
  const topLight = useRef<HTMLDivElement>(null);
  const botLight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calm) {
      // statično stanje: samo gornje svjetlo
      if (topLight.current) topLight.current.style.opacity = "1";
      if (botLight.current) botLight.current.style.opacity = "0";
      return;
    }
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (topLight.current) topLight.current.style.opacity = String(1 - p * 0.85);
      if (botLight.current) botLight.current.style.opacity = String(p);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [calm]);

  return (
    <>
      {/* ambijent A: plavo svjetlo s vrha (vidljivo na početku stranice) */}
      <div ref={topLight} aria-hidden
           className="fixed inset-0 z-0 pointer-events-none will-change-[opacity]
                      bg-[radial-gradient(120%_75%_at_50%_-15%,rgba(37,99,235,0.13),transparent_62%)]
                      dark:bg-[radial-gradient(120%_75%_at_50%_-15%,rgba(59,130,246,0.17),transparent_62%)]" />

      {/* ambijent B: indigo/cijan svjetlo iz dna (preuzima kako se skrola) */}
      <div ref={botLight} aria-hidden style={{ opacity: 0 }}
           className="fixed inset-0 z-0 pointer-events-none will-change-[opacity]
                      bg-[radial-gradient(110%_70%_at_18%_115%,rgba(99,102,241,0.14),transparent_58%),radial-gradient(110%_70%_at_85%_112%,rgba(56,189,248,0.12),transparent_58%)]
                      dark:bg-[radial-gradient(110%_70%_at_18%_115%,rgba(129,140,248,0.16),transparent_58%),radial-gradient(110%_70%_at_85%_112%,rgba(56,189,248,0.15),transparent_58%)]" />

      {/* reflektor koji prati miš (samo desktop, bez calm režima) */}
      {!calm && (
        <motion.div
          aria-hidden
          style={{ x: sx, y: sy, width: SPOT, height: SPOT }}
          className="hidden lg:block fixed top-0 left-0 z-0 pointer-events-none rounded-full
                     bg-[radial-gradient(closest-side,rgba(59,130,246,0.06),transparent_66%)]
                     dark:bg-[radial-gradient(closest-side,rgba(96,165,250,0.08),transparent_66%)]"
        />
      )}

      {/* editorijalne šine s pulsom */}
      <div aria-hidden className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 lg:px-8 z-0 pointer-events-none hidden md:block">
        <div className="relative h-full border-x border-[color-mix(in_srgb,var(--border)_45%,transparent)]">
          <span className="absolute -left-px top-0 w-px h-44 animate-rail-pulse motion-reduce:hidden
                           bg-gradient-to-b from-transparent via-brand-500/80 to-transparent" />
          <span className="absolute -right-px top-0 w-px h-44 animate-rail-pulse-slow motion-reduce:hidden
                           bg-gradient-to-b from-transparent via-sky-400/70 to-transparent" />
        </div>
      </div>

      {/* zrno preko svega */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.035] dark:opacity-[0.05]" />
    </>
  );
}

/* ── v4: blueprint skice uklonjene ("čisti minimum"). Prazna komponenta
     ostaje da layout.tsx ne mora mijenjati import. ── */
export function BlueprintLayer() {
  return null;
}
