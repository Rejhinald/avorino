/* ═══════════════════════════════════════════════════════════════
   Avorino — ADU Floor Plans Page Animations
   ═══════════════════════════════════════════════════════════════
   Sections:
     1. Lenis smooth-scroll setup (synced with GSAP ticker)
     2. initHero()        — char-cascade h1, gold line, subtitle, scroll-hint
     3. initHero3D()      — Three.js exploded axonometric floor plan (5-group reveal)
     4. initGallery()     — stagger fade-up on plan cards
     5. initCustomPlans() — text animations + calls initCustom3D()
     6. initCustom3D()    — Three.js multi-layout blueprint scene
     7. initScrollAnimations() — all data-animate handlers
     8. initCTA()         — word-stagger-elastic, ambient glow, magnetic buttons
   ═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
  var lenis = new Lenis({
    duration: 1.4,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', function() { lenis.resize(); });

  /* ═══════════════════════════════════════════════
     UTILITY — TEXT SPLITTING
     ═══════════════════════════════════════════════ */
  function splitIntoWords(el) {
    var text = el.textContent.trim();
    var align = window.getComputedStyle(el).textAlign;
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
    if (align === 'center') el.style.justifyContent = 'center';
    var wordEls = [];
    text.split(/\s+/).forEach(function(word) {
      var wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'top';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = word;
      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      wordEls.push(inner);
    });
    return wordEls;
  }

  function splitIntoChars(el) {
    var text = el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
    var charEls = [];
    text.split(/\s+/).forEach(function(word) {
      var wordWrap = document.createElement('span');
      wordWrap.style.display = 'inline-flex';
      wordWrap.style.overflow = 'hidden';
      for (var i = 0; i < word.length; i++) {
        var charSpan = document.createElement('span');
        charSpan.style.display = 'inline-block';
        charSpan.textContent = word[i];
        wordWrap.appendChild(charSpan);
        charEls.push(charSpan);
      }
      el.appendChild(wordWrap);
    });
    return charEls;
  }

  /* ═══════════════════════════════════════════════
     HERO — Char Cascade + Gold Line + Scroll Hint
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('plans-hero');
    if (!hero) return;

    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('.plans-hero-gold-line');
    var subtitle = hero.querySelector('.plans-hero-subtitle');
    var label = hero.querySelector('.plans-hero-label');

    if (label) {
      label.removeAttribute('data-animate');
      gsap.fromTo(label,
        { opacity: 0, y: 20 },
        { opacity: 0.45, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
    }

    if (h1) {
      h1.removeAttribute('data-animate');
      var chars = splitIntoChars(h1);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.025, ease: 'elastic.out(1, 0.6)', delay: 0.4,
      });
    }

    if (goldLine) {
      gsap.to(goldLine, { width: '80px', duration: 1, delay: 1, ease: 'power3.inOut' });
    }

    if (subtitle) {
      subtitle.removeAttribute('data-animate');
      gsap.fromTo(subtitle,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 0.55, y: 0, filter: 'blur(0px)', duration: 1, delay: 1.2, ease: 'power3.out' }
      );
    }

    /* Hero content parallax on scroll */
    var heroContent = hero.querySelector('.plans-hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }

    /* Scroll hint */
    var hint = hero.querySelector('.plans-hero-scroll-hint');
    if (hint) {
      hint.removeAttribute('data-animate');
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 0.3, duration: 1, delay: 2, ease: 'power2.out' });
      gsap.to(hint, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '30% top', scrub: 1 },
      });
    }

    /* Kick off Three.js hero scene */
    initHero3D();
  }

  /* ═══════════════════════════════════════════════
     HERO 3D — Exploded Axonometric ADU Floor Plan
     5-group progressive timed reveal
     ═══════════════════════════════════════════════ */
  function initHero3D() {
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('hero-canvas');
    if (!wrap) return;

    /* ── Setup ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 200);
    camera.position.set(20, 16, 26);
    camera.lookAt(0, 2, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.4));
    var ptLight1 = new THREE.PointLight(0xc9a96e, 1.0, 80);
    ptLight1.position.set(15, 20, 20);
    scene.add(ptLight1);
    var ptLight2 = new THREE.PointLight(0xc8222a, 0.25, 60);
    ptLight2.position.set(-15, 5, 10);
    scene.add(ptLight2);

    /* ── Colors ── */
    var GOLD = 0xc9a96e, CREAM = 0xf0ede8, SLATE = 0x555555;

    /* ── Materials (one per group for opacity control — starts at 0) ── */
    function makeMat(c) { return new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }); }
    var gridMat   = makeMat(CREAM);
    var foundMat  = makeMat(GOLD);
    var wallMat   = makeMat(SLATE);
    var detailMat = makeMat(CREAM);
    var roofMat   = makeMat(GOLD);

    /* ── Geometry Helpers ── */
    function wireBox(w, h, d, mat) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat);
    }
    function wirePlane(w, h, mat) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)), mat);
    }
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }

    /* ── Scene Group — everything orbits together ── */
    var sg = new THREE.Group();
    scene.add(sg);

    /* ═══════════════════════════════════════════════
       GROUP 1 — Blueprint Grid (fine architectural grid)
       ═══════════════════════════════════════════════ */
    var gGrid = new THREE.Group();
    var gp = [];
    var i;
    for (i = -10; i <= 10; i += 1.5) { gp.push(i, 0, -8, i, 0, 8); }
    for (i = -8; i <= 8; i += 1.5) { gp.push(-10, 0, i, 10, 0, i); }
    gGrid.add(lineSegs(gp, gridMat));
    /* Cross-hair center markers */
    gGrid.add(lineSegs([
      -0.5, 0.01, 0,  0.5, 0.01, 0,
      0, 0.01, -0.5,  0, 0.01, 0.5,
    ], gridMat));
    sg.add(gGrid);

    /* ═══════════════════════════════════════════════
       GROUP 2 — Foundation / Floor Slab
       ═══════════════════════════════════════════════ */
    var gFound = new THREE.Group();

    /* Main floor slab */
    var slab = wireBox(12, 0.15, 8, foundMat);
    slab.position.set(0, 0.075, 0);
    gFound.add(slab);

    /* Floor grid divisions — room outlines on ground */
    gFound.add(lineSegs([
      /* Living / Kitchen divider */
      -1, 0.1, -4,   -1, 0.1, 4,
      /* Bedroom wall line */
       3, 0.1, -4,    3, 0.1, 4,
      /* Bath partition */
       3, 0.1,  1,    6, 0.1, 1,
      /* Entry vestibule */
      -3, 0.1, -4,   -3, 0.1, -1,
      /* Kitchen peninsula */
      -1, 0.1,  0,    2, 0.1, 0,
      /* Closet outline */
       5, 0.1, -4,    5, 0.1, -1,
       5, 0.1, -1,    6, 0.1, -1,
    ], foundMat));

    /* Porch step */
    var porch = wireBox(4, 0.08, 1.5, foundMat);
    porch.position.set(-2, 0.04, -5.25);
    gFound.add(porch);

    /* Foundation pier markers */
    gFound.add(lineSegs([
      -5.8, 0.05, -3.8,  -5.4, 0.05, -3.8,
      -5.6, 0.05, -4,    -5.6, 0.05, -3.6,
       5.8, 0.05, -3.8,   5.4, 0.05, -3.8,
       5.6, 0.05, -4,     5.6, 0.05, -3.6,
      -5.8, 0.05,  3.8,  -5.4, 0.05,  3.8,
      -5.6, 0.05,  3.6,  -5.6, 0.05,  4,
       5.8, 0.05,  3.8,   5.4, 0.05,  3.8,
       5.6, 0.05,  3.6,   5.6, 0.05,  4,
    ], foundMat));

    sg.add(gFound);

    /* ═══════════════════════════════════════════════
       GROUP 3 — Walls (exterior + interior)
       ═══════════════════════════════════════════════ */
    var gWalls = new THREE.Group();

    /* Exterior walls — main volume */
    var extWalls = wireBox(12, 7, 8, wallMat);
    extWalls.position.set(0, 3.5, 0);
    gWalls.add(extWalls);

    /* Interior wall: Living / Kitchen divider (full height) */
    gWalls.add(lineSegs([
      -1, 0, -4,  -1, 7, -4,
      -1, 0,  4,  -1, 7,  4,
      -1, 0, -4,  -1, 0,  4,
      -1, 7, -4,  -1, 7,  4,
    ], wallMat));

    /* Interior wall: Bedroom divider */
    gWalls.add(lineSegs([
      3, 0, -4,  3, 7, -4,
      3, 0,  4,  3, 7,  4,
      3, 0, -4,  3, 0,  4,
      3, 7, -4,  3, 7,  4,
    ], wallMat));

    /* Interior wall: Bathroom partition */
    gWalls.add(lineSegs([
      3, 0,  1,  6, 0,  1,
      3, 7,  1,  6, 7,  1,
      3, 0,  1,  3, 7,  1,
      6, 0,  1,  6, 7,  1,
    ], wallMat));

    /* Interior wall: Entry alcove */
    gWalls.add(lineSegs([
      -3, 0, -4,  -3, 0, -1,
      -3, 7, -4,  -3, 7, -1,
      -3, 0, -1,  -3, 7, -1,
    ], wallMat));

    /* Closet partition in bedroom */
    gWalls.add(lineSegs([
      5, 0, -4,  5, 0, -1,
      5, 7, -4,  5, 7, -1,
      5, 0, -4,  5, 7, -4,
      5, 0, -1,  5, 7, -1,
    ], wallMat));

    /* Kitchen half-wall / peninsula */
    gWalls.add(lineSegs([
      -1, 0,  0,   2, 0,  0,
      -1, 3,  0,   2, 3,  0,
      -1, 0,  0,  -1, 3,  0,
       2, 0,  0,   2, 3,  0,
    ], wallMat));

    /* Laundry alcove wall */
    gWalls.add(lineSegs([
      -1, 0, 2.5,  -1, 7, 2.5,
      -1, 0, 2.5,   0, 0, 2.5,
      -1, 7, 2.5,   0, 7, 2.5,
       0, 0, 2.5,   0, 7, 2.5,
    ], wallMat));

    sg.add(gWalls);

    /* ═══════════════════════════════════════════════
       GROUP 4 — Windows + Doors (with cross-panes)
       ═══════════════════════════════════════════════ */
    var gDetail = new THREE.Group();

    function windowFrame(cx, cy, cz, w, h, axis) {
      var hw = w / 2, hh = h / 2, pts = [];
      if (axis === 'x') {
        pts.push(cx, cy-hh, cz-hw, cx, cy-hh, cz+hw);
        pts.push(cx, cy-hh, cz+hw, cx, cy+hh, cz+hw);
        pts.push(cx, cy+hh, cz+hw, cx, cy+hh, cz-hw);
        pts.push(cx, cy+hh, cz-hw, cx, cy-hh, cz-hw);
        /* Cross-panes */
        pts.push(cx, cy, cz-hw, cx, cy, cz+hw);
        pts.push(cx, cy-hh, cz, cx, cy+hh, cz);
      } else {
        pts.push(cx-hw, cy-hh, cz, cx+hw, cy-hh, cz);
        pts.push(cx+hw, cy-hh, cz, cx+hw, cy+hh, cz);
        pts.push(cx+hw, cy+hh, cz, cx-hw, cy+hh, cz);
        pts.push(cx-hw, cy+hh, cz, cx-hw, cy-hh, cz);
        /* Cross-panes */
        pts.push(cx-hw, cy, cz, cx+hw, cy, cz);
        pts.push(cx, cy-hh, cz, cx, cy+hh, cz);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, detailMat);
    }

    /* Front face (z = -4) — Living room large windows */
    gDetail.add(windowFrame(-4, 3.5, -4.01, 2.4, 2.4, 'z'));
    gDetail.add(windowFrame(-2, 3.5, -4.01, 1.6, 2.4, 'z'));
    /* Front face — Bedroom windows */
    gDetail.add(windowFrame(4, 3.5, -4.01, 1.8, 2, 'z'));
    gDetail.add(windowFrame(5.5, 3.5, -4.01, 1, 1.4, 'z'));

    /* Front door frame */
    var doorFrame = wirePlane(1.4, 3, detailMat);
    doorFrame.position.set(-3, 1.5, -4.02);
    gDetail.add(doorFrame);
    /* Door handle detail */
    gDetail.add(lineSegs([
      -2.5, 1.5, -4.03,  -2.5, 1.8, -4.03,
    ], detailMat));

    /* Back face (z = 4) — Kitchen / Living sliding glass */
    gDetail.add(lineSegs([
      0.5, 0, 4.02,   2.5, 0, 4.02,
      2.5, 0, 4.02,   2.5, 5, 4.02,
      2.5, 5, 4.02,   0.5, 5, 4.02,
      0.5, 5, 4.02,   0.5, 0, 4.02,
      1.5, 0, 4.02,   1.5, 5, 4.02,
    ], detailMat));
    /* Back face — Kitchen windows */
    gDetail.add(windowFrame(-4, 3.5, 4.01, 2.8, 2, 'z'));
    gDetail.add(windowFrame(-1.5, 3.5, 4.01, 1.6, 2, 'z'));
    /* Back face — Bath window */
    gDetail.add(windowFrame(4.5, 5, 4.01, 1, 1.2, 'z'));

    /* Left side (x = -6) */
    gDetail.add(windowFrame(-6.01, 3.5, -1.5, 1.8, 2, 'x'));
    gDetail.add(windowFrame(-6.01, 3.5,  1.5, 1.8, 2, 'x'));

    /* Right side (x = 6) — Bedroom */
    gDetail.add(windowFrame(6.01, 3.5, -1.5, 2, 2.2, 'x'));

    sg.add(gDetail);

    /* ═══════════════════════════════════════════════
       GROUP 5 — Roof + Gold Accents + Connected Structural Detail
       ═══════════════════════════════════════════════ */
    var gRoof = new THREE.Group();

    /* Flat roof with overhang */
    var ov = 0.6;
    gRoof.add(lineSegs([
      -6-ov, 7.2, -4-ov,   6+ov, 7.2, -4-ov,
       6+ov, 7.2, -4-ov,   6+ov, 7.2,  4+ov,
       6+ov, 7.2,  4+ov,  -6-ov, 7.2,  4+ov,
      -6-ov, 7.2,  4+ov,  -6-ov, 7.2, -4-ov,
    ], roofMat));

    /* Roof ridge line */
    gRoof.add(lineSegs([
      -6-ov, 7.2, 0,  6+ov, 7.2, 0,
    ], roofMat));

    /* Roof cross-bracing (structural detail) */
    gRoof.add(lineSegs([
      -6-ov, 7.2, -4-ov,   6+ov, 7.2,  4+ov,
       6+ov, 7.2, -4-ov,  -6-ov, 7.2,  4+ov,
    ], roofMat));

    /* Parapet / Fascia */
    gRoof.add(lineSegs([
      -6-ov, 7.6, -4-ov,   6+ov, 7.6, -4-ov,
       6+ov, 7.6, -4-ov,   6+ov, 7.6,  4+ov,
       6+ov, 7.6,  4+ov,  -6-ov, 7.6,  4+ov,
      -6-ov, 7.6,  4+ov,  -6-ov, 7.6, -4-ov,
      /* Vertical fascia edges */
      -6-ov, 7.2, -4-ov,  -6-ov, 7.6, -4-ov,
       6+ov, 7.2, -4-ov,   6+ov, 7.6, -4-ov,
       6+ov, 7.2,  4+ov,   6+ov, 7.6,  4+ov,
      -6-ov, 7.2,  4+ov,  -6-ov, 7.6,  4+ov,
    ], roofMat));

    /* Skylight detail on roof */
    gRoof.add(lineSegs([
      -2, 7.22, -1.5,  1, 7.22, -1.5,
       1, 7.22, -1.5,  1, 7.22,  1.5,
       1, 7.22,  1.5, -2, 7.22,  1.5,
      -2, 7.22,  1.5, -2, 7.22, -1.5,
      -0.5, 7.22, -1.5, -0.5, 7.22, 1.5,
      -2, 7.22, 0,  1, 7.22, 0,
    ], roofMat));

    /* Ridge beam — horizontal line along roof peak, front to back */
    gRoof.add(lineSegs([
      0, 8.0, -4-ov,  0, 8.0, 4+ov,
    ], roofMat));

    /* Rafters — from overhang edges up to ridge beam */
    gRoof.add(lineSegs([
      -6-ov, 7.2, -4-ov,   0, 8.0, -4-ov,
       6+ov, 7.2, -4-ov,   0, 8.0, -4-ov,
      -6-ov, 7.2,  4+ov,   0, 8.0,  4+ov,
       6+ov, 7.2,  4+ov,   0, 8.0,  4+ov,
    ], roofMat));

    /* Eave returns — overhang corners down to wall top corners */
    gRoof.add(lineSegs([
      -6-ov, 7.2, -4-ov,  -6, 7, -4,
       6+ov, 7.2, -4-ov,   6, 7, -4,
      -6-ov, 7.2,  4+ov,  -6, 7,  4,
       6+ov, 7.2,  4+ov,   6, 7,  4,
    ], roofMat));

    /* Entry canopy — brackets attached to front wall above door */
    gRoof.add(lineSegs([
      -4, 3.5, -4.01,  -4, 3.5, -5.25,
      -2, 3.5, -4.01,  -2, 3.5, -5.25,
      -4, 3.5, -5.25,  -2, 3.5, -5.25,
      /* Canopy support posts — down to porch slab */
      -4, 3.5, -5.25,  -4, 0.08, -5.25,
      -2, 3.5, -5.25,  -2, 0.08, -5.25,
    ], roofMat));

    sg.add(gRoof);

    /* ═══════════════════════════════════════════════
       PARTICLES — Rising gold construction motes (60)
       ═══════════════════════════════════════════════ */
    var PC = 60;
    var pArr = new Float32Array(PC * 3);
    var pVel = [];
    for (i = 0; i < PC; i++) {
      pArr[i * 3]     = (Math.random() - 0.5) * 28;
      pArr[i * 3 + 1] = Math.random() * 16;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 22;
      pVel.push(0.003 + Math.random() * 0.008);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.1, transparent: true, opacity: 0, sizeAttenuation: true,
    });
    sg.add(new THREE.Points(pGeo, pMat));

    /* ── Mouse Parallax ── */
    var mouse = { x: 0, y: 0 };
    var targetRot = { x: 0, y: 0 };
    document.addEventListener('mousemove', function(e) {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Scroll parallax for camera ── */
    var scrollP = 0;
    ScrollTrigger.create({
      trigger: '#plans-hero', start: 'top top', end: 'bottom top',
      onUpdate: function(s) { scrollP = s.progress; },
    });

    /* ── Visibility gate ── */
    var isVisible = true;
    new IntersectionObserver(function(e) {
      isVisible = e[0].isIntersecting;
    }, { threshold: 0.01 }).observe(wrap);

    /* ═══════════════════════════════════════════════
       RENDER LOOP — Timed progressive reveal
       5-group with cubic ease-out
       ═══════════════════════════════════════════════ */
    var clock = new THREE.Clock();
    var baseRotY = -0.3;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      var t = clock.getElapsedTime();

      /* GROUP 1: Blueprint Grid — 0.0s to 0.8s */
      gridMat.opacity = clamp(t / 0.8) * 0.12;

      /* GROUP 2: Foundation — 0.3s to 1.2s (rises from below) */
      var fv = ease(clamp((t - 0.3) / 0.9));
      foundMat.opacity = fv * 0.5;
      gFound.position.y = -2 * (1 - fv);

      /* GROUP 3: Walls — 0.8s to 2.0s (explode upward from ground) */
      var wv = ease(clamp((t - 0.8) / 1.2));
      wallMat.opacity = wv * 0.4;
      gWalls.position.y = -6 * (1 - wv);

      /* GROUP 4: Windows + Doors — 1.5s to 2.5s (track wall position) */
      var dv = ease(clamp((t - 1.5) / 1.0));
      detailMat.opacity = dv * 0.35;
      gDetail.position.y = gWalls.position.y;

      /* GROUP 5: Roof — 2.0s to 3.2s (floats down from above) */
      var rv = ease(clamp((t - 2.0) / 1.2));
      roofMat.opacity = rv * 0.6;
      gRoof.position.y = 5 * (1 - rv);

      /* PARTICLES — 2.5s sustained */
      pMat.opacity = clamp((t - 2.5) / 1.0) * 0.35;

      /* Camera orbit + mouse parallax */
      targetRot.y = baseRotY + t * 0.03 + scrollP * 0.5;
      targetRot.x = mouse.y * 0.04;
      sg.rotation.y += (targetRot.y + mouse.x * 0.12 - sg.rotation.y) * 0.015;
      sg.rotation.x += (targetRot.x - sg.rotation.x) * 0.015;

      /* Breathing animation */
      var breathe = 1 + Math.sin(t * 0.4) * 0.008;
      sg.scale.setScalar(breathe);

      /* Camera scroll parallax */
      camera.position.y = 16 - scrollP * 8;
      camera.lookAt(0, 2, 0);

      /* Gentle light movement */
      ptLight1.position.x = 15 + Math.sin(t * 0.3) * 3;
      ptLight1.position.z = 20 + Math.cos(t * 0.2) * 3;

      /* Particle rise */
      var pa = pGeo.attributes.position.array;
      for (var j = 0; j < PC; j++) {
        pa[j * 3 + 1] += pVel[j];
        if (pa[j * 3 + 1] > 18) {
          pa[j * 3 + 1] = -1;
          pa[j * 3]     = (Math.random() - 0.5) * 28;
          pa[j * 3 + 2] = (Math.random() - 0.5) * 22;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    /* ── Debounced Resize ── */
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        /* Canvas stays visible on all viewports */
        var w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    });
  }

  /* ═══════════════════════════════════════════════
     PLANS GALLERY — Staggered fade-up on cards
     ═══════════════════════════════════════════════ */
  function initGallery() {
    var cards = document.querySelectorAll('.plan-card');
    if (!cards.length) return;

    cards.forEach(function(card, i) {
      card.removeAttribute('data-animate');
      gsap.fromTo(card,
        { y: 60, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 0.9, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.plans-grid', start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    });

    /* Desktop hover lift */
    if (window.innerWidth >= 992) {
      cards.forEach(function(card) {
        card.style.cursor = 'pointer';
        card.addEventListener('mouseenter', function() {
          gsap.to(card, { y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.25)', duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', function() {
          gsap.to(card, { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.4, ease: 'power2.out' });
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════
     CUSTOM PLANS — Text animations + calls initCustom3D()
     ═══════════════════════════════════════════════ */
  function initCustomPlans() {
    var section = document.getElementById('plans-custom');
    if (!section) return;

    /* Kick off Three.js custom scene */
    initCustom3D();
  }

  /* ═══════════════════════════════════════════════
     CUSTOM 3D — Multi-Layout Blueprint Composition
     3 overlapping wireframe layouts + particles + orbit
     ═══════════════════════════════════════════════ */
  function initCustom3D() {
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('custom-canvas');
    if (!wrap) return;

    /* ── Renderer ── */
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(18, 14, 24);
    camera.lookAt(0, 3, 0);

    function handleResize() {
      var w = wrap.clientWidth || 1, h = wrap.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    handleResize();

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var ptL = new THREE.PointLight(0xc9a96e, 0.8, 80);
    ptL.position.set(15, 20, 20);
    scene.add(ptL);

    /* ── Colors ── */
    var GOLD = 0xc9a96e, CREAM = 0xf0ede8, SLATE = 0x555555;

    /* ── Materials ── */
    var goldLine   = new THREE.LineBasicMaterial({ color: GOLD,  transparent: true, opacity: 0.5 });
    var goldFaint  = new THREE.LineBasicMaterial({ color: GOLD,  transparent: true, opacity: 0.15 });
    var creamLine  = new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: 0.2 });
    var creamFaint = new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: 0.08 });
    var slateLine  = new THREE.LineBasicMaterial({ color: SLATE, transparent: true, opacity: 0.25 });

    /* ── Geometry Helpers ── */
    function wireBox(w, h, d, mat) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat);
    }
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }

    /* ── Scene Group ── */
    var sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    /* ═══════════════════════════════════════════════
       GROUND GRID — Blueprint base
       ═══════════════════════════════════════════════ */
    var gridSize = 24, gridDiv = 12, gridStep = gridSize / gridDiv;
    var gp = [];
    var i;
    for (i = 0; i <= gridDiv; i++) {
      var pos = -gridSize / 2 + i * gridStep;
      gp.push(-gridSize / 2, 0, pos, gridSize / 2, 0, pos);
      gp.push(pos, 0, -gridSize / 2, pos, 0, gridSize / 2);
    }
    sceneGroup.add(lineSegs(gp, creamFaint));

    /* ═══════════════════════════════════════════════
       LAYOUT A — Studio (compact, left)
       ═══════════════════════════════════════════════ */
    var layoutA = wireBox(6, 5, 5, goldLine);
    layoutA.position.set(-4, 2.5, -3);
    sceneGroup.add(layoutA);

    /* Interior partition */
    sceneGroup.add(lineSegs([
      -4, 0, -3.5,  -4, 5, -3.5,
      -4, 0, -0.5,  -4, 5, -0.5,
      -4, 0, -3.5,  -4, 0, -0.5,
      -4, 5, -3.5,  -4, 5, -0.5,
    ], slateLine));

    /* Window openings — Layout A */
    function windowFrame2(cx, cy, cz, w, h, axis) {
      var hw = w / 2, hh = h / 2, pts = [];
      if (axis === 'x') {
        pts.push(cx, cy-hh, cz-hw, cx, cy-hh, cz+hw);
        pts.push(cx, cy-hh, cz+hw, cx, cy+hh, cz+hw);
        pts.push(cx, cy+hh, cz+hw, cx, cy+hh, cz-hw);
        pts.push(cx, cy+hh, cz-hw, cx, cy-hh, cz-hw);
        pts.push(cx, cy, cz-hw, cx, cy, cz+hw);
        pts.push(cx, cy-hh, cz, cx, cy+hh, cz);
      } else {
        pts.push(cx-hw, cy-hh, cz, cx+hw, cy-hh, cz);
        pts.push(cx+hw, cy-hh, cz, cx+hw, cy+hh, cz);
        pts.push(cx+hw, cy+hh, cz, cx-hw, cy+hh, cz);
        pts.push(cx-hw, cy+hh, cz, cx-hw, cy-hh, cz);
        pts.push(cx-hw, cy, cz, cx+hw, cy, cz);
        pts.push(cx, cy-hh, cz, cx, cy+hh, cz);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, creamLine);
    }

    sceneGroup.add(windowFrame2(-7.01, 2.5, -3.5, 1.4, 2, 'x'));
    sceneGroup.add(windowFrame2(-5, 2.5, -5.51, 1.4, 2, 'z'));
    sceneGroup.add(windowFrame2(-3, 2.5, -5.51, 1.4, 2, 'z'));

    /* ═══════════════════════════════════════════════
       LAYOUT B — 1-Bed (medium, right)
       ═══════════════════════════════════════════════ */
    var layoutB = wireBox(7, 5.5, 6, goldLine);
    layoutB.position.set(3, 2.75, 2);
    sceneGroup.add(layoutB);

    /* Interior walls */
    sceneGroup.add(lineSegs([
      3, 0, -1,   3, 5.5, -1,
      3, 0,  5,   3, 5.5,  5,
      3, 0, -1,   3, 0,    5,
      3, 5.5, -1,  3, 5.5,  5,
      /* Bedroom partition */
      5, 0,  2,   5, 5.5,  2,
      5, 0, -1,   5, 5.5, -1,
      5, 0, -1,   5, 0,    2,
      5, 5.5, -1,  5, 5.5,  2,
    ], slateLine));

    /* Layout B windows */
    sceneGroup.add(windowFrame2(2, 2.5, -1.01, 1.4, 2, 'z'));
    sceneGroup.add(windowFrame2(4.5, 2.5, -1.01, 1.4, 2, 'z'));
    sceneGroup.add(windowFrame2(6.51, 2.5, 1, 1.4, 2, 'x'));
    sceneGroup.add(windowFrame2(6.51, 2.5, 3.5, 1.4, 2, 'x'));
    sceneGroup.add(windowFrame2(-0.5, 2.65, 5.01, 2.5, 2.3, 'z'));

    /* ═══════════════════════════════════════════════
       LAYOUT C — 2-Bed (tall, overlapping)
       ═══════════════════════════════════════════════ */
    var layoutC = wireBox(5, 7, 4.5, goldFaint);
    layoutC.position.set(-2, 3.5, 4.5);
    sceneGroup.add(layoutC);

    sceneGroup.add(lineSegs([
      -2, 0, 2.25,  -2, 7, 2.25,
      -2, 0, 6.75,  -2, 7, 6.75,
      -2, 0, 2.25,  -2, 0, 6.75,
      -2, 7, 2.25,  -2, 7, 6.75,
    ], slateLine));

    sceneGroup.add(windowFrame2(-4.51, 3.5, 4.5, 1.4, 2, 'x'));
    sceneGroup.add(windowFrame2(-2, 3.5, 6.76, 2, 2, 'z'));

    /* ═══════════════════════════════════════════════
       ROOF LINES — Flat roofs with overhang
       ═══════════════════════════════════════════════ */
    sceneGroup.add(lineSegs([
      /* Layout A roof */
      -7.4, 5.1, -5.9,  -0.6, 5.1, -5.9,
      -0.6, 5.1, -5.9,  -0.6, 5.1, -0.1,
      -0.6, 5.1, -0.1,  -7.4, 5.1, -0.1,
      -7.4, 5.1, -0.1,  -7.4, 5.1, -5.9,
      /* Layout B roof */
      -0.9, 5.7, -1.4,   6.9, 5.7, -1.4,
       6.9, 5.7, -1.4,   6.9, 5.7,  5.4,
       6.9, 5.7,  5.4,  -0.9, 5.7,  5.4,
      -0.9, 5.7,  5.4,  -0.9, 5.7, -1.4,
      /* Layout C roof */
      -4.9, 7.1, 1.9,   0.9, 7.1, 1.9,
       0.9, 7.1, 1.9,   0.9, 7.1, 7.1,
       0.9, 7.1, 7.1,  -4.9, 7.1, 7.1,
      -4.9, 7.1, 7.1,  -4.9, 7.1, 1.9,
    ], goldFaint));

    /* ═══════════════════════════════════════════════
       RIDGE BEAMS + RAFTERS + EAVE RETURNS
       ═══════════════════════════════════════════════ */

    /* Layout A: Ridge beam + rafters + eave returns */
    sceneGroup.add(lineSegs([
      /* Ridge beam along roof center */
      -4, 5.5, -5.9,  -4, 5.5, -0.1,
      /* Rafters from overhang edges up to ridge */
      -7.4, 5.1, -5.9,  -4, 5.5, -5.9,
      -0.6, 5.1, -5.9,  -4, 5.5, -5.9,
      -7.4, 5.1, -0.1,  -4, 5.5, -0.1,
      -0.6, 5.1, -0.1,  -4, 5.5, -0.1,
      /* Eave returns — overhang corners to wall top corners */
      -7.4, 5.1, -5.9,  -7, 5, -5.5,
      -0.6, 5.1, -5.9,  -1, 5, -5.5,
      -7.4, 5.1, -0.1,  -7, 5, -0.5,
      -0.6, 5.1, -0.1,  -1, 5, -0.5,
    ], goldFaint));

    /* Layout B: Ridge beam + rafters + eave returns */
    sceneGroup.add(lineSegs([
      /* Ridge beam along roof center */
      3, 6.1, -1.4,  3, 6.1, 5.4,
      /* Rafters from overhang edges up to ridge */
      -0.9, 5.7, -1.4,  3, 6.1, -1.4,
       6.9, 5.7, -1.4,  3, 6.1, -1.4,
      -0.9, 5.7,  5.4,  3, 6.1,  5.4,
       6.9, 5.7,  5.4,  3, 6.1,  5.4,
      /* Eave returns — overhang corners to wall top corners */
      -0.9, 5.7, -1.4,  -0.5, 5.5, -1,
       6.9, 5.7, -1.4,   6.5, 5.5, -1,
      -0.9, 5.7,  5.4,  -0.5, 5.5,  5,
       6.9, 5.7,  5.4,   6.5, 5.5,  5,
    ], goldFaint));

    /* Layout C: Ridge beam + rafters + eave returns */
    sceneGroup.add(lineSegs([
      /* Ridge beam along roof center */
      -2, 7.5, 1.9,  -2, 7.5, 7.1,
      /* Rafters from overhang edges up to ridge */
      -4.9, 7.1, 1.9,  -2, 7.5, 1.9,
       0.9, 7.1, 1.9,  -2, 7.5, 1.9,
      -4.9, 7.1, 7.1,  -2, 7.5, 7.1,
       0.9, 7.1, 7.1,  -2, 7.5, 7.1,
      /* Eave returns — overhang corners to wall top corners */
      -4.9, 7.1, 1.9,  -4.5, 7, 2.25,
       0.9, 7.1, 1.9,   0.5, 7, 2.25,
      -4.9, 7.1, 7.1,  -4.5, 7, 6.75,
       0.9, 7.1, 7.1,   0.5, 7, 6.75,
    ], goldFaint));

    /* ═══════════════════════════════════════════════
       PARTICLES — Rising gold motes (50)
       ═══════════════════════════════════════════════ */
    var PC = 50;
    var pArr = new Float32Array(PC * 3);
    var pData = [];
    for (i = 0; i < PC; i++) {
      pArr[i * 3]     = (Math.random() - 0.5) * 30;
      pArr[i * 3 + 1] = Math.random() * 12;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 30;
      pData.push({ speed: 0.003 + Math.random() * 0.008 });
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.1, transparent: true, opacity: 0.3, sizeAttenuation: true,
    });
    sceneGroup.add(new THREE.Points(pGeo, pMat));

    /* ── Mouse tracking — Subtle parallax ── */
    var mouse = { x: 0, y: 0 };
    var targetRot = { x: 0, y: 0 };
    document.addEventListener('mousemove', function(e) {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Visibility — Only render when section is in view ── */
    var isVisible = false;
    var customSection = document.getElementById('plans-custom');
    new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 }).observe(customSection);

    /* ═══════════════════════════════════════════════
       ANIMATION LOOP — slow orbit + mouse parallax
       ═══════════════════════════════════════════════ */
    var clock = new THREE.Clock();
    var baseRotY = -0.3;

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      var elapsed = clock.getElapsedTime();

      /* Slow orbit + mouse parallax */
      targetRot.y = baseRotY + mouse.x * 0.12 + elapsed * 0.03;
      targetRot.x = mouse.y * 0.06;

      sceneGroup.rotation.y += (targetRot.y - sceneGroup.rotation.y) * 0.015;
      sceneGroup.rotation.x += (targetRot.x - sceneGroup.rotation.x) * 0.015;

      /* Breathing animation */
      var breathe = 1 + Math.sin(elapsed * 0.4) * 0.008;
      sceneGroup.scale.setScalar(breathe);

      /* Subtle layout breathing — volumes gently bob */
      layoutA.position.y = 2.5 + Math.sin(elapsed * 0.5) * 0.15;
      layoutB.position.y = 2.75 + Math.sin(elapsed * 0.5 + 1.5) * 0.12;
      layoutC.position.y = 3.5 + Math.sin(elapsed * 0.5 + 3.0) * 0.1;

      /* Particle rise */
      var pPos = pGeo.getAttribute('position');
      for (var pi = 0; pi < PC; pi++) {
        pPos.array[pi * 3 + 1] += pData[pi].speed;
        if (pPos.array[pi * 3 + 1] > 16) {
          pPos.array[pi * 3 + 1] = -1;
          pPos.array[pi * 3]     = (Math.random() - 0.5) * 30;
          pPos.array[pi * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      pPos.needsUpdate = true;

      /* Gentle light movement */
      ptL.position.x = 15 + Math.sin(elapsed * 0.3) * 3;
      ptL.position.z = 20 + Math.cos(elapsed * 0.2) * 3;

      renderer.render(scene, camera);
    }

    animate();

    /* ── Debounced Resize ── */
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        /* Canvas stays visible on all viewports */
        handleResize();
      }, 150);
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS — data-animate handlers
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function(el) {
      gsap.fromTo(el,
        { y: 50, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    });

    /* word-stagger-elastic */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function(el) {
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    });

    /* parallax-depth */
    document.querySelectorAll('[data-animate="parallax-depth"]').forEach(function(el) {
      gsap.to(el, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    /* line-wipe */
    document.querySelectorAll('[data-animate="line-wipe"]').forEach(function(el) {
      var lineEls = el.querySelectorAll('.line');
      if (!lineEls.length) {
        var html = el.innerHTML;
        var texts;
        if (/<br\s*\/?>/i.test(html)) {
          texts = html.split(/<br\s*\/?>/i).map(function(s) {
            return s.replace(/<[^>]*>/g, '').trim();
          }).filter(Boolean);
        } else {
          texts = [el.textContent.trim()];
        }
        el.innerHTML = '';
        texts.forEach(function(t) {
          var d = document.createElement('div');
          d.className = 'line';
          d.textContent = t;
          el.appendChild(d);
        });
        lineEls = el.querySelectorAll('.line');
      }
      lineEls.forEach(function(line, i) {
        gsap.set(line, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(line, {
          clipPath: 'inset(0 0% 0 0)', ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top ' + (85 - i * 12) + '%',
            end: 'top ' + (65 - i * 12) + '%',
            scrub: 1,
          },
        });
      });
    });

    /* Label line expand */
    document.querySelectorAll('.av-label-line').forEach(function(line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line.parentElement, start: 'top 85%' } }
      );
    });

    requestAnimationFrame(function() {
      requestAnimationFrame(function() { ScrollTrigger.refresh(); });
    });
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function() { ScrollTrigger.refresh(); });
    }
  }

  /* ═══════════════════════════════════════════════
     CTA — Word-stagger-elastic + Ambient Glow + Magnetic Buttons
     ═══════════════════════════════════════════════ */
  function initCTA() {
    /* Ambient glow */
    var ctaSection = document.querySelector('.plans-cta-container');
    if (!ctaSection) return;

    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
      'width:140%;height:140%;border-radius:50%;pointer-events:none;z-index:0;',
      'background:radial-gradient(ellipse at center, rgba(200,34,42,0.06) 0%, transparent 60%);',
      'opacity:0;',
    ].join('');
    ctaSection.style.position = 'relative';
    ctaSection.insertBefore(glow, ctaSection.firstChild);

    ScrollTrigger.create({
      trigger: ctaSection,
      start: 'top 80%',
      onEnter: function() {
        gsap.to(glow, {
          opacity: 1, duration: 1.5, ease: 'power2.out',
          onComplete: function() {
            gsap.to(glow, { opacity: 0.4, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          },
        });
      },
      onLeaveBack: function() {
        gsap.to(glow, { opacity: 0, duration: 0.5, overwrite: true });
      },
    });

    /* Magnetic buttons (desktop) */
    if (window.innerWidth >= 992) {
      document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
          var r = btn.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.15;
          var y = (e.clientY - r.top - r.height / 2) * 0.15;
          gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', function() {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════
     INIT — Single DOMContentLoaded listener
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function() {
    initHero();
    initGallery();
    initCustomPlans();
    initScrollAnimations();
    initCTA();
  });

})();
