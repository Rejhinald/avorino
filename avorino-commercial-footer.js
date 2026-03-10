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
     HERO — Three.js Multi-Story Commercial Building
     Scroll-pinned: floor plates, curtain wall grid,
     windows light up progressively
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
    camera.position.set(14, 8, 18);
    camera.lookAt(0, 3.5, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var windowColor = 0xc9a96e;

    /* ── Building structure — 2-story commercial (14 wide, 10 deep) ── */
    var buildingGroup = new THREE.Group();
    var structMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var floors = 2;
    var floorH = 3.5;
    var hW = 7, hD = 5; // half-width, half-depth
    var wH = floorH * floors; // total wall height = 7
    var parH = 0.5; // parapet above roof

    // Floor plates (ground, 1st floor, 2nd floor/roof)
    for (var fl = 0; fl <= floors; fl++) {
      var y = fl * floorH;
      var plateGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, y, -hD), new THREE.Vector3(hW, y, -hD),
        new THREE.Vector3(hW, y, hD), new THREE.Vector3(-hW, y, hD),
        new THREE.Vector3(-hW, y, -hD),
      ]);
      buildingGroup.add(new THREE.Line(plateGeo, structMat.clone()));
    }

    // Parapet outline at top
    var parapetY = wH + parH;
    var parapetGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW, parapetY, -hD), new THREE.Vector3(hW, parapetY, -hD),
      new THREE.Vector3(hW, parapetY, hD), new THREE.Vector3(-hW, parapetY, hD),
      new THREE.Vector3(-hW, parapetY, -hD),
    ]);
    buildingGroup.add(new THREE.Line(parapetGeo, structMat.clone()));

    // Vertical columns at corners and mid-points
    var colPositions = [
      [-hW, -hD], [0, -hD], [hW, -hD],
      [-hW, hD], [0, hD], [hW, hD],
      [-hW, 0], [hW, 0],
    ];
    colPositions.forEach(function(cp) {
      var colGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cp[0], 0, cp[1]),
        new THREE.Vector3(cp[0], parapetY, cp[1]),
      ]);
      buildingGroup.add(new THREE.Line(colGeo, structMat.clone()));
    });

    // Wall outline edges (front, back, sides) at each floor
    for (var wfl = 0; wfl < floors; wfl++) {
      var yBot = wfl * floorH;
      var yTop = (wfl + 1) * floorH;
      // Front and back horizontal mid-rails
      [-hD, hD].forEach(function(z) {
        var midY = (yBot + yTop) / 2;
        buildingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-hW, midY, z), new THREE.Vector3(hW, midY, z)
        ]), structMat.clone()));
      });
    }
    scene.add(buildingGroup);

    /* ── Windows ── */
    var windowGroup = new THREE.Group();
    var windowMaterials = [];

    // Ground floor — large storefront windows (1.5w x 2.5h, bottom at 0.5)
    for (var gx = 0; gx < 5; gx++) {
      var sfX = -hW + 1.2 + gx * 2.8;
      // Skip center for entrance door
      if (gx === 2) continue;
      var sfMat = new THREE.LineBasicMaterial({ color: windowColor, transparent: true, opacity: 0 });
      windowMaterials.push({ mat: sfMat, floor: 0, col: gx });
      var sfGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sfX, 0.5, -hD - 0.01),
        new THREE.Vector3(sfX + 2, 0.5, -hD - 0.01),
        new THREE.Vector3(sfX + 2, 3.0, -hD - 0.01),
        new THREE.Vector3(sfX, 3.0, -hD - 0.01),
        new THREE.Vector3(sfX, 0.5, -hD - 0.01),
      ]);
      windowGroup.add(new THREE.Line(sfGeo, sfMat));
    }

    // Entrance door (centered on front)
    var doorMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    windowMaterials.push({ mat: doorMat, floor: 0, col: 2 });
    windowGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1, 0, -hD - 0.01), new THREE.Vector3(1, 0, -hD - 0.01),
      new THREE.Vector3(1, 3.0, -hD - 0.01), new THREE.Vector3(-1, 3.0, -hD - 0.01),
      new THREE.Vector3(-1, 0, -hD - 0.01),
    ]), doorMat));

    // Second floor — smaller office windows (1.5w x 1.5h, at y=4.2 to y=5.7)
    for (var ox = 0; ox < 6; ox++) {
      var offX = -hW + 0.8 + ox * 2.3;
      var offMat = new THREE.LineBasicMaterial({ color: windowColor, transparent: true, opacity: 0 });
      windowMaterials.push({ mat: offMat, floor: 1, col: ox });
      var offGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(offX, floorH + 0.7, -hD - 0.01),
        new THREE.Vector3(offX + 1.5, floorH + 0.7, -hD - 0.01),
        new THREE.Vector3(offX + 1.5, floorH + 2.2, -hD - 0.01),
        new THREE.Vector3(offX, floorH + 2.2, -hD - 0.01),
        new THREE.Vector3(offX, floorH + 0.7, -hD - 0.01),
      ]);
      windowGroup.add(new THREE.Line(offGeo, offMat));
    }

    // Side face windows (right side, both floors)
    for (var sfl = 0; sfl < floors; sfl++) {
      var swy = sfl * floorH;
      var sWinH = sfl === 0 ? 2.5 : 1.5;
      var sWinBot = sfl === 0 ? 0.5 : 0.7;
      for (var sz = 0; sz < 3; sz++) {
        var winZ = -hD + 1.5 + sz * 3;
        var sideMat = new THREE.LineBasicMaterial({ color: windowColor, transparent: true, opacity: 0 });
        windowMaterials.push({ mat: sideMat, floor: sfl, col: sz });
        var sideGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(hW + 0.01, swy + sWinBot, winZ),
          new THREE.Vector3(hW + 0.01, swy + sWinBot, winZ + 1.5),
          new THREE.Vector3(hW + 0.01, swy + sWinBot + sWinH, winZ + 1.5),
          new THREE.Vector3(hW + 0.01, swy + sWinBot + sWinH, winZ),
          new THREE.Vector3(hW + 0.01, swy + sWinBot, winZ),
        ]);
        windowGroup.add(new THREE.Line(sideGeo, sideMat));
      }
    }
    scene.add(windowGroup);

    /* ── Entrance canopy (accent) ── */
    var canopyGroup = new THREE.Group();
    var canopyMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    canopyGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, 3.2, -hD), new THREE.Vector3(2, 3.2, -hD),
      new THREE.Vector3(2, 3.2, -hD - 1.5), new THREE.Vector3(-2, 3.2, -hD - 1.5),
      new THREE.Vector3(-2, 3.2, -hD),
    ]), canopyMat));
    [[-2, -hD - 1.5], [2, -hD - 1.5]].forEach(function(sp) {
      canopyGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sp[0], 0, sp[1]), new THREE.Vector3(sp[0], 3.2, sp[1])
      ]), canopyMat));
    });
    scene.add(canopyGroup);

    /* ── Initial entrance: structure reveals ── */
    gsap.to({ v: 0 }, {
      v: 1, duration: 2.5, delay: 0.3, ease: 'power2.out',
      onUpdate: function() {
        var val = this.targets()[0].v;
        var total = buildingGroup.children.length;
        buildingGroup.children.forEach(function(child, idx) {
          var threshold = idx / total;
          child.material.opacity = Math.max(0, Math.min(0.3, (val - threshold) * 2));
        });
      }
    });
    gsap.to(canopyMat, { opacity: 0.5, duration: 1.0, delay: 2.5, ease: 'power2.out' });

    /* ═══ SCROLL-DRIVEN BUILD ═══
       0%–50%  : Structure solidifies, windows light up floor by floor
       50%–80% : All windows lit, canopy accent brightens
       80%–100%: Camera pulls back for full reveal
    ═══════════════════════════════════════ */
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        var p = self.progress;

        // Windows light up progressively floor by floor
        windowMaterials.forEach(function(wm) {
          var floorThreshold = wm.floor / floors;
          var progress = Math.max(0, (p - floorThreshold * 0.6) * floors * 0.8);
          wm.mat.opacity = Math.min(0.4, progress * 0.4);
        });

        // Canopy brightens
        canopyMat.opacity = 0.5 + p * 0.2;

        // Camera orbit changes
        camera.userData.scrollRadius = 20 + p * 5;
        camera.userData.scrollHeight = 8 + p * 5;
      }
    });

    /* ── Mouse + scroll ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var baseAngle = 0.3;
    camera.userData.scrollRadius = 20;
    camera.userData.scrollHeight = 8;

    function animate() {
      requestAnimationFrame(animate);
      baseAngle += 0.0012;

      var orbitR = camera.userData.scrollRadius;
      camera.position.set(
        Math.cos(baseAngle + mouseX * 0.25) * orbitR,
        camera.userData.scrollHeight + mouseY * 2,
        Math.sin(baseAngle + mouseX * 0.25) * orbitR
      );
      camera.lookAt(0, wH * 0.45, 0);
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

  /* ── Multi-Story Commercial Building: 24'x16' footprint, 2 floors ── */
  /* ── Commercial: Realistic Architecture (ADU Visualizer style) ── */
  var WT = 0.5;   // wall thickness
  var WH = 9;     // total wall height (2 floors x 4.5)
  var FH = 4.5;   // single floor height
  var BW = 20;    // building width (x)
  var BD = 14;    // building depth (z)

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

  // ── Corner posts (fill gaps where walls meet) ──
  function addCornerPost(g, x, z, wallMat) {
    var post = box(WT, WH, WT, wallMat);
    post.position.set(x, WH / 2, z);
    g.add(post);
  }

  // Urban grid with sidewalk + street edge + rear parking
  function buildProcGrid() {
    var g = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: 0x445566, transparent: true, opacity: 0.12 });
    for (var i = -10; i <= 10; i++) {
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2, 0.01, -14), new THREE.Vector3(i * 2, 0.01, 14)
      ]), gridMat.clone()));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0.01, i * 1.4), new THREE.Vector3(20, 0.01, i * 1.4)
      ]), gridMat.clone()));
    }
    // Sidewalk outline (front)
    var sidewalkMat = new THREE.LineBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.35 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-14, 0.02, -10), new THREE.Vector3(14, 0.02, -10),
      new THREE.Vector3(14, 0.02, -8.5), new THREE.Vector3(-14, 0.02, -8.5),
      new THREE.Vector3(-14, 0.02, -10)
    ]), sidewalkMat));
    // Street edge
    var streetMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.5 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-14, 0.02, -10.5), new THREE.Vector3(14, 0.02, -10.5)
    ]), streetMat));
    // Lot boundary
    var lotMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.4 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-13, 0.02, -8.5), new THREE.Vector3(13, 0.02, -8.5),
      new THREE.Vector3(13, 0.02, 10), new THREE.Vector3(-13, 0.02, 10),
      new THREE.Vector3(-13, 0.02, -8.5)
    ]), lotMat));
    // Rear parking lot stripes
    var parkMat = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.2 });
    for (var pk = -10; pk <= 10; pk += 2.5) {
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pk, 0.015, 7), new THREE.Vector3(pk, 0.015, 10)
      ]), parkMat.clone()));
    }
    return g;
  }

  // Commercial slab with loading dock
  function buildProcFoundation() {
    var g = new THREE.Group();
    var slabMat = mat(0xC8C3BC, 0.95);
    var slab = box(BW + 1, 0.8, BD + 1, slabMat);
    slab.position.set(0, -0.4, 0);
    g.add(slab);
    // Loading dock step at rear
    var dockMat = mat(0xB0ABA4, 0.9);
    var dock = box(8, 1.2, 2, dockMat);
    dock.position.set(4, -0.2, BD / 2 + 1.5);
    g.add(dock);
    // Floor finish — ground floor (polished concrete)
    var floorG = box(BW - WT * 2, 0.05, BD - WT * 2, mat(0xD5CFC8, 0.6));
    floorG.position.set(0, 0.01, 0);
    g.add(floorG);
    // Floor slab dividing ground and second floor
    var mezzMat = mat(0xC0BBB5, 0.9);
    var mezz = box(BW - WT * 2, 0.35, BD - WT * 2, mezzMat);
    mezz.position.set(0, FH, 0);
    g.add(mezz);
    // Second floor finish (carpet tile — muted)
    var floorU = box(BW - WT * 2, 0.05, BD - WT * 2, mat(0xBEB8B0, 0.85));
    floorU.position.set(0, FH + 0.19, 0);
    g.add(floorU);
    return g;
  }

  // 2-story commercial walls with proper openings (ADU Visualizer architecture)
  function buildProcWalls() {
    var g = new THREE.Group();
    var extMat = mat(0xEEEEEE, 0.88);
    extMat.transparent = true; extMat.opacity = 0.12; extMat.side = THREE.DoubleSide;
    var intMat = mat(0xFAFAFA, 0.92);
    intMat.transparent = true; intMat.opacity = 0.1; intMat.side = THREE.DoubleSide;
    var X0 = -BW / 2, X1 = BW / 2;
    var Z0 = -BD / 2, Z1 = BD / 2;

    // ── Front wall (south, z = Z0) — ground: storefront windows + entrance door; upper: office windows ──
    buildWallSegments(g, X0, X1, Z0, [
      // Ground floor: storefront windows + entrance
      { x: -7, y: 0.5, w: 4, h: 3.5 },    // left storefront
      { x: -2, y: 0.5, w: 4, h: 3.5 },    // center-left storefront
      { x: 2.5, y: 0, w: 3.5, h: 4 },     // glass entrance door
      { x: 7, y: 0.5, w: 4, h: 3.5 },     // right storefront
      // Second floor: office windows
      { x: -7, y: 5.5, w: 2.5, h: 2.5 },
      { x: -3, y: 5.5, w: 2.5, h: 2.5 },
      { x: 1, y: 5.5, w: 2.5, h: 2.5 },
      { x: 5, y: 5.5, w: 2.5, h: 2.5 },
      { x: 8.5, y: 5.5, w: 2, h: 2.5 },
    ], extMat, 'z');

    // ── Back wall (north, z = Z1) — REMOVED for cutaway view ──

    // ── Left wall (west, x = X0) — windows on both floors ──
    buildWallSegments(g, Z0, Z1, X0, [
      { x: -4, y: 0.5, w: 3, h: 3.5 },    // ground floor window
      { x: 3, y: 0.5, w: 3, h: 3.5 },     // ground floor window
      { x: -4, y: 5.5, w: 2.5, h: 2.5 },  // upper window
      { x: 3, y: 5.5, w: 2.5, h: 2.5 },   // upper window
    ], extMat, 'x');

    // ── Right wall (east, x = X1) — windows on both floors ──
    buildWallSegments(g, Z0, Z1, X1, [
      { x: -4, y: 0.5, w: 3, h: 3.5 },
      { x: 3, y: 0.5, w: 3, h: 3.5 },
      { x: -4, y: 5.5, w: 2.5, h: 2.5 },
      { x: 3, y: 5.5, w: 2.5, h: 2.5 },
    ], extMat, 'x');

    // ── Corner posts (building corners) ──
    addCornerPost(g, X0, Z0, extMat);
    addCornerPost(g, X1, Z0, extMat);
    addCornerPost(g, X0, Z1, extMat);
    addCornerPost(g, X1, Z1, extMat);

    // ── Mid-wall corner posts where tenant bays divide (ground floor demising lines) ──
    addCornerPost(g, -BW / 6, Z0, extMat);
    addCornerPost(g, BW / 6, Z0, extMat);

    // ── Interior demising walls (3 tenant bays on ground floor) ──
    // Bay divider 1 (x ~ -3.3) with doorway
    buildWallSegments(g, Z0 + WT, Z1 - WT, -BW / 6, [
      { x: 0, y: 0, w: 2.5, h: 4 },  // pass-through doorway
    ], intMat, 'x');
    // Bay divider 2 (x ~ 3.3) with doorway
    buildWallSegments(g, Z0 + WT, Z1 - WT, BW / 6, [
      { x: 0, y: 0, w: 2.5, h: 4 },
    ], intMat, 'x');

    return g;
  }

  // Flat commercial roof with parapet + mechanical units
  function buildProcRoof() {
    var g = new THREE.Group();
    var X0 = -BW / 2, X1 = BW / 2;
    var Z0 = -BD / 2, Z1 = BD / 2;

    // Flat roof deck — semi-transparent for cutaway
    var roofMat = new THREE.MeshStandardMaterial({
      color: 0x555555, roughness: 0.9, transparent: true, opacity: 0.25,
      side: THREE.DoubleSide
    });
    var roofGeo = new THREE.BufferGeometry();
    roofGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      X0, WH, Z0,  X1, WH, Z0,  X1, WH, Z1,
      X0, WH, Z0,  X1, WH, Z1,  X0, WH, Z1
    ]), 3));
    roofGeo.computeVertexNormals();
    var roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.castShadow = true; roofMesh.receiveShadow = true;
    g.add(roofMesh);

    // Parapet walls (0.5 height above wall top) — NO back parapet for cutaway
    var parapetMat = mat(0x999999, 0.85);
    var PH = 0.5;
    var pFront = box(BW, PH, 0.3, parapetMat);
    pFront.position.set(0, WH + PH / 2, Z0); g.add(pFront);
    var pLeft = box(0.3, PH, BD, parapetMat);
    pLeft.position.set(X0, WH + PH / 2, 0); g.add(pLeft);
    var pRight = box(0.3, PH, BD, parapetMat);
    pRight.position.set(X1, WH + PH / 2, 0); g.add(pRight);

    // Mechanical units (AC boxes) on roof
    var mechMat = mat(0x777777, 0.7);
    var ac1 = box(3, 2, 2.5, mechMat);
    ac1.position.set(-5, WH + 1, 2); g.add(ac1);
    var ac2 = box(2.5, 1.8, 2, mechMat);
    ac2.position.set(4, WH + 0.9, 4); g.add(ac2);
    var ac3 = box(2, 1.5, 1.5, mechMat);
    ac3.position.set(7, WH + 0.75, -2); g.add(ac3);

    return g;
  }

  // Windows: proper frames + glass (storefront ground floor + office upper floor)
  function buildProcWindows() {
    var g = new THREE.Group();
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, metalness: 0.1,
      transparent: true, opacity: 0.3, side: THREE.DoubleSide
    });
    var frameMat = mat(0x888888, 0.4, 0.2);    // aluminum storefront frame
    var doorFrameMat = mat(0x666666, 0.5, 0.15); // entrance door frame
    var Z0 = -BD / 2;
    var X0 = -BW / 2, X1 = BW / 2;

    // ── Window helper: frame (4 pieces) + mullion + glass ──
    function addWindow(x, y, z, w, h, rotY) {
      var fg = new THREE.Group();
      var fTop = box(w + 0.3, 0.15, 0.15, frameMat);
      fTop.position.set(0, h / 2 + 0.075, 0); fg.add(fTop);
      var fBot = box(w + 0.3, 0.15, 0.15, frameMat);
      fBot.position.set(0, -h / 2 - 0.075, 0); fg.add(fBot);
      var fL = box(0.15, h + 0.3, 0.15, frameMat);
      fL.position.set(-w / 2 - 0.075, 0, 0); fg.add(fL);
      var fR = box(0.15, h + 0.3, 0.15, frameMat);
      fR.position.set(w / 2 + 0.075, 0, 0); fg.add(fR);
      var mullion = box(0.08, h, 0.08, frameMat);
      fg.add(mullion);
      var glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat.clone());
      fg.add(glass);
      fg.position.set(x, y + h / 2, z);
      if (rotY) fg.rotation.y = rotY;
      g.add(fg);
    }

    // ── Door helper: frame + glass panel ──
    function addDoor(x, y, z, w, h, rotY) {
      var dg = new THREE.Group();
      var fTop = box(w + 0.4, 0.2, WT + 0.1, doorFrameMat);
      fTop.position.set(0, h + 0.1, 0); dg.add(fTop);
      var fL = box(0.2, h, WT + 0.1, doorFrameMat);
      fL.position.set(-w / 2 - 0.1, h / 2, 0); dg.add(fL);
      var fR = box(0.2, h, WT + 0.1, doorFrameMat);
      fR.position.set(w / 2 + 0.1, h / 2, 0); dg.add(fR);
      // Glass door panel
      var doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.2, h - 0.2), glassMat.clone());
      doorGlass.position.set(0, h / 2, 0); dg.add(doorGlass);
      // Horizontal push bar
      var pushBar = box(w * 0.6, 0.12, 0.12, frameMat);
      pushBar.position.set(0, h * 0.45, 0.12); dg.add(pushBar);
      dg.position.set(x, y, z);
      if (rotY) dg.rotation.y = rotY;
      g.add(dg);
    }

    // ── Ground floor storefront windows (front wall, large) ──
    addWindow(-7, 0.5, Z0 - 0.05, 4, 3.5, 0);
    addWindow(-2, 0.5, Z0 - 0.05, 4, 3.5, 0);
    addWindow(7, 0.5, Z0 - 0.05, 4, 3.5, 0);

    // ── Glass entrance door ──
    addDoor(2.5, 0, Z0, 3.5, 4, 0);

    // ── Second floor office windows (front wall) ──
    addWindow(-7, 5.5, Z0 - 0.05, 2.5, 2.5, 0);
    addWindow(-3, 5.5, Z0 - 0.05, 2.5, 2.5, 0);
    addWindow(1, 5.5, Z0 - 0.05, 2.5, 2.5, 0);
    addWindow(5, 5.5, Z0 - 0.05, 2.5, 2.5, 0);
    addWindow(8.5, 5.5, Z0 - 0.05, 2, 2.5, 0);

    // ── Left wall windows ── (x=wall, z=along wall)
    addWindow(X0 - 0.05, 0.5, -4, 3, 3.5, Math.PI / 2);
    addWindow(X0 - 0.05, 0.5, 3, 3, 3.5, Math.PI / 2);
    addWindow(X0 - 0.05, 5.5, -4, 2.5, 2.5, Math.PI / 2);
    addWindow(X0 - 0.05, 5.5, 3, 2.5, 2.5, Math.PI / 2);

    // ── Right wall windows ── (x=wall, z=along wall)
    addWindow(X1 + 0.05, 0.5, -4, 3, 3.5, Math.PI / 2);
    addWindow(X1 + 0.05, 0.5, 3, 3, 3.5, Math.PI / 2);
    addWindow(X1 + 0.05, 5.5, -4, 2.5, 2.5, Math.PI / 2);
    addWindow(X1 + 0.05, 5.5, 3, 2.5, 2.5, Math.PI / 2);

    return g;
  }

  // Interior: 3 tenant bays (ground) + offices (upper) + stairwell
  function buildProcInterior() {
    var g = new THREE.Group();
    var lights = [];
    var X0 = -BW / 2, X1 = BW / 2;   // -10, 10
    var Z0 = -BD / 2, Z1 = BD / 2;    // -7,  7
    var F2 = FH + 0.18; // second floor Y base

    // Ceiling lights
    var lightDefs = [
      { x: -BW / 3, y: FH - 0.3, z: 0, color: 0xFFD080, intensity: 4 },
      { x: 0, y: FH - 0.3, z: 0, color: 0xFFB050, intensity: 4.5 },
      { x: BW / 3, y: FH - 0.3, z: 0, color: 0xFFF5E8, intensity: 3.5 },
      { x: -4, y: WH - 0.3, z: 0, color: 0xFFF0D8, intensity: 3 },
      { x: 5, y: WH - 0.3, z: 0, color: 0xFFF0D8, intensity: 3 },
    ];
    lightDefs.forEach(function(def) {
      var light = new THREE.PointLight(def.color, def.intensity, 18, 2);
      light.position.set(def.x, def.y, def.z);
      light.userData._maxIntensity = def.intensity;
      g.add(light); lights.push(light);
    });
    g.userData.lights = lights;

    // Materials
    var woodMat = mat(0x8B7355, 0.7);
    var darkWood = mat(0x5C4033, 0.75);
    var fabricSlate = mat(0x4A5568, 0.85);
    var fabricDark = mat(0x3A4558, 0.88);
    var cushionMat = mat(0x546478, 0.82);
    var leatherMat = mat(0x2C3E50, 0.78);
    var marbleMat = mat(0xE8E2D8, 0.35, 0.05);
    var quartzMat = mat(0xF0EDE8, 0.3, 0.05);
    var steelMat = mat(0xC0C0C0, 0.25, 0.15);
    var blackMat = mat(0x111111, 0.3, 0.05);
    var whiteMat = mat(0xF5F0E8, 0.6);
    var redAccent = mat(0xc8222a, 0.5);
    var goldAccent = mat(0xc9a96e, 0.4, 0.1);
    var blueAccent = mat(0x2266AA, 0.5);

    // ═══ GROUND FLOOR — BAY 1: RETAIL (left third, x ≈ -6.67) ═══
    var bayX = -BW / 3; // ~ -6.67

    // Display counter — along front wall (Z0 side)
    var counterBase = box(3.5, 0.85, 0.8, whiteMat);
    counterBase.position.set(bayX, 0.43, Z0 + 1.2); g.add(counterBase);
    var counterTop = box(3.6, 0.06, 0.9, quartzMat);
    counterTop.position.set(bayX, 0.88, Z0 + 1.2); g.add(counterTop);
    // Glass display case on counter
    var displayGlass = mat(0x88AACC, 0.15, 0.1);
    displayGlass.transparent = true; displayGlass.opacity = 0.2;
    var displayCase = box(2.2, 0.5, 0.5, displayGlass);
    displayCase.position.set(bayX - 0.3, 1.16, Z0 + 1.2); g.add(displayCase);
    // Cash register on counter right side
    var registerBase = box(0.45, 0.28, 0.35, blackMat);
    registerBase.position.set(bayX + 1.3, 1.05, Z0 + 1.2); g.add(registerBase);
    var registerScreen = box(0.35, 0.3, 0.04, mat(0x222222, 0.4));
    registerScreen.position.set(bayX + 1.3, 1.36, Z0 + 1.0); registerScreen.rotation.x = -0.2; g.add(registerScreen);

    // Wall shelving unit — against left wall (X0 side), within bay 1 z-range
    var shelfBack = box(0.12, 3.2, 0.15, darkWood);
    shelfBack.position.set(X0 + 0.35, 1.6, 0); g.add(shelfBack);
    for (var sh = 0; sh < 4; sh++) {
      var shelf = box(0.5, 0.06, 3, woodMat);
      shelf.position.set(X0 + 0.55, 0.5 + sh * 0.85, 0); g.add(shelf);
    }
    // Shelf side brackets
    var shBracketF = box(0.12, 3.2, 0.15, darkWood);
    shBracketF.position.set(X0 + 0.35, 1.6, -1.4); g.add(shBracketF);
    var shBracketB = box(0.12, 3.2, 0.15, darkWood);
    shBracketB.position.set(X0 + 0.35, 1.6, 1.4); g.add(shBracketB);

    // Display table — center of bay 1
    var dTable = box(1.8, 0.06, 1.2, woodMat);
    dTable.position.set(bayX, 0.72, 2); g.add(dTable);
    [[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.5], [0.8, 0.5]].forEach(function(lp) {
      var dtLeg = box(0.05, 0.69, 0.05, steelMat);
      dtLeg.position.set(bayX + lp[0], 0.35, 2 + lp[1]); g.add(dtLeg);
    });

    // Signage strip above bay 1
    var sign1 = box(3.5, 0.4, 0.12, redAccent);
    sign1.position.set(bayX, FH - 0.3, Z0 + 0.15); g.add(sign1);

    // ═══ GROUND FLOOR — BAY 2: CAFE (center, x ≈ 0) ═══
    // Bar counter — against back wall (Z1 side)
    var barBase = box(4.5, 0.9, 0.7, darkWood);
    barBase.position.set(0, 0.45, Z1 - 1); g.add(barBase);
    var barTop = box(4.7, 0.06, 0.9, marbleMat);
    barTop.position.set(0, 0.93, Z1 - 1); g.add(barTop);
    // Waterfall edge on right end
    var barWF = box(0.06, 0.93, 0.9, marbleMat);
    barWF.position.set(2.35, 0.47, Z1 - 1); g.add(barWF);

    // Espresso machine — on bar, behind counter (server side, near wall)
    var espresso = box(0.45, 0.45, 0.35, steelMat);
    espresso.position.set(-1.5, 1.19, Z1 - 1); g.add(espresso);
    var espTop = box(0.4, 0.07, 0.3, blackMat);
    espTop.position.set(-1.5, 1.45, Z1 - 1); g.add(espTop);

    // Bar stools — in front of counter (customer side, facing bar)
    for (var bs = 0; bs < 4; bs++) {
      var stoolX = -1.6 + bs * 1.1;
      var stoolZ = Z1 - 2.2;
      var stoolSeat = box(0.4, 0.06, 0.4, leatherMat);
      stoolSeat.position.set(stoolX, 0.7, stoolZ); g.add(stoolSeat);
      var stoolLeg = box(0.04, 0.67, 0.04, steelMat);
      stoolLeg.position.set(stoolX, 0.34, stoolZ); g.add(stoolLeg);
      var stoolFoot = box(0.28, 0.02, 0.28, steelMat);
      stoolFoot.position.set(stoolX, 0.01, stoolZ); g.add(stoolFoot);
    }

    // Cafe tables (2) with chairs — in front half of bay
    for (var ct = 0; ct < 2; ct++) {
      var tx = -1.5 + ct * 3, tz = Z0 + 2.5;
      // Table top
      var cafeTop = box(1.1, 0.05, 1.1, marbleMat);
      cafeTop.position.set(tx, 0.75, tz); g.add(cafeTop);
      var cafePed = box(0.07, 0.72, 0.07, steelMat);
      cafePed.position.set(tx, 0.36, tz); g.add(cafePed);
      var cafeBase = box(0.45, 0.02, 0.45, steelMat);
      cafeBase.position.set(tx, 0.01, tz); g.add(cafeBase);
      // 2 chairs per table — on opposite z sides
      for (var cc = 0; cc < 2; cc++) {
        var cOff = cc === 0 ? -0.75 : 0.75;
        var chSeat = box(0.5, 0.05, 0.5, fabricSlate);
        chSeat.position.set(tx, 0.48, tz + cOff); g.add(chSeat);
        var chBack = box(0.5, 0.45, 0.05, fabricDark);
        chBack.position.set(tx, 0.76, tz + cOff + (cc === 0 ? -0.25 : 0.25)); g.add(chBack);
        [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(function(lp) {
          var cLeg = box(0.03, 0.45, 0.03, steelMat);
          cLeg.position.set(tx + lp[0], 0.23, tz + cOff + lp[1]); g.add(cLeg);
        });
      }
    }

    // Pendant lights over bar (3)
    for (var pl = 0; pl < 3; pl++) {
      var pShade = box(0.45, 0.22, 0.45, mat(0x222222, 0.5, 0.3));
      pShade.position.set(-1.3 + pl * 1.3, FH - 1.2, Z1 - 1); g.add(pShade);
      var pRod = box(0.03, 0.85, 0.03, steelMat);
      pRod.position.set(-1.3 + pl * 1.3, FH - 0.55, Z1 - 1); g.add(pRod);
    }

    // Signage strip above bay 2
    var sign2 = box(3.5, 0.4, 0.12, goldAccent);
    sign2.position.set(0, FH - 0.3, Z0 + 0.15); g.add(sign2);

    // ═══ GROUND FLOOR — BAY 3: OFFICE/RECEPTION (right, x ≈ 6.67) ═══
    bayX = BW / 3; // ~ 6.67

    // L-shaped reception desk — front part along Z, side part along X
    var recepFront = box(3, 1.1, 0.65, darkWood);
    recepFront.position.set(bayX - 0.2, 0.55, Z0 + 1.5); g.add(recepFront);
    var recepSide = box(0.65, 1.1, 1.8, darkWood);
    recepSide.position.set(bayX + 1.5, 0.55, Z0 + 2.6); g.add(recepSide);
    var recepTop = box(3.2, 0.05, 0.75, quartzMat);
    recepTop.position.set(bayX - 0.2, 1.13, Z0 + 1.5); g.add(recepTop);
    var recepTopSide = box(0.75, 0.05, 2, quartzMat);
    recepTopSide.position.set(bayX + 1.5, 1.13, Z0 + 2.6); g.add(recepTopSide);
    // Monitor on desk — behind counter (receptionist side, +z from desk front)
    var monBase = box(0.28, 0.02, 0.18, blackMat);
    monBase.position.set(bayX - 0.2, 1.19, Z0 + 2.1); g.add(monBase);
    var monStand = box(0.04, 0.22, 0.04, steelMat);
    monStand.position.set(bayX - 0.2, 1.3, Z0 + 2.1); g.add(monStand);
    var monScreen = box(0.6, 0.4, 0.03, blackMat);
    monScreen.position.set(bayX - 0.2, 1.6, Z0 + 2.1); g.add(monScreen);
    // Office chair behind desk (receptionist)
    var recChair = box(0.5, 0.05, 0.5, fabricSlate);
    recChair.position.set(bayX - 0.2, 0.48, Z0 + 2.8); g.add(recChair);
    var recChairBack = box(0.5, 0.5, 0.05, fabricDark);
    recChairBack.position.set(bayX - 0.2, 0.78, Z0 + 3.05); g.add(recChairBack);
    var recChairLeg = box(0.04, 0.45, 0.04, steelMat);
    recChairLeg.position.set(bayX - 0.2, 0.23, Z0 + 2.8); g.add(recChairLeg);
    var recChairBase = box(0.35, 0.02, 0.35, steelMat);
    recChairBase.position.set(bayX - 0.2, 0.01, Z0 + 2.8); g.add(recChairBase);

    // Waiting sofa — against right wall (X1 side)
    var waitBase = box(0.9, 0.3, 2.8, fabricSlate);
    waitBase.position.set(X1 - 0.8, 0.15, 2); g.add(waitBase);
    for (var wc = 0; wc < 2; wc++) {
      var waitCush = box(0.7, 0.18, 1.3, cushionMat);
      waitCush.position.set(X1 - 0.8, 0.38, 1.35 + wc * 1.3); g.add(waitCush);
    }
    var waitBack = box(0.18, 0.55, 2.8, fabricDark);
    waitBack.position.set(X1 - 0.25, 0.58, 2); g.add(waitBack);
    var waitArmF = box(0.9, 0.35, 0.12, fabricSlate);
    waitArmF.position.set(X1 - 0.8, 0.48, 0.55); g.add(waitArmF);
    var waitArmB = box(0.9, 0.35, 0.12, fabricSlate);
    waitArmB.position.set(X1 - 0.8, 0.48, 3.45); g.add(waitArmB);

    // Side table next to sofa
    var sideTop = box(0.55, 0.04, 0.55, woodMat);
    sideTop.position.set(X1 - 0.8, 0.52, 4.2); g.add(sideTop);
    var sideLeg = box(0.04, 0.5, 0.04, steelMat);
    sideLeg.position.set(X1 - 0.8, 0.25, 4.2); g.add(sideLeg);

    // Signage strip above bay 3
    var sign3 = box(3.5, 0.4, 0.12, blueAccent);
    sign3.position.set(bayX, FH - 0.3, Z0 + 0.15); g.add(sign3);

    // ═══ STAIRWELL (right-back corner) ═══
    var stairMat = mat(0xC8A882, 0.5);
    var stairX = X1 - 1.8; // center of stairwell
    var stairZ0 = Z0 + 0.5; // start near front-right
    // Stair stringers — ground to upper floor height only
    var stringer1 = box(0.1, FH, 0.1, stairMat);
    stringer1.position.set(stairX + 0.9, FH / 2, stairZ0); g.add(stringer1);
    var stringer2 = box(0.1, FH, 0.1, stairMat);
    stringer2.position.set(stairX - 0.9, FH / 2, stairZ0); g.add(stringer2);
    // Stair treads (10 steps from ground to F2)
    for (var st = 0; st < 10; st++) {
      var tread = box(1.6, 0.07, 0.3, woodMat);
      tread.position.set(stairX, 0.2 + st * (FH / 10), stairZ0 + st * 0.28); g.add(tread);
    }
    // Landing platform at top
    var landing = box(2, 0.12, 1.2, woodMat);
    landing.position.set(stairX, F2 - 0.06, stairZ0 + 3.2); g.add(landing);
    // Railing — along open side of stairs
    var railPosts = [0, 0.33, 0.66, 1];
    railPosts.forEach(function(frac) {
      var rPost = box(0.04, 1, 0.04, steelMat);
      rPost.position.set(stairX - 0.9, frac * FH + 0.5, stairZ0 + frac * 2.8); g.add(rPost);
    });
    var railTop = box(0.04, 0.04, 3.2, steelMat);
    railTop.position.set(stairX - 0.9, FH + 0.2, stairZ0 + 1.4); g.add(railTop);

    // ═══ UPPER FLOOR — OPEN OFFICE ═══
    // Glass partition dividers (2)
    var divGlass = mat(0x88AACC, 0.15, 0.1);
    divGlass.transparent = true; divGlass.opacity = 0.15;
    var div1Frame = box(0.08, 3.2, BD * 0.45, steelMat);
    div1Frame.position.set(-3, F2 + 1.6, 0); g.add(div1Frame);
    var div1Glass = box(0.04, 2.8, BD * 0.4, divGlass);
    div1Glass.position.set(-3, F2 + 1.6, 0); g.add(div1Glass);
    var div2Frame = box(0.08, 3.2, BD * 0.45, steelMat);
    div2Frame.position.set(4, F2 + 1.6, 0); g.add(div2Frame);
    var div2Glass = box(0.04, 2.8, BD * 0.4, divGlass);
    div2Glass.position.set(4, F2 + 1.6, 0); g.add(div2Glass);

    // Desk cluster 1 — against left wall (2 desks, one behind another)
    for (var d1 = 0; d1 < 2; d1++) {
      var dz = -3 + d1 * 3.5;
      var deskTop = box(2.5, 0.06, 1.2, woodMat);
      deskTop.position.set(X0 + 1.8, F2 + 0.75, dz); g.add(deskTop);
      // Steel legs
      [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].forEach(function(lp) {
        var dLeg = box(0.05, 0.72, 0.05, steelMat);
        dLeg.position.set(X0 + 1.8 + lp[0], F2 + 0.37, dz + lp[1]); g.add(dLeg);
      });
      // Monitor on desk
      var mBase = box(0.22, 0.02, 0.14, blackMat);
      mBase.position.set(X0 + 1.8, F2 + 0.8, dz - 0.3); g.add(mBase);
      var mStand = box(0.03, 0.18, 0.03, steelMat);
      mStand.position.set(X0 + 1.8, F2 + 0.9, dz - 0.3); g.add(mStand);
      var mScreen = box(0.55, 0.35, 0.02, blackMat);
      mScreen.position.set(X0 + 1.8, F2 + 1.18, dz - 0.3); g.add(mScreen);
      // Office chair — behind desk (facing desk, +z side toward wall)
      var oChair = box(0.5, 0.05, 0.5, fabricSlate);
      oChair.position.set(X0 + 1.8, F2 + 0.5, dz + 1); g.add(oChair);
      var oBack = box(0.5, 0.5, 0.05, fabricDark);
      oBack.position.set(X0 + 1.8, F2 + 0.8, dz + 1.25); g.add(oBack);
      var oLeg = box(0.04, 0.47, 0.04, steelMat);
      oLeg.position.set(X0 + 1.8, F2 + 0.25, dz + 1); g.add(oLeg);
      var oBase = box(0.38, 0.02, 0.38, steelMat);
      oBase.position.set(X0 + 1.8, F2 + 0.01, dz + 1); g.add(oBase);
    }

    // Desk cluster 2 — center zone (2 desks in a row)
    for (var d2 = 0; d2 < 2; d2++) {
      var dz2 = -3 + d2 * 3.5;
      var desk2Top = box(2.2, 0.06, 1.1, woodMat);
      desk2Top.position.set(0.5, F2 + 0.75, dz2); g.add(desk2Top);
      [[-1, -0.45], [1, -0.45], [-1, 0.45], [1, 0.45]].forEach(function(lp) {
        var d2Leg = box(0.05, 0.72, 0.05, steelMat);
        d2Leg.position.set(0.5 + lp[0], F2 + 0.37, dz2 + lp[1]); g.add(d2Leg);
      });
      // Monitor
      var m2Base = box(0.22, 0.02, 0.14, blackMat);
      m2Base.position.set(0.5, F2 + 0.8, dz2 - 0.25); g.add(m2Base);
      var m2Stand = box(0.03, 0.18, 0.03, steelMat);
      m2Stand.position.set(0.5, F2 + 0.9, dz2 - 0.25); g.add(m2Stand);
      var m2Screen = box(0.5, 0.32, 0.02, blackMat);
      m2Screen.position.set(0.5, F2 + 1.15, dz2 - 0.25); g.add(m2Screen);
      // Office chair behind desk
      var o2Chair = box(0.5, 0.05, 0.5, fabricSlate);
      o2Chair.position.set(0.5, F2 + 0.5, dz2 + 0.95); g.add(o2Chair);
      var o2Back = box(0.5, 0.5, 0.05, fabricDark);
      o2Back.position.set(0.5, F2 + 0.8, dz2 + 1.2); g.add(o2Back);
      var o2Leg = box(0.04, 0.47, 0.04, steelMat);
      o2Leg.position.set(0.5, F2 + 0.25, dz2 + 0.95); g.add(o2Leg);
      var o2Base = box(0.38, 0.02, 0.38, steelMat);
      o2Base.position.set(0.5, F2 + 0.01, dz2 + 0.95); g.add(o2Base);
    }

    // Conference table — right zone meeting area
    var confTop = box(3.5, 0.07, 2, darkWood);
    confTop.position.set(6.5, F2 + 0.75, 1); g.add(confTop);
    // Trestle legs
    var confTresL = box(0.08, 0.7, 1.6, steelMat);
    confTresL.position.set(5.1, F2 + 0.37, 1); g.add(confTresL);
    var confTresR = box(0.08, 0.7, 1.6, steelMat);
    confTresR.position.set(7.9, F2 + 0.37, 1); g.add(confTresR);
    var confStretch = box(2.6, 0.05, 0.05, steelMat);
    confStretch.position.set(6.5, F2 + 0.2, 1); g.add(confStretch);

    // Conference chairs (6) — 3 per side, backs facing away from table
    var confChairs = [
      { dx: -1.2, dz: -1.3, backDir: -1 },
      { dx: -1.2, dz: 0, backDir: -1 },
      { dx: -1.2, dz: 1.3, backDir: -1 },
      { dx: 1.2, dz: -1.3, backDir: 1 },
      { dx: 1.2, dz: 0, backDir: 1 },
      { dx: 1.2, dz: 1.3, backDir: 1 }
    ];
    confChairs.forEach(function(cp) {
      var cx = 6.5 + cp.dx, cz = 1 + cp.dz;
      var ccSeat = box(0.45, 0.04, 0.45, leatherMat);
      ccSeat.position.set(cx, F2 + 0.48, cz); g.add(ccSeat);
      var ccBack = box(0.45, 0.4, 0.04, leatherMat);
      ccBack.position.set(cx + cp.backDir * 0.22, F2 + 0.72, cz); g.add(ccBack);
      var ccLeg = box(0.04, 0.45, 0.04, steelMat);
      ccLeg.position.set(cx, F2 + 0.23, cz); g.add(ccLeg);
      var ccBase = box(0.32, 0.02, 0.32, steelMat);
      ccBase.position.set(cx, F2 + 0.01, cz); g.add(ccBase);
    });

    // Whiteboard — on right wall (X1 side)
    var wbBoard = box(0.06, 1.4, 2.8, mat(0xFAFAFA, 0.3));
    wbBoard.position.set(X1 - 0.25, F2 + 2.4, 4.5); g.add(wbBoard);
    var wbFrame = box(0.04, 1.5, 2.9, steelMat);
    wbFrame.position.set(X1 - 0.23, F2 + 2.4, 4.5); g.add(wbFrame);
    // Marker tray
    var wbTray = box(0.1, 0.07, 1.2, steelMat);
    wbTray.position.set(X1 - 0.2, F2 + 1.65, 4.5); g.add(wbTray);

    // Filing cabinet — upper left corner, against left wall
    var fileCab = box(0.55, 1.1, 0.7, steelMat);
    fileCab.position.set(X0 + 0.55, F2 + 0.55, Z0 + 1); g.add(fileCab);
    // Drawer lines
    for (var fd = 0; fd < 3; fd++) {
      var drawer = box(0.04, 0.03, 0.65, mat(0x999999, 0.3));
      drawer.position.set(X0 + 0.85, F2 + 0.2 + fd * 0.35, Z0 + 1); g.add(drawer);
      var dHandle = box(0.04, 0.02, 0.18, mat(0x888888, 0.3, 0.2));
      dHandle.position.set(X0 + 0.88, F2 + 0.25 + fd * 0.35, Z0 + 1); g.add(dHandle);
    }

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

  /* ═══ Process Visual Lifecycle (5 steps: 0-4) ═══ */

  // Step 0: Site & Feasibility — camera high over grid, lot boundary visible
  function prepareStep0() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procCamera.position.set(0, 45, 10);
    procCamera.lookAt(0, 0, 0);
    setProcLightsIntensity(0);
    procMarkDirty();
  }
  function scrubStep0(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    procCamera.position.set(-10 * s, 45 - 15 * s, 10 + 14 * s);
    procCamera.lookAt(0, 0, 0);
    procGroups.grid.children.forEach(function(line) {
      if (line.material) line.material.opacity = Math.min(line.material.opacity + 0.15 * s, 0.5);
    });
    procMarkDirty();
  }

  // Step 1: Structure — foundation + columns + floor plates rise up
  function prepareStep1() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = -3;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 0, 1);
    procCamera.position.set(-10, 30, 24);
    procCamera.lookAt(0, 2, 0);
    procMarkDirty();
  }
  function scrubStep1(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Foundation rises
    procGroups.foundation.position.y = -3 + 3 * s;
    // Columns/walls grow up
    procGroups.walls.scale.y = s;
    procCamera.position.set(-10 + 12 * s, 30 - 6 * s, 24 - 2 * s);
    procCamera.lookAt(0, 3 * s, 0);
    procMarkDirty();
  }

  // Step 2: Envelope — walls fill in between columns, roof/parapet appears
  function prepareStep2() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.visible = true;
    procGroups.roof.scale.set(1, 0, 1);
    procCamera.position.set(2, 24, 22);
    procCamera.lookAt(0, 5, 0);
    procMarkDirty();
  }
  function scrubStep2(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Roof/parapet rises into place
    procGroups.roof.scale.y = s;
    procCamera.position.set(2 + 14 * s, 24 - 2 * s, 22 - 4 * s);
    procCamera.lookAt(0, 5, 0);
    procMarkDirty();
  }

  // Step 3: Tenant Buildout — storefront glass, demising walls, fixtures
  function prepareStep3() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.visible = true;
    procGroups.roof.scale.set(1, 1, 1);
    procGroups.windows.visible = true;
    procGroups.windows.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = 0;
        obj.material.needsUpdate = true;
      }
    });
    procGroups.interior.visible = true;
    procGroups.interior.children.forEach(function(piece) {
      if (piece.isPointLight) return;
      piece.scale.set(0, 0, 0);
    });
    setProcLightsIntensity(0);
    procCamera.position.set(16, 20, 18);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }
  function scrubStep3(t) {
    if (!procCamera) return;
    // Storefront glass fades in (0-40%)
    var winP = remap(t, 0, 0.4);
    procGroups.windows.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = winP * (obj.material.color.r > 0.4 ? 0.3 : 1);
        obj.material.needsUpdate = true;
      }
    });
    // Interior elements pop in (20-75%, staggered)
    var children = procGroups.interior.children;
    var meshIdx = 0;
    children.forEach(function(piece) {
      if (piece.isPointLight) return;
      var pieceStart = 0.2 + (meshIdx / 12) * 0.45;
      var pieceP = remap(t, pieceStart, pieceStart + 0.1);
      var sc = easeOutBack(pieceP);
      piece.scale.set(sc, sc, sc);
      meshIdx++;
    });
    // Lights start warming up (50-90%)
    var lightP = smoothstep(remap(t, 0.5, 0.9));
    setProcLightsIntensity(lightP * 0.5);
    var s = smoothstep(t);
    procCamera.position.set(16 - 6 * s, 20 - 6 * s, 18 + 4 * s);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }

  // Step 4: Completion — all lights warm up, signage accents, camera final sweep
  function prepareStep4() {
    if (!procCamera) return;
    setProcGroupsVisible(true);
    procGroups.foundation.position.y = 0;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.scale.set(1, 1, 1);
    procGroups.windows.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = obj.material.color.r > 0.4 ? 0.3 : 1;
        obj.material.needsUpdate = true;
      }
    });
    procGroups.interior.children.forEach(function(piece) {
      if (!piece.isPointLight) piece.scale.set(1, 1, 1);
    });
    setProcLightsIntensity(0.5);
    procCamera.position.set(10, 14, 22);
    procCamera.lookAt(0, 5, 0);
    procMarkDirty();
  }
  function scrubStep4(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera sweeps for final reveal
    procCamera.position.set(10 + 14 * s, 14 - 2 * s, 22 - 8 * s);
    procCamera.lookAt(0, 5, 0);
    // Boost lights to full warm glow
    setProcLightsIntensity(0.5 + 1.2 * s);
    // Window glass warms to golden
    procGroups.windows.traverse(function(obj) {
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
    procMarkDirty();
  }

  /* ── Visual lifecycle dispatch (5 steps) ── */
  function prepareVisual(step) {
    switch (step) {
      case 0: prepareStep0(); break;
      case 1: prepareStep1(); break;
      case 2: prepareStep2(); break;
      case 3: prepareStep3(); break;
      case 4: prepareStep4(); break;
    }
  }
  function scrubVisual(step, subP) {
    switch (step) {
      case 0: scrubStep0(subP); break;
      case 1: scrubStep1(subP); break;
      case 2: scrubStep2(subP); break;
      case 3: scrubStep3(subP); break;
      case 4: scrubStep4(subP); break;
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

    /* ── If no pinned container, build carousel from existing rows ── */
    if (!pinned) {
      var rows = Array.prototype.slice.call(section.querySelectorAll('.sv-process-row'));
      if (!rows.length) { initProcessFallback(); return; }

      /* Create carousel container */
      pinned = document.createElement('div');
      pinned.className = 'sv-process-pinned';
      var _track = document.createElement('div');
      _track.className = 'sv-process-cards';
      var _nav = document.createElement('div');
      _nav.className = 'sv-process-nav';

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
        _track.appendChild(card);
      });

      pinned.appendChild(_track);
      pinned.appendChild(_nav);

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
    initProcessTimeline();
    initScrollAnimations();
  });

})();
