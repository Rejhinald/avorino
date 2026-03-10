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
     HERO — Three.js House + Growing Addition
     Scroll-pinned: existing house wireframe on left,
     new wing extends outward with particle effects
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

    if (label) {
      label.removeAttribute('data-animate');
      gsap.fromTo(label, { opacity: 0, y: 20 }, { opacity: 0.45, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    }
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

    /* ── Three.js Scene ── */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth;
    var h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(18, 12, 24);
    camera.lookAt(0, 2.5, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var wireOpacity = 0.3;

    /* ── Blueprint Grid ── */
    var gridGroup = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    for (var gi = -16; gi <= 16; gi += 2) {
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-16, 0, gi), new THREE.Vector3(16, 0, gi)]), gridMat.clone()));
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(gi, 0, -16), new THREE.Vector3(gi, 0, 16)]), gridMat.clone()));
    }
    scene.add(gridGroup);
    // Fade in grid
    gridGroup.children.forEach(function(l) {
      gsap.to(l.material, { opacity: 0.05, duration: 1.5, delay: 0.2, ease: 'power2.out' });
    });

    /* ── Existing house (left side, fully visible) ── */
    var houseGroup = new THREE.Group();
    var houseMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });

    // Main house: 8 wide (x=-8 to x=0), 8 deep (z=-4 to z=4)
    var hW = 4; // half-width of main house
    var hD = 4; // half-depth
    var wH = 3.5; // wall height
    var rH = 5.5; // roof peak height
    var wallH = wH;
    var houseCorners = [
      [-8, 0, -hD], [0, 0, -hD], [0, 0, hD], [-8, 0, hD],
    ];
    // Floor outline
    var floorGeo = new THREE.BufferGeometry().setFromPoints(
      houseCorners.concat([houseCorners[0]]).map(function(c) { return new THREE.Vector3(c[0], 0, c[2]); })
    );
    houseGroup.add(new THREE.Line(floorGeo, houseMat));
    // Top outline
    var topGeo = new THREE.BufferGeometry().setFromPoints(
      houseCorners.concat([houseCorners[0]]).map(function(c) { return new THREE.Vector3(c[0], wH, c[2]); })
    );
    houseGroup.add(new THREE.Line(topGeo, houseMat));
    // Vertical edges
    houseCorners.forEach(function(c) {
      var vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[2]), new THREE.Vector3(c[0], wH, c[2])
      ]);
      houseGroup.add(new THREE.Line(vGeo, houseMat));
    });
    // Gable roof (ridge runs along x at center of house x=-4)
    var ridgeX = -4;
    var roofLines = [
      [[-8, wH, -hD], [ridgeX, rH, 0]], [[-8, wH, hD], [ridgeX, rH, 0]],
      [[0, wH, -hD], [ridgeX, rH, 0]], [[0, wH, hD], [ridgeX, rH, 0]],
    ];
    roofLines.forEach(function(l) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(l[0][0], l[0][1], l[0][2]),
        new THREE.Vector3(l[1][0], l[1][1], l[1][2]),
      ]);
      houseGroup.add(new THREE.Line(geo, houseMat));
    });
    // Ridge line
    houseGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8, rH, 0), new THREE.Vector3(0, rH, 0)
    ]), houseMat));
    // Windows on front face (z = -hD)
    var existWindows = [
      // Window 1 (left)
      [[-6.5, 1.2, -hD], [-5, 1.2, -hD]], [[-5, 2.8, -hD], [-6.5, 2.8, -hD]],
      [[-6.5, 1.2, -hD], [-6.5, 2.8, -hD]], [[-5, 1.2, -hD], [-5, 2.8, -hD]],
      // Window 2 (right of center)
      [[-3.5, 1.2, -hD], [-2, 1.2, -hD]], [[-2, 2.8, -hD], [-3.5, 2.8, -hD]],
      [[-3.5, 1.2, -hD], [-3.5, 2.8, -hD]], [[-2, 1.2, -hD], [-2, 2.8, -hD]],
    ];
    existWindows.forEach(function(win) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(win[0][0], win[0][1], win[0][2]),
        new THREE.Vector3(win[1][0], win[1][1], win[1][2]),
      ]);
      houseGroup.add(new THREE.Line(geo, houseMat));
    });
    // Door on front face
    var doorLines = [
      [[-1, 0, -hD], [-1, 2.8, -hD]], [[0.2, 0, -hD], [0.2, 2.8, -hD]],
      [[-1, 2.8, -hD], [0.2, 2.8, -hD]],
    ];
    doorLines.forEach(function(dl) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(dl[0][0], dl[0][1], dl[0][2]),
        new THREE.Vector3(dl[1][0], dl[1][1], dl[1][2]),
      ]);
      houseGroup.add(new THREE.Line(geo, houseMat));
    });
    scene.add(houseGroup);

    /* ── Addition (right side, grows outward) ── */
    var additionGroup = new THREE.Group();
    var addMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var addWiresMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });

    // Addition: 6 wide (x=0 to x=6), 6 deep (z=-3 to z=3), lower roof
    var addW = 6;
    var addHD = 3; // addition half-depth
    var addWH = 3.5; // addition wall height (same as main)
    var addRH = 4.5; // addition roof peak (lower than main)
    var addCorners = [
      [0, 0, -addHD], [addW, 0, -addHD], [addW, 0, addHD], [0, 0, addHD],
    ];
    // Floor
    var addFloorGeo = new THREE.BufferGeometry().setFromPoints(
      addCorners.concat([addCorners[0]]).map(function(c) { return new THREE.Vector3(c[0], 0, c[2]); })
    );
    additionGroup.add(new THREE.Line(addFloorGeo, addMat));
    // Top
    var addTopGeo = new THREE.BufferGeometry().setFromPoints(
      addCorners.concat([addCorners[0]]).map(function(c) { return new THREE.Vector3(c[0], addWH, c[2]); })
    );
    additionGroup.add(new THREE.Line(addTopGeo, addMat));
    // Verticals (only new far corners)
    [[addW, -addHD], [addW, addHD]].forEach(function(c) {
      var vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], addWH, c[1])
      ]);
      additionGroup.add(new THREE.Line(vGeo, addMat));
    });
    // Shared wall verticals (at x=0)
    [[0, -addHD], [0, addHD]].forEach(function(c) {
      var vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], addWH, c[1])
      ]);
      additionGroup.add(new THREE.Line(vGeo, addWiresMat));
    });
    // Addition gable roof (lower, ridge at x=3)
    var addRidgeX = addW / 2;
    var addRoofLines = [
      [[0, addWH, -addHD], [addRidgeX, addRH, 0]], [[0, addWH, addHD], [addRidgeX, addRH, 0]],
      [[addW, addWH, -addHD], [addRidgeX, addRH, 0]], [[addW, addWH, addHD], [addRidgeX, addRH, 0]],
    ];
    addRoofLines.forEach(function(l) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(l[0][0], l[0][1], l[0][2]),
        new THREE.Vector3(l[1][0], l[1][1], l[1][2]),
      ]);
      additionGroup.add(new THREE.Line(geo, addMat));
    });
    // Addition ridge line
    additionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, addRH, 0), new THREE.Vector3(addW, addRH, 0)
    ]), addMat));
    // Addition window on front face (z = -addHD)
    var addWindows = [
      [[2, 1.2, -addHD], [3.5, 1.2, -addHD]], [[3.5, 2.8, -addHD], [2, 2.8, -addHD]],
      [[2, 1.2, -addHD], [2, 2.8, -addHD]], [[3.5, 1.2, -addHD], [3.5, 2.8, -addHD]],
    ];
    addWindows.forEach(function(win) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(win[0][0], win[0][1], win[0][2]),
        new THREE.Vector3(win[1][0], win[1][1], win[1][2]),
      ]);
      additionGroup.add(new THREE.Line(geo, addMat));
    });
    // Addition window on end wall (x = addW)
    var addEndWindows = [
      [[addW, 1.2, -1], [addW, 1.2, 1]], [[addW, 2.8, 1], [addW, 2.8, -1]],
      [[addW, 1.2, -1], [addW, 2.8, -1]], [[addW, 1.2, 1], [addW, 2.8, 1]],
    ];
    addEndWindows.forEach(function(win) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(win[0][0], win[0][1], win[0][2]),
        new THREE.Vector3(win[1][0], win[1][1], win[1][2]),
      ]);
      additionGroup.add(new THREE.Line(geo, addMat));
    });
    // Start the addition scaled to 0 on X
    additionGroup.scale.x = 0;
    scene.add(additionGroup);

    /* ── Connection particles (at junction x=0) ── */
    var particles = [];
    var pPositions = [];
    var particleCount = isMobile ? 15 : 30;
    for (var pp = 0; pp < particleCount; pp++) {
      var px = -0.5 + Math.random() * 1.0;
      var py = Math.random() * wH;
      var pz = (Math.random() - 0.5) * 8;
      pPositions.push(px, py, pz);
      particles.push({ x: px, y: py, z: pz, vx: (Math.random() - 0.3) * 0.03, vy: Math.random() * 0.015, life: Math.random() });
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
    var pMat = new THREE.PointsMaterial({ color: accentColor, size: 0.08, transparent: true, opacity: 0, sizeAttenuation: true });
    var particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    /* ── Initial entrance: house reveals ── */
    gsap.to(houseMat, { opacity: wireOpacity, duration: 2.0, delay: 0.4, ease: 'power2.out' });
    gsap.to(pMat, { opacity: 0.3, duration: 1, delay: 1.5, ease: 'power2.out' });

    /* ═══ SCROLL-DRIVEN BUILD ═══
       0%–30%  : House fully visible, addition starts growing
       30%–70% : Addition extends outward (scale.x 0→1)
       70%–100%: Particles intensify, camera pulls back for full view
    ═══════════════════════════════════════ */
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        var p = self.progress;

        // Addition grows (0%–70%)
        var addP = Math.min(1, p / 0.7);
        additionGroup.scale.x = addP;
        addMat.opacity = addP * 0.45;
        addWiresMat.opacity = addP * wireOpacity;

        // Particles intensify during build (20%–80%)
        if (p > 0.2 && p < 0.8) {
          pMat.opacity = 0.5;
        } else {
          pMat.opacity = 0.3;
        }

        // Camera pull-back on progress
        camera.userData.scrollRadius = 24 + p * 4;
        camera.userData.scrollHeight = 12 + p * 3;
      }
    });

    /* ── Mouse parallax ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Render loop ── */
    var baseAngle = 0;
    camera.userData.scrollRadius = 24;
    camera.userData.scrollHeight = 12;

    function animate() {
      requestAnimationFrame(animate);
      baseAngle += 0.0015;

      var orbitR = camera.userData.scrollRadius;
      camera.position.set(
        Math.cos(baseAngle + mouseX * 0.25) * orbitR,
        camera.userData.scrollHeight + mouseY * 1.5,
        Math.sin(baseAngle + mouseX * 0.25) * orbitR
      );
      camera.lookAt(0, 2.5, 0);

      // Particle drift
      var pos = particleSystem.geometry.attributes.position.array;
      for (var k = 0; k < particles.length; k++) {
        particles[k].x += particles[k].vx;
        particles[k].y += particles[k].vy;
        particles[k].life -= 0.005;
        if (particles[k].life <= 0) {
          particles[k].x = -0.5 + Math.random() * 1.0;
          particles[k].y = Math.random() * wH;
          particles[k].z = (Math.random() - 0.5) * 8;
          particles[k].vx = (Math.random() - 0.3) * 0.03;
          particles[k].vy = Math.random() * 0.015;
          particles[k].life = 1;
        }
        pos[k * 3] = particles[k].x;
        pos[k * 3 + 1] = particles[k].y;
        pos[k * 3 + 2] = particles[k].z;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

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

  /* ── House with New Addition: Realistic Architecture (ADU Visualizer style) ── */
  var adWT = 0.5;    // wall thickness
  var eWH = 9;       // existing house wall height
  var eW = 14;       // existing house width (x)
  var eD = 10;       // existing house depth (z)
  var aWH = 9;       // addition wall height
  var aW = 10;       // addition width (x)
  var aD = 8;        // addition depth (z)
  var ePEAK = 12;    // existing gable peak
  var aROOF = 10;    // addition shed roof height

  var mat = function(color, rough, metal) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
  };
  var box = function(w, h, d, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };

  // ── Shared: Build a wall with rectangular openings cut out ──
  function buildWallSegments(g, x0, x1, z, openings, wallMat, axis, wallH) {
    axis = axis || 'z';
    wallH = wallH || eWH;
    var totalLen = x1 - x0;

    if (!openings || openings.length === 0) {
      var solid;
      if (axis === 'z') {
        solid = box(totalLen, wallH, adWT, wallMat);
        solid.position.set((x0 + x1) / 2, wallH / 2, z);
      } else {
        solid = box(adWT, wallH, totalLen, wallMat);
        solid.position.set(z, wallH / 2, (x0 + x1) / 2);
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

      // Wall segment before this opening
      if (oLeft > cursor + 0.05) {
        var segW = oLeft - cursor;
        var seg;
        if (axis === 'z') {
          seg = box(segW, wallH, adWT, wallMat);
          seg.position.set(cursor + segW / 2, wallH / 2, z);
        } else {
          seg = box(adWT, wallH, segW, wallMat);
          seg.position.set(z, wallH / 2, cursor + segW / 2);
        }
        g.add(seg);
      }

      // Wall above opening
      if (oTop < wallH - 0.05) {
        var aboveH = wallH - oTop;
        var above;
        if (axis === 'z') {
          above = box(op.w, aboveH, adWT, wallMat);
          above.position.set(op.x, oTop + aboveH / 2, z);
        } else {
          above = box(adWT, aboveH, op.w, wallMat);
          above.position.set(z, oTop + aboveH / 2, op.x);
        }
        g.add(above);
      }

      // Wall below opening (sill)
      if (oBottom > 0.05) {
        var below;
        if (axis === 'z') {
          below = box(op.w, oBottom, adWT, wallMat);
          below.position.set(op.x, oBottom / 2, z);
        } else {
          below = box(adWT, oBottom, op.w, wallMat);
          below.position.set(z, oBottom / 2, op.x);
        }
        g.add(below);
      }

      cursor = oRight;
    });

    // Wall segment after last opening
    if (cursor < x1 - 0.05) {
      var endW = x1 - cursor;
      var endSeg;
      if (axis === 'z') {
        endSeg = box(endW, wallH, adWT, wallMat);
        endSeg.position.set(cursor + endW / 2, wallH / 2, z);
      } else {
        endSeg = box(adWT, wallH, endW, wallMat);
        endSeg.position.set(z, wallH / 2, cursor + endW / 2);
      }
      g.add(endSeg);
    }
  }

  // ── Corner posts ──
  function addCornerPost(g, x, z, wallMat, h) {
    h = h || eWH;
    var post = box(adWT, h, adWT, wallMat);
    post.position.set(x, h / 2, z);
    g.add(post);
  }

  // Property lot with existing house footprint + new addition footprint in dashed gold
  function buildProcGrid() {
    var g = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: 0x3377BB, transparent: true, opacity: 0.12 });
    for (var i = -10; i <= 10; i++) {
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2, 0.01, -10), new THREE.Vector3(i * 2, 0.01, 10)
      ]), gridMat.clone()));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0.01, i * 2), new THREE.Vector3(20, 0.01, i * 2)
      ]), gridMat.clone()));
    }
    // Lot boundary
    var lotMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.35 });
    var lotPts = [
      new THREE.Vector3(-14, 0.02, -10), new THREE.Vector3(16, 0.02, -10),
      new THREE.Vector3(16, 0.02, 10), new THREE.Vector3(-14, 0.02, 10),
      new THREE.Vector3(-14, 0.02, -10)
    ];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lotPts), lotMat));
    // Existing house footprint outline
    var existLineMat = new THREE.LineBasicMaterial({ color: 0x8899AA, transparent: true, opacity: 0.3 });
    var eX0 = -eW / 2, eX1 = eW / 2, eZ0 = -eD / 2, eZ1 = eD / 2;
    var existPts = [
      new THREE.Vector3(eX0, 0.03, eZ0), new THREE.Vector3(eX1, 0.03, eZ0),
      new THREE.Vector3(eX1, 0.03, eZ1), new THREE.Vector3(eX0, 0.03, eZ1),
      new THREE.Vector3(eX0, 0.03, eZ0)
    ];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(existPts), existLineMat));
    // New addition footprint in dashed gold
    var addFPMat = new THREE.LineDashedMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.5, dashSize: 0.5, gapSize: 0.3 });
    var aX0 = eX1, aX1 = eX1 + aW, aZ0 = -aD / 2, aZ1 = aD / 2;
    var addFPPts = [
      new THREE.Vector3(aX0, 0.03, aZ0), new THREE.Vector3(aX1, 0.03, aZ0),
      new THREE.Vector3(aX1, 0.03, aZ1), new THREE.Vector3(aX0, 0.03, aZ1),
      new THREE.Vector3(aX0, 0.03, aZ0)
    ];
    var addFPLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(addFPPts), addFPMat);
    addFPLine.computeLineDistances();
    g.add(addFPLine);
    return g;
  }

  // Two foundations — existing (weathered) and addition (fresh concrete)
  function buildProcFoundation() {
    var g = new THREE.Group();
    var existSlabMat = mat(0xC5C0B8, 0.95);
    var newSlabMat = mat(0xD5D0C8, 0.9);
    var footingMat = mat(0xB0A898, 0.92);
    var floorMatOld = mat(0xD8D0C0, 0.78);
    var floorMatNew = mat(0xE8E2D8, 0.72);
    var eX0 = -eW / 2, eX1 = eW / 2, eZ0 = -eD / 2, eZ1 = eD / 2;
    var aX0 = eX1, aX1 = eX1 + aW, aZ0 = -aD / 2, aZ1 = aD / 2;

    // Existing house slab
    var eSlab = box(eW, 0.4, eD, existSlabMat);
    eSlab.position.set((eX0 + eX1) / 2, -0.2, 0);
    g.add(eSlab);
    // Addition slab
    var aSlab = box(aW, 0.4, aD, newSlabMat);
    aSlab.position.set((aX0 + aX1) / 2, -0.2, 0);
    g.add(aSlab);

    // Footings (perimeter of existing)
    var fh = 0.6, fw = 0.8;
    var ef1 = box(eW + 0.4, fh, fw, footingMat); ef1.position.set(0, -fh / 2, eZ0); g.add(ef1);
    var ef2 = box(eW + 0.4, fh, fw, footingMat); ef2.position.set(0, -fh / 2, eZ1); g.add(ef2);
    var ef3 = box(fw, fh, eD, footingMat); ef3.position.set(eX0, -fh / 2, 0); g.add(ef3);

    // Footings (addition)
    var af1 = box(aW + 0.4, fh, fw, footingMat); af1.position.set((aX0 + aX1) / 2, -fh / 2, aZ0); g.add(af1);
    var af2 = box(aW + 0.4, fh, fw, footingMat); af2.position.set((aX0 + aX1) / 2, -fh / 2, aZ1); g.add(af2);
    var af3 = box(fw, fh, aD, footingMat); af3.position.set(aX1, -fh / 2, 0); g.add(af3);

    // Floor finishes
    var eFloor = box(eW - adWT * 2, 0.05, eD - adWT * 2, floorMatOld);
    eFloor.position.set(0, 0.01, 0); g.add(eFloor);
    var aFloor = box(aW - adWT * 2, 0.05, aD - adWT * 2, floorMatNew);
    aFloor.position.set((aX0 + aX1) / 2, 0.01, 0); g.add(aFloor);

    return g;
  }

  // Walls with proper openings — existing (weathered) + addition (fresh), both with cutaway
  function buildProcWalls() {
    var g = new THREE.Group();
    var existMat = mat(0xEDE8E0, 0.88);  // weathered off-white
    existMat.transparent = true; existMat.opacity = 0.12; existMat.side = THREE.DoubleSide;
    var newMat = mat(0xF5F5F5, 0.85);    // fresh white
    newMat.transparent = true; newMat.opacity = 0.12; newMat.side = THREE.DoubleSide;
    var intMat = mat(0xFAFAFA, 0.92);
    intMat.transparent = true; intMat.opacity = 0.1; intMat.side = THREE.DoubleSide;
    var eX0 = -eW / 2, eX1 = eW / 2, eZ0 = -eD / 2, eZ1 = eD / 2;
    var aX0 = eX1, aX1 = eX1 + aW, aZ0 = -aD / 2, aZ1 = aD / 2;

    // ═══ EXISTING HOUSE ═══
    // Front wall (south, z = eZ0) — front door + 2 windows
    buildWallSegments(g, eX0, eX1, eZ0, [
      { x: -4, y: 3, w: 2.5, h: 4 },     // left window
      { x: -0.5, y: 0, w: 2.5, h: 6.67 },// front door
      { x: 4, y: 3, w: 2.5, h: 4 },      // right window
    ], existMat, 'z', eWH);

    // Back wall (north, z = eZ1) — REMOVED for cutaway

    // Left wall (west, x = eX0) — 2 windows
    buildWallSegments(g, eZ0, eZ1, eX0, [
      { x: -2, y: 3, w: 2.5, h: 4 },
      { x: 2.5, y: 3, w: 2.5, h: 4 },
    ], existMat, 'x', eWH);

    // Right wall of existing house (x = eX1) — passageway to addition
    // Wall segments with a wide doorway opening in center
    buildWallSegments(g, eZ0, eZ1, eX1, [
      { x: 0, y: 0, w: 4, h: 7.5 },  // passageway opening
    ], existMat, 'x', eWH);

    // Existing house corners
    addCornerPost(g, eX0, eZ0, existMat, eWH);
    addCornerPost(g, eX1, eZ0, existMat, eWH);
    addCornerPost(g, eX0, eZ1, existMat, eWH);
    addCornerPost(g, eX1, eZ1, existMat, eWH);

    // ═══ NEW ADDITION ═══
    // Front wall (south, z = aZ0) — sliding glass door + window
    buildWallSegments(g, aX0, aX1, aZ0, [
      { x: aX0 + 3, y: 0.3, w: 4, h: 7 },  // large sliding glass
      { x: aX1 - 2, y: 3, w: 3, h: 4 },     // window
    ], newMat, 'z', aWH);

    // Back wall (north, z = aZ1) — REMOVED for cutaway

    // Right wall (east, x = aX1) — 2 large windows
    buildWallSegments(g, aZ0, aZ1, aX1, [
      { x: -2, y: 2.5, w: 3, h: 5 },
      { x: 2, y: 2.5, w: 3, h: 5 },
    ], newMat, 'x', aWH);

    // Left wall of addition (x = aX0) — passageway matches existing
    buildWallSegments(g, aZ0, aZ1, aX0, [
      { x: 0, y: 0, w: 4, h: 7.5 },  // passageway opening
    ], newMat, 'x', aWH);

    // Addition corners
    addCornerPost(g, aX0, aZ0, newMat, aWH);
    addCornerPost(g, aX1, aZ0, newMat, aWH);
    addCornerPost(g, aX0, aZ1, newMat, aWH);
    addCornerPost(g, aX1, aZ1, newMat, aWH);

    // ═══ INTERIOR WALLS ═══
    // Existing house: kitchen/living divider at x = -1 (runs along z)
    buildWallSegments(g, eZ0 + 1, eZ1 - 1, -1, [
      { x: 0, y: 0, w: 2.5, h: 6.67 },  // doorway
    ], intMat, 'x', eWH);

    // Existing house: hallway wall at z = 1 (runs along x)
    buildWallSegments(g, eX0 + 1, -1.5, 1, [
      { x: -4, y: 0, w: 2.5, h: 6.67 },
    ], intMat, 'z', eWH);

    // Addition: bedroom/bathroom divider at x = aX0 + 5 (runs along z)
    buildWallSegments(g, aZ0 + 1, aZ1 - 1, aX0 + 5, [
      { x: 0, y: 0, w: 2, h: 6.67 },  // door to bathroom
    ], intMat, 'x', aWH);

    return g;
  }

  // Existing house gable roof + addition flat/shed roof
  function buildProcRoof() {
    var g = new THREE.Group();
    var roofMat = mat(0x4A3C30, 0.75);
    var semiTransRoofMat = new THREE.MeshStandardMaterial({ color: 0x4A3C30, roughness: 0.75, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    var eX0 = -eW / 2, eX1 = eW / 2, eZ0 = -eD / 2, eZ1 = eD / 2;
    var aX0 = eX1, aX1 = eX1 + aW, aZ0 = -aD / 2, aZ1 = aD / 2;
    var OVH = 0.8;

    // ═══ EXISTING HOUSE ROOF (gable, ridge runs along z at x = 0) ═══
    // Left slope (x = eX0 to ridge at x=0) — solid (faces away)
    var eRoofGeoL = new THREE.BufferGeometry();
    eRoofGeoL.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      eX0 - OVH, eWH, eZ0 - OVH,  0, ePEAK, eZ0 - OVH,  0, ePEAK, eZ1 + OVH,
      eX0 - OVH, eWH, eZ0 - OVH,  0, ePEAK, eZ1 + OVH,  eX0 - OVH, eWH, eZ1 + OVH
    ]), 3));
    eRoofGeoL.computeVertexNormals();
    var eRoofL = new THREE.Mesh(eRoofGeoL, roofMat);
    eRoofL.castShadow = true; g.add(eRoofL);

    // Right slope (x = eX1 to ridge at x=0) — transparent cutaway
    var eRoofGeoR = new THREE.BufferGeometry();
    eRoofGeoR.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      eX1 + OVH, eWH, eZ0 - OVH,  eX1 + OVH, eWH, eZ1 + OVH,  0, ePEAK, eZ0 - OVH,
      0, ePEAK, eZ0 - OVH,  eX1 + OVH, eWH, eZ1 + OVH,  0, ePEAK, eZ1 + OVH
    ]), 3));
    eRoofGeoR.computeVertexNormals();
    var eRoofR = new THREE.Mesh(eRoofGeoR, semiTransRoofMat);
    eRoofR.castShadow = true; g.add(eRoofR);

    // Gable end triangles
    var gableFront = new THREE.BufferGeometry();
    gableFront.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      eX0 - OVH, eWH, eZ0 - OVH,  eX1 + OVH, eWH, eZ0 - OVH,  0, ePEAK, eZ0 - OVH
    ]), 3));
    gableFront.computeVertexNormals();
    g.add(new THREE.Mesh(gableFront, roofMat));

    var gableBack = new THREE.BufferGeometry();
    gableBack.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      eX0 - OVH, eWH, eZ1 + OVH,  0, ePEAK, eZ1 + OVH,  eX1 + OVH, eWH, eZ1 + OVH
    ]), 3));
    gableBack.computeVertexNormals();
    g.add(new THREE.Mesh(gableBack, semiTransRoofMat));

    // ═══ ADDITION ROOF (flat/shed, slopes from aROOF down to aWH) ═══
    var addRoof = box(aW + OVH * 2, 0.25, aD + OVH * 2, roofMat);
    addRoof.position.set((aX0 + aX1) / 2, (aROOF + aWH) / 2, 0);
    addRoof.rotation.z = Math.atan2(aROOF - aWH, aW) * -1; // slope away from house
    addRoof.castShadow = true; g.add(addRoof);

    // Fascia on addition
    var fasciaMat = mat(0xF5F0E8, 0.7);
    var fasciaA = box(0.15, 0.3, aD + OVH, fasciaMat);
    fasciaA.position.set(aX1 + OVH, aWH - 0.15, 0); g.add(fasciaA);

    // Ridge line accents
    var ridgeMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.5 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, ePEAK, eZ0 - OVH), new THREE.Vector3(0, ePEAK, eZ1 + OVH)
    ]), ridgeMat));

    // Fascia on existing house front
    var fasciaE = box(eW + OVH * 2, 0.3, 0.15, fasciaMat);
    fasciaE.position.set(0, eWH - 0.15, eZ0 - OVH); g.add(fasciaE);

    return g;
  }

  // Windows, doors, and frames
  function buildProcWindows() {
    var g = new THREE.Group();
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, metalness: 0.1,
      transparent: true, opacity: 0.35, side: THREE.DoubleSide
    });
    var frameMat = mat(0x6B7280, 0.4, 0.2);
    var doorFrameMat = mat(0x8B7355, 0.6);
    var doorPanelMat = mat(0xA68B5B, 0.6);
    var slidingFrameMat = mat(0x555555, 0.3, 0.3);
    var eX0 = -eW / 2, eX1 = eW / 2, eZ0 = -eD / 2, eZ1 = eD / 2;
    var aX0 = eX1, aX1 = eX1 + aW, aZ0 = -aD / 2, aZ1 = aD / 2;

    // ── Window helper ──
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
      var mullion = box(0.08, h, 0.08, frameMat); fg.add(mullion);
      var glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat.clone());
      fg.add(glass);
      fg.position.set(x, y + h / 2, z);
      if (rotY) fg.rotation.y = rotY;
      g.add(fg);
    }

    // ── Door helper ──
    function addDoor(x, y, z, w, h, rotY) {
      var dg = new THREE.Group();
      var fTop = box(w + 0.4, 0.2, adWT + 0.1, doorFrameMat);
      fTop.position.set(0, h + 0.1, 0); dg.add(fTop);
      var fL = box(0.2, h, adWT + 0.1, doorFrameMat);
      fL.position.set(-w / 2 - 0.1, h / 2, 0); dg.add(fL);
      var fR = box(0.2, h, adWT + 0.1, doorFrameMat);
      fR.position.set(w / 2 + 0.1, h / 2, 0); dg.add(fR);
      var panel = box(w - 0.1, h - 0.1, 0.15, doorPanelMat);
      panel.position.set(0, h / 2, 0); dg.add(panel);
      dg.position.set(x, y, z);
      if (rotY) dg.rotation.y = rotY;
      g.add(dg);
    }

    // ── Sliding glass door helper ──
    function addSlidingDoor(x, y, z, w, h, rotY) {
      var sg = new THREE.Group();
      // Frame
      var fTop = box(w + 0.3, 0.15, 0.2, slidingFrameMat);
      fTop.position.set(0, h + 0.075, 0); sg.add(fTop);
      var fBot = box(w + 0.3, 0.15, 0.2, slidingFrameMat);
      fBot.position.set(0, -0.075, 0); sg.add(fBot);
      var fL = box(0.15, h + 0.3, 0.2, slidingFrameMat);
      fL.position.set(-w / 2 - 0.075, h / 2, 0); sg.add(fL);
      var fR = box(0.15, h + 0.3, 0.2, slidingFrameMat);
      fR.position.set(w / 2 + 0.075, h / 2, 0); sg.add(fR);
      // Center divider
      var divider = box(0.1, h, 0.1, slidingFrameMat);
      divider.position.set(0, h / 2, 0); sg.add(divider);
      // Glass panels
      var glassL = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.1, h - 0.1), glassMat.clone());
      glassL.position.set(-w / 4, h / 2, 0); sg.add(glassL);
      var glassR = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.1, h - 0.1), glassMat.clone());
      glassR.position.set(w / 4, h / 2, 0); sg.add(glassR);
      sg.position.set(x, y, z);
      if (rotY) sg.rotation.y = rotY;
      g.add(sg);
    }

    // ═══ EXISTING HOUSE ═══
    // Front wall (south, z = eZ0)
    addWindow(-4, 3, eZ0 - 0.05, 2.5, 4, 0);
    addWindow(4, 3, eZ0 - 0.05, 2.5, 4, 0);
    addDoor(-0.5, 0, eZ0, 2.5, 6.67, 0);

    // Left wall (west, x = eX0) — x=wall position, z=position along wall
    addWindow(eX0 - 0.05, 3, -2, 2.5, 4, Math.PI / 2);
    addWindow(eX0 - 0.05, 3, 2.5, 2.5, 4, Math.PI / 2);

    // ═══ NEW ADDITION ═══
    // Front wall (south, z = aZ0) — sliding glass + window
    addSlidingDoor(aX0 + 3, 0.3, aZ0 - 0.05, 4, 7, 0);
    addWindow(aX1 - 2, 3, aZ0 - 0.05, 3, 4, 0);

    // Right wall (east, x = aX1) — x=wall position, z=position along wall
    addWindow(aX1 + 0.05, 2.5, -2, 3, 5, Math.PI / 2);
    addWindow(aX1 + 0.05, 2.5, 2, 3, 5, Math.PI / 2);

    return g;
  }

  // Interior: furniture + lights — existing (worn) + addition (fresh)
  function buildProcInterior() {
    var g = new THREE.Group();
    var lights = [];
    var aX0 = eW / 2;

    // Ceiling lights
    var lightDefs = [
      { x: -5, z: -2, color: 0xFFD699, intensity: 4 },
      { x: -5, z: 3, color: 0xFFD699, intensity: 3.5 },
      { x: 3, z: -2, color: 0xFFD699, intensity: 4 },
      { x: aX0 + 2.5, z: -1, color: 0xFFF5E0, intensity: 5 },
      { x: aX0 + 7.5, z: 0, color: 0xFFF0D0, intensity: 4 },
    ];
    lightDefs.forEach(function(def) {
      var light = new THREE.PointLight(def.color, def.intensity, 18, 2);
      light.position.set(def.x, eWH - 0.5, def.z);
      g.add(light);
      light.userData._maxIntensity = def.intensity;
      lights.push(light);
    });
    g.userData.lights = lights;

    // Materials
    var woodMat = mat(0x8B7355, 0.7);
    var darkWood = mat(0x5C4033, 0.75);
    var fabricMat = mat(0x7A8899, 0.85);
    var cushionMat = mat(0x8B9BB0, 0.82);
    var leatherMat = mat(0x2C3E50, 0.78);
    var quartzMat = mat(0xF0EDE8, 0.3, 0.05);
    var cabinetMat = mat(0xF0ECE6, 0.6);
    var steelMat = mat(0xC0C0C0, 0.25, 0.15);
    var linenMat = mat(0xE8E0D5, 0.85);
    var pillowMat = mat(0xBEB5A8, 0.82);
    var tileMat = mat(0xE0DDD8, 0.5);
    var whiteMat = mat(0xF5F5F5, 0.4, 0.05);

    // ═══ EXISTING HOUSE (x: -7 to +7, z: -5 to +5) ═══

    // Sofa — against left wall (x = -7), facing right (+x)
    var sofaBackRest = box(0.3, 0.8, 5, fabricMat);
    sofaBackRest.position.set(-6.55, 0.85, -1.5); g.add(sofaBackRest);
    var sofaBase = box(2.2, 0.4, 5, fabricMat);
    sofaBase.position.set(-5.7, 0.2, -1.5); g.add(sofaBase);
    for (var sc = 0; sc < 3; sc++) {
      var cush = box(1.8, 0.25, 1.5, cushionMat);
      cush.position.set(-5.7, 0.55, -3.2 + sc * 1.7); g.add(cush);
    }
    // Arm rests
    var armL = box(2.2, 0.5, 0.25, fabricMat);
    armL.position.set(-5.7, 0.65, -4.15); g.add(armL);
    var armR = box(2.2, 0.5, 0.25, fabricMat);
    armR.position.set(-5.7, 0.65, 1.15); g.add(armR);

    // Coffee table — in front of sofa (to the right of it)
    var ctTop = box(1.2, 0.06, 2.5, mat(0x88AACC, 0.15, 0.1));
    ctTop.material.transparent = true; ctTop.material.opacity = 0.25;
    ctTop.position.set(-3.5, 0.45, -1.5); g.add(ctTop);
    [[-0.5, -1.1], [-0.5, 1.1], [0.5, -1.1], [0.5, 1.1]].forEach(function(lp) {
      var leg = box(0.05, 0.42, 0.05, steelMat);
      leg.position.set(-3.5 + lp[0], 0.22, -1.5 + lp[1]); g.add(leg);
    });

    // Kitchen counter — along back wall (z = +5), east side of existing house
    var counterCab = box(4, 0.9, 1, cabinetMat);
    counterCab.position.set(2.5, 0.45, 4.2); g.add(counterCab);
    var counterTop = box(4.2, 0.06, 1.2, quartzMat);
    counterTop.position.set(2.5, 0.93, 4.2); g.add(counterTop);

    // Kitchen island — parallel to counter, in front of it
    var islandBase = box(3.2, 0.9, 1, cabinetMat);
    islandBase.position.set(3.5, 0.45, 2); g.add(islandBase);
    var islandTop = box(3.5, 0.06, 1.2, quartzMat);
    islandTop.position.set(3.5, 0.93, 2); g.add(islandTop);

    // Fridge — against back wall (z = +5), corner near shared wall
    var fridgeBody = box(1.3, 3.2, 1.2, steelMat);
    fridgeBody.position.set(6.1, 1.6, 4.1); g.add(fridgeBody);
    var fridgeDoor = box(1.25, 2.0, 0.04, mat(0xD0D0D0, 0.2, 0.15));
    fridgeDoor.position.set(6.1, 2.1, 3.48); g.add(fridgeDoor);
    var fridgeHandle = box(0.05, 0.8, 0.05, steelMat);
    fridgeHandle.position.set(5.6, 2.1, 3.46); g.add(fridgeHandle);

    // ═══ NEW ADDITION (x: +7 to +17, z: -4 to +4) ═══
    // Addition is split: bedroom (west half) and bathroom (east half)
    // aX0 = 7

    // ── Bedroom (x: 7 to ~12, z: -4 to +4) ──
    // Bed — headboard flush against front wall (z = -4)
    var bedW = 4.5;   // queen-ish width
    var bedD = 5.5;   // bed depth (length)
    var bedCX = aX0 + 2.5;  // x = 9.5, centered in bedroom half
    var bedFrontZ = -aD / 2; // z = -4, front wall
    var bedHeadZ = bedFrontZ + 0.1; // headboard flush to wall
    var bedCZ = bedHeadZ + bedD / 2 + 0.08; // center of mattress

    var bedFrame = box(bedW + 0.2, 0.25, bedD + 0.2, darkWood);
    bedFrame.position.set(bedCX, 0.13, bedCZ); g.add(bedFrame);
    var mattress = box(bedW, 0.3, bedD, linenMat);
    mattress.position.set(bedCX, 0.5, bedCZ); g.add(mattress);
    var headboard = box(bedW + 0.2, 1.8, 0.15, mat(0x6B5D4A, 0.7));
    headboard.position.set(bedCX, 1.2, bedHeadZ + 0.08); g.add(headboard);

    // Pillows — ON the mattress at headboard end
    var pillowY = 0.65 + 0.12; // mattress top (0.5+0.15) + half pillow height
    var pillowZ = bedCZ - bedD / 2 + 0.4; // near headboard end
    for (var pi = 0; pi < 2; pi++) {
      var pillow = box(1.4, 0.2, 0.6, pillowMat);
      pillow.position.set(bedCX - 1.2 + pi * 2.4, pillowY, pillowZ); g.add(pillow);
    }
    // Duvet — covers foot of bed
    var duvet = box(bedW - 0.3, 0.06, 3.2, mat(0xD5CFC5, 0.8));
    duvet.position.set(bedCX, 0.68, bedCZ + 0.8); g.add(duvet);

    // Nightstands — flanking bed, against front wall
    [bedCX - bedW / 2 - 0.6, bedCX + bedW / 2 + 0.6].forEach(function(nx) {
      var nsBody = box(0.8, 0.55, 0.6, darkWood);
      nsBody.position.set(nx, 0.28, bedHeadZ + 0.4); g.add(nsBody);
      var nsTop = box(0.85, 0.04, 0.65, woodMat);
      nsTop.position.set(nx, 0.58, bedHeadZ + 0.4); g.add(nsTop);
    });

    // Dresser — against back wall (z = +4) of addition
    var dresser = box(2.8, 0.9, 0.7, darkWood);
    dresser.position.set(aX0 + 2.5, 0.45, aD / 2 - 0.6); g.add(dresser);
    var dresserTop = box(2.9, 0.04, 0.75, woodMat);
    dresserTop.position.set(aX0 + 2.5, 0.92, aD / 2 - 0.6); g.add(dresserTop);

    // ── Bathroom (x: ~12 to 17, z: -4 to +4) ──
    var bathCX = aX0 + 7.5; // x = 14.5, centered in bathroom half

    // Vanity — against front wall (z = -4)
    var vanityBase = box(2.2, 0.85, 0.65, cabinetMat);
    vanityBase.position.set(bathCX, 0.43, -aD / 2 + 0.55); g.add(vanityBase);
    var vanityTop = box(2.4, 0.06, 0.7, quartzMat);
    vanityTop.position.set(bathCX, 0.88, -aD / 2 + 0.55); g.add(vanityTop);
    // Sink basin
    var sink = box(0.5, 0.12, 0.4, mat(0xF0F0F0, 0.3, 0.1));
    sink.position.set(bathCX, 0.82, -aD / 2 + 0.55); g.add(sink);

    // Toilet — against east wall (x = 17), tank flush to wall, bowl faces -x (into room)
    var toiletBase = box(0.7, 0.5, 0.5, whiteMat);
    toiletBase.position.set(aX0 + aW - 0.6, 0.25, -1); g.add(toiletBase);
    var toiletTank = box(0.25, 0.5, 0.45, whiteMat);
    toiletTank.position.set(aX0 + aW - 0.2, 0.55, -1); g.add(toiletTank);
    // Bowl hole
    var bowlHole = box(0.4, 0.06, 0.35, mat(0x1a1a2e, 0.3));
    bowlHole.position.set(aX0 + aW - 0.8, 0.52, -1); g.add(bowlHole);

    // Shower — corner against east wall (x = 17) and back wall (z = +4)
    var showerBase = box(2.2, 0.08, 2.2, tileMat);
    showerBase.position.set(aX0 + aW - 1.4, 0.04, aD / 2 - 1.4); g.add(showerBase);
    var showerWallBack = box(2.2, 5, 0.1, tileMat);
    showerWallBack.position.set(aX0 + aW - 1.4, 2.5, aD / 2 - 0.3); g.add(showerWallBack);
    var showerWallSide = box(0.1, 5, 2.2, tileMat);
    showerWallSide.position.set(aX0 + aW - 0.35, 2.5, aD / 2 - 1.4); g.add(showerWallSide);
    var showerGlass = box(0.04, 4.5, 2.0, mat(0xCCDDEE, 0.1, 0.05));
    showerGlass.material.transparent = true; showerGlass.material.opacity = 0.15;
    showerGlass.position.set(aX0 + aW - 2.45, 2.3, aD / 2 - 1.4); g.add(showerGlass);

    // Tile floor marker for bathroom area
    var tileFloor = box(5, 0.02, aD, tileMat);
    tileFloor.position.set(bathCX, 0.01, 0); g.add(tileFloor);

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

  /* ═══ Process Visual Lifecycle ═══ */

  // Step 0: Site assessment — camera shows existing house, grid visible with addition footprint
  function prepareStep0() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procCamera.position.set(-8, 35, 12);
    procCamera.lookAt(-3, 0, 0);
    setProcLightsIntensity(0);
    procMarkDirty();
  }
  function scrubStep0(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera descends, panning to show both footprints
    procCamera.position.set(-8 + 4 * s, 35 - 10 * s, 12 + 8 * s);
    procCamera.lookAt(-3 + 2 * s, 0, 0);
    // Fade grid lines
    procGroups.grid.children.forEach(function(line) {
      if (line.material) line.material.opacity = 0.15 + 0.2 * s;
    });
    procMarkDirty();
  }

  // Step 1: Plans — existing house foundation + new addition foundation rises
  function prepareStep1() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = -2;
    procCamera.position.set(-4, 25, 20);
    procCamera.lookAt(-1, 0, 0);
    procMarkDirty();
  }
  function scrubStep1(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Foundation rises from below
    procGroups.foundation.position.y = -2 + 2 * s;
    // Camera moves closer
    procCamera.position.set(-4 + 6 * s, 25 - 5 * s, 20 + 2 * s);
    procCamera.lookAt(-1 + s, 1 * s, 0);
    procMarkDirty();
  }

  // Step 2: Structural tie-in — existing walls appear, new addition walls grow
  function prepareStep2() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 0, 1);
    procCamera.position.set(0, 20, 22);
    procCamera.lookAt(0, 2, 0);
    procMarkDirty();
  }
  function scrubStep2(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Walls grow up
    procGroups.walls.scale.y = s;
    // Camera orbits to see the connection
    procCamera.position.set(0 + 12 * s, 20 - 4 * s, 22 - 2 * s);
    procCamera.lookAt(0, 2 + 2 * s, 0);
    procMarkDirty();
  }

  // Step 3: Framing — all walls up, roof appears descending, connection visible
  function prepareStep3() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.visible = true;
    procGroups.roof.position.y = 6;
    procCamera.position.set(12, 18, 18);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }
  function scrubStep3(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Roof descends into place
    procGroups.roof.position.y = 6 - 6 * s;
    // Camera sweeps to reveal connection
    procCamera.position.set(12 + 4 * s, 18 + 2 * s, 18 - 4 * s);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }

  // Step 4: Finishing — windows, doors, interior elements pop in
  function prepareStep4() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.visible = true;
    procGroups.roof.position.y = 0;
    procGroups.windows.visible = true;
    // Start with windows transparent
    procGroups.windows.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = 0;
        obj.material.needsUpdate = true;
      }
    });
    procGroups.interior.visible = true;
    // Start furniture tiny
    procGroups.interior.children.forEach(function(piece) {
      if (piece.isPointLight) return;
      piece.scale.set(0, 0, 0);
    });
    setProcLightsIntensity(0);
    procCamera.position.set(16, 18, 16);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep4(t) {
    if (!procCamera) return;
    // Windows fade in (0-40%)
    var winP = remap(t, 0, 0.4);
    procGroups.windows.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = winP * (obj.material.color.r > 0.4 ? 0.3 : 1);
        obj.material.needsUpdate = true;
      }
    });
    // Furniture pops in (25-65%, staggered)
    var children = procGroups.interior.children;
    var meshIdx = 0;
    children.forEach(function(piece) {
      if (piece.isPointLight) return;
      var pieceStart = 0.25 + (meshIdx / 7) * 0.35;
      var pieceP = remap(t, pieceStart, pieceStart + 0.12);
      var es = easeOutBack(pieceP);
      piece.scale.set(es, es, es);
      meshIdx++;
    });
    // Lights fade on (55-85%)
    var lightP = smoothstep(remap(t, 0.55, 0.85));
    setProcLightsIntensity(lightP);
    // Camera push closer
    var s = smoothstep(t);
    procCamera.position.set(16 - 4 * s, 18 - 4 * s, 16 + 4 * s);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }

  // Step 5: Complete — warm lights, golden glow, camera reveals full expanded home
  function prepareStep5() {
    if (!procCamera) return;
    setProcGroupsVisible(true);
    procGroups.foundation.position.y = 0;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.position.y = 0;
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
    setProcLightsIntensity(1);
    procCamera.position.set(12, 14, 20);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep5(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera sweeps for full expanded home reveal
    procCamera.position.set(12 + 12 * s, 14 - 2 * s, 20 - 6 * s);
    procCamera.lookAt(0, 3, 0);
    // Boost lights for warm golden glow
    setProcLightsIntensity(1 + 1.0 * s);
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
