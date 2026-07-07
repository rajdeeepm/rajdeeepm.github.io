---
name: Rajdeep Mukherjee Portfolio
description: A dark, cinematic 3D/WebGL portfolio where the build quality is the argument.
colors:
  primary: "#ff2f00"
  secondary-deep-teal: "#003147"
  cursor-blue: "#007fff"
  bg-black: "#000000"
  bg-elevated: "#111111"
  ink-white: "#ffffff"
  gray-900: "#4d4d4d"
  gray-700: "#808080"
  gray-500: "#cccccc"
  gray-100: "#f2f2f2"
  warning: "#f0a712"
  success: "#0dd97e"
typography:
  display:
    fontFamily: "Iskry, Helvetica Neue, sans-serif"
    fontSize: "clamp(150px, 30vw, 400px)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "normal"
  headline:
    fontFamily: "Iskry, Helvetica Neue, sans-serif"
    fontSize: "clamp(52px, 10vw, 125px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Iskry, Helvetica Neue, sans-serif"
    fontSize: "clamp(36px, 6vw, 92px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "Saira Semi Condensed, Helvetica Neue, sans-serif"
    fontSize: "clamp(16px, 2vw, 24px)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Saira Semi Condensed, Helvetica Neue, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  xs: "2px"
  pill: "50%"
spacing:
  unit: "8px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "64px"
  2xl: "112px"
components:
  button-enter:
    backgroundColor: "{colors.bg-black}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.pill}"
    padding: "0"
    size: "150px"
  link-inline:
    textColor: "{colors.ink-white}"
    typography: "{typography.body}"
    padding: "0"
---

# Design System: Rajdeep Mukherjee Portfolio

## 1. Overview

**Creative North Star: "The Instrument Panel"**

This is a dark, cinematic control surface where the interface itself is the proof of competence. Content floats over a fixed near-black WebGL field (`radial-gradient(#000, #111)`) — a 3D scene with a shader-lit figure, lightning strikes, and a camera that travels on a scroll-driven path. The register is **brand**: the design *is* the product. A visitor should feel a "how did they build this?" jolt within seconds, which then resolves into substance (a metric, a venue, a paper). Spectacle is never decoration here; it is the argument that the author can build hard, polished technical things.

The system is loud where it counts and silent everywhere else. Display type is enormous — the hero name renders up to 400px — and set in the bold, uppercase **Iskry** face with tight `0.8` line-height, so headlines read as architecture rather than text. Body copy retreats to the condensed, quiet **Saira Semi Condensed**, letting the numbers and publication venues carry the persuasion. The mouse is replaced by a custom two-stroke cursor with a blue glow; the default OS pointer is forbidden (`cursor: none`). Motion is exponential and decisive — expo / power3 easing, no bounce, no elastic — and a global `prefers-reduced-motion` kill-switch strips every animation for users who ask for it.

This system explicitly rejects the **generic AI-slop template**: no gradient cards, no tiny uppercase tracked eyebrows above every section, no hero-metric templates, no identical icon+heading+text card grids, no gradient text. It also rejects the sterile academic CV page (black-on-white text list, no craft) and the corporate SaaS landing page (navy-and-white, stock illustration, buzzword copy). If a stranger could say "an AI made that" without doubt, it has failed.

**Key Characteristics:**
- Fixed near-black WebGL stage; HTML content scrolls over a living 3D scene.
- Monumental Iskry display type (up to 400px) vs. quiet condensed Saira body.
- Single signal color (`#ff2f00`) used sparingly against black and white.
- Custom glowing cursor; the native pointer is banned.
- Exponential, committed motion — with a mandatory reduced-motion fallback.

## 2. Colors

A monochrome black-to-white cinematic field, punctured by one signal color and a single cool glow.

### Primary
- **Signal Orange-Red** (`#ff2f00`): The one true accent, inherited as the site's committed identity color. Reserved for genuine signal — active/error states, a single point of emphasis. Its rarity against the black field is the entire point; when everything is monochrome, one warm mark commands the eye.

### Secondary
- **Deep Teal-Navy** (`#003147`): A near-submerged cool anchor (`hsl(199 100% 14%)`) for atmospheric depth and rare secondary surfaces. Almost black until you look for it.
- **Cursor Blue** (`#007fff`): Used exclusively as the glow/box-shadow on the custom cursor strokes. It is a lighting effect, not a fill — never paint text or surfaces with it.

### Neutral
- **Void Black** (`#000000`) / **Elevated Black** (`#111111`): The radial-gradient stage. Everything lives on this. `#111` is the faint lift at the gradient's edge.
- **Ink White** (`#ffffff`): Primary reading color and the stroke color for outlined display type on the dark field.
- **Gray Ramp** (`#4d4d4d` → `#808080` → `#cccccc` → `#f2f2f2`): Zero-saturation grays for muted body text, dividers, and de-emphasized labels. On the black stage, muted text must stay near the light end of this ramp to hold contrast.

### Named Rules
**The One Signal Rule.** `#ff2f00` appears on ≤10% of any screen. It is signal, never surface. The moment two unrelated things are orange, the color has stopped meaning anything — pull it back to black, white, or a gray.

**The Glow-Not-Fill Rule.** Cursor Blue (`#007fff`) exists only as light (box-shadow / text-shadow). Filling a shape with it is forbidden.

## 3. Typography

**Display Font:** Iskry (Bold only), with Helvetica Neue / system-sans fallback
**Body Font:** Saira Semi Condensed, with Helvetica Neue / system-sans fallback
**Label Font:** Saira Semi Condensed (bold weight)

**Character:** A hard contrast pairing — a monumental, condensed, all-caps display face against a quiet condensed humanist sans. The two never compete because they never operate at the same scale. Note: only `Iskry-Bold.woff2` ships, so all display weights render bold regardless of the CSS `font-weight`; treat Iskry as a single-weight monument, not a ramp.

