/**
 * lib/rateLimit.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Najjednostavniji rate limiting: koliko zahtjeva s iste IP adrese u zadatom
 * prozoru. Drži se u memoriji procesa.
 *
 * OGRANIČENJE (svjesno): Vercel pokreće više instanci funkcije, pa brojač nije
 * dijeljen između njih. Ovo zaustavlja obično slanje forme u petlji, ali nije
 * zaštita od ozbiljnog napada. Ako spam ikad postane stvaran problem, ovdje se
 * zamjenjuje Upstash Redis brojačem bez diranja ostatka koda.
 */

type Hit = { count: number; resetAt: number };
const hits = new Map<string, Hit>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const hit = hits.get(key);

  if (!hit || now > hit.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (hit.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.resetAt - now) / 1000) };
  }
  hit.count += 1;
  return { ok: true, remaining: limit - hit.count };
}
