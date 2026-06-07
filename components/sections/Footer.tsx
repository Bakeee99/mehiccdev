/**
 * components/sections/Footer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Footer with branding, nav, contact, social links. Content from i18n.
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Instagram, Linkedin } from "lucide-react";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/components/ui/LanguageProvider";

const TEAM_CONTACTS = [
  {
    name: "Bakir Mehić", email: "bakir.mehic@mehiccdev.com",
    instagram: "https://www.instagram.com/mehicbakir",   // ← update with real handle
    linkedin:  "https://www.linkedin.com/in/bakir-mehic-qa-engineer/",  // ← update with real URL
  },
  {
    name: "Nedim Kupusija", email: "nedim.kupusija@mehiccdev.com",
    instagram: "https://www.instagram.com/nedim.40", // ← update
    linkedin:  "https://www.linkedin.com/in/nedim-kupusija-4632a533b/",// ← update
  },
];

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const NAV_COLUMNS = [
    {
      heading: t.footer.companyHeading,
      links: [
        { label: t.nav.about,     href: "#o-nama"    },
        { label: t.nav.portfolio, href: "#portfolio" },
        { label: t.nav.saas,      href: "#saas"      },
        { label: t.nav.contact,   href: "#kontakt"   },
      ],
    },
    {
      heading: t.footer.servicesHeading,
      links: t.services.items.map((s) => ({ label: s.title, href: "#usluge" })),
    },
  ];

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--surface)]">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <motion.div variants={fadeUp}>
            <a href="#" className="inline-flex items-baseline mb-4">
              <span className="text-2xl font-extrabold text-[var(--text)]">mehicc</span>
              <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">dev</span>
            </a>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">{t.footer.tagline}</p>
            <p className="mt-4 text-xs text-[var(--text-muted)]">📍 {t.footer.location}</p>
          </motion.div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <motion.div key={col.heading} variants={fadeUp}>
              <h3 className="text-xs font-semibold text-[var(--text)] tracking-widest uppercase mb-4">{col.heading}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link, idx) => (
                  <li key={`${link.label}-${idx}`}>
                    <a href={link.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xs font-semibold text-[var(--text)] tracking-widest uppercase mb-4">{t.footer.contactHeading}</h3>
            <div className="flex flex-col gap-6">
              {TEAM_CONTACTS.map((member) => (
                <div key={member.name}>
                  <p className="text-sm font-semibold text-[var(--text)] mb-1.5">{member.name}</p>
                  <a href={`mailto:${member.email}`}
                     className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]
                                hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-2 break-all">
                    <Mail size={11} className="flex-shrink-0" />
                    {member.email}
                  </a>
                  <div className="flex items-center gap-2">
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer"
                       aria-label={`${member.name} Instagram`}
                       className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center
                                  text-[var(--text-muted)] hover:text-brand-600 dark:hover:text-brand-400
                                  hover:border-brand-600/40 transition-all">
                      <Instagram size={13} />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                       aria-label={`${member.name} LinkedIn`}
                       className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center
                                  text-[var(--text-muted)] hover:text-brand-600 dark:hover:text-brand-400
                                  hover:border-brand-600/40 transition-all">
                      <Linkedin size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">© {year} mehiccdev. {t.footer.rights}</p>
          <p className="text-xs text-[var(--text-muted)]">{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
