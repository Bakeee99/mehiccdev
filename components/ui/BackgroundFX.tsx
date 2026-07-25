/**
 * components/ui/BackgroundFX.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Potpisna pozadina v2: "ŽIVI SISTEM".
 *
 * Slojevi (redom, od pozadine ka naprijed):
 *   1. Studijsko svjetlo s vrha (fixed, radial gradijent)
 *   2. Editorijalne šine uz rubove sadržajnog stupca (fixed, desktop)
 *   3. PULS: svijetli signal koji putuje niz svaku šinu, kao podatak kroz
 *      sistem (čist CSS transform, keyframes u globals.css, desktop)
 *   4. BLUEPRINT FRAGMENTI: blijede wireframe skice (browser, telefon,
 *      dijagram toka) na različitim dubinama stranice, pa se pozadina
 *      MIJENJA dok se skrola (apsolutno u toku sadržaja, desktop)
 *   5. Zrno preko svega (fixed, .bg-noise iz globals.css)
 *
 * Performanse: nula JavaScripta, nula blur filtera; animacija je samo
 * transform. Na telefonu se vide samo svjetlo + zrno (šine/puls/skice su
 * desktop detalj). motion-reduce gasi puls.
 */

export function BackgroundLayers() {
  return (
    <>
      {/* 1 · studijsko svjetlo */}
      <div aria-hidden className="fixed inset-x-0 top-0 h-[85vh] z-0 pointer-events-none
                                  bg-[radial-gradient(120%_75%_at_50%_-15%,rgba(37,99,235,0.13),transparent_62%)]
                                  dark:bg-[radial-gradient(120%_75%_at_50%_-15%,rgba(59,130,246,0.16),transparent_62%)]" />

      {/* 2+3 · šine s pulsom */}
      <div aria-hidden className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 lg:px-8 z-0 pointer-events-none hidden md:block">
        <div className="relative h-full border-x border-[color-mix(in_srgb,var(--border)_45%,transparent)]">
          {/* puls niz lijevu šinu */}
          <span className="absolute -left-px top-0 w-px h-44 animate-rail-pulse motion-reduce:hidden
                           bg-gradient-to-b from-transparent via-brand-500/80 to-transparent" />
          {/* puls niz desnu šinu, drugi ritam */}
          <span className="absolute -right-px top-0 w-px h-44 animate-rail-pulse-slow motion-reduce:hidden
                           bg-gradient-to-b from-transparent via-sky-400/70 to-transparent" />
        </div>
      </div>

      {/* 5 · zrno */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.035] dark:opacity-[0.05]" />
    </>
  );
}

/* ── Blueprint fragmenti: idu UNUTAR sadržajnog toka (skroluju sa stranicom),
     na različitim dubinama, pa pozadina nije ista na svakom ekranu. ── */

function WireBrowser() {
  return (
    <svg width="230" height="150" viewBox="0 0 230 150" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="1" y="1" width="228" height="148" rx="8" />
      <line x1="1" y1="24" x2="229" y2="24" />
      <circle cx="14" cy="12.5" r="3" /><circle cx="26" cy="12.5" r="3" /><circle cx="38" cy="12.5" r="3" />
      <rect x="14" y="38" width="120" height="10" rx="3" />
      <rect x="14" y="56" width="80" height="8" rx="3" />
      <rect x="14" y="76" width="56" height="18" rx="5" />
      <rect x="150" y="38" width="66" height="56" rx="6" strokeDasharray="4 4" />
      {/* kota kao na tehničkom crtežu */}
      <line x1="150" y1="106" x2="216" y2="106" /><line x1="150" y1="101" x2="150" y2="111" /><line x1="216" y1="101" x2="216" y2="111" />
      <text x="168" y="120" fontSize="9" stroke="none" fill="currentColor">320px</text>
    </svg>
  );
}

function WirePhone() {
  return (
    <svg width="110" height="200" viewBox="0 0 110 200" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="1" y="1" width="108" height="198" rx="16" />
      <line x1="40" y1="12" x2="70" y2="12" strokeLinecap="round" />
      <rect x="14" y="30" width="82" height="44" rx="6" strokeDasharray="4 4" />
      <rect x="14" y="84" width="60" height="8" rx="3" />
      <rect x="14" y="98" width="44" height="8" rx="3" />
      <rect x="14" y="150" width="82" height="22" rx="8" />
      <text x="34" y="165" fontSize="9" stroke="none" fill="currentColor">REZERVIŠI</text>
    </svg>
  );
}

function WireFlow() {
  return (
    <svg width="260" height="120" viewBox="0 0 260 120" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="1" y="40" width="70" height="34" rx="7" />
      <text x="14" y="61" fontSize="9" stroke="none" fill="currentColor">UPIT</text>
      <line x1="71" y1="57" x2="105" y2="57" strokeDasharray="4 4" />
      <path d="M100 52 L108 57 L100 62" />
      <rect x="108" y="40" width="70" height="34" rx="7" />
      <text x="118" y="61" fontSize="9" stroke="none" fill="currentColor">SISTEM</text>
      <line x1="178" y1="57" x2="212" y2="57" strokeDasharray="4 4" />
      <path d="M207 52 L215 57 L207 62" />
      <rect x="215" y="40" width="44" height="34" rx="7" />
      <text x="224" y="61" fontSize="9" stroke="none" fill="currentColor">✓ 2s</text>
      <line x1="1" y1="94" x2="259" y2="94" strokeDasharray="2 6" />
    </svg>
  );
}

export function BlueprintLayer() {
  const base = "absolute pointer-events-none hidden lg:block text-[var(--text-muted)] opacity-[0.08] dark:opacity-[0.1]";
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" >
      <div className={`${base} top-[115vh] left-[3%] -rotate-6`}><WireBrowser /></div>
      <div className={`${base} top-[240vh] right-[4%] rotate-3`}><WirePhone /></div>
      <div className={`${base} top-[390vh] left-[5%] -rotate-2`}><WireFlow /></div>
      <div className={`${base} top-[540vh] right-[3%] rotate-6`}><WireBrowser /></div>
      <div className={`${base} top-[680vh] left-[4%] rotate-2`}><WirePhone /></div>
    </div>
  );
}
