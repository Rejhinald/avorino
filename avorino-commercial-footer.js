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
     ═══════════════════════════════════════════════ */
  function teardownHero(rt) {
    if (rt.heroDisposed) return;
    rt.heroDisposed = true;
    if (rt.heroRaf) cancelAnimationFrame(rt.heroRaf);
    if (rt.onHeroResize) rt.onHeroResize = null;
    if (rt.heroRenderer) {
      rt.heroRenderer.dispose();
      rt.heroRenderer.forceContextLoss();
      rt.heroRenderer.domElement.remove();
      rt.heroRenderer = null;
    }
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
    if (wasMobile && !rt.isMobile && !rt.preconRenderer) {
      initCommercialPrecon(rt);
    }
    if (!wasMobile && rt.isMobile && rt.preconRenderer) {
      teardownPrecon(rt);
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
      if (typical) tl.fromTo(typical, { x: -20, opacity: 0 }, { x: 0, opacity: 0.35, duration: dur || 0.6, ease: 'power3.out' }, 0);
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

    // ── CTA: heading word stagger + button entrance ──
    var ctaHeading = document.querySelector('.av-cta-heading');
    if (ctaHeading) {
      var ctaWords = splitIntoWords(ctaHeading);
      gsap.fromTo(ctaWords, { yPercent: 100, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: dur || 0.8, stagger: 0.04, ease: 'elastic.out(1, 0.6)',
        scrollTrigger: { trigger: '.av-cta', start: 'top 80%', once: true },
      });
    }
    var ctaBtns = document.querySelector('.av-cta-btns');
    if (ctaBtns) {
      gsap.fromTo(ctaBtns.children, { y: 30, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: dur || 0.8, stagger: 0.15, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.av-cta', start: 'top 85%', once: true },
      });
    }

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
     HERO — Exploded Axonometric 3D Scene
     5 layers of a commercial interior assemble on load
     ═══════════════════════════════════════════════ */
  function initCommercialHero(rt) {
    var hero = document.getElementById('cm-hero');
    if (!hero) return;
    var canvasWrap = document.getElementById('cm-hero-canvas');
    if (!canvasWrap) return;

    /* ── Text entrance ── */
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

    /* ═══ Three.js Scene: Exploded axonometric commercial interior ═══ */
    var scene = new THREE.Scene();
    var isMobile = rt.isMobile;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 150);
    camera.position.set(14, 10, 20);
    camera.lookAt(0, 3, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);
    rt.heroRenderer = renderer;

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.25));
    var pl = new THREE.PointLight(0xc9a96e, 0.6, 80);
    pl.position.set(20, 25, 20); scene.add(pl);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;

    /* ── Helper: create LineBasicMaterial ── */
    function wireMat(color, opacity) {
      return new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity });
    }

    /* ── All layer materials (start at opacity 0 for entrance) ── */
    var floorWireMat = wireMat(wireColor, 0);
    var floorFillMat = new THREE.MeshBasicMaterial({ color: wireColor, transparent: true, opacity: 0, side: THREE.DoubleSide });
    var wallMat = wireMat(wireColor, 0);
    var ductMat = wireMat(wireColor, 0);
    var conduitMat = wireMat(accentColor, 0);
    var ceilingMat = wireMat(wireColor, 0);

    /* ── Target opacities for each layer ── */
    var targetOpacities = [
      { wire: 0.25, fill: 0.08 },  // floor
      { wire: 0.25 },               // walls
      { wire: 0.2 },                // ducts
      { wire: 0.25 },               // conduit
      { wire: 0.18 },               // ceiling
    ];

    /* ── Layer 1: Floor plane (y=0) ── */
    var floorGroup = new THREE.Group();
    var fW = 14, fD = 10, hW = fW / 2, hD = fD / 2;

    // Outline
    floorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(hW, 0, -hD),
      new THREE.Vector3(hW, 0, hD), new THREE.Vector3(-hW, 0, hD),
      new THREE.Vector3(-hW, 0, -hD),
    ]), floorWireMat));

    // Solid fill
    var floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fD), floorFillMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0.01, 0);
    floorGroup.add(floorMesh);
    scene.add(floorGroup);

    /* ── Layer 2: Demising walls (y=0 to y=3.5) ── */
    var wallGroup = new THREE.Group();
    var wallH = 3.5;

    // Outer walls — box outline (bottom, top, verticals)
    // Bottom
    wallGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(hW, 0, -hD),
      new THREE.Vector3(hW, 0, hD), new THREE.Vector3(-hW, 0, hD),
      new THREE.Vector3(-hW, 0, -hD),
    ]), wallMat.clone()));
    // Top
    wallGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, -hD), new THREE.Vector3(hW, wallH, -hD),
      new THREE.Vector3(hW, wallH, hD), new THREE.Vector3(-hW, wallH, hD),
      new THREE.Vector3(-hW, wallH, -hD),
    ]), wallMat.clone()));
    // 4 corner verticals
    [[-hW, -hD], [hW, -hD], [hW, hD], [-hW, hD]].forEach(function(c) {
      wallGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], wallH, c[1]),
      ]), wallMat.clone()));
    });

    // Internal partition at x=-3 (partial depth: z=-hD to z=2)
    wallGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, 0, -hD), new THREE.Vector3(-3, 0, 2),
      new THREE.Vector3(-3, wallH, 2), new THREE.Vector3(-3, wallH, -hD),
      new THREE.Vector3(-3, 0, -hD),
    ]), wallMat.clone()));
    // Internal partition at x=4 (partial depth: z=-3 to z=hD)
    wallGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(4, 0, -3), new THREE.Vector3(4, 0, hD),
      new THREE.Vector3(4, wallH, hD), new THREE.Vector3(4, wallH, -3),
      new THREE.Vector3(4, 0, -3),
    ]), wallMat.clone()));
    // Short cross-wall at z=0 between x=-3 and x=4
    wallGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, 0, 0), new THREE.Vector3(4, 0, 0),
      new THREE.Vector3(4, wallH, 0), new THREE.Vector3(-3, wallH, 0),
      new THREE.Vector3(-3, 0, 0),
    ]), wallMat.clone()));
    scene.add(wallGroup);

    /* ── Layer 3: Duct runs / HVAC (y=4 to y=4.5) ── */
    var ductGroup = new THREE.Group();

    // Main runs along length (x direction)
    var ductY = 4.25;
    [[-3, ductY, -4, -3, ductY, 4], [0, ductY, -4, 0, ductY, 4], [4, ductY, -4, 4, ductY, 4]].forEach(function(r) {
      // Dashed effect: draw as segments with gaps
      for (var dz = r[2]; dz < r[5]; dz += 1.2) {
        var endZ = Math.min(dz + 0.8, r[5]);
        ductGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(r[0], r[1], dz), new THREE.Vector3(r[3], r[4], endZ),
        ]), ductMat.clone()));
      }
    });

    // Branch drops (vertical short segments)
    [[-3, 2], [0, -1], [4, 3]].forEach(function(bd) {
      ductGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd[0], 4.5, bd[1]), new THREE.Vector3(bd[0], 4.0, bd[1]),
      ]), ductMat.clone()));
    });

    // A cross-run along z at x=1
    for (var cz = -hD; cz < hD; cz += 1.2) {
      var cEnd = Math.min(cz + 0.8, hD);
      ductGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(1, ductY, cz), new THREE.Vector3(1, ductY, cEnd),
      ]), ductMat.clone()));
    }
    scene.add(ductGroup);

    /* ── Layer 4: Conduit / electrical (y=5 to y=5.3) ── */
    var conduitGroup = new THREE.Group();
    var condY = 5.15;

    // Horizontal runs (shorter dotted segments)
    [[-5, condY, -3, 2, condY, -3], [-4, condY, 1, 5, condY, 1], [-2, condY, 4, 6, condY, 4]].forEach(function(r) {
      for (var cx = r[0]; cx < r[3]; cx += 0.8) {
        var cxEnd = Math.min(cx + 0.4, r[3]);
        conduitGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(cx, r[1], r[2]), new THREE.Vector3(cxEnd, r[4], r[5]),
        ]), conduitMat.clone()));
      }
    });

    // Vertical drops (junction boxes)
    [[-4, -3], [0, 1], [3, -3], [5, 4], [-2, 4]].forEach(function(jb) {
      conduitGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(jb[0], 5.0, jb[1]), new THREE.Vector3(jb[0], 5.3, jb[1]),
      ]), conduitMat.clone()));
    });
    scene.add(conduitGroup);

    /* ── Layer 5: Ceiling grid (y=6) ── */
    var ceilingGroup = new THREE.Group();
    var ceilY = 6;

    // 7 lines along z (spaced across x)
    for (var ci = 0; ci < 7; ci++) {
      var cx2 = -hW + (fW / 6) * ci;
      ceilingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cx2, ceilY, -hD), new THREE.Vector3(cx2, ceilY, hD),
      ]), ceilingMat.clone()));
    }
    // 5 lines along x (spaced across z)
    for (var cj = 0; cj < 5; cj++) {
      var cz2 = -hD + (fD / 4) * cj;
      ceilingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, ceilY, cz2), new THREE.Vector3(hW, ceilY, cz2),
      ]), ceilingMat.clone()));
    }
    scene.add(ceilingGroup);

    /* ═══ On-Load Assembly Animation ═══ */
    var layers = [floorGroup, wallGroup, ductGroup, conduitGroup, ceilingGroup];
    var finalYs = [0, 0, 0, 0, 0]; // groups already at correct y via geometry
    var explodeOffsets = [60, 55, 50, 45, 40];
    var layerTargetOpacity = [0.25, 0.25, 0.2, 0.25, 0.18];
    var fillTargetOpacity = 0.08;

    // Set initial exploded positions
    layers.forEach(function(group, i) {
      group.position.y = explodeOffsets[i];
      group.position.z = (4 - i) * 1.5; // slight z stagger
    });

    // Animate each layer to final position
    layers.forEach(function(group, i) {
      var delay = 0.3 * i;

      // Position tween
      gsap.to(group.position, {
        y: finalYs[i], z: 0,
        duration: 2.5, delay: delay, ease: 'power3.out',
      });

      // Opacity tween for all children
      group.traverse(function(child) {
        if (!child.material) return;
        var isFloorFill = (i === 0 && child.type === 'Mesh');
        var target = isFloorFill ? fillTargetOpacity : layerTargetOpacity[i];
        gsap.to(child.material, {
          opacity: target, duration: 2.5, delay: delay, ease: 'power2.out',
        });
      });
    });

    /* ── Mouse parallax ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Render loop ── */
    var baseAngle = 0;

    function animate() {
      rt.heroRaf = requestAnimationFrame(animate);
      if (rt.heroDisposed) return;

      baseAngle += 0.0008;

      // Camera auto-orbit + mouse parallax
      var radius = 26;
      camera.position.set(
        Math.cos(baseAngle) * radius + mouseX * 0.25,
        10 + mouseY * 2,
        Math.sin(baseAngle) * radius
      );
      camera.lookAt(0, 3, 0);

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
     initCommercialPrecon — Pinned 4-Layer Three.js Reveal
     ═══════════════════════════════════════════════ */
  function initCommercialPrecon(rt) {
    var wrap = document.getElementById('cm-precon-canvas');
    var pinTarget = document.querySelector('.cm-precon-desktop');
    if (!wrap || !pinTarget || typeof THREE === 'undefined') return;

    /* ── Colors ── */
    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var creamColor = 0xf0ede8;

    /* ── Scene + Camera + Renderer ── */
    var isMobile = rt.isMobile;
    var w = wrap.clientWidth, h = wrap.clientHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 150);
    camera.position.set(16, 10, 18);
    camera.lookAt(0, 2, 0);

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

    /* ── Lights (ambient only initially; layer 4 adds point lights) ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.2));

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

    /* ── Building dimensions ── */
    var fW = 14, fD = 10, hW = fW / 2, hD = fD / 2, wallH = 3.5;

    /* ═══ LAYER 1 — Site Shell (0%-25%) ═══ */
    var layer1 = new THREE.Group();

    // Floor slab outline
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(hW, 0, -hD),
      new THREE.Vector3(hW, 0, hD), new THREE.Vector3(-hW, 0, hD),
      new THREE.Vector3(-hW, 0, -hD),
    ]), wireMat(wireColor, 0.3)));

    // Top ring
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, wallH, -hD), new THREE.Vector3(hW, wallH, -hD),
      new THREE.Vector3(hW, wallH, hD), new THREE.Vector3(-hW, wallH, hD),
      new THREE.Vector3(-hW, wallH, -hD),
    ]), wireMat(wireColor, 0.3)));

    // 4 corner verticals
    [[-hW, -hD], [hW, -hD], [hW, hD], [-hW, hD]].forEach(function(c) {
      layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], wallH, c[1]),
      ]), wireMat(wireColor, 0.3)));
    });

    // Front wall (z = -hD) with 2 openings: door gap and window gap
    // Segments: left edge to opening1, gap, mid segment, gap, right edge
    var frontY0 = 0, frontY1 = wallH, fz = -hD;
    // Bottom edge with gaps
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, frontY0, fz), new THREE.Vector3(-4, frontY0, fz),
    ]), wireMat(wireColor, 0.3)));
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1, frontY0, fz), new THREE.Vector3(2, frontY0, fz),
    ]), wireMat(wireColor, 0.3)));
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(5, frontY0, fz), new THREE.Vector3(hW, frontY0, fz),
    ]), wireMat(wireColor, 0.3)));
    // Top edge with gaps
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, frontY1, fz), new THREE.Vector3(-4, frontY1, fz),
    ]), wireMat(wireColor, 0.3)));
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1, frontY1, fz), new THREE.Vector3(2, frontY1, fz),
    ]), wireMat(wireColor, 0.3)));
    layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(5, frontY1, fz), new THREE.Vector3(hW, frontY1, fz),
    ]), wireMat(wireColor, 0.3)));
    // Verticals at opening edges
    [-4, -1, 2, 5].forEach(function(x) {
      layer1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, frontY0, fz), new THREE.Vector3(x, frontY1, fz),
      ]), wireMat(wireColor, 0.3)));
    });

    scene.add(layer1);

    /* ═══ LAYER 2 — Code & MEP Overlay (25%-50%) ═══ */
    var layer2 = new THREE.Group();
    var ductY = 3.2;

    // 3 HVAC trunk lines along ceiling
    [-3, 0, 4].forEach(function(xPos) {
      layer2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xPos, ductY, -hD), new THREE.Vector3(xPos, ductY, hD),
      ]), wireMat(wireColor, 0.2)));
    });

    // 4 branch drops from trunks
    [[-3, -2], [-3, 3], [0, 1], [4, -1]].forEach(function(bd) {
      layer2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd[0], ductY, bd[1]), new THREE.Vector3(bd[0], 2, bd[1]),
      ]), wireMat(wireColor, 0.2)));
    });

    // 2 plumbing risers (floor to ceiling)
    [-5, 3].forEach(function(xPos) {
      layer2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xPos, 0, 2), new THREE.Vector3(xPos, wallH, 2),
      ]), wireMat(accentColor, 0.25)));
    });

    // Fire sprinkler main + 6 drops
    layer2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW + 1, ductY + 0.15, 0), new THREE.Vector3(hW - 1, ductY + 0.15, 0),
    ]), wireMat(accentColor, 0.25)));
    for (var si = 0; si < 6; si++) {
      var sx = -hW + 2 + si * ((fW - 4) / 5);
      layer2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sx, ductY + 0.15, 0), new THREE.Vector3(sx, ductY - 0.3, 0),
      ]), wireMat(accentColor, 0.25)));
    }

    scene.add(layer2);

    /* ═══ LAYER 3 — Procurement & Schedule (50%-75%) ═══ */
    var layer3 = new THREE.Group();

    // 5 Gantt-style horizontal bars floating to the right of the building
    var ganttBars = [
      { y: 2.8, x0: 8, x1: 13.5 },
      { y: 2.4, x0: 8.5, x1: 12 },
      { y: 2.0, x0: 8, x1: 14 },
      { y: 1.6, x0: 9, x1: 12.5 },
      { y: 1.2, x0: 8, x1: 11 },
    ];
    ganttBars.forEach(function(bar) {
      layer3.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bar.x0, bar.y, 0), new THREE.Vector3(bar.x1, bar.y, 0),
      ]), wireMat(wireColor, 0.15)));
    });

    // Connecting lines from bars to building edge
    [
      { bx: 8, by: 2.8, tx: hW, ty: wallH },
      { bx: 8, by: 2.0, tx: hW, ty: wallH * 0.5 },
      { bx: 8, by: 1.2, tx: hW, ty: 0 },
    ].forEach(function(conn) {
      layer3.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(conn.bx, conn.by, 0), new THREE.Vector3(conn.tx, conn.ty, 0),
      ]), wireMat(wireColor, 0.1)));
    });

    scene.add(layer3);

    /* ═══ LAYER 4 — Built Environment (75%-100%) ═══ */
    var layer4 = new THREE.Group();

    // Filled floor plane
    var floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fD), meshMat(creamColor, 0.06));
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0.02, 0);
    layer4.add(floorMesh);

    // Ceiling plane
    var ceilMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fD), meshMat(creamColor, 0.04));
    ceilMesh.rotation.x = -Math.PI / 2;
    ceilMesh.position.set(0, wallH, 0);
    layer4.add(ceilMesh);

    // Interior partition lines (refined detail)
    var partitions = [
      [[-3, 0, -hD], [-3, 0, 2]],
      [[-3, wallH, -hD], [-3, wallH, 2]],
      [[-3, 0, 2], [-3, wallH, 2]],
      [[4, 0, -3], [4, 0, hD]],
      [[4, wallH, -3], [4, wallH, hD]],
      [[4, 0, -3], [4, wallH, -3]],
      [[-3, 0, 0], [4, 0, 0]],
      [[-3, wallH, 0], [4, wallH, 0]],
    ];
    partitions.forEach(function(seg) {
      layer4.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(seg[0][0], seg[0][1], seg[0][2]),
        new THREE.Vector3(seg[1][0], seg[1][1], seg[1][2]),
      ]), wireMat(wireColor, 0.2)));
    });

    // 3 point lights inside the space (start at intensity 0)
    var pointLights = [];
    [[-3, 1.8, -2], [1, 1.8, 2], [5, 1.8, -1]].forEach(function(pos) {
      var pl = new THREE.PointLight(wireColor, 0, 12);
      pl.position.set(pos[0], pos[1], pos[2]);
      pl.userData = { maxIntensity: 0.3 };
      layer4.add(pl);
      pointLights.push(pl);
    });

    scene.add(layer4);

    /* ── Gather all layers ── */
    var layers = [layer1, layer2, layer3, layer4];
    var layerStarts = [0, 0.25, 0.50, 0.75];
    var layerFadeDur = 0.15; // each layer fades in over 15% of total scroll

    /* ── DOM: Cards crossfade ── */
    var cards = document.querySelectorAll('.cm-precon-card');
    if (cards.length) {
      cards.forEach(function(card, i) {
        gsap.set(card, {
          position: 'absolute', right: '8vw', top: '50%',
          yPercent: -50, opacity: i === 0 ? 1 : 0,
          visibility: i === 0 ? 'visible' : 'hidden',
        });
      });
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

    /* ── Update layer opacities based on scroll progress ── */
    function updateLayers(p) {
      layers.forEach(function(group, i) {
        var start = layerStarts[i];
        var localP = Math.max(0, Math.min(1, (p - start) / layerFadeDur));

        group.traverse(function(child) {
          if (child.material && child.material.userData && typeof child.material.userData.maxOp === 'number') {
            child.material.opacity = child.material.userData.maxOp * localP;
          }
        });

        // Layer 4 point lights
        if (i === 3) {
          pointLights.forEach(function(pl) {
            pl.intensity = pl.userData.maxIntensity * localP;
          });
        }
      });

      // Current step (1-indexed)
      var step = p < 0.25 ? 1 : p < 0.50 ? 2 : p < 0.75 ? 3 : 4;

      // Card crossfade
      if (cards.length) {
        cards.forEach(function(card, i) {
          var isActive = (i + 1) === step;
          gsap.set(card, {
            opacity: isActive ? 1 : 0,
            visibility: isActive ? 'visible' : 'hidden',
          });
        });
      }

      // Counter + progress
      if (counterEl) {
        counterEl.textContent = ('0' + step).slice(-2) + ' / 04';
      }
      if (progressFill) {
        progressFill.style.width = (step / 4 * 100) + '%';
      }
    }

    /* ── ScrollTrigger pin ── */
    var st = ScrollTrigger.create({
      trigger: pinTarget,
      start: 'top top',
      end: '+=400%',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: function(self) {
        updateLayers(self.progress);
      },
    });
    rt.preconTriggers.push(st);

    /* ── Camera orbit state ── */
    var baseAngle = 0;

    /* ── Render loop via GSAP ticker ── */
    function renderTick() {
      if (!rt.preconRenderer) return;

      baseAngle += 0.0006;

      // Scrub-based camera: tighter as scroll progresses
      var stProgress = st.progress || 0;
      var radius = 20 - 6 * stProgress;
      var camHeight = 10 - 3 * stProgress;

      camera.position.set(
        Math.cos(baseAngle) * radius,
        camHeight,
        Math.sin(baseAngle) * radius
      );
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    }
    gsap.ticker.add(renderTick);

    // Store ticker ref for cleanup
    rt._preconTickerRef = renderTick;

    /* ── Resize handling ── */
    var preconResizeST = ScrollTrigger.create({
      trigger: pinTarget,
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

    // Initial render to avoid blank frame
    updateLayers(0);
    renderer.render(scene, camera);
  }

  /* ═══════════════════════════════════════════════
     BOOTSTRAP
     ═══════════════════════════════════════════════ */
  function bootstrap() {
    runtime.lenis = initLenis();

    if (!runtime.isReduced) {
      initCommercialHero(runtime);
      if (!runtime.isMobile) initCommercialPrecon(runtime);
    }
    initCommercialMotion(runtime);

    ScrollTrigger.create({
      trigger: '#cm-comparison',
      start: 'top bottom',
      once: true,
      onEnter: function() { teardownHero(runtime); },
    });

    window.addEventListener('resize', onResize);
  }

  window.addEventListener('DOMContentLoaded', bootstrap);
})();
