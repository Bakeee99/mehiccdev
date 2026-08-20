/**
 * app/rjesenja/rent-a-car/opengraph-image.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Zasebna slika za dijeljenje rent-a-car stranice. Kada šalješ taj link
 * vlasniku rent-a-car firme, u pregledu piše šta stranica nudi, a ne opšti
 * naziv agencije.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rezervacioni sistem za rent-a-car firme";
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
        <div
          style={{
            position: "absolute", top: -220, right: -160, width: 640, height: 640,
            borderRadius: 9999,
            background: "radial-gradient(closest-side, rgba(37,99,235,0.45), rgba(37,99,235,0))",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#93C5FD", textTransform: "uppercase", marginBottom: 30 }}>
          Rješenje za rent-a-car firme
        </div>

        <div style={{ display: "flex", fontSize: 74, fontWeight: 800, letterSpacing: -2, color: "#FFFFFF", lineHeight: 1.15, maxWidth: 1000 }}>
          Rezervacioni sistem za vašu rent-a-car firmu
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#D4D4D8", marginTop: 26, maxWidth: 950 }}>
          Sajt, admin panel i kalendar dostupnosti u jednom
        </div>

        <div style={{ display: "flex", position: "absolute", bottom: 62, left: 80, alignItems: "center", gap: 16, fontSize: 30, color: "#FFFFFF" }}>
          mehicc<span style={{ color: "#60A5FA" }}>dev</span>
          <span style={{ fontSize: 26, color: "#71717A" }}>· mehiccdev.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
