# AGENTS.md: Working on the Orion Love site

Practical rules for any AI agent (or person) editing this repo. **Read `README.md` first** for strategy, page intent, design and writing standards, and `BUSINESS_INFO.md` for approved facts. If this file and README conflict, README wins.

Orion is not a developer: explain changes in plain language, preview before publishing, and ask before anything visible goes live.

## Non-negotiables

1. **Honesty:** no invented reviews, stats, sales history or personal details; no pronouns for Orion (see README §3).
2. **Raw HTML is the source of truth.** Never make crawl-critical content JavaScript-only.
3. **Shared parts are edited once, in `partials/`.** Header, phone menu, footer, head assets (fonts, `styles.css`, `editorial-base.css`, `script.js`) and favicons live in `partials/*.html`; the site-wide JSON-LD entities (Person, RealEstateAgent, LocalBusiness, WebSite) live in `partials/entities.json`. Run `node scripts/sync-shared.mjs` to copy them into every page between the `<!-- shared:NAME -->` markers. Never hand-edit those regions in a page, and never reintroduce JS-rendered footers (`renderSharedFooter()`).
4. **Business facts come only from `BUSINESS_INFO.md`**, identical everywhere.
5. **Forms must keep working.** They are how leads arrive (see Forms below).
6. **Fix systems, not symptoms.** Shared problems get shared fixes; no one-off overrides stacked at the end of a file.

## Workflow

1. `git pull` first: a GitHub Action commits stat updates on the 1st and 15th.
2. Preview locally: `python3 -m http.server 8765`, then open `http://localhost:8765/<page>.html` (clean URLs only work on the live site).
3. Check desktop and phone widths (320 / 375 / 768 / 1024 / 1280+): no sideways overflow, nothing hidden under the fixed header, columns aligned.
4. Run the checks below, then show Orion the preview and get a yes.
5. Commit with a clear message, `git push origin main`. **Pushing to `main` deploys**: Cloudflare Pages is live in about 1 minute.
6. Verify on the live site with a cache-busting query (`?x=123`). Remember the 404 page contains Orion's name, so check for page-specific markup, not just "Orion Love".

**Cache busting:** Cloudflare caches CSS/JS for 4 hours. For `styles.css`, `editorial-base.css` and `script.js`, bump the `?v=` in `partials/head-assets.html` and run the sync script. For a page stylesheet, bump its `?v=` on the pages that load it. When replacing an image under the same filename, add `?v=2` to its `src`.

## Map of the repo

