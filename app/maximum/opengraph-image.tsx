import { renderOg, OG_SIZE } from "@/lib/og";

export const alt = "Maximum Rent a Car · case study · mehiccdev";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Case study · Rent a car",
    h1: "Maximum Rent a Car",
    h2: "digitalna transformacija",
    sub: "Stranica se otvara za 3,2 s umjesto 21,6 s, uz Google ocjenu 100.",
    chips: ["Next.js", "Admin panel", "HR i EN"],
    phone: "phone-maximum.jpg",
  });
}
