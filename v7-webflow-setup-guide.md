# Avorino v7 — Webflow Migration Guide

## What Changed from v6

| v6 | v7 |
|---|---|
| `!important` in head embed | Removed — no `!important` anywhere |
| `gsap.set()` font-family hacks in footer JS | Removed — font-family is now in section CSS |
| CSS `transform`/`clip-path` initial states in stylesheets | Moved to footer JS via `gsap.set()` |
| v6-preview breakpoints at 1024px / 768px / 420px | Aligned to Webflow breakpoints: 991px / 767px / 479px |
| Sections in single preview file | Split into `v7-sections/` folder for HTMLtoFlow |
| `<p>` for testimonial quotes | `<blockquote>` — footer embed resets blockquote styles |
| CTA title pre-split into word spans in HTML | Plain text — JS splits dynamically |
| Typography set manually in Webflow Designer | All typography in section CSS (HTMLtoFlow imports it) |
| CSS `<style>` in head embed (overridden by Webflow) | CSS `<style>` in footer embed (loads AFTER Webflow CSS, wins cascade) |
| Global tag styles configured manually | Base tag resets in footer embed CSS (body, h1-h4, p, a, blockquote) |

---

## Step 1: Webflow Project Settings

### Fonts (Project Settings > Fonts)
Add both from Google Fonts:
- **DM Serif Display** (Regular 400 only)
- **DM Sans** (Regular 400, Medium 500)

---

## Step 2: Color Inheritance System

Set `color` on **section containers** and let everything inherit.

| Section | Background | Text Color (set on section div) |
|---------|-----------|------|
| `.hero` | image | #f0ede8 (warm-white) |
| `.about` | #e8e4df (cream) | inherits #111111 from body |
| `.services` | #e8e4df | inherits #111111 from body |
| `.stats` | #111111 (dark) | #f0ede8 |
| `.featured` | #e8e4df | inherits #111111 from body |
| `.process` | #e8e4df | inherits #111111 from body |
| `.testimonials` | #e8e4df | inherits #111111 from body |
| `.tools` | #e8e4df | inherits #111111 from body |
| `.cta-section` | #e8e4df (outer) | inherits from body |
| `.cta-container` | #111111 (inner panel) | #f0ede8 |
| `.footer` | #111111 | #f0ede8 |

**Dark sub-containers** (elements inside light sections that have dark backgrounds):
- `.featured-panel` → color: #f0ede8
- `.testimonial-card` → color: #f0ede8
- `.service-card-content` → color: #f0ede8

---

## Architecture: What Goes Where

### Layer 1: Section CSS (HTMLtoFlow → Webflow classes)
**Layout + typography. Everything HTMLtoFlow can handle.**

Allowed:
- `font-family`, `font-weight`, `font-size`, `font-style`
- `line-height`, `letter-spacing`, `word-spacing`
- `display`, `flex-direction`, `align-items`, `justify-content`
- `grid-template-columns`, `gap`
- `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`
- `padding`, `margin` (specific sides)
- `position`, `top`, `right`, `bottom`, `left`, `z-index`
- `overflow`
- `background-color` (hex only, no gradients)
- `border`, `border-radius`
- `opacity`, `color`
- `text-align`, `text-transform`
- `object-fit`, `object-position`
- `cursor`, `flex-shrink`

NOT allowed in section CSS:
- `!important` — NEVER
- `clamp()` — goes in footer embed
- `var()` — not supported by HTMLtoFlow
- `transition` — goes in footer embed
- `transform` — goes in footer embed (except transform-origin for progress bar)
- `background: linear-gradient()` — goes in footer embed
- `box-shadow` — goes in footer embed
- Hover selectors — goes in footer embed
- Pseudo-elements (`::before`, `::after`) — goes in footer embed
- `nth-child` selectors — goes in footer embed
- Media queries — goes in footer embed

### Layer 2: Head Embed (`v7-webflow-head.html`)
**EMPTY** — all CSS moved to footer embed so it loads after Webflow's generated CSS.

### Layer 3: Footer Embed (`v7-webflow-footer.html`)
Paste into: Webflow > Page Settings > Custom Code > **Footer**

Contains (in this order):
1. **`<style>` block** — loads AFTER Webflow's CSS, wins the cascade without `!important`:
   - Base tag resets (body, h1-h4, p, a, button, blockquote, img, ul/ol)
   - `clamp()` responsive typography overrides per class
   - Hover state CSS
   - Transitions and transforms
   - Gradients (service card overlays, featured grid overlays, hero image overlay)
   - Pseudo-elements (section label lines, float-el cross shapes, process line track)
   - Media queries for responsive layout (Webflow breakpoints: 991, 767, 479)
   - `nth-child` selectors (tool card offsets, burger animation)
   - Cursor hover states and transitions

