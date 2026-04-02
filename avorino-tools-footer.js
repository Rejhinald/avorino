(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ── Preserve original text before avorino-animations.js modifies DOM ── */
  document.querySelectorAll('.av-cta-heading').forEach(function(el) {
    if (!el.dataset.origText) el.dataset.origText = el.textContent.trim();
  });

  /* ── Remove data-animate from elements this script handles ── */
  document.querySelectorAll('.av-cta-heading, .av-cta-btn, .av-cta-btns, .av-cta-subtitle').forEach(function(el) {
    el.removeAttribute('data-animate');
  });

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     HERO — Three.js Data Visualization Scene
     Wireframe bar charts, floating data nodes, connecting lines
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('tl-hero');
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
    /* h1 uses blur-focus handled by avorino-animations.js — no override needed */
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

    /* ═══ Three.js Scene — Data Analytics Visualization ═══ */
    var scene = new THREE.Scene();
    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(16, 10, 20); camera.lookAt(0, 3, 0);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: !isMobile, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    canvasWrap.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var pl1 = new THREE.PointLight(0xc9a96e, 0.8, 80);
    pl1.position.set(16, 20, 18); scene.add(pl1);

    var wireColor = 0xc9a96e;
    var accentColor = 0xc8222a;
    var creamColor = 0xf0ede8;

    var gridMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var barMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var accentMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0 });
    var nodeMat = new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 0 });
    var solidMat = new THREE.MeshStandardMaterial({ color: creamColor, transparent: true, opacity: 0, side: THREE.DoubleSide, roughness: 0.85 });

    /* ── Base Grid (analytics dashboard floor) ── */
    var gridGroup = new THREE.Group();
    for (var gi = 0; gi <= 12; gi++) {
      var t = (gi / 12) * 20 - 10;
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-10, 0, t), new THREE.Vector3(10, 0, t)]), gridMat.clone()));
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(t, 0, -10), new THREE.Vector3(t, 0, 10)]), gridMat.clone()));
    }
    scene.add(gridGroup);

    /* ── Bar Chart Group (left side — represents cost/ROI data) ── */
    var barsGroup = new THREE.Group();
    var barData = [
      { x: -6, z: -2, h: 2.5 },
      { x: -4.5, z: -2, h: 4.2 },
      { x: -3, z: -2, h: 3.8 },
      { x: -1.5, z: -2, h: 5.5 },
      { x: 0, z: -2, h: 6.8 },
      { x: 1.5, z: -2, h: 5.0 },
      { x: 3, z: -2, h: 7.5 },
      { x: 4.5, z: -2, h: 8.2 },
    ];
    barData.forEach(function(bd) {
      /* Wireframe bar edges */
      var bw = 0.5, bd2 = 0.5;
      var pts = [
        /* bottom rectangle */
        new THREE.Vector3(bd.x - bw, 0, bd.z - bd2), new THREE.Vector3(bd.x + bw, 0, bd.z - bd2),
        new THREE.Vector3(bd.x + bw, 0, bd.z + bd2), new THREE.Vector3(bd.x - bw, 0, bd.z + bd2),
        new THREE.Vector3(bd.x - bw, 0, bd.z - bd2),
        /* up to top */
        new THREE.Vector3(bd.x - bw, bd.h, bd.z - bd2),
        /* top rectangle */
        new THREE.Vector3(bd.x + bw, bd.h, bd.z - bd2),
        new THREE.Vector3(bd.x + bw, bd.h, bd.z + bd2),
        new THREE.Vector3(bd.x - bw, bd.h, bd.z + bd2),
        new THREE.Vector3(bd.x - bw, bd.h, bd.z - bd2),
      ];
      barsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), barMat));
      /* Remaining vertical edges */
      barsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd.x + bw, 0, bd.z - bd2), new THREE.Vector3(bd.x + bw, bd.h, bd.z - bd2)
      ]), barMat));
      barsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd.x + bw, 0, bd.z + bd2), new THREE.Vector3(bd.x + bw, bd.h, bd.z + bd2)
      ]), barMat));
      barsGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bd.x - bw, 0, bd.z + bd2), new THREE.Vector3(bd.x - bw, bd.h, bd.z + bd2)
      ]), barMat));
    });
    scene.add(barsGroup);

    /* ── Trend Line (accent red, connecting bar tops) ── */
    var trendGroup = new THREE.Group();
    var trendPts = barData.map(function(bd) { return new THREE.Vector3(bd.x, bd.h + 0.3, bd.z); });
    trendGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(trendPts), accentMat));
    /* Dots at trend points */
    barData.forEach(function(bd) {
      var dotGeo = new THREE.SphereGeometry(0.12, 8, 8);
      var dotMesh = new THREE.Mesh(dotGeo, new THREE.MeshStandardMaterial({ color: accentColor, transparent: true, opacity: 0, roughness: 0.5 }));
      dotMesh.position.set(bd.x, bd.h + 0.3, bd.z);
      trendGroup.add(dotMesh);
    });
    scene.add(trendGroup);

    /* ── Gauge Ring (right side — represents loan qualification) ── */
    var gaugeGroup = new THREE.Group();
    var gaugeRadius = 2.5;
    var gaugeSegments = 48;
    /* Full ring (track) */
    var ringPts = [];
    for (var ri = 0; ri <= gaugeSegments; ri++) {
      var angle = (ri / gaugeSegments) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(angle) * gaugeRadius, 0, Math.sin(angle) * gaugeRadius));
    }
    var ringLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), nodeMat);
    gaugeGroup.add(ringLine);
    /* Filled arc (75% — accent) */
    var arcPts = [];
    for (var ai = 0; ai <= Math.floor(gaugeSegments * 0.75); ai++) {
      var aAngle = (ai / gaugeSegments) * Math.PI * 2 - Math.PI / 2;
      arcPts.push(new THREE.Vector3(Math.cos(aAngle) * gaugeRadius, 0.05, Math.sin(aAngle) * gaugeRadius));
    }
    gaugeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), accentMat));
    /* Inner ring */
    var innerPts = [];
    for (var ii = 0; ii <= gaugeSegments; ii++) {
      var iAngle = (ii / gaugeSegments) * Math.PI * 2;
      innerPts.push(new THREE.Vector3(Math.cos(iAngle) * (gaugeRadius - 0.8), 0, Math.sin(iAngle) * (gaugeRadius - 0.8)));
    }
    gaugeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(innerPts), nodeMat));
    /* Cross-lines inside gauge */
    gaugeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.6, 0, 0), new THREE.Vector3(0.6, 0, 0)
    ]), nodeMat));
    gaugeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -0.6), new THREE.Vector3(0, 0, 0.6)
    ]), nodeMat));
    gaugeGroup.position.set(5, 4, 3);
    gaugeGroup.rotation.x = -Math.PI * 0.35;
    scene.add(gaugeGroup);

    /* ── Data Nodes & Connections (floating network) ── */
    var nodesGroup = new THREE.Group();
    var nodePositions = [
      { x: -7, y: 6, z: 2 }, { x: -4, y: 8, z: 4 }, { x: -1, y: 7, z: 1 },
      { x: 2, y: 9, z: 3 }, { x: 5, y: 7, z: -1 }, { x: 7, y: 8, z: 2 },
      { x: -5, y: 5, z: -4 }, { x: 3, y: 6, z: -3 }, { x: 0, y: 10, z: 0 },
      { x: -3, y: 4, z: 5 }, { x: 6, y: 5, z: 5 }, { x: -8, y: 7, z: -1 },
    ];
    nodePositions.forEach(function(np) {
      var nGeo = new THREE.OctahedronGeometry(0.15, 0);
      var nMesh = new THREE.Mesh(nGeo, new THREE.MeshStandardMaterial({ color: wireColor, transparent: true, opacity: 0, roughness: 0.4 }));
      nMesh.position.set(np.x, np.y, np.z);
      nodesGroup.add(nMesh);
    });
    /* Connect nearby nodes */
    for (var ni = 0; ni < nodePositions.length; ni++) {
      for (var nj = ni + 1; nj < nodePositions.length; nj++) {
        var dx = nodePositions[ni].x - nodePositions[nj].x;
        var dy = nodePositions[ni].y - nodePositions[nj].y;
        var dz = nodePositions[ni].z - nodePositions[nj].z;
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < 6) {
          nodesGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(nodePositions[ni].x, nodePositions[ni].y, nodePositions[ni].z),
            new THREE.Vector3(nodePositions[nj].x, nodePositions[nj].y, nodePositions[nj].z)
          ]), nodeMat));
        }
      }
    }
    scene.add(nodesGroup);

    /* ── Floating Particles ── */
    var particles = [];
    var particlePositions = [];
    var particleCount = isMobile ? 30 : 60;
    for (var p = 0; p < particleCount; p++) {
      var px = (Math.random()-0.5)*20, py = Math.random()*12, pz = (Math.random()-0.5)*20;
      particlePositions.push(px, py, pz);
      particles.push({ x: px, y: py, z: pz, speed: 0.002+Math.random()*0.006 });
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    var pMat = new THREE.PointsMaterial({ color: wireColor, size: 0.06, transparent: true, opacity: 0, sizeAttenuation: true });
    var pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    /* ── Solid Fill (mesh planes for bars — appears late in scroll) ── */
    var solidGroup = new THREE.Group();
    barData.forEach(function(bd) {
      var bw = 0.5, bd2 = 0.5;
      /* Top face */
      var topGeo = new THREE.PlaneGeometry(bw * 2, bd2 * 2);
      var topMesh = new THREE.Mesh(topGeo, solidMat.clone());
      topMesh.rotation.x = -Math.PI / 2;
      topMesh.position.set(bd.x, bd.h, bd.z);
      solidGroup.add(topMesh);
      /* Front face */
      var frontGeo = new THREE.PlaneGeometry(bw * 2, bd.h);
      var frontMesh = new THREE.Mesh(frontGeo, solidMat.clone());
      frontMesh.position.set(bd.x, bd.h / 2, bd.z - bd2);
      solidGroup.add(frontMesh);
    });
    scene.add(solidGroup);

    /* ── Entrance Animations ── */
    gsap.to({ v: 0 }, { v: 1, duration: 1.5, delay: 0.3, ease: 'power2.out',
      onUpdate: function() {
        gridGroup.children.forEach(function(l) { l.material.opacity = this.targets()[0].v * 0.06; }.bind(this));
      }
    });
    gsap.to({ v: 0 }, { v: 1, duration: 1.8, delay: 0.6, ease: 'power2.out',
      onUpdate: function() {
        barMat.opacity = this.targets()[0].v * 0.35;
      }
    });
    gsap.to({ v: 0 }, { v: 1, duration: 1.5, delay: 1.0, ease: 'power2.out',
      onUpdate: function() {
        accentMat.opacity = this.targets()[0].v * 0.5;
        trendGroup.children.forEach(function(c) {
          if (c.material && c.material.isMeshStandardMaterial) c.material.opacity = this.targets()[0].v * 0.7;
        }.bind(this));
      }
    });
    gsap.to({ v: 0 }, { v: 1, duration: 1.5, delay: 1.2, ease: 'power2.out',
      onUpdate: function() {
        nodeMat.opacity = this.targets()[0].v * 0.2;
        nodesGroup.children.forEach(function(c) {
          if (c.material && c.material.isMeshStandardMaterial) c.material.opacity = this.targets()[0].v * 0.5;
        }.bind(this));
      }
    });
    gsap.to(pMat, { opacity: 0.25, duration: 1, delay: 1.5, ease: 'power2.out' });

    /* ── Scroll-driven animation ── */
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=' + (window.innerHeight * 0.6),
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: function(self) {
        var p = self.progress;

        /* Bars grow more prominent */
        barMat.opacity = 0.35 + p * 0.25;

        /* Trend line pulses */
        accentMat.opacity = 0.5 + p * 0.3;

        /* Gauge rotates */
        gaugeGroup.rotation.z = p * Math.PI * 0.5;

        /* Nodes become more visible */
        nodeMat.opacity = 0.2 + p * 0.2;
        nodesGroup.children.forEach(function(c) {
          if (c.material && c.material.isMeshStandardMaterial) c.material.opacity = 0.5 + p * 0.3;
        });

        /* Solid fills appear */
        var solidP = Math.max(0, Math.min(1, (p - 0.4) / 0.4));
        solidGroup.children.forEach(function(m) {
          if (m.material) m.material.opacity = solidP * 0.2;
        });

        /* Grid fades */
        var gridF = p > 0.5 ? Math.max(0, 1 - (p - 0.5) / 0.4) : 1;
        gridGroup.children.forEach(function(l) { l.material.opacity = 0.06 * gridF; });

        /* Camera moves */
        camera.userData.scrollRadius = 16 + p * 6;
        camera.userData.scrollHeight = 10 + p * 5;
      }
    });

    /* ── Mouse-driven camera orbit + render loop ── */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var baseAngle = 0;
    camera.userData.scrollRadius = 16;
    camera.userData.scrollHeight = 10;

    function animate() {
      requestAnimationFrame(animate);
      baseAngle += 0.0012;
      var orbitR = camera.userData.scrollRadius || 16;
      var camH = camera.userData.scrollHeight || 10;
      camera.position.set(
        Math.cos(baseAngle + mouseX * 0.3) * orbitR,
        camH + mouseY * 1.5,
        Math.sin(baseAngle + mouseX * 0.3) * orbitR
      );
      camera.lookAt(0, 3, 0);

      /* Update particles */
      var positions = pSystem.geometry.attributes.position.array;
      for (var k = 0; k < particles.length; k++) {
        particles[k].y += particles[k].speed;
        if (particles[k].y > 12) {
          particles[k].y = 0;
          particles[k].x = (Math.random()-0.5)*20;
          particles[k].z = (Math.random()-0.5)*20;
        }
        positions[k*3] = particles[k].x;
        positions[k*3+1] = particles[k].y;
        positions[k*3+2] = particles[k].z;
      }
      pSystem.geometry.attributes.position.needsUpdate = true;

      /* Gentle node float */
      nodesGroup.children.forEach(function(c, idx) {
        if (c.isMesh) {
          c.position.y += Math.sin(baseAngle * 2 + idx * 0.7) * 0.003;
          c.rotation.y = baseAngle * 0.5 + idx;
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    /* ── Resize handler ── */
    window.addEventListener('resize', function() {
      var nw = canvasWrap.clientWidth, nh = canvasWrap.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
  }

  /* ═══════════════════════════════════════════════
     IFRAME INJECTION — Designer API can't create iframes,
     so we inject them at runtime from data attributes
     ═══════════════════════════════════════════════ */
  function initIframe() {
    var holder = document.getElementById('tool-iframe-holder');
    if (!holder) return;
    var url = holder.getAttribute('data-embed-url');
    var title = holder.getAttribute('data-embed-title') || 'Tool';
    if (!url) return;

    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.minHeight = '700px';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    holder.innerHTML = '';
    holder.appendChild(iframe);
  }

  /* ═══════════════════════════════════════════════
     CTA SECTION ANIMATIONS
     ═══════════════════════════════════════════════ */
  function initCTA() {
    var ctaHeading = document.querySelector('.av-cta-heading');
    if (!ctaHeading) return;

    var ctaWords = splitIntoChars(ctaHeading);
    gsap.set(ctaWords, { yPercent: 120, opacity: 0 });
    gsap.to(ctaWords, {
      yPercent: 0, opacity: 1, duration: 1, stagger: 0.02,
      ease: 'elastic.out(1, 0.7)',
      scrollTrigger: { trigger: ctaHeading, start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    var ctaBtn = document.querySelector('.av-cta-btn, .av-cta-btns');
    if (ctaBtn) {
      gsap.fromTo(ctaBtn, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: ctaBtn, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    }

    var ctaSub = document.querySelector('.av-cta-subtitle');
    if (ctaSub) {
      gsap.fromTo(ctaSub, { opacity: 0, y: 20 }, {
        opacity: 0.5, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: ctaSub, start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    }
  }

  /* ═══════════════════════════════════════════════
     INIT — wait for DOM and Three.js
     ═══════════════════════════════════════════════ */
  function tryInit(attempts) {
    if (typeof THREE !== 'undefined' && document.getElementById('tl-hero')) {
      initHero();
      initIframe();
      initCTA();
    } else if (attempts < 20) {
      setTimeout(function() { tryInit(attempts + 1); }, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { tryInit(0); });
  } else {
    tryInit(0);
  }
})();
