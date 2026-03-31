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

      /* Hero */
      '#adu-plans-hero{position:relative;isolation:isolate;background:var(--adu-plans-dark);}',
      '#adu-plans-hero #hero-canvas{position:absolute;inset:0;z-index:1;pointer-events:none;}',
      '#adu-plans-hero-canvas{display:block;width:100% !important;height:100% !important;}',
      '#adu-plans-hero [class*="scroll-hint"] span,#adu-plans-hero [class*="scroll"] > span{font-family:"DM Sans",system-ui,sans-serif !important;font-size:11px !important;letter-spacing:0.25em !important;text-transform:uppercase !important;color:rgba(200,168,110,0.55) !important;}',

      /* 100vh scroll-locked stage */
      '#adu-plans-stage{position:relative;width:100%;height:100vh;overflow:hidden;}',
      '.adu-plans-viewport{position:relative;width:100%;height:100%;overflow:hidden;}',

      /* Plan sections as slides */
      '[data-adu-plan-section]{background:var(--adu-plans-cream);padding:48px 64px 80px !important;display:flex !important;align-items:center !important;justify-content:center !important;}',
      '[data-adu-plan-section="casielo"]{background:var(--adu-plans-warm);}',
      '[data-adu-plan-section] [data-adu-role="plan-layout"]{align-items:center;height:100%;max-width:1440px;margin:0 auto;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"]{width:58% !important;flex-shrink:0;will-change:transform,opacity;}',
      '[data-adu-plan-section] [data-adu-role="plan-panel"]{width:42% !important;will-change:transform,opacity;overflow-y:auto;max-height:calc(100vh - 160px);}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"] iframe{display:block;width:100% !important;height:calc(100vh - 200px) !important;min-height:500px !important;background:var(--adu-plans-surface) !important;}',

      /* Alternate layout for Casielo (flip columns) */
      '[data-adu-plan-section="casielo"] [data-adu-role="plan-layout"]{flex-direction:row-reverse !important;}',

      /* Gallery images — show statically */
      '[data-adu-gallery-hero]{pointer-events:none;}',
      '[data-adu-main-image]{display:block;width:100% !important;height:100% !important;object-fit:cover;cursor:default !important;}',
      '[data-adu-thumbs]{display:grid !important;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px !important;}',
      '[data-adu-thumb]{cursor:default !important;border:1px solid rgba(200,168,110,0.12);border-radius:6px;overflow:hidden;}',
      '[data-adu-thumb]:hover{transform:none !important;}',
      '[data-adu-thumb] img{display:block;width:100%;height:100%;object-fit:cover;}',

      /* Horizontal progress bar */
      '.adu-plans-bar{position:absolute;bottom:24px;left:64px;right:64px;display:flex;align-items:center;justify-content:space-between;height:36px;z-index:10;}',
      '.adu-plans-bar-track{position:absolute;top:50%;left:0;right:0;height:3px;background:rgba(17,17,17,0.08);transform:translateY(-50%);}',
      '.adu-plans-bar-fill{position:absolute;top:50%;left:0;right:0;height:3px;background:#c8222a;opacity:0.55;transform:translateY(-50%) scaleX(0);transform-origin:left center;transition:transform .45s ease;}',
      '.adu-plans-bar-dot{position:relative;width:12px;height:12px;border-radius:50%;border:1.5px solid rgba(17,17,17,0.12);background:var(--adu-plans-cream);z-index:1;cursor:pointer;transition:background .4s ease,border-color .4s ease,box-shadow .4s ease;}',
      '.adu-plans-bar-dot.is-active{background:#c8222a;border-color:#c8222a;box-shadow:0 0 0 4px rgba(200,34,42,0.12);}',
      '.adu-plans-bar-dot span{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);font:500 11px/1 "DM Sans",system-ui,sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:rgba(17,17,17,0.35);white-space:nowrap;transition:opacity .3s ease,color .3s ease;}',
      '.adu-plans-bar-dot.is-active span{opacity:1;color:rgba(17,17,17,0.65);}',

      /* Navigation arrows */
      '.adu-plans-nav-arrow{position:absolute;top:50%;z-index:10;width:48px;height:48px;border-radius:50%;border:1px solid rgba(17,17,17,0.1);background:rgba(255,255,255,0.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;color:var(--adu-plans-dark);transition:background .3s ease,border-color .3s ease,transform .3s ease;}',
      '.adu-plans-nav-arrow:hover{background:rgba(255,255,255,0.95);border-color:rgba(17,17,17,0.2);transform:translateY(-50%) scale(1.06);}',
      '.adu-plans-nav-arrow--prev{left:20px;transform:translateY(-50%);}',
      '.adu-plans-nav-arrow--next{right:20px;transform:translateY(-50%);}',
      '.adu-plans-nav-arrow.is-hidden{opacity:0;pointer-events:none;}',

      /* Lightbox (still functional from room clicks) */
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

      /* Responsive */
      '@media (max-width: 991px){',
      '  #adu-plans-hero{padding:120px 24px 56px !important;min-height:72vh !important;}',
      '  #adu-plans-hero h1{font-size:clamp(48px,11vw,64px) !important;max-width:10ch !important;}',
      '  #adu-plans-hero p{max-width:540px !important;}',
      '  [data-adu-plan-section]{padding:24px 24px 64px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-layout"]{display:flex !important;flex-direction:column !important;gap:20px !important;}',
      '  [data-adu-plan-section="casielo"] [data-adu-role="plan-layout"]{flex-direction:column !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"],[data-adu-plan-section] [data-adu-role="plan-panel"]{width:100% !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-panel"]{max-height:none !important;overflow-y:visible !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:42vh !important;height:42vh !important;}',
      '  .adu-plans-bar{left:24px;right:24px;bottom:12px;}',
      '  .adu-plans-bar-dot span{font-size:9px;bottom:calc(100% + 6px);}',
      '  .adu-plans-nav-arrow{width:38px;height:38px;font-size:16px;}',
      '  .adu-plans-nav-arrow--prev{left:12px;}',
      '  .adu-plans-nav-arrow--next{right:12px;}',
      '  [data-adu-gallery-hero]{display:none !important;}',
      '  [data-adu-thumbs]{display:none !important;}',
      '}',
      '@media (max-width: 767px){',
      '  #adu-plans-hero{padding:104px 16px 44px !important;min-height:66vh !important;}',
      '  #adu-plans-hero h1{font-size:clamp(40px,13vw,52px) !important;line-height:1.02 !important;}',
      '  #adu-plans-hero p{font-size:16px !important;line-height:1.7 !important;max-width:none !important;}',
      '  [data-adu-plan-section]{padding:16px 16px 56px !important;overflow-y:auto !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:36vh !important;height:36vh !important;}',
      '  [data-adu-plan-section] h2{font-size:clamp(28px,8vw,36px) !important;line-height:1.08 !important;}',
      '  [data-adu-plan-section] p{font-size:14px !important;line-height:1.65 !important;}',
      '  .adu-plans-bar{left:16px;right:16px;bottom:8px;}',
      '  .adu-plans-bar-dot span{font-size:8px;}',
      '  .adu-plans-nav-arrow{width:32px;height:32px;font-size:14px;}',
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
    camera.position.set(0, 45, 0.01);
    camera.lookAt(0, 0, 0);

    /* ── Materials ── */
    var goldColor = 0xc8a86e;
    var wallMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.72 });
    var partMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.38 });
    var gridMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.06 });
    var dimMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.18 });
    var doorMat = new THREE.LineBasicMaterial({ color: 0xc8222a, transparent: true, opacity: 0.5 });
    var winMat = new THREE.LineBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.35 });
    var fillMat = new THREE.MeshBasicMaterial({ color: goldColor, transparent: true, opacity: 0.025, side: THREE.DoubleSide });
    var roomFill1 = new THREE.MeshBasicMaterial({ color: 0xc8a86e, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    var roomFill2 = new THREE.MeshBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.035, side: THREE.DoubleSide });

    var gridGroup = new THREE.Group();
    var planGroup = new THREE.Group();

    function addLine(group, x1, z1, x2, z2, material) {
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, 0, z1), new THREE.Vector3(x2, 0, z2)
      ]), material));
    }

    function addFloor(group, pts, mat) {
      var shape = new THREE.Shape();
      shape.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
      shape.closePath();
      var geo = new THREE.ShapeGeometry(shape);
      geo.rotateX(-Math.PI / 2);
      group.add(new THREE.Mesh(geo, mat || fillMat));
    }

    function addArc(group, cx, cz, r, a0, a1, mat) {
      var pts = [];
      for (var i = 0; i <= 20; i++) {
        var a = a0 + (a1 - a0) * (i / 20);
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat || doorMat));
    }

    function addWindowMark(group, x1, z1, x2, z2) {
      addLine(group, x1, z1, x2, z2, winMat);
      var mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
      var dx = x2 - x1, dz = z2 - z1;
      var len = Math.sqrt(dx * dx + dz * dz);
      var nx = -dz / len * 0.3, nz = dx / len * 0.3;
      addLine(group, mx - nx, mz - nz, mx + nx, mz + nz, winMat);
    }

    /* ── Blueprint grid ── */
    for (var g = -24; g <= 24; g += 2) {
      addLine(gridGroup, -24, g, 24, g, gridMat);
      addLine(gridGroup, g, -24, g, 24, gridMat);
    }

    /* ═════════════════════════════════════════════
       BELLECIELO — Actual floor plan from preview
       Coordinates from blueprint data, scaled 0.45x, centered
       ═════════════════════════════════════════════ */
    var S = 0.45;
    var cx = -1.75 * S, cz = -4.25 * S;

    /* Corner lookup (id → [x, z] in scene coords) */
    var C = {
      c1:  [(-22)*S-cx, (-13.5)*S-cz],
      c2:  [(-12)*S-cx, (-13.5)*S-cz],
      c3:  [(-12)*S-cx, (-1.5)*S-cz],
      c4:  [(-22)*S-cx, (-1.5)*S-cz],
      c5:  [(18.5)*S-cx, (-13.5)*S-cz],
      c6:  [(8.5)*S-cx, (-13.5)*S-cz],
      c7:  [(-12)*S-cx, (5)*S-cz],
      c8:  [(8.5)*S-cx, (5)*S-cz],
      c9:  [(-22)*S-cx, (5)*S-cz],
      c10: [(-20.5)*S-cx, (5)*S-cz],
      c11: [(-20.5)*S-cx, (3)*S-cz],
      c12: [(-17)*S-cx, (3)*S-cz],
      c13: [(-17)*S-cx, (-1.5)*S-cz],
      c14: [(-17)*S-cx, (5)*S-cz],
      c15: [(18.5)*S-cx, (5)*S-cz],
      c16: [(8.5)*S-cx, (-1.5)*S-cz],
      c17: [(18.5)*S-cx, (-1.5)*S-cz],
      c18: [(13.5)*S-cx, (-1.5)*S-cz],
      c19: [(13.5)*S-cx, (5)*S-cz],
      c20: [(13.5)*S-cx, (2.5)*S-cz],
      c21: [(8.5)*S-cx, (2.5)*S-cz]
    };

    /* Exterior walls */
    var extWalls = [
      ['c1','c2'],['c2','c6'],['c6','c5'],  /* bottom */
      ['c5','c17'],['c17','c15'],            /* right */
      ['c15','c19'],['c19','c8'],['c8','c7'],['c7','c14'],['c14','c10'],['c10','c9'], /* top */
      ['c9','c4'],['c4','c1'],               /* left */
    ];
    extWalls.forEach(function(w) { addLine(planGroup, C[w[0]][0], C[w[0]][1], C[w[1]][0], C[w[1]][1], wallMat); });

    /* Interior walls */
    var intWalls = [
      ['c2','c3'],['c3','c13'],['c13','c4'], /* central vertical (left wing) */
      ['c6','c16'],['c16','c18'],['c18','c17'], /* horizontal interior */
      ['c16','c21'],['c21','c8'],            /* right wing vertical */
      ['c18','c20'],['c20','c19'],           /* bathroom divider right */
      ['c20','c21'],                         /* horizontal bath */
      ['c10','c11'],['c11','c12'],['c12','c13'], /* closet */
      ['c14','c12'],                         /* closet top connection */
      ['c14','c7'],                          /* top left interior */
      ['c3','c7'],                           /* left wing full height */
    ];
    intWalls.forEach(function(w) { addLine(planGroup, C[w[0]][0], C[w[0]][1], C[w[1]][0], C[w[1]][1], partMat); });

    /* Room floor fills */
    /* Bedroom 1 (left bottom) */
    addFloor(planGroup, [C.c1, C.c2, C.c3, C.c4], roomFill1);
    /* Living/Kitchen (center) */
    addFloor(planGroup, [C.c7, C.c8, C.c16, C.c3], fillMat);
    /* Bedroom 2 (right bottom) */
    addFloor(planGroup, [C.c6, C.c5, C.c17, C.c16], roomFill1);
    /* Bathroom 1 (right top) */
    addFloor(planGroup, [C.c21, C.c20, C.c19, C.c8], roomFill2);
    /* Bathroom 2 (right far) */
    addFloor(planGroup, [C.c18, C.c17, C.c15, C.c19], roomFill2);
    /* Closet */
    addFloor(planGroup, [C.c10, C.c11, C.c12, C.c14], roomFill2);

    /* Door arcs */
    addArc(planGroup, C.c3[0], C.c3[1]+0.3, 1.2*S, 0, Math.PI/2);
    addArc(planGroup, C.c16[0], C.c16[1]+0.3, 1.2*S, Math.PI/2, Math.PI);
    addArc(planGroup, C.c12[0]+0.3, C.c12[1], 1.0*S, -Math.PI/2, 0);
    addArc(planGroup, C.c21[0]+0.3, C.c21[1], 1.0*S, Math.PI, Math.PI*1.5);

    /* Window markers on exterior walls */
    /* Left wall */
    addWindowMark(planGroup, C.c9[0], (C.c9[1]+C.c4[1])*0.55, C.c9[0], (C.c9[1]+C.c4[1])*0.45);
    /* Bottom wall - bedroom 1 */
    addWindowMark(planGroup, (C.c1[0]+C.c2[0])*0.4, C.c1[1], (C.c1[0]+C.c2[0])*0.6, C.c1[1]);
    /* Bottom wall - bedroom 2 */
    addWindowMark(planGroup, (C.c6[0]+C.c5[0])*0.4, C.c6[1], (C.c6[0]+C.c5[0])*0.6, C.c6[1]);
    /* Right wall */
    addWindowMark(planGroup, C.c5[0], (C.c5[1]+C.c17[1])*0.5, C.c5[0], (C.c5[1]+C.c17[1])*0.45);
    /* Top wall - living */
    addWindowMark(planGroup, (C.c7[0]+C.c8[0])*0.4, C.c8[1], (C.c7[0]+C.c8[0])*0.6, C.c8[1]);

    /* Dimension lines */
    var dO = 1.5;
    /* Width */
    addLine(planGroup, C.c1[0], C.c1[1]-dO, C.c5[0], C.c5[1]-dO, dimMat);
    addLine(planGroup, C.c1[0], C.c1[1]-dO-0.3, C.c1[0], C.c1[1]-dO+0.3, dimMat);
    addLine(planGroup, C.c5[0], C.c5[1]-dO-0.3, C.c5[0], C.c5[1]-dO+0.3, dimMat);
    /* Depth */
    addLine(planGroup, C.c9[0]-dO, C.c9[1], C.c1[0]-dO, C.c1[1], dimMat);
    addLine(planGroup, C.c9[0]-dO-0.3, C.c9[1], C.c9[0]-dO+0.3, C.c9[1], dimMat);
    addLine(planGroup, C.c1[0]-dO-0.3, C.c1[1], C.c1[0]-dO+0.3, C.c1[1], dimMat);

    scene.add(gridGroup);
    scene.add(planGroup);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

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
        entries.forEach(function(entry) { heroVisible = entry.isIntersecting; });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    var time = 0;
    function animate() {
      requestAnimationFrame(animate);
      if (!heroVisible) return;
      time += 0.006;
      /* Gentle top-down drift + mouse parallax */
      camera.position.x = Math.sin(time * 0.3) * 3 + mouseX * 4;
      camera.position.z = Math.cos(time * 0.3) * 2 + mouseY * 3 + 0.01;
      camera.position.y = 45 + Math.sin(time * 0.15) * 1.5;
      camera.lookAt(mouseX * 1.5, 0, mouseY * 1.5);
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
          y: -72, opacity: 0, ease: 'none', stagger: 0.03,
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 }
        });
      }
    }

    if (hero && heroCanvas) {
      gsap.to(heroCanvas, {
        yPercent: -6, scale: 1.04, transformOrigin: '50% 50%', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 }
      });
    }

    /* ═══════════════════════════════════════════════
       PLAN SECTIONS — 100vh pinned, arrow/dot navigation
       ═══════════════════════════════════════════════ */
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-adu-plan-section]'));
    if (!sections.length) return;

    var labels = { bellecielo: 'Bellecielo', casielo: 'Casielo', elega: 'Elega' };

    /* ── Build wrapper: pinned 100vh container ── */
    var wrapper = document.createElement('div');
    wrapper.id = 'adu-plans-stage';
    var viewport = document.createElement('div');
    viewport.className = 'adu-plans-viewport';

    sections[0].parentNode.insertBefore(wrapper, sections[0]);
    wrapper.appendChild(viewport);

    /* Move all sections into the viewport as stacked slides */
    sections.forEach(function(section, i) {
      section.style.position = 'absolute';
      section.style.inset = '0';
      section.style.width = '100%';
      section.style.height = '100%';
      section.style.overflow = 'auto';
      section.style.display = 'flex';
      section.style.alignItems = 'center';
      section.style.opacity = i === 0 ? '1' : '0';
      section.style.pointerEvents = i === 0 ? 'auto' : 'none';
      viewport.appendChild(section);
    });

    /* ── Navigation arrows ── */
    var prevArrow = document.createElement('button');
    prevArrow.className = 'adu-plans-nav-arrow adu-plans-nav-arrow--prev is-hidden';
    prevArrow.innerHTML = '&#8249;';
    prevArrow.setAttribute('aria-label', 'Previous plan');
    viewport.appendChild(prevArrow);

    var nextArrow = document.createElement('button');
    nextArrow.className = 'adu-plans-nav-arrow adu-plans-nav-arrow--next';
    nextArrow.innerHTML = '&#8250;';
    nextArrow.setAttribute('aria-label', 'Next plan');
    viewport.appendChild(nextArrow);

    /* ── Horizontal progress bar ── */
    var bar = document.createElement('div');
    bar.className = 'adu-plans-bar';
    bar.innerHTML = '<div class="adu-plans-bar-track"></div><div class="adu-plans-bar-fill"></div>';
    var dots = [];
    sections.forEach(function(section, i) {
      var key = section.getAttribute('data-adu-plan-section');
      var dot = document.createElement('div');
      dot.className = 'adu-plans-bar-dot' + (i === 0 ? ' is-active' : '');
      dot.innerHTML = '<span>' + (labels[key] || key) + '</span>';
      dot.addEventListener('click', function() { goToSlide(i); });
      bar.appendChild(dot);
      dots.push(dot);
    });
    viewport.appendChild(bar);

    var fill = bar.querySelector('.adu-plans-bar-fill');
    var numSlides = sections.length;
    var currentSlide = 0;
    var isAnimating = false;

    function updateUI(idx) {
      /* Progress bar fill */
      var prog = idx / (numSlides - 1);
      if (fill) fill.style.transform = 'translateY(-50%) scaleX(' + prog + ')';
      /* Dots */
      dots.forEach(function(d, di) { d.classList.toggle('is-active', di === idx); });
      /* Arrows */
      prevArrow.classList.toggle('is-hidden', idx === 0);
      nextArrow.classList.toggle('is-hidden', idx === numSlides - 1);
    }

    function goToSlide(idx) {
      if (idx === currentSlide || isAnimating || idx < 0 || idx >= numSlides) return;
      isAnimating = true;
      var prev = currentSlide;
      currentSlide = idx;
      updateUI(idx);

      /* Crossfade */
      gsap.to(sections[prev], { opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: function() {
        sections[prev].style.pointerEvents = 'none';
      }});
      gsap.to(sections[idx], { opacity: 1, duration: 0.4, ease: 'power2.inOut', delay: 0.1, onStart: function() {
        sections[idx].style.pointerEvents = 'auto';
      }, onComplete: function() { isAnimating = false; }});

      /* Panel slide-in */
      var stage = sections[idx].querySelector('[data-adu-role="plan-stage"]');
      var panel = sections[idx].querySelector('[data-adu-role="plan-panel"]');
      var dir = idx > prev ? 1 : -1;
      if (stage) gsap.fromTo(stage, { x: -30 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.15 });
      if (panel) gsap.fromTo(panel, { x: 30 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.2 });
    }

    prevArrow.addEventListener('click', function() { goToSlide(currentSlide - 1); });
    nextArrow.addEventListener('click', function() { goToSlide(currentSlide + 1); });

    /* Keyboard navigation */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    /* Pin the wrapper for the duration of all slides */
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: '+=' + (numSlides * 100) + 'vh',
      pin: true,
      pinSpacing: true
    });

    updateUI(0);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() { ScrollTrigger.refresh(); });
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