2. **CDN `<script>` tags** (GSAP 3.12.5, ScrollTrigger, Lenis 1.1.18)

3. **`<script>` block** — all JS animations:
   - Lenis smooth scroll
   - `gsap.set()` for initial animation states
   - Preloader animation (char cascade in/out, curtain reveal, hero entrance)
   - Hero title char-cascade
   - Scroll-linked animations (line-wipe, opacity-sweep, blur-focus, fade-up, parallax)
   - Horizontal scroll services with progress bar
   - Flip clock stats with scramble-decode labels
   - Featured project image reveal + panel
   - Process timeline with line fill
   - CTA word stagger elastic
   - Tools floating card fade-up
   - Testimonial carousel navigation
   - Custom cursor (ring follow, dot follow, hover states, magnetic buttons)
   - Floating decorative elements (drift, parallax)
   - Mobile nav burger toggle

---

## File Structure

```
avorino/
├── avorino-v6-preview.html           (reference — keep, don't edit)
├── v7-webflow-head.html              (head embed — EMPTY, kept for reference)
├── v7-webflow-footer.html            (footer embed — CSS + CDN scripts + JS animations)
├── v7-webflow-setup-guide.md         (this file)
└── v7-sections/
    ├── 01-preloader-html.html        (cursor + preloader)
    ├── 01-preloader-css.css
    ├── 02-nav-html.html              (navigation + mobile overlay)
    ├── 02-nav-css.css
    ├── 03-hero-html.html             (hero section)
    ├── 03-hero-css.css
    ├── 04-about-html.html            (about + press)
    ├── 04-about-css.css
    ├── 05-services-html.html         (horizontal scroll gallery)
    ├── 05-services-css.css
    ├── 06-stats-html.html            (flip clock stats)
    ├── 06-stats-css.css
    ├── 07-featured-html.html         (featured project + grid)
    ├── 07-featured-css.css
    ├── 08-process-html.html          (vertical timeline)
    ├── 08-process-css.css
    ├── 09-testimonials-html.html     (testimonial carousel)
    ├── 09-testimonials-css.css
    ├── 10-tools-html.html            (AI tool cards)
    ├── 10-tools-css.css
    ├── 11-cta-html.html              (call-to-action)
    ├── 11-cta-css.css
    ├── 12-footer-html.html           (footer)
    └── 12-footer-css.css
```

---

## HTMLtoFlow Workflow (Per Section)

1. Open HTMLtoFlow (app.creoglyph.io/htmltoflow)
2. Paste section HTML from `XX-name-html.html` in the **LEFT** panel
3. Paste section CSS from `XX-name-css.css` in the **RIGHT** panel
4. Click Convert → Import to Webflow
5. Verify in Webflow Designer that classes and typography look correct
6. If anything looks off, adjust the class in Webflow Designer directly

**Import order matters** — import in numerical order (01 through 12) so Webflow stacks sections correctly.

### Known HTMLtoFlow Limitations
- **`<br>` tags** — HTMLtoFlow can't render line breaks. The hero title (`03-hero-html.html`) contains `<br>` between "Builders Of" and "Extraordinary Spaces". After importing, manually add the line break in Webflow Editor.
- **`<em>` / italic accent** — Verify the `<em class="italic-accent">` in the hero title renders as italic after import. If not, select the word in Webflow Editor and apply italic style manually.
- **Inline `<span>` wrappers** — Some elements use spans for animation targets (e.g., `.press-logos span`). These should import fine but verify they render correctly.

---

## After All Sections Are Imported

1. Paste `v7-webflow-footer.html` content into: Page Settings > Custom Code > **Footer**
   - Head embed is intentionally empty — all CSS lives in the footer embed so it loads after Webflow's generated CSS
2. Manually fix the hero title line break in Webflow Editor (see Known Limitations above)
3. Publish and test all animations
4. Check responsive behavior at each Webflow breakpoint (Desktop, Tablet 991, Mobile Landscape 767, Mobile Portrait 479)

---

## What Your Boss Can Safely Edit

### In Webflow Designer (no code):
- All text content (click, type, done)
- Images (click, swap, crop)
- Link URLs
- Show/hide sections
- Reorder sections
- Duplicate components
- Change colors on utility classes
- Adjust spacing (padding, margin) on any class

### Requires developer:
- Animation timing/behavior (footer JS)
- Responsive breakpoint styles (footer CSS)
- Hover effects (footer CSS)
- Adding entirely new sections (new HTMLtoFlow conversion)

