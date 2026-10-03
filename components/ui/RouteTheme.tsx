/**
 * components/ui/RouteTheme.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Tema po ruti.
 *
 * Naslovnica ("/") ide u svijetlu temu, sve ostale stranice (rent-a-car,
 * case study) ostaju u tamnoj kakve su i bile. Zašto ovako, a ne globalno:
 * cijeli sajt je bio zaključan na tamnu temu u layout.tsx, pa bi globalna
 * promjena pregazila i podstranice koje nismo redizajnirali.
 *
 * Kako radi: next-themes stavlja klasu "dark" ili "light" na <html>. Mi samo
 * biramo koju, prema adresi na kojoj je posjetilac.
 */

"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

export function RouteTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = pathname === "/" || pathname === "/maximum" ? "light" : "dark";

  return (
    <ThemeProvider attribute="class" defaultTheme={theme} forcedTheme={theme} enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