| Path | What it is |
|---|---|
| `*.html` | 24 static pages (index, about, sell-with-orion, grand-junction-home-value, grand-junction-housing-market, buy-with-orion, contact, faq, areas, blog + posts, 10 `sell-<area>` guides, privacy, 404) |
| `styles.css` → `editorial-base.css` → page CSS | Load order on every page. `styles.css` is the small site-wide foundation (tokens, reset, base headings, nav-link hover, reveal hooks, form layout); `editorial-base.css` owns shared components (header, nav, footer, forms, portraits, tokens); page CSS (`editorial-home.css`, `area-detail-editorial.css`, `market-editorial.css`, etc.) owns page layout only |
| `partials/` | Master copies of shared page parts and site-wide JSON-LD entities (see Non-negotiables #3) |
| `scripts/sync-shared.mjs` | Copies `partials/` into every page; `--check` fails if any page has drifted |
| `script.js` | Menu, header state, form submission, live market-stat refresh |
| `images/` | Site photos (≤2000px), `brand/` (logos, favicons, share image), `portraits/` (photo library; see `images/README.md`) |
| `market-data/*.json` | Latest stats per area (written by the stats job) |
| `scripts/update-market-snapshots.mjs` | Writes stats into area pages; `scripts/test-market-snapshot-fallbacks.mjs` tests it |
| `.github/workflows/update-market-snapshots.yml` | Runs the stats job 16:00 UTC on the 1st and 15th |
| `sitemap.xml`, `robots.txt`, `llms.txt` | Crawl files; keep in sync when pages are added |
| `_redirects`, `_headers` | Cloudflare Pages rules (`.html` → clean URLs; internal docs/scripts redirect to `/`) |
| `validate_site.py` | Canonical, schema and footer checks |

## Shared building blocks

- **Header:** wordmark image + brokerage text (`.logo-wordmark`, `.logo-brokerage`); the brokerage stacks under the wordmark below 1200px. The top menu has six links (Sellers, Buyers, Home Value, Areas, About, Market Briefings) plus Contact; Home and FAQ live in the footer and phone menu. The full menu shows above **960px**, the ☰ menu and tap-to-call (`.mobile-call`) below. The breakpoint lives in `editorial-base.css` *and* `script.js`: change both. The header turns solid navy on scroll (`.solid`).
- **Cover hero:** every main page, area guide and blog page opens with `.cover-hero` (in `editorial-base.css`): a photo band with the headline, then a cream strip with the intro (+ buttons), optional tags and an optional quote. Set the photo with `--cover-photo` (inline `style` on the section; area guides use their `--area-hero-photo`). Use `.cover-hero--long` for long headlines. No kicker line above the headline. About, Contact and Privacy keep their own openers.
- **Portraits:** `.advisor-portrait` (framed photo + name/brokerage caption). Variants: `--on-dark` (navy sections), `--end` (right-aligned), `--compact` (small photo beside caption, used on area pages). Don't reuse a photo already used elsewhere.
- **Area guides:** fixed four-section structure (README §5). Keep every `data-market-*` attribute: the stats job depends on them.
- **Forms fallback:** `.form-nojs-note` shows phone/email only when JavaScript fails (`html` lacks `.js`).

## Forms (leads)

Contact, Home Value and Buyer forms post JSON from `script.js` to the `fub-contact-proxy` Cloudflare Worker, which creates the lead in Follow Up Boss. The Worker is **not** in this repo.

- **Never submit real test leads.** To test, override `window.fetch` in the browser, submit, and compare the captured payload before and after your change. It must be identical unless the change is intended.
- Keep `method="post"` and the no-JS note on all three forms.

## Market stats pipeline

1. Cloudflare Worker `orion-market-stats` (in Orion's Cloudflare account, not this repo) fetches RentCast data at **08:00 UTC on the 1st and 15th**.
2. The GitHub Action runs `update-market-snapshots.mjs` at **16:00 UTC** the same days. It fills the table, highlights sentence and Dataset on `grand-junction-housing-market.html` and, on each area guide, writes the stat cards, the one-sentence market summary (`data-market-summary`, which carries the "As of" date and the RentCast source), Dataset JSON-LD, `market-data/*.json`, and the sitemap `<lastmod>` for changed pages, then commits and deploys.
3. `script.js` refreshes the cards and summary from the Worker when a visitor loads the page.

Gotchas already hit once:
- GitHub **disables scheduled workflows after 60 days without repo activity.** If stats go stale, check the Actions tab.
- Use **function replacers** in `String.replace` (a price like "$369,900" in a replacement string becomes a `$3` backreference).
- The API currently returns `lastUpdatedDate: null`; the script falls back to `generatedAt`.
- Tests must not hard-code a month's numbers. Read current page values instead.

Local run: `node scripts/update-market-snapshots.mjs --dry-run` (needs Node; `brew install node`).

## Structured data

Every page's JSON-LD `@graph` includes the shared entities, which must stay identical across pages:

- `Person` `#orion-love-person`: includes image, description, `sameAs`, license credential (`hasCredential`), `knowsAbout`
- `RealEstateAgent` `#orion-love`, `LocalBusiness` `#localbusiness`, `WebSite` `#website`

Plus page nodes (`WebPage`, `BreadcrumbList`, `FAQPage`, `BlogPosting`, `Service`, `Dataset`). Rules:
- Any node referenced by `@id` must be defined on that page (blog posts need `LocalBusiness` because it's the publisher).
- `FAQPage` on `/faq` lists **all** visible questions with their exact answer text. If FAQ content changes, rebuild it from the page.
- The Google Business Profile link is `https://www.google.com/search?kgmid=/g/11yw040cd8` (footer and `sameAs`).

## Adding a Market Briefing (blog post)

1. Copy an existing `blog-<slug>.html`; update title (≈60 chars incl. " | Orion Love"), description (≤155), canonical, OG/Twitter tags, `WebPage`, `BlogPosting` (dates) and `BreadcrumbList`.
2. Add it to `blog.html`, `sitemap.xml` (with `<lastmod>`), `llms.txt`, and a `/<slug>.html → /<slug>` line in `_redirects`.
   Update the homepage's "Latest market briefing" link (`.eh-latest-briefing` in `index.html`) to point to it.
3. Keep the author byline (`.post-hero__author`) and the static footer.
4. Cite sources for every number.

## Checks to run before publishing

```bash
node scripts/sync-shared.mjs --check                  # shared parts identical on every page
python3 validate_site.py                              # canonicals, schema, footer
node scripts/test-market-snapshot-fallbacks.mjs       # stats pipeline
node --check script.js                                # JS syntax
```

Also:
- **JSON-LD parses** on every page (a quick Python `json.loads` loop over each `application/ld+json` block).
- **Titles ≤ ~60 chars, descriptions ≤ ~155**, unique per page.
- **After writing copy for several pages,** compare them: no 5-word phrase shared by 3+ pages (excluding place names), no repeated sentence openers or closing lines, no noun lists of 5+, none of the banned patterns in README §6.
- **HTML tags balance** on edited pages (Python `html.parser`).
- **Color contrast** after any color change: run axe-core's `color-contrast` rule on the changed pages at 1280 and 375px. Only decorative numerals marked `aria-hidden="true"` may fail.
- **Photos:** serve site photos as WebP sized to how they display (keep the original JPG for social share images).
- **Removing CSS?** Prove it's unused: snapshot the computed styles of every element on every page at 1280/768/375px before and after (iframes + `getComputedStyle`), and only keep removals with zero differences. Several "legacy" rules in `styles.css` turned out to be load-bearing.

## Don'ts

- Don't bulk-delete branches, force-push, or rewrite history on `main`.
- Don't add JS-rendered critical content, analytics code (Cloudflare injects it), or new tracking without asking.
- Don't change `BUSINESS_INFO.md` facts or add personal details without Orion's confirmation.
- Don't publish without showing Orion a preview when the change is visible.
