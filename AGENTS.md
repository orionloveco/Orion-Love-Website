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

## Core Directive

This website exists to:

1. Maximize AI discoverability
2. Maximize SEO visibility
3. Convert Mesa County home sellers into conversations

All decisions must support one of these.

---

## Decision Hierarchy (Non-Negotiable)

When tradeoffs exist:

1. AI Discoverability wins
2. SEO comes second
3. Conversion comes last

Do not sacrifice:

* entity clarity
* geographic consistency
* structured information

for improved conversion performance.

---

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

No variation.

---

## Primary Audience

Mesa County homeowners preparing to sell.

Buyers are secondary.
Do not structure pages for buyers.

---

## System-First Rule

Always determine:

* Is this a system issue or a page issue?

Fix systems before pages.

Do not:

* patch problems with CSS overrides
* solve repeat issues locally
* create one-off layout patterns when a shared system should exist

---

## Design Rules

The site must feel:

* editorial
* calm
* structured
* high-trust

Do not:

* use real estate template patterns
* use card grids
* use routing sections ("choose your path")
* create visual clutter

Prefer:

* typography-driven hierarchy
* whitespace
* asymmetric layouts
* clear section intent

---

## Layout Contracts

### Hero

* one message
* one CTA
* no competing subheadlines

### CTA

* one action per page
* same action across site (conversation)
* no competing CTAs

### Sections

* avoid uniform spacing rhythm
* avoid repeated card clusters
* avoid unnecessary containers

---

## SEO Rules

Each page owns exactly ONE search intent.

No duplication.

Every page must include:

* unique `<title>`
* unique meta description
* H1 aligned to intent
* minimum 2 internal links with descriptive anchor text
* appropriate schema markup

---

## AI Discoverability Rules

* NAP must be identical on every page
* geographic terms must appear naturally
* pages must reinforce entity identity
* no page should exist without context

---

## Copy Validation (Strict)

Every page must pass ALL checks below.

### 1. Franchise Test

If a national brokerage could publish this sentence unchanged, rewrite it.

### 2. Specificity Test

Each page must include:

* a real number, OR
* a specific neighborhood, OR
* a real market observation

### 3. Clarity Test

Within 2 seconds, a reader must understand:

* who this is
* what they do
* where they operate

### 4. Tone Check

Copy must be:

* calm
* direct
* specific

Reject:

* hype
* urgency
* filler language

### 5. Local Insight Requirement

All pages must include at least one local-specific observation.

#### Area Pages (Strict Enforcement)

* must include one insight that could only come from local experience
* compare against two other area pages
* if insights are interchangeable, rewrite

#### Homepage & Seller Page

* must include at least one observation an out-of-area agent would not know
* cannot use generic market statements

---

## Code Rules

* do not stack CSS overrides at end of file
* remove dead or legacy classes
* consolidate repeated patterns
* do not introduce duplicate systems (nav, hero, layout, etc.)
* preserve factual business information

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
