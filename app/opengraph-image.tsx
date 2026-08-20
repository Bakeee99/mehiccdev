/**
 * app/opengraph-image.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Slika koja se prikaže kada neko podijeli mehiccdev.com na Instagramu,
 * WhatsAppu, Facebooku ili LinkedInu.
 *
 * Next.js je generiše sam, u tačnom formatu 1200x630, iz ovog koda. Nema
 * fajla koji treba dizajnirati ni održavati: kad promijeniš tekst ovdje,
 * promijeni se i slika. Ista slika se koristi i za Twitter/X karticu.
 *
 * Ranije nije postojala, pa su društvene mreže same birale prvu sliku sa
 * stranice (znale su pokupiti fotografiju iz sekcije Tim).
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "mehiccdev · Web aplikacije, sajtovi i marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "80px",
          background: "linear-gradient(135deg, #050507 0%, #0B1020 55%, #101A33 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* sjaj u gornjem desnom uglu */}
        <div
          style={{
            position: "absolute", top: -220, right: -160, width: 640, height: 640,
            borderRadius: 9999,
            background: "radial-gradient(closest-side, rgba(37,99,235,0.45), rgba(37,99,235,0))",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
          <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#60A5FA", display: "flex" }} />
          <div style={{ fontSize: 24, letterSpacing: 4, color: "#93C5FD", textTransform: "uppercase" }}>
            Mostar, Bosna i Hercegovina
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: -3, color: "#FFFFFF" }}>
          mehicc<span style={{ color: "#60A5FA" }}>dev</span>
        </div>

        <div style={{ display: "flex", fontSize: 40, color: "#D4D4D8", marginTop: 22, lineHeight: 1.3, maxWidth: 900 }}>
          Web aplikacije, sajtovi i marketing iz jedne ruke
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 46 }}>
          {["Rezervacije i najam", "Sajtovi", "Marketing"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex", fontSize: 26, color: "#BFDBFE",
                border: "2px solid rgba(96,165,250,0.35)", borderRadius: 9999,
                padding: "12px 26px", background: "rgba(37,99,235,0.12)",
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", position: "absolute", bottom: 62, left: 80, fontSize: 26, color: "#71717A" }}>
          mehiccdev.com
        </div>
      </div>
    ),
    { ...size }
  );
}
