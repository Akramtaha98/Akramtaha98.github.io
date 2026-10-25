# Akram Taha Zeyad — academic portfolio

Website: https://akramtaha98.github.io/

Editing dashboard: https://akramtaha98.github.io/admin/

## Update any text or profile link

1. Open Portfolio Studio at `/admin/`.
2. Choose a section or search for a word. Edit the fields; the preview changes immediately. On a desktop, click text in the preview to find its field.
3. Drafts are saved in the current browser. Export a JSON backup if you want a portable copy. Importing a backup loads a draft, not a public update.
4. Choose **Connect GitHub**, then **Publish changes**. GitHub Pages normally deploys the update within a few minutes.

The dashboard edits existing text, headings, labels, profile links, PDF links, page metadata, accessibility labels, and walkthrough copy. Adding new sections, extra papers, layouts, or file uploads requires a repository change.

## Connect GitHub for publishing

GitHub Pages serves static files, so it cannot store a server-side login secret. The dashboard uses GitHub's authenticated Contents API with a session-only token.

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

Serve this folder with any static HTTP server; no install or build step is required. Run `node --test tests/dashboard.test.mjs` to check Unicode preservation, import validation, link safety, publishing payloads, revision conflicts, owner checks, and content coverage.

The site publishes from the root of the `main` branch using GitHub Pages. Changes to the dashboard save `content.json` and trigger the same deployment.
