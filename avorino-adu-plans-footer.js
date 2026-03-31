(function() {
  'use strict';

  if (window.__AVORINO_ADU_PLANS_RUNTIME__) return;
  window.__AVORINO_ADU_PLANS_RUNTIME__ = { version: 'inline-runtime-v3' };

  function initLenis() {
    if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;
    // Skip if avorino-animations.js already initialized Lenis
    if (document.documentElement.classList.contains('lenis-smooth')) return;
    try {
      var lenis = new window.Lenis({
        duration: 1.2,
        easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smooth: true,
        smoothTouch: false
      });
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
      window.ScrollTrigger.addEventListener('refresh', function() { lenis.resize(); });
    } catch (err) {
      console.warn('ADU plans Lenis init skipped:', err);
    }
  }

  function injectRuntimeStyles() {
    if (document.getElementById('adu-plans-runtime-overrides')) return;

    var style = document.createElement('style');
    style.id = 'adu-plans-runtime-overrides';
    style.textContent = [
      ':root{--adu-plans-dark:#111111;--adu-plans-cream:#f0ede8;--adu-plans-warm:#e8e4df;--adu-plans-gold:#c8a86e;--adu-plans-surface:#faf9f7;--adu-plans-surface-2:#ece6db;--adu-plans-text:#111111;}',
      'html,body{overflow-x:hidden !important;}',
      '#adu-plans-hero{position:relative;isolation:isolate;background:var(--adu-plans-dark);}',
      '#adu-plans-hero #hero-canvas{position:absolute;inset:0;z-index:1;pointer-events:none;}',
      '#adu-plans-hero-canvas{display:block;width:100% !important;height:100% !important;}',
      '[data-adu-plan-section]{position:relative;background:var(--adu-plans-cream);}',
      '[data-adu-plan-section="casielo"]{background:var(--adu-plans-warm);}',
      '[data-adu-plan-section] [data-adu-role="plan-layout"]{align-items:flex-start;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"],[data-adu-plan-section] [data-adu-role="plan-panel"]{will-change:transform,opacity;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"] iframe{display:block;width:100% !important;background:var(--adu-plans-surface) !important;}',
      '[data-adu-gallery-hero],[data-adu-main-image]{cursor:zoom-in;}',
      '[data-adu-main-image]{display:block;width:100% !important;height:100% !important;object-fit:cover;}',
      '[data-adu-thumbs]{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px !important;}',
      '[data-adu-thumb]{cursor:pointer;transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease,opacity .35s ease;transform:translateY(0);}',
      '[data-adu-thumb]:hover{transform:translateY(-2px);border-color:rgba(200,168,110,.45) !important;}',
      '[data-adu-thumb].is-active{transform:translateY(-2px);border-color:rgba(200,168,110,.6) !important;box-shadow:0 18px 40px rgba(17,17,17,.12);}',
      '#adu-plans-lightbox{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;}',
      '#adu-plans-lightbox.is-active{display:flex;}',
      '#adu-plans-lightbox .adu-plans-lightbox-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.92);}',
      '#adu-plans-lightbox .adu-plans-lightbox-content{position:relative;z-index:1;max-width:92vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:14px;}',
      '#adu-plans-lightbox img{display:block;max-width:92vw;max-height:82vh;object-fit:contain;border-radius:12px;box-shadow:0 32px 80px rgba(0,0,0,.45);}',
      '#adu-plans-lightbox .adu-plans-lightbox-caption{font:500 14px/1.6 "DM Sans",system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:rgba(240,237,232,.72);text-align:center;}',
      '#adu-plans-lightbox .adu-plans-lightbox-counter{font:500 12px/1 "DM Sans",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(240,237,232,.46);}',
      '#adu-plans-lightbox .adu-plans-lightbox-btn{position:absolute;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border:1px solid rgba(240,237,232,.14);border-radius:999px;background:rgba(17,17,17,.58);color:var(--adu-plans-cream);cursor:pointer;transition:background-color .25s ease,border-color .25s ease,transform .25s ease;}',
      '#adu-plans-lightbox .adu-plans-lightbox-btn:hover{background:rgba(40,40,40,.82);border-color:rgba(240,237,232,.28);transform:translateY(-1px);}',
      '#adu-plans-lightbox .adu-plans-lightbox-close{top:16px;right:16px;font-size:24px;z-index:2;}',
      '#adu-plans-lightbox .adu-plans-lightbox-prev{left:20px;top:50%;transform:translateY(-50%);font-size:24px;}',
      '#adu-plans-lightbox .adu-plans-lightbox-next{right:20px;top:50%;transform:translateY(-50%);font-size:24px;}',
      '#adu-plans-lightbox .adu-plans-lightbox-prev:hover,#adu-plans-lightbox .adu-plans-lightbox-next:hover{transform:translateY(calc(-50% - 1px));}',
      '@media (max-width: 991px){',
      '  #adu-plans-hero{padding:120px 24px 56px !important;min-height:72vh !important;}',
      '  #adu-plans-hero h1{font-size:clamp(48px,11vw,64px) !important;max-width:10ch !important;}',
      '  #adu-plans-hero p{max-width:540px !important;}',
      '  [data-adu-plan-section]{padding:88px 24px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-layout"]{display:flex !important;flex-direction:column !important;gap:36px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"],[data-adu-plan-section] [data-adu-role="plan-panel"]{width:100% !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:520px !important;height:520px !important;}',
      '  [data-adu-plan-section] [data-adu-main-image]{height:420px !important;}',
      '}',
      '@media (max-width: 767px){',
      '  #adu-plans-hero{padding:104px 16px 44px !important;min-height:66vh !important;}',
      '  #adu-plans-hero h1{font-size:clamp(40px,13vw,52px) !important;line-height:1.02 !important;}',
      '  #adu-plans-hero p{font-size:16px !important;line-height:1.7 !important;max-width:none !important;}',
      '  [data-adu-plan-section]{padding:72px 16px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:400px !important;height:400px !important;}',
      '  [data-adu-plan-section] [data-adu-main-image]{height:280px !important;}',
      '  [data-adu-plan-section] h2{font-size:clamp(32px,10vw,44px) !important;line-height:1.04 !important;}',
      '  [data-adu-plan-section] p{font-size:15px !important;line-height:1.7 !important;}',
      '  [data-adu-thumbs]{gap:10px !important;}',
      '  [data-adu-thumb]{min-height:96px !important;}',
      '  #adu-plans-lightbox .adu-plans-lightbox-btn{width:42px;height:42px;}',
      '  #adu-plans-lightbox .adu-plans-lightbox-prev{left:12px;}',
      '  #adu-plans-lightbox .adu-plans-lightbox-next{right:12px;}',
      '}',
      '@media (prefers-reduced-motion: reduce){',
      '  [data-adu-thumb],#adu-plans-lightbox .adu-plans-lightbox-btn{transition:none !important;}',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }

  function initHeroWireframe() {
    if (!window.THREE) return;

    var canvas = document.getElementById('adu-plans-hero-canvas');
    if (!canvas || canvas.dataset.bound === '1') return;
    canvas.dataset.bound = '1';

    var THREE = window.THREE;
    var isMobile = window.innerWidth < 768;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !isMobile, alpha: true });
    renderer.setClearColor(0x111111, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
    camera.position.set(18, 14, 22);
    camera.lookAt(0, 0, 0);

    /* ── Materials ── */
    var goldColor = 0xc8a86e;
    var accentColor = 0xc8222a;
    var wallMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.7 });
    var partMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.45 });
    var gridMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.08 });
    var dimMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.2 });
    var doorMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.55 });
    var fillMat = new THREE.MeshBasicMaterial({ color: goldColor, transparent: true, opacity: 0.03, side: THREE.DoubleSide });

    var gridGroup = new THREE.Group();
    var planGroup = new THREE.Group();

    function addLine(group, x1, z1, x2, z2, material, y) {
      var yy = y || 0;
      var geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, yy, z1),
        new THREE.Vector3(x2, yy, z2)
      ]);
      group.add(new THREE.Line(geometry, material));
    }

    function addRect(group, x1, z1, x2, z2, material) {
      addLine(group, x1, z1, x2, z1, material);
      addLine(group, x2, z1, x2, z2, material);
      addLine(group, x2, z2, x1, z2, material);
      addLine(group, x1, z2, x1, z1, material);
    }

    function addFloor(group, x1, z1, x2, z2) {
      var shape = new THREE.Shape();
      shape.moveTo(x1, z1);
      shape.lineTo(x2, z1);
      shape.lineTo(x2, z2);
      shape.lineTo(x1, z2);
      shape.closePath();
      var geo = new THREE.ShapeGeometry(shape);
      geo.rotateX(-Math.PI / 2);
      group.add(new THREE.Mesh(geo, fillMat));
    }

    function addDoorArc(group, cx, cz, radius, startAngle, endAngle) {
      var pts = [];
      for (var i = 0; i <= 16; i++) {
        var a = startAngle + (endAngle - startAngle) * (i / 16);
        pts.push(new THREE.Vector3(cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), doorMat));
    }

    /* ── Blueprint grid ── */
    var gridSize = 20;
    for (var g = -gridSize; g <= gridSize; g += 2) {
      addLine(gridGroup, -gridSize, g, gridSize, g, gridMat);
      addLine(gridGroup, g, -gridSize, g, gridSize, gridMat);
    }

    /* ── Bellecielo floor plan (830 sqft, 2bed/2bath) ── */
    /* Exterior walls — main rectangle */
    var W = 13.5, D = 7;
    var x0 = -W / 2, x1 = W / 2, z0 = -D / 2, z1 = D / 2;
    addRect(planGroup, x0, z0, x1, z1, wallMat);
    addFloor(planGroup, x0, z0, x1, z1);

    /* Interior partitions */
    /* Bedroom 1 (left) */
    addLine(planGroup, x0 + 4.5, z0, x0 + 4.5, z1, partMat);
    /* Bedroom 2 (right) */
    addLine(planGroup, x1 - 4.5, z0, x1 - 4.5, z1, partMat);
    /* Bathrooms (inset from bedrooms) */
    addLine(planGroup, x0 + 4.5, z0 + 3, x0 + 2, z0 + 3, partMat);
    addLine(planGroup, x0 + 2, z0, x0 + 2, z0 + 3, partMat);
    addLine(planGroup, x1 - 4.5, z0 + 3, x1 - 2, z0 + 3, partMat);
    addLine(planGroup, x1 - 2, z0, x1 - 2, z0 + 3, partMat);
    /* Kitchen peninsula */
    addLine(planGroup, x0 + 4.5, z1 - 2.2, x0 + 6.5, z1 - 2.2, partMat);

    /* Door swing arcs */
    addDoorArc(planGroup, x0 + 4.5, z0 + 4.2, 1.5, 0, Math.PI / 2);
    addDoorArc(planGroup, x1 - 4.5, z0 + 4.2, 1.5, Math.PI / 2, Math.PI);
    addDoorArc(planGroup, x0 + 2.8, z0 + 3, 1.2, -Math.PI / 2, 0);
    addDoorArc(planGroup, x1 - 2.8, z0 + 3, 1.2, Math.PI, Math.PI * 1.5);
    /* Front door */
    addDoorArc(planGroup, 0, z1, 1.5, Math.PI, Math.PI * 1.5);

    /* Window markers (small ticks on exterior walls) */
    var wt = 0.35;
    /* Left bedroom windows */
    addLine(planGroup, x0, z0 + 2, x0 - wt, z0 + 2, dimMat);
    addLine(planGroup, x0, z0 + 4, x0 - wt, z0 + 4, dimMat);
    addLine(planGroup, x0 - wt, z0 + 2, x0 - wt, z0 + 4, dimMat);
    /* Right bedroom windows */
    addLine(planGroup, x1, z0 + 2, x1 + wt, z0 + 2, dimMat);
    addLine(planGroup, x1, z0 + 4, x1 + wt, z0 + 4, dimMat);
    addLine(planGroup, x1 + wt, z0 + 2, x1 + wt, z0 + 4, dimMat);
    /* Living room window (front) */
    addLine(planGroup, -2, z1, -2, z1 + wt, dimMat);
    addLine(planGroup, 2, z1, 2, z1 + wt, dimMat);
    addLine(planGroup, -2, z1 + wt, 2, z1 + wt, dimMat);

    /* ── Dimension lines ── */
    var dOff = 1.2;
    /* Width dimension */
    addLine(planGroup, x0, z0 - dOff, x1, z0 - dOff, dimMat);
    addLine(planGroup, x0, z0 - dOff + 0.2, x0, z0 - dOff - 0.2, dimMat);
    addLine(planGroup, x1, z0 - dOff + 0.2, x1, z0 - dOff - 0.2, dimMat);
    /* Depth dimension */
    addLine(planGroup, x0 - dOff, z0, x0 - dOff, z1, dimMat);
    addLine(planGroup, x0 - dOff + 0.2, z0, x0 - dOff - 0.2, z0, dimMat);
    addLine(planGroup, x0 - dOff + 0.2, z1, x0 - dOff - 0.2, z1, dimMat);

    /* ── Second plan ghost (Casielo, offset) ── */
    var g2 = new THREE.Group();
    var ghostWall = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.18 });
    var ghostPart = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.1 });
    addRect(g2, 9, 5.5, 9, -5, ghostWall);
    addLine(g2, 9 - 4.5, -5 - 2.75, 9 - 4.5, -5 + 2.75, ghostPart);
    addLine(g2, 9 - 4.5, -5 + 1.5, 9 - 2, -5 + 1.5, ghostPart);
    planGroup.add(g2);

    /* ── Third plan ghost (Elega, offset other side) ── */
    var g3 = new THREE.Group();
    addRect(g3, 8, 5, -9, 5, ghostWall);
    addLine(g3, -9 - 4, 5 - 2.5, -9 - 4, 5 + 2.5, ghostPart);
    addLine(g3, -9, 5 + 1.2, -9 + 2.5, 5 + 1.2, ghostPart);
    planGroup.add(g3);

    gridGroup.rotation.y = -0.3;
    planGroup.rotation.y = -0.3;
    scene.add(gridGroup);
    scene.add(planGroup);

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    var pointLight = new THREE.PointLight(0xffeedd, 0.6, 80);
    pointLight.position.set(8, 12, 8);
    scene.add(pointLight);

    /* ── Mouse interaction ── */
    var mouseX = 0, mouseY = 0;
    if (!isMobile) {
      document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    function resize() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize);

    var heroVisible = true;
    if (window.IntersectionObserver) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          heroVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    var time = 0;
    function animate() {
      requestAnimationFrame(animate);
      if (!heroVisible) return;
      time += 0.008;
      /* Slow rotation + mouse influence */
      var targetY = -0.3 + time * 0.15 + mouseX * 0.3;
      planGroup.rotation.y += (targetY - planGroup.rotation.y) * 0.02;
      gridGroup.rotation.y += (targetY * 0.4 - gridGroup.rotation.y) * 0.015;
      /* Gentle camera bob */
      camera.position.y = 14 + Math.sin(time * 0.5) * 0.4 + mouseY * -1.5;
      camera.lookAt(0, 0, 0);
      resize();
      renderer.render(scene, camera);
    }

    animate();
  }

  function normalizeRoomName(roomName) {
    if (!roomName) return '';
    var room = String(roomName).trim();
    if (room === 'Living') return 'Living Room';
    if (room === 'Bath') return 'Bathroom';
    return room;
  }

  function findThumb(section, roomName) {
    var normalized = normalizeRoomName(roomName);
    var thumbs = Array.prototype.slice.call(section.querySelectorAll('[data-adu-thumb]'));
    var thumb = thumbs.find(function(node) {
      return node.getAttribute('data-adu-thumb') === normalized;
    });
    if (!thumb && /^Bedroom\b/.test(normalized)) {
      thumb = thumbs.find(function(node) { return node.getAttribute('data-adu-thumb') === 'Bedroom'; });
    }
    if (!thumb && /^Bathroom\b/.test(normalized)) {
      thumb = thumbs.find(function(node) { return node.getAttribute('data-adu-thumb') === 'Bathroom'; });
    }
    return thumb || null;
  }

  function setActiveThumbs(section, activeName) {
    Array.prototype.slice.call(section.querySelectorAll('[data-adu-thumb]')).forEach(function(button) {
      if (button.getAttribute('data-adu-thumb') === activeName) button.classList.add('is-active');
      else button.classList.remove('is-active');
    });
  }

  function selectRoom(planKey, roomName) {
    var section = document.querySelector('[data-adu-plan-section="' + planKey + '"]');
    if (!section) return;

    var image = section.querySelector('[data-adu-main-image]');
    var normalized = normalizeRoomName(roomName);
    if (!normalized || normalized === 'Overview') {
      if (image) {
        section.setAttribute('data-adu-current-room', 'Overview');
        image.setAttribute('data-adu-current-room', 'Overview');
      }
      setActiveThumbs(section, '__none__');
      return;
    }

    var thumb = findThumb(section, normalized);
    if (!thumb) return;

    var thumbImage = thumb.querySelector('img');
    if (image && thumbImage && thumbImage.getAttribute('src')) {
      image.setAttribute('src', thumbImage.getAttribute('src'));
      image.setAttribute('alt', normalized);
      image.setAttribute('data-adu-current-room', normalized);
      section.setAttribute('data-adu-current-room', normalized);
    }

    setActiveThumbs(section, thumb.getAttribute('data-adu-thumb'));
  }

  function ensureLightbox() {
    if (window.__AVORINO_ADU_PLANS_LIGHTBOX__) return window.__AVORINO_ADU_PLANS_LIGHTBOX__;

    var root = document.createElement('div');
    root.id = 'adu-plans-lightbox';
    root.innerHTML = [
      '<div class="adu-plans-lightbox-backdrop"></div>',
      '<button class="adu-plans-lightbox-btn adu-plans-lightbox-close" type="button" aria-label="Close">&times;</button>',
      '<button class="adu-plans-lightbox-btn adu-plans-lightbox-prev" type="button" aria-label="Previous">&#8249;</button>',
      '<button class="adu-plans-lightbox-btn adu-plans-lightbox-next" type="button" aria-label="Next">&#8250;</button>',
      '<div class="adu-plans-lightbox-content">',
      '  <img alt="">',
      '  <div class="adu-plans-lightbox-caption"></div>',
      '  <div class="adu-plans-lightbox-counter"></div>',
      '</div>'
    ].join('');
    document.body.appendChild(root);

    var image = root.querySelector('img');
    var caption = root.querySelector('.adu-plans-lightbox-caption');
    var counter = root.querySelector('.adu-plans-lightbox-counter');
    var closeBtn = root.querySelector('.adu-plans-lightbox-close');
    var prevBtn = root.querySelector('.adu-plans-lightbox-prev');
    var nextBtn = root.querySelector('.adu-plans-lightbox-next');
    var backdrop = root.querySelector('.adu-plans-lightbox-backdrop');

    var api = {
      root: root,
      image: image,
      caption: caption,
      counter: counter,
      items: [],
      index: 0,
      render: function() {
        if (!api.items.length) return;
        var current = api.items[api.index];
        image.setAttribute('src', current.src);
        image.setAttribute('alt', current.alt || '');
        caption.textContent = current.caption || current.alt || '';
        counter.textContent = (api.index + 1) + ' / ' + api.items.length;
        prevBtn.style.display = api.items.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = api.items.length > 1 ? 'flex' : 'none';
      },
      open: function(items, startIndex) {
        api.items = items || [];
        api.index = Math.max(0, Math.min(startIndex || 0, api.items.length - 1));
        api.render();
        root.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      },
      close: function() {
        root.classList.remove('is-active');
        document.body.style.overflow = '';
      },
      next: function(step) {
        if (!api.items.length) return;
        api.index = (api.index + step + api.items.length) % api.items.length;
        api.render();
      }
    };

    closeBtn.addEventListener('click', api.close);
    backdrop.addEventListener('click', api.close);
    prevBtn.addEventListener('click', function() { api.next(-1); });
    nextBtn.addEventListener('click', function() { api.next(1); });
    document.addEventListener('keydown', function(event) {
      if (!root.classList.contains('is-active')) return;
      if (event.key === 'Escape') api.close();
      if (event.key === 'ArrowLeft') api.next(-1);
      if (event.key === 'ArrowRight') api.next(1);
    });

    window.__AVORINO_ADU_PLANS_LIGHTBOX__ = api;
    return api;
  }

  function collectGalleryItems(section) {
    var items = [];
    var seen = new Set();

    function pushItem(src, alt) {
      if (!src || seen.has(src)) return;
      seen.add(src);
      items.push({
        src: src,
        alt: alt || '',
        caption: alt || ''
      });
    }

    var mainImage = section.querySelector('[data-adu-main-image]');
    if (mainImage) pushItem(mainImage.getAttribute('src'), mainImage.getAttribute('alt'));

    Array.prototype.slice.call(section.querySelectorAll('[data-adu-thumb] img')).forEach(function(img) {
      pushItem(img.getAttribute('src'), img.getAttribute('alt'));
    });

    return items;
  }

  function openSectionLightbox(section) {
    var lightbox = ensureLightbox();
    var items = collectGalleryItems(section);
    if (!items.length) return;

    var mainImage = section.querySelector('[data-adu-main-image]');
    var currentSrc = mainImage ? mainImage.getAttribute('src') : '';
    var startIndex = items.findIndex(function(item) { return item.src === currentSrc; });
    lightbox.open(items, startIndex >= 0 ? startIndex : 0);
  }

  function bindGalleryLightbox(section) {
    var mainImage = section.querySelector('[data-adu-main-image]');
    var heroWrap = section.querySelector('[data-adu-gallery-hero]');
    var clickTarget = heroWrap || mainImage;
    if (!clickTarget || clickTarget.dataset.lightboxBound === '1') return;

    clickTarget.dataset.lightboxBound = '1';
    clickTarget.addEventListener('click', function() {
      openSectionLightbox(section);
    });
  }

  function initPlanSections() {
    Array.prototype.slice.call(document.querySelectorAll('[data-adu-plan-section]')).forEach(function(section) {
      var planKey = section.getAttribute('data-adu-plan-section');
      var mainImage = section.querySelector('[data-adu-main-image]');
      if (mainImage && !mainImage.getAttribute('data-adu-current-room')) {
        mainImage.setAttribute('data-adu-current-room', 'Overview');
      }
      section.setAttribute('data-adu-current-room', 'Overview');

      Array.prototype.slice.call(section.querySelectorAll('[data-adu-thumb]')).forEach(function(button) {
        if (button.dataset.bound === '1') return;
        button.dataset.bound = '1';
        button.addEventListener('click', function() {
          selectRoom(planKey, button.getAttribute('data-adu-thumb'));
        });
      });

      bindGalleryLightbox(section);
      setActiveThumbs(section, '__none__');
    });
  }

  function initMessaging() {
    window.addEventListener('message', function(event) {
      var data = event && event.data;
      if (!data || data.type !== 'adu-plan-room-select' || !data.plan || !data.room) return;
      selectRoom(data.plan, data.room);

      // Open lightbox using the page's own thumb images (not the relative path from the iframe)
      var section = document.querySelector('[data-adu-plan-section="' + data.plan + '"]');
      if (section) {
        openSectionLightbox(section);
      }
    });
  }

  function splitIntoChars(el) {
    var text = el.textContent || '';
    el.textContent = '';
    el.style.opacity = '1';
    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === '\n') {
        el.appendChild(document.createElement('br'));
        continue;
      }
      var span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      el.appendChild(span);
      chars.push(span);
    }
    return chars;
  }

  function initHeroTextAnimations() {
    var hero = document.getElementById('adu-plans-hero');
    if (!hero || !window.gsap) return;

    var gsap = window.gsap;
    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('[class*="gold-line"]');
    var label = hero.querySelector('[class*="label"]');
    var subtitle = hero.querySelector('p');
    var scrollHint = hero.querySelector('[class*="scroll-hint"]');
    var scrollLine = hero.querySelector('[class*="scroll-line"]');

    /* Remove data-animate so avorino-animations.js doesn't double-animate */
    [h1, label, subtitle, scrollHint].forEach(function(el) {
      if (el) el.removeAttribute('data-animate');
    });

    /* Timed entrance sequence matching service pages */
    if (label) {
      gsap.fromTo(label, { opacity: 0, y: 20 }, { opacity: 0.45, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    }

    if (h1) {
      var chars = splitIntoChars(h1);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, { yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.025, ease: 'elastic.out(1, 0.6)', delay: 0.4 });
    }

    if (goldLine) {
      gsap.fromTo(goldLine, { width: 0 }, { width: '80px', duration: 1.2, delay: 1.0, ease: 'power3.out' });
    }

    if (subtitle) {
      gsap.fromTo(subtitle, { opacity: 0, filter: 'blur(4px)' }, { opacity: 0.55, filter: 'blur(0px)', duration: 1.0, delay: 1.3, ease: 'power3.out' });
    }

    if (scrollHint) {
      gsap.fromTo(scrollHint, { opacity: 0 }, { opacity: 0.5, duration: 0.8, delay: 2.0, ease: 'power2.out' });
    }

    if (scrollLine) {
      gsap.fromTo(scrollLine,
        { scaleY: 0.25, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }
  }

  function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    var hero = document.getElementById('adu-plans-hero');
    var heroCanvas = document.getElementById('adu-plans-hero-canvas');

    /* Hero content parallax on scroll */
    if (hero) {
      var heroContent = hero.querySelectorAll('h1, p, [class*="label"], [class*="gold-line"], [class*="scroll-hint"]');
      if (heroContent.length) {
        gsap.to(heroContent, {
          y: -72,
          opacity: 0,
          ease: 'none',
          stagger: 0.03,
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65
          }
        });
      }
    }

    if (hero && heroCanvas) {
      gsap.to(heroCanvas, {
        yPercent: -6,
        scale: 1.04,
        transformOrigin: '50% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-adu-plan-section]')).forEach(function(section) {
      var stage = section.querySelector('[data-adu-role="plan-stage"]');
      var panel = section.querySelector('[data-adu-role="plan-panel"]');
      var copyItems = section.querySelectorAll('[data-adu-animate="section-copy"]');
      var gallery = section.querySelector('[data-adu-animate="section-gallery"]');
      var thumbs = section.querySelectorAll('[data-adu-thumb]');
      var mainImage = section.querySelector('[data-adu-main-image]');

      if (stage) {
        gsap.from(stage, {
          opacity: 0,
          x: -36,
          y: 20,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%'
          }
        });
      }

      if (panel) {
        gsap.from(panel, {
          opacity: 0,
          x: 36,
          y: 20,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%'
          }
        });
      }

      if (copyItems.length) {
        gsap.from(copyItems, {
          opacity: 0,
          y: 22,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%'
          }
        });
      }

      if (gallery) {
        gsap.from(gallery, {
          opacity: 0,
          y: 26,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%'
          }
        });
      }

      if (thumbs.length) {
        gsap.from(thumbs, {
          opacity: 0,
          y: 16,
          duration: 0.55,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 68%'
          }
        });
      }

      if (mainImage) {
        gsap.from(mainImage, {
          opacity: 0.35,
          scale: 1.06,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mainImage,
            start: 'top 88%'
          }
        });
      }

      if (window.innerWidth > 991) {
        if (stage) {
          gsap.to(stage, {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9
            }
          });
        }

        if (panel) {
          gsap.to(panel, {
            yPercent: -2.5,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9
            }
          });
        }

        if (mainImage) {
          gsap.to(mainImage, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });
        }
      }
    });

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        ScrollTrigger.refresh();
      });
    });

    if (document.readyState !== 'complete') {
      window.addEventListener('load', function() { ScrollTrigger.refresh(); }, { once: true });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() { ScrollTrigger.refresh(); });
    }
  }

  function init() {
    initLenis();
    injectRuntimeStyles();
    initHeroWireframe();
    initHeroTextAnimations();
    initPlanSections();
    initMessaging();
    initAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
