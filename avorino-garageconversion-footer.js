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
     HERO — Solid 3D Garage → Modern Studio Apartment
     Scroll-pinned: old garage dissolves, modern living
     space materializes (like renovations page pattern)
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('sv-hero');
    if (!hero) return;
    var canvasWrap = document.getElementById('hero-canvas');
    if (!canvasWrap) return;

    /* ── Text entrance animations ── */
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
      gsap.to(scrollHint, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: 1 },
      });
    }

    /* ═══ Three.js Scene: Solid Garage → Modern Studio ═══ */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(3, 5, 14);
    camera.lookAt(0, 1.2, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasWrap.appendChild(renderer.domElement);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.25));
    var sunLight = new THREE.DirectionalLight(0xFFE0B0, 0.5);
    sunLight.position.set(8, 12, 10); sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    scene.add(sunLight);

    /* ── Shared helpers ── */
    var rW = 7, rD = 5, wH = 3.2;
    function hMat(color, rough, metal) {
      return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
    }
    function hBox(bw, bh, bd, material) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), material);
      m.castShadow = true; m.receiveShadow = true; return m;
    }
    function addTo(group, mesh, x, y, z) {
      mesh.position.set(x, y, z); group.add(mesh); return mesh;
    }

    /* ═══ OLD GARAGE — cluttered, concrete, dark ═══ */
    var oldGroup = new THREE.Group();
    var grayConc = hMat(0x9A9488, 0.95);
    var oldWall = hMat(0xC4B99E, 0.92); oldWall.side = THREE.DoubleSide;

    // Floor — stained concrete
    addTo(oldGroup, hBox(rW, 0.06, rD * 2, grayConc), 0, 0.03, 0);
    // Walls: back + left + right
    addTo(oldGroup, hBox(rW, wH, 0.18, oldWall), 0, wH / 2, -rD);
    addTo(oldGroup, hBox(0.18, wH, rD * 2, oldWall), -rW / 2, wH / 2, 0);
    addTo(oldGroup, hBox(0.18, wH, rD * 2, oldWall.clone()), rW / 2, wH / 2, 0);

    // Garage door (front, sectional panels)
    var doorMat = hMat(0x7A7060, 0.85);
    addTo(oldGroup, hBox(rW - 0.4, 3, 0.1, doorMat), 0, 1.5, rD);
    // Panel lines (4 horizontal)
    for (var dp = 1; dp <= 3; dp++) {
      addTo(oldGroup, hBox(rW - 0.5, 0.02, 0.12, hMat(0x666055, 0.9)), 0, dp * 0.75, rD + 0.01);
    }
    // Door handle
    addTo(oldGroup, hBox(0.4, 0.06, 0.06, hMat(0x555555, 0.4, 0.3)), 0, 1, rD + 0.08);

    // Car (boxy sedan — facing user, +z is front)
    var carBody = hMat(0x3A4550, 0.6, 0.1);
    addTo(oldGroup, hBox(1.8, 0.7, 3.6, carBody), 0, 0.5, 0.5);
    addTo(oldGroup, hBox(1.6, 0.5, 2.2, carBody), 0, 1.1, 0.3);
    // Wheels (thin along x, positioned at ±x sides, ±z front/back)
    var wheelMat = hMat(0x222222, 0.9);
    [[-0.75, -1.2], [-0.75, 1.2], [0.75, -1.2], [0.75, 1.2]].forEach(function(wp) {
      addTo(oldGroup, hBox(0.15, 0.4, 0.4, wheelMat), wp[0], 0.25, 0.5 + wp[1]);
    });
    // Headlights (front face, +z side)
    addTo(oldGroup, hBox(0.3, 0.15, 0.1, hMat(0xFFDD88, 0.3)), -0.5, 0.6, 2.35);
    addTo(oldGroup, hBox(0.3, 0.15, 0.1, hMat(0xFFDD88, 0.3)), 0.5, 0.6, 2.35);

    // Metal shelving unit (back wall)
    var shelfMat = hMat(0x6B6560, 0.7, 0.15);
    addTo(oldGroup, hBox(2.2, 2.2, 0.5, shelfMat), -2.2, 1.1, -rD + 0.4);
    // Shelf items (boxes)
    addTo(oldGroup, hBox(0.5, 0.35, 0.4, hMat(0x8B7355, 0.88)), -2.8, 1.6, -rD + 0.4);
    addTo(oldGroup, hBox(0.4, 0.25, 0.35, hMat(0x6B5D4A, 0.85)), -1.8, 1.6, -rD + 0.4);
    addTo(oldGroup, hBox(0.55, 0.3, 0.38, hMat(0x7A6B55, 0.9)), -2.4, 2.0, -rD + 0.4);

    // Workbench (right wall)
    addTo(oldGroup, hBox(0.5, 0.06, 2.5, hMat(0x8B7355, 0.85)), rW / 2 - 0.4, 0.85, -2);
    addTo(oldGroup, hBox(0.06, 0.82, 0.06, shelfMat), rW / 2 - 0.4, 0.41, -3.1);
    addTo(oldGroup, hBox(0.06, 0.82, 0.06, shelfMat), rW / 2 - 0.4, 0.41, -0.9);
    // Tools on workbench
    addTo(oldGroup, hBox(0.08, 0.25, 0.08, hMat(0xCC3333, 0.7)), rW / 2 - 0.4, 1.0, -2.5);
    addTo(oldGroup, hBox(0.3, 0.1, 0.15, hMat(0x888888, 0.5, 0.2)), rW / 2 - 0.4, 0.93, -1.5);

    // Oil stains on floor (dark patches)
    addTo(oldGroup, hBox(1.2, 0.005, 0.8, hMat(0x4A4540, 0.95)), -0.5, 0.065, 1);
    addTo(oldGroup, hBox(0.6, 0.005, 0.5, hMat(0x4A4540, 0.95)), 1.5, 0.065, -1);

    // Small window on back wall
    var oldFrameMat = hMat(0x6B5D4A, 0.8);
    var oldGlassMat = new THREE.MeshBasicMaterial({ color: 0x7CC4DD, side: THREE.DoubleSide });
    addTo(oldGroup, hBox(1.2, 0.8, 0.06, oldFrameMat), 2, 2.2, -rD + 0.12);
    var oGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.65), oldGlassMat);
    oGlass.userData.isGlass = true; oGlass.renderOrder = 999;
    addTo(oldGroup, oGlass, 2, 2.2, -rD + 0.14);

    // Bare bulb ceiling light
    addTo(oldGroup, hBox(0.03, 0.4, 0.03, hMat(0x333333, 0.5)), 0, wH - 0.2, 0);
    addTo(oldGroup, hBox(0.12, 0.12, 0.12, hMat(0xFFDD88, 0.3)), 0, wH - 0.45, 0);

    var oldLight = new THREE.PointLight(0xFFCC88, 1.5, 10, 2);
    oldLight.position.set(0, wH - 0.5, 0); oldGroup.add(oldLight);

    scene.add(oldGroup);

    /* ═══ NEW STUDIO — modern, bright, livable ═══ */
    var newGroup = new THREE.Group();
    var newWall = hMat(0xF5F2EE, 0.85); newWall.side = THREE.DoubleSide;
    var cabMat = hMat(0xF0ECE6, 0.55);
    var quartzMat = hMat(0xE8E2D8, 0.3, 0.08);
    var stainlessMat = hMat(0xC0C0C0, 0.2, 0.2);

    // Floor — warm oak laminate
    addTo(newGroup, hBox(rW, 0.06, rD * 2, hMat(0xDDD3BE, 0.55)), 0, 0.03, 0);

    // ── Exterior walls: back (split for window) + left + right ──
    addTo(newGroup, hBox(2.2, wH, 0.12, newWall), -2.4, wH / 2, -rD);
    addTo(newGroup, hBox(2.2, wH, 0.12, newWall.clone()), 2.4, wH / 2, -rD);
    addTo(newGroup, hBox(2.4, wH - 2.6, 0.12, newWall.clone()), 0, wH - (wH - 2.6) / 2, -rD);
    addTo(newGroup, hBox(0.12, wH, rD * 2, newWall), -rW / 2, wH / 2, 0);
    addTo(newGroup, hBox(0.12, wH, rD * 2, newWall.clone()), rW / 2, wH / 2, 0);

    // Back wall window (centered, 2.4 wide)
    var frameMat = hMat(0x1A1816, 0.4, 0.25);
    var glassMat = new THREE.MeshBasicMaterial({ color: 0x8EC8E8, side: THREE.DoubleSide });
    addTo(newGroup, hBox(2.5, 2.7, 0.14, frameMat), 0, 0.15 + 2.6 / 2, -rD);
    var bGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.5), glassMat);
    bGlass.userData.isGlass = true; bGlass.renderOrder = 999;
    addTo(newGroup, bGlass, 0, 0.15 + 2.6 / 2, -rD + 0.08);
    addTo(newGroup, hBox(0.04, 2.6, 0.14, frameMat), 0, 0.15 + 2.6 / 2, -rD);
    addTo(newGroup, hBox(2.4, 0.04, 0.14, frameMat), 0, 0.15 + 2.6 / 2, -rD);

    // Front — fully open for cutaway view (camera faces this side)
    addTo(newGroup, hBox(0.08, wH, 0.08, frameMat), -rW / 2, wH / 2, rD);
    addTo(newGroup, hBox(0.08, wH, 0.08, frameMat), rW / 2, wH / 2, rD);

    // ══════════════════════════════════════════════
    // INTERIOR PARTITION WALLS
    // Layout: Left half = Bedroom(back) + Bathroom(front)
    //         Right half = Kitchen(back) + Dining(mid) + Living(front)
    // ══════════════════════════════════════════════
    var partWall = hMat(0xF5F2EE, 0.85); partWall.side = THREE.DoubleSide;

    // Center divider wall (x=0, runs z=-5 to z=3.5, with ~1.2 doorway gap near z=0)
    addTo(newGroup, hBox(0.1, wH, 4.0, partWall), 0, wH / 2, -3);        // back section z=-5 to z=-1
    addTo(newGroup, hBox(0.1, wH, 4.5, partWall.clone()), 0, wH / 2, 2.75); // front section z=0.5 to z=5

    // Bedroom/Bathroom divider (z=-0.5, runs x=-3.5 to x=0, with ~0.8 door gap at x=-1)
    addTo(newGroup, hBox(2.0, wH, 0.1, partWall.clone()), -2.5, wH / 2, -0.5); // left section
    addTo(newGroup, hBox(0.4, wH, 0.1, partWall.clone()), -0.2, wH / 2, -0.5); // right section

    // Living room back wall (z=0.5) — split for doorway at x=1.2–2.2, TV on right section
    addTo(newGroup, hBox(1.1, wH, 0.1, partWall.clone()), 0.6, wH / 2, 0.5);   // left section x=0.05 to x=1.15
    addTo(newGroup, hBox(0.6, wH - 2.4, 0.1, partWall.clone()), 1.7, wH - (wH - 2.4) / 2, 0.5); // header above door
    addTo(newGroup, hBox(1.2, wH, 0.1, partWall.clone()), 2.9, wH / 2, 0.5);   // right section x=2.3 to x=3.5
    // Door frame
    addTo(newGroup, hBox(0.06, 2.4, 0.12, frameMat), 1.15, 1.2, 0.5);  // left jamb
    addTo(newGroup, hBox(0.06, 2.4, 0.12, frameMat), 2.25, 1.2, 0.5);  // right jamb
    addTo(newGroup, hBox(1.16, 0.06, 0.12, frameMat), 1.7, 2.43, 0.5); // header
    // Transparent door panel
    var doorGlass = new THREE.MeshBasicMaterial({ color: 0xCCDDEE, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
    var doorPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.3), doorGlass);
    doorPanel.userData.isGlass = true; doorPanel.renderOrder = 999;
    addTo(newGroup, doorPanel, 1.7, 1.2, 0.52);

    // ══════════════════════════════════════════════
    // BEDROOM (back-left: x=-3.5 to 0, z=-5 to -0.5)
    // ══════════════════════════════════════════════
    // Bed along left wall, headboard against back wall
    addTo(newGroup, hBox(1.8, 0.22, 2.6, hMat(0x5C4033, 0.75)), -2.5, 0.11, -3);
    addTo(newGroup, hBox(1.7, 0.18, 2.5, hMat(0xE8E0D5, 0.7)), -2.5, 0.31, -3);
    // Headboard against back wall
    addTo(newGroup, hBox(1.8, 0.8, 0.1, hMat(0x5C4033, 0.75)), -2.5, 0.7, -4.65);
    // Pillows
    addTo(newGroup, hBox(0.7, 0.12, 0.35, hMat(0xBEB5A8, 0.8)), -2.9, 0.48, -4.35);
    addTo(newGroup, hBox(0.7, 0.12, 0.35, hMat(0xBEB5A8, 0.8)), -2.1, 0.48, -4.35);
    // Duvet fold
    addTo(newGroup, hBox(1.6, 0.04, 1.2, hMat(0xD5CFC5, 0.75)), -2.5, 0.42, -2.2);
    // Nightstand (right side of bed)
    addTo(newGroup, hBox(0.4, 0.4, 0.4, cabMat), -1.4, 0.2, -4.3);
    // Area rug
    addTo(newGroup, hBox(2.5, 0.01, 3, hMat(0xC5B8A5, 0.92)), -2, 0.065, -2.8);

    // ══════════════════════════════════════════════
    // BATHROOM (front-left: x=-3.5 to 0, z=-0.5 to 5)
    // ══════════════════════════════════════════════
    // Tile floor
    addTo(newGroup, hBox(3.3, 0.01, 5, hMat(0xE0DDD8, 0.6)), -1.8, 0.065, 2.25);
    // Vanity along left wall (facing right, x=-3.5 side)
    addTo(newGroup, hBox(0.5, 0.7, 1.4, cabMat), -rW / 2 + 0.4, 0.35, 2.5);
    addTo(newGroup, hBox(0.55, 0.04, 1.45, quartzMat), -rW / 2 + 0.4, 0.72, 2.5);
    // Mirror above vanity (on left wall)
    addTo(newGroup, hBox(0.04, 0.8, 1.0, hMat(0xBBCCDD, 0.1, 0.3)), -rW / 2 + 0.14, 1.5, 2.5);
    // Toilet (against back partition wall at z=-0.5, facing front)
    addTo(newGroup, hBox(0.45, 0.4, 0.6, hMat(0xF8F8F8, 0.4)), -2.5, 0.2, 0.1);
    addTo(newGroup, hBox(0.4, 0.55, 0.08, hMat(0xF0F0F0, 0.45)), -2.5, 0.48, -0.15);
    // Shower area (back-right of bathroom, near z=4)
    // Glass shower partition
    var showerGlass = new THREE.MeshBasicMaterial({ color: 0xCCDDEE, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    var sGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.04, wH * 0.7), showerGlass);
    sGlass.rotation.y = Math.PI / 2;
    addTo(newGroup, sGlass, -1.2, wH * 0.35, 4);
    // Shower head
    addTo(newGroup, hBox(0.15, 0.15, 0.04, stainlessMat), -2.5, wH - 0.5, 4.7);
    addTo(newGroup, hBox(0.03, 0.5, 0.03, stainlessMat), -2.5, wH - 0.25, 4.7);

    // ══════════════════════════════════════════════
    // KITCHENETTE (back-right: x=0 to 3.5, z=-5 to -2)
    // ══════════════════════════════════════════════
    // Cabinets along back wall
    addTo(newGroup, hBox(2.8, 0.9, 0.5, cabMat), 1.8, 0.45, -rD + 0.38);
    addTo(newGroup, hBox(2.9, 0.04, 0.55, quartzMat), 1.8, 0.92, -rD + 0.38);
    // Floating shelves above counter
    addTo(newGroup, hBox(1.8, 0.04, 0.25, hMat(0xDED5C4, 0.5)), 1.8, 1.6, -rD + 0.22);
    addTo(newGroup, hBox(1.8, 0.04, 0.25, hMat(0xDED5C4, 0.5)), 1.8, 2.1, -rD + 0.22);
    // Mini fridge (right wall corner)
    addTo(newGroup, hBox(0.55, 1.5, 0.55, stainlessMat), rW / 2 - 0.45, 0.75, -rD + 0.45);
    addTo(newGroup, hBox(0.02, 0.5, 0.02, hMat(0x999999, 0.15, 0.3)), rW / 2 - 0.2, 1.0, -rD + 0.16);

    // ══════════════════════════════════════════════
    // DINING (center-right, in front of kitchen: x=0 to 3.5, z=-2 to 0.5)
    // ══════════════════════════════════════════════
    // Table (oriented lengthwise along z)
    addTo(newGroup, hBox(0.9, 0.05, 1.3, hMat(0x8B7355, 0.7)), 1.8, 0.78, -1.2);
    // Table legs
    [[-0.3, -0.5], [0.3, -0.5], [-0.3, 0.5], [0.3, 0.5]].forEach(function(tl) {
      addTo(newGroup, hBox(0.04, 0.75, 0.04, hMat(0x5C4033, 0.75)), 1.8 + tl[0], 0.375, -1.2 + tl[1]);
    });
    // 2 chairs (facing each other along x axis)
    // Chair left (x=1.0)
    addTo(newGroup, hBox(0.45, 0.05, 0.45, hMat(0x4A5568, 0.8)), 1.0, 0.48, -1.2);
    addTo(newGroup, hBox(0.05, 0.45, 0.45, hMat(0x4A5568, 0.8)), 0.78, 0.73, -1.2);
    // Chair right (x=2.6)
    addTo(newGroup, hBox(0.45, 0.05, 0.45, hMat(0x4A5568, 0.8)), 2.6, 0.48, -1.2);
    addTo(newGroup, hBox(0.05, 0.45, 0.45, hMat(0x4A5568, 0.8)), 2.82, 0.73, -1.2);

    // ══════════════════════════════════════════════
    // LIVING ROOM (front-right: x=0 to 3.5, z=0.5 to 5)
    // ══════════════════════════════════════════════
    // TV on right wall section (x=2.9 center, z=0.5, facing front/camera)
    addTo(newGroup, hBox(1.0, 0.7, 0.06, hMat(0x111111, 0.3, 0.1)), 2.9, 1.8, 0.58);
    // TV screen
    var screenMat = hMat(0x1A2030, 0.2, 0.05);
    addTo(newGroup, hBox(0.9, 0.6, 0.02, screenMat), 2.9, 1.8, 0.62);
    // Sofa facing TV (along z axis, at z=3)
    addTo(newGroup, hBox(2.6, 0.35, 0.85, hMat(0x8A9AAA, 0.8)), 1.75, 0.18, 3.2);
    // Sofa back
    addTo(newGroup, hBox(2.6, 0.4, 0.1, hMat(0x7A8A98, 0.8)), 1.75, 0.55, 3.6);
    // Throw pillows
    addTo(newGroup, hBox(0.35, 0.25, 0.08, hMat(0xc9a96e, 0.75)), 1.0, 0.44, 3.5);
    addTo(newGroup, hBox(0.35, 0.25, 0.08, hMat(0x9AACBA, 0.75)), 2.5, 0.44, 3.5);
    // Coffee table between sofa and TV
    var glassTblMat = new THREE.MeshStandardMaterial({ color: 0x99BBCC, roughness: 0.08, transparent: true, opacity: 0.35 });
    addTo(newGroup, hBox(1.2, 0.04, 0.6, glassTblMat), 1.75, 0.38, 1.8);
    addTo(newGroup, hBox(0.03, 0.35, 0.03, stainlessMat), 1.2, 0.17, 1.55);
    addTo(newGroup, hBox(0.03, 0.35, 0.03, stainlessMat), 2.3, 0.17, 1.55);
    addTo(newGroup, hBox(0.03, 0.35, 0.03, stainlessMat), 1.2, 0.17, 2.05);
    addTo(newGroup, hBox(0.03, 0.35, 0.03, stainlessMat), 2.3, 0.17, 2.05);
    // Area rug
    addTo(newGroup, hBox(3, 0.01, 3.5, hMat(0xC5B8A5, 0.92)), 1.75, 0.065, 2.5);

    // ── Modern pendant lights ──
    [[-2, -3], [1.8, -1.2], [1.75, 2.5]].forEach(function(lp) {
      addTo(newGroup, hBox(0.015, 0.5, 0.015, stainlessMat), lp[0], wH - 0.25, lp[1]);
      addTo(newGroup, hBox(0.18, 0.2, 0.18, hMat(0x222222, 0.4, 0.3)), lp[0], wH - 0.55, lp[1]);
    });

    // Warm interior lights
    var newLight1 = new THREE.PointLight(0xFFF5E8, 2, 8, 2);
    newLight1.position.set(-2, wH - 0.2, -3); newGroup.add(newLight1);
    var newLight2 = new THREE.PointLight(0xFFF5E8, 1.5, 8, 2);
    newLight2.position.set(1.75, wH - 0.2, 2.5); newGroup.add(newLight2);
    var newLight3 = new THREE.PointLight(0xFFF5E8, 1, 6, 2);
    newLight3.position.set(-2, wH - 0.2, 2); newGroup.add(newLight3);

    newGroup.visible = false;
    scene.add(newGroup);

    /* ── Blueprint grid ── */
    var gridGroup = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0 });
    for (var gi = -10; gi <= 10; gi += 2) {
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(gi, 0.01, -10), new THREE.Vector3(gi, 0.01, 10)]), gridMat.clone()));
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-10, 0.01, gi), new THREE.Vector3(10, 0.01, gi)]), gridMat.clone()));
    }
    scene.add(gridGroup);

    /* ── Entrance animations ── */
    gridGroup.children.forEach(function(l) { gsap.to(l.material, { opacity: 0.05, duration: 1.5, delay: 0.3, ease: 'power2.out' }); });
    oldGroup.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material = obj.material.clone();
        obj.material.transparent = true;
        var targetOp = obj.userData.isGlass ? 1 : 1;
        obj.material.opacity = 0;
        gsap.to(obj.material, { opacity: targetOp, duration: 1.2, delay: 0.5, ease: 'power2.out' });
      }
    });
    newGroup.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material = obj.material.clone();
        obj.material.transparent = true;
        obj.material.opacity = 0;
        if (obj.userData.isGlass) obj.material._isGlass = true;
      }
    });
    gsap.to(oldLight, { intensity: 1.5, duration: 1.5, delay: 0.8 });

    /* ═══ SCROLL: Old garage dissolves → modern studio reveals ═══ */
    var scrollProgress = 0;

    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        scrollProgress = self.progress;

        // Old garage fade
        var oldFade = scrollProgress < 0.3 ? 1 : Math.max(0, 1 - (scrollProgress - 0.3) / 0.3);
        oldGroup.traverse(function(obj) {
          if (obj.isMesh && obj.material) obj.material.opacity = oldFade;
        });
        oldLight.intensity = 1.5 * oldFade;
        oldGroup.visible = oldFade > 0;

        // New studio fade in
        var newP = Math.max(0, Math.min(1, (scrollProgress - 0.45) / 0.4));
        newGroup.visible = newP > 0;
        newGroup.traverse(function(obj) {
          if (obj.isMesh && obj.material) obj.material.opacity = newP;
        });
        newLight1.intensity = 3 * newP;
        newLight2.intensity = 2 * newP;
        newLight3.intensity = 1.5 * newP;

        // Grid pulse
        gridGroup.children.forEach(function(l) {
          l.material.opacity = 0.04 + 0.03 * Math.sin(scrollProgress * Math.PI);
        });

        // Sun warms with new studio
        sunLight.intensity = 0.8 + newP * 0.6;
      }
    });

    /* ── Mouse parallax + render loop ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var baseAngle = 0;
    function animate() {
      requestAnimationFrame(animate);
      baseAngle += 0.0006;

      var camDist = 14 - scrollProgress * 3;
      var camAngle = baseAngle + mouseX * 0.15;
      camera.position.set(
        Math.sin(camAngle) * camDist * 0.15 + mouseX * 0.8,
        2.5 + mouseY * 0.3 + scrollProgress * 0.8,
        camDist + Math.cos(camAngle) * 0.5
      );
      camera.lookAt(0, 1.6, 0);

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
     PROCESS SECTION — Card Layout with GSAP
     ═══════════════════════════════════════════════ */

  function initProcessCards() {
    var pinned = document.querySelector('.sv-process-pinned');

    /* ── If no pinned container, build carousel from existing rows ── */
    if (!pinned) {
      var section = document.getElementById('sv-process');
      var rows = section ? Array.prototype.slice.call(section.querySelectorAll('.sv-process-row')) : [];
      if (!rows.length) return;

      /* Create carousel container */
      pinned = document.createElement('div');
      pinned.className = 'sv-process-pinned';
      var track = document.createElement('div');
      track.className = 'sv-process-cards';
      var nav = document.createElement('div');
      nav.className = 'sv-process-nav';

      /* Transform each row into a card */
      rows.forEach(function(row) {
        var num = row.querySelector('.sv-process-num');
        var title = row.querySelector('.sv-process-title');
        var desc = row.querySelector('.sv-process-desc');
        var card = document.createElement('div');
        card.className = 'sv-process-card';
        var cardNum = document.createElement('div');
        cardNum.className = 'sv-process-card-num';
        cardNum.textContent = num ? 'STEP ' + num.textContent.trim() : '';
        var cardTitle = document.createElement('h3');
        cardTitle.className = 'sv-process-card-title';
        cardTitle.textContent = title ? title.textContent.trim() : '';
        var cardDesc = document.createElement('p');
        cardDesc.className = 'sv-process-card-desc';
        cardDesc.textContent = desc ? desc.textContent.trim() : '';
        card.appendChild(cardNum);
        card.appendChild(cardTitle);
        card.appendChild(cardDesc);
        track.appendChild(card);
      });

      pinned.appendChild(track);
      pinned.appendChild(nav);

      /* Remove old rows and dividers, insert carousel after header */
      var header = section.querySelector('.sv-process-header');
      var toRemove = Array.prototype.slice.call(section.querySelectorAll('.sv-process-row, .sv-process-divider'));
      toRemove.forEach(function(el) { el.remove(); });
      if (header) {
        header.insertAdjacentElement('afterend', pinned);
      } else {
        section.appendChild(pinned);
      }
    }

    var track = pinned.querySelector('.sv-process-cards');
    var cards = Array.prototype.slice.call(pinned.querySelectorAll('.sv-process-card'));
    var nav = pinned.querySelector('.sv-process-nav');
    if (!cards.length || !track) return;

    // Remove data-animate and absolute positioning from cards
    cards.forEach(function(card) {
      card.removeAttribute('data-animate');
      card.style.position = 'relative';
      card.style.top = 'auto';
      card.style.left = 'auto';
      card.style.transform = 'none';
      card.style.opacity = '1';
    });

    // Measure card dimensions after layout
    var cardW = cards[0].offsetWidth;
    var gap = 24;
    var current = 0;
    var autoTimer = null;
    var INTERVAL = 3000;

    function getOffset(idx) {
      var containerW = pinned.offsetWidth;
      return -(idx * (cardW + gap)) + (containerW / 2) - (cardW / 2);
    }

    function slideTo(idx, animate) {
      if (idx < 0) idx = 0;
      if (idx >= cards.length) idx = 0; // wrap around
      current = idx;
      var tx = getOffset(idx);
      if (animate === false) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
      track.style.transform = 'translateX(' + tx + 'px)';
      setActiveDot(idx);
      // Highlight active card
      cards.forEach(function(c, i) {
        c.style.opacity = i === idx ? '1' : '0.45';
        c.style.transform = i === idx ? 'scale(1)' : 'scale(0.92)';
        c.style.transition = 'opacity 0.4s, transform 0.4s';
      });
    }

    // ── Build controls: ← dots → ──
    var controls = document.createElement('div');
    controls.className = 'sv-process-carousel-controls';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'sv-process-arrow';
    prevBtn.innerHTML = '&#8592;';
    prevBtn.setAttribute('aria-label', 'Previous step');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'sv-process-arrow';
    nextBtn.innerHTML = '&#8594;';
    nextBtn.setAttribute('aria-label', 'Next step');

    // Move nav into controls wrapper
    if (nav) {
      nav.style.position = 'relative';
      nav.style.bottom = 'auto';
      nav.style.left = 'auto';
      nav.style.transform = 'none';
      nav.innerHTML = '';
      cards.forEach(function(_, i) {
        var dot = document.createElement('div');
        dot.className = 'sv-process-dot';
        dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#f0ede8;transition:opacity 0.3s,transform 0.3s;cursor:pointer;';
        dot.addEventListener('click', function() { slideTo(i, true); resetTimer(); });
        nav.appendChild(dot);
      });
      controls.appendChild(prevBtn);
      controls.appendChild(nav);
      controls.appendChild(nextBtn);
      pinned.appendChild(controls);
    }

    var navDots = nav ? Array.prototype.slice.call(nav.children) : [];

    function setActiveDot(idx) {
      navDots.forEach(function(dot, i) {
        dot.style.opacity = i === idx ? '1' : '0.3';
        dot.style.transform = i === idx ? 'scale(1.4)' : 'scale(1)';
      });
    }

    // ── Arrow click handlers ──
    prevBtn.addEventListener('click', function() {
      slideTo(current <= 0 ? cards.length - 1 : current - 1, true);
      resetTimer();
    });
    nextBtn.addEventListener('click', function() {
      slideTo((current + 1) % cards.length, true);
      resetTimer();
    });

    // ── Drag / swipe ──
    var isDragging = false;
    var startX = 0;
    var dragOffset = 0;
    var baseTranslate = 0;

    function pointerDown(e) {
      isDragging = true;
      startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      baseTranslate = getOffset(current);
      track.classList.add('is-dragging');
      if (autoTimer) clearInterval(autoTimer);
    }
    function pointerMove(e) {
      if (!isDragging) return;
      var clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      dragOffset = clientX - startX;
      track.style.transform = 'translateX(' + (baseTranslate + dragOffset) + 'px)';
    }
    function pointerUp() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      var threshold = cardW * 0.2;
      if (dragOffset < -threshold && current < cards.length - 1) {
        slideTo(current + 1, true);
      } else if (dragOffset > threshold && current > 0) {
        slideTo(current - 1, true);
      } else {
        slideTo(current, true);
      }
      dragOffset = 0;
      resetTimer();
    }

    // Mouse events
    track.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);
    // Touch events
    track.addEventListener('touchstart', pointerDown, { passive: true });
    window.addEventListener('touchmove', pointerMove, { passive: true });
    window.addEventListener('touchend', pointerUp);

    // Prevent link/image drag
    track.addEventListener('dragstart', function(e) { e.preventDefault(); });

    // ── Autoplay ──
    function resetTimer() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(function() {
        slideTo((current + 1) % cards.length, true);
      }, INTERVAL);
    }

    // Pause on hover
    pinned.addEventListener('mouseenter', function() {
      if (autoTimer) clearInterval(autoTimer);
    });
    pinned.addEventListener('mouseleave', function() {
      resetTimer();
    });

    // ── Recalculate on resize ──
    window.addEventListener('resize', function() {
      cardW = cards[0].offsetWidth;
      slideTo(current, false);
    });

    // ── Init ──
    slideTo(0, false);
    resetTimer();

    // Entrance animation
    gsap.fromTo(pinned,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: pinned, start: 'top 85%', once: true }
      }
    );
  }

  /* ═══════════════════════════════════════════════
     BEFORE/AFTER SLIDER — 3D Reveal Scene
     Same floor plan as hero, camera facing the user
     ═══════════════════════════════════════════════ */

  var mat = function(color, rough, metal) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
  };
  var box = function(bw, bh, bd, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };
  function addBox(group, bw, bh, bd, material, x, y, z) {
    var m = box(bw, bh, bd, material);
    m.position.set(x, y, z); group.add(m); return m;
  }

  function initBeforeAfterSlider() {
    if (typeof THREE === 'undefined') return;
    var isMobile = window.innerWidth < 992;

    // Same dimensions as hero
    var rW = 7, rD = 5, wH = 3.2;

    /* ── Inject DOM ── */
    var processSection = document.getElementById('sv-process');
    var insertAfter = processSection || document.getElementById('sv-types');
    if (!insertAfter) return;

    var section = document.createElement('section');
    section.id = 'sv-reveal';
    section.className = 'sv-reveal-section';
    section.innerHTML =
      '<div class="sv-reveal-header">' +
        '<div class="sv-reveal-label" data-animate="fade-up" style="font-family:\'DM Sans\',sans-serif;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;opacity:0.4;margin-bottom:16px;">// The Transformation</div>' +
        '<h2 data-animate="word-stagger-elastic">See the Conversion</h2>' +
      '</div>' +
      '<div class="sv-reveal-container">' +
        '<canvas id="reveal-canvas"></canvas>' +
        '<div class="sv-reveal-slider">' +
          '<div class="sv-reveal-handle">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7" fill="none" stroke="#f0ede8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
        '</div>' +
        '<div class="sv-reveal-label-before">GARAGE</div>' +
        '<div class="sv-reveal-label-after">LIVING SPACE</div>' +
      '</div>';

    insertAfter.parentNode.insertBefore(section, insertAfter.nextSibling);

    /* ── Entrance animation ── */
    var revealLabel = section.querySelector('.sv-reveal-label');
    var revealH2 = section.querySelector('h2');
    var revealContainer = section.querySelector('.sv-reveal-container');

    if (revealLabel) {
      revealLabel.removeAttribute('data-animate');
      gsap.fromTo(revealLabel, { y: 20, opacity: 0 }, {
        y: 0, opacity: 0.4, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true }
      });
    }
    if (revealH2) {
      revealH2.removeAttribute('data-animate');
      if (!revealH2.dataset.origText) revealH2.dataset.origText = revealH2.textContent.trim();
      var rWords = splitIntoWords(revealH2);
      gsap.set(rWords, { yPercent: 120 });
      gsap.to(rWords, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: section, start: 'top 78%', once: true }
      });
    }
    if (revealContainer) {
      gsap.fromTo(revealContainer, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: revealContainer, start: 'top 85%', once: true }
      });
    }

    /* ── Three.js scene ── */
    var canvas = document.getElementById('reveal-canvas');
    if (!canvas) return;
    var container = canvas.parentElement;

    var revScene = new THREE.Scene();
    revScene.background = new THREE.Color(0x0B0E18);

    var revRenderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', canvas: canvas, antialias: !isMobile, alpha: false });
    revRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    revRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    revRenderer.toneMappingExposure = 0.9;
    revRenderer.shadowMap.enabled = true;
    revRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var cw = container.clientWidth, ch = container.clientHeight;
    revRenderer.setSize(cw, ch, false);

    // Camera facing the user (front view, zoomed in, lower angle)
    var revCamera = new THREE.PerspectiveCamera(50, cw / ch, 0.1, 300);
    revCamera.position.set(0.5, 2.8, 9);
    revCamera.lookAt(0, 1.0, 0);

    // Lighting
    revScene.add(new THREE.HemisphereLight(0x1a2040, 0x0a0a15, 0.2));
    var moon = new THREE.DirectionalLight(0x8899CC, 0.5);
    moon.position.set(8, 12, 10); moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.left = -12; moon.shadow.camera.right = 12;
    moon.shadow.camera.top = 12; moon.shadow.camera.bottom = -12;
    revScene.add(moon);
    revScene.add(new THREE.AmbientLight(0x1a1a2e, 0.3));

    // Ground
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), mat(0x1A1C22, 0.95));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01;
    ground.receiveShadow = true; revScene.add(ground);

    // Blueprint grid
    var bpMat = new THREE.LineBasicMaterial({ color: 0x3377BB, transparent: true, opacity: 0.1 });
    for (var gi = -6; gi <= 6; gi++) {
      revScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(gi * 2, 0.01, -12), new THREE.Vector3(gi * 2, 0.01, 12)
      ]), bpMat.clone()));
      revScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-12, 0.01, gi * 2), new THREE.Vector3(12, 0.01, gi * 2)
      ]), bpMat.clone()));
    }

    /* ── Shared shell (exterior walls, roof — visible in both) ── */
    var sharedGroup = new THREE.Group();
    var extMat = mat(0xE8E0D5, 0.9);
    extMat.transparent = true; extMat.opacity = 0.12; extMat.side = THREE.DoubleSide;

    // Back wall
    addBox(sharedGroup, rW, wH, 0.12, extMat, 0, wH / 2, -rD);
    // Left wall
    addBox(sharedGroup, 0.12, wH, rD * 2, extMat, -rW / 2, wH / 2, 0);
    // Right wall
    addBox(sharedGroup, 0.12, wH, rD * 2, extMat, rW / 2, wH / 2, 0);
    // Front open — just corner posts
    var postMat = mat(0xD0C8BC, 0.85);
    addBox(sharedGroup, 0.12, wH, 0.12, postMat, -rW / 2, wH / 2, rD);
    addBox(sharedGroup, 0.12, wH, 0.12, postMat, rW / 2, wH / 2, rD);
    // Roof slab
    addBox(sharedGroup, rW + 0.6, 0.15, rD * 2 + 0.6, mat(0x4A3C30, 0.75), 0, wH + 0.075, 0);
    revScene.add(sharedGroup);

    /* ── GARAGE GROUP (before) ── */
    var garageGroup = new THREE.Group();
    var grayConc = mat(0x9A9488, 0.95);
    var oldWall = mat(0xC4B99E, 0.92); oldWall.side = THREE.DoubleSide;

    // Concrete floor
    addBox(garageGroup, rW, 0.06, rD * 2, grayConc, 0, 0.03, 0);
    // Car (facing user, +z is front)
    var carMat2 = mat(0x3A4550, 0.6, 0.1);
    addBox(garageGroup, 1.8, 0.7, 3.6, carMat2, 0, 0.5, 0.5);
    addBox(garageGroup, 1.6, 0.5, 2.2, carMat2, 0, 1.1, 0.3);
    [[-0.75, -1.2], [-0.75, 1.2], [0.75, -1.2], [0.75, 1.2]].forEach(function(wp) {
      addBox(garageGroup, 0.15, 0.4, 0.4, mat(0x222222, 0.9), wp[0], 0.25, 0.5 + wp[1]);
    });
    // Shelving
    addBox(garageGroup, 2.2, 2.2, 0.5, mat(0x6B6560, 0.7, 0.15), -2.2, 1.1, -rD + 0.4);
    addBox(garageGroup, 0.5, 0.35, 0.4, mat(0x8B7355, 0.88), -2.8, 1.6, -rD + 0.4);
    addBox(garageGroup, 0.4, 0.25, 0.35, mat(0x6B5D4A, 0.85), -1.8, 1.6, -rD + 0.4);
    // Workbench
    addBox(garageGroup, 0.5, 0.06, 2.5, mat(0x8B7355, 0.85), rW / 2 - 0.4, 0.85, -2);
    // Oil stains
    addBox(garageGroup, 1.2, 0.005, 0.8, mat(0x4A4540, 0.95), -0.5, 0.065, 1);
    // Bare bulb
    addBox(garageGroup, 0.03, 0.4, 0.03, mat(0x333333, 0.5), 0, wH - 0.2, 0);
    addBox(garageGroup, 0.12, 0.12, 0.12, mat(0xFFDD88, 0.3), 0, wH - 0.45, 0);
    var gLight = new THREE.PointLight(0xFFCC88, 1.5, 10, 2);
    gLight.position.set(0, wH - 0.5, 0); garageGroup.add(gLight);
    revScene.add(garageGroup);

    /* ── LIVING GROUP (after) — same layout as hero ── */
    var livingGroup = new THREE.Group();
    var nWall = mat(0xF5F2EE, 0.85); nWall.side = THREE.DoubleSide;
    var cabM = mat(0xF0ECE6, 0.55);
    var qtzM = mat(0xE8E2D8, 0.3, 0.08);
    var steelM = mat(0xC0C0C0, 0.2, 0.2);
    var frmM = mat(0x1A1816, 0.4, 0.25);
    var partM = mat(0xF5F2EE, 0.85); partM.side = THREE.DoubleSide;

    // Floor
    addBox(livingGroup, rW, 0.06, rD * 2, mat(0xDDD3BE, 0.55), 0, 0.03, 0);

    // Partition walls (same as hero)
    addBox(livingGroup, 0.1, wH, 4.0, partM, 0, wH / 2, -3);
    addBox(livingGroup, 0.1, wH, 4.5, partM, 0, wH / 2, 2.75);
    addBox(livingGroup, 2.0, wH, 0.1, partM, -2.5, wH / 2, -0.5);
    addBox(livingGroup, 0.4, wH, 0.1, partM, -0.2, wH / 2, -0.5);
    // Living room wall (split for doorway)
    addBox(livingGroup, 1.1, wH, 0.1, partM, 0.6, wH / 2, 0.5);
    addBox(livingGroup, 0.6, wH - 2.4, 0.1, partM, 1.7, wH - (wH - 2.4) / 2, 0.5);
    addBox(livingGroup, 1.2, wH, 0.1, partM, 2.9, wH / 2, 0.5);
    // Door frame
    addBox(livingGroup, 0.06, 2.4, 0.12, frmM, 1.15, 1.2, 0.5);
    addBox(livingGroup, 0.06, 2.4, 0.12, frmM, 2.25, 1.2, 0.5);
    addBox(livingGroup, 1.16, 0.06, 0.12, frmM, 1.7, 2.43, 0.5);

    // Bedroom
    addBox(livingGroup, 1.8, 0.22, 2.6, mat(0x5C4033, 0.75), -2.5, 0.11, -3);
    addBox(livingGroup, 1.7, 0.18, 2.5, mat(0xE8E0D5, 0.7), -2.5, 0.31, -3);
    addBox(livingGroup, 1.8, 0.8, 0.1, mat(0x5C4033, 0.75), -2.5, 0.7, -4.65);
    addBox(livingGroup, 0.7, 0.12, 0.35, mat(0xBEB5A8, 0.8), -2.9, 0.48, -4.35);
    addBox(livingGroup, 0.7, 0.12, 0.35, mat(0xBEB5A8, 0.8), -2.1, 0.48, -4.35);
    addBox(livingGroup, 0.4, 0.4, 0.4, cabM, -1.4, 0.2, -4.3);

    // Bathroom
    addBox(livingGroup, 3.3, 0.01, 5, mat(0xE0DDD8, 0.6), -1.8, 0.065, 2.25);
    addBox(livingGroup, 0.5, 0.7, 1.4, cabM, -rW / 2 + 0.4, 0.35, 2.5);
    addBox(livingGroup, 0.55, 0.04, 1.45, qtzM, -rW / 2 + 0.4, 0.72, 2.5);
    addBox(livingGroup, 0.45, 0.4, 0.6, mat(0xF8F8F8, 0.4), -2.5, 0.2, 0.1);
    addBox(livingGroup, 0.4, 0.55, 0.08, mat(0xF0F0F0, 0.45), -2.5, 0.48, -0.15);
    // Shower (back of bathroom near z=4)
    var shGlass = new THREE.MeshBasicMaterial({ color: 0xCCDDEE, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    var shPane = new THREE.Mesh(new THREE.PlaneGeometry(0.04, wH * 0.7), shGlass);
    shPane.rotation.y = Math.PI / 2;
    shPane.position.set(-1.2, wH * 0.35, 4); livingGroup.add(shPane);
    addBox(livingGroup, 0.15, 0.15, 0.04, steelM, -2.5, wH - 0.5, 4.7);
    addBox(livingGroup, 0.03, 0.5, 0.03, steelM, -2.5, wH - 0.25, 4.7);

    // Kitchenette
    addBox(livingGroup, 2.8, 0.9, 0.5, cabM, 1.8, 0.45, -rD + 0.38);
    addBox(livingGroup, 2.9, 0.04, 0.55, qtzM, 1.8, 0.92, -rD + 0.38);
    addBox(livingGroup, 1.8, 0.04, 0.25, mat(0xDED5C4, 0.5), 1.8, 1.6, -rD + 0.22);
    addBox(livingGroup, 0.55, 1.5, 0.55, steelM, rW / 2 - 0.45, 0.75, -rD + 0.45);

    // Dining (in front of kitchen)
    addBox(livingGroup, 0.9, 0.05, 1.3, mat(0x8B7355, 0.7), 1.8, 0.78, -1.2);
    [[-0.3, -0.5], [0.3, -0.5], [-0.3, 0.5], [0.3, 0.5]].forEach(function(tl) {
      addBox(livingGroup, 0.04, 0.75, 0.04, mat(0x5C4033, 0.75), 1.8 + tl[0], 0.375, -1.2 + tl[1]);
    });
    addBox(livingGroup, 0.45, 0.05, 0.45, mat(0x4A5568, 0.8), 1.0, 0.48, -1.2);
    addBox(livingGroup, 0.05, 0.45, 0.45, mat(0x4A5568, 0.8), 0.78, 0.73, -1.2);
    addBox(livingGroup, 0.45, 0.05, 0.45, mat(0x4A5568, 0.8), 2.6, 0.48, -1.2);
    addBox(livingGroup, 0.05, 0.45, 0.45, mat(0x4A5568, 0.8), 2.82, 0.73, -1.2);

    // Living room (TV + sofa + coffee table)
    addBox(livingGroup, 1.0, 0.7, 0.06, mat(0x111111, 0.3, 0.1), 2.9, 1.8, 0.58);
    addBox(livingGroup, 0.9, 0.6, 0.02, mat(0x1A2030, 0.2, 0.05), 2.9, 1.8, 0.62);
    addBox(livingGroup, 2.6, 0.35, 0.85, mat(0x8A9AAA, 0.8), 1.75, 0.18, 3.2);
    addBox(livingGroup, 2.6, 0.4, 0.1, mat(0x7A8A98, 0.8), 1.75, 0.55, 3.6);
    addBox(livingGroup, 1.2, 0.04, 0.6, mat(0x99BBCC, 0.08), 1.75, 0.38, 1.8);

    // Interior lights
    var lLight1 = new THREE.PointLight(0xFFF5E8, 3, 8, 2);
    lLight1.position.set(-2, wH - 0.2, -3); livingGroup.add(lLight1);
    var lLight2 = new THREE.PointLight(0xFFF5E8, 2, 8, 2);
    lLight2.position.set(1.75, wH - 0.2, 2.5); livingGroup.add(lLight2);
    var lLight3 = new THREE.PointLight(0xFFF5E8, 1.5, 6, 2);
    lLight3.position.set(-2, wH - 0.2, 2); livingGroup.add(lLight3);
    revScene.add(livingGroup);

    /* ── Slider Mechanics ── */
    var sliderEl = section.querySelector('.sv-reveal-slider');
    var sliderFrac = 0.5;
    var isDragging = false;

    function updateSliderPos() {
      if (sliderEl) sliderEl.style.left = (sliderFrac * 100) + '%';
    }

    function onPointerDown(e) {
      isDragging = true;
      e.preventDefault();
      onPointerMove(e);
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      var rect = container.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      sliderFrac = Math.max(0.02, Math.min(0.98, (clientX - rect.left) / rect.width));
      updateSliderPos();
    }
    function onPointerUp() { isDragging = false; }

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
    updateSliderPos();

    /* ── Render loop with scissor ── */
    function revRender() {
      requestAnimationFrame(revRender);
      var pw = container.clientWidth, ph = container.clientHeight;
      if (canvas.width !== pw * revRenderer.getPixelRatio() || canvas.height !== ph * revRenderer.getPixelRatio()) {
        revRenderer.setSize(pw, ph, false);
        revCamera.aspect = pw / ph;
        revCamera.updateProjectionMatrix();
      }

      var pixelX = Math.round(sliderFrac * pw * revRenderer.getPixelRatio());
      var totalW = pw * revRenderer.getPixelRatio();
      var totalH = ph * revRenderer.getPixelRatio();

      revRenderer.setScissorTest(true);

      garageGroup.visible = true; livingGroup.visible = false;
      revRenderer.setScissor(0, 0, pixelX, totalH);
      revRenderer.setViewport(0, 0, totalW, totalH);
      revRenderer.render(revScene, revCamera);

      garageGroup.visible = false; livingGroup.visible = true;
      revRenderer.setScissor(pixelX, 0, totalW - pixelX, totalH);
      revRenderer.setViewport(0, 0, totalW, totalH);
      revRenderer.render(revScene, revCamera);

      revRenderer.setScissorTest(false);
      garageGroup.visible = true; livingGroup.visible = true;
    }
    revRender();

    window.addEventListener('resize', function() {
      var pw = container.clientWidth, ph = container.clientHeight;
      revRenderer.setSize(pw, ph, false);
      revCamera.aspect = pw / ph;
      revCamera.updateProjectionMatrix();
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

    /* ── CTA section: entrance — safe defaults, generous triggers ── */
    gsap.utils.toArray('.av-cta').forEach(function(cta) {
      var heading = cta.querySelector('.av-cta-heading, [class*="cta-heading"]');
      var btns = cta.querySelector('.av-cta-btns, [class*="cta-btns"]');
      var subtitle = cta.querySelector('.av-cta-subtitle, [class*="cta-subtitle"]');

      if (subtitle) {
        gsap.killTweensOf(subtitle);
        gsap.set(subtitle, { clearProps: 'all' });
        gsap.fromTo(subtitle,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: cta, start: 'top 95%', once: true } });
      }
      if (heading) {
        heading.removeAttribute('data-animate');
        gsap.killTweensOf(heading);
        /* Use origText to preserve spacing, then split */
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
        gsap.fromTo(btns.children,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: cta, start: 'top 95%', once: true } });
      }
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function() {
    initHero();
    initTypesShowcase();
    initProcessCards();
    initBeforeAfterSlider();
    initScrollAnimations();
  });

})();
