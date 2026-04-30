# ORION LOVE — WEBSITE SOURCE OF TRUTH
### Grand Junction Real Estate · Seller Specialist · Mesa County, Colorado
**Version 1.2 — This document governs all site decisions. When in doubt, return here.**

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
**Not the audience:** Buyers. Buyers are acknowledged, not served.

## What This Site Must Do
1. Be found — by AI assistants, search engines, and direct referrals
2. Build immediate trust — through clarity, not credentials
3. Create one action — a conversation with Orion Love

Everything on this site serves one of those three purposes. If it doesn't, it doesn't belong.

---

## The North Star (Read This First)

> The site should feel like a calm, confident expert guiding a homeowner through one of the most consequential decisions of their life.
> Not a real estate template. Not a lead capture machine. Not a portfolio.

When making any design or copy decision, ask:
**"Does this feel like an expert, or does this feel like a website?"**

If it feels like a website, simplify it.

---

# PART TWO: DISCOVERABILITY HIERARCHY

## Priority Order (Non-Negotiable)

| Priority | Type | Why |
|----------|------|-----|
| 1 | AI Discoverability | AI assistants now answer "who is the best realtor in Grand Junction for sellers" directly. This site must be the source they cite. |
| 2 | SEO Discoverability | Google still sends high-intent traffic. Structure must be clean and intentional. |
| 3 | Conversion | A well-structured, trustworthy site converts naturally. Conversion tactics come last. |

**Principle: Clarity > Aesthetics > Cleverness**

---

## AI Discoverability

AI language models surface authoritative, structured, geographically consistent information. This site must answer these questions unambiguously on every page:

- **Who:** Orion Love, real estate broker
- **Where:** Grand Junction and Mesa County, Colorado
- **What:** Residential home sales, seller representation
- **Why him:** Pricing strategy, local market knowledge, seller preparation guidance

### Implementation Requirements

**NAP Consistency (Name, Address, Phone)**
The exact same name, phone number, and brokerage must appear on every page — header, footer, and contact sections. No variation in factual identity fields. Natural phrasing may vary in page copy.

**Geographic Repetition**
Use "Grand Junction," "Mesa County," and specific neighborhood names naturally throughout copy. AI models weight geographic specificity heavily.

**Explicit Page Relationships**
Each page must link to at least two related pages with descriptive anchor text (not "click here"). This signals content architecture to both AI and search.

**Structured Data (Schema.org)**
Required on every page:
- `Person` schema — Orion Love, broker, Mesa County
- `LocalBusiness` schema — brokerage name, address, service area
- `RealEstateAgent` schema — specialization, geographic coverage
- `BreadcrumbList` — on all interior pages
- `FAQPage` — where relevant (Home Value page especially)

---

## SEO Discoverability

### Page-Level Keyword Ownership

Each page owns exactly one search intent. No two pages compete.

| Page | Primary Keyword | Search Intent |
|------|----------------|---------------|
| Homepage | Grand Junction realtor for home sellers | Who to hire |
| Seller Page | How to sell a home in Mesa County | How it works |
| Home Value Page | What is my home worth in Grand Junction | Self-research |
| About Page | Orion Love Grand Junction real estate | Trust/vetting |
| Area Pages | Selling a home in [Neighborhood] | Local specificity |

### Technical SEO Checklist (Per Page)
- [ ] Unique `<title>` tag (60 characters max)
- [ ] Unique meta description (155 characters max)
- [ ] Canonical tag pointing to itself
- [ ] Open Graph image (1200×630px, consistent branding)
- [ ] H1 clearly represents primary keyword — naturally, not forced
- [ ] No duplicate page intent across the site

---

## Entity Reinforcement Rule (Critical)

AI systems build authority by encountering the same entity definition repeatedly and consistently across an entire site. Variation weakens it. Repetition creates it.

Every page must reinforce this identity:

> **Orion Love** is a real estate broker specializing in **home sellers** in **Mesa County, Colorado**.

This must appear — naturally — in:
- Page copy
- Headings (at least once per page)
- Meta titles and descriptions
- Schema markup
- Internal link anchor text

This is not about stuffing a phrase. It's about never letting a page exist in isolation from the core identity. A visitor — or an AI — landing on any page should be able to answer: *who is this, what do they do, and where?* within the first two seconds.

**The test:** Read any page in isolation. If the answer to those three questions isn't immediate, the page needs revision.

---

# PART THREE: PAGE ARCHITECTURE

## Homepage

**One job:** Convince a Mesa County homeowner that Orion Love is the right person to call before they list.

**Structure:**
1. **Hero** — One statement. One CTA. No subheadings competing with it.
2. **Differentiation** — Editorial split: why sellers choose Orion specifically (not generically)
3. **Process** — Three steps: Price / Prepare / Execute. No more.
4. **Local Insight** — One specific, real market observation. Not a generic market update.
5. **CTA** — Repeat the one action. Different phrasing, same destination.

