# fable_work — session log & playbook

A record of a working session on this portfolio (Claude **Fable 5**, July 2026), written so a
future model can reproduce the *approach*, not just the result. It covers what was asked, how the
codebase was investigated, the reasoning behind each fix, the dead ends and how they were escaped,
how the work was verified in a real browser, and how it shipped.

Read this top-to-bottom before touching the Works cards, the About headings, `simple.html`, or the
deploy flow. The **Gotchas** section at the end is the highest-value part — it is the list of things
that will waste your time if you rediscover them the hard way.

---

## 0. The mental model to start from

This site is a fork of Giulio Collesei's **folio-2022** Three.js template, re-skinned and
re-contented for Rajdeep Mukherjee (AI Researcher & Engineer). The thesis, stated in `PRODUCT.md`
and `DESIGN.md`, is **"the build quality is the argument"** — the site itself is proof the author
can build hard, polished technical things. The design system is called **"The Instrument Panel"**:
a fixed near-black WebGL stage (`radial-gradient(#000,#111)`), monumental uppercase **Iskry**
display type, quiet condensed **Saira Semi Condensed** body, exactly **one** signal color
(`#ff2f00`, ≤10% of any screen), a custom glowing cursor replacing the OS pointer, and exponential
(expo/power3) motion with a `prefers-reduced-motion` kill-switch.

**Before you design or redesign anything here, read `DESIGN.md` and `PRODUCT.md` in full, and load
the `impeccable` skill** (`.claude/skills/impeccable`). It routes on the project's `brand` register
and enforces the anti-slop rules this site lives by. Two rules bit us and will bite you:
no numbered `01/02/03` section eyebrows as default scaffolding, and glassmorphism is allowed *only*
when purposeful — which, for the Works cards, it genuinely is.

Tech stack: React 18 + TypeScript, Three.js + custom GLSL, GSAP, Redux (Rematch), Vite, PostCSS,
i18next (all copy lives in `public/locales/en/*.json`, not in components). Deploy target is GitHub
Pages at `rajdeeepm.github.io`.

---

## 1. What the user asked for (four tasks)

1. **Glass cards.** The black cards in the Works section should look like Apple's glass display —
   glossy black, translucent, light passing through.
2. **Selectable / searchable text.** Card text could not be found with Ctrl+F and behaved like an
   image. Make it real, readable, selectable text.
3. **About "My journey".** The "My journey" line was invisible — text far too small.
4. **Simple view.** `public/simple.html` was too basic. Make it outstanding, on-brand.

Plus an implicit fifth: verify precisely, then (later turns) preview and ship.

---

## 2. Investigation approach (do this first, always)

The winning move was **read before touching**. Concretely:

1. Mapped the tree (`ls`, `find src public -type f`), read `DESIGN.md`, `PRODUCT.md`, `README.md`,
   `package.json`, `settings.ts`, `vite.config.ts`, `.postcssrc.js`.
2. Read the four partials (`Hero`, `Portfolio`, `About`, `Contact`) and `components/App` to learn
   the section order and how content flows from i18n.
3. For each task, traced to the **root cause** rather than the symptom:
   - **Cards**: opened `Experience/world/Portfolio.ts` and
     `Experience/utils/projectCardGenerator.ts`. Discovered the cards are **canvas textures painted
     with `ctx.fillText` onto a `THREE.CanvasTexture`**, mapped onto `PlaneGeometry` in WebGL. That
     is *why* Ctrl+F and text selection can't touch them — there is no DOM text. This single finding
     collapsed tasks 1 and 2 into one job: replace the WebGL cards with real HTML.
   - **About heading**: found `about.intro.1` (a long sentence) was being rendered inside a
     `<Heading>` slot. `components/Heading` runs `useTextFit`, which calls `textfit` to *shrink text
     to fit one line* up to `maxFontSize: 400`. A 20-word sentence in a monument slot collapses to
     microscopic. Root cause: wrong content in a display slot, not a CSS size bug.
   - **Simple view**: read `public/simple.html` + `simple.css`. Functional but generic — didn't
     carry the brand at all.
