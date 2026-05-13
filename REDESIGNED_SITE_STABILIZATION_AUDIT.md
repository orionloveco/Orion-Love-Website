# Redesigned Site Stabilization Audit

Audit date: May 13, 2026  
Scope: all root HTML pages, area detail pages, editorial CSS files, `styles.css`, `editorial-base.css`, `support-editorial.css`, `faq-editorial.css`, and `script.js`.

This is an audit-only stabilization pass. No cleanup, CSS deletion, JS deletion, markup redesign, or visual redesign was performed.

## Executive summary

The redesigned site is broadly stable: every HTML page loads the shared CSS foundation in the expected ownership order, no redesigned page body content uses the explicitly forbidden legacy layout class tokens, internal links use clean URLs, schema is present in raw HTML rather than injected by JavaScript, and the validator reports zero issues.

The highest-risk remaining dependencies are concentrated in `styles.css` and `script.js`, not in the redesigned page bodies:

1. `styles.css` still contains large legacy compatibility systems, including generic `.site-section`, `.hero`, `.card-*`, `.card-grid-*`, dark-band, and `.cta-close` systems. These appear unused by current redesigned body markup but may still be protecting nav/footer/global compatibility and should be removed only in small selector-family passes.
2. `script.js` still contains an FAQ tabs/search/accordion block that appears obsolete for the redesigned FAQ page, but it should be removed only after browser QA because the block is guarded by `.page-faq` and can still run on the FAQ page even when no old wrappers exist.
3. `script.js` still renders `#featuredAreasLinks` markup if any page includes that mount. No current HTML page appears to include `id="featuredAreasLinks"`, making it a strong dead-JS candidate.
4. Header scroll state still checks for `.hero`; redesigned pages use page-family hero class names such as `.editorial-cover-hero`, `.seller-hero`, `.area-hero`, and `.home-value-hero`, so the current logic treats pages as having no legacy hero. This is probably safe because header solid state still works, but it is a legacy assumption and should be reviewed separately.
5. `index.html` has a static footer, but its footer class is `main-footer editorial-footer` rather than the exact static-footer validation string used elsewhere: `<footer class="main-footer" id="siteFooter">`. This is a crawlability/process consistency issue, not a missing-footer issue.
6. Clean internal URLs are used in HTML, but a plain `python3 -m http.server` does not rewrite `/about` to `/about.html`. File paths with `.html` return 200 locally; clean URLs require production hosting rewrites or a local rewrite server for exact validation.

## Methodology and commands used

- Parsed stylesheet order from every root HTML file.
- Parsed body class tokens to detect forbidden legacy layout classes only in body content.
- Reviewed stylesheet ownership and likely primitive duplication across editorial CSS files.
- Reviewed `styles.css` comment boundaries and selector families for legacy systems.
- Reviewed `script.js` feature blocks and DOM hooks.
- Checked static nav/footer/NAP/profile-link crawlability in raw HTML.
- Checked canonical URLs, page titles, schema presence, RealEstateAgent `@id`, and license value.
- Checked internal links and clean-URL consistency.
- Ran site validator and whitespace diff check.
- Served the site locally and checked both clean URLs and `.html` file URLs.

Commands run:

```bash
python3 validate_site.py
git diff --check
python3 -m http.server 4173
python3 <stylesheet-order-parser>
python3 <legacy-body-class-token-parser>
python3 <internal-link-checker>
python3 <local-http-200-checker>
rg -n "<div id=\"siteFooter\"></div>" *.html
rg -n "<footer class=\"main-footer\" id=\"siteFooter\"" *.html
rg -n "renderSharedFooter" script.js
rg -n "Google Business Profile|Zillow|Realtor.com|LinkedIn|Keller Williams|mailto:orion.love.co@gmail.com|tel:9706446781" *.html
```

## 1. Current page ownership map

