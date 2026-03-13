# Homepage Refinements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 12 UX/UI refinements to the Avorino home page — cursor removal, font bump, nav improvements, preloader rewrite, label consistency, process section animations, and a 25-review carousel.

**Architecture:** All changes target CDN-deployed CSS/JS files and v7-sections HTML/CSS templates. The site runs on Webflow with custom scripts loaded via jsDelivr CDN. Changes are made to source files, committed, and deployed by updating the CDN hash.

**Tech Stack:** GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.18, vanilla JS, CSS (no preprocessor), SVG for preloader animation.

**Spec:** `docs/superpowers/specs/2026-03-14-homepage-refinements-design.md`

---

## Chunk 1: Quick Wins (Cursor, Labels, Periods, Logo, Nav Hover)

### Task 1: Remove Custom Cursor

**Files:**
- Modify: `v7-sections/01-preloader-html.html:1-3`
- Modify: `v7-sections/01-preloader-css.css:3-38`
- Modify: `avorino-v7-footer.js` (find `// CUSTOM CURSOR` block)
- Modify: `avorino-v7-footer.css` (remove `cursor:none` and cursor-ring styles)

- [ ] **Step 1: Remove cursor HTML elements**

In `v7-sections/01-preloader-html.html`, delete lines 1-3 (the cursor-ring and cursor-dot divs). The file should start with the preloader comment.

- [ ] **Step 2: Remove cursor CSS**

In `v7-sections/01-preloader-css.css`, delete the entire `/* ── Custom Cursor ── */` block (lines 3-38): `.cursor-ring`, `.cursor-ring span`, and `.cursor-dot` rules.

- [ ] **Step 3: Remove cursor JS from footer script**

In `avorino-v7-footer.js`, find the `// CUSTOM CURSOR` comment block and delete everything from that comment down to the closing `}` of the `if (cursorRing && cursorDot ...)` block. This removes:
- `cursorRing`, `cursorDot` variable declarations
- `mouseX`, `mouseY`, `ringX`, `ringY` tracking
- All `mousemove`, `mouseenter`, `mouseleave` listeners for cursor
- The hover-link/hover-image class toggling

**Keep** the `[data-magnetic]` button effect (currently inside the cursor if-block) — extract it to run independently:

```javascript
// MAGNETIC BUTTONS
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(btn, { x: dx * 0.25, y: dy * 0.25, duration: 0.4, ease: 'power3.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
  });
});
```

Place this right after the Lenis setup (after the `ScrollTrigger.addEventListener('refresh', ...)` line), outside any `if` block so it always runs on desktop.

- [ ] **Step 4: Remove cursor styles from avorino-v7-footer.css**

In `avorino-v7-footer.css`, search for and remove:
- Any `cursor: none` declarations on `body`, `a`, `button`, or `*` selectors
- Any `.cursor-ring`, `.cursor-dot`, `.hover-link`, `.hover-image` style rules
- Any rule that hides the default cursor

After this, the browser default cursor will be restored on all elements.

- [ ] **Step 5: Commit**

```bash
git add v7-sections/01-preloader-html.html v7-sections/01-preloader-css.css avorino-v7-footer.js avorino-v7-footer.css
git commit -m "feat: remove custom cursor, keep magnetic button effect"
```

---

### Task 2: Consistent `//` Prefix on Section Labels

**Files:**
- Modify: `v7-sections/04-about-html.html:5`
- Modify: `v7-sections/07-featured-html.html:4`
- Modify: `v7-sections/08-process-html.html` (add label)
- Modify: `v7-sections/09-testimonials-html.html` (add label)
- Modify: `v7-sections/10-tools-html.html` (add `// AI Tools` label)

- [ ] **Step 1: Update about label**

In `v7-sections/04-about-html.html` line 5, change:
```html
<div class="about-label" data-animate="fade-up">About Avorino</div>
```
to:
```html
<div class="about-label" data-animate="fade-up">// About Avorino</div>
```

- [ ] **Step 2: Update featured label**

In `v7-sections/07-featured-html.html` line 4, change:
```html
<div class="featured-label" data-animate="fade-up">Featured Project</div>
```
to:
```html
<div class="featured-label" data-animate="fade-up">// Featured Project</div>
```

- [ ] **Step 3: Add process section label**

In `v7-sections/08-process-html.html`, add a label div before the process-header (after line 4, inside `.process`):
```html
<div class="process-label" data-animate="fade-up">// Our Process</div>
```

Add corresponding CSS to `v7-sections/08-process-css.css` after line 8 (inside `.process` block, or as a new rule):
```css
.process-label {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 400;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #111111;
  opacity: 0.4;
  margin-bottom: 32px;
}
```

- [ ] **Step 4: Add testimonials section label**

In `v7-sections/09-testimonials-html.html`, add a label div inside `.testimonials-left`, before the heading (line 6):
```html
<div class="testimonials-label" data-animate="fade-up">// Client Reviews</div>
```

Add CSS to `v7-sections/09-testimonials-css.css` after line 9:
```css
.testimonials-label {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 400;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #111111;
  opacity: 0.4;
  margin-bottom: 32px;
}
```

- [ ] **Step 5: Add tools section label**

In `v7-sections/10-tools-html.html`, add a label before the tools-header (after line 4, inside `.tools`):
```html
<div class="tools-label" data-animate="fade-up">// AI Tools</div>
```

- [ ] **Step 6: Commit**

