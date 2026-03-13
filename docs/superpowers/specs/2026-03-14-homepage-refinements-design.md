# Homepage Refinements Design Spec

## Overview

A collection of 12 UX/UI refinements to the Avorino home page, touching the preloader, navigation, typography, section labels, process section, and testimonials. All changes target the CDN-deployed CSS/JS files and the v7-sections HTML templates.

---

## 1. Remove Custom Cursor

**What:** Delete the custom cursor system (ring + dot + "View" label). Revert to default browser cursor.

**Files affected:**
- `v7-sections/01-preloader-html.html` — remove `.cursor-ring` and `.cursor-dot` divs
- `v7-sections/01-preloader-css.css` — remove `.cursor-ring`, `.cursor-ring span`, `.cursor-dot` rules
- `avorino-v7-footer.js` — remove all cursor-related JS (lines ~19-56: `cursorRing`, `cursorDot`, mousemove listeners, hover-link/hover-image classes, magnetic cursor tracking)
- `avorino-v7-footer.css` — remove any cursor-ring/cursor-dot styles if present

**Behavior:** All pages revert to the native browser cursor. No custom cursor ring, no "View" text, no magnetic hover effect on the cursor itself. The `[data-magnetic]` button effect (buttons shift toward mouse) can stay since that's a button animation, not cursor.

---

## 2. +4px Font Size Bump (Tiered)

**What:** Increase all font sizes across the board, scaled proportionally.

**Files affected:**
- `avorino-responsive.css` — update all `font-size` declarations
- `avorino-v7-footer.css` — update font sizes
- `v7-sections/*-css.css` — update font sizes in each section's CSS (including `03-hero-css.css`, `06-stats-css.css`, `12-footer-css.css`)
- `avorino-nav-footer.css` — update nav/footer font sizes

**Tiered bump strategy:**
- Sizes <= 12px: +2px bump (e.g., 10px → 12px, 12px → 14px)
- Sizes 13-16px: +3px bump (e.g., 14px → 17px, 16px → 19px)
- Sizes 17px+: +4px bump (e.g., 18px → 22px, 24px → 28px)
- `clamp()` values: increase min and max by the appropriate tier, and scale the vw middle value proportionally (e.g., `clamp(48px, 7vw, 72px)` → `clamp(52px, 7.5vw, 76px)`)
- `rem` values: convert tier to rem equivalent (~0.125rem, ~0.1875rem, ~0.25rem)

**Required:** Visual QA pass at all 4 breakpoints (1440px, 991px, 767px, 478px) after applying changes. Nav links at 991px are especially tight — verify no overflow.

---

## 3. Resources Dropdown Staggered Animation

**What:** Verify and fix the staggered reveal animation on the Resources dropdown to match Services/ADU.

**Files affected:**
- `avorino-nav.js` — the `openDropdown()` function already applies stagger delays to `.nav-dd-link` elements. Verify this works for Resources. If not, ensure `.nav-dropdown--resources` children are included in the query.
- `v7-sections/02-nav-css.css` — ensure Resources dropdown links have the `navItemFadeUp` animation applied (same as Services/ADU links in `.nav-item.is-open`)

**Note:** The existing nav JS may already handle this since Resources uses the same `.nav-dd-link` class. Test first — if it already works, skip this item. If there's a discrepancy (e.g., Resources opens instantly while others stagger), fix the specific gap.

---

## 4. New Preloader — Blueprint Wireframe Build

**What:** Replace the paint roller preloader with a construction-themed blueprint wireframe animation using Three.js/canvas or SVG+GSAP.

**Files affected:**
- `avorino-v7-footer.js` — rewrite `initPreloader()` function entirely
- `v7-sections/01-preloader-html.html` — update markup if needed (add canvas element)
- `v7-sections/01-preloader-css.css` — update preloader styles

