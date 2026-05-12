# Orion Love Website Design System Audit

Architecture audit of the current redesigned system before further refactoring. This document records observed ownership, dependencies, duplication, and recommended sequencing only; no redesign, deletion, or class renaming is proposed here.

## Audit scope and method

Reviewed files:

- `styles.css`
- `editorial-base.css`
- `editorial-home.css`
- `sell-with-orion-editorial.css`
- `about-editorial.css`
- `contact-editorial.css`
- `home-value-editorial.css`
- `area-detail-editorial.css`
- `local-index-editorial.css`
- `script.js`
- All current root HTML pages: `404.html`, `about.html`, `areas.html`, `buy-with-orion.html`, `contact.html`, `faq.html`, `grand-junction-home-value.html`, `index.html`, `privacy.html`, `sell-clifton.html`, `sell-downtown-grand-junction.html`, `sell-fruita.html`, `sell-loma-mack.html`, `sell-north-grand-junction.html`, `sell-northeast-grand-junction.html`, `sell-northwest-grand-junction.html`, `sell-orchard-mesa.html`, `sell-palisade.html`, `sell-redlands.html`, and `sell-with-orion.html`.

Validation commands used during audit:

```bash
rg --files -g 'AGENTS.md' -g 'README.md' -g '*.html' -g '*.css' -g 'script.js'
python3 - <<'PY'
from pathlib import Path
for p in sorted(Path('.').glob('*.html')):
    links=[]
    for line in p.read_text(errors='ignore').splitlines():
        if 'stylesheet' in line and '.css' in line:
            links.append(line.strip())
    print(f'## {p}')
    for l in links: print(l)
PY
python3 - <<'PY'
from pathlib import Path
import re
for p in sorted(Path('.').glob('*.html')):
    text=p.read_text(errors='ignore')
    classes=re.findall(r'class="([^"]+)"', text)
    allc=[]
    for c in classes:
        allc += c.split()
    prefixes={}
    for c in allc:
        pref=c.split('-')[0]
        prefixes[pref]=prefixes.get(pref,0)+1
    print(p, sorted(prefixes.items(), key=lambda x:(-x[1], x[0]))[:12])
PY
python3 - <<'PY'
from pathlib import Path
import re
html_classes={}
for p in Path('.').glob('*.html'):
 t=p.read_text(errors='ignore')
 for cstr in re.findall(r'class="([^"]+)"',t):
  for c in cstr.split(): html_classes.setdefault(c,set()).add(p.name)
css=Path('styles.css').read_text(errors='ignore')
css_classes=set(re.findall(r'\.([a-zA-Z_][\w-]*)',css))
used=sorted(css_classes & set(html_classes))
for c in used:
 pages=sorted(html_classes[c])
 if not c.startswith(('footer','nav','mobile','logo','btn','container','main')):
  print(f'{c}: {", ".join(pages)}')
PY
```

## Executive findings

1. The redesigned architecture is already split into a shared editorial layer plus page-family CSS, but `styles.css` remains a large transitional compatibility layer with both necessary global foundations and older page systems.
2. `editorial-base.css` is the intended owner for rebuilt header/footer presentation and composable editorial primitives. However, `styles.css` still contains global header, footer, nav, button, hero, card, CTA, dark-band, form, page-family, and homepage selectors that can collide with page-family editorial files.
3. Most rebuilt pages follow a clear page-scoped prefix strategy:
   - Homepage: `eh-*`
   - Sell with Orion: `seller-*`
   - About: `profile-*`
   - Contact: `contact-*`, `direct-*`, form variants
   - Home value: `home-value-*`
   - Area detail pages: `area-*`
   - Areas index: `li-*`
4. The strongest candidates for shared primitives are not generic cards; they are editorial patterns repeated across pages: cover heroes, eyebrow labels, action-link lists, pull quotes, side notes, form sheets, market-stat displays, and closing CTA frames.
5. The biggest refactor risk is moving too aggressively from page-specific editorial compositions into generic shared modules. The refactor should extract only low-level composable primitives first, then migrate page families one at a time.

## 1. CSS file responsibility map

### `styles.css`

Current responsibility:

