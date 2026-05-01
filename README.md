# ORION LOVE WEBSITE SOURCE OF TRUTH
### Grand Junction Real Estate · Seller Specialist · Mesa County, Colorado
**Version 1.3 - Editorial Design Standard. This document governs all site decisions. When in doubt, return here.**

---

## Non-Negotiable Brand Standard

This site must not drift toward a generic Realtor website, generic SaaS landing page, local-business template, or lead-capture funnel.

The intended design language is:

- Premium local editorial
- Mesa County seller advisor
- Calm authority
- Magazine-like pacing
- Strategic, not salesy
- Polished, grounded, and human

Every code, layout, copy, SEO, schema, or performance decision must support that direction.

If a change makes the site technically cleaner but visually more generic, call it out before making it.

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
After any footer edit, verify the static footer exists on every page, JavaScript footer rendering has not been reintroduced, and raw HTML still contains profile links plus contact information.

Use AGENTS.md for exact validation commands.

---

# PART ONE: STRATEGIC FOUNDATION

## Who This Site Is For

**Primary audience:** Homeowners in Mesa County, Colorado who are preparing to sell or actively considering it.

**Secondary audience:** Homeowners who want to understand their home's value before committing to anything.

**Not the audience:** Buyers. Buyers are acknowledged, not centered.

## What This Site Must Do

1. Be found by AI assistants, search engines, and direct referrals.
2. Build immediate trust through clarity, local specificity, and visual confidence.
3. Create one action: a conversation with Orion Love.

Everything on this site serves one of those purposes. If it does not, it does not belong.

---

## The North Star: Editorial Seller Authority

> The site should feel like a premium local real estate editorial: calm, confident, specific, and designed with the restraint of a magazine feature.

It should not feel like:

- a generic Realtor template
- a lead capture machine
- a franchise landing page
- a SaaS homepage
- a portfolio site
- a directory of services

When making any design or copy decision, ask:

**Does this feel like a local seller advisor with editorial confidence, or does this feel like a website template?**

If it feels like a template, simplify it, sharpen the hierarchy, and make the layout more intentional.

---

# PART TWO: DISCOVERABILITY HIERARCHY

## Priority Order

| Priority | Type | Why |
|----------|------|-----|
| 1 | AI Discoverability | AI assistants now answer questions like "who is the best Realtor in Grand Junction for sellers" directly. This site must be clear enough to be cited. |
| 2 | SEO Discoverability | Google still sends high-intent traffic. Structure must be clean, crawlable, and intentional. |
| 3 | Editorial Trust | Visual hierarchy, local insight, and calm authority must make the site feel worth believing. |
| 4 | Conversion | A well-structured, trustworthy site converts naturally. Conversion tactics come last. |

**Principle:** Clarity first. Editorial authority second. Cleverness last.

A page can be beautiful and still fail if it is unclear. A page can be clear and still fail if it feels generic.

---

## AI Discoverability

AI language models surface authoritative, structured, geographically consistent information. This site must answer these questions unambiguously on every page:

- **Who:** Orion Love, real estate broker
- **Where:** Grand Junction and Mesa County, Colorado
- **What:** Residential home sales and seller representation
- **Why him:** Pricing strategy, local market knowledge, seller preparation guidance, and clear decision-making support

### Implementation Requirements

**NAP Consistency (Name, Address, Phone)**
The exact same name, phone number, email, license/brokerage details, and brokerage attribution must appear consistently across the site. Natural phrasing may vary in page copy, but factual identity fields should not drift.

**Geographic Repetition**
Use "Grand Junction," "Mesa County," and specific neighborhood names naturally throughout copy. AI models and search engines weight geographic specificity heavily.

**Explicit Page Relationships**
Each page should link to at least two related pages with descriptive anchor text. Avoid "click here." Internal links should make the site architecture obvious to humans, crawlers, and AI systems.

**Structured Data (Schema.org)**
Required where page-appropriate:

- `Person` schema for Orion Love
- `RealEstateAgent` schema with stable entity ID
- `LocalBusiness` or brokerage/entity reference where appropriate
- `BreadcrumbList` on interior pages
- `FAQPage` where the page actually contains FAQ content

Schema must reinforce, not conflict with, visible page content.

---

## SEO Discoverability

### Page-Level Keyword Ownership

Each page owns one primary search intent. No two pages should compete for the same job.

| Page | Primary Keyword | Search Intent |
|------|----------------|---------------|
| Homepage | Grand Junction Realtor for home sellers | Who to hire |
| Seller Page | How to sell a home in Mesa County | How it works |
| Home Value Page | What is my home worth in Grand Junction | Self-research |
| About Page | Orion Love Grand Junction real estate | Trust/vetting |
| Area Pages | Selling a home in [Neighborhood] | Local specificity |

