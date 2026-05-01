# AGENTS.md

## Authority

This file governs AI agent behavior when editing, auditing, or refactoring the Orion Love website.

`README.md` is the source of truth for:

- strategy
- positioning
- page intent
- brand standards
- visual direction
- design philosophy

If any conflict exists, `README.md` overrides `AGENTS.md`.

AGENTS.md exists to enforce that source of truth in code.

---

## Non-Negotiable Brand Standard

This site must not drift toward:

- a generic Realtor website
- a generic SaaS landing page
- a generic local business template
- a lead-capture funnel with real estate copy pasted on top
- a rigid component demo where every section has the same weight

The intended design language is:

- premium local editorial
- Mesa County seller advisor
- calm authority
- magazine-like pacing
- strategic, not salesy
- polished, grounded, and human

Every code, layout, CSS, content, and component decision must support that direction.

If a technically clean change makes the site feel more generic, more templated, louder, flatter, or less editorial, do not make it without calling that out.

---

## AI / SEO Rendering Rule

To protect AI discoverability, SEO visibility, crawlability, trust, and page meaning, all critical information must be visible in the raw HTML response.

- Critical content must be present in raw HTML.
- JavaScript is allowed for enhancements, animations, UI behavior, mobile menu behavior, progressive enhancement, and optional dynamic stats.
- JavaScript must not be the only source for critical content.
- If disabling JavaScript would cause an AI crawler, search engine, scraper, or link preview tool to miss or misunderstand the page, that content belongs in HTML.
- HTML is the source of truth. JavaScript is the enhancement layer.

The following must not be JavaScript-only:

- main headings and body copy
- local service area context
- internal links and navigation
- footer authority/profile links
- contact information
- canonical/meta/Open Graph tags
- JSON-LD structured data
- trust signals, credentials, brokerage info, and verified profile links

### Static Footer Maintenance Rule

The footer is intentionally duplicated in static HTML across all pages so AI crawlers, search engines, scrapers, and non-JS systems can read it directly from the raw HTML source.

If footer content changes, update every footer instance in the same commit. Do not leave partial footer drift across pages.

Do not reintroduce JavaScript footer rendering.

Footer content that must remain present in raw HTML includes:

- Orion Love identity
- Keller Williams Colorado West Realty attribution
- phone and email
- service area language
- internal footer links
- verified profile links
- brokerage/entity/trust signals

Validation requirement:
After any footer edit, verify:

- no page contains `<div id="siteFooter"></div>`
- every HTML page contains `<footer class="main-footer" id="siteFooter">`
- `script.js` does not contain `renderSharedFooter()`
- raw HTML source contains the verified profile links and contact information

Suggested checks:

```bash
rg -n "<div id=\"siteFooter\"></div>" *.html
rg -n "<footer class=\"main-footer\" id=\"siteFooter\"" *.html
rg -n "renderSharedFooter" script.js
rg -n "Google Business Profile|Zillow|Realtor.com|LinkedIn|Keller Williams|mailto:orion.love.co@gmail.com|tel:9706446781" *.html
```

---

## Operational Scope

AGENTS.md enforces implementation behavior. For strategy, positioning, page intent, design philosophy, content hierarchy, and visual target, follow `README.md`.

### Enforcement Priorities

1. Raw HTML source of truth for crawl-critical content.
2. No JavaScript-only critical content.
3. Static HTML footer across pages; never reintroduce `renderSharedFooter()`.
4. Entity clarity: Orion Love, seller representation, Mesa County, Colorado.
5. Mesa County seller-first positioning. Buyers are secondary.
6. Premium local editorial design standard from `README.md`.
7. System-first fixes without creating one-off patches.
8. Visual hierarchy stronger than before the edit.
9. No template drift.

---

## Identity Rule

Every page must clearly answer:

- Who: Orion Love, real estate broker
- What: seller representation
- Where: Mesa County, Colorado

This identity must appear consistently across:

- page copy
- headings
- meta titles and descriptions
- schema markup
- internal links
- footer/entity/trust blocks

No variation in factual identity fields. Natural phrasing may vary in editorial copy.

The identity should be clear without making the page feel stuffed, repetitive, or robotic.

---

## Design System Intent

When editing this site, preserve and strengthen the intended visual identity:

A premium, editorial, seller-first real estate website for Orion Love in Mesa County, Colorado.