### Hierarchy
- **Display** (Iskry, 700, `150px → 400px` responsive, line-height `0.8`, uppercase): The hero name and section monoliths. Deliberately oversized — the scale *is* the brand. Often rendered as an outlined stroke (transparent fill, `-webkit-text-stroke` white) so the 3D scene shows through the letterforms.
- **Headline** (Iskry, 700, `52px → 125px`, line-height `1.1`, uppercase): Section titles ("Works", "About").
- **Title** (Iskry, 700, `36px → 92px`, line-height `1`, uppercase): Sub-section headings and project titles.
- **Body** (Saira Semi Condensed, 500, `16px → 24px`, line-height `1.5`, up to `2` on tablet+): Reading copy. Cap measure at 65–75ch; the condensed face packs more glyphs per line, so err toward the shorter end.
- **Label** (Saira Semi Condensed, 700, `16px`): Metadata — "Role", "Agency", "Completed", nav items.

### Named Rules
**The Monument Rule.** Display type is uppercase Iskry with `0.8`–`1.1` line-height. Never letterspace it wider for "elegance" and never drop it below its scale to be safe; if it doesn't feel slightly too big, it's too small.

**The Outline Window Rule.** When display type sits directly over the 3D scene, prefer the white `-webkit-text-stroke` outline (fill transparent) so the scene reads through the type. This is a signature move, not a default — use it where the scene behind is worth revealing.

## 4. Elevation

This system is **flat and atmospheric**, not shadowed. Depth comes from the real WebGL scene behind the content (parallax, fog, a traveling camera) and from tonal separation on the black field — not from drop-shadows on HTML surfaces. The only `box-shadow` in the interface is the cursor's blue glow, which is a lighting effect rather than elevation. Cards, when they exist, are rendered *in 3D* (the WebGL project cards), so HTML almost never needs a shadow.

### Named Rules
**The No-Shadow-On-Flat Rule.** HTML surfaces cast no drop-shadows. If a UI element needs to feel lifted, it belongs in the 3D scene or it earns separation through contrast and space. The one sanctioned shadow is the cursor glow (`0 2px 16px 2px #007fff`).

## 5. Components

### Buttons
- **Shape:** Circular / pill (`border-radius: 50%`) for the signature CTA; the system avoids rounded rectangles.
- **Enter CTA (signature):** A transparent 150px button whose meaning is carried by five concentric rings of white at graded opacities (`20%`–`80%`), each on its own transform-origin so they drift independently. On load, a ring blinks and scales outward (`@keyframes blink`); on hover the disc fills to `rgba(255,255,255,0.1)`. No fill, no label box — the rings *are* the button.
- **Hover / Focus:** State changes ride expo/power3 easing over ~0.3–0.5s. Every hover needs a visible `:focus-visible` equivalent for keyboard users.

### Links
- **Inline links:** Body-scale Saira, `#ffffff` on the dark field, paired with an external-arrow SVG for outbound destinations. Hover shifts opacity (`--opacity-hover: 0.5`) rather than color. Links drive the custom cursor into its `hover` state via pointer events.

### Cursor (signature, replaces the pointer)
- Two white strokes (rotated `-5deg` / `-55deg`) plus a growing dot, each carrying an inset white highlight and a `#007fff` outer glow. The OS cursor is hidden globally (`cursor: none !important`). A `dark` variant swaps the strokes to black over light surfaces. This is the single most identity-defining component — treat it as a first-class UI element, and ensure a usable experience persists on touch devices (no hover, no custom cursor).

### Navigation
- Uppercase Saira label type; menu toggled by a burger above the fold. Default → hover → active states shift by opacity and weight, not color. On mobile the menu goes full-screen over the scene.

### Cards / Containers
- Primary "cards" are the **WebGL project cards**, generated in Three.js — not HTML. When HTML containers are unavoidable, they are flat: no border, no shadow, separation by space and contrast. Nested cards are forbidden.

## 6. Do's and Don'ts

### Do:
- **Do** keep `#ff2f00` as pure signal — ≤10% of any screen, never a surface fill.
- **Do** set display type in oversized uppercase Iskry with `0.8`–`1.1` line-height; let the scale carry the brand.
- **Do** use the white `-webkit-text-stroke` outline on display type that overlaps the 3D scene, so the scene reads through the letters.
- **Do** ease with the project's exponential curves (`--expo-ease-out`, `--power3-ease-out`); motion should feel decisive, never springy.
- **Do** keep muted body text near the light end of the gray ramp (`#cccccc`+) so it clears 4.5:1 on black.
- **Do** preserve the global `prefers-reduced-motion` kill-switch and keep the `/simple.html` + SR-only content accurate — accessibility is part of this brand, not a bolt-on.

### Don't:
- **Don't** ship the generic AI-slop template: no gradient cards, no tiny uppercase tracked eyebrows above every section, no hero-metric templates, no identical icon+heading+text card grids.
- **Don't** use **gradient text** (`background-clip: text`) anywhere — emphasis comes from scale, weight, or the one signal color.
- **Don't** add drop-shadows to flat HTML surfaces; the only sanctioned shadow is the `#007fff` cursor glow.
- **Don't** fill shapes or paint text with Cursor Blue (`#007fff`) — it is light, not pigment.
- **Don't** let it read like a sterile academic CV (black-on-white list, no craft) or a navy-and-white corporate SaaS landing page.
- **Don't** letterspace display type wider for "elegance," and don't shrink it "to be safe" — the monument scale is deliberate.
- **Don't** nest cards, and don't reach for rounded-rectangle cards when space and contrast would separate content better.
