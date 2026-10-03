"use client";

import { useState } from "react";
import { ArrowRight, Check, Phone, MessageCircle } from "lucide-react";
import { FLEET_SIZES, TIMELINES } from "@/lib/schemas/rentACarInquiry";
import { PHONE_DIAL, WHATSAPP } from "@/lib/contact";
import { Head, SOFT } from "@/components/ui/kit";
import type { RcCopy } from "@/components/rjesenja/rentACarCopy";

type Fields = { fleetSize: string; timeline: string; fullName: string; company: string; phone: string; email: string; note: string; website: string };
const EMPTY: Fields = { fleetSize: "", timeline: "", fullName: "", company: "", phone: "", email: "", note: "", website: "" };

const input = "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#0F172A]";
const lbl = "text-[13px] font-semibold text-[#0F172A]";

function Chips({ values, labels, value, onPick, name }: { values: readonly string[]; labels?: Record<string, string>; value: string; onPick: (v: string) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label={name} className="mt-2 flex flex-wrap gap-2">
      {values.map((v) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onPick(v)}
                className={`rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors ${value === v ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-[#E5E7EB] bg-white text-[#334155] hover:border-[#CBD5E1]"}`}>
          {labels?.[v] ?? v}
        </button>
      ))}
    </div>
  );
}

export function RcForm({ c }: { c: RcCopy }) {
  const f = c.form;
  const [v, setV] = useState<Fields>(EMPTY);
  const [err, setErr] = useState<Partial<Record<keyof Fields, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [server, setServer] = useState("");
  const set = (k: keyof Fields) => (val: string) => { setV((p) => ({ ...p, [k]: val })); setErr((e) => ({ ...e, [k]: undefined })); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n: typeof err = {};
    if (!v.fleetSize) n.fleetSize = f.errors.required;
    if (!v.timeline) n.timeline = f.errors.required;
    if (v.fullName.trim().length < 2) n.fullName = f.errors.required;
    if (v.phone.trim().length < 6) n.phone = f.errors.required;
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) n.email = f.errors.email;
    if (v.note.length > 500) n.note = f.errors.max500;
    setErr(n); setServer("");
    if (Object.keys(n).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/upit-rent-a-car", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      if (res.ok) { setState("done"); return; }
      setServer(res.status === 429 ? f.errors.rate : f.errors.server);
    } catch { setServer(f.errors.server); }
    setState("idle");
  };

  return (
    <section id="upit" className="relative bg-white scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Head label={f.label} h={f.heading1} accent={f.headingAccent} sub={f.sub} />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <aside className="flex flex-col justify-between gap-6 rounded-[20px] bg-[#0F172A] p-7">
            <div>
              <p className="text-[18px] font-semibold text-white">{f.directTitle}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#94A3B8]">{f.directSub}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href={`tel:${PHONE_DIAL}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#0F172A] hover:bg-[#F1F5F9]"><Phone size={15} /> {f.callBtn}</a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-[14px] font-semibold text-white hover:bg-white/[0.06]"><MessageCircle size={15} /> {f.waBtn}</a>
            </div>
          </aside>

          {state === "done" ? (
            <div className="flex flex-col items-start justify-center rounded-[20px] border border-[#E5E7EB] bg-white p-8" style={{ boxShadow: SOFT }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#DCFCE7] text-[#15803D]"><Check size={20} /></span>
              <p className="mt-4 text-[20px] font-semibold text-[#0F172A]">{f.successTitle}</p>
              <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[#475569]">{f.successBody}</p>
              <a href="/maximum" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-5 py-3 text-[14px] font-semibold text-[#0F172A] hover:bg-[#F9FAFB]">{f.successCta} <ArrowRight size={15} /></a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 sm:p-8" style={{ boxShadow: SOFT }}>
              <div className="grid gap-6">
                <div>
                  <p className={lbl}>{f.fleetSize}</p>
                  <Chips values={FLEET_SIZES} value={v.fleetSize} onPick={set("fleetSize")} name={f.fleetSize} />
                  {err.fleetSize && <p className="mt-1.5 text-[12.5px] text-[#B91C1C]">{err.fleetSize}</p>}
                </div>
                <div>
                  <p className={lbl}>{f.timeline}</p>
                  <Chips values={TIMELINES} labels={f.timelineLabels} value={v.timeline} onPick={set("timeline")} name={f.timeline} />
                  {err.timeline && <p className="mt-1.5 text-[12.5px] text-[#B91C1C]">{err.timeline}</p>}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {([["fullName", f.fullName, "text", "name"], ["company", `${f.company} · ${f.companyHint}`, "text", "organization"], ["phone", f.phone, "tel", "tel"], ["email", f.email, "email", "email"]] as const).map(([k, l, t, ac]) => (
                    <label key={k} className="block">
                      <span className={lbl}>{l}</span>
                      <input type={t} autoComplete={ac} value={v[k]} onChange={(e) => set(k)(e.target.value)} className={`mt-2 ${input}`} />
                      {err[k] && <span className="mt-1.5 block text-[12.5px] text-[#B91C1C]">{err[k]}</span>}
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className={lbl}>{f.note} <span className="font-normal text-[#94A3B8]">· {f.noteHint}</span></span>
                  <textarea rows={3} maxLength={500} value={v.note} onChange={(e) => set("note")(e.target.value)} className={`mt-2 resize-none ${input}`} />
                </label>
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden value={v.website} onChange={(e) => set("website")(e.target.value)} className="hidden" />
                {server && <p className="text-[13px] text-[#B91C1C]">{server}</p>}
                <button type="submit" disabled={state === "sending"}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#B91C1C] disabled:opacity-70">
                  {state === "sending" ? f.submitting : f.submit} {state !== "sending" && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
