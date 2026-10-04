"use client";

import Image from "next/image";
import { Code2, Megaphone, ArrowUpRight, Linkedin, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { Head, Fade } from "@/components/ui/kit";

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
    heading1: "Upoznajte",
    headingAccent: "naš tim",
    subtitle: "Nas dvojica radimo sve sami. Jedan gradi, drugi dovodi klijente. Razgovarate direktno s ljudima koji rade posao, bez posrednika.",
    linkedinBtn: "LinkedIn profil",
    members: [
      {
        name: "Bakir Mehić",
        role: "Razvoj i dizajn",
        bio:  "Vodim projekat od prve skice do objave. Pravim sajtove i web aplikacije, pa ih testiram tako da greške nađem ja, a ne vaši kupci. Zadnji veći projekat je kompletna aplikacija za iznajmljivanje vozila koja i danas radi.",
        tags: ["Webflow & Next.js", "AI Prompt Engineering", "QA Engineer"],
      },
      {
        name: "Nedim Kupusija",
        role: "Marketing i mreže",
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
        role: "Development & Design",
        bio:  "I take projects from the first sketch to launch. I build websites and web apps, then test them so that I find the bugs, not your customers. My most recent build is a complete car rental app that is still running today.",
        tags: ["Webflow & Next.js", "AI Prompt Engineering", "QA Engineer"],
      },
      {
        name: "Nedim Kupusija",
        role: "Marketing & Social",
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
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-2">
          {d.members.map((m, i) => {
            const p = PEOPLE[i];
            const Icon = p.icon;
            return (
              <Fade key={m.name} delay={i * 0.06} className="min-w-0">
                <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#CBD5E1]">
                  <div aria-hidden className="relative h-24 sm:h-28"
                       style={{ background: "linear-gradient(135deg, #DCE6F1 0%, #EAF0F7 55%, #F4F7FB 100%)" }}>
                    <div className="absolute inset-0 opacity-60"
                         style={{ backgroundImage: "linear-gradient(to right, rgba(15,53,84,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,53,84,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                  </div>
                  <div className="relative flex flex-1 flex-col px-7 pb-7 sm:px-9 sm:pb-9">
                    <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F1F5F9] ring-4 ring-white sm:h-28 sm:w-28"
                           style={{ boxShadow: "0 12px 28px -14px rgba(15,23,42,0.4)" }}>
                        <Image src={p.src} alt={m.name} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                      </div>
                      <div className="min-w-0 pb-1">
                        <h3 className="text-[21px] sm:text-[23px] font-semibold tracking-tight text-[#0F172A]">{m.name}</h3>
                        <span className="mt-1.5 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#EEF3F8] px-3 py-1 text-[12.5px] font-semibold text-[#0F3554]">
                          <Icon size={13} /> {m.role}
                        </span>
                      </div>
                    </div>
                    <p className="mt-6 text-[15px] leading-[1.75] text-[#475569]">{m.bio}</p>
                    <ul className="mt-6 flex flex-wrap gap-1.5 sm:flex-nowrap xl:gap-2">
                      {m.tags.map((tg) => (
                        <li key={tg} className="whitespace-nowrap rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1.5 text-[11.5px] sm:text-[12.5px] lg:text-[11.5px] xl:px-2.5 xl:text-[12.5px] font-medium text-[#334155]">{tg}</li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <a href={p.linkedin} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#0F172A] transition-colors hover:border-[#0A66C2] hover:bg-[#F8FAFC]">
                        <Linkedin size={16} className="text-[#0A66C2]" fill="currentColor" strokeWidth={0} /> {d.linkedinBtn} <ArrowUpRight size={13} className="text-[#64748B]" />
                      </a>
                    </div>
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