| Page | Body family / role | Page-specific CSS owner | Status |
|---|---|---|---|
| `index.html` | Homepage / flagship seller-first cover | `editorial-home.css` | Correct owner |
| `sell-with-orion.html` | Seller representation page | `sell-with-orion-editorial.css` | Correct owner |
| `about.html` | About/profile spread | `about-editorial.css` | Correct owner |
| `contact.html` | Contact / seller briefing form | `contact-editorial.css` | Correct owner |
| `grand-junction-home-value.html` | Home value / pricing guidance | `home-value-editorial.css` | Correct owner |
| `areas.html` | Areas index | `local-index-editorial.css` | Correct owner |
| `sell-clifton.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-downtown-grand-junction.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-fruita.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-loma-mack.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-north-grand-junction.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-northeast-grand-junction.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-northwest-grand-junction.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-orchard-mesa.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-palisade.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `sell-redlands.html` | Area detail page | `area-detail-editorial.css` | Correct owner |
| `buy-with-orion.html` | Buyer page / secondary audience | `buy-with-orion-editorial.css` | Correct owner |
| `privacy.html` | Support/legal page | `support-editorial.css` | Correct owner |
| `404.html` | Support/error page | `support-editorial.css` | Correct owner |
| `faq.html` | FAQ / answer hub | `faq-editorial.css` | Correct owner |

## 2. CSS load order findings

Expected ownership order:

```text
styles.css → editorial-base.css → page-specific editorial CSS
```

Findings:

- Every root HTML page follows the expected load order after the Google Fonts stylesheet.
- No page-specific editorial stylesheet loads before `editorial-base.css`.
- No redesigned page is missing `styles.css` or `editorial-base.css`.
- No page loads multiple page-specific editorial CSS files.

Observed page-specific stylesheet mapping:

| Page group | Stylesheets after fonts |
|---|---|
| Homepage | `styles.css`, `editorial-base.css`, `editorial-home.css` |
| Sell page | `styles.css`, `editorial-base.css`, `sell-with-orion-editorial.css` |
| About | `styles.css`, `editorial-base.css`, `about-editorial.css` |
| Contact | `styles.css`, `editorial-base.css`, `contact-editorial.css` |
| Home value | `styles.css`, `editorial-base.css`, `home-value-editorial.css` |
| Areas index | `styles.css`, `editorial-base.css`, `local-index-editorial.css` |
| Area detail pages | `styles.css`, `editorial-base.css`, `area-detail-editorial.css` |
| Buyer page | `styles.css`, `editorial-base.css`, `buy-with-orion-editorial.css` |
| Privacy / 404 | `styles.css`, `editorial-base.css`, `support-editorial.css` |
| FAQ | `styles.css`, `editorial-base.css`, `faq-editorial.css` |

## 3. Redesigned body dependency check for forbidden legacy class tokens

Forbidden body-content tokens checked:

- `.hero`
- `.hero-support`
- `.site-section`
- `.section-*`
- `.card-grid-*`
- `.card-*`
- `.cta-close`
- old FAQ tab/search/accordion wrappers such as `.faq-tab`, `.faq-tabs`, `.faq-search`, `.faq-accordion`

Result:

- No exact forbidden class tokens were found in redesigned page body content.
- Current hero class names such as `.editorial-cover-hero`, `.seller-hero`, `.area-hero`, `.home-value-hero`, `.faq-hero`, and `.support-cover` are page-family or editorial classes, not the old exact `.hero` class.
- No body content is currently dependent on the legacy `.site-section`, `.card-*`, `.card-grid-*`, or `.cta-close` systems.

## 4. Shared primitives usage findings

`editorial-base.css` is acting as the shared editorial primitive owner for:

- editorial shell and section spacing primitives
- editorial labels/eyebrows
- editorial notes/captions
- editorial buttons
- editorial link arrows
- editorial card and surface primitives
- form field primitives
- details/FAQ primitives
- footer presentation support
- mobile nav compatibility

Page-specific CSS files generally use those primitives correctly as composition hooks and local overrides.

Potential primitive duplication / review notes:

- `contact-editorial.css` has the heaviest page-local form and submit-button composition. Much of it is page-specific layout for the contact sheet and appears justified, but it should be reviewed when consolidating form primitives.
- `faq-editorial.css` locally customizes `.editorial-btn--primary` for the answer hub and FAQ hero. This is acceptable composition if intentionally scoped, but it is one of the first places to review for generic button duplication.
- `sell-with-orion-editorial.css` styles `.seller-close__cta .btn`, meaning that one seller-page CTA still touches the older `.btn` primitive rather than only `.editorial-btn`.
- `support-editorial.css`, `area-detail-editorial.css`, `home-value-editorial.css`, `buy-with-orion-editorial.css`, and `local-index-editorial.css` mostly appear to contain page-family composition and scoped responsive rules.

## 5. Page-specific CSS ownership findings

Status by file:

| File | Intended role | Audit finding |
|---|---|---|
| `editorial-home.css` | Homepage composition | Page-family composition; no obvious generic primitive ownership conflict found. |
| `sell-with-orion-editorial.css` | Seller page composition | Mostly composition; one old `.btn` scoped CTA dependency should be reviewed. |
| `about-editorial.css` | About page composition | Composition-only based on searched primitive hooks. |
| `contact-editorial.css` | Contact page composition | Contains necessary contact form sheet composition; review submit-button styling before any future form primitive cleanup. |
| `home-value-editorial.css` | Home value page composition | Composition-only with scoped editorial-eyebrow adjustments. |
| `local-index-editorial.css` | Areas index composition | Composition-only with scoped shell/button responsive adjustments. |
| `area-detail-editorial.css` | Area detail family composition | Composition-only with scoped shell/eyebrow/CTA adjustments. |
| `buy-with-orion-editorial.css` | Buyer page composition | Composition-only with scoped editorial-eyebrow adjustments. |
| `support-editorial.css` | Privacy / 404 support composition | Composition-only support cover rules. |
| `faq-editorial.css` | FAQ page composition | Composition plus scoped button/FAQ surface overrides; review before pruning old FAQ JS/CSS. |

## 6. Remaining `styles.css` legacy sections

`styles.css` still functions as a mixed global foundation and legacy compatibility file. Current classification:

### Still actively required

- Design tokens and legacy aliases in `:root`.
- Reset/base document defaults.
- Header/nav styling and mobile nav support.
- Footer styling and global footer responsive support.
- `.reveal` animation support, because `script.js` still initializes `.reveal` elements.
- Generic `.container` and compatibility utilities where still referenced by nav/footer or JavaScript-injected compatibility markup.
- Form compatibility for seller lead forms until form primitives are fully consolidated and validated.
- Market/stat fallback presentation where tied to current `data-market-area` and Grand Junction city stats markup.

### Only required by nav/footer/global compatibility

- `.nav-*`, `.mobile-nav-*`, `.main-header`, `.footer-*`, `.main-footer`, and related responsive rules.
- `.btn-nav` and older global `.btn` styling used by nav and at least one seller page scoped CTA.
- `body.mobile-nav-open` behavior.

### Only required by old JS hooks

- `#featuredAreasLinks` support styles, if any, and related `.nearby-area-*` compatibility rules are only relevant if the old JS mount is used. No current HTML page appears to include `id="featuredAreasLinks"`.
- FAQ tab/search/accordion styling in `styles.css` is likely only useful if old FAQ wrappers are present. Current redesigned FAQ appears to be owned by `faq-editorial.css`.

