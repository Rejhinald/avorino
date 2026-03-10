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
     HERO — Three.js Construction Site
     Scroll-pinned: crane swings, steel beams lower,
     building rises floor-by-floor on scroll
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

    /* ═══ Three.js Scene: Construction site with crane ═══ */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(18, 12, 24);
    camera.lookAt(0, 2.5, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.25));
    var pl1 = new THREE.PointLight(0xc9a96e, 0.6, 80);
    pl1.position.set(20, 25, 20); scene.add(pl1);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var solidColor = 0xf0ede8;

    var gridMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var structMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var bracingMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var craneMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var craneAccent = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var beamMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var solidFloorMat = new THREE.MeshStandardMaterial({ color: solidColor, transparent: true, opacity: 0, side: THREE.DoubleSide, roughness: 0.85 });

    /* ── Blueprint Grid ── */
    var gridGroup = new THREE.Group();
    for (var gi = -16; gi <= 16; gi += 2) {
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-16, 0, gi), new THREE.Vector3(16, 0, gi)]), gridMat.clone()));
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(gi, 0, -16), new THREE.Vector3(gi, 0, 16)]), gridMat.clone()));
    }
    scene.add(gridGroup);

    /* ── Building Frame (3 floors, proper proportions) ── */
    var floors = 3;
    var floorH = 3.5;
    var hW = 7, hD = 4; // half-width=7 (14 total), half-depth=4 (8 total)
    var bw = hW * 2, bd = hD * 2;
    var floorGroups = [];

    for (var fl = 0; fl < floors; fl++) {
      var fg = new THREE.Group();
      var yBase = fl * floorH;

      // Floor slab outline
      fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, yBase, -hD), new THREE.Vector3(hW, yBase, -hD),
        new THREE.Vector3(hW, yBase, hD), new THREE.Vector3(-hW, yBase, hD),
        new THREE.Vector3(-hW, yBase, -hD),
      ]), structMat.clone()));

      // Top of this floor
      fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, yBase + floorH, -hD), new THREE.Vector3(hW, yBase + floorH, -hD),
        new THREE.Vector3(hW, yBase + floorH, hD), new THREE.Vector3(-hW, yBase + floorH, hD),
        new THREE.Vector3(-hW, yBase + floorH, -hD),
      ]), structMat.clone()));

      // Columns at corners and mid-spans (8 per floor)
      [[-hW,-hD],[0,-hD],[hW,-hD],[-hW,0],[hW,0],[-hW,hD],[0,hD],[hW,hD]].forEach(function(cp) {
        fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(cp[0], yBase, cp[1]), new THREE.Vector3(cp[0], yBase + floorH, cp[1])
        ]), structMat.clone()));
      });

      // Cross beams (center x and z)
      fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, yBase, -hD), new THREE.Vector3(0, yBase, hD)
      ]), structMat.clone()));
      fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, yBase, 0), new THREE.Vector3(hW, yBase, 0)
      ]), structMat.clone()));

      // X-bracing on front face (z = -hD)
      fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, yBase, -hD), new THREE.Vector3(0, yBase + floorH, -hD)
      ]), bracingMat.clone()));
      fg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, yBase, -hD), new THREE.Vector3(-hW, yBase + floorH, -hD)
      ]), bracingMat.clone()));

      // Solid floor plate (mesh)
      var plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), solidFloorMat.clone());
      plateMesh.rotation.x = -Math.PI / 2;
      plateMesh.position.set(0, yBase + 0.01, 0);
      fg.add(plateMesh);

      // Initially all hidden
      fg.children.forEach(function(c) {
        if (c.material) c.material.opacity = 0;
      });

      scene.add(fg);
      floorGroups.push(fg);
    }

    /* ── Foundation rebar grid below ── */
    var rebarMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var rebarGroup = new THREE.Group();
    for (var ri = -hW; ri <= hW; ri += 2) {
      rebarGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ri, -0.1, -hD), new THREE.Vector3(ri, -0.1, hD)
      ]), rebarMat.clone()));
    }
    for (var rj = -hD; rj <= hD; rj += 2) {
      rebarGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-hW, -0.1, rj), new THREE.Vector3(hW, -0.1, rj)
      ]), rebarMat.clone()));
    }
    scene.add(rebarGroup);

    /* ── Crane ── */
    var craneGroup = new THREE.Group();
    var craneBase = new THREE.Vector3(hW + 3, 0, -hD - 3);
    var craneHeight = floors * floorH + 8;

    // Mast
    craneGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([craneBase, new THREE.Vector3(craneBase.x, craneHeight, craneBase.z)]), craneMat));
    // Mast bracing
    for (var mb = 0; mb < craneHeight; mb += 3) {
      craneGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(craneBase.x - 0.5, mb, craneBase.z),
        new THREE.Vector3(craneBase.x + 0.5, mb + 3, craneBase.z),
      ]), craneMat));
      craneGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(craneBase.x, mb, craneBase.z - 0.5),
        new THREE.Vector3(craneBase.x, mb + 3, craneBase.z + 0.5),
      ]), craneMat));
    }

    // Jib (rotates)
    var jibLength = 12;
    var jibGroup = new THREE.Group();
    jibGroup.position.set(craneBase.x, craneHeight, craneBase.z);
    jibGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(-jibLength, 0, 0)
    ]), craneAccent));
    // Counter-jib
    jibGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(3.5, 0, 0)
    ]), craneMat));
    // Support cables
    jibGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(-jibLength, 0, 0)
    ]), craneMat));
    jibGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(3.5, 0, 0)
    ]), craneMat));
    // Cable down
    var cableGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-jibLength * 0.7, 0, 0), new THREE.Vector3(-jibLength * 0.7, -6, 0)
    ]);
    var cableLine = new THREE.Line(cableGeo, craneAccent);
    jibGroup.add(cableLine);

    craneGroup.add(jibGroup);
    scene.add(craneGroup);

    /* ── Steel beam (hanging from cable) ── */
    var beamGroup = new THREE.Group();
    var beamLen = 2.5;
    beamGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-beamLen/2, 0, 0), new THREE.Vector3(beamLen/2, 0, 0)
    ]), beamMat));
    beamGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-beamLen/2, -0.15, -0.15), new THREE.Vector3(-beamLen/2, 0.15, 0.15)
    ]), beamMat));
    beamGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(beamLen/2, -0.15, -0.15), new THREE.Vector3(beamLen/2, 0.15, 0.15)
    ]), beamMat));
    scene.add(beamGroup);

    /* ── Particles (dust) ── */
    var particles = [];
    var particlePositions = [];
    var particleCount = isMobile ? 20 : 40;
    for (var pp = 0; pp < particleCount; pp++) {
      var px = (Math.random() - 0.5) * 16;
      var py = Math.random() * (craneHeight + 4);
      var pz = (Math.random() - 0.5) * 16;
      particlePositions.push(px, py, pz);
      particles.push({ x: px, y: py, z: pz, speed: 0.003 + Math.random() * 0.008 });
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    var pMat = new THREE.PointsMaterial({ color: wireColor, size: 0.06, transparent: true, opacity: 0, sizeAttenuation: true });
    var pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    /* ── Initial entrance: grid + crane + rebar appear ── */
    gridGroup.children.forEach(function(l) {
      gsap.to(l.material, { opacity: 0.05, duration: 1.5, delay: 0.2, ease: 'power2.out' });
    });
    rebarGroup.children.forEach(function(l) {
      gsap.to(l.material, { opacity: 0.15, duration: 1.5, delay: 0.3, ease: 'power2.out' });
    });
    craneGroup.traverse(function(c) {
      if (c.material) gsap.to(c.material, { opacity: 0.3, duration: 2, delay: 0.5, ease: 'power2.out' });
    });
    jibGroup.traverse(function(c) {
      if (c.material) gsap.to(c.material, { opacity: 0.45, duration: 2, delay: 0.7, ease: 'power2.out' });
    });
    gsap.to(beamMat, { opacity: 0.5, duration: 1.5, delay: 1.5, ease: 'power2.out' });
    gsap.to(pMat, { opacity: 0.3, duration: 1, delay: 1.5, ease: 'power2.out' });

    /* ═══ SCROLL-DRIVEN BUILD: floor-by-floor ═══ */
    var beamTargetY = craneHeight - 6;

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=' + (window.innerHeight * 1.0),
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: function(self) {
        var p = self.progress;

        // Floor-by-floor reveal (3 floors, each takes ~0.28 of progress)
        for (var fi = 0; fi < floors; fi++) {
          var floorStart = fi * 0.28;
          var floorEnd = floorStart + 0.28;
          var floorP = Math.max(0, Math.min(1, (p - floorStart) / (floorEnd - floorStart)));

          floorGroups[fi].children.forEach(function(c, ci) {
            if (!c.material) return;
            var childP = Math.max(0, Math.min(1, (floorP - ci * 0.05) * 2));
            if (c.type === 'Mesh') {
              c.material.opacity = childP * 0.05;
            } else {
              var isAccent = c.material.color && c.material.color.getHex() === accentColor;
              c.material.opacity = childP * (isAccent ? 0.45 : 0.35);
            }
          });

          // Beam follows current building floor
          if (p >= floorStart && p <= floorEnd) {
            beamTargetY = fi * floorH + floorH * floorP;
          }
        }

        // Rebar fades as building rises (0%–30%)
        var rebarF = p < 0.3 ? 1 : Math.max(0, 1 - (p - 0.3) / 0.15);
        rebarGroup.children.forEach(function(l) { l.material.opacity = 0.15 * rebarF; });

        // Grid fades (85%–100%)
        var gridF = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1;
        gridGroup.children.forEach(function(l) { l.material.opacity = 0.05 * gridF; });

        // Camera orbit changes
        var camR = 24 + p * 6;
        var camH = 12 + p * 6;
        camera.userData.scrollRadius = camR;
        camera.userData.scrollHeight = camH;
      }
    });

    /* ── Mouse parallax ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Render loop ── */
    var time = 0;
    camera.userData.scrollRadius = 24;
    camera.userData.scrollHeight = 12;

    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      // Crane jib rotation
      jibGroup.rotation.y = Math.sin(time * 0.25) * 0.5;

      // Beam position
      var jibTip = new THREE.Vector3(-jibLength * 0.7, 0, 0);
      jibGroup.localToWorld(jibTip);
      beamGroup.position.set(jibTip.x, beamTargetY, jibTip.z);
      beamGroup.rotation.y = jibGroup.rotation.y;

      // Update cable length
      var cableVerts = cableLine.geometry.attributes.position.array;
      cableVerts[4] = beamTargetY - craneHeight;
      cableLine.geometry.attributes.position.needsUpdate = true;

      // Camera orbit
      var orbitR = camera.userData.scrollRadius;
      var camH = camera.userData.scrollHeight;
      var angle = time * 0.12 + mouseX * 0.3;
      camera.position.set(
        Math.cos(angle) * orbitR,
        camH + mouseY * 2,
        Math.sin(angle) * orbitR
      );
      camera.lookAt(0, 2.5, 0);

      // Particles
      var pos = pSystem.geometry.attributes.position.array;
      for (var k = 0; k < particles.length; k++) {
        particles[k].y += particles[k].speed;
        if (particles[k].y > craneHeight + 4) {
          particles[k].y = 0;
          particles[k].x = (Math.random() - 0.5) * 16;
          particles[k].z = (Math.random() - 0.5) * 16;
        }
        pos[k * 3] = particles[k].x;
        pos[k * 3 + 1] = particles[k].y;
        pos[k * 3 + 2] = particles[k].z;
      }
      pSystem.geometry.attributes.position.needsUpdate = true;

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

  /* ── Multi-Story Residential Building: Realistic Architecture (ADU Visualizer style) ── */
  var ncWT = 0.5;   // wall thickness
  var ncFH = 3.5;   // floor height per story
  var ncBW = 18;    // building width (x)
  var ncBD = 14;    // building depth (z)
  var ncFloors = 3;
  var ncWH = ncFloors * ncFH; // total wall height = 10.5

  var mat = function(color, rough, metal) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
  };
  var box = function(w, h, d, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };

  // ── Shared: Build a wall with rectangular openings cut out ──
  // wall along X-axis at given z, from x0 to x1, height wallH, thickness ncWT
  // openings: [{ x, y, w, h }] — center x, bottom y, width, height
  function buildWallSegments(g, x0, x1, z, openings, wallMat, axis, wallH) {
    axis = axis || 'z';
    wallH = wallH || ncWH;
    var totalLen = x1 - x0;

    if (!openings || openings.length === 0) {
      var solid;
      if (axis === 'z') {
        solid = box(totalLen, wallH, ncWT, wallMat);
        solid.position.set((x0 + x1) / 2, wallH / 2, z);
      } else {
        solid = box(ncWT, wallH, totalLen, wallMat);
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
          seg = box(segW, wallH, ncWT, wallMat);
          seg.position.set(cursor + segW / 2, wallH / 2, z);
        } else {
          seg = box(ncWT, wallH, segW, wallMat);
          seg.position.set(z, wallH / 2, cursor + segW / 2);
        }
        g.add(seg);
      }

      // Wall above opening
      if (oTop < wallH - 0.05) {
        var aboveH = wallH - oTop;
        var above;
        if (axis === 'z') {
          above = box(op.w, aboveH, ncWT, wallMat);
          above.position.set(op.x, oTop + aboveH / 2, z);
        } else {
          above = box(ncWT, aboveH, op.w, wallMat);
          above.position.set(z, oTop + aboveH / 2, op.x);
        }
        g.add(above);
      }

      // Wall below opening (sill)
      if (oBottom > 0.05) {
        var below;
        if (axis === 'z') {
          below = box(op.w, oBottom, ncWT, wallMat);
          below.position.set(op.x, oBottom / 2, z);
        } else {
          below = box(ncWT, oBottom, op.w, wallMat);
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
        endSeg = box(endW, wallH, ncWT, wallMat);
        endSeg.position.set(cursor + endW / 2, wallH / 2, z);
      } else {
        endSeg = box(ncWT, wallH, endW, wallMat);
        endSeg.position.set(z, wallH / 2, cursor + endW / 2);
      }
      g.add(endSeg);
    }
  }

  // ── Corner posts (fill gaps where walls meet) ──
  function addCornerPost(g, x, z, wallMat, h) {
    h = h || ncWH;
    var post = box(ncWT, h, ncWT, wallMat);
    post.position.set(x, h / 2, z);
    g.add(post);
  }

  // Blueprint grid
  function buildProcGrid() {
    var g = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: 0x3377BB, transparent: true, opacity: 0.12 });
    for (var i = -10; i <= 10; i++) {
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2, 0.01, -14), new THREE.Vector3(i * 2, 0.01, 14)
      ]), gridMat.clone()));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0.01, i * 2), new THREE.Vector3(20, 0.01, i * 2)
      ]), gridMat.clone()));
    }
    // Lot boundary
    var lotMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.35 });
    var lotPts = [
      new THREE.Vector3(-14, 0.02, -12), new THREE.Vector3(14, 0.02, -12),
      new THREE.Vector3(14, 0.02, 12), new THREE.Vector3(-14, 0.02, 12),
      new THREE.Vector3(-14, 0.02, -12)
    ];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lotPts), lotMat));
    // Setback lines (dashed)
    var setbackMat = new THREE.LineDashedMaterial({ color: 0x5599DD, transparent: true, opacity: 0.25, dashSize: 0.6, gapSize: 0.4 });
    var setbackPts = [
      new THREE.Vector3(-12, 0.03, -10), new THREE.Vector3(12, 0.03, -10),
      new THREE.Vector3(12, 0.03, 10), new THREE.Vector3(-12, 0.03, 10),
      new THREE.Vector3(-12, 0.03, -10)
    ];
    var setbackLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(setbackPts), setbackMat);
    setbackLine.computeLineDistances();
    g.add(setbackLine);
    return g;
  }

  // Foundation with floor slabs at each level
  function buildProcFoundation() {
    var g = new THREE.Group();
    var slabMat = mat(0xC8C0B8, 0.95);
    var footingMat = mat(0xB0A898, 0.92);
    var floorMat = mat(0xDED5C4, 0.75);
    var mX0 = -ncBW / 2, mX1 = ncBW / 2;
    var mZ0 = -ncBD / 2, mZ1 = ncBD / 2;

    // Ground slab
    var mainSlab = box(ncBW + 0.4, 0.4, ncBD + 0.4, slabMat);
    mainSlab.position.set(0, -0.2, 0);
    g.add(mainSlab);

    // Footings (perimeter)
    var fh = 0.6, fw = 0.8;
    var bf1 = box(ncBW + 0.4, fh, fw, footingMat); bf1.position.set(0, -fh / 2, mZ0); g.add(bf1);
    var bf2 = box(ncBW + 0.4, fh, fw, footingMat); bf2.position.set(0, -fh / 2, mZ1); g.add(bf2);
    var bf3 = box(fw, fh, ncBD, footingMat); bf3.position.set(mX0, -fh / 2, 0); g.add(bf3);
    var bf4 = box(fw, fh, ncBD, footingMat); bf4.position.set(mX1, -fh / 2, 0); g.add(bf4);

    // Floor finish at ground level
    var gFloor = box(ncBW - ncWT * 2, 0.05, ncBD - ncWT * 2, floorMat);
    gFloor.position.set(0, 0.01, 0);
    g.add(gFloor);

    // Floor slabs at each upper level
    for (var fl = 1; fl < ncFloors; fl++) {
      var slab = box(ncBW, 0.2, ncBD, slabMat);
      slab.position.set(0, fl * ncFH, 0);
      g.add(slab);
      var flr = box(ncBW - ncWT * 2, 0.05, ncBD - ncWT * 2, floorMat);
      flr.position.set(0, fl * ncFH + 0.025, 0);
      g.add(flr);
    }

    return g;
  }

  // Walls with proper openings (ADU Visualizer architecture) — 3 stories
  function buildProcWalls() {
    var g = new THREE.Group();
    var extMat = mat(0xF5F5F5, 0.9);
    extMat.transparent = true; extMat.opacity = 0.12; extMat.side = THREE.DoubleSide;
    var intMat = mat(0xFAFAFA, 0.92);
    intMat.transparent = true; intMat.opacity = 0.1; intMat.side = THREE.DoubleSide;
    var mX0 = -ncBW / 2, mX1 = ncBW / 2;
    var mZ0 = -ncBD / 2, mZ1 = ncBD / 2;

    // ── Ground floor (y=0 to 3.5) ──
    // Front wall (south, z = mZ0) — entrance door + large windows
    buildWallSegments(g, mX0, mX1, mZ0, [
      { x: -6, y: 0.5, w: 3, h: 2.8 },   // large window left
      { x: -1.5, y: 0, w: 2.5, h: 3.2 },  // entrance door
      { x: 3, y: 0.5, w: 3, h: 2.8 },     // large window center-right
      { x: 7, y: 0.5, w: 3, h: 2.8 },     // large window far-right
    ], extMat, 'z', ncFH);
    // Left wall (west, x = mX0)
    buildWallSegments(g, mZ0, mZ1, mX0, [
      { x: -4, y: 0.5, w: 3, h: 2.8 },
      { x: 3, y: 0.5, w: 3, h: 2.8 },
    ], extMat, 'x', ncFH);
    // Right wall (east, x = mX1)
    buildWallSegments(g, mZ0, mZ1, mX1, [
      { x: -4, y: 0.5, w: 3, h: 2.8 },
      { x: 3, y: 0.5, w: 3, h: 2.8 },
    ], extMat, 'x', ncFH);
    // Back wall (north, z = mZ1) — REMOVED for cutaway

    // ── Upper floors (floor 1 and 2) ──
    for (var fl = 1; fl < ncFloors; fl++) {
      var yOff = fl * ncFH;
      // Front wall — standard windows
      var frontG = new THREE.Group();
      frontG.position.y = yOff;
      buildWallSegments(frontG, mX0, mX1, mZ0, [
        { x: -6, y: 0.5, w: 2.5, h: 2.5 },
        { x: -1.5, y: 0.5, w: 2.5, h: 2.5 },
        { x: 3, y: 0.5, w: 2.5, h: 2.5 },
        { x: 7, y: 0.5, w: 2.5, h: 2.5 },
      ], extMat, 'z', ncFH);
      g.add(frontG);

      // Left wall
      var leftG = new THREE.Group();
      leftG.position.y = yOff;
      buildWallSegments(leftG, mZ0, mZ1, mX0, [
        { x: -4, y: 0.5, w: 2.5, h: 2.5 },
        { x: 3, y: 0.5, w: 2.5, h: 2.5 },
      ], extMat, 'x', ncFH);
      g.add(leftG);

      // Right wall
      var rightG = new THREE.Group();
      rightG.position.y = yOff;
      buildWallSegments(rightG, mZ0, mZ1, mX1, [
        { x: -4, y: 0.5, w: 2.5, h: 2.5 },
        { x: 3, y: 0.5, w: 2.5, h: 2.5 },
      ], extMat, 'x', ncFH);
      g.add(rightG);
      // Back wall — REMOVED for cutaway
    }

    // Corner posts at all corners, full height
    addCornerPost(g, mX0, mZ0, extMat);
    addCornerPost(g, mX1, mZ0, extMat);
    addCornerPost(g, mX0, mZ1, extMat);
    addCornerPost(g, mX1, mZ1, extMat);

    // ── Interior walls (with door openings) ──
    // Ground floor: lobby/living divider running along z at x = -2
    var intG0 = new THREE.Group();
    buildWallSegments(intG0, mZ0 + 1, mZ1 - 1, -2, [
      { x: 0, y: 0, w: 2.5, h: 3 },
    ], intMat, 'x', ncFH);
    g.add(intG0);

    // Ground floor: kitchen/dining divider running along x at z = 2
    var intG1 = new THREE.Group();
    buildWallSegments(intG1, -2, mX1 - 1, 2, [
      { x: 2, y: 0, w: 2.5, h: 3 },
    ], intMat, 'z', ncFH);
    g.add(intG1);

    // Upper floors: corridor walls
    for (var fl2 = 1; fl2 < ncFloors; fl2++) {
      // Central corridor wall along x at z = 0
      var corrG = new THREE.Group();
      corrG.position.y = fl2 * ncFH;
      buildWallSegments(corrG, mX0 + 1, mX1 - 1, 0, [
        { x: -4, y: 0, w: 2.5, h: 3 },
        { x: 4, y: 0, w: 2.5, h: 3 },
      ], intMat, 'z', ncFH);
      g.add(corrG);

      // Room divider along z at x = 0
      var divG = new THREE.Group();
      divG.position.y = fl2 * ncFH;
      buildWallSegments(divG, mZ0 + 1, -0.5, 0, [
        { x: -4, y: 0, w: 2.5, h: 3 },
      ], intMat, 'x', ncFH);
      g.add(divG);
    }

    return g;
  }

  // Flat roof with slight slope, parapet around edges
  function buildProcRoof() {
    var g = new THREE.Group();
    var roofMat = mat(0x3A3430, 0.8);
    var parapetMat = mat(0x4A4440, 0.75);
    var ROOF_Y = ncWH;
    var OVH = 0.5;
    var mX0 = -ncBW / 2, mX1 = ncBW / 2;
    var mZ0 = -ncBD / 2, mZ1 = ncBD / 2;

    // Flat roof slab with slight slope
    var roofSlab = box(ncBW + OVH * 2, 0.35, ncBD + OVH * 2, roofMat);
    roofSlab.position.set(0, ROOF_Y + 0.175, 0);
    roofSlab.rotation.x = -0.02; // slight slope for drainage
    roofSlab.castShadow = true;
    g.add(roofSlab);

    // Parapet walls (front, left, right — no back for cutaway)
    var parapetH = 1.2;
    var frontParapet = box(ncBW + OVH * 2, parapetH, 0.3, parapetMat);
    frontParapet.position.set(0, ROOF_Y + 0.35 + parapetH / 2, mZ0 - OVH);
    frontParapet.castShadow = true;
    g.add(frontParapet);
    var leftParapet = box(0.3, parapetH, ncBD + OVH * 2, parapetMat);
    leftParapet.position.set(mX0 - OVH, ROOF_Y + 0.35 + parapetH / 2, 0);
    leftParapet.castShadow = true;
    g.add(leftParapet);
    var rightParapet = box(0.3, parapetH, ncBD + OVH * 2, parapetMat);
    rightParapet.position.set(mX1 + OVH, ROOF_Y + 0.35 + parapetH / 2, 0);
    rightParapet.castShadow = true;
    g.add(rightParapet);
    // NO back parapet — REMOVED for cutaway

    // Semi-transparent back parapet hint
    var backParapetMat = new THREE.MeshStandardMaterial({ color: 0x4A3C30, roughness: 0.75, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    var backP = box(ncBW + OVH * 2, parapetH, 0.3, backParapetMat);
    backP.position.set(0, ROOF_Y + 0.35 + parapetH / 2, mZ1 + OVH);
    g.add(backP);

    // Fascia accent line
    var fasciaMat = mat(0xF5F0E8, 0.7);
    var fasciaF = box(ncBW + OVH * 2, 0.2, 0.1, fasciaMat);
    fasciaF.position.set(0, ROOF_Y - 0.1, mZ0 - OVH); g.add(fasciaF);

    // Ridge line accent
    var ridgeMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.5 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(mX0 - OVH, ROOF_Y + 0.35, 0), new THREE.Vector3(mX1 + OVH, ROOF_Y + 0.35, 0)
    ]), ridgeMat));

    return g;
  }

  // Windows, doors, and frames (proper openings with frames + glass)
  function buildProcWindows() {
    var g = new THREE.Group();
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, metalness: 0.1,
      transparent: true, opacity: 0.35, side: THREE.DoubleSide
    });
    var frameMat = mat(0x6B7280, 0.4, 0.2);
    var doorFrameMat = mat(0x8B7355, 0.6);
    var doorPanelMat = mat(0xA68B5B, 0.6);
    var mZ0 = -ncBD / 2;
    var mX0 = -ncBW / 2, mX1 = ncBW / 2;

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
      var fTop = box(w + 0.4, 0.2, ncWT + 0.1, doorFrameMat);
      fTop.position.set(0, h + 0.1, 0); dg.add(fTop);
      var fL = box(0.2, h, ncWT + 0.1, doorFrameMat);
      fL.position.set(-w / 2 - 0.1, h / 2, 0); dg.add(fL);
      var fR = box(0.2, h, ncWT + 0.1, doorFrameMat);
      fR.position.set(w / 2 + 0.1, h / 2, 0); dg.add(fR);
      var panel = box(w - 0.1, h - 0.1, 0.15, doorPanelMat);
      panel.position.set(0, h / 2, 0); dg.add(panel);
      dg.position.set(x, y, z);
      if (rotY) dg.rotation.y = rotY;
      g.add(dg);
    }

    // ── Ground floor windows (south wall) ──
    addWindow(-6, 0.5, mZ0 - 0.05, 3, 2.8, 0);
    addWindow(3, 0.5, mZ0 - 0.05, 3, 2.8, 0);
    addWindow(7, 0.5, mZ0 - 0.05, 3, 2.8, 0);
    // Entrance door
    addDoor(-1.5, 0, mZ0, 2.5, 3.2, 0);
    // Ground floor side walls — x=wall position, z=position along wall
    addWindow(mX0 - 0.05, 0.5, -4, 3, 2.8, Math.PI / 2);
    addWindow(mX0 - 0.05, 0.5, 3, 3, 2.8, Math.PI / 2);
    addWindow(mX1 + 0.05, 0.5, -4, 3, 2.8, Math.PI / 2);
    addWindow(mX1 + 0.05, 0.5, 3, 3, 2.8, Math.PI / 2);

    // ── Upper floors ──
    for (var fl = 1; fl < ncFloors; fl++) {
      var yOff = fl * ncFH;
      // Front wall windows
      addWindow(-6, yOff + 0.5, mZ0 - 0.05, 2.5, 2.5, 0);
      addWindow(-1.5, yOff + 0.5, mZ0 - 0.05, 2.5, 2.5, 0);
      addWindow(3, yOff + 0.5, mZ0 - 0.05, 2.5, 2.5, 0);
      addWindow(7, yOff + 0.5, mZ0 - 0.05, 2.5, 2.5, 0);
      // Left wall windows
      addWindow(mX0 - 0.05, yOff + 0.5, -4, 2.5, 2.5, Math.PI / 2);
      addWindow(mX0 - 0.05, yOff + 0.5, 3, 2.5, 2.5, Math.PI / 2);
      // Right wall windows
      addWindow(mX1 + 0.05, yOff + 0.5, -4, 2.5, 2.5, Math.PI / 2);
      addWindow(mX1 + 0.05, yOff + 0.5, 3, 2.5, 2.5, Math.PI / 2);
    }

    return g;
  }

  // Interior: lights, furniture per floor, baseboards
  function buildProcInterior() {
    var g = new THREE.Group();
    var lights = [];
    var y1 = 0.18;                    // ground floor base (above slab)
    var y2 = ncFH + 0.18;            // 2nd floor base
    var y3 = ncFH * 2 + 0.36;        // 3rd floor base

    // Wall boundaries (inner faces, accounting for wall thickness)
    var WX0 = -ncBW / 2 + ncWT;      // left inner wall  = -8.5
    var WX1 = ncBW / 2 - ncWT;       // right inner wall = 8.5
    var WZ0 = -ncBD / 2 + ncWT;      // front inner wall = -6.5
    var WZ1 = ncBD / 2 - ncWT;       // back inner wall  = 6.5 (cutaway side)

    // Ceiling lights per floor
    var lightDefs = [
      { x: -5, z: 0, y: ncFH - 0.5, color: 0xFFD699, intensity: 5 },
      { x: 3, z: -2, y: ncFH - 0.5, color: 0xFFF0D0, intensity: 5 },
      { x: 3, z: 4, y: ncFH - 0.5, color: 0xFFD699, intensity: 4 },
      { x: -4, z: -3, y: ncFH * 2 - 0.5, color: 0xFFE4B5, intensity: 4 },
      { x: 4, z: -3, y: ncFH * 2 - 0.5, color: 0xFFE4B5, intensity: 4 },
      { x: -4, z: 3, y: ncFH * 2 - 0.5, color: 0xFFE4B5, intensity: 3.5 },
      { x: 4, z: 3, y: ncFH * 2 - 0.5, color: 0xFFE4B5, intensity: 3.5 },
      { x: -4, z: -3, y: ncFH * 3 - 0.5, color: 0xFFF0D0, intensity: 3.5 },
      { x: 4, z: -3, y: ncFH * 3 - 0.5, color: 0xFFF0D0, intensity: 3.5 },
      { x: -4, z: 3, y: ncFH * 3 - 0.5, color: 0xFFF0D0, intensity: 3 },
      { x: 4, z: 3, y: ncFH * 3 - 0.5, color: 0xFFF0D0, intensity: 3 },
    ];
    lightDefs.forEach(function(def) {
      var light = new THREE.PointLight(def.color, def.intensity, 18, 2);
      light.position.set(def.x, def.y, def.z);
      g.add(light);
      light.userData._maxIntensity = def.intensity;
      lights.push(light);
    });
    g.userData.lights = lights;

    // Materials
    var woodMat = mat(0x8B7355, 0.7);
    var darkWood = mat(0x5C4033, 0.75);
    var fabricSlate = mat(0x4A5568, 0.85);
    var fabricDark = mat(0x3A4555, 0.85);
    var cushionMat = mat(0x546478, 0.82);
    var leatherMat = mat(0x2C3E50, 0.78);
    var quartzMat = mat(0xF0EDE8, 0.3, 0.05);
    var marbleMat = mat(0xE8E2D8, 0.35, 0.05);
    var cabinetMat = mat(0xF0ECE6, 0.6);
    var steelMat = mat(0xC0C0C0, 0.25, 0.15);
    var blackMat = mat(0x111111, 0.3, 0.05);
    var glassMat = mat(0x88AACC, 0.15, 0.1);
    var linenMat = mat(0xE8E0D5, 0.85);
    var pillowMat = mat(0xBEB5A8, 0.82);
    var ceramicMat = mat(0xF5F5F0, 0.4, 0.05);
    var greenMat = mat(0x3A7D44, 0.8);
    var potMat = mat(0x8B6914, 0.7);
    var bathMatMat = mat(0x6B8E8A, 0.9);
    var showerGlass = mat(0xCCDDEE, 0.1, 0.05);
    showerGlass.transparent = true; showerGlass.opacity = 0.15;

    // ── addBed helper ──
    function addBed(bx, bz, bw, bd, baseY, dir) {
      var mH = 0.3;
      var fH2 = 0.25;
      var hbH = 1.2;
      var pillH = 0.12;
      var pillD = 0.4;

      var frame = box(bw + 0.2, fH2, bd + 0.2, darkWood);
      frame.position.set(bx, baseY + fH2 / 2, bz); g.add(frame);
      var mattress = box(bw, mH, bd, linenMat);
      mattress.position.set(bx, baseY + fH2 + mH / 2, bz); g.add(mattress);
      var duvet = box(bw - 0.2, 0.06, bd * 0.55, mat(0xD5CFC5, 0.8));

      var hb, pw = bw / 3;
      if (dir === 'z-') {
        hb = box(bw + 0.2, hbH, 0.15, mat(0x6B5D4A, 0.7));
        hb.position.set(bx, baseY + fH2 + hbH / 2, bz - bd / 2 - 0.08); g.add(hb);
        for (var pi = 0; pi < 2; pi++) {
          var pillow = box(pw, pillH, pillD, pillowMat);
          pillow.position.set(bx - bw / 4 + pi * bw / 2, baseY + fH2 + mH + pillH / 2, bz - bd / 2 + pillD / 2 + 0.1);
          g.add(pillow);
        }
        duvet.position.set(bx, baseY + fH2 + mH + 0.03, bz + bd * 0.15);
      } else if (dir === 'z+') {
        hb = box(bw + 0.2, hbH, 0.15, mat(0x6B5D4A, 0.7));
        hb.position.set(bx, baseY + fH2 + hbH / 2, bz + bd / 2 + 0.08); g.add(hb);
        for (var pi = 0; pi < 2; pi++) {
          var pillow = box(pw, pillH, pillD, pillowMat);
          pillow.position.set(bx - bw / 4 + pi * bw / 2, baseY + fH2 + mH + pillH / 2, bz + bd / 2 - pillD / 2 - 0.1);
          g.add(pillow);
        }
        duvet.position.set(bx, baseY + fH2 + mH + 0.03, bz - bd * 0.15);
      } else if (dir === 'x-') {
        hb = box(0.15, hbH, bd + 0.2, mat(0x6B5D4A, 0.7));
        hb.position.set(bx - bw / 2 - 0.08, baseY + fH2 + hbH / 2, bz); g.add(hb);
        var pzw = bd / 3;
        for (var pi = 0; pi < 2; pi++) {
          var pillow = box(pillD, pillH, pzw, pillowMat);
          pillow.position.set(bx - bw / 2 + pillD / 2 + 0.1, baseY + fH2 + mH + pillH / 2, bz - bd / 4 + pi * bd / 2);
          g.add(pillow);
        }
        duvet.position.set(bx + bw * 0.15, baseY + fH2 + mH + 0.03, bz);
      } else { // 'x+'
        hb = box(0.15, hbH, bd + 0.2, mat(0x6B5D4A, 0.7));
        hb.position.set(bx + bw / 2 + 0.08, baseY + fH2 + hbH / 2, bz); g.add(hb);
        var pzw = bd / 3;
        for (var pi = 0; pi < 2; pi++) {
          var pillow = box(pillD, pillH, pzw, pillowMat);
          pillow.position.set(bx + bw / 2 - pillD / 2 - 0.1, baseY + fH2 + mH + pillH / 2, bz - bd / 4 + pi * bd / 2);
          g.add(pillow);
        }
        duvet.position.set(bx - bw * 0.15, baseY + fH2 + mH + 0.03, bz);
      }
      g.add(duvet);
    }

    // ── addToilet helper: cx,cz = center, baseY = floor, facingWall = which wall tank faces ──
    function addToilet(cx, cz, baseY, facingWall) {
      // Bowl base
      var bowlBase = box(0.5, 0.35, 0.55, ceramicMat);
      bowlBase.position.set(cx, baseY + 0.175, cz); g.add(bowlBase);
      // Bowl hole (dark recessed top)
      var bowlHole = box(0.35, 0.04, 0.35, blackMat);
      bowlHole.position.set(cx, baseY + 0.36, cz); g.add(bowlHole);
      // Seat ring
      var seatRing = box(0.48, 0.03, 0.5, mat(0xEEEEEE, 0.3, 0.05));
      seatRing.position.set(cx, baseY + 0.37, cz); g.add(seatRing);
      // Tank - positioned against the wall
      var tankW = 0.45, tankH = 0.45, tankD = 0.2;
      var tankX = cx, tankZ = cz;
      if (facingWall === 'x+') { tankX = cx + 0.55 / 2 + tankD / 2 - 0.05; }
      else if (facingWall === 'x-') { tankX = cx - 0.55 / 2 - tankD / 2 + 0.05; }
      else if (facingWall === 'z+') { tankZ = cz + 0.55 / 2 + tankD / 2 - 0.05; }
      else { tankZ = cz - 0.55 / 2 - tankD / 2 + 0.05; }
      var tankMesh;
      if (facingWall === 'x+' || facingWall === 'x-') {
        tankMesh = box(tankD, tankH, tankW, ceramicMat);
      } else {
        tankMesh = box(tankW, tankH, tankD, ceramicMat);
      }
      tankMesh.position.set(tankX, baseY + 0.35 + tankH / 2, tankZ); g.add(tankMesh);
    }

    // ── addChair helper: simple dining/desk chair ──
    function addChair(cx, cz, baseY, facing, chairMat) {
      var sW = 0.5, sD = 0.5, sH = 0.55;
      var seat = box(sW, 0.05, sD, chairMat || darkWood);
      seat.position.set(cx, baseY + sH, cz); g.add(seat);
      // 4 legs
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(function(lp) {
        var leg = box(0.04, sH, 0.04, darkWood);
        leg.position.set(cx + lp[0], baseY + sH / 2, cz + lp[1]); g.add(leg);
      });
      // Backrest
      var backH = 0.5;
      var bx = cx, bz = cz;
      if (facing === 'z-') bz = cz - sD / 2 + 0.02;
      else if (facing === 'z+') bz = cz + sD / 2 - 0.02;
      else if (facing === 'x-') bx = cx - sW / 2 + 0.02;
      else bx = cx + sW / 2 - 0.02;
      var backW = (facing === 'x-' || facing === 'x+') ? 0.04 : sW - 0.05;
      var backD = (facing === 'x-' || facing === 'x+') ? sD - 0.05 : 0.04;
      var back = box(backW, backH, backD, chairMat || darkWood);
      back.position.set(bx, baseY + sH + backH / 2, bz); g.add(back);
    }

    // ═══════════════════════════════════════════════════
    // GROUND FLOOR — Lobby, Living Room, Kitchen/Dining
    // ═══════════════════════════════════════════════════

    // ── Lobby (x: -8.5 to -2, z: -6.5 to 6.5) ──

    // Reception desk (L-shaped) near center, facing the door (assumed at front z-)
    // Long part along x
    var rDeskLong = box(4, 1.05, 1.0, darkWood);
    rDeskLong.position.set(-5.25, y1 + 0.525, -1); g.add(rDeskLong);
    var rDeskTop1 = box(4.1, 0.04, 1.1, quartzMat);
    rDeskTop1.position.set(-5.25, y1 + 1.07, -1); g.add(rDeskTop1);
    // Short part along z (forming the L)
    var rDeskShort = box(1.0, 1.05, 2.0, darkWood);
    rDeskShort.position.set(-3.75, y1 + 0.525, -2.5); g.add(rDeskShort);
    var rDeskTop2 = box(1.1, 0.04, 2.1, quartzMat);
    rDeskTop2.position.set(-3.75, y1 + 1.07, -2.5); g.add(rDeskTop2);

    // 2 waiting chairs against front wall
    addChair(-7.0, WZ0 + 0.6, y1, 'z-', leatherMat);
    addChair(-5.5, WZ0 + 0.6, y1, 'z-', leatherMat);

    // Small side table between chairs
    var sideT = box(0.5, 0.5, 0.5, woodMat);
    sideT.position.set(-6.25, y1 + 0.25, WZ0 + 0.6); g.add(sideT);

    // Tall potted plant in back-left corner
    var potCyl = box(0.5, 0.6, 0.5, potMat);  // approximate cylinder with box
    potCyl.position.set(WX0 + 0.5, y1 + 0.3, WZ1 - 0.5); g.add(potCyl);
    // Green sphere canopy
    var canopyGeo = new THREE.SphereGeometry(0.7, 12, 10);
    var canopy = new THREE.Mesh(canopyGeo, greenMat);
    canopy.position.set(WX0 + 0.5, y1 + 1.4, WZ1 - 0.5); g.add(canopy);
    // Trunk
    var trunk = box(0.1, 0.6, 0.1, mat(0x5C4020, 0.8));
    trunk.position.set(WX0 + 0.5, y1 + 0.9, WZ1 - 0.5); g.add(trunk);

    // ── Living Room (x: -2 to 8.5, z: -6.5 to 2) ──

    // Sectional sofa L-shaped against front wall (z = WZ0)
    // Long section along x against front wall
    var sofaLongW = 6, sofaD = 2.0, sofaBackH = 0.8;
    var sofaLongCX = 2;
    var sofaLongCZ = WZ0 + sofaD / 2 + 0.1;
    var sofaLBase = box(sofaLongW, 0.3, sofaD, fabricSlate);
    sofaLBase.position.set(sofaLongCX, y1 + 0.15, sofaLongCZ); g.add(sofaLBase);
    var sofaLBack = box(sofaLongW, sofaBackH, 0.3, fabricSlate);
    sofaLBack.position.set(sofaLongCX, y1 + 0.7, WZ0 + 0.25); g.add(sofaLBack);
    // Arm at right end
    var sofaLArmR = box(0.25, 0.5, sofaD, fabricSlate);
    sofaLArmR.position.set(sofaLongCX + sofaLongW / 2 - 0.12, y1 + 0.55, sofaLongCZ); g.add(sofaLArmR);
    // Seat cushions
    for (var sc = 0; sc < 3; sc++) {
      var cush = box(1.8, 0.22, 1.6, cushionMat);
      cush.position.set(sofaLongCX - 2 + sc * 2, y1 + 0.42, sofaLongCZ + 0.1); g.add(cush);
    }
    // Short section along z (L-piece, at left end x = -1)
    var sofaShortD = 3.0;
    var sofaShortCX = -1.0;
    var sofaShortCZ = WZ0 + sofaD + sofaShortD / 2 - 0.3;
    var sofaSBase = box(sofaD, 0.3, sofaShortD, fabricSlate);
    sofaSBase.position.set(sofaShortCX, y1 + 0.15, sofaShortCZ); g.add(sofaSBase);
    // Back along divider wall (x = -2)
    var sofaSBack = box(0.3, sofaBackH, sofaShortD, fabricSlate);
    sofaSBack.position.set(-1.85, y1 + 0.7, sofaShortCZ); g.add(sofaSBack);
    // Arm at end
    var sofaSArm = box(sofaD, 0.5, 0.25, fabricSlate);
    sofaSArm.position.set(sofaShortCX, y1 + 0.55, sofaShortCZ + sofaShortD / 2 - 0.12); g.add(sofaSArm);

    // Coffee table in front of sofa
    var ctX = 2, ctZ = WZ0 + sofaD + 1.5;
    var ctTop = box(2.2, 0.06, 1.2, glassMat);
    ctTop.material.transparent = true; ctTop.material.opacity = 0.25;
    ctTop.position.set(ctX, y1 + 0.48, ctZ); g.add(ctTop);
    [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]].forEach(function(lp) {
      var leg = box(0.05, 0.42, 0.05, steelMat);
      leg.position.set(ctX + lp[0], y1 + 0.24, ctZ + lp[1]); g.add(leg);
    });

    // TV/entertainment unit against divider wall (z = 2)
    var tvUnit = box(5, 0.5, 0.6, darkWood);
    tvUnit.position.set(3, y1 + 0.25, 2 - 0.4); g.add(tvUnit);
    var tvUnitTop = box(5.1, 0.04, 0.7, quartzMat);
    tvUnitTop.position.set(3, y1 + 0.52, 2 - 0.4); g.add(tvUnitTop);
    // TV screen
    var tvScreen = box(3.5, 2.0, 0.08, blackMat);
    tvScreen.position.set(3, y1 + 1.6, 2 - 0.35); g.add(tvScreen);
    // TV screen face (slightly lighter to show screen)
    var tvFace = box(3.3, 1.85, 0.01, mat(0x1A1A2E, 0.2, 0.1));
    tvFace.position.set(3, y1 + 1.6, 2 - 0.4); g.add(tvFace);

    // Floor lamp near sofa corner (right end)
    var lampPole = box(0.06, 1.8, 0.06, steelMat);
    lampPole.position.set(sofaLongCX + sofaLongW / 2 + 0.5, y1 + 0.9, WZ0 + 0.8); g.add(lampPole);
    var lampBase = box(0.35, 0.04, 0.35, steelMat);
    lampBase.position.set(sofaLongCX + sofaLongW / 2 + 0.5, y1 + 0.02, WZ0 + 0.8); g.add(lampBase);
    var lampShade = box(0.5, 0.35, 0.5, mat(0xF0E8D8, 0.9));
    lampShade.position.set(sofaLongCX + sofaLongW / 2 + 0.5, y1 + 1.95, WZ0 + 0.8); g.add(lampShade);

    // ── Kitchen/Dining (x: -2 to 8.5, z: 2 to 6.5) ──

    // Kitchen counter along right wall (x = WX1), running in z
    var counterD = 1.0, counterL = 4.0;
    var counterCX = WX1 - counterD / 2 - 0.05;
    var counterCZ = 4.25;
    var counterCab = box(counterD, 0.9, counterL, cabinetMat);
    counterCab.position.set(counterCX, y1 + 0.45, counterCZ); g.add(counterCab);
    var counterTop = box(counterD + 0.1, 0.06, counterL + 0.1, quartzMat);
    counterTop.position.set(counterCX, y1 + 0.93, counterCZ); g.add(counterTop);

    // Kitchen island parallel to counter
    var islandCX = counterCX - 2.8;
    var islandCZ = counterCZ;
    var islandBase = box(1.0, 0.9, 3.5, cabinetMat);
    islandBase.position.set(islandCX, y1 + 0.45, islandCZ); g.add(islandBase);
    var islandTop = box(1.3, 0.06, 3.7, quartzMat);
    islandTop.position.set(islandCX, y1 + 0.93, islandCZ); g.add(islandTop);

    // 3 bar stools at island
    for (var bs = 0; bs < 3; bs++) {
      var stoolZ = islandCZ - 1.2 + bs * 1.2;
      var stoolX = islandCX - 1.0;
      var stoolSeat = box(0.45, 0.06, 0.45, leatherMat);
      stoolSeat.position.set(stoolX, y1 + 0.85, stoolZ); g.add(stoolSeat);
      var stoolPole = box(0.06, 0.85, 0.06, steelMat);
      stoolPole.position.set(stoolX, y1 + 0.42, stoolZ); g.add(stoolPole);
      var stoolBase = box(0.4, 0.04, 0.4, steelMat);
      stoolBase.position.set(stoolX, y1 + 0.02, stoolZ); g.add(stoolBase);
    }

    // Fridge in corner (right wall + back area)
    var fridgeW = 1.2, fridgeD = 0.9, fridgeH = 2.8;
    var fridgeX = WX1 - fridgeD / 2 - 0.05;
    var fridgeZ = WZ1 - fridgeW / 2 - 0.1;
    var fridgeBody = box(fridgeD, fridgeH, fridgeW, steelMat);
    fridgeBody.position.set(fridgeX, y1 + fridgeH / 2, fridgeZ); g.add(fridgeBody);
    var fridgeDoor = box(0.04, fridgeH * 0.6, fridgeW - 0.05, mat(0xD0D0D0, 0.2, 0.15));
    fridgeDoor.position.set(fridgeX - fridgeD / 2 - 0.02, y1 + fridgeH * 0.55, fridgeZ); g.add(fridgeDoor);

    // Dining table (6-person) center-left area
    var dtX = 1.0, dtZ = 4.25;
    var dtW = 2.5, dtD = 1.2;
    var dtTop = box(dtW, 0.06, dtD, woodMat);
    dtTop.position.set(dtX, y1 + 0.93, dtZ); g.add(dtTop);
    [[-1.0, -0.45], [1.0, -0.45], [-1.0, 0.45], [1.0, 0.45]].forEach(function(lp) {
      var dleg = box(0.06, 0.9, 0.06, darkWood);
      dleg.position.set(dtX + lp[0], y1 + 0.45, dtZ + lp[1]); g.add(dleg);
    });
    // 6 chairs around dining table: 2 on each long side, 1 on each short end
    addChair(dtX - 0.7, dtZ - dtD / 2 - 0.5, y1, 'z+', darkWood);
    addChair(dtX + 0.7, dtZ - dtD / 2 - 0.5, y1, 'z+', darkWood);
    addChair(dtX - 0.7, dtZ + dtD / 2 + 0.5, y1, 'z-', darkWood);
    addChair(dtX + 0.7, dtZ + dtD / 2 + 0.5, y1, 'z-', darkWood);
    addChair(dtX - dtW / 2 - 0.5, dtZ, y1, 'x+', darkWood);
    addChair(dtX + dtW / 2 + 0.5, dtZ, y1, 'x-', darkWood);

    // ═══════════════════════════════════════════════════
    // 2ND FLOOR — 3 Bedrooms + Shared Bathroom
    // ═══════════════════════════════════════════════════

    // ── Bedroom 1 (front-left, x: -8.5 to 0, z: -6.5 to 0) ──
    // Queen bed against front wall (z-), headboard touching WZ0
    addBed(-4.5, WZ0 + 2.5, 3.5, 4.5, y2, 'z-');
    // Nightstands flanking
    var ns1 = box(0.6, 0.55, 0.5, darkWood);
    ns1.position.set(-4.5 - 2.0, y2 + 0.275, WZ0 + 0.5); g.add(ns1);
    var ns2 = box(0.6, 0.55, 0.5, darkWood);
    ns2.position.set(-4.5 + 2.0, y2 + 0.275, WZ0 + 0.5); g.add(ns2);
    // Dresser against left wall
    var dresser1 = box(0.6, 0.8, 2.5, darkWood);
    dresser1.position.set(WX0 + 0.35, y2 + 0.4, -3); g.add(dresser1);
    var dresser1Top = box(0.65, 0.03, 2.6, quartzMat);
    dresser1Top.position.set(WX0 + 0.35, y2 + 0.82, -3); g.add(dresser1Top);

    // ── Bedroom 2 (front-right, x: 0 to 8.5, z: -6.5 to 0) ──
    // Queen bed against right wall (x+), headboard touching WX1
    addBed(WX1 - 2.5, -3.5, 3.5, 4.5, y2, 'x+');
    // Nightstands flanking
    var ns3 = box(0.5, 0.55, 0.6, darkWood);
    ns3.position.set(WX1 - 0.5, y2 + 0.275, -3.5 - 2.0); g.add(ns3);
    var ns4 = box(0.5, 0.55, 0.6, darkWood);
    ns4.position.set(WX1 - 0.5, y2 + 0.275, -3.5 + 2.0); g.add(ns4);
    // Small desk + chair against front wall
    var bd2DeskW = 2.5, bd2DeskD = 0.7;
    var bd2DeskX = 3.5, bd2DeskZ = WZ0 + bd2DeskD / 2 + 0.1;
    var bd2DeskTop = box(bd2DeskW, 0.05, bd2DeskD, woodMat);
    bd2DeskTop.position.set(bd2DeskX, y2 + 0.93, bd2DeskZ); g.add(bd2DeskTop);
    [[-1.0, -0.25], [1.0, -0.25], [-1.0, 0.25], [1.0, 0.25]].forEach(function(lp) {
      var dleg = box(0.05, 0.9, 0.05, steelMat);
      dleg.position.set(bd2DeskX + lp[0], y2 + 0.45, bd2DeskZ + lp[1]); g.add(dleg);
    });
    addChair(bd2DeskX, bd2DeskZ + 0.8, y2, 'z-', darkWood);

    // ── Bedroom 3 (back-left, x: -8.5 to 0, z: 0 to 6.5) ──
    // Twin bed against left wall (x-), headboard touching WX0
    addBed(WX0 + 2.0, 3.0, 2.5, 3.5, y2, 'x-');
    // Nightstand
    var ns5 = box(0.5, 0.55, 0.5, darkWood);
    ns5.position.set(WX0 + 0.5, y2 + 0.275, 3.0 + 2.2); g.add(ns5);
    // Small wardrobe against back area
    var wardrobe = box(1.5, 2.5, 0.7, darkWood);
    wardrobe.position.set(-4, y2 + 1.25, WZ1 - 0.45); g.add(wardrobe);
    // Wardrobe doors detail
    var wdDoor1 = box(0.72, 2.3, 0.03, mat(0x6B5D4A, 0.7));
    wdDoor1.position.set(-4.37, y2 + 1.25, WZ1 - 0.08); g.add(wdDoor1);
    var wdDoor2 = box(0.72, 2.3, 0.03, mat(0x6B5D4A, 0.7));
    wdDoor2.position.set(-3.63, y2 + 1.25, WZ1 - 0.08); g.add(wdDoor2);

    // ── Shared Bathroom (back-right, x: 0 to 8.5, z: 0 to 6.5) ──

    // Vanity with sink against right wall (x = WX1)
    var vanW = 0.6, vanL = 2.5;
    var vanBase = box(vanW, 0.85, vanL, cabinetMat);
    vanBase.position.set(WX1 - vanW / 2 - 0.05, y2 + 0.425, 2.5); g.add(vanBase);
    var vanTop = box(vanW + 0.1, 0.05, vanL + 0.1, marbleMat);
    vanTop.position.set(WX1 - vanW / 2 - 0.05, y2 + 0.9, 2.5); g.add(vanTop);
    // Sink basin
    var sinkBasin = box(0.4, 0.08, 0.35, mat(0xDDDDDD, 0.3, 0.1));
    sinkBasin.position.set(WX1 - vanW / 2 - 0.05, y2 + 0.88, 2.5); g.add(sinkBasin);
    // Mirror above vanity
    var mirror1 = box(0.05, 1.2, 1.8, mat(0xAABBCC, 0.05, 0.9));
    mirror1.position.set(WX1 - 0.05, y2 + 1.8, 2.5); g.add(mirror1);

    // Toilet next to vanity, tank against right wall
    addToilet(WX1 - 0.45, 4.5, y2, 'x+');

    // Walk-in shower in back-right corner
    var showerX1 = WX1, showerZ1 = WZ1;
    var showerW = 2.5, showerD = 2.5;
    // Shower tray
    var showerTray = box(showerW, 0.08, showerD, mat(0xE0E0E0, 0.3, 0.1));
    showerTray.position.set(showerX1 - showerW / 2, y2 + 0.04, showerZ1 - showerD / 2); g.add(showerTray);
    // Glass panels (two sides - front and left of shower)
    var shGlassF = box(showerW, 2.2, 0.06, showerGlass);
    shGlassF.position.set(showerX1 - showerW / 2, y2 + 1.1, showerZ1 - showerD + 0.03); g.add(shGlassF);
    var shGlassL = box(0.06, 2.2, showerD, showerGlass);
    shGlassL.position.set(showerX1 - showerW + 0.03, y2 + 1.1, showerZ1 - showerD / 2); g.add(shGlassL);
    // Shower head
    var shHead = box(0.3, 0.06, 0.3, steelMat);
    shHead.position.set(showerX1 - 0.4, y2 + 2.3, showerZ1 - 0.4); g.add(shHead);
    var shPipe = box(0.04, 0.8, 0.04, steelMat);
    shPipe.position.set(showerX1 - 0.15, y2 + 1.9, showerZ1 - 0.15); g.add(shPipe);

    // Bath mat
    var bathMat1 = box(1.0, 0.03, 0.6, bathMatMat);
    bathMat1.position.set(5, y2 + 0.015, 3.5); g.add(bathMat1);

    // ═══════════════════════════════════════════════════
    // 3RD FLOOR — Master Bedroom, Study, Master Bath, Lounge
    // ═══════════════════════════════════════════════════

    // ── Master Bedroom (front-left, x: -8.5 to 0, z: -6.5 to 0) ──
    // King bed against front wall, headboard touching WZ0
    addBed(-4.5, WZ0 + 3, 5, 5.5, y3, 'z-');
    // Nightstands flanking
    var mns1 = box(0.6, 0.55, 0.5, darkWood);
    mns1.position.set(-4.5 - 2.8, y3 + 0.275, WZ0 + 0.5); g.add(mns1);
    var mns2 = box(0.6, 0.55, 0.5, darkWood);
    mns2.position.set(-4.5 + 2.8, y3 + 0.275, WZ0 + 0.5); g.add(mns2);
    // Bench at foot of bed
    var benchW = 3.5, benchD = 0.8, benchH = 0.45;
    var benchZ = WZ0 + 5.8;
    var benchSeat = box(benchW, 0.12, benchD, fabricDark);
    benchSeat.position.set(-4.5, y3 + benchH, benchZ); g.add(benchSeat);
    var benchFrame = box(benchW + 0.1, benchH - 0.12, benchD + 0.1, darkWood);
    benchFrame.position.set(-4.5, y3 + (benchH - 0.12) / 2, benchZ); g.add(benchFrame);

    // ── Master Study (front-right, x: 0 to 8.5, z: -6.5 to 0) ──
    // Large desk against right wall
    var deskW = 1.2, deskL = 4.5;
    var deskX = WX1 - deskW / 2 - 0.1;
    var deskZ = -3.25;
    var deskTop = box(deskW, 0.06, deskL, woodMat);
    deskTop.position.set(deskX, y3 + 0.93, deskZ); g.add(deskTop);
    [[-0.5, -2.0], [0.5, -2.0], [-0.5, 2.0], [0.5, 2.0]].forEach(function(lp) {
      var dleg = box(0.06, 0.9, 0.06, steelMat);
      dleg.position.set(deskX + lp[0], y3 + 0.45, deskZ + lp[1]); g.add(dleg);
    });
    // Desk drawers (panel on right side)
    var deskDrawers = box(0.5, 0.6, 1.2, darkWood);
    deskDrawers.position.set(deskX + 0.2, y3 + 0.5, deskZ + 1.4); g.add(deskDrawers);

    // Office chair in front of desk
    var oChairX = deskX - 1.3, oChairZ = deskZ;
    var oChairSeat = box(0.65, 0.06, 0.65, leatherMat);
    oChairSeat.position.set(oChairX, y3 + 0.65, oChairZ); g.add(oChairSeat);
    var oChairPole = box(0.06, 0.45, 0.06, steelMat);
    oChairPole.position.set(oChairX, y3 + 0.4, oChairZ); g.add(oChairPole);
    var oChairBase = box(0.5, 0.04, 0.5, steelMat);
    oChairBase.position.set(oChairX, y3 + 0.02, oChairZ); g.add(oChairBase);
    var oChairBack = box(0.6, 0.7, 0.06, leatherMat);
    oChairBack.position.set(oChairX, y3 + 1.0, oChairZ + 0.3); g.add(oChairBack);

    // Bookcase against front wall
    var bcW = 4.5, bcD = 0.6, bcH = 2.8;
    var bcX = 4.0, bcZ = WZ0 + bcD / 2 + 0.05;
    var bookcase = box(bcW, bcH, bcD, darkWood);
    bookcase.position.set(bcX, y3 + bcH / 2, bcZ); g.add(bookcase);
    // Shelf lines
    for (var si = 1; si <= 4; si++) {
      var shelf = box(bcW - 0.1, 0.04, bcD - 0.1, woodMat);
      shelf.position.set(bcX, y3 + si * (bcH / 5), bcZ); g.add(shelf);
    }
    // Books on shelves (colored rectangles)
    var bookColors = [0x8B0000, 0x1B4F72, 0x196F3D, 0x7D6608, 0x6C3483];
    for (var si = 1; si <= 4; si++) {
      var shelfY = y3 + si * (bcH / 5) + 0.02;
      for (var bi = 0; bi < 4; bi++) {
        var bkH = 0.3 + Math.random() * 0.15;
        var bkW = 0.12 + Math.random() * 0.08;
        var bk = box(bkW, bkH, 0.35, mat(bookColors[(si + bi) % bookColors.length], 0.8));
        bk.position.set(bcX - 1.5 + bi * 0.9, shelfY + bkH / 2, bcZ);
        g.add(bk);
      }
    }

    // ── Master Bathroom (back-left, x: -8.5 to 0, z: 0 to 6.5) ──

    // Double vanity against left wall
    var mVanW = 0.6, mVanL = 4.0;
    var mVanBase = box(mVanW, 0.85, mVanL, cabinetMat);
    mVanBase.position.set(WX0 + mVanW / 2 + 0.05, y3 + 0.425, 3.25); g.add(mVanBase);
    var mVanTop = box(mVanW + 0.1, 0.05, mVanL + 0.1, marbleMat);
    mVanTop.position.set(WX0 + mVanW / 2 + 0.05, y3 + 0.9, 3.25); g.add(mVanTop);
    // Two sink basins
    var sink1 = box(0.35, 0.08, 0.3, mat(0xDDDDDD, 0.3, 0.1));
    sink1.position.set(WX0 + mVanW / 2 + 0.05, y3 + 0.88, 2.2); g.add(sink1);
    var sink2 = box(0.35, 0.08, 0.3, mat(0xDDDDDD, 0.3, 0.1));
    sink2.position.set(WX0 + mVanW / 2 + 0.05, y3 + 0.88, 4.3); g.add(sink2);
    // Mirror above vanity
    var mirror2 = box(0.05, 1.2, 3.5, mat(0xAABBCC, 0.05, 0.9));
    mirror2.position.set(WX0 + 0.05, y3 + 1.8, 3.25); g.add(mirror2);

    // Toilet, tank against back wall (z+)
    addToilet(-3.5, WZ1 - 0.5, y3, 'z+');

    // Large walk-in shower in back-left corner
    var mShowerW = 3.0, mShowerD = 2.5;
    var mShowerX0 = WX0, mShowerZ1 = WZ1;
    // Shower tray
    var mShowerTray = box(mShowerW, 0.08, mShowerD, mat(0xE0E0E0, 0.3, 0.1));
    mShowerTray.position.set(mShowerX0 + mShowerW / 2, y3 + 0.04, mShowerZ1 - mShowerD / 2); g.add(mShowerTray);
    // Glass panels (front and right sides)
    var mShGlassF = box(mShowerW, 2.2, 0.06, showerGlass);
    mShGlassF.position.set(mShowerX0 + mShowerW / 2, y3 + 1.1, mShowerZ1 - mShowerD + 0.03); g.add(mShGlassF);
    var mShGlassR = box(0.06, 2.2, mShowerD, showerGlass);
    mShGlassR.position.set(mShowerX0 + mShowerW - 0.03, y3 + 1.1, mShowerZ1 - mShowerD / 2); g.add(mShGlassR);
    // Shower head
    var mShHead = box(0.35, 0.06, 0.35, steelMat);
    mShHead.position.set(mShowerX0 + 0.5, y3 + 2.3, mShowerZ1 - 0.4); g.add(mShHead);
    var mShPipe = box(0.04, 0.8, 0.04, steelMat);
    mShPipe.position.set(mShowerX0 + 0.15, y3 + 1.9, mShowerZ1 - 0.15); g.add(mShPipe);

    // Bath mat
    var bathMat2 = box(1.2, 0.03, 0.7, bathMatMat);
    bathMat2.position.set(WX0 + 1.5, y3 + 0.015, 2.0); g.add(bathMat2);

    // ── Lounge (back-right, x: 0 to 8.5, z: 0 to 6.5) ──

    // Small sofa against right wall
    var lSofaW = 3.5, lSofaD = 1.6;
    var lSofaCX = WX1 - lSofaD / 2 - 0.1;
    var lSofaCZ = 3.25;
    var lSofaBase = box(lSofaD, 0.3, lSofaW, fabricSlate);
    lSofaBase.position.set(lSofaCX, y3 + 0.15, lSofaCZ); g.add(lSofaBase);
    var lSofaBack = box(0.25, 0.7, lSofaW, fabricSlate);
    lSofaBack.position.set(WX1 - 0.2, y3 + 0.65, lSofaCZ); g.add(lSofaBack);
    var lSofaArm1 = box(lSofaD, 0.45, 0.2, fabricSlate);
    lSofaArm1.position.set(lSofaCX, y3 + 0.52, lSofaCZ - lSofaW / 2 + 0.1); g.add(lSofaArm1);
    var lSofaArm2 = box(lSofaD, 0.45, 0.2, fabricSlate);
    lSofaArm2.position.set(lSofaCX, y3 + 0.52, lSofaCZ + lSofaW / 2 - 0.1); g.add(lSofaArm2);
    // Cushions
    for (var lc = 0; lc < 2; lc++) {
      var lCush = box(1.3, 0.2, 1.5, cushionMat);
      lCush.position.set(lSofaCX, y3 + 0.4, lSofaCZ - 0.8 + lc * 1.6); g.add(lCush);
    }

    // Side table next to sofa
    var lSideT = box(0.6, 0.55, 0.6, woodMat);
    lSideT.position.set(lSofaCX - 1.2, y3 + 0.275, lSofaCZ - lSofaW / 2 + 0.5); g.add(lSideT);

    // Floor lamp
    var lLampPole = box(0.06, 1.8, 0.06, steelMat);
    lLampPole.position.set(lSofaCX - 1.2, y3 + 0.9, lSofaCZ + lSofaW / 2 - 0.3); g.add(lLampPole);
    var lLampBase = box(0.35, 0.04, 0.35, steelMat);
    lLampBase.position.set(lSofaCX - 1.2, y3 + 0.02, lSofaCZ + lSofaW / 2 - 0.3); g.add(lLampBase);
    var lLampShade = box(0.45, 0.3, 0.45, mat(0xF0E8D8, 0.9));
    lLampShade.position.set(lSofaCX - 1.2, y3 + 1.95, lSofaCZ + lSofaW / 2 - 0.3); g.add(lLampShade);

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

  // Step 0: Site survey — camera overhead, grid visible, slight descent
  function prepareStep0() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procCamera.position.set(0, 45, 5);
    procCamera.lookAt(0, 0, 0);
    setProcLightsIntensity(0);
    procMarkDirty();
  }
  function scrubStep0(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera descends from overhead survey position
    procCamera.position.set(-6 * s, 45 - 15 * s, 5 + 15 * s);
    procCamera.lookAt(0, 0, 0);
    // Fade grid lines
    procGroups.grid.children.forEach(function(line) {
      if (line.material) line.material.opacity = 0.15 + 0.2 * s;
    });
    procMarkDirty();
  }

  // Step 1: Excavation — foundation rises from below grade
  function prepareStep1() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = -4;
    procCamera.position.set(-6, 30, 20);
    procCamera.lookAt(0, 0, 0);
    procMarkDirty();
  }
  function scrubStep1(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Foundation rises from below grade
    procGroups.foundation.position.y = -4 + 4 * s;
    // Camera moves closer
    procCamera.position.set(-6 + 8 * s, 30 - 8 * s, 20 + 2 * s);
    procCamera.lookAt(0, 2 * s, 0);
    procMarkDirty();
  }

  // Step 2: Structure — floor plates and columns appear floor-by-floor
  function prepareStep2() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 0, 1);
    procCamera.position.set(2, 22, 24);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep2(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Walls/columns grow up floor-by-floor
    procGroups.walls.scale.y = s;
    // Camera rises with the building
    procCamera.position.set(2 + 10 * s, 22 - 2 * s, 24 - 4 * s);
    procCamera.lookAt(0, 3 + 4 * s, 0);
    procMarkDirty();
  }

  // Step 3: Framing — walls fully up, roof/parapet lowers into place
  function prepareStep3() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    procGroups.roof.visible = true;
    procGroups.roof.position.y = 8;
    procCamera.position.set(12, 20, 20);
    procCamera.lookAt(0, 6, 0);
    procMarkDirty();
  }
  function scrubStep3(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Roof lowers into place from above
    procGroups.roof.position.y = 8 - 8 * s;
    // Camera sweep
    procCamera.position.set(12 + 6 * s, 20 + 2 * s, 20 - 4 * s);
    procCamera.lookAt(0, 6, 0);
    procMarkDirty();
  }

  // Step 4: Envelope — curtain wall glass fades in, scaffold appears
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
    // Start scaffold/equipment tiny
    procGroups.interior.children.forEach(function(piece) {
      if (piece.isPointLight) return;
      piece.scale.set(0, 0, 0);
    });
    setProcLightsIntensity(0);
    procCamera.position.set(18, 18, 18);
    procCamera.lookAt(0, 5, 0);
    procMarkDirty();
  }
  function scrubStep4(t) {
    if (!procCamera) return;
    // Glass curtain wall fades in (0-50%)
    var winP = remap(t, 0, 0.5);
    procGroups.windows.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = winP * (obj.material.color.r > 0.4 ? 0.3 : 1);
        obj.material.needsUpdate = true;
      }
    });
    // Scaffold/equipment pops in (20-60%, staggered)
    var children = procGroups.interior.children;
    var meshIdx = 0;
    children.forEach(function(piece) {
      if (piece.isPointLight) return;
      var pieceStart = 0.2 + (meshIdx / 8) * 0.35;
      var pieceP = remap(t, pieceStart, pieceStart + 0.15);
      var es = easeOutBack(pieceP);
      piece.scale.set(es, es, es);
      meshIdx++;
    });
    // Work lights fade on (50-85%)
    var lightP = smoothstep(remap(t, 0.5, 0.85));
    setProcLightsIntensity(lightP);
    // Camera push closer
    var s = smoothstep(t);
    procCamera.position.set(18 - 4 * s, 18 - 2 * s, 18 + 4 * s);
    procCamera.lookAt(0, 5, 0);
    procMarkDirty();
  }

  // Step 5: Completion — interior lights warm up, camera pulls back for full reveal
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
    procCamera.position.set(14, 16, 22);
    procCamera.lookAt(0, 5, 0);
    procMarkDirty();
  }
  function scrubStep5(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera pulls back for full building reveal
    procCamera.position.set(14 + 14 * s, 16 - 2 * s, 22 - 6 * s);
    procCamera.lookAt(0, 5, 0);
    // Boost lights for warm completion glow
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