- Canonical brand token bridge for legacy and editorial layers: brand colors, typography, spacing, shadows, radii, CTA button tokens, dark-band tokens, and legacy aliases.
- Global reset/base layout: box sizing, body, images, links, `container`, type defaults, section utilities.
- Transitional global navigation, mobile overlay, dropdown, button, focus, reveal, and footer compatibility.
- Legacy/shared component families: `.hero`, centered hero variants, cards/grids, CTA bands, process steps, dark bands, CTA close systems, form shells, seller lead form contracts, nearby-area shells, FAQ styles, privacy styles, old homepage/editorial selectors, and neighborhood-framework v2 selectors.
- Page-specific or page-family selectors that have not yet moved fully into editorial page-family files.

Intended future responsibility:

- Keep global reset/base, brand tokens, legacy aliases while needed, focus contracts, JS hook compatibility, and truly site-wide utilities.
- Stop owning rebuilt editorial page composition, header/footer presentation, and page-family-specific visual systems once those are migrated.

### `editorial-base.css`

Current responsibility:

- Explicit shared editorial ownership layer for rebuilt pages.
- Rebuilt `.main-header`, `.nav-menu`, `.mobile-nav`, `.main-footer`, `.footer-grid`, editorial shell, and token presentation.
- Editorial design tokens mapped forward from `styles.css` brand tokens.
- Composable primitives: section shell, shell width, cluster, stack, split, eyebrow, editorial button base, action list/link, card, surface color helpers, image frame, input/select/textarea, shared editorial form sheet/outline/grid/field/consent/noscript primitives, and editorial FAQ details styling.

Intended future responsibility:

- Own all shared editorial primitives that can be composed without flattening page hierarchy.
- Own shared rebuilt header/footer presentation.
- Accept extracted primitives only when they remain flexible and do not impose clone-like page structure.

### `editorial-home.css`

Current responsibility:

- Homepage-only editorial composition using `eh-*` classes under `.page-index .editorial-homepage`.
- Owns homepage cover hero, cover rail, point-of-view/opening, feature spread, seller brief, market reality, atlas/area links, and closing composition.
- Also contains homepage-only chrome refinements for hero height/spacing.

Should remain page-specific for now because the homepage is a flagship, cover-like editorial composition and should not be normalized into generic section templates.

### `sell-with-orion-editorial.css`

Current responsibility:

- Flagship seller-services narrative using `seller-*` classes under `.sell-with-orion-editorial`.
- Owns seller hero, premise, before-sale decision section, response section, decision rows, notes, pull quote, close panel, and page-specific CTA styling.

Should remain mostly page-specific because this page is the core seller positioning narrative and needs distinct pacing.

### `about-editorial.css`

Current responsibility:

- About page profile-spread system using `profile-*` classes.
- Owns profile hero, portrait treatment, profile rail, verified/profile links layout, editorial body copy, pull quote, and close section.

Should remain page-specific except for small reusable primitives such as profile-link/action-link separators or pull-quote foundations.

### `contact-editorial.css`

Current responsibility:

- Contact page composition under `body.page-contact`.
- Owns contact shell, two-column composition, sticky aside, direct contact stack, identity block, contact-specific form sheet variables, consent styling, submit row/button, and responsive contact behavior.

Should remain page-specific at the composition level. Its form-sheet variable usage should inform shared form primitive refinement.

### `home-value-editorial.css`

Current responsibility:

- Grand Junction home-value flagship page under `body.page-grand-junction-home-value`.
- Owns full home-value hero, rail, hero deck/action, market-stat card/rail, method section, pricing-lens module, form section, local-context section, and page-specific responsive behavior.

Should remain page-specific at the narrative/composition level. Market-stat display, form sheet refinements, and local-context side-note patterns are candidates for shared primitives.

### `area-detail-editorial.css`

Current responsibility:

- Area detail page-family composition under `.area-detail`.
- Owns area-page hero, page/tier image overlays, market-read section, dynamic market-stat panel, local details article, rail, related CTA/action groups, and responsive behavior for all current `sell-*` area pages.

This should remain the shared family owner for individual area detail pages. Only lower-level repeated patterns should move to `editorial-base.css`.

### `local-index-editorial.css`

Current responsibility:

