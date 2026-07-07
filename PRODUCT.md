# Product

## Register

brand

## Users

Two audiences, weighted equally:

- **Research / academic** — PhD admissions committees, professors, and the AI research community evaluating publications, rigor, and depth. They arrive from a paper, a Google Scholar profile, or a referral, and want to confirm this is a serious researcher.
- **Industry / hiring** — AI/ML recruiters, engineering managers, and technical interviewers assessing shipped impact and systems ability. They skim fast, on desktop or mobile, and want proof of measurable results (e.g. "24× speedup at AWS", "+9pp on WebArena").

Both land on the same site and self-select. The job to be done is the same for both: **decide, in under a minute, that Rajdeep Mukherjee is worth a conversation** — then find the specific evidence (paper, project, metric, CV) that justifies it.

## Product Purpose

A personal portfolio for Rajdeep Mukherjee, AI Researcher & Engineer (University of Michigan; formerly AWS, Oakland University, UMich Human-AI Lab). It exists to present his AI/ML research and engineering work — agentic LLM systems, multimodal web agents, accessibility-aware computer-use agents, secure-UAV LLM frameworks, temporal video matting — as a single, credible, memorable experience.

The site itself is a proof of competence: a Three.js/WebGL experience with custom shaders and GSAP motion is not decoration, it is a demonstration that the author can build hard, polished technical things. Success looks like: a visitor leaves convinced of both **credibility** (real published research, real metrics) and **capability** (the site is undeniably well engineered), and takes an action — reads a paper, downloads the CV, or makes contact.

## Brand Personality

**Cinematic. Precise. Confident.**

- **Voice:** first-person, direct, quietly assured. Lets numbers and publications carry the weight rather than adjectives. Never boastful, never hedging.
- **Tone:** the calm of someone who has actually shipped the work. Technical without being cold; the medium (3D, motion, sound) supplies the warmth and drama.
- **Emotional goal:** the visitor should feel a small "how did they build this?" jolt within seconds — spectacle that immediately resolves into substance. Impressed, then convinced.

## Anti-references

- **Generic AI-slop template** (the explicit anti-reference): cookie-cutter gradient cards, tiny uppercase tracked eyebrows above every section, hero-metric templates, identical icon+heading+text card grids, gradient text. If a stranger could say "an AI made that" without doubt, it has failed.
- Corporate SaaS marketing landing pages (navy-and-white, stock illustration, buzzword copy).
- A sterile academic CV page — plain black-on-white list with no craft.
- An overloaded "look at my skills" dump — walls of logos and skill bars competing for attention.

## Design Principles

1. **The medium is the proof.** The build quality is itself an argument for hiring/admitting the author. Every interaction must feel deliberately engineered, never templated.
2. **Spectacle resolves into substance.** Lead with the cinematic 3D hook, but always pay it off with a concrete claim — a metric, a venue (ICCCN 2024, EdgeSP 2023), a named result. No wow without a reason.
3. **Show, don't tell.** Prefer measurable outcomes and published venues over adjectives. Let "+9pp on WebArena" and "24× speedup" do the persuading.
4. **Two doors, one house.** Serve the research reader and the industry reader from the same surface without diluting either; let each find their evidence fast.
5. **Craft is non-negotiable.** Down to contrast ratios, motion easing, and breakpoint behavior — the details are the differentiator, because the whole thesis is attention to detail.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. This is a first-class concern, not an afterthought — the site already ships a text-only `/simple.html` fallback and screen-reader-only project content, and one of the featured research projects is accessibility-aware computer-use agents. Practicing what that research preaches is part of the brand.

- **Reduced motion is mandatory.** The experience is heavy on 3D/WebGL, scroll-driven camera paths, and GSAP motion; every animation needs a `prefers-reduced-motion: reduce` alternative (crossfade or instant), and the site must remain fully usable — content reachable — with motion suppressed.
- **Non-WebGL path must stay first-class.** The `/simple.html` view and SR-only content are the accessible spine; keep them accurate and in sync with the main content, not a stale afterthought.
- Maintain contrast on the dark, cinematic surface (body text ≥4.5:1, large text ≥3:1) — the biggest risk on dark themes is muted-gray text that drops below threshold.
- Respect keyboard navigation and focus visibility for all interactive elements (menu, project cards, links).