The desired feel is:

- local real estate magazine
- trusted seller advisor
- polished but grounded
- strategic, calm, and confident
- not flashy, gimmicky, or generic

Do not redesign pages into generic landing-page patterns.

Do not “clean up” the site into visual sameness.

Do not use technical consistency as an excuse to flatten editorial hierarchy.

---

## Visual Hierarchy Rules

Every page must have clear editorial hierarchy.

Avoid making every section visually equal.

Pages should include a mix of:

- flagship hero moments
- quieter explanatory sections
- editorial feature blocks
- dark navy anchor sections
- concise CTA moments
- selective card grids
- narrow readable text columns
- pull quotes when a line deserves emphasis
- local briefing or guide-style modules

Do not solve every layout problem with another 3-card grid.

Do not make every section follow the same pattern of eyebrow, headline, paragraph, cards, CTA.

Before adding a new module, ask whether the page needs more content or simply stronger hierarchy.

---

## Editorial Layout Direction

Favor editorial layout decisions over generic web templates.

Good patterns:

- asymmetrical hero layouts
- cover-like homepage hero composition
- profile-spread treatment on the About page
- seller-guide pacing on seller and home value pages
- neighborhood-guide pacing on area pages
- narrow text columns for longer copy
- strong spacing between major ideas
- feature sections with one dominant idea
- pull quotes for key positioning lines
- visual rhythm changes between sections
- local guide or briefing-style modules

Avoid:

- repetitive centered sections
- too many equal-weight cards
- cramped mobile spacing
- long walls of paragraph text
- excessive button repetition
- visually identical page sections
- SaaS-style feature grids
- generic real estate website-builder layouts
- decorative dividers between every section
- adding badges, icons, or effects just to fill space

---

## Typography Direction

The site uses a premium editorial type relationship.

- Serif type should carry major headlines and editorial emphasis.
- Sans-serif type should support clarity, labels, navigation, and body structure.
- Headlines should feel intentional, not oversized by accident.
- Avoid generic marketing headline patterns.
- Use short, confident section labels sparingly.
- Do not over-label every section.
- Body copy should remain readable, calm, and spacious.

If the page feels text-heavy, improve pacing before adding more visual noise.

Useful fixes include:

- shorter paragraphs
- pull quotes
- intro decks
- side notes
- feature captions
- better spacing
- stronger section contrast

---

## Color Direction

Preserve the core palette unless `README.md` is intentionally changed:

- Navy: `#0c1a3d`
- Mid Navy: `#16275a`
- Gold: `#b8923a`
- Light Gold: `#d4aa5a`
- Cream: `#f7f4ed`
- Sand: `#e8e1d0`
- Text: `#1a1a2e`
- White: `#ffffff`

Use gold as an accent, not decoration everywhere.

Dark navy sections should feel premium and anchoring, not heavy or overused.

Do not introduce loud colors, gradient-heavy treatments, neon accents, or generic luxury-black-and-gold styling unless explicitly directed.

---

## CTA Rules

CTAs should be clear but not aggressive.

Preferred language includes:

- Start the Conversation
- Request a Seller Briefing
- Get a Clearer Read
- Talk Through the Sale

Avoid:

- Get Started Now
- Sell Fast
- Claim Your Free Offer
- Unlock Your Home Value
- Schedule Now Before It’s Too Late
- generic high-pressure lead-capture language

CTA styling should vary by context:

- hero buttons can be stronger
- mid-page CTAs can be quieter
- closing CTAs can feel like editorial cards
- area pages may use seller-briefing contact cards

Do not repeat the same button treatment too many times on one page.

One primary CTA per page. Secondary actions may exist only when visually subordinate.

---

## Card and Grid Rules

Cards are allowed only when they improve scanning, hierarchy, or meaning.

Cards are not the default solution.

Avoid:

- generic 3-up feature cards
- repeated equal-height boxes
- excessive icon cards
- card grids that make all ideas feel equally important
- using cards to avoid making a real editorial layout decision

Use cards for:

- concise comparison points
- structured process summaries
- related area links
- small factual groupings
- supporting details that should not dominate the page

If a section contains the page’s strongest idea, it probably should not be a generic card grid.

---

## Page-Family Principle

Pages must belong to repeatable families, but not feel cloned.

Each page family should define:

