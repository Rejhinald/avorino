(function() {
  'use strict';

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger);

  var lenis = new Lenis({
    duration: 1.4,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', function () { lenis.resize(); });

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
    text.split(/\s+/).forEach(function (word) {
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
    text.split(/\s+/).forEach(function (word) {
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
     HERO — Three.js Construction Crane Scene
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('aduc-hero');
    if (!hero) return;

    /* ── Text entrance animations ── */
    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('.aduc-hero-gold-line');
    var subtitle = hero.querySelector('.aduc-hero-subtitle');
    var label = hero.querySelector('.aduc-hero-label');

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

    var heroContent = hero.querySelector('.aduc-hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }

    var hint = hero.querySelector('.aduc-hero-scroll-hint');
    if (hint) {
      hint.removeAttribute('data-animate');
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 0.3, duration: 1, delay: 2, ease: 'power2.out' });
      gsap.to(hint, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '30% top', scrub: 1 },
      });
    }

    /* ── Three.js construction crane scene ── */
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('hero-canvas');
    if (!wrap) return;

    /* Setup */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 1000);
    camera.position.set(18, 14, 24);
    camera.lookAt(0, 3, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var pl1 = new THREE.PointLight(0xc9a96e, 0.8, 80);
    pl1.position.set(18, 22, 22);
    scene.add(pl1);
    var pl2 = new THREE.PointLight(0xc8222a, 0.2, 60);
    pl2.position.set(-18, 6, 12);
    scene.add(pl2);

    /* Colors / Materials */
    var GOLD = 0xc9a96e, CREAM = 0xf0ede8, SLATE = 0x555555;

    function makeMat(c) { return new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }); }
    var gridMat = makeMat(CREAM);
    var foundMat = makeMat(GOLD);
    var structMat = makeMat(SLATE);
    var craneMat = makeMat(GOLD);
    var scaffMat = makeMat(SLATE);

    /* Geometry Helpers */
    function wireBox(w, h, d, mat) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat);
    }
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }
    function linePath(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.Line(g, mat);
    }

    var sg = new THREE.Group();
    scene.add(sg);

    /* GROUP 1 — Blueprint Grid */
    var gGrid = new THREE.Group(), gp = [], i;
    for (i = -10; i <= 10; i += 2) { gp.push(i, 0, -8, i, 0, 8); }
    for (i = -8; i <= 8; i += 2) { gp.push(-10, 0, i, 10, 0, i); }
    gGrid.add(lineSegs(gp, gridMat));
    sg.add(gGrid);

    /* GROUP 2 — Foundation / Footprint */
    var gFound = new THREE.Group();
    var mainFoot = wireBox(9, 0.15, 7, foundMat);
    mainFoot.position.set(0, 0.075, 0);
    gFound.add(mainFoot);
    /* Foundation trenches */
    gFound.add(lineSegs([
      -4.5, 0.08, -3.5, 4.5, 0.08, -3.5,
      -4.5, 0.08, 3.5, 4.5, 0.08, 3.5,
      -4.5, 0.08, -3.5, -4.5, 0.08, 3.5,
      4.5, 0.08, -3.5, 4.5, 0.08, 3.5,
      0, 0.08, -3.5, 0, 0.08, 3.5,
      -4.5, 0.08, 0, 4.5, 0.08, 0,
    ], foundMat));
    /* Rebar dots */
    gFound.add(lineSegs([
      -3, 0.1, -3.5, -3, 0.3, -3.5,
      -1.5, 0.1, -3.5, -1.5, 0.3, -3.5,
      1.5, 0.1, -3.5, 1.5, 0.3, -3.5,
      3, 0.1, -3.5, 3, 0.3, -3.5,
      -3, 0.1, 3.5, -3, 0.3, 3.5,
      -1.5, 0.1, 3.5, -1.5, 0.3, 3.5,
      1.5, 0.1, 3.5, 1.5, 0.3, 3.5,
      3, 0.1, 3.5, 3, 0.3, 3.5,
    ], foundMat));
    sg.add(gFound);

    /* GROUP 3 — Structure (walls + partial build) */
    var gStruct = new THREE.Group();
    var mainVol = wireBox(9, 6, 7, structMat);
    mainVol.position.set(0, 3, 0);
    gStruct.add(mainVol);
    /* Interior wall dividers */
    gStruct.add(lineSegs([
      0, 0, -3.5, 0, 6, -3.5,
      0, 0, 3.5, 0, 6, 3.5,
      -2.5, 0, 0, -2.5, 6, 0,
      2, 0, 0, 2, 6, 0,
      -4.5, 0, -1.5, -4.5, 6, -1.5,
    ], structMat));
    /* Window openings — front face */
    gStruct.add(lineSegs([
      -3.5, 2, -3.51, -1.5, 2, -3.51,
      -1.5, 2, -3.51, -1.5, 4.5, -3.51,
      -1.5, 4.5, -3.51, -3.5, 4.5, -3.51,
      -3.5, 4.5, -3.51, -3.5, 2, -3.51,
      1, 2, -3.51, 3.5, 2, -3.51,
      3.5, 2, -3.51, 3.5, 4.5, -3.51,
      3.5, 4.5, -3.51, 1, 4.5, -3.51,
      1, 4.5, -3.51, 1, 2, -3.51,
    ], structMat));
    /* Window openings — back face */
    gStruct.add(lineSegs([
      -3, 2, 3.51, -1, 2, 3.51,
      -1, 2, 3.51, -1, 4, 3.51,
      -1, 4, 3.51, -3, 4, 3.51,
      -3, 4, 3.51, -3, 2, 3.51,
      1.5, 2, 3.51, 3.5, 2, 3.51,
      3.5, 2, 3.51, 3.5, 4, 3.51,
      3.5, 4, 3.51, 1.5, 4, 3.51,
      1.5, 4, 3.51, 1.5, 2, 3.51,
    ], structMat));
    /* Side windows */
    gStruct.add(lineSegs([
      -4.51, 2.5, -1.5, -4.51, 2.5, 0.5,
      -4.51, 2.5, 0.5, -4.51, 4.5, 0.5,
      -4.51, 4.5, 0.5, -4.51, 4.5, -1.5,
      -4.51, 4.5, -1.5, -4.51, 2.5, -1.5,
    ], structMat));
    /* Door opening */
    gStruct.add(lineSegs([
      -0.7, 0, -3.51, 0.7, 0, -3.51,
      0.7, 0, -3.51, 0.7, 4.8, -3.51,
      0.7, 4.8, -3.51, -0.7, 4.8, -3.51,
      -0.7, 4.8, -3.51, -0.7, 0, -3.51,
    ], structMat));
    /* Roof overhang */
    gStruct.add(lineSegs([
      -5, 6.1, -4, 5, 6.1, -4,
      5, 6.1, -4, 5, 6.1, 4,
      5, 6.1, 4, -5, 6.1, 4,
      -5, 6.1, 4, -5, 6.1, -4,
    ], structMat));
    /* Partial roof framing — ridge + rafters */
    gStruct.add(lineSegs([
      -5, 7.5, 0, 5, 7.5, 0,
      -5, 6, -4, -5, 7.5, 0,
      -5, 7.5, 0, -5, 6, 4,
      5, 6, -4, 5, 7.5, 0,
      5, 7.5, 0, 5, 6, 4,
      -2, 6, -4, -2, 7.5, 0,
      -2, 7.5, 0, -2, 6, 4,
      2, 6, -4, 2, 7.5, 0,
      2, 7.5, 0, 2, 6, 4,
    ], structMat));
    sg.add(gStruct);

    /* GROUP 4 — Tower Crane (detailed lattice) */
    var gCrane = new THREE.Group();
    /* Mast — dual vertical rails (front face) */
    gCrane.add(lineSegs([
      -7.4, 0, -5.5, -7.4, 17, -5.5,
      -6.6, 0, -5.5, -6.6, 17, -5.5,
      -7.4, 0, -5.5, -6.6, 0, -5.5,
      -7.4, 17, -5.5, -6.6, 17, -5.5,
    ], craneMat));
    /* Mast depth rails (side face) */
    gCrane.add(lineSegs([
      -7.4, 0, -4.7, -7.4, 17, -4.7,
      -6.6, 0, -4.7, -6.6, 17, -4.7,
      -7.4, 0, -4.7, -6.6, 0, -4.7,
      -7.4, 17, -4.7, -6.6, 17, -4.7,
    ], craneMat));
    /* Mast connecting horizontals */
    gCrane.add(lineSegs([
      -7.4, 0, -5.5, -7.4, 0, -4.7,
      -6.6, 0, -5.5, -6.6, 0, -4.7,
      -7.4, 17, -5.5, -7.4, 17, -4.7,
      -6.6, 17, -5.5, -6.6, 17, -4.7,
    ], craneMat));
    /* Lattice X-bracing on mast (front face) */
    for (i = 0; i < 17; i += 3) {
      var yEnd = Math.min(i + 3, 17);
      gCrane.add(lineSegs([
        -7.4, i, -5.5, -6.6, yEnd, -5.5,
        -6.6, i, -5.5, -7.4, yEnd, -5.5,
      ], craneMat));
    }
    /* Lattice X-bracing on mast (side face) */
    for (i = 0; i < 17; i += 3) {
      var yEnd2 = Math.min(i + 3, 17);
      gCrane.add(lineSegs([
        -7.4, i, -5.5, -7.4, yEnd2, -4.7,
        -7.4, i, -4.7, -7.4, yEnd2, -5.5,
      ], craneMat));
    }
    /* Horizontal shelves every 3 units */
    for (i = 3; i <= 15; i += 3) {
      gCrane.add(lineSegs([
        -7.4, i, -5.5, -6.6, i, -5.5,
        -7.4, i, -4.7, -6.6, i, -4.7,
        -7.4, i, -5.5, -7.4, i, -4.7,
        -6.6, i, -5.5, -6.6, i, -4.7,
      ], craneMat));
    }
    /* Peak (top of mast) */
    gCrane.add(lineSegs([-7, 17, -5.1, -7, 18, -5.1], craneMat));
    /* Jib (horizontal arm — right) */
    gCrane.add(lineSegs([
      -7, 16.5, -5.1, 7, 16.5, -5.1,
      -7, 17, -5.1, 7, 17, -5.1,
      7, 16.5, -5.1, 7, 17, -5.1,
    ], craneMat));
    /* Jib lattice bracing */
    for (i = -7; i < 7; i += 2.8) {
      gCrane.add(lineSegs([
        i, 16.5, -5.1, i + 2.8, 17, -5.1,
        i + 2.8, 16.5, -5.1, i, 17, -5.1,
      ], craneMat));
    }
    /* Counter-jib (left) */
    gCrane.add(lineSegs([
      -7, 16.5, -5.1, -12, 16.5, -5.1,
      -7, 17, -5.1, -12, 17, -5.1,
      -12, 16.5, -5.1, -12, 17, -5.1,
    ], craneMat));
    /* Tie lines from peak to jib ends */
    gCrane.add(lineSegs([
      -7, 18, -5.1, 7, 17, -5.1,
      -7, 18, -5.1, -12, 17, -5.1,
    ], craneMat));
    /* Hanging cable from jib */
    gCrane.add(lineSegs([2.5, 16.5, -5.1, 2.5, 10, -5.1], craneMat));
    /* Hook (curved path) */
    gCrane.add(linePath([
      2.5, 10, -5.1, 2.5, 9.4, -5.1,
      2.2, 9.0, -5.1, 2.8, 9.0, -5.1,
    ], craneMat));
    /* Counter-weight block */
    var cwBlock = wireBox(1.5, 1, 0.8, craneMat);
    cwBlock.position.set(-11, 16, -5.1);
    gCrane.add(cwBlock);
    /* Crane base / pedestal */
    var craneBase = wireBox(2, 0.5, 2, craneMat);
    craneBase.position.set(-7, 0.25, -5.1);
    gCrane.add(craneBase);
    sg.add(gCrane);

    /* GROUP 5 — Scaffolding */
    var gScaff = new THREE.Group();
    /* Vertical poles — front face */
    gScaff.add(lineSegs([
      -5.5, 0, -4.2, -5.5, 7, -4.2,
      5.5, 0, -4.2, 5.5, 7, -4.2,
      0, 0, -4.2, 0, 7, -4.2,
    ], scaffMat));
    /* Vertical poles — back face */
    gScaff.add(lineSegs([
      -5.5, 0, 4.2, -5.5, 7, 4.2,
      5.5, 0, 4.2, 5.5, 7, 4.2,
    ], scaffMat));
    /* Vertical poles — sides (bottom) */
    gScaff.add(lineSegs([
      -5.5, 0, -4.2, -5.5, 0, 4.2,
      5.5, 0, -4.2, 5.5, 0, 4.2,
    ], scaffMat));
    /* Horizontal crossbars at multiple levels — front */
    var levels = [2.3, 4.6, 7];
    for (i = 0; i < levels.length; i++) {
      var y = levels[i];
      gScaff.add(lineSegs([
        -5.5, y, -4.2, 0, y, -4.2,
        0, y, -4.2, 5.5, y, -4.2,
      ], scaffMat));
    }
    /* Horizontal crossbars — back */
    for (i = 0; i < levels.length; i++) {
      gScaff.add(lineSegs([-5.5, levels[i], 4.2, 5.5, levels[i], 4.2], scaffMat));
    }
    /* Horizontal crossbars — left side */
    for (i = 0; i < levels.length; i++) {
      gScaff.add(lineSegs([-5.5, levels[i], -4.2, -5.5, levels[i], 4.2], scaffMat));
    }
    /* Horizontal crossbars — right side */
    for (i = 0; i < levels.length; i++) {
      gScaff.add(lineSegs([5.5, levels[i], -4.2, 5.5, levels[i], 4.2], scaffMat));
    }
    /* X-bracing on front scaffolding */
    gScaff.add(lineSegs([
      -5.5, 0, -4.2, 0, 2.3, -4.2,
      0, 0, -4.2, -5.5, 2.3, -4.2,
      0, 0, -4.2, 5.5, 2.3, -4.2,
      5.5, 0, -4.2, 0, 2.3, -4.2,
      -5.5, 2.3, -4.2, 0, 4.6, -4.2,
      0, 2.3, -4.2, -5.5, 4.6, -4.2,
      0, 2.3, -4.2, 5.5, 4.6, -4.2,
      5.5, 2.3, -4.2, 0, 4.6, -4.2,
    ], scaffMat));
    /* Plank walkways */
    gScaff.add(lineSegs([
      -5.3, 2.3, -4.2, -5.3, 2.3, -3.8,
      -5.3, 2.3, -3.8, 5.3, 2.3, -3.8,
      5.3, 2.3, -3.8, 5.3, 2.3, -4.2,
      -5.3, 4.6, -4.2, -5.3, 4.6, -3.8,
      -5.3, 4.6, -3.8, 5.3, 4.6, -3.8,
      5.3, 4.6, -3.8, 5.3, 4.6, -4.2,
    ], scaffMat));
    sg.add(gScaff);

    /* PARTICLES — 60 rising gold motes */
    var PC = 60;
    var pArr = new Float32Array(PC * 3);
    var pVel = [];
    for (i = 0; i < PC; i++) {
      pArr[i * 3]     = (Math.random() - 0.5) * 24;
      pArr[i * 3 + 1] = Math.random() * 16;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 20;
      pVel.push(0.003 + Math.random() * 0.007);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.1, transparent: true, opacity: 0, sizeAttenuation: true,
    });
    sg.add(new THREE.Points(pGeo, pMat));

    /* SCROLL PROGRESS + MOUSE PARALLAX */
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var scrollP = 0;
    ScrollTrigger.create({
      trigger: '#aduc-hero', start: 'top top', end: 'bottom top',
      onUpdate: function (s) { scrollP = s.progress; },
    });

    /* Visibility gate */
    var visible = true;
    new IntersectionObserver(
      function (e) { visible = e[0].isIntersecting; },
      { threshold: 0.01 }
    ).observe(wrap);

    /* RENDER LOOP — timed reveal + scroll orbit */
    var clock = new THREE.Clock();
    var baseRotY = -0.3;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;

      var t = clock.getElapsedTime();

      /* Progressive timed reveal (cubic ease-out) */
      /* Grid: 0s -> 0.8s */
      gridMat.opacity = clamp(t / 0.8) * 0.15;

      /* Foundation: 0.4s -> 1.2s */
      var fv = ease(clamp((t - 0.4) / 0.8));
      foundMat.opacity = fv * 0.55;
      gFound.position.y = -1.5 * (1 - fv);

      /* Structure: 1.0s -> 2.0s */
      var sv = ease(clamp((t - 1.0) / 1.0));
      structMat.opacity = sv * 0.4;
      gStruct.position.y = -5 * (1 - sv);

      /* Crane: 1.6s -> 2.8s */
      var cv = ease(clamp((t - 1.6) / 1.2));
      craneMat.opacity = cv * 0.5;
      gCrane.position.y = -12 * (1 - cv);

      /* Scaffolding: 2.2s -> 3.2s */
      var scv = ease(clamp((t - 2.2) / 1.0));
      scaffMat.opacity = scv * 0.3;
      gScaff.position.y = -3 * (1 - scv);

      /* Particles: 2.8s -> 3.8s */
      pMat.opacity = clamp((t - 2.8) / 1.0) * 0.4;

      /* Camera orbit: slow auto-rotate + scroll + mouse parallax */
      var targetY = baseRotY + t * 0.03 + scrollP * 0.5;
      sg.rotation.y += (targetY + mx * 0.12 - sg.rotation.y) * 0.015;
      sg.rotation.x += (my * 0.04 - sg.rotation.x) * 0.015;

      /* Subtle breathing */
      var breathe = 1 + Math.sin(t * 0.4) * 0.008;
      sg.scale.setScalar(breathe);

      /* Camera follows scroll */
      camera.position.y = 14 - scrollP * 6;
      camera.lookAt(0, 3, 0);

      /* Animate particles upward */
      var pa = pGeo.attributes.position.array;
      for (var j = 0; j < PC; j++) {
        pa[j * 3 + 1] += pVel[j];
        if (pa[j * 3 + 1] > 18) {
          pa[j * 3 + 1] = -1;
          pa[j * 3]     = (Math.random() - 0.5) * 24;
          pa[j * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      /* Lights */
      pl1.position.x = 18 + Math.sin(t * 0.25) * 3;
      pl1.position.z = 22 + Math.cos(t * 0.18) * 3;

      renderer.render(scene, camera);
    }

    animate();

    /* Debounced Resize */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        /* Canvas stays visible on all viewports */
        var w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    });
  }

  /* ═══════════════════════════════════════════════
     TYPES SHOWCASE — Three.js Morphing Buildings + Scroll-Lock
     ═══════════════════════════════════════════════ */
  function initTypesShowcase() {
    var cards = document.querySelectorAll('.aduc-type-card');
    var dots = document.querySelectorAll('.aduc-tdot');
    var fill = document.querySelector('.aduc-types-fill');
    var typesEl = document.getElementById('aduc-types');
    if (!typesEl || !cards.length) return;

    var lastStep = 0;

    function setTypeStep(step) {
      if (step === lastStep) return;
      cards.forEach(function (card, i) {
        gsap.to(card, {
          opacity: i === step ? 1 : 0,
          y: i === step ? '-50%' : (i < step ? '-80%' : '-20%'),
          duration: 0.5, ease: 'power2.out', overwrite: true,
        });
      });
      dots.forEach(function (d, i) { d.classList.toggle('active', i <= step); });
      if (fill) fill.style.width = (step / 3 * 100) + '%';
      typesEl.dispatchEvent(new CustomEvent('type-change', { detail: { step: step } }));
      lastStep = step;
    }

    ScrollTrigger.create({
      trigger: '#aduc-types',
      start: 'top top',
      end: '+=' + (window.innerHeight * 4),
      pin: true,
      scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress;
        var step = Math.min(Math.floor(p * 4), 3);
        setTypeStep(step);
      },
    });

    /* ── Three.js morphing buildings ── */
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('types-canvas');
    if (!wrap) return;

    /* Setup */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 1000);
    camera.position.set(20, 16, 28);
    camera.lookAt(0, 2, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var tpl1 = new THREE.PointLight(0xc9a96e, 0.8, 80);
    tpl1.position.set(18, 22, 22);
    scene.add(tpl1);

    /* Materials */
    var GOLD = 0xc9a96e, DARK = 0x222222, LIGHT_GRAY = 0xbbbbbb;
    var tGridMat = new THREE.LineBasicMaterial({ color: LIGHT_GRAY, transparent: true, opacity: 0.15 });
    var buildMat = new THREE.LineBasicMaterial({ color: DARK, transparent: true, opacity: 0.35 });
    var accentMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.4 });

    var sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    function tLineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }

    /* Ground Grid */
    var tgp = [], ti;
    for (ti = -10; ti <= 10; ti += 2) { tgp.push(ti, 0, -8, ti, 0, 8); }
    for (ti = -8; ti <= 8; ti += 2) { tgp.push(-10, 0, ti, 10, 0, ti); }
    sceneGroup.add(tLineSegs(tgp, tGridMat));

    /* MORPH INFRASTRUCTURE — 120 segments, 720 floats */
    var SEG = 120, FC = SEG * 6;

    function pad(a) {
      var r = new Float32Array(FC);
      for (var j = 0; j < a.length && j < FC; j++) r[j] = a[j];
      return r;
    }

    function bx(cx, cy, cz, w, h, d) {
      var hw = w/2, hh = h/2, hd = d/2;
      var x0 = cx-hw, x1 = cx+hw, y0 = cy-hh, y1 = cy+hh, z0 = cz-hd, z1 = cz+hd;
      return [
        x0,y0,z0, x1,y0,z0,  x1,y0,z0, x1,y0,z1,  x1,y0,z1, x0,y0,z1,  x0,y0,z1, x0,y0,z0,
        x0,y1,z0, x1,y1,z0,  x1,y1,z0, x1,y1,z1,  x1,y1,z1, x0,y1,z1,  x0,y1,z1, x0,y1,z0,
        x0,y0,z0, x0,y1,z0,  x1,y0,z0, x1,y1,z0,  x1,y0,z1, x1,y1,z1,  x0,y0,z1, x0,y1,z1
      ];
    }

    function flat(a) {
      var r = [];
      for (var j = 0; j < a.length; j++) {
        if (Array.isArray(a[j])) {
          for (var k = 0; k < a[j].length; k++) r.push(a[j][k]);
        } else {
          r.push(a[j]);
        }
      }
      return r;
    }

    /* T0: Detached ADU — simple gable house */
    var t0 = flat([].concat(
      bx(0, 3.5, 0, 8, 7, 6),
      /* Gable roof: ridge beam front-to-back */
      [0, 8, -3, 0, 8, 3],
      /* Rafters: 4 corners up to ridge */
      [-4, 7, -3, 0, 8, -3], [4, 7, -3, 0, 8, -3],
      [-4, 7, 3, 0, 8, 3], [4, 7, 3, 0, 8, 3],
      /* Gable triangles: close the ends */
      [-4, 7, -3, 0, 8, -3], [0, 8, -3, 4, 7, -3],
      [-4, 7, 3, 0, 8, 3], [0, 8, 3, 4, 7, 3]
    ));

    /* T1: Attached ADU — main house + wing */
    var t1 = flat([].concat(
      bx(-2, 4, 0, 10, 8, 7),
      bx(6, 3, 0, 5, 6, 6),
      /* Main house gable roof */
      [-2, 8.5, -3.5, -2, 8.5, 3.5],
      [-7, 8, -3.5, -2, 8.5, -3.5], [3, 8, -3.5, -2, 8.5, -3.5],
      [-7, 8, 3.5, -2, 8.5, 3.5], [3, 8, 3.5, -2, 8.5, 3.5],
      /* Wing flat roof edge */
      [3.5, 6, -3, 8.5, 6, -3], [8.5, 6, -3, 8.5, 6, 3],
      [8.5, 6, 3, 3.5, 6, 3], [3.5, 6, 3, 3.5, 6, -3]
    ));

    /* T2: Garage Conversion — wide low box */
    var t2 = flat([].concat(
      bx(0, 2.5, 0, 10, 5, 7),
      /* Flat roof edge (slight overhang) */
      [-5.3, 5.1, -3.8, 5.3, 5.1, -3.8],
      [5.3, 5.1, -3.8, 5.3, 5.1, 3.8],
      [5.3, 5.1, 3.8, -5.3, 5.1, 3.8],
      [-5.3, 5.1, 3.8, -5.3, 5.1, -3.8],
      /* Garage door opening on front wall */
      [-2.5, 0, -3.51, -2.5, 4, -3.51],
      [2.5, 0, -3.51, 2.5, 4, -3.51],
      [-2.5, 4, -3.51, 2.5, 4, -3.51]
    ));

    /* T3: Above-Garage ADU — two-story box */
    var t3 = flat([].concat(
      bx(0, 2.5, 0, 10, 5, 7),
      bx(0, 7.5, 0, 10, 5, 7),
      /* Floor division line at y=5 */
      [-5, 5, -3.5, 5, 5, -3.5], [-5, 5, 3.5, 5, 5, 3.5],
      /* Gable roof */
      [0, 10.8, -3.5, 0, 10.8, 3.5],
      [-5, 10, -3.5, 0, 10.8, -3.5], [5, 10, -3.5, 0, 10.8, -3.5],
      [-5, 10, 3.5, 0, 10.8, 3.5], [5, 10, 3.5, 0, 10.8, 3.5]
    ));

    var morphTargets = [pad(t0), pad(t1), pad(t2), pad(t3)];

    /* Building geometry (morphable) */
    var buildPos = new Float32Array(FC), accentPos = new Float32Array(FC);
    for (ti = 0; ti < FC; ti++) { buildPos[ti] = morphTargets[0][ti]; accentPos[ti] = morphTargets[0][ti]; }

    var buildGeo = new THREE.BufferGeometry();
    buildGeo.setAttribute('position', new THREE.Float32BufferAttribute(buildPos, 3));
    sceneGroup.add(new THREE.LineSegments(buildGeo, buildMat));

    var accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.Float32BufferAttribute(accentPos, 3));
    sceneGroup.add(new THREE.LineSegments(accentGeo, accentMat));

    /* PARTICLES — 25 rising gold motes */
    var tPC = 25, tpArr = new Float32Array(tPC * 3), tpVel = [];
    for (ti = 0; ti < tPC; ti++) {
      tpArr[ti * 3]     = (Math.random() - 0.5) * 24;
      tpArr[ti * 3 + 1] = Math.random() * 14;
      tpArr[ti * 3 + 2] = (Math.random() - 0.5) * 20;
      tpVel.push(0.002 + Math.random() * 0.006);
    }
    var tpGeo = new THREE.BufferGeometry();
    tpGeo.setAttribute('position', new THREE.Float32BufferAttribute(tpArr, 3));
    var tpMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.06, transparent: true, opacity: 0.15, sizeAttenuation: true,
    });
    sceneGroup.add(new THREE.Points(tpGeo, tpMat));

    /* MORPH STATE + SCROLL BINDING */
    var currentTarget = 0;
    typesEl.addEventListener('type-change', function (e) { currentTarget = e.detail.step; });

    /* Mouse Parallax */
    var mouse = { x: 0, y: 0 };
    var targetRot = { x: 0, y: 0 };
    document.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* Visibility */
    var isVisible = false;
    new IntersectionObserver(function (e) { isVisible = e[0].isIntersecting; }, { threshold: 0.01 }).observe(typesEl);

    /* Render Loop */
    var tClock = new THREE.Clock();
    var baseRot = -0.3;

    function animateTypes() {
      requestAnimationFrame(animateTypes);
      if (!isVisible) return;
      var t = tClock.getElapsedTime();

      /* Slow orbit + mouse parallax */
      targetRot.y = baseRot + mouse.x * 0.12 + t * 0.025;
      targetRot.x = mouse.y * 0.05;
      sceneGroup.rotation.y += (targetRot.y - sceneGroup.rotation.y) * 0.015;
      sceneGroup.rotation.x += (targetRot.x - sceneGroup.rotation.x) * 0.015;

      var breathe = 1 + Math.sin(t * 0.35) * 0.006;
      sceneGroup.scale.setScalar(breathe);

      /* Morph */
      var target = morphTargets[currentTarget];
      var bArr = buildGeo.attributes.position.array;
      var aArr = accentGeo.attributes.position.array;
      var morphing = false;
      for (var j = 0; j < FC; j++) {
        var diff = target[j] - bArr[j];
        if (Math.abs(diff) > 0.01) { morphing = true; bArr[j] += diff * 0.04; aArr[j] += diff * 0.04; }
      }
      if (morphing) { buildGeo.attributes.position.needsUpdate = true; accentGeo.attributes.position.needsUpdate = true; }
      accentMat.opacity = morphing ? 0.2 : 0.5;
      buildMat.opacity = morphing ? 0.25 : 0.4;

      /* Particles */
      var pa = tpGeo.attributes.position.array;
      for (var k = 0; k < tPC; k++) {
        pa[k * 3 + 1] += tpVel[k];
        if (pa[k * 3 + 1] > 18) {
          pa[k * 3 + 1] = -1;
          pa[k * 3]     = (Math.random() - 0.5) * 24;
          pa[k * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      tpGeo.attributes.position.needsUpdate = true;

      /* Lights */
      tpl1.position.x = 18 + Math.sin(t * 0.25) * 3;
      tpl1.position.z = 22 + Math.cos(t * 0.18) * 3;

      renderer.render(scene, camera);
    }
    animateTypes();

    /* Debounced Resize */
    var tResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(tResizeTimer);
      tResizeTimer = setTimeout(function () {
        /* Canvas stays visible on all viewports */
        var w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    });
  }

  /* ═══════════════════════════════════════════════
     ROI / COST — Scramble-Decode Stat Cards
     ═══════════════════════════════════════════════ */
  function initROI() {
    var roiCards = document.querySelectorAll('.aduc-roi-card');
    if (!roiCards.length) return;

    ScrollTrigger.create({
      trigger: '.aduc-roi-grid', start: 'top 75%', once: true,
      onEnter: function () {
        roiCards.forEach(function (card, i) {
          gsap.to(card, {
            opacity: 1, y: 0, duration: 0.8,
            delay: i * 0.15, ease: 'power3.out',
          });

          /* Scramble effect on values */
          var valEl = card.querySelector('.aduc-roi-value');
          var finalText = valEl.getAttribute('data-count');
          var chars = '0123456789$%K+.--yrs ';
          var scrambleLen = finalText.length;
          var step = { t: 0 };

          gsap.to(step, {
            t: 1, duration: 1.2, delay: 0.3 + i * 0.15,
            ease: 'power2.inOut',
            onUpdate: function () {
              var progress = step.t;
              var revealed = Math.floor(progress * scrambleLen);
              var result = '';
              for (var c = 0; c < scrambleLen; c++) {
                if (c < revealed) {
                  result += finalText[c];
                } else {
                  result += chars[Math.floor(Math.random() * chars.length)];
                }
              }
              valEl.textContent = result;
            },
            onComplete: function () {
              valEl.textContent = finalText;
            },
          });
        });
      },
    });
  }

  /* ═══════════════════════════════════════════════
     HORIZONTAL TIMELINE — Progress Bar + Node Activation + Split-Text
     ═══════════════════════════════════════════════ */
  function initHorizontalTimeline() {
    var htlFill = document.getElementById('aduc-htl-fill');
    var htlSteps = document.querySelectorAll('.aduc-htl-step');
    if (!htlSteps.length) return;

    var htlActivated = [false, false, false];

    ScrollTrigger.create({
      trigger: '#aduc-htl-wrap', start: 'top 70%', end: 'bottom 50%', scrub: 0.5,
      onUpdate: function (self) {
        var p = self.progress;
        if (htlFill) htlFill.style.width = (p * 100) + '%';

        htlSteps.forEach(function (step, i) {
          var threshold = i / htlSteps.length;
          var node = step.querySelector('.aduc-htl-node');

          if (p >= threshold + 0.05 && !htlActivated[i]) {
            htlActivated[i] = true;
            node.classList.add('active');

            gsap.to(step.querySelectorAll('.aduc-htl-title .word'), {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out',
            });
            gsap.to(step.querySelector('.aduc-htl-time'), {
              opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out',
            });
            gsap.to(step.querySelector('.aduc-htl-desc'), {
              opacity: 0.6, filter: 'blur(0px)', y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out',
            });
          }
        });
      },
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS — data-animate Handlers
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* char-cascade */
    document.querySelectorAll('[data-animate="char-cascade"]').forEach(function (el) {
      var chars = splitIntoChars(el);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.025, ease: 'elastic.out(1, 0.6)',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    /* fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { y: 50, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    });

    /* word-stagger-elastic */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function (el) {
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    });

    /* parallax-depth */
    document.querySelectorAll('[data-animate="parallax-depth"]').forEach(function (el) {
      gsap.to(el, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    /* line-wipe */
    document.querySelectorAll('[data-animate="line-wipe"]').forEach(function (el) {
      var lineEls = el.querySelectorAll('.line');
      if (!lineEls.length) {
        var html = el.innerHTML;
        var texts;
        if (/<br\s*\/?>/i.test(html)) {
          texts = html.split(/<br\s*\/?>/i).map(function (s) {
            return s.replace(/<[^>]*>/g, '').trim();
          }).filter(Boolean);
        } else {
          texts = [el.textContent.trim()];
        }
        el.innerHTML = '';
        texts.forEach(function (t) {
          var d = document.createElement('div');
          d.className = 'line';
          d.textContent = t;
          el.appendChild(d);
        });
        lineEls = el.querySelectorAll('.line');
      }
      lineEls.forEach(function (line, i) {
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
    document.querySelectorAll('.av-label-line').forEach(function (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line.parentElement, start: 'top 85%' } }
      );
    });

    /* Magnetic buttons (desktop) */
    if (window.innerWidth >= 992) {
      document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.15;
          var y = (e.clientY - r.top - r.height / 2) * 0.15;
          gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', function () {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  /* ═══════════════════════════════════════════════
     CTA — Word-Stagger-Elastic Heading + Magnetic Buttons + Ambient Glow
     ═══════════════════════════════════════════════ */
  function initCTA() {
    var ctaSection = document.querySelector('.aduc-cta-container');
    if (!ctaSection) return;

    /* Ambient glow */
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
      onEnter: function () {
        gsap.to(glow, {
          opacity: 1, duration: 1.5, ease: 'power2.out',
          onComplete: function () {
            gsap.to(glow, { opacity: 0.4, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          },
        });
      },
      onLeaveBack: function () {
        gsap.to(glow, { opacity: 0, duration: 0.5, overwrite: true });
      },
    });
  }

  /* ═══════════════════════════════════════════════
     INIT — Single DOMContentLoaded
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initHero();
    initTypesShowcase();
    initROI();
    initHorizontalTimeline();
    initScrollAnimations();
    initCTA();
  });
})();
