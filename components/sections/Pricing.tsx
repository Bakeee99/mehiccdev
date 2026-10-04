/**
 * components/sections/Pricing.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Cjenovnik (v3, u boji palete).
 *
 * Ranije su sve kartice bile iste svijetle boje, a ikonice sive pločice koje
 * se skoro nisu vidjele, pa je sekcija djelovala monotono.
 *
 * Boje palete i čemu služe ovdje:
 *   #0F172A  tamno plava: preporučeni paket (Business) je cijela tamna
 *            kartica, pa se odmah vidi bez ijedne jake boje
 *   #0F3554  okean plava: ikonice na bijelim karticama, na nježnoj podlozi
 *   #16A34A  zelena: kvačice i oznaka "Najpopularniji"
 *   #DC2626  crvena: SAMO dugme preporučenog paketa, kao glavni klik
 *
 * Marketing paketi imaju isti oblik kartica, ali preporučeni je istaknut
 * tamnim rubom, a ne tamnom karticom, da se dvije tamne kartice na istoj
 * stranici ne takmiče.
 *
 * Sjene su postavljene kroz style, jer stranica ima pravilo koje utišava sve
 * klase sa sjenom.
 */

"use client";

import {
  ArrowRight, Check, CircleCheck, Clock, Star, LayoutDashboard, Car, Crown, Rocket, TrendingUp,
  CalendarClock, Wrench, type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";
import { PlanCard } from "@/components/ui/kit";

type AppPlan = { name: string; tag: string; price: string; alt?: string; kmNote?: string; oldPrice?: string; promoNote?: string; discountBadge?: string; ctaLabel?: string; monthly: string; from?: boolean; gift: string; features: string[] };
type MktPlan = { alt?: string; name: string; tag: string; price: string; note: string; features: string[] };
type PricingData = {
  eyebrow: string; heading: string; headingAccent: string; subtitle: string;
  buildLabel: string; once: string; monthlyLabel: string; monthlySub: string;
  afterHeading: string; afterSub: string;
  afterBoxes: { label: string; price: string; alt?: string; per: string; sub: string }[];
  hostingNote: string;
  rcBanner: { eyebrow: string; title: string; desc: string; cta: string };
  perMonth: string; from: string; popular: string;
  giftPre: string; giftPost: string; cta: string; appNote: string; apps: AppPlan[];
  mktEyebrow: string; mktHeading: string; mktSubtitle: string; mktCta: string; mktNote: string; mkt: MktPlan[];
};

// ── Content (BS / EN) ─────────────────────────────────────────────────────────
const PRICING: Record<"bs" | "en", PricingData> = {
  bs: {
    eyebrow: "WEB APLIKACIJE",
    heading: "Poslovne aplikacije",
    headingAccent: "po mjeri",
    subtitle:
      "Gradimo aplikaciju koja vodi vaš biznis, od rezervacija i evidencije klijenata do internog alata za vaš tim. Uz svaki paket dobijate i mjesec besplatnog marketing paketa Rast.",
    buildLabel: "Razvoj (jednokratno)",
    once: "jednokratno",
    monthlyLabel: "Hosting + podrška · opciono",
    monthlySub: "nije obavezno, samo ako želite našu podršku i održavanje",
    afterHeading: "Nakon isporuke",
    afterSub: "Prva 2 mjeseca podrške su besplatna uz Business paket. Poslije je sve opciono.",
    afterBoxes: [
      { label: "Mjesečna podrška", price: "100 KM", alt: "oko €50", per: "/mj", sub: "do 4 sata mjesečno za izmjene, nadogradnje i pomoć · prioritetno javljanje" },
      { label: "Bez pretplate", price: "50 KM", alt: "oko €25", per: "/h", sub: "plaćate samo kada nešto zatreba, po utrošenom vremenu" },
    ],
    hostingNote: "Hosting se plaća zasebno, po stvarnoj potrošnji, i kod većine sajtova je to vrlo mali iznos.",
    rcBanner: {
      eyebrow: "Za rent a car firme",
      title: "Imate rent a car firmu?",
      desc: "Napravili smo poseban paket sa svojim cijenama, prema veličini flote, i sve je objašnjeno na jednom mjestu.",
      cta: "Pogledajte rent a car sistem",
    },
    perMonth: "/mj",
    from: "od",
    popular: "Najpopularniji",
    giftPre: "Gratis marketing paket",
    giftPost: "za prvi mjesec",
    cta: "Zatraži ponudu",
    appNote:
      "Cijene su početne, a finalna ponuda ovisi o obimu i složenosti aplikacije. Uz svaku aplikaciju prvi mjesec marketinga je besplatan; nastavlja se samo uz vašu saglasnost.",
    apps: [
      {
        name: "Starter", tag: "Jedan alat koji rješava jedan problem, npr. evidencija ili jednostavan katalog.",
        price: "1.000 KM", alt: "oko €500", from: true, monthly: "50", gift: "Start",
        features: [
          "Jedna glavna funkcija (npr. katalog vozila ili evidencija klijenata)",
          "Vi i vaš tim se prijavljujete lozinkom",
          "Dodavanje, izmjena i brisanje podataka kroz jednostavan panel",
          "Forma preko koje vam klijenti šalju upite na email",
          "Radi savršeno na mobitelu i računaru",
          "Hosting, SSL i domena podešeni, ništa tehničko ne radite vi",
        ],
      },
      {
        name: "Business", tag: "Web aplikacija za rezervacije i termine. Gost bira datum i šalje upit, vi potvrđujete iz panela. Za sve što se iznajmljuje ili zakazuje.",
        price: "2.200 KM", alt: "oko €1.120", from: true, oldPrice: "2.800 KM", discountBadge: "-21%", promoNote: "Za prve klijente · vrijedi do 30.10.", ctaLabel: "Zakažimo razgovor", monthly: "75", gift: "Rast",
        features: [
          "2 mjeseca besplatne podrške nakon isporuke, za sve nejasnoće i probleme",
          "SVE iz Startera, plus:",
          "Više povezanih dijelova (katalog, upiti i admin panel)",
          "Više uloga: vlasnik vidi sve, osoblje samo svoje",
          "Galerija slika s učitavanjem i pregledom",
          "Kalendar zauzetosti, pa se termini ne mogu preklopiti",
          "Obavijesti na email i WhatsApp kad stigne nova rezervacija",
          "Dvojezično (BS + EN) za domaće i strane klijente",
          "SEO + Google vidljivost",
        ],
      },
      {
        name: "Premium", tag: "Aplikacija bez ograničenja, kreirana tačno oko vašeg procesa.",
        price: "4.400 KM", alt: "oko €2.250", monthly: "100", from: true, gift: "Dominacija",
        features: [
          "SVE iz Business paketa, plus:",
          "Neograničeni dijelovi i funkcije po vašoj želji",
          "Online plaćanje i depozit",
          "Povezivanje s drugim alatima (Google Calendar, računovodstvo, API)",
          "Automatizacije: sistem sam radi rutinske poslove umjesto vas",
          "Detaljne dozvole po članu tima",
          "Prioritetna podrška i dedikovani developer",
        ],
      },
    ],
    mktEyebrow: "Gratis prvi mjesec",
    mktHeading: "Marketing paketi",
    mktSubtitle: "Prvi mjesec je gratis uz svaku aplikaciju. Nakon toga nastavljate samo ako želite:",
    mktCta: "Više o paketu",
    mktNote:
      "Marketing paketi su opcionalni. Budžet za reklame, koji ide direktno Meti i Googleu, plaća se zasebno.",
    mkt: [
      {
        name: "Start", tag: "Osnovno prisustvo da vas ljudi nađu.", price: "60 KM", alt: "oko €30", note: "bez ugovorne obaveze",
        features: ["1 platforma (Instagram ili Facebook)", "8 objava mjesečno", "Postavka Google Business profila", "Osnovni mjesečni izvještaj"],
      },
      {
        name: "Rast", tag: "Aktivan rast i prve reklame koje donose upite.", price: "150 KM", alt: "oko €75", note: "budžet za reklame zaseban",
        features: ["2 platforme (Instagram + Facebook)", "16 objava + Stories / Reels", "1 aktivna reklamna kampanja", "Mjesečna content strategija", "Analytics + mjesečni izvještaj"],
      },
      {
        name: "Dominacija", tag: "Pun nastup: dominacija u vašem gradu.", price: "250 KM", alt: "oko €125", note: "budžet za reklame zaseban",
        features: ["SVE iz paketa Rast, plus:", "Pun content kalendar (do 30 objava)", "Više reklamnih kampanja (Meta + Google)", "Reels produkcija + community management", "Strateški pozivi + prioritetna podrška"],
      },
    ],
  },
  en: {
    eyebrow: "WEB APPLICATIONS",
    heading: "Business applications,",
    headingAccent: "built to order",
    subtitle:
      "We build the app that runs your business, from bookings and client records to an internal tool for your team. Every package includes a free month of our Rast marketing package.",
    buildLabel: "Development, paid once",
    once: "paid once",
    monthlyLabel: "Hosting + support · optional",
    monthlySub: "not required, only if you want our support and maintenance",
    afterHeading: "After launch",
    afterSub: "The first 2 months of support are free with the Business package. After that, everything is optional.",
    afterBoxes: [
      { label: "Monthly support", price: "€50", alt: "about 100 KM", per: "/mo", sub: "up to 4 hours a month for changes, upgrades and help · priority response" },
      { label: "No subscription", price: "€25", alt: "about 50 KM", per: "/h", sub: "you pay only when you need something, for the time spent" },
    ],
    hostingNote: "Hosting is billed separately based on actual usage, and for most sites it is a very small amount.",
    rcBanner: {
      eyebrow: "For car rental companies",
      title: "Running a car rental company?",
      desc: "We built a dedicated package with its own pricing based on fleet size, explained on one page.",
      cta: "See the car rental system",
    },
    perMonth: "/mo",
    from: "from",
    popular: "Most popular",
    giftPre: "Free marketing package",
    giftPost: "for the first month",
    cta: "Request a quote",
    appNote:
      "Prices are starting points, and the final quote depends on the scope and complexity of the app. With every app the first month of marketing is free; it continues only with your consent.",
    apps: [
      {
        name: "Starter", tag: "One tool that solves one problem, e.g. records or a simple catalog.",
        price: "€500", alt: "about 1,000 KM", from: true, monthly: "50", gift: "Start",
        features: [
          "One main feature (e.g. vehicle catalog or client records)",
          "You and your team log in with a password",
          "Add, edit and delete data through a simple panel",
          "A form your clients use to send you inquiries by email",
          "Works perfectly on mobile and desktop",
          "Hosting, SSL and domain set up, no tech work for you",
        ],
      },
      {
        name: "Business", tag: "A web app for bookings and appointments. The guest picks a date and sends a request, you confirm it from the panel. For anything you rent out or schedule.",
        price: "€1,120", alt: "about 2,200 KM", from: true, oldPrice: "€1,430", discountBadge: "-21%", promoNote: "Early client price · until Oct 30", ctaLabel: "Let\u0027s talk", monthly: "75", gift: "Growth",
        features: [
          "2 months of free support after launch, for any questions or issues",
          "EVERYTHING in Starter, plus:",
          "Multiple connected parts (catalog + inquiries + admin panel)",
          "Multiple roles: owner sees all, staff see their own",
          "Image gallery with upload and preview",
          "An availability calendar, so bookings cannot overlap",
          "Email and WhatsApp alerts on every new booking",
          "Bilingual (BS + EN) for local and foreign clients",
          "SEO + Google visibility",
        ],
      },
      {
        name: "Premium", tag: "An app without limits, built exactly around your process.",
        price: "€2,250", alt: "about 4,400 KM", monthly: "100", from: true, gift: "Domination",
        features: [
          "EVERYTHING in Business, plus:",
          "Unlimited parts and features to your spec",
          "Online payment and deposit",
          "Connections to other tools (Google Calendar, accounting, API)",
          "Automations: the system handles routine work for you",
          "Detailed permissions per team member",
          "Priority support and a dedicated developer",
        ],
      },
    ],
    mktEyebrow: "Free first month",
    mktHeading: "Marketing packages",
    mktSubtitle: "The first month is free with every app. After that, you continue only if you want to:",
    mktCta: "Learn more",
    mktNote:
      "Marketing packages are optional. The budget that goes directly to Meta/Google for ads is paid separately.",
    mkt: [
      {
        name: "Start", tag: "Basic presence so people can find you.", price: "€30", alt: "about 60 KM", note: "no contract commitment",
        features: ["1 platform (Instagram or Facebook)", "8 posts per month", "Google Business profile setup", "Basic monthly report"],
      },
      {
        name: "Growth", tag: "Active growth and first ads that bring inquiries.", price: "€75", alt: "about 150 KM", note: "ad budget separate",
        features: ["2 platforms (Instagram + Facebook)", "16 posts + Stories / Reels", "1 active ad campaign", "Monthly content strategy", "Analytics + monthly report"],
      },
      {
        name: "Domination", tag: "Full presence: dominate your city.", price: "€125", alt: "about 250 KM", note: "ad budget separate",
        features: ["EVERYTHING in Growth, plus:", "Full content calendar (up to 30 posts)", "Multiple ad campaigns (Meta + Google)", "Reels production + community management", "Strategy calls + priority support"],
      },
    ],
  },
};

const APP_ICONS: LucideIcon[] = [LayoutDashboard, Car, Crown];
const MKT_ICONS: LucideIcon[] = [Rocket, TrendingUp, Star];
const isHeader = (f: string) => f.startsWith("SVE") || f.startsWith("EVERYTHING");

function Head({ eyebrow, h, accent, sub, dark = false }: { eyebrow: string; h: string; accent?: string; sub: string; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={`text-[13px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-[#8FB3D9]" : "text-[#64748B]"}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-[32px] leading-[1.12] sm:text-[44px] font-semibold tracking-[-0.03em] ${dark ? "text-white" : "text-[#0F172A]"}`} style={{ textWrap: "balance" }}>
        {h}{accent && <> <span className={dark ? "text-[#8FB3D9]" : "text-[#0F3554]"}>{accent}</span></>}
      </h2>
      <p className={`mx-auto mt-5 max-w-xl text-[16px] leading-relaxed ${dark ? "text-[#94A3B8]" : "text-[#475569]"}`}>{sub}</p>
    </div>
  );
}

function AppCard({ plan, icon: Icon, featured, d }: { plan: AppPlan; icon: LucideIcon; featured: boolean; d: (typeof PRICING)["bs"] }) {
  return (
    <article
      className={`relative flex flex-col rounded-[22px] border ${featured ? "border-white/15" : "border-white/[0.08] bg-white/[0.03]"}`}
      style={featured ? { background: "linear-gradient(165deg, #1D4E78 0%, #0F3554 55%, #0C2B45 100%)", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)" } : undefined}
    >
      {featured && (
        <span className="absolute right-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-[#16A34A] text-white"><Check size={15} strokeWidth={3} /></span>
      )}
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5 pr-10">
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${featured ? "bg-white/15" : "bg-white/[0.06]"} text-white`}><Icon size={17} /></span>
          <h3 className="text-[19px] font-semibold text-white">{plan.name}</h3>
          {featured && <span className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">{d.popular}</span>}
        </div>
        <p className={`mt-3 text-[14px] leading-relaxed ${featured ? "text-[#C7D7E8]" : "text-[#94A3B8]"}`}>{plan.tag}</p>
        <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
          {plan.from && <span className={`text-[14px] ${featured ? "text-[#C7D7E8]" : "text-[#94A3B8]"}`}>{d.from}</span>}
          <span className="text-[40px] leading-none font-semibold tracking-tight text-white tabular-nums">{plan.price}</span>
          {plan.oldPrice && <span className="text-[15px] text-[#94A3B8] line-through">{plan.oldPrice}</span>}
          {plan.discountBadge && <span className="rounded-md bg-[#16A34A]/25 px-2 py-0.5 text-[11px] font-semibold text-[#4ADE80]">{plan.discountBadge}</span>}
        </p>
        <p className={`mt-2 text-[12.5px] ${featured ? "text-[#C7D7E8]" : "text-[#94A3B8]"}`}>{[d.once, plan.alt].filter(Boolean).join(" · ")}</p>
        {plan.promoNote && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[12px] font-medium text-white"><Clock size={12} /> {plan.promoNote}</p>
        )}
      </div>

      <div className={`border-t px-6 py-6 sm:px-7 ${featured ? "border-white/15" : "border-white/[0.08]"}`}>
        <ul className="space-y-3">
          {plan.features.map((f) =>
            isHeader(f) ? (
              <li key={f} className={`pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${featured ? "text-[#8FB3D9]" : "text-[#64748B]"}`}>{f}</li>
            ) : (
              <li key={f} className={`flex items-start gap-2.5 text-[14px] leading-snug ${featured ? "text-white" : "text-[#CBD5E1]"}`}>
                <CircleCheck size={16} className="mt-0.5 shrink-0 text-[#4ADE80]" />{f}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="mt-auto px-6 pb-6 sm:px-7 sm:pb-7">
        <a href="#kontakt"
           className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold transition-colors ${featured ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]" : "bg-white text-[#0F172A] hover:bg-[#E2E8F0]"}`}>
          {plan.ctaLabel ?? d.cta} <ArrowRight size={15} />
        </a>
      </div>
    </article>
  );
}

export function Pricing() {
  const { lang } = useLanguage();
  const d = PRICING[(lang as "bs" | "en")] ?? PRICING.bs;
  const AFTER_ICONS: LucideIcon[] = [CalendarClock, Wrench];

  return (
    <>
      <section id="cjenovnik" data-dark className="relative scroll-mt-24 overflow-hidden"
               style={{ background: "linear-gradient(180deg, #0B1324 0%, #0F172A 50%, #0B1324 100%)" }}>
        <div aria-hidden className="pointer-events-none absolute inset-0"
             style={{
               backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.014) 1px, transparent 1px)",
               backgroundSize: "56px 56px",
               maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
               WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
             }} />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <Head dark eyebrow={d.eyebrow} h={d.heading} accent={d.headingAccent} sub={d.subtitle} />

          <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {d.apps.map((plan, i) => (
              <AppCard key={plan.name} plan={plan} icon={APP_ICONS[i]} featured={i === 1} d={d} />
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] leading-relaxed text-[#94A3B8]">{d.appNote}</p>

          <div className="mx-auto mt-14 max-w-3xl">
            <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[#8FB3D9]">{d.afterHeading}</p>
            <p className="mt-2 text-center text-[14px] text-[#94A3B8]">{d.afterSub}</p>
            <div className="mt-6 grid overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.03] sm:grid-cols-2">
              {d.afterBoxes.map((b, i) => {
                const Icon = AFTER_ICONS[i];
                return (
                  <div key={b.label} className={`flex gap-4 p-6 ${i > 0 ? "border-t border-white/[0.08] sm:border-l sm:border-t-0" : ""}`}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-white"><Icon size={18} /></span>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{b.label}</p>
                      <p className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[24px] font-semibold tracking-tight text-white tabular-nums">{b.price}</span>
                        <span className="text-[13px] text-[#94A3B8]">{b.per}</span>
                        {b.alt && <span className="text-[12px] text-[#64748B]">· {b.alt}</span>}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#94A3B8]">{b.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-center text-[12.5px] text-[#64748B]">{d.hostingNote}</p>
          </div>

          <a href="/rjesenja/rent-a-car"
             className="group mx-auto mt-10 flex max-w-3xl flex-col gap-5 rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-white/20 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0F3554] text-white"><Car size={22} /></span>
            <span className="flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8FB3D9]">{d.rcBanner.eyebrow}</span>
              <span className="mt-1 block text-[17px] font-semibold text-white">{d.rcBanner.title}</span>
              <span className="mt-1 block text-[13.5px] leading-relaxed text-[#94A3B8]">{d.rcBanner.desc}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#0F172A] transition-colors group-hover:bg-[#E2E8F0]">
              {d.rcBanner.cta} <ArrowRight size={15} />
            </span>
          </a>
        </div>
      </section>

      <section id="marketing" className="relative bg-white scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Head eyebrow={d.mktEyebrow} h={d.mktHeading} sub={d.mktSubtitle} />
          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {d.mkt.map((plan, i) => (
              <PlanCard
                key={plan.name}
                icon={MKT_ICONS[i]}
                name={plan.name}
                tag={plan.tag}
                price={plan.price}
                per={d.perMonth}
                alt={plan.alt}
                note={plan.note}
                features={plan.features}
                cta={d.mktCta}
                href="#kontakt"
                badge={i === 1 ? d.popular : undefined}
                variant={i === 1 ? "outline" : "plain"}
              />
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] leading-relaxed text-[#64748B]">{d.mktNote}</p>
        </div>
      </section>
    </>
  );
}
