(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ── Preserve original text before avorino-animations.js modifies DOM ── */
  document.querySelectorAll('#sv-hero h1, #sv-types h2, #sv-process h2, #sv-why h2, .av-cta-heading, .sv-stat-label, .sv-stat-value, [data-animate="word-stagger-elastic"], [data-animate="char-cascade"]').forEach(function(el) {
    if (!el.dataset.origText) el.dataset.origText = el.textContent.trim();
  });

  /* ── Remove data-animate from elements this script handles, so avorino-animations.js skips them ── */
  document.querySelectorAll('.sv-process-row, .sv-process-divider, .sv-stat-value, .sv-stat-label, .sv-stats-grid, .sv-highlight').forEach(function(el) {
    el.removeAttribute('data-animate');
  });

  /* ── Hide stats grid from avorino-animations.js initStatCounters ──
     animations.js matches [class*="stats-grid"] and runs scrambleDecode on labels.
     We temporarily swap the class so it can't find it. Restore after DOMContentLoaded. */
  document.querySelectorAll('.sv-stats-grid').forEach(function(grid) {
    grid.classList.remove('sv-stats-grid');
    grid.classList.add('sv-statsblock');
    grid.dataset.restoreClass = '1';
  });

  /* ── Also remove data-animate from CTA elements so animations.js doesn't touch them ── */
  document.querySelectorAll('.av-cta-heading, .av-cta-btn, .av-cta-btns, .av-cta-subtitle').forEach(function(el) {
    el.removeAttribute('data-animate');
  });

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL — reuse or replace existing
     ═══════════════════════════════════════════════ */
  /* Destroy any existing Lenis instance from avorino-animations.js */
  if (window.__lenis) { try { window.__lenis.destroy(); } catch(e) {} }
  var lenis = new Lenis({
    duration: 1.4,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true, smoothTouch: false,
  });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', function () { lenis.resize(); });

  /* ═══════════════════════════════════════════════
     TEXT UTILITIES
     ═══════════════════════════════════════════════ */
  function splitIntoChars(el) {
    var text = el.dataset.origText || el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex'; el.style.flexWrap = 'wrap'; el.style.gap = '0 0.3em';
    var charEls = [];
    text.split(/\s+/).forEach(function (word) {
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
    text.split(/\s+/).forEach(function (word) {
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
     HERO — Three.js LOD Progression
     Scroll-pinned: low-poly mesh progressively refines
     into detailed geometry. Wireframe -> solid -> detailed.
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('sv-hero');
    if (!hero) return;
    var canvasWrap = document.getElementById('hero-canvas');
    if (!canvasWrap) return;

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

    /* ── Hero content parallax fade ── */
    var heroContent = hero.querySelector('[class*="content-overlay"], [class*="hero-content"]');
    if (heroContent) {
      gsap.to(heroContent, { opacity: 0, y: -60, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: 1 } });
    }
    if (scrollHint) {
      gsap.to(scrollHint, { opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: 1 } });
    }

    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 150);
    camera.position.set(12, 8, 14);
    camera.lookAt(0, 2, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;

    /* ── Named dimensions: modern house 12 wide, 8 deep ── */
    var hW = 6, hD = 4; // half-width=6, half-depth=4
    var wH = 3.5;        // wall height
    var roofY = 3.5;     // flat roof height
    var ovh = 0.5;       // roof overhang

    /* ── Helper: create a connected line loop from array of [x,y,z] ── */
    function lineLoop(pts, material) {
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(
        pts.map(function(p) { return new THREE.Vector3(p[0], p[1], p[2]); })
      ), material);
    }

    /* ── wireGroup: Clean connected wireframe house (gold) — visible immediately ── */
    var wireGroup = new THREE.Group();
    var wireMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0.5 });

    // Floor outline — single connected loop
    wireGroup.add(lineLoop([
      [-hW, 0, -hD], [hW, 0, -hD], [hW, 0, hD], [-hW, 0, hD], [-hW, 0, -hD]
    ], wireMat));

    // Front wall — single connected loop
    wireGroup.add(lineLoop([
      [-hW, 0, -hD], [hW, 0, -hD], [hW, wH, -hD], [-hW, wH, -hD], [-hW, 0, -hD]
    ], wireMat));

    // Back wall — single connected loop
    wireGroup.add(lineLoop([
      [-hW, 0, hD], [hW, 0, hD], [hW, wH, hD], [-hW, wH, hD], [-hW, 0, hD]
    ], wireMat));

    // Left wall — single connected loop
    wireGroup.add(lineLoop([
      [-hW, 0, -hD], [-hW, 0, hD], [-hW, wH, hD], [-hW, wH, -hD], [-hW, 0, -hD]
    ], wireMat));

    // Right wall — single connected loop
    wireGroup.add(lineLoop([
      [hW, 0, -hD], [hW, 0, hD], [hW, wH, hD], [hW, wH, -hD], [hW, 0, -hD]
    ], wireMat));

    // Flat roof outline with overhang — single connected loop
    wireGroup.add(lineLoop([
      [-hW - ovh, roofY, -hD - ovh], [hW + ovh, roofY, -hD - ovh],
      [hW + ovh, roofY, hD + ovh], [-hW - ovh, roofY, hD + ovh],
      [-hW - ovh, roofY, -hD - ovh]
    ], wireMat));

    // Front windows (3 clean rectangles on front wall, no overlaps)
    var winW = 1.5, winH = 1.6, winY = 1.2;
    var winPositions = [-4, -1, 3];
    winPositions.forEach(function(wx) {
      wireGroup.add(lineLoop([
        [wx, winY, -hD - 0.01], [wx + winW, winY, -hD - 0.01],
        [wx + winW, winY + winH, -hD - 0.01], [wx, winY + winH, -hD - 0.01],
        [wx, winY, -hD - 0.01]
      ], wireMat));
    });

    // Front door — clean rectangle
    wireGroup.add(lineLoop([
      [0.8, 0, -hD - 0.01], [2.2, 0, -hD - 0.01],
      [2.2, 2.6, -hD - 0.01], [0.8, 2.6, -hD - 0.01],
      [0.8, 0, -hD - 0.01]
    ], wireMat));

    scene.add(wireGroup);

    /* ── detailGroup: Additional detail lines (accent red) that fade in on scroll ── */
    var detailGroup = new THREE.Group();
    var detailMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var detailWireMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });

    // Window mullions — cross pattern for each front window
    winPositions.forEach(function(wx) {
      // Vertical mullion
      detailGroup.add(lineLoop([
        [wx + winW / 2, winY, -hD - 0.02], [wx + winW / 2, winY + winH, -hD - 0.02]
      ], detailWireMat));
      // Horizontal mullion
      detailGroup.add(lineLoop([
        [wx, winY + winH / 2, -hD - 0.02], [wx + winW, winY + winH / 2, -hD - 0.02]
      ], detailWireMat));
    });

    // Door handle line
    detailGroup.add(lineLoop([
      [1.9, 1.2, -hD - 0.02], [1.9, 1.4, -hD - 0.02]
    ], detailMat));

    // Roof thickness — bottom edge loop
    wireGroup.add(lineLoop([
      [-hW - ovh, roofY - 0.2, -hD - ovh], [hW + ovh, roofY - 0.2, -hD - ovh],
      [hW + ovh, roofY - 0.2, hD + ovh], [-hW - ovh, roofY - 0.2, hD + ovh],
      [-hW - ovh, roofY - 0.2, -hD - ovh]
    ], detailWireMat));

    // Roof thickness verticals at corners
    [[-hW - ovh, -hD - ovh], [hW + ovh, -hD - ovh], [hW + ovh, hD + ovh], [-hW - ovh, hD + ovh]].forEach(function(c) {
      detailGroup.add(lineLoop([
        [c[0], roofY - 0.2, c[1]], [c[0], roofY, c[1]]
      ], detailWireMat));
    });

    // Wall section lines — vertical subdivisions at columns (front and back)
    [-3, 0, 3].forEach(function(sx) {
      detailGroup.add(lineLoop([
        [sx, 0, -hD - 0.01], [sx, wH, -hD - 0.01]
      ], detailWireMat));
      detailGroup.add(lineLoop([
        [sx, 0, hD + 0.01], [sx, wH, hD + 0.01]
      ], detailWireMat));
    });

    // Left side large window
    detailGroup.add(lineLoop([
      [-hW - 0.01, 0.2, -2], [-hW - 0.01, 0.2, 2],
      [-hW - 0.01, 3.2, 2], [-hW - 0.01, 3.2, -2],
      [-hW - 0.01, 0.2, -2]
    ], detailWireMat));

    scene.add(detailGroup);

    /* ── glowGroup: Window panes that glow warm (rendering = lit windows) ── */
    var glowGroup = new THREE.Group();
    var glowMat = new THREE.MeshBasicMaterial({ color: 0xFFE8B0, transparent: true, opacity: 0, side: THREE.DoubleSide });

    // Glowing window panes (front windows)
    winPositions.forEach(function(wx) {
      var pane = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), glowMat.clone());
      pane.position.set(wx + winW / 2, winY + winH / 2, -hD - 0.02);
      glowGroup.add(pane);
    });
    // Left side large window glow
    var leftPane = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), glowMat.clone());
    leftPane.position.set(-hW - 0.02, 1.7, 0);
    leftPane.rotation.y = Math.PI / 2;
    glowGroup.add(leftPane);
    // Floor glow (warm interior light spilling out)
    var floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(hW * 2 - 0.5, hD * 2 - 0.5), new THREE.MeshBasicMaterial({ color: 0xFFD699, transparent: true, opacity: 0, side: THREE.DoubleSide }));
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.set(0, 0.02, 0);
    glowGroup.add(floorGlow);
    glowGroup.visible = false;
    scene.add(glowGroup);

    /* ── solidModel: Full 3D house (walls, roof, windows, floor) — revealed at scroll end ── */
    var solidModel = new THREE.Group();

    // Exterior wall material — cream/white, semi-transparent
    var wallMat = new THREE.MeshStandardMaterial({
      color: 0xF5F0E8, roughness: 0.85, transparent: true, opacity: 0, side: THREE.DoubleSide
    });
    // Floor
    var floorMat = new THREE.MeshStandardMaterial({
      color: 0xD4C8B0, roughness: 0.6, transparent: true, opacity: 0
    });
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(hW * 2, hD * 2), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0.01, 0);
    floor.receiveShadow = true; solidModel.add(floor);

    // Walls — front, back, left, right (solid planes)
    var frontWall = new THREE.Mesh(new THREE.PlaneGeometry(hW * 2, wH), wallMat.clone());
    frontWall.position.set(0, wH / 2, -hD); solidModel.add(frontWall);
    var backWall = new THREE.Mesh(new THREE.PlaneGeometry(hW * 2, wH), wallMat.clone());
    backWall.position.set(0, wH / 2, hD); backWall.rotation.y = Math.PI; solidModel.add(backWall);
    var leftWall = new THREE.Mesh(new THREE.PlaneGeometry(hD * 2, wH), wallMat.clone());
    leftWall.position.set(-hW, wH / 2, 0); leftWall.rotation.y = Math.PI / 2; solidModel.add(leftWall);
    var rightWall = new THREE.Mesh(new THREE.PlaneGeometry(hD * 2, wH), wallMat.clone());
    rightWall.position.set(hW, wH / 2, 0); rightWall.rotation.y = -Math.PI / 2; solidModel.add(rightWall);

    // Roof slab
    var roofMat = new THREE.MeshStandardMaterial({
      color: 0x3A3530, roughness: 0.7, transparent: true, opacity: 0, side: THREE.DoubleSide
    });
    var roofSlab = box(hW * 2 + ovh * 2, 0.2, hD * 2 + ovh * 2, roofMat);
    roofSlab.position.set(0, roofY - 0.1, 0); solidModel.add(roofSlab);
    // Fascia strip
    var fasciaMat = new THREE.MeshStandardMaterial({
      color: 0xF5F0E8, roughness: 0.6, transparent: true, opacity: 0
    });
    var fasciaF = box(hW * 2 + ovh * 2, 0.12, 0.08, fasciaMat);
    fasciaF.position.set(0, roofY - 0.16, -hD - ovh); solidModel.add(fasciaF);

    // Window glass panes (solid blue tint)
    var heroGlassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, transparent: true, opacity: 0, side: THREE.DoubleSide
    });
    winPositions.forEach(function(wx) {
      var pane = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), heroGlassMat.clone());
      pane.position.set(wx + winW / 2, winY + winH / 2, -hD - 0.005);
      solidModel.add(pane);
    });
    // Left window glass
    var leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), heroGlassMat.clone());
    leftGlass.position.set(-hW - 0.005, 1.7, 0); leftGlass.rotation.y = Math.PI / 2;
    solidModel.add(leftGlass);

    // Window frames (dark)
    var heroFrameMat = new THREE.MeshStandardMaterial({
      color: 0x2A2520, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0
    });
    winPositions.forEach(function(wx) {
      var fTop = box(winW + 0.15, 0.08, 0.06, heroFrameMat.clone());
      fTop.position.set(wx + winW / 2, winY + winH + 0.04, -hD - 0.01); solidModel.add(fTop);
      var fBot = box(winW + 0.15, 0.08, 0.06, heroFrameMat.clone());
      fBot.position.set(wx + winW / 2, winY - 0.04, -hD - 0.01); solidModel.add(fBot);
    });

    // Door (solid dark)
    var doorMat = new THREE.MeshStandardMaterial({
      color: 0x3A3025, roughness: 0.7, transparent: true, opacity: 0
    });
    var doorPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.6), doorMat);
    doorPanel.position.set(1.5, 1.3, -hD - 0.005); solidModel.add(doorPanel);

    // ── Interior furniture (hero house: x:-6 to 6, z:-4 to 4) ──
    // Helper: solid mat that starts transparent
    function hMat(color, rough, metal) {
      var m = new THREE.MeshStandardMaterial({
        color: color, roughness: rough || 0.7, metalness: metal || 0,
        transparent: true, opacity: 0
      });
      return m;
    }

    // LIVING AREA (left side: x: -5.5 to -1, z: -3.5 to 3.5)
    // Sofa against left wall, facing +x
    var hSofaBase = box(1.0, 0.25, 2.4, hMat(0x8A9AAA, 0.82));
    hSofaBase.position.set(-5.2, 0.13, -1); solidModel.add(hSofaBase);
    var hSofaBack = box(0.15, 0.4, 2.4, hMat(0x7A8A98, 0.8));
    hSofaBack.position.set(-5.6, 0.45, -1); solidModel.add(hSofaBack);
    var hSofaArmL = box(1.0, 0.3, 0.12, hMat(0x8A9AAA, 0.82));
    hSofaArmL.position.set(-5.2, 0.4, -2.25); solidModel.add(hSofaArmL);
    var hSofaArmR = box(1.0, 0.3, 0.12, hMat(0x8A9AAA, 0.82));
    hSofaArmR.position.set(-5.2, 0.4, 0.25); solidModel.add(hSofaArmR);
    // Cushions
    var hCush1 = box(0.7, 0.08, 1.1, hMat(0x7A8A98, 0.8));
    hCush1.position.set(-5.1, 0.3, -1.6); solidModel.add(hCush1);
    var hCush2 = box(0.7, 0.08, 1.1, hMat(0x7A8A98, 0.8));
    hCush2.position.set(-5.1, 0.3, -0.4); solidModel.add(hCush2);
    // Red throw pillow
    var hThrow = box(0.1, 0.3, 0.3, hMat(0xc8222a, 0.7));
    hThrow.position.set(-5.4, 0.5, -2.0); solidModel.add(hThrow);

    // Coffee table
    var hCtTop = box(0.6, 0.04, 1.4, hMat(0x88AACC, 0.15, 0.1));
    hCtTop.position.set(-3.8, 0.35, -1); solidModel.add(hCtTop);
    [[-0.22, -0.55], [0.22, -0.55], [-0.22, 0.55], [0.22, 0.55]].forEach(function(lp) {
      var hCtLeg = box(0.03, 0.33, 0.03, hMat(0xC0C0C0, 0.25, 0.15));
      hCtLeg.position.set(-3.8 + lp[0], 0.16, -1 + lp[1]); solidModel.add(hCtLeg);
    });

    // Floor lamp
    var hLampPole = box(0.03, 1.1, 0.03, hMat(0xC0C0C0, 0.25, 0.15));
    hLampPole.position.set(-2.5, 0.55, 0.8); solidModel.add(hLampPole);
    var hLampShade = box(0.35, 0.22, 0.35, hMat(0xF0E8D8, 0.9));
    hLampShade.position.set(-2.5, 1.22, 0.8); solidModel.add(hLampShade);

    // Area rug
    var hRug = box(3, 0.015, 3, hMat(0x5A4838, 0.9));
    hRug.position.set(-4.2, 0.02, -0.8); solidModel.add(hRug);

    // KITCHEN (right-front: x: 1 to 5.5, z: -3.5 to 0)
    // Counter along right wall
    var hCounter = box(0.6, 0.6, 3, hMat(0xF0ECE6, 0.6));
    hCounter.position.set(5.4, 0.3, -1.5); solidModel.add(hCounter);
    var hCounterTop = box(0.65, 0.04, 3.1, hMat(0xF0EDE8, 0.3, 0.05));
    hCounterTop.position.set(5.4, 0.62, -1.5); solidModel.add(hCounterTop);

    // Island
    var hIsland = box(1.8, 0.6, 0.8, hMat(0xF0ECE6, 0.6));
    hIsland.position.set(3.5, 0.3, -1.5); solidModel.add(hIsland);
    var hIslandTop = box(1.9, 0.04, 0.9, hMat(0xF0EDE8, 0.3, 0.05));
    hIslandTop.position.set(3.5, 0.62, -1.5); solidModel.add(hIslandTop);

    // Bar stools (2)
    for (var hbs = 0; hbs < 2; hbs++) {
      var hStoolSeat = box(0.28, 0.04, 0.28, hMat(0x3A3A3A, 0.6));
      hStoolSeat.position.set(3.1 + hbs * 0.8, 0.5, -2.3); solidModel.add(hStoolSeat);
      var hStoolLeg = box(0.03, 0.48, 0.03, hMat(0xC0C0C0, 0.25, 0.15));
      hStoolLeg.position.set(3.1 + hbs * 0.8, 0.24, -2.3); solidModel.add(hStoolLeg);
    }

    // Fridge
    var hFridge = box(0.7, 1.4, 0.55, hMat(0xC0C0C0, 0.25, 0.15));
    hFridge.position.set(5.3, 0.7, -3.3); solidModel.add(hFridge);

    // DINING (right-back: x: 1 to 5, z: 1 to 3.5)
    var hDtTop = box(2.0, 0.07, 1.2, hMat(0x9B8565, 0.7));
    hDtTop.position.set(3, 0.52, 2.5); solidModel.add(hDtTop);
    [[-0.8, -0.45], [0.8, -0.45], [-0.8, 0.45], [0.8, 0.45]].forEach(function(lp) {
      var hDtLeg = box(0.05, 0.5, 0.05, hMat(0x6B5040, 0.75));
      hDtLeg.position.set(3 + lp[0], 0.25, 2.5 + lp[1]); solidModel.add(hDtLeg);
    });
    // 4 chairs
    [[-0.65, -0.9, 1], [0.65, -0.9, 1], [-0.65, 0.9, -1], [0.65, 0.9, -1]].forEach(function(cp) {
      var hChSeat = box(0.3, 0.03, 0.3, hMat(0x9B8565, 0.7));
      hChSeat.position.set(3 + cp[0], 0.32, 2.5 + cp[1]); solidModel.add(hChSeat);
      var hChBack = box(0.3, 0.35, 0.04, hMat(0x9B8565, 0.7));
      hChBack.position.set(3 + cp[0], 0.52, 2.5 + cp[1] + cp[2] * -0.15); solidModel.add(hChBack);
    });

    // Pendant light over dining
    var hPendRod = box(0.02, 0.8, 0.02, hMat(0xC0C0C0, 0.25, 0.15));
    hPendRod.position.set(3, 3.0, 2.5); solidModel.add(hPendRod);
    var hPendShade = box(0.4, 0.18, 0.4, hMat(0x222222, 0.5, 0.3));
    hPendShade.position.set(3, 2.5, 2.5); solidModel.add(hPendShade);

    // BEDROOM (left-back: x: -5.5 to -1, z: 1 to 3.5)
    // Bed against back wall
    var hBedFrame = box(2.2, 0.18, 2.2, hMat(0x6B5040, 0.75));
    hBedFrame.position.set(-3.5, 0.09, 2.7); solidModel.add(hBedFrame);
    var hMattress = box(2.0, 0.2, 2.0, hMat(0xE8E0D5, 0.85));
    hMattress.position.set(-3.5, 0.28, 2.7); solidModel.add(hMattress);
    var hHeadboard = box(2.2, 1.0, 0.08, hMat(0x6B5D4A, 0.7));
    hHeadboard.position.set(-3.5, 0.7, 3.9); solidModel.add(hHeadboard);
    // Pillows
    var hPillow1 = box(0.8, 0.12, 0.35, hMat(0xBEB5A8, 0.82));
    hPillow1.position.set(-4.0, 0.44, 3.3); solidModel.add(hPillow1);
    var hPillow2 = box(0.8, 0.12, 0.35, hMat(0xBEB5A8, 0.82));
    hPillow2.position.set(-3.0, 0.44, 3.3); solidModel.add(hPillow2);
    // Nightstand
    var hNs = box(0.45, 0.4, 0.35, hMat(0x6B5040, 0.75));
    hNs.position.set(-2.1, 0.2, 3.5); solidModel.add(hNs);

    // Interior point light (warm glow from center)
    var heroInteriorLight = new THREE.PointLight(0xFFD699, 0, 12, 2);
    heroInteriorLight.position.set(0, 2.5, 0);
    solidModel.add(heroInteriorLight);

    // Ambient + directional light for solid model (starts off)
    var heroModelLight = new THREE.DirectionalLight(0xFFE8C0, 0);
    heroModelLight.position.set(5, 8, -3);
    solidModel.add(heroModelLight);
    var heroFillLight = new THREE.HemisphereLight(0xFFE8B0, 0x2A2520, 0);
    solidModel.add(heroFillLight);

    solidModel.visible = false;
    scene.add(solidModel);

    /* ── Ground plane grid (~16 units each direction) ── */
    var gridGroup = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    for (var gi = -8; gi <= 8; gi += 2) {
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-8, 0, gi), new THREE.Vector3(8, 0, gi)
      ]), gridMat.clone()));
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(gi, 0, -8), new THREE.Vector3(gi, 0, 8)
      ]), gridMat.clone()));
    }
    scene.add(gridGroup);

    /* ── Initial entrance — wireframe visible immediately ── */
    // Grid fades in
    gsap.to({ v: 0 }, { v: 1, duration: 1.5, delay: 0.3, ease: 'power2.out',
      onUpdate: function() {
        gridGroup.children.forEach(function(l) { l.material.opacity = this.targets()[0].v * 0.06; }.bind(this));
      }
    });
    // Wireframe draws in with line-by-line stagger
    wireGroup.children.forEach(function(line, i) {
      line.material = wireMat.clone();
      line.material.opacity = 0;
      gsap.to(line.material, { opacity: 0.5, duration: 0.6, delay: 0.4 + i * 0.08, ease: 'power2.out' });
    });

    /* ═══ SCROLL-DRIVEN SKETCH-TO-RENDER PROGRESSION ═══
       0%–30%  : Detail lines appear (mullions, subdivisions)
       30%–60% : Window panes glow warm (rendering = lit windows)
       60%–85% : Wireframe brightens to full gold, glow intensifies
       85%–100%: Grid fades, camera settles — "final render"
    ═══════════════════════════════════════ */
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        var p = self.progress;

        // 0-30%: Detail lines fade in (mullions, section lines, large window)
        var detailP = Math.min(1, p / 0.3);
        detailMat.opacity = detailP * 0.6;
        detailWireMat.opacity = detailP * 0.4;

        // 30-60%: Window panes glow warm (the "rendering" phase)
        var glowP = Math.max(0, Math.min(1, (p - 0.3) / 0.3));
        if (glowP > 0 && !glowGroup.visible) glowGroup.visible = true;
        glowGroup.traverse(function(obj) {
          if (obj.isMesh && obj.material) {
            obj.material.opacity = glowP * 0.25;
          }
        });

        // 60-80%: Solid model fades in, wireframe stays, glow intensifies
        var solidP = Math.max(0, Math.min(1, (p - 0.6) / 0.2));
        if (solidP > 0 && !solidModel.visible) solidModel.visible = true;
        solidModel.traverse(function(obj) {
          if (obj.isMesh && obj.material) {
            // Glass stays lower opacity, walls/roof go up to 0.85
            var maxOp = (obj.material.color && obj.material.color.r > 0.4 && obj.material.color.g > 0.6) ? 0.35 : 0.85;
            obj.material.opacity = solidP * maxOp;
          }
        });
        // Model lights ramp up
        heroModelLight.intensity = solidP * 1.5;
        heroFillLight.intensity = solidP * 0.6;
        heroInteriorLight.intensity = solidP * 4;
        // Glow intensifies behind glass
        glowGroup.traverse(function(obj) {
          if (obj.isMesh && obj.material) {
            obj.material.opacity = 0.25 + solidP * 0.4;
          }
        });

        // 80-100%: Wireframe fades, grid fades — clean solid model remains
        var fadeP = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
        wireGroup.children.forEach(function(line) {
          if (line.material) line.material.opacity = 0.5 * (1 - fadeP * 0.7);
        });
        detailMat.opacity = 0.6 * (1 - fadeP * 0.5);
        detailWireMat.opacity = 0.4 * (1 - fadeP * 0.5);
        gridGroup.children.forEach(function(l) { l.material.opacity = 0.06 * (1 - fadeP); });

        // Camera orbit tightens + lowers for beauty shot
        camera.userData.scrollRadius = 17 - p * 4;
        camera.userData.scrollHeight = 7 + p * 0.5;
      }
    });

    /* ── Mouse + scroll ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var baseAngle = 0;
    camera.userData.scrollRadius = 17;
    camera.userData.scrollHeight = 7;

    function animate() {
      requestAnimationFrame(animate);
      baseAngle += 0.002;

      var orbitR = camera.userData.scrollRadius;
      camera.position.set(
        Math.cos(baseAngle + mouseX * 0.25) * orbitR,
        camera.userData.scrollHeight + mouseY * 1.5,
        Math.sin(baseAngle + mouseX * 0.25) * orbitR
      );
      camera.lookAt(0, 2, 0);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      var nw = canvasWrap.clientWidth, nh = canvasWrap.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
  }

  /* ═══════════════════════════════════════════════
     TYPES SHOWCASE — Stagger fade-in grid
     Cards appear with staggered animation on scroll
     ═══════════════════════════════════════════════ */
  function initTypesShowcase() {
    var typesSection = document.getElementById('sv-types');
    if (!typesSection) return;

    var cards = Array.prototype.slice.call(typesSection.querySelectorAll('[class*="type-card"]'));
    if (!cards.length) return;

    cards.forEach(function(card) { card.removeAttribute('data-animate'); });
    gsap.set(cards, { y: 60, opacity: 0 });
    gsap.to(cards, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: typesSection, start: 'top 90%', once: true }
    });
  }

  /* ═══════════════════════════════════════════════
     PROCESS SECTION — Scroll-Locked 3D Build
     Inspired by avorino-about-process3d.js
     ═══════════════════════════════════════════════ */
  var procScene, procCamera, procRenderer, procAnimId;
  var procGroups = {};
  var procNeedsRender = true;
  var procCurrentStep = -1;
  var procActiveVisual = -1;
  var isMobileProc = window.innerWidth < 992;

  /* ── Easing helpers ── */
  function smoothstep(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }
  function remap(value, inMin, inMax) {
    return Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  }
  function easeOutBack(t) {
    if (t <= 0) return 0; if (t >= 1) return 1;
    var p = t - 1; return p * p * (2.5 * p + 1.5) + 1;
  }

  /* ── Three.js Scene for Process Section ── */
  function createProcessScene(canvas) {
    procScene = new THREE.Scene();
    procScene.background = new THREE.Color(0x0B0E18);

    procRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    procRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    procRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    procRenderer.toneMappingExposure = 0.9;
    procRenderer.shadowMap.enabled = true;
    procRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var parent = canvas.parentElement;
    var w = parent.clientWidth, h = parent.clientHeight;
    procRenderer.setSize(w, h, false);

    procCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 300);
    procCamera.position.set(20, 18, 30);
    procCamera.lookAt(0, 2, 0);

    // Moonlight lighting (inspired by process3d.js)
    procScene.add(new THREE.HemisphereLight(0x1a2040, 0x0a0a15, 0.15));

    var moon = new THREE.DirectionalLight(0x8899CC, 0.4);
    moon.position.set(-20, 40, 25);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.left = -30; moon.shadow.camera.right = 30;
    moon.shadow.camera.top = 30; moon.shadow.camera.bottom = -30;
    moon.shadow.camera.far = 100;
    moon.shadow.bias = -0.0005;
    procScene.add(moon);

    var fill = new THREE.DirectionalLight(0x334466, 0.12);
    fill.position.set(15, 20, -15);
    procScene.add(fill);

    procScene.add(new THREE.AmbientLight(0x1a1a2e, 0.25));

    // Ground plane
    var groundMat = new THREE.MeshStandardMaterial({ color: 0x1A1C22, roughness: 0.95 });
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    procScene.add(ground);

    // Build house groups
    procGroups.grid = buildProcGrid();
    procGroups.foundation = buildProcFoundation();
    procGroups.walls = buildProcWalls();
    procGroups.roof = buildProcRoof();
    procGroups.windows = buildProcWindows();
    procGroups.interior = buildProcInterior();

    Object.keys(procGroups).forEach(function(k) { procScene.add(procGroups[k]); });

    procRenderLoop();
  }

  function procMarkDirty() { procNeedsRender = true; }

  function procRenderLoop() {
    procAnimId = requestAnimationFrame(procRenderLoop);
    if (procNeedsRender && procRenderer && procScene && procCamera) {
      var canvas = procRenderer.domElement;
      var parent = canvas.parentElement;
      if (parent) {
        var w = parent.clientWidth, h = parent.clientHeight;
        if (canvas.width !== w || canvas.height !== h) {
          procRenderer.setSize(w, h, false);
          procCamera.aspect = w / h;
          procCamera.updateProjectionMatrix();
        }
      }
      procRenderer.render(procScene, procCamera);
      procNeedsRender = false;
    }
  }

  /* ── Real Rendering: Wireframe-to-Photorealistic Luxury House ── */
  /* ── Modern Luxury Home: Realistic Architecture (ADU Visualizer style) ── */
  var WT = 0.5;   // wall thickness
  var WH = 9;     // wall height
  var MW = 18;    // main block width (x)
  var MD = 12;    // main block depth (z)

  var mat = function(color, rough, metal) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
  };
  var box = function(w, h, d, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };

  // ── Shared: Build a wall with rectangular openings cut out ──
  function buildWallSegments(g, x0, x1, z, openings, wallMat, axis) {
    axis = axis || 'z';
    var totalLen = x1 - x0;
    if (!openings || openings.length === 0) {
      var solid;
      if (axis === 'z') {
        solid = box(totalLen, WH, WT, wallMat);
        solid.position.set((x0 + x1) / 2, WH / 2, z);
      } else {
        solid = box(WT, WH, totalLen, wallMat);
        solid.position.set(z, WH / 2, (x0 + x1) / 2);
      }
      g.add(solid);
      return;
    }
    var sorted = openings.slice().sort(function(a, b) { return a.x - b.x; });
    var cursor = x0;
    sorted.forEach(function(op) {
      var oLeft = op.x - op.w / 2;
      var oRight = op.x + op.w / 2;
      var oBottom = op.y;
      var oTop = op.y + op.h;
      if (oLeft > cursor + 0.05) {
        var segW = oLeft - cursor;
        var seg;
        if (axis === 'z') {
          seg = box(segW, WH, WT, wallMat);
          seg.position.set(cursor + segW / 2, WH / 2, z);
        } else {
          seg = box(WT, WH, segW, wallMat);
          seg.position.set(z, WH / 2, cursor + segW / 2);
        }
        g.add(seg);
      }
      if (oTop < WH - 0.05) {
        var aboveH = WH - oTop;
        var above;
        if (axis === 'z') {
          above = box(op.w, aboveH, WT, wallMat);
          above.position.set(op.x, oTop + aboveH / 2, z);
        } else {
          above = box(WT, aboveH, op.w, wallMat);
          above.position.set(z, oTop + aboveH / 2, op.x);
        }
        g.add(above);
      }
      if (oBottom > 0.05) {
        var below;
        if (axis === 'z') {
          below = box(op.w, oBottom, WT, wallMat);
          below.position.set(op.x, oBottom / 2, z);
        } else {
          below = box(WT, oBottom, op.w, wallMat);
          below.position.set(z, oBottom / 2, op.x);
        }
        g.add(below);
      }
      cursor = oRight;
    });
    if (cursor < x1 - 0.05) {
      var endW = x1 - cursor;
      var endSeg;
      if (axis === 'z') {
        endSeg = box(endW, WH, WT, wallMat);
        endSeg.position.set(cursor + endW / 2, WH / 2, z);
      } else {
        endSeg = box(WT, WH, endW, wallMat);
        endSeg.position.set(z, WH / 2, cursor + endW / 2);
      }
      g.add(endSeg);
    }
  }

  // ── Corner posts ──
  function addCornerPost(g, x, z, wallMat) {
    var post = box(WT, WH, WT, wallMat);
    post.position.set(x, WH / 2, z);
    g.add(post);
  }

  // Digital viewport grid — techy cyan/blue
  function buildProcGrid() {
    var g = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: 0x00AACC, transparent: true, opacity: 0.1 });
    for (var i = -10; i <= 10; i++) {
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2, 0.01, -16), new THREE.Vector3(i * 2, 0.01, 16)
      ]), gridMat.clone()));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0.01, i * 1.6), new THREE.Vector3(20, 0.01, i * 1.6)
      ]), gridMat.clone()));
    }
    // Axis lines (viewport look)
    var xAxis = new THREE.LineBasicMaterial({ color: 0xFF4444, transparent: true, opacity: 0.25 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-20, 0.02, 0), new THREE.Vector3(20, 0.02, 0)
    ]), xAxis));
    var zAxis = new THREE.LineBasicMaterial({ color: 0x4444FF, transparent: true, opacity: 0.25 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.02, -16), new THREE.Vector3(0, 0.02, 16)
    ]), zAxis));
    return g;
  }

  // Wireframe + solid foundation (rectangular footprint)
  function buildProcFoundation() {
    var g = new THREE.Group();
    var wireMat = new THREE.LineBasicMaterial({ color: 0x00CC66, transparent: true, opacity: 0.5 });
    var X0 = -MW / 2, X1 = MW / 2, Z0 = -MD / 2, Z1 = MD / 2;

    // Rectangular footprint wireframe outline
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(X0, 0.05, Z0), new THREE.Vector3(X1, 0.05, Z0),
      new THREE.Vector3(X1, 0.05, Z1), new THREE.Vector3(X0, 0.05, Z1),
      new THREE.Vector3(X0, 0.05, Z0)
    ]), wireMat));

    // Solid slab (hidden initially, for later phase)
    var slabMat = mat(0xDEB887, 0.75); // warm wood tone floor
    slabMat.transparent = true; slabMat.opacity = 0;
    var main = box(MW, 0.5, MD, slabMat);
    main.position.set(0, -0.25, 0); g.add(main);

    g.userData.wireMat = wireMat;
    g.userData.slabMeshes = [main];
    return g;
  }

  // Walls: dual wireframe + solid versions — modern luxury with lots of glass
  function buildProcWalls() {
    var g = new THREE.Group();
    var X0 = -MW / 2, X1 = MW / 2, Z0 = -MD / 2, Z1 = MD / 2;

    // === Wireframe walls (green wireframe) ===
    var wireWalls = new THREE.Group();
    var wireMat = new THREE.LineBasicMaterial({ color: 0x00CC66, transparent: true, opacity: 0.5 });

    function wireBox(cx, cy, cz, hw, hh, hd) {
      var pts = [];
      var bx0 = cx - hw, bx1 = cx + hw, by0 = cy - hh, by1 = cy + hh, bz0 = cz - hd, bz1 = cz + hd;
      pts.push(new THREE.Vector3(bx0,by0,bz0), new THREE.Vector3(bx1,by0,bz0));
      pts.push(new THREE.Vector3(bx1,by0,bz0), new THREE.Vector3(bx1,by0,bz1));
      pts.push(new THREE.Vector3(bx1,by0,bz1), new THREE.Vector3(bx0,by0,bz1));
      pts.push(new THREE.Vector3(bx0,by0,bz1), new THREE.Vector3(bx0,by0,bz0));
      pts.push(new THREE.Vector3(bx0,by1,bz0), new THREE.Vector3(bx1,by1,bz0));
      pts.push(new THREE.Vector3(bx1,by1,bz0), new THREE.Vector3(bx1,by1,bz1));
      pts.push(new THREE.Vector3(bx1,by1,bz1), new THREE.Vector3(bx0,by1,bz1));
      pts.push(new THREE.Vector3(bx0,by1,bz1), new THREE.Vector3(bx0,by1,bz0));
      pts.push(new THREE.Vector3(bx0,by0,bz0), new THREE.Vector3(bx0,by1,bz0));
      pts.push(new THREE.Vector3(bx1,by0,bz0), new THREE.Vector3(bx1,by1,bz0));
      pts.push(new THREE.Vector3(bx1,by0,bz1), new THREE.Vector3(bx1,by1,bz1));
      pts.push(new THREE.Vector3(bx0,by0,bz1), new THREE.Vector3(bx0,by1,bz1));
      return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), wireMat.clone());
    }

    // Front wall
    wireWalls.add(wireBox(0, WH / 2, Z0, MW / 2, WH / 2, WT / 2));
    // Back wall (wireframe includes it for modeling phase)
    wireWalls.add(wireBox(0, WH / 2, Z1, MW / 2, WH / 2, WT / 2));
    // Left wall
    wireWalls.add(wireBox(X0, WH / 2, 0, WT / 2, WH / 2, MD / 2));
    // Right wall (kept as wireframe outline but will be translucent solid)
    wireWalls.add(wireBox(X1, WH / 2, 0, WT / 2, WH / 2, MD / 2));
    g.add(wireWalls);

    // === Solid walls (hidden initially) — NO back wall for cutaway ===
    var solidWalls = new THREE.Group();
    var extMat = mat(0xF5F5F5, 0.9);
    extMat.transparent = true; extMat.opacity = 0.12; extMat.side = THREE.DoubleSide;

    // Front wall (south, z = Z0) — large floor-to-ceiling windows + clerestory
    var frontWallGroup = new THREE.Group();
    buildWallSegments(frontWallGroup, X0, X1, Z0, [
      { x: -6, y: 0.3, w: 3, h: 7 },     // large floor-to-ceiling left
      { x: -1.5, y: 0.3, w: 3, h: 7 },   // large floor-to-ceiling center-left
      { x: 3, y: 0.3, w: 3, h: 7 },      // large floor-to-ceiling center-right
      { x: 7.5, y: 6.5, w: 2.5, h: 2 },  // clerestory right
    ], extMat.clone(), 'z');
    solidWalls.add(frontWallGroup);

    // NO back wall (north, z = Z1) — REMOVED for cutaway view

    // Left wall (west, x = X0) — sliding glass doors + clerestory
    var leftWallGroup = new THREE.Group();
    buildWallSegments(leftWallGroup, Z0, Z1, X0, [
      { x: -2, y: 0.3, w: 6, h: 7 },     // large sliding glass door
      { x: 4, y: 6.5, w: 2.5, h: 2 },    // clerestory
    ], extMat.clone(), 'x');
    solidWalls.add(leftWallGroup);

    // Right wall (east, x = X1) — translucent solid, no windows (cutaway view)
    var rightWallMat = extMat.clone();
    rightWallMat.userData = { isTranslucentWall: true };
    var rightWallPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(MD, WH),
      rightWallMat
    );
    rightWallPlane.position.set(X1, WH / 2, 0);
    rightWallPlane.rotation.y = -Math.PI / 2;
    rightWallPlane.castShadow = true; rightWallPlane.receiveShadow = true;
    solidWalls.add(rightWallPlane);

    // Corner posts
    addCornerPost(solidWalls, X0, Z0, extMat.clone());
    addCornerPost(solidWalls, X1, Z0, extMat.clone());
    addCornerPost(solidWalls, X0, Z1, extMat.clone());
    addCornerPost(solidWalls, X1, Z1, extMat.clone());

    // Make all solid wall meshes transparent
    solidWalls.traverse(function(obj) {
      if (obj.isMesh && obj.material && !obj.material.transparent) {
        obj.material = obj.material.clone();
        obj.material.transparent = true;
        obj.material.opacity = 0;
      }
    });

    g.add(solidWalls);

    g.userData.wireWalls = wireWalls;
    g.userData.solidWalls = solidWalls;
    g.userData.wireMat = wireMat;
    return g;
  }

  // Roof: modern flat with slight overhang (dual wireframe + solid)
  function buildProcRoof() {
    var g = new THREE.Group();
    var X0 = -MW / 2, X1 = MW / 2, Z0 = -MD / 2, Z1 = MD / 2;
    var OVH = 1.2; // overhang

    // === Wireframe roof ===
    var wireRoof = new THREE.Group();
    var wireMat = new THREE.LineBasicMaterial({ color: 0x00CC66, transparent: true, opacity: 0.5 });
    // Flat roof outline with overhang
    wireRoof.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(X0 - OVH, WH, Z0 - OVH),
      new THREE.Vector3(X1 + OVH, WH, Z0 - OVH),
      new THREE.Vector3(X1 + OVH, WH, Z1 + OVH),
      new THREE.Vector3(X0 - OVH, WH, Z1 + OVH),
      new THREE.Vector3(X0 - OVH, WH, Z0 - OVH)
    ]), wireMat.clone()));
    // Roof thickness lines (bottom edge)
    wireRoof.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(X0 - OVH, WH - 0.3, Z0 - OVH),
      new THREE.Vector3(X1 + OVH, WH - 0.3, Z0 - OVH),
      new THREE.Vector3(X1 + OVH, WH - 0.3, Z1 + OVH),
      new THREE.Vector3(X0 - OVH, WH - 0.3, Z1 + OVH),
      new THREE.Vector3(X0 - OVH, WH - 0.3, Z0 - OVH)
    ]), wireMat.clone()));
    // Verticals at corners
    [X0 - OVH, X1 + OVH].forEach(function(rx) {
      [Z0 - OVH, Z1 + OVH].forEach(function(rz) {
        wireRoof.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(rx, WH - 0.3, rz), new THREE.Vector3(rx, WH, rz)
        ]), wireMat.clone()));
      });
    });
    g.add(wireRoof);

    // === Solid roof (flat slab with overhang) ===
    var solidRoof = new THREE.Group();
    // Semi-transparent for cutaway (camera looks from behind)
    var roofMatCutaway = new THREE.MeshStandardMaterial({
      color: 0x3A3530, roughness: 0.7, transparent: true, opacity: 0.25,
      side: THREE.DoubleSide
    });
    var roofSlab = box(MW + OVH * 2, 0.3, MD + OVH * 2, roofMatCutaway);
    roofSlab.position.set(0, WH - 0.15, 0);
    roofSlab.castShadow = true; roofSlab.receiveShadow = true;
    solidRoof.add(roofSlab);

    // Fascia edge (thin accent strip)
    var fasciaMat = mat(0xF5F0E8, 0.7);
    var fasciaF = box(MW + OVH * 2, 0.15, 0.12, fasciaMat);
    fasciaF.position.set(0, WH - 0.22, Z0 - OVH); solidRoof.add(fasciaF);
    var fasciaL = box(0.12, 0.15, MD + OVH * 2, fasciaMat);
    fasciaL.position.set(X0 - OVH, WH - 0.22, 0); solidRoof.add(fasciaL);
    var fasciaR = box(0.12, 0.15, MD + OVH * 2, fasciaMat);
    fasciaR.position.set(X1 + OVH, WH - 0.22, 0); solidRoof.add(fasciaR);

    solidRoof.visible = false;
    g.add(solidRoof);

    g.userData.wireRoof = wireRoof;
    g.userData.solidRoof = solidRoof;
    g.userData.wireMat = wireMat;
    return g;
  }

  // Windows: wireframe outlines that become glass panes with proper frames
  function buildProcWindows() {
    var g = new THREE.Group();
    var X0 = -MW / 2, X1 = MW / 2, Z0 = -MD / 2, Z1 = MD / 2;

    // === Wireframe windows ===
    var wireWin = new THREE.Group();
    var wireMat = new THREE.LineBasicMaterial({ color: 0x00CC66, transparent: true, opacity: 0.5 });

    // Helper: wireframe rectangle
    function wireRect(x, y, z, w, h, rotY) {
      var hw = w / 2, hh = h / 2;
      var pts = [
        new THREE.Vector3(-hw, -hh, 0), new THREE.Vector3(hw, -hh, 0),
        new THREE.Vector3(hw, hh, 0), new THREE.Vector3(-hw, hh, 0),
        new THREE.Vector3(-hw, -hh, 0)
      ];
      var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat.clone());
      line.position.set(x, y + h / 2, z);
      if (rotY) line.rotation.y = rotY;
      return line;
    }

    // Front floor-to-ceiling windows
    wireWin.add(wireRect(-6, 0.3, Z0 - 0.05, 3, 7, 0));
    wireWin.add(wireRect(-1.5, 0.3, Z0 - 0.05, 3, 7, 0));
    wireWin.add(wireRect(3, 0.3, Z0 - 0.05, 3, 7, 0));
    // Front clerestory
    wireWin.add(wireRect(7.5, 6.5, Z0 - 0.05, 2.5, 2, 0));
    // Left sliding glass door
    wireWin.add(wireRect(X0 - 0.05, 0.3, -2, 6, 7, Math.PI / 2));
    // Left clerestory
    wireWin.add(wireRect(X0 - 0.05, 6.5, 4, 2.5, 2, Math.PI / 2));
    // (Right wall windows removed for cutaway view)
    g.add(wireWin);

    // === Solid glass panes + frames (hidden initially) ===
    var solidWin = new THREE.Group();
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, transparent: true, opacity: 0,
      side: THREE.DoubleSide, envMapIntensity: 1.5
    });
    var frameMat = mat(0x2A2520, 0.4, 0.2);
    frameMat.transparent = true; frameMat.opacity = 0;

    // Helper: frame (4 pieces) + mullion + glass pane
    function addSolidWindow(x, y, z, w, h, rotY) {
      var fg = new THREE.Group();
      var fTop = box(w + 0.3, 0.12, 0.12, frameMat.clone());
      fTop.position.set(0, h / 2 + 0.06, 0); fg.add(fTop);
      var fBot = box(w + 0.3, 0.12, 0.12, frameMat.clone());
      fBot.position.set(0, -h / 2 - 0.06, 0); fg.add(fBot);
      var fL = box(0.12, h + 0.24, 0.12, frameMat.clone());
      fL.position.set(-w / 2 - 0.06, 0, 0); fg.add(fL);
      var fR = box(0.12, h + 0.24, 0.12, frameMat.clone());
      fR.position.set(w / 2 + 0.06, 0, 0); fg.add(fR);
      // Mullion (vertical center)
      var mullion = box(0.06, h, 0.06, frameMat.clone());
      fg.add(mullion);
      // Glass
      var glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat.clone());
      fg.add(glass);
      fg.position.set(x, y + h / 2, z);
      if (rotY) fg.rotation.y = rotY;
      solidWin.add(fg);
    }

    // Helper: sliding door frame + double glass
    function addSlidingDoor(x, y, z, w, h, rotY) {
      var dg = new THREE.Group();
      // Outer frame
      var fTop = box(w + 0.4, 0.15, 0.15, frameMat.clone());
      fTop.position.set(0, h / 2 + 0.075, 0); dg.add(fTop);
      var fBot = box(w + 0.4, 0.15, 0.15, frameMat.clone());
      fBot.position.set(0, -h / 2 - 0.075, 0); dg.add(fBot);
      var fL = box(0.15, h + 0.3, 0.15, frameMat.clone());
      fL.position.set(-w / 2 - 0.075, 0, 0); dg.add(fL);
      var fR = box(0.15, h + 0.3, 0.15, frameMat.clone());
      fR.position.set(w / 2 + 0.075, 0, 0); dg.add(fR);
      // Center divider (sliding track)
      var divider = box(0.1, h, 0.1, frameMat.clone());
      dg.add(divider);
      // Two glass panels
      var glassL = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.1, h - 0.1), glassMat.clone());
      glassL.position.set(-w / 4, 0, 0); dg.add(glassL);
      var glassR = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.1, h - 0.1), glassMat.clone());
      glassR.position.set(w / 4, 0, 0); dg.add(glassR);
      dg.position.set(x, y + h / 2, z);
      if (rotY) dg.rotation.y = rotY;
      solidWin.add(dg);
    }

    // Front floor-to-ceiling windows
    addSolidWindow(-6, 0.3, Z0 - 0.05, 3, 7, 0);
    addSolidWindow(-1.5, 0.3, Z0 - 0.05, 3, 7, 0);
    addSolidWindow(3, 0.3, Z0 - 0.05, 3, 7, 0);
    // Front clerestory
    addSolidWindow(7.5, 6.5, Z0 - 0.05, 2.5, 2, 0);
    // Left sliding glass doors (6w x 7h)
    addSlidingDoor(X0 - 0.05, 0.3, -2, 6, 7, Math.PI / 2);
    // Left clerestory
    addSolidWindow(X0 - 0.05, 6.5, 4, 2.5, 2, Math.PI / 2);
    // (Right wall windows removed for cutaway view)
    g.add(solidWin);

    g.userData.wireWin = wireWin;
    g.userData.solidWin = solidWin;
    g.userData.wireMat = wireMat;
    return g;
  }

  // Interior: low-LOD zone wireframes + high-LOD detailed solid furniture + point lights

  // Wireframe box helper for lowLOD zone outlines
  function interiorWireBox(cx, cy, cz, hw, hh, hd, lineMat) {
    var pts = [];
    var x0 = cx - hw, x1 = cx + hw, y0 = cy - hh, y1 = cy + hh, z0 = cz - hd, z1 = cz + hd;
    // Bottom face
    pts.push(new THREE.Vector3(x0,y0,z0), new THREE.Vector3(x1,y0,z0));
    pts.push(new THREE.Vector3(x1,y0,z0), new THREE.Vector3(x1,y0,z1));
    pts.push(new THREE.Vector3(x1,y0,z1), new THREE.Vector3(x0,y0,z1));
    pts.push(new THREE.Vector3(x0,y0,z1), new THREE.Vector3(x0,y0,z0));
    // Top face
    pts.push(new THREE.Vector3(x0,y1,z0), new THREE.Vector3(x1,y1,z0));
    pts.push(new THREE.Vector3(x1,y1,z0), new THREE.Vector3(x1,y1,z1));
    pts.push(new THREE.Vector3(x1,y1,z1), new THREE.Vector3(x0,y1,z1));
    pts.push(new THREE.Vector3(x0,y1,z1), new THREE.Vector3(x0,y1,z0));
    // Verticals
    pts.push(new THREE.Vector3(x0,y0,z0), new THREE.Vector3(x0,y1,z0));
    pts.push(new THREE.Vector3(x1,y0,z0), new THREE.Vector3(x1,y1,z0));
    pts.push(new THREE.Vector3(x1,y0,z1), new THREE.Vector3(x1,y1,z1));
    pts.push(new THREE.Vector3(x0,y0,z1), new THREE.Vector3(x0,y1,z1));
    return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineMat);
  }

  function buildProcInterior() {
    var g = new THREE.Group();
    var lights = [];
    var X0 = -MW / 2, X1 = MW / 2;
    // Inner wall boundaries: X0i=-8.5, X1i=8.5, Z0i=-5.5, Z1i=5.5
    var X0i = X0 + WT; // -8.5
    var X1i = X1 - WT; //  8.5
    var Z0i = -MD / 2 + WT; // -5.5
    var Z1i = MD / 2 - WT;  //  5.5

    // Low-LOD: simple zone wireframes (faint outlines — conceptual zones)
    // Zones: Living (left-front), Kitchen (right), Dining (right-back), Bedroom (left-back)
    var lowLOD = new THREE.Group();
    var zoneMats = {
      living: new THREE.LineBasicMaterial({ color: 0x4A5568, transparent: true, opacity: 0 }),
      kitchen: new THREE.LineBasicMaterial({ color: 0xE8E2D8, transparent: true, opacity: 0 }),
      dining: new THREE.LineBasicMaterial({ color: 0x6B4D3A, transparent: true, opacity: 0 }),
      bed: new THREE.LineBasicMaterial({ color: 0x8B7D6B, transparent: true, opacity: 0 })
    };
    // Living: center (-5, 0.6, -2), half-extents (2.5, 0.6, 2) => x: -7.5 to -2.5, z: -4 to 0 — INSIDE
    lowLOD.add(interiorWireBox(-5, 0.6, -2, 2.5, 0.6, 2, zoneMats.living));
    // Kitchen: center (5.5, 0.75, -1), half-extents (2.5, 0.75, 2) => x: 3 to 8, z: -3 to 1 — INSIDE
    lowLOD.add(interiorWireBox(5.5, 0.75, -1, 2.5, 0.75, 2, zoneMats.kitchen));
    // Dining: center (3, 0.6, 3.5), half-extents (2, 0.6, 1.5) => x: 1 to 5, z: 2 to 5 — INSIDE
    lowLOD.add(interiorWireBox(3, 0.6, 3.5, 2, 0.6, 1.5, zoneMats.dining));
    // Bedroom: center (-5, 0.4, 3.5), half-extents (2.5, 0.4, 1.5) => x: -7.5 to -2.5, z: 2 to 5 — INSIDE
    lowLOD.add(interiorWireBox(-5, 0.4, 3.5, 2.5, 0.4, 1.5, zoneMats.bed));
    g.add(lowLOD);

    // High-LOD: detailed solid furniture (revealed at final render step)
    var highLOD = new THREE.Group();

    // Materials — lighter, more visible colors
    var woodMat = mat(0x9B8565, 0.7);
    var darkWood = mat(0x6B5040, 0.75);
    var fabricMat = mat(0x8A9AAA, 0.82);   // light blue-gray — visible!
    var cushionMat = mat(0x7A8A98, 0.8);
    var quartzMat = mat(0xF0EDE8, 0.3, 0.05);
    var steelMat = mat(0xC0C0C0, 0.25, 0.15);
    var blackMat = mat(0x1A1A1A, 0.3, 0.05);
    var glassTMat = mat(0x88AACC, 0.15, 0.1);
    glassTMat.transparent = true; glassTMat.opacity = 0;
    var linenMat = mat(0xE8E0D5, 0.85);
    var pillowMat = mat(0xBEB5A8, 0.82);
    var cabinetMat = mat(0xF0ECE6, 0.6);

    // All highLOD materials start transparent (opacity 0) — revealed via scrubStep5
    [woodMat, darkWood, fabricMat, cushionMat, quartzMat, steelMat, blackMat,
     linenMat, pillowMat, cabinetMat].forEach(function(m) {
      m.transparent = true; m.opacity = 0;
    });

    // Helper: make a mat transparent
    function tMat(color, rough, metal) {
      var m = mat(color, rough || 0.7, metal || 0);
      m.transparent = true; m.opacity = 0;
      return m;
    }

    // ═══ LIVING ROOM (left-front: x: -8.5 to -1, z: -5.5 to 0) ═══
    // L-shaped sofa: main section along left wall, short section along front wall
    // Main: back at x=-8.3 (flush left wall), facing +x, z from -4 to 0 (length 4)
    var sofaX = X0i + 1.0; // center x = -7.5
    var sofaBase = box(1.6, 0.35, 3.5, fabricMat);
    sofaBase.position.set(sofaX, 0.18, -2.0); highLOD.add(sofaBase);
    // Back rest against left wall
    var sofaBack = box(0.25, 0.55, 3.5, cushionMat);
    sofaBack.position.set(X0i + 0.25, 0.63, -2.0); highLOD.add(sofaBack);
    // Left arm (at z=-3.75)
    var sofaArmL = box(1.6, 0.45, 0.2, fabricMat);
    sofaArmL.position.set(sofaX, 0.58, -3.85); highLOD.add(sofaArmL);
    // Cushions (2) on seat
    for (var sc = 0; sc < 2; sc++) {
      var cush = box(1.2, 0.12, 1.5, cushionMat);
      cush.position.set(sofaX + 0.1, 0.42, -2.8 + sc * 1.6); highLOD.add(cush);
    }
    // Throw pillow (red accent)
    var throwP = box(0.15, 0.5, 0.5, tMat(0xc8222a, 0.7));
    throwP.position.set(X0i + 0.5, 0.7, -3.3); throwP.rotation.x = 0.1; highLOD.add(throwP);

    // Coffee table in front of sofa
    var ctX = -5.2, ctZ = -2.0;
    var ctTop = box(1.0, 0.06, 2.0, glassTMat);
    ctTop.position.set(ctX, 0.45, ctZ); highLOD.add(ctTop);
    [[-0.4, -0.8], [0.4, -0.8], [-0.4, 0.8], [0.4, 0.8]].forEach(function(lp) {
      var leg = box(0.05, 0.42, 0.05, steelMat);
      leg.position.set(ctX + lp[0], 0.21, ctZ + lp[1]); highLOD.add(leg);
    });
    // Shelf under coffee table
    var ctShelf = box(0.8, 0.04, 1.7, darkWood);
    ctShelf.position.set(ctX, 0.14, ctZ); highLOD.add(ctShelf);

    // Area rug
    var rugMat = tMat(0x5A4838, 0.9);
    var rug = box(4, 0.02, 4.5, rugMat);
    rug.position.set(-5.8, 0.01, -2.0); highLOD.add(rug);

    // Floor lamp (right side of sofa area)
    var lampBase = box(0.3, 0.03, 0.3, steelMat);
    lampBase.position.set(-3.5, 0.015, -0.3); highLOD.add(lampBase);
    var lampPole = box(0.04, 1.6, 0.04, steelMat);
    lampPole.position.set(-3.5, 0.83, -0.3); highLOD.add(lampPole);
    var lampShade = box(0.5, 0.35, 0.5, tMat(0xF0E8D8, 0.9));
    lampShade.position.set(-3.5, 1.8, -0.3); highLOD.add(lampShade);

    // ═══ KITCHEN (right side: x: 3 to 8.5, z: -5.5 to 0) ═══
    // Counter along right wall (x=8.5 side)
    var counterCab = box(0.8, 0.9, 4.5, cabinetMat);
    counterCab.position.set(X1i - 0.4, 0.45, -2.5); highLOD.add(counterCab);
    var counterTop = box(0.9, 0.05, 4.7, quartzMat);
    counterTop.position.set(X1i - 0.4, 0.93, -2.5); highLOD.add(counterTop);

    // Kitchen island (centered in kitchen zone)
    var islandBase = box(2.8, 0.9, 1.2, cabinetMat);
    islandBase.position.set(5.5, 0.45, -2.5); highLOD.add(islandBase);
    var islandTop = box(3.0, 0.06, 1.4, quartzMat);
    islandTop.position.set(5.5, 0.93, -2.5); highLOD.add(islandTop);

    // Bar stools (3) in front of island (-z side)
    for (var bs = 0; bs < 3; bs++) {
      var stX = 4.5 + bs * 0.9;
      var stSeat = box(0.4, 0.05, 0.4, tMat(0x3A3A3A, 0.6));
      stSeat.position.set(stX, 0.72, -3.7); highLOD.add(stSeat);
      var stLeg = box(0.04, 0.7, 0.04, steelMat);
      stLeg.position.set(stX, 0.35, -3.7); highLOD.add(stLeg);
      var stFoot = box(0.3, 0.025, 0.3, steelMat);
      stFoot.position.set(stX, 0.012, -3.7); highLOD.add(stFoot);
    }

    // Fridge against right wall, near front (low z)
    var fridgeBody = box(1.0, 2.0, 0.8, steelMat);
    fridgeBody.position.set(X1i - 0.5, 1.0, Z0i + 0.6); highLOD.add(fridgeBody);
    var fridgeHandle = box(0.04, 0.5, 0.06, tMat(0x888888, 0.3, 0.2));
    fridgeHandle.position.set(X1i - 0.15, 1.2, Z0i + 0.18); highLOD.add(fridgeHandle);

    // Range/stove next to counter
    var rangeBody = box(0.8, 0.9, 0.7, tMat(0x404040, 0.4));
    rangeBody.position.set(X1i - 0.4, 0.45, -0.2); highLOD.add(rangeBody);
    var rangeTop = box(0.8, 0.04, 0.7, blackMat);
    rangeTop.position.set(X1i - 0.4, 0.92, -0.2); highLOD.add(rangeTop);

    // ═══ DINING ROOM (center-back: x: 0 to 6, z: 1.5 to 5.5) ═══
    // Dining table
    var dtX = 3, dtZ = 3.5;
    var dtTop = box(3.0, 0.1, 1.8, woodMat);
    dtTop.position.set(dtX, 0.78, dtZ); highLOD.add(dtTop);
    // 4 tapered legs
    [[-1.2, -0.7], [1.2, -0.7], [-1.2, 0.7], [1.2, 0.7]].forEach(function(lp) {
      var tLeg = box(0.08, 0.73, 0.08, darkWood);
      tLeg.position.set(dtX + lp[0], 0.37, dtZ + lp[1]); highLOD.add(tLeg);
    });

    // Dining chairs (4) — small, light colored, properly facing table
    var dChairPositions = [
      { x: dtX - 1.0, z: dtZ - 1.3, faceZ: 1 },   // front-left, facing +z (toward table)
      { x: dtX + 1.0, z: dtZ - 1.3, faceZ: 1 },   // front-right
      { x: dtX - 1.0, z: dtZ + 1.3, faceZ: -1 },  // back-left, facing -z (toward table)
      { x: dtX + 1.0, z: dtZ + 1.3, faceZ: -1 },  // back-right
    ];
    dChairPositions.forEach(function(ch) {
      var seat = box(0.45, 0.04, 0.45, tMat(0x9B8565, 0.7));
      seat.position.set(ch.x, 0.48, ch.z); highLOD.add(seat);
      var chairBack = box(0.45, 0.5, 0.05, tMat(0x9B8565, 0.7));
      chairBack.position.set(ch.x, 0.77, ch.z + ch.faceZ * -0.22); highLOD.add(chairBack);
      [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(function(lp) {
        var cLeg = box(0.035, 0.46, 0.035, darkWood);
        cLeg.position.set(ch.x + lp[0], 0.23, ch.z + lp[1]); highLOD.add(cLeg);
      });
    });

    // Pendant light over dining
    var pendRod = box(0.03, 1.2, 0.03, steelMat);
    pendRod.position.set(dtX, WH - 0.6, dtZ); highLOD.add(pendRod);
    var pendShade = box(0.6, 0.25, 0.6, tMat(0x222222, 0.5, 0.3));
    pendShade.position.set(dtX, WH - 1.35, dtZ); highLOD.add(pendShade);

    // ═══ BEDROOM (left-back: x: -8.5 to -1, z: 1.5 to 5.5) ═══
    // Bed: headboard against back wall (Z1i=5.5)
    var bedCX = -5;
    var bedW = 3.2, bedD = 3.5;
    var bedHeadZ = Z1i - 0.1;
    var bedCZ = bedHeadZ - bedD / 2;
    // Bed frame
    var bedFrame = box(bedW, 0.25, bedD, darkWood);
    bedFrame.position.set(bedCX, 0.13, bedCZ); highLOD.add(bedFrame);
    // Mattress
    var mattress = box(bedW - 0.15, 0.3, bedD - 0.15, linenMat);
    mattress.position.set(bedCX, 0.4, bedCZ); highLOD.add(mattress);
    // Headboard
    var headboard = box(bedW, 1.5, 0.1, tMat(0x6B5D4A, 0.7));
    headboard.position.set(bedCX, 1.0, bedHeadZ); highLOD.add(headboard);
    // Pillows (2)
    for (var pi = 0; pi < 2; pi++) {
      var pillow = box(1.2, 0.18, 0.5, pillowMat);
      pillow.position.set(bedCX - 0.7 + pi * 1.4, 0.64, bedCZ + bedD / 2 - 0.5); highLOD.add(pillow);
    }
    // Duvet
    var duvet = box(bedW - 0.3, 0.08, bedD * 0.5, tMat(0xD4CFC6, 0.8));
    duvet.position.set(bedCX, 0.6, bedCZ - bedD * 0.15); highLOD.add(duvet);

    // Nightstands flanking bed
    for (var ns = 0; ns < 2; ns++) {
      var nsX = ns === 0 ? bedCX - bedW / 2 - 0.5 : bedCX + bedW / 2 + 0.5;
      var nsBody = box(0.6, 0.55, 0.5, darkWood);
      nsBody.position.set(nsX, 0.28, bedHeadZ - 0.4); highLOD.add(nsBody);
      var nsTopP = box(0.65, 0.04, 0.55, woodMat);
      nsTopP.position.set(nsX, 0.58, bedHeadZ - 0.4); highLOD.add(nsTopP);
    }

    // Dresser against left wall — back flush to wall, front faces +x (toward bed)
    // Shallow along x (0.55 depth), long along z (1.6 width)
    var dresserBody = box(0.55, 0.85, 1.6, darkWood);
    dresserBody.position.set(X0i + 0.3, 0.43, 1.8); highLOD.add(dresserBody);
    var dresserTopP = box(0.6, 0.04, 1.7, woodMat);
    dresserTopP.position.set(X0i + 0.3, 0.88, 1.8); highLOD.add(dresserTopP);
    // Drawer faces on +x side (facing into room toward bed)
    for (var dd = 0; dd < 2; dd++) {
      var dFace = box(0.04, 0.35, 0.7, tMat(0x6B5D4A, 0.6));
      dFace.position.set(X0i + 0.56, 0.5, 1.8 - 0.4 + dd * 0.8); highLOD.add(dFace);
      var dHandle = box(0.04, 0.03, 0.15, steelMat);
      dHandle.position.set(X0i + 0.59, 0.5, 1.8 - 0.4 + dd * 0.8); highLOD.add(dHandle);
    }

    highLOD.visible = false;
    g.add(highLOD);

    // Point lights
    var lightDefs = [
      { x: -5, z: -2, color: 0xFFD699, intensity: 5 },
      { x: 5.5, z: -1, color: 0xFFF0D0, intensity: 4.5 },
      { x: 3,  z: 3.5, color: 0xFFD699, intensity: 4 },
      { x: -5, z: 3.5, color: 0xFFE4B5, intensity: 3.5 },
      { x: 0,  z: 0,  color: 0xFFF5E8, intensity: 3 },
    ];
    lightDefs.forEach(function(def) {
      var light = new THREE.PointLight(def.color, def.intensity, 18, 2);
      light.position.set(def.x, WH - 0.5, def.z);
      g.add(light);
      light.userData._maxIntensity = def.intensity;
      lights.push(light);
    });

    g.userData.lights = lights;
    g.userData.lowLOD = lowLOD;
    g.userData.highLOD = highLOD;
    g.userData.zoneMats = zoneMats;
    return g;
  }

  /* ── Process section lighting helper ── */
  function setProcLightsIntensity(fraction) {
    var lights = procGroups.interior && procGroups.interior.userData.lights;
    if (!lights) return;
    lights.forEach(function(light) {
      light.intensity = (light.userData._maxIntensity || 4) * fraction;
    });
  }

  function setProcGroupsVisible(visible) {
    Object.keys(procGroups).forEach(function(key) {
      procGroups[key].visible = visible;
    });
  }

  // Helper: set opacity on all wire children
  function setWireOpacity(group, opacity) {
    if (!group) return;
    group.children.forEach(function(child) {
      if (child.material) {
        child.material.opacity = opacity;
        child.material.needsUpdate = true;
      }
    });
  }

  // Helper: set opacity on all solid mesh children
  function setSolidOpacity(group, opacity) {
    if (!group) return;
    group.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        // Right wall stays translucent for cutaway view
        var maxOp = (obj.material.userData && obj.material.userData.isTranslucentWall) ? Math.min(opacity, 0.18) : opacity;
        obj.material.opacity = maxOp;
        obj.material.needsUpdate = true;
      }
    });
  }

  /* ═══ Process Visual Lifecycle (6 steps: wireframe to photorealistic) ═══ */

  // Step 0: Blank canvas — digital grid appears, isometric view
  function prepareStep0() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    setWireOpacity(procGroups.grid, 0);
    procCamera.position.set(20, 25, 20);
    procCamera.lookAt(0, 0, 0);
    setProcLightsIntensity(0);
    procMarkDirty();
  }
  function scrubStep0(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Grid lines fade in
    procGroups.grid.children.forEach(function(line) {
      if (line.material) {
        line.material.opacity = s * 0.15;
        line.material.needsUpdate = true;
      }
    });
    // Camera slight rotation
    procCamera.position.set(20 - 4 * s, 25 - 3 * s, 20 + 2 * s);
    procCamera.lookAt(0, 0, 0);
    procMarkDirty();
  }

  // Step 1: Modeling — wireframe foundation + walls appear line-by-line
  function prepareStep1() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.walls.visible = true;
    // Show only wire elements
    if (procGroups.walls.userData.wireWalls) procGroups.walls.userData.wireWalls.visible = true;
    if (procGroups.walls.userData.solidWalls) procGroups.walls.userData.solidWalls.visible = false;
    // Foundation wire only
    setWireOpacity(procGroups.foundation, 0);
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) { m.material.opacity = 0; });
    }
    setWireOpacity(procGroups.walls.userData.wireWalls, 0);
    procCamera.position.set(16, 22, 22);
    procCamera.lookAt(0, 2, 0);
    procMarkDirty();
  }
  function scrubStep1(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Foundation wireframe fades in
    if (procGroups.foundation.userData.wireMat) {
      procGroups.foundation.userData.wireMat.opacity = s * 0.6;
      procGroups.foundation.userData.wireMat.needsUpdate = true;
    }
    // Foundation outline lines
    procGroups.foundation.children.forEach(function(child) {
      if (child.isLine && child.material) {
        child.material.opacity = s * 0.6;
        child.material.needsUpdate = true;
      }
    });
    // Wall wireframes fade in progressively
    if (procGroups.walls.userData.wireWalls) {
      var wires = procGroups.walls.userData.wireWalls.children;
      wires.forEach(function(wire, i) {
        var start = i / wires.length * 0.5;
        var p = remap(s, start, start + 0.3);
        if (wire.material) {
          wire.material.opacity = p * 0.5;
          wire.material.needsUpdate = true;
        }
      });
    }
    // Camera orbits
    procCamera.position.set(16 + 6 * s, 22 - 2 * s, 22 - 4 * s);
    procCamera.lookAt(0, 2, 0);
    procMarkDirty();
  }

  // Step 2: Geometry — solid walls start appearing (wireframe still visible)
  function prepareStep2() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.walls.visible = true;
    // Show wire and solid
    if (procGroups.walls.userData.wireWalls) procGroups.walls.userData.wireWalls.visible = true;
    if (procGroups.walls.userData.solidWalls) procGroups.walls.userData.solidWalls.visible = true;
    setWireOpacity(procGroups.walls.userData.wireWalls, 0.5);
    setSolidOpacity(procGroups.walls.userData.solidWalls, 0);
    // Foundation slabs start showing
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) { m.material.opacity = 0; });
    }
    procCamera.position.set(22, 20, 18);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep2(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Foundation solid slabs fade in
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) {
        m.material.opacity = s * 0.8;
        m.material.needsUpdate = true;
      });
    }
    // Solid walls fade in (0 -> 0.6)
    setSolidOpacity(procGroups.walls.userData.solidWalls, s * 0.6);
    // Wireframe dims slightly
    setWireOpacity(procGroups.walls.userData.wireWalls, 0.5 - s * 0.15);
    // Camera transition
    procCamera.position.set(22 - 8 * s, 20 - 2 * s, 18 + 4 * s);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }

  // Step 3: Materials — solid fully opaque, wireframe fades, roof appears, warm tones
  function prepareStep3() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.walls.visible = true;
    procGroups.roof.visible = true;
    // Wire still visible but dimmed
    if (procGroups.walls.userData.wireWalls) procGroups.walls.userData.wireWalls.visible = true;
    if (procGroups.walls.userData.solidWalls) procGroups.walls.userData.solidWalls.visible = true;
    setWireOpacity(procGroups.walls.userData.wireWalls, 0.35);
    setSolidOpacity(procGroups.walls.userData.solidWalls, 0.6);
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) { m.material.opacity = 0.8; m.material.needsUpdate = true; });
    }
    // Roof wire visible, solid hidden
    if (procGroups.roof.userData.wireRoof) procGroups.roof.userData.wireRoof.visible = true;
    if (procGroups.roof.userData.solidRoof) { procGroups.roof.userData.solidRoof.visible = true; procGroups.roof.userData.solidRoof.traverse(function(o) { if (o.isMesh && o.material) { o.material.opacity = 0; o.material.needsUpdate = true; } }); }
    setWireOpacity(procGroups.roof.userData.wireRoof, 0.4);
    procCamera.position.set(14, 18, 22);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }
  function scrubStep3(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Wireframe fades away
    setWireOpacity(procGroups.walls.userData.wireWalls, 0.35 * (1 - s));
    setWireOpacity(procGroups.roof.userData.wireRoof, 0.4 * (1 - s));
    if (procGroups.foundation.children) {
      procGroups.foundation.children.forEach(function(child) {
        if (child.isLine && child.material) {
          child.material.opacity = 0.6 * (1 - s);
          child.material.needsUpdate = true;
        }
      });
    }
    // Solid walls fully opaque
    setSolidOpacity(procGroups.walls.userData.solidWalls, 0.6 + s * 0.4);
    // Foundation slabs full
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) { m.material.opacity = 0.8 + s * 0.2; m.material.needsUpdate = true; });
    }
    // Solid roof appears
    if (procGroups.roof.userData.solidRoof) {
      procGroups.roof.userData.solidRoof.traverse(function(o) {
        if (o.isMesh && o.material) {
          // Front slope stays semi-transparent
          var maxOp = o.material.color ? (o.material.side === THREE.DoubleSide ? 0.4 : 1) : 1;
          o.material.opacity = s * maxOp;
          o.material.needsUpdate = true;
        }
      });
    }
    // Camera sweep
    procCamera.position.set(14 + 4 * s, 18 - 2 * s, 22 - 4 * s);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }

  // Step 4: Lighting — windows gain glass, interior lights turn on, shadows
  function prepareStep4() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.walls.visible = true;
    procGroups.roof.visible = true;
    procGroups.windows.visible = true;
    procGroups.interior.visible = true;
    // Wire hidden, solid full
    if (procGroups.walls.userData.wireWalls) procGroups.walls.userData.wireWalls.visible = false;
    if (procGroups.walls.userData.solidWalls) { procGroups.walls.userData.solidWalls.visible = true; setSolidOpacity(procGroups.walls.userData.solidWalls, 1); }
    if (procGroups.roof.userData.wireRoof) procGroups.roof.userData.wireRoof.visible = false;
    if (procGroups.roof.userData.solidRoof) procGroups.roof.userData.solidRoof.visible = true;
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) { m.material.opacity = 1; m.material.needsUpdate = true; });
    }
    // Windows: wire hidden, solid starting transparent
    if (procGroups.windows.userData.wireWin) procGroups.windows.userData.wireWin.visible = false;
    if (procGroups.windows.userData.solidWin) {
      procGroups.windows.userData.solidWin.visible = true;
      setSolidOpacity(procGroups.windows.userData.solidWin, 0);
    }
    // Interior: low LOD visible, high LOD hidden
    if (procGroups.interior.userData.lowLOD) {
      procGroups.interior.userData.lowLOD.visible = true;
      var zm = procGroups.interior.userData.zoneMats;
      if (zm) Object.keys(zm).forEach(function(k) { zm[k].opacity = 0.8; zm[k].needsUpdate = true; });
    }
    if (procGroups.interior.userData.highLOD) procGroups.interior.userData.highLOD.visible = false;
    setProcLightsIntensity(0);
    procCamera.position.set(18, 16, 18);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep4(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Glass panes fade in (0-50%)
    var glassP = remap(t, 0, 0.5);
    if (procGroups.windows.userData.solidWin) {
      procGroups.windows.userData.solidWin.traverse(function(obj) {
        if (obj.isMesh && obj.material) {
          obj.material.opacity = glassP * (obj.material.color.r > 0.4 ? 0.3 : 1);
          obj.material.needsUpdate = true;
        }
      });
    }
    // Lights turn on progressively (30-80%)
    var lightP = smoothstep(remap(t, 0.3, 0.8));
    setProcLightsIntensity(lightP);
    // Camera
    procCamera.position.set(18 - 4 * s, 16, 18 + 2 * s);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }

  // Step 5: Final render — full warm glow, golden hour, beauty shot
  function prepareStep5() {
    if (!procCamera) return;
    setProcGroupsVisible(true);
    // Ensure wire hidden, solid visible
    if (procGroups.walls.userData.wireWalls) procGroups.walls.userData.wireWalls.visible = false;
    if (procGroups.walls.userData.solidWalls) { procGroups.walls.userData.solidWalls.visible = true; setSolidOpacity(procGroups.walls.userData.solidWalls, 1); }
    if (procGroups.roof.userData.wireRoof) procGroups.roof.userData.wireRoof.visible = false;
    if (procGroups.roof.userData.solidRoof) procGroups.roof.userData.solidRoof.visible = true;
    if (procGroups.windows.userData.wireWin) procGroups.windows.userData.wireWin.visible = false;
    if (procGroups.windows.userData.solidWin) {
      procGroups.windows.userData.solidWin.visible = true;
      procGroups.windows.userData.solidWin.traverse(function(obj) {
        if (obj.isMesh && obj.material) {
          obj.material.opacity = obj.material.color.r > 0.4 ? 0.3 : 1;
          obj.material.needsUpdate = true;
        }
      });
    }
    if (procGroups.foundation.userData.slabMeshes) {
      procGroups.foundation.userData.slabMeshes.forEach(function(m) { m.material.opacity = 1; m.material.needsUpdate = true; });
    }
    // Switch to high-LOD interior
    if (procGroups.interior.userData.lowLOD) procGroups.interior.userData.lowLOD.visible = false;
    if (procGroups.interior.userData.highLOD) {
      procGroups.interior.userData.highLOD.visible = true;
      procGroups.interior.userData.highLOD.traverse(function(obj) {
        if (obj.isMesh && obj.material) { obj.material.opacity = 1; obj.material.needsUpdate = true; }
      });
    }
    setProcLightsIntensity(1);
    procCamera.position.set(14, 14, 20);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep5(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera sweeps to beauty shot angle
    procCamera.position.set(14 + 10 * s, 14 - 3 * s, 20 - 6 * s);
    procCamera.lookAt(0, 3, 0);
    // Boost lights for golden hour warmth
    setProcLightsIntensity(1 + 1.2 * s);
    // Window glass warms to golden
    if (procGroups.windows.userData.solidWin) {
      procGroups.windows.userData.solidWin.traverse(function(obj) {
        if (obj.isMesh && obj.material && obj.material.transparent) {
          obj.material.color.setRGB(
            0.529 + (1 - 0.529) * s,
            0.808 + (0.85 - 0.808) * s,
            0.922 + (0.4 - 0.922) * s
          );
          obj.material.opacity = 0.3 + 0.5 * s;
          obj.material.needsUpdate = true;
        }
      });
    }
    // Grid fades away for clean final render
    procGroups.grid.children.forEach(function(line) {
      if (line.material) {
        line.material.opacity = 0.15 * (1 - s);
        line.material.needsUpdate = true;
      }
    });
    procMarkDirty();
  }

  /* ── Visual lifecycle dispatch ── */
  function prepareVisual(step) {
    switch (step) {
      case 0: prepareStep0(); break;
      case 1: prepareStep1(); break;
      case 2: prepareStep2(); break;
      case 3: prepareStep3(); break;
      case 4: prepareStep4(); break;
      case 5: prepareStep5(); break;
    }
  }
  function scrubVisual(step, subP) {
    switch (step) {
      case 0: scrubStep0(subP); break;
      case 1: scrubStep1(subP); break;
      case 2: scrubStep2(subP); break;
      case 3: scrubStep3(subP); break;
      case 4: scrubStep4(subP); break;
      case 5: scrubStep5(subP); break;
    }
  }

  /* ── Nav dots + progress bar ── */
  function buildNavDots(navEl, count) {
    navEl.innerHTML = '';
    var counter = document.createElement('div');
    counter.className = 'sv-process-counter';
    var curr = document.createElement('span');
    curr.className = 'sv-process-counter-current';
    curr.textContent = '01';
    var sep = document.createElement('span');
    sep.className = 'sv-process-counter-sep';
    sep.textContent = '/';
    var tot = document.createElement('span');
    tot.className = 'sv-process-counter-total';
    tot.textContent = '0' + count;
    counter.appendChild(curr);
    counter.appendChild(sep);
    counter.appendChild(tot);
    navEl.appendChild(counter);

    var track = document.createElement('div');
    track.className = 'sv-process-track';
    var fill = document.createElement('div');
    fill.className = 'sv-process-fill';
    track.appendChild(fill);
    navEl.appendChild(track);
  }

  function updateNavDots(navEl, idx) {
    var curr = navEl.querySelector('.sv-process-counter-current');
    if (curr) curr.textContent = idx < 9 ? '0' + (idx + 1) : String(idx + 1);
  }
  function updateProgressBar(navEl, progress) {
    var fill = navEl.querySelector('.sv-process-fill');
    if (fill) fill.style.width = (progress * 100).toFixed(1) + '%';
  }

  /* ── Card transitions ── */
  var cardPositions = [
    { side: 'left', enterFrom: 'left' },
    { side: 'right', enterFrom: 'right' },
    { side: 'left', enterFrom: 'left' },
    { side: 'right', enterFrom: 'right' },
    { side: 'left', enterFrom: 'left' },
    { side: 'right', enterFrom: 'right' },
  ];

  function getCardOffset() {
    var el = document.querySelector('.sv-process-pinned');
    var cw = el ? el.clientWidth : window.innerWidth;
    var cardW = 420;
    var margin = Math.max(40, cw * 0.04);
    return (cw / 2) - (cardW / 2) - margin;
  }

  function getCardX(pos) {
    var offset = getCardOffset();
    if (pos.side === 'left') return -offset;
    if (pos.side === 'right') return offset;
    return 0;
  }

  function transitionToStep(cards, idx, navEl) {
    if (idx === procCurrentStep) return;
    var prevIdx = procCurrentStep;
    procCurrentStep = idx;

    var pos = cardPositions[idx];
    var targetX = getCardX(pos);

    cards.forEach(function(card, i) {
      if (i === idx) {
        var ch = card.children;
        for (var c = 0; c < ch.length; c++) {
          gsap.set(ch[c], { opacity: 0, y: 15 });
        }
        var enterX = targetX;
        if (pos.enterFrom === 'left') enterX -= 80;
        else if (pos.enterFrom === 'right') enterX += 80;

        gsap.set(card, { opacity: 0, xPercent: -50, yPercent: -50, x: enterX, y: 0, scale: 0.96 });
        gsap.to(card, { opacity: 1, x: targetX, y: 0, scale: 1, duration: 0.7, ease: 'expo.out', overwrite: true });

        for (var c = 0; c < ch.length; c++) {
          gsap.to(ch[c], { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.12 + c * 0.1 });
        }
      } else if (i === prevIdx) {
        var exitDir = i < idx ? -1 : 1;
        gsap.to(card, { opacity: 0, y: exitDir * 30, scale: 0.97, duration: 0.4, ease: 'power3.in', overwrite: true });
      } else {
        gsap.set(card, { opacity: 0, xPercent: -50, yPercent: -50 });
      }
    });

    updateNavDots(navEl, idx);
  }

  /* ═══ INIT PROCESS SECTION ═══ */
  function initProcessTimeline() {
    var section = document.getElementById('sv-process');
    if (!section) return;

    var pinned = section.querySelector('.sv-process-pinned');
    if (!pinned) {
      // Fallback: simple stagger if HTML hasn't been updated
      initProcessFallback();
      return;
    }

    var visualEl = section.querySelector('.sv-process-visual');
    var cardsWrap = section.querySelector('.sv-process-cards');
    var navEl = section.querySelector('.sv-process-nav');
    var cards = section.querySelectorAll('.sv-process-card');
    if (!cards.length) return;

    var totalSteps = cards.length;

    // Build nav
    if (navEl) buildNavDots(navEl, totalSteps);

    // Initialize cards
    var firstX = getCardX(cardPositions[0]);
    cards.forEach(function(card, i) {
      if (i === 0) {
        gsap.set(card, { opacity: 1, xPercent: -50, yPercent: -50, x: firstX, y: 0, scale: 1 });
      } else {
        gsap.set(card, { opacity: 0, xPercent: -50, yPercent: -50 });
      }
    });
    procCurrentStep = 0;

    // Create 3D scene (desktop only)
    if (!isMobileProc && typeof THREE !== 'undefined' && visualEl) {
      visualEl.style.backgroundColor = '#0B0E18';
      var canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
      visualEl.appendChild(canvas);
      createProcessScene(canvas);
      setProcGroupsVisible(false);
    }

    // Init first step visual
    procActiveVisual = 0;
    if (!isMobileProc) prepareVisual(0);

    if (!isMobileProc) {
      var stepFrac = 1 / (totalSteps - 1);

      ScrollTrigger.create({
        trigger: pinned,
        start: 'top top',
        end: '+=' + (window.innerHeight * totalSteps * 2),
        pin: true,
        scrub: 0.5,
        onUpdate: function(self) {
          var progress = self.progress;
          var step = Math.round(progress * (totalSteps - 1));
          step = Math.max(0, Math.min(totalSteps - 1, step));

          transitionToStep(cards, step, navEl);
          updateProgressBar(navEl, progress);

          // Sub-progress within each step
          var subP;
          if (step === 0) {
            var halfStep = 0.5 * stepFrac;
            subP = Math.max(0, Math.min(1, progress / halfStep));
          } else {
            var midpoint = (step - 0.5) * stepFrac;
            var snapPos = step * stepFrac;
            subP = Math.max(0, Math.min(1, (progress - midpoint) / (snapPos - midpoint)));
          }

          // Switch visual on step change
          if (step !== procActiveVisual) {
            prepareVisual(step);
            procActiveVisual = step;
          }
          scrubVisual(step, subP);
        }
      });
    } else {
      // Mobile: cards stack with simple fade-up
      cards.forEach(function(card, i) {
        gsap.set(card, { opacity: 1, position: 'relative', top: 'auto', left: 'auto',
          transform: 'none', xPercent: 0, yPercent: 0, x: 0, y: 0 });
        gsap.fromTo(card, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
      });
    }
  }

  // Fallback for old HTML structure
  function initProcessFallback() {
    var processSection = document.getElementById('sv-process');
    if (!processSection) return;
    var rows = Array.prototype.slice.call(processSection.querySelectorAll('[class*="process-row"]'));
    if (!rows.length) return;
    rows.forEach(function(row) { row.removeAttribute('data-animate'); });
    gsap.set(rows, { y: 30, opacity: 0 });
    gsap.to(rows, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: processSection, start: 'top 60%', once: true }
    });
    var dividers = Array.prototype.slice.call(processSection.querySelectorAll('[class*="process-divider"]'));
    gsap.set(dividers, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(dividers, {
      scaleX: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: processSection, start: 'top 55%', once: true }
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS — Enhanced text + sections
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* ── Section headings: word-stagger-elastic ── */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function(el) {
      el.removeAttribute('data-animate');
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
    });

    /* ── Approach highlights: stagger from right ── */
    gsap.utils.toArray('[class*="highlight"]').forEach(function(hl, i) {
      gsap.killTweensOf(hl);
      gsap.set(hl, { clearProps: 'all' });
      gsap.from(hl, {
        x: 50, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: hl, start: 'top 88%', once: true }
      });
    });

    /* ── Process rows: kill any existing tweens, force-reset, re-animate ── */
    gsap.utils.toArray('.sv-process-row').forEach(function(row, i) {
      row.removeAttribute('data-animate');
      gsap.killTweensOf(row);
      gsap.set(row, { clearProps: 'all' });
      gsap.fromTo(row,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: i * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 90%', once: true } }
      );
    });
    gsap.utils.toArray('.sv-process-divider').forEach(function(div) {
      div.removeAttribute('data-animate');
      gsap.killTweensOf(div);
      gsap.set(div, { clearProps: 'all' });
    });

    /* ── Fade-up elements (remaining ones not handled above) ── */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function(el) {
      el.removeAttribute('data-animate');
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'all' });
      gsap.fromTo(el,
        { y: 40, opacity: 0, filter: 'blur(3px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });

    /* ── Stat values: kill existing, force-reset, re-animate ── */
    gsap.utils.toArray('.sv-stat-value').forEach(function(stat) {
      gsap.killTweensOf(stat);
      gsap.set(stat, { clearProps: 'all' });
      gsap.fromTo(stat,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)',
          scrollTrigger: { trigger: stat, start: 'top 90%', once: true } }
      );
    });

    /* ── Stat labels: protect from text-splitting and scrambleDecode ── */
    gsap.utils.toArray('.sv-stat-label').forEach(function(label) {
      label.removeAttribute('data-animate');
      gsap.killTweensOf(label);
      gsap.set(label, { clearProps: 'all' });
      if (label.dataset.origText) {
        label.textContent = label.dataset.origText;
      }
      label.style.opacity = '0.55';
    });

    /* ── Restore stats grid class and force visible ── */
    document.querySelectorAll('.sv-statsblock[data-restore-class]').forEach(function(grid) {
      grid.classList.remove('sv-statsblock');
      grid.classList.add('sv-stats-grid');
      grid.removeAttribute('data-restore-class');
      grid.removeAttribute('data-animate');
      gsap.killTweensOf(grid);
      gsap.set(grid, { clearProps: 'all' });
    });

    /* ── Poll to protect stat labels from scrambleDecode for 2 seconds ── */
    var labelGuard = setInterval(function() {
      document.querySelectorAll('.sv-stat-label').forEach(function(label) {
        if (label.dataset.origText && label.textContent.trim() !== label.dataset.origText) {
          label.textContent = label.dataset.origText;
          label.style.opacity = '0.55';
        }
      });
    }, 50);
    setTimeout(function() { clearInterval(labelGuard); }, 2500);

    /* ── CTA section: entrance ── */
    gsap.utils.toArray('.av-cta').forEach(function(cta) {
      var heading = cta.querySelector('.av-cta-heading, [class*="cta-heading"]');
      var btns = cta.querySelector('.av-cta-btns, [class*="cta-btns"]');
      var subtitle = cta.querySelector('.av-cta-subtitle, [class*="cta-subtitle"]');

      if (subtitle) {
        gsap.killTweensOf(subtitle);
        gsap.set(subtitle, { clearProps: 'all' });
        gsap.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
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
          yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: cta, start: 'top 95%', once: true }
        });
      }
      if (btns) {
        gsap.killTweensOf(btns.children);
        gsap.set(btns.children, { clearProps: 'all' });
        gsap.fromTo(btns.children, { y: 30, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: cta, start: 'top 95%', once: true }
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function() {
    initHero();
    initTypesShowcase();
    initProcessTimeline();
    initScrollAnimations();
  });

})();
