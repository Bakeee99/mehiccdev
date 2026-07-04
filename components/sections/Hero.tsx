/**
 * components/sections/Hero.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modern split hero:
 *   • Left  — badge, headline (with italic serif accent), subtitle, CTAs,
 *             slim inline stats row.
 *   • Right — rotating 3D "network sphere" of glowing dots (pure canvas,
 *             zero dependencies), sitting BEHIND content (pointer-events: none).
 *
 * The sphere is sized so it can never clip during rotation:
 *   max projected radius = scale × maxPerspective (≈1.09) + dot glow margin,
 *   kept safely below half of the canvas' smaller dimension.
 *
 * Respects prefers-reduced-motion (renders a static sphere).
 * Cleans up rAF + resize listeners on unmount.
 */

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

// ─── 3D network sphere (canvas) ──────────────────────────────────────────────
function NetworkSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Static geometry: Fibonacci sphere (evenly spread points) ──
    const N = 110;
    const pts3d: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * 2.399963229728653; // golden angle
      pts3d.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    // Pre-compute "network" links between nearby points (static, cheap)
    const links: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts3d[i][0] - pts3d[j][0];
        const dy = pts3d[i][1] - pts3d[j][1];
        const dz = pts3d[i][2] - pts3d[j][2];
        if (dx * dx + dy * dy + dz * dz < 0.16) links.push([i, j]);
      }
    }

    let raf = 0;
    let angle = 0.6;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rotate = (
      p: [number, number, number],
      ax: number,
      ay: number
    ): [number, number, number] => {
      const [x, y, z] = p;
      const cy = Math.cos(ay), sy = Math.sin(ay);
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const cx = Math.cos(ax), sx = Math.sin(ax);
      const y1 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      return [x1, y1, z2];
    };

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      // Anti-clipping: max perspective factor = dist/(dist - 0.55) ≈ 1.085.
      // scale 0.40 × 1.085 ≈ 0.434 of min dimension + ~6px glow < 0.5 → never clips.
      const scale = Math.min(w, h) * 0.4;
      const dist = 7;

      const projected = pts3d.map((p) => {
        const r = rotate(p, angle * 0.35, angle);
        const persp = dist / (dist - r[2] * 0.55);
        return {
          x: cx + r[0] * scale * persp,
          y: cy + r[1] * scale * persp,
          z: r[2],
        };
      });

      // Links (faint, depth-shaded)
      ctx.lineWidth = 1;
      for (const [a, b] of links) {
        const z = (projected[a].z + projected[b].z) / 2;
        const alpha = 0.05 + 0.16 * ((z + 1) / 2);
        ctx.strokeStyle = `rgba(96,165,250,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
        ctx.stroke();
      }

      // Dots (glowing, depth-shaded)
      for (const p of projected) {
        const depth = (p.z + 1) / 2; // 0 (back) → 1 (front)
        const alpha = 0.25 + 0.65 * depth;
        const radius = 1.6 + 2.1 * depth;

        ctx.beginPath();
        ctx.fillStyle = `rgba(37,99,235,${alpha.toFixed(3)})`;
        ctx.shadowColor = "rgba(37,99,235,0.85)";
        ctx.shadowBlur = 10;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.8).toFixed(3)})`;
        ctx.arc(p.x, p.y, radius * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        angle += 0.0045;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden />;
}

// ─── Hero section ─────────────────────────────────────────────────────────────
export function Hero() {
  const { t } = useLanguage();

  const STATS = [
    { value: t.stats.projectsValue, label: t.stats.projects },
    { value: t.stats.clientsValue,  label: t.stats.clients  },
    { value: t.stats.marketsValue,  label: t.stats.markets  },
    { value: t.stats.supportValue,  label: t.stats.support  },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_70%_25%,rgba(37,99,235,0.14),transparent)]
                   dark:bg-[radial-gradient(ellipse_55%_45%_at_70%_25%,rgba(59,130,246,0.18),transparent)]"
        aria-hidden
      />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" aria-hidden />

      {/* ── 3D network sphere — background layer, never blocks clicks ── */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[52%] z-0 pointer-events-none
                   flex items-center justify-center
                   opacity-[0.28] lg:opacity-90 transition-opacity duration-500"
        aria-hidden
      >
        {/* soft glow behind the sphere */}
        <div className="absolute w-[46%] aspect-square rounded-full
                        bg-[radial-gradient(circle,rgba(37,99,235,0.22),transparent_70%)] blur-2xl" />
        <div className="w-full h-[78%] max-h-[640px]">
          <NetworkSphere />
        </div>
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8
                   grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center"
      >
        <div className="text-center lg:text-left">
          <motion.div variants={fadeUp} className="flex justify-center lg:justify-start mb-7">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <Sparkles size={12} />
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05] mb-7"
          >
            {t.hero.title1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">
              {t.hero.titleAccent}
            </span>{" "}
            {t.hero.title2}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl leading-relaxed text-[var(--text-muted)] mb-10"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12"
          >
            <a
              href="#kontakt"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-xl
                         bg-brand-600 hover:bg-brand-700 text-white font-semibold text-[15px]
                         transition-all duration-200 hover:shadow-xl hover:shadow-brand-600/30
                         hover:-translate-y-0.5"
            >
              {t.hero.ctaPrimary}
              <ArrowRight size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-xl
                         border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm
                         hover:bg-[var(--surface)] hover:border-brand-600/40
                         text-[var(--text)] font-semibold text-[15px]
                         transition-all duration-200 hover:-translate-y-0.5"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Slim inline stats */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center lg:justify-start
                       gap-x-8 gap-y-4 sm:gap-x-10"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-2xl sm:text-[28px] font-extrabold text-gradient leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-muted)] font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column is intentionally empty — the sphere lives in the
            background layer so it can never overlap or block the content. */}
        <div className="hidden lg:block" aria-hidden />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={20} className="text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
