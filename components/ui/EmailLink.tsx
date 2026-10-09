"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, ExternalLink, Mail } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

const T = {
  bs: { copied: "Adresa je kopirana", copy: "Kopiraj adresu", gmail: "Piši preko Gmaila", outlook: "Piši preko Outlooka", app: "Otvori mail aplikaciju" },
  en: { copied: "Address copied", copy: "Copy address", gmail: "Write in Gmail", outlook: "Write in Outlook", app: "Open mail app" },
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function EmailLink({ email, className = "", wrapClassName = "", children }: {
  email: string; className?: string; wrapClassName?: string; children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  const d = T[lang === "en" ? "en" : "bs"];
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number }>({ left: 0 });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const close = () => setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (open) { setOpen(false); return; }
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const W = Math.min(260, window.innerWidth - 32);
    const left = Math.max(16, Math.min(r.left, window.innerWidth - W - 16));
    const below = window.innerHeight - r.bottom > 250;
    setPos(below ? { left, top: r.bottom + 8 } : { left, bottom: window.innerHeight - r.top + 8 });
    setOpen(true);
    setCopied(await copyText(email));
  };

  const recopy = async () => setCopied(await copyText(email));

  const to = encodeURIComponent(email);
  const items = [
    { label: d.gmail, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}`, ext: true },
    { label: d.outlook, href: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}`, ext: true },
    { label: d.app, href: `mailto:${email}`, ext: false },
  ];

  return (
    <span ref={ref} className={`relative ${wrapClassName}`}>
      <a href={`mailto:${email}`} onClick={onClick} aria-haspopup="menu" aria-expanded={open} className={className}>
        {children}
      </a>
      {open && createPortal(
        <span ref={menuRef} role="menu"
              className="fixed z-[90] block w-[260px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E5E7EB] bg-white p-1.5 text-left"
              style={{ ...pos, boxShadow: "0 1px 2px rgba(15,23,42,0.06), 0 24px 48px -16px rgba(15,23,42,0.35)" }}>
          <button type="button" role="menuitem" onClick={recopy}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#0F172A] hover:bg-[#F1F5F9]">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${copied ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#EEF3F8] text-[#0F3554]"}`}>
              {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={12} />}
            </span>
            <span className="min-w-0">
              <span className="block">{copied ? d.copied : d.copy}</span>
              <span className="block truncate text-[11.5px] font-normal text-[#64748B]">{email}</span>
            </span>
          </button>
          <span className="my-1 block h-px bg-[#F1F5F9]" />
          {items.map((it) => (
            <a key={it.label} role="menuitem" href={it.href} onClick={() => setOpen(false)}
               {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
               className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]">
              {it.ext ? <ExternalLink size={14} className="shrink-0 text-[#64748B]" /> : <Mail size={14} className="shrink-0 text-[#64748B]" />}
              {it.label}
            </a>
          ))}
        </span>,
        document.body,
      )}
    </span>
  );
}
