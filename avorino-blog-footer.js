(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL — reuse or replace existing
     ═══════════════════════════════════════════════ */
  if (window.__lenis) { try { window.__lenis.destroy(); } catch(e) {} }
  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true, smoothTouch: false,
  });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', function() { lenis.resize(); });

  /* ═══════════════════════════════════════════════
     THREE.JS HERO — Floating page/document particles
     ═══════════════════════════════════════════════ */
  function initBlogHero() {
    var container = document.getElementById('hero-canvas') || document.querySelector('#blog-hero .sv-canvas-wrap');
    if (!container || typeof THREE === 'undefined') return;

    var w = container.offsetWidth, h = container.offsetHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 8);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Floating "page" planes — subtle wireframe rectangles
    var planes = [];
    var material = new THREE.MeshBasicMaterial({
      color: 0xf0ede8,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });

    for (var i = 0; i < 18; i++) {
      var geo = new THREE.PlaneGeometry(
        0.6 + Math.random() * 0.8,
        0.8 + Math.random() * 1.2,
        1, 1
      );
      var mesh = new THREE.Mesh(geo, material);
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      mesh.userData = {
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.003,
          y: (Math.random() - 0.5) * 0.003,
          z: (Math.random() - 0.5) * 0.002
        },
        driftSpeed: (Math.random() - 0.5) * 0.002,
        baseY: mesh.position.y
      };
      scene.add(mesh);
      planes.push(mesh);
    }

    var animId;
    var clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      for (var i = 0; i < planes.length; i++) {
        var p = planes[i];
        p.rotation.x += p.userData.rotSpeed.x;
        p.rotation.y += p.userData.rotSpeed.y;
        p.rotation.z += p.userData.rotSpeed.z;
        p.position.y = p.userData.baseY + Math.sin(t * 0.5 + i) * 0.3;
        p.position.x += p.userData.driftSpeed;
        // Wrap horizontally if drifted too far
        if (p.position.x > 8) p.position.x = -8;
        if (p.position.x < -8) p.position.x = 8;
      }
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', function() {
      var w2 = container.offsetWidth, h2 = container.offsetHeight;
      if (w2 === 0 || h2 === 0) return;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    });

    // Cleanup on page visibility change (save GPU when tab hidden)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(animId);
        clock.stop();
      } else {
        clock.start();
        animate();
      }
    });
  }

  /* ═══════════════════════════════════════════════
     BLOG CARD REVEAL — editorial stagger
     ═══════════════════════════════════════════════ */
  function initBlogCards() {
    var cards = document.querySelectorAll('.blog-card');
    if (!cards.length) return;

    cards.forEach(function(card) { card.removeAttribute('data-animate'); });

    gsap.set(cards, { opacity: 0, y: 48, scale: 0.97 });

    ScrollTrigger.batch(cards, {
      onEnter: function(batch) {
        gsap.to(batch, {
          opacity: 1, y: 0, scale: 1,
          duration: 1.0,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'scale,transform',
        });
      },
      start: 'top 88%',
    });

    // Subtle parallax on each card image
    document.querySelectorAll('.blog-card-img').forEach(function(img) {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.blog-card'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════
     BLOG POST TEMPLATE — Three.js hero + GSAP
     ═══════════════════════════════════════════════ */
  function initPostHero() {
    var hero = document.querySelector('.bt-hero');
    if (!hero) return;

    // Create canvas container if not already present
    var container = hero.querySelector('#hero-canvas') || hero.querySelector('.sv-canvas-wrap');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hero-canvas';
      container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;overflow:hidden;';
      hero.insertBefore(container, hero.firstChild);
    }

    if (typeof THREE === 'undefined') return;

    var w = container.offsetWidth, h = container.offsetHeight;
    if (w === 0 || h === 0) return;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 10);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Floating ink lines — editorial/writing theme
    var lines = [];
    var lineMat = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.08 });

    for (var i = 0; i < 24; i++) {
      var pts = [];
      var segs = 3 + Math.floor(Math.random() * 4);
      var sx = (Math.random() - 0.5) * 16;
      var sy = (Math.random() - 0.5) * 10;
      var sz = (Math.random() - 0.5) * 4;
      for (var j = 0; j < segs; j++) {
        pts.push(new THREE.Vector3(
          sx + j * (0.3 + Math.random() * 0.6),
          sy + (Math.random() - 0.5) * 0.4,
          sz
        ));
      }
      var geo = new THREE.BufferGeometry().setFromPoints(pts);
      var line = new THREE.Line(geo, lineMat);
      line.userData = {
        driftX: (Math.random() - 0.5) * 0.003,
        driftY: (Math.random() - 0.5) * 0.002,
        baseY: sy,
        phase: Math.random() * Math.PI * 2
      };
      scene.add(line);
      lines.push(line);
    }

    // Scattered dots like ink splatters
    var dotCount = 40;
    var dotPositions = new Float32Array(dotCount * 3);
    for (var d = 0; d < dotCount; d++) {
      dotPositions[d * 3]     = (Math.random() - 0.5) * 18;
      dotPositions[d * 3 + 1] = (Math.random() - 0.5) * 10;
      dotPositions[d * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    var dotMat = new THREE.PointsMaterial({ color: 0xf0ede8, size: 2, transparent: true, opacity: 0.1, sizeAttenuation: false });
    scene.add(new THREE.Points(dotGeo, dotMat));

    var clock = new THREE.Clock();
    var animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        l.position.x += l.userData.driftX;
        l.position.y = l.userData.baseY + Math.sin(t * 0.4 + l.userData.phase) * 0.3;
        if (l.position.x > 10) l.position.x = -10;
        if (l.position.x < -10) l.position.x = 10;
      }
      // Gentle dot float
      var posArr = dotGeo.attributes.position.array;
      for (var d = 0; d < dotCount; d++) {
        posArr[d * 3 + 1] += Math.sin(t * 0.3 + d * 0.7) * 0.001;
      }
      dotGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      var nw = container.offsetWidth, nh = container.offsetHeight;
      if (nw === 0 || nh === 0) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) { cancelAnimationFrame(animId); clock.stop(); }
      else { clock.start(); animate(); }
    });
  }

  /* ═══════════════════════════════════════════════
     BLOG POST TEMPLATE — GSAP scroll animations
     ═══════════════════════════════════════════════ */
  function initPostAnimations() {
    var hero = document.querySelector('.bt-hero');
    if (!hero) return;

    // Hero inner — fade up title, meta
    var heroInner = hero.querySelector('.bt-hero-inner');
    if (heroInner) {
      gsap.from(heroInner.querySelector('.bt-label'), { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from(heroInner.querySelector('.bt-title'), { opacity: 0, y: 30, duration: 1.0, delay: 0.4, ease: 'power3.out' });
      gsap.from(heroInner.querySelector('.bt-meta'), { opacity: 0, y: 20, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    }

    // Featured image — scale reveal
    var imgWrap = document.querySelector('.bt-img-wrap');
    if (imgWrap) {
      var img = imgWrap.querySelector('.bt-featured-img');
      if (img) {
        gsap.from(img, {
          scale: 1.08, opacity: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: imgWrap, start: 'top 80%' }
        });
      }
    }

    // Article body — fade in
    var article = document.querySelector('.bt-article-inner');
    if (article) {
      gsap.from(article, {
        opacity: 0, y: 40, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: article, start: 'top 85%' }
      });
    }

    // Divider — width reveal
    var divider = document.querySelector('.bt-divider');
    if (divider) {
      gsap.from(divider, {
        width: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: divider, start: 'top 90%' }
      });
    }

    // Back link — fade in
    var backLink = document.querySelector('.bt-back-link');
    if (backLink) {
      gsap.from(backLink, {
        opacity: 0, x: -20, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: backLink, start: 'top 92%' }
      });
    }

    // Hero parallax on scroll
    gsap.to(hero, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  initBlogHero();
  initBlogCards();
  initPostHero();
  initPostAnimations();
  ScrollTrigger.refresh();
})();
