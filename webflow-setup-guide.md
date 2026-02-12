# Avorino v6 — Webflow Migration Guide

## Why This Exists

The HTMLtoFlow pipeline broke because we were fighting Webflow's default styles with `!important` on every heading, paragraph, and link. This guide eliminates that by setting typography and colors globally in Webflow first, so section CSS only handles layout.

---

## Step 1: Webflow Project Settings

### Fonts (Project Settings > Fonts)
Add both from Google Fonts:
- **DM Serif Display** (Regular 400 only)
- **DM Sans** (Regular 400, Medium 500)

---

## Step 2: Global Tag Styles

Configure these in Webflow Designer. Select any element of that type, click the selector dropdown, choose "All H1 Headings" (tag level), and set these values.

### Body
| Property | Value |
|----------|-------|
| Font | DM Sans |
| Size | 17px |
| Weight | 400 |
| Color | #111111 |
| Line-height | 1.9 |
| Letter-spacing | 0.005em |

### All H1 Headings
| Property | Value |
|----------|-------|
| Font | DM Serif Display |
| Weight | 400 |
| Size | 96px |
| Line-height | 1.04 |
| Letter-spacing | -0.03em |
| Margin | 0 (all sides) |
| Color | inherit |

### All H2 Headings
| Property | Value |
|----------|-------|
| Font | DM Serif Display |
| Weight | 400 |
| Size | 64px |
| Line-height | 1.08 |
| Letter-spacing | -0.02em |
| Margin | 0 (all sides) |
| Color | inherit |

### All H3 Headings
| Property | Value |
|----------|-------|
| Font | DM Serif Display |
| Weight | 400 |
| Size | 24px |
| Line-height | 1.2 |
| Margin | 0 (all sides) |
| Color | inherit |

### All H4 Headings
| Property | Value |
|----------|-------|
| Font | DM Serif Display |
| Weight | 400 |
| Size | 24px |
| Line-height | 1.2 |
| Margin | 0 (all sides) |
| Color | inherit |

### All Paragraphs
| Property | Value |
|----------|-------|
| Font | DM Sans (inherits from body) |
| Size | 17px |
| Line-height | 1.9 |
| Margin | 0 (all sides) |
| Color | inherit |

### All Links
| Property | Value |
|----------|-------|
| Color | inherit |
| Text decoration | none |

### All Blockquotes (for testimonial quotes)
| Property | Value |
|----------|-------|
| Font | DM Serif Display |
| Weight | 400 |
| Size | 24px |
| Style | italic |
| Line-height | 1.7 |
| Margin | 0 (all sides) |
| Padding | 0 (all sides) |
| Border | none |
| Color | inherit |

---

## Step 3: Color Inheritance System

Instead of setting color on every element, set it on **section containers** and let everything inherit.

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
| `.cta-inner` | #111111 (inner panel) | #f0ede8 |
| `.footer` | #111111 | #f0ede8 |

**Dark sub-containers** (elements inside light sections that have dark backgrounds):
- `.featured-panel` → color: #f0ede8
- `.testimonials-card` → color: #f0ede8
- `.service-card-content` → color: #f0ede8

---

## Architecture: What Goes Where

### Layer 1: Section CSS (HTMLtoFlow → Webflow classes)
**Layout and spacing only. No typography overrides.**

Allowed:
- `display`, `flex-direction`, `align-items`, `justify-content`
- `grid-template-columns`, `gap`
- `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`
- `padding`, `margin` (specific sides)
- `position`, `top`, `right`, `bottom`, `left`, `z-index`
- `overflow`
- `background-color` (hex only, no gradients)
- `border`, `border-radius`
- `opacity`
- `color` (ONLY on section containers for dark/light switching)
- `font-size` (ONLY where it differs from global tag default, px only)
- `letter-spacing`, `line-height` (ONLY where it differs from global)
- `text-align`, `text-transform`
- `object-fit`, `object-position`
- `cursor`
- `flex-shrink`

NOT allowed:
- `font-family` — NEVER (inherits from global tag styles)
- `font-weight` on headings — NEVER (inherits from global)
- `!important` — NEVER
- `clamp()` — goes in head embed
- `var()` — not supported by HTMLtoFlow
- Quotes in values — HTMLtoFlow encodes them
- `transition` — goes in head embed
- `transform` — goes in head embed
- `background: linear-gradient()` — goes in head embed
- `box-shadow` — goes in head embed
- Hover selectors (`.parent:hover .child`) — goes in head embed
- Pseudo-selectors (`:hover`, `:nth-child`) — goes in head embed
- Media queries — goes in head embed

