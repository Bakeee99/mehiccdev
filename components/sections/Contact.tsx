/**
 * components/sections/Contact.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Kontakt sekcija (v2, premium redizajn).
 *
 * Kompozicija:
 *   • Lijevo: "Šta slijedi" (3 numerisana koraka s gradijentnom linijom),
 *     kartice Bakira i Nedima s avatarima od inicijala i ulogama,
 *     te lokacija + vrijeme odgovora.
 *   • Desno: forma u kartici s gradijentnim okvirom (isti brand okvir kao
 *     flagship traka), polja na --bg podlozi, veliki submit s ikonicom.
 *
 * Logika slanja je ISTA kao prije (simulacija + Formspree uputa u komentaru).
 * Self-contained (BS/EN u fajlu), useReveal pattern, dark/light, bez crtica.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Mail, MapPin } from "lucide-react";
import { staggerContainer, staggerContainerSlow, fadeUp, slideInLeft, slideInRight } from "@/lib/animations";
import { useReveal } from "@/lib/useReveal";
import { useLanguage } from "@/components/ui/LanguageProvider";

const PEOPLE = [
  { name: "Bakir Mehić",    email: "bakir.mehic@mehiccdev.com",    initials: "BM", gradient: "from-blue-500 to-indigo-600" },
  { name: "Nedim Kupusija", email: "nedim.kupusija@mehiccdev.com", initials: "NK", gradient: "from-sky-400 to-blue-600" },
];

type Content = {
  label: string; heading1: string; headingAccent: string; subtitle: string;
  stepsTitle: string;
  steps: { t: string; d: string }[];
  roles: [string, string];
  orReach: string;
  location: string; response: string;
  nameLabel: string; namePlaceholder: string;
  emailLabel: string; emailPlaceholder: string;
  subjectLabel: string; subjectOptions: string[];
  messageLabel: string; messagePlaceholder: string;
  submit: string; submitting: string; success: string;
  errSend: string; errTooMany: string;
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Kontakt",
    heading1: "Započnimo",
    headingAccent: "saradnju",
    subtitle: "Imate projekat na umu? Javite nam se, odgovaramo u roku od 24 sata.",
    stepsTitle: "Kako izgleda saradnja s nama",
    steps: [
      { t: "Pošaljete upit",          d: "Recite nam šta vam treba, svojim riječima. Traje dvije minute." },
      { t: "Besplatne konsultacije",  d: "Javimo se u roku od 24 sata i prođemo kroz ideju, bez obaveza." },
      { t: "Ponuda i plan",           d: "Dobijete jasnu cijenu, rokove i plan. Odluka je na vama." },
    ],
    roles: ["Development", "Marketing"],
    orReach: "Ili nas kontaktirajte direktno",
    location: "Mostar, BiH · radimo s klijentima iz cijelog regiona",
    response: "Obično odgovorimo isti dan",
    nameLabel: "Ime i prezime",
    namePlaceholder: "Vaše ime",
    emailLabel: "Email adresa",
    emailPlaceholder: "vasa@email.com",
    subjectLabel: "Tip projekta",
    subjectOptions: ["Web sajt", "Web aplikacija", "Sistem za rezervacije", "Digitalni marketing", "Ostalo"],
    messageLabel: "Poruka",
    messagePlaceholder: "Recite nam nešto o vašem projektu…",
    errSend: "Slanje trenutno ne radi. Pišite nam direktno na bakir.mehic@mehiccdev.com",
    errTooMany: "Previše poruka u kratkom roku. Pokušajte ponovo za nekoliko minuta.",
    submit: "Pošalji poruku",
    submitting: "Slanje…",
    success: "Hvala! Vaša poruka je poslana. Javljamo se uskoro.",
  },
  en: {
    label: "Contact",
    heading1: "Let's work",
    headingAccent: "together",
    subtitle: "Have a project in mind? Reach out, we reply within 24 hours.",
    stepsTitle: "What working with us looks like",
    steps: [
      { t: "Send an inquiry",      d: "Tell us what you need, in your own words. Takes two minutes." },
      { t: "Free consultation",    d: "We get back within 24 hours and talk through the idea, no strings attached." },
      { t: "Quote and plan",       d: "You get a clear price, timeline and plan. The decision is yours." },
    ],
    roles: ["Development", "Marketing"],
    orReach: "Or reach us directly",
    location: "Mostar, BiH · working with clients across the region",
    response: "We usually reply the same day",
    nameLabel: "Full name",
    namePlaceholder: "Your name",
    emailLabel: "Email address",
    emailPlaceholder: "your@email.com",
    subjectLabel: "Project type",
    subjectOptions: ["Website", "Web application", "Booking system", "Digital marketing", "Other"],
    messageLabel: "Message",
    messagePlaceholder: "Tell us a bit about your project…",
    errSend: "Sending is not working right now. Write to us at bakir.mehic@mehiccdev.com",
    errTooMany: "Too many messages in a short time. Please try again in a few minutes.",
    submit: "Send message",
    submitting: "Sending…",
    success: "Thank you! Your message has been sent. We'll be in touch soon.",
  },
};

export function Contact() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;

  // One reveal per motion block — fires exactly once, survives language/theme switches
  const revealHead = useReveal();
  const revealInfo = useReveal();
  const revealForm = useReveal();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [honey, setHoney]         = useState("");   // honeypot, bot ga popuni

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honey }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 429) {
        setError(d.errTooMany);
      } else {
        setError(d.errSend);
      }
    } catch {
      setError(d.errSend);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg)]
                    border border-[var(--border)] text-[var(--text)]
                    placeholder:text-[var(--text-muted)] focus:outline-none
                    focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15 transition-all`;
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2";

  return (
    <section id="kontakt" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.05] pointer-events-none
                      [mask-image:radial-gradient(75%_65%_at_50%_40%,black,transparent)]" aria-hidden />
      <div className="absolute -right-64 bottom-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent_72%)] pointer-events-none" aria-hidden />
      <div className="absolute -left-64 top-24 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent_72%)] pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} {...revealHead} className="text-center mb-16">
          <motion.div variants={fadeUp} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-brand-600/30 dark:border-brand-500/30
                             bg-brand-600/8 dark:bg-brand-500/10
                             text-brand-700 dark:text-brand-300
                             text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden />
              {d.label}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {d.heading1}{" "}
            <span className="text-gradient font-serif italic font-semibold tracking-normal">{d.headingAccent}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {d.subtitle}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-14 items-start">

          {/* ── Lijevo: koraci + ljudi + info ──────────────────────────────── */}
          <motion.div variants={staggerContainerSlow} {...revealInfo}>

            {/* Šta slijedi */}
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-5">
              {d.stepsTitle}
            </motion.p>
            <motion.div variants={slideInLeft} className="relative mb-10">
              <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-brand-600 via-brand-500/50 to-brand-400/20" aria-hidden />
              <div className="flex flex-col gap-5">
                {d.steps.map((s, i) => (
                  <div key={s.t} className="relative flex items-start gap-4">
                    <span className="relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
                                     bg-[var(--surface)] border border-brand-600/35
                                     text-sm font-extrabold text-brand-600 dark:text-brand-400
                                     shadow-lg shadow-brand-600/10">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">
                      <span className="block text-[15px] font-extrabold text-[var(--text)] leading-tight">{s.t}</span>
                      <span className="block text-[13px] text-[var(--text-muted)] leading-relaxed mt-1">{s.d}</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Direktni kontakti */}
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              {d.orReach}
            </motion.p>
            <div className="flex flex-col gap-3 mb-8">
              {PEOPLE.map((p, i) => (
                <motion.a
                  key={p.email}
                  variants={fadeUp}
                  whileHover={{ x: 5 }}
                  href={`mailto:${p.email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl
                             bg-[var(--surface)] border border-[var(--border)]
                             transition-[border-color,box-shadow] duration-300
                             hover:border-brand-600/40 hover:shadow-lg hover:shadow-brand-600/10"
                >
                  <span className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center
                                    bg-gradient-to-br ${p.gradient} text-white text-[13px] font-extrabold
                                    shadow-lg shadow-brand-600/25`}>
                    {p.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-[14.5px] font-bold text-[var(--text)]">{p.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider
                                       text-brand-700 dark:text-brand-300 bg-brand-600/10 border border-brand-600/25">
                        {d.roles[i]}
                      </span>
                    </span>
                    <span className="block text-[12.5px] text-[var(--text-muted)] truncate mt-0.5">{p.email}</span>
                  </span>
                  <span className="ml-auto flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                                   bg-brand-600/10 border border-brand-600/25 text-brand-600 dark:text-brand-400
                                   transition-[background-color] duration-300 group-hover:bg-brand-600/25">
                    <Mail size={15} />
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Lokacija + vrijeme odgovora */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold
                               text-[var(--text)] bg-[var(--surface)] border border-[var(--border)]">
                <MapPin size={13} className="text-brand-600 dark:text-brand-400" /> {d.location}
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold
                               text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden /> {d.response}
              </span>
            </motion.div>
          </motion.div>

          {/* ── Desno: forma u kartici s gradijentnim okvirom ──────────────── */}
          <motion.div variants={slideInRight} {...revealForm}>
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #2563EB, #60A5FA, #818CF8) border-box",
                border: "1.5px solid transparent",
              }}
            >
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent_72%)] pointer-events-none" aria-hidden />

              <div className="relative p-6 sm:p-9">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <span className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5
                                     bg-green-500/10 border border-green-500/35 text-green-500">
                      <CheckCircle2 size={28} />
                    </span>
                    <p className="text-lg font-bold text-[var(--text)] max-w-sm">{d.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="c-name" className={labelCls}>{d.nameLabel}</label>
                        <input id="c-name" name="name" type="text" required value={form.name}
                               onChange={handleChange} placeholder={d.namePlaceholder} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="c-email" className={labelCls}>{d.emailLabel}</label>
                        <input id="c-email" name="email" type="email" required value={form.email}
                               onChange={handleChange} placeholder={d.emailPlaceholder} className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="c-subject" className={labelCls}>{d.subjectLabel}</label>
                      <select id="c-subject" name="subject" required value={form.subject}
                              onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                        <option value="" disabled>…</option>
                        {d.subjectOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="c-message" className={labelCls}>{d.messageLabel}</label>
                      <textarea id="c-message" name="message" required rows={5} value={form.message}
                                onChange={handleChange} placeholder={d.messagePlaceholder}
                                className={`${inputCls} resize-none`} />
                    </div>

                    {/* honeypot: skriveno od ljudi, botovi ga popune */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden
                           value={honey} onChange={(e) => setHoney(e.target.value)}
                           className="absolute left-[-9999px] w-px h-px opacity-0" />

                    {error && (
                      <p className="rounded-xl px-4 py-3 text-[13px] font-semibold text-red-400
                                    bg-red-500/10 border border-red-500/30">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl
                                 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold
                                 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                                 shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40
                                 hover:-translate-y-0.5"
                    >
                      {loading ? d.submitting : (<>{d.submit} <Send size={14} /></>)}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
