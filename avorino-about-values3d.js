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

  var camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* ═══════════════════════════════════════════════
     LIGHTS
     ═══════════════════════════════════════════════ */
  var ambientLight = new THREE.AmbientLight(0xf0ede8, 0.3);
  scene.add(ambientLight);

  var pointLight1 = new THREE.PointLight(0xc9a96e, 1.2, 60);
  pointLight1.position.set(10, 8, 15);
  scene.add(pointLight1);

  var pointLight2 = new THREE.PointLight(0xc8222a, 0.6, 50);
  pointLight2.position.set(-12, -6, 10);
  scene.add(pointLight2);

  /* ═══════════════════════════════════════════════
     NODE NETWORK — Abstract architectural composition
     Interconnected nodes forming a loose geometric structure.
     ═══════════════════════════════════════════════ */
  var nodeGroup = new THREE.Group();
  scene.add(nodeGroup);

  // Generate node positions — loosely clustered in a spherical arrangement
  var nodeCount = 24;
  var nodePositions = [];
  var nodeMeshes = [];

  for (var i = 0; i < nodeCount; i++) {
    // Distribute in a rough sphere with some randomness
    var phi = Math.acos(2 * Math.random() - 1);
    var theta = Math.random() * Math.PI * 2;
    var r = 8 + Math.random() * 6;
    var x = r * Math.sin(phi) * Math.cos(theta);
    var y = r * Math.sin(phi) * Math.sin(theta);
    var z = r * Math.cos(phi) * 0.5; // flatten z slightly

    nodePositions.push(new THREE.Vector3(x, y, z));

    // Small icosahedron at each node
    var size = 0.15 + Math.random() * 0.2;
    var geo = new THREE.IcosahedronGeometry(size, 0);
    var mat = new THREE.MeshStandardMaterial({
      color: i % 3 === 0 ? 0xc9a96e : 0xf0ede8,
      emissive: i % 3 === 0 ? 0xc9a96e : 0xf0ede8,
      emissiveIntensity: 0.4,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7 + Math.random() * 0.3,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(nodePositions[i]);
    mesh.userData = {
      basePos: nodePositions[i].clone(),
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      amplitude: 0.3 + Math.random() * 0.4,
    };
    nodeGroup.add(mesh);
    nodeMeshes.push(mesh);
  }

  /* ═══════════════════════════════════════════════
     CONNECTIONS — Gold wireframe lines between nearby nodes
     ═══════════════════════════════════════════════ */
  var connectionThreshold = 10;
  var linePositions = [];

  for (var a = 0; a < nodePositions.length; a++) {
    for (var b = a + 1; b < nodePositions.length; b++) {
      var dist = nodePositions[a].distanceTo(nodePositions[b]);
      if (dist < connectionThreshold) {
        linePositions.push(
          nodePositions[a].x, nodePositions[a].y, nodePositions[a].z,
          nodePositions[b].x, nodePositions[b].y, nodePositions[b].z
        );
      }
    }
  }

  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  var lineMat = new THREE.LineBasicMaterial({
    color: 0xc9a96e,
    transparent: true,
    opacity: 0.12,
    linewidth: 1,
  });
  var linesMesh = new THREE.LineSegments(lineGeo, lineMat);
  nodeGroup.add(linesMesh);

  /* ═══════════════════════════════════════════════
     PARTICLES — Sparse ambient drift
     ═══════════════════════════════════════════════ */
  var particleCount = 80;
  var particlePositions = new Float32Array(particleCount * 3);
  var particleSpeeds = [];

  for (var p = 0; p < particleCount; p++) {
    particlePositions[p * 3] = (Math.random() - 0.5) * 40;
    particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 40;
    particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 20;
    particleSpeeds.push({
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.003,
    });
  }

  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: 0xf0ede8,
    size: 0.08,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

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

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    var elapsed = clock.getElapsedTime();

    // Slow orbit rotation
    targetRotation.y = mouse.x * 0.15 + elapsed * 0.08;
    targetRotation.x = mouse.y * 0.08;

    nodeGroup.rotation.y += (targetRotation.y - nodeGroup.rotation.y) * 0.02;
    nodeGroup.rotation.x += (targetRotation.x - nodeGroup.rotation.x) * 0.02;

    // Breathing — subtle scale pulse
    var breathe = 1 + Math.sin(elapsed * 0.5) * 0.02;
    nodeGroup.scale.setScalar(breathe);

    // Animate individual nodes — gentle floating
    var posAttr = lineGeo.getAttribute('position');
    var lineIdx = 0;

    for (var n = 0; n < nodeMeshes.length; n++) {
      var mesh = nodeMeshes[n];
      var ud = mesh.userData;
      var offset = Math.sin(elapsed * ud.speed + ud.phase) * ud.amplitude;
      mesh.position.x = ud.basePos.x + Math.sin(elapsed * ud.speed * 0.7 + ud.phase) * ud.amplitude * 0.5;
      mesh.position.y = ud.basePos.y + offset;
      mesh.position.z = ud.basePos.z + Math.cos(elapsed * ud.speed * 0.4 + ud.phase) * ud.amplitude * 0.3;

      // Update node position reference for line updates
      nodePositions[n].copy(mesh.position);
    }

    // Update line positions to follow nodes
    lineIdx = 0;
    for (var la = 0; la < nodePositions.length; la++) {
      for (var lb = la + 1; lb < nodePositions.length; lb++) {
        var d = nodePositions[la].distanceTo(nodePositions[lb]);
        if (d < connectionThreshold) {
          posAttr.array[lineIdx * 6] = nodePositions[la].x;
          posAttr.array[lineIdx * 6 + 1] = nodePositions[la].y;
          posAttr.array[lineIdx * 6 + 2] = nodePositions[la].z;
          posAttr.array[lineIdx * 6 + 3] = nodePositions[lb].x;
          posAttr.array[lineIdx * 6 + 4] = nodePositions[lb].y;
          posAttr.array[lineIdx * 6 + 5] = nodePositions[lb].z;
          lineIdx++;
        }
      }
    }
    posAttr.needsUpdate = true;

    // Particle drift
    var pPositions = particleGeo.getAttribute('position');
    for (var pi = 0; pi < particleCount; pi++) {
      pPositions.array[pi * 3] += particleSpeeds[pi].x;
      pPositions.array[pi * 3 + 1] += particleSpeeds[pi].y;
      pPositions.array[pi * 3 + 2] += particleSpeeds[pi].z;

      // Wrap around
      if (Math.abs(pPositions.array[pi * 3]) > 20) particleSpeeds[pi].x *= -1;
      if (Math.abs(pPositions.array[pi * 3 + 1]) > 20) particleSpeeds[pi].y *= -1;
      if (Math.abs(pPositions.array[pi * 3 + 2]) > 10) particleSpeeds[pi].z *= -1;
    }
    pPositions.needsUpdate = true;

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
