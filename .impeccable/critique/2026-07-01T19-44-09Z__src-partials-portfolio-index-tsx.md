---
target: Portfolio surface (src/partials/Portfolio)
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-07-01T19-44-09Z
slug: src-partials-portfolio-index-tsx
---
⚠️ DEGRADED: single-context (harness policy: sub-agents not spawned without explicit user request)

# Critique — Portfolio surface (`src/partials/Portfolio/index.tsx` + `index.module.css`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No in-section cue that 400vh of scroll-driven content exists; global load progress only |
| 2 | Match System / Real World | 3 | "Works" / "Research & Projects" read clearly |
| 3 | User Control and Freedom | 2 | No way to jump to a specific project; long scroll-choreographed section |
| 4 | Consistency and Standards | 3 | Consistent with site's cinematic system |
| 5 | Error Prevention | 3 | Few error surfaces here |
| 6 | Recognition Rather Than Recall | 2 | 9 projects surfaced only as transient 3D cards; no persistent visible label list |
| 7 | Flexibility and Efficiency | 2 | No skip-to-project, unclear keyboard path to WebGL cards |
| 8 | Aesthetic and Minimalist Design | 4 | Genuinely strong, non-templated, cinematic |
| 9 | Error Recovery | 3 | n/a mostly |
| 10 | Help and Documentation | 2 | Scroll CTA helps; otherwise none |
| **Total** | | **26/40** | **Acceptable — top-tier aesthetics, real gaps in content-resilience & discoverability** |

## Anti-Patterns Verdict

**LLM assessment:** This does NOT read as AI-generated. It sidesteps every slop tell in DESIGN.md — no gradient text, no uppercase eyebrows, no hero-metric template, no identical card grid. The oversized Iskry hierarchy with per-character SplitText reveals and deliberately misaligned lines is authored, not scaffolded. Aesthetically this is the strongest kind of portfolio surface.

**Deterministic scan:** `detect.mjs` on the Portfolio markup returned `[]` (exit 0) — zero anti-pattern hits. Agrees with the LLM read.

**Visual overlays:** Skipped — dev server not running and no browser injection attempted this pass. No user-visible overlay exists.

## Overall Impression
The craft is excellent and on-brand. The single biggest risk is not aesthetics but **resilience**: the entire project showcase — the actual substance a recruiter or admissions reader came for — is rendered exclusively in WebGL, with the text equivalent hidden in an SR-only (visually clipped) block. If WebGL fails or is slow, a sighted visitor sees headings and an empty container where the 9 projects should be.

## What's Working
- **The SR-only project list is a genuine win.** Full structured project data (name, org, period, outcome, publication links, tags, highlights, bullets) is exposed to screen readers and crawlers even though the visual cards are WebGL (invisible to both). This is exactly the "accessibility is part of the brand" principle in practice.
- **Aesthetic/minimalist (heuristic 8 = 4).** Nothing decorative competes; the monumental type and 3D cards carry it. Detector-clean.
- **On-brand motion.** Character-level reveals on `power3-ease-in-out` match the DESIGN.md "exponential, decisive motion" doctrine.

## Priority Issues

- **[P1] Core content is gated entirely on WebGL.** The 9 projects render only into `#card-container` (WebGL) and an SR-only block clipped with `clip: rect(0,0,0,0)`. A sighted user with WebGL disabled/failed/low-end sees no projects at all.
  - **Why it matters:** The projects are the whole reason both target audiences (research + industry) visit. Losing them silently is a P1 conversion failure, not a cosmetic one.
  - **Fix:** Render a visible, styled fallback list of the projects when WebGL is unavailable (reuse the `projectDetails` data already imported), or surface the `/simple.html` route prominently on WebGL failure. The data is already there; only a visible presentation is missing.
  - **Suggested command:** `/impeccable harden`

- **[P1] Section headings hide content until a class-triggered reveal fires.** On desktop, `.char { transform: translate3d(0,100%,0) }` inside `overflow:hidden` `.line`, revealed only when `.isVisible` (inView + scroll) is added. If the reveal never fires (hidden tab, headless render, inView miss), the headings ship blank. This is the exact anti-pattern DESIGN.md warns about: "reveal animations must enhance an already-visible default."
  - **Why it matters:** Blank section titles on desktop for any visitor whose IntersectionObserver doesn't fire; also weakens SEO/first-paint.
  - **Fix:** Make the un-revealed state visible by default and let the animation enhance it (animate from a visible baseline, or gate the transform behind the reveal class rather than gating visibility on it).
  - **Suggested command:** `/impeccable animate`

- **[P2] Nine projects have no persistent, scannable index.** They appear as transient 3D cards across ~400vh of scroll; a visitor can't see all titles at once or jump to one. Recognition-over-recall (heuristic 6 = 2) suffers, and Alex/Casey personas will miss projects.
  - **Why it matters:** Recruiters skim; if project #7 only exists at a specific scroll depth with no map, it's effectively invisible.
  - **Fix:** Add a lightweight visible project index / progress affordance, or anchor navigation to jump between projects.
  - **Suggested command:** `/impeccable layout`

- **[P2] `pointer-events: none` on the whole section + clipped SR list creates a focus/interaction gray zone.** Publication links live only in the visually-clipped SR block; keyboard focus can land on clipped, invisible links (no visible focus), and the section root disables pointer events wholesale.
  - **Why it matters:** Sam (keyboard/AT) persona can tab into invisible links with no focus indicator.
  - **Fix:** Ensure focusable links in the SR block get a visible focus treatment (or use a "visually-hidden-until-focused" pattern), and confirm intended interactive elements re-enable pointer events.
  - **Suggested command:** `/impeccable audit`

## Persona Red Flags

**Sam (Accessibility-Dependent):** SR list is strong, BUT publication/anchor links inside a `clip: rect(0,0,0,0)` block can receive keyboard focus while invisible — no visible focus indicator. WebGL cards have no obvious keyboard equivalent for sighted-keyboard users.

**Casey (Distracted Mobile):** On mobile the SplitText reveal is skipped (good), but the project cards still depend on WebGL performance on a phone; heavy 3D on a slow connection risks the projects never painting. State/scroll depth for "which projects seen" isn't preserved.

**Project-specific — "Dr. Mehta (Admissions reader)":** Wants publications and rigor fast. The publication links exist only in the hidden SR block, not as visible, clickable affordances on the visual cards — a motivated human reader can't click through to ICCCN/EdgeSP papers without the screen reader or the simple view.

## Minor Observations
- `@for $i from 1 to 35` caps the stagger at 35 chars; characters beyond 35 snap in without a transition (rare, long headings only).
- `.video { display: none }` and the removed-video comments are dead scaffolding worth deleting.
- Section is `400vh` tall on desktop with a `200vh` card container — verify the camera-path choreography degrades gracefully if `scroll` never enables.

## Questions to Consider
- What does a visitor with WebGL off actually see here — and is that acceptable for the people you most want to reach?
- Should the publication links be visible, clickable affordances on the cards themselves, not just in the accessible layer?
- Would a persistent project index make the 9 projects feel less like a scroll lottery?
