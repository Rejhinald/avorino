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
  // THREE.JS — Construction scaffolding wireframe
  // ═══════════════════════════════════════════════
  function initCareersHero() {
    var container = document.getElementById('cr-canvas') || document.querySelector('.cr-canvas-wrap');
    if (!container || typeof THREE === 'undefined') return;

    var w = container.offsetWidth, h = container.offsetHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(14, 10, 16);
    camera.lookAt(0, 3, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Materials
    var lineMat = new THREE.LineBasicMaterial({ color: 0xf0ede8, opacity: 0.15, transparent: true });
    var lineAccent = new THREE.LineBasicMaterial({ color: 0xc8222a, opacity: 0.3, transparent: true });
    var lineGold = new THREE.LineBasicMaterial({ color: 0xc9a96e, opacity: 0.2, transparent: true });
    var dimMat = new THREE.LineBasicMaterial({ color: 0xf0ede8, opacity: 0.05, transparent: true });
    var gridMat = new THREE.LineBasicMaterial({ color: 0xf0ede8, opacity: 0.03, transparent: true });

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

    // ── House under construction (partially framed) ──
    // Foundation slab
    makeLine([[0,0,0],[10,0,0],[10,0,8],[0,0,8],[0,0,0]], lineMat);

    // Wall studs - front wall
    for (var i = 0; i <= 10; i += 2) {
      makeLine([[i,0,0],[i,6,0]], lineMat);
    }
    // Wall studs - back wall
    for (var i = 0; i <= 10; i += 2) {
      makeLine([[i,0,8],[i,6,8]], lineMat);
    }
    // Wall studs - left
    makeLine([[0,0,0],[0,6,0]], lineMat);
    makeLine([[0,0,4],[0,6,4]], lineMat);
    makeLine([[0,0,8],[0,6,8]], lineMat);
    // Wall studs - right
    makeLine([[10,0,0],[10,6,0]], lineMat);
    makeLine([[10,0,4],[10,6,4]], lineMat);
    makeLine([[10,0,8],[10,6,8]], lineMat);

    // Top plates
    makeLine([[0,6,0],[10,6,0]], lineMat);
    makeLine([[0,6,8],[10,6,8]], lineMat);
    makeLine([[0,6,0],[0,6,8]], lineMat);
    makeLine([[10,6,0],[10,6,8]], lineMat);

    // Roof trusses (partially done — construction in progress)
    makeLine([[0,6,4],[0,9,4]], lineAccent);
    makeLine([[0,6,0],[0,9,4]], lineAccent);
    makeLine([[0,6,8],[0,9,4]], lineAccent);

    makeLine([[3,6,4],[3,9,4]], lineAccent);
    makeLine([[3,6,0],[3,9,4]], lineAccent);
    makeLine([[3,6,8],[3,9,4]], lineAccent);

    makeLine([[6,6,4],[6,9,4]], lineAccent);
    makeLine([[6,6,0],[6,9,4]], lineAccent);
    makeLine([[6,6,8],[6,9,4]], lineAccent);

    // Ridge beam (partial — only first 3 trusses connected)
    makeLine([[0,9,4],[6,9,4]], lineAccent);

    // Scaffolding (gold — team building!)
    // Left scaffold tower
    makeLine([[-1.5,0,1],[-1.5,8,1]], lineGold);
    makeLine([[-1.5,0,3],[-1.5,8,3]], lineGold);
    makeLine([[-1.5,2,1],[-1.5,2,3]], lineGold);
    makeLine([[-1.5,4,1],[-1.5,4,3]], lineGold);
    makeLine([[-1.5,6,1],[-1.5,6,3]], lineGold);
    makeLine([[-1.5,8,1],[-1.5,8,3]], lineGold);
    // Scaffold platform
    makeLine([[-1.5,6,1],[0,6,1]], lineGold);
    makeLine([[-1.5,6,3],[0,6,3]], lineGold);

    // Right scaffold tower
    makeLine([[11.5,0,2],[11.5,7,2]], lineGold);
    makeLine([[11.5,0,5],[11.5,7,5]], lineGold);
    makeLine([[11.5,2,2],[11.5,2,5]], lineGold);
    makeLine([[11.5,4,2],[11.5,4,5]], lineGold);
    makeLine([[11.5,6,2],[11.5,6,5]], lineGold);

    // Door opening
    makeLine([[4,0,0],[5.5,0,0],[5.5,4,0],[4,4,0],[4,0,0]], dimMat);
    // Window openings
    makeLine([[1,2,0],[3,2,0],[3,4.5,0],[1,4.5,0],[1,2,0]], dimMat);
    makeLine([[7,2,0],[9,2,0],[9,4.5,0],[7,4.5,0],[7,2,0]], dimMat);

    // Ground grid
    for (var g = -4; g <= 18; g += 2) {
      makeLine([[g,0,-4],[g,0,14]], gridMat);
      makeLine([[-4,0,g],[18,0,g]], gridMat);
    }

    // Slow orbit animation
    var time = 0;
    var animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      time += 0.002;
      camera.position.x = 14 * Math.cos(time * 0.25) + 5;
      camera.position.z = 16 * Math.sin(time * 0.25) + 4;
      camera.lookAt(5, 3, 4);
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
    gsap.from('.cr-hero-label', { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
    gsap.from('.cr-hero-heading', { opacity: 0, y: 40, duration: 1, delay: 0.5, ease: 'power3.out' });
    gsap.from('.cr-hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });

    // Right side: culture values entrance
    gsap.from('.cr-hero-right', { opacity: 0, x: 60, duration: 1, delay: 0.4, ease: 'power3.out' });
    gsap.from('.cr-value-item', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, delay: 0.7 });

    // Remove data-animate from hero elements
    document.querySelectorAll('.cr-hero-label, .cr-hero-heading, .cr-hero-sub, .cr-value-item').forEach(function(el) {
      el.removeAttribute('data-animate');
    });
  }

  // ═══════════════════════════════════════════════
  // GSAP — Positions accordion + animations
  // ═══════════════════════════════════════════════
  function initPositions() {
    // Slide-in animation
    gsap.from('.cr-pos-item', {
      scrollTrigger: { trigger: '.cr-positions, #cr-positions', start: 'top 75%' },
      opacity: 0, x: -30, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });

    // Accordion toggle
    document.querySelectorAll('.cr-pos-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var isActive = item.classList.contains('active');
        // Close all
        document.querySelectorAll('.cr-pos-item').forEach(function(i) {
          i.classList.remove('active');
          var d = i.querySelector('.cr-pos-desc');
          if (d) {
            d.style.opacity = '0';
            d.style.maxHeight = '0';
            d.style.overflow = 'hidden';
          }
          var a = i.querySelector('.cr-pos-arrow');
          if (a) {
            a.style.transform = '';
            a.style.opacity = '0.3';
          }
        });
        // Open clicked (if wasn't active)
        if (!isActive) {
          item.classList.add('active');
          var desc = item.querySelector('.cr-pos-desc');
          if (desc) {
            desc.style.opacity = '1';
            desc.style.maxHeight = '200px';
            desc.style.overflow = 'visible';
          }
          var arrow = item.querySelector('.cr-pos-arrow');
          if (arrow) {
            arrow.style.transform = 'rotate(90deg)';
            arrow.style.opacity = '0.7';
          }
        }
      });

      // Hover effects
      item.addEventListener('mouseenter', function() {
        item.style.paddingLeft = '16px';
        item.style.transition = 'padding-left 0.3s ease';
      });
      item.addEventListener('mouseleave', function() {
        item.style.paddingLeft = '0';
      });
    });

    // Initialize descriptions as hidden
    document.querySelectorAll('.cr-pos-desc').forEach(function(d) {
      d.style.opacity = '0';
      d.style.maxHeight = '0';
      d.style.overflow = 'hidden';
      d.style.transition = 'all 0.4s ease';
    });

    // Style arrows
    document.querySelectorAll('.cr-pos-arrow').forEach(function(a) {
      a.style.opacity = '0.3';
      a.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      a.style.flexShrink = '0';
      a.style.fontSize = '18px';
      a.style.color = '#f0ede8';
    });

    // Remove data-animate
    document.querySelectorAll('.cr-pos-item').forEach(function(el) {
      el.removeAttribute('data-animate');
    });
  }

  // ═══════════════════════════════════════════════
  // GSAP — Application form section
  // ═══════════════════════════════════════════════
  function initFormAnimations() {
    gsap.from('.cr-apply-left', {
      scrollTrigger: { trigger: '.cr-apply, #cr-apply', start: 'top 75%' },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.cr-form .av-form-group', {
      scrollTrigger: { trigger: '.cr-form', start: 'top 80%' },
      opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power3.out'
    });
    gsap.from('.cr-perk', {
      scrollTrigger: { trigger: '.cr-apply-perks', start: 'top 85%' },
      opacity: 0, x: -20, duration: 0.5, stagger: 0.1, ease: 'power3.out'
    });
  }

  // ═══════════════════════════════════════════════
  // GSAP — Stats counter animation
  // ═══════════════════════════════════════════════
  function initStats() {
    document.querySelectorAll('.cr-stat-value').forEach(function(el) {
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
                  el.innerHTML = num + '<span class="cr-stat-accent" style="color:#c8222a">' + suffix + '</span>';
                }
              });
            }
          });
        }
      });
    });

    // Remove data-animate
    document.querySelectorAll('.cr-stat-item').forEach(function(el) {
      el.removeAttribute('data-animate');
    });
  }

  // ═══════════════════════════════════════════════
  // FORM SUBMISSION — Webflow-compatible
  // ═══════════════════════════════════════════════
  function initFormSubmission() {
    var form = document.querySelector('.cr-form');
    if (!form) return;

    var submitBtn = form.querySelector('.av-submit-btn') || form.querySelector('button[type="submit"]') || form.querySelector('.cr-form-submit');
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
        submitBtn.style.color = '#f0ede8';
        setTimeout(function() {
          submitBtn.textContent = 'Submit Application';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 2500);
        return;
      }

      // Submit
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      formData.append('form-name', 'careers');

      fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(function(response) {
        if (response.ok || response.status === 200 || response.status === 302) {
          submitBtn.textContent = 'Application Sent!';
          submitBtn.style.background = '#1a7a3a';
          submitBtn.style.color = '#f0ede8';
          fields.forEach(function(f) { f.value = ''; });
          gsap.from(submitBtn, { scale: 0.9, duration: 0.3, ease: 'back.out(2)' });
        } else {
          throw new Error('Submit failed');
        }
      }).catch(function() {
        // Fallback: mailto
        var subject = encodeURIComponent('Career Application — ' + (data.name || 'Website'));
        var body = encodeURIComponent(
          'Name: ' + (data.name || '') + '\n' +
          'Email: ' + (data.email || '') + '\n' +
          'Phone: ' + (data.phone || '') + '\n' +
          'Position: ' + (data.position || '') + '\n' +
          'Experience: ' + (data.experience || '') + '\n\n' +
          'Message:\n' + (data.message || '')
        );
        window.location.href = 'mailto:construction@avorino.com?subject=' + subject + '&body=' + body;
        submitBtn.textContent = 'Opening Email...';
        setTimeout(function() {
          submitBtn.textContent = 'Submit Application';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  }

  // ── Initialize everything ──
  initCareersHero();
  initHeroAnimations();
  initPositions();
  initFormAnimations();
  initStats();
  initFormSubmission();
  ScrollTrigger.refresh();

})();