- Areas index page composition under `.local-index` with `li-*` classes.
- Owns index cover hero, cover photo/caption, opening, context signals, local map/index groups, local links, and close strip.

Should remain page-specific/family-specific. Its local-link/index patterns could provide shared primitives for related-area lists after area pages are stable.

### `script.js`

Current responsibility:

- Progressive-enhancement layer, not design source of truth.
- Adds `js` class and page slug fallback classes.
- Synchronizes nav active state and area dropdown state.
- Renders the optional `featuredAreasLinks` CTA mount.
- Initializes Lucide icons, scroll reveal, header scroll state, mobile nav overlay, market-stat loading, Grand Junction city stats loading, contact form submission, shared seller lead forms, and FAQ tab/search/accordion behavior.

Architecture note:

- `script.js` currently injects optional CTA markup into `#featuredAreasLinks`. This is acceptable only as enhancement if critical CTA meaning already exists in raw HTML on the relevant pages. It should not become a pattern for critical page content.

## Current HTML page families and stylesheet dependencies

| Page | Current CSS stack | Family / ownership note |
| --- | --- | --- |
| `index.html` | `styles.css`, `editorial-base.css`, `editorial-home.css` | Flagship homepage; `eh-*` page-specific system. |
| `sell-with-orion.html` | `styles.css`, `editorial-base.css`, `sell-with-orion-editorial.css` | Flagship seller page; `seller-*` narrative system. |
| `grand-junction-home-value.html` | `styles.css`, `editorial-base.css`, `home-value-editorial.css` | Flagship home-value page; `home-value-*` system. |
| `about.html` | `styles.css`, `editorial-base.css`, `about-editorial.css` | Support/profile page; `profile-*` system. |
| `contact.html` | `styles.css`, `editorial-base.css`, `contact-editorial.css` | Support/contact page; `contact-*` and shared editorial form primitives. |
| `areas.html` | `styles.css`, `editorial-base.css`, `local-index-editorial.css` | Areas index; `li-*` local-index system. |
| `sell-clifton.html` and all other `sell-*` area pages | `styles.css`, `editorial-base.css`, `area-detail-editorial.css` | Area detail family; `area-*` system with tier/body classes. |
| `buy-with-orion.html` | `styles.css`, `editorial-base.css` | Still primarily legacy/global styling via `.hero`, `.site-section`, `.section-*`, `.cta-close`. |
| `faq.html` | `styles.css`, `editorial-base.css` | Still primarily legacy/global FAQ styling. |
| `privacy.html` | `styles.css`, `editorial-base.css` | Still primarily legacy/global privacy/support styling. |
| `404.html` | `styles.css`, `editorial-base.css` | Minimal global support page using shared header/footer/buttons/section styles. |

## 2. Confirmed shared primitives in `editorial-base.css`

Confirmed shared primitives and current ownership:

### Rebuilt shared chrome

- `.main-header`
- `.main-header::before`
- `.main-header.scrolled`
- `.main-header nav`
- `.main-header .logo-main`
- `.main-header .nav-menu`
- `.main-header .nav-menu a`
- `.main-header .nav-dropdown-toggle`
- `.main-header .btn-nav`
- `.main-header .mobile-toggle`
- `.main-header .nav-dropdown-menu`
- `.main-header .nav-dropdown-heading`
- `.main-footer`
- `.main-footer .container`
- `.main-footer .footer-grid`
- `.main-footer .footer-brand`
- `.main-footer .footer-contact`
- `.main-footer .footer-profiles`
- `.main-footer .footer-support`
- `.main-footer .footer-links`
- `.main-footer .logo-footer`
- `.main-footer .footer-bottom`

### Editorial tokens

- `--site-header-height`
- `--editorial-page-width`
- `--editorial-page-width-mobile`
- `--editorial-space-1` through `--editorial-space-6`
- `--editorial-radius-card`
- `--editorial-rule`
- `--editorial-rule-strong`
- `--editorial-ink`
- `--editorial-navy`
- `--editorial-gold`
- `--editorial-gold-light`
- `--editorial-cream`
- `--editorial-sand`

### Layout primitives

- `.editorial-section`
- `.editorial-shell`
- `.editorial-cluster`
- `.editorial-stack`
- `.editorial-split`