### Risky / needs separate cleanup

- Canonical dark-band system in `styles.css`. It is broad and may overlap with old section classes even if redesigned pages do not currently use those exact legacy body tokens.
- Canonical `.cta-close` system. No current body content uses `.cta-close`, but it is large and may have shared descendant styling expectations.
- Legacy section-density responsive rules around `.site-section` and older spacing systems.
- Homepage transitional compatibility rules under `.page-index` in `styles.css`. The homepage now has `editorial-home.css`, but these rules are specifically scoped to the homepage and should be compared visually before removal.
- FAQ migrated inline styles in `styles.css`, because `faq-editorial.css` now owns the FAQ redesign but the page still has `body.page-faq`.

### Dead and removable candidates, pending visual QA

- Exact legacy `.hero` system, if not used by any current HTML body token and after updating/removing the header `.hero` assumption in `script.js`.
- Exact `.hero-support` system, if present and unused by `privacy.html` / `404.html` after support-page visual QA.
- Exact `.site-section` / `.section-*` layout systems, because current HTML body content does not use those class tokens.
- Exact `.card-*` and `.card-grid-*` systems, because current HTML body content does not use those class tokens.
- Exact `.cta-close` system, because current HTML body content does not use that class token.
- Old FAQ tab/search/accordion styles, after FAQ JS cleanup and FAQ browser QA.

## 7. Remaining `script.js` legacy behavior

Current classification:

### Still actively required

- Mobile nav overlay behavior.
- Desktop/mobile area dropdown active-state sync.
- Current page active link sync for nav and mobile nav.
- Lucide icon initialization, while pages still include Lucide icons or icon placeholders.
- Reduced-motion-aware `.reveal` initialization.
- Seller lead form handling for `form[data-lead-form="seller"]`.
- Contact form handling for `#contactForm`.
- Market stats hydration for `[data-market-area]` area stat blocks.
- Grand Junction city stats hydration for `gjMedianListPrice`, `gjAvgDom`, `gjNewListings`, `gjActiveListings`.

