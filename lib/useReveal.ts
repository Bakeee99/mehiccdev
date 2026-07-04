/**
 * lib/useReveal.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Deterministic scroll-reveal that fires EXACTLY once per block.
 *
 * Why this exists (the "double animation" bug):
 * The old pattern flipped the `initial` prop on already-mounted motion
 * components (`initial={seen ? false : "hidden"}`) and SHARED one `seen`
 * state across several blocks in a section. When the first block entered
 * the viewport, `setSeen(true)` re-rendered every other block mid-flight
 * with a changed `initial` prop — Framer Motion would briefly snap them
 * visible and then run the whileInView animation again ("load, disappear,
 * load again" + lag).
 *
 * The fix: `initial` never changes. The animation is driven purely by the
 * `animate` prop, which flips from "hidden" → "visible" exactly once, when
 * THIS block enters the viewport. Each block owns its own state (call the
 * hook once per motion block).
 *
 * Language/theme switches are still safe: after the flip, `animate` stays
 * "visible" through every re-render, so content never disappears.
 *
 * USAGE:
 *   const revealHead = useReveal();
 *   const revealGrid = useReveal();
 *   <motion.div variants={staggerContainer} {...revealHead}>…</motion.div>
 *   <motion.div variants={staggerContainerSlow} {...revealGrid}>…</motion.div>
 */

"use client";

import { useState } from "react";
import { viewportOnce } from "@/lib/animations";

export function useReveal() {
  const [seen, setSeen] = useState(false);
  return {
    initial: "hidden",
    animate: seen ? "visible" : "hidden",
    viewport: viewportOnce,
    onViewportEnter: () => setSeen(true),
  } as const;
}
