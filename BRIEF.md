# BRIEF.md — Business Site Template

> Self-authored under explicit creative delegation.
> User provided: inspiration site (foresee-inky.vercel.app) + Hormozi conversion framework.
> All decisions below are authored in the brand's voice with that mandate.

---

## 1. Vibe

Three to five words: **Confident. Capable. Night-shift serious.**

References (not websites):
- A McKinsey slide deck rebuilt by an independent studio: precision without sterility
- A Leica camera product page: dark, warm, nothing wasted
- The Foresee site provided by the user: scroll-driven reveals, dark ground, professional B2B

---

## 2. The Scroll Journey

In the visitor's words:

1. Land on a hero that feels like a result, not a pitch
2. See the numbers — real, not inflated
3. Feel the problem named exactly as they experience it
4. Swipe through the services and recognise what they need
5. Read three steps and think "that's surprisingly simple"
6. Hear from three people who looked like them before they worked with this company
7. Get their last objection answered quietly
8. Hit a button they actually want to press

---

## 3. Energy Curve

- Hero: calm confidence — like arriving somewhere you already knew was right
- Stats: steady, grounding
- Pain: rises sharply — discomfort, recognition, the tightening feeling of "yes, that's me"
- Services: opens up — breadth, relief
- Process: calm again — simplicity is the message
- Reviews: warm, building — trust accumulating
- FAQ: quiet — final resistance dissolving
- Close: forward momentum — not urgent, not aggressive, just obvious

---

## 4. Feeling Curve + Peak

| Act | Intended Emotion | What Causes It |
|---|---|---|
| Hero (pin) | Recognition, desire | A hero that shows the outcome, not the process. The dashboard card shows the revenue they want. |
| Stats (flow) | Validation, grounding | Real numbers that prove others have done it |
| Pain (pin) | Discomfort → relief | Lines that name the problem better than the visitor could |
| Services (pan) | Relief, breadth | Lateral travel = options; each card names a benefit, not a feature |
| Process (flow) | Confidence, simplicity | Three steps. That's all. |
| Reviews (pin) | Trust, recognition | Real people, specific outcomes, one sentence that sounds like them |
| FAQ (flow) | Clarity, last-mile ease | Objections answered before they are voiced |
| Close (pin) | Momentum, action | Spotlight + WhatsApp + guarantee. Nothing to lose. |

**The peak is Act 3 — Pain.** It has the largest pinned span (2.8vh). The act before it (Stats) is calm and flat, setting up the contrast. The moment: when the third line lands and the visitor thinks "that's exactly what's happening to me." The turn line that follows is the relief.

**The tell-someone sentence:** "It's the site where — as you scroll — you realise they've described your problem better than you ever could, and by the time you reach the button you're already half-convinced before you've even read the pitch."

---

## 5. Signature Move

**The Value Ledger** — a thin fixed panel on the right viewport edge, invisible until the visitor passes the Pain section. As they pass each key section (Pain, Services, Process, Reviews, FAQ), a benefit line stamps into the panel: "Problem identified", "Full growth system", "Live in 14 days", "200+ businesses transformed", "90-day guarantee". By the close the panel holds a compact ledger of the entire argument. Clicking the toggle expands it to a full column. Driven by bespoke JS reading `getBoundingClientRect()` scroll milestones against section anchors — not by `--sc-p`, not by any kit device. The panel does not belong to any act; it outlives all of them.

---

## 6. Aesthetic Range

**Professional editorial** — between premium-minimal and editorial. Dark ground. One warm accent (amber-orange `#E0793C`). Clean sans-serif display face (Outfit). No glow, no gradient text, no AI-purple. The darkness reads as seriousness; the amber reads as warmth and action. A service business owner at 11pm making a real decision.

---

## 7. Grammar: Filmic One-Shot

**Why not the other seven:**
- Chaptered editorial: no long-form substance, this is a sales argument not a manifesto
- Live surface: no software product to demonstrate
- Continuous world: no physical geography or journey with stages
- Typographic poster: needs proof, photos, social validation — not type-only
- Gallery/catalog: visitor's question is "should I believe you", not "what are the options"
- Split stage: could work for pain/solution comparison but can't carry the 8-section Hormozi arc
- Rhythmic cutlist: trust-building needs dwell time; cutting at speed undoes reviews and FAQ

**Why filmic one-shot:** this is a single linear sales argument with one emotional arc. The visitor should feel *carried* through pain → proof → solution → action. No jumping, no tools, no chapters. One film.

---

## 8. Assets

None. Fully CSS-generated world. No KIE_AI_API_KEY.

The hero uses three CSS parallax planes: a fine grid layer (business graph aesthetic, referencing Foresee), an ambient radial glow (warm amber), and a CSS-drawn business metrics card (dashboard aesthetic, no fake data). This is a template — real businesses will swap in their own photography.

---

## Act Score

| Beat (Hormozi) | Device | Span | Why |
|---|---|---|---|
| Hero / Above Fold | `pin` + `parallax` + `kinetic` | 2.5vh | No video; layered CSS planes give dimensional depth without clip |
| Stats (Visual proof #1) | `flow` + `count` | natural | Separates hero pin from pain pin; grounding band |
| Pain (PAS) | `pin` + `kinetic` | 2.8vh | Largest span = the peak; crossfading lines name the problem |
| Services | `pan` | 4.0vh | Lateral travel = breadth; ~1.5vh per card is right for 5 items |
| Process (How it works) | `flow` + `in` | natural | 3-step section; staggered entrance |
| Reviews (Wall of proof) | `pin` | 2.5vh | Testimonials crossfade; trust accumulates |
| FAQ | `flow` + `in` | natural | Quiet section; objections answered |
| Close | `pin` + `spotlight` + `magnet` | 1.25vh | Standard commit close; WhatsApp primary per LATAM guidance |

**Device sequence:** pin → flow → pin → pan → flow → pin → flow → pin

Device families: `pin`, `pan`, `flow`+`in`, `parallax`, `kinetic`, `count` = 6 families ✓
No device twice in a row ✓ (pin and flow alternate; no adjacent same family)
At most two scrub acts: 0 scrub acts (no video assets) ✓
Peak has largest span ✓ (2.8vh vs 2.5 for hero and reviews)

---

## Fingerprint Gate

Registry is empty (first build). Gate passes trivially.

Row to append after ship:

| Grammar | Nav | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|
| Filmic one-shot | Fixed minimal bar, wordmark + one CTA | pin + parallax + kinetic (CSS planes, no video) | pin→flow→pin→pan→flow→pin→flow→pin, 8 acts, ~13.1vh | pin + spotlight + magnet, WhatsApp primary + calendar CTA | Value Ledger: fixed right-rail panel stamps benefit lines on section entry, expands on click | Dark amber-orange, Outfit/system-ui, CSS-only hero | localhost:4500 |
