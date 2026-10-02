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
  ArrowRight, Check, Clock, Star, LayoutDashboard, Car, Crown, Rocket, TrendingUp,
  CalendarClock, Wrench, type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageProvider";

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
      eyebrow: "Za rent-a-car firme",
      title: "Imate rent-a-car firmu?",
      desc: "Napravili smo poseban paket sa svojim cijenama, prema veličini flote, i sve je objašnjeno na jednom mjestu.",
      cta: "Pogledajte rent-a-car sistem",
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
        price: "2.200 KM", alt: "oko €1.120", from: true, oldPrice: "3.600 KM", discountBadge: "-39%", promoNote: "Za prve klijente · vrijedi do 30.10.", ctaLabel: "Zakažimo razgovor", monthly: "75", gift: "Rast",
        features: [
          "2 mjeseca besplatne podrške nakon isporuke, za sve nejasnoće i probleme",
          "SVE iz Startera, plus:",
          "Više povezanih dijelova (katalog, upiti i admin panel)",
          "Više uloga: vlasnik vidi sve, osoblje samo svoje",
          "Galerija slika s upload-om i pregledom",
          "Kalendar zauzetosti, pa se termini ne mogu preklopiti",
          "Obavijesti na email i WhatsApp kad stigne nova rezervacija",
          "Dvojezično (BS + EN) za domaće i strane klijente",
          "SEO + Google vidljivost",
        ],
      },
      {
        name: "Premium", tag: "Aplikacija bez ograničenja, kreirana tačno oko vašeg procesa.",
        price: "5.000 KM", alt: "oko €2.500", monthly: "100", from: true, gift: "Dominacija",
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
      "Marketing paketi su opcionalni. Budžet koji ide direktno Meti/Google-u za reklame plaća se zasebno.",
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
    headingAccent: "custom-built",
    subtitle:
      "We build the app that runs your business, from bookings and client records to an internal tool for your team. Every package includes a free month of our Rast marketing package.",
    buildLabel: "Development (one-time)",
    once: "one-time",
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
        price: "€1,120", alt: "about 2,200 KM", from: true, oldPrice: "€1,840", discountBadge: "-39%", promoNote: "Early-client price · until Oct 30", ctaLabel: "Let\u0027s talk", monthly: "75", gift: "Growth",
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
        price: "€2,500", alt: "about 5,000 KM", monthly: "100", from: true, gift: "Domination",
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

/* stavka koja je zapravo naslov grupe ("SVE iz Startera, plus:") */
const isHeader = (f: string) => f.startsWith("SVE") || f.startsWith("EVERYTHING");

const SOFT = "0 1px 2px rgba(15,23,42,0.04)";
const LIFT = "0 1px 2px rgba(15,23,42,0.06), 0 28px 56px -28px rgba(15,23,42,0.45)";

/* ── Jedna kartica paketa ──────────────────────────────────────────────────
   variant:
     "dark"     preporučeni aplikacijski paket, tamno plava kartica
     "outline"  preporučeni marketing paket, bijela s tamnim rubom
     "plain"    ostali paketi */
function PlanCard({
  icon: Icon, name, tag, priceLabel, from, price, per, oldPrice, discount, alt, note,
  promo, features, cta, href, badge, variant,
}: {
  icon: LucideIcon; name: string; tag: string; priceLabel?: string; from?: string;
  price: string; per?: string; oldPrice?: string; discount?: string; alt?: string; note?: string;
  promo?: string; features: string[]; cta: string; href: string; badge?: string;
  variant: "dark" | "outline" | "plain";
}) {
  const dark = variant === "dark";
  const txt   = dark ? "text-white" : "text-[#0F172A]";
  const muted = dark ? "text-[#94A3B8]" : "text-[#64748B]";
  const body  = dark ? "text-[#CBD5E1]" : "text-[#475569]";

  return (
    <article
      className={`relative flex flex-col rounded-[20px] p-6 sm:p-7 ${
        dark ? "bg-[#0F172A]"
             : variant === "outline" ? "bg-white border-[1.5px] border-[#0F172A]"
             : "bg-white border border-[#E5E7EB]"}`}
      style={{ boxShadow: dark ? LIFT : SOFT }}
    >
      {/* ikonica, ime i oznaka */}
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${dark ? "bg-white/10 text-white" : "bg-[#EEF3F8] text-[#0F3554]"}`}>
          <Icon size={20} strokeWidth={2} />
        </span>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-2.5 py-1 text-[11px] font-semibold text-white">
            <Star size={11} fill="currentColor" /> {badge}
          </span>
        )}
      </div>
      <h3 className={`mt-4 text-[19px] font-semibold ${txt}`}>{name}</h3>
      <p className={`mt-1.5 text-[14px] leading-relaxed ${body}`}>{tag}</p>

      {/* cijena */}
      <div className={`mt-6 border-t pt-5 ${dark ? "border-white/10" : "border-[#F1F5F9]"}`}>
        {priceLabel && <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${muted}`}>{priceLabel}</p>}
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          {from && <span className={`text-[14px] font-medium ${muted}`}>{from}</span>}
          <span className={`text-[34px] leading-none font-semibold tracking-tight tabular-nums ${txt}`}>{price}</span>
          {per && <span className={`text-[14px] font-medium ${muted}`}>{per}</span>}
          {oldPrice && <span className={`text-[15px] line-through ${muted}`}>{oldPrice}</span>}
          {discount && (
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${dark ? "bg-[#16A34A]/20 text-[#4ADE80]" : "bg-[#DCFCE7] text-[#15803D]"}`}>
              {discount}
            </span>
          )}
        </p>
        {(alt || note) && <p className={`mt-1.5 text-[12.5px] ${muted}`}>{[alt, note].filter(Boolean).join(" · ")}</p>}
        {promo && (
          <p className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium ${dark ? "bg-white/[0.06] text-[#E2E8F0]" : "bg-[#F8FAFC] text-[#334155]"}`}>
            <Clock size={12} /> {promo}
          </p>
        )}
      </div>

      {/* stavke */}
      <ul className="mt-6 space-y-2.5">
        {features.map((f) =>
          isHeader(f) ? (
            <li key={f} className={`pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${muted}`}>{f}</li>
          ) : (
            <li key={f} className={`flex items-start gap-2.5 text-[14px] leading-snug ${body}`}>
              <Check size={15} strokeWidth={2.5} className={`mt-0.5 shrink-0 ${dark ? "text-[#4ADE80]" : "text-[#16A34A]"}`} />
              {f}
            </li>
          )
        )}
      </ul>

      {/* dugme: crveno samo kod tamne (preporučene) kartice.
          Omotač s mt-auto gura dugme na dno kartice, pa su dugmad u sve tri
          kartice poravnata, bez obzira koliko stavki koja ima. */}
      <div className="mt-auto pt-7">
      <a
        href={href}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold transition-colors ${
          dark
            ? "border border-transparent bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            : variant === "outline"
              ? "border border-transparent bg-[#0F172A] text-white hover:bg-[#1E293B]"
              : "border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F9FAFB]"
        }`}
      >
        {cta} <ArrowRight size={15} />
      </a>
      </div>
    </article>
  );
}

/* zaglavlje bloka, isto kao u ostalim sekcijama */
function Head({ eyebrow, h, accent, sub }: { eyebrow: string; h: string; accent?: string; sub: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{eyebrow}</p>
      <h2 className="mt-4 text-[32px] leading-[1.12] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#0F172A]">
        {h}{accent && <> <span className="text-[#0F3554]">{accent}</span></>}
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#475569]">{sub}</p>
    </div>
  );
}

export function Pricing() {
  const { lang } = useLanguage();
  const d = PRICING[(lang as "bs" | "en")] ?? PRICING.bs;
  const AFTER_ICONS: LucideIcon[] = [CalendarClock, Wrench];

  return (
    <section id="cjenovnik" className="relative bg-white scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">

        {/* ══ aplikacije ══ */}
        <Head eyebrow={d.eyebrow} h={d.heading} accent={d.headingAccent} sub={d.subtitle} />

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {d.apps.map((plan, i) => (
            <PlanCard
              key={plan.name}
              icon={APP_ICONS[i]}
              name={plan.name}
              tag={plan.tag}
              priceLabel={d.buildLabel}
              from={plan.from ? d.from : undefined}
              price={plan.price}
              oldPrice={plan.oldPrice}
              discount={plan.discountBadge}
              alt={[d.once, plan.alt].filter(Boolean).join(" · ")}
              promo={plan.promoNote}
              features={plan.features}
              cta={plan.ctaLabel ?? d.cta}
              href="#kontakt"
              badge={i === 1 ? d.popular : undefined}
              variant={i === 1 ? "dark" : "plain"}
            />
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] leading-relaxed text-[#64748B]">{d.appNote}</p>

        {/* ══ nakon isporuke: jedna kartica, dvije kolone ══ */}
        <div className="mt-16 mx-auto max-w-3xl">
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{d.afterHeading}</p>
          <p className="mt-2 text-center text-[14px] text-[#475569]">{d.afterSub}</p>
          <div className="mt-6 grid overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white sm:grid-cols-2" style={{ boxShadow: SOFT }}>
            {d.afterBoxes.map((b, i) => {
              const Icon = AFTER_ICONS[i];
              return (
                <div key={b.label} className={`flex gap-4 p-6 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-[#F1F5F9]" : ""}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF3F8] text-[#0F3554]"><Icon size={18} /></span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A]">{b.label}</p>
                    <p className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-[24px] font-semibold tracking-tight text-[#0F172A] tabular-nums">{b.price}</span>
                      <span className="text-[13px] text-[#64748B]">{b.per}</span>
                      {b.alt && <span className="text-[12px] text-[#94A3B8]">· {b.alt}</span>}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">{b.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[12.5px] text-[#64748B]">{d.hostingNote}</p>
        </div>

        {/* ══ rent-a-car ══ */}
        <a
          href="/rjesenja/rent-a-car"
          className="group mt-12 mx-auto flex max-w-3xl flex-col sm:flex-row sm:items-center gap-5 rounded-[20px] border border-[#E5E7EB] bg-[#F8FAFC] p-6 transition-colors hover:border-[#CBD5E1]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0F3554] text-white"><Car size={22} /></span>
          <span className="flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">{d.rcBanner.eyebrow}</span>
            <span className="mt-1 block text-[17px] font-semibold text-[#0F172A]">{d.rcBanner.title}</span>
            <span className="mt-1 block text-[13.5px] leading-relaxed text-[#475569]">{d.rcBanner.desc}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-[14px] font-semibold text-white transition-colors group-hover:bg-[#1E293B]">
            {d.rcBanner.cta} <ArrowRight size={15} />
          </span>
        </a>

        {/* ══ marketing ══ */}
        <div className="mt-28">
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
      </div>
    </section>
  );
}