### Typography / label primitives

- `.editorial-eyebrow`
- `.editorial-eyebrow::before`
- `.editorial-eyebrow--dark`

### Button / action primitives

- `.editorial-btn`
- `.editorial-btn:hover`
- `.editorial-btn:focus-visible`
- `.editorial-btn:disabled`
- `.editorial-btn[aria-disabled="true"]`
- `.editorial-action-list`
- `.editorial-action-link`
- `.editorial-action-link::after`
- `.editorial-action-link:hover::after`

### Surface / card / image primitives

- `.editorial-card`
- `.editorial-surface-cream`
- `.editorial-surface-sand`
- `.editorial-surface-navy`
- `.editorial-image-frame`

### Input and form primitives

- `.editorial-input`
- `.editorial-textarea`
- `.editorial-select`
- focus states for editorial inputs/selects/textareas
- `.editorial-form-frame`
- `.editorial-form-outline`
- `.editorial-form-sheet`
- `.editorial-form-header`
- `.editorial-form-grid`
- `.editorial-form-field`
- `.editorial-form-label`
- `.editorial-input--line`
- `.editorial-textarea--boxed`
- focus states for line/boxed controls
- `.editorial-submit--block`
- `.editorial-form-consent`
- `.editorial-form-noscript`

### FAQ primitive

- `.editorial-faq details`
- `.editorial-faq summary`

## 3. Duplicated patterns that should become shared primitives

These should become shared primitives only after extracting the smallest reusable behavior. Do not force pages into identical layouts.

### A. Editorial cover hero foundation

Repeated in:

- `editorial-home.css`: `.eh-cover`, `.eh-cover-photo`, `.eh-cover-layout`, `.eh-cover-title`
- `local-index-editorial.css`: `.li-cover`, `.li-cover-photo`, `.li-cover-layout`, `.li-cover-title`
- `area-detail-editorial.css`: `.area-hero`, `.area-hero__grid`, `.area-hero__copy`, `.area-hero__note`
- `sell-with-orion-editorial.css`: `.seller-hero`, `.seller-hero__bg`, `.seller-hero__inner`, `.seller-hero__photo-bg`, `.seller-hero__note`
- `home-value-editorial.css`: `.home-value-hero`, `.home-value-hero__inner`, `.home-value-hero__rail`, `.home-value-hero__deck`
- `about-editorial.css`: `.profile-hero`, `.profile-hero__stage`, `.profile-hero__content`, `.profile-hero__portrait`

Recommended primitive direction:

- Add configurable primitives for editorial hero shell, media/background layer, content grid, deck text, and optional rail/note.
- Keep page-specific class wrappers and visual variants because each hero currently carries distinct editorial intent.

### B. Eyebrow/kicker labels

Repeated in:

- `.editorial-eyebrow`
- `.eh-eyebrow`, `.eh-eyebrow-light`
- `.seller-kicker`, `.seller-kicker--dark`
- `.area-eyebrow`
- `.li-eyebrow`
- `.profile-hero__kicker`, `.profile-copy__label`
- `.direct-label`, `.aside-heading` support labels

Recommended primitive direction:

- Expand the existing `.editorial-eyebrow` into variants for light/dark, no-rule, compact, and rail labels.
- Avoid requiring every page to use a label before every section.

### C. Editorial buttons and links

Repeated in:

- `.editorial-btn`
- `.eh-btn`, `.eh-btn-primary`, `.eh-btn-outline-light`, `.eh-btn-outline-dark`
- `.li-btn--primary`, `.li-btn--quiet`
- `.sell-with-orion-editorial .btn.btn-primary`
- `.contact-submit`
- `.home-value-link-btn`
- `.profile-links a`
- `.area-action-group__links`

Recommended primitive direction:

- Keep `.btn` for legacy compatibility.
- Add editorial button variants in `editorial-base.css`: primary, quiet/dark, outline-light, outline-dark, text-arrow, and block/full-width.
- Add an editorial inline-link/action-list primitive instead of per-page bespoke arrow/separator treatments.

### D. Pull quotes, side notes, and editorial notes

Repeated in:

