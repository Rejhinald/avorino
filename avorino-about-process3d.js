(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     AVORINO PROCESS SECTION — SCROLL-LOCK + THREE.JS
     Separate CDN file for the About page process section.
     Requires: Three.js r149 (global build), GSAP + ScrollTrigger, Lenis
     ═══════════════════════════════════════════════ */

  // ── Skip on mobile or if dependencies missing ──
  var isMobile = window.innerWidth < 992;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* ═══════════════════════════════════════════════
     ADU FLOOR PLAN DATA
     30' x 20' — 1 bed / 1 bath / ~600 sqft
     All measurements in feet.
     Canvas (x,y) → Three.js (x, 0, z)
     ═══════════════════════════════════════════════ */
  var WALL_H = 9;
  var WALL_T = 0.5;
  var DOOR_W = 3;
  var DOOR_H = 6.67;
  var WIN_W = 3;
  var WIN_H = 4;
  var WIN_SILL = 3;
  var ADU_W = 30;
  var ADU_D = 20;
  var CX = ADU_W / 2; // 15 — center x
  var CZ = ADU_D / 2; // 10 — center z

  /*
     Layout:
     (0,0)───(15,0)───(30,0)
     │ Living │ Kitchen │
     (0,12)─(8,12)─(15,12)─(30,12)
     │ Bath │   Bedroom   │
     (0,20)──(8,20)───(30,20)
  */

  var wallDefs = [
    // Exterior south
    { s:[0,0], e:[15,0], opens:[
      { type:'door', pos:0.47, w:DOOR_W, h:DOOR_H, sill:0, front:true },
      { type:'window', pos:0.80, w:WIN_W, h:WIN_H, sill:WIN_SILL },
    ]},
    { s:[15,0], e:[30,0], opens:[
      { type:'window', pos:0.50, w:WIN_W, h:WIN_H, sill:WIN_SILL },
    ]},
    // Exterior east
    { s:[30,0], e:[30,12], opens:[] },
    { s:[30,12], e:[30,20], opens:[
      { type:'window', pos:0.50, w:WIN_W, h:WIN_H, sill:WIN_SILL },
    ]},
    // Exterior north
    { s:[30,20], e:[8,20], opens:[] },
    { s:[8,20], e:[0,20], opens:[] },
    // Exterior west
    { s:[0,20], e:[0,12], opens:[
      { type:'window', pos:0.50, w:WIN_W, h:WIN_H, sill:WIN_SILL },
    ]},
    { s:[0,12], e:[0,0], opens:[] },
    // Interior horizontal at z=12
    { s:[0,12], e:[8,12], opens:[
      { type:'door', pos:0.44, w:DOOR_W, h:DOOR_H, sill:0 },
    ]},
    { s:[8,12], e:[15,12], opens:[
      { type:'door', pos:0.57, w:DOOR_W, h:DOOR_H, sill:0 },
    ]},
    { s:[15,12], e:[30,12], opens:[] },
    // Interior vertical
    { s:[15,0], e:[15,12], opens:[
      { type:'door', pos:0.50, w:DOOR_W, h:DOOR_H, sill:0 },
    ]},
    { s:[8,12], e:[8,20], opens:[] },
  ];

  var roomDefs = [
    { name:'Living',   color:0xEBE5DB, verts:[[0,0],[15,0],[15,12],[0,12]] },
    { name:'Kitchen',  color:0xF0E6D3, verts:[[15,0],[30,0],[30,12],[15,12]] },
    { name:'Bedroom',  color:0xE8DFD5, verts:[[8,12],[30,12],[30,20],[8,20]] },
    { name:'Bathroom', color:0xD9E7ED, verts:[[0,12],[8,12],[8,20],[0,20]] },
  ];

  var furnitureDefs = [
    // Bedroom
    { type:'bed',        x:19,   z:16,   w:5,   d:6.5, rot:0 },
    { type:'nightstand', x:14.5, z:14.5, w:1.5, d:1.5, rot:0 },
    // Living
    { type:'sofa',         x:7,   z:8,   w:7,   d:3,   rot:0 },
    { type:'coffee_table', x:7,   z:4.5, w:3.5, d:2,   rot:0 },
    // Kitchen
    { type:'counter',      x:28,  z:6,   w:2,   d:10,  rot:0 },
    { type:'stove',        x:22,  z:1.2, w:2.5, d:2,   rot:0 },
    { type:'fridge',       x:18,  z:1.2, w:2.5, d:2.5, rot:0 },
    { type:'dining_table', x:21,  z:8,   w:4,   d:3,   rot:0 },
    // Bathroom
    { type:'toilet',  x:2,   z:14.5, w:1.5, d:2,   rot:0 },
    { type:'sink',    x:5.5, z:13.5, w:2,   d:1.5, rot:0 },
    { type:'bathtub', x:4,   z:18,   w:5,   d:2.5, rot:0 },
  ];

  /* ═══════════════════════════════════════════════
     THREE.JS SCENE
     ═══════════════════════════════════════════════ */
  var scene, camera, renderer, animFrameId;
  var aduGroups = {};
  var needsRender = true;

  function createScene(canvas) {
    scene = new THREE.Scene();
    scene.background = null; // transparent

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    resizeRenderer();

    // Camera — angled view looking at ADU center (wide FOV for portrait canvas)
    camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 300);
    camera.position.set(CX, 45, ADU_D + 45);
    camera.lookAt(CX, 0, CZ);

    // Lighting
    var hemi = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 0.5);
    scene.add(hemi);

    var sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(CX + 30, 50, CZ + 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    sun.shadow.camera.far = 120;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    var fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(CX - 20, 30, CZ - 20);
    scene.add(fill);

    var ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // Ground plane
    var groundGeo = new THREE.PlaneGeometry(120, 120);
    var groundMat = new THREE.MeshStandardMaterial({ color: 0xC8C8C8, roughness: 0.9 });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(CX, -0.01, CZ);
    ground.receiveShadow = true;
    scene.add(ground);

    // Build ADU groups
    aduGroups.foundation = buildFoundation();
    aduGroups.floors = buildFloors();
    aduGroups.walls = buildWalls();
    aduGroups.openings = buildOpenings();
    aduGroups.furniture = buildFurniture();
    aduGroups.roof = buildRoof();
    aduGroups.interior = buildInteriorLights();

    scene.add(aduGroups.foundation);
    scene.add(aduGroups.floors);
    scene.add(aduGroups.walls);
    scene.add(aduGroups.openings);
    scene.add(aduGroups.furniture);
    scene.add(aduGroups.roof);
    scene.add(aduGroups.interior);

    // Start render loop
    renderLoop();
  }

  function resizeRenderer() {
    if (!renderer) return;
    var canvas = renderer.domElement;
    var parent = canvas.parentElement;
    if (!parent) return;
    var w = parent.clientWidth;
    var h = parent.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      if (camera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      needsRender = true;
    }
  }

  function renderLoop() {
    animFrameId = requestAnimationFrame(renderLoop);
    resizeRenderer();
    if (needsRender && renderer && scene && camera) {
      renderer.render(scene, camera);
      needsRender = false;
    }
  }

  function markDirty() { needsRender = true; }

  /* ═══════════════════════════════════════════════
     GEOMETRY BUILDERS
     ═══════════════════════════════════════════════ */
  var wallMat = new THREE.MeshStandardMaterial({ color: 0xF0EDE8, roughness: 0.9 });

  // ── Foundation slab ──
  function buildFoundation() {
    var g = new THREE.Group();
    var geo = new THREE.BoxGeometry(ADU_W + 1, 0.5, ADU_D + 1);
    var mat = new THREE.MeshStandardMaterial({ color: 0xD0CBC4, roughness: 0.95 });
    var slab = new THREE.Mesh(geo, mat);
    slab.position.set(CX, -0.25, CZ);
    slab.receiveShadow = true;
    g.add(slab);
    return g;
  }

  // ── Room floors (ShapeGeometry) ──
  function buildFloors() {
    var g = new THREE.Group();
    roomDefs.forEach(function (room) {
      var shape = new THREE.Shape();
      shape.moveTo(room.verts[0][0], -room.verts[0][1]);
      for (var i = 1; i < room.verts.length; i++) {
        shape.lineTo(room.verts[i][0], -room.verts[i][1]);
      }
      shape.closePath();
      var geo = new THREE.ShapeGeometry(shape);
      var mat = new THREE.MeshStandardMaterial({
        color: room.color, roughness: 0.8, side: THREE.DoubleSide,
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.01;
      mesh.receiveShadow = true;
      g.add(mesh);
    });
    return g;
  }

  // ── Walls (multi-segment for openings) ──
  function buildWalls() {
    var g = new THREE.Group();
    wallDefs.forEach(function (wall) {
      var sx = wall.s[0], sz = wall.s[1];
      var ex = wall.e[0], ez = wall.e[1];
      var dx = ex - sx, dz = ez - sz;
      var length = Math.sqrt(dx * dx + dz * dz);
      var angle = Math.atan2(dz, dx);

      if (!wall.opens || wall.opens.length === 0) {
        // Simple wall — no openings
        var mesh = makeWallBox(length, WALL_H, WALL_T);
        mesh.position.set(length / 2, WALL_H / 2, 0);
        var wrap = new THREE.Group();
        wrap.position.set(sx, 0, sz);
        wrap.rotation.y = -angle;
        wrap.add(mesh);
        g.add(wrap);
        return;
      }

      // Wall with openings — multi-segment approach
      var wrap = new THREE.Group();
      wrap.position.set(sx, 0, sz);
      wrap.rotation.y = -angle;

      var sorted = wall.opens.slice().sort(function (a, b) {
        return a.pos - b.pos;
      });

      var lastEnd = 0;
      sorted.forEach(function (op) {
        var center = op.pos * length;
        var opStart = center - op.w / 2;
        var opEnd = center + op.w / 2;

        // Segment before opening
        if (opStart > lastEnd + 0.05) {
          var segLen = opStart - lastEnd;
          var m = makeWallBox(segLen, WALL_H, WALL_T);
          m.position.set(lastEnd + segLen / 2, WALL_H / 2, 0);
          wrap.add(m);
        }

        // Segment above opening
        var topH = WALL_H - (op.sill + op.h);
        if (topH > 0.05) {
          var m = makeWallBox(op.w, topH, WALL_T);
          m.position.set(center, op.sill + op.h + topH / 2, 0);
          wrap.add(m);
        }

        // Segment below opening (windows)
        if (op.sill > 0.05) {
          var m = makeWallBox(op.w, op.sill, WALL_T);
          m.position.set(center, op.sill / 2, 0);
          wrap.add(m);
        }

        lastEnd = opEnd;
      });

      // Segment after last opening
      if (lastEnd < length - 0.05) {
        var segLen = length - lastEnd;
        var m = makeWallBox(segLen, WALL_H, WALL_T);
        m.position.set(lastEnd + segLen / 2, WALL_H / 2, 0);
        wrap.add(m);
      }

      g.add(wrap);
    });
    return g;
  }

  function makeWallBox(w, h, t) {
    var geo = new THREE.BoxGeometry(w, h, t);
    var mesh = new THREE.Mesh(geo, wallMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // ── Doors & Windows (enhanced geometry) ──
  function buildOpenings() {
    var g = new THREE.Group();
    wallDefs.forEach(function (wall) {
      if (!wall.opens || !wall.opens.length) return;
      var sx = wall.s[0], sz = wall.s[1];
      var ex = wall.e[0], ez = wall.e[1];
      var dx = ex - sx, dz = ez - sz;
      var length = Math.sqrt(dx * dx + dz * dz);
      var angle = Math.atan2(dz, dx);

      wall.opens.forEach(function (op) {
        var center = op.pos * length;
        var wrap = new THREE.Group();
        wrap.position.set(sx, 0, sz);
        wrap.rotation.y = -angle;

        if (op.type === 'door') {
          buildDoor(wrap, center, op.w, op.h, op.front);
        } else {
          buildWindow(wrap, center, op.w, op.h, op.sill);
        }
        g.add(wrap);
      });
    });
    return g;
  }

  function buildDoor(parent, localX, w, h, isFront) {
    var frameMat = new THREE.MeshStandardMaterial({ color: 0x6B5040, roughness: 0.6 });
    var panelColor = isFront ? 0xc8222a : 0xA68B5B;
    var panelMat = new THREE.MeshStandardMaterial({ color: panelColor, roughness: 0.6 });

    // Frame
    var frame = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.2, h + 0.1, WALL_T + 0.1),
      frameMat
    );
    frame.position.set(localX, h / 2, 0);
    frame.castShadow = true;
    parent.add(frame);

    // Panel
    var panel = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.15, h - 0.15, 0.15),
      panelMat
    );
    panel.position.set(localX, h / 2, 0);
    panel.castShadow = true;
    parent.add(panel);

    // Recessed panel details (2 rectangles)
    var recessMat = new THREE.MeshStandardMaterial({
      color: isFront ? 0xa01c22 : 0x8B7355, roughness: 0.7,
    });
    var rTop = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, h * 0.35, 0.18), recessMat);
    rTop.position.set(localX, h * 0.65, 0);
    parent.add(rTop);
    var rBot = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, h * 0.3, 0.18), recessMat);
    rBot.position.set(localX, h * 0.28, 0);
    parent.add(rBot);

    // Handle (brass cylinder)
    var handleMat = new THREE.MeshStandardMaterial({ color: 0xB8860B, roughness: 0.3, metalness: 0.6 });
    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), handleMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(localX + w * 0.35, h * 0.45, WALL_T * 0.4);
    parent.add(handle);
  }

  function buildWindow(parent, localX, w, h, sill) {
    var frameMat = new THREE.MeshStandardMaterial({ color: 0x4A4A4A, roughness: 0.4, metalness: 0.2 });
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x87CEEB, roughness: 0.1, metalness: 0.1,
      transparent: true, opacity: 0.3,
    });

    // Frame
    var frame = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.15, h + 0.15, WALL_T + 0.1),
      frameMat
    );
    frame.position.set(localX, sill + h / 2, 0);
    frame.castShadow = true;
    parent.add(frame);

    // Glass
    var glass = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.2, h - 0.2, 0.05),
      glassMat
    );
    glass.position.set(localX, sill + h / 2, 0);
    parent.add(glass);

    // Mullions (cross bars)
    var mullMat = new THREE.MeshStandardMaterial({ color: 0x5A5A5A, roughness: 0.4 });
    // Horizontal
    var hBar = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, 0.08, 0.08), mullMat);
    hBar.position.set(localX, sill + h / 2, 0.04);
    parent.add(hBar);
    // Vertical
    var vBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.3, 0.08), mullMat);
    vBar.position.set(localX, sill + h / 2, 0.04);
    parent.add(vBar);

    // Sill (protruding ledge)
    var sillMat = new THREE.MeshStandardMaterial({ color: 0xE8E4E0, roughness: 0.8 });
    var sillMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.4, 0.1, 0.4),
      sillMat
    );
    sillMesh.position.set(localX, sill - 0.05, WALL_T * 0.5 + 0.15);
    parent.add(sillMesh);
  }

  // ── Furniture (enhanced multi-box compositions) ──
  function buildFurniture() {
    var g = new THREE.Group();
    furnitureDefs.forEach(function (f) {
      var piece = new THREE.Group();
      piece.position.set(f.x, 0, f.z);
      piece.rotation.y = (f.rot || 0) * Math.PI / 180;

      switch (f.type) {
        case 'bed': buildBed(piece, f.w, f.d); break;
        case 'nightstand': buildNightstand(piece, f.w, f.d); break;
        case 'sofa': buildSofa(piece, f.w, f.d); break;
        case 'coffee_table': buildCoffeeTable(piece, f.w, f.d); break;
        case 'counter': buildCounter(piece, f.w, f.d); break;
        case 'stove': buildStove(piece, f.w, f.d); break;
        case 'fridge': buildFridge(piece, f.w, f.d); break;
        case 'dining_table': buildDiningTable(piece, f.w, f.d); break;
        case 'toilet': buildToilet(piece, f.w, f.d); break;
        case 'sink': buildSink(piece, f.w, f.d); break;
        case 'bathtub': buildBathtub(piece, f.w, f.d); break;
      }

      g.add(piece);
    });
    return g;
  }

  function mat(color, rough, metal) {
    return new THREE.MeshStandardMaterial({
      color: color, roughness: rough || 0.7, metalness: metal || 0,
    });
  }

  function box(w, h, d, material) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  function buildBed(g, w, d) {
    // Frame
    var frame = box(w, 1.0, d, mat(0x8B7355));
    frame.position.y = 0.5;
    g.add(frame);
    // Mattress
    var mattress = box(w - 0.3, 0.8, d - 0.3, mat(0xFAF8F5, 0.9));
    mattress.position.y = 1.4;
    g.add(mattress);
    // Headboard
    var hb = box(w, 2.5, 0.3, mat(0x6B5040));
    hb.position.set(0, 1.25, -d / 2 + 0.15);
    g.add(hb);
    // Pillows
    var pillowMat = mat(0xF5F2EE, 0.95);
    var p1 = box(w * 0.35, 0.35, 0.9, pillowMat);
    p1.position.set(-w * 0.2, 2.0, -d / 2 + 1.0);
    g.add(p1);
    var p2 = box(w * 0.35, 0.35, 0.9, pillowMat);
    p2.position.set(w * 0.2, 2.0, -d / 2 + 1.0);
    g.add(p2);
  }

  function buildNightstand(g, w, d) {
    var body = box(w, 1.8, d, mat(0xA68B5B));
    body.position.y = 0.9;
    g.add(body);
    // Drawer line
    var line = box(w * 0.8, 0.04, 0.02, mat(0x6B5040));
    line.position.set(0, 0.9, d / 2 + 0.01);
    g.add(line);
  }

  function buildSofa(g, w, d) {
    var seatMat = mat(0x6B8E9F, 0.8);
    // Seat
    var seat = box(w, 1.2, d, seatMat);
    seat.position.y = 0.6;
    g.add(seat);
    // Back
    var back = box(w, 1.5, 0.6, seatMat);
    back.position.set(0, 1.95, -d / 2 + 0.3);
    g.add(back);
    // Left arm
    var arm1 = box(0.5, 1.4, d, seatMat);
    arm1.position.set(-w / 2 + 0.25, 0.9, 0);
    g.add(arm1);
    // Right arm
    var arm2 = box(0.5, 1.4, d, seatMat);
    arm2.position.set(w / 2 - 0.25, 0.9, 0);
    g.add(arm2);
  }

  function buildCoffeeTable(g, w, d) {
    var woodMat = mat(0x8B7355);
    // Top
    var top = box(w, 0.15, d, woodMat);
    top.position.y = 1.3;
    g.add(top);
    // Legs (4 cylinders)
    var legMat = mat(0x6B5040);
    var legGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function (p) {
      var leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(p[0] * (w / 2 - 0.2), 0.6, p[1] * (d / 2 - 0.2));
      leg.castShadow = true;
      g.add(leg);
    });
  }

  function buildDiningTable(g, w, d) {
    var woodMat = mat(0x8B7355);
    var top = box(w, 0.15, d, woodMat);
    top.position.y = 2.4;
    g.add(top);
    var legGeo = new THREE.CylinderGeometry(0.1, 0.08, 2.3, 8);
    var legMat = mat(0x6B5040);
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function (p) {
      var leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(p[0] * (w / 2 - 0.3), 1.15, p[1] * (d / 2 - 0.3));
      leg.castShadow = true;
      g.add(leg);
    });
  }

  function buildCounter(g, w, d) {
    // Cabinet body
    var cabinet = box(w, 2.8, d, mat(0xE8E4E0, 0.85));
    cabinet.position.y = 1.4;
    g.add(cabinet);
    // Countertop (marble white, slightly wider)
    var countertop = box(w + 0.3, 0.15, d + 0.15, mat(0xFAFAFA, 0.5, 0.05));
    countertop.position.y = 2.9;
    g.add(countertop);
  }

  function buildStove(g, w, d) {
    var body = box(w, 2.8, d, mat(0x404040, 0.5));
    body.position.y = 1.4;
    g.add(body);
    // Burners (4 small cylinders)
    var burnerMat = mat(0x2A2A2A, 0.3, 0.3);
    var burnerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 16);
    [[-0.45,-0.35],[0.45,-0.35],[-0.45,0.35],[0.45,0.35]].forEach(function (p) {
      var b = new THREE.Mesh(burnerGeo, burnerMat);
      b.position.set(p[0], 2.83, p[1]);
      g.add(b);
    });
  }

  function buildFridge(g, w, d) {
    var body = box(w, 5.8, d, mat(0xC0C0C0, 0.4, 0.1));
    body.position.y = 2.9;
    g.add(body);
    // Door seam line
    var seam = box(w * 0.9, 0.02, 0.02, mat(0x999999));
    seam.position.set(0, 3.6, d / 2 + 0.01);
    g.add(seam);
    // Handle
    var handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6),
      mat(0xB8B8B8, 0.3, 0.4)
    );
    handle.position.set(w * 0.35, 4.2, d / 2 + 0.06);
    g.add(handle);
  }

  function buildToilet(g, w, d) {
    // Base cylinder
    var baseMat = mat(0xFFFFFF, 0.9);
    var base = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.4, w * 0.45, 1.2, 16), baseMat);
    base.position.y = 0.6;
    base.castShadow = true;
    g.add(base);
    // Seat box (oval-ish)
    var seat = box(w, 0.3, d * 0.8, baseMat);
    seat.position.y = 1.35;
    g.add(seat);
    // Tank
    var tank = box(w * 0.8, 1.5, d * 0.3, baseMat);
    tank.position.set(0, 1.5, -d / 2 + d * 0.15);
    g.add(tank);
  }

  function buildSink(g, w, d) {
    // Cabinet
    var cabinet = box(w, 2.5, d, mat(0xE8E4E0, 0.85));
    cabinet.position.y = 1.25;
    g.add(cabinet);
    // Basin (sunken box)
    var basinMat = mat(0xFFFFFF, 0.6, 0.05);
    var rim = box(w * 0.7, 0.15, d * 0.6, basinMat);
    rim.position.y = 2.58;
    g.add(rim);
    // Faucet
    var faucetMat = mat(0xC0C0C0, 0.2, 0.6);
    var faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8), faucetMat);
    faucet.position.set(0, 2.9, -d * 0.25);
    g.add(faucet);
  }

  function buildBathtub(g, w, d) {
    var tubMat = mat(0xFFFFFF, 0.8);
    // Outer shell
    var outer = box(w, 1.8, d, tubMat);
    outer.position.y = 0.9;
    g.add(outer);
    // Inner cutout (slightly smaller, offset up)
    var innerMat = mat(0xF0F5FA, 0.5);
    var inner = box(w - 0.4, 1.4, d - 0.4, innerMat);
    inner.position.y = 1.2;
    g.add(inner);
  }

  // ── Roof (pitched, pivot-based for correct eave alignment) ──
  function buildRoof() {
    var g = new THREE.Group();
    var roofMat = new THREE.MeshStandardMaterial({
      color: 0x7A6E5D, roughness: 0.8, side: THREE.DoubleSide,
    });
    var ovh = 1.0;
    var pitch = 5;
    var roofW = ADU_W + ovh * 2;
    var halfRun = ADU_D / 2 + ovh;
    var slopeLen = Math.sqrt(halfRun * halfRun + pitch * pitch);
    var slopeAngle = Math.atan2(pitch, halfRun);
    var t = 0.2;

    // South slope — eave at (CX, WALL_H, -ovh), rises to ridge at (CX, WALL_H+pitch, CZ)
    var sPivot = new THREE.Group();
    sPivot.position.set(CX, WALL_H, -ovh);
    sPivot.rotation.x = -slopeAngle;
    var sPanel = new THREE.Mesh(new THREE.BoxGeometry(roofW, t, slopeLen), roofMat);
    sPanel.position.set(0, 0, slopeLen / 2);
    sPanel.castShadow = true;
    sPanel.receiveShadow = true;
    sPivot.add(sPanel);
    g.add(sPivot);

    // North slope — eave at (CX, WALL_H, ADU_D+ovh), rises to ridge
    var nPivot = new THREE.Group();
    nPivot.position.set(CX, WALL_H, ADU_D + ovh);
    nPivot.rotation.x = slopeAngle;
    var nPanel = new THREE.Mesh(new THREE.BoxGeometry(roofW, t, slopeLen), roofMat);
    nPanel.position.set(0, 0, -slopeLen / 2);
    nPanel.castShadow = true;
    nPanel.receiveShadow = true;
    nPivot.add(nPanel);
    g.add(nPivot);

    // Ridge beam (dark timber along the peak)
    var ridgeMat = new THREE.MeshStandardMaterial({ color: 0x5A4A3A, roughness: 0.7 });
    var ridge = new THREE.Mesh(new THREE.BoxGeometry(roofW + 0.2, 0.35, 0.35), ridgeMat);
    ridge.position.set(CX, WALL_H + pitch, CZ);
    ridge.castShadow = true;
    g.add(ridge);

    // Fascia boards (eave trim)
    var fasciaMat = new THREE.MeshStandardMaterial({ color: 0xE8E4E0, roughness: 0.8 });
    var sFascia = new THREE.Mesh(new THREE.BoxGeometry(roofW, 0.6, 0.15), fasciaMat);
    sFascia.position.set(CX, WALL_H - 0.1, -ovh);
    g.add(sFascia);
    var nFascia = new THREE.Mesh(new THREE.BoxGeometry(roofW, 0.6, 0.15), fasciaMat);
    nFascia.position.set(CX, WALL_H - 0.1, ADU_D + ovh);
    g.add(nFascia);

    return g;
  }

  // ── Interior lights (for warm glow in step 6) ──
  function buildInteriorLights() {
    var g = new THREE.Group();
    var light = new THREE.PointLight(0xFFD699, 0, 25, 2);
    light.position.set(CX, WALL_H - 1, CZ);
    g.add(light);
    g.userData.light = light;
    return g;
  }

  /* ═══════════════════════════════════════════════
     PROGRESS BAR + STEP COUNTER
     ═══════════════════════════════════════════════ */
  function buildNavDots(navEl, count) {
    navEl.innerHTML = '';

    // Step counter: "01 / 06"
    var counter = document.createElement('div');
    counter.className = 'about-process-counter';
    counter.style.cssText = 'font-family:DM Sans,sans-serif;font-size:13px;letter-spacing:0.15em;color:rgba(17,17,17,0.4);margin-bottom:16px;';
    var curr = document.createElement('span');
    curr.className = 'about-process-counter-current';
    curr.style.cssText = 'font-weight:600;color:#c8222a;font-size:18px;letter-spacing:0.05em;';
    curr.textContent = '01';
    var sep = document.createElement('span');
    sep.style.cssText = 'margin:0 8px;opacity:0.4;';
    sep.textContent = '/';
    var tot = document.createElement('span');
    tot.textContent = '0' + count;
    counter.appendChild(curr);
    counter.appendChild(sep);
    counter.appendChild(tot);
    navEl.appendChild(counter);

    // Progress track
    var track = document.createElement('div');
    track.className = 'about-process-track';
    track.style.cssText = 'position:relative;width:200px;height:2px;background:rgba(17,17,17,0.08);border-radius:1px;margin:0 auto;overflow:hidden;';
    var fill = document.createElement('div');
    fill.className = 'about-process-fill';
    fill.style.cssText = 'position:absolute;top:0;left:0;height:100%;width:0%;background:#c8222a;border-radius:1px;transition:width 0.3s ease;';
    track.appendChild(fill);
    navEl.appendChild(track);
  }

  function updateNavDots(navEl, activeIdx) {
    var curr = navEl.querySelector('.about-process-counter-current');
    if (curr) curr.textContent = activeIdx < 9 ? '0' + (activeIdx + 1) : String(activeIdx + 1);
  }

  function updateProgressBar(navEl, progress) {
    var fill = navEl.querySelector('.about-process-fill');
    if (fill) fill.style.width = (progress * 100).toFixed(1) + '%';
  }

  /* ═══════════════════════════════════════════════
     CARD TRANSITIONS
     ═══════════════════════════════════════════════ */
  var currentStep = -1;

  function transitionToStep(cards, idx, navEl) {
    if (idx === currentStep) return;
    var prevIdx = currentStep;
    currentStep = idx;

    cards.forEach(function (card, i) {
      if (i === idx) {
        gsap.to(card, {
          opacity: 1, y: 0, duration: 0.7,
          ease: 'expo.out', overwrite: true,
        });
      } else if (i === prevIdx) {
        // Previous card slides out in opposite direction
        var dir = i < idx ? -50 : 50;
        gsap.to(card, {
          opacity: 0, y: dir, duration: 0.5,
          ease: 'power3.in', overwrite: true,
        });
      } else {
        // Other cards just stay hidden
        gsap.set(card, { opacity: 0, y: 40 });
      }
    });

    updateNavDots(navEl, idx);
    triggerStepVisual(idx, prevIdx);
  }

  /* ═══════════════════════════════════════════════
     STEP VISUAL ANIMATIONS
     Each step has a unique visual on the left side.
     ═══════════════════════════════════════════════ */
  var canvasEl = null;
  var fxEl = null;
  var blueprintSvg = null;
  var moneyCanvas = null;
  var stampSvg = null;
  var moneyAnimId = null;

  function triggerStepVisual(idx, prevIdx) {
    if (isMobile) return;

    // Clean up previous step visuals
    cleanupStepVisual(prevIdx);

    switch (idx) {
      case 0: showBlueprint(); break;
      case 1: showModelOrbit(); break;
      case 2: showMoneyRain(); break;
      case 3: showStamp(); break;
      case 4: showConstruction(); break;
      case 5: showWarmGlow(); break;
    }
  }

  function cleanupStepVisual(idx) {
    if (idx === -1) return;
    switch (idx) {
      case 0: hideBlueprint(); break;
      case 1: hideModelOrbit(); break;
      case 2: hideMoneyRain(); break;
      case 3: hideStamp(); break;
      case 4: hideConstruction(); break;
      case 5: hideWarmGlow(); break;
    }
  }

  // ── Step 1: Blueprint Line Drawing ──
  function showBlueprint() {
    if (!fxEl) return;
    if (canvasEl) canvasEl.style.opacity = '0';

    if (!blueprintSvg) {
      blueprintSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      blueprintSvg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
      blueprintSvg.setAttribute('viewBox', '0 0 400 300');
      blueprintSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // Background grid dots
      var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      pattern.setAttribute('id', 'bp-grid');
      pattern.setAttribute('width', '20');
      pattern.setAttribute('height', '20');
      pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', '10');
      dot.setAttribute('cy', '10');
      dot.setAttribute('r', '0.8');
      dot.setAttribute('fill', 'rgba(200,200,220,0.3)');
      pattern.appendChild(dot);
      defs.appendChild(pattern);
      blueprintSvg.appendChild(defs);

      var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('width', '400');
      bg.setAttribute('height', '300');
      bg.setAttribute('fill', 'url(#bp-grid)');
      blueprintSvg.appendChild(bg);

      // Scale: 30ft → 300px, 20ft → 200px. Offset 50,50
      var ox = 50, oy = 50, sc = 10;
      var lines = [
        // Exterior
        [0,0,15,0],[15,0,30,0],[30,0,30,12],[30,12,30,20],
        [30,20,8,20],[8,20,0,20],[0,20,0,12],[0,12,0,0],
        // Interior
        [0,12,8,12],[8,12,15,12],[15,12,30,12],
        [15,0,15,12],[8,12,8,20],
      ];

      // Room labels
      var labels = [
        { text: 'LIVING', x: 7.5, y: 6 },
        { text: 'KITCHEN', x: 22.5, y: 6 },
        { text: 'BEDROOM', x: 19, y: 16 },
        { text: 'BATH', x: 4, y: 16 },
      ];

      // Dimension lines
      var dims = [
        { text: "30'", x1: 0, y1: -1.5, x2: 30, y2: -1.5 },
        { text: "20'", x1: -1.5, y1: 0, x2: -1.5, y2: 20 },
      ];

      var allPaths = [];

      lines.forEach(function (l) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        path.setAttribute('x1', String(ox + l[0] * sc));
        path.setAttribute('y1', String(oy + l[1] * sc));
        path.setAttribute('x2', String(ox + l[2] * sc));
        path.setAttribute('y2', String(oy + l[3] * sc));
        path.setAttribute('stroke', 'rgba(220,225,240,0.9)');
        path.setAttribute('stroke-width', '1.5');
        var len = Math.sqrt(Math.pow((l[2] - l[0]) * sc, 2) + Math.pow((l[3] - l[1]) * sc, 2));
        path.setAttribute('stroke-dasharray', String(len));
        path.setAttribute('stroke-dashoffset', String(len));
        blueprintSvg.appendChild(path);
        allPaths.push({ el: path, len: len });
      });

      labels.forEach(function (lb) {
        var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', String(ox + lb.x * sc));
        txt.setAttribute('y', String(oy + lb.y * sc));
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('fill', 'rgba(200,200,220,0.6)');
        txt.setAttribute('font-size', '9');
        txt.setAttribute('font-family', 'DM Sans, sans-serif');
        txt.setAttribute('letter-spacing', '0.15em');
        txt.setAttribute('opacity', '0');
        txt.textContent = lb.text;
        blueprintSvg.appendChild(txt);
        allPaths.push({ el: txt, isText: true });
      });

      dims.forEach(function (dm) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(ox + dm.x1 * sc));
        line.setAttribute('y1', String(oy + dm.y1 * sc));
        line.setAttribute('x2', String(ox + dm.x2 * sc));
        line.setAttribute('y2', String(oy + dm.y2 * sc));
        line.setAttribute('stroke', 'rgba(200,34,42,0.4)');
        line.setAttribute('stroke-width', '0.5');
        line.setAttribute('opacity', '0');
        blueprintSvg.appendChild(line);

        var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', String(ox + (dm.x1 + dm.x2) / 2 * sc));
        txt.setAttribute('y', String(oy + (dm.y1 + dm.y2) / 2 * sc - 3));
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('fill', 'rgba(200,34,42,0.6)');
        txt.setAttribute('font-size', '8');
        txt.setAttribute('font-family', 'DM Sans, sans-serif');
        txt.setAttribute('opacity', '0');
        txt.textContent = dm.text;
        blueprintSvg.appendChild(txt);
        allPaths.push({ el: line, isText: true });
        allPaths.push({ el: txt, isText: true });
      });

      blueprintSvg._paths = allPaths;
    }

    fxEl.appendChild(blueprintSvg);
    gsap.set(blueprintSvg, { opacity: 0 });
    gsap.to(blueprintSvg, { opacity: 1, duration: 0.5 });

    // Animate lines drawing in
    var paths = blueprintSvg._paths;
    paths.forEach(function (p, i) {
      if (p.isText) {
        gsap.to(p.el, { opacity: 1, duration: 0.6, delay: 0.8 + i * 0.05 });
      } else {
        gsap.to(p.el, {
          strokeDashoffset: 0, duration: 1.0,
          delay: i * 0.08, ease: 'power2.inOut',
        });
      }
    });
  }

  function hideBlueprint() {
    if (blueprintSvg && blueprintSvg.parentElement) {
      gsap.to(blueprintSvg, {
        opacity: 0, duration: 0.3,
        onComplete: function () {
          if (blueprintSvg.parentElement) blueprintSvg.parentElement.removeChild(blueprintSvg);
          // Reset for next time
          var paths = blueprintSvg._paths;
          if (paths) paths.forEach(function (p) {
            if (p.isText) gsap.set(p.el, { opacity: 0 });
            else gsap.set(p.el, { strokeDashoffset: p.len });
          });
        }
      });
    }
  }

  // ── Step 2: 3D Model Orbit ──
  var orbitTween = null;

  function showModelOrbit() {
    if (!canvasEl || !camera) return;

    // Show all groups at full
    setGroupsVisible(true);
    // Reset materials in case coming from warm glow
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material && obj.material.transparent) {
        obj.material.opacity = 0.3;
        obj.material.color.setRGB(0.529, 0.808, 0.922);
        obj.material.needsUpdate = true;
      }
    });

    // Start camera from initial position for smooth reveal
    camera.position.set(CX, 45, ADU_D + 45);
    camera.lookAt(CX, 2, CZ);
    markDirty();

    gsap.to(canvasEl, { opacity: 1, duration: 0.8, ease: 'power2.out' });

    // Camera orbit — smooth cinematic sweep
    orbitTween = gsap.to(camera.position, {
      x: CX + 30, y: 30, z: ADU_D + 30,
      duration: 4, ease: 'power1.inOut',
      onUpdate: function () {
        camera.lookAt(CX, 2, CZ);
        markDirty();
      },
    });
  }

  function hideModelOrbit() {
    if (orbitTween) { orbitTween.kill(); orbitTween = null; }
    if (canvasEl) gsap.to(canvasEl, { opacity: 0, duration: 0.4 });
  }

  // ── Step 3: Money Rain ──
  function showMoneyRain() {
    if (!fxEl) return;
    if (canvasEl) {
      gsap.to(canvasEl, { opacity: 0.15, duration: 0.4 });
    }

    if (!moneyCanvas) {
      moneyCanvas = document.createElement('canvas');
      moneyCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    }
    fxEl.appendChild(moneyCanvas);
    gsap.set(moneyCanvas, { opacity: 0 });
    gsap.to(moneyCanvas, { opacity: 1, duration: 0.4 });

    var ctx = moneyCanvas.getContext('2d');
    var w = fxEl.clientWidth;
    var h = fxEl.clientHeight;
    moneyCanvas.width = w;
    moneyCanvas.height = h;

    var bills = [];
    for (var i = 0; i < 50; i++) {
      bills.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        w: 28 + Math.random() * 20,
        h: 14 + Math.random() * 10,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        vy: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.8,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }

    function animateMoney() {
      moneyAnimId = requestAnimationFrame(animateMoney);
      ctx.clearRect(0, 0, w, h);

      bills.forEach(function (b) {
        b.y += b.vy;
        b.x += b.vx;
        b.rot += b.rotSpeed;
        if (b.y > h + 30) {
          b.y = -30;
          b.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = b.opacity;

        // Bill rectangle
        ctx.fillStyle = '#4a8c5c';
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.strokeStyle = '#2d6b3f';
        ctx.lineWidth = 1;
        ctx.strokeRect(-b.w / 2 + 2, -b.h / 2 + 2, b.w - 4, b.h - 4);

        // $ symbol
        ctx.fillStyle = '#2d6b3f';
        ctx.font = 'bold ' + Math.round(b.h * 0.7) + 'px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);

        ctx.restore();
      });
    }
    animateMoney();
  }

  function hideMoneyRain() {
    if (moneyAnimId) { cancelAnimationFrame(moneyAnimId); moneyAnimId = null; }
    if (moneyCanvas && moneyCanvas.parentElement) {
      gsap.to(moneyCanvas, {
        opacity: 0, duration: 0.3,
        onComplete: function () {
          if (moneyCanvas.parentElement) moneyCanvas.parentElement.removeChild(moneyCanvas);
        }
      });
    }
  }

  // ── Step 4: Permit Stamp (Premium Wax Seal) ──
  var stampTl = null;

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function showStamp() {
    if (!fxEl) return;
    if (canvasEl) gsap.to(canvasEl, { opacity: 0.06, duration: 0.5 });
    if (stampTl) { stampTl.kill(); stampTl = null; }

    if (!stampSvg) {
      stampSvg = svgEl('svg', {
        viewBox: '0 0 500 500',
        preserveAspectRatio: 'xMidYMid meet',
      });
      stampSvg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';

      // SVG filter for embossed/3D seal effect
      var defs = svgEl('defs');
      // Drop shadow
      var fShadow = svgEl('filter', { id: 'seal-shadow', x: '-20%', y: '-20%', width: '140%', height: '140%' });
      var feOff = svgEl('feOffset', { dx: '0', dy: '4', in: 'SourceAlpha', result: 'off' });
      var feBlur = svgEl('feGaussianBlur', { stdDeviation: '8', in: 'off', result: 'blur' });
      var feColor = svgEl('feFlood', { 'flood-color': 'rgba(0,0,0,0.15)', result: 'color' });
      var feComp = svgEl('feComposite', { in: 'color', in2: 'blur', operator: 'in', result: 'shadow' });
      var feMerge = svgEl('feMerge');
      feMerge.appendChild(svgEl('feMergeNode', { in: 'shadow' }));
      feMerge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
      fShadow.appendChild(feOff);
      fShadow.appendChild(feBlur);
      fShadow.appendChild(feColor);
      fShadow.appendChild(feComp);
      fShadow.appendChild(feMerge);
      defs.appendChild(fShadow);

      // Radial gradient for wax seal body
      var grad = svgEl('radialGradient', { id: 'seal-grad', cx: '40%', cy: '35%', r: '60%' });
      grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': '#d4343c' }));
      grad.appendChild(svgEl('stop', { offset: '50%', 'stop-color': '#b8202a' }));
      grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#8a1820' }));
      defs.appendChild(grad);

      // Inner highlight gradient
      var hGrad = svgEl('radialGradient', { id: 'seal-highlight', cx: '35%', cy: '30%', r: '50%' });
      hGrad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': 'rgba(255,255,255,0.15)' }));
      hGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': 'rgba(255,255,255,0)' }));
      defs.appendChild(hGrad);

      stampSvg.appendChild(defs);

      // Main stamp group with shadow filter
      var sg = svgEl('g', { filter: 'url(#seal-shadow)' });
      stampSvg.appendChild(sg);

      // Wax seal body — filled circle with gradient
      sg.appendChild(svgEl('circle', {
        r: '130', fill: 'url(#seal-grad)',
      }));

      // Glossy highlight overlay
      sg.appendChild(svgEl('circle', {
        r: '130', fill: 'url(#seal-highlight)',
      }));

      // Outer embossed rim
      sg.appendChild(svgEl('circle', {
        r: '124', fill: 'none', stroke: 'rgba(255,255,255,0.12)', 'stroke-width': '2',
      }));
      sg.appendChild(svgEl('circle', {
        r: '118', fill: 'none', stroke: 'rgba(255,255,255,0.08)', 'stroke-width': '1',
      }));

      // Inner embossed rim
      sg.appendChild(svgEl('circle', {
        r: '100', fill: 'none', stroke: 'rgba(255,255,255,0.1)', 'stroke-width': '1',
      }));

      // Decorative dot border ring
      var dotCount = 48;
      for (var di = 0; di < dotCount; di++) {
        var angle = (di / dotCount) * Math.PI * 2;
        var dx = Math.cos(angle) * 111;
        var dy = Math.sin(angle) * 111;
        sg.appendChild(svgEl('circle', {
          cx: String(dx.toFixed(1)), cy: String(dy.toFixed(1)),
          r: '1.5', fill: 'rgba(255,255,255,0.15)',
        }));
      }

      // Divider lines (embossed look)
      sg.appendChild(svgEl('line', {
        x1: '-85', y1: '-14', x2: '-35', y2: '-14',
        stroke: 'rgba(255,255,255,0.12)', 'stroke-width': '1',
      }));
      sg.appendChild(svgEl('line', {
        x1: '35', y1: '-14', x2: '85', y2: '-14',
        stroke: 'rgba(255,255,255,0.12)', 'stroke-width': '1',
      }));
      sg.appendChild(svgEl('line', {
        x1: '-85', y1: '24', x2: '-35', y2: '24',
        stroke: 'rgba(255,255,255,0.12)', 'stroke-width': '1',
      }));
      sg.appendChild(svgEl('line', {
        x1: '35', y1: '24', x2: '85', y2: '24',
        stroke: 'rgba(255,255,255,0.12)', 'stroke-width': '1',
      }));

      // Stars
      [-62, 62].forEach(function (xOff) {
        var star = svgEl('text', {
          x: String(xOff), y: '-9', 'text-anchor': 'middle',
          fill: 'rgba(255,255,255,0.7)', 'font-size': '16',
        });
        star.textContent = '\u2605';
        sg.appendChild(star);
      });

      // "CITY OF" text
      sg.appendChild(Object.assign(svgEl('text', {
        y: '-58', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.6)',
        'font-size': '10', 'font-family': 'DM Sans, sans-serif',
        'font-weight': '700', 'letter-spacing': '0.4em',
      }), { textContent: 'CITY OF' }));

      // "ORANGE COUNTY"
      sg.appendChild(Object.assign(svgEl('text', {
        y: '-40', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.7)',
        'font-size': '13', 'font-family': 'DM Sans, sans-serif',
        'font-weight': '700', 'letter-spacing': '0.25em',
      }), { textContent: 'ORANGE COUNTY' }));

      // "APPROVED" — hero text
      sg.appendChild(Object.assign(svgEl('text', {
        y: '14', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.95)',
        'font-size': '38', 'font-family': 'DM Serif Display, serif',
        'font-weight': '400', 'letter-spacing': '0.06em',
      }), { textContent: 'APPROVED' }));

      // "BUILDING PERMIT"
      sg.appendChild(Object.assign(svgEl('text', {
        y: '46', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.6)',
        'font-size': '11', 'font-family': 'DM Sans, sans-serif',
        'font-weight': '600', 'letter-spacing': '0.3em',
      }), { textContent: 'BUILDING PERMIT' }));

      // Permit number
      sg.appendChild(Object.assign(svgEl('text', {
        y: '66', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.35)',
        'font-size': '8', 'font-family': 'DM Sans, sans-serif',
        'letter-spacing': '0.12em',
      }), { textContent: 'NO. 2025-ADU-04782  \u2022  CALIFORNIA' }));

      // Bottom text
      sg.appendChild(Object.assign(svgEl('text', {
        y: '82', 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.3)',
        'font-size': '8', 'font-family': 'DM Sans, sans-serif',
        'font-weight': '600', 'letter-spacing': '0.2em',
      }), { textContent: 'RESIDENTIAL CONSTRUCTION' }));

      stampSvg._stamp = sg;
    }

    fxEl.appendChild(stampSvg);
    gsap.set(stampSvg, { opacity: 0 });

    var sg = stampSvg._stamp;

    // Start: seal above viewport, large, rotated
    sg.setAttribute('transform', 'translate(250,-200) rotate(-8) scale(2.5)');

    stampTl = gsap.timeline();

    // Fade in background
    stampTl.to(stampSvg, { opacity: 1, duration: 0.15 }, 0);

    // Seal presses down with authority — heavy, not bouncy
    stampTl.to(sg, {
      attr: { transform: 'translate(250,250) rotate(-4) scale(1)' },
      duration: 0.55, ease: 'power4.out',
    }, 0.05);

    // Brief compression squash on impact
    stampTl.to(sg, {
      attr: { transform: 'translate(250,252) rotate(-4) scale(1.03,0.97)' },
      duration: 0.08, ease: 'power2.in',
    }, 0.58);

    // Settle back to rest
    stampTl.to(sg, {
      attr: { transform: 'translate(250,250) rotate(-4) scale(1)' },
      duration: 0.3, ease: 'power2.out',
    }, 0.66);

    // Subtle screen shake on impact
    stampTl.fromTo(fxEl,
      { x: 0, y: 0 },
      {
        x: 3, y: -2, duration: 0.04, yoyo: true, repeat: 3,
        ease: 'none',
        onComplete: function () { gsap.set(fxEl, { x: 0, y: 0 }); },
      },
    0.58);
  }

  function hideStamp() {
    if (stampTl) { stampTl.kill(); stampTl = null; }
    if (stampSvg && stampSvg.parentElement) {
      gsap.to(stampSvg, {
        opacity: 0, duration: 0.35,
        onComplete: function () {
          if (stampSvg.parentElement) stampSvg.parentElement.removeChild(stampSvg);
        },
      });
    }
    if (fxEl) gsap.set(fxEl, { x: 0, y: 0 });
  }

  // ── Step 5: Construction — Building Animation ──
  var constructionTl = null;

  function showConstruction() {
    if (!canvasEl || !camera) return;

    // Kill any previous construction timeline
    if (constructionTl) { constructionTl.kill(); constructionTl = null; }

    // Reset ALL groups to invisible first
    setGroupsVisible(false);
    // Reset all materials to fully opaque
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = false;
        obj.material.opacity = 1;
        obj.material.needsUpdate = true;
      }
    });
    // Reset furniture scales
    aduGroups.furniture.children.forEach(function (piece) {
      piece.scale.set(1, 1, 1);
    });
    // Reset positions
    aduGroups.foundation.position.y = 0;
    aduGroups.walls.scale.set(1, 1, 1);
    aduGroups.roof.position.y = 0;

    gsap.to(canvasEl, { opacity: 1, duration: 0.5 });

    // Camera wider angle — pulled back for full building view
    gsap.to(camera.position, {
      x: CX - 20, y: 50, z: ADU_D + 50,
      duration: 1.2, ease: 'power2.inOut',
      onUpdate: function () {
        camera.lookAt(CX, 2, CZ);
        markDirty();
      },
    });

    // Sequential build animation
    constructionTl = gsap.timeline({ delay: 0.3 });

    // Foundation rises
    aduGroups.foundation.position.y = -2;
    aduGroups.foundation.visible = true;
    constructionTl.to(aduGroups.foundation.position, {
      y: 0, duration: 0.8, ease: 'power2.out', onUpdate: markDirty,
    }, 0);

    // Floors appear
    aduGroups.floors.visible = true;
    aduGroups.floors.scale.y = 0;
    constructionTl.to(aduGroups.floors.scale, {
      y: 1, duration: 0.4, ease: 'power2.out', onUpdate: markDirty,
    }, 0.5);

    // Walls rise from ground
    aduGroups.walls.visible = true;
    aduGroups.walls.scale.y = 0;
    constructionTl.to(aduGroups.walls.scale, {
      y: 1, duration: 1.2, ease: 'power2.out', onUpdate: markDirty,
    }, 0.8);

    // Doors + windows fade in
    aduGroups.openings.visible = true;
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = 0;
        obj.material.needsUpdate = true;
      }
    });
    constructionTl.add(function () {
      aduGroups.openings.traverse(function (obj) {
        if (obj.isMesh && obj.material) {
          gsap.to(obj.material, {
            opacity: 1, duration: 0.8, onUpdate: markDirty,
          });
        }
      });
    }, 2.0);

    // Furniture fades in piece by piece
    aduGroups.furniture.visible = true;
    aduGroups.furniture.children.forEach(function (piece, i) {
      piece.scale.set(0, 0, 0);
      constructionTl.to(piece.scale, {
        x: 1, y: 1, z: 1, duration: 0.5,
        ease: 'back.out(1.5)', onUpdate: markDirty,
      }, 2.5 + i * 0.12);
    });

    // Roof descends
    aduGroups.roof.visible = true;
    aduGroups.roof.position.y = 10;
    constructionTl.to(aduGroups.roof.position, {
      y: 0, duration: 1.0, ease: 'power3.out', onUpdate: markDirty,
    }, 3.5);
  }

  function hideConstruction() {
    if (constructionTl) { constructionTl.kill(); constructionTl = null; }
    if (canvasEl) gsap.to(canvasEl, { opacity: 0, duration: 0.3 });
  }

  // ── Step 6: Warm Glow ──
  function showWarmGlow() {
    if (!canvasEl || !camera) return;

    // Ensure all groups visible and materials reset
    setGroupsVisible(true);
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = obj.material.opacity || 1;
        obj.material.needsUpdate = true;
      }
    });
    // Reset furniture/wall positions in case coming from construction
    aduGroups.foundation.position.y = 0;
    aduGroups.walls.scale.set(1, 1, 1);
    aduGroups.roof.position.y = 0;
    aduGroups.furniture.children.forEach(function (p) { p.scale.set(1, 1, 1); });

    gsap.to(canvasEl, { opacity: 1, duration: 0.8, ease: 'power2.out' });

    // Camera pulls back to hero angle — warm evening view
    gsap.to(camera.position, {
      x: CX + 10, y: 32, z: ADU_D + 40,
      duration: 2.5, ease: 'power2.inOut',
      onUpdate: function () {
        camera.lookAt(CX, 3, CZ);
        markDirty();
      },
    });

    // Interior light warms up
    var light = aduGroups.interior.userData.light;
    if (light) {
      gsap.to(light, {
        intensity: 300, duration: 2.5, ease: 'power2.inOut',
        onUpdate: markDirty,
      });
    }

    // Window glass goes warm golden
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material && obj.material.transparent) {
        gsap.to(obj.material.color, {
          r: 1, g: 0.9, b: 0.5, duration: 2.5,
          ease: 'power2.inOut', onUpdate: markDirty,
        });
        gsap.to(obj.material, {
          opacity: 0.6, duration: 2.5,
          onUpdate: markDirty,
        });
      }
    });
  }

  function hideWarmGlow() {
    // Reset interior light
    var light = aduGroups.interior.userData.light;
    if (light) gsap.to(light, { intensity: 0, duration: 0.3, onUpdate: markDirty });

    // Reset window glass
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material && obj.material.transparent) {
        gsap.to(obj.material.color, {
          r: 0.529, g: 0.808, b: 0.922, duration: 0.3, onUpdate: markDirty,
        });
        gsap.to(obj.material, { opacity: 0.3, duration: 0.3, onUpdate: markDirty });
      }
    });

    if (canvasEl) gsap.to(canvasEl, { opacity: 0, duration: 0.3 });
  }

  function setGroupsVisible(visible) {
    Object.keys(aduGroups).forEach(function (key) {
      aduGroups[key].visible = visible;
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL-LOCK INIT
     ═══════════════════════════════════════════════ */
  function initProcessSection() {
    var section = document.getElementById('about-process');
    if (!section) return;
    var pinned = section.querySelector('[data-process-pinned]');
    if (!pinned) return;

    var visualEl = section.querySelector('[data-process-visual]');
    fxEl = section.querySelector('[data-process-fx]');
    var cardsWrap = section.querySelector('[data-process-cards]');
    var navEl = section.querySelector('[data-process-nav]');
    var cards = section.querySelectorAll('[data-process-card]');
    if (!cards.length) return;

    var totalSteps = cards.length;

    // Build nav dots
    if (navEl) buildNavDots(navEl, totalSteps);

    // Initialize cards — first card visible, rest hidden
    cards.forEach(function (card, i) {
      gsap.set(card, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
    });
    currentStep = 0;

    if (!isMobile && typeof THREE !== 'undefined' && visualEl) {
      // Create Three.js canvas
      canvasEl = document.createElement('canvas');
      canvasEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;';
      visualEl.insertBefore(canvasEl, visualEl.firstChild);

      // Build scene
      createScene(canvasEl);

      // Initially hide all groups (construction step reveals them)
      setGroupsVisible(false);
    }

    // Trigger first step visual
    triggerStepVisual(0, -1);

    if (!isMobile) {
      // Scroll-lock: pin the section and scrub through steps
      ScrollTrigger.create({
        trigger: pinned,
        start: 'top top',
        end: '+=' + (window.innerHeight * totalSteps),
        pin: true,
        scrub: true,
        snap: {
          snapTo: 1 / (totalSteps - 1),
          duration: { min: 0.25, max: 0.6 },
          delay: 0.15,
          ease: 'power2.inOut',
        },
        onUpdate: function (self) {
          var step = Math.round(self.progress * (totalSteps - 1));
          step = Math.max(0, Math.min(totalSteps - 1, step));
          transitionToStep(cards, step, navEl);
          updateProgressBar(navEl, self.progress);
        },
      });
    }

    // Handle resize
    window.addEventListener('resize', function () {
      if (renderer) resizeRenderer();
    });
  }

  /* ═══════════════════════════════════════════════
     MOBILE FALLBACK
     Cards just stack with fade-up animations.
     ═══════════════════════════════════════════════ */
  function initProcessMobile() {
    var section = document.getElementById('about-process');
    if (!section) return;
    var cards = section.querySelectorAll('[data-process-card]');
    if (!cards.length) return;

    // Make cards visible and static
    cards.forEach(function (card, i) {
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: card, start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  function boot() {
    if (isMobile) {
      initProcessMobile();
    } else {
      initProcessSection();
    }
  }

  // Script may load after DOMContentLoaded has already fired (CDN async)
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