- hero structure
- section order logic
- CTA placement
- shared layout constraints
- reusable components

Within that system, each page still needs controlled variation:

- different section rhythm
- different local insights
- different pull quote or feature moment
- different emphasis based on the page’s purpose

Avoid one-off page construction.

Also avoid clone-like page construction.

System consistency is not visual sameness.

---

## System-First Rule

Always determine whether an issue is system-level or local.

- Fix systems before pages.
- Do not patch repeat issues locally.
- Do not create one-off layout/component patterns when a shared system should exist.
- Do not stack CSS overrides at the end of the file.
- Remove dead or legacy classes when safe.
- Consolidate repeated patterns.
- Preserve factual business information.

A good fix should make future pages easier to maintain without making the current page feel more generic.

---

## CSS and Layout Guardrails

Before finalizing any non-trivial CSS/layout change, verify:

- the change strengthens editorial hierarchy
- spacing remains intentional and consistent with the design system
- no new duplicate component system was introduced
- CTA hierarchy is correct
- layout alignment is consistent
- mobile spacing feels spacious and deliberate
- no visual drift toward generic template design was introduced
- repeated problems were fixed at the system level where appropriate

Do not treat the spacing scale as a reason to make every section identical.

Variation is allowed when it supports editorial rhythm and still feels intentional.

---

## Copy and Visual Relationship

The copy is intentionally calm, strategic, and seller-focused.

Design should support that tone.

Do not make the site look louder than the copy.

Avoid:

- hype-driven visuals
- urgency gimmicks
- overuse of badges
- generic “top agent” styling
- stock real estate tropes
- visual decorations that do not clarify meaning

Favor:

- decision clarity
- local expertise
- calm confidence
- seller strategy
- market perspective
- trust through specificity

If a visual treatment makes the copy feel salesy, replace the treatment.

---

## Required Workflow

For any non-trivial change:

### Before editing

1. Determine whether the issue is system-level or local.
2. List all affected files.
3. Identify the root cause, not just the symptom.
4. Identify whether the change affects crawl-critical content.
5. Identify whether the change affects the visual/editorial brand standard.

### During editing

1. Prefer shared-system fixes over local patches.
2. Preserve raw HTML for critical content.
3. Preserve seller-first Mesa County positioning.
4. Preserve the navy/gold/cream visual system.
5. Avoid adding new component patterns unless truly needed.
6. Strengthen hierarchy before adding content.

### After editing

1. Summarize changes.
2. Explain system-level reasoning, if applicable.
3. List manual validation steps.
4. Confirm crawl-critical content remains in raw HTML.
5. Confirm the page feels at least as premium/editorial as before.

Do not:

- apply local fixes to repeat problems
- introduce overrides instead of structural fixes
- add generic layout modules to solve editorial hierarchy problems
- weaken the brand feel for technical cleanliness

---

## Agent QA Checklist

Before completing any visual/layout change, verify:

- Does this still feel premium and editorial?
- Does this look like Orion Love’s brand, not a generic Realtor template?
- Is the hierarchy stronger than before?
- Is the page easier to scan?
- Did we avoid unnecessary new cards?
- Did we preserve the navy/gold/cream visual system?
- Does mobile still feel spacious and intentional?
- Are CTAs clear without feeling pushy?
- Is the page more trustworthy, not just prettier?
- Is crawl-critical content still visible in raw HTML?
- Did we avoid JavaScript-only critical content?
- Did we avoid creating a one-off system?

If the answer to any of these is no, fix it before final output or explicitly call out why the tradeoff was necessary.

---

## Success Criteria

After any change:

- the codebase is simpler or more coherent
- patterns are easier to maintain
- pages are easier to scale
- design is more editorial and less templated
- visual hierarchy is stronger
- seller-first positioning is clearer
- entity clarity is stronger across the site
- crawl-critical content remains visible in raw HTML

A successful edit should make the site feel more like a premium local seller guide, not merely cleaner code.

---

## Final Standard

The site should feel like:

- a premium local editorial brand
- a Mesa County seller guide
- a calm, confident expert helping a homeowner make a major decision

Not:

- a template
- a generic Realtor site
- a marketing funnel
- a SaaS landing page
- a lead capture system
- a collection of equal-weight cards

When in doubt, choose clarity, hierarchy, local specificity, and editorial restraint.
