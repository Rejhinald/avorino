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
     HERO — Transformation Dissolve
     Single house morphs from old dated wireframe to
     modern gold wireframe via particle dissolution.
     Scroll-driven with camera orbit.
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('sv-hero');
    if (!hero) return;
    var canvasWrap = document.getElementById('hero-canvas');
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

    /* ── Three.js Scene — Split-view renovation: dated left ↔ modern right ── */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth;
    var h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 2.5, 14);
    camera.lookAt(0, 1.5, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    canvasWrap.appendChild(renderer.domElement);

    function hMat(color, rough, metal) {
      return new THREE.MeshStandardMaterial({ color: color, roughness: rough !== undefined ? rough : 0.7, metalness: metal || 0 });
    }
    function hBox(bw, bh, bd, material) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), material);
      m.castShadow = true; m.receiveShadow = true;
      return m;
    }
    function addTo(group, mesh, x, y, z) {
      mesh.position.set(x, y, z); group.add(mesh); return mesh;
    }

    /* ── Lighting ── */
    scene.add(new THREE.HemisphereLight(0xF5E8D0, 0x1a1a2e, 0.4));
    var sunLight = new THREE.DirectionalLight(0xFFE8C0, 0.8);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.left = -12; sunLight.shadow.camera.right = 12;
    sunLight.shadow.camera.top = 10; sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x2a2a3e, 0.25));

    /* ── Room dimensions — wide open-plan room, front wall removed for cutaway ── */
    var rW = 7, rD = 5, wH = 3.2;

    /* ── Ground plane ── */
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), hMat(0x151618, 0.95));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; ground.receiveShadow = true;
    scene.add(ground);

    /* ═══════════════════════════════════════════
       OLD SIDE (left half) — dated 90s interior
       ═══════════════════════════════════════════ */
    var oldGroup = new THREE.Group();
    var oldWallMat = hMat(0xD4C9A8, 0.92); oldWallMat.side = THREE.DoubleSide;

    // Floor — dated beige tile
    addTo(oldGroup, hBox(rW, 0.06, rD * 2, hMat(0xB5A88A, 0.88)), 0, 0.03, 0);

    // Walls: back + left + right (no front for cutaway)
    addTo(oldGroup, hBox(rW, wH, 0.18, oldWallMat), 0, wH / 2, -rD);
    addTo(oldGroup, hBox(0.18, wH, rD * 2, oldWallMat), -rW / 2, wH / 2, 0);
    addTo(oldGroup, hBox(0.18, wH, rD * 2, oldWallMat.clone()), rW / 2, wH / 2, 0);

    // Small dated windows on back wall — glass in FRONT of wall so it's visible
    var oldFrameMat = hMat(0x6B5D4A, 0.8);
    var oldGlassMat = new THREE.MeshBasicMaterial({ color: 0x7CC4DD, side: THREE.DoubleSide });
    [[-2, 1.6, 1.4, 1.6], [2, 1.6, 1.4, 1.6]].forEach(function(wp) {
      addTo(oldGroup, hBox(wp[2] + 0.12, wp[3] + 0.12, 0.06, oldFrameMat), wp[0], wp[1], -rD + 0.12);
      var oGlass = new THREE.Mesh(new THREE.PlaneGeometry(wp[2], wp[3]), oldGlassMat.clone());
      oGlass.userData.isGlass = true;
      oGlass.renderOrder = 999;
      addTo(oldGroup, oGlass, wp[0], wp[1], -rD + 0.14);
    });

    // ─── Old Kitchen (back-right corner) ───
    var oldCabMat = hMat(0x6B5538, 0.88);
    var oldCounterMat = hMat(0x8B7D6B, 0.82);
    // L-shaped dark wood cabinets along back wall
    addTo(oldGroup, hBox(3, 0.9, 0.55, oldCabMat), 2, 0.45, -rD + 0.4);
    addTo(oldGroup, hBox(3.1, 0.04, 0.6, oldCounterMat), 2, 0.92, -rD + 0.4);
    // Side cabinets along right wall
    addTo(oldGroup, hBox(0.55, 0.9, 2, oldCabMat), rW / 2 - 0.4, 0.45, -rD + 1.5);
    addTo(oldGroup, hBox(0.6, 0.04, 2.1, oldCounterMat), rW / 2 - 0.4, 0.92, -rD + 1.5);
    // Old upper cabinets
    addTo(oldGroup, hBox(2.5, 0.7, 0.3, oldCabMat), 2, 2.15, -rD + 0.25);
    // Old fridge (beige/cream)
    addTo(oldGroup, hBox(0.75, 1.8, 0.65, hMat(0xC8BFA0, 0.82)), rW / 2 - 0.5, 0.9, -rD + 0.45);
    // Old stove
    addTo(oldGroup, hBox(0.6, 0.9, 0.55, hMat(0xAAAAAA, 0.7, 0.1)), 0.8, 0.45, -rD + 0.4);
    addTo(oldGroup, hBox(0.6, 0.03, 0.55, hMat(0x222222, 0.5)), 0.8, 0.92, -rD + 0.4);

    // ─── Old Living Room (left side) ───
    // Bulky dark brown sofa
    addTo(oldGroup, hBox(2.6, 0.38, 0.85, hMat(0x5C4A38, 0.88)), -1.5, 0.19, 2);
    addTo(oldGroup, hBox(2.6, 0.2, 0.12, hMat(0x4A3828, 0.88)), -1.5, 0.55, 2.35);
    // Sofa armrests
    addTo(oldGroup, hBox(0.12, 0.35, 0.85, hMat(0x4A3828, 0.88)), -2.7, 0.45, 2);
    addTo(oldGroup, hBox(0.12, 0.35, 0.85, hMat(0x4A3828, 0.88)), -0.3, 0.45, 2);
    // Old heavy coffee table
    addTo(oldGroup, hBox(1.2, 0.05, 0.6, hMat(0x6B5538, 0.82)), -1.5, 0.42, 0.8);
    addTo(oldGroup, hBox(0.08, 0.4, 0.08, hMat(0x5C4A38, 0.8)), -2, 0.2, 0.55);
    addTo(oldGroup, hBox(0.08, 0.4, 0.08, hMat(0x5C4A38, 0.8)), -1, 0.2, 0.55);
    addTo(oldGroup, hBox(0.08, 0.4, 0.08, hMat(0x5C4A38, 0.8)), -2, 0.2, 1.05);
    addTo(oldGroup, hBox(0.08, 0.4, 0.08, hMat(0x5C4A38, 0.8)), -1, 0.2, 1.05);
    // Old TV on stand (boxy CRT-style)
    addTo(oldGroup, hBox(1.2, 0.6, 0.4, hMat(0x555555, 0.5)), -1.5, 0.6, -0.8);
    addTo(oldGroup, hBox(1.4, 0.08, 0.45, hMat(0x6B5538, 0.8)), -1.5, 0.28, -0.8);
    addTo(oldGroup, hBox(0.06, 0.25, 0.35, hMat(0x5C4A38, 0.8)), -2.1, 0.12, -0.8);
    addTo(oldGroup, hBox(0.06, 0.25, 0.35, hMat(0x5C4A38, 0.8)), -0.9, 0.12, -0.8);

    // ─── Old Dining (center) ───
    addTo(oldGroup, hBox(1.4, 0.05, 0.9, hMat(0x6B5538, 0.8)), 1.2, 0.78, 1.5);
    [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]].forEach(function(lp) {
      addTo(oldGroup, hBox(0.05, 0.76, 0.05, hMat(0x5C4A38, 0.8)), 1.2 + lp[0], 0.38, 1.5 + lp[1]);
    });
    // Old dining chairs
    [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]].forEach(function(cp) {
      addTo(oldGroup, hBox(0.4, 0.04, 0.4, hMat(0x5C4A38, 0.82)), 1.2 + cp[0], 0.45, 1.5 + cp[1]);
      addTo(oldGroup, hBox(0.4, 0.35, 0.04, hMat(0x5C4A38, 0.82)), 1.2 + cp[0], 0.7, 1.5 + cp[1] + (cp[1] > 0 ? 0.18 : -0.18));
    });

    // Old area rug (faded, busy pattern feel)
    addTo(oldGroup, hBox(2.8, 0.01, 2, hMat(0x8B7D6B, 0.92)), -1.5, 0.07, 1.5);

    // Old doorway on left wall (simple opening with frame)
    // Split left wall into two segments with a 1.2-wide gap at z=1.5
    // (already placed full left wall above — add a doorframe over it)
    var oldDoorFrame = hMat(0x5C4A38, 0.85);
    addTo(oldGroup, hBox(0.2, 2.2, 0.08, oldDoorFrame), -rW / 2 - 0.01, 1.1, 1.5); // frame left
    addTo(oldGroup, hBox(1.3, 0.12, 0.08, oldDoorFrame), -rW / 2 - 0.01, 2.22, 1.5); // header

    // Old dome ceiling light (dated brass fixture)
    addTo(oldGroup, hBox(0.03, 0.3, 0.03, hMat(0xA08040, 0.5, 0.3)), 0, wH - 0.2, 0);
    var domeGeo = new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    var domeMesh = new THREE.Mesh(domeGeo, hMat(0xD4AA60, 0.5, 0.3));
    domeMesh.rotation.x = Math.PI; addTo(oldGroup, domeMesh, 0, wH - 0.5, 0);

    var oldLight = new THREE.PointLight(0xFFCC88, 1.5, 10, 2);
    oldLight.position.set(0, wH - 0.6, 0); oldGroup.add(oldLight);

    scene.add(oldGroup);

    /* ═══════════════════════════════════════════
       NEW SIDE (right half) — modern luxury
       ═══════════════════════════════════════════ */
    var newGroup = new THREE.Group();
    var newWallMat = hMat(0xF5F2EE, 0.85); newWallMat.side = THREE.DoubleSide;

    // Floor — wide-plank light oak
    addTo(newGroup, hBox(rW, 0.06, rD * 2, hMat(0xDDD3BE, 0.55)), 0, 0.03, 0);

    // Walls: back (split for window on living room side) + left + right (split for window)
    // Window centered at x=-2, width 2.8 → opening from x=-3.4 to x=-0.6
    // Back wall: left strip (x -3.5 to -3.4)
    addTo(newGroup, hBox(0.2, wH, 0.12, newWallMat), -3.4, wH / 2, -rD);
    // Back wall: right/kitchen segment (x -0.6 to 3.5) — solid behind kitchen
    addTo(newGroup, hBox(4.1, wH, 0.12, newWallMat.clone()), 1.45, wH / 2, -rD);
    // Back wall: header above window opening
    addTo(newGroup, hBox(2.8, wH - 2.9 - 0.15, 0.12, newWallMat.clone()), -2, wH - (wH - 2.9 - 0.15) / 2, -rD);
    // Left wall
    addTo(newGroup, hBox(0.12, wH, rD * 2, newWallMat), -rW / 2, wH / 2, 0);
    // Right wall: segment before window (z -5 to 0)
    addTo(newGroup, hBox(0.12, wH, 5, newWallMat.clone()), rW / 2, wH / 2, -2.5);
    // Right wall: header strip above window
    addTo(newGroup, hBox(0.12, wH - 2.75, 3.6, newWallMat.clone()), rW / 2, wH - (wH - 2.75) / 2, 1.8);
    // Right wall: segment after window (z 3.6 to 5)
    addTo(newGroup, hBox(0.12, wH, 1.4, newWallMat.clone()), rW / 2, wH / 2, 4.3);

    // Modern windows
    var newFrameMat = hMat(0x1A1816, 0.4, 0.25);
    // Glass uses MeshBasicMaterial — always bright, unaffected by lighting
    // Tagged with userData.isGlass so scroll handler preserves opacity
    var winGlassMat = new THREE.MeshBasicMaterial({ color: 0x8EC8E8, side: THREE.DoubleSide });

    // Back wall — window on living room side (2.8 x 2.9, 4-pane) at x=-2
    var bwW = 2.8, bwH = 2.9, bwCX = -2, bwCY = 0.15 + bwH / 2;
    addTo(newGroup, hBox(bwW + 0.1, bwH + 0.1, 0.14, newFrameMat), bwCX, bwCY, -rD);
    var bwGlass = new THREE.Mesh(new THREE.PlaneGeometry(bwW, bwH), winGlassMat);
    bwGlass.userData.isGlass = true;
    bwGlass.renderOrder = 999;
    addTo(newGroup, bwGlass, bwCX, bwCY, -rD + 0.12);
    // Mullions — 1 vertical + 1 horizontal (4-pane)
    addTo(newGroup, hBox(0.04, bwH, 0.14, newFrameMat), bwCX, bwCY, -rD);
    addTo(newGroup, hBox(bwW, 0.04, 0.14, newFrameMat), bwCX, bwCY, -rD);

    // Right wall — large window (3.6 x 2.6, 3-pane)
    var rwY = 1.45, rwZ = 1.8, rwW = 3.6, rwH = 2.6;
    addTo(newGroup, hBox(0.14, rwH + 0.08, rwW + 0.08, newFrameMat), rW / 2, rwY, rwZ);
    var rwGlass = new THREE.Mesh(new THREE.PlaneGeometry(rwW, rwH), winGlassMat.clone());
    rwGlass.rotation.y = Math.PI / 2;
    rwGlass.userData.isGlass = true;
    rwGlass.renderOrder = 999;
    addTo(newGroup, rwGlass, rW / 2 - 0.12, rwY, rwZ);
    addTo(newGroup, hBox(0.14, 0.04, rwW, newFrameMat), rW / 2, rwY, rwZ);
    addTo(newGroup, hBox(0.14, rwH, 0.04, newFrameMat), rW / 2, rwY, rwZ - rwW / 3);
    addTo(newGroup, hBox(0.14, rwH, 0.04, newFrameMat), rW / 2, rwY, rwZ + rwW / 3);

    // ─── Modern Kitchen (back-right) ───
    var cabMat = hMat(0xF0ECE6, 0.55);
    var quartzMat = hMat(0xE8E2D8, 0.3, 0.08);
    var stainlessMat = hMat(0xC0C0C0, 0.2, 0.2);
    // Counters along back wall
    addTo(newGroup, hBox(2.8, 0.9, 0.5, cabMat), 2.2, 0.45, -rD + 0.38);
    addTo(newGroup, hBox(2.9, 0.04, 0.55, quartzMat), 2.2, 0.92, -rD + 0.38);
    // Floating upper shelves (open, modern)
    addTo(newGroup, hBox(2.4, 0.04, 0.28, hMat(0xDED5C4, 0.5)), 2.2, 1.6, -rD + 0.22);
    addTo(newGroup, hBox(2.4, 0.04, 0.28, hMat(0xDED5C4, 0.5)), 2.2, 2.1, -rD + 0.22);
    // Stainless fridge (built-in look)
    addTo(newGroup, hBox(0.8, 2.1, 0.65, stainlessMat), rW / 2 - 0.52, 1.05, -rD + 0.45);
    // Handle lines
    addTo(newGroup, hBox(0.02, 0.7, 0.02, hMat(0x999999, 0.15, 0.3)), rW / 2 - 0.18, 1.3, -rD + 0.13);
    // Modern range/stove
    addTo(newGroup, hBox(0.65, 0.9, 0.5, stainlessMat), 0.6, 0.45, -rD + 0.38);
    addTo(newGroup, hBox(0.65, 0.02, 0.5, hMat(0x222222, 0.4)), 0.6, 0.91, -rD + 0.38);
    // Range hood
    addTo(newGroup, hBox(0.7, 0.25, 0.35, stainlessMat), 0.6, 2.0, -rD + 0.3);
    addTo(newGroup, hBox(0.5, 0.5, 0.02, stainlessMat), 0.6, 2.5, -rD + 0.15);

    // Waterfall island
    addTo(newGroup, hBox(2.5, 0.9, 0.75, cabMat), 2, 0.45, -rD + 2.2);
    addTo(newGroup, hBox(2.7, 0.05, 0.85, quartzMat), 2, 0.93, -rD + 2.2);
    // Waterfall edge
    addTo(newGroup, hBox(0.05, 0.9, 0.85, quartzMat), 0.75, 0.45, -rD + 2.2);
    // Bar stools (3)
    for (var bs = 0; bs < 3; bs++) {
      addTo(newGroup, hBox(0.35, 0.04, 0.35, hMat(0x2C3E50, 0.7)), 1.2 + bs * 0.9, 0.68, -rD + 3.1);
      addTo(newGroup, hBox(0.03, 0.66, 0.03, stainlessMat), 1.2 + bs * 0.9, 0.33, -rD + 3.1);
    }

    // ─── Modern Living (left side) ───
    // L-shaped sectional sofa
    addTo(newGroup, hBox(2.8, 0.35, 0.9, hMat(0x8A9AAA, 0.8)), -1.2, 0.18, 2.5);
    addTo(newGroup, hBox(2.8, 0.22, 0.1, hMat(0x7A8A98, 0.8)), -1.2, 0.52, 2.9);
    // L-extension
    addTo(newGroup, hBox(0.9, 0.35, 1.5, hMat(0x8A9AAA, 0.8)), -2.55, 0.18, 1.35);
    addTo(newGroup, hBox(0.1, 0.22, 1.5, hMat(0x7A8A98, 0.8)), -2.9, 0.52, 1.35);
    // Throw pillows on sofa
    addTo(newGroup, hBox(0.4, 0.3, 0.08, hMat(0xc9a96e, 0.75)), -2, 0.45, 2.85);
    addTo(newGroup, hBox(0.4, 0.3, 0.08, hMat(0x9AACBA, 0.75)), -0.3, 0.45, 2.85);

    // Glass coffee table
    var glassMat = new THREE.MeshStandardMaterial({ color: 0x99BBCC, roughness: 0.08, transparent: true, opacity: 0.35 });
    addTo(newGroup, hBox(1.2, 0.04, 0.7, glassMat), -1.2, 0.38, 1.2);
    addTo(newGroup, hBox(0.04, 0.35, 0.04, stainlessMat), -1.7, 0.18, 0.9);
    addTo(newGroup, hBox(0.04, 0.35, 0.04, stainlessMat), -0.7, 0.18, 0.9);
    addTo(newGroup, hBox(0.04, 0.35, 0.04, stainlessMat), -1.7, 0.18, 1.5);
    addTo(newGroup, hBox(0.04, 0.35, 0.04, stainlessMat), -0.7, 0.18, 1.5);

    // TV on media console (proper stand, not floating)
    // Media console unit (solid, visible)
    addTo(newGroup, hBox(2.6, 0.55, 0.45, hMat(0xDDD3BE, 0.5)), -1.2, 0.28, -0.35);
    // Console top surface
    addTo(newGroup, hBox(2.7, 0.03, 0.5, hMat(0xE8E2D8, 0.4)), -1.2, 0.56, -0.35);
    // Console legs
    addTo(newGroup, hBox(0.04, 0.08, 0.04, stainlessMat), -2.4, 0.04, -0.55);
    addTo(newGroup, hBox(0.04, 0.08, 0.04, stainlessMat), 0, 0.04, -0.55);
    addTo(newGroup, hBox(0.04, 0.08, 0.04, stainlessMat), -2.4, 0.04, -0.15);
    addTo(newGroup, hBox(0.04, 0.08, 0.04, stainlessMat), 0, 0.04, -0.15);
    // TV sitting on console (upright: width, height, thin depth)
    addTo(newGroup, hBox(2.2, 1.2, 0.03, hMat(0x111111, 0.3, 0.1)), -1.2, 1.18, -0.35);
    // TV screen bezel glow line
    addTo(newGroup, hBox(2.1, 1.1, 0.01, hMat(0x222233, 0.2)), -1.2, 1.18, -0.33);
    // TV stand/base
    addTo(newGroup, hBox(0.6, 0.03, 0.2, hMat(0x333333, 0.4, 0.1)), -1.2, 0.575, -0.35);

    // Area rug under living area (textured cream/gold pattern)
    addTo(newGroup, hBox(3.2, 0.01, 2.8, hMat(0xC5B8A5, 0.92)), -1.2, 0.07, 1.5);
    // Rug border accent
    addTo(newGroup, hBox(3.2, 0.012, 0.05, hMat(0xc9a96e, 0.8)), -1.2, 0.075, 0.1);
    addTo(newGroup, hBox(3.2, 0.012, 0.05, hMat(0xc9a96e, 0.8)), -1.2, 0.075, 2.9);

    // Kitchen runner rug (near island)
    addTo(newGroup, hBox(2, 0.01, 0.6, hMat(0xBCB19C, 0.85)), 2, 0.07, -rD + 3.5);

    // Modern doorway on left wall (open archway with slim black frame)
    var doorFrameMat = hMat(0x1A1816, 0.4, 0.25);
    addTo(newGroup, hBox(0.04, 2.6, 0.04, doorFrameMat), -rW / 2 + 0.02, 1.3, 1.5);
    addTo(newGroup, hBox(0.04, 2.6, 0.04, doorFrameMat), -rW / 2 + 0.02, 1.3, 2.5);
    addTo(newGroup, hBox(0.04, 0.04, 1, doorFrameMat), -rW / 2 + 0.02, 2.6, 2);
    // Entrance mat
    addTo(newGroup, hBox(0.8, 0.01, 0.5, hMat(0x8A9AAA, 0.88)), -rW / 2 + 0.6, 0.07, 2);

    // Floor lamp (arc style)
    addTo(newGroup, hBox(0.25, 0.02, 0.25, hMat(0xC0C0C0, 0.2, 0.2)), 0.9, 0.01, 3.5);
    addTo(newGroup, hBox(0.03, 1.8, 0.03, stainlessMat), 0.9, 0.9, 3.5);
    addTo(newGroup, hBox(0.6, 0.03, 0.03, stainlessMat), 0.6, 1.8, 3.5);
    addTo(newGroup, hBox(0.35, 0.2, 0.35, hMat(0xF0ECE6, 0.7)), 0.3, 1.7, 3.5);

    // Decorative plant (tall, in corner)
    addTo(newGroup, hBox(0.25, 0.5, 0.25, hMat(0x888888, 0.6)), rW / 2 - 0.5, 0.25, rD - 0.5);
    var leafMat = hMat(0x3A6B4A, 0.75);
    addTo(newGroup, hBox(0.08, 0.9, 0.08, hMat(0x5A4A3A, 0.8)), rW / 2 - 0.5, 0.9, rD - 0.5);
    // Leaf clusters
    [[-0.15, 1.1, 0.1], [0.12, 1.25, -0.08], [-0.1, 1.4, 0.05], [0.08, 1.5, -0.1]].forEach(function(lp) {
      addTo(newGroup, hBox(0.25, 0.04, 0.2, leafMat), rW / 2 - 0.5 + lp[0], lp[1], rD - 0.5 + lp[2]);
    });

    // ─── Pendant lights (3 over island) ───
    [1.2, 2, 2.8].forEach(function(px) {
      addTo(newGroup, hBox(0.015, 0.6, 0.015, stainlessMat), px, wH - 0.3, -rD + 2.2);
      // Cylinder-style pendant (octagonal approx)
      addTo(newGroup, hBox(0.2, 0.3, 0.2, hMat(0x222222, 0.4, 0.3)), px, wH - 0.75, -rD + 2.2);
    });
    // Recessed light accents (warm glow spots)
    var newLight1 = new THREE.PointLight(0xFFF5E8, 3, 8, 2);
    newLight1.position.set(-1.2, wH - 0.2, 1.5); newGroup.add(newLight1);
    var newLight2 = new THREE.PointLight(0xFFF5E8, 2, 8, 2);
    newLight2.position.set(2, wH - 0.2, -rD + 2.2); newGroup.add(newLight2);

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
        var targetOp = obj.userData.isGlass ? 0.5 : 1;
        obj.material.opacity = 0;
        gsap.to(obj.material, { opacity: targetOp, duration: 1.2, delay: 0.5, ease: 'power2.out' });
      }
    });
    newGroup.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material = obj.material.clone();
        obj.material.transparent = true;
        obj.material.opacity = 0;
        // Preserve glass tag through clone
        if (obj.userData.isGlass) obj.material._isGlass = true;
      }
    });
    gsap.to(oldLight, { intensity: 1.5, duration: 1.5, delay: 0.8 });

    /* ═══ SCROLL: Old interior dissolves → modern interior reveals ═══ */
    var scrollProgress = 0;

    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        scrollProgress = self.progress;

        /* Phase 1 (0–40%): Old house fully visible, camera pushes in slightly */
        /* Phase 2 (30–60%): Old dissolves, particles rise, divider appears */
        /* Phase 3 (50–90%): New house materializes */
        /* Phase 4 (85–100%): Divider fades, scene settles on modern view */

        // Old house fade
        var oldFade = scrollProgress < 0.3 ? 1 : Math.max(0, 1 - (scrollProgress - 0.3) / 0.3);
        oldGroup.traverse(function(obj) {
          if (obj.isMesh && obj.material) {
            obj.material.opacity = oldFade;
          }
        });
        oldLight.intensity = 1.5 * oldFade;
        oldGroup.visible = oldFade > 0;

        // New house fade in
        var newP = Math.max(0, Math.min(1, (scrollProgress - 0.45) / 0.4));
        newGroup.visible = newP > 0;
        newGroup.traverse(function(obj) {
          if (obj.isMesh && obj.material) {
            // Glass stays at its target opacity (0.55), scaled by newP
            obj.material.opacity = obj.material._isGlass ? newP : newP;
          }
        });
        newLight1.intensity = 3 * newP;
        newLight2.intensity = 2 * newP;

        // Grid subtle pulse
        gridGroup.children.forEach(function(l) {
          l.material.opacity = 0.04 + 0.03 * Math.sin(scrollProgress * Math.PI);
        });

        // Sun warms with new house
        sunLight.intensity = 0.8 + newP * 0.6;
        sunLight.color.lerp(new THREE.Color(newP > 0.5 ? 0xFFF5E8 : 0xFFE0B0), 0.05);
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

      // Camera: eye-level front view, gentle sway, zooms in on scroll
      var camDist = 14 - scrollProgress * 3;
      var camH = 2.2 + scrollProgress * 0.3;
      // Very gentle side-to-side sway (stays mostly frontal)
      var swayX = Math.sin(baseAngle) * 0.8 + mouseX * 0.6;
      camera.position.set(swayX, camH + mouseY * 0.3, camDist);
      camera.lookAt(0, 1.4, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      var nw = canvasWrap.clientWidth, nh = canvasWrap.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
  }

  /* ═══════════════════════════════════════════════
     TYPES SHOWCASE — Stagger fade-in grid
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
     PROCESS CARDS — Horizontal draggable/swipeable carousel
     sv-process-pinned > sv-process-cards > sv-process-card
     Horizontal swipe + prev/next arrows + autoplay every 3s.
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
      // Center the active card in the viewport
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
      // Determine if we should snap to next/prev
      var threshold = cardW * 0.2;
      if (dragOffset < -threshold && current < cards.length - 1) {
        slideTo(current + 1, true);
      } else if (dragOffset > threshold && current > 0) {
        slideTo(current - 1, true);
      } else {
        slideTo(current, true); // snap back
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
     Dynamically injected section with scissor rendering
     ═══════════════════════════════════════════════ */

  /* ── Shared helpers ── */
  function mat(color, rough, metal) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
  }
  function box(bw, bh, bd, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  function addM(group, mesh, x, y, z) {
    mesh.position.set(x, y, z); group.add(mesh); return mesh;
  }

  function initBeforeAfterSlider() {
    if (typeof THREE === 'undefined') return;
    var isMobile = window.innerWidth < 992;

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
        '<h2 data-animate="word-stagger-elastic">See the Difference</h2>' +
      '</div>' +
      '<div class="sv-reveal-container">' +
        '<canvas id="reveal-canvas"></canvas>' +
        '<div class="sv-reveal-slider">' +
          '<div class="sv-reveal-handle">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7"/></svg>' +
          '</div>' +
        '</div>' +
        '<div class="sv-reveal-label-before">BEFORE</div>' +
        '<div class="sv-reveal-label-after">AFTER</div>' +
      '</div>';

    insertAfter.parentNode.insertBefore(section, insertAfter.nextSibling);

    /* ── Entrance animation for the section ── */
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

    /* ── Three.js scene setup ── */
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

    // Camera: front-facing, elevated to see all 5 rooms
    var revCamera = new THREE.PerspectiveCamera(45, cw / ch, 0.1, 300);
    revCamera.position.set(0, 8, 28);
    revCamera.lookAt(0, 2, 0);

    // Lighting
    revScene.add(new THREE.HemisphereLight(0xF5E8D0, 0x0a0a15, 0.3));
    var sun = new THREE.DirectionalLight(0xFFE8C0, 0.7);
    sun.position.set(8, 15, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -20; sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20; sun.shadow.camera.bottom = -10;
    sun.shadow.camera.far = 60;
    sun.shadow.bias = -0.0005;
    revScene.add(sun);
    revScene.add(new THREE.AmbientLight(0x1a1a2e, 0.2));

    // Ground
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat(0x1A1C22, 0.95));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; ground.receiveShadow = true;
    revScene.add(ground);

    // Blueprint grid
    var bpMat = new THREE.LineBasicMaterial({ color: 0x3377BB, transparent: true, opacity: 0.08 });
    for (var gi = -10; gi <= 10; gi++) {
      revScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(gi * 2, 0.01, -12), new THREE.Vector3(gi * 2, 0.01, 12)
      ]), bpMat.clone()));
      revScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0.01, gi * 2), new THREE.Vector3(20, 0.01, gi * 2)
      ]), bpMat.clone()));
    }

    /* ═════════════════════════════════════════════════════
       Full house: 5 rooms — Kitchen, Dining, Living, Bedroom, Bathroom
       Front wall removed (cutaway). Same layout, old vs modern.
       Layout (top-down, camera faces -Z):
         Back row:  [Bathroom | Kitchen+Dining]  (z: -HD to 0)
         Front row: [Bedroom  | Living Room    ]  (z: 0 to HD)
       ═════════════════════════════════════════════════════ */
    var HW = 10, HD = 7, WH = 4, WT = 0.15;
    var steel = mat(0xC0C0C0, 0.2, 0.2);

    // Shared foundation
    var slab = box(HW * 2 + 1, 0.3, HD * 2 + 1, mat(0xC0B8A8, 0.95));
    slab.position.set(0, -0.15, 0); slab.receiveShadow = true;
    revScene.add(slab);

    /* ═══ OLD HOUSE — dated 90s interior ═══ */
    var oldGroup = new THREE.Group();
    var oW = mat(0xD4C9A8, 0.92); oW.side = THREE.DoubleSide;
    var oCab = mat(0x5C4A38, 0.88);
    var oCt = mat(0x8B7D6B, 0.82);
    var oFab = mat(0x6B5538, 0.85);

    // Floor + outer walls (no front wall, no ceiling for cutaway)
    addM(oldGroup, box(HW * 2, 0.05, HD * 2, mat(0xB5A88A, 0.88)), 0, 0.025, 0);
    addM(oldGroup, box(HW * 2, WH, WT, oW), 0, WH / 2, -HD);  // back
    addM(oldGroup, box(WT, WH, HD * 2, oW), -HW, WH / 2, 0);  // left
    addM(oldGroup, box(WT, WH, HD * 2, oW.clone()), HW, WH / 2, 0);  // right

    // Interior walls: translucent with doorway openings
    var oWi = new THREE.MeshStandardMaterial({ color: 0xD4C9A8, roughness: 0.92, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    var DW = 2.5, DH = 2.8; // door width, door height

    // Horizontal divider at z=0 — with doorways at x=-5 (bed→bath) and x=5 (living→kitchen)
    addM(oldGroup, box(3.5, WH, WT, oWi), -8.25, WH / 2, 0);         // left segment
    addM(oldGroup, box(DW, WH - DH, WT, oWi.clone()), -5, WH - (WH - DH) / 2, 0); // door header left
    addM(oldGroup, box(7, WH, WT, oWi.clone()), 0, WH / 2, 0);       // center segment
    addM(oldGroup, box(DW, WH - DH, WT, oWi.clone()), 5, WH - (WH - DH) / 2, 0);  // door header right
    addM(oldGroup, box(3.5, WH, WT, oWi.clone()), 8.25, WH / 2, 0);  // right segment

    // Vertical divider at x=0 (front row) — doorway at z=3.5 (bed↔living)
    addM(oldGroup, box(WT, WH, 2.5, oWi.clone()), 0, WH / 2, 1.25);  // bottom segment
    addM(oldGroup, box(WT, WH - DH, DW, oWi.clone()), 0, WH - (WH - DH) / 2, 3.5); // header
    addM(oldGroup, box(WT, WH, 2.5, oWi.clone()), 0, WH / 2, 5.75);  // top segment

    // Vertical divider at x=-3 (back row) — doorway at z=-3.5 (bath↔kitchen)
    addM(oldGroup, box(WT, WH, 2.5, oWi.clone()), -3, WH / 2, -5.75); // bottom
    addM(oldGroup, box(WT, WH - DH, DW, oWi.clone()), -3, WH - (WH - DH) / 2, -3.5); // header
    addM(oldGroup, box(WT, WH, 2.5, oWi.clone()), -3, WH / 2, -1.25); // top

    // Small windows on back wall
    var oGl = new THREE.MeshStandardMaterial({ color: 0x87CEEB, roughness: 0.15, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    [[-7, 2.2], [5, 2.2]].forEach(function(wp) {
      addM(oldGroup, box(1.4, 1.2, 0.06, mat(0x6B5D4A, 0.8)), wp[0], wp[1], -HD - 0.04);
      addM(oldGroup, new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1), oGl), wp[0], wp[1], -HD - 0.05);
    });

    // Gable roof
    var PEAK = WH + 2.8, OVH = 0.8;
    var roofGeo = new THREE.BufferGeometry();
    roofGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -HW - OVH, WH, -HD - OVH,  HW + OVH, WH, -HD - OVH,  0, PEAK, -HD - OVH,
      -HW - OVH, WH, HD + OVH,  0, PEAK, HD + OVH,  HW + OVH, WH, HD + OVH,
      -HW - OVH, WH, -HD - OVH,  0, PEAK, -HD - OVH,  -HW - OVH, WH, HD + OVH,
      0, PEAK, -HD - OVH,  0, PEAK, HD + OVH,  -HW - OVH, WH, HD + OVH,
      HW + OVH, WH, -HD - OVH,  HW + OVH, WH, HD + OVH,  0, PEAK, -HD - OVH,
      0, PEAK, -HD - OVH,  HW + OVH, WH, HD + OVH,  0, PEAK, HD + OVH
    ]), 3));
    roofGeo.computeVertexNormals();
    addM(oldGroup, new THREE.Mesh(roofGeo, mat(0x5A4A3A, 0.8)), 0, 0, 0).castShadow = true;

    // ── OLD KITCHEN (back-right: x 0 to HW, z -HD to 0) ──
    addM(oldGroup, box(4, 0.9, 0.55, oCab), 5.5, 0.45, -HD + 0.4);
    addM(oldGroup, box(4.1, 0.04, 0.6, oCt), 5.5, 0.92, -HD + 0.4);
    addM(oldGroup, box(0.55, 0.9, 2, oCab), HW - 0.4, 0.45, -HD + 1.8);
    addM(oldGroup, box(0.6, 0.04, 2.1, oCt), HW - 0.4, 0.92, -HD + 1.8);
    addM(oldGroup, box(3.5, 0.7, 0.3, oCab), 5.5, 2.6, -HD + 0.25);
    addM(oldGroup, box(0.75, 1.8, 0.65, mat(0xC8BFA0, 0.82)), HW - 0.5, 0.9, -HD + 0.45);
    addM(oldGroup, box(0.6, 0.9, 0.55, mat(0xAAAAAA, 0.7, 0.1)), 2.5, 0.45, -HD + 0.4);
    // Old dining table + 4 chairs (kitchen area)
    addM(oldGroup, box(1.6, 0.05, 1.0, oFab), 5, 0.78, -HD + 4.5);
    [[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].forEach(function(lp) {
      addM(oldGroup, box(0.05, 0.76, 0.05, oCab), 5 + lp[0], 0.38, -HD + 4.5 + lp[1]);
    });
    [[-0.55, -0.65], [0.55, -0.65], [-0.55, 0.65], [0.55, 0.65]].forEach(function(cp) {
      addM(oldGroup, box(0.38, 0.04, 0.38, oCab), 5 + cp[0], 0.45, -HD + 4.5 + cp[1]);
    });

    // ── OLD BATHROOM (back-left: x -HW to -3, z -HD to 0) ──
    // Old vanity
    addM(oldGroup, box(2, 0.9, 0.5, oCab), -6.5, 0.45, -HD + 0.4);
    addM(oldGroup, box(2.1, 0.04, 0.55, mat(0xCCC5B0, 0.8)), -6.5, 0.92, -HD + 0.4);
    // Mirror
    addM(oldGroup, box(1.2, 1.0, 0.04, mat(0xAABBCC, 0.1, 0.3)), -6.5, 2.0, -HD + 0.15);
    // Old bathtub
    addM(oldGroup, box(1.8, 0.6, 0.7, mat(0xE8E0D0, 0.85)), -6.5, 0.3, -HD + 3.5);
    addM(oldGroup, box(1.7, 0.04, 0.6, mat(0xCCC5B0, 0.5)), -6.5, 0.58, -HD + 3.5);
    // Old toilet
    addM(oldGroup, box(0.45, 0.45, 0.55, mat(0xE8E4DE, 0.8)), -4, 0.22, -HD + 0.5);
    addM(oldGroup, box(0.45, 0.5, 0.08, mat(0xE8E4DE, 0.8)), -4, 0.7, -HD + 0.22);
    // Bathroom tile floor (slightly different color)
    addM(oldGroup, box(6.7, 0.01, HD - WT, mat(0xCCC5B0, 0.9)), -6.5, 0.06, -HD / 2);

    // ── OLD BEDROOM (front-left: x -HW to 0, z 0 to HD) ──
    // Old double bed
    addM(oldGroup, box(2.5, 0.4, 2, mat(0x6B5D4A, 0.85)), -5, 0.2, 4);  // frame
    addM(oldGroup, box(2.4, 0.2, 1.9, mat(0x8B7D6B, 0.8)), -5, 0.5, 4);  // mattress
    addM(oldGroup, box(2.5, 0.6, 0.12, mat(0x5C4A38, 0.85)), -5, 0.7, 5);  // headboard
    addM(oldGroup, box(0.8, 0.15, 1.2, mat(0xCCC5B0, 0.7)), -5, 0.65, 3.5);  // pillow
    // Nightstand
    addM(oldGroup, box(0.55, 0.55, 0.45, oCab), -3.3, 0.28, 4.8);
    // Old dresser against left wall
    addM(oldGroup, box(0.5, 0.85, 1.5, oCab), -HW + 0.4, 0.42, 2);
    // Old wardrobe
    addM(oldGroup, box(1.2, 2.2, 0.55, oCab), -HW + 0.7, 1.1, 5.5);

    // ── OLD LIVING ROOM (front-right: x 0 to HW, z 0 to HD) ──
    // Bulky sofa
    addM(oldGroup, box(3, 0.38, 0.85, mat(0x5C4A38, 0.88)), 5, 0.19, 4.5);
    addM(oldGroup, box(3, 0.2, 0.12, mat(0x4A3828, 0.88)), 5, 0.52, 4.85);
    addM(oldGroup, box(0.12, 0.35, 0.85, mat(0x4A3828, 0.88)), 3.5, 0.42, 4.5);
    addM(oldGroup, box(0.12, 0.35, 0.85, mat(0x4A3828, 0.88)), 6.5, 0.42, 4.5);
    // Coffee table
    addM(oldGroup, box(1.2, 0.05, 0.6, oFab), 5, 0.42, 3.2);
    addM(oldGroup, box(0.07, 0.4, 0.07, oCab), 4.5, 0.2, 2.95);
    addM(oldGroup, box(0.07, 0.4, 0.07, oCab), 5.5, 0.2, 2.95);
    addM(oldGroup, box(0.07, 0.4, 0.07, oCab), 4.5, 0.2, 3.45);
    addM(oldGroup, box(0.07, 0.4, 0.07, oCab), 5.5, 0.2, 3.45);
    // Old boxy TV
    addM(oldGroup, box(1, 0.5, 0.4, mat(0x444444, 0.5)), 5, 0.6, 1.5);
    addM(oldGroup, box(1.2, 0.08, 0.4, oFab), 5, 0.28, 1.5);
    // Bookshelf
    addM(oldGroup, box(1.2, 2.2, 0.35, oCab), HW - 0.5, 1.1, 1.5);

    // Old rugs in each room
    addM(oldGroup, box(3, 0.01, 2.5, mat(0x8B7D6B, 0.92)), -5, 0.06, 4);    // bedroom (faded)
    addM(oldGroup, box(3, 0.01, 2.5, mat(0x8B7D6B, 0.92)), 5, 0.06, 3.5);   // living room
    addM(oldGroup, box(1, 0.01, 0.6, mat(0x9B8A78, 0.9)), -6.5, 0.06, -HD + 5.5); // bathroom mat

    // Old lights
    var oldLight = new THREE.PointLight(0xFFCC88, 1.5, 10, 2);
    oldLight.position.set(5, WH - 0.4, 3); oldGroup.add(oldLight);
    var oldLight2 = new THREE.PointLight(0xFFCC88, 1.5, 10, 2);
    oldLight2.position.set(5, WH - 0.4, -3); oldGroup.add(oldLight2);
    var oldLight3 = new THREE.PointLight(0xFFCC88, 1, 8, 2);
    oldLight3.position.set(-5, WH - 0.4, 4); oldGroup.add(oldLight3);

    revScene.add(oldGroup);

    /* ═══ NEW HOUSE — modern luxury ═══ */
    var newGroup = new THREE.Group();
    var nW = mat(0xF5F2EE, 0.85); nW.side = THREE.DoubleSide;
    var nCab = mat(0xF0ECE6, 0.55);
    var nQtz = mat(0xE8E2D8, 0.3, 0.08);
    var nGl = new THREE.MeshStandardMaterial({ color: 0x88BBDD, roughness: 0.05, transparent: true, opacity: 0.2, side: THREE.DoubleSide });

    // Floor + outer walls (no front)
    addM(newGroup, box(HW * 2, 0.05, HD * 2, mat(0xDDD3BE, 0.55)), 0, 0.025, 0);
    addM(newGroup, box(HW * 2, WH, WT, nW), 0, WH / 2, -HD);  // back
    addM(newGroup, box(WT, WH, HD * 2, nW), -HW, WH / 2, 0);  // left
    addM(newGroup, box(WT, WH, HD * 2, nW.clone()), HW, WH / 2, 0);  // right

    // Interior walls — translucent with modern wide doorway openings
    var nWi = new THREE.MeshStandardMaterial({ color: 0xF5F2EE, roughness: 0.85, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    var nDW = 3, nDH = 3.2; // modern wider doors, taller openings

    // Horizontal divider at z=0 — doorways at x=-5 and x=5
    addM(newGroup, box(3, WH, WT, nWi), -8.5, WH / 2, 0);
    addM(newGroup, box(nDW, WH - nDH, WT, nWi.clone()), -5, WH - (WH - nDH) / 2, 0);
    addM(newGroup, box(7, WH, WT, nWi.clone()), 0, WH / 2, 0);
    addM(newGroup, box(nDW, WH - nDH, WT, nWi.clone()), 5, WH - (WH - nDH) / 2, 0);
    addM(newGroup, box(3, WH, WT, nWi.clone()), 8.5, WH / 2, 0);

    // Vertical divider at x=0 (front) — wide opening at z=3.5 (bed↔living)
    addM(newGroup, box(WT, WH, 2, nWi.clone()), 0, WH / 2, 1);
    addM(newGroup, box(WT, WH - nDH, nDW, nWi.clone()), 0, WH - (WH - nDH) / 2, 3.5);
    addM(newGroup, box(WT, WH, 2, nWi.clone()), 0, WH / 2, 6);

    // Vertical divider at x=-3 (back) — wide opening at z=-3.5 (bath↔kitchen)
    addM(newGroup, box(WT, WH, 2, nWi.clone()), -3, WH / 2, -6);
    addM(newGroup, box(WT, WH - nDH, nDW, nWi.clone()), -3, WH - (WH - nDH) / 2, -3.5);
    addM(newGroup, box(WT, WH, 2, nWi.clone()), -3, WH / 2, -1);

    // Floor-to-ceiling windows on back wall
    var nFr = mat(0x1A1816, 0.4, 0.25);
    [[-7, 0.15, 2.2, 3.6], [5, 0.15, 2.2, 3.6]].forEach(function(wp) {
      addM(newGroup, box(wp[2] + 0.1, wp[3] + 0.1, 0.04, nFr), wp[0], wp[1] + wp[3] / 2, -HD - 0.02);
      addM(newGroup, new THREE.Mesh(new THREE.PlaneGeometry(wp[2], wp[3]), nGl), wp[0], wp[1] + wp[3] / 2, -HD - 0.03);
    });

    // Modern flat roof (semi-transparent for cutaway)
    var nRoofMat = new THREE.MeshStandardMaterial({ color: 0x3A3530, roughness: 0.7, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    addM(newGroup, box(HW * 2 + 1, 0.12, HD * 2 + 1, nRoofMat), 0, WH - 0.06, 0).castShadow = true;
    addM(newGroup, box(HW * 2 + 1, 0.08, 0.06, mat(0xF5F0E8, 0.6)), 0, WH - 0.1, -HD - 0.5);

    // ── NEW KITCHEN + DINING (back-right: x -3 to HW, z -HD to 0) ──
    addM(newGroup, box(4, 0.9, 0.5, nCab), 5.5, 0.45, -HD + 0.35);
    addM(newGroup, box(4.1, 0.04, 0.55, nQtz), 5.5, 0.92, -HD + 0.35);
    addM(newGroup, box(2.8, 0.04, 0.25, mat(0xDED5C4, 0.5)), 5.5, 1.7, -HD + 0.2);
    addM(newGroup, box(2.8, 0.04, 0.25, mat(0xDED5C4, 0.5)), 5.5, 2.3, -HD + 0.2);
    addM(newGroup, box(0.8, 2.2, 0.65, steel), HW - 0.5, 1.1, -HD + 0.45);
    addM(newGroup, box(0.65, 0.9, 0.5, steel), 3, 0.45, -HD + 0.35);
    addM(newGroup, box(0.65, 0.02, 0.5, mat(0x222222, 0.4)), 3, 0.91, -HD + 0.35);
    addM(newGroup, box(0.7, 0.18, 0.35, steel), 3, 2.2, -HD + 0.28);
    // Waterfall island
    addM(newGroup, box(2.8, 0.9, 0.8, nCab), 5, 0.45, -HD + 2.5);
    addM(newGroup, box(3, 0.05, 0.9, nQtz), 5, 0.93, -HD + 2.5);
    addM(newGroup, box(0.05, 0.9, 0.9, nQtz), 3.5, 0.45, -HD + 2.5);
    for (var bs = 0; bs < 3; bs++) {
      addM(newGroup, box(0.3, 0.04, 0.3, mat(0x2C3E50, 0.7)), 4.2 + bs * 0.8, 0.68, -HD + 3.4);
      addM(newGroup, box(0.03, 0.66, 0.03, steel), 4.2 + bs * 0.8, 0.33, -HD + 3.4);
    }
    // Modern dining table (back-right, near center)
    addM(newGroup, box(1.8, 0.06, 1.2, mat(0x8B7355, 0.7)), 1.5, 0.78, -3.5);
    [[-0.7, -0.45], [0.7, -0.45], [-0.7, 0.45], [0.7, 0.45]].forEach(function(lp) {
      addM(newGroup, box(0.04, 0.76, 0.04, mat(0x6B5040, 0.75)), 1.5 + lp[0], 0.38, -3.5 + lp[1]);
    });
    [[-0.6, -0.7], [0.6, -0.7], [-0.6, 0.7], [0.6, 0.7]].forEach(function(cp) {
      addM(newGroup, box(0.36, 0.04, 0.36, mat(0x9B8565, 0.7)), 1.5 + cp[0], 0.45, -3.5 + cp[1]);
      addM(newGroup, box(0.36, 0.3, 0.04, mat(0x9B8565, 0.7)), 1.5 + cp[0], 0.68, -3.5 + cp[1] + (cp[1] > 0 ? 0.16 : -0.16));
    });

    // ── NEW BATHROOM (back-left: x -HW to -3, z -HD to 0) ──
    // Modern vanity (floating)
    addM(newGroup, box(2.2, 0.5, 0.5, nCab), -6.5, 0.7, -HD + 0.4);
    addM(newGroup, box(2.3, 0.04, 0.55, nQtz), -6.5, 0.95, -HD + 0.4);
    // Frameless mirror
    addM(newGroup, box(1.8, 1.2, 0.03, mat(0xBBCCDD, 0.05, 0.4)), -6.5, 2.0, -HD + 0.13);
    // Walk-in shower (glass enclosure)
    var showerGlass = new THREE.MeshStandardMaterial({ color: 0x99BBCC, roughness: 0.05, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    addM(newGroup, new THREE.Mesh(new THREE.PlaneGeometry(2, WH - 0.2), showerGlass), -6.5, WH / 2, -HD + 4);
    addM(newGroup, box(2, 0.02, 2.5, mat(0xCCC8C0, 0.6)), -6.5, 0.06, -HD + 2.5);
    // Rain shower head
    addM(newGroup, box(0.03, 1, 0.03, steel), -6.5, WH - 0.5, -HD + 1);
    addM(newGroup, box(0.3, 0.03, 0.3, steel), -6.5, WH - 1, -HD + 1);
    // Modern toilet
    addM(newGroup, box(0.4, 0.4, 0.55, mat(0xF5F2EE, 0.6)), -4, 0.2, -HD + 0.5);
    addM(newGroup, box(0.4, 0.45, 0.06, mat(0xF5F2EE, 0.6)), -4, 0.62, -HD + 0.22);
    // Bathroom floor tile
    addM(newGroup, box(6.7, 0.01, HD - WT, mat(0xE8E4DE, 0.6)), -6.5, 0.06, -HD / 2);

    // ── NEW BEDROOM (front-left: x -HW to 0, z 0 to HD) ──
    // Platform bed (modern low-profile)
    addM(newGroup, box(2.8, 0.15, 2.2, mat(0x8B7355, 0.7)), -5, 0.08, 4);  // platform
    addM(newGroup, box(2.6, 0.25, 2, mat(0xE8E4DE, 0.6)), -5, 0.32, 4);  // mattress
    addM(newGroup, box(2.8, 0.5, 0.08, mat(0x8B7355, 0.7)), -5, 0.55, 5);  // headboard
    // Pillows
    addM(newGroup, box(0.6, 0.12, 0.4, mat(0xF0ECE6, 0.7)), -5.4, 0.52, 4.6);
    addM(newGroup, box(0.6, 0.12, 0.4, mat(0xF0ECE6, 0.7)), -4.6, 0.52, 4.6);
    addM(newGroup, box(0.35, 0.1, 0.3, mat(0xc9a96e, 0.7)), -5, 0.5, 4.3);
    // Modern nightstands
    addM(newGroup, box(0.5, 0.4, 0.4, nCab), -3.3, 0.2, 4.8);
    addM(newGroup, box(0.5, 0.4, 0.4, nCab), -6.7, 0.2, 4.8);
    // Dresser (floating, against left wall)
    addM(newGroup, box(0.4, 0.5, 1.4, nCab), -HW + 0.35, 0.6, 2);
    addM(newGroup, box(0.42, 0.03, 1.42, nQtz), -HW + 0.35, 0.85, 2);
    // Area rug under bed
    addM(newGroup, box(3.5, 0.01, 3, mat(0xC5B8A5, 0.92)), -5, 0.06, 4);
    // Pendant bedside lights
    addM(newGroup, box(0.015, 0.5, 0.015, steel), -3.3, WH - 0.25, 4.8);
    addM(newGroup, box(0.15, 0.15, 0.15, mat(0x222222, 0.4, 0.3)), -3.3, WH - 0.55, 4.8);
    addM(newGroup, box(0.015, 0.5, 0.015, steel), -6.7, WH - 0.25, 4.8);
    addM(newGroup, box(0.15, 0.15, 0.15, mat(0x222222, 0.4, 0.3)), -6.7, WH - 0.55, 4.8);

    // ── NEW LIVING ROOM (front-right: x 0 to HW, z 0 to HD) ──
    // L-shaped sectional (near divider wall, facing far wall)
    addM(newGroup, box(3, 0.35, 0.9, mat(0x8A9AAA, 0.8)), 5, 0.18, 2);
    addM(newGroup, box(3, 0.22, 0.1, mat(0x7A8A98, 0.8)), 5, 0.52, 1.6);
    addM(newGroup, box(0.9, 0.35, 1.5, mat(0x8A9AAA, 0.8)), 3.6, 0.18, 3.2);
    addM(newGroup, box(0.1, 0.22, 1.5, mat(0x7A8A98, 0.8)), 3.15, 0.52, 3.2);
    addM(newGroup, box(0.35, 0.25, 0.08, mat(0xc9a96e, 0.75)), 4, 0.44, 1.65);
    addM(newGroup, box(0.35, 0.25, 0.08, mat(0x9AACBA, 0.75)), 6, 0.44, 1.65);
    // Glass coffee table
    var glM = new THREE.MeshStandardMaterial({ color: 0x99BBCC, roughness: 0.08, transparent: true, opacity: 0.35 });
    addM(newGroup, box(1.0, 0.04, 0.6, glM), 5, 0.38, 3.8);
    addM(newGroup, box(0.03, 0.35, 0.03, steel), 4.55, 0.17, 3.55);
    addM(newGroup, box(0.03, 0.35, 0.03, steel), 5.45, 0.17, 3.55);
    addM(newGroup, box(0.03, 0.35, 0.03, steel), 4.55, 0.17, 4.05);
    addM(newGroup, box(0.03, 0.35, 0.03, steel), 5.45, 0.17, 4.05);
    // Wall-mounted TV (far wall, away from doorway)
    addM(newGroup, box(2.2, 1.2, 0.03, mat(0x111111, 0.3, 0.1)), 5, 1.8, 5.8);
    addM(newGroup, box(2.4, 0.08, 0.3, mat(0xDDD3BE, 0.5)), 5, 0.65, 5.6);
    // Area rug
    addM(newGroup, box(3.5, 0.01, 3, mat(0xC5B8A5, 0.92)), 5, 0.06, 3.5);
    // Floor lamp (near sofa side)
    addM(newGroup, box(0.2, 0.02, 0.2, steel), 7.5, 0.01, 1.5);
    addM(newGroup, box(0.03, 1.8, 0.03, steel), 7.5, 0.9, 1.5);
    addM(newGroup, box(0.3, 0.18, 0.3, mat(0xF0ECE6, 0.7)), 7.5, 1.7, 1.5);
    // Plant
    addM(newGroup, box(0.22, 0.45, 0.22, mat(0x777777, 0.6)), HW - 0.4, 0.22, HD - 0.4);
    addM(newGroup, box(0.06, 0.8, 0.06, mat(0x5A4A3A, 0.8)), HW - 0.4, 0.85, HD - 0.4);
    addM(newGroup, box(0.22, 0.04, 0.18, mat(0x3A6B4A, 0.75)), HW - 0.4, 1.1, HD - 0.4);
    addM(newGroup, box(0.18, 0.04, 0.22, mat(0x3A6B4A, 0.75)), HW - 0.4, 1.25, HD - 0.4);

    // Modern rugs in each room
    // Bedroom rug (cream with gold border feel)
    addM(newGroup, box(3.5, 0.01, 3, mat(0xC5B8A5, 0.92)), -5, 0.06, 4);
    addM(newGroup, box(3.5, 0.012, 0.04, mat(0xc9a96e, 0.8)), -5, 0.065, 2.5);
    addM(newGroup, box(3.5, 0.012, 0.04, mat(0xc9a96e, 0.8)), -5, 0.065, 5.5);
    // Living room rug
    addM(newGroup, box(3.5, 0.01, 3, mat(0xC5B8A5, 0.92)), 5, 0.06, 3.5);
    addM(newGroup, box(3.5, 0.012, 0.04, mat(0xc9a96e, 0.8)), 5, 0.065, 2);
    addM(newGroup, box(3.5, 0.012, 0.04, mat(0xc9a96e, 0.8)), 5, 0.065, 5);
    // Kitchen runner
    addM(newGroup, box(2.5, 0.01, 0.6, mat(0xBCB19C, 0.85)), 5, 0.06, -HD + 3.8);
    // Bathroom mat
    addM(newGroup, box(1.2, 0.01, 0.5, mat(0xE8E4DE, 0.7)), -6.5, 0.06, -HD + 5);
    // Dining area rug
    addM(newGroup, box(2.5, 0.01, 2, mat(0xC0B5A2, 0.9)), 1.5, 0.06, -3.5);

    // New lights
    var nL1 = new THREE.PointLight(0xFFF5E8, 2.5, 10, 2);
    nL1.position.set(5, WH - 0.3, 3); newGroup.add(nL1);
    var nL2 = new THREE.PointLight(0xFFF5E8, 2, 10, 2);
    nL2.position.set(5, WH - 0.3, -3); newGroup.add(nL2);
    var nL3 = new THREE.PointLight(0xFFF5E8, 1.5, 8, 2);
    nL3.position.set(-5, WH - 0.3, 4); newGroup.add(nL3);
    var nL4 = new THREE.PointLight(0xFFF5E8, 1.5, 8, 2);
    nL4.position.set(-6, WH - 0.3, -3); newGroup.add(nL4);

    newGroup.visible = false;
    revScene.add(newGroup);

    /* ── Slider Mechanics ── */
    var sliderEl = section.querySelector('.sv-reveal-slider');
    var handleEl = section.querySelector('.sv-reveal-handle');
    var labelBefore = section.querySelector('.sv-reveal-label-before');
    var labelAfter = section.querySelector('.sv-reveal-label-after');
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
    function onPointerUp() {
      isDragging = false;
    }

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    updateSliderPos();

    /* ── Render loop with scissor ── */
    var revNeedsRender = true;

    function revRender() {
      requestAnimationFrame(revRender);

      // Resize check
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

      // LEFT side: show old, hide new
      oldGroup.visible = true;
      newGroup.visible = false;
      revRenderer.setScissor(0, 0, pixelX, totalH);
      revRenderer.setViewport(0, 0, totalW, totalH);
      revRenderer.render(revScene, revCamera);

      // RIGHT side: show new, hide old
      oldGroup.visible = false;
      newGroup.visible = true;
      revRenderer.setScissor(pixelX, 0, totalW - pixelX, totalH);
      revRenderer.setViewport(0, 0, totalW, totalH);
      revRenderer.render(revScene, revCamera);

      revRenderer.setScissorTest(false);

      // Reset visibility for next frame
      oldGroup.visible = true;
      newGroup.visible = true;
    }
    revRender();

    /* ── Handle resize ── */
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

    /* ── Stat values: scale-in ── */
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
    initProcessCards();
    initBeforeAfterSlider();
    initScrollAnimations();
  });

})();