4. Read the design tokens (`styles/config/*.css`: colors, typography, spacing, easing, custom-media)
   so new CSS used the project's variables (`--color-primary`, `--fs-display-1`, `--power3-ease-out`,
   `--md-l`, `rgb(var(--color-whiteRGB) / a)`) instead of inventing values.

**Lesson:** the biggest leverage came from understanding that the cards were canvas, not DOM. If you
skip the investigation and just restyle, you will fail task 2 entirely.

---

## 3. What was built, and why

### Task 1 + 2 — HTML glass cards (`src/components/ProjectCards/`)

New component: `ProjectCards/index.tsx` + `index.module.css`. It **replaces** the WebGL card system
(which is switched off via `showPortfolio = false` in `src/settings.ts`) while reusing the exact same
data source, `projectDetails` from `Experience/utils/projectCardGenerator.ts`, so content never forks.

Design decisions:

- **Glossy black glass = real backdrop sampling.** `backdrop-filter: blur(26px) saturate(160%)
  brightness(1.08)` over the live WebGL scene, layered under a dark translucent fill
  (`rgb(10 11 14 / 0.46)`) plus a top-to-bottom white→black gradient. This is the same mechanism
  Apple's glass uses — it samples and blurs what's behind, so the moving 3D figure genuinely shows
  through. Two pseudo-elements add craft: `::before` is a specular top-light
  (`radial-gradient` + `mix-blend-mode: screen`); `::after` is a diagonal glare that translates on
  hover. Edge realism via `box-shadow: inset` highlights (no drop shadow — DESIGN.md's
  no-shadow-on-flat rule). Glass here is *purposeful*, satisfying the impeccable skill's bar.
- **Real, selectable, searchable text.** Everything is DOM: `<h3>`, `<p>`, chips as `<li>`, bullets
  via `dangerouslySetInnerHTML` (the data contains `<strong>` markup). Ctrl+F now finds it.
- **Scroll-driven horizontal ride, preserved.** A tall `.runway` (450vh desktop) holds a pinned
  `.viewport` that contains a `.track` of cards. A `requestAnimationFrame` loop reads the runway's
  `getBoundingClientRect()`, computes 0→1 progress, and lerps the track's `translateX` — smooth,
  matching the old WebGL feel. Reduced-motion snaps instead of lerping.
- **Click-to-flip front/back.** Each card has a `.faces` wrapper with a front and back face stacked
  in one grid cell; a GSAP timeline scales the wrapper to `scaleX: 0`, swaps `aria-hidden` at the
  midpoint, scales back. A single pinned `.flipBtn` (absolute, bottom, gradient scrim) is always
  visible above the scrolling face content. Front summary = name, org/period, hero outcome, chips,
  three highlight tiles. Back = detailed bullets + publication link.
- **Preserved brand behaviors.** Hover plays a random bell (`/audio/bell{1..4}.mp3` via Howler,
  respecting `state.audio.mute`), sets the custom cursor to its `hover` state via
  `dispatch.pointer.setType`, and reveals cards with an IntersectionObserver on enter. `cursor: none`
  is kept on the flip button so the custom cursor is never broken.
- **A11y:** hidden face's interactive controls get `tabIndex={-1}`; `aria-expanded` on the flip
  button; `aria-hidden` toggled per face.

Wired into `src/partials/Portfolio/index.tsx` by rendering `<ProjectCards />` inside the existing
`#card-container`. The old screen-reader-only duplicate `<ul>` block in that partial was removed —
the visible cards are now real text, so the SR duplicate is redundant.

### Task 3 — About "My journey" (`public/locales/en/translation.json`)

No component change. In `about.intro`, inserted a short display string `"My<br />journey"` as the new
`intro[1]` (which flows into the `<Heading>` monument slot) and pushed the long sentence down into
the body-copy array where `ContentBlock` renders it at readable body size. The heading now renders
full-size Iskry; the sentence is legible. **The fix was content placement, not CSS.**

### Task 4 — Simple view (`public/simple.html` + `public/simple.css`)

Full rewrite in the Instrument Panel language, still **zero JavaScript**:

- Monument masthead: `RAJDEEP` as an outlined `-webkit-text-stroke` word over a filled `MUKHERJEE`
  — the site's signature "outline window" move, in pure CSS.
