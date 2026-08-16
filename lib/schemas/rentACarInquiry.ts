/**
 * lib/schemas/rentACarInquiry.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Zod šema za upit s rent-a-car landing stranice.
 *
 * Jedna šema, dvije upotrebe: klijent njome validira formu prije slanja, a
 * API ruta istom šemom provjerava tijelo zahtjeva (klijentska validacija se
 * uvijek može zaobići, pa server nikad ne vjeruje ulazu).
 * TS tip je IZVEDEN iz šeme, pa ne može odlutati od nje.
 */

import { z } from "zod";

export const FLEET_SIZES   = ["1-9", "10-20", "21-40", "40+"] as const;
export const LOCATIONS     = ["1", "2-3", "4+"] as const;
export const CHANNELS      = ["telefon", "viber-whatsapp", "sajt", "agregatori", "walk-in"] as const;
export const AGGREGATORS   = ["da", "ne"] as const;
export const TIMELINES     = ["odmah", "prije-sezone", "istrazujem"] as const;

export const rentACarInquirySchema = z.object({
  fleetSize:  z.enum(FLEET_SIZES,  { message: "required" }),
  locations:  z.enum(LOCATIONS,    { message: "required" }),
  channels:   z.array(z.enum(CHANNELS)).min(1, { message: "required" }),
  aggregators: z.enum(AGGREGATORS, { message: "required" }),
  currentSite: z.string().trim().url({ message: "url" }).optional().or(z.literal("")),
  timeline:   z.enum(TIMELINES,    { message: "required" }),
  fullName:   z.string().trim().min(2,  { message: "required" }).max(80),
  company:    z.string().trim().max(80).optional().or(z.literal("")),
  phone:      z.string().trim().min(6,  { message: "required" }).max(30),
  email:      z.string().trim().email({ message: "email" }).max(120),
  note:       z.string().trim().max(500, { message: "max500" }).optional().or(z.literal("")),
  // Honeypot: pravi korisnik ovo polje nikad ne vidi ni ne popuni.
  website:    z.string().max(0).optional().or(z.literal("")),
});

export type RentACarInquiry = z.infer<typeof rentACarInquirySchema>;
