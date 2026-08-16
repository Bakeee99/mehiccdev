/**
 * app/sitemap.ts
 * Mapa stranica koju Google čita na /sitemap.xml.
 * Kada dodamo novo rješenje (vikendice, rezervacija termina), dopisuje se
 * jedan blok ovdje.
 */
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mehiccdev.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://mehiccdev.com/rjesenja/rent-a-car",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
