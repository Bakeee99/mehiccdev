/**
 * lib/contact.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠ OVDJE UPIŠI SVOJ BROJ, NA JEDNOM MJESTU ZA CIJELI SAJT.
 *
 * Broj se koristi na tri mjesta: plutajuće WhatsApp dugme, kontakt sekcija na
 * naslovnici i forma na rent-a-car stranici. Mijenja se samo ovdje.
 *
 *   PHONE_DISPLAY  → kako se broj VIDI na sajtu, piši ga prirodno
 *   PHONE_DIAL     → kako se ZOVE, bez razmaka, s pozivnim brojem države
 *   WHATSAPP       → samo cifre, bez plusa, razmaka i nule na početku
 *
 * Primjer za +387 61 234 567:
 *   PHONE_DISPLAY = "+387 61 234 567"
 *   PHONE_DIAL    = "+38761234567"
 *   WHATSAPP      = "38761234567"
 *
 * Dok su prazni, dugmad se same sakriju i ništa ne puca.
 */

export const PHONE_DISPLAY = "+387 62 784 029";
export const PHONE_DIAL    = "+38762784029";
export const WHATSAPP      = "38762784029";

export const WA_PREFILL = {
  bs: "Pozdrav, vidio sam vaš sajt i zanima me ",
  en: "Hi, I saw your website and I'm interested in ",
};

export function waLink(lang: string) {
  if (!WHATSAPP) return null;
  const text = lang === "en" ? WA_PREFILL.en : WA_PREFILL.bs;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}
