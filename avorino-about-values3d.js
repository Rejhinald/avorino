(function () {
  'use strict';

  // Skip on mobile / tablet
  if (window.innerWidth < 992) return;
  if (typeof THREE === 'undefined') return;

  var container = document.querySelector('[data-values-canvas]');
  if (!container) return;

  /* ═══════════════════════════════════════════════
     SETUP
     ═══════════════════════════════════════════════ */
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(18, 14, 24);
  camera.lookAt(0, 3, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* ═══════════════════════════════════════════════
     LIGHTS
     ═══════════════════════════════════════════════ */
  var ambientLight = new THREE.AmbientLight(0xf0ede8, 0.4);
  scene.add(ambientLight);

  var pointLight1 = new THREE.PointLight(0xc9a96e, 1.0, 80);
  pointLight1.position.set(15, 20, 20);
  scene.add(pointLight1);

  var pointLight2 = new THREE.PointLight(0xc8222a, 0.3, 60);
  pointLight2.position.set(-15, 5, 10);
  scene.add(pointLight2);

  /* ═══════════════════════════════════════════════
     MATERIALS
     ═══════════════════════════════════════════════ */
  var goldLine = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.5 });
  var goldLineFaint = new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.15 });
  var creamLine = new THREE.LineBasicMaterial({ color: 0xf0ede8, transparent: true, opacity: 0.2 });
  var creamLineFaint = new THREE.LineBasicMaterial({ color: 0xf0ede8, transparent: true, opacity: 0.08 });

  /* ═══════════════════════════════════════════════
     SCENE GROUP — Everything rotates together
     ═══════════════════════════════════════════════ */
  var sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  /* ═══════════════════════════════════════════════
     GROUND GRID — Blueprint-style base
     ═══════════════════════════════════════════════ */
  var gridSize = 24;
  var gridDiv = 12;
  var gridStep = gridSize / gridDiv;
  var gridPositions = [];

  for (var gi = 0; gi <= gridDiv; gi++) {
    var pos = -gridSize / 2 + gi * gridStep;
    // X lines
    gridPositions.push(-gridSize / 2, 0, pos, gridSize / 2, 0, pos);
    // Z lines
    gridPositions.push(pos, 0, -gridSize / 2, pos, 0, gridSize / 2);
  }
  var gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
  var gridMesh = new THREE.LineSegments(gridGeo, creamLineFaint);
  sceneGroup.add(gridMesh);

  /* ═══════════════════════════════════════════════
     HELPER — Create wireframe building from box
     ═══════════════════════════════════════════════ */
  function createBuilding(w, h, d, x, z, material) {
    var geo = new THREE.BoxGeometry(w, h, d);
    var edges = new THREE.EdgesGeometry(geo);
    var line = new THREE.LineSegments(edges, material);
    line.position.set(x, h / 2, z);
    return line;
  }

  /* ═══════════════════════════════════════════════
     BUILDINGS — Architectural wireframe composition
     Three interlocking volumes (modern home design)
     ═══════════════════════════════════════════════ */

  // Main volume — central mass
  var bldg1 = createBuilding(8, 7, 6, 0, 0, goldLine);
  sceneGroup.add(bldg1);

  // Left wing — lower, wider extension
  var bldg2 = createBuilding(5, 4.5, 7, -5.5, 0.5, goldLine);
  sceneGroup.add(bldg2);

  // Right tower — taller accent volume
  var bldg3 = createBuilding(3.5, 10, 4, 4.5, -1, goldLine);
  sceneGroup.add(bldg3);

  // Garage / ground extension
  var bldg4 = createBuilding(4, 3, 5, -3, -4, goldLineFaint);
  sceneGroup.add(bldg4);

  /* ═══════════════════════════════════════════════
     ROOF LINES — Flat roof with slight overhang
     ═══════════════════════════════════════════════ */
  var roofPositions = [];
  // Main building roof overhang
  var overhang = 0.4;
  roofPositions.push(
    -4 - overhang, 7.05, -3 - overhang,
    4 + overhang, 7.05, -3 - overhang,
    4 + overhang, 7.05, -3 - overhang,
    4 + overhang, 7.05, 3 + overhang,
    4 + overhang, 7.05, 3 + overhang,
    -4 - overhang, 7.05, 3 + overhang,
    -4 - overhang, 7.05, 3 + overhang,
    -4 - overhang, 7.05, -3 - overhang
  );
  // Tower roof
  roofPositions.push(
    2.75 - 0.2, 10.05, -3 - 0.2,
    6.25 + 0.2, 10.05, -3 - 0.2,
    6.25 + 0.2, 10.05, -3 - 0.2,
    6.25 + 0.2, 10.05, 1 + 0.2,
    6.25 + 0.2, 10.05, 1 + 0.2,
    2.75 - 0.2, 10.05, 1 + 0.2,
    2.75 - 0.2, 10.05, 1 + 0.2,
    2.75 - 0.2, 10.05, -3 - 0.2
  );
  var roofGeo = new THREE.BufferGeometry();
  roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(roofPositions, 3));
  var roofMesh = new THREE.LineSegments(roofGeo, goldLineFaint);
  sceneGroup.add(roofMesh);

  /* ═══════════════════════════════════════════════
     WINDOW FRAMES — Architectural detail
     ═══════════════════════════════════════════════ */
  function createWindowFrame(cx, cy, cz, w, h, normal) {
    var hw = w / 2, hh = h / 2;
    var pts = [];
    if (normal === 'x') {
      pts.push(cx, cy - hh, cz - hw, cx, cy - hh, cz + hw);
      pts.push(cx, cy - hh, cz + hw, cx, cy + hh, cz + hw);
      pts.push(cx, cy + hh, cz + hw, cx, cy + hh, cz - hw);
      pts.push(cx, cy + hh, cz - hw, cx, cy - hh, cz - hw);
      // Cross
      pts.push(cx, cy, cz - hw, cx, cy, cz + hw);
      pts.push(cx, cy - hh, cz, cx, cy + hh, cz);
    } else {
      pts.push(cx - hw, cy - hh, cz, cx + hw, cy - hh, cz);
      pts.push(cx + hw, cy - hh, cz, cx + hw, cy + hh, cz);
      pts.push(cx + hw, cy + hh, cz, cx - hw, cy + hh, cz);
      pts.push(cx - hw, cy + hh, cz, cx - hw, cy - hh, cz);
      // Cross
      pts.push(cx - hw, cy, cz, cx + hw, cy, cz);
      pts.push(cx, cy - hh, cz, cx, cy + hh, cz);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(geo, creamLine);
  }

  // Main building front windows (z = 3)
  sceneGroup.add(createWindowFrame(-2, 4.5, 3.01, 1.4, 2, 'z'));
  sceneGroup.add(createWindowFrame(0.5, 4.5, 3.01, 1.4, 2, 'z'));
  sceneGroup.add(createWindowFrame(-2, 2, 3.01, 1.4, 1.5, 'z'));
  sceneGroup.add(createWindowFrame(0.5, 2, 3.01, 1.4, 1.5, 'z'));

  // Tower front windows
  sceneGroup.add(createWindowFrame(4.5, 7, 1.01, 1.2, 2.5, 'z'));
  sceneGroup.add(createWindowFrame(4.5, 3.5, 1.01, 1.2, 2, 'z'));

  // Left wing windows (x = -8)
  sceneGroup.add(createWindowFrame(-8.01, 3, -0.5, 1.2, 1.8, 'x'));
  sceneGroup.add(createWindowFrame(-8.01, 3, 2, 1.2, 1.8, 'x'));

  /* ═══════════════════════════════════════════════
     DIMENSION LINES — Blueprint measurement indicators
     ═══════════════════════════════════════════════ */
  function createDimensionLine(x1, y1, z1, x2, y2, z2, tickSize) {
    var pts = [];
    // Main line
    pts.push(x1, y1, z1, x2, y2, z2);
    // End ticks (perpendicular)
    if (Math.abs(x2 - x1) > Math.abs(z2 - z1)) {
      // Horizontal — ticks in Z
      pts.push(x1, y1, z1 - tickSize, x1, y1, z1 + tickSize);
      pts.push(x2, y2, z2 - tickSize, x2, y2, z2 + tickSize);
    } else {
      // Depth — ticks in X
      pts.push(x1 - tickSize, y1, z1, x1 + tickSize, y1, z1);
      pts.push(x2 - tickSize, y2, z2, x2 + tickSize, y2, z2);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(geo, goldLineFaint);
  }

  // Width dimension (below ground)
  sceneGroup.add(createDimensionLine(-8, -0.5, 5, 6.25, -0.5, 5, 0.3));
  // Depth dimension
  sceneGroup.add(createDimensionLine(7.5, -0.5, -4, 7.5, -0.5, 4, 0.3));
  // Tower height
  sceneGroup.add(createDimensionLine(7, 0, -1, 7, 10, -1, 0.3));

  /* ═══════════════════════════════════════════════
     PARTICLES — Rising construction dust / light motes
     ═══════════════════════════════════════════════ */
  var particleCount = 60;
  var particlePositions = new Float32Array(particleCount * 3);
  var particleData = [];

  for (var p = 0; p < particleCount; p++) {
    particlePositions[p * 3] = (Math.random() - 0.5) * 30;
    particlePositions[p * 3 + 1] = Math.random() * 15;
    particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 30;
    particleData.push({
      speed: 0.003 + Math.random() * 0.008,
      resetY: Math.random() * 15,
    });
  }

  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: 0xc9a96e,
    size: 0.1,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  sceneGroup.add(particles);

  /* ═══════════════════════════════════════════════
     MOUSE TRACKING — Subtle parallax
     ═══════════════════════════════════════════════ */
  var mouse = { x: 0, y: 0 };
  var targetRotation = { x: 0, y: 0 };

  document.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ═══════════════════════════════════════════════
     VISIBILITY — Only render when section is in view
     ═══════════════════════════════════════════════ */
  var isVisible = false;
  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });

  var section = document.getElementById('about-values');
  if (section) observer.observe(section);

  /* ═══════════════════════════════════════════════
     ANIMATION LOOP
     ═══════════════════════════════════════════════ */
  var clock = new THREE.Clock();
  var baseRotationY = -0.3; // slight initial angle for isometric feel

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    var elapsed = clock.getElapsedTime();

    // Slow orbit + mouse parallax
    targetRotation.y = baseRotationY + mouse.x * 0.12 + elapsed * 0.03;
    targetRotation.x = mouse.y * 0.06;

    sceneGroup.rotation.y += (targetRotation.y - sceneGroup.rotation.y) * 0.015;
    sceneGroup.rotation.x += (targetRotation.x - sceneGroup.rotation.x) * 0.015;

    // Subtle breathing
    var breathe = 1 + Math.sin(elapsed * 0.4) * 0.008;
    sceneGroup.scale.setScalar(breathe);

    // Particle rise
    var pPos = particleGeo.getAttribute('position');
    for (var pi = 0; pi < particleCount; pi++) {
      pPos.array[pi * 3 + 1] += particleData[pi].speed;
      // Reset when too high
      if (pPos.array[pi * 3 + 1] > 18) {
        pPos.array[pi * 3 + 1] = -1;
        pPos.array[pi * 3] = (Math.random() - 0.5) * 30;
        pPos.array[pi * 3 + 2] = (Math.random() - 0.5) * 30;
      }
    }
    pPos.needsUpdate = true;

    // Gentle light movement
    pointLight1.position.x = 15 + Math.sin(elapsed * 0.3) * 3;
    pointLight1.position.z = 20 + Math.cos(elapsed * 0.2) * 3;

    renderer.render(scene, camera);
  }

  animate();

  /* ═══════════════════════════════════════════════
     RESIZE
     ═══════════════════════════════════════════════ */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth < 992) {
        renderer.domElement.style.display = 'none';
        return;
      }
      renderer.domElement.style.display = '';
      var w = container.clientWidth;
      var h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, 150);
  });
})();
