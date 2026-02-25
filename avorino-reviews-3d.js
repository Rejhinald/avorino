(function () {
  'use strict';

  /* Desktop only — mobile hides canvas via CSS */
  if (window.innerWidth < 992) return;

  function init() {
    var wall = document.querySelector('.rv-wall');
    if (!wall || typeof THREE === 'undefined') return;

    /* ── Canvas Wrapper ── */
    var wrap = wall.querySelector('.rv-canvas-wrap');
    if (!wrap) return;

    /* ── Renderer ── */
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(14, 10, 18);
    camera.lookAt(0, 3, 0);

    function handleResize() {
      var w = wrap.clientWidth || 1;
      var h = wrap.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    handleResize();
    window.addEventListener('resize', handleResize);

    /* ── Colors ── */
    var GOLD  = 0xc9a96e;
    var CREAM = 0xf0ede8;
    var SLATE = 0x555555;

    /* ── Materials ── */
    function makeMat(color) {
      return new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0 });
    }
    var gridMat   = makeMat(CREAM);
    var foundMat  = makeMat(GOLD);
    var structMat = makeMat(SLATE);
    var accentMat = makeMat(GOLD);

    /* ── Geometry Helpers ── */
    function wireBox(w, h, d, mat) {
      return new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat
      );
    }
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }

    /* ═══════════════════════════════════════════════
       GROUP 1 — Blueprint Grid
       ═══════════════════════════════════════════════ */
    var gGrid = new THREE.Group();
    var gp = [];
    var i;
    for (i = -8; i <= 8; i += 2) { gp.push(i, 0, -6, i, 0, 6); }
    for (i = -6; i <= 6; i += 2) { gp.push(-8, 0, i, 8, 0, i); }
    gGrid.add(lineSegs(gp, gridMat));
    scene.add(gGrid);

    /* ═══════════════════════════════════════════════
       GROUP 2 — Foundation / Footprint
       ═══════════════════════════════════════════════ */
    var gFound = new THREE.Group();
    var mainFoot = wireBox(9, 0.12, 6, foundMat);
    mainFoot.position.set(-0.5, 0.06, 0);
    gFound.add(mainFoot);
    var wingFoot = wireBox(4, 0.12, 5, foundMat);
    wingFoot.position.set(5.5, 0.06, 0.5);
    gFound.add(wingFoot);
    gFound.add(lineSegs([0, 0.08, -3, 0, 0.08, 3], foundMat));
    scene.add(gFound);

    /* ═══════════════════════════════════════════════
       GROUP 3 — Structure (walls)
       ═══════════════════════════════════════════════ */
    var gStruct = new THREE.Group();
    var mainVol = wireBox(9, 7, 6, structMat);
    mainVol.position.set(-0.5, 3.5, 0);
    gStruct.add(mainVol);
    var wingVol = wireBox(4, 4, 5, structMat);
    wingVol.position.set(5.5, 2, 0.5);
    gStruct.add(wingVol);
    scene.add(gStruct);

    /* ═══════════════════════════════════════════════
       GROUP 4 — Roof Accents
       ═══════════════════════════════════════════════ */
    var gAccent = new THREE.Group();
    gAccent.add(lineSegs([
      -5.5, 7.15, -3.5, 4.5, 7.15, -3.5,
      4.5, 7.15, -3.5, 4.5, 7.15, 3.5,
      4.5, 7.15, 3.5, -5.5, 7.15, 3.5,
      -5.5, 7.15, 3.5, -5.5, 7.15, -3.5,
    ], accentMat));
    gAccent.add(lineSegs([
      3.2, 4.15, -2.8, 8, 4.15, -2.8,
      8, 4.15, -2.8, 8, 4.15, 3.8,
      8, 4.15, 3.8, 3.2, 4.15, 3.8,
    ], accentMat));
    scene.add(gAccent);

    /* ═══════════════════════════════════════════════
       PARTICLES — rising gold motes
       ═══════════════════════════════════════════════ */
    var PC = 40;
    var pArr = new Float32Array(PC * 3);
    var pVel = [];
    for (i = 0; i < PC; i++) {
      pArr[i * 3]     = (Math.random() - 0.5) * 18;
      pArr[i * 3 + 1] = Math.random() * 10;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 14;
      pVel.push(0.003 + Math.random() * 0.006);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({ color: GOLD, size: 0.08, transparent: true, opacity: 0 });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ═══════════════════════════════════════════════
       SCROLL PROGRESS
       ═══════════════════════════════════════════════ */
    var scrollTarget = 0;
    var scroll = 0;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: wall,
        start: 'top top',
        end: '+=300%',
        onUpdate: function (self) { scrollTarget = self.progress; },
      });
    }

    /* ── Mouse parallax ── */
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Visibility gate ── */
    var visible = false;
    new IntersectionObserver(
      function (entries) { visible = entries[0].isIntersecting; },
      { threshold: 0.01 }
    ).observe(wall);

    /* ═══════════════════════════════════════════════
       RENDER LOOP — fully scroll-driven
       ═══════════════════════════════════════════════ */
    var baseAngle = 0;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t)  { return 1 - Math.pow(1 - t, 3); }

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;

      scroll += (scrollTarget - scroll) * 0.06;

      /* Camera orbit driven by scroll */
      var targetAngle = scroll * Math.PI * 0.4;
      baseAngle += (targetAngle - baseAngle) * 0.1;

      scene.rotation.y = baseAngle + mx * 0.12;
      camera.position.y = 10 + my * -1;
      camera.lookAt(0, 3, 0);

      var p = scroll;

      /* Grid: 0 → 25% */
      gridMat.opacity = clamp(p / 0.25) * 0.1;

      /* Foundation: 10 → 40% */
      var fp = ease(clamp((p - 0.1) / 0.3));
      foundMat.opacity = fp * 0.45;
      gFound.position.y = -1.5 * (1 - fp);

      /* Structure: 25 → 60% */
      var sp = ease(clamp((p - 0.25) / 0.35));
      structMat.opacity = sp * 0.3;
      gStruct.position.y = -5 * (1 - sp);

      /* Accents: 50 → 85% */
      accentMat.opacity = ease(clamp((p - 0.5) / 0.35)) * 0.55;

      /* Particles: 40 → 100% */
      pMat.opacity = clamp((p - 0.4) / 0.6) * 0.3;
      var scrollDelta = Math.abs(scrollTarget - scroll);
      if (scrollDelta > 0.0005) {
        var pa = pGeo.attributes.position.array;
        for (var j = 0; j < PC; j++) {
          pa[j * 3 + 1] += pVel[j];
          if (pa[j * 3 + 1] > 12) {
            pa[j * 3 + 1] = -1;
            pa[j * 3]     = (Math.random() - 0.5) * 18;
            pa[j * 3 + 2] = (Math.random() - 0.5) * 14;
          }
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    animate();

    /* Signal ready */
    wall.dispatchEvent(new CustomEvent('rv3d-ready'));
  }

  /* ── Bootstrap ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
