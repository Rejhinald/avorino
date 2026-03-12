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

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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
     INIT
     ═══════════════════════════════════════════════ */
  initBlogHero();
  initBlogCards();
  ScrollTrigger.refresh();
})();
