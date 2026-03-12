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
     HERO — Three.js Property Value Growth
     Floating house wireframe with upward-drifting value
     particles and ascending graph nodes connected by lines.
     Gold (#c9a96e) house wireframe, red (#c8222a) growth accents.
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

    /* ── Three.js: Property Value Growth Scene ── */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(0, 2, 40);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    /* ── House wireframe (simple BoxGeometry outline) ── */
    var houseGroup = new THREE.Group();

    // Main body — box edges
    var bodyGeo = new THREE.BoxGeometry(6, 4, 5);
    var bodyEdges = new THREE.EdgesGeometry(bodyGeo);
    var bodyLine = new THREE.LineSegments(bodyEdges, new THREE.LineBasicMaterial({
      color: 0xc9a96e, transparent: true, opacity: 0.55
    }));
    bodyLine.position.y = 0;
    houseGroup.add(bodyLine);

    // Roof — triangular prism using BufferGeometry
    var roofVerts = new Float32Array([
      // Front triangle
      -3.2, 2, 2.7,   3.2, 2, 2.7,   0, 4.5, 2.7,
      // Back triangle
      -3.2, 2, -2.7,  3.2, 2, -2.7,  0, 4.5, -2.7,
    ]);
    // Roof edges as line segments
    var roofLinePositions = new Float32Array([
      // Front triangle
      -3.2, 2, 2.7,   3.2, 2, 2.7,
       3.2, 2, 2.7,   0, 4.5, 2.7,
       0, 4.5, 2.7,  -3.2, 2, 2.7,
      // Back triangle
      -3.2, 2, -2.7,  3.2, 2, -2.7,
       3.2, 2, -2.7,  0, 4.5, -2.7,
       0, 4.5, -2.7, -3.2, 2, -2.7,
      // Ridge + eave connections
       0, 4.5, 2.7,    0, 4.5, -2.7,
      -3.2, 2, 2.7,  -3.2, 2, -2.7,
       3.2, 2, 2.7,   3.2, 2, -2.7,
    ]);
    var roofGeo = new THREE.BufferGeometry();
    roofGeo.setAttribute('position', new THREE.BufferAttribute(roofLinePositions, 3));
    var roofLine = new THREE.LineSegments(roofGeo, new THREE.LineBasicMaterial({
      color: 0xc9a96e, transparent: true, opacity: 0.55
    }));
    houseGroup.add(roofLine);

    // Door outline on front face
    var doorPositions = new Float32Array([
      -0.8, -2, 2.51,  0.8, -2, 2.51,
       0.8, -2, 2.51,  0.8, 0, 2.51,
       0.8, 0, 2.51,  -0.8, 0, 2.51,
      -0.8, 0, 2.51,  -0.8, -2, 2.51,
    ]);
    var doorGeo = new THREE.BufferGeometry();
    doorGeo.setAttribute('position', new THREE.BufferAttribute(doorPositions, 3));
    var doorLine = new THREE.LineSegments(doorGeo, new THREE.LineBasicMaterial({
      color: 0xc9a96e, transparent: true, opacity: 0.4
    }));
    houseGroup.add(doorLine);

    // Window on front face (right side)
    var winPositions = new Float32Array([
       1.5, -0.2, 2.51,  2.5, -0.2, 2.51,
       2.5, -0.2, 2.51,  2.5,  0.8, 2.51,
       2.5,  0.8, 2.51,  1.5,  0.8, 2.51,
       1.5,  0.8, 2.51,  1.5, -0.2, 2.51,
      // Cross bars
       2.0, -0.2, 2.51,  2.0,  0.8, 2.51,
       1.5,  0.3, 2.51,  2.5,  0.3, 2.51,
    ]);
    var winGeo = new THREE.BufferGeometry();
    winGeo.setAttribute('position', new THREE.BufferAttribute(winPositions, 3));
    var winLine = new THREE.LineSegments(winGeo, new THREE.LineBasicMaterial({
      color: 0xc9a96e, transparent: true, opacity: 0.35
    }));
    houseGroup.add(winLine);

    houseGroup.position.set(-6, -2, 0);
    houseGroup.rotation.y = 0.35;
    scene.add(houseGroup);

    /* ── Ascending growth graph — nodes connected by lines ── */
    var GRAPH_NODES = isMobile ? 8 : 12;
    var graphPoints = [];
    var graphGroup = new THREE.Group();

    // Generate ascending graph points
    for (var g = 0; g < GRAPH_NODES; g++) {
      var gx = -8 + (g / (GRAPH_NODES - 1)) * 22;
      // Ascending trend with some variation
      var baseY = -8 + (g / (GRAPH_NODES - 1)) * 16;
      var gy = baseY + (Math.random() - 0.3) * 2;
      var gz = (Math.random() - 0.5) * 4;
      graphPoints.push({ x: gx, y: gy, z: gz, baseY: baseY, phase: Math.random() * Math.PI * 2 });
    }

    // Graph line connecting nodes
    var graphLinePositions = new Float32Array((GRAPH_NODES - 1) * 6);
    for (var g = 0; g < GRAPH_NODES - 1; g++) {
      var p1 = graphPoints[g], p2 = graphPoints[g + 1];
      graphLinePositions[g * 6]     = p1.x;
      graphLinePositions[g * 6 + 1] = p1.y;
      graphLinePositions[g * 6 + 2] = p1.z;
      graphLinePositions[g * 6 + 3] = p2.x;
      graphLinePositions[g * 6 + 4] = p2.y;
      graphLinePositions[g * 6 + 5] = p2.z;
    }
    var graphLineGeo = new THREE.BufferGeometry();
    graphLineGeo.setAttribute('position', new THREE.BufferAttribute(graphLinePositions, 3));
    var graphLineMat = new THREE.LineBasicMaterial({
      color: 0xc8222a, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    var graphLine = new THREE.LineSegments(graphLineGeo, graphLineMat);
    graphGroup.add(graphLine);

    // Glowing node points at each graph vertex
    var nodePositions = new Float32Array(GRAPH_NODES * 3);
    var nodeSizes = new Float32Array(GRAPH_NODES);
    for (var g = 0; g < GRAPH_NODES; g++) {
      nodePositions[g * 3]     = graphPoints[g].x;
      nodePositions[g * 3 + 1] = graphPoints[g].y;
      nodePositions[g * 3 + 2] = graphPoints[g].z;
      nodeSizes[g] = 2.5 + Math.random() * 2.0;
    }
    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSizes, 1));
    var nodeShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xc8222a) },
        uGlobalOpacity: { value: 1.0 }
      },
      vertexShader: [
        'attribute float aSize;',
        'void main() {',
        '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = aSize * (200.0 / -mvPos.z);',
        '  gl_Position = projectionMatrix * mvPos;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uGlobalOpacity;',
        'void main() {',
        '  float d = length(gl_PointCoord - vec2(0.5));',
        '  if (d > 0.5) discard;',
        '  float alpha = smoothstep(0.5, 0.1, d) * uGlobalOpacity;',
        '  gl_FragColor = vec4(uColor, alpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var nodePoints = new THREE.Points(nodeGeo, nodeShaderMat);
    graphGroup.add(nodePoints);

    graphGroup.position.set(2, 0, 0);
    scene.add(graphGroup);

    /* ── Upward-drifting value particles ── */
    var PARTICLE_COUNT = isMobile ? 80 : 150;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var velocities = [];
    var opacities = new Float32Array(PARTICLE_COUNT);
    var sizes = new Float32Array(PARTICLE_COUNT);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: 0.012 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2
      });

      opacities[i] = 0.2 + Math.random() * 0.6;
      sizes[i] = 1.0 + Math.random() * 2.0;
    }

    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

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
    var LINE_THRESHOLD = 5.5;
    var MAX_LINES = isMobile ? 35 : 70;
    var linePositions = new Float32Array(MAX_LINES * 6);
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    var lineMat = new THREE.LineBasicMaterial({
      color: 0xc9a96e,
      transparent: true,
      opacity: 0.1,
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
      baseAngle += 0.0015;

      var spread = scrollSpread.value;

      /* ── Animate house: gentle float + rotate ── */
      houseGroup.rotation.y = 0.35 + Math.sin(time * 0.3) * 0.08;
      houseGroup.position.y = -2 + Math.sin(time * 0.5) * 0.4;
      // On scroll, house drifts left and fades slightly
      houseGroup.position.x = -6 - spread * 4;
      bodyLine.material.opacity = 0.55 * (1 - spread * 0.5);
      roofLine.material.opacity = 0.55 * (1 - spread * 0.5);
      doorLine.material.opacity = 0.4 * (1 - spread * 0.5);
      winLine.material.opacity = 0.35 * (1 - spread * 0.5);

      /* ── Animate graph nodes — gentle wave ── */
      var graphNodeArr = nodeGeo.attributes.position.array;
      var graphLineArr = graphLineGeo.attributes.position.array;
      for (var g = 0; g < GRAPH_NODES; g++) {
        var gp = graphPoints[g];
        var waveY = Math.sin(time * 0.8 + gp.phase) * 0.3;
        var waveZ = Math.cos(time * 0.6 + gp.phase) * 0.2;
        graphNodeArr[g * 3 + 1] = gp.y + waveY;
        graphNodeArr[g * 3 + 2] = gp.z + waveZ;

        // Update connecting lines
        if (g < GRAPH_NODES - 1) {
          graphLineArr[g * 6 + 1] = gp.y + waveY;
          graphLineArr[g * 6 + 2] = gp.z + waveZ;
          var gpNext = graphPoints[g + 1];
          var waveYNext = Math.sin(time * 0.8 + gpNext.phase) * 0.3;
          var waveZNext = Math.cos(time * 0.6 + gpNext.phase) * 0.2;
          graphLineArr[g * 6 + 4] = gpNext.y + waveYNext;
          graphLineArr[g * 6 + 5] = gpNext.z + waveZNext;
        }
      }
      nodeGeo.attributes.position.needsUpdate = true;
      graphLineGeo.attributes.position.needsUpdate = true;

      // On scroll, graph rises and spreads
      graphGroup.position.y = spread * 3;
      graphLineMat.opacity = 0.4 + spread * 0.3;

      /* ── Animate value particles ── */
      var posArr = particleGeo.attributes.position.array;
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        var idx = i * 3;
        var vel = velocities[i];

        var waveX = Math.sin(time * 0.4 + vel.phase) * 0.02;
        var speedMult = 1.0 + spread * 2.5;

        posArr[idx]     += (vel.x + waveX) * speedMult;
        posArr[idx + 1] += vel.y * speedMult;
        posArr[idx + 2] += vel.z * speedMult;

        // Spread outward on scroll
        posArr[idx]     += (posArr[idx] > 0 ? 1 : -1) * spread * 0.015;
        posArr[idx + 2] += (posArr[idx + 2] > 0 ? 1 : -1) * spread * 0.008;

        // Wrap particles
        if (posArr[idx + 1] > 25) {
          posArr[idx + 1] = -25;
          posArr[idx] = (Math.random() - 0.5) * 35;
          posArr[idx + 2] = (Math.random() - 0.5) * 18;
        }
        if (posArr[idx] > 22) posArr[idx] = -22;
        if (posArr[idx] < -22) posArr[idx] = 22;
        if (posArr[idx + 2] > 14) posArr[idx + 2] = -14;
        if (posArr[idx + 2] < -14) posArr[idx + 2] = 14;
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
      camera.position.x = Math.sin(baseAngle + mouseX * 0.12) * 4;
      camera.position.y = 2 + mouseY * 1.5;
      camera.position.z = 40 + Math.cos(baseAngle) * 2;
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
     PROCESS SECTION — Simple Animated Steps
     GSAP stagger fade-up, no scroll lock, no Three.js
     ═══════════════════════════════════════════════ */
  function initProcess() {
    var section = document.getElementById('sv-process');
    if (!section) return;
    var steps   = Array.prototype.slice.call(section.querySelectorAll('.sv-process-step'));
    var dots    = Array.prototype.slice.call(section.querySelectorAll('.sv-process-bar-dot'));
    var barFill = section.querySelector('.sv-process-bar-fill');
    if (!steps.length) return;
    var total = steps.length;
    var current = -1;

    /* Background: particle field morphs per step */
    var PDOTS = 44;
    var pCanvas = document.createElement('canvas');
    pCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    section.insertBefore(pCanvas, section.firstChild);
    var pw = section.clientWidth  || window.innerWidth;
    var ph = section.clientHeight || window.innerHeight;
    var pScene    = new THREE.Scene();
    var pCam      = new THREE.OrthographicCamera(-pw/2, pw/2, ph/2, -ph/2, -1, 1);
    var pRenderer = new THREE.WebGLRenderer({ canvas: pCanvas, antialias: false, alpha: true });
    pRenderer.setSize(pw, ph);
    pRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    pRenderer.setClearColor(0x000000, 0);

    function genConfig(si) {
      var cfg = new Float32Array(PDOTS * 2);
      var cols, rows, maxRow, a, r;
      for (var i = 0; i < PDOTS; i++) {
        var x = 0, y = 0;
        switch (si % 5) {
          case 0:
            x = Math.sin(i * 2.3999) * 0.48 * pw * 0.42;
            y = Math.cos(i * 1.6180) * 0.48 * ph * 0.32; break;
          case 1:
            cols = 8; rows = Math.ceil(PDOTS / cols);
            x = ((i % cols) / (cols - 1) - 0.5) * pw * 0.58;
            y = (Math.floor(i / cols) / (rows - 1) - 0.5) * ph * 0.38; break;
          case 2:
            a = (i / PDOTS) * Math.PI * 2;
            r = Math.min(pw, ph) * 0.25;
            x = Math.cos(a) * r; y = Math.sin(a) * r; break;
          case 3:
            cols = 5; maxRow = Math.floor(PDOTS / cols);
            x = ((i % cols) / (cols - 1) - 0.5) * pw * 0.48;
            y = (Math.floor(i / cols) / (maxRow - 1) - 0.5) * ph * 0.38; break;
          case 4:
            a = (i / PDOTS) * Math.PI * 2;
            r = Math.min(pw, ph) * (0.07 + 0.22 * ((i % 3) / 2));
            x = Math.cos(a) * r; y = Math.sin(a) * r; break;
        }
        cfg[i * 2] = x; cfg[i * 2 + 1] = y;
      }
      return cfg;
    }

    var configs = [];
    for (var si = 0; si < total; si++) configs.push(genConfig(si));
    var pCurr = new Float32Array(PDOTS * 3);
    var pTgt  = new Float32Array(PDOTS * 2);
    for (var pi = 0; pi < PDOTS; pi++) {
      pCurr[pi*3]   = configs[0][pi*2];
      pCurr[pi*3+1] = configs[0][pi*2+1];
      pTgt[pi*2]    = configs[0][pi*2];
      pTgt[pi*2+1]  = configs[0][pi*2+1];
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pCurr, 3));
    var pMat = new THREE.PointsMaterial({ color: 0xf0ede8, size: 3, transparent: true, opacity: 0.14, sizeAttenuation: false });
    pScene.add(new THREE.Points(pGeo, pMat));
    var MAX_LINES = 50;
    var pLineBuf = new Float32Array(MAX_LINES * 6);
    var pLineGeo = new THREE.BufferGeometry();
    pLineGeo.setAttribute('position', new THREE.BufferAttribute(pLineBuf, 3));
    pScene.add(new THREE.LineSegments(pLineGeo, new THREE.LineBasicMaterial({ color: 0xf0ede8, transparent: true, opacity: 0.045 })));

    function updateBg(idx) {
      var cfg = configs[idx] || configs[0];
      for (var pi = 0; pi < PDOTS; pi++) {
        pTgt[pi*2]   = cfg[pi*2];
        pTgt[pi*2+1] = cfg[pi*2+1];
      }
    }
    var pTime = 0;
    (function animBg() {
      requestAnimationFrame(animBg);
      pTime += 0.008;
      var pos = pGeo.attributes.position.array;
      for (var pi = 0; pi < PDOTS; pi++) {
        var tx = pTgt[pi*2]   + Math.sin(pTime + pi * 0.71) * 3.5;
        var ty = pTgt[pi*2+1] + Math.cos(pTime * 0.9 + pi * 0.53) * 2.5;
        pos[pi*3]   += (tx - pos[pi*3])   * 0.04;
        pos[pi*3+1] += (ty - pos[pi*3+1]) * 0.04;
      }
      pGeo.attributes.position.needsUpdate = true;
      var li = 0, THRESH = 85;
      for (var a = 0; a < PDOTS && li < MAX_LINES; a++) {
        for (var b = a + 1; b < PDOTS && li < MAX_LINES; b++) {
          var dx = pos[a*3] - pos[b*3], dy = pos[a*3+1] - pos[b*3+1];
          if (dx*dx + dy*dy < THRESH*THRESH) {
            var o = li * 6;
            pLineBuf[o]=pos[a*3]; pLineBuf[o+1]=pos[a*3+1]; pLineBuf[o+2]=0;
            pLineBuf[o+3]=pos[b*3]; pLineBuf[o+4]=pos[b*3+1]; pLineBuf[o+5]=0;
            li++;
          }
        }
      }
      for (var z = li*6; z < MAX_LINES*6; z++) pLineBuf[z] = 0;
      pLineGeo.attributes.position.needsUpdate = true;
      pLineGeo.setDrawRange(0, li * 2);
      pRenderer.render(pScene, pCam);
    })();
    window.addEventListener('resize', function() {
      var nw = section.clientWidth, nh = section.clientHeight;
      pCam.left=-nw/2; pCam.right=nw/2; pCam.top=nh/2; pCam.bottom=-nh/2;
      pCam.updateProjectionMatrix();
      pRenderer.setSize(nw, nh);
    });

    function setStep(idx) {
      if (idx === current) return;
      current = idx;
      steps.forEach(function(s, i) { s.classList.toggle('is-active', i === idx); });
      dots.forEach(function(d, i) { d.classList.toggle('is-active', i <= idx); });
      if (barFill) {
        gsap.to(barFill, { scaleX: total > 1 ? idx / (total - 1) : 1, duration: 0.5, ease: 'power2.out', overwrite: true });
      }
      updateBg(idx);
    }
    setStep(0);
    ScrollTrigger.create({
      trigger: section, start: 'top top',
      end: '+=' + (window.innerHeight * (total + 0.5)),
      pin: true, pinSpacing: true, scrub: 0.8,
      onUpdate: function(self) {
        setStep(Math.min(total - 1, Math.floor(self.progress * total)));
      }
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
    initProcess();
    initScrollAnimations();
  });

})();
