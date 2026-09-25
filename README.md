# Orion Love Website: Site Guide

**orionlovehomes.com** · Seller-focused real estate site for Orion Love, Grand Junction and Mesa County, Colorado.

This is the source of truth for strategy, page intent, design and writing. If anything else conflicts with it (a template, a plugin, an agent's default, a generic best practice), this document wins.

| Doc | What it's for |
|---|---|
| `README.md` (this file) | Who the site is for, what each page does, how it should look and read |
| `AGENTS.md` | How to work on the site: workflow, systems, checks. Read before editing |
| `BUSINESS_INFO.md` | Approved facts: name, license, brokerage, contact, profiles. Never improvise these |

*Version 2.0, September 2026.*

---

## 1. Who the site is for

- **Primary:** Mesa County homeowners who are thinking about selling or getting ready to.
- **Secondary:** Homeowners who want a sense of value before committing to anything.
- **Buyers** are welcome (there is a Buyers page) but never the center of the site.

The site has three jobs, in this order:

1. **Be found** by AI assistants, search engines and referrals.
2. **Be trusted**, through clarity, local specificity and visual confidence.
3. **Start a conversation** with Orion. That is the only conversion goal.

## 2. The standard

> A premium local editorial: calm, confident, specific, with the restraint of a magazine feature.

It must not drift toward a generic Realtor template, a lead-capture funnel, a franchise landing page or a SaaS homepage. When deciding anything, ask: **does this feel like a local seller advisor with editorial confidence, or like a website template?** If it's the template, simplify and sharpen the hierarchy.

If a change is technically cleaner but makes the site feel more generic, call that out before making it.

## 3. Honesty rules

These come before style.

- **No fake proof.** No invented reviews, testimonials, statistics or sales history. Orion is newly licensed with no closed sales yet: never write "my clients", "sellers I've helped", "years of experience", "track record" or similar until it is true.
- **Real reviews only**, with the client's permission, once they exist.
- **Only confirmed personal facts.** Orion's background is limited to what's in `BUSINESS_INFO.md`. Ask before adding anything new.
- **Pronouns:** not stated. Use "Orion" or first person ("I"); never "he" or "she".
- **Local facts must be well known and checkable** (e.g. 18 Road trails near Fruita, Colorado National Monument above the Redlands). No invented neighborhood statistics; market numbers come only from the RentCast pipeline.
- **Licensing language:** "Colorado Associate Broker License #FA.100110841", brokerage "Keller Williams Colorado West Realty". Orion is a National Association of Realtors member, so "Realtor" is allowed.

## 4. Findability (AI first, then search)

Every page must make three things obvious, in text a crawler can read without JavaScript:

- **Who:** Orion Love, real estate broker
- **What:** seller representation
- **Where:** Grand Junction and Mesa County, Colorado

Principles:

- **Raw HTML is the source of truth.** Headings, copy, links, footer, contact details, credentials, meta tags and structured data must all be in the HTML. JavaScript may only enhance (menu, animation, live stat refresh).
- **Consistent identity.** Name, phone, email, address, license and brokerage never vary. Wording around them can.
- **Plain, quotable sentences.** AI answers quote sentences, not stat boxes or cards. Where a fact matters (e.g. an area's median price), state it in a full sentence.
- **Every page owns one search intent** (below). Two pages never compete for the same job.
- **Descriptive internal links** (never "click here"); each page links to at least two related pages.
- **Structured data reinforces visible content** and never claims anything the page doesn't show.

| Page | Owns the search | Job |
|---|---|---|
| Home `/` | Grand Junction Realtor for home sellers | Convince a homeowner Orion is the right call before they list |
| Sellers `/sell-with-orion` | How to sell a home in Mesa County | Show that the process removes uncertainty |
| Home Value `/grand-junction-home-value` | What is my home worth in Grand Junction | Get a good value-review request |
| About `/about` | Orion Love, Grand Junction real estate | Turn a researcher into someone who trusts Orion |
| Area guides `/sell-<area>` | Selling a home in [area] | Local seller guidance plus current market numbers |
| Areas `/areas` | Mesa County area guides | Route to the right area guide |
| FAQ `/faq` | Seller questions | Answer real questions plainly |
| Market Briefings `/blog`, `/blog-<slug>` | Timely local market questions | Show current, local judgment |
| Buyers, Contact, Privacy | Supporting pages | |

## 5. Page guidance

**Homepage.** The cover and table of contents of a local seller magazine: editorial cover hero, point of view, feature spread, seller brief, market signals, Area Atlas, closing section with Orion's photo, footer. No "For Buyers / For Sellers" routing grids, no testimonial carousels, one primary action.

**Sellers page.** A seller strategy feature, not a service list: what working with Orion feels like, a few concrete moments, a simple process, a local judgment, a low-pressure consultation invite.

**Home Value page.** A calm value briefing, not a lead trap: what they get, why automated estimates miss local detail, a short form, reassurance (no obligation, response within one business day).

**About page.** Meeting Orion, not reading a résumé. Profile hero, Orion's story in first person (Delta, the valley since 2010, cabinetry, why sellers), grounding details (license, brokerage, profiles), a soft closing invitation.

**Area guides (10 pages).** Neighborhood seller guides, not data dashboards. Four sections: **Hero** (`Selling in <em>Area</em>.` headline, one-line deck, three short tags, a note) → **Market Read** (the area's defining point, photo, stat cards, a one-sentence market summary, source note) → **Local Details** (Orion's first-person rail note, a lead heading, four short paragraphs, a closing line) → **Compare & Continue** (links to two nearby guides, Orion's photo, next steps to Home Value and Contact).
Each guide must have **its own angle** and at least one observation only someone local would make. Read a new or edited guide next to two others: if the insights or sentences are interchangeable, rewrite it.

**Market Briefings.** One local question per post, answered plainly with sourced numbers. Short title (≈60 characters with " | Orion Love").

## 6. Writing

**Voice:** direct, specific, calm, local, practical. First person where Orion is speaking. Say the thing, then stop.

**What made earlier copy read as AI-written. Avoid all of it:**

- The same sentence formula on every page (e.g. "[Area] value depends on [abstract idea]").
- Lists of five or more nouns in one sentence ("garage, storage, parking, yard, condition…"), or making the same point twice.
- Jargon: "buyer lane", "comparison set", "premium positioning", "value legibility", "pocket".
- Leaning on "clear / clearer / clarity" and the "It's not X, it's Y" construction.
- Instructions or notes to the writer leaking into the page.
- A near-duplicate second paragraph that restates the intro.

**Before publishing new copy:** check it against the other pages for repeated phrases and openers (see `AGENTS.md`).

**Banned phrases:** "dedicated to your success", "full-service", "passion for real estate", "going above and beyond", "your dream home" (on seller pages), "sell fast", and any sentence another agent could publish unchanged.

**Calls to action:** calm and specific: "Start the Conversation", "Request a Local Value Review", "Talk Through Your Sale", "Schedule a Seller Consultation". Never "Get Started Now", "Claim Your Free Offer", "Unlock Your Home Value" or urgency tricks. One primary action per page; others visibly secondary.

## 7. Design

**Feel:** editorial magazine pacing, confident negative space, strong type hierarchy, restrained gold, navy anchor sections, local imagery.

**Palette** (don't add colors without a documented reason):

| Navy | Mid Navy | Gold | Light Gold | Cream | Sand | Text | White |
|---|---|---|---|---|---|---|---|
| `#0c1a3d` | `#16275a` | `#b8923a` | `#d4aa5a` | `#f7f4ed` | `#e8e1d0` | `#1a1a2e` | `#ffffff` |

Gold is punctuation, not paint.

**Type:** Cormorant Garamond (serif) for headlines, pull quotes and emphasis; Raleway (sans) for body, labels and navigation. Few labels; headlines sized on purpose.

**Hierarchy:** every page needs dominant moments and quiet ones. Don't make every section equal, don't solve layout problems with another 3-card grid, and don't use cards unless they genuinely help comparison.

**Spacing:** default scale 8 / 16 / 24 / 32 / 48 / 64 / 80px; section padding about 80px desktop and 56px mobile. Variation is fine when it's deliberate and reusable.

**Layout:** alignment is sacred. Columns and headings line up; lists and paired groups start at the same height; decorative background bands must not cut through content (they were removed from area pages for this reason). Asymmetry comes from column balance and imagery, never from misalignment.

**Imagery:** fewer, better photos: landscape, architecture, neighborhood and Orion's portraits. No stock handshakes. Portraits use the shared framed style (gold offset frame, name and brokerage caption) and no photo is repeated across pages.

**Motion:** subtle fade/rise on scroll only. No parallax. Nothing moves unless it adds meaning.

**Mobile:** must feel spacious and deliberate. Test at 320, 375, 768, 1024 and 1280+ px wide. Nothing may overflow sideways or hide behind the fixed header.

## 8. Keeping the site healthy

- **Automatic:** area stats, summary sentences and sitemap dates refresh on the 1st and 15th of each month.
- **Monthly:** publish one Market Briefing (the fresh numbers on the 1st/15th are a natural prompt).
- **Every few months:** review Google Search Console and Cloudflare Web Analytics; reread the area guides for anything out of date.
- **Once a year:** review this guide end to end.

**Before publishing any page, ask:**

1. Does it have one clear job?
2. Could another agent publish it unchanged? If yes, rewrite it.
3. Is every claim true today?
4. Does it say something only a local would know?
5. Does the first screen build trust on a phone?
6. Can a crawler understand it from the raw HTML alone?
