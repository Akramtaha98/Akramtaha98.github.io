# Balanced evidence

Akram's software and research form two equally prominent streams. Keep the introduction compact, put both work headings in the desktop first viewport, and retain direct links to both streams on mobile. This is a code-first static portfolio; real records and the Portfolio Studio publishing workflow remain authoritative.

## Tokens

| CSS token | Light | Dark |
| --- | --- | --- |
| `--paper` | `#f3f3ed` | `#18211b` |
| `--surface` | `#e8eae1` | `#222e25` |
| `--soft` | `#e2e7d9` | `#2a382c` |
| `--ink` | `#202a23` | `#eff1e8` |
| `--muted` | `#536052` | `#c1cbbd` |
| `--green`, `--accent` | `#3f5a2a` | `#c4dba7` |
| `--line` | `#d0d6c7` | `#41503e` |
| `--shadow` | `none` | `none` |

Display: Erode Medium, self-hosted at `assets/fonts/erode-medium.woff2`, with Georgia/serif fallback. Body: DM Sans/sans-serif. `--mono` intentionally aliases body. Headline tracking is −0.025em; project titles −0.02em. Desktop hero uses `clamp(58px,6.5vw,88px)` at 0.98 line height, mobile 56px at 1, and narrow mobile 49px. Section titles are 46px desktop and 39px mobile. Body copy is generally 15–16px with 1.55–1.65 line height.

## Composition and components

Content max width: 1440px. Outer padding: 48px desktop, 30px tablet, 20px mobile, 16px at 360px and below. Header heights: 84px desktop, 72px mobile. Breakpoints: 1500px, 1100px, 700px, 360px. Desktop work streams use equal columns with a 32px gap; the gap is 48px above 1500px and 20px on tablet. At 700px and below they stack.

Use flat rectangular fields, no decorative elevation, and serif titles with plain sans-serif explanatory copy. Desktop project rows pair a 165px concept preview with text, using a 22px gap; above 1500px previews become 180px wide. On tablet and mobile, previews sit above text. Papers use openly spaced text records with visible publication status and PDF actions. Preview graphics are labeled conceptual evidence, not product screenshots.

Light preview ground: `#d4deca`; preview ink: `#274624`. Dark preview ground: `#344b36`; preview ink: `#e2ecd9`. Keep diagram geometry crisp and avoid fabricated imagery or unsupported claims.

## Interaction and accessibility

Use the palette for selection, scrollbar and keyboard focus. Focus outline is 3px with a 5px offset. Primary buttons have a 46px minimum height; project and paper actions have a 44px minimum height. Preserve light/dark/system selection, mobile navigation, motion pause and reduced-motion handling. Concept previews explain summarization, redaction and packet movement. Content is visible by default; reduced motion removes preview animation and card transitions.

## Review status

Source values recorded from `redesign.css`. Desktop first-viewport, background-section and dark tablet screenshots were inspected. The original full-page mobile capture was clipped; four subsequent full-width phone viewport captures resolve that evidence limitation. Visual finish disposition: ship for the scored fixes. Final captures show consistent SVG controls and link arrows, with publication status beneath titles. The parent reports that the Impeccable launcher was unavailable (permission denied), so a direct-context fallback was used without a concept-seed run or quality-bar card. No seed is fabricated; seeded-workflow compliance remains unverified. Interaction testing and the reported 31 passing tests were performed by the parent task, not independently repeated by the documenter. Visual approval covers the scored fixes and supplied captures; it does not establish seeded-workflow compliance.
