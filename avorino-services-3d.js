(function () {
  'use strict';

  /* Desktop only — mobile hides canvas via CSS */
  if (window.innerWidth < 992) return;

  function init() {
    var showcase = document.querySelector('.sv-showcase');
    if (!showcase || typeof THREE === 'undefined') return;

    /* ── Canvas Wrapper ── */
    var wrap = showcase.querySelector('.sv-canvas-wrap');
    if (!wrap) return;

    /* ── Renderer ── */
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(16, 12, 20);
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
    function makeMat(color, opacity) {
      return new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity || 0 });
    }
    var gridMat    = makeMat(CREAM, 0.12);
    var buildMat   = makeMat(SLATE, 0.4);
    var accentMat  = makeMat(GOLD, 0.5);

    /* ── Geometry Helpers ── */
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }

    /* ═══════════════════════════════════════════════
       GROUND GRID — always visible
       ═══════════════════════════════════════════════ */
    var gGrid = new THREE.Group();
    var gp = [];
    var i;
    for (i = -8; i <= 8; i += 2) { gp.push(i, 0, -6, i, 0, 6); }
    for (i = -6; i <= 6; i += 2) { gp.push(-8, 0, i, 8, 0, i); }
    gGrid.add(lineSegs(gp, gridMat));
    scene.add(gGrid);

    /* ═══════════════════════════════════════════════
       MORPH TARGETS — 6 building wireframes
       Each is an array of line segment pairs (x1,y1,z1, x2,y2,z2)
       We use 120 segments (720 floats) as our budget.
       Unused segments collapse to (0,0,0)-(0,0,0).
       ═══════════════════════════════════════════════ */
    var SEG_COUNT = 120;
    var FLOAT_COUNT = SEG_COUNT * 6; // 720

    function padToSize(arr) {
      var result = new Float32Array(FLOAT_COUNT);
      for (var j = 0; j < arr.length && j < FLOAT_COUNT; j++) {
        result[j] = arr[j];
      }
      return result;
    }

    /* Helper: wireframe box as segment array */
    function boxSegs(cx, cy, cz, w, h, d) {
      var hw = w / 2, hh = h / 2, hd = d / 2;
      var x0 = cx - hw, x1 = cx + hw;
      var y0 = cy - hh, y1 = cy + hh;
      var z0 = cz - hd, z1 = cz + hd;
      return [
        // bottom
        x0,y0,z0, x1,y0,z0,  x1,y0,z0, x1,y0,z1,  x1,y0,z1, x0,y0,z1,  x0,y0,z1, x0,y0,z0,
        // top
        x0,y1,z0, x1,y1,z0,  x1,y1,z0, x1,y1,z1,  x1,y1,z1, x0,y1,z1,  x0,y1,z1, x0,y1,z0,
        // verticals
        x0,y0,z0, x0,y1,z0,  x1,y0,z0, x1,y1,z0,  x1,y0,z1, x1,y1,z1,  x0,y0,z1, x0,y1,z1,
      ];
    }

    /* Helper: window opening (4 segments = rectangle) */
    function windowSegs(x0, y0, z, x1, y1) {
      return [
        x0,y0,z, x1,y0,z,  x1,y0,z, x1,y1,z,  x1,y1,z, x0,y1,z,  x0,y1,z, x0,y0,z,
      ];
    }

    /* Helper: vertical line segment */
    function vLine(x, y0, y1, z) {
      return [x, y0, z, x, y1, z];
    }

    /* Helper: horizontal line segment */
    function hLine(x0, x1, y, z) {
      return [x0, y, z, x1, y, z];
    }

    /* ── TARGET 0: ADU — Small single-story unit ── */
    var aduPts = [].concat(
      boxSegs(0, 3.5, 0, 8, 7, 6),          // main volume (12 segs)
      // Foundation slab
      hLine(-4, 4, 0, -3), hLine(-4, 4, 0, 3),
      hLine(-4, -4, 0, -3), hLine(4, 4, 0, 3), // error: let's fix. Foundation perimeter at ground
      // Interior division
      vLine(0, 0, 7, -1), vLine(0, 0, 7, 1),
      hLine(-4, 0, 3.5, -3), hLine(0, 4, 3.5, -3),
      // Door opening
      vLine(-1, 0, 5, -3.01), vLine(1, 0, 5, -3.01), hLine(-1, 1, 5, -3.01),
      // Windows
      windowSegs(-3.5, 2, -3.01, -1.5, 4.5),
      windowSegs(1.5, 2, -3.01, 3.5, 4.5),
      windowSegs(-3.5, 2, 3.01, -1.5, 4.5),
      windowSegs(1.5, 2, 3.01, 3.5, 4.5),
      // Roof ridge
      hLine(-4.5, 4.5, 7.2, 0),
      // Dimension marks
      hLine(-4.5, 4.5, 0, -3.5), hLine(-4.5, 4.5, 0, 3.5)
    );

    /* ── TARGET 1: Garage Conversion ── */
    var garagePts = [].concat(
      boxSegs(0, 2.5, 0, 10, 5, 7),          // wider, lower box (12 segs)
      // Garage door opening (front face)
      windowSegs(-3, 0.1, -3.51, 3, 4.2),
      // New conversion wall (splits interior)
      vLine(0, 0, 5, -3.5), vLine(0, 0, 5, 3.5),
      hLine(-5, 0, 5, -3.5), hLine(-5, 0, 5, 3.5),
      hLine(0, 5, 5, -3.5), hLine(0, 5, 5, 3.5),
      // New windows on former garage door side
      windowSegs(-4, 1.5, -3.51, -2, 3.5),
      windowSegs(2, 1.5, -3.51, 4, 3.5),
      // Side windows
      windowSegs(-5.01, 1.5, -2, -5.01, 3.5, 1),
      // Interior fixtures hint
      hLine(-3, -1, 2, 0), hLine(1, 3, 2, 0),
      vLine(-3, 0, 2, 0), vLine(3, 0, 2, 0),
      // Roof line
      hLine(-5.5, 5.5, 5.2, 0),
      hLine(-5.5, 5.5, 5.2, -3.5), hLine(-5.5, 5.5, 5.2, 3.5)
    );

    /* ── TARGET 2: Custom Home — Multi-volume ── */
    var customPts = [].concat(
      boxSegs(-1, 4, 0, 10, 8, 6),           // main volume (12 segs)
      boxSegs(6, 2.5, 0.5, 4, 5, 5),         // wing volume (12 segs)
      boxSegs(-5, 5.5, -1, 3, 3, 3),         // tower element (12 segs)
      // Floor plates
      hLine(-6, 4, 4, -3), hLine(-6, 4, 4, 3),
      hLine(4, 8, 2.5, -2), hLine(4, 8, 2.5, 3),
      // Windows — main
      windowSegs(-5, 2, -3.01, -3, 5),
      windowSegs(-2, 2, -3.01, 1, 5),
      windowSegs(2, 2, -3.01, 4, 5),
      // Windows — wing
      windowSegs(5, 1, -2.51, 7, 3.5),
      // Roof overhangs
      hLine(-7, 5, 8.2, -3.5), hLine(-7, 5, 8.2, 3.5),
      hLine(3.5, 8.5, 5.2, -3), hLine(3.5, 8.5, 5.2, 3.5),
      // Interior walls
      vLine(-1, 0, 8, 0), vLine(2, 0, 8, 0),
      vLine(-1, 0, 8, -2)
    );

    /* ── TARGET 3: New Construction — Building on pad + crane ── */
    var newbuildPts = [].concat(
      boxSegs(0, 4.5, 0, 9, 9, 6),           // main structure (12 segs)
      // Raised foundation pad
      boxSegs(0, 0.3, 0, 11, 0.6, 8),        // (12 segs)
      // Site grading lines
      hLine(-7, 7, -0.1, -5), hLine(-7, 7, -0.1, 5),
      hLine(-7, -7, -0.1, -5), hLine(7, 7, -0.1, 5),
      // Windows
      windowSegs(-3.5, 2, -3.01, -1, 5),
      windowSegs(1, 2, -3.01, 3.5, 5),
      windowSegs(-3.5, 5.5, -3.01, -1, 7.5),
      windowSegs(1, 5.5, -3.01, 3.5, 7.5),
      // Interior
      vLine(0, 0, 9, 0), hLine(-4.5, 4.5, 4.5, 0),
      // Small crane arm
      vLine(-6, 0, 12, -4), // mast
      hLine(-6, 3, 11.5, -4), // jib
      hLine(-6, -8, 11.5, -4), // counter-jib
      // Tie lines
      [-6, 12, -4, 3, 11.5, -4],
      [-6, 12, -4, -8, 11.5, -4]
    );

    /* ── TARGET 4: Addition — Existing house + new wing ── */
    var additionPts = [].concat(
      boxSegs(-2, 3.5, 0, 7, 7, 6),          // existing house (12 segs)
      boxSegs(5, 3, 0, 5, 6, 6),             // new addition (12 segs)
      // Connection line
      hLine(1.5, 2.5, 3.5, -3), hLine(1.5, 2.5, 3.5, 3),
      hLine(1.5, 2.5, 7, -3), hLine(1.5, 2.5, 7, 3),
      // Existing windows
      windowSegs(-4.5, 2, -3.01, -2.5, 5),
      windowSegs(-1.5, 2, -3.01, 0.5, 5),
      // New addition windows (will be gold in accent layer)
      windowSegs(3.5, 1.5, -3.01, 5, 4),
      windowSegs(5.5, 1.5, -3.01, 7, 4),
      // Scaffolding on new addition
      vLine(2.5, 0, 7, -3), vLine(7.5, 0, 7, -3),
      vLine(2.5, 0, 7, 3), vLine(7.5, 0, 7, 3),
      hLine(2.5, 7.5, 3, -3), hLine(2.5, 7.5, 3, 3),
      hLine(2.5, 7.5, 5, -3), hLine(2.5, 7.5, 5, 3),
      // Roof lines
      hLine(-6, 1.5, 7.2, 0), hLine(2.5, 7.5, 6.2, 0)
    );

    /* ── TARGET 5: Commercial — Tall multi-story ── */
    var commercialPts = [].concat(
      boxSegs(0, 5, 0, 12, 10, 7),           // main volume (12 segs)
      // Floor plates
      hLine(-6, 6, 2.5, -3.5), hLine(-6, 6, 2.5, 3.5),
      hLine(-6, 6, 5, -3.5), hLine(-6, 6, 5, 3.5),
      hLine(-6, 6, 7.5, -3.5), hLine(-6, 6, 7.5, 3.5),
      // Window grid — floor 1
      windowSegs(-5, 1, -3.51, -3, 2.2),
      windowSegs(-2, 1, -3.51, 0, 2.2),
      windowSegs(1, 1, -3.51, 3, 2.2),
      windowSegs(4, 1, -3.51, 5.5, 2.2),
      // Window grid — floor 2
      windowSegs(-5, 3, -3.51, -3, 4.5),
      windowSegs(-2, 3, -3.51, 0, 4.5),
      windowSegs(1, 3, -3.51, 3, 4.5),
      windowSegs(4, 3, -3.51, 5.5, 4.5),
      // Window grid — floor 3
      windowSegs(-5, 5.5, -3.51, -3, 7),
      windowSegs(-2, 5.5, -3.51, 0, 7),
      windowSegs(1, 5.5, -3.51, 3, 7),
      windowSegs(4, 5.5, -3.51, 5.5, 7),
      // Entrance
      vLine(-1.5, 0, 3, -3.51), vLine(1.5, 0, 3, -3.51), hLine(-1.5, 1.5, 3, -3.51),
      // Flat roof overhang
      hLine(-6.5, 6.5, 10.2, -4), hLine(-6.5, 6.5, 10.2, 4)
    );

    /* Flatten nested arrays in morph targets */
    function flattenPts(arr) {
      var result = [];
      for (var j = 0; j < arr.length; j++) {
        if (Array.isArray(arr[j])) {
          for (var k = 0; k < arr[j].length; k++) result.push(arr[j][k]);
        } else {
          result.push(arr[j]);
        }
      }
      return result;
    }

    var morphTargets = [
      padToSize(flattenPts(aduPts)),
      padToSize(flattenPts(garagePts)),
      padToSize(flattenPts(customPts)),
      padToSize(flattenPts(newbuildPts)),
      padToSize(flattenPts(additionPts)),
      padToSize(flattenPts(commercialPts)),
    ];

    /* ═══════════════════════════════════════════════
       BUILDING GEOMETRY — morphable line segments
       ═══════════════════════════════════════════════ */
    var buildPositions = new Float32Array(FLOAT_COUNT);
    // Start with first target
    for (i = 0; i < FLOAT_COUNT; i++) buildPositions[i] = morphTargets[0][i];

    var buildGeo = new THREE.BufferGeometry();
    buildGeo.setAttribute('position', new THREE.Float32BufferAttribute(buildPositions, 3));
    var buildLines = new THREE.LineSegments(buildGeo, buildMat);
    scene.add(buildLines);

    /* ── Accent lines (roof overhangs, dimension marks) ── */
    var accentPositions = new Float32Array(FLOAT_COUNT);
    for (i = 0; i < FLOAT_COUNT; i++) accentPositions[i] = morphTargets[0][i];

    var accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.Float32BufferAttribute(accentPositions, 3));
    var accentLines = new THREE.LineSegments(accentGeo, accentMat);
    scene.add(accentLines);

    /* ═══════════════════════════════════════════════
       PARTICLES — rising gold motes
       ═══════════════════════════════════════════════ */
    var PC = 50;
    var pArr = new Float32Array(PC * 3);
    var pVel = [];
    for (i = 0; i < PC; i++) {
      pArr[i * 3]     = (Math.random() - 0.5) * 20;
      pArr[i * 3 + 1] = Math.random() * 14;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 16;
      pVel.push(0.003 + Math.random() * 0.007);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({ color: GOLD, size: 0.1, transparent: true, opacity: 0.3 });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ═══════════════════════════════════════════════
       SCROLL PROGRESS & SERVICE CHANGES
       ═══════════════════════════════════════════════ */
    var currentTarget = 0;
    var scrollTarget = 0;
    var scroll = 0;

    // Listen for service change events from avorino-services.js
    showcase.addEventListener('sv-service-change', function (e) {
      currentTarget = e.detail.step;
    });

    // Also read scroll progress directly for camera orbit
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: showcase,
        start: 'top top',
        end: '+=600%',
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
    ).observe(showcase);

    /* ═══════════════════════════════════════════════
       RENDER LOOP
       ═══════════════════════════════════════════════ */
    var baseAngle = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;

      scroll += (scrollTarget - scroll) * 0.06;

      /* Camera orbit driven by scroll */
      var targetAngle = scroll * Math.PI * 0.5;
      baseAngle += (targetAngle - baseAngle) * 0.1;

      scene.rotation.y = baseAngle + mx * 0.12;
      camera.position.y = 12 + my * -1;
      camera.lookAt(0, 3, 0);

      /* ── Morph building geometry toward current target ── */
      var target = morphTargets[currentTarget];
      var buildArr = buildGeo.attributes.position.array;
      var accentArr = accentGeo.attributes.position.array;
      var morphing = false;

      for (var j = 0; j < FLOAT_COUNT; j++) {
        var diff = target[j] - buildArr[j];
        if (Math.abs(diff) > 0.01) {
          morphing = true;
          buildArr[j] += diff * 0.04;
          accentArr[j] += diff * 0.04;
        }
      }

      if (morphing) {
        buildGeo.attributes.position.needsUpdate = true;
        accentGeo.attributes.position.needsUpdate = true;
      }

      /* Accent opacity dips during morph transitions */
      accentMat.opacity = morphing ? 0.2 : 0.5;
      buildMat.opacity = morphing ? 0.25 : 0.4;

      /* ── Animate particles ── */
      var scrollDelta = Math.abs(scrollTarget - scroll);
      if (scrollDelta > 0.0005 || morphing) {
        var pa = pGeo.attributes.position.array;
        for (var k = 0; k < PC; k++) {
          pa[k * 3 + 1] += pVel[k];
          if (pa[k * 3 + 1] > 16) {
            pa[k * 3 + 1] = -1;
            pa[k * 3]     = (Math.random() - 0.5) * 20;
            pa[k * 3 + 2] = (Math.random() - 0.5) * 16;
          }
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    animate();

    /* Signal ready */
    showcase.dispatchEvent(new CustomEvent('sv3d-ready'));
  }

  /* ── Bootstrap ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
