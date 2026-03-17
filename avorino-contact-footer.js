(function() {
  'use strict';

  // ── Lenis smooth scroll ──
  if (window.__lenis) { try { window.__lenis.destroy(); } catch(e) {} }
  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    smoothWheel: true
  });
  window.__lenis = lenis;
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  gsap.ticker.lagSmoothing(0);

  // ═══════════════════════════════════════════════
  // THREE.JS — Wireframe blueprint hero
  // ═══════════════════════════════════════════════
  function initContactHero() {
    var container = document.getElementById('ct-canvas') || document.querySelector('.ct-canvas-wrap');
    if (!container || typeof THREE === 'undefined') return;

    var w = container.offsetWidth, h = container.offsetHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(12, 8, 14);
    camera.lookAt(0, 2, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Materials
    var lineMat = new THREE.LineBasicMaterial({ color: 0xf0ede8, opacity: 0.18, transparent: true });
    var lineAccent = new THREE.LineBasicMaterial({ color: 0xc8222a, opacity: 0.25, transparent: true });
    var lineGold = new THREE.LineBasicMaterial({ color: 0xc9a96e, opacity: 0.2, transparent: true });

    function makeLine(points, material) {
      var vecs = [];
      for (var i = 0; i < points.length; i++) {
        vecs.push(new THREE.Vector3(points[i][0], points[i][1], points[i][2]));
      }
      var geo = new THREE.BufferGeometry().setFromPoints(vecs);
      var line = new THREE.Line(geo, material);
      scene.add(line);
      return line;
    }

    // ── Main house wireframe ──
    // Foundation
    makeLine([[0,0,0],[8,0,0],[8,0,6],[0,0,6],[0,0,0]], lineMat);
    // Walls
    makeLine([[0,0,0],[0,5,0]], lineMat);
    makeLine([[8,0,0],[8,5,0]], lineMat);
    makeLine([[8,0,6],[8,5,6]], lineMat);
    makeLine([[0,0,6],[0,5,6]], lineMat);
    // Top edges
    makeLine([[0,5,0],[8,5,0],[8,5,6],[0,5,6],[0,5,0]], lineMat);
    // Roof ridge
    makeLine([[0,5,3],[0,7.5,3]], lineAccent);
    makeLine([[8,5,3],[8,7.5,3]], lineAccent);
    makeLine([[0,7.5,3],[8,7.5,3]], lineAccent);
    // Roof slopes
    makeLine([[0,5,0],[0,7.5,3]], lineMat);
    makeLine([[0,5,6],[0,7.5,3]], lineMat);
    makeLine([[8,5,0],[8,7.5,3]], lineMat);
    makeLine([[8,5,6],[8,7.5,3]], lineMat);

    // ── ADU / Secondary structure ──
    makeLine([[10,0,2],[14,0,2],[14,0,6],[10,0,6],[10,0,2]], lineGold);
    makeLine([[10,0,2],[10,3.5,2]], lineGold);
    makeLine([[14,0,2],[14,3.5,2]], lineGold);
    makeLine([[14,0,6],[14,3.5,6]], lineGold);
    makeLine([[10,0,6],[10,3.5,6]], lineGold);
    makeLine([[10,3.5,2],[14,3.5,2],[14,3.5,6],[10,3.5,6],[10,3.5,2]], lineGold);
    // ADU flat roof overhang
    makeLine([[9.5,3.5,1.5],[14.5,3.5,1.5],[14.5,3.5,6.5],[9.5,3.5,6.5],[9.5,3.5,1.5]], lineGold);

    // ── Windows (main house) ──
    makeLine([[1.5,1.5,0],[3,1.5,0],[3,3.5,0],[1.5,3.5,0],[1.5,1.5,0]], lineMat);
    makeLine([[4.5,1.5,0],[6,1.5,0],[6,3.5,0],[4.5,3.5,0],[4.5,1.5,0]], lineMat);
    // Door
    makeLine([[6.5,0,0],[7.5,0,0],[7.5,3,0],[6.5,3,0],[6.5,0,0]], lineAccent);

    // ── ADU door + window ──
    makeLine([[11,0,2],[12,0,2],[12,2.5,2],[11,2.5,2],[11,0,2]], lineGold);
    makeLine([[12.5,1,2],[13.5,1,2],[13.5,2.5,2],[12.5,2.5,2],[12.5,1,2]], lineGold);

    // ── Dimension lines ──
    var dimMat = new THREE.LineBasicMaterial({ color: 0xf0ede8, opacity: 0.06, transparent: true });
    makeLine([[-0.8,0,0],[-0.8,5,0]], dimMat);
    makeLine([[-1.2,0,0],[-0.4,0,0]], dimMat);
    makeLine([[-1.2,5,0],[-0.4,5,0]], dimMat);

    // ── Ground grid ──
    var gridMat = new THREE.LineBasicMaterial({ color: 0xf0ede8, opacity: 0.03, transparent: true });
    for (var i = -4; i <= 20; i += 2) {
      makeLine([[i, 0, -4], [i, 0, 12]], gridMat);
      makeLine([[-4, 0, i], [20, 0, i]], gridMat);
    }

    // ── Slow orbit animation ──
    var time = 0;
    var animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      time += 0.003;
      camera.position.x = 12 * Math.cos(time * 0.3) + 6;
      camera.position.z = 14 * Math.sin(time * 0.3) + 3;
      camera.lookAt(6, 2.5, 3);
      renderer.render(scene, camera);
    }
    animate();

    // Resize
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

  // ═══════════════════════════════════════════════
  // GSAP — Hero entrance animations
  // ═══════════════════════════════════════════════
  function initHeroAnimations() {
    // Left side entrance
    gsap.from('.ct-hero-label', { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
    gsap.from('.ct-hero-heading', { opacity: 0, y: 40, duration: 1, delay: 0.5, ease: 'power3.out' });
    gsap.from('.ct-hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });
    gsap.from('.ct-contact-row', { opacity: 0, y: 20, duration: 0.8, delay: 1 });

    // Right side: form entrance
    gsap.from('.ct-hero-right', { opacity: 0, x: 60, duration: 1, delay: 0.4, ease: 'power3.out' });
    gsap.from('.ct-form-group', { opacity: 0, y: 20, duration: 0.6, stagger: 0.08, delay: 0.8 });
    gsap.from('.ct-form-submit', { opacity: 0, y: 20, duration: 0.6, delay: 1.4 });

    // Remove data-animate from hero elements so avorino-animations.js doesn't double-animate
    document.querySelectorAll('.ct-hero-label, .ct-hero-heading, .ct-hero-sub, .ct-contact-row').forEach(function(el) {
      el.removeAttribute('data-animate');
    });
  }

  // ═══════════════════════════════════════════════
  // GSAP — Trust section counter animation
  // ═══════════════════════════════════════════════
  function initTrustAnimations() {
    // Fade-up stagger for cards
    gsap.from('.ct-trust-item', {
      scrollTrigger: { trigger: '.ct-trust', start: 'top 80%' },
      opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: 'power3.out'
    });

    // Counter animation for stat values
    document.querySelectorAll('.ct-trust-value').forEach(function(el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          var raw = el.getAttribute('data-value');
          if (!raw) return;
          var target = parseFloat(raw);
          var isFloat = raw.indexOf('.') !== -1;
          var suffix = el.getAttribute('data-suffix') || '';
          var counter = { val: 0 };
          gsap.fromTo(el, { scale: 0.8, opacity: 0 }, {
            scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)',
            onStart: function() {
              gsap.to(counter, {
                val: target, duration: 1.5, ease: 'power2.out',
                onUpdate: function() {
                  var num = isFloat ? counter.val.toFixed(1) : Math.round(counter.val);
                  el.innerHTML = num + '<span class="ct-trust-accent">' + suffix + '</span>';
                }
              });
            }
          });
        }
      });
    });

    // Remove data-animate so global handler skips
    document.querySelectorAll('.ct-trust-item').forEach(function(el) {
      el.removeAttribute('data-animate');
    });
  }

  // ═══════════════════════════════════════════════
  // GSAP — Location section animations
  // ═══════════════════════════════════════════════
  function initLocationAnimations() {
    gsap.from('.ct-location-label', {
      scrollTrigger: { trigger: '.ct-location', start: 'top 75%' },
      opacity: 0, y: 20, duration: 0.6
    });
    gsap.from('.ct-location-heading', {
      scrollTrigger: { trigger: '.ct-location', start: 'top 75%' },
      opacity: 0, filter: 'blur(12px)', duration: 1, delay: 0.2
    });
    gsap.from('.ct-map-wrapper', {
      scrollTrigger: { trigger: '.ct-location-grid', start: 'top 80%' },
      opacity: 0, y: 40, scale: 0.97, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.ct-office-block', {
      scrollTrigger: { trigger: '.ct-office-info', start: 'top 80%' },
      opacity: 0, x: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });

    // Remove data-animate so global handler skips
    document.querySelectorAll('.ct-location-label, .ct-location-heading, .ct-map-wrapper, .ct-office-info').forEach(function(el) {
      el.removeAttribute('data-animate');
    });
  }

  // ═══════════════════════════════════════════════
  // FORM SUBMISSION — Webflow-compatible
  // ═══════════════════════════════════════════════
  function initFormSubmission() {
    var form = document.querySelector('.ct-form');
    if (!form) return;

    var submitBtn = form.querySelector('.ct-form-submit');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // Gather field values
      var fields = form.querySelectorAll('input, select, textarea');
      var data = {};
      var hasEmpty = false;

      fields.forEach(function(field) {
        var name = field.getAttribute('name');
        if (!name) return;
        var val = field.value.trim();
        data[name] = val;
        if (name === 'name' || name === 'email') {
          if (!val) hasEmpty = true;
        }
      });

      // Basic validation
      if (hasEmpty) {
        submitBtn.textContent = 'Please fill required fields';
        submitBtn.style.background = '#c8222a';
        setTimeout(function() {
          submitBtn.textContent = 'Send Message';
          submitBtn.style.background = '';
        }, 2500);
        return;
      }

      // Submit via Webflow form endpoint (or use custom endpoint)
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // POST to Webflow form handler
      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      formData.append('form-name', 'contact');

      fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(function(response) {
        if (response.ok || response.status === 200 || response.status === 302) {
          // Success state
          submitBtn.textContent = 'Message Sent!';
          submitBtn.style.background = '#1a7a3a';
          fields.forEach(function(f) { f.value = ''; });
          gsap.from(submitBtn, { scale: 0.9, duration: 0.3, ease: 'back.out(2)' });
        } else {
          throw new Error('Submit failed');
        }
      }).catch(function() {
        // Fallback: mailto
        var subject = encodeURIComponent('Contact from ' + (data.name || 'Website'));
        var body = encodeURIComponent(
          'Name: ' + (data.name || '') + '\n' +
          'Email: ' + (data.email || '') + '\n' +
          'Phone: ' + (data.phone || '') + '\n' +
          'Address: ' + (data.address || '') + '\n' +
          'Service: ' + (data.service || '') + '\n\n' +
          'Message:\n' + (data.message || '')
        );
        window.location.href = 'mailto:construction@avorino.com?subject=' + subject + '&body=' + body;
        submitBtn.textContent = 'Opening Email...';
        setTimeout(function() {
          submitBtn.textContent = 'Send Message';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  }

  // ── Initialize everything ──
  initContactHero();
  initHeroAnimations();
  initTrustAnimations();
  initLocationAnimations();
  initFormSubmission();
  ScrollTrigger.refresh();

})();