- `.eh-pull-quote`, `.eh-side-note-dark`, `.eh-caption-note`, `.eh-spread-note`
- `.seller-hero__note`, `.seller-premise__aside`, `.seller-response__pull`, `.seller-close__pull`
- `.profile-pull`, `.profile-hero__mini`, `.profile-close__note`
- `.area-hero__note`, `.area-caption`, `.area-article__close`
- `.li-cover-caption`, `.li-opening .li-pull`, `.li-context-note`
- `.home-value-method__pricing-lens`, `.home-value-local-context__aside`

Recommended primitive direction:

- Add `editorial-note`, `editorial-pull`, and `editorial-caption` foundations with variants for light/dark/rail.
- Preserve page-level sizing, alignment, and placement.

### E. Form sheet and lead-form styling

Repeated in:

- `editorial-base.css` form primitives
- `contact-editorial.css` contact sheet overrides
- `home-value-editorial.css` home-value form section and controls
- `styles.css` legacy shared form section/seller lead form contracts

Recommended primitive direction:

- Move only the stable structural form patterns to `editorial-base.css`: frame, sheet, outline, grid, field label, line input, boxed textarea, consent, noscript, message.
- Keep page-specific form composition in contact/home-value files.

### F. Market/stat displays

Repeated in:

- `area-detail-editorial.css`: `.area-market-read__stats`, `.area-stat-grid`, `.area-stat`
- `home-value-editorial.css`: home-value market stat/card/rail classes
- `script.js`: market-stat formatting and replacement hooks

Recommended primitive direction:

- Add a shared stat-grid/stat-item primitive for label/value/note presentation.
- Keep data hook attributes unchanged and keep fallback text in raw HTML.

### G. Local/area link indexes

Repeated in:

- `local-index-editorial.css`: `.li-index-group`, `.li-local-links`, `.li-local-link`
- `area-detail-editorial.css`: `.area-action-group`, `.area-action-group__links`
- `editorial-home.css`: `.eh-area-index`, `.eh-area-group`
- `styles.css`: nearby-area shell and neighborhood-family link utilities

Recommended primitive direction:

- Add a low-level editorial link-list/action-list primitive.
- Keep distinct page compositions: homepage atlas, areas index map, and area-detail related CTA should not be visually cloned.

### H. Closing CTA frames

Repeated in:

- `.eh-closing`, `.eh-closing-card`
- `.seller-close`, `.seller-close__panel`, `.seller-close__cta`
- `.profile-close`
- `.li-close`, `.li-close-strip`
- `.area-related-cta`, `.area-related-cta__frame`
- `styles.css`: `.cta-close-*` canonical close systems

Recommended primitive direction:

- Extract a flexible editorial closing-frame primitive with optional split, centered, routing, or note variants.
- Do not convert all closing CTAs to the same card treatment.

### I. Dark navy anchor sections

Repeated in:

- `styles.css`: `.dark-band-*` canonical systems
- `editorial-home.css`: `.eh-market-reality`, `.eh-atlas`, possibly dark side notes
- `sell-with-orion-editorial.css`: `.seller-before`, `.seller-response`
- `local-index-editorial.css`: `.li-cover`, `.li-local-map`, `.li-close`

Recommended primitive direction:

- Consolidate color, text, border, and spacing tokens for dark editorial anchors.
- Keep per-page layout/pacing in page files.

## 4. Page-specific styles that should stay page-specific

### Homepage (`editorial-home.css`)

Keep page-specific:

- Cover-like homepage hero composition and rail.
- Point-of-view opening grid.
- Feature spread image/copy relationship.
- Seller brief rows.
- Market reality anchor section.
- Atlas/local-area index composition.
- Closing card/meta layout.

Reason: These choices define the flagship homepage editorial rhythm and should not be flattened into a generic landing page.

### Sell with Orion (`sell-with-orion-editorial.css`)

Keep page-specific:

- Seller hero with media and note placement.
- Premise rail/body/note layout.
- Before-sale decision spread.
- Offset seller decision rows.
- Response grid, support notes, and seller pull quote.
- Close panel with CTA/phone treatment.

Reason: This page is a strategic seller manifesto; it needs a unique narrative pace.

### About (`about-editorial.css`)

Keep page-specific:

