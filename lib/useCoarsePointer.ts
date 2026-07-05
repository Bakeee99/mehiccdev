/**
 * lib/useCoarsePointer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Vraća true na touch uređajima (telefoni/tableti, "(pointer: coarse)").
 *
 * Zašto postoji: kontinuirane animacije velikih blur slojeva (aurora oblaci,
 * plutajuće kartice) i backdrop-blur preko sadržaja koji se skrola su jeftini
 * na desktop GPU-u, ali na mobilnim čipovima ubijaju glatkoću skrolanja i
 * usporavaju promjenu teme. Sekcije zato računaju:
 *
 *   const calm = useReducedMotion() || useCoarsePointer();
 *
 * i kad je calm=true, dekorativne beskonačne animacije miruju (sve ostaje
 * vidljivo, samo statično). Reveal animacije pri skrolanju NISU dirane.
 */

"use client";

import { useEffect, useState } from "react";

export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return coarse;
}
