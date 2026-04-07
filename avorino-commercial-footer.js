(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ── Preserve original text before avorino-animations.js modifies DOM ── */
  document.querySelectorAll('#cm-hero h1, #cm-comparison h2, #cm-precon h2, #cm-types h2, #cm-fit h2, #cm-process h2, .av-cta-heading').forEach(function(el) {
    if (!el.dataset.origText) el.dataset.origText = el.textContent.trim();
  });

  /* ── Remove data-animate from elements this script handles ── */
  document.querySelectorAll('#cm-trust-strip [data-animate], .cm-comparison-row, .cm-proof-stat, .cm-type-item, .cm-fit-item, .cm-fit-proof, .cm-process-step, .av-cta-heading, .av-cta-btn, .av-cta-btns, .av-cta-subtitle').forEach(function(el) {
    el.removeAttribute('data-animate');
  });

  /* ═══════════════════════════════════════════════
     SHARED RUNTIME STATE
     ═══════════════════════════════════════════════ */
  var MOBILE_BP = 768;
  var runtime = {
    lenis: null,
    heroRenderer: null,
    heroRaf: null,
    heroDisposed: false,
    preconRenderer: null,
    preconTriggers: [],
    isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isMobile: window.innerWidth < MOBILE_BP,
    onHeroResize: null,
  };
  var resizeTimer = null;

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
  function initLenis() {
    if (window.__lenis) { try { window.__lenis.destroy(); } catch(e) {} }
    var lenis = new Lenis({
      duration: 1.4,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smooth: true, smoothTouch: false,
    });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.addEventListener('refresh', function() { lenis.resize(); });
    return lenis;
  }

  /* ═══════════════════════════════════════════════
     TEXT UTILITIES
     ═══════════════════════════════════════════════ */
  function splitIntoChars(el) {
    var text = el.dataset.origText || el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex'; el.style.flexWrap = 'wrap'; el.style.gap = '0 0.3em';
    var charEls = [];
    text.split(/\s+/).forEach(function(word) {
      var wordWrap = document.createElement('span');
      wordWrap.style.display = 'inline-flex'; wordWrap.style.overflow = 'hidden';
      for (var i = 0; i < word.length; i++) {
        var cs = document.createElement('span');
        cs.style.display = 'inline-block'; cs.textContent = word[i];
        wordWrap.appendChild(cs); charEls.push(cs);
      }
      el.appendChild(wordWrap);
    });
    return charEls;
  }

  function splitIntoWords(el) {
    var text = el.dataset.origText || el.textContent.trim();
    var align = window.getComputedStyle(el).textAlign;
    el.innerHTML = '';
    el.style.display = 'flex'; el.style.flexWrap = 'wrap'; el.style.gap = '0 0.3em';
    if (align === 'center') el.style.justifyContent = 'center';
    var wordEls = [];
    text.split(/\s+/).forEach(function(word) {
      var wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block'; wrapper.style.overflow = 'hidden'; wrapper.style.verticalAlign = 'top';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block'; inner.textContent = word;
      wrapper.appendChild(inner); el.appendChild(wrapper);
      wordEls.push(inner);
    });
    return wordEls;
  }

  /* ═══════════════════════════════════════════════
     HERO LIFECYCLE
     Two teardown paths:
       teardownHero()           — reversible (breakpoint resize)
       disposeHeroPermanently() — one-way (scroll past comparison)
     ═══════════════════════════════════════════════ */
  function teardownHero(rt) {
    if (rt.heroRaf) { cancelAnimationFrame(rt.heroRaf); rt.heroRaf = null; }
    if (rt.onHeroResize) rt.onHeroResize = null;
    if (rt.heroRenderer) {
      rt.heroRenderer.dispose();
      rt.heroRenderer.forceContextLoss();
      rt.heroRenderer.domElement.remove();
      rt.heroRenderer = null;
    }
  }

  function disposeHeroPermanently(rt) {
    if (rt.heroDisposed) return;
    teardownHero(rt);
    rt.heroDisposed = true;
  }

  /* ═══════════════════════════════════════════════
     PRECON LIFECYCLE
     ═══════════════════════════════════════════════ */
  function teardownPrecon(rt) {
    if (rt._preconTickerRef) {
      gsap.ticker.remove(rt._preconTickerRef);
      rt._preconTickerRef = null;
    }
    rt.preconTriggers.forEach(function(st) { st.kill(); });
    rt.preconTriggers = [];
    if (rt.preconRenderer) {
      rt.preconRenderer.dispose();
      rt.preconRenderer.forceContextLoss();
      rt.preconRenderer.domElement.remove();
      rt.preconRenderer = null;
    }
  }

  function reconcilePrecon(rt) {
    var wasMobile = rt.isMobile;
    rt.isMobile = window.innerWidth < MOBILE_BP;
    if (rt.isReduced) return;

    // Mobile → Desktop: init precon (and hero if never initialized)
    if (wasMobile && !rt.isMobile) {
      if (!rt.preconRenderer) initCommercialPrecon(rt);
      if (!rt.heroRenderer && !rt.heroDisposed) initCommercialHero(rt);
    }

    // Desktop → Mobile: destroy both precon and hero
    if (!wasMobile && rt.isMobile) {
      if (rt.preconRenderer) teardownPrecon(rt);
      teardownHero(rt);
    }
  }

  /* ═══════════════════════════════════════════════
     RESIZE HANDLER
     ═══════════════════════════════════════════════ */
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      reconcilePrecon(runtime);
      if (runtime.onHeroResize && !runtime.heroDisposed) runtime.onHeroResize();
      ScrollTrigger.refresh();
      runtime.lenis.resize();
    }, 250);
  }

  /* ═══════════════════════════════════════════════
     initCommercialMotion — All GSAP animations
     (trust strip, comparison, types, fit, process, CTA)
     ═══════════════════════════════════════════════ */
  function initCommercialMotion(rt) {
    var dur = rt.isReduced ? 0 : undefined;

    // ── Trust Strip: word stagger ──
    var trustWords = document.querySelectorAll('#cm-trust-strip .cm-trust-word');
    if (trustWords.length) {
      gsap.fromTo(trustWords, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-trust-strip', start: 'top 85%', once: true },
      });
    }

    // ── Comparison: row stagger with left/right offset ──
    var compRows = document.querySelectorAll('#cm-comparison .cm-comparison-row');
    compRows.forEach(function(row, i) {
      var typical = row.querySelector('.cm-comp-typical');
      var avorino = row.querySelector('.cm-comp-avorino');
      var tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      });
      if (typical) tl.fromTo(typical, { x: -20, opacity: 0 }, { x: 0, opacity: 0.4, duration: dur || 0.6, ease: 'power3.out' }, 0);
      if (avorino) tl.fromTo(avorino, { x: 20, opacity: 0 }, { x: 0, opacity: 0.85, duration: dur || 0.6, ease: 'power3.out' }, 0.1);
    });

    // ── Comparison: proof stat ──
    var proofStat = document.querySelector('#cm-comparison .cm-proof-stat');
    if (proofStat) {
      gsap.fromTo(proofStat, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: proofStat, start: 'top 90%', once: true },
      });
    }

    // ── Project Types: item stagger ──
    var typeItems = document.querySelectorAll('#cm-types .cm-type-item');
    if (typeItems.length) {
      gsap.fromTo(typeItems, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-types', start: 'top 80%', once: true },
      });
    }

    // ── Ideal Fit: item stagger ──
    var fitItems = document.querySelectorAll('#cm-fit .cm-fit-item');
    if (fitItems.length) {
      gsap.fromTo(fitItems, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-fit .cm-fit-items', start: 'top 85%', once: true },
      });
    }
    var fitProof = document.querySelector('#cm-fit .cm-fit-proof');
    if (fitProof) {
      gsap.fromTo(fitProof, { y: 15, opacity: 0 }, {
        y: 0, opacity: 0.45, duration: dur || 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: fitProof, start: 'top 90%', once: true },
      });
    }

    // ── Process: card stagger ──
    var processSteps = document.querySelectorAll('#cm-process .cm-process-step');
    if (processSteps.length) {
      gsap.fromTo(processSteps, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-process .cm-process-grid', start: 'top 85%', once: true },
      });
    }

    // ── CTA: match exact pattern from other service pages ──
    gsap.utils.toArray('.av-cta').forEach(function(cta) {
      var heading = cta.querySelector('.av-cta-heading, [class*="cta-heading"]');
      var btns = cta.querySelector('.av-cta-btns, [class*="cta-btns"]');
      var subtitle = cta.querySelector('.av-cta-subtitle, [class*="cta-subtitle"]');

      if (subtitle) {
        gsap.killTweensOf(subtitle);
        gsap.set(subtitle, { clearProps: 'all' });
        gsap.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: dur || 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: cta, start: 'top 95%', once: true } });
      }
      if (heading) {
        heading.removeAttribute('data-animate');
        gsap.killTweensOf(heading);
        gsap.set(heading, { clearProps: 'all' });
        if (heading.dataset.origText) heading.textContent = heading.dataset.origText;
        var headWords = splitIntoWords(heading);
        gsap.set(headWords, { yPercent: 100, opacity: 0 });
        gsap.to(headWords, {
          yPercent: 0, opacity: 1, duration: dur || 1.2, stagger: 0.05, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: cta, start: 'top 95%', once: true }
        });
      }
      if (btns) {
        gsap.killTweensOf(btns.children);
        gsap.set(btns.children, { clearProps: 'all' });
        gsap.fromTo(btns.children, { y: 30, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: dur || 0.8, stagger: 0.15, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: cta, start: 'top 95%', once: true }
        });
      }
    });

    // ── Precon mobile: card stagger (only runs on mobile) ──
    if (rt.isMobile) {
      var preconMobileSteps = document.querySelectorAll('.cm-precon-mobile .cm-precon-mobile-step');
      if (preconMobileSteps.length) {
        gsap.fromTo(preconMobileSteps, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: dur || 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.cm-precon-mobile', start: 'top 85%', once: true },
        });
      }
    }
  }

  /* ═══════════════════════════════════════════════
     HERO TEXT ONLY — Mobile (no Three.js)
     ═══════════════════════════════════════════════ */
  function initCommercialHeroText(rt) {
    var hero = document.getElementById('cm-hero');
    if (!hero) return;

    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('[class*="gold-line"]');
    var subtitle = hero.querySelector('[class*="subtitle"]');
    var label = hero.querySelector('[class*="label"]');
    var scrollHint = hero.querySelector('[class*="scroll-hint"]');

    if (label) { label.removeAttribute('data-animate'); gsap.fromTo(label, { opacity: 0, y: 20 }, { opacity: 0.45, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }); }
    if (h1) {
      h1.removeAttribute('data-animate');
      var chars = splitIntoChars(h1);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, { yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.025, ease: 'elastic.out(1, 0.6)', delay: 0.4 });
    }
    if (goldLine) gsap.fromTo(goldLine, { width: 0 }, { width: '80px', duration: 1.2, delay: 1.0, ease: 'power3.out' });
    if (subtitle) { subtitle.removeAttribute('data-animate'); gsap.to(subtitle, { opacity: 0.55, filter: 'blur(0px)', duration: 1.0, delay: 1.3, ease: 'power3.out' }); }
    if (scrollHint) { scrollHint.removeAttribute('data-animate'); gsap.to(scrollHint, { opacity: 0.5, duration: 0.8, delay: 2.0, ease: 'power2.out' }); }

    // Hero text parallax on scroll
    var heroContent = hero.querySelector('[class*="content-overlay"], [class*="hero-content"]');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -60, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: 1 },
      });
    }
    if (scrollHint) {
      gsap.to(scrollHint, { opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: 1 },
      });
    }
  }

  /* ═══════════════════════════════════════════════
     SHARED MODEL — Commercial Tenant Suite
     Both hero and precon use this same floor plan.
     ═══════════════════════════════════════════════ */
  function createCommercialSuiteModel() {
    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var creamColor = 0xf0ede8;

    var root = new THREE.Group();

    /* ── Material helpers ── */
    function wireMat(color, maxOp) {
      var m = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0 });
      m.userData = { maxOp: maxOp };
      return m;
    }
    function meshMat(color, maxOp) {
      var m = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, side: THREE.DoubleSide });
      m.userData = { maxOp: maxOp };
      return m;
    }

    /* ── Dimensions: 14 wide x 10 deep, centered at origin ── */
    var fW = 14, fD = 10, hW = fW / 2, hD = fD / 2, wallH = 3.5;

    /* ═══ SHELL — perimeter walls, storefront, slab ═══ */
    var shellGroup = new THREE.Group();

    // Floor slab outline
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(hW, 0, -hD),
      new THREE.Vector3(hW, 0, hD), new THREE.Vector3(-hW, 0, hD),
      new THREE.Vector3(-hW, 0, -hD),
    ]), wireMat(wireColor, 0.3)));

    // Top ring
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, -hD), new THREE.Vector3(hW, wallH, -hD),
      new THREE.Vector3(hW, wallH, hD), new THREE.Vector3(-hW, wallH, hD),
      new THREE.Vector3(-hW, wallH, -hD),
    ]), wireMat(wireColor, 0.3)));

    // 4 corner verticals
    [[-hW, -hD], [hW, -hD], [hW, hD], [-hW, hD]].forEach(function(c) {
      shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], wallH, c[1]),
      ]), wireMat(wireColor, 0.3)));
    });

    // Storefront: front wall (z = -5) with glazing opening x=-4..4, door gap x=-1..1
    var fz = -hD;
    // Bottom segments with openings
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, fz), new THREE.Vector3(-4, 0, fz),
    ]), wireMat(wireColor, 0.3)));
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(4, 0, fz), new THREE.Vector3(hW, 0, fz),
    ]), wireMat(wireColor, 0.3)));
    // Top segments with openings
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, fz), new THREE.Vector3(-4, wallH, fz),
    ]), wireMat(wireColor, 0.3)));
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(4, wallH, fz), new THREE.Vector3(hW, wallH, fz),
    ]), wireMat(wireColor, 0.3)));
    // Glazing frame verticals at opening edges
    [-4, -1, 1, 4].forEach(function(x) {
      shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, fz), new THREE.Vector3(x, wallH, fz),
      ]), wireMat(wireColor, 0.3)));
    });
    // Glazing transom bar (horizontal at 2.8)
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4, 2.8, fz), new THREE.Vector3(-1, 2.8, fz),
    ]), wireMat(wireColor, 0.25)));
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1, 2.8, fz), new THREE.Vector3(4, 2.8, fz),
    ]), wireMat(wireColor, 0.25)));

    // Back wall, left wall, right wall (solid — no openings besides corners already drawn)
    // Left wall bottom+top
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(-hW, 0, hD),
    ]), wireMat(wireColor, 0.25)));
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, -hD), new THREE.Vector3(-hW, wallH, hD),
    ]), wireMat(wireColor, 0.25)));
    // Right wall bottom+top
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(hW, 0, -hD), new THREE.Vector3(hW, 0, hD),
    ]), wireMat(wireColor, 0.25)));
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(hW, wallH, -hD), new THREE.Vector3(hW, wallH, hD),
    ]), wireMat(wireColor, 0.25)));
    // Back wall bottom+top
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, hD), new THREE.Vector3(hW, 0, hD),
    ]), wireMat(wireColor, 0.25)));
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, hD), new THREE.Vector3(hW, wallH, hD),
    ]), wireMat(wireColor, 0.25)));

    // Service core: enclosed room at back-right (x=3..7, z=2..5)
    var scX0 = 3, scX1 = 7, scZ0 = 2, scZ1 = 5;
    // Bottom
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(scX0, 0, scZ0), new THREE.Vector3(scX1, 0, scZ0),
      new THREE.Vector3(scX1, 0, scZ1), new THREE.Vector3(scX0, 0, scZ1),
      new THREE.Vector3(scX0, 0, scZ0),
    ]), wireMat(wireColor, 0.2)));
    // Top
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(scX0, wallH, scZ0), new THREE.Vector3(scX1, wallH, scZ0),
      new THREE.Vector3(scX1, wallH, scZ1), new THREE.Vector3(scX0, wallH, scZ1),
      new THREE.Vector3(scX0, wallH, scZ0),
    ]), wireMat(wireColor, 0.2)));
    // 4 corner verticals of service core
    [[scX0, scZ0], [scX1, scZ0], [scX1, scZ1], [scX0, scZ1]].forEach(function(c) {
      shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], wallH, c[1]),
      ]), wireMat(wireColor, 0.2)));
    });

    root.add(shellGroup);

    /* ═══ PARTITIONS — interior walls creating 3 zones ═══ */
    var partitionGroup = new THREE.Group();

    // Wall at z=-1 from x=-7 to x=3 (front/middle divider) with door gap x=0..2
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -1), new THREE.Vector3(0, 0, -1),
    ]), wireMat(wireColor, 0.2)));
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2, 0, -1), new THREE.Vector3(3, 0, -1),
    ]), wireMat(wireColor, 0.2)));
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, -1), new THREE.Vector3(0, wallH, -1),
    ]), wireMat(wireColor, 0.2)));
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2, wallH, -1), new THREE.Vector3(3, wallH, -1),
    ]), wireMat(wireColor, 0.2)));
    // Verticals at partition ends and door jambs
    [-hW, 0, 2, 3].forEach(function(x) {
      partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, -1), new THREE.Vector3(x, wallH, -1),
      ]), wireMat(wireColor, 0.2)));
    });

    // Wall at z=2 from x=-7 to x=3 (middle/back divider) with door gap x=-2..0
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, 2), new THREE.Vector3(-2, 0, 2),
    ]), wireMat(wireColor, 0.2)));
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 2), new THREE.Vector3(3, 0, 2),
    ]), wireMat(wireColor, 0.2)));
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, 2), new THREE.Vector3(-2, wallH, 2),
    ]), wireMat(wireColor, 0.2)));
    partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, wallH, 2), new THREE.Vector3(3, wallH, 2),
    ]), wireMat(wireColor, 0.2)));
    [-hW, -2, 0, 3].forEach(function(x) {
      partitionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, 2), new THREE.Vector3(x, wallH, 2),
      ]), wireMat(wireColor, 0.2)));
    });

    root.add(partitionGroup);

    /* ═══ CEILING — T-bar grid at y=3.2 ═══ */
    var ceilingGroup = new THREE.Group();
    var ceilY = 3.2;

    // 6 lines along x (spaced across z)
    for (var ci = 0; ci < 6; ci++) {
      var cxPos = -hW + (fW / 5) * ci;
      ceilingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cxPos, ceilY, -hD), new THREE.Vector3(cxPos, ceilY, hD),
      ]), wireMat(wireColor, 0.15)));
    }
    // 4 lines along z (spaced across x)
    for (var cj = 0; cj < 4; cj++) {
      var czPos = -hD + (fD / 3) * cj;
      ceilingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, ceilY, czPos), new THREE.Vector3(hW, ceilY, czPos),
      ]), wireMat(wireColor, 0.15)));
    }

    root.add(ceilingGroup);

    /* ═══ HVAC — 3 main duct runs + 4 branch drops ═══ */
    var hvacGroup = new THREE.Group();
    var ductY = 3.2;

    // 3 main duct runs along z-axis at x = -4, 0, 4
    [-4, 0, 4].forEach(function(xPos) {
      hvacGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xPos, ductY, -hD), new THREE.Vector3(xPos, ductY, hD),
      ]), wireMat(wireColor, 0.2)));
    });

    // 4 branch drops (short vertical segments)
    [[-4, -2], [-4, 3], [0, 1], [4, -1]].forEach(function(bd) {
      hvacGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd[0], ductY, bd[1]), new THREE.Vector3(bd[0], ductY - 0.5, bd[1]),
      ]), wireMat(wireColor, 0.2)));
    });

    root.add(hvacGroup);

    /* ═══ ELECTRICAL — 3 conduit runs + 6 junction boxes ═══ */
    var electricalGroup = new THREE.Group();
    var condY = 3.0;

    // 3 horizontal conduit runs
    electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, condY, -3), new THREE.Vector3(hW, condY, -3),
    ]), wireMat(accentColor, 0.15)));
    electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, condY, 0), new THREE.Vector3(hW, condY, 0),
    ]), wireMat(accentColor, 0.15)));
    electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, condY, 3), new THREE.Vector3(hW, condY, 3),
    ]), wireMat(accentColor, 0.15)));

    // 6 junction box indicators (small crosses)
    [[-5, -3], [-1, -3], [4, -3], [-3, 0], [2, 0], [5, 3]].forEach(function(jb) {
      var sz = 0.2;
      // Horizontal bar
      electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(jb[0] - sz, condY, jb[1]), new THREE.Vector3(jb[0] + sz, condY, jb[1]),
      ]), wireMat(accentColor, 0.15)));
      // Vertical bar
      electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(jb[0], condY, jb[1] - sz), new THREE.Vector3(jb[0], condY, jb[1] + sz),
      ]), wireMat(accentColor, 0.15)));
    });

    root.add(electricalGroup);

    /* ═══ SPRINKLER — 1 main + 5 drops ═══ */
    var sprinklerGroup = new THREE.Group();

    // Fire sprinkler main along z at x=2
    sprinklerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2, ductY + 0.1, -hD), new THREE.Vector3(2, ductY + 0.1, hD),
    ]), wireMat(accentColor, 0.15)));

    // 5 drops
    for (var si = 0; si < 5; si++) {
      var sz2 = -hD + 1.5 + si * ((fD - 3) / 4);
      sprinklerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(2, ductY + 0.1, sz2), new THREE.Vector3(2, ductY - 0.4, sz2),
      ]), wireMat(accentColor, 0.15)));
    }

    root.add(sprinklerGroup);

    /* ═══ FINISHES — floor fill + ceiling fill ═══ */
    var finishGroup = new THREE.Group();

    // Floor plane
    var floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fD), meshMat(creamColor, 0.06));
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0.02, 0);
    finishGroup.add(floorMesh);

    // Ceiling plane
    var ceilMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fD), meshMat(creamColor, 0.04));
    ceilMesh.rotation.x = -Math.PI / 2;
    ceilMesh.position.set(0, wallH, 0);
    finishGroup.add(ceilMesh);

    root.add(finishGroup);

    /* ═══ POINT LIGHTS — 3 in each zone ═══ */
    var pointLights = [];
    [[-3, 1.8, -3], [0, 1.8, 0.5], [4, 1.8, 3]].forEach(function(pos) {
      var pl = new THREE.PointLight(wireColor, 0, 12);
      pl.position.set(pos[0], pos[1], pos[2]);
      pl.userData = { maxIntensity: 0.3 };
      root.add(pl);
      pointLights.push(pl);
    });

    /* ═══ FIXTURES — empty group for future millwork ═══ */
    var fixtureGroup = new THREE.Group();
    root.add(fixtureGroup);

    return {
      root: root,
      shell: shellGroup,
      partitions: partitionGroup,
      ceiling: ceilingGroup,
      hvac: hvacGroup,
      electrical: electricalGroup,
      sprinkler: sprinklerGroup,
      finishes: finishGroup,
      lights: pointLights,
      fixtures: fixtureGroup,
    };
  }

  /* ═══════════════════════════════════════════════
     HERO — Resolved Building, Fixed Camera
     ═══════════════════════════════════════════════ */
  function initCommercialHero(rt) {
    var hero = document.getElementById('cm-hero');
    if (!hero) return;
    var canvasWrap = document.getElementById('cm-hero-canvas');
    if (!canvasWrap) return;
    if (typeof THREE === 'undefined') return;

    /* ── Text entrance (same pattern as initCommercialHeroText) ── */
    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('[class*="gold-line"]');
    var subtitle = hero.querySelector('[class*="subtitle"]');
    var label = hero.querySelector('[class*="label"]');
    var scrollHint = hero.querySelector('[class*="scroll-hint"]');

    if (label) { label.removeAttribute('data-animate'); gsap.fromTo(label, { opacity: 0, y: 20 }, { opacity: 0.45, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }); }
    if (h1) {
      h1.removeAttribute('data-animate');
      var chars = splitIntoChars(h1);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, { yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.025, ease: 'elastic.out(1, 0.6)', delay: 0.4 });
    }
    if (goldLine) gsap.fromTo(goldLine, { width: 0 }, { width: '80px', duration: 1.2, delay: 1.0, ease: 'power3.out' });
    if (subtitle) { subtitle.removeAttribute('data-animate'); gsap.to(subtitle, { opacity: 0.55, filter: 'blur(0px)', duration: 1.0, delay: 1.3, ease: 'power3.out' }); }
    if (scrollHint) { scrollHint.removeAttribute('data-animate'); gsap.to(scrollHint, { opacity: 0.5, duration: 0.8, delay: 2.0, ease: 'power2.out' }); }

    /* ── Hero text parallax on scroll ── */
    var heroContent = hero.querySelector('[class*="content-overlay"], [class*="hero-content"]');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -60, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: 1 },
      });
    }
    if (scrollHint) {
      gsap.to(scrollHint, { opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: 1 },
      });
    }

    /* ═══ Three.js Scene ═══ */
    var isMobile = rt.isMobile;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 200);
    camera.position.set(18, 14, 18);
    camera.lookAt(0, 1.5, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);
    rt.heroRenderer = renderer;

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(10, 15, 8);
    scene.add(dirLight);

    /* ── Build model ── */
    var model = createCommercialSuiteModel();
    scene.add(model.root);

    /* ── On-load fade: all groups from 0 → target opacity, staggered ── */
    var groups = [
      { group: model.shell, target: 0.25 },
      { group: model.partitions, target: 0.2 },
      { group: model.ceiling, target: 0.15 },
      { group: model.hvac, target: 0.12 },
      { group: model.electrical, target: 0.1 },
      { group: model.finishes, target: 0.05 },
    ];

    groups.forEach(function(entry, i) {
      var delay = 0.15 * i;
      entry.group.traverse(function(child) {
        if (!child.material) return;
        var maxOp = child.material.userData && child.material.userData.maxOp;
        var t = maxOp ? Math.min(maxOp, entry.target) : entry.target;
        gsap.to(child.material, {
          opacity: t, duration: 1.5, delay: delay, ease: 'power2.out',
        });
      });
    });

    /* ── Mouse parallax ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Render loop — fixed camera with tiny drift + mouse parallax ── */
    var startTime = performance.now();
    var baseCamX = 18, baseCamY = 14, baseCamZ = 18;

    function animate() {
      rt.heroRaf = requestAnimationFrame(animate);
      if (rt.heroDisposed) return;

      var time = (performance.now() - startTime) / 1000;

      camera.position.set(
        baseCamX + Math.sin(time * 0.3) * 0.02 + mouseX * 0.5,
        baseCamY + Math.cos(time * 0.25) * 0.015 + mouseY * 0.3,
        baseCamZ + Math.sin(time * 0.2) * 0.02
      );
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    }
    rt.heroRaf = requestAnimationFrame(animate);

    /* ── Resize handler ── */
    rt.onHeroResize = function() {
      var nw = canvasWrap.clientWidth, nh = canvasWrap.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
  }

  /* ═══════════════════════════════════════════════
     initCommercialPrecon — Sticky Canvas, 4 States
     Cards scroll on left, canvas sticks on right.
     ═══════════════════════════════════════════════ */
  function initCommercialPrecon(rt) {
    var wrap = document.getElementById('cm-precon-canvas');
    var desktop = document.querySelector('.cm-precon-desktop');
    if (!wrap || !desktop || typeof THREE === 'undefined') return;

    /* ── Scene + Camera + Renderer ── */
    var isMobile = rt.isMobile;
    var w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) { w = 600; h = 500; }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 200);
    camera.position.set(18, 14, 18);
    camera.lookAt(0, 1.5, 0);

    var renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    rt.preconRenderer = renderer;

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight.position.set(10, 15, 8);
    scene.add(dirLight);

    /* ── Build model ── */
    var model = createCommercialSuiteModel();
    scene.add(model.root);

    /* ── State definitions ── */
    var states = [
      /* State 0 — Shell */
      { shell: 0.3, partitions: 0, ceiling: 0, hvac: 0, electrical: 0, sprinkler: 0, finishes: 0, lightsOn: false, fov: 35 },
      /* State 1 — Code + MEP */
      { shell: 0.3, partitions: 0.2, ceiling: 0, hvac: 0.2, electrical: 0.15, sprinkler: 0.15, finishes: 0, lightsOn: false, fov: 33 },
      /* State 2 — Procurement */
      { shell: 0.3, partitions: 0.2, ceiling: 0.1, hvac: 0.2, electrical: 0.15, sprinkler: 0.15, finishes: 0, lightsOn: false, fov: 32, pulseShell: true, pulseHvac: true },
      /* State 3 — Built Environment */
      { shell: 0.35, partitions: 0.25, ceiling: 0.2, hvac: 0.2, electrical: 0.15, sprinkler: 0.15, finishes: 0.06, lightsOn: true, fov: 30 },
    ];

    var currentState = -1;

    /* ── Helper: set group opacity ── */
    function setGroupOpacity(group, targetMultiplier, duration) {
      group.traverse(function(child) {
        if (!child.material) return;
        var maxOp = (child.material.userData && child.material.userData.maxOp) || 0.3;
        var finalOp = Math.min(maxOp, targetMultiplier);
        gsap.to(child.material, { opacity: finalOp, duration: duration, ease: 'power2.out' });
      });
    }

    function transitionToState(idx) {
      if (idx === currentState) return;
      currentState = idx;
      var s = states[idx];
      var dur = 0.6;

      setGroupOpacity(model.shell, s.shell, dur);
      setGroupOpacity(model.partitions, s.partitions, dur);
      setGroupOpacity(model.ceiling, s.ceiling, dur);
      setGroupOpacity(model.hvac, s.hvac, dur);
      setGroupOpacity(model.electrical, s.electrical, dur);
      setGroupOpacity(model.sprinkler, s.sprinkler, dur);
      setGroupOpacity(model.finishes, s.finishes, dur);

      // Point lights
      model.lights.forEach(function(pl) {
        gsap.to(pl, { intensity: s.lightsOn ? pl.userData.maxIntensity : 0, duration: dur, ease: 'power2.out' });
      });

      // FOV zoom
      gsap.to(camera, { fov: s.fov, duration: dur, ease: 'power2.out', onUpdate: function() { camera.updateProjectionMatrix(); } });

      // Procurement pulse effect (state 2 only)
      if (s.pulseShell) {
        // Briefly brighten storefront elements in shell
        model.shell.traverse(function(child) {
          if (!child.material) return;
          gsap.to(child.material, { opacity: 0.5, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        });
      }
      if (s.pulseHvac) {
        model.hvac.traverse(function(child) {
          if (!child.material) return;
          gsap.to(child.material, { opacity: 0.35, duration: 0.3, delay: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        });
      }
    }

    /* ── DOM: Nav counter + progress ── */
    var navEl = document.querySelector('.cm-precon-nav');
    var counterEl = null;
    var progressFill = null;
    if (navEl) {
      counterEl = navEl.querySelector('.cm-precon-counter');
      if (!counterEl) {
        counterEl = document.createElement('div');
        counterEl.className = 'cm-precon-counter';
        counterEl.textContent = '01 / 04';
        navEl.appendChild(counterEl);
      }
      progressFill = navEl.querySelector('.cm-precon-progress-fill');
      if (!progressFill) {
        var progressBar = document.createElement('div');
        progressBar.className = 'cm-precon-progress';
        progressBar.style.cssText = 'width:100%;height:2px;background:rgba(201,169,110,0.15);border-radius:1px;overflow:hidden;';
        progressFill = document.createElement('div');
        progressFill.className = 'cm-precon-progress-fill';
        progressFill.style.cssText = 'width:25%;height:100%;background:#c9a96e;transition:width 0.3s ease;';
        progressBar.appendChild(progressFill);
        navEl.appendChild(progressBar);
      }
    }

    function updateNav(step) {
      if (counterEl) counterEl.textContent = ('0' + (step + 1)).slice(-2) + ' / 04';
      if (progressFill) progressFill.style.width = ((step + 1) / 4 * 100) + '%';
    }

    /* ── ScrollTrigger per card ── */
    var cards = desktop.querySelectorAll('.cm-precon-card');
    rt.preconTriggers = [];

    cards.forEach(function(card, i) {
      var st = ScrollTrigger.create({
        trigger: card,
        start: 'top center',
        end: 'bottom center',
        onEnter: function() { transitionToState(i); updateNav(i); },
        onEnterBack: function() { transitionToState(i); updateNav(i); },
      });
      rt.preconTriggers.push(st);
    });

    // Start at state 0 if first card is already past center
    transitionToState(0);
    updateNav(0);

    /* ── Camera drift (same as hero) ── */
    var startTime = performance.now();
    var baseCamX = 18, baseCamY = 14, baseCamZ = 18;

    /* ── Render loop via GSAP ticker ── */
    function renderTick() {
      if (!rt.preconRenderer) return;

      var time = (performance.now() - startTime) / 1000;

      camera.position.set(
        baseCamX + Math.sin(time * 0.3) * 0.02,
        baseCamY + Math.cos(time * 0.25) * 0.015,
        baseCamZ + Math.sin(time * 0.2) * 0.02
      );
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    }
    gsap.ticker.add(renderTick);
    rt._preconTickerRef = renderTick;

    /* ── Resize handling ── */
    var preconResizeST = ScrollTrigger.create({
      trigger: desktop,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: function() {
        var nw = wrap.clientWidth, nh = wrap.clientHeight;
        if (nw && nh && rt.preconRenderer) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      },
    });
    rt.preconTriggers.push(preconResizeST);

    // Initial render
    renderer.render(scene, camera);
  }

  /* ═══════════════════════════════════════════════
     BOOTSTRAP
     ═══════════════════════════════════════════════ */
  function bootstrap() {
    runtime.lenis = initLenis();

    if (!runtime.isReduced && !runtime.isMobile) {
      initCommercialHero(runtime);
      initCommercialPrecon(runtime);
    } else if (!runtime.isReduced && runtime.isMobile) {
      // On mobile: init hero text animations only, skip Three.js scenes
      initCommercialHeroText(runtime);
    }
    initCommercialMotion(runtime);

    ScrollTrigger.create({
      trigger: '#cm-comparison',
      start: 'top bottom',
      once: true,
      onEnter: function() { disposeHeroPermanently(runtime); },
    });

    window.addEventListener('resize', onResize);
  }

  window.addEventListener('DOMContentLoaded', bootstrap);
})();
