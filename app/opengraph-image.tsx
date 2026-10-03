import { renderOg, OG_SIZE } from "@/lib/og";

export const alt = "mehiccdev · Web aplikacije, sajtovi i marketing";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Web aplikacije · Sajtovi · Marketing",
    h1: "Vašem biznisu ne treba sajt.",
    h2: "Treba mu sistem.",
    sub: "Rezervacije, admin panel i marketing iz jedne ruke. Iz Mostara, za cijeli region.",
    chips: ["Sistemi za rezervacije", "Sajtovi", "Marketing"],
    phone: "phone-home.jpg",
  });
}