```bash
git add v7-sections/04-about-html.html v7-sections/07-featured-html.html v7-sections/08-process-html.html v7-sections/08-process-css.css v7-sections/09-testimonials-html.html v7-sections/09-testimonials-css.css v7-sections/10-tools-html.html
git commit -m "feat: add consistent // prefix to all section labels"
```

---

### Task 3: Add Periods to Body Paragraphs

**Files:**
- Modify: `v7-sections/02-nav-html.html` (service descriptions in dropdown)
- Check: `v7-sections/03-hero-html.html` (hero subtitle)
- Check: `v7-sections/04-about-html.html` (about body paragraph)
- Check: `v7-sections/05-services-html.html` (service card descriptions)
- Check: `v7-sections/06-stats-html.html` (stat labels)
- Check: `v7-sections/07-featured-html.html` (featured project text)
- Check: `v7-sections/08-process-html.html` (process slide bodies)
- Check: `v7-sections/09-testimonials-html.html` (testimonial quotes)
- Check: `v7-sections/10-tools-html.html` (tool descriptions)
- Check: `v7-sections/11-cta-html.html` (CTA text)
- Check: `v7-sections/12-footer-html.html` (footer description)

- [ ] **Step 1: Audit and add periods to nav dropdown descriptions**

In `v7-sections/02-nav-html.html`, the service card descriptions currently lack periods. Add periods to each `nav-dd-service-desc`:
- Line 18: "Ground-up luxury residences tailored to your vision" → add `.`
- Line 25: "Full-scale builds from foundation to finish" → add `.`
- Line 36: "Expand your living space seamlessly" → add `.`
- Line 45: "Full-home and kitchen/bath remodels with luxury finish" → add `.`
- Line 54: "Transform unused space into livable square footage" → add `.`
- Line 63: "Tenant improvements and commercial buildouts" → add `.`
- Line 72: "Photorealistic visualization before you build" → add `.`

- [ ] **Step 2: Verify service card descriptions have periods**

In `v7-sections/05-services-html.html`, check each `.service-desc`:
- Line 17: "...no shortcuts — every detail tailored to your vision and lifestyle." — already has period ✓
- Line 28: "...maximize your property's potential and rental income." — already has period ✓
- Line 39: "...meticulous attention to detail." — already has period ✓

- [ ] **Step 3: Add periods to tool descriptions**

In `v7-sections/10-tools-html.html`:
- Line 58: "Get a realistic estimate based on your property, size, and finish level." — already has period ✓
- Line 110: "See rental income potential and how quickly your ADU pays for itself." — already has period ✓
- Line 151: "Find out which loan options work best for your situation." — already has period ✓

No changes needed for tools.

- [ ] **Step 4: Commit**

```bash
git add v7-sections/02-nav-html.html
git commit -m "feat: add periods to nav dropdown service descriptions"
```

---

### Task 4: Colored Avorino Logo

**Files:**
- Modify: `v7-sections/01-preloader-css.css:62-67`
- Modify: `v7-sections/02-nav-css.css:37,95-97`

- [ ] **Step 1: Remove preloader logo filter**

In `v7-sections/01-preloader-css.css` line 66, remove `filter: brightness(0) invert(1);` from `.preloader-logo-img`.

- [ ] **Step 2: Remove nav logo filter**

In `v7-sections/02-nav-css.css` line 37, remove `filter: brightness(0) invert(1);` from `.nav-logo-img`. Keep `transition: filter 0.4s ease;`.

- [ ] **Step 3: Update dropdown-open logo state**

In `v7-sections/02-nav-css.css` lines 95-97, the dropdown-open state applies `filter: brightness(0)` to make the logo dark on the cream dropdown background. Keep this rule — it ensures visibility on the light dropdown background. If the colored logo already works on cream, remove it later.

- [ ] **Step 4: Update preloader JS filter**

In `avorino-v7-footer.js`, inside the `initPreloader()` function, find where column inner divs are created with `filter:brightness(0) invert(1)` in the inline `style.cssText` string. Remove this filter. Change:
```javascript
inner.style.cssText = '...filter:brightness(0) invert(1);';
```
to:
```javascript
inner.style.cssText = '...'; // remove the filter property
```

- [ ] **Step 5: Commit**

```bash
git add v7-sections/01-preloader-css.css v7-sections/02-nav-css.css avorino-v7-footer.js
git commit -m "feat: show colored Avorino logo, remove monochrome filters"
```

---

### Task 5: Nav Hover → Red + Fix Blend Mode

**Files:**
- Modify: `v7-sections/02-nav-css.css:15,51,58-60,84-86,88-93`
- Modify: `avorino-nav.js:13,118-125`

- [ ] **Step 1: Remove mix-blend-mode from nav**

In `v7-sections/02-nav-css.css` line 15, remove `mix-blend-mode: difference;` from `.site-nav`.

- [ ] **Step 2: Add red hover color**

In `v7-sections/02-nav-css.css` lines 58-60, change:
```css
nav.site-nav .nav-link:hover {
  opacity: 1;
}
```
to:
```css
nav.site-nav .nav-link:hover {
  opacity: 1;
  color: #c8222a !important;
}
```

- [ ] **Step 3: Add scrolled state CSS**