**Animation sequence:**
1. Dark background (#111111) fills the screen
2. A grid of faint blueprint lines fades in (like graph paper)
3. A simple house wireframe draws itself line by line:
   - Foundation line draws left→right
   - Wall lines draw upward from foundation
   - Roof lines draw from peak outward (like an inverted V)
   - Door and window outlines sketch in
4. Lines glow briefly in brand red (#c8222a) on completion
5. Wireframe fades/scales down as the Avorino logo fades in at center
6. Preloader slides up to reveal the page, Lenis starts

**Implementation:** Use GSAP timeline with SVG path drawing (`stroke-dasharray`/`stroke-dashoffset`) for the wireframe. No Three.js needed — SVG is lighter and more controllable for this 2D line-drawing effect. Total duration: ~2.5-3 seconds.

**Repeat visitor optimization:** Use `sessionStorage` to skip or shorten the preloader on subsequent page loads within the same session (e.g., quick 0.5s fade instead of full animation).

---

## 5. Colored Avorino Logo

**What:** Remove any monochrome treatment (filters, blend modes, opacity overlays) on the Avorino logo in the navbar and preloader so it displays in its original colors.

**Files affected:**
- `v7-sections/02-nav-css.css` — check `.nav-logo-img` for any `filter: grayscale()`, `mix-blend-mode`, or opacity treatment and remove
- `v7-sections/01-preloader-css.css` — check `.preloader-logo-img` for same
- `avorino-nav-footer.css` — check for logo filter overrides
- `avorino-v7-footer.css` — check for logo filter overrides

**Specific filters to remove:**
- `01-preloader-css.css` line 66: `.preloader-logo-img { filter: brightness(0) invert(1); }` — remove filter
- `02-nav-css.css` line 37: `.nav-logo-img { filter: brightness(0) invert(1); }` — remove filter
- `02-nav-css.css` line 96 (dropdown-open state): `.nav-logo-img { filter: brightness(0); }` — keep this if the colored logo needs a dark version on light dropdown backgrounds, OR remove if the colored logo works on both. Test visually.

**Behavior:** The logo renders as the original image file with no CSS filter transformations in default state. The dropdown-open state may need adjustment based on the logo's actual colors.

---

## 6. Add Periods to Body Paragraphs

**What:** Add periods to the end of all description/body text that reads as a sentence but is missing a period.

**Files affected:**
- `v7-sections/04-about-html.html` — about body paragraph
- `v7-sections/05-services-html.html` — service card descriptions
- `v7-sections/08-process-html.html` — process slide body text
- `v7-sections/09-testimonials-html.html` — testimonial quotes (check if missing)
- `v7-sections/02-nav-html.html` — nav dropdown service descriptions
- `v7-sections/07-featured-html.html` — featured project descriptions
- `v7-sections/10-tools-html.html` — tool descriptions
- `v7-sections/11-cta-html.html` — CTA text
- `v7-sections/03-hero-html.html` — hero subtitle/tagline
- `v7-sections/06-stats-html.html` — stat labels (if sentence-like)
- `v7-sections/12-footer-html.html` — footer description text

**Approach:** Audit all visible text in sections 01-12. Any sentence-like text that doesn't end with punctuation (., !, ?) gets a period added. Short labels like "Custom Homes" or stat labels like "Projects Completed" do NOT need periods.

---

## 7. Nav Hover Color → Red + Fix Blend Mode

**What:** Change navbar link hover color to brand red (#c8222a). Fix the `mix-blend-mode: difference` on the nav so red actually renders as red.

**Files affected:**
- `v7-sections/02-nav-css.css` — update `.nav-link:hover` to `color: #c8222a` instead of just `opacity: 1`. Remove or adjust `mix-blend-mode: difference` on `.site-nav` so colors display accurately.
- `avorino-nav-footer.css` — check for blend-mode overrides

**Approach:** Remove `mix-blend-mode: difference` from the nav. Replace with explicit nav state management:

**Nav state table:**
| State | Background | Text Color | Hover Color | Logo |
|-------|-----------|------------|-------------|------|
| Over hero (not scrolled) | transparent | white (#fff) | red (#c8222a) | colored (or white variant) |
| Scrolled past hero | dark (#111111 at 95% opacity) | white (#fff) | red (#c8222a) | colored |
| Dropdown open | cream (#f0ede8) | dark (#111111) | red (#c8222a) | colored (or dark variant) |

**Implementation:**
- Remove `mix-blend-mode: difference` from `.site-nav`
- Add scroll listener (may already exist in `avorino-nav.js`) that toggles a `nav--scrolled` class when scrolled past hero height
- `.nav--scrolled` gets `background: rgba(17, 17, 17, 0.95); backdrop-filter: blur(8px);`
- `.nav-link:hover` gets `color: #c8222a` in all states
- Mobile burger icon color: white by default, dark (#111) when dropdown open
- The scroll threshold should be the hero section height (use `document.querySelector('.hero').offsetHeight`)
- Transition: `background 0.3s ease, color 0.3s ease`

**CTA button** ("Get a Quote") keeps its existing style.

---

## 8. Consistent `//` Prefix on Section Labels

**What:** Add `//` prefix to all section labels for visual consistency.

**Files affected:**
- `v7-sections/04-about-html.html` — "About Avorino" → "// About Avorino"
- `v7-sections/04-about-html.html` — "As Seen On" stays as-is (press/media sub-label, not a main section label)
- `v7-sections/07-featured-html.html` — "Featured Project" → "// Featured Project"
- `v7-sections/08-process-html.html` — (add label if missing, or add `//` to existing heading)
- `v7-sections/09-testimonials-html.html` — "30+ Five-star reviews" is a count, not a label. Add a `// Client Reviews` label above the heading.
- `v7-sections/10-tools-html.html` — add `//` to any section label
- `v7-sections/05-services-html.html` — already has `// Our Services` (no change)

**Pattern:** All section labels follow the format: `// Label Text` in the small uppercase label style.

---

## 9. Thicker Progress Bar Track (Process Section)

**What:** Increase the height of the horizontal progress bar in the process/steps section.

**Files affected:**
- `v7-sections/08-process-css.css` — increase `.process-bar-track` and `.process-bar-fill` height (e.g., from 2px to 4-6px)

**Behavior:** The bar is visually more prominent. Dots remain the same size relative to the bar.

---

## 10. Faster Scroll-Pinned Sections

**What:** Reduce the scroll distance required to progress through the pinned process section.

**Files affected:**
- `avorino-v7-footer.js` or `avorino-animations.js` — find the ScrollTrigger for the process section and reduce `end` value (currently `+=250%` at ~line 552 of `avorino-v7-footer.js`) to `+=150%`

**Behavior:** User scrolls through the 3 process steps in roughly 60% of the current scroll distance. Steps still transition smoothly but don't feel like they drag on.

**Dependency:** This item must be tuned together with Item 11 (animated transitions). The final scroll distance should be set after transition animations are in place, since shorter scroll distance means less travel to drive the in/out animations. Implement Item 11 first, then adjust this value.

---

## 11. Animated Step Transitions (Process Section)

**What:** When transitioning between process steps, animate both the text card and SVG illustration in/out instead of just swapping.

**Files affected:**
- `avorino-v7-footer.js` or `avorino-animations.js` — update the process step transition logic
- `v7-sections/08-process-css.css` — add transition classes if needed

**Animation per step transition:**
- **Text card out:** Current title + body fade out + slide left (or up), ~0.3s
- **Text card in:** New title + body fade in + slide from right (or below), ~0.4s
- **SVG illustration out:** Current SVG fades + scales down slightly, ~0.3s
- **SVG illustration in:** New SVG draws in (stroke animation) + fades up, ~0.5s
- **Step number:** Crossfade with Y offset (already exists, keep it)
- **Progress bar:** Fill animates smoothly between dot positions (already exists, keep it)

**Timing:** Transitions are scroll-driven, not time-based. As the user scrolls through each third of the pinned section, the outgoing elements animate out and incoming elements animate in.

---

## 12. All 25 Reviews on Home Page

**What:** Replace the 4-slide testimonial carousel with a full carousel containing all 25 reviews from the reviews data.

**Files affected:**
- `v7-sections/09-testimonials-html.html` — restructure to support dynamic review injection
- `v7-sections/09-testimonials-css.css` — update carousel styles for many slides
- `avorino-v7-footer.js` — add review carousel logic with all 25 reviews hardcoded (matching the data from `avorino-reviews.js`)

**Design:**
- Keep the current layout structure: heading on the left, review card on the right
- The review card area cycles through all 25 reviews
- Navigation: dot indicators (maybe grouped/paginated since 25 dots is a lot — show dots in groups of 5, or use a simple counter "03 / 25" instead), plus prev/next arrows
- Auto-cycle every 5 seconds with pause on hover
- Smooth crossfade transition between reviews
- NOT scroll-pinned — it just auto-cycles and users can click through with arrows
- Mobile: stack heading above review card, swipe support

**Review data:** Hardcode the same 25 reviews from `avorino-reviews.js` into the home page footer script. Each review has: quote, author, location, stars (all are 5 stars).

**Note:** This creates data duplication with `avorino-reviews.js`. This is an intentional trade-off — the home page and reviews page are separate CDN scripts that load independently. If the reviews page is removed later (planned), the duplication goes away. If reviews are ever updated, both files need updating.

**Navigation pattern:** Use a counter display ("03 / 25") with prev/next arrows — 25 dots would be too many. Optionally show a thin progress bar below the card.

**Auto-cycle:** Cycles every 5 seconds. Stops auto-cycling after one full rotation to avoid infinite looping. Manual navigation always available via arrows.

**Sticky positioning:** Remove the existing `position: sticky` on `.testimonials-left` since this section is no longer scroll-pinned.

---

## Files Summary

### HTML templates (v7-sections/)
- `01-preloader-html.html` — remove cursor, update preloader markup
- `01-preloader-css.css` — remove cursor styles, update preloader styles
- `02-nav-html.html` — no structural changes
- `02-nav-css.css` — hover color, blend mode fix
- `04-about-html.html` — add `//` to labels, add periods
- `05-services-html.html` — add periods (label already has `//`)
- `07-featured-html.html` — add `//` to label
- `08-process-html.html` — add `//` label if needed
- `08-process-css.css` — thicker bar
- `09-testimonials-html.html` — rebuild for 25-review carousel
- `09-testimonials-css.css` — update carousel styles
- `10-tools-html.html` — add `//` to label, add periods
- `11-cta-html.html` — add periods

### CDN JS
- `avorino-v7-footer.js` — preloader rewrite, cursor removal, process animation, review carousel, scroll-pin speed
- `avorino-nav.js` — Resources dropdown stagger animation

### CDN CSS
- `avorino-responsive.css` — font size bump (73+ font-size declarations)
- `avorino-v7-footer.css` — font sizes, cursor removal
- `avorino-nav-footer.css` — nav hover, blend mode, font sizes, scroll state

### Also affected by font bump (v7-sections CSS)
- `03-hero-css.css`, `06-stats-css.css`, `12-footer-css.css` — font sizes

---

## Out of Scope
- Review page removal (later)
- "Full house" image removal (user handling)
- Service page changes (home page only)
- Animation bug fixes (none identified currently)