### Dead JS candidates

- FAQ tab behavior for `.faq-tab` / `.faq-panel`: no old FAQ tab wrappers were found in current body content.
- FAQ search behavior for `.faq-search`: no old FAQ search wrapper was found in current body content.
- FAQ single-open accordion behavior for `#buyers-accordion` / `#sellers-accordion`: no old accordion IDs were found in current body content.
- `renderFeaturedAreas()` / `#featuredAreasLinks`: no current HTML page appears to include the mount target.

### Risky / needs separate cleanup

- Header scroll state checks `document.querySelector('.hero')`. Because redesigned pages do not use exact `.hero`, the header currently treats pages as no-legacy-hero pages and applies `.solid` until scrolled. This may be intentional after the redesign, but it is still a legacy coupling.
- `BUSINESS_IDENTITY` in JS duplicates raw HTML identity data. It is currently used for JS error messages/payloads and is not crawl-critical, but future identity changes must update both raw HTML/schema and JS messaging.
- Shared CTA constants inside JS generate old `.btn btn-primary` markup if `#featuredAreasLinks` returns. That code should not be allowed to become a source of crawl-critical CTA content again.

## 8. Dead CSS candidates

Recommended candidate groups, not deletions in this pass:

1. Old FAQ style group in `styles.css` after confirming `faq-editorial.css` fully owns FAQ visuals.
2. `#featuredAreasLinks` / `.nearby-area-*` compatibility styling if the old JS mount is removed.
3. Exact `.hero` and `.hero-support` systems after confirming no old hero class tokens exist and after resolving the header `.hero` check.
4. Exact `.site-section`, `.section-*`, `.card-grid-*`, `.card-*`, and `.cta-close` systems after one browser screenshot pass of every page family.
5. Homepage scoped transitional rules in `styles.css` after comparing homepage rendering with and without those scoped rules.

## 9. Dead JS candidates

Recommended candidate groups, not deletions in this pass:

1. FAQ tabs/search/accordion block.
2. Featured areas JS renderer.
3. Legacy `.hero` header assumption, replaced with a redesigned-page-safe rule if needed.
4. Any unused market/stat helper branch only after checking all current `data-market-*` attributes.

## 10. Pages needing tiny visual QA

These pages should get a quick browser review before the first cleanup deletion pass:

1. `index.html` — because `styles.css` still contains homepage-scoped transitional rules and the footer has the extra `editorial-footer` class.
2. `faq.html` — because old FAQ JS still runs behind the `page-faq` guard even though old wrappers appear absent.
3. `contact.html` — because it has the heaviest page-local form styling and JS form handling.
4. `sell-with-orion.html` — because one scoped CTA still styles the older `.btn` primitive.
5. One representative area page, preferably `sell-redlands.html` or `sell-fruita.html` — because area detail pages combine stat hydration, related links, and family-wide layout composition.
6. `privacy.html` and `404.html` — because support pages should be checked before removing any old `.hero-support` assumptions.

## 11. Crawlability / raw HTML findings

### Passed

- Static header/nav exists in raw HTML on every HTML page.
- Static footer exists in raw HTML on every HTML page.
- No page contains `<div id="siteFooter"></div>`.
- `script.js` does not contain `renderSharedFooter()`.
- Footer raw HTML includes Orion Love identity, Keller Williams attribution, phone, email, service area language, internal footer links, and verified profile links.
- Page H1s exist on every HTML page.
- Main page copy exists in raw HTML.
- FAQ questions and answers exist in raw HTML as `<details>` content.
- Schema is inline JSON-LD in raw HTML; it is not JavaScript-injected by `script.js`.
- Market-stat fallback values are present in raw HTML where stat hydration is expected.

### Needs process correction / follow-up

- The static footer validation string is inconsistent on `index.html`: it uses `<footer class="main-footer editorial-footer" id="siteFooter">` instead of `<footer class="main-footer" id="siteFooter">`. This does not remove crawlable footer content, but it means the exact AGENTS footer validation command counts only 19 matches across 20 HTML files.
- Local clean URLs do not return 200 under the plain Python static server because there is no local rewrite layer. The `.html` URLs all return 200. Production should continue to be validated with clean URL rewrites enabled.

## 12. Schema / entity consistency findings

### Passed