In `v7-sections/02-nav-css.css`, replace the comment block at lines 84-86 with:
```css
/* ── Scrolled State: dark frosted glass ── */
nav.site-nav.nav--scrolled {
  background-color: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

- [ ] **Step 4: Update scroll threshold in nav JS**

In `avorino-nav.js` line 13, change `SCROLL_TOP = 10` to use the hero height dynamically. Replace the `onScroll` function (lines 118-125) with:
```javascript
function onScroll() {
  var hero = document.querySelector('.hero');
  var threshold = hero ? hero.offsetHeight * 0.5 : 100;
  if (window.scrollY > threshold) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
  ticking = false;
}
```

- [ ] **Step 5: Add dropdown hover colors**

In `v7-sections/02-nav-css.css`, inside the dropdown-open state rules (after line 101), add:
```css
nav.site-nav.nav--dropdown-open .nav-link:hover {
  color: #c8222a !important;
}
```

- [ ] **Step 6: Commit**

```bash
git add v7-sections/02-nav-css.css avorino-nav.js
git commit -m "feat: nav hover red, remove blend mode, add scroll state"
```

---

### Task 6: Verify Resources Dropdown Animation

**Files:**
- Check: `avorino-nav.js:33-51`
- Check: `v7-sections/02-nav-css.css:174-183`

- [ ] **Step 1: Verify existing stagger works for Resources**

Read `avorino-nav.js` lines 42-51. The `openDropdown()` function queries `.nav-dd-link` inside the dropdown. The Resources dropdown contains `.nav-dd-link` elements (see `02-nav-html.html` lines 159-165). The CSS animation `navItemFadeUp` (line 174-183) applies to `.nav-item.is-open .nav-dd-link`. This should already work.

Test by opening the live site or checking the DOM structure. If it works, mark this task as complete with no changes.

- [ ] **Step 2: If broken, fix the query selector**

If the Resources dropdown doesn't animate, check if `.nav-dd-divider` inside Resources is causing issues. The divider at line 163 of the nav HTML should match the query selector in JS line 46.

- [ ] **Step 3: Commit (only if changes were made)**

---

## Chunk 2: Font Size Bump

### Task 7: Tiered Font Size Bump — Section CSS Files

**Files:**
- Modify: `v7-sections/01-preloader-css.css`
- Modify: `v7-sections/02-nav-css.css`
- Modify: `v7-sections/03-hero-css.css`
- Modify: `v7-sections/04-about-css.css`
- Modify: `v7-sections/05-services-css.css`
- Modify: `v7-sections/06-stats-css.css`
- Modify: `v7-sections/07-featured-css.css`
- Modify: `v7-sections/08-process-css.css`
- Modify: `v7-sections/09-testimonials-css.css`
- Modify: `v7-sections/10-tools-css.css`
- Modify: `v7-sections/11-cta-css.css`
- Modify: `v7-sections/12-footer-css.css`

**Tiered strategy:**
- <= 12px: +2px (e.g., 9px→11px, 10px→12px, 11px→13px, 12px→14px)
- 13-16px: +3px (e.g., 13px→16px, 14px→17px, 15px→18px, 16px→19px)
- 17px+: +4px (e.g., 17px→21px, 18px→22px, 20px→24px, 44px→48px, 96px→100px)
- `clamp()`: bump min/max by tier, scale vw proportionally

- [ ] **Step 1: Bump fonts in preloader CSS**

`01-preloader-css.css`:
- `.cursor-ring span` font-size 9px — DELETED in Task 1, skip

- [ ] **Step 2: Bump fonts in nav CSS**

`02-nav-css.css` — find all `font-size` declarations and apply tier:
- `.nav-dd-label` 10px → 12px (+2)
- `.nav-link` 14px → 17px (+3)
- `.nav-cta` 14px → 17px (+3)
- `.nav-dd-link` 14px → 17px (+3)
- `.nav-dd-link--featured` 18px → 22px (+4)
- `.nav-dd-service-title` 16px → 19px (+3)
- `.nav-dd-service-desc` 13px → 16px (+3)
- `.nav-dd-city` 13px → 16px (+3)
- `.nav-mobile-label` 10px → 12px (+2)
- `.nav-mobile-overlay .nav-mobile-group > a` 20px → 24px (+4)
- `.nav-mobile-city-grid a` 15px → 18px (+3)
- `.nav-mobile-cta` 16px → 19px (+3)
- `.nav-mobile-accordion-icon` 20px → 24px (+4)
- Responsive overrides at 767px: `18px→22px`, `14px→17px`
- Responsive overrides at 478px: `17px→21px`, `13px→16px`

- [ ] **Step 3: Bump fonts in process CSS**

`08-process-css.css`:
- `.process-intro` 17px → 21px (+4)
- `.process-num` 96px → 100px (+4)
- `.process-slide-title` 44px → 48px (+4)
- `.process-slide-body` 17px → 21px (+4)
- `.process-bar-dot span` 11px → 13px (+2)

- [ ] **Step 4: Bump fonts in testimonials CSS**

`09-testimonials-css.css`:
- `.testimonials-count` 14px → 17px (+3)
- `.testimonial-stars` 18px → 22px (+4)
- `.testimonial-author` 14px → 17px (+3)
- `.testimonial-location` 14px → 17px (+3)
- `.testimonial-arrow` 14px → 17px (+3)

- [ ] **Step 5: Bump fonts in remaining section CSS files**

Apply the same tiered strategy to all `font-size` declarations in:
- `03-hero-css.css`
- `04-about-css.css`
- `05-services-css.css`
- `06-stats-css.css`
- `07-featured-css.css`
- `10-tools-css.css`
- `11-cta-css.css`
- `12-footer-css.css`

Read each file, find all `font-size` declarations, apply the tier.

- [ ] **Step 6: Commit**

```bash
git add v7-sections/*-css.css
git commit -m "feat: tiered font size bump across all section CSS"
```

---

### Task 8: Font Size Bump — CDN CSS Files

**Files:**
- Modify: `avorino-responsive.css`
- Modify: `avorino-v7-footer.css`
- Modify: `avorino-nav-footer.css`

- [ ] **Step 1: Bump fonts in avorino-responsive.css**

Read the file, find all `font-size` declarations (expect 70+), apply the tiered bump. Pay special attention to:
- `clamp()` values — bump min and max by tier, scale vw value proportionally
- Responsive overrides at each breakpoint (991px, 767px, 478px)
- Check for any `font-size` that would cause nav overflow at 991px

- [ ] **Step 2: Bump fonts in avorino-v7-footer.css**

Same approach — find all `font-size` declarations, apply tier.

- [ ] **Step 3: Bump fonts in avorino-nav-footer.css**

Same approach. May overlap with nav CSS — check for duplicate rules.

- [ ] **Step 4: Commit**

```bash
git add avorino-responsive.css avorino-v7-footer.css avorino-nav-footer.css
git commit -m "feat: tiered font size bump in CDN CSS files"
```

---

## Chunk 3: Preloader Rewrite

### Task 9: Blueprint Wireframe Preloader

**Files:**
- Modify: `v7-sections/01-preloader-html.html`
- Modify: `v7-sections/01-preloader-css.css`
- Modify: `avorino-v7-footer.js` (replace entire `initPreloader()` function)

**IMPORTANT:** Line numbers in `avorino-v7-footer.js` will have shifted from Tasks 1 and 4. Use function names as anchors, not line numbers. Find `function initPreloader()` by searching for that string.

- [ ] **Step 1: Update preloader HTML with blueprint SVG**

Replace the preloader markup in `v7-sections/01-preloader-html.html` with:

```html
<!-- Preloader — Blueprint Wireframe Build -->
<div class="preloader" data-el="preloader">
  <div class="preloader-content" data-el="preloader-content">
    <!-- Blueprint grid background -->
    <div class="preloader-grid" data-el="preloader-grid"></div>
    <!-- House wireframe SVG -->
    <svg class="preloader-house" data-el="preloader-house" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Foundation -->
      <line class="house-foundation" x1="30" y1="190" x2="270" y2="190" stroke="#f0ede8" stroke-width="2" stroke-dasharray="240" stroke-dashoffset="240"/>
      <!-- Left wall -->
      <line class="house-wall house-wall-l" x1="50" y1="190" x2="50" y2="80" stroke="#f0ede8" stroke-width="1.5" stroke-dasharray="110" stroke-dashoffset="110"/>
      <!-- Right wall -->
      <line class="house-wall house-wall-r" x1="250" y1="190" x2="250" y2="80" stroke="#f0ede8" stroke-width="1.5" stroke-dasharray="110" stroke-dashoffset="110"/>
      <!-- Roof left -->
      <line class="house-roof house-roof-l" x1="150" y1="30" x2="40" y2="85" stroke="#f0ede8" stroke-width="2" stroke-linecap="round" stroke-dasharray="125" stroke-dashoffset="125"/>
      <!-- Roof right -->
      <line class="house-roof house-roof-r" x1="150" y1="30" x2="260" y2="85" stroke="#f0ede8" stroke-width="2" stroke-linecap="round" stroke-dasharray="125" stroke-dashoffset="125"/>
      <!-- Door -->
      <rect class="house-door" x="125" y="130" width="50" height="60" rx="3" stroke="#f0ede8" stroke-width="1.5" fill="none" opacity="0"/>
      <!-- Window left -->
      <rect class="house-window" x="70" y="110" width="35" height="30" rx="2" stroke="#f0ede8" stroke-width="1" fill="none" opacity="0"/>
      <!-- Window right -->
      <rect class="house-window" x="195" y="110" width="35" height="30" rx="2" stroke="#f0ede8" stroke-width="1" fill="none" opacity="0"/>
    </svg>
    <!-- Logo appears after wireframe -->
    <div class="preloader-logo-wrap" data-el="preloader-logo-wrap">
      <img src="https://placeholder.com/avorino-logo.svg" alt="Avorino" class="preloader-logo-img">
    </div>
  </div>
  <div class="preloader-curtain" data-el="preloader-curtain"></div>
</div>
```

- [ ] **Step 2: Update preloader CSS**

Replace preloader styles in `v7-sections/01-preloader-css.css` (keeping preloader base styles, replacing text-specific ones):

```css
/* ── Preloader ── */
.preloader {
  position: fixed;
  inset: 0;
  background-color: #111111;
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preloader-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.preloader-grid {
  position: absolute;
  inset: -50%;
  background-image:
    linear-gradient(rgba(240,237,232,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240,237,232,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0;
}

.preloader-house {
  width: 200px;
  height: auto;
}

.preloader-logo-wrap {
  opacity: 0;
  transform: scale(0.9);
}

.preloader-logo-img {
  height: 48px;
  width: auto;
  display: block;
}

.preloader-curtain {
  position: absolute;
  inset: 0;
  background-color: #111111;
  z-index: 1;
}
```

- [ ] **Step 3: Rewrite initPreloader() in footer JS**

In `avorino-v7-footer.js`, find `function initPreloader()` and replace the entire function (from `function initPreloader() {` to its closing `}` just before `// HERO ENTRANCE`) with:

```javascript
// PRELOADER — Blueprint Wireframe Build
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const curtain = document.querySelector('.preloader-curtain');
  if (preloader) gsap.set(preloader, { display: 'flex' });

  if (!preloader) {
    initScrollAnimations();
    initHeroEntrance();
    return;
  }

  // Skip animation for repeat visitors in same session
  if (sessionStorage.getItem('avorino-visited')) {
    gsap.set(preloader, { display: 'none' });
    lenis.start();
    initScrollAnimations();
    initHeroContentEntrance();
    return;
  }
  sessionStorage.setItem('avorino-visited', '1');

  lenis.stop();

  const grid = preloader.querySelector('[data-el="preloader-grid"]');
  const house = preloader.querySelector('[data-el="preloader-house"]');
  const logoWrap = preloader.querySelector('[data-el="preloader-logo-wrap"]');
  const foundation = house.querySelector('.house-foundation');
  const walls = house.querySelectorAll('.house-wall');
  const roofLines = house.querySelectorAll('.house-roof');
  const door = house.querySelector('.house-door');
  const windows = house.querySelectorAll('.house-window');

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = 'none';
      lenis.start();
      initScrollAnimations();
    }
  });

  // 0s: Blueprint grid fades in
  tl.to(grid, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);

  // 0.3s: Foundation draws left→right
  tl.to(foundation, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.3);

  // 0.7s: Walls draw upward
  tl.to(walls, { strokeDashoffset: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 0.7);

  // 1.0s: Roof draws from peak outward
  tl.to(roofLines, { strokeDashoffset: 0, duration: 0.4, stagger: 0.05, ease: 'power2.inOut' }, 1.0);

  // 1.3s: Door and windows fade in
  tl.to(door, { opacity: 0.6, duration: 0.3, ease: 'power2.out' }, 1.3);
  tl.to(windows, { opacity: 0.5, duration: 0.25, stagger: 0.1, ease: 'power2.out' }, 1.4);

  // 1.7s: Lines glow red briefly
  tl.to(house.querySelectorAll('line, rect'), {
    stroke: '#c8222a', duration: 0.3, ease: 'power2.out'
  }, 1.7);
  tl.to(house.querySelectorAll('line, rect'), {
    stroke: '#f0ede8', duration: 0.4, ease: 'power2.out'
  }, 2.0);

  // 2.2s: Wireframe fades + scales down, logo fades in
  tl.to(house, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' }, 2.2);
  tl.to(grid, { opacity: 0, duration: 0.3 }, 2.2);
  tl.to(logoWrap, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 2.4);

  // 3.0s: Hold logo briefly, then exit
  tl.to({}, { duration: 0.4 }, 3.0);
  tl.to(logoWrap, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 3.4);
  tl.set(preloader, { background: 'transparent' });
  if (curtain) tl.to(curtain, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 3.4);
  initHeroContentEntrance();
}
```

- [ ] **Step 4: Commit**

```bash
git add v7-sections/01-preloader-html.html v7-sections/01-preloader-css.css avorino-v7-footer.js
git commit -m "feat: blueprint wireframe preloader with sessionStorage skip"
```

---

## Chunk 4: Process Section Improvements

### Task 10: Animated Step Transitions + Thicker Bar + Faster Scroll

**Files:**
- Modify: `v7-sections/08-process-css.css` (`.process-bar-track` and `.process-bar-fill` rules)
- Modify: `avorino-v7-footer.js` (find `initProcessTimeline()` function)

**IMPORTANT:** Line numbers in `avorino-v7-footer.js` will have shifted significantly from previous tasks. Always search by function name (`function initProcessTimeline()`) rather than line number.

- [ ] **Step 1: Thicken the progress bar track**

In `v7-sections/08-process-css.css`:
- Find `.process-bar-track` rule, change `height: 1px` → `height: 4px`
- Find `.process-bar-fill` rule, change `height: 1px` → `height: 4px`

- [ ] **Step 2: Enhance step transition animations**

In `avorino-v7-footer.js`, inside `initProcessTimeline()`, find the `if (step !== currentStep)` block. Inside that block, find the `// Slide crossfade` comment and the `slides.forEach(...)` + `// Illustration crossfade` + `illusEls.forEach(...)` sections. Replace both forEach blocks with the enhanced animations below. Note: the `var prev = currentStep;` line above these loops provides the `prev` variable used in the replacement code:

```javascript
// Slide transition with direction-aware entrance/exit
slides.forEach(function(slide, i) {
  if (i === step) {
    // Incoming: fade in + slide from right
    gsap.fromTo(slide,
      { opacity: 0, x: 40, filter: 'blur(4px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', overwrite: true }
    );
    slide.classList.add('is-active');
  } else if (i === prev) {
    // Outgoing: fade out + slide left
    gsap.to(slide, {
      opacity: 0, x: -40, filter: 'blur(4px)',
      duration: 0.35, ease: 'power2.in', overwrite: true
    });
    slide.classList.remove('is-active');
  } else {
    gsap.set(slide, { opacity: 0 });
    slide.classList.remove('is-active');
  }
});

// Illustration transition with scale
illusEls.forEach(function(el, i) {
  if (i === step) {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: true }
    );
    if (illusTimelines[i]) illusTimelines[i].progress(0);
  } else if (i === prev) {
    gsap.to(el, {
      opacity: 0, scale: 0.9,
      duration: 0.3, ease: 'power2.in', overwrite: true
    });
  } else {
    gsap.set(el, { opacity: 0 });
  }
});
```

- [ ] **Step 3: Reduce scroll-pin distance**

In `avorino-v7-footer.js`, inside `initProcessTimeline()`, find the `ScrollTrigger.create()` call. Find the `end` property which currently reads `'+=' + (window.innerHeight * 2.5)`. Change it to:
```javascript
end: function() { return '+=' + (window.innerHeight * 1.5); },
```

This cuts the scroll distance from 2.5x viewport to 1.5x, making it feel snappier. Adjust if transitions feel too rushed — try `1.8` as a middle ground.

- [ ] **Step 4: Commit**

```bash
git add v7-sections/08-process-css.css avorino-v7-footer.js
git commit -m "feat: animated process transitions, thicker bar, faster scroll"
```

---

## Chunk 5: 25-Review Carousel

### Task 11: Replace 4-Slide Testimonial with 25-Review Carousel

**Files:**
- Modify: `v7-sections/09-testimonials-html.html`
- Modify: `v7-sections/09-testimonials-css.css`
- Modify: `avorino-v7-footer.js` (replace `initTestimonials()` function)

- [ ] **Step 1: Update testimonials HTML**

Replace the content of `v7-sections/09-testimonials-html.html` with a structure that JS will populate:

```html
<section class="testimonials" id="testimonials">
  <div class="float-el float-el--cross float-testimonials-1" data-el="float-el"></div>
  <div class="float-el float-el--dot float-testimonials-2" data-el="float-el"></div>
  <div class="testimonials-grid">
    <div class="testimonials-left">
      <div class="testimonials-label" data-animate="fade-up">// Client Reviews</div>
      <div class="testimonials-heading" data-animate="blur-focus">
        <div>What our clients</div>
        <div>say about us</div>
      </div>
      <p class="testimonials-count" data-animate="fade-up">4.8 average from 35+ five-star reviews.</p>
    </div>
    <div class="testimonial-card" data-el="testimonial-card">
      <!-- JS injects review slides here -->
      <div class="testimonial-slides-wrap" data-el="testimonial-slides-wrap"></div>
      <!-- Nav -->
      <div class="testimonial-nav">
        <div class="testimonial-counter" data-el="testimonial-counter">01 / 25</div>
        <div class="testimonial-arrows">
          <button class="testimonial-arrow" data-el="testimonial-arrow" data-dir="prev" aria-label="Previous review">&#8249;</button>
          <button class="testimonial-arrow" data-el="testimonial-arrow" data-dir="next" aria-label="Next review">&#8250;</button>
        </div>
      </div>
      <!-- Progress bar -->
      <div class="testimonial-progress">
        <div class="testimonial-progress-fill" data-el="testimonial-progress-fill"></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Update testimonials CSS**

Replace `v7-sections/09-testimonials-css.css` with updated styles. Key changes:
- Remove `position: sticky` from `.testimonials-left`
- Replace dots with counter styling
- Add progress bar styles
- Keep the dark card design

```css
/* Avorino v7 — Testimonials (HTMLtoFlow Section CSS) */

.testimonials {
  padding: 128px 80px;
  background-color: #e8e4df;
  color: #111111;
  position: relative;
  overflow: hidden;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 96px;
  align-items: start;
}

.testimonials-left {
  padding-top: 48px;
}

.testimonials-label {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #111111;
  opacity: 0.4;
  margin-bottom: 32px;
}

.testimonials-heading {
  font-family: 'DM Serif Display', Georgia, serif;
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #111111;
  margin-bottom: 32px;
}

.testimonials-heading > div {
  font-family: 'DM Serif Display', Georgia, serif;
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #111111;
}

.testimonials-count {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 400;
  font-size: 17px;
  color: #111111;
  opacity: 0.55;
}

.testimonial-card {
  background-color: #111111;
  border-radius: 8px;
  color: #f0ede8;
  position: relative;
  overflow: hidden;
  min-height: 460px;
}

.testimonial-slides-wrap {
  position: relative;
  min-height: 360px;
}

.testimonial-slide {
  position: absolute;
  inset: 0;
  padding: 64px 64px 100px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.testimonial-slide.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}

.testimonial-stars {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 22px;
  letter-spacing: 4px;
  margin-bottom: 32px;
  color: #c8222a;
}

.testimonial-quote {
  font-family: 'DM Serif Display', Georgia, serif;
  font-weight: 400;
  font-style: italic;
  line-height: 1.7;
  color: #f0ede8;
  opacity: 0.8;
  margin-bottom: 48px;
  flex: 1;
}

.testimonial-author {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 400;
  font-size: 17px;
  letter-spacing: 0.04em;
  color: #f0ede8;
  opacity: 0.7;
  margin-bottom: 2px;
}

.testimonial-location {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 400;
  font-size: 17px;
  color: #f0ede8;
  opacity: 0.45;
}

.testimonial-nav {
  position: absolute;
  bottom: 48px;
  left: 64px;
  right: 64px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.testimonial-counter {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #f0ede8;
  opacity: 0.4;
}

.testimonial-arrows {
  display: flex;
  gap: 8px;
}

.testimonial-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(240, 237, 232, 0.15);
  background-color: transparent;
  color: #f0ede8;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.testimonial-arrow:hover {
  border-color: rgba(240, 237, 232, 0.4);
  background-color: rgba(240, 237, 232, 0.05);
}

.testimonial-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(240, 237, 232, 0.06);
}

.testimonial-progress-fill {
  height: 100%;
  background: #c8222a;
  width: 0%;
  transition: width 0.4s ease;
}

/* ── Float Instances ── */
.float-testimonials-1 {
  top: 15%;
  left: 5%;
  color: rgba(17,17,17,0.12);
}

.float-testimonials-2 {
  bottom: 20%;
  right: 8%;
  background-color: rgba(17,17,17,0.12);
  color: rgba(17,17,17,0.12);
}

/* ── Responsive — Tablet (<=991px) ── */
@media (max-width: 991px) {
  .testimonials { padding: 80px 48px; }
  .testimonials-grid { grid-template-columns: 1fr; gap: 48px; }
  .testimonials-left { padding-top: 0; }
}

/* ── Responsive — Mobile (<=767px) ── */
@media (max-width: 767px) {
  .testimonials { padding: 64px 24px; }
  .testimonial-slide { padding: 48px 36px 88px; }
  .testimonial-nav { left: 36px; right: 36px; bottom: 36px; }
}

/* ── Responsive — Mobile Portrait (<=478px) ── */
@media (max-width: 478px) {
  .testimonials { padding: 48px 16px; }
  .testimonial-card { min-height: 400px; }
  .testimonial-slide { padding: 36px 24px 80px; }
  .testimonial-nav { left: 24px; right: 24px; bottom: 24px; }
}
```

- [ ] **Step 3: Rewrite initTestimonials() with all 25 reviews**

In `avorino-v7-footer.js`, find `function initTestimonials()` and replace the entire function (from the function declaration to its closing `}` just before `// INIT`) with:

```javascript
// TESTIMONIAL CAROUSEL — 25 Reviews
function initTestimonials() {
  var REVIEWS = [
    { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Irvine, CA' },
    { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. Our architect made mistakes on the plans but Raja and team helped work through all issues. I highly recommend them.', author: 'Sam W.', location: 'Oakland, CA' },
    { quote: 'These guys helped us out, converting our one car garage into a junior ADU. The city was difficult to work with, and they took care of everything. Raja was excellent and easy to work with. Their cost was very competitive. I would definitely work with them again.', author: 'Alex D.', location: 'Los Angeles, CA' },
    { quote: 'We had Avorino build us an ADU in our property recently. They provided the full design and rendering. They pulled permits and built our 1,000 sqft ADU from start to finish. They are really easy to work with and their prices are very competitive.', author: 'Ray W.', location: 'Irvine, CA' },
    { quote: 'This was my first kitchen remodeling experience and I was very nervous. From the first time I made contact, it was a smooth and professional experience. They executed my vision in every detail. The work was completed in less time than estimated and perfectly within budget.', author: 'Tina C.', location: 'Dana Point, CA' },
    { quote: 'What a wonderful experience working with Raja and his team! Raja was extremely professional, timely, and had clear communication the entire time. My parents were so happy with how their ADU turned out and I am impressed with the care and service I received!', author: 'Alarah R.', location: 'Orange County, CA' },
    { quote: "It's so rare to find a contractor that you have a good experience with. They got the work done quickly and made sure every little detail was completed without me having to be on top of them. I highly recommend and will definitely use them again!", author: 'Nikki B.', location: 'Laguna Niguel, CA' },
    { quote: 'These are the best people in the business. They beat every single price that I got on top of that they did an excellent job finishing it in no time. They are truly the best of the best, highly recommended.', author: 'Shahin S.', location: 'Los Angeles, CA' },
    { quote: 'Avorino built me a custom home. We loved how great they executed our project. We were impressed that they finished before the estimated timeline. They communicated every step. Love this company.', author: 'Hooman E.', location: 'Irvine, CA' },
    { quote: 'Raja and William were great to work with. After our consultation they started the work within a week. They were professional, courteous, and precise. The job turned out great. I would totally recommend them.', author: 'Ryan J.', location: 'Brentwood, CA' },
    { quote: 'They responded very quickly and showed up the next day to give a quote. Always responded and showed up on time. The job was done on time and I love the fine look and clear way of working. I highly recommend this business!', author: 'Pazit B.', location: 'Irvine, CA' },
    { quote: "Raja was attentive, responsive and communicative with the entire process. He gave us good ideas throughout and supported us in selecting the various fixtures and tiles. We've been thrilled with how the kitchen has turned out!", author: 'Peeb P.', location: 'Irvine, CA' },
    { quote: 'William and Raja are hands down the best around! They are with you from start to finish and are incredibly helpful, communicative and understanding. We have used them for multiple projects at home and at our two businesses.', author: 'Kristle J.', location: 'San Clemente, CA' },
    { quote: 'Did a bathroom remodel. Full service company. Accommodates changes along the way, and fixing anything we point out or that we wanted changed. Fast and things get done, thanks Raja!', author: 'Tony H.', location: 'Irvine, CA' },
    { quote: 'They did an excellent job and actually at a good price. We did a retile plus new fixtures and it came out looking like a high end resort bathroom.', author: 'Amy D.', location: 'San Clemente, CA' },
    { quote: 'They were exceptional. The expertise, responsiveness, professionalism, cleanliness, creative and ingenuity is top of the line. Their work is so good and most important, honest.', author: 'Boris B.', location: 'Newport Beach, CA' },
    { quote: 'Such a professional and creative team! They walked into my house with confidence that they would remodel my horrific 1960s fireplace to a clean cut, modern, cozy and budget friendly replacement. And so they did!', author: 'Teri N.', location: 'Irvine, CA' },
    { quote: 'William and his team did a spectacular job on our new front porch! I rehired him due to his responsiveness, honesty and speedy, quality work! His team got our porch done in literally a day and a half.', author: 'Courtney C.', location: 'Mission Viejo, CA' },
    { quote: "Raja and Amir are easily the most friendly and up front contractors we've worked with. Highly recommend them for being super easy to work with and good quality.", author: 'Allen D.', location: 'San Clemente, CA' },
    { quote: 'This company is VERY communicative, professional and cost friendly. They got the job done in a timely manner. Every pre-existing issue I had they went over and beyond to fix. 100/100 across the board.', author: 'Jeremy C.', location: 'Long Beach, CA' },
    { quote: 'Raja and his team came in with a reasonable price and worked after hours to get the job done! His team was respectful, clean, and worked after hours. I cannot recommend them enough.', author: 'Behrooz S.', location: 'Huntington Beach, CA' },
    { quote: "We had them complete our media wall and absolutely loved working with their team! They were so professional from the beginning and set very realistic expectations. Our final product was better than I had imagined.", author: 'Srishti P.', location: 'Burbank, CA' },
    { quote: 'I am very happy with my decision and the final outcome is fabulous! All the workers were on time, professional and respectful. The work is top notch!', author: 'Theresa F.', location: 'Laguna Niguel, CA' },
    { quote: "Raja gave me the kitchen of my dreams. I couldn't have made a better decision. He was honest and very easy to work with. They were always on time and completed the work in record time.", author: 'Sonia H.', location: 'Irvine, CA' },
    { quote: 'William was wonderful in relieving my fears and reassuring me they could take care of everything! He was professional as was his crew. I would certainly recommend them!', author: 'Marcia R.', location: 'San Clemente, CA' },
  ];

  var card = document.querySelector('[data-el="testimonial-card"]');
  if (!card) return;

  var slidesWrap = card.querySelector('[data-el="testimonial-slides-wrap"]');
  var counterEl = card.querySelector('[data-el="testimonial-counter"]');
  var progressFill = card.querySelector('[data-el="testimonial-progress-fill"]');
  var arrows = card.querySelectorAll('[data-el="testimonial-arrow"]');
  var total = REVIEWS.length;
  var current = 0;
  var isAnimating = false;
  var cycleCount = 0;

  // Build slides
  REVIEWS.forEach(function(review, i) {
    var slide = document.createElement('div');
    slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML =
      '<div class="testimonial-stars">\u2605\u2605\u2605\u2605\u2605</div>' +
      '<blockquote class="testimonial-quote">\u201C' + review.quote + '\u201D</blockquote>' +
      '<div><p class="testimonial-author">\u2014 ' + review.author + '</p>' +
      '<p class="testimonial-location">' + review.location + '</p></div>';
    slidesWrap.appendChild(slide);
  });

  var slides = slidesWrap.querySelectorAll('.testimonial-slide');

  function updateCounter() {
    if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    if (progressFill) progressFill.style.width = ((current + 1) / total * 100) + '%';
  }
  updateCounter();

  // Auto-advance
  var autoTimer = null;
  function startAuto() {
    stopAuto();
    if (cycleCount >= total) return; // stop after one full rotation
    autoTimer = setInterval(function() {
      var next = current + 1 < total ? current + 1 : 0;
      if (next === 0) cycleCount += current + 1;
      goToSlide(next);
      if (cycleCount >= total) stopAuto();
    }, 5000);
  }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  function resetAuto() { stopAuto(); startAuto(); }

  function goToSlide(target) {
    if (target === current || isAnimating || target < 0 || target >= total) return;
    isAnimating = true;
    var dir = target > current ? 1 : -1;
    var oldSlide = slides[current];
    var newSlide = slides[target];

    gsap.to(oldSlide, {
      opacity: 0, x: -20 * dir, duration: 0.35, ease: 'power2.in',
      onComplete: function() {
        oldSlide.classList.remove('active');
        gsap.set(oldSlide, { x: 0 });
        newSlide.classList.add('active');
        gsap.fromTo(newSlide,
          { opacity: 0, x: 20 * dir },
          { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out',
            onComplete: function() { current = target; updateCounter(); isAnimating = false; }
          }
        );
      }
    });
  }

  // Arrow navigation
  arrows.forEach(function(arrow) {
    arrow.addEventListener('click', function(e) {
      e.stopPropagation();
      resetAuto();
      cycleCount = 0; // reset cycle on manual interaction
      if (arrow.getAttribute('data-dir') === 'next') goToSlide(current + 1 < total ? current + 1 : 0);
      else goToSlide(current - 1 >= 0 ? current - 1 : total - 1);
    });
  });

  // Pause on hover
  card.addEventListener('mouseenter', stopAuto);
  card.addEventListener('mouseleave', function() { cycleCount = 0; startAuto(); });

  startAuto();
}
```

- [ ] **Step 4: Commit**

```bash
git add v7-sections/09-testimonials-html.html v7-sections/09-testimonials-css.css avorino-v7-footer.js
git commit -m "feat: 25-review carousel with counter, progress bar, auto-cycle"
```

---

## Chunk 6: Final Verification

### Task 12: Cross-Check and CDN Deploy Prep

- [ ] **Step 1: Verify all files are saved and consistent**

Read through each modified file to ensure no conflicts between tasks (especially `avorino-v7-footer.js` which is modified in Tasks 1, 4, 9, 10, and 11).

- [ ] **Step 2: Run a final diff to review all changes**

```bash
git diff HEAD~11 --stat
```

Verify the list of changed files matches expectations.

- [ ] **Step 3: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: final cleanup for homepage refinements"
```

- [ ] **Step 4: Note CDN hash update needed**

After pushing to GitHub, the CDN hash in all Webflow page head/footer code blocks needs updating from the current hash to the new commit hash. This is done via the Webflow Designer Extension or manually in Webflow page settings.