### Layer 2: Head Embed (`v6-webflow-head.html`)
Paste into: Webflow > Page Settings > Custom Code > Head

Contains:
- `clamp()` responsive typography overrides per class
- Hover state CSS (`.service-card:hover .service-desc`, etc.)
- Transitions and transforms
- Gradients (`.service-card-overlay--dark`, etc.)
- Media queries for responsive layout
- Any CSS that HTMLtoFlow can't convert

### Layer 3: Footer Embed (`v6-webflow-footer.html`)
Paste into: Webflow > Page Settings > Custom Code > Footer

Contains:
- CDN links (GSAP, ScrollTrigger, Lenis)
- `gsap.set()` for serif font on non-heading elements (preloader chars, nav logo, flip clock digits, stat suffixes)
- Preloader animation
- Hero entrance
- Scroll-linked animations
- Horizontal scroll services
- Flip clock stats
- Testimonial navigation
- Custom cursor

---

## File Structure

```
avorino/
├── CLAUDE.md                      (project docs — update)
├── avorino-v6-preview.html        (reference — keep, don't edit)
├── webflow-setup-guide.md         (this file)
├── v6-webflow-head.html           (head embed — responsive + hover CSS)
├── v6-webflow-footer.html         (footer embed — all JS)
└── sections/
    ├── 01-preloader-html.html
    ├── 01-preloader-css.css
    ├── 02-nav-html.html
    ├── 02-nav-css.css
    ├── 03-hero-html.html
    ├── 03-hero-css.css
    ├── 04-about-html.html
    ├── 04-about-css.css
    ├── 05-services-html.html
    ├── 05-services-css.css
    ├── 06-stats-html.html
    ├── 06-stats-css.css
    ├── 07-featured-html.html
    ├── 07-featured-css.css
    ├── 08-process-html.html
    ├── 08-process-css.css
    ├── 09-testimonials-html.html
    ├── 09-testimonials-css.css
    ├── 10-tools-html.html
    ├── 10-tools-css.css
    ├── 11-cta-html.html
    ├── 11-cta-css.css
    ├── 12-footer-html.html
    ├── 12-footer-css.css
```

---

## HTMLtoFlow Workflow (Per Section)

1. Open HTMLtoFlow (app.creoglyph.io/htmltoflow)
2. Paste section HTML in the **LEFT** panel
3. Paste section CSS in the **RIGHT** panel
4. Click Convert → Import to Webflow
5. Verify in Webflow Designer that classes look correct
6. Typography should already be correct from global tag styles
7. If anything looks off, adjust the class in Webflow Designer directly

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
- Responsive breakpoint styles (head CSS)
- Hover effects (head CSS)
- Adding entirely new sections (new HTMLtoFlow conversion)

---

## Key Changes from v5 Approach

| Before (v5) | After (v6 revamp) |
|---|---|
| `font-family` in every CSS class | Inherits from Webflow global tag styles |
| `font-weight: 400 !important` on headings | Inherits from global — no override needed |
| `margin-top: 0 !important` on headings | Global sets margin: 0 — no override needed |
| `font-size` with `!important` on headings | Global sets default, class overrides naturally (higher specificity) |
| `color: #f0ede8 !important` on each element | Set once on section container, everything inherits |
| `gsap.set()` hacks for every serif element | Only needed for ~5 non-heading serif elements |
| 40+ properties per class | ~10-15 layout properties per class |
| HTMLtoFlow breaks fonts → JS workaround | No font-family in CSS at all |

---

## HTML Changes

### Testimonial quotes: `<p>` → `<blockquote>`
The testimonial quote text changes from `<p class="testimonial-quote">` to `<blockquote class="testimonial-quote">`. This lets it inherit DM Serif Display italic from the global "All Blockquotes" style instead of needing a JS font-family hack.

### Headings stay semantic
- `<h1>` — hero title only
- `<h2>` — section headings (about, process, testimonials, tools, cta)
- `<h3>` — card titles (services, featured, process steps, tools), footer brand name
- `<h4>` — secondary featured project titles
- `<p>` — all body copy, descriptions, labels, metadata
- `<div>` — structural containers, labels with uppercase styling
