"use client";

import Image from "next/image";
import { Code2, Megaphone, ArrowUpRight, Linkedin, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { Head, Fade, FLOAT } from "@/components/ui/kit";

const PEOPLE: { src: string; icon: LucideIcon; linkedin: string }[] = [
  { src: "/team/bakir.jpg", icon: Code2, linkedin: "https://www.linkedin.com/in/bakir-mehic-qa-engineer/" },
  { src: "/team/nedim.jpg", icon: Megaphone, linkedin: "https://www.linkedin.com/in/nedim-kupusija-4632a533b/" },
];

type Content = {
  label: string; heading1: string; headingAccent: string; subtitle: string; linkedinBtn: string;
  members: { name: string; role: string; bio: string; tags: string[] }[];
};

const T: Record<"bs" | "en", Content> = {
  bs: {
    label: "Tim",
    heading1: "Ljudi iza",
    headingAccent: "mehiccdev-a",
    subtitle: "Nas dvojica radimo sve sami. Jedan gradi, drugi dovodi klijente. Razgovarate direktno s ljudima koji rade posao, bez posrednika.",
    linkedinBtn: "LinkedIn profil",
    members: [
      {
        name: "Bakir Mehić",
        role: "Razvoj aplikacija i dizajn",
        bio:  "Vodim projekat od prve skice do objave. Pravim sajtove i web aplikacije, pa ih testiram tako da greške nađem ja, a ne vaši kupci. Zadnji veći projekat je kompletna rent-a-car aplikacija koja i danas radi.",
        tags: ["Webflow & Next.js", "AI Prompt Engineering", "QA Automatizacija"],
      },
      {
        name: "Nedim Kupusija",
        role: "Marketing i društvene mreže",
        bio:  "Vodim društvene mreže i reklame tako da se svaki uloženi euro može pratiti. Znate šta je objavljeno, ko je to vidio i koliko je upita stiglo. Bez marketinškog žargona, samo jasan plan i mjesečni izvještaj koji se razumije iz prve.",
        tags: ["Brand Scaling", "Content Strategija", "Online Optimizacija"],
      },
    ],
  },
  en: {
    label: "Team",
    heading1: "The people behind",
    headingAccent: "mehiccdev",
    subtitle: "The two of us do all the work ourselves. One builds, the other brings in clients. You talk directly to the people doing the work, with no middlemen.",
    linkedinBtn: "LinkedIn profile",
    members: [
      {
        name: "Bakir Mehić",
        role: "Lead Developer & UI/UX Architect",
        bio:  "I take projects from the first sketch to launch. I build websites and web apps, then test them so that I find the bugs, not your customers. My most recent build is a complete rent-a-car application that is still running today.",
        tags: ["Webflow & Next.js", "AI Prompt Engineering", "QA Automation"],
      },
      {
        name: "Nedim Kupusija",
        role: "Digital Marketing & Social Media Manager",
        bio:  "I run social media and ads so every euro can be tracked. You know what was posted, who saw it, and how many inquiries it brought. No marketing jargon, just a clear plan and a monthly report you can actually read.",
        tags: ["Brand Scaling", "Content Strategy", "Online Optimization"],
      },
    ],
  },
};

export function About() {
  const { lang } = useLanguage();
  const d = T[(lang as "bs" | "en")] ?? T.bs;
  return (
    <section id="o-nama" className="relative bg-white scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Head label={d.label} h={d.heading1} accent={d.headingAccent} sub={d.subtitle} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {d.members.map((m, i) => {
            const p = PEOPLE[i];
            const Icon = p.icon;
            return (
              <Fade key={m.name} delay={i * 0.06}>
                <article className="group flex h-full flex-col gap-7 rounded-[24px] border border-[#E5E7EB] bg-white p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] sm:flex-row sm:p-8">
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[20px] bg-[#F1F5F9] sm:w-48"
                       style={{ boxShadow: FLOAT }}>
                    <Image src={p.src} alt={m.name} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-[24px] font-semibold tracking-tight text-[#0F172A]">{m.name}</h3>
                    <p className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#EEF3F8] px-3 py-1 text-[12.5px] font-semibold text-[#0F3554]">
                      <Icon size={13} /> {m.role}
                    </p>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#475569]">{m.bio}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {m.tags.map((tg) => (
                        <li key={tg} className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1 text-[12px] font-medium text-[#334155]">{tg}</li>
                      ))}
                    </ul>
                    <a href={p.linkedin} target="_blank" rel="noopener noreferrer"
                       className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#0F172A] transition-colors hover:border-[#0A66C2] hover:bg-[#F8FAFC]">
                      <Linkedin size={16} className="text-[#0A66C2]" fill="currentColor" strokeWidth={0} /> {d.linkedinBtn} <ArrowUpRight size={13} className="text-[#64748B]" />
                    </a>
                  </div>
                </article>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
