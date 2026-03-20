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

    /* ── Three.js: Construction Draw Flow Network ──
       A central "loan" hub with lines radiating to 5 milestone nodes
       (Pre-Qual → Scoping → Approval → Draws → Completion).
       Particles travel along each line; nodes pulse gold when "funded".
       Represents the staged construction financing draw process. */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(0, 0, 36);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    /* ── Node positions: hub at centre-left, milestones spread to the right ── */
    var HUB = new THREE.Vector3(isMobile ? -4 : -9, 0, 0);
    var MILESTONE_LABELS = ['Pre-Qual', 'Scoping', 'Approval', 'Draws', 'Completion'];
    var milestoneCount = MILESTONE_LABELS.length;
    // Fan milestones in a vertical arc on the right side
    var fanSpread = isMobile ? 1.4 : 1.6; // vertical spread multiplier
    var milestones = MILESTONE_LABELS.map(function(_, mi) {
      var t = (mi / (milestoneCount - 1)) - 0.5; // -0.5 … +0.5
      return new THREE.Vector3(
        isMobile ? 6 : 12,
        t * (isMobile ? 10 : 14) * fanSpread,
        0
      );
    });

    /* ── Gold colour ── */
    var GOLD = new THREE.Color(0xc9a96e);
    var CREAM = new THREE.Color(0xf0ede8);

    /* ── Hub node: larger glowing dot ── */
    var hubGeo = new THREE.CircleGeometry(isMobile ? 0.55 : 0.7, 32);
    var hubMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 });
    var hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.position.copy(HUB);
    scene.add(hubMesh);

    // Hub outer ring
    var hubRingGeo = new THREE.RingGeometry(
      isMobile ? 0.9 : 1.1,
      isMobile ? 1.1 : 1.35,
      32
    );
    var hubRingMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    var hubRing = new THREE.Mesh(hubRingGeo, hubRingMat);
    hubRing.position.copy(HUB);
    scene.add(hubRing);

    /* ── Milestone nodes + connection lines ── */
    var nodeMeshes = [];
    var nodeRings = [];
    var nodeBaseOpacity = 0.22;
    var lineSegments = []; // { geo, mat } per milestone

    milestones.forEach(function(mPos, mi) {
      // Small node dot
      var nGeo = new THREE.CircleGeometry(isMobile ? 0.28 : 0.36, 24);
      var nMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: nodeBaseOpacity });
      var nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.copy(mPos);
      scene.add(nMesh);
      nodeMeshes.push(nMesh);

      // Node outer ring
      var nrGeo = new THREE.RingGeometry(
        isMobile ? 0.44 : 0.56,
        isMobile ? 0.56 : 0.72,
        24
      );
      var nrMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
      var nrMesh = new THREE.Mesh(nrGeo, nrMat);
      nrMesh.position.copy(mPos);
      scene.add(nrMesh);
      nodeRings.push(nrMesh);

      // Connection line hub → milestone
      var lGeo = new THREE.BufferGeometry().setFromPoints([HUB, mPos]);
      var lMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.08 });
      var lLine = new THREE.Line(lGeo, lMat);
      scene.add(lLine);
      lineSegments.push({ line: lLine, mat: lMat });
    });

    /* ── Flowing particles along each line ── */
    var FLOW_PER_LINE = isMobile ? 3 : 5;
    var flowParticles = []; // per milestone: array of { t, speed, mesh }

    milestones.forEach(function(mPos, mi) {
      var group = [];
      for (var fi = 0; fi < FLOW_PER_LINE; fi++) {
        var fGeo = new THREE.CircleGeometry(isMobile ? 0.1 : 0.13, 8);
        var fMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
        var fMesh = new THREE.Mesh(fGeo, fMat);
        scene.add(fMesh);
        group.push({
          t: fi / FLOW_PER_LINE, // stagger start positions
          speed: 0.003 + Math.random() * 0.002,
          mesh: fMesh,
          mat: fMat
        });
      }
      flowParticles.push(group);
    });

    /* ── Cycling state: which milestone is currently "active" (being funded) ── */
    var CYCLE_DURATION = 1.8; // seconds per milestone
    var time = 0;
    var activeIdx = 0;
    var cycleT = 0; // 0…1 within current milestone

    /* ── Mouse parallax ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      time += 0.016;

      // Advance cycle
      cycleT += 0.016 / CYCLE_DURATION;
      if (cycleT >= 1) {
        cycleT = 0;
        activeIdx = (activeIdx + 1) % milestoneCount;
      }

      // Hub pulse
      var hubPulse = 0.85 + Math.sin(time * 2.2) * 0.15;
      hubMat.opacity = 0.75 + hubPulse * 0.2;
      hubRingMat.opacity = 0.12 + hubPulse * 0.10;

      // Milestone node brightness
      nodeMeshes.forEach(function(mesh, mi) {
        var mat = mesh.material;
        var ringMat = nodeRings[mi].material;
        var lineMat = lineSegments[mi].mat;
        if (mi === activeIdx) {
          // Bright pulse as it receives funds
          var glow = 0.5 + cycleT * 0.5;
          mat.opacity = nodeBaseOpacity + glow * 0.7;
          ringMat.opacity = glow * 0.3;
          lineMat.opacity = 0.08 + glow * 0.22;
        } else if (mi < activeIdx) {
          // Already funded — stay slightly brighter
          mat.opacity = 0.45;
          ringMat.opacity = 0.12;
          lineMat.opacity = 0.18;
        } else {
          // Not yet — dim
          mat.opacity = nodeBaseOpacity;
          ringMat.opacity = 0.05;
          lineMat.opacity = 0.06;
        }
      });

      // Flow particles
      flowParticles.forEach(function(group, mi) {
        var mPos = milestones[mi];
        var isActive = mi === activeIdx;
        group.forEach(function(fp) {
          fp.t += fp.speed;
          if (fp.t >= 1) fp.t -= 1;

          // Lerp along hub → milestone
          var px = HUB.x + (mPos.x - HUB.x) * fp.t;
          var py = HUB.y + (mPos.y - HUB.y) * fp.t;
          fp.mesh.position.set(px, py, 0.1);

          // Only visible on active or recently-active lines
          var vis = isActive ? 1 : (mi < activeIdx ? 0.4 : 0);
          // Fade near ends
          var edgeFade = Math.sin(fp.t * Math.PI);
          fp.mat.opacity = vis * edgeFade * 0.7;
        });
      });

      // Subtle camera drift with mouse
      camera.position.x = mouseX * 1.5;
      camera.position.y = -mouseY * 1.0;
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
    var pRenderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', canvas: pCanvas, antialias: false, alpha: true });
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
