/**
 * app/robots.ts
 * Dozvoljava indeksiranje i pokazuje pretraživačima gdje je mapa stranica.
 * Dostupno na /robots.txt
 */
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://mehiccdev.com/sitemap.xml",
  };
}
