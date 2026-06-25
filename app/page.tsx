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
import { Pricing }      from "@/components/sections/Pricing";
import { SaasTeaser }   from "@/components/sections/SaasTeaser";
import { Contact }      from "@/components/sections/Contact";
import { Footer }       from "@/components/sections/Footer";
import { Results } from "@/components/sections/Results";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <Hero />
      <Services />
      <Results />
      <About />
      <Portfolio />
      <Pricing />
      <SaasTeaser />
      <Contact />
      <Footer />
    </main>
  );
}
