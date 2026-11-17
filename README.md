# akramtaha98.github.io

Personal academic site of **Dr. Akram Taha Zeyad** — live at https://akramtaha98.github.io

Next.js 14 (App Router, static export) + TypeScript + CSS Modules. Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

> The previous version of this site is preserved on the `backup-old` branch.

## Develop
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Edit content
| What | Where |
|---|---|
| All text, links, research interests, projects, contact | `content/site.ts` |
| Portrait | replace `public/portrait-placeholder.svg` with your photo and update `about.portrait.src` |
| CV | `public/Akram_Taha_Zeyad_Resume.pdf` |
| Colours, fonts, spacing | tokens at the top of `app/globals.css` |
| Canvas palette | `lib/theme.ts` |

## Structure
```
app/            layout (nav, page transition, footer); / and /about render the profile
components/     AboutView, Nav, DarkBanner, ConstellationField, Portrait, Button, ScrollReveal, PageTransition, Footer
lib/            framework-free canvas engines: constellation, pixelDissolve, orbit
content/        site.ts — the only file needed for content changes
```

All motion respects `prefers-reduced-motion`.