- Profile hero stage.
- Portrait and mini-card treatment.
- Profile rail details.
- Profile-copy mast/article relationship.
- Drop-cap article treatment.
- Profile close links.

Reason: The about page should feel like a profile spread, not a general content page.

### Contact (`contact-editorial.css`)

Keep page-specific:

- Contact shell and two-column composition.
- Sticky right aside.
- Direct contact stack and identity block.
- Contact-specific form density, button shape, and consent rhythm.

Reason: Contact needs calm directness and operational clarity; its composition should not be reduced to a generic form module.

### Home Value (`home-value-editorial.css`)

Keep page-specific:

- Home-value hero rail/deck/actions.
- Market-stat card placement.
- Pricing-method narrative grid.
- Pricing lens/ghost elements.
- Home-value form-section composition.
- Local-context statement/copy/aside layout.

Reason: This page is a flagship decision-support guide, not just a valuation lead form.

### Area detail pages (`area-detail-editorial.css`)

Keep page-family-specific:

- Area hero overlay/tier variations.
- Market-read section composition.
- Local-details article with rail.
- Area-related CTA/action-group layout.
- Tier-specific body classes: `tier-value`, `tier-lifestyle`, `tier-premium`.

Reason: Area pages need a consistent neighborhood-guide family, but not generic cards.

### Areas index (`local-index-editorial.css`)

Keep page-specific:

- Cover photo/caption system.
- Opening/context-signal rhythm.
- Local map/index group composition.
- Close strip with numeric editorial marker.

Reason: The index should feel like a guide map, not a directory list.

### Remaining support/legacy pages

Keep page-specific until deliberately rebuilt:

- `faq.html`: FAQ tabs, search, accordion panels, help rows.
- `privacy.html`: policy shell/cards/content styling.
- `buy-with-orion.html`: current buyer-support page layout until the site decides whether buyer content remains secondary or is redesigned.
- `404.html`: minimal support styling can remain simple.

## 5. Remaining legacy sections in `styles.css` and pages still depending on them

The following sections remain in `styles.css` and are still used directly or indirectly.

### Site-wide global foundations

- Design tokens, reset/base, layout, typography, section utilities.
- Dependency: all pages.
- Keep for now; eventually split into a small base file if desired.

### Global nav/mobile/footer compatibility

- Navigation/mobile overlay/dropdown/focus styles and footer compatibility styles.
- Dependency: all pages use `.main-header`, `.nav-*`, `.mobile-*`, `.main-footer`, `.footer-*` markup.
- Risk: duplicated with `editorial-base.css`, which now claims rebuilt header/footer ownership.

