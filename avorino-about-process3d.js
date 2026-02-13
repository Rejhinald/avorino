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

  // ── Roof (simple pitched) ──
  function buildRoof() {
    var g = new THREE.Group();
    var roofMat = new THREE.MeshStandardMaterial({ color: 0x8B7D6B, roughness: 0.85 });
    var overhang = 1.5;
    var roofW = ADU_W + overhang * 2;
    var roofD = (ADU_D + overhang * 2) / 2;
    var pitch = 3; // 3ft rise at ridge

    // Left slope
    var lGeo = new THREE.PlaneGeometry(roofW, Math.sqrt(roofD * roofD + pitch * pitch));
    var lSlope = new THREE.Mesh(lGeo, roofMat);
    var slopeAngle = Math.atan2(pitch, roofD);
    lSlope.rotation.set(-Math.PI / 2 + slopeAngle, 0, 0);
    lSlope.position.set(CX, WALL_H + pitch / 2, CZ - roofD / 2);
    lSlope.castShadow = true;
    lSlope.receiveShadow = true;
    g.add(lSlope);

    // Right slope
    var rGeo = new THREE.PlaneGeometry(roofW, Math.sqrt(roofD * roofD + pitch * pitch));
    var rSlope = new THREE.Mesh(rGeo, roofMat);
    rSlope.rotation.set(-Math.PI / 2 - slopeAngle, 0, 0);
    rSlope.position.set(CX, WALL_H + pitch / 2, CZ + roofD / 2);
    rSlope.castShadow = true;
    rSlope.receiveShadow = true;
    g.add(rSlope);

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
     NAV DOTS
     ═══════════════════════════════════════════════ */
  function buildNavDots(navEl, count) {
    navEl.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'about-process-nav-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('data-dot', String(i));
      navEl.appendChild(dot);
    }
  }

  function updateNavDots(navEl, activeIdx) {
    var dots = navEl.querySelectorAll('.about-process-nav-dot');
    dots.forEach(function (d, i) {
      if (i === activeIdx) d.classList.add('is-active');
      else d.classList.remove('is-active');
    });
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
          opacity: 1, y: 0, duration: 0.6,
          ease: 'power3.out', overwrite: true,
        });
      } else {
        var dir = i < idx ? -30 : 40;
        gsap.to(card, {
          opacity: 0, y: dir, duration: 0.4,
          ease: 'power2.in', overwrite: true,
        });
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
  function showModelOrbit() {
    if (!canvasEl || !camera) return;

    // Show all groups at full
    setGroupsVisible(true);
    aduGroups.roof.visible = true;

    gsap.to(canvasEl, { opacity: 1, duration: 0.6 });

    // Camera orbit — wider angle for portrait canvas
    gsap.to(camera.position, {
      x: CX + 30, y: 35, z: ADU_D + 35,
      duration: 3, ease: 'power2.inOut',
      onUpdate: function () {
        camera.lookAt(CX, 2, CZ);
        markDirty();
      },
    });
  }

  function hideModelOrbit() {
    if (canvasEl) gsap.to(canvasEl, { opacity: 0, duration: 0.3 });
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

  // ── Step 4: Permit Stamp ──
  function showStamp() {
    if (!fxEl) return;
    if (canvasEl) gsap.to(canvasEl, { opacity: 0.1, duration: 0.3 });

    if (!stampSvg) {
      stampSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      stampSvg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
      stampSvg.setAttribute('viewBox', '0 0 400 400');
      stampSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // Red overlay tint
      var tint = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      tint.setAttribute('width', '400');
      tint.setAttribute('height', '400');
      tint.setAttribute('fill', 'rgba(200,34,42,0.05)');
      stampSvg.appendChild(tint);

      // Stamp group
      var sg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      sg.setAttribute('transform', 'translate(200,200)');
      stampSvg.appendChild(sg);

      // Outer circle
      var c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c1.setAttribute('r', '100');
      c1.setAttribute('fill', 'none');
      c1.setAttribute('stroke', '#c8222a');
      c1.setAttribute('stroke-width', '5');
      sg.appendChild(c1);

      // Inner circle
      var c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c2.setAttribute('r', '85');
      c2.setAttribute('fill', 'none');
      c2.setAttribute('stroke', '#c8222a');
      c2.setAttribute('stroke-width', '2');
      sg.appendChild(c2);

      // PERMIT text (top arc)
      var t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t1.setAttribute('y', '-25');
      t1.setAttribute('text-anchor', 'middle');
      t1.setAttribute('fill', '#c8222a');
      t1.setAttribute('font-size', '22');
      t1.setAttribute('font-family', 'DM Sans, sans-serif');
      t1.setAttribute('font-weight', '700');
      t1.setAttribute('letter-spacing', '0.3em');
      t1.textContent = 'PERMIT';
      sg.appendChild(t1);

      // APPROVED text (large)
      var t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t2.setAttribute('y', '12');
      t2.setAttribute('text-anchor', 'middle');
      t2.setAttribute('fill', '#c8222a');
      t2.setAttribute('font-size', '30');
      t2.setAttribute('font-family', 'DM Serif Display, serif');
      t2.setAttribute('font-weight', '400');
      t2.textContent = 'APPROVED';
      sg.appendChild(t2);

      // Date
      var t3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t3.setAttribute('y', '40');
      t3.setAttribute('text-anchor', 'middle');
      t3.setAttribute('fill', '#c8222a');
      t3.setAttribute('font-size', '10');
      t3.setAttribute('font-family', 'DM Sans, sans-serif');
      t3.setAttribute('letter-spacing', '0.15em');
      t3.setAttribute('opacity', '0.7');
      t3.textContent = 'ORANGE COUNTY, CA';
      sg.appendChild(t3);

      // Stars
      [-60, 60].forEach(function (xOff) {
        var star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        star.setAttribute('x', String(xOff));
        star.setAttribute('y', '-22');
        star.setAttribute('text-anchor', 'middle');
        star.setAttribute('fill', '#c8222a');
        star.setAttribute('font-size', '14');
        star.textContent = '\u2605';
        sg.appendChild(star);
      });

      stampSvg._stamp = sg;
    }

    fxEl.appendChild(stampSvg);
    gsap.set(stampSvg, { opacity: 1 });

    var sg = stampSvg._stamp;
    gsap.set(sg, { scale: 2.5, rotation: -15, y: -300, opacity: 0, transformOrigin: 'center center' });

    gsap.to(sg, {
      scale: 1, rotation: -6, y: 0, opacity: 1,
      duration: 0.6, ease: 'back.out(2)',
      attr: { transform: 'translate(200,200) rotate(-6) scale(1)' },
      onComplete: function () {
        // Impact ripple
        gsap.fromTo(sg, { scale: 1 }, {
          scale: 1.03, duration: 0.15, yoyo: true, repeat: 3,
          ease: 'power2.inOut',
        });
      },
    });
    // Actually use gsap with the SVG group properly
    gsap.fromTo(stampSvg._stamp,
      { attr: { transform: 'translate(200,-100) rotate(-15) scale(2.5)' } },
      {
        attr: { transform: 'translate(200,200) rotate(-6) scale(1)' },
        duration: 0.7, ease: 'elastic.out(1, 0.4)',
      }
    );
  }

  function hideStamp() {
    if (stampSvg && stampSvg.parentElement) {
      gsap.to(stampSvg, {
        opacity: 0, duration: 0.3,
        onComplete: function () {
          if (stampSvg.parentElement) stampSvg.parentElement.removeChild(stampSvg);
        },
      });
    }
  }

  // ── Step 5: Construction — Building Animation ──
  function showConstruction() {
    if (!canvasEl || !camera) return;
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
    var tl = gsap.timeline({ delay: 0.3 });

    // Foundation rises
    gsap.set(aduGroups.foundation.position, { y: -2 });
    gsap.set(aduGroups.foundation, { visible: true });
    tl.to(aduGroups.foundation.position, {
      y: 0, duration: 0.8, ease: 'power2.out', onUpdate: markDirty,
    }, 0);

    // Floors appear
    gsap.set(aduGroups.floors, { visible: true });
    gsap.set(aduGroups.floors.scale, { y: 0 });
    tl.to(aduGroups.floors.scale, {
      y: 1, duration: 0.4, ease: 'power2.out', onUpdate: markDirty,
    }, 0.5);

    // Walls rise from ground
    gsap.set(aduGroups.walls, { visible: true });
    gsap.set(aduGroups.walls.scale, { y: 0 });
    aduGroups.walls.children.forEach(function (child) {
      child.traverse(function (obj) {
        if (obj.isMesh) {
          var geo = obj.geometry;
          if (geo && geo.boundingBox === null) geo.computeBoundingBox();
        }
      });
    });
    tl.to(aduGroups.walls.scale, {
      y: 1, duration: 1.2, ease: 'power2.out', onUpdate: markDirty,
    }, 0.8);

    // Doors + windows fade in
    gsap.set(aduGroups.openings, { visible: true });
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        gsap.set(obj.material, { opacity: 0, transparent: true });
      }
    });
    tl.add(function () {
      aduGroups.openings.traverse(function (obj) {
        if (obj.isMesh && obj.material) {
          gsap.to(obj.material, {
            opacity: 1, duration: 0.8, onUpdate: markDirty,
          });
        }
      });
    }, 2.0);

    // Furniture fades in piece by piece
    gsap.set(aduGroups.furniture, { visible: true });
    aduGroups.furniture.children.forEach(function (piece, i) {
      gsap.set(piece.scale, { x: 0, y: 0, z: 0 });
      tl.to(piece.scale, {
        x: 1, y: 1, z: 1, duration: 0.5,
        ease: 'back.out(1.5)', onUpdate: markDirty,
      }, 2.5 + i * 0.12);
    });

    // Roof descends
    gsap.set(aduGroups.roof, { visible: true });
    gsap.set(aduGroups.roof.position, { y: 10 });
    tl.to(aduGroups.roof.position, {
      y: 0, duration: 1.0, ease: 'power3.out', onUpdate: markDirty,
    }, 3.5);
  }

  function hideConstruction() {
    if (canvasEl) gsap.to(canvasEl, { opacity: 0, duration: 0.3 });
  }

  // ── Step 6: Warm Glow ──
  function showWarmGlow() {
    if (!canvasEl || !camera) return;

    setGroupsVisible(true);
    aduGroups.roof.visible = true;

    gsap.to(canvasEl, { opacity: 1, duration: 0.6 });

    // Camera pulls back to hero angle — warm evening view
    gsap.to(camera.position, {
      x: CX + 10, y: 32, z: ADU_D + 40,
      duration: 2, ease: 'power2.inOut',
      onUpdate: function () {
        camera.lookAt(CX, 3, CZ);
        markDirty();
      },
    });

    // Interior light warms up
    var light = aduGroups.interior.userData.light;
    if (light) {
      gsap.to(light, {
        intensity: 300, duration: 2, ease: 'power2.inOut',
        onUpdate: markDirty,
      });
    }

    // Window glass goes warm
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material && obj.material.transparent) {
        gsap.to(obj.material.color, {
          r: 1, g: 0.9, b: 0.5, duration: 2,
          ease: 'power2.inOut', onUpdate: markDirty,
        });
        gsap.to(obj.material, {
          opacity: 0.6, emissiveIntensity: 0.3, duration: 2,
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
        scrub: 0.5,
        snap: {
          snapTo: 1 / (totalSteps - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut',
        },
        onUpdate: function (self) {
          var step = Math.round(self.progress * (totalSteps - 1));
          step = Math.max(0, Math.min(totalSteps - 1, step));
          transitionToStep(cards, step, navEl);
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
