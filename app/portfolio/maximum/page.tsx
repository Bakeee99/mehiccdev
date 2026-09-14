import type { Metadata } from "next";
import { MaximumCaseStudy } from "@/components/portfolio/MaximumCaseStudy";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

const PAGE_URL = "https://mehiccdev.com/portfolio/maximum";

export const metadata: Metadata = {
  metadataBase: new URL("https://mehiccdev.com"),
  title: "Maximum Rent a Car · rezervacioni sistem",
  description:
    "Case study: kako je rent-a-car firma iz Mostara dobila sistem za rezervacije, admin panel i kalendar dostupnosti. Učitavanje 3,2 s i Google ocjena 100.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Maximum Rent a Car · rezervacioni sistem",
    url: PAGE_URL, siteName: "mehiccdev", locale: "bs_BA", type: "article",
  },
  robots: { index: true, follow: true },
};

export default function MaximumPage() {
  return (
    <>
      <Navbar />
      <MaximumCaseStudy />
      <Footer />
    </>
  );
}
