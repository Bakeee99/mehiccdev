/**
 * app/api/upit-rent-a-car/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Prima upit s rent-a-car landing stranice i šalje ga na email.
 *
 * Redoslijed provjera: honeypot → rate limit → Zod validacija → slanje.
 *
 * ⚠ POTREBNA PODEŠAVANJA prije nego proradi u produkciji:
 *   1. Otvori nalog na resend.com (besplatan plan je dovoljan)
 *   2. Dodaj u Vercel → Settings → Environment Variables:
 *        RESEND_API_KEY   = re_xxxxx
 *        UPIT_EMAIL_TO    = bakir.mehic@mehiccdev.com
 *        UPIT_EMAIL_FROM  = upiti@mehiccdev.com   (domena mora biti verifikovana
 *                           na Resendu; dok nije, koristi onboarding@resend.dev)
 *   3. Redeploy
 * Bez ključa ruta vraća jasnu grešku i upit se NE gubi tiho.
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rentACarInquirySchema } from "@/lib/schemas/rentACarInquiry";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // ── IP za rate limiting ───────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // ── Honeypot: bot popuni skriveno polje, čovjek ne ────────────────────────
  if (typeof body === "object" && body !== null && "website" in body) {
    const hp = (body as Record<string, unknown>).website;
    if (typeof hp === "string" && hp.length > 0) {
      // Botu vraćamo "uspjeh" da ne pokušava ponovo, ali ništa ne šaljemo.
      return NextResponse.json({ ok: true });
    }
  }

  // ── Rate limit: 5 upita po IP-u u 10 minuta ───────────────────────────────
  const limited = rateLimit(`rent-a-car:${ip}`);
  if (!limited.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // ── Validacija (server nikad ne vjeruje klijentu) ─────────────────────────
  const parsed = rentACarInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const d = parsed.data;

  // ── Slanje ────────────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const to     = process.env.UPIT_EMAIL_TO   ?? "bakir.mehic@mehiccdev.com";
  const from   = process.env.UPIT_EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    // Namjerno glasno: bolje vidljiva greška nego tiho izgubljen upit.
    console.error("[upit-rent-a-car] RESEND_API_KEY nije podešen. Upit:", d);
    return NextResponse.json({ error: "email_not_configured" }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Broj vozila",        d.fleetSize],
    ["Broj lokacija",      d.locations],
    ["Prima rezervacije",  d.channels.join(", ")],
    ["Koristi agregatore", d.aggregators],
    ["Postojeći sajt",     d.currentSite || "nije naveden"],
    ["Kada kreće",         d.timeline],
    ["Ime i prezime",      d.fullName],
    ["Firma",              d.company || "nije navedena"],
    ["Telefon",            d.phone],
    ["Email",              d.email],
    ["Napomena",           d.note || "nema"],
  ];

  const html = `
    <h2 style="font-family:system-ui,sans-serif">Novi upit: rent-a-car sistem</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 14px 6px 0;color:#71717A">${k}</td>
                 <td style="padding:6px 0"><strong>${String(v).replace(/</g, "&lt;")}</strong></td></tr>`
        )
        .join("")}
    </table>`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: d.email,
      subject: `Upit rent-a-car sistem: ${d.company || d.fullName} (${d.fleetSize} vozila)`,
      html,
    });
  } catch (err) {
    console.error("[upit-rent-a-car] Slanje nije uspjelo:", err, "Upit:", d);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // TODO: ovdje dodati upis u Google Sheet (Sheets API ili Apps Script webhook).
  // Podaci su u objektu `d`, već validirani. Upis staviti u try/catch da
  // eventualna greška u Sheetu ne obori odgovor korisniku, jer je email poslan.

  return NextResponse.json({ ok: true });
}