**Rules:**
- No routing grids ("For Buyers / For Sellers / For Investors")
- No testimonial carousels
- No card clusters
- No competing CTAs
- Hero message must be written for a seller, not a general visitor

---

## Seller Page

**One job:** Make a homeowner feel confident that Orion's process removes uncertainty.

**Structure:**
1. **Seller Intro** — What working with Orion actually feels like (emotional before logical)
2. **The Experience** — Two or three concrete moments in the process, written narratively
3. **Process** — Three steps, labeled simply, with one-sentence explanations
4. **Local Judgment** — A specific claim about Mesa County pricing or buyer behavior that only someone local would know
5. **CTA** — Consultation framed as low-commitment ("Let's talk about your home")

**Rules:**
- No framework-heavy language ("synergistic approach," "full-service experience")
- No numbered lists of features
- No vague trust statements ("dedicated to your success")
- Copy should pass this test: *could a national franchise write this exact sentence?* If yes, rewrite it.

---

## Home Value Page

**One job:** Capture a high-quality consultation request from a motivated seller.

**Structure:**
1. **Headline** — Specific, calm, confident ("Know what your home is actually worth")
2. **What You Get** — Three deliverables, written as outcomes not features
3. **Why Estimates Fail** — One short section explaining why Zillow/Redfin miss Mesa County nuance
4. **Form** — Address, name, contact. Nothing else.
5. **Reassurance** — Below the form: no obligation, no spam, response time

**Tone:** Simple. Calm. Confident. This page should feel like a premium intake form, not a lead gen trap.

**SEO note:** This page should have an FAQ schema block answering: "How accurate is Zillow in Grand Junction?" and "How do I find out what my home is worth in Mesa County?"

---

## About Page

**One job:** Convert a researching homeowner into a trusting one.

**Structure:**
1. **Positioning Statement** — What Orion does and who he does it for. First sentence, no preamble.
2. **Why This Way** — The reasoning behind the seller-first approach. Specific, personal, not rehearsed.
3. **Client Experience** — What working together actually looks like, written from the client's perspective
4. **Grounding** — Local and professional context (years in Mesa County, brokerage, market knowledge)
5. **CTA** — Soft: "If you're thinking about selling, let's have a conversation."

**Rules:**
- No third-person bio language in a first-person section
- No credential lists ("licensed in Colorado since...")
- No mission statements
- The page should feel like meeting someone, not reading a LinkedIn profile

---

## Area Pages

**One job:** Rank for "[Neighborhood] home seller" searches while demonstrating genuine local knowledge.

**Structure:**
1. **Hero** — Area name, seller-focused headline
2. **Area Positioning** — What makes this neighborhood's real estate market distinct
3. **Value Drivers** — Two or three specific factors that affect home prices here (not generic)
4. **Buyer Behavior** — Who is buying in this area and why (informs seller strategy)
5. **Sell Strategy** — What a seller specifically needs to know about timing, pricing, or prep in this area
6. **CTA** — Area-specific ("Selling in Redlands? Let's talk.")
7. **Nearby Areas** — Internal links to adjacent area pages

**The one-insight rule:** Every area page must contain at least one observation that could only come from someone who has sold homes there. If it reads like it was written from a Wikipedia article, rewrite it.

**Clone prevention:** Before publishing any area page, read it alongside two others. If the structure is identical and the insights are interchangeable, it fails.

---

# PART FOUR: DESIGN SYSTEM

## Design Philosophy

This site does not look like a real estate website. It looks like an editorial brand that happens to sell homes — calm, typographic, considered. Every design decision should widen the distance between this site and a franchise template.

---

## Implementation Rules (Non-Negotiable)

The design philosophy defines how the site should feel.
These rules define how it must be built.

### Spacing System
Only the following spacing values are allowed:
8, 16, 24, 32, 48, 64, 80

No arbitrary spacing values.

### Section Padding
Desktop: 80px top/bottom
Mobile: 56px top/bottom

All sections must align to this baseline before variation is applied.

### Layout Structure
All sections must use consistent layout wrappers.

Asymmetry is achieved through:
- content arrangement
- column balance
- image placement

NOT by breaking spacing or alignment rules.

### Card Usage
Card systems are allowed when used intentionally.

Avoid:
- repetitive, identical card grids
- generic “3-up feature box” layouts

Use:
- structured content blocks
- consistent spacing
- clear hierarchy

### CTA Hierarchy
Each page must include:
- one primary CTA
- optional secondary actions that are visually subordinate

Primary CTAs must:
- be visually dominant
- have clear surrounding space
- stand out from secondary actions

### Section Rhythm
Section density may vary, but spacing values must always come from the defined scale.

Variation does not mean randomness.

### System Consistency Rule
Do not introduce:
- new spacing systems
- new layout patterns
- one-off components

If a new pattern is required:
- define it once
- reuse it consistently

---

## Typography

| Role | Style | Notes |
|------|-------|-------|
| Headlines | Serif — weighted, editorial | Conveys permanence and authority |
| Subheadings | Serif or lightweight sans | Never bold sans — too "startup" |
| Body | Clean sans-serif | Legible, unobtrusive |
| Labels / Tags | Small caps or tracked sans | Sparse use only |