### Legacy `.btn` system

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-nav`, dark variants, focus states.
- Dependency: all pages still contain `.btn` classes in nav, footer, CTAs, or page content.
- Keep for compatibility until editorial button variants fully replace page-level usage.

### Legacy photo/support hero system

- `.hero`, `.hero-inner`, `.hero-eyebrow`, `.hero-cta`, `.hero-support`, `.hero-centered`, etc.
- Direct dependencies: `buy-with-orion.html`, `faq.html`, `privacy.html`.
- Potential indirect collision: rebuilt pages may still include general `hero`-like concepts, but page-family CSS mostly uses scoped prefixes.

### Legacy section utilities and card/grid systems

- `.site-section`, `.section-label`, `.section-intro`, `.card-grid-*`, `.card--*`, `.value-card`, `.process-step`, etc.
- Direct dependencies: `buy-with-orion.html`, `faq.html`, `404.html`, and possibly support sections embedded in older pages.
- Should be reduced only after support pages are migrated or confirmed unused.

### CTA systems

- `.cta-band`, `.cta-section`, `.cta-close`, `.cta-close-*`, `.cta-action-row`, `.cta-route-*`.
- Direct dependencies: `buy-with-orion.html`, `faq.html`; possible compatibility for generated `featuredAreasLinks` markup.
- Overlaps with closing CTA patterns in editorial page-family CSS.

### FAQ page styles

- `faq.html` block: `.faq-*`, search/tabs/panels/accordion/help rows.
- Direct dependency: `faq.html`.
- Keep until FAQ is rebuilt into an editorial support-page family.

### Privacy page styles

- `.privacy-*`, `.policy-*`, `.last-updated`.
- Direct dependency: `privacy.html`.
- Keep until privacy support styling is isolated or rebuilt.

### Neighborhood framework v2 and nearby-area shells

- `.seller-neighborhood-page`, `.tier-*`, `.nearby-area-*`, neighborhood-family scaffolding.
- Direct body-class dependency: all current `sell-*` area pages still include `seller-neighborhood-page` and tier classes.
- Visual dependency should be audited carefully because `area-detail-editorial.css` now owns the visible area-detail system, but tier/body/global selectors in `styles.css` may still influence spacing or fallback modules.

### Shared form section / seller lead form contracts

- `.form-*`, shared form section/shell, seller lead form contract, messages.
- Direct dependencies: `contact.html`, `grand-junction-home-value.html`; potentially any future lead form.
- Overlaps with `editorial-base.css` form primitives and page-specific form CSS.

### Old/transitional homepage styles

- `.page-index .editorial-cover-*`, `.consultation-focus-*`, `.editorial-split__grid`, `.local-market-feature`, `.quiet-cta-card`, and related transitional homepage selectors.
- Current direct dependency appears low because `index.html` uses `editorial-home.css` with `eh-*`; however, `.page-index .editorial-homepage` is present in `styles.css` selector matching and should be treated as a risk area until verified unused selector-by-selector.

## 6. Risky global styles in `styles.css`

### A. Duplicated ownership of header/footer

Risk:

- `styles.css` contains global header/footer compatibility styles while `editorial-base.css` explicitly owns rebuilt `.main-header`, `.nav-menu`, mobile nav presentation, `.main-footer`, and `.footer-grid`.
- Because every page loads `styles.css` before `editorial-base.css`, cascade order currently helps editorial-base win where selectors are similar, but higher-specificity or later-added legacy selectors in `styles.css` could still create conflicts if load order changes or selectors become more specific.

Recommendation:

- Keep load order stable.
- During refactor, move only verified shared rebuilt chrome rules into `editorial-base.css`, then reduce `styles.css` to JS hook and legacy fallback rules.

### B. Broad `.hero*` selectors

Risk:

- Global `.hero`, `.hero-inner`, `.hero-eyebrow`, `.hero-cta`, and centered/support variants can affect any future page that uses intuitive class names like `hero`.
- Current rebuilt pages avoid most direct conflicts by using `eh-*`, `seller-*`, `profile-*`, `home-value-*`, `area-*`, and `li-*` prefixes.

Recommendation:

- Do not create new unscoped `.hero` classes on rebuilt pages.
- When support pages are rebuilt, either scope legacy hero styles or retire them.

### C. Broad `.btn*` selectors

Risk:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-nav`, and related focus/hover rules are global and still heavily used.
- Page files sometimes override `.btn.btn-primary` locally, increasing cascade complexity.

Recommendation:

- Add editorial button variants to `editorial-base.css` and migrate page content CTAs gradually.
- Keep `.btn-nav` and legacy `.btn` for navigation/old pages until migration is complete.

### D. Global `.container` and section utilities

Risk:

- `.container`, `.site-section`, `.section-label`, `.section-intro`, `.section-shell-*`, and spacing utilities can impose legacy spacing/width assumptions on editorial pages if reused accidentally.

Recommendation:

- Prefer `.editorial-shell` and page-family shells in rebuilt files.
- Treat `.container` as legacy/global chrome support, not editorial composition.

### E. Page-family/body selectors

Risk:

- `styles.css` includes body-family selectors like `.page-family-*`, `.seller-neighborhood-page`, and `.tier-*`. These can still affect pages that are otherwise owned by page-family editorial CSS.

Recommendation:

- Audit exact computed usage before deleting.
- Keep body classes as semantic hooks, but reduce visual styling in `styles.css` once page-family CSS owns the visible layout.

### F. Form styles split across three layers

Risk:

- Form styles currently live in `styles.css`, `editorial-base.css`, `contact-editorial.css`, and `home-value-editorial.css`.
- The same classes can be touched by JS (`.form-message`) and by page-specific CSS.

Recommendation:

- Consolidate form message, field, consent, and sheet primitives first.
- Keep contact/home-value composition local.