- Canonical URLs are present on all non-404 pages reviewed.
- Page titles are present on every HTML page.
- Meta descriptions are present on redesigned non-404 pages and align with seller-first/local positioning.
- Inline schema uses the canonical RealEstateAgent `@id`: `https://orionlovehomes.com/#orion-love`.
- License value found in schema is `FA.100110841`.
- `sameAs` profile links are included in schema across redesigned pages.
- Seller-first identity is strongest on homepage, sell page, home value page, area pages, FAQ, areas index, contact, and footer.
- Buyer page is appropriately secondary and still contextualizes Orion Love in Mesa County.

### Watch items

- `404.html` intentionally has no canonical or schema. This is acceptable for a support error page, but it should remain intentional.
- `about.html` and `buy-with-orion.html` mention seller representation less prominently than the direct seller pages. This is acceptable by page intent, but future copy edits should preserve entity clarity without keyword stuffing.

## 13. Internal link findings

### Passed

- Internal HTML links use clean URLs; no old `.html` links were found.
- Areas page links to all current area detail pages:
  - `/sell-clifton`
  - `/sell-downtown-grand-junction`
  - `/sell-fruita`
  - `/sell-loma-mack`
  - `/sell-north-grand-junction`
  - `/sell-northeast-grand-junction`
  - `/sell-northwest-grand-junction`
  - `/sell-orchard-mesa`
  - `/sell-palisade`
  - `/sell-redlands`
- Area pages link back to relevant seller, home value, and contact paths.
- FAQ links are selective and contextual rather than over-linked.
- No broken internal links were found when mapping clean internal links to their corresponding `.html` source files.

### Hosting / validation note

- Plain local `python3 -m http.server` does not support clean URL rewrites. Clean URL 200 checks should use the production host, preview host, or a local rewrite server. Direct `.html` file URLs all returned 200 locally.

## 14. Recommended cleanup order

Safest cleanup sequence:

1. **Document and/or fix validation mismatch first:** standardize the homepage footer opening tag if the team wants the exact static-footer validation command to pass across all pages. This is tiny and low risk.
2. **Remove dead FAQ JS only after FAQ browser QA:** confirm no `.faq-tab`, `.faq-panel`, `.faq-search`, `#buyers-accordion`, or `#sellers-accordion` behavior is needed. Then remove the guarded FAQ block from `script.js`.
3. **Remove featured areas JS renderer:** confirm no `#featuredAreasLinks` mount target exists in production or planned templates. Then remove renderer and associated CSS.
4. **Resolve header `.hero` assumption:** replace the legacy exact `.hero` check with a body/page-family-safe approach if visual behavior requires it, or simplify if solid header is now universal.
5. **Prune old FAQ styles from `styles.css`:** after JS removal and FAQ visual QA.
6. **Prune exact unused legacy layout systems in batches:** `.hero` / `.hero-support`, then `.site-section` / `.section-*`, then `.card-*` / `.card-grid-*`, then `.cta-close`. Run full visual QA between each batch.
7. **Consolidate form/button primitive duplication:** review contact form submit styling, FAQ scoped button styling, and seller close `.btn` usage after dead systems are removed.
8. **Review homepage-scoped transitional rules:** compare homepage with and without `.page-index` compatibility rules in `styles.css`, then move any still-needed composition into `editorial-home.css` or remove if redundant.

## 15. Validation results

| Check | Result |
|---|---|
| `git diff --check` | Passed |
| `python3 validate_site.py` | Passed: `ISSUES 0` |
| Stylesheet order parser | Passed for all HTML pages |
| Forbidden body class token parser | Passed: 0 forbidden exact body class tokens found |
| Internal link checker | Passed: no broken internal links mapped to files |
| `.html` local HTTP 200 check | Passed for all HTML files and `/` |
| Clean URL local HTTP 200 check with `python3 -m http.server` | Failed due to local server rewrite limitation; expected under this server |
| Static footer placeholder search | Passed: no `<div id="siteFooter"></div>` found |
| Exact footer opening tag search | 19 matches; `index.html` differs because it uses `main-footer editorial-footer` |
| `renderSharedFooter` search | Passed: not found in `script.js` |
| Raw footer contact/profile search | Passed across HTML pages |

## Final audit conclusion

The redesigned site is stable enough to begin cleanup, but cleanup should start with JS/CSS blocks that have hard evidence of no current body markup dependency. The safest first true cleanup pass is the old FAQ behavior plus associated FAQ legacy styles, after a quick visual QA of `faq.html`. The highest-risk cleanup is broad deletion from `styles.css`, especially homepage-scoped transitional rules, global nav/footer compatibility, and any system that could still influence forms, stats, or footer layout.
