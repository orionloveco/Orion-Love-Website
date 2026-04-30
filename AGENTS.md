# AGENTS.md

## Authority

This file governs AI agent behavior.

README.md is the source of truth for:

* strategy
* positioning
* page intent
* design philosophy

If any conflict exists:
README.md overrides AGENTS.md.

---

## AI / SEO Rendering Rule

To protect AI discoverability, SEO visibility, crawlability, trust, and page meaning, all critical information must be visible in the raw HTML response.

- Critical content must be present in raw HTML.
- JavaScript is allowed for enhancements, animations, UI behavior, mobile menu behavior, progressive enhancement, and optional dynamic stats.
- JavaScript must not be the only source for critical content.
- If disabling JavaScript would cause an AI crawler, search engine, scraper, or link preview tool to miss or misunderstand the page, that content belongs in HTML.
- HTML is the source of truth. JavaScript is the enhancement layer.

The following must not be JavaScript-only:
- Main headings and body copy
- Local service area context
- Internal links and navigation
- Footer authority/profile links
- Contact information
- Canonical/meta/Open Graph tags
- JSON-LD structured data
- Trust signals, credentials, brokerage info, and verified profile links

### Static Footer Maintenance Rule

The footer is intentionally duplicated in static HTML across all pages so AI crawlers, search engines, scrapers, and non-JS systems can read it directly from the raw HTML source.

If footer content changes, update every footer instance in the same commit. Do not leave partial footer drift across pages.

Do not reintroduce JavaScript footer rendering.

Footer content that must remain present in raw HTML includes:

- Orion Love identity
- Keller Williams Colorado West Realty attribution
- Phone and email
- Service area language
- Internal footer links
- Verified profile links
- Brokerage/entity/trust signals

Validation requirement:
After any footer edit, verify:

- No page contains <div id="siteFooter"></div>
- Every HTML page contains <footer class="main-footer" id="siteFooter">
- script.js does not contain renderSharedFooter()
- Raw HTML source contains the verified profile links and contact information

Suggested checks:

```bash
rg -n "<div id=\"siteFooter\"></div>" *.html
rg -n "<footer class=\"main-footer\" id=\"siteFooter\"" *.html
rg -n "renderSharedFooter" script.js
rg -n "Google Business Profile|Zillow|Realtor.com|LinkedIn|Keller Williams|mailto:orion.love.co@gmail.com|tel:9706446781" *.html
```

---

## Operational Scope

AGENTS.md enforces implementation behavior. For strategy, positioning, page intent, and design philosophy, follow README.md.

### Non-Negotiable Enforcement Priorities

1. Raw HTML source of truth for crawl-critical content
2. No JavaScript-only critical content
3. Static HTML footer across pages; never reintroduce `renderSharedFooter()`
4. Entity clarity: Orion Love, seller representation, Mesa County, Colorado
5. Mesa County seller-first positioning (buyers are secondary)
6. Design system discipline from README.md
7. System-first fixes (no one-off systems, no template feel)

## Identity (Non-Negotiable)

Every page must clearly answer:

* Who: Orion Love, real estate broker
* What: Seller representation
* Where: Mesa County, Colorado

This identity must appear consistently across:

* page copy
* headings
* meta titles and descriptions
* schema markup
* internal links

No variation in factual identity fields. Natural phrasing may vary in page copy.

## System-First Rule

Always determine whether the issue is system-level or local.

* Fix systems before pages
* Do not patch repeat issues locally
* Do not create one-off layout/component patterns when a shared system should exist

## System Compliance Check (Required)

Before finalizing any non-trivial change, agents must verify:

* spacing uses only approved values from README.md
* no new component systems were introduced
* CTA hierarchy is correct
* layout alignment is consistent
* no visual drift was introduced

If violations exist, the agent must fix them before output.

---

## Code Rules

* do not stack CSS overrides at end of file
* remove dead or legacy classes
* consolidate repeated patterns
* do not introduce duplicate systems (nav, hero, layout, etc.)
* preserve factual business information

### JavaScript Rendering Guardrail

Shared JavaScript renderers may be used for visual consistency, but crawl-critical content must also exist in raw HTML or another crawler-visible static source. Do not assume AI crawlers will execute script.js.

---

## Required Workflow (Enforced)

For any non-trivial change:

### Before editing

1. determine if issue is system-level or local
2. list all affected files
3. identify root cause (not just symptom)

### After editing

1. summarize changes
2. explain system-level reasoning (if applicable)
3. list manual validation steps

Do not:

* apply local fixes to repeat problems
* introduce overrides instead of structural fixes

---

## Success Criteria

After any change:

* the codebase is simpler
* patterns are more consistent
* pages are easier to scale
* design is more editorial and less templated
* entity clarity is stronger across the site

---

## Page-Family Principle

Pages must belong to repeatable families.

Each family must define:

* hero structure
* section order
* CTA placement
* layout system

Avoid one-off page construction.

---

## Final Standard

The site should feel like:

a calm, confident expert guiding a homeowner through a major decision

Not:

* a template
* a marketing funnel
* a lead capture system