### G. CTA/dark-band systems competing with editorial closing sections

Risk:

- `styles.css` contains canonical CTA close and dark-band systems, while page-family editorial files define their own closing sections and dark anchor sections.
- This is conceptually duplicated and could encourage generic CTA/card drift.

Recommendation:

- Extract the minimal shared tokens and low-level frame styles, not a universal closing CTA layout.

### H. JS-injected CTA markup relies on legacy classes

Risk:

- `script.js` renders optional `featuredAreasLinks` markup using `.nearby-area-shell`, `.container`, `.nearby-area-links-shell`, `.nearby-area-*`, `.cta-center`, and `.btn btn-primary`.
- This keeps some legacy classes active even if visible pages move toward editorial primitives.

Recommendation:

- Either keep this as non-critical progressive enhancement with legacy styling, or replace the injected markup with raw HTML plus editorial primitives during a future content pass.

## 7. Recommended refactor order

This order minimizes cascade risk and protects the premium/editorial brand standard.

### Phase 0 — Freeze and verify

1. Keep this audit as the baseline map.
2. Do not rename/delete classes yet.
3. Add no new generic `.hero`, `.section`, `.card`, or `.btn` patterns.
4. Before each future refactor, verify raw HTML still contains crawl-critical headings, copy, local context, profile links, contact info, schema, and static footers.

### Phase 1 — Establish ownership boundaries

1. Document load order as intentional: `styles.css` → `editorial-base.css` → page-family CSS.
2. Add comments, if desired in a future code change, marking `styles.css` sections as `global-foundation`, `legacy-support`, or `pending-migration`.
3. Confirm `editorial-base.css` is the only rebuilt owner for header/footer presentation before changing any header/footer rules.

### Phase 2 — Extract low-level primitives only

Move or add shared primitives in this order:

1. Editorial button variants.
2. Eyebrow/kicker variants.
3. Action-link/list primitive.
4. Pull quote / note / caption primitive.
5. Form message/field/sheet refinements.
6. Stat-grid/stat-item primitive.
7. Editorial closing-frame foundation.

Do not extract full page sections yet.

### Phase 3 — Reduce form duplication

1. Normalize `contact.html` and `grand-junction-home-value.html` form markup/styling against `editorial-base.css` form primitives.
2. Keep page-specific composition and density in page CSS.
3. Preserve all fallback/no-JS/contact text in raw HTML.

### Phase 4 — Area-page family cleanup

1. Treat `area-detail-editorial.css` as the area-detail family owner.
2. Verify which `styles.css` neighborhood-framework selectors still affect computed styles.
3. Remove or neutralize only confirmed-unused legacy neighborhood selectors in a future code change.
4. Keep tier body classes as semantic hooks unless a better family contract is introduced.

### Phase 5 — Support-page migration

1. Rebuild or isolate `buy-with-orion.html`, `faq.html`, `privacy.html`, and `404.html` into support-page families.
2. Only then retire legacy `.hero`, `.site-section`, `.section-*`, FAQ, privacy, and CTA close selectors from `styles.css`.
3. Keep buyer page secondary in content hierarchy per brand strategy.

### Phase 6 — Homepage transitional cleanup

1. Verify old `.page-index .editorial-cover-*` and related transitional homepage selectors are unused by `index.html`.
2. Remove or archive those selectors only after selector-level verification.
3. Keep `editorial-home.css` as the homepage owner unless a deliberate homepage redesign occurs.

### Phase 7 — Final shared-base split, optional

If the repo needs cleaner file boundaries later:

1. Split `styles.css` into a small global foundation and a legacy-support file.
2. Keep all pages loading the required legacy file until the last legacy page is migrated.
3. Only after migration, remove legacy file references.

## Crawl-critical and brand-standard validation notes

- This audit does not alter page markup, footer markup, schema, contact information, navigation, or visible design.
- Existing architecture keeps most critical content in HTML, while `script.js` enhances nav state, forms, FAQ interactivity, stats, and optional CTA mounts.
- Future refactors should preserve the static footer rule and avoid JS-only critical content.
- The recommended refactor order intentionally avoids flattening the site into generic cards or cloned section structures.