### Technical SEO Checklist (Per Page)

- [ ] Unique `<title>` tag, ideally 60 characters or fewer
- [ ] Unique meta description, ideally 155 characters or fewer
- [ ] Canonical tag pointing to the preferred clean URL
- [ ] Open Graph image, 1200 x 630px when available
- [ ] H1 clearly represents the page intent naturally
- [ ] No duplicate page intent across the site
- [ ] Crawl-critical content present in raw HTML

---

## Entity Reinforcement Rule

AI systems build authority by encountering the same entity definition repeatedly and consistently across the site. Variation weakens it. Consistency strengthens it.

Every page must reinforce this identity:

> **Orion Love** is a real estate broker specializing in **home sellers** in **Mesa County, Colorado**.

This must appear naturally in:

- Page copy
- Headings where appropriate
- Meta titles and descriptions
- Schema markup
- Internal link anchor text
- Footer and contact areas

This is not keyword stuffing. It is entity clarity.

**The test:** Read any page in isolation. Within the first two seconds, a visitor or crawler should understand who Orion is, what he does, and where he works.

---

# PART TWO-AND-A-HALF: APPROVED PAGE-BY-PAGE REBUILD WORKFLOW

## Approved Page-by-Page Rebuild Workflow

When executing major redesigns, use this workflow to preserve brand quality, crawlability, and implementation discipline:

1. Rebuild one page at a time.
2. Create or approve a visual mockup before implementation begins for that page.
3. Once approved, the mockup becomes the page-level design source of truth.
4. Implement only that page before moving to another page.
5. Preserve SEO and crawl-critical infrastructure during every rebuild, including schema, canonical tags, metadata, raw HTML content, static navigation, static footer, NAP consistency, brokerage/license details, verified profile links, and crawl-critical internal links.
6. Test the rebuilt page visually across desktop, tablet, and mobile before proceeding to the next page.
7. Do not generalize newly introduced patterns across other pages until that page family is intentionally approved.
8. Legacy page content may be rewritten to fit an approved editorial layout.
9. Do not weaken an approved layout to preserve old copy order, old section structure, or outdated page modules.

---

# PART THREE: PAGE ARCHITECTURE

## Homepage

**One job:** Convince a Mesa County homeowner that Orion Love is the right person to call before they list.

**Editorial role:** The homepage should feel like the cover and table of contents of a local seller magazine, not a directory, generic landing page, or stuffed module page.

**Approved structure:**

1. **Editorial Cover Hero**
2. **Point of View Spread**
3. **Feature Image Spread**
4. **Seller Brief**
5. **Market Reality / Signal Section**
6. **Area Atlas**
7. **Closing CTA**
8. **Quiet Footer**

**Rules:**

- No routing grids such as "For Buyers / For Sellers / For Investors."
- The Area Atlas is allowed because it supports local seller context and internal site architecture, not generic routing.
- No testimonial carousels.
- No unnecessary card clusters.
- No competing hero CTAs.
- Hero message must be written for a seller, not a general visitor.
- The first screen should feel like an editorial cover, not a generic landing page.
- The approved homepage mockup controls layout; rewrite content to fit it instead of forcing legacy content into the design.

---

## Seller Page

**One job:** Make a homeowner feel confident that Orion's process removes uncertainty.

**Editorial role:** This page should feel like a seller strategy feature, not a service list.

**Preferred structure:**

1. **Seller Intro** - What working with Orion actually feels like. Emotional clarity before process details.
2. **Feature Statement / Pull Quote** - One strong line that captures the seller problem in plain language.
3. **The Experience** - Two or three concrete moments in the process, written narratively.
4. **Process** - Three steps, labeled simply, with short explanations.
5. **Local Judgment** - A specific claim about Mesa County pricing, prep, or buyer behavior.
6. **CTA** - Consultation framed as low-commitment and practical.

**Rules:**

- No framework-heavy language.
- No long numbered feature lists.
- No vague trust statements.
- Avoid turning every idea into a card.
- Use pull quotes, narrow columns, and visual pacing to prevent long article fatigue.
- Copy should pass this test: could a national franchise write this exact sentence? If yes, rewrite it.

---

## Home Value Page

**One job:** Capture a high-quality consultation request from a motivated seller.

**Editorial role:** This page should feel like a premium intake and value briefing, not a lead-generation trap.

**Preferred structure:**