- Black radial stage, one signal orange, hairline-ruled section panels, Iskry headings, Saira body.
- **Full content parity** with the interactive site: all 9 projects with metric chips and
  expandable `<details>` full bullets, publications with DOIs, experience, teaching, awards, skills,
  monumental email in contact.
- `<details>` for project depth is deliberate: Chrome auto-expands a `<details>` when Ctrl+F matches
  text inside it, so the "searchable" property holds even for collapsed content.
- WCAG AA contrast on the dark surface, keyboard/focus-visible styles, `prefers-reduced-motion`
  branch, and a `@media print` block that inverts to black-on-white for a clean printed CV.

**Impeccable-skill correction applied mid-session:** the first simple.html draft used `01 / 02 / 03`
numbered section eyebrows. The brand register's anti-slop rules ban numbered markers as default
scaffolding, so they were stripped from both the HTML and the CSS.

---

## 4. Trials, dead ends, and how they were escaped

These are the things that cost time. Future models: expect them.

1. **`position: sticky` silently does nothing.** The first card layout pinned the viewport with
   `position: sticky; top: 0`. It never stuck. Cause: the global
   `html, body { overflow-x: hidden }` in `src/styles/global/index.css` establishes a scroll
   container that defeats sticky in Chromium. **Fix:** drop sticky; pin the viewport by writing
   `translate3d(0, pinY, 0)` in the same rAF loop that drives the horizontal track, where
   `pinY = clamp(-runwayRect.top, 0, total)`. Diagnosed by dumping computed geometry
   (`getBoundingClientRect`, `getComputedStyle`) via Playwright `browser_evaluate`.
2. **Flip did nothing at first.** The GSAP flip animated `cardRefs` (the outer `<article>` that also
   holds the pinned button), so scaling it collapsed the button too and state didn't read cleanly.
   **Fix:** introduce a dedicated `.faces` wrapper (`facesRefs`) and animate *that*, leaving the
   pinned button outside the transform.
3. **The flip button rendered per-face and doubled up.** Initial markup put a footer button inside
   both faces; they overlapped. **Fix:** one absolutely-positioned `.flipBtn` per card, outside the
   faces, label switching on `isFlipped`.
4. **Vite does not hot-reload on `/mnt/c`.** The repo lives on a Windows mount under WSL2; inotify
   file-watching doesn't fire, so the dev server serves **stale modules** after edits. Tests ran
   against old code until the server was restarted. **Always `pkill -f vite` and restart `pnpm dev`
   after editing**, then re-verify.
5. **Playwright browser missing.** The MCP Playwright tool failed with "Chromium distribution
   'chrome' is not found". `npx playwright install chromium --with-deps` needs sudo (unavailable);
   `npx playwright install chromium` (no `--with-deps`) worked. Then drove Playwright from a small
   Node script in the scratchpad instead of the MCP tool.
6. **WebGL is black under headless Chromium** unless you launch with
   `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`. Without these the 3D scene
   (and the glass behind the cards) renders black in screenshots.
7. **The 3D scene gates on the "Enter" CTA.** Screenshots showed only the loader/Enter ring until
   the script clicked the Enter button and waited ~5s. Verification must click Enter, then read
   `window.store.getState()` for section boundaries to know where to scroll.
8. **`pkill -f vite` in an `&&` chain aborts the chain (exit 144).** A `pkill && git commit` one-liner
   killed the shell before committing; the commit silently didn't happen. **Run `pkill` on its own
   line**, then the git command separately, and verify with `git log`.
9. **`pnpm deploy` ≠ the deploy script.** `pnpm deploy` invokes pnpm's *built-in* deploy and errors
   ("A deploy is only possible from inside a workspace"). The package script is run with
   **`pnpm run deploy`**.

---

## 5. How it was verified (the method, reusable)

Verification was never "it compiles." It was:

