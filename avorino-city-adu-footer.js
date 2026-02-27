(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
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
     HERO — Char Cascade + Gold Line
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('city-hero');
    if (!hero) return;

    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('.city-hero-gold-line');
    var subtitle = hero.querySelector('.city-hero-subtitle');
    var label = hero.querySelector('.city-hero-label');

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

    var heroContent = hero.querySelector('.city-hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }

    var hint = hero.querySelector('.city-hero-scroll-hint');
    if (hint) {
      hint.removeAttribute('data-animate');
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 0.3, duration: 1, delay: 2, ease: 'power2.out' });
      gsap.to(hint, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '30% top', scrub: 1 },
      });
    }

    initHero3D();
  }

  /* ═══════════════════════════════════════════════
     HERO 3D — Neighborhood Zoning Grid
     ═══════════════════════════════════════════════ */
  function initHero3D() {
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('hero-canvas');
    if (!wrap) return;

    /* ── Renderer ── */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    wrap.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 200);
    camera.position.set(22, 18, 28);
    camera.lookAt(0, 1, 0);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.4));
    var pl1 = new THREE.PointLight(0xc9a96e, 1.0, 80);
    pl1.position.set(15, 20, 20);
    scene.add(pl1);
    var pl2 = new THREE.PointLight(0xc8222a, 0.3, 60);
    pl2.position.set(-15, 5, 10);
    scene.add(pl2);

    /* ── Colors ── */
    var GOLD = 0xc9a96e, CREAM = 0xf0ede8, SLATE = 0x555555;

    /* ── Materials — one ref per reveal group for opacity control ── */
    function makeMat(c) { return new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }); }
    var gridMat      = makeMat(CREAM);
    var lotMat       = makeMat(GOLD);
    var houseMat     = makeMat(SLATE);
    var highlightMat = makeMat(GOLD);
    var aduMat       = makeMat(GOLD);

    var setbackMat = new THREE.LineDashedMaterial({
      color: 0xc8222a, transparent: true, opacity: 0,
      dashSize: 0.4, gapSize: 0.25,
    });

    /* ── Geometry helpers ── */
    function wireBox(w, h, d, mat) {
      return new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat
      );
    }
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }
    function createWindowFrame(cx, cy, cz, w, h, normal, mat) {
      var hw = w / 2, hh = h / 2, pts = [];
      if (normal === 'x') {
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
      return new THREE.LineSegments(g, mat);
    }
    function createRoofOverhang(x, z, w, d, roofH, mat) {
      var hw = w / 2, hd = d / 2, ov = 0.35;
      return lineSegs([
        x-hw-ov, roofH, z-hd-ov, x+hw+ov, roofH, z-hd-ov,
        x+hw+ov, roofH, z-hd-ov, x+hw+ov, roofH, z+hd+ov,
        x+hw+ov, roofH, z+hd+ov, x-hw-ov, roofH, z+hd+ov,
        x-hw-ov, roofH, z+hd+ov, x-hw-ov, roofH, z-hd-ov,
      ], mat);
    }
    function createHouse(x, z, w, h, d, mat) {
      var g = new THREE.Group();
      var hw = w / 2, hd = d / 2, ov = 0.35, roofH = h + 0.08;
      var box = wireBox(w, h, d, mat);
      box.position.set(x, h / 2, z);
      g.add(box);
      g.add(createRoofOverhang(x, z, w, d, roofH, mat));
      g.add(lineSegs([
        x-hw-ov, roofH, z-hd-ov,  x-hw, h, z-hd,
        x+hw+ov, roofH, z-hd-ov,  x+hw, h, z-hd,
        x-hw-ov, roofH, z+hd+ov,  x-hw, h, z+hd,
        x+hw+ov, roofH, z+hd+ov,  x+hw, h, z+hd,
      ], mat));
      return g;
    }

    /* ── Scene group — everything rotates together ── */
    var sg = new THREE.Group();
    scene.add(sg);

    /* ═══ GROUP 1 — City Block Ground Grid ═══ */
    var gGrid = new THREE.Group();
    var gp = [];
    var gridSize = 30, gridDiv = 15, gridStep = gridSize / gridDiv;
    for (var gi = 0; gi <= gridDiv; gi++) {
      var pos = -gridSize / 2 + gi * gridStep;
      gp.push(-gridSize / 2, 0, pos, gridSize / 2, 0, pos);
      gp.push(pos, 0, -gridSize / 2, pos, 0, gridSize / 2);
    }
    gGrid.add(lineSegs(gp, gridMat));
    sg.add(gGrid);

    /* ═══ GROUP 2 — Lot Lines / Property Boundaries + Setbacks ═══ */
    var gLots = new THREE.Group();
    var lp = [];
    lp.push(-12, 0.04, -12, 12, 0.04, -12);
    lp.push(-12, 0.04, -4, 12, 0.04, -4);
    lp.push(-12, 0.04, 4, 12, 0.04, 4);
    lp.push(-12, 0.04, 12, 12, 0.04, 12);
    lp.push(-12, 0.04, -12, -12, 0.04, 12);
    lp.push(-4, 0.04, -12, -4, 0.04, 12);
    lp.push(4, 0.04, -12, 4, 0.04, 12);
    lp.push(12, 0.04, -12, 12, 0.04, 12);
    gLots.add(lineSegs(lp, lotMat));

    /* Setback dashed boundary around center lot */
    var sbPts = [
      -3.5, 0.08, -3.5, 3.5, 0.08, -3.5,
      3.5, 0.08, -3.5, 3.5, 0.08, 3.5,
      3.5, 0.08, 3.5, -3.5, 0.08, 3.5,
      -3.5, 0.08, 3.5, -3.5, 0.08, -3.5,
    ];
    var sbGeo = new THREE.BufferGeometry();
    sbGeo.setAttribute('position', new THREE.Float32BufferAttribute(sbPts, 3));
    var sbLine = new THREE.LineSegments(sbGeo, setbackMat);
    sbLine.computeLineDistances();
    gLots.add(sbLine);

    /* Street labels (cross-hatch marks on lot boundary) */
    for (var si = -12; si <= 12; si += 8) {
      gLots.add(lineSegs([
        si, 0.04, -12.4, si, 0.04, -11.6,
        si, 0.04, 12.4, si, 0.04, 11.6,
      ], lotMat));
      gLots.add(lineSegs([
        -12.4, 0.04, si, -11.6, 0.04, si,
        12.4, 0.04, si, 11.6, 0.04, si,
      ], lotMat));
    }
    sg.add(gLots);

    /* ═══ GROUP 3 — Neighborhood Houses (8 surrounding lots) ═══ */
    var gHouses = new THREE.Group();
    gHouses.add(createHouse(-8, -8, 5, 4.5, 4, houseMat));
    gHouses.add(createHouse(0, -8, 4.5, 3.8, 3.5, houseMat));
    gHouses.add(createHouse(8, -8, 5.5, 5, 4.5, houseMat));
    gHouses.add(createHouse(-8, 0, 4.5, 4, 5, houseMat));
    gHouses.add(createHouse(8, 0, 5, 4.5, 4, houseMat));
    gHouses.add(createHouse(-8, 8, 4, 3.5, 3.5, houseMat));
    gHouses.add(createHouse(0, 8, 5, 4, 4.5, houseMat));
    gHouses.add(createHouse(8, 8, 4.5, 5.5, 4, houseMat));

    /* Detail windows on neighbor houses */
    gHouses.add(createWindowFrame(-9, 2.5, -6.01, 1.0, 1.4, 'z', houseMat));
    gHouses.add(createWindowFrame(-7, 2.5, -6.01, 1.0, 1.4, 'z', houseMat));
    gHouses.add(createWindowFrame(7.5, 2.5, -2.01, 1.0, 1.4, 'z', houseMat));
    gHouses.add(createWindowFrame(9, 2.5, -2.01, 1.0, 1.4, 'z', houseMat));
    gHouses.add(createWindowFrame(0, 2, -9.76, 1.0, 1.2, 'z', houseMat));
    gHouses.add(createWindowFrame(-1.5, 2, -9.76, 1.0, 1.2, 'z', houseMat));
    gHouses.add(createWindowFrame(-8, 2, 6.01, 1.0, 1.2, 'z', houseMat));
    gHouses.add(createWindowFrame(8, 3, 6.01, 1.2, 1.6, 'z', houseMat));
    sg.add(gHouses);

    /* ═══ GROUP 4 — Highlighted Property (center lot, gold) ═══ */
    var gHighlight = new THREE.Group();

    var mainW = 6, mainH = 5.5, mainD = 5;
    var mainHouse = wireBox(mainW, mainH, mainD, highlightMat);
    mainHouse.position.set(0, mainH / 2, -0.5);
    gHighlight.add(mainHouse);

    var garW = 3, garH = 3, garD = 3.5;
    var garage = wireBox(garW, garH, garD, highlightMat);
    garage.position.set(3.8, garH / 2, -0.25);
    gHighlight.add(garage);

    gHighlight.add(createRoofOverhang(0, -0.5, mainW, mainD, mainH + 0.1, highlightMat));
    gHighlight.add(createRoofOverhang(3.8, -0.25, garW, garD, garH + 0.06, highlightMat));

    /* Second story floor line */
    gHighlight.add(lineSegs([
      -mainW/2, mainH*0.55, -0.5-mainD/2, mainW/2, mainH*0.55, -0.5-mainD/2,
      mainW/2, mainH*0.55, -0.5-mainD/2, mainW/2, mainH*0.55, -0.5+mainD/2,
      mainW/2, mainH*0.55, -0.5+mainD/2, -mainW/2, mainH*0.55, -0.5+mainD/2,
      -mainW/2, mainH*0.55, -0.5+mainD/2, -mainW/2, mainH*0.55, -0.5-mainD/2,
    ], highlightMat));

    /* Interior wall division */
    gHighlight.add(lineSegs([
      -1, 0, -3, -1, mainH, -3,
      -1, 0, 2, -1, mainH, 2,
      2, 0, -3, 2, mainH, -3,
    ], highlightMat));

    /* Front windows — upper floor */
    gHighlight.add(createWindowFrame(-1.8, 4.2, -3.01, 1.4, 1.8, 'z', highlightMat));
    gHighlight.add(createWindowFrame(1.2, 4.2, -3.01, 1.4, 1.8, 'z', highlightMat));
    /* Front windows — ground floor */
    gHighlight.add(createWindowFrame(-1.8, 1.8, -3.01, 1.2, 1.4, 'z', highlightMat));
    gHighlight.add(createWindowFrame(1.5, 1.8, -3.01, 1.2, 1.4, 'z', highlightMat));
    /* Side windows */
    gHighlight.add(createWindowFrame(-3.01, 4.2, -0.5, 1.2, 1.6, 'x', highlightMat));
    gHighlight.add(createWindowFrame(-3.01, 1.8, 0.5, 1.2, 1.4, 'x', highlightMat));
    /* Garage front window */
    gHighlight.add(createWindowFrame(3.8, 1.6, -2.01, 1.8, 1.8, 'z', highlightMat));
    /* Front door */
    gHighlight.add(createWindowFrame(0, 1.3, -3.02, 1.2, 2.6, 'z', highlightMat));

    /* Ridge beam — main house */
    gHighlight.add(lineSegs([
      0, mainH + 0.45, -0.5 - mainD/2,  0, mainH + 0.45, -0.5 + mainD/2,
    ], highlightMat));
    /* Rafters — main house */
    gHighlight.add(lineSegs([
      -mainW/2 - 0.35, mainH + 0.1, -0.5 - mainD/2 - 0.35,  0, mainH + 0.45, -0.5 - mainD/2,
       mainW/2 + 0.35, mainH + 0.1, -0.5 - mainD/2 - 0.35,  0, mainH + 0.45, -0.5 - mainD/2,
      -mainW/2 - 0.35, mainH + 0.1, -0.5 + mainD/2 + 0.35,  0, mainH + 0.45, -0.5 + mainD/2,
       mainW/2 + 0.35, mainH + 0.1, -0.5 + mainD/2 + 0.35,  0, mainH + 0.45, -0.5 + mainD/2,
    ], highlightMat));
    /* Eave returns — main house */
    gHighlight.add(lineSegs([
      -mainW/2 - 0.35, mainH + 0.1, -0.5 - mainD/2 - 0.35,  -mainW/2, mainH, -0.5 - mainD/2,
       mainW/2 + 0.35, mainH + 0.1, -0.5 - mainD/2 - 0.35,   mainW/2, mainH, -0.5 - mainD/2,
      -mainW/2 - 0.35, mainH + 0.1, -0.5 + mainD/2 + 0.35,  -mainW/2, mainH, -0.5 + mainD/2,
       mainW/2 + 0.35, mainH + 0.1, -0.5 + mainD/2 + 0.35,   mainW/2, mainH, -0.5 + mainD/2,
    ], highlightMat));
    /* Ridge beam — garage */
    gHighlight.add(lineSegs([
      3.8, garH + 0.3, -0.25 - garD/2,  3.8, garH + 0.3, -0.25 + garD/2,
    ], highlightMat));
    /* Rafters — garage */
    gHighlight.add(lineSegs([
      3.8 - garW/2 - 0.35, garH + 0.06, -0.25 - garD/2 - 0.35,  3.8, garH + 0.3, -0.25 - garD/2,
      3.8 + garW/2 + 0.35, garH + 0.06, -0.25 - garD/2 - 0.35,  3.8, garH + 0.3, -0.25 - garD/2,
      3.8 - garW/2 - 0.35, garH + 0.06, -0.25 + garD/2 + 0.35,  3.8, garH + 0.3, -0.25 + garD/2,
      3.8 + garW/2 + 0.35, garH + 0.06, -0.25 + garD/2 + 0.35,  3.8, garH + 0.3, -0.25 + garD/2,
    ], highlightMat));
    sg.add(gHighlight);

    /* ═══ GROUP 5 — ADU Wireframe in backyard + pathway ═══ */
    var gADU = new THREE.Group();

    var aduW = 3.5, aduH = 3.2, aduD = 3;
    var aduBox = wireBox(aduW, aduH, aduD, aduMat);
    aduBox.position.set(0, aduH / 2, 2.8);
    gADU.add(aduBox);

    gADU.add(createRoofOverhang(0, 2.8, aduW, aduD, aduH + 0.06, aduMat));

    /* ADU interior wall */
    gADU.add(lineSegs([
      0.5, 0, 1.3, 0.5, aduH, 1.3,
      0.5, 0, 4.3, 0.5, aduH, 4.3,
    ], aduMat));

    /* ADU front windows */
    gADU.add(createWindowFrame(-0.7, 1.6, 1.31, 0.9, 1.2, 'z', aduMat));
    gADU.add(createWindowFrame(0.9, 1.6, 1.31, 0.9, 1.2, 'z', aduMat));
    /* ADU front door */
    gADU.add(createWindowFrame(0.1, 1.2, 1.3, 0.8, 2.2, 'z', aduMat));
    /* ADU side windows */
    gADU.add(createWindowFrame(-1.76, 1.6, 2.8, 0.8, 1.0, 'x', aduMat));
    gADU.add(createWindowFrame(1.76, 1.6, 2.8, 0.8, 1.0, 'x', aduMat));
    /* ADU back window */
    gADU.add(createWindowFrame(0, 1.6, 4.31, 1.2, 1.0, 'z', aduMat));

    /* ADU ridge beam */
    gADU.add(lineSegs([
      0, aduH + 0.35, 1.3,  0, aduH + 0.35, 4.3,
    ], aduMat));
    /* ADU rafters */
    gADU.add(lineSegs([
      -aduW/2 - 0.35, aduH + 0.06, 2.8 - aduD/2 - 0.35,  0, aduH + 0.35, 1.3,
       aduW/2 + 0.35, aduH + 0.06, 2.8 - aduD/2 - 0.35,  0, aduH + 0.35, 1.3,
      -aduW/2 - 0.35, aduH + 0.06, 2.8 + aduD/2 + 0.35,  0, aduH + 0.35, 4.3,
       aduW/2 + 0.35, aduH + 0.06, 2.8 + aduD/2 + 0.35,  0, aduH + 0.35, 4.3,
    ], aduMat));
    /* ADU eave returns */
    gADU.add(lineSegs([
      -aduW/2 - 0.35, aduH + 0.06, 2.8 - aduD/2 - 0.35,  -aduW/2, aduH, 2.8 - aduD/2,
       aduW/2 + 0.35, aduH + 0.06, 2.8 - aduD/2 - 0.35,   aduW/2, aduH, 2.8 - aduD/2,
      -aduW/2 - 0.35, aduH + 0.06, 2.8 + aduD/2 + 0.35,  -aduW/2, aduH, 2.8 + aduD/2,
       aduW/2 + 0.35, aduH + 0.06, 2.8 + aduD/2 + 0.35,   aduW/2, aduH, 2.8 + aduD/2,
    ], aduMat));

    /* Pathway from main house to ADU */
    gADU.add(lineSegs([
      -0.3, 0.02, 2, -0.3, 0.02, 1.3,
      0.3, 0.02, 2, 0.3, 0.02, 1.3,
      -0.3, 0.02, 1.3, 0.3, 0.02, 1.3,
    ], aduMat));

    /* Small fence line along rear setback */
    gADU.add(lineSegs([
      -3.5, 0, 3.5, -1.75, 0, 3.5,
      1.75, 0, 3.5, 3.5, 0, 3.5,
      -3.5, 0.8, 3.5, -1.75, 0.8, 3.5,
      1.75, 0.8, 3.5, 3.5, 0.8, 3.5,
      -3.5, 0, 3.5, -3.5, 0.8, 3.5,
      3.5, 0, 3.5, 3.5, 0.8, 3.5,
      -1.75, 0, 3.5, -1.75, 0.8, 3.5,
      1.75, 0, 3.5, 1.75, 0.8, 3.5,
    ], aduMat));

    sg.add(gADU);

    /* ═══ PARTICLES — 50 rising gold motes ═══ */
    var PC = 50;
    var pArr = new Float32Array(PC * 3);
    var pVel = [];
    for (var pi = 0; pi < PC; pi++) {
      pArr[pi * 3]     = (Math.random() - 0.5) * 32;
      pArr[pi * 3 + 1] = Math.random() * 18;
      pArr[pi * 3 + 2] = (Math.random() - 0.5) * 32;
      pVel.push(0.003 + Math.random() * 0.008);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.1, transparent: true, opacity: 0, sizeAttenuation: true,
    });
    sg.add(new THREE.Points(pGeo, pMat));

    /* ── Mouse tracking ── */
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Hero scroll progress ── */
    var scrollP = 0;
    ScrollTrigger.create({
      trigger: '#city-hero', start: 'top top', end: 'bottom top',
      onUpdate: function (s) { scrollP = s.progress; },
    });

    /* ── Visibility gate ── */
    var visible = true;
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
    }, { threshold: 0.01 }).observe(wrap);

    /* ═══ RENDER LOOP — Progressive timed reveal ═══ */
    var clock = new THREE.Clock();
    var baseRotY = -0.35;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      var t = clock.getElapsedTime();

      /* GROUP 1: Grid — 0s to 0.8s */
      gridMat.opacity = clamp(t / 0.8) * 0.12;

      /* GROUP 2: Lot lines — 0.4s to 1.2s */
      var lotP = ease(clamp((t - 0.4) / 0.8));
      lotMat.opacity = lotP * 0.35;
      setbackMat.opacity = lotP * 0.5;
      gLots.position.y = -0.5 * (1 - lotP);

      /* GROUP 3: Neighbor houses — 0.8s to 1.8s */
      var houseP = ease(clamp((t - 0.8) / 1.0));
      houseMat.opacity = houseP * 0.22;
      gHouses.position.y = -3 * (1 - houseP);

      /* GROUP 4: Highlighted property — 1.5s to 2.5s */
      var highP = ease(clamp((t - 1.5) / 1.0));
      highlightMat.opacity = highP * 0.6;
      gHighlight.position.y = -4 * (1 - highP);

      /* GROUP 5: ADU — 2.2s to 3.2s */
      var aduP = ease(clamp((t - 2.2) / 1.0));
      aduMat.opacity = aduP * 0.7;
      gADU.position.y = -2 * (1 - aduP);

      /* Particles: 2.8s to 3.8s */
      pMat.opacity = clamp((t - 2.8) / 1.0) * 0.35;

      /* Slow orbit + mouse parallax */
      var targetY = baseRotY + t * 0.03 + scrollP * 0.5;
      sg.rotation.y += (targetY + mx * 0.12 - sg.rotation.y) * 0.015;
      sg.rotation.x += (my * 0.04 - sg.rotation.x) * 0.015;

      /* Breathing */
      var breathe = 1 + Math.sin(t * 0.4) * 0.008;
      sg.scale.setScalar(breathe);

      /* Camera scroll parallax */
      camera.position.y = 18 - scrollP * 8;
      camera.lookAt(0, 1, 0);

      /* Particle rise */
      var pa = pGeo.attributes.position.array;
      for (var j = 0; j < PC; j++) {
        pa[j * 3 + 1] += pVel[j];
        if (pa[j * 3 + 1] > 20) {
          pa[j * 3 + 1] = -1;
          pa[j * 3]     = (Math.random() - 0.5) * 32;
          pa[j * 3 + 2] = (Math.random() - 0.5) * 32;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      /* Gentle light movement */
      pl1.position.x = 15 + Math.sin(t * 0.3) * 3;
      pl1.position.z = 20 + Math.cos(t * 0.2) * 3;

      renderer.render(scene, camera);
    }
    animate();

    /* ── Debounced resize handler ── */
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
     REGULATIONS — Staggered card fade-up
     ═══════════════════════════════════════════════ */
  function initRegulations() {
    var cards = document.querySelectorAll('.city-reg-card');
    if (!cards.length) return;

    cards.forEach(function (card, i) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(card, {
            opacity: 1, y: 0,
            duration: 0.9,
            delay: (i % 2) * 0.15,
            ease: 'power3.out',
          });
        },
      });
    });
  }

  /* ═══════════════════════════════════════════════
     CITY SHOWCASE — fade-in animations
     ═══════════════════════════════════════════════ */
  function initCityShowcase() {
    var showcaseEl = document.getElementById('city-showcase');
    if (!showcaseEl) return;

    gsap.from('.city-showcase-label', {
      opacity: 0, y: 30, duration: 0.8,
      scrollTrigger: { trigger: showcaseEl, start: 'top 75%' }
    });
    gsap.from('.city-showcase-title', {
      opacity: 0, y: 40, duration: 1, delay: 0.15,
      scrollTrigger: { trigger: showcaseEl, start: 'top 75%' }
    });
    gsap.from('.city-showcase-desc', {
      opacity: 0, y: 30, filter: 'blur(6px)', duration: 0.8, delay: 0.3,
      scrollTrigger: { trigger: showcaseEl, start: 'top 75%' }
    });
  }

  /* ═══════════════════════════════════════════════
     REQUIREMENTS — Text animations + 3D backdrop
     ═══════════════════════════════════════════════ */
  function initRequirements() {
    initRequirements3D();
  }

  /* ═══════════════════════════════════════════════
     REQUIREMENTS 3D — Architectural Wireframe Backdrop
     ═══════════════════════════════════════════════ */
  function initRequirements3D() {
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('reqs-canvas');
    if (!wrap) return;

    /* ── Renderer ── */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    wrap.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 1000);
    camera.position.set(18, 14, 24);
    camera.lookAt(0, 3, 0);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.4));
    var pl1 = new THREE.PointLight(0xc9a96e, 1.0, 80);
    pl1.position.set(15, 20, 20);
    scene.add(pl1);
    var pl2 = new THREE.PointLight(0xc8222a, 0.3, 60);
    pl2.position.set(-15, 5, 10);
    scene.add(pl2);

    /* ── Colors / Materials ── */
    var GOLD = 0xc9a96e, CREAM = 0xf0ede8;
    var goldLine = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 });
    var goldLineFaint = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.15 });
    var creamLine = new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: 0.2 });
    var creamLineFaint = new THREE.LineBasicMaterial({ color: CREAM, transparent: true, opacity: 0.08 });

    /* ── Scene Group ── */
    var sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    /* ── Geometry helpers ── */
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }
    function createBuilding(w, h, d, x, z, material) {
      var geo = new THREE.BoxGeometry(w, h, d);
      var edges = new THREE.EdgesGeometry(geo);
      var line = new THREE.LineSegments(edges, material);
      line.position.set(x, h / 2, z);
      return line;
    }
    function createWindowFrame(cx, cy, cz, w, h, normal) {
      var hw = w / 2, hh = h / 2, pts = [];
      if (normal === 'x') {
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

    /* ═══ GROUND GRID ═══ */
    var gridSize = 24, gridDiv = 12, gridStep = gridSize / gridDiv;
    var gridPositions = [];
    for (var gi = 0; gi <= gridDiv; gi++) {
      var pos = -gridSize / 2 + gi * gridStep;
      gridPositions.push(-gridSize / 2, 0, pos, gridSize / 2, 0, pos);
      gridPositions.push(pos, 0, -gridSize / 2, pos, 0, gridSize / 2);
    }
    sceneGroup.add(lineSegs(gridPositions, creamLineFaint));

    /* ═══ BUILDINGS — 4 volumes ═══ */
    sceneGroup.add(createBuilding(8, 7, 6, 0, 0, goldLine));
    sceneGroup.add(createBuilding(5, 4.5, 7, -5.5, 0.5, goldLine));
    sceneGroup.add(createBuilding(3.5, 10, 4, 4.5, -1, goldLine));
    sceneGroup.add(createBuilding(4, 3, 5, -3, -4, goldLineFaint));

    /* ═══ ROOF OVERHANGS ═══ */
    var overhang = 0.4;
    var roofPositions = [];
    roofPositions.push(
      -4-overhang, 7.05, -3-overhang, 4+overhang, 7.05, -3-overhang,
      4+overhang, 7.05, -3-overhang, 4+overhang, 7.05, 3+overhang,
      4+overhang, 7.05, 3+overhang, -4-overhang, 7.05, 3+overhang,
      -4-overhang, 7.05, 3+overhang, -4-overhang, 7.05, -3-overhang
    );
    roofPositions.push(
      2.75-0.2, 10.05, -3-0.2, 6.25+0.2, 10.05, -3-0.2,
      6.25+0.2, 10.05, -3-0.2, 6.25+0.2, 10.05, 1+0.2,
      6.25+0.2, 10.05, 1+0.2, 2.75-0.2, 10.05, 1+0.2,
      2.75-0.2, 10.05, 1+0.2, 2.75-0.2, 10.05, -3-0.2
    );
    sceneGroup.add(lineSegs(roofPositions, goldLineFaint));

    /* ═══ WINDOW FRAMES ═══ */
    sceneGroup.add(createWindowFrame(-2, 4.5, 3.01, 1.4, 2, 'z'));
    sceneGroup.add(createWindowFrame(0.5, 4.5, 3.01, 1.4, 2, 'z'));
    sceneGroup.add(createWindowFrame(-2, 2, 3.01, 1.4, 1.5, 'z'));
    sceneGroup.add(createWindowFrame(0.5, 2, 3.01, 1.4, 1.5, 'z'));
    sceneGroup.add(createWindowFrame(4.5, 7, 1.01, 1.2, 2.5, 'z'));
    sceneGroup.add(createWindowFrame(4.5, 3.5, 1.01, 1.2, 2, 'z'));
    sceneGroup.add(createWindowFrame(-8.01, 3, -0.5, 1.2, 1.8, 'x'));
    sceneGroup.add(createWindowFrame(-8.01, 3, 2, 1.2, 1.8, 'x'));

    /* ═══ RIDGE BEAMS + RAFTERS + EAVE RETURNS ═══ */
    /* Main building ridge beam */
    sceneGroup.add(lineSegs([
      0, 7.5, -3-overhang,  0, 7.5, 3+overhang,
    ], goldLineFaint));
    /* Main building rafters */
    sceneGroup.add(lineSegs([
      -4-overhang, 7.05, -3-overhang,  0, 7.5, -3-overhang,
       4+overhang, 7.05, -3-overhang,  0, 7.5, -3-overhang,
      -4-overhang, 7.05, 3+overhang,   0, 7.5, 3+overhang,
       4+overhang, 7.05, 3+overhang,   0, 7.5, 3+overhang,
    ], goldLineFaint));
    /* Main building eave returns */
    sceneGroup.add(lineSegs([
      -4-overhang, 7.05, -3-overhang,  -4, 7, -3,
       4+overhang, 7.05, -3-overhang,   4, 7, -3,
      -4-overhang, 7.05, 3+overhang,   -4, 7, 3,
       4+overhang, 7.05, 3+overhang,    4, 7, 3,
    ], goldLineFaint));
    /* Tall building ridge beam */
    sceneGroup.add(lineSegs([
      4.5, 10.4, -3-0.2,  4.5, 10.4, 1+0.2,
    ], goldLineFaint));
    /* Tall building rafters */
    sceneGroup.add(lineSegs([
      2.75-0.2, 10.05, -3-0.2,  4.5, 10.4, -3-0.2,
      6.25+0.2, 10.05, -3-0.2,  4.5, 10.4, -3-0.2,
      2.75-0.2, 10.05, 1+0.2,   4.5, 10.4, 1+0.2,
      6.25+0.2, 10.05, 1+0.2,   4.5, 10.4, 1+0.2,
    ], goldLineFaint));
    /* Tall building eave returns */
    sceneGroup.add(lineSegs([
      2.75-0.2, 10.05, -3-0.2,  2.75, 10, -3,
      6.25+0.2, 10.05, -3-0.2,  6.25, 10, -3,
      2.75-0.2, 10.05, 1+0.2,   2.75, 10, 1,
      6.25+0.2, 10.05, 1+0.2,   6.25, 10, 1,
    ], goldLineFaint));

    /* ═══ PARTICLES — 60 rising gold motes ═══ */
    var particleCount = 60;
    var particlePositions = new Float32Array(particleCount * 3);
    var particleData = [];
    for (var p = 0; p < particleCount; p++) {
      particlePositions[p * 3]     = (Math.random() - 0.5) * 30;
      particlePositions[p * 3 + 1] = Math.random() * 15;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 30;
      particleData.push({ speed: 0.003 + Math.random() * 0.008 });
    }
    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    var particleMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.1, transparent: true, opacity: 0.3, sizeAttenuation: true,
    });
    sceneGroup.add(new THREE.Points(particleGeo, particleMat));

    /* ── Mouse tracking ── */
    var mouse = { x: 0, y: 0 };
    var targetRotation = { x: 0, y: 0 };
    document.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Visibility gate ── */
    var isVisible = false;
    var section = document.getElementById('city-reqs');
    if (section) {
      new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 }).observe(section);
    }

    /* ── Animation Loop ── */
    var clock = new THREE.Clock();
    var baseRotationY = -0.3;

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      var elapsed = clock.getElapsedTime();

      /* Slow orbit + mouse parallax */
      targetRotation.y = baseRotationY + mouse.x * 0.12 + elapsed * 0.03;
      targetRotation.x = mouse.y * 0.06;
      sceneGroup.rotation.y += (targetRotation.y - sceneGroup.rotation.y) * 0.015;
      sceneGroup.rotation.x += (targetRotation.x - sceneGroup.rotation.x) * 0.015;

      /* Subtle breathing */
      var breathe = 1 + Math.sin(elapsed * 0.4) * 0.008;
      sceneGroup.scale.setScalar(breathe);

      /* Particle rise */
      var pPos = particleGeo.getAttribute('position');
      for (var pi = 0; pi < particleCount; pi++) {
        pPos.array[pi * 3 + 1] += particleData[pi].speed;
        if (pPos.array[pi * 3 + 1] > 18) {
          pPos.array[pi * 3 + 1] = -1;
          pPos.array[pi * 3]     = (Math.random() - 0.5) * 30;
          pPos.array[pi * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      pPos.needsUpdate = true;

      /* Gentle light movement */
      pl1.position.x = 15 + Math.sin(elapsed * 0.3) * 3;
      pl1.position.z = 20 + Math.cos(elapsed * 0.2) * 3;

      renderer.render(scene, camera);
    }
    animate();

    /* ── Debounced resize handler ── */
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
     SCROLL ANIMATIONS — data-animate handlers
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { y: 50, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    });

    /* fade-up-stagger */
    document.querySelectorAll('[data-animate="fade-up-stagger"]').forEach(function (el) {
      var children = el.children;
      if (!children.length) return;
      gsap.fromTo(children,
        { y: 40, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
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
     CTA — word-stagger-elastic + ambient glow + magnetic buttons
     ═══════════════════════════════════════════════ */
  function initCTA() {
    var ctaSection = document.querySelector('.city-cta-container');
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
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initHero();
    initRegulations();
    initCityShowcase();
    initRequirements();
    initScrollAnimations();
    initCTA();
  });

})();