**Rules:**
- Fewer labels, not more
- Copy should be tighter than it feels necessary — then cut 20% more
- No sentence should be doing two jobs

---

## Color

| Role | Color |
|------|-------|
| Primary | Deep navy |
| Background | Warm cream / off-white |
| Accent | Muted gold — used sparingly, never decoratively |
| Text | Near-black on cream; cream on navy |

**Gold is a punctuation mark, not a paint color.** One use per section maximum.

---

## Layout

**Use:**
- Editorial splits (text left, image right — or reversed with intent)
- Asymmetric composition
- Variable section density (dense, then open, then dense — not uniform)
- Structured layouts with intentional variation and strong hierarchy
- Large, unhurried hero spacing
- Generous whitespace around key statements

**Never use:**
- Generic, repetitive card grids
- Boxed layouts with equal padding
- Routing modules ("Choose your path")
- Rigid, template-like uniform layouts
- Dividers between every section

---

## Imagery

- Fewer images, higher quality
- Consistent color grading across all photos
- No stock photography of strangers shaking hands
- Landscape and architectural photography preferred
- Images should establish place, not demonstrate activity

---

## Motion

- Subtle entrance animations on scroll (opacity + slight upward movement)
- No parallax effects
- No hover animations on text
- CTAs may have a gentle hover state
- Nothing should move unless it adds clarity

---

# PART FIVE: COPY STANDARDS

## Voice

Orion's copy voice is:
- **Direct** — Says the thing, then stops
- **Specific** — Uses real numbers, real neighborhoods, real observations
- **Calm** — Never urgent, never salesy
- **Local** — Speaks to Mesa County homeowners, not a national audience

## Trust Without Testimonials

This site builds trust through:
- **Process clarity** — Explaining exactly what happens and when
- **Local specificity** — Observations no out-of-area agent could make
- **Deliverables** — Concrete outputs (pricing analysis, prep guidance, timeline)
- **Grounded language** — No superlatives, no vague promises

**Banned phrases:**
- "dedicated to your success"
- "full-service"
- "passion for real estate"
- "going above and beyond"
- "your dream home" (this is a seller site)
- Any sentence that could appear on another agent's website unchanged

---

# PART SIX: TECHNICAL REQUIREMENTS

## Per-Page Checklist
- [ ] Unique `<title>` and meta description
- [ ] Canonical tag
- [ ] OG image (1200×630)
- [ ] H1 clearly represents primary keyword — naturally, not forced
- [ ] At least two internal links with descriptive anchor text
- [ ] Schema markup (page-appropriate type)
- [ ] NAP in footer matches sitewide standard exactly

## Sitewide Requirements
- [ ] Consistent NAP in footer on every page

Shared JavaScript renderers may be used for visual consistency, but crawl-critical content must also exist in raw HTML or another crawler-visible static source. Do not assume AI crawlers will execute script.js.
- [ ] `Person` + `LocalBusiness` + `RealEstateAgent` schema on homepage
- [ ] XML sitemap
- [ ] robots.txt configured
- [ ] Page speed: Core Web Vitals passing on mobile
- [ ] No broken internal links
- [ ] Google Search Console verified

---

# PART SEVEN: BUILD RULES

These rules override any vendor, template, or personal preference:

1. **No routing-first design.** The homepage is not a directory.
2. **No duplicated intent.** Two pages cannot own the same keyword or purpose.
3. **No fake proof.** No purchased reviews, inflated stats, or vague authority claims.
4. **No template feel.** If it looks like it came from a real estate website builder, redesign it.
5. **One primary CTA per page.** Secondary actions are allowed only when visually subordinate. Never two primary actions competing.
6. **Sellers dominate.** Every key page speaks to a seller first. Buyers are not ignored — they are secondary.
7. **The one-insight rule.** Every area page, every local claim must contain something only a local expert would know.
8. **Copy before design.** Page structure is determined by what needs to be said, not by what looks balanced.

---

# APPENDIX: QUICK REFERENCE

## Target Pages at Launch
- [ ] Homepage
- [ ] Seller Page
- [ ] Home Value Page
- [ ] About Page
- [ ] Area Pages (minimum 4 at launch — prioritize highest search volume areas)
- [ ] Contact Page (minimal — name, phone, form)

## Content Maintenance (Post-Launch)
To sustain and grow AI and SEO discoverability:
- **Monthly:** One local market observation published as a short page or post
- **Quarterly:** Area page audit — update any insight that is no longer current
- **Annually:** Full README review — strategy, keywords, schema

## Questions to Ask Before Publishing Any Page
1. Does this page have one clear job?
2. Could a national franchise publish this page unchanged? (If yes — rewrite)
3. Is there at least one observation only a local expert would know?
4. Is the CTA the same action as every other page?
5. Does the copy feel calm and confident, or eager and salesy?

---

*This document is the authority. If a vendor, designer, or plugin conflicts with it — this document wins.*
