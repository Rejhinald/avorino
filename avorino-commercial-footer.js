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
     SHARED MODEL — Commercial Tenant Suite (Dental Office)
     40ft x 30ft floor plan with BoxGeometry edge wireframes.
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
    function edgeWireMat(color, maxOp) {
      var m = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0 });
      m.userData = { maxOp: maxOp };
      return m;
    }
    function createWallEdges(length, height, thickness, mat) {
      var box = new THREE.BoxGeometry(length, height, thickness);
      var edges = new THREE.EdgesGeometry(box);
      return new THREE.LineSegments(edges, mat);
    }

    /* ── Dimensions: 40ft wide x 30ft deep, centered at origin ── */
    var fW = 40, fD = 30, hW = fW / 2, hD = fD / 2;
    var wallH = 10, wallT = 0.5;

    /* Helper: create a wall segment and position it */
    function addWall(group, length, axis, cx, cy, cz, opacity) {
      var seg;
      if (axis === 'x') {
        seg = createWallEdges(length, wallH, wallT, edgeWireMat(wireColor, opacity));
      } else {
        seg = createWallEdges(wallT, wallH, length, edgeWireMat(wireColor, opacity));
      }
      seg.position.set(cx, cy, cz);
      group.add(seg);
      return seg;
    }

    /* Helper: create a lintel (thin beam above door opening) */
    function addLintel(group, length, axis, cx, cy, cz, opacity) {
      var lintelH = 2; /* 2ft from 8ft door top to 10ft ceiling */
      var seg;
      if (axis === 'x') {
        seg = createWallEdges(length, lintelH, wallT, edgeWireMat(wireColor, opacity));
      } else {
        seg = createWallEdges(wallT, lintelH, length, edgeWireMat(wireColor, opacity));
      }
      seg.position.set(cx, cy, cz);
      group.add(seg);
      return seg;
    }

    /* ═══════════════════════════════════════════════
       SHELL — perimeter walls, storefront, floor slab
       ═══════════════════════════════════════════════ */
    var shellGroup = new THREE.Group();

    /* Floor slab outline */
    shellGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(hW, 0, -hD),
      new THREE.Vector3(hW, 0, hD), new THREE.Vector3(-hW, 0, hD),
      new THREE.Vector3(-hW, 0, -hD),
    ]), wireMat(wireColor, 0.3)));

    /* ── Back wall (north, z=15): solid 40ft ── */
    addWall(shellGroup, fW, 'x', 0, wallH / 2, hD, 0.3);

    /* ── Left wall (west, x=-20): solid 30ft ── */
    addWall(shellGroup, fD, 'z', -hW, wallH / 2, 0, 0.3);

    /* ── Right wall (east, x=20): solid 30ft ── */
    addWall(shellGroup, fD, 'z', hW, wallH / 2, 0, 0.3);

    /* ── Front wall (south, z=-15): storefront with 24ft glazing opening ──
       Solid: x=-20 to -12 (8ft), x=12 to 20 (8ft)
       Glazing: x=-12 to -2 (10ft pane), x=2 to 12 (10ft pane)
       Door gap: x=-2 to 2 (4ft entry) */
    addWall(shellGroup, 8, 'x', -16, wallH / 2, -hD, 0.3);
    addWall(shellGroup, 8, 'x', 16, wallH / 2, -hD, 0.3);

    /* Storefront mullions — vertical frames at glazing edges */
    var sfMullions = [-12, -2, 2, 12];
    sfMullions.forEach(function(x) {
      var mullion = createWallEdges(0.3, wallH, wallT, edgeWireMat(wireColor, 0.25));
      mullion.position.set(x, wallH / 2, -hD);
      shellGroup.add(mullion);
    });

    /* Storefront transom bar at 8ft (door head height) */
    var transomSeg1 = createWallEdges(10, 0.3, wallT, edgeWireMat(wireColor, 0.2));
    transomSeg1.position.set(-7, 8, -hD);
    shellGroup.add(transomSeg1);
    var transomSeg2 = createWallEdges(10, 0.3, wallT, edgeWireMat(wireColor, 0.2));
    transomSeg2.position.set(7, 8, -hD);
    shellGroup.add(transomSeg2);

    /* Storefront mid-mullion verticals (divide each 10ft pane into 2x5ft) */
    [-7, 7].forEach(function(x) {
      var midMull = createWallEdges(0.2, wallH, wallT, edgeWireMat(wireColor, 0.18));
      midMull.position.set(x, wallH / 2, -hD);
      shellGroup.add(midMull);
    });

    root.add(shellGroup);

    /* ═══════════════════════════════════════════════
       PARTITIONS — interior walls with door openings
       ═══════════════════════════════════════════════
       Layout:
       - Reception/Waiting: z=-15 to z=-7 (8ft deep), full width
       - Corridor: z=-7 to z=-3 (4ft wide), full width
       - Back zone: z=-3 to z=15 (18ft deep)
         - Left ops (x=-20 to -10), middle ops (x=-10 to 10), right utility (x=10 to 20)
         - Restroom core: x=10 to 20, z=-3 to 5
         - Break room: x=10 to 20, z=5 to 15
         - Office 1: x=-20 to -10, z=-3 to 15
         - Office 2 / Operatory: x=-10 to 10, z=-3 to 15
    */
    var partitionGroup = new THREE.Group();
    var doorW = 3, doorH = 8;
    var lintelY = wallH / 2 + doorH / 2; /* y-center of lintel = 9ft */

    /* ── Corridor south wall: z=-7, x from -20 to 20 ──
       Door gaps at: x=-15 (op1), x=-5 (op2), x=5 (reception pass), x=15 (restroom) */
    // Segment x=-20 to -16.5
    addWall(partitionGroup, 3.5, 'x', -18.25, wallH / 2, -7, 0.22);
    // Lintel over door at x=-15
    addLintel(partitionGroup, doorW, 'x', -15, lintelY, -7, 0.15);
    // Segment x=-13.5 to -6.5
    addWall(partitionGroup, 7, 'x', -10, wallH / 2, -7, 0.22);
    // Lintel over door at x=-5
    addLintel(partitionGroup, doorW, 'x', -5, lintelY, -7, 0.15);
    // Segment x=-3.5 to 3.5
    addWall(partitionGroup, 7, 'x', 0, wallH / 2, -7, 0.22);
    // Lintel over door at x=5
    addLintel(partitionGroup, doorW, 'x', 5, lintelY, -7, 0.15);
    // Segment x=6.5 to 13.5
    addWall(partitionGroup, 7, 'x', 10, wallH / 2, -7, 0.22);
    // Lintel over door at x=15
    addLintel(partitionGroup, doorW, 'x', 15, lintelY, -7, 0.15);
    // Segment x=16.5 to 20
    addWall(partitionGroup, 3.5, 'x', 18.25, wallH / 2, -7, 0.22);

    /* ── Corridor north wall: z=-3, x from -20 to 20 ──
       Door gaps at: x=-15 (office1), x=-5 (office2), x=5 (ops area) */
    addWall(partitionGroup, 3.5, 'x', -18.25, wallH / 2, -3, 0.22);
    addLintel(partitionGroup, doorW, 'x', -15, lintelY, -3, 0.15);
    addWall(partitionGroup, 7, 'x', -10, wallH / 2, -3, 0.22);
    addLintel(partitionGroup, doorW, 'x', -5, lintelY, -3, 0.15);
    addWall(partitionGroup, 7, 'x', 0, wallH / 2, -3, 0.22);
    addLintel(partitionGroup, doorW, 'x', 5, lintelY, -3, 0.15);
    // Segment x=6.5 to 20 (solid — restroom accessed from corridor south side)
    addWall(partitionGroup, 13.5, 'x', 13.25, wallH / 2, -3, 0.22);

    /* ── North-south dividing walls ── */

    /* x=-10: z from -15 to -7 (between reception and operatory 1) — door gap at z=-11 */
    addWall(partitionGroup, 4, 'z', -10, wallH / 2, -13, 0.2);
    addLintel(partitionGroup, doorW, 'z', -10, lintelY, -11, 0.15);
    addWall(partitionGroup, 2, 'z', -10, wallH / 2, -8.5, 0.2);

    /* x=0: z from -15 to -7 (between reception halves) — open archway at z=-11 */
    addWall(partitionGroup, 4, 'z', 0, wallH / 2, -13, 0.2);
    addLintel(partitionGroup, doorW, 'z', 0, lintelY, -11, 0.15);
    addWall(partitionGroup, 2, 'z', 0, wallH / 2, -8.5, 0.2);

    /* x=10: z from -15 to 15 (separates right utility column) — full height, 30ft
       Door gap at z=-11 (entry to restroom corridor) */
    addWall(partitionGroup, 4, 'z', 10, wallH / 2, -13, 0.2);
    addLintel(partitionGroup, doorW, 'z', 10, lintelY, -11, 0.15);
    addWall(partitionGroup, 2, 'z', 10, wallH / 2, -8.5, 0.2);
    /* z=-7 to -3 already covered by corridor walls junction */
    addWall(partitionGroup, 18, 'z', 10, wallH / 2, 6, 0.2);

    /* x=-10: z from -3 to 15 (between office 1 and operatory area) — door gap at z=1 */
    addWall(partitionGroup, 4, 'z', -10, wallH / 2, -1, 0.2);
    addLintel(partitionGroup, doorW, 'z', -10, lintelY, 1, 0.15);
    addWall(partitionGroup, 11.5, 'z', -10, wallH / 2, 9.25, 0.2);

    /* ── Restroom / break room divider: z=5, x=10 to 20 (door gap at x=15) ── */
    addWall(partitionGroup, 3.5, 'x', 11.75, wallH / 2, 5, 0.2);
    addLintel(partitionGroup, doorW, 'x', 15, lintelY, 5, 0.15);
    addWall(partitionGroup, 3.5, 'x', 18.25, wallH / 2, 5, 0.2);

    root.add(partitionGroup);

    /* ═══════════════════════════════════════════════
       CEILING — T-bar grid at y=9.5
       ═══════════════════════════════════════════════ */
    var ceilingGroup = new THREE.Group();
    var ceilY = 9.5;

    /* Main runners along X (spaced ~5ft on Z) */
    for (var cz = -hD; cz <= hD; cz += 5) {
      ceilingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, ceilY, cz), new THREE.Vector3(hW, ceilY, cz),
      ]), wireMat(wireColor, 0.12)));
    }
    /* Cross tees along Z (spaced ~5ft on X) */
    for (var cx = -hW; cx <= hW; cx += 5) {
      ceilingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cx, ceilY, -hD), new THREE.Vector3(cx, ceilY, hD),
      ]), wireMat(wireColor, 0.12)));
    }

    root.add(ceilingGroup);

    /* ═══════════════════════════════════════════════
       HVAC — main trunk ducts + branch drops
       Ducts are BoxGeometry edges (2ft x 1ft cross-section)
       ═══════════════════════════════════════════════ */
    var hvacGroup = new THREE.Group();
    var ductY = 9.2;
    var ductCrossW = 2, ductCrossH = 1;

    /* Main trunk running east-west at z=0 (through corridor zone) */
    var mainTrunk = createWallEdges(fW, ductCrossH, ductCrossW, edgeWireMat(wireColor, 0.18));
    mainTrunk.position.set(0, ductY, -5);
    hvacGroup.add(mainTrunk);

    /* Secondary trunk running north-south at x=0 */
    var secTrunk = createWallEdges(ductCrossW, ductCrossH, fD, edgeWireMat(wireColor, 0.15));
    secTrunk.position.set(0, ductY, 0);
    hvacGroup.add(secTrunk);

    /* Branch ducts (1.5ft x 0.8ft cross-section) into rooms */
    var branchPositions = [
      { x: -15, z: 5, len: 10, axis: 'z' },   /* office 1 */
      { x: -5, z: 5, len: 10, axis: 'z' },    /* office 2 / ops */
      { x: 15, z: 0, len: 8, axis: 'z' },     /* restroom / break */
      { x: -15, z: -11, len: 6, axis: 'z' },  /* operatory 1 */
      { x: -5, z: -11, len: 6, axis: 'z' },   /* reception */
    ];
    branchPositions.forEach(function(bp) {
      var branch;
      if (bp.axis === 'z') {
        branch = createWallEdges(1.5, 0.8, bp.len, edgeWireMat(wireColor, 0.12));
      } else {
        branch = createWallEdges(bp.len, 0.8, 1.5, edgeWireMat(wireColor, 0.12));
      }
      branch.position.set(bp.x, ductY - 0.5, bp.z);
      hvacGroup.add(branch);
    });

    /* 8 branch drops (short vertical segments from ducts to diffusers) */
    [[-15, -11], [-5, -11], [5, -11], [-15, 5], [-5, 5], [5, 5], [15, 1], [15, 10]].forEach(function(bd) {
      hvacGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd[0], ductY - 1, bd[1]), new THREE.Vector3(bd[0], ductY - 2, bd[1]),
      ]), wireMat(wireColor, 0.15)));
    });

    root.add(hvacGroup);

    /* ═══════════════════════════════════════════════
       ELECTRICAL — conduit runs + junction boxes
       ═══════════════════════════════════════════════ */
    var electricalGroup = new THREE.Group();
    var condY = 8.8;

    /* 3 horizontal conduit runs along X */
    [-10, -5, 5].forEach(function(zPos) {
      electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, condY, zPos), new THREE.Vector3(hW, condY, zPos),
      ]), wireMat(accentColor, 0.12)));
    });

    /* 2 vertical conduit runs along Z */
    [-10, 10].forEach(function(xPos) {
      electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xPos, condY, -hD), new THREE.Vector3(xPos, condY, hD),
      ]), wireMat(accentColor, 0.12)));
    });

    /* 8 junction boxes (small crosses) */
    [[-15, -10], [-5, -10], [5, -10], [15, -10],
     [-15, 5], [-5, 5], [5, 5], [15, 5]].forEach(function(jb) {
      var sz = 0.5;
      electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(jb[0] - sz, condY, jb[1]), new THREE.Vector3(jb[0] + sz, condY, jb[1]),
      ]), wireMat(accentColor, 0.12)));
      electricalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(jb[0], condY, jb[1] - sz), new THREE.Vector3(jb[0], condY, jb[1] + sz),
      ]), wireMat(accentColor, 0.12)));
    });

    root.add(electricalGroup);

    /* ═══════════════════════════════════════════════
       SPRINKLER — main pipe + drops
       ═══════════════════════════════════════════════ */
    var sprinklerGroup = new THREE.Group();
    var sprinkY = 9.4;

    /* Main sprinkler pipe along X at z=-5 */
    sprinklerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, sprinkY, -5), new THREE.Vector3(hW, sprinkY, -5),
    ]), wireMat(accentColor, 0.12)));

    /* Branch pipe along X at z=5 */
    sprinklerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, sprinkY, 5), new THREE.Vector3(hW, sprinkY, 5),
    ]), wireMat(accentColor, 0.12)));

    /* Cross connect along Z at x=0 */
    sprinklerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, sprinkY, -hD), new THREE.Vector3(0, sprinkY, hD),
    ]), wireMat(accentColor, 0.1)));

    /* 10 sprinkler drops */
    [[-16, -5], [-8, -5], [0, -5], [8, -5], [16, -5],
     [-16, 5], [-8, 5], [0, 5], [8, 5], [16, 5]].forEach(function(sp) {
      sprinklerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sp[0], sprinkY, sp[1]), new THREE.Vector3(sp[0], sprinkY - 1, sp[1]),
      ]), wireMat(accentColor, 0.12)));
    });

    root.add(sprinklerGroup);

    /* ═══════════════════════════════════════════════
       FINISHES — floor planes per room + ceiling plane
       ═══════════════════════════════════════════════ */
    var finishGroup = new THREE.Group();

    /* Room floor fills (subtle different shades) */
    var roomFloors = [
      /* Reception/waiting — left half */
      { w: 20, d: 8, x: -10, z: -11, color: creamColor, op: 0.05 },
      /* Reception/waiting — right half */
      { w: 10, d: 8, x: 5, z: -11, color: creamColor, op: 0.04 },
      /* Entry vestibule */
      { w: 10, d: 8, x: 15, z: -11, color: creamColor, op: 0.03 },
      /* Corridor */
      { w: 40, d: 4, x: 0, z: -5, color: creamColor, op: 0.03 },
      /* Office 1 (back left) */
      { w: 10, d: 18, x: -15, z: 6, color: creamColor, op: 0.05 },
      /* Operatory / Office 2 (back center) */
      { w: 20, d: 18, x: 0, z: 6, color: creamColor, op: 0.04 },
      /* Restroom (back right lower) */
      { w: 10, d: 8, x: 15, z: 1, color: creamColor, op: 0.03 },
      /* Break room (back right upper) */
      { w: 10, d: 10, x: 15, z: 10, color: creamColor, op: 0.04 },
    ];
    roomFloors.forEach(function(rf) {
      var fm = new THREE.Mesh(new THREE.PlaneGeometry(rf.w, rf.d), meshMat(rf.color, rf.op));
      fm.rotation.x = -Math.PI / 2;
      fm.position.set(rf.x, 0.02, rf.z);
      finishGroup.add(fm);
    });

    /* Ceiling plane */
    var ceilMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fD), meshMat(creamColor, 0.03));
    ceilMesh.rotation.x = -Math.PI / 2;
    ceilMesh.position.set(0, wallH, 0);
    finishGroup.add(ceilMesh);

    root.add(finishGroup);

    /* ═══════════════════════════════════════════════
       POINT LIGHTS — one per major room
       ═══════════════════════════════════════════════ */
    var pointLights = [];
    [
      [-10, 5, -11],   /* reception left */
      [5, 5, -11],     /* reception right */
      [0, 5, -5],      /* corridor */
      [-15, 5, 6],     /* office 1 */
      [-5, 5, 6],      /* operatory / office 2 */
      [5, 5, 6],       /* operatory area */
      [15, 5, 1],      /* restroom */
      [15, 5, 10],     /* break room */
    ].forEach(function(pos) {
      var pl = new THREE.PointLight(wireColor, 0, 20);
      pl.position.set(pos[0], pos[1], pos[2]);
      pl.userData = { maxIntensity: 0.25 };
      root.add(pl);
      pointLights.push(pl);
    });

    /* ═══════════════════════════════════════════════
       FIXTURES — furniture silhouettes (BoxGeometry edges)
       Make rooms readable at a glance.
       ═══════════════════════════════════════════════ */
    var fixtureGroup = new THREE.Group();
    var fixOp = 0.12;

    function addFixture(w, h, d, x, y, z) {
      var fix = createWallEdges(w, h, d, edgeWireMat(wireColor, fixOp));
      fix.position.set(x, y, z);
      fixtureGroup.add(fix);
      return fix;
    }

    /* Reception desk: 6ft x 3.5ft high x 2.5ft deep, centered in reception */
    addFixture(6, 3.5, 2.5, -5, 1.75, -12);

    /* 2 waiting room chairs (benches): 4ft x 1.5ft x 1.5ft */
    addFixture(4, 1.5, 1.5, -14, 0.75, -10);
    addFixture(4, 1.5, 1.5, -14, 0.75, -12);

    /* Operatory chair 1: 2ft x 3ft x 5ft in back-center-left */
    addFixture(2, 3, 5, -5, 1.5, 4);

    /* Operatory chair 2: 2ft x 3ft x 5ft in back-center-right */
    addFixture(2, 3, 5, 5, 1.5, 4);

    /* Operatory counter/cabinet: 8ft x 3ft x 2ft along back wall */
    addFixture(8, 3, 2, 0, 1.5, 14);

    /* Office 1 desk: 5ft x 2.5ft x 2.5ft */
    addFixture(5, 2.5, 2.5, -15, 1.25, 3);

    /* Office 1 credenza: 4ft x 2ft x 1.5ft */
    addFixture(4, 2, 1.5, -15, 1, 8);

    /* Restroom toilet: 1.5ft x 2.5ft x 2ft */
    addFixture(1.5, 2.5, 2, 17, 1.25, 0);

    /* Restroom sink counter: 4ft x 3ft x 2ft */
    addFixture(4, 3, 2, 13, 1.5, 0);

    /* Break room table: 4ft x 2.5ft x 3ft */
    addFixture(4, 2.5, 3, 15, 1.25, 10);

    /* Break room counter: 6ft x 3ft x 2ft along east wall */
    addFixture(2, 3, 6, 19, 1.5, 10);

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
    camera.position.set(50, 38, 50);
    camera.lookAt(0, 4, 0);

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
      { group: model.fixtures, target: 0.12 },
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
    var baseCamX = 50, baseCamY = 38, baseCamZ = 50;

    function animate() {
      rt.heroRaf = requestAnimationFrame(animate);
      if (rt.heroDisposed) return;

      var time = (performance.now() - startTime) / 1000;

      camera.position.set(
        baseCamX + Math.sin(time * 0.3) * 0.05 + mouseX * 1.5,
        baseCamY + Math.cos(time * 0.25) * 0.04 + mouseY * 0.8,
        baseCamZ + Math.sin(time * 0.2) * 0.05
      );
      camera.lookAt(0, 4, 0);

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
    camera.position.set(50, 38, 50);
    camera.lookAt(0, 4, 0);

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
      { shell: 0.3, partitions: 0, ceiling: 0, hvac: 0, electrical: 0, sprinkler: 0, finishes: 0, fixtures: 0, lightsOn: false, fov: 35 },
      /* State 1 — Code + MEP */
      { shell: 0.3, partitions: 0.2, ceiling: 0, hvac: 0.2, electrical: 0.15, sprinkler: 0.15, finishes: 0, fixtures: 0, lightsOn: false, fov: 33 },
      /* State 2 — Procurement */
      { shell: 0.3, partitions: 0.2, ceiling: 0.1, hvac: 0.2, electrical: 0.15, sprinkler: 0.15, finishes: 0, fixtures: 0.06, lightsOn: false, fov: 32, pulseShell: true, pulseHvac: true },
      /* State 3 — Built Environment */
      { shell: 0.35, partitions: 0.25, ceiling: 0.2, hvac: 0.2, electrical: 0.15, sprinkler: 0.15, finishes: 0.06, fixtures: 0.12, lightsOn: true, fov: 30 },
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
      setGroupOpacity(model.fixtures, s.fixtures, dur);

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
    var baseCamX = 50, baseCamY = 38, baseCamZ = 50;

    /* ── Render loop via GSAP ticker ── */
    function renderTick() {
      if (!rt.preconRenderer) return;

      var time = (performance.now() - startTime) / 1000;

      camera.position.set(
        baseCamX + Math.sin(time * 0.3) * 0.05,
        baseCamY + Math.cos(time * 0.25) * 0.04,
        baseCamZ + Math.sin(time * 0.2) * 0.05
      );
      camera.lookAt(0, 4, 0);

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
