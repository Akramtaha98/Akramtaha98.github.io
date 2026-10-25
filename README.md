# Akram Taha Zeyad — academic portfolio

Website: https://akramtaha98.github.io/

Editing dashboard: https://akramtaha98.github.io/admin/

## Update any text or profile link

1. Open Portfolio Studio at `/admin/`.
2. Choose a section or search for a word. Edit the fields; the preview changes immediately. On a desktop, click text in the preview to find its field.
3. Drafts are saved in the current browser. Export a JSON backup if you want a portable copy. Importing a backup loads a draft, not a public update.
4. Choose **Connect GitHub**, then **Publish changes**. GitHub Pages normally deploys the update within a few minutes.

Choose **Papers**, **Research cards**, **Study tabs**, or **Profile links** to manage complete entries:

- Click **+ Add** to create an entry, then fill in its details.
- Open **Edit details** to change an existing entry.
- Use **↑ / ↓** to reorder entries or **Delete** to remove one.
- Use **Undo entry action** to reverse an add, delete, or move before publishing.
- For a paper, paste a PDF/DOI/website link or select an already uploaded PDF. Removing an entry keeps its file in the repository.

Drafts and backups include added entries and their order. Older text-only backups are migrated automatically. New PDF uploads and layout changes still require a repository update. The dashboard also edits headings, metadata, accessibility labels, and walkthrough copy.

## Connect GitHub for publishing

GitHub Pages serves static files, so it cannot store a server-side login secret. The dashboard uses GitHub's authenticated Git Data API with a session-only token.

1. Sign in to the **Akramtaha98** GitHub account.
2. Open https://github.com/settings/personal-access-tokens/new and create a **fine-grained personal access token**.
3. Set an expiration and select **Only select repositories → Akramtaha98.github.io**.
4. Under repository permissions, set **Contents → Read and write**. No workflow, administration, or organization permissions are needed.
5. Generate the token, paste it into the dashboard's **Connect GitHub** dialog, then connect.

Do not paste a token into the website content fields. The connection token is kept in memory only, sent exclusively to `api.github.com`, and discarded when you disconnect, reload, or close the dashboard. Draft storage and backups contain website content only. Token creation is a one-time setup until the token expires; reconnecting is necessary after reopening the dashboard.

The dashboard is publicly reachable, but visitors cannot publish without authorization from the owner's GitHub account. It checks the remote revision before saving, so concurrent edits are not silently overwritten. If GitHub has newer content, export your draft and load the latest version before continuing.

## Content and files

- `content.json`: canonical editable text and links. The public site loads it at startup; semantic HTML provides fallback content if the request fails.
- `index.html`: structure and fallback copy.
- `content.js`: content rendering and editor preview.
- `app.js`: language-network animation, accessible study tabs, navigation, filters, and illustrative retrieval walkthrough.
- `style.css`: design and responsive layout; respects reduced motion preferences.
- `admin/`: editor and GitHub publishing client. No tokens or shared secrets are embedded.
- `papers/`: the three research PDFs.
- `Akram_Taha_Zeyad_Resume.pdf`: CV.

To replace a PDF, upload it to `papers/`, retaining its filename to preserve existing links. Update labels or links in the dashboard afterward. Research manuscripts are not marked as accepted publications; Study 3 is explicitly planned. The retrieval walkthrough is illustrative and does not call a live model.

## Local preview and verification

Serve this folder with any static HTTP server; no install or build step is required. Run `node --test tests/*.test.mjs` to check Unicode preservation, import validation, link safety, publishing payloads, revision conflicts, owner checks, and content coverage.

The site publishes from the root of the `main` branch using GitHub Pages. Changes to the dashboard save `content.json` and `index.html` together and trigger the same deployment.

## Google search visibility

The page includes a full-name search title and description, canonical URL, crawlable biography, sharing metadata, and ProfilePage/Person structured data linked to public academic profiles. `robots.txt` allows crawling and advertises `sitemap.xml`. The sitemap includes the homepage and three research PDFs; the editor has `noindex` metadata and is omitted from the sitemap.

Search settings in Portfolio Studio control your public name, search title, search description, role, and research university. Dashboard publishing commits `content.json` and regenerated `index.html` in one update. It updates the HTML copy, sharing titles/descriptions, and structured data without relying on a crawler to run JavaScript. Concurrent branch changes are rejected rather than overwritten.

Google controls indexing and ranking; adding metadata or a sitemap does not guarantee placement for a name search.

To submit manually after ownership verification:

1. Open Google Search Console and add the URL-prefix property `https://akramtaha98.github.io/`.
2. Verify ownership using the HTML verification file or meta tag supplied by Google. Do not invent a verification token.
3. Submit `https://akramtaha98.github.io/sitemap.xml` under Sitemaps.
4. Inspect `https://akramtaha98.github.io/` using URL Inspection, run the live test, and choose Request indexing.
5. If desired, add this website URL to your Google Scholar, ORCID, LinkedIn, and university profiles to connect your existing public identity with the site.

Account verification and submission require authorization in the owner's Google account. No submission has been made by this update. Crawling can take days to weeks, and inclusion is not guaranteed.

## Appearance and visitor preferences

The portfolio and editor support **System**, **Light**, and **Dark**. System is the default and follows device changes in real time. A visitor's explicit choice is stored in the `portfolio_theme` cookie for one year (`SameSite=Lax`, `Secure` on HTTPS, site-wide path), with local storage as a fallback. The theme applies before the stylesheet is displayed and synchronizes across same-origin tabs and the preview.

Study selection, writing filter, and lab language are stored only in local storage. The **Privacy & preferences** section explains this and can reset visitor preferences without deleting editorial drafts. No analytics or advertising cookies have been added, and GitHub tokens remain memory-only.

Mobile refinements include larger touch controls and form text, wrapping content, scrollable study/filter tabs, safe-area spacing, and accessible mobile navigation. Studio has Desktop, Tablet, Phone, and Small phone preview sizes; on narrow screens **Show page preview** opens an inline preview.
