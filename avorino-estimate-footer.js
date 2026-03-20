(function() {
  'use strict';

  // Destroy existing Lenis
  if (window.__lenis) { try { window.__lenis.destroy(); } catch(e) {} }
  var lenis = new Lenis({ duration: 1.2, easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, orientation: 'vertical', smoothWheel: true });
  window.__lenis = lenis;
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  gsap.ticker.lagSmoothing(0);

  // Three.js hero - subtle floating geometric shapes
  function initEstimateHero() {
    var container = document.getElementById('hero-canvas') || document.querySelector('#est-hero .sv-canvas-wrap');
    if (!container || typeof THREE === 'undefined') return;

    var w = container.offsetWidth, h = container.offsetHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 8);

    var renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create subtle floating shapes - mix of small planes and circles
    var shapes = [];
    var material = new THREE.MeshBasicMaterial({ color: 0xf0ede8, wireframe: true, transparent: true, opacity: 0.08 });

    for (var i = 0; i < 12; i++) {
      var geo;
      if (i % 3 === 0) {
        geo = new THREE.CircleGeometry(0.3 + Math.random() * 0.4, 6);
      } else if (i % 3 === 1) {
        geo = new THREE.PlaneGeometry(0.5 + Math.random() * 0.6, 0.7 + Math.random() * 0.5);
      } else {
        geo = new THREE.RingGeometry(0.2, 0.4 + Math.random() * 0.3, 6);
      }
      var mesh = new THREE.Mesh(geo, material);
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        rotSpeed: (Math.random() - 0.5) * 0.004,
        driftY: (Math.random() - 0.5) * 0.001,
        baseY: mesh.position.y
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    var clock = new THREE.Clock();
    var animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      for (var i = 0; i < shapes.length; i++) {
        var s = shapes[i];
        s.rotation.z += s.userData.rotSpeed;
        s.position.y = s.userData.baseY + Math.sin(t * 0.4 + i * 0.7) * 0.25;
      }
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      var w2 = container.offsetWidth, h2 = container.offsetHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    });

    // Pause when hidden
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) { cancelAnimationFrame(animId); }
      else { animate(); }
    });
  }

  // GSAP form section fade-in
  function initFormAnimations() {
    var infoCol = document.querySelector('.est-info-col');
    var formCol = document.querySelector('.est-form-col');
    if (infoCol) {
      gsap.from(infoCol, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: infoCol, start: 'top 80%' } });
    }
    if (formCol) {
      gsap.from(formCol, { opacity: 0, y: 30, duration: 0.8, delay: 0.2, ease: 'power2.out', scrollTrigger: { trigger: formCol, start: 'top 80%' } });
    }
  }

  initEstimateHero();
  initFormAnimations();
  ScrollTrigger.refresh();
})();
