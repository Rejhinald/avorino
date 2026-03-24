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
     HERO — Three.js Wireframe House Build
     Scroll-pinned: blueprint → foundation → walls → roof → solid
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

    /* ═══ Three.js Scene ═══ */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(18, 12, 24); camera.lookAt(0, 3, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var pl1 = new THREE.PointLight(0xc9a96e, 0.8, 80);
    pl1.position.set(18, 22, 22); scene.add(pl1);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var solidColor = 0xf0ede8;

    var gridMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var foundMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var wallMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var roofMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var accentMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var solidWallMat = new THREE.MeshStandardMaterial({ color: solidColor, transparent: true, opacity: 0, side: THREE.DoubleSide, roughness: 0.85 });
    var solidRoofMat = new THREE.MeshStandardMaterial({ color: wireColor, transparent: true, opacity: 0, side: THREE.DoubleSide, roughness: 0.7 });

    /* ── House dimensions ── */
    var hW = 6;   /* half-width (x) */
    var hD = 4;   /* half-depth (z) */
    var wH = 3.5; /* wall height */
    var rH = 5.5; /* roof peak height */
    var roofOverhang = 0.6;

    /* ── Blueprint Grid ── */
    var gridGroup = new THREE.Group();
    for (var gi = 0; gi <= 10; gi++) {
      var t = (gi / 10) * 16 - 8;
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-8, 0, t), new THREE.Vector3(8, 0, t)]), gridMat.clone()));
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(t, 0, -8), new THREE.Vector3(t, 0, 8)]), gridMat.clone()));
    }
    scene.add(gridGroup);

    /* ── Foundation ── */
    var foundGroup = new THREE.Group();
    var fPts = [
      new THREE.Vector3(-hW, 0, -hD), new THREE.Vector3(hW, 0, -hD),
      new THREE.Vector3(hW, 0, hD), new THREE.Vector3(-hW, 0, hD),
      new THREE.Vector3(-hW, 0, -hD)
    ];
    foundGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(fPts), foundMat));
    /* interior walls */
    foundGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -hD), new THREE.Vector3(0, 0, hD)]), foundMat));
    foundGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-hW, 0, 0), new THREE.Vector3(0, 0, 0)]), foundMat));
    scene.add(foundGroup);

    /* ── Walls (simple rectangle) ── */
    var wallsGroup = new THREE.Group();
    var corners = [[-hW, -hD], [hW, -hD], [hW, hD], [-hW, hD]];
    /* vertical edges */
    corners.forEach(function(c) {
      wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c[0], 0, c[1]), new THREE.Vector3(c[0], wH, c[1])
      ]), wallMat));
    });
    /* top edges */
    for (var wj = 0; wj < 4; wj++) {
      var c1 = corners[wj], c2 = corners[(wj + 1) % 4];
      wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(c1[0], wH, c1[1]), new THREE.Vector3(c2[0], wH, c2[1])
      ]), wallMat));
    }
    /* interior wall verticals */
    wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -hD), new THREE.Vector3(0, wH, -hD)]), wallMat));
    wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, hD), new THREE.Vector3(0, wH, hD)]), wallMat));
    wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, wH, -hD), new THREE.Vector3(0, wH, hD)]), wallMat));

    /* Windows (front wall z = -hD) */
    var winY1 = 1.2, winY2 = 2.8, winOff = 0.05;
    var winDefs = [
      /* left window */ [[-5, winY1], [-3.5, winY1], [-3.5, winY2], [-5, winY2], [-5, winY1]],
      /* right window 1 */ [[1.5, winY1], [3, winY1], [3, winY2], [1.5, winY2], [1.5, winY1]],
      /* right window 2 */ [[3.5, winY1], [5, winY1], [5, winY2], [3.5, winY2], [3.5, winY1]],
    ];
    winDefs.forEach(function(pts) {
      wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(function(p) {
        return new THREE.Vector3(p[0], p[1], -hD - winOff);
      })), accentMat));
    });
    /* side window (right wall x = hW) */
    wallsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(hW + winOff, winY1, -1.5), new THREE.Vector3(hW + winOff, winY1, 1.5),
      new THREE.Vector3(hW + winOff, winY2, 1.5), new THREE.Vector3(hW + winOff, winY2, -1.5),
      new THREE.Vector3(hW + winOff, winY1, -1.5)
    ]), accentMat));
    scene.add(wallsGroup);

    /* ── Roof (gable along x-axis, ridge runs left-right) ── */
    var roofGroup = new THREE.Group();
    var rOH = roofOverhang;
    /* ridge */
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW - rOH, rH, 0), new THREE.Vector3(hW + rOH, rH, 0)
    ]), roofMat));
    /* eaves */
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW - rOH, wH, -hD - rOH), new THREE.Vector3(hW + rOH, wH, -hD - rOH)
    ]), roofMat));
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW - rOH, wH, hD + rOH), new THREE.Vector3(hW + rOH, wH, hD + rOH)
    ]), roofMat));
    /* slopes - front */
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW - rOH, wH, -hD - rOH), new THREE.Vector3(-hW - rOH, rH, 0)
    ]), roofMat));
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(hW + rOH, wH, -hD - rOH), new THREE.Vector3(hW + rOH, rH, 0)
    ]), roofMat));
    /* slopes - back */
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW - rOH, wH, hD + rOH), new THREE.Vector3(-hW - rOH, rH, 0)
    ]), roofMat));
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(hW + rOH, wH, hD + rOH), new THREE.Vector3(hW + rOH, rH, 0)
    ]), roofMat));
    /* gable triangles (left + right ends) */
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-hW - rOH, wH, -hD - rOH), new THREE.Vector3(-hW - rOH, rH, 0),
      new THREE.Vector3(-hW - rOH, wH, hD + rOH)
    ]), roofMat));
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(hW + rOH, wH, -hD - rOH), new THREE.Vector3(hW + rOH, rH, 0),
      new THREE.Vector3(hW + rOH, wH, hD + rOH)
    ]), roofMat));
    /* mid rafters */
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, wH, -hD - rOH), new THREE.Vector3(0, rH, 0)
    ]), roofMat));
    roofGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, wH, hD + rOH), new THREE.Vector3(0, rH, 0)
    ]), roofMat));
    scene.add(roofGroup);

    /* ── Door (arch accent) ── */
    var doorPts = [
      new THREE.Vector3(-1.2, 0, -hD - 0.01), new THREE.Vector3(-1.2, 2.6, -hD - 0.01),
      new THREE.Vector3(-1.0, 2.9, -hD - 0.01), new THREE.Vector3(-0.5, 3.1, -hD - 0.01),
      new THREE.Vector3(0, 2.9, -hD - 0.01), new THREE.Vector3(0.2, 2.6, -hD - 0.01),
      new THREE.Vector3(0.2, 0, -hD - 0.01),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(doorPts), accentMat));

    /* ── Solid fill ── */
    var solidGroup = new THREE.Group();
    /* front wall */
    var fwg = new THREE.Mesh(new THREE.PlaneGeometry(hW * 2, wH), solidWallMat);
    fwg.position.set(0, wH / 2, -hD); solidGroup.add(fwg);
    /* back wall */
    var bwg = new THREE.Mesh(new THREE.PlaneGeometry(hW * 2, wH), solidWallMat.clone());
    bwg.position.set(0, wH / 2, hD); solidGroup.add(bwg);
    /* left wall */
    var lwg = new THREE.Mesh(new THREE.PlaneGeometry(hD * 2, wH), solidWallMat.clone());
    lwg.position.set(-hW, wH / 2, 0); lwg.rotation.y = Math.PI / 2; solidGroup.add(lwg);
    /* right wall */
    var rwg = new THREE.Mesh(new THREE.PlaneGeometry(hD * 2, wH), solidWallMat.clone());
    rwg.position.set(hW, wH / 2, 0); rwg.rotation.y = Math.PI / 2; solidGroup.add(rwg);

    /* roof slopes (solid triangles) */
    /* front slope */
    var rfsGeo = new THREE.BufferGeometry();
    rfsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -hW - rOH, wH, -hD - rOH,  hW + rOH, wH, -hD - rOH,  -hW - rOH, rH, 0,
      hW + rOH, wH, -hD - rOH,   hW + rOH, rH, 0,           -hW - rOH, rH, 0
    ]), 3));
    rfsGeo.computeVertexNormals();
    solidGroup.add(new THREE.Mesh(rfsGeo, solidRoofMat));
    /* back slope */
    var rbsGeo = new THREE.BufferGeometry();
    rbsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -hW - rOH, wH, hD + rOH,  -hW - rOH, rH, 0,  hW + rOH, wH, hD + rOH,
      hW + rOH, wH, hD + rOH,   -hW - rOH, rH, 0,   hW + rOH, rH, 0
    ]), 3));
    rbsGeo.computeVertexNormals();
    solidGroup.add(new THREE.Mesh(rbsGeo, solidRoofMat.clone()));
    /* left gable triangle */
    var lgGeo = new THREE.BufferGeometry();
    lgGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -hW - rOH, wH, -hD - rOH,  -hW - rOH, rH, 0,  -hW - rOH, wH, hD + rOH
    ]), 3));
    lgGeo.computeVertexNormals();
    solidGroup.add(new THREE.Mesh(lgGeo, solidRoofMat.clone()));
    /* right gable triangle */
    var rgGeo = new THREE.BufferGeometry();
    rgGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      hW + rOH, wH, -hD - rOH,  hW + rOH, wH, hD + rOH,  hW + rOH, rH, 0
    ]), 3));
    rgGeo.computeVertexNormals();
    solidGroup.add(new THREE.Mesh(rgGeo, solidRoofMat.clone()));
    scene.add(solidGroup);

    /* ── Particles ── */
    var particles = [];
    var particlePositions = [];
    var particleCount = isMobile ? 25 : 50;
    for (var p = 0; p < particleCount; p++) {
      var px = (Math.random()-0.5)*16, py = Math.random()*10, pz = (Math.random()-0.5)*16;
      particlePositions.push(px, py, pz);
      particles.push({ x: px, y: py, z: pz, speed: 0.003+Math.random()*0.008 });
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    var pMat = new THREE.PointsMaterial({ color: wireColor, size: 0.08, transparent: true, opacity: 0, sizeAttenuation: true });
    var pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    /* ── Initial entrance ── */
    gsap.to({ v:0 }, { v:1, duration:1.5, delay:0.3, ease:'power2.out',
      onUpdate:function(){ gridGroup.children.forEach(function(l){l.material.opacity=this.targets()[0].v*0.06}.bind(this)) }
    });
    gsap.to({ v:0 }, { v:1, duration:1.8, delay:0.6, ease:'power2.out',
      onUpdate:function(){ foundGroup.children.forEach(function(l){l.material.opacity=this.targets()[0].v*0.35}.bind(this)) }
    });
    gsap.to(pMat, { opacity: 0.3, duration: 1, delay: 1.5, ease: 'power2.out' });

    /* ═══ SCROLL-DRIVEN BUILD ═══ */
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=' + (window.innerHeight * 0.8),
      pin: true, pinSpacing: true, scrub: 1,
      onUpdate: function(self) {
        var p = self.progress;
        var wallP = Math.min(1, p / 0.35);
        wallMat.opacity = wallP * 0.4;
        var roofP = Math.max(0, Math.min(1, (p - 0.25) / 0.3));
        roofMat.opacity = roofP * 0.35;
        accentMat.opacity = roofP * 0.5;
        var solidP = Math.max(0, Math.min(1, (p - 0.5) / 0.3));
        solidGroup.children.forEach(function(m){ if (m.material) m.material.opacity = solidP * 0.25; });
        if (p > 0.5) { var wireF = 1 - solidP * 0.5; wallMat.opacity = 0.4 * wireF; }
        var gridF = p > 0.6 ? Math.max(0, 1 - (p - 0.6) / 0.3) : 1;
        gridGroup.children.forEach(function(l){ l.material.opacity = 0.06 * gridF; });
        camera.userData.scrollRadius = 18 + p * 8;
        camera.userData.scrollHeight = 12 + p * 6;
      }
    });

    /* ── Mouse + render ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var baseAngle = 0;
    camera.userData.scrollRadius = 18;
    camera.userData.scrollHeight = 12;

    function animate() {
      requestAnimationFrame(animate);
      baseAngle += 0.0015;
      var orbitR = camera.userData.scrollRadius || 18;
      var camH = camera.userData.scrollHeight || 12;
      camera.position.set(Math.cos(baseAngle + mouseX*0.3)*orbitR, camH + mouseY*1.5, Math.sin(baseAngle + mouseX*0.3)*orbitR);
      camera.lookAt(0, 2.5, 0);
      var positions = pSystem.geometry.attributes.position.array;
      for (var k = 0; k < particles.length; k++) {
        particles[k].y += particles[k].speed;
        if (particles[k].y > 10) { particles[k].y = 0; particles[k].x = (Math.random()-0.5)*16; particles[k].z = (Math.random()-0.5)*16; }
        positions[k*3] = particles[k].x; positions[k*3+1] = particles[k].y; positions[k*3+2] = particles[k].z;
      }
      pSystem.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      var nw = canvasWrap.clientWidth, nh = canvasWrap.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
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

    procRenderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', canvas: canvas, antialias: true, alpha: false });
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

  /* ── Custom Home: Realistic Architecture (ADU Visualizer style) ── */
  var WT = 0.5;  // wall thickness (6 inches at scale)
  var WH = 9;    // wall height (9 feet)
  var MW = 18;   // main block width (x)
  var MD = 12;   // main block depth (z)
  var WW = 10;   // wing width
  var WD = 8;    // wing depth

  var mat = function(color, rough, metal) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metal || 0 });
  };
  var box = function(w, h, d, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };

  // ── Shared: Build a wall with rectangular openings cut out ──
  // wall along X-axis at given z, from x0 to x1, height WH, thickness WT
  // openings: [{ x, y, w, h }] — center x, bottom y, width, height
  function buildWallSegments(g, x0, x1, z, openings, wallMat, axis) {
    axis = axis || 'z'; // 'z' = wall runs along x at fixed z; 'x' = wall runs along z at fixed x
    var totalLen = x1 - x0;

    if (!openings || openings.length === 0) {
      // Solid wall, no openings
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

    // Sort openings by position
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
          seg = box(segW, WH, WT, wallMat);
          seg.position.set(cursor + segW / 2, WH / 2, z);
        } else {
          seg = box(WT, WH, segW, wallMat);
          seg.position.set(z, WH / 2, cursor + segW / 2);
        }
        g.add(seg);
      }

      // Wall above opening
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

      // Wall below opening (for windows with sill)
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

    // Wall segment after last opening
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

  // Blueprint grid
  function buildProcGrid() {
    var g = new THREE.Group();
    var gridMat = new THREE.LineBasicMaterial({ color: 0x3377BB, transparent: true, opacity: 0.12 });
    for (var i = -10; i <= 10; i++) {
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2, 0.01, -16), new THREE.Vector3(i * 2, 0.01, 16)
      ]), gridMat.clone()));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0.01, i * 2), new THREE.Vector3(20, 0.01, i * 2)
      ]), gridMat.clone()));
    }
    // Lot boundary
    var lotMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.35 });
    var lotPts = [
      new THREE.Vector3(-14, 0.02, -10), new THREE.Vector3(14, 0.02, -10),
      new THREE.Vector3(14, 0.02, 14), new THREE.Vector3(-14, 0.02, 14),
      new THREE.Vector3(-14, 0.02, -10)
    ];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lotPts), lotMat));
    return g;
  }

  // Foundation
  function buildProcFoundation() {
    var g = new THREE.Group();
    var slabMat = mat(0xC8C0B8, 0.95);
    var footingMat = mat(0xB0A898, 0.92);
    // Main slab
    var mainSlab = box(MW, 0.4, MD, slabMat);
    mainSlab.position.set(0, -0.2, 0);
    g.add(mainSlab);
    // Wing slab
    var wingSlab = box(WW, 0.4, WD, slabMat);
    wingSlab.position.set(-(MW - WW) / 2, -0.2, MD / 2 + WD / 2);
    g.add(wingSlab);
    // Footings (perimeter)
    var fh = 0.6;
    var fw = 0.8;
    // Main block footings
    g.add(box(MW + 0.4, fh, fw, footingMat).position.set(0, -fh / 2, -MD / 2) && g.children[g.children.length - 1]);
    var bf = box(MW + 0.4, fh, fw, footingMat); bf.position.set(0, -fh / 2, MD / 2); g.add(bf);
    var lf = box(fw, fh, MD, footingMat); lf.position.set(-MW / 2, -fh / 2, 0); g.add(lf);
    var rf = box(fw, fh, MD, footingMat); rf.position.set(MW / 2, -fh / 2, 0); g.add(rf);
    // Floor finish
    var floorMat = mat(0xDED5C4, 0.75);
    var floor = box(MW - WT * 2, 0.05, MD - WT * 2, floorMat);
    floor.position.set(0, 0.01, 0);
    g.add(floor);
    var wingFloor = box(WW - WT * 2, 0.05, WD - WT * 2, floorMat);
    wingFloor.position.set(-(MW - WW) / 2, 0.01, MD / 2 + WD / 2);
    g.add(wingFloor);
    return g;
  }

  // Walls with proper openings (ADU Visualizer architecture)
  function buildProcWalls() {
    var g = new THREE.Group();
    var extMat = mat(0xF5F5F5, 0.9);
    extMat.transparent = true; extMat.opacity = 1; extMat.side = THREE.DoubleSide;
    var intMat = mat(0xFAFAFA, 0.92);
    intMat.transparent = true; intMat.opacity = 1; intMat.side = THREE.DoubleSide;
    var mX0 = -MW / 2, mX1 = MW / 2;
    var mZ0 = -MD / 2, mZ1 = MD / 2;

    // ── Front wall (south, z = mZ0) — 3 windows + 1 door ──
    buildWallSegments(g, mX0, mX1, mZ0, [
      { x: -6, y: 3, w: 2.5, h: 4 },    // left window
      { x: -1.5, y: 0, w: 3, h: 6.67 },  // front door (3ft wide, 6'8" tall)
      { x: 3, y: 3, w: 2.5, h: 4 },      // right window 1
      { x: 7, y: 3, w: 2.5, h: 4 },      // right window 2
    ], extMat, 'z');

    // ── Back wall (north, z = mZ1) — REMOVED for cutaway view (faces camera) ──

    // ── Left wall (west, x = mX0) ──
    buildWallSegments(g, mZ0, mZ1, mX0, [
      { x: -2, y: 3, w: 2.5, h: 4 },
      { x: 3, y: 3, w: 2.5, h: 4 },
    ], extMat, 'x');

    // ── Right wall (east, x = mX1) ──
    buildWallSegments(g, mZ0, mZ1, mX1, [
      { x: -2, y: 3, w: 3, h: 4 },
      { x: 3, y: 3, w: 2.5, h: 4 },
    ], extMat, 'x');

    // Corner posts (main block)
    addCornerPost(g, mX0, mZ0, extMat);
    addCornerPost(g, mX1, mZ0, extMat);
    addCornerPost(g, mX0, mZ1, extMat);
    addCornerPost(g, mX1, mZ1, extMat);

    // ── Wing walls ──
    var wX0 = -MW / 2;
    var wX1 = wX0 + WW;
    var wZ0 = mZ1;
    var wZ1 = mZ1 + WD;

    // Wing back wall
    buildWallSegments(g, wX0, wX1, wZ1, [
      { x: wX0 + WW / 2, y: 3, w: 3, h: 4 },
    ], extMat, 'z');
    // Wing left wall
    buildWallSegments(g, wZ0, wZ1, wX0, [
      { x: wZ0 + WD / 2, y: 3, w: 2.5, h: 4 },
    ], extMat, 'x');
    // Wing right wall (shared at wX1)
    buildWallSegments(g, wZ0, wZ1, wX1, [
      { x: wZ0 + WD / 2, y: 3, w: 2.5, h: 4 },
    ], extMat, 'x');
    // Wing corners
    addCornerPost(g, wX0, wZ1, extMat);
    addCornerPost(g, wX1, wZ1, extMat);

    // ── Interior walls (with door openings) ──
    // Bathroom front wall (runs along x at z=2, from x=-2 to right exterior wall)
    buildWallSegments(g, -2, mX1, 2, [
      { x: 2, y: 0, w: 2.5, h: 6.67 },  // doorway into bathroom
    ], intMat, 'z');
    // Bathroom left wall (runs along z at x=-2, from z=2 to back wall)
    buildWallSegments(g, 2, mZ1, -2, [], intMat, 'x');

    return g;
  }

  // Roof
  function buildProcRoof() {
    var g = new THREE.Group();
    var roofMat = mat(0x4A3C30, 0.75);
    var roofMatCutaway = new THREE.MeshStandardMaterial({
      color: 0x4A3C30, roughness: 0.75, transparent: true, opacity: 0.2, side: THREE.DoubleSide
    });
    var PEAK = WH + 3;
    var OVH = 1.0; // overhang
    var mX0 = -MW / 2, mX1 = MW / 2;
    var mZ0 = -MD / 2, mZ1 = MD / 2;

    // Main gable roof — ridge runs along Z
    // Front slope (z < 0, away from camera) — solid
    var fSlope = new THREE.BufferGeometry();
    fSlope.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      mX0 - OVH, WH, mZ0 - OVH,  0, PEAK, mZ0 - OVH,  mX0 - OVH, WH, mZ1 + OVH,
      0, PEAK, mZ0 - OVH,  0, PEAK, mZ1 + OVH,  mX0 - OVH, WH, mZ1 + OVH
    ]), 3));
    fSlope.computeVertexNormals();
    var fRoof = new THREE.Mesh(fSlope, roofMat);
    fRoof.castShadow = true; g.add(fRoof);

    // Back slope (z > 0, faces camera) — transparent cutaway
    var bSlope = new THREE.BufferGeometry();
    bSlope.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      mX1 + OVH, WH, mZ0 - OVH,  mX1 + OVH, WH, mZ1 + OVH,  0, PEAK, mZ0 - OVH,
      0, PEAK, mZ0 - OVH,  mX1 + OVH, WH, mZ1 + OVH,  0, PEAK, mZ1 + OVH
    ]), 3));
    bSlope.computeVertexNormals();
    var bRoof = new THREE.Mesh(bSlope, roofMatCutaway);
    bRoof.castShadow = true; g.add(bRoof);

    // Gable end triangles
    var gableFront = new THREE.BufferGeometry();
    gableFront.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      mX0 - OVH, WH, mZ0 - OVH,  mX1 + OVH, WH, mZ0 - OVH,  0, PEAK, mZ0 - OVH
    ]), 3));
    gableFront.computeVertexNormals();
    g.add(new THREE.Mesh(gableFront, roofMat));

    var gableBack = new THREE.BufferGeometry();
    gableBack.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      mX0 - OVH, WH, mZ1 + OVH,  0, PEAK, mZ1 + OVH,  mX1 + OVH, WH, mZ1 + OVH
    ]), 3));
    gableBack.computeVertexNormals();
    g.add(new THREE.Mesh(gableBack, roofMatCutaway));

    // Wing roof (flat lean-to)
    var wX0 = -MW / 2, wX1 = wX0 + WW;
    var wZ1 = MD / 2 + WD;
    var wingRoof = box(WW + OVH * 2, 0.25, WD + OVH * 2, roofMat);
    wingRoof.position.set((wX0 + wX1) / 2, WH + 0.12, MD / 2 + WD / 2);
    wingRoof.rotation.x = -0.06;
    wingRoof.castShadow = true; g.add(wingRoof);

    // Ridge beam
    var ridgeMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.5 });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, PEAK, mZ0 - OVH), new THREE.Vector3(0, PEAK, mZ1 + OVH)
    ]), ridgeMat));

    // Fascia board
    var fasciaMat = mat(0xF5F0E8, 0.7);
    var fasciaF = box(MW + OVH * 2, 0.3, 0.15, fasciaMat);
    fasciaF.position.set(0, WH - 0.15, mZ0 - OVH); g.add(fasciaF);

    return g;
  }

  // Windows, doors, and frames (proper openings with frames + glass)
  function buildProcWindows() {
    var g = new THREE.Group();
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, metalness: 0.1,
      transparent: true, opacity: 0.35, side: THREE.DoubleSide
    });
    var frameMat = mat(0x6B7280, 0.4, 0.2);  // gray metal frame
    var doorFrameMat = mat(0x8B7355, 0.6);    // wood door frame
    var doorPanelMat = mat(0xA68B5B, 0.6);    // wood door panel
    var mZ0 = -MD / 2;

    // ── Window helper: frame + glass + mullion ──
    function addWindow(x, y, z, w, h, rotY) {
      var frameGroup = new THREE.Group();
      // Outer frame
      var fTop = box(w + 0.3, 0.15, 0.15, frameMat);
      fTop.position.set(0, h / 2 + 0.075, 0);
      frameGroup.add(fTop);
      var fBot = box(w + 0.3, 0.15, 0.15, frameMat);
      fBot.position.set(0, -h / 2 - 0.075, 0);
      frameGroup.add(fBot);
      var fL = box(0.15, h + 0.3, 0.15, frameMat);
      fL.position.set(-w / 2 - 0.075, 0, 0);
      frameGroup.add(fL);
      var fR = box(0.15, h + 0.3, 0.15, frameMat);
      fR.position.set(w / 2 + 0.075, 0, 0);
      frameGroup.add(fR);
      // Center mullion
      var mullion = box(0.08, h, 0.08, frameMat);
      frameGroup.add(mullion);
      // Glass pane
      var glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat.clone());
      frameGroup.add(glass);

      frameGroup.position.set(x, y + h / 2, z);
      if (rotY) frameGroup.rotation.y = rotY;
      g.add(frameGroup);
    }

    // ── Door helper: frame + panel ──
    function addDoor(x, y, z, w, h, rotY) {
      var doorGroup = new THREE.Group();
      // Frame
      var fTop = box(w + 0.4, 0.2, WT + 0.1, doorFrameMat);
      fTop.position.set(0, h + 0.1, 0);
      doorGroup.add(fTop);
      var fL = box(0.2, h, WT + 0.1, doorFrameMat);
      fL.position.set(-w / 2 - 0.1, h / 2, 0);
      doorGroup.add(fL);
      var fR = box(0.2, h, WT + 0.1, doorFrameMat);
      fR.position.set(w / 2 + 0.1, h / 2, 0);
      doorGroup.add(fR);
      // Panel
      var panel = box(w - 0.1, h - 0.1, 0.15, doorPanelMat);
      panel.position.set(0, h / 2, 0);
      doorGroup.add(panel);

      doorGroup.position.set(x, y, z);
      if (rotY) doorGroup.rotation.y = rotY;
      g.add(doorGroup);
    }

    // Front windows (south wall)
    addWindow(-6, 3, mZ0 - 0.05, 2.5, 4, 0);
    addWindow(3, 3, mZ0 - 0.05, 2.5, 4, 0);
    addWindow(7, 3, mZ0 - 0.05, 2.5, 4, 0);

    // Front door
    addDoor(-1.5, 0, mZ0, 3, 6.67, 0);

    // Left wall windows (x = -MW/2) — x=wall position, z=position along wall
    addWindow(-MW / 2 - 0.05, 3, -2, 2.5, 4, Math.PI / 2);
    addWindow(-MW / 2 - 0.05, 3, 3, 2.5, 4, Math.PI / 2);

    // Right wall windows (x = MW/2)
    addWindow(MW / 2 + 0.05, 3, -2, 3, 4, Math.PI / 2);
    addWindow(MW / 2 + 0.05, 3, 3, 2.5, 4, Math.PI / 2);

    // Wing windows
    var wZ1 = MD / 2 + WD;
    addWindow(-MW / 2 + WW / 2, 3, wZ1 + 0.05, 3, 4, 0);

    return g;
  }

  // Interior: lights + detailed furniture
  function buildProcInterior() {
    var g = new THREE.Group();
    var lights = [];

    // Ceiling lights
    var lightDefs = [
      { x: -5, z: -3, color: 0xFFD699, intensity: 5 },
      { x: -5, z: 2, color: 0xFFD699, intensity: 4 },
      { x: 3, z: -3, color: 0xFFD699, intensity: 5 },
      { x: 3, z: 2, color: 0xFFF0D0, intensity: 4 },
      { x: 7, z: 0, color: 0xFFF0D0, intensity: 3.5 },
      { x: -MW / 2 + WW / 2, z: MD / 2 + WD / 2, color: 0xFFE4B5, intensity: 4 },
    ];
    lightDefs.forEach(function(def) {
      var light = new THREE.PointLight(def.color, def.intensity, 18, 2);
      light.position.set(def.x, WH - 0.5, def.z);
      g.add(light);
      light.userData._maxIntensity = def.intensity;
      lights.push(light);
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
    var glassMat = mat(0x88AACC, 0.15, 0.1);
    glassMat.transparent = true; glassMat.opacity = 0.25;
    var linenMat = mat(0xE8E0D5, 0.85);
    var pillowMat = mat(0xBEB5A8, 0.82);

    // ═══ LIVING ROOM (left-front) ═══
    // Sectional sofa — base platform
    var sofaBase = box(4.5, 0.35, 2.2, fabricSlate);
    sofaBase.position.set(-5.5, 0.18, -1); g.add(sofaBase);
    // Seat cushions (3 segments)
    for (var sc = 0; sc < 3; sc++) {
      var cushion = box(1.4, 0.25, 1.8, cushionMat);
      cushion.position.set(-7.2 + sc * 1.5, 0.48, -1); g.add(cushion);
    }
    // Back cushions (3 segments)
    for (var bc = 0; bc < 3; bc++) {
      var backC = box(1.4, 0.7, 0.35, fabricDark);
      backC.position.set(-7.2 + bc * 1.5, 0.85, -2.0); g.add(backC);
    }
    // Arm rests
    var armL = box(0.25, 0.55, 2.2, fabricSlate);
    armL.position.set(-7.7, 0.63, -1); g.add(armL);
    var armR = box(0.25, 0.55, 2.2, fabricSlate);
    armR.position.set(-3.3, 0.63, -1); g.add(armR);
    // Throw pillows
    var throwP1 = box(0.6, 0.6, 0.15, pillowMat);
    throwP1.position.set(-7.0, 0.85, -1.6); throwP1.rotation.z = 0.15; g.add(throwP1);
    var throwP2 = box(0.6, 0.6, 0.15, mat(0xc8222a, 0.7));
    throwP2.position.set(-3.8, 0.85, -1.6); throwP2.rotation.z = -0.1; g.add(throwP2);

    // Coffee table — glass top + wood legs
    var ctTop = box(2.2, 0.06, 1, glassMat);
    ctTop.position.set(-5.5, 0.45, 0.5); g.add(ctTop);
    var ctLeg1 = box(0.08, 0.4, 0.08, darkWood); ctLeg1.position.set(-6.5, 0.2, 0.05); g.add(ctLeg1);
    var ctLeg2 = box(0.08, 0.4, 0.08, darkWood); ctLeg2.position.set(-4.5, 0.2, 0.05); g.add(ctLeg2);
    var ctLeg3 = box(0.08, 0.4, 0.08, darkWood); ctLeg3.position.set(-6.5, 0.2, 0.95); g.add(ctLeg3);
    var ctLeg4 = box(0.08, 0.4, 0.08, darkWood); ctLeg4.position.set(-4.5, 0.2, 0.95); g.add(ctLeg4);
    // Shelf underneath
    var ctShelf = box(2.0, 0.04, 0.8, darkWood);
    ctShelf.position.set(-5.5, 0.15, 0.5); g.add(ctShelf);

    // TV unit — console + flat TV (against bathroom wall at z=2, facing sofa)
    var tvConsole = box(3.5, 0.5, 0.45, darkWood);
    tvConsole.position.set(-5.5, 1.5, 1.7); g.add(tvConsole);
    var tvScreen = box(3.2, 1.8, 0.06, blackMat);
    tvScreen.position.set(-5.5, 2.9, 1.5); g.add(tvScreen);
    var tvBezel = box(3.3, 1.9, 0.04, mat(0x222222, 0.4));
    tvBezel.position.set(-5.5, 2.9, 1.52); g.add(tvBezel);
    // TV stand/mount
    var tvStand = box(0.6, 0.04, 0.3, steelMat);
    tvStand.position.set(-5.5, 1.98, 1.65); g.add(tvStand);

    // Area rug
    var rugMat = mat(0x4A3728, 0.9);
    rugMat.transparent = true; rugMat.opacity = 0.6;
    var rug = box(4, 0.02, 3, rugMat);
    rug.position.set(-5.5, 0.01, -0.5); g.add(rug);

    // ═══ KITCHEN (right-front) ═══
    // L-shaped counter along right + back wall
    var counterBack = box(0.7, 0.9, 5, marbleMat);
    counterBack.position.set(8.35, 0.95, -3); g.add(counterBack);
    var counterCab = box(0.65, 0.85, 4.8, mat(0xF0ECE6, 0.6));
    counterCab.position.set(8.35, 0.43, -3); g.add(counterCab);
    // Countertop surface
    var counterTop = box(0.75, 0.05, 5.1, quartzMat);
    counterTop.position.set(8.35, 1.42, -3); g.add(counterTop);

    // Kitchen island — waterfall edge
    var islandBase = box(3.2, 0.85, 1, mat(0xF0ECE6, 0.6));
    islandBase.position.set(4.5, 0.43, -2); g.add(islandBase);
    var islandTop = box(3.5, 0.06, 1.2, quartzMat);
    islandTop.position.set(4.5, 0.88, -2); g.add(islandTop);
    // Waterfall edge
    var waterfall = box(0.06, 0.88, 1.2, quartzMat);
    waterfall.position.set(6.25, 0.44, -2); g.add(waterfall);
    // Bar stools (3)
    for (var bs = 0; bs < 3; bs++) {
      var stoolSeat = box(0.5, 0.06, 0.5, leatherMat);
      stoolSeat.position.set(3.5 + bs * 1.1, 0.7, -3.0); g.add(stoolSeat);
      var stoolLeg = box(0.04, 0.67, 0.04, steelMat);
      stoolLeg.position.set(3.5 + bs * 1.1, 0.34, -3.0); g.add(stoolLeg);
      var stoolFoot = box(0.35, 0.02, 0.35, steelMat);
      stoolFoot.position.set(3.5 + bs * 1.1, 0.01, -3.0); g.add(stoolFoot);
    }

    // Fridge — double-door with handles
    var fridgeBody = box(1.6, 4.2, 1.3, steelMat);
    fridgeBody.position.set(7.6, 2.1, -5.1); g.add(fridgeBody);
    var fridgeDoorL = box(0.78, 2.8, 0.04, mat(0xD0D0D0, 0.2, 0.15));
    fridgeDoorL.position.set(7.2, 2.7, -4.42); g.add(fridgeDoorL);
    var fridgeDoorR = box(0.78, 2.8, 0.04, mat(0xD0D0D0, 0.2, 0.15));
    fridgeDoorR.position.set(8.0, 2.7, -4.42); g.add(fridgeDoorR);
    var fridgeHandleL = box(0.04, 0.8, 0.08, mat(0x888888, 0.3, 0.2));
    fridgeHandleL.position.set(7.55, 2.7, -4.38); g.add(fridgeHandleL);
    var fridgeHandleR = box(0.04, 0.8, 0.08, mat(0x888888, 0.3, 0.2));
    fridgeHandleR.position.set(7.65, 2.7, -4.38); g.add(fridgeHandleR);
    // Freezer drawer
    var freezer = box(1.55, 1.2, 0.04, mat(0xC8C8C8, 0.25, 0.12));
    freezer.position.set(7.6, 0.6, -4.42); g.add(freezer);

    // Range/stove
    var rangeBody = box(1.5, 0.9, 1.0, mat(0x404040, 0.4));
    rangeBody.position.set(8.25, 0.45, 0); g.add(rangeBody);
    var rangeTop = box(1.5, 0.04, 1.0, blackMat);
    rangeTop.position.set(8.25, 0.92, 0); g.add(rangeTop);
    // Burner rings (4)
    for (var bx = 0; bx < 2; bx++) {
      for (var bz = 0; bz < 2; bz++) {
        var burner = box(0.35, 0.02, 0.35, mat(0x333333, 0.5));
        burner.position.set(7.85 + bx * 0.55, 0.95, -0.25 + bz * 0.5); g.add(burner);
      }
    }

    // ═══ BATHROOM (behind interior wall at z=2) ═══
    // Room: x=-2 to x=9 (11 wide), z=2 to z=6 (4 deep)
    // Door opening at x=0.75 to x=3.25 in front wall (z=2)
    // Layout: shower (far left) | door gap | vanity (right of door) | toilet (far right)
    //         bathtub along back wall (z=5.5)
    var whtMat = mat(0xFFFFFF, 0.9);
    var faucetMat = mat(0xC0C0C0, 0.2, 0.6);

    // Tile floor (full room)
    var tileMat = mat(0xC8C0B5, 0.35, 0.05);
    var tileFloor = box(11, 0.04, 4, tileMat);
    tileFloor.position.set(3.5, 0.02, 4); g.add(tileFloor);

    // ── Vanity + sink (right of door, against front wall z=2) ──
    // Door ends at x=3.25, vanity from x=4 to x=8
    var vanCabinet = box(4, 1.2, 0.8, mat(0xE8E4E0, 0.85));
    vanCabinet.position.set(6, 0.6, 2.6); g.add(vanCabinet);
    // Countertop
    var vanTop = box(4.2, 0.08, 0.9, quartzMat);
    vanTop.position.set(6, 1.22, 2.6); g.add(vanTop);
    // Sink basin (recessed into countertop)
    var sinkRim = box(1.4, 0.1, 0.65, whtMat);
    sinkRim.position.set(6, 1.24, 2.65); g.add(sinkRim);
    // Dark hole (dropped below countertop surface)
    var sinkHole = box(1.1, 0.15, 0.45, mat(0x0a0a15, 0.2));
    sinkHole.position.set(6, 1.16, 2.65); g.add(sinkHole);
    // Drain dot
    var drain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8), faucetMat);
    drain.position.set(6, 1.1, 2.65); g.add(drain);
    // Faucet (cylinder)
    var sinkFaucetPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), faucetMat);
    sinkFaucetPost.position.set(6, 1.52, 2.3); sinkFaucetPost.castShadow = true; g.add(sinkFaucetPost);
    var sinkFaucetSpout = box(0.04, 0.04, 0.2, faucetMat);
    sinkFaucetSpout.position.set(6, 1.75, 2.4); g.add(sinkFaucetSpout);
    // Mirror above vanity
    var mirrorFrame = box(3.5, 2, 0.08, steelMat);
    mirrorFrame.position.set(6, 2.8, 2.25); g.add(mirrorFrame);
    var mirrorGlass = box(3.3, 1.8, 0.04, glassMat);
    mirrorGlass.position.set(6, 2.8, 2.23); g.add(mirrorGlass);

    // ── Walk-in shower (far left corner, x=-2 to x=0.5, full height glass) ──
    var showerFloor = box(2.5, 0.06, 3.5, mat(0xB0A898, 0.35));
    showerFloor.position.set(-0.75, 0.03, 4); g.add(showerFloor);
    // Full-height glass enclosure (front panel + right panel, floor to ceiling)
    var showerGlassF = box(2.5, WH, 0.06, glassMat);
    showerGlassF.position.set(-0.75, WH / 2, 2.3); g.add(showerGlassF);
    var showerGlassR = box(0.06, WH, 3.5, glassMat);
    showerGlassR.position.set(0.5, WH / 2, 4); g.add(showerGlassR);
    // Glass door frame strips (chrome)
    var showerFrameF = box(2.5, 0.04, 0.08, faucetMat);
    showerFrameF.position.set(-0.75, WH - 0.02, 2.3); g.add(showerFrameF);
    var showerFrameR = box(0.08, 0.04, 3.5, faucetMat);
    showerFrameR.position.set(0.5, WH - 0.02, 4); g.add(showerFrameR);
    var showerFrameFB = box(2.5, 0.04, 0.08, faucetMat);
    showerFrameFB.position.set(-0.75, 0.06, 2.3); g.add(showerFrameFB);
    // Rain shower head (square)
    var showerHead = box(0.5, 0.04, 0.5, faucetMat);
    showerHead.position.set(-0.75, WH - 1.5, 4); g.add(showerHead);
    var showerArm = box(0.04, 0.04, 0.6, faucetMat);
    showerArm.position.set(-0.75, WH - 1.5, 5.4); g.add(showerArm);
    var showerPipe = box(0.04, 1.2, 0.04, faucetMat);
    showerPipe.position.set(-0.75, WH - 0.8, 5.7); g.add(showerPipe);
    // Valve/controls
    var showerValve = box(0.15, 0.15, 0.06, faucetMat);
    showerValve.position.set(-0.75, 1.2, 5.7); g.add(showerValve);

    // ── Toilet (center-right of room, wall-mounted style) ──
    // Wall-mount plate (flush plate on back wall)
    var flushPlate = box(0.6, 0.8, 0.08, faucetMat);
    flushPlate.position.set(4, 1.5, 5.7); g.add(flushPlate);
    // Flush buttons (2 circles approximated as small boxes)
    var flushBtnL = box(0.12, 0.2, 0.04, mat(0xE0E0E0, 0.2, 0.4));
    flushBtnL.position.set(3.88, 1.55, 5.65); g.add(flushBtnL);
    var flushBtnR = box(0.12, 0.2, 0.04, mat(0xE0E0E0, 0.2, 0.4));
    flushBtnR.position.set(4.12, 1.55, 5.65); g.add(flushBtnR);
    // Concealed cistern behind wall (hidden box for structure)
    var cistern = box(0.5, 1.2, 0.4, mat(0xDDDDDD, 0.8));
    cistern.position.set(4, 1.0, 5.85); g.add(cistern);
    // Bowl — cylindrical pedestal base
    var toiletPed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.35, 0.5, 16), whtMat
    );
    toiletPed.position.set(4, 0.25, 5.2); toiletPed.castShadow = true; g.add(toiletPed);
    // Seat (wider oval shape)
    var toiletSeat = box(0.8, 0.12, 1, whtMat);
    toiletSeat.position.set(4, 0.55, 5); g.add(toiletSeat);
    // Bowl hole (dark interior)
    var bowlHole = box(0.5, 0.06, 0.6, mat(0x1a1a2e, 0.3));
    bowlHole.position.set(4, 0.53, 4.95); g.add(bowlHole);
    // Lid (slightly tilted back)
    var toiletLid = box(0.75, 0.04, 0.85, whtMat);
    toiletLid.position.set(4, 0.62, 5); g.add(toiletLid);

    // ═══ WING BEDROOM ═══
    // Bed — mattress, headboard, pillows, duvet
    var mattress = box(4.2, 0.35, 5, linenMat);
    mattress.position.set(-6.5, 0.52, 10); g.add(mattress);
    var bedFrame = box(4.4, 0.3, 5.2, darkWood);
    bedFrame.position.set(-6.5, 0.15, 10); g.add(bedFrame);
    var headboard = box(4.4, 2.0, 0.15, mat(0x6B5D4A, 0.7));
    headboard.position.set(-6.5, 1.3, 12.6); g.add(headboard);
    // Pillows (4)
    for (var pi = 0; pi < 4; pi++) {
      var pillow = box(0.9, 0.2, 0.5, pillowMat);
      pillow.position.set(-7.8 + pi * 1.1, 0.8, 12.0); g.add(pillow);
    }
    // Duvet fold
    var duvet = box(4.0, 0.08, 3.0, mat(0xD5CFC5, 0.8));
    duvet.position.set(-6.5, 0.75, 9); g.add(duvet);

    // Nightstands (2) — drawer + surface
    [[-8.2, 12.2], [-4.8, 12.2]].forEach(function(np) {
      var nsBody = box(0.8, 0.55, 0.6, darkWood);
      nsBody.position.set(np[0], 0.28, np[1]); g.add(nsBody);
      var nsTop = box(0.85, 0.04, 0.65, woodMat);
      nsTop.position.set(np[0], 0.58, np[1]); g.add(nsTop);
      var nsDrawer = box(0.7, 0.2, 0.04, mat(0x7B6D5A, 0.75));
      nsDrawer.position.set(np[0], 0.3, np[1] - 0.28); g.add(nsDrawer);
      var nsHandle = box(0.2, 0.03, 0.03, steelMat);
      nsHandle.position.set(np[0], 0.32, np[1] - 0.31); g.add(nsHandle);
    });

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

  // Set wall opacity on all wall meshes
  function setWallOpacity(opacity) {
    if (!procGroups.walls) return;
    procGroups.walls.traverse(function(obj) {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = opacity;
        obj.material.needsUpdate = true;
      }
    });
  }

  /* ═══ Process Visual Lifecycle ═══ */

  // Step 0: Site & Feasibility — Blueprint grid + lot boundary, camera high overhead
  function prepareStep0() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procCamera.position.set(0, 40, 8);
    procCamera.lookAt(0, 0, 0);
    setProcLightsIntensity(0);
    procMarkDirty();
  }
  function scrubStep0(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Camera descends from overhead
    procCamera.position.set(-8 * s, 40 - 12 * s, 8 + 12 * s);
    procCamera.lookAt(0, 0, 0);
    // Fade grid lines
    procGroups.grid.children.forEach(function(line) {
      if (line.material) line.material.opacity = 0.15 + 0.15 * s;
    });
    procMarkDirty();
  }

  // Step 1: Architecture — Foundation appears, floor plan visible
  function prepareStep1() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = -2;
    procCamera.position.set(-8, 28, 20);
    procCamera.lookAt(0, 0, 0);
    procMarkDirty();
  }
  function scrubStep1(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Foundation rises from below
    procGroups.foundation.position.y = -2 + 2 * s;
    // Camera moves closer
    procCamera.position.set(-8 + 6 * s, 28 - 6 * s, 20 + 2 * s);
    procCamera.lookAt(0, 1 * s, 0);
    procMarkDirty();
  }

  // Step 2: Permitting — Walls start rising (scroll-driven scale)
  function prepareStep2() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 0, 1);
    setWallOpacity(1);
    procCamera.position.set(-2, 22, 22);
    procCamera.lookAt(0, 2, 0);
    procMarkDirty();
  }
  function scrubStep2(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Walls grow up
    procGroups.walls.scale.y = s;
    // Camera orbits slightly
    procCamera.position.set(-2 + 10 * s, 22 - 4 * s, 22 - 2 * s);
    procCamera.lookAt(0, 2 + 2 * s, 0);
    procMarkDirty();
  }

  // Step 3: Foundation & Framing — Full walls + roof appears
  function prepareStep3() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    setWallOpacity(1);
    procGroups.roof.visible = true;
    procGroups.roof.scale.set(1, 0, 1);
    procCamera.position.set(8, 18, 20);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }
  function scrubStep3(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Roof descends into place
    procGroups.roof.scale.y = s;
    // Smooth camera sweep
    procCamera.position.set(8 + 8 * s, 18 + 2 * s, 20 - 4 * s);
    procCamera.lookAt(0, 4, 0);
    procMarkDirty();
  }

  // Step 4: MEP & Finishes — Windows, doors, interior lights
  function prepareStep4() {
    if (!procCamera) return;
    setProcGroupsVisible(false);
    procGroups.grid.visible = true;
    procGroups.foundation.visible = true;
    procGroups.foundation.position.y = 0;
    procGroups.walls.visible = true;
    procGroups.walls.scale.set(1, 1, 1);
    setWallOpacity(1);
    procGroups.roof.visible = true;
    procGroups.roof.scale.set(1, 1, 1);
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
    procCamera.position.set(16, 20, 16);
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
    // Furniture pops in (30-70%, staggered)
    var children = procGroups.interior.children;
    var meshIdx = 0;
    children.forEach(function(piece) {
      if (piece.isPointLight) return;
      var pieceStart = 0.3 + (meshIdx / 6) * 0.35;
      var pieceP = remap(t, pieceStart, pieceStart + 0.12);
      var s = easeOutBack(pieceP);
      piece.scale.set(s, s, s);
      meshIdx++;
    });
    // Lights fade on (60-90%)
    var lightP = smoothstep(remap(t, 0.6, 0.9));
    setProcLightsIntensity(lightP);
    // Camera push closer
    var s = smoothstep(t);
    procCamera.position.set(16 - 4 * s, 20 - 4 * s, 16 + 4 * s);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }

  // Step 5: Handover — Walls go translucent, warm glow, camera sweeps
  function prepareStep5() {
    if (!procCamera) return;
    setProcGroupsVisible(true);
    procGroups.foundation.position.y = 0;
    procGroups.walls.scale.set(1, 1, 1);
    setWallOpacity(1); // start opaque, scrub will transition
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
    setProcLightsIntensity(1);
    procCamera.position.set(12, 16, 20);
    procCamera.lookAt(0, 3, 0);
    procMarkDirty();
  }
  function scrubStep5(t) {
    if (!procCamera) return;
    var s = smoothstep(t);
    // Walls transition from opaque (1) to translucent (0.12) over first 60%
    var wallP = Math.min(1, t / 0.6);
    setWallOpacity(1 - wallP * 0.88);
    // Camera sweeps for final reveal
    procCamera.position.set(12 + 12 * s, 16 - 4 * s, 20 - 6 * s);
    procCamera.lookAt(0, 3, 0);
    // Boost lights for warm glow
    setProcLightsIntensity(1 + 0.8 * s);
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
        pinSpacing: true,
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
