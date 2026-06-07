/**
 * components/sections/Contact.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Clear, prominent contact form section:
 *  • Name, email, project-type dropdown, message
 *  • Inline validation + success state
 *  • Direct contact cards (emails) on the side
 *
 * NOTE: handleSubmit currently simulates submission. To make it actually send,
 * see the comment inside handleSubmit (connect to Formspree / API route / Resend).
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Mail, MapPin, Clock } from "lucide-react";
import { staggerContainer, fadeUp, slideInLeft, slideInRight, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

const CONTACT_EMAILS = [
  { name: "Bakir Mehić",    email: "bakir.mehic@mehiccdev.com"    },
  { name: "Nedim Kupusija", email: "nedim.kupusija@mehiccdev.com" },
];

export function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ── TO MAKE THIS REALLY SEND: ─────────────────────────────────────────────
    // Easiest = Formspree (free). Create form at formspree.io, then:
    //
    //   await fetch("https://formspree.io/f/YOUR_ID", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //
    // For now we just simulate a successful submission:
    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="kontakt" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-[var(--border)]" aria-hidden />
      <div className="absolute -right-64 bottom-0 w-96 h-96 rounded-full bg-brand-600/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            {t.contact.label}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {t.contact.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[var(--text-muted)] text-lg leading-relaxed">
            {t.contact.subtitle}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Form (3/5 width) ──────────────────────────────────────────────── */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-3 p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)]"
          >
            {submitted ? (
              // Success state
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-bold text-[var(--text)]">{t.contact.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-[var(--text)]">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder={t.contact.namePlaceholder}
                      className="px-4 py-3 rounded-xl text-sm bg-[var(--bg)] border border-[var(--border)]
                                 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none
                                 focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-[var(--text)]">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder={t.contact.emailPlaceholder}
                      className="px-4 py-3 rounded-xl text-sm bg-[var(--bg)] border border-[var(--border)]
                                 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none
                                 focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15 transition-all"
                    />
                  </div>
                </div>

                {/* Subject dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-[var(--text)]">
                    {t.contact.subjectLabel}
                  </label>
                  <select
                    id="subject" name="subject" required
                    value={form.subject} onChange={handleChange}
                    className="px-4 py-3 rounded-xl text-sm bg-[var(--bg)] border border-[var(--border)]
                               text-[var(--text)] focus:outline-none focus:border-brand-600/60
                               focus:ring-2 focus:ring-brand-600/15 transition-all"
                  >
                    <option value="" disabled>—</option>
                    {t.contact.subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--text)]">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    id="message" name="message" required rows={5}
                    value={form.message} onChange={handleChange}
                    placeholder={t.contact.messagePlaceholder}
                    className="px-4 py-3 rounded-xl text-sm bg-[var(--bg)] border border-[var(--border)]
                               text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none
                               focus:border-brand-600/60 focus:ring-2 focus:ring-brand-600/15 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                             bg-brand-600 hover:bg-brand-700 text-white font-semibold
                             transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                             hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5"
                >
                  {loading ? t.contact.submitting : (<>{t.contact.submit} <Send size={15} /></>)}
                </button>
              </form>
            )}
          </motion.div>

          {/* ── Direct contact (2/5 width) ────────────────────────────────────── */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
              <p className="text-sm font-bold text-[var(--text)] mb-4">{t.contact.orReach}</p>
              <div className="flex flex-col gap-4">
                {CONTACT_EMAILS.map((c) => (
                  <a
                    key={c.email}
                    href={`mailto:${c.email}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-600/10 dark:bg-brand-500/15
                                     flex items-center justify-center text-brand-600 dark:text-brand-400">
                      <Mail size={15} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[var(--text)]">{c.name}</span>
                      <span className="block text-xs text-[var(--text-muted)] group-hover:text-brand-600
                                       dark:group-hover:text-brand-400 transition-colors break-all">
                        {c.email}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-600/10 dark:bg-brand-500/15
                                 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <MapPin size={15} />
                </span>
                <span className="text-sm text-[var(--text-muted)]">{t.footer.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-600/10 dark:bg-brand-500/15
                                 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Clock size={15} />
                </span>
                <span className="text-sm text-[var(--text-muted)]">{t.stats.supportValue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