---

## Complete Element Measurements

### Headings — Font Size, Line-Height, Letter-Spacing

| Element | Class | Tag | Font Size (desktop) | Head clamp() | Line-Height | Letter-Spacing | Word-Spacing |
|---------|-------|-----|--------------------:|--------------|------------:|---------------:|-------------:|
| Hero title | `.hero-title` | `<h1>` | 96px (global) | clamp(56px, 7vw, 96px) | 1.04 | -0.03em | 0.15em |
| About heading | `.about-heading` | `<h2>` | 80px | clamp(44px, 5.5vw, 80px) | 1.06 | -0.025em | — |
| Process heading | `.process-heading` | `<h2>` | 64px (global) | clamp(40px, 4.5vw, 64px) | 1.08 | -0.02em | — |
| Testimonials heading | `.testimonials-heading` | `<h2>` | 64px (global) | clamp(40px, 4.5vw, 64px) | 1.08 | -0.02em | — |
| Tools heading | `.tools-heading` | `<h2>` | 64px (global) | clamp(40px, 4.5vw, 64px) | 1.08 | -0.02em | — |
| CTA title | `.cta-title` | `<h2>` | 64px (global) | clamp(40px, 4.5vw, 64px) | 1.08 | -0.02em | — |
| Service title | `.service-title` | `<h3>` | 36px | clamp(22px, 2.2vw, 36px) | 1.15 | -0.01em | — |
| Process step title | `.process-step-title` | `<h3>` | 44px | clamp(28px, 3vw, 44px) | 1.12 | — | — |
| Featured panel title | `.featured-panel-title` | `<h3>` | 44px | clamp(28px, 3vw, 44px) | 1.12 | — | — |
| Tool name | `.tool-name` | `<h3>` | 22px | — | 1.2 (global) | — | — |
| Featured grid card title | `.featured-grid-card-title` | `<h4>` | 24px (global) | — | 1.2 | — | — |
| Footer brand name | `.footer-brand-name` | `<div>` | 24px | — | — | 0.08em | — |
| Nav logo | `.nav-logo` | `<a>` | 20px | — | — | 0.12em | — |
| Preloader text | `.preloader-text` | `<div>` | 64px | clamp(36px, 5vw, 64px) | — | 0.15em | — |

### Body Text — Font Size, Line-Height, Letter-Spacing, Opacity

| Element | Class | Font Size | Line-Height | Letter-Spacing | Opacity | Max-Width |
|---------|-------|----------:|------------:|---------------:|--------:|----------:|
| About body | `.about-body` | 18px | 1.9 | 0.005em | 0.7 | 520px |
| Process intro | `.process-intro` | 17px | 1.9 | — | 0.6 | 520px |
| Tools intro | `.tools-intro` | 17px | 1.9 | — | 0.6 | 520px |
| Process step body | `.process-step-body` | 17px | 1.9 | — | 0.4 | 580px |
| Hero subtitle | `.hero-subtitle` | 14px | — | 0.2em | — | — |
| Testimonials count | `.testimonials-count` | 14px | — | — | 0.4 | — |
| Footer brand desc | `.footer-brand-desc` | 14px | 1.7 | — | 0.3 | 320px |
| Footer license | `.footer-license` | 14px | — | — | 0.2 | — |
| Service desc | `.service-desc` | 14px | 1.7 | — | 0 (hover: 0.65) | — |
| Tool desc | `.tool-desc` | 14px | 1.7 | — | 0.4 | — |
| Featured meta value | `.featured-meta-value` | 14px | — | — | 0.6 | — |
| Testimonial author | `.testimonial-author` | 14px | — | 0.04em | 0.6 | — |
| Testimonial location | `.testimonial-location` | 14px | — | — | 0.3 | — |
| Testimonial quote | `.testimonial-quote` | 24px (global blockquote) | 1.7 | — | 0.7 | — |
| Footer cities list | `.footer-cities-list` | 14px | 1.9 | — | 0.2 | — |
| Footer copy | `.footer-copy` | 14px | — | — | 0.2 | — |

### Labels — Font Size, Letter-Spacing, Text-Transform, Opacity