1. **Headline** - Specific, calm, confident.
2. **What You Get** - Three outcomes, not feature bullets.
3. **Why Estimates Fail** - One short, local explanation of why automated estimates miss Mesa County nuance.
4. **Form** - Address, name, contact. Keep it simple.
5. **Reassurance** - No obligation, no spam, clear response expectation.

**Tone:** Simple. Calm. Confident.

**SEO note:** This page may use FAQ schema when the visible page includes matching FAQ content about valuation accuracy in Grand Junction and Mesa County.

---

## About Page

**One job:** Convert a researching homeowner into a trusting one.

**Editorial role:** The About page should feel like a profile feature, not a LinkedIn bio.

**Preferred structure:**

1. **Profile Hero** - Positioning statement, portrait or strong visual, and immediate seller/local context.
2. **Why This Way** - The reasoning behind the seller-first approach. Specific and personal, not rehearsed.
3. **Client Experience** - What working together feels like from the client's perspective.
4. **Grounding** - Brokerage, license, service area, verified profiles, and local context.
5. **CTA** - Soft, conversational, and seller-focused.

**Rules:**

- No third-person bio language in first-person sections.
- No generic credential dump.
- No mission statements.
- Use visual trust signals without making the page feel like a resume.
- The page should feel like meeting Orion, not reading a profile page.

---

## Area Pages

**One job:** Rank for local seller searches while demonstrating genuine local knowledge.

**Editorial role:** Area pages should feel like neighborhood seller guides, not data dashboards.

**Preferred structure:**

1. **Hero** - Area name, seller-focused headline, and local identity.
2. **At-a-Glance Briefing** - A concise stat or market snapshot strip when useful, visually subordinate to the story.
3. **Area Positioning** - What makes this market distinct.
4. **Value Drivers** - Two or three specific factors that affect home prices there.
5. **Buyer Behavior** - Who is buying there and why that matters for sellers.
6. **Sell Strategy** - What sellers should know about timing, pricing, prep, or presentation.
7. **CTA** - Area-specific and calm.
8. **Nearby Areas** - Internal links to adjacent area pages.

**The one-insight rule:** Every area page must contain at least one observation that could only come from someone who understands that area locally.

**Clone prevention:** Before publishing any area page, read it alongside two others. If the insights are interchangeable, it fails.

**Stats rule:** Stats should support the local story. Do not let data modules become the page's first impression unless the visual design makes them feel like an editorial briefing.

---

# PART FOUR: DESIGN SYSTEM

## Design Philosophy

This site should feel like an editorial brand that happens to sell homes. It should be calm, typographic, considered, and locally grounded.

The goal is not merely to look clean. The goal is to feel like a premium Mesa County seller briefing: useful, composed, specific, and worth trusting.

Every design decision should widen the distance between this site and a franchise real estate template.

---

## Editorial Visual Direction

The visual goal is:

- editorial magazine pacing
- confident negative space
- strong typographic hierarchy
- calm, premium color usage
- local Mesa County specificity
- seller-first clarity
- polished but not flashy
- refined, grounded, and human

The site should feel more like a thoughtful seller guide or local market briefing than a lead-capture template.

Avoid:

- generic SaaS-style section stacking
- overused card grids
- excessive centered text
- loud marketing language
- cluttered CTAs
- template-looking Realtor design
- unnecessary visual effects
- weak hierarchy where every section has the same weight

Favor:

- asymmetrical layouts where appropriate
- feature-spread sections
- editorial pull quotes
- restrained gold accents
- dark navy anchor sections
- large serif headlines
- short supporting copy
- clear seller decision framing
- purposeful use of imagery and whitespace

---

## Visual Hierarchy Rules

Every page should have a clear editorial rhythm.

A strong page usually includes:

- one flagship hero or cover moment
- one or two feature-spread sections
- quieter explanatory sections
- one dark navy anchor section when useful
- concise CTA moments
- selective card grids only when the content truly needs comparison

Avoid making every section visually equal.

Do not solve every layout problem with another 3-card grid.

---

## Spacing System

Use a consistent spacing scale as the default:

- 8
- 16
- 24
- 32
- 48
- 64
- 80

These values should govern most margins, gaps, and padding.

Editorial variation is allowed when it creates intentional hierarchy, but one-off spacing must be rare, documented in CSS, and reusable if it becomes a pattern.

### Section Padding

Baseline section padding:

- Desktop: 80px top/bottom
- Mobile: 56px top/bottom

Variation is allowed for:

- hero / cover moments
- closing CTA sections
- feature-spread sections
- compact utility sections

Variation must look intentional, not accidental.

---

## Layout Structure

