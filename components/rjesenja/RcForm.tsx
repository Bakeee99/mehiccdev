/**
 * components/rjesenja/RcForm.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Forma za upit s rent-a-car stranice.
 *
 * Validacija: ista Zod šema kao na serveru (lib/schemas/rentACarInquiry.ts),
 * pa se pravila ne mogu razići. Greške se ispisuju ispod polja, nikad alert.
 * Dugme ima loading stanje, a nakon uspješnog slanja forma se zamjenjuje
 * potvrdom s linkom na Maximum case study.
 *
 * Zaštita od spama: skriveno honeypot polje (bot ga popuni, čovjek ne vidi)
 * plus rate limiting po IP-u na serverskoj strani.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, ArrowUpRight } from "lucide-react";
import { staggerContainer, fadeUp, scaleIn } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { COPY } from "@/components/rjesenja/rentACarCopy";
import {
  rentACarInquirySchema, FLEET_SIZES, LOCATIONS, CHANNELS, TIMELINES,
  type RentACarInquiry,
} from "@/lib/schemas/rentACarInquiry";

type Errors = Partial<Record<keyof RentACarInquiry, string>>;

const EMPTY = {
  fleetSize: "", locations: "", channels: [] as string[], aggregators: "",
  currentSite: "", timeline: "", fullName: "", company: "", phone: "",
  email: "", note: "", website: "",
};

export function RcForm({ c }: { c: typeof COPY.bs }) {
  const reveal = useReveal();
  const d = c.form;

  const [form, setForm]       = useState({ ...EMPTY });
  const [errors, setErrors]   = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY, v: string | string[]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleChannel = (value: string) => {
    const next = form.channels.includes(value)
      ? form.channels.filter((x) => x !== value)
      : [...form.channels, value];
    set("channels", next);
  };

  const msg = (code?: string) =>
    code && code in d.errors ? d.errors[code as keyof typeof d.errors] : d.errors.required;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const parsed = rentACarInquirySchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const next: Errors = {};
      (Object.keys(fieldErrors) as (keyof RentACarInquiry)[]).forEach((k) => {
        const code = fieldErrors[k]?.[0];
        next[k] = msg(code);
      });
      setErrors(next);
      document.getElementById("upit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/upit-rent-a-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        setSent(true);
      } else if (res.status === 429) {
        setServerError(d.errors.rate);
      } else if (res.status === 422) {
        const body = await res.json().catch(() => null);
        const issues = body?.issues as Record<string, string[]> | undefined;
        if (issues) {
          const next: Errors = {};
          Object.keys(issues).forEach((k) => { next[k as keyof RentACarInquiry] = msg(issues[k]?.[0]); });
          setErrors(next);
        } else {
          setServerError(d.errors.server);
        }
      } else {
        setServerError(d.errors.server);
      }
    } catch {
      setServerError(d.errors.server);
    } finally {
      setLoading(false);
    }
  };

  /* ── stilovi polja ───────────────────────────────────────────────────────── */
  const label   = "block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2";
  const control = (bad?: string) =>
    `w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg)] text-[var(--text)]
     border ${bad ? "border-red-500/60" : "border-[var(--border)]"}
     placeholder:text-[var(--text-muted)] focus:outline-none
     focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15
     transition-[border-color,box-shadow] duration-200`;
  const errText = "mt-1.5 text-[11.5px] font-semibold text-red-400";

  /* ── potvrda nakon slanja ────────────────────────────────────────────────── */
  if (sent) {
    return (
      <section id="upit" className="py-24 lg:py-28 relative scroll-mt-24">
        <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-3xl p-8 sm:p-10 text-center bg-[var(--surface)] border border-green-500/35">
            <span className="inline-flex w-16 h-16 rounded-3xl items-center justify-center mb-5
                             bg-green-500/10 border border-green-500/35 text-green-500">
              <CheckCircle2 size={28} />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text)] mb-3">{d.successTitle}</h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-7">{d.successBody}</p>
            <a href="#case-study"
               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold
                          bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25
                          transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              {d.successCta} <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="upit" className="py-24 lg:py-28 relative scroll-mt-24">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <motion.div variants={staggerContainer} {...reveal} className="text-center mb-10">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 bg-brand-600/10
                             text-brand-300 text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.label}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {d.heading1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[var(--text-muted)] leading-relaxed">{d.sub}</motion.p>
        </motion.div>

        <motion.form variants={scaleIn} {...reveal} onSubmit={handleSubmit} noValidate
          className="rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-6">

          {/* honeypot: skriveno od ljudi, vidljivo botovima */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off"
                 aria-hidden value={form.website} onChange={(e) => set("website", e.target.value)}
                 className="absolute left-[-9999px] w-px h-px opacity-0" />

          {/* 1 + 2 · flota i lokacije */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="fleetSize" className={label}>{d.fleetSize}</label>
              <select id="fleetSize" value={form.fleetSize} onChange={(e) => set("fleetSize", e.target.value)}
                      className={`${control(errors.fleetSize)} appearance-none cursor-pointer`}>
                <option value="" disabled>{d.choose}</option>
                {FLEET_SIZES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.fleetSize && <p className={errText}>{errors.fleetSize}</p>}
            </div>
            <div>
              <label htmlFor="locations" className={label}>{d.locations}</label>
              <select id="locations" value={form.locations} onChange={(e) => set("locations", e.target.value)}
                      className={`${control(errors.locations)} appearance-none cursor-pointer`}>
                <option value="" disabled>{d.choose}</option>
                {LOCATIONS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.locations && <p className={errText}>{errors.locations}</p>}
            </div>
          </div>

          {/* 3 · kanali */}
          <div>
            <span className={label}>{d.channels}</span>
            <p className="text-[11.5px] text-[var(--text-muted)] -mt-1 mb-3">{d.channelsHint}</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {CHANNELS.map((ch) => {
                const on = form.channels.includes(ch);
                return (
                  <button key={ch} type="button" onClick={() => toggleChannel(ch)}
                    aria-pressed={on}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-semibold text-left
                                border transition-[border-color,background-color] duration-200
                                ${on ? "bg-brand-600/12 border-brand-600/45 text-[var(--text)]"
                                     : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-brand-600/30"}`}>
                    <span className={`w-4 h-4 rounded-[5px] flex items-center justify-center flex-shrink-0 border
                                      ${on ? "bg-brand-600 border-brand-600 text-white" : "border-[var(--border)]"}`}>
                      {on && <CheckCircle2 size={10} />}
                    </span>
                    {d.channelLabels[ch]}
                  </button>
                );
              })}
            </div>
            {errors.channels && <p className={errText}>{errors.channels}</p>}
          </div>

          {/* 4 · agregatori */}
          <div>
            <span className={label}>{d.aggregators}</span>
            <div className="flex gap-2.5">
              {(["da", "ne"] as const).map((v) => {
                const on = form.aggregators === v;
                return (
                  <button key={v} type="button" onClick={() => set("aggregators", v)}
                    aria-pressed={on}
                    className={`px-6 py-2.5 rounded-xl text-[13px] font-bold border
                                transition-[border-color,background-color] duration-200
                                ${on ? "bg-brand-600/12 border-brand-600/45 text-[var(--text)]"
                                     : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-brand-600/30"}`}>
                    {v === "da" ? d.yes : d.no}
                  </button>
                );
              })}
            </div>
            {errors.aggregators && <p className={errText}>{errors.aggregators}</p>}
          </div>

          {/* 5 · postojeći sajt */}
          <div>
            <label htmlFor="currentSite" className={label}>
              {d.currentSite} <span className="font-medium normal-case tracking-normal">· {d.currentSiteHint}</span>
            </label>
            <input id="currentSite" type="url" inputMode="url" placeholder="https://" value={form.currentSite}
                   onChange={(e) => set("currentSite", e.target.value)} className={control(errors.currentSite)} />
            {errors.currentSite && <p className={errText}>{errors.currentSite}</p>}
          </div>

          {/* 6 · rok */}
          <div>
            <label htmlFor="timeline" className={label}>{d.timeline}</label>
            <select id="timeline" value={form.timeline} onChange={(e) => set("timeline", e.target.value)}
                    className={`${control(errors.timeline)} appearance-none cursor-pointer`}>
              <option value="" disabled>{d.choose}</option>
              {TIMELINES.map((v) => <option key={v} value={v}>{d.timelineLabels[v]}</option>)}
            </select>
            {errors.timeline && <p className={errText}>{errors.timeline}</p>}
          </div>

          {/* 7 · kontakt */}
          <div className="pt-2 border-t border-[var(--border)]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text)] mt-4 mb-4">{d.contact}</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullName" className={label}>{d.fullName}</label>
                <input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                       className={control(errors.fullName)} />
                {errors.fullName && <p className={errText}>{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="company" className={label}>
                  {d.company} <span className="font-medium normal-case tracking-normal">· {d.companyHint}</span>
                </label>
                <input id="company" value={form.company} onChange={(e) => set("company", e.target.value)}
                       className={control(errors.company)} />
              </div>
              <div>
                <label htmlFor="phone" className={label}>{d.phone}</label>
                <input id="phone" type="tel" inputMode="tel" value={form.phone}
                       onChange={(e) => set("phone", e.target.value)} className={control(errors.phone)} />
                {errors.phone && <p className={errText}>{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className={label}>{d.email}</label>
                <input id="email" type="email" inputMode="email" value={form.email}
                       onChange={(e) => set("email", e.target.value)} className={control(errors.email)} />
                {errors.email && <p className={errText}>{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* napomena */}
          <div>
            <label htmlFor="note" className={label}>
              {d.note} <span className="font-medium normal-case tracking-normal">· {d.noteHint}</span>
            </label>
            <textarea id="note" rows={4} maxLength={500} value={form.note}
                      onChange={(e) => set("note", e.target.value)} className={`${control(errors.note)} resize-none`} />
            <p className="mt-1.5 text-[11px] text-[var(--text-muted)] text-right">{form.note.length}/500</p>
            {errors.note && <p className={errText}>{errors.note}</p>}
          </div>

          {serverError && (
            <p className="rounded-xl px-4 py-3 text-[13px] font-semibold text-red-400
                          bg-red-500/10 border border-red-500/30">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl
                       bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-bold
                       shadow-lg shadow-brand-600/30 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-[box-shadow,transform,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden />
                {d.submitting}
              </>
            ) : (
              <>{d.submit} <Send size={14} /></>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