| Element | Class | Font Size | Letter-Spacing | Text-Transform | Opacity |
|---------|-------|----------:|---------------:|:--------------:|--------:|
| About label | `.about-label` | 11px | 0.3em | uppercase | 0.2 |
| Services label | `.services-label` | 11px | 0.3em | uppercase | 0.2 |
| Featured label | `.featured-label` | 11px | 0.3em | uppercase | 0.2 |
| Press label | `.press-label` | 10px | 0.3em | uppercase | 0.2 |
| Service number | `.service-number` | 10px | 0.3em | uppercase | 0.5 |
| Featured meta label | `.featured-meta-label` | 10px | 0.25em | uppercase | 0.4 |
| Stat label | `.stat-label` | 11px | 0.25em | uppercase | 0.4 |
| Footer col title | `.footer-col-title` | 10px | 0.3em | uppercase | 0.3 |
| Footer cities label | `.footer-cities-label` | 10px | 0.3em | uppercase | 0.2 |
| Services counter | `.services-counter` | 14px | 0.1em | — | 0.3 |
| Press logos text | `.press-logos span` | 14px | 0.15em | uppercase | 0.2 |

### Links & Buttons — Font Size, Letter-Spacing, Opacity, Padding, Border-Radius

| Element | Class | Font Size | Letter-Spacing | Opacity | Padding | Border-Radius |
|---------|-------|----------:|---------------:|--------:|:--------|:--------------|
| Nav links | `.nav-links a` | 14px | 0.04em | 0.7 | — | — |
| Nav CTA | `.nav-cta` | 14px | 0.04em | 1.0 | 10px 28px | 100px |
| Hero CTA (pill) | `.btn-pill` | 14px | 0.04em | — | 16px 36px | 100px |
| CTA button | `.cta-btn` | 14px | 0.04em | — | 18px 40px | 100px |
| About link | `.about-link` | 14px | 0.04em | 0.6 | — | — |
| Service CTA | `.service-cta` | 14px | 0.08em | 0 (hover: 0.7) | — | — |
| Tool CTA | `.tool-cta` | 14px | 0.04em | 0.6 | — | — |
| Footer col links | `.footer-col a` | 14px | — | 0.4 | 4px 0 | — |
| Footer bottom links | `.footer-bottom-links a` | 14px | — | 0.2 | — | — |
| Mobile nav links | `.nav-mobile-overlay a` | 44px | — | 0.7 | — | — |

### Cards & Containers — Dimensions, Padding, Border-Radius, Background

