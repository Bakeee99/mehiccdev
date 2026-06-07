# mehiccdev — Bilingual Agency Website

Next.js 14 + Tailwind + Framer Motion. **Bilingual (BS / EN)**, dark/light mode,
animated charts, contact form, and photo placeholders for the team.

✅ **This version builds cleanly** (tested) — no `node_modules` issues, no font-fetch errors.

---

## 🚀 Pokretanje lokalno (na računaru)

```bash
npm install
npm run dev
```
Otvori → http://localhost:3000

---

## 🌐 Deploy na Vercel (NAJLAKŠI NAČIN — bez Git komplikacija)

Ovaj projekat ima `.gitignore` koji automatski isključuje `node_modules`,
tako da NEĆEŠ imati problem od prošlog puta. Dva načina:

### Način A — Drag & Drop (najlakše)
1. **VAŽNO:** Prvo OBRIŠI `node_modules` folder ako postoji (da zip bude mali)
2. Selektuj sve fajlove → desni klik → "Compress to ZIP"
3. Idi na [vercel.com/new](https://vercel.com/new)
4. Prevuci zip i klikni Deploy

### Način B — GitHub (preporučeno, automatski update)
U VS Code terminalu, jednom:
```bash
git init
git add .
git commit -m "mehiccdev website"
git branch -M main
git remote add origin https://github.com/TVOJ-USERNAME/REPO.git
git push -u origin main
```
> `node_modules` se NEĆE poslati jer ga `.gitignore` blokira. ✅

Pa onda na Vercel: Import Project → izaberi repo → Deploy.

---

## 🌍 Jezici (BS / EN)

- Posjetilac klikne **globus + BS/EN** dugme u navbaru → cijeli sajt se prevodi
- Izbor jezika se pamti (localStorage)
- **Sav tekst je u jednom fajlu:** `lib/i18n.ts`
  - Mijenjaš tekst? Samo edituj `lib/i18n.ts` — ništa drugo.

---

## 📸 Dodavanje vaših slika (tim)

1. Ubaci slike u `public/team/` (npr. `bakir.jpg`, `nedim.jpg`)
2. Otvori `components/sections/About.tsx`
3. U `PHOTOS` nizu postavi `src`:
```ts
const PHOTOS = [
  { src: "/team/bakir.jpg", ... },
  { src: "/team/nedim.jpg", ... },
];
```
Placeholder (plavi gradijent s inicijalima) nestaje automatski.

---

## 📬 Kontakt forma — da stvarno šalje email

Forma trenutno samo simulira slanje. Najlakše rješenje = **Formspree** (besplatno):
1. Registruj se na [formspree.io](https://formspree.io), napravi formu, dobiješ ID
2. Otvori `components/sections/Contact.tsx`, nađi `handleSubmit`
3. Otkomentariši `fetch` blok i ubaci svoj Formspree ID

---

## 📁 Struktura

```
app/
  layout.tsx          # Providers (theme + jezik) + SEO
  page.tsx            # Slaže sve sekcije
  globals.css         # Teme + font
components/
  ui/
    ThemeProvider.tsx
    LanguageProvider.tsx   # ⭐ logika za jezike
  sections/
    Navbar.tsx        # nav + BS/EN toggle + dark mode
    Hero.tsx          # hero + animirani statovi
    Services.tsx      # 4 usluge
    Satisfaction.tsx  # ⭐ animirani grafovi (zadovoljstvo + rast)
    About.tsx         # tim + placeholder za slike
    Portfolio.tsx     # projekti
    SaasTeaser.tsx    # Rent-a-Car SaaS + rani pristup
    Contact.tsx       # ⭐ jasna kontakt forma
    Footer.tsx        # footer + social linkovi
lib/
  i18n.ts             # ⭐ SVI tekstovi (BS + EN)
  animations.ts       # Framer Motion varijante
  utils.ts
public/team/          # ovdje idu slike tima
```

---

## 🔧 Što ažurirati prije launcha
- [ ] Instagram/LinkedIn linkovi u `Footer.tsx`
- [ ] Slike tima u `public/team/` + `About.tsx`
- [ ] Formspree ID u `Contact.tsx`
- [ ] Pravi linkovi projekata u `Portfolio.tsx`