Use consistent layout wrappers for site stability.

Asymmetry should be achieved through:

- content arrangement
- column balance
- image placement
- typographic scale
- contrast between dense and open sections

Do not achieve asymmetry by breaking alignment, using random spacing, or creating one-off wrappers.

Good patterns:

- asymmetrical hero layouts
- text/image editorial splits
- narrow readable text columns
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
- visual sameness from page to page

---

## Card Usage

Cards are allowed when they serve comparison, grouping, or scannability.

Avoid:

- repetitive identical card grids
- generic 3-up feature boxes
- card clusters used only to fill space
- cards with equal visual weight when one idea matters more

Use:

- structured content blocks
- editorial feature cards
- short comparison modules
- clear hierarchy between primary and secondary cards

If a section can be stronger as a pull quote, split layout, or editorial note, do not default to cards.

---

## Typography

| Role | Style | Notes |
|------|-------|-------|
| Headlines | Serif, editorial, confident | Carries permanence and authority |
| Subheadings | Serif or light sans | Avoid heavy startup-style sans headers |
| Body | Clean sans-serif | Legible, restrained, unobtrusive |
| Labels / Tags | Small caps or tracked sans | Sparse use only |
| Pull Quotes | Serif, oversized or distinct | Use for core positioning lines |

**Rules:**

- Serif type should carry major headlines and editorial emphasis.
- Sans-serif type should support clarity, navigation, labels, and body structure.
- Headlines should feel intentional, not oversized by accident.
- Use fewer labels, not more.
- Avoid generic marketing headline patterns.
- Copy should be tighter than it feels necessary, then cut again.
- No sentence should be doing two jobs.

---

## Color

Core palette:

| Role | Color |
|------|-------|
| Navy | `#0c1a3d` |
| Mid Navy | `#16275a` |
| Gold | `#b8923a` |
| Light Gold | `#d4aa5a` |
| Cream | `#f7f4ed` |
| Sand | `#e8e1d0` |
| Text | `#1a1a2e` |
| White | `#ffffff` |

**Rules:**

- Gold is punctuation, not paint.
- Use gold as an accent, not decoration everywhere.
- Dark navy sections should feel premium and anchoring, not heavy or overused.
- Cream and sand backgrounds should create warmth without looking beige or flat.
- Do not introduce new brand colors without a documented reason.

---

## Imagery

- Fewer images, higher quality.
- Consistent color grading across all photos.
- No stock photography of strangers shaking hands.
- Landscape, architectural, neighborhood, detail, and profile photography are preferred.
- Images should establish place, confidence, and editorial tone.
- Images should not feel like filler.

For the magazine feel, imagery should function like an editorial spread or location note, not decoration.

---

## Motion

- Subtle entrance animations on scroll are acceptable.
- Use opacity and slight upward movement only.
- No parallax effects.
- No hover animations on body text.
- CTAs may have a gentle hover state.
- Nothing should move unless it adds clarity.

Do not let animation create crawler, accessibility, or layout timing problems.

---

## CTA Hierarchy

Each page should have one primary action.

Preferred CTA language includes:

- Start the Conversation
- Request a Seller Briefing
- Get a Clearer Read
- Talk Through the Sale

Avoid:

- Get Started Now
- Sell Fast
- Claim Your Free Offer
- Unlock Your Home Value
- generic high-pressure lead-capture language

CTA styling should vary by context:

- Hero CTAs can be stronger.
- Mid-page CTAs can be quieter.
- Closing CTAs can feel like editorial cards.
- Avoid repeating the same button treatment too many times on one page.

---

## Copy and Visual Relationship

The copy is intentionally calm, strategic, and seller-focused.

Design should support that tone.

Do not make the site look louder than the copy.

Avoid:

- hype-driven visuals
- urgency gimmicks
- overuse of badges
- generic "top agent" styling
- stock real estate tropes

Favor:

- decision clarity
- local expertise
- calm confidence
- seller strategy
- market perspective

---

# PART FIVE: COPY STANDARDS

## Voice

Orion's copy voice is:

- **Direct** - Says the thing, then stops.
- **Specific** - Uses real neighborhoods, real observations, and grounded market context.
- **Calm** - Never urgent, never salesy.
- **Local** - Speaks to Mesa County homeowners, not a national audience.
- **Strategic** - Helps sellers make better decisions before they list.

## Trust Without Hype

This site builds trust through:

- **Process clarity** - Explaining what happens and why.
- **Local specificity** - Observations no out-of-area agent could make.
- **Deliverables** - Concrete outputs such as pricing analysis, prep guidance, and timeline planning.
- **Grounded language** - No superlatives, no vague promises.
- **Visual restraint** - The design should feel confident enough not to shout.