| Element | Class | Width | Height | Padding | Border-Radius | Background |
|---------|-------|:------|:-------|:--------|:--------------|:-----------|
| Service card | `.service-card` | 38vw (min: 320px) | 62vh (min: 450px, max: 680px) | — | 12px | — |
| Service card content | `.service-card-content` | — | — | 48px 48px 64px | — | — |
| Featured image wrap | `.featured-image-wrap` | 100% | 72vh | — | 8px | — |
| Featured panel | `.featured-panel` | max: 520px | — | 64px | 8px | #111111 |
| Featured grid card | `.featured-grid-card` | — | 42vh (min: 300px, max: 480px) | — | 8px | — |
| Testimonial card | `.testimonial-card` | — | min: 460px | — | 8px | #111111 |
| Testimonial slide | `.testimonial-slide` | — | — | 64px 64px 100px | — | — |
| Tool card | `.tool-card` | 280px | — | 48px 36px | 8px | #e8e4df |
| CTA container | `.cta-container` | — | min: 56vh | — | 8px | #111111 |
| Hero container | `.hero-container` | 100% | 100% | — | 8px | — |
| Flip card | `.flip-card` | 72px | 96px | — | 6px | — |
| Flip card halves | `.flip-card-top/bottom` | 100% | 50% | top:2px / bottom:2px | 6px 6px 0 0 / 0 0 6px 6px | #1a1a1a |
| Tool icon | `.tool-icon` | 48px | 48px | — | 50% | — |
| Testimonial dot | `.testimonial-dot` | 8px (active: 24px) | 8px | — | 50% (active: 4px) | rgba(240,237,232,0.2) (active: #f0ede8) |
| Testimonial arrow | `.testimonial-arrow` | 36px | 36px | 0 | 50% | transparent |

### Section Padding (Desktop)

| Section | Class | Padding |
|---------|-------|:--------|
| Hero | `.hero` | 96px 48px 48px 48px |
| About | `.about` | 160px 80px 128px 80px |
| Services header | `.services-header` | 128px 80px 64px 80px |
| Services track | `.services-track` | 0 80px 128px 80px |
| Stats | `.stats` | 128px 80px |
| Featured | `.featured` | 128px 80px |
| Process | `.process` | 128px 80px |
| Testimonials | `.testimonials` | 128px 80px |
| Tools | `.tools` | 128px 80px |
| CTA section | `.cta-section` | 48px |
| Footer | `.footer` | 96px 80px 48px 80px |

### Section Padding — Responsive Breakpoints

| Section | 1600px+ | 1920px+ | 2560px+ | 991px and down | 767px and down | 479px and down |
|---------|:--------|:--------|:--------|:---------------|:---------------|:---------------|
| About/Featured/Process/Testimonials/Tools | L/R: 120px | L/R: 160px | L/R: 240px | — | L/R: 24px | — |
| Services header | L/R: 120px | 128px 160px 64px | 160px 240px 80px | 96px 48px 48px | 80px 24px 32px | 64px 16px 24px |
| Services track | L/R: 120px | 0 160px 128px, gap:40px | 0 240px 160px, gap:48px | 0 48px 96px, gap:24px | 0 24px 80px, gap:16px | 0 16px 64px, gap:12px |
| Stats | L/R: 120px | L/R: 160px | L/R: 240px | — | 96px 24px | — |
| Footer | L/R: 120px | L/R: 160px | L/R: 240px | — | L/R: 24px | — |
| Hero | — | — | — | — | 16px | — |
| CTA section | — | — | — | — | 16px | — |

### Grid Layouts

| Element | Class | Columns (desktop) | Gap (desktop) | Columns (991px) | Columns (767px) |
|---------|-------|:------------------|:--------------|:-----------------|:-----------------|
| About grid | `.about-grid` | 1fr 1fr | 96px (1920px+: 140px) | 1fr | 1fr |
| Stats grid | `.stats-grid` | repeat(4, 1fr) | 64px (2560px+: 96px) | repeat(2, 1fr), gap:48px | 1fr 1fr, gap:32px 24px |
| Featured grid | `.featured-grid` | 1fr 1fr | 32px | 1fr, gap:24px | 1fr |
| Process header | `.process-header` | 1fr 1fr | 96px | 1fr | 1fr |
| Process timeline | `.process-timeline` | 60px 1px 1fr | 0 32px | 48px 1px 1fr, gap:0 24px | — |
| Testimonials grid | `.testimonials-grid` | 1.2fr 1fr | 96px (1920px+: 120px) | 1fr | 1fr |
| Tools header | `.tools-header` | 1fr 1fr | 96px (1920px+: 120px) | 1fr | 1fr |
| Footer top | `.footer-top` | 1.5fr 1fr 1fr 1fr | 64px | 1fr 1fr, gap:48px | 1fr |

### Flip Card Sizes — Per Breakpoint

| Breakpoint | Card Width | Card Height | Digit Font Size | Suffix/Separator Font Size |
|:-----------|:-----------|:------------|:----------------|:---------------------------|
| Desktop (base) | 72px | 96px | 48px | 36px |
| 1600px+ | 84px | 112px | 56px | 44px |
| 1920px+ | 96px | 128px | 64px | 52px |
| 2560px+ | 108px | 144px | 72px | 60px |
| 767px and down | 48px | 64px | 28px | 24px |
| 479px and down | 40px | 56px | 24px | 20px |

### Service Card Sizes — Per Breakpoint

| Breakpoint | Width | Height | Min-Height | Max-Height | Content Padding |
|:-----------|:------|:-------|:-----------|:-----------|:----------------|
| Desktop (base) | 38vw (min: 320px) | 62vh | 450px | 680px | 48px 48px 64px |
| 1920px+ | — | 58vh | 480px | 740px | 52px 52px 68px |
| 2560px+ | — | 55vh | 500px | 780px | 56px 56px 72px |
| 991px and down | 65vw (min: 300px) | 55vh | 380px | 560px | 36px 36px 48px |
| 767px and down | 72vw (min: 260px) | 52vh | 340px | 500px | 28px 28px 40px |
| 479px and down | 82vw (min: 240px) | 48vh | 300px | 420px | 20px 20px 28px |

### Service Card Title — Per Breakpoint

| Breakpoint | Font Size | Margin-Bottom |
|:-----------|:----------|:--------------|
| Desktop | clamp(22px, 2.2vw, 36px) | 16px |
| 991px | clamp(20px, 3vw, 28px) | 16px |
| 767px | clamp(18px, 4vw, 24px) | 12px |
| 479px | 18px | 8px |
| 2560px+ | clamp(28px, 2vw, 42px) | 16px |

---

## Color Palette — Exact Values

| Name | Hex | RGBA | Usage |
|------|-----|------|-------|
| Cream | #e8e4df | rgb(232,228,223) | Light section backgrounds |
| Dark | #111111 | rgb(17,17,17) | Text color, dark section backgrounds |
| Warm White | #f0ede8 | rgb(240,237,232) | Text on dark backgrounds |
| Accent (Red) | #c8222a | rgb(200,34,42) | CTA hovers, progress bars, active dots |
| Teal | #2a3f4e | rgb(42,63,78) | Service card teal overlay |
| Card BG | #1a1a1a | rgb(26,26,26) | Flip card background |

### Opacity Scale Used

| Value | Where Used |
|------:|:-----------|
| 0.04 | Float elements on dark backgrounds |
| 0.05 | Float elements on light backgrounds, opacity-sweep start state |
| 0.06 | Float elements, footer border rgba(240,237,232,0.06) |
| 0.07 | Process step numbers |
| 0.08 | Section rule, border rgba(17,17,17,0.08), tool card border, card line rgba(255,255,255,0.06) |
| 0.1 | Process line track rgba(17,17,17,0.1), hero image overlay start |
| 0.15 | Section label accent line, testimonial arrow border rgba(240,237,232,0.15), float element colors |
| 0.2 | Section labels, press labels, footer cities, footer bottom links, testimonial dot bg rgba(240,237,232,0.2) |
| 0.3 | Services counter, footer brand desc, footer col title, testimonial location |
| 0.4 | Process step body, stat label, featured meta label, tool desc, testimonials count, footer col links |
| 0.5 | Service number, featured grid card meta, tool icon |
| 0.55 | Hero image overlay end (rgba(0,0,0,0.55)) |
| 0.6 | About link, featured meta value, testimonial author, tools intro, process intro |
| 0.65 | Service desc on hover |
| 0.7 | Nav links, mobile nav links, about body, testimonial quote, opacity-sweep end state, service CTA on hover |
| 0.85 | Italic accent (hero title em), service card dark overlay end |
| 0.9 | Featured grid card overlay on hover, service card teal overlay end |
| 0.92 | Service card overlay on hover |
| 1.0 | Nav CTA, cursor ring hover-image span |

---

## Spacing Grid — Resolved Values

All spacing in the design follows an 8px grid:

| Token | Value | Where Used (examples) |
|:------|------:|:----------------------|
| s-1 | 8px | Featured grid card title margin-bottom, small gaps |
| s-2 | 16px | Service title margin-bottom, tool name margin-bottom, footer cities label margin-bottom |
| s-3 | 24px | Section label gap, service number margin-bottom, label margin-bottom, tool desc margin-bottom |
| s-4 | 32px | Press margin-top, services counter-wrap gap, testimonials heading margin-bottom, footer bottom links gap |
| s-6 | 48px | Nav padding, section label margin-bottom, press padding-top, testimonial stars margin-bottom, testimonial nav bottom/left/right |
| s-8 | 64px | Section label margin-bottom, featured panel padding, testimonial slide padding, stats grid gap, footer top gap/padding-bottom |
| s-12 | 96px | About grid gap/margin-bottom, process header margin-bottom, tools header margin-bottom, testimonials grid gap, featured grid margin-top, footer padding-top, press padding-top |
| s-16 | 128px | Section vertical padding (top/bottom) |
| s-20 | 160px | About section padding-top |

---

## Animation Timing Reference

### Preloader Sequence (total ~5.4s)

| Step | Animation | Duration | Stagger | Ease | Offset |
|:-----|:----------|:---------|:--------|:-----|:-------|
| 1 | Chars fade in (opacity:0→1, y:60→0, rotateX:-90→0, blur:4px→0) | 1.2s | 0.025s/char | power4.out | 0s |
| 2 | Hold | 0.4s | — | — | after step 1 |
| 3 | Chars slide out (y→-60, opacity→0) | 0.4s | 0.01s/char | power3.in | after hold |
| 4 | Preloader bg → transparent | instant | — | — | after step 3 |
| 5 | Curtain slide up (yPercent→-100) | 1.2s | — | power4.inOut | after step 4 |
| 6 | Hero image reveal (clipPath:inset(6%)→inset(0%), scale:1.25→1) | 1.8s | — | power4.inOut | -0.8s (overlap) |
| 7 | Hero title char-cascade (same as preloader chars in) | 1.2s | 0.025s/char | power4.out | -1.2s (overlap) |
| 8 | Hero subtitle fade in (opacity:0→1, y:20→0) | 0.8s | — | power3.out | -0.6s (overlap) |
| 9 | Nav fade in (opacity:0→1) | 0.6s | — | power3.out | -0.4s (overlap) |

### Scroll Animations

| Animation | Trigger | Start | End | Duration | Stagger | Ease | Scrub |
|:----------|:--------|:------|:----|:---------|:--------|:-----|:------|
| Line-wipe (about heading) | `.about-heading` | top 78%/66%/54% per line | top 45%/33%/21% per line | — | — | power3.inOut | 1 (scroll-linked) |
| Opacity-sweep (body text) | element | top 85% | top 45% | — | 0.006s/char | none | 1 (scroll-linked) |
| Blur-focus (section headings) | element | top 85% | top 50% | — | — | none | 1 (scroll-linked) |
| Fade-up (generic) | element | top 85% | — | 1.2s | — | power3.out | no (triggered) |
| Fade-up stagger (press logos) | container | top 85% | — | 0.8s | 0.08s/child | power3.out | no (triggered) |
| Line-draw (press border) | `.press` | top 90% | top 60% | — | — | none | 1 (scroll-linked) |
| Parallax depth (CTA bg) | parent section | top bottom | bottom top | — | — | none | 1, yPercent→-12 |

### Featured Project

| Animation | Trigger Start | Duration | Ease |
|:----------|:-------------|:---------|:-----|
| Image wrap clip-path: inset(100% 0 0 0) → inset(0% 0 0 0) | top 70% | 1.4s | power4.inOut |
| Image scale: 1.3 → 1 | top 70% | 2.0s | power3.out |
| Image hover: scale → 1.04 | mouseenter | 6.0s | power2.out |
| Image hover out: scale → 1 | mouseleave | 2.0s | power2.out |
| Panel fade in (opacity:0→1, y:40→0) | top 90% | 1.0s | power3.out |

### Services Horizontal Scroll

| Property | Value |
|:---------|:------|
| Pin trigger | `.services` section |
| Pin start | top top |
| Scroll distance | (track.scrollWidth - window.innerWidth) * 1.2 |
| Scrub | 1 |
| Progress bar | scaleX: 0 → 1 (transform-origin: left) |
| Counter format | "01 / 03" → "03 / 03" |

### Flip Clock Stats

| Property | Value |
|:---------|:------|
| Trigger | `.stats` section enters at top 70% |
| Fires once | yes |
| Item stagger delay | 0.5s per stat item (0, 0.5s, 1.0s, 1.5s) |
| Digit stagger delay | 0.2s per digit within item |
| Flip duration | 0.3s per flip |
| Flip ease | power2.in |
| Suffix fade-in delay | (itemIdx * 0.5) + (cards.length * 0.2) + 1.6s |
| Suffix fade-in duration | 0.4s, power2.out |
| Separator fade-in delay | (itemIdx * 0.5) + 0.4s |
| Scramble-decode start | suffix delay + 0.2s |
| Scramble-decode frames | 30 frames at 50ms each (1.5s total) |

### Process Timeline

| Animation | Trigger Start | End | Scrub |
|:----------|:-------------|:----|:------|
| Line fill (height: 0 → full) | top 60% | bottom 40% | 1 |
| Step title (y:30→0, opacity:0→1) | top 75% | — | no, 1.0s power3.out |
| Step body (y:20→0, opacity:0→1, delay:0.15s) | top 75% | — | no, 1.0s power3.out |
| Step number (scale:0.8→1, opacity:0→1) | top 75% | — | no, 1.2s power3.out |
| Dot active (class toggle) | top 60% | — | no |

### CTA Word Stagger

| Property | Value |
|:---------|:------|
| Trigger | top 80% |
| Animation | yPercent: 120 → 0 |
| Duration | 1.4s |
| Stagger | 0.06s per word |
| Ease | elastic.out(1, 0.4) |
| Word wrapper | display:inline-block, overflow:hidden, margin-right:0.3em |

### Tools Floating Cards

| Property | Value |
|:---------|:------|
| Trigger | top 85% per card |
| Animation | y:60→0, opacity:0→1 |
| Duration | 1.2s |
| Stagger | 0.15s delay per card (i * 0.15) |
| Ease | power3.out |
| Card Y-offsets (desktop) | card 1: translateY(0px), card 2: translateY(32px), card 3: translateY(64px) |
| Hover (head CSS) | translateY(-8px), box-shadow: 0 24px 48px rgba(17,17,17,0.08) |

### Testimonial Carousel

| Animation | Duration | Ease |
|:----------|:---------|:-----|
| Slide exit (opacity→0, x→-20*direction) | 0.35s | power2.in |
| Slide enter (opacity:0→1, x:20*direction→0) | 0.45s | power3.out |
| Active dot width | 8px → 24px, border-radius: 50% → 4px |

### Floating Decorative Elements

| Property | Value |
|:---------|:------|
| Fade-in | opacity:0→1, duration:2s, stagger:0.3s, delay:1s |
| Drift Y | 8-20px (random), sine.inOut, repeat:-1 yoyo |
| Drift X | 4-10px (random), sine.inOut, repeat:-1 yoyo |
| Drift duration | 4-7s (random) |
| Parallax | yPercent: -30 to -70 (random), scrub:1, trigger: parent section |

### Custom Cursor

| State | Ring Size | Dot | Ring Follow Easing |
|:------|:----------|:----|:-------------------|
| Default | 16px x 16px, border: 1px solid #f0ede8 | 4px x 4px, bg: #f0ede8 | 0.12 lag factor |
| Link hover | 64px x 64px | hidden (opacity:0) | 0.12 |
| Image hover | 64px x 64px, "View" text visible | hidden (opacity:0) | 0.12 |
| Mobile (<768px) | hidden | hidden | — |

### Magnetic Buttons

| Property | Value |
|:---------|:------|
| Pull strength | dx * 0.25, dy * 0.25 |
| Pull duration | 0.4s, power3.out |
| Return duration | 0.8s, elastic.out(1, 0.5) |

### Lenis Smooth Scroll

| Property | Value |
|:---------|:------|
| Duration | 1.4 |
| Easing | (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) |
| Smooth | true |
| Smooth touch | false |

---

## Transition Timing Reference (Footer Embed)

| Element | Property | Duration | Ease |
|:--------|:---------|:---------|:-----|
| `.cursor-ring` | width, height, opacity | 0.3s | ease |
| `.cursor-ring span` | opacity | 0.2s | ease |
| `.cursor-dot` | opacity | 0.2s | ease |
| `.nav-links a` | opacity | 0.3s | ease |
| `.nav-cta` | transform, box-shadow, background | 0.5s, 0.3s, 0.3s | cubic-bezier(0.23,1,0.32,1), ease, ease |
| `.nav-burger span` | transform, opacity | 0.3s | ease |
| `.nav-mobile-overlay` | opacity | 0.4s | ease |
| `.btn-pill` | transform, box-shadow | 0.5s, 0.3s | cubic-bezier(0.23,1,0.32,1), ease |
| `.btn-pill .arrow` | transform | 0.3s | ease |
| `.cta-btn` | transform | 0.5s | cubic-bezier(0.23,1,0.32,1) |
| `.cta-btn .arrow` | transform | 0.3s | ease |
| `.about-link` | opacity | 0.3s | ease |
| `.about-link .arrow` | transform, color | 0.3s | ease |
| `.service-card-image` | transform | 1.2s | cubic-bezier(0.23,1,0.32,1) |
| `.service-card::after` | opacity | 0.6s | ease |
| `.service-desc` | opacity, max-height | 0.5s (delay:0.1s), 0.5s | ease |
| `.service-cta` | opacity, transform | 0.4s (delay:0.15s) | ease |
| `.service-cta .arrow` | transform, color | 0.3s | ease |
| `.featured-grid-card-image` | transform | 1.2s | cubic-bezier(0.23,1,0.32,1) |
| `.featured-grid-card::after` | opacity | 0.5s | ease |
| `.process-step-dot` | background, border-color | 0.5s | ease |
| `.testimonial-dot` | all | 0.4s | ease |
| `.testimonial-arrow` | border-color, background | 0.3s | ease |
| `.tool-card` | transform, box-shadow | 0.5s | cubic-bezier(0.23,1,0.32,1), ease |
| `.tool-cta` | opacity | 0.3s | ease |
| `.footer-col a` | opacity | 0.3s | ease |
| `.footer-bottom-links a` | opacity | 0.3s | ease |

---

## Gradient Overlays (Footer Embed)

### Service Card Overlays
| Variant | Gradient |
|:--------|:---------|
| `.service-card--dark::after` | linear-gradient(to bottom, rgba(17,17,17,0.02) 0%, rgba(17,17,17,0.15) 40%, rgba(17,17,17,0.85) 100%) |
| `.service-card--teal::after` | linear-gradient(to bottom, rgba(42,63,78,0.02) 0%, rgba(42,63,78,0.2) 40%, rgba(42,63,78,0.9) 100%) |
| `.service-card--warm::after` | linear-gradient(to bottom, rgba(139,115,85,0.02) 0%, rgba(139,115,85,0.15) 40%, rgba(139,115,85,0.82) 100%) |

### Other Overlays
| Element | Gradient |
|:--------|:---------|
| `.hero-image::after` | linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.55) 100%) |
| `.featured-grid-card::after` | linear-gradient(to bottom, rgba(17,17,17,0.0) 0%, rgba(17,17,17,0.1) 40%, rgba(17,17,17,0.75) 100%) |
