# akramtaha98.github.io

Personal academic site of **Dr. Akram Taha Zeyad**: live at https://akramtaha98.github.io

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
| All text, links, papers, projects, contact | `content/site.ts` |
| Add a certificate | put the image (and PDF) in `public/certificates/`, then add an entry to `certificates.items` in `content/site.ts` |
| Portrait | `public/images/akram-portrait.webp` |
| CV | replace `public/Akram_Taha_Zeyad_Resume.pdf`, then regenerate the preview images in `public/images/cv/` |
| Papers | `public/papers/` |
| Colours, fonts, spacing | tokens at the top of `app/globals.css` |
| Canvas palette | `lib/theme.ts` |

## Structure
```
app/            pages: / (about), /research, /projects, /certificates, /cv, /contact
components/     Nav, DarkBanner, ConstellationField, Portrait, CertificateGallery, cards, ui, ThemeBoot, PageTransition, Footer
lib/            framework-free canvas engines (constellation, pixelDissolve, orbit) and theme.ts
content/        site.ts: the only file needed for content changes
```

Every reload picks a new visual theme (7 palettes) and a new constellation structure. All motion respects `prefers-reduced-motion`.