**Banned phrases:**

- "dedicated to your success"
- "full-service"
- "passion for real estate"
- "going above and beyond"
- "your dream home" on seller pages
- "sell fast" as a primary promise
- any sentence that could appear on another agent's website unchanged

---

# PART SIX: TECHNICAL REQUIREMENTS

## Per-Page Checklist

- [ ] Unique `<title>` and meta description
- [ ] Canonical tag
- [ ] OG image when available
- [ ] H1 clearly represents primary keyword naturally
- [ ] At least two internal links with descriptive anchor text
- [ ] Schema markup with page-appropriate type
- [ ] NAP in footer matches sitewide standard exactly
- [ ] Critical content visible in raw HTML
- [ ] Visual hierarchy supports the page's one job
- [ ] Page does not feel like a generic template

## Sitewide Requirements

- [ ] Consistent NAP in footer on every page
- [ ] Crawl-critical content present in raw HTML
- [ ] `Person` + `RealEstateAgent` identity reinforced consistently
- [ ] XML sitemap present and valid
- [ ] robots.txt configured
- [ ] Core Web Vitals passing on mobile when possible
- [ ] No broken internal links
- [ ] Google Search Console verified

Shared JavaScript renderers may be used for visual consistency, but crawl-critical content must also exist in raw HTML or another crawler-visible static source. Do not assume AI crawlers will execute script.js.

---

# PART SEVEN: BUILD RULES

These rules override vendor defaults, templates, agent assumptions, and personal preference:

1. **No routing-first design.** The homepage is not a directory.
2. **No duplicated intent.** Two pages cannot own the same keyword or purpose.
3. **No fake proof.** No purchased reviews, inflated stats, or vague authority claims.
4. **No template feel.** If it looks like it came from a real estate website builder, redesign it.
5. **One primary action per page.** Secondary actions are allowed only when visually subordinate.
6. **Sellers dominate.** Every key page speaks to a seller first. Buyers are secondary.
7. **The one-insight rule.** Every area page must include something only a local expert would know.
8. **Copy before design.** Page structure is determined by what needs to be said, not by what fills a layout.
   - For approved page redesigns, an approved visual mockup may become the page-level source of truth. In that case, copy should be rewritten to fit the approved editorial structure rather than forcing legacy copy into the new layout.
9. **Hierarchy before polish.** Make the page easier to understand before making it prettier.
10. **Editorial rhythm before module count.** Fewer, stronger sections beat more generic sections.
11. **Do not add cards by default.** Use cards only when they improve comprehension.
12. **Do not make every section equal.** Strong pages have dominant moments and quiet supporting moments.

---

# PART EIGHT: AGENT QA CHECKLIST

Before completing any visual, layout, CSS, or page-structure change, verify:

- Does this still feel premium and editorial?
- Does this look like Orion Love's brand, not a generic Realtor template?
- Is the hierarchy stronger than before?
- Is the page easier to scan?
- Did we avoid unnecessary new cards?
- Did we preserve the navy, gold, cream, and serif editorial system?
- Does mobile still feel spacious and intentional?
- Are CTAs clear without feeling pushy?
- Is the page more trustworthy, not just prettier?
- Is critical content still present in raw HTML?
- Did we avoid JS-only rendering for crawl-critical content?

If a change improves technical cleanliness but weakens the brand feel, do not make it without calling that out.

---

# APPENDIX: QUICK REFERENCE

## Target Pages

- [ ] Homepage
- [ ] Seller Page
- [ ] Home Value Page
- [ ] About Page
- [ ] Area Pages
- [ ] Contact Page
- [ ] FAQ Page

## Content Maintenance

To sustain and grow AI and SEO discoverability:

- **Monthly:** Publish or update one local market observation, seller insight, or market update.
- **Quarterly:** Audit area pages and update insights that are no longer current.
- **Annually:** Full README review covering strategy, keywords, schema, design direction, and page architecture.

## Questions to Ask Before Publishing Any Page

1. Does this page have one clear job?
2. Could a national franchise publish this page unchanged? If yes, rewrite it.
3. Is there at least one observation only a local expert would know?
4. Is the CTA clear and consistent with the rest of the site?
5. Does the copy feel calm and confident, or eager and salesy?
6. Does the layout feel editorial and intentional, or modular and generic?
7. Does the page create trust within the first screen?
8. Can a crawler understand the critical content from raw HTML?

---

*This document is the authority. If a vendor, designer, plugin, agent, or generic best practice conflicts with it, this document wins.*
