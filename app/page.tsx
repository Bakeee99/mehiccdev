/**
 * app/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Landing page — composes all sections in order.
 */

import { Navbar }       from "@/components/sections/Navbar";
import { Hero }         from "@/components/sections/Hero";
import { Services }     from "@/components/sections/Services";
import { Satisfaction } from "@/components/sections/Satisfaction";
import { About }        from "@/components/sections/About";
import { Portfolio }    from "@/components/sections/Portfolio";
import { SaasTeaser }   from "@/components/sections/SaasTeaser";
import { Contact }      from "@/components/sections/Contact";
import { Footer }       from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <Hero />
      <Services />
      <Satisfaction />
      <About />
      <Portfolio />
      <SaasTeaser />
      <Contact />
      <Footer />
    </main>
  );
}