1. `pnpm exec tsc --noEmit` (clean) then `pnpm build` (full tsc + vite build) — both must pass.
2. Start `pnpm dev`, then a Node + Playwright script (`chromium.launch` with the swiftshader flags
   above) that:
   - loaded `/simple.html` at 1440×900 and 390×844, screenshotting top + projects.
   - loaded `/`, waited for load, **clicked Enter**, waited, then read
     `window.store.getState().section.boundaries` to locate sections in document space.
   - scrolled into the card runway, screenshotted the glass cards mid-ride.
   - asserted **Ctrl+F findability** by checking `document.body.innerText.includes(...)` for card
     copy ("EC-TSS", "Farnebäck optical flow", "24× Faster") — all true.
   - asserted **selectability** by programmatically selecting an `<h3>` and reading
     `window.getSelection().toString().length > 0`.
   - clicked the flip button with a real `page.mouse.click(x,y)` at the button's measured center,
     then read `aria-hidden` on both faces to confirm the flip.
   - scrolled to the About monument and confirmed "MY JOURNEY" renders at full size.
   - checked mobile (390px) for both the cards and simple.html.

Screenshots were read back visually each pass; layout bugs (off-center pin, doubled button) were
caught from the images, fixed, dev server restarted, re-verified. Budget several restart-and-reshoot
loops — that iteration *is* the craft here.

---

## 6. How it shipped

- Committed **directly to `main`** (this repo's established solo flow — every prior commit is a
  direct main commit; deploy is `main` → `gh-pages`). Single commit `272c580`.
- The working tree also carried ~80 pre-existing deletions (old folio-2022 template assets and
  unused project reels) staged by the user earlier; these were bundled in.
- Per the user's call, removed the `og:image` meta tag from `index.html` (it pointed at the deleted
  `public/images/og_image.png`).
- `git push origin main`.
- `pnpm run deploy` → `tsc && vite build` then `gh-pages -d dist --dotfiles` → published to the
  `gh-pages` branch, which is what serves the live site at `https://rajdeeepm.github.io`.

**Open follow-ups noted to the user (not yet done):** `og:url` in `index.html` still says
`https://rajdeepm.com` while the live deploy is `rajdeeepm.github.io`; and with `og:image` gone,
shared links show no preview image (drop a 1200×630 at `public/images/og_image.png` and restore the
tag to bring it back).

---

## 7. Gotchas cheat-sheet (read this if you read nothing else)

| # | Trap | What to do |
|---|------|-----------|
| 1 | Works cards are **WebGL canvas textures**, not DOM | To make card text selectable/searchable, it must be real HTML. See `components/ProjectCards`. |
| 2 | `position: sticky` is dead site-wide | Global `overflow-x: hidden` breaks it. Pin via `translate3d` in a rAF loop instead. |
| 3 | Vite **no hot-reload** on `/mnt/c` (WSL2) | Restart `pnpm dev` after every edit or you test stale code. |
| 4 | `<Heading>` runs `textfit` to fit one line | Never put a sentence in a heading slot — it shrinks to nothing. Put display strings in headings, prose in body arrays. |
| 5 | All copy is **i18n**, not in components | Edit `public/locales/en/translation.json`, keyed by section. |
| 6 | Headless Chromium renders WebGL black | Launch with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`. |
| 7 | 3D scene gated behind the **Enter** CTA | In tests, click Enter and wait before scrolling/screenshotting. |
| 8 | `pkill` in an `&&` chain kills the chain | Run it alone; verify the next step actually ran. |
| 9 | `pnpm deploy` is the wrong command | Use `pnpm run deploy`. |
| 10 | Design rules are enforced | Load the `impeccable` skill; obey `DESIGN.md` (one signal color, no numbered eyebrows, glass only when purposeful, no drop-shadows on flat HTML). |
| 11 | WebGL cards are **off** | `showPortfolio = false` in `src/settings.ts`. Don't turn it back on unless you also remove the HTML cards. |

---

## 8. Files touched this session

- **new** `src/components/ProjectCards/index.tsx`, `index.module.css`
- `src/partials/Portfolio/index.tsx`, `index.module.css` (render `<ProjectCards/>`, drop SR dup, taller runway)
- `src/settings.ts` (`showPortfolio = false`)
- `public/locales/en/translation.json` (About "My journey" heading + body split)
- `public/simple.html`, `public/simple.css` (full brand rewrite; removed numbered eyebrows)
- `index.html` (removed `og:image` meta)

Approach in one line: **understand the system deeply, fix root causes not symptoms, respect the
existing design language and tokens, and verify every claim in a real browser before shipping.**
