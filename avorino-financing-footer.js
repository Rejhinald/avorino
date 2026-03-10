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
     HERO — Three.js Golden Particle Field
     Particles drift upward representing financial growth.
     Subtle constellation lines between nearby particles.
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
    if (goldLine) gsap.fromTo(goldLine, { width: 0 }, { width: '64px', duration: 1.2, delay: 1.0, ease: 'power3.out' });
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

    /* ── Three.js: Golden Particle Field ── */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(0, 0, 40);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    /* ── Particle system ── */
    var PARTICLE_COUNT = isMobile ? 120 : 200;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var velocities = [];
    var opacities = new Float32Array(PARTICLE_COUNT);
    var sizes = new Float32Array(PARTICLE_COUNT);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      // Spread particles in a vertical column area
      positions[i * 3]     = (Math.random() - 0.5) * 30;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;     // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;     // z

      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: 0.015 + Math.random() * 0.025,  // upward drift
        z: (Math.random() - 0.5) * 0.01,
        phase: Math.random() * Math.PI * 2  // wave offset
      });

      opacities[i] = 0.3 + Math.random() * 0.7;
      sizes[i] = 1.5 + Math.random() * 2.5;
    }

    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for varying opacity per particle
    var particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xc9a96e) },
        uGlobalOpacity: { value: 1.0 }
      },
      vertexShader: [
        'attribute float aOpacity;',
        'attribute float aSize;',
        'varying float vOpacity;',
        'void main() {',
        '  vOpacity = aOpacity;',
        '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = aSize * (200.0 / -mvPos.z);',
        '  gl_Position = projectionMatrix * mvPos;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uGlobalOpacity;',
        'varying float vOpacity;',
        'void main() {',
        '  float d = length(gl_PointCoord - vec2(0.5));',
        '  if (d > 0.5) discard;',
        '  float alpha = smoothstep(0.5, 0.15, d) * vOpacity * uGlobalOpacity;',
        '  gl_FragColor = vec4(uColor, alpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── Constellation lines between nearby particles ── */
    var LINE_THRESHOLD = 6.0;
    var MAX_LINES = isMobile ? 40 : 80;
    var linePositions = new Float32Array(MAX_LINES * 6); // 2 vertices * 3 coords per line
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    var lineMat = new THREE.LineBasicMaterial({
      color: 0xc9a96e,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    var lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    /* ── Scroll state ── */
    var scrollSpread = { value: 0 };

    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        scrollSpread.value = self.progress;
      }
    });

    /* ── Mouse tracking ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Animation loop ── */
    var baseAngle = 0;
    var time = 0;

    function animate() {
      requestAnimationFrame(animate);
      time += 0.016;
      baseAngle += 0.002;

      var posArr = particleGeo.attributes.position.array;
      var spread = scrollSpread.value;

      for (var i = 0; i < PARTICLE_COUNT; i++) {
        var idx = i * 3;
        var vel = velocities[i];

        // Wave motion + upward drift
        var waveX = Math.sin(time * 0.5 + vel.phase) * 0.03;
        var speedMult = 1.0 + spread * 3.0; // accelerate on scroll

        posArr[idx]     += (vel.x + waveX) * speedMult;
        posArr[idx + 1] += vel.y * speedMult;
        posArr[idx + 2] += vel.z * speedMult;

        // Spread outward on scroll
        posArr[idx]     += (posArr[idx] > 0 ? 1 : -1) * spread * 0.02;
        posArr[idx + 2] += (posArr[idx + 2] > 0 ? 1 : -1) * spread * 0.01;

        // Wrap particles that go too high or too far
        if (posArr[idx + 1] > 25) {
          posArr[idx + 1] = -25;
          posArr[idx] = (Math.random() - 0.5) * 30;
          posArr[idx + 2] = (Math.random() - 0.5) * 20;
        }
        if (posArr[idx] > 20) posArr[idx] = -20;
        if (posArr[idx] < -20) posArr[idx] = 20;
        if (posArr[idx + 2] > 15) posArr[idx + 2] = -15;
        if (posArr[idx + 2] < -15) posArr[idx + 2] = 15;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Update constellation lines
      var lineIdx = 0;
      var linePosArr = lineGeo.attributes.position.array;
      for (var a = 0; a < PARTICLE_COUNT && lineIdx < MAX_LINES; a++) {
        for (var b = a + 1; b < PARTICLE_COUNT && lineIdx < MAX_LINES; b++) {
          var ax = posArr[a * 3], ay = posArr[a * 3 + 1], az = posArr[a * 3 + 2];
          var bx = posArr[b * 3], by = posArr[b * 3 + 1], bz = posArr[b * 3 + 2];
          var dx = ax - bx, dy = ay - by, dz = az - bz;
          var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < LINE_THRESHOLD) {
            var li = lineIdx * 6;
            linePosArr[li]     = ax; linePosArr[li + 1] = ay; linePosArr[li + 2] = az;
            linePosArr[li + 3] = bx; linePosArr[li + 4] = by; linePosArr[li + 5] = bz;
            lineIdx++;
          }
        }
      }
      // Zero out unused line segments
      for (var z = lineIdx * 6; z < MAX_LINES * 6; z++) {
        linePosArr[z] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);

      // Slow camera orbit
      camera.position.x = Math.sin(baseAngle + mouseX * 0.15) * 5;
      camera.position.y = mouseY * 2;
      camera.position.z = 40 + Math.cos(baseAngle) * 3;
      camera.lookAt(0, 0, 0);

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
     PROCESS SECTION — Scroll-Locked Carousel
     with simple rotating wireframe in .sv-process-visual
     ═══════════════════════════════════════════════ */
  var procScene, procCamera, procRenderer, procAnimId;
  var procCurrentStep = -1;
  var isMobileProc = window.innerWidth < 992;

  /* ── Three.js Scene for Process Section: rotating wireframe polyhedron ── */
  function createProcessScene(canvas) {
    procScene = new THREE.Scene();

    procRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    procRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    procRenderer.setClearColor(0x000000, 0);

    var parent = canvas.parentElement;
    var w = parent.clientWidth, h = parent.clientHeight;
    procRenderer.setSize(w, h, false);

    procCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    procCamera.position.set(0, 0, 8);
    procCamera.lookAt(0, 0, 0);

    // Wireframe icosahedron — elegant geometric shape
    var icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
    var wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xc9a96e,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    var wireframe = new THREE.Mesh(icoGeo, wireframeMat);
    procScene.add(wireframe);

    // Inner smaller icosahedron rotating opposite direction
    var innerGeo = new THREE.IcosahedronGeometry(1.4, 0);
    var innerMat = new THREE.MeshBasicMaterial({
      color: 0xc8222a,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    var innerMesh = new THREE.Mesh(innerGeo, innerMat);
    procScene.add(innerMesh);

    // Ambient glow points
    var glowGeo = new THREE.BufferGeometry();
    var glowCount = 30;
    var glowPos = new Float32Array(glowCount * 3);
    for (var i = 0; i < glowCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var r = 3.2 + Math.random() * 1.5;
      glowPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      glowPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      glowPos[i * 3 + 2] = r * Math.cos(phi);
    }
    glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3));
    var glowMat = new THREE.PointsMaterial({
      color: 0xc9a96e,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    var glowPoints = new THREE.Points(glowGeo, glowMat);
    procScene.add(glowPoints);

    function procAnimate() {
      procAnimId = requestAnimationFrame(procAnimate);
      wireframe.rotation.x += 0.003;
      wireframe.rotation.y += 0.005;
      innerMesh.rotation.x -= 0.004;
      innerMesh.rotation.y -= 0.003;
      glowPoints.rotation.y += 0.001;

      var pCanvas = procRenderer.domElement;
      var pParent = pCanvas.parentElement;
      if (pParent) {
        var pw = pParent.clientWidth, ph = pParent.clientHeight;
        if (pCanvas.width !== pw || pCanvas.height !== ph) {
          procRenderer.setSize(pw, ph, false);
          procCamera.aspect = pw / ph;
          procCamera.updateProjectionMatrix();
        }
      }
      procRenderer.render(procScene, procCamera);
    }
    procAnimate();
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
    tot.textContent = count < 10 ? '0' + count : String(count);
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

    var pos = cardPositions[idx] || cardPositions[0];
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

      /* Create visual container for 3D scene */
      var _visual = document.createElement('div');
      _visual.className = 'sv-process-visual';
      pinned.appendChild(_visual);
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
    var firstPos = cardPositions[0] || { side: 'left', enterFrom: 'left' };
    var firstX = getCardX(firstPos);
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
    }

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

  // Fallback for old HTML structure or mobile
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

    /* ── Poll to protect stat labels from scrambleDecode for 2.5 seconds ── */
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
    if (window.innerWidth > 991) {
      initProcessTimeline();
    } else {
      initProcessFallback();
    }
    initScrollAnimations();
  });

})();
