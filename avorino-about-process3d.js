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
    // Exterior north — REMOVED (cutaway: lets camera see inside)
    // Exterior west — REMOVED (cutaway: lets camera see inside)
    // Interior horizontal at z=12 (behind bed/bath — semi-transparent for visibility)
    { s:[0,12], e:[8,12], interior:true, semiTrans:true, opens:[
      { type:'door', pos:0.44, w:DOOR_W, h:DOOR_H, sill:0 },
    ]},
    { s:[8,12], e:[15,12], interior:true, semiTrans:true, opens:[
      { type:'door', pos:0.57, w:DOOR_W, h:DOOR_H, sill:0 },
    ]},
    { s:[15,12], e:[30,12], interior:true, semiTrans:true, opens:[] },
    // Interior vertical
    { s:[15,0], e:[15,12], interior:true, opens:[
      { type:'door', pos:0.50, w:DOOR_W, h:DOOR_H, sill:0 },
    ]},
    { s:[8,12], e:[8,20], interior:true, semiTrans:true, opens:[] },
  ];

  var roomDefs = [
    { name:'Living',   color:0xC4A882, rough:0.9, verts:[[0,0],[15,0],[15,12],[0,12]] },      // warm oak wood
    { name:'Kitchen',  color:0xE8E2D8, rough:0.6, verts:[[15,0],[30,0],[30,12],[15,12]] },    // light stone tile
    { name:'Bedroom',  color:0xBFA477, rough:0.85, verts:[[8,12],[30,12],[30,20],[8,20]] },    // honey wood
    { name:'Bathroom', color:0xD4D8DB, rough:0.4, verts:[[0,12],[8,12],[8,20],[0,20]] },      // cool ceramic tile
  ];

  var furnitureDefs = [
    // Bedroom
    { type:'bed',        x:19,   z:16,   w:5,   d:6.5, rot:0 },
    { type:'nightstand', x:22.5, z:13.5, w:1.5, d:1.5, rot:0 },  // right of bed, against back wall
    { type:'rug',        x:19,   z:16,   w:6.5, d:5,   rot:0, color:0x6B7B8D },  // muted blue-gray bedroom rug
    // Living
    { type:'sofa',         x:7,   z:8,   w:7,   d:3,   rot:0 },
    { type:'coffee_table', x:7,   z:4.5, w:3.5, d:2,   rot:0 },
    { type:'rug',          x:7,   z:6,   w:9,   d:6,   rot:0, color:0x8B5E3C },  // warm brown living rug
    // Kitchen
    { type:'counter',      x:28,  z:6,   w:2,   d:10,  rot:0 },
    { type:'stove',        x:22,  z:1.2, w:2.5, d:2,   rot:0 },
    { type:'fridge',       x:18,  z:1.2, w:2.5, d:2.5, rot:0 },
    { type:'dining_table', x:21,  z:8,   w:4,   d:3,   rot:0 },
    // Bathroom — flush against walls
    { type:'toilet',  x:7,   z:17,    w:1.5, d:2,   rot:-90 },  // flush against east wall (x=8)
    { type:'sink',    x:5.5, z:12.8,  w:2,   d:1.5, rot:0 },    // flush against south wall (z=12)
    { type:'bathtub', x:4,   z:18.75, w:5,   d:2.5, rot:180 },  // flush against north edge
  ];

  /* ═══════════════════════════════════════════════
     THREE.JS SCENE
     ═══════════════════════════════════════════════ */
  var scene, camera, renderer, animFrameId;
  var aduGroups = {};
  var needsRender = true;

  function createScene(canvas) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E18); // dark night sky

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    resizeRenderer();

    // Camera — angled view looking at ADU center
    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 300);
    camera.position.set(CX, 28, ADU_D + 28);
    camera.lookAt(CX, 3, CZ);

    // Lighting — nighttime: cool moonlight + dim ambient
    var hemi = new THREE.HemisphereLight(0x1a2040, 0x0a0a15, 0.15);
    scene.add(hemi);

    // Moonlight — cool blue-white, low intensity, from upper-left
    var moon = new THREE.DirectionalLight(0x8899CC, 0.35);
    moon.position.set(CX - 25, 55, CZ + 35);
    moon.castShadow = true;
    moon.shadow.mapSize.width = 2048;
    moon.shadow.mapSize.height = 2048;
    moon.shadow.camera.left = -40;
    moon.shadow.camera.right = 40;
    moon.shadow.camera.top = 40;
    moon.shadow.camera.bottom = -40;
    moon.shadow.camera.far = 120;
    moon.shadow.bias = -0.0005;
    scene.add(moon);

    // Very subtle fill from opposite side
    var fill = new THREE.DirectionalLight(0x334466, 0.1);
    fill.position.set(CX + 20, 25, CZ - 20);
    scene.add(fill);

    var ambient = new THREE.AmbientLight(0x1a1a2e, 0.25);
    scene.add(ambient);

    // Ground plane — dark landscape
    var groundGeo = new THREE.PlaneGeometry(120, 120);
    var groundMat = new THREE.MeshStandardMaterial({ color: 0x1A1C22, roughness: 0.95 });
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
    aduGroups.interior = buildInteriorLights();
    aduGroups.environment = buildEnvironment();

    scene.add(aduGroups.foundation);
    scene.add(aduGroups.floors);
    scene.add(aduGroups.walls);
    scene.add(aduGroups.openings);
    scene.add(aduGroups.furniture);
    scene.add(aduGroups.interior);
    scene.add(aduGroups.environment);

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
  var wallMatExt = new THREE.MeshStandardMaterial({ color: 0xEDE8E0, roughness: 0.82 });
  var wallMatInt = new THREE.MeshStandardMaterial({ color: 0xF8F5F0, roughness: 0.92 });
  var wallMatTrans = new THREE.MeshStandardMaterial({
    color: 0xF8F5F0, roughness: 0.92,
    transparent: true, opacity: 0.35, depthWrite: false,
  });

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
        color: room.color, roughness: room.rough || 0.8, side: THREE.DoubleSide,
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
      var wMat = wall.semiTrans ? wallMatTrans : (wall.interior ? wallMatInt : wallMatExt);

      if (!wall.opens || wall.opens.length === 0) {
        // Simple wall — no openings
        var mesh = makeWallBox(length, WALL_H, WALL_T, wMat);
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
          var m = makeWallBox(segLen, WALL_H, WALL_T, wMat);
          m.position.set(lastEnd + segLen / 2, WALL_H / 2, 0);
          wrap.add(m);
        }

        // Segment above opening
        var topH = WALL_H - (op.sill + op.h);
        if (topH > 0.05) {
          var m = makeWallBox(op.w, topH, WALL_T, wMat);
          m.position.set(center, op.sill + op.h + topH / 2, 0);
          wrap.add(m);
        }

        // Segment below opening (windows)
        if (op.sill > 0.05) {
          var m = makeWallBox(op.w, op.sill, WALL_T, wMat);
          m.position.set(center, op.sill / 2, 0);
          wrap.add(m);
        }

        lastEnd = opEnd;
      });

      // Segment after last opening
      if (lastEnd < length - 0.05) {
        var segLen = length - lastEnd;
        var m = makeWallBox(segLen, WALL_H, WALL_T, wMat);
        m.position.set(lastEnd + segLen / 2, WALL_H / 2, 0);
        wrap.add(m);
      }

      g.add(wrap);
    });
    return g;
  }

  function makeWallBox(w, h, t, material) {
    var geo = new THREE.BoxGeometry(w, h, t);
    var mesh = new THREE.Mesh(geo, material || wallMatExt);
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

    // Shutters (left + right panels with louver detail)
    var shutterMat = new THREE.MeshStandardMaterial({ color: 0x3D5C4A, roughness: 0.75 });
    var shutterW = w * 0.38;
    var shutterH = h + 0.1;
    var shutterGeo = new THREE.BoxGeometry(shutterW, shutterH, 0.12);
    var louverMat = new THREE.MeshStandardMaterial({ color: 0x2E4A38, roughness: 0.8 });

    [-1, 1].forEach(function (side) {
      var shutter = new THREE.Mesh(shutterGeo, shutterMat);
      shutter.position.set(localX + side * (w / 2 + shutterW / 2 + 0.05), sill + h / 2, WALL_T * 0.5 + 0.06);
      shutter.castShadow = true;
      parent.add(shutter);

      // Louver lines (4 horizontal grooves)
      for (var li = 0; li < 4; li++) {
        var louver = new THREE.Mesh(
          new THREE.BoxGeometry(shutterW * 0.85, 0.06, 0.14),
          louverMat
        );
        var ly = sill + h * 0.2 + (li / 3) * h * 0.6;
        louver.position.set(localX + side * (w / 2 + shutterW / 2 + 0.05), ly, WALL_T * 0.5 + 0.06);
        parent.add(louver);
      }
    });
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
        case 'rug': buildRug(piece, f.w, f.d, f.color); break;
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
    var seatMat = mat(0x5B7A8A, 0.85);
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

  function buildRug(g, w, d, color) {
    var rugMat = mat(color || 0x8B5E3C, 0.95);
    var rug = box(w, 0.06, d, rugMat);
    rug.position.y = 0.04;
    rug.receiveShadow = true;
    g.add(rug);
    // Subtle border/fringe
    var borderMat = mat((color || 0x8B5E3C) - 0x111111, 0.9);
    var border = box(w + 0.3, 0.04, d + 0.3, borderMat);
    border.position.y = 0.02;
    border.receiveShadow = true;
    g.add(border);
  }

  // ── Interior recessed ceiling lights ──
  // Each room gets 2-3 recessed can lights (fixture geometry + PointLight)
  var ceilingLightDefs = [
    // Living room (0-15, 0-12): 3 lights
    { x: 5,  z: 4,  color: 0xFFD699, intensity: 6 },
    { x: 10, z: 4,  color: 0xFFD699, intensity: 6 },
    { x: 7.5,z: 9,  color: 0xFFD699, intensity: 5 },
    // Kitchen (15-30, 0-12): 3 lights
    { x: 20, z: 3,  color: 0xFFF0D0, intensity: 6 },
    { x: 26, z: 3,  color: 0xFFF0D0, intensity: 6 },
    { x: 23, z: 9,  color: 0xFFF0D0, intensity: 5 },
    // Bedroom (8-30, 12-20): 3 lights
    { x: 14, z: 15, color: 0xFFE4B5, intensity: 5 },
    { x: 22, z: 15, color: 0xFFE4B5, intensity: 5 },
    { x: 18, z: 18, color: 0xFFE4B5, intensity: 4 },
    // Bathroom (0-8, 12-20): 2 lights
    { x: 4,  z: 14.5, color: 0xFFF5EE, intensity: 5 },
    { x: 4,  z: 18,   color: 0xFFF5EE, intensity: 4 },
  ];

  function buildInteriorLights() {
    var g = new THREE.Group();
    var lights = [];

    ceilingLightDefs.forEach(function (def) {
      // PointLight — warm, aimed downward (fixture geometry invisible)
      var light = new THREE.PointLight(def.color, def.intensity, 18, 2);
      light.position.set(def.x, WALL_H - 0.5, def.z);
      light.castShadow = false;
      g.add(light);
      light.userData._maxIntensity = def.intensity;
      lights.push(light);
    });

    g.userData.lights = lights;
    return g;
  }

  // ── Outdoor environment (trees, bushes, walkway, fence) ──
  function buildEnvironment() {
    var g = new THREE.Group();

    // Materials
    var trunkMat = mat(0x2A1F14, 0.9);
    var canopyMat = mat(0x1A2E1A, 0.95);
    var bushMat = mat(0x1C2D1C, 0.95);
    var pathMat = new THREE.MeshStandardMaterial({ color: 0x3A3530, roughness: 0.92 });
    var fenceMat = mat(0x3D3028, 0.85);
    var postMat = mat(0x2E2418, 0.8);

    // Helper: tree (trunk cylinder + canopy sphere)
    function addTree(x, z, height, canopyR) {
      var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, height, 8),
        trunkMat
      );
      trunk.position.set(x, height / 2, z);
      trunk.castShadow = true;
      g.add(trunk);

      var canopy = new THREE.Mesh(
        new THREE.SphereGeometry(canopyR, 12, 10),
        canopyMat
      );
      canopy.position.set(x, height + canopyR * 0.6, z);
      canopy.castShadow = true;
      g.add(canopy);
    }

    // Helper: bush (squashed sphere)
    function addBush(x, z, r) {
      var bush = new THREE.Mesh(
        new THREE.SphereGeometry(r, 10, 8),
        bushMat
      );
      bush.position.set(x, r * 0.6, z);
      bush.scale.y = 0.65;
      bush.castShadow = true;
      g.add(bush);
    }

    // Trees — scattered around the ADU
    addTree(-6, 5, 8, 3.5);       // left front
    addTree(-4, 18, 10, 4);       // left rear
    addTree(36, 3, 9, 3.8);       // right front
    addTree(38, 16, 7, 3);        // right rear
    addTree(15, -8, 11, 4.5);     // front center (behind camera usually)

    // Bushes — along the ADU perimeter
    addBush(-1.5, 2, 1.2);        // left front corner
    addBush(-1.5, 6, 1.0);
    addBush(31.5, 2, 1.1);        // right front corner
    addBush(31.5, 8, 0.9);
    addBush(10, -1.5, 1.0);       // front hedge
    addBush(13, -1.8, 1.3);
    addBush(20, -1.5, 1.1);
    addBush(24, -1.8, 0.9);

    // Walkway — path from front door to "street" (extends toward camera)
    var walkGeo = new THREE.BoxGeometry(3.5, 0.08, 12);
    var walk = new THREE.Mesh(walkGeo, pathMat);
    walk.position.set(7, 0.04, -6);
    walk.receiveShadow = true;
    g.add(walk);

    // Small patio slab at front door
    var patio = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.06, 3),
      pathMat
    );
    patio.position.set(7, 0.03, -1);
    patio.receiveShadow = true;
    g.add(patio);

    // Fence — short picket fence along front (south) side
    var fenceLen = 10;
    var fenceH = 2.5;
    // Left section
    var fenceL = new THREE.Mesh(
      new THREE.BoxGeometry(fenceLen, fenceH, 0.15),
      fenceMat
    );
    fenceL.position.set(-3, fenceH / 2, -3);
    fenceL.castShadow = true;
    g.add(fenceL);
    // Right section
    var fenceR = new THREE.Mesh(
      new THREE.BoxGeometry(12, fenceH, 0.15),
      fenceMat
    );
    fenceR.position.set(28, fenceH / 2, -3);
    fenceR.castShadow = true;
    g.add(fenceR);

    // Fence posts
    [[-8, -3], [2, -3], [22, -3], [34, -3]].forEach(function (p) {
      var post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, fenceH + 0.5, 6),
        postMat
      );
      post.position.set(p[0], (fenceH + 0.5) / 2, p[1]);
      post.castShadow = true;
      g.add(post);
    });

    // Small exterior light near front door (warm glow)
    var porchLight = new THREE.PointLight(0xFFD080, 2, 8, 2);
    porchLight.position.set(7, 6, -0.5);
    g.add(porchLight);

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
  var step5CardShown = false;

  // Card positions — alternating left/right on full-width canvas
  var cardPositions = [
    { side: 'left',   enterFrom: 'left' },    // 0: Pre-construction
    { side: 'right',  enterFrom: 'right' },    // 1: Design
    { side: 'center', enterFrom: 'below' },    // 2: Financing
    { side: 'left',   enterFrom: 'left' },     // 3: Permitting
    { side: 'center', enterFrom: 'below', delayed: true },  // 4: Construction
    { side: 'right',  enterFrom: 'right' },    // 5: Post-construction
  ];

  function getSideOffset() {
    var el = document.querySelector('[data-process-pinned]');
    var cw = el ? el.clientWidth : window.innerWidth;
    var cardW = 500;
    var margin = Math.max(60, cw * 0.06);
    return (cw / 2) - (cardW / 2) - margin;
  }

  function getCardX(pos) {
    var offset = getSideOffset();
    if (pos.side === 'left') return -offset;
    if (pos.side === 'right') return offset;
    return 0;
  }

  function transitionToStep(cards, idx, navEl) {
    if (idx === currentStep) return;
    var prevIdx = currentStep;
    currentStep = idx;
    step5CardShown = false;

    var pos = cardPositions[idx];
    var targetX = getCardX(pos);

    cards.forEach(function (card, i) {
      if (i === idx) {
        // Skip card entrance for delayed steps (step 5 — shows after build)
        if (pos.delayed) {
          gsap.set(card, { opacity: 0, xPercent: -50, yPercent: -50, x: 0, y: 0 });
          return;
        }

        // Reset children for stagger entrance
        var ch = card.children;
        for (var c = 0; c < ch.length; c++) {
          gsap.set(ch[c], { opacity: 0, y: 15 });
        }

        // Entrance from direction matching card side
        var enterX = targetX;
        var enterY = 0;
        if (pos.enterFrom === 'left') enterX -= 100;
        else if (pos.enterFrom === 'right') enterX += 100;
        else if (pos.enterFrom === 'below') enterY = 70;

        gsap.set(card, {
          opacity: 0, xPercent: -50, yPercent: -50,
          x: enterX, y: enterY, scale: 0.96,
        });

        gsap.to(card, {
          opacity: 1, x: targetX, y: 0,
          scale: 1, duration: 0.8, ease: 'expo.out', overwrite: true,
        });

        // Text stagger
        for (var c = 0; c < ch.length; c++) {
          gsap.to(ch[c], {
            opacity: 1, y: 0,
            duration: 0.5, ease: 'power3.out',
            delay: 0.15 + c * 0.12,
          });
        }
      } else if (i === prevIdx) {
        // Exit animation
        var exitDir = i < idx ? -1 : 1;
        gsap.to(card, {
          opacity: 0, y: exitDir * 40,
          scale: 0.97, duration: 0.5, ease: 'power3.in', overwrite: true,
        });
      } else {
        gsap.set(card, { opacity: 0, xPercent: -50, yPercent: -50 });
      }
    });

    updateNavDots(navEl, idx);
  }

  // Show step 5 card after construction build completes
  function showStep5Card() {
    var cards = document.querySelectorAll('[data-process-card]');
    var card = cards[4];
    if (!card) return;

    var ch = card.children;
    for (var c = 0; c < ch.length; c++) {
      gsap.set(ch[c], { opacity: 0, y: 15 });
    }

    gsap.to(card, {
      opacity: 1, x: 0, y: 0,
      xPercent: -50, yPercent: -50,
      scale: 1, duration: 0.9, ease: 'expo.out',
    });

    for (var c = 0; c < ch.length; c++) {
      gsap.to(ch[c], {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power3.out',
        delay: 0.2 + c * 0.12,
      });
    }
  }

  /* ═══════════════════════════════════════════════
     STEP VISUAL ANIMATIONS — SCROLL-DRIVEN
     Each step's animation is driven by scroll sub-progress.
     ═══════════════════════════════════════════════ */
  var canvasEl = null;
  var fxEl = null;
  var moneyCanvas = null;
  var stampSvg = null;
  var activeVisual = -1;

  // ── Easing helpers ──
  function smoothstep(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }

  function easeOutBack(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var s = 1.5;
    var p = t - 1;
    return p * p * ((s + 1) * p + s) + 1;
  }

  function remap(value, inMin, inMax) {
    return Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  }

  // ── Visual lifecycle ──
  function prepareVisual(step) {
    if (isMobile) return;
    switch (step) {
      case 0: prepareBlueprint(); break;
      case 1: prepareModelOrbit(); break;
      case 2: prepareMoneyRain(); break;
      case 3: prepareStamp(); break;
      case 4: prepareConstruction(); break;
      case 5: prepareWarmGlow(); break;
    }
  }

  function scrubVisual(step, subP) {
    if (isMobile) return;
    switch (step) {
      case 0: scrubBlueprint(subP); break;
      case 1: scrubModelOrbit(subP); break;
      case 2: scrubMoneyRain(subP); break;
      case 3: scrubStamp(subP); break;
      case 4: scrubConstruction(subP); break;
      case 5: scrubWarmGlow(subP); break;
    }
  }

  function cleanupVisual(step) {
    if (isMobile) return;
    switch (step) {
      case 0: cleanupBlueprint(); break;
      case 1: cleanupModelOrbit(); break;
      case 2: cleanupMoneyRain(); break;
      case 3: cleanupStamp(); break;
      case 4: cleanupConstruction(); break;
      case 5: cleanupWarmGlow(); break;
    }
  }

  // ── Step 1: 3D Blueprint View (overhead → descending reveal) ──
  var bpMatSolid = null;
  var bpMatFloor = null;

  function prepareBlueprint() {
    if (!canvasEl || !camera) return;

    // Create blueprint materials on first use
    if (!bpMatSolid) {
      bpMatSolid = new THREE.MeshStandardMaterial({
        color: 0x3377BB, roughness: 0.95, transparent: true, opacity: 0.85,
      });
      bpMatFloor = new THREE.MeshStandardMaterial({
        color: 0x5599DD, roughness: 0.95, transparent: true, opacity: 0.55,
      });
    }

    // Show the COMPLETE model
    setGroupsVisible(true);
    aduGroups.foundation.position.y = 0;
    aduGroups.floors.scale.set(1, 1, 1);
    aduGroups.walls.scale.set(1, 1, 1);
    aduGroups.furniture.children.forEach(function (p) { p.scale.set(1, 1, 1); });
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = 1;
        obj.material.needsUpdate = true;
      }
    });

    // Dim ceiling lights for blueprint view
    setLightsIntensity(0.15);

    // Override all ADU meshes to blueprint tint
    Object.keys(aduGroups).forEach(function (key) {
      if (key === 'interior' || key === 'environment') return;
      aduGroups[key].traverse(function (obj) {
        if (obj.isMesh && obj.material) {
          obj.userData._origMat = obj.material;
          obj.material = (key === 'floors' || key === 'foundation') ? bpMatFloor : bpMatSolid;
        }
      });
    });

    // Camera: start high overhead (blueprint table view) — scrub will descend
    camera.position.set(CX, 50, CZ + 6);
    camera.lookAt(CX, 0, CZ);

    gsap.to(canvasEl, { opacity: 1, duration: 0.6, overwrite: 'auto' });
    markDirty();
  }

  function scrubBlueprint(subP) {
    if (!camera) return;
    var t = smoothstep(subP);

    // Camera descends from high overhead (blueprint table) to 3/4 angle
    camera.position.set(
      CX - 10 * t,        // 15 → 5
      50 - 18 * t,         // 50 → 32
      CZ + 6 + 20 * t      // 16 → 36
    );
    camera.lookAt(CX, 0, CZ);
    markDirty();
  }

  function cleanupBlueprint() {
    // Restore original materials
    Object.keys(aduGroups).forEach(function (key) {
      if (key === 'interior' || key === 'environment') return;
      aduGroups[key].traverse(function (obj) {
        if (obj.isMesh && obj.userData._origMat) {
          obj.material = obj.userData._origMat;
          delete obj.userData._origMat;
        }
      });
    });
    markDirty();
  }

  // ── Step 2: Complete Model Showcase (dramatic L-to-R pan, zoomed in) ──
  function prepareModelOrbit() {
    if (!canvasEl || !camera) return;

    // Show the COMPLETE fully-built model
    setGroupsVisible(true);

    // Reset all geometry to full state (like step 5 finished)
    aduGroups.foundation.position.y = 0;
    aduGroups.floors.scale.set(1, 1, 1);
    aduGroups.walls.scale.set(1, 1, 1);
    aduGroups.furniture.children.forEach(function (p) { p.scale.set(1, 1, 1); });

    // Ceiling lights ON — nighttime showcase
    setLightsIntensity(1);

    // Reset window glass — warm glow at night
    resetWindowGlass();

    // Make all openings fully opaque
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = obj.material.transparent ? 0.3 : 1;
        obj.material.needsUpdate = true;
      }
    });

    // Start camera on LEFT side, close and low — dramatic angle
    camera.position.set(CX - 25, 18, ADU_D + 18);
    camera.lookAt(CX, 3, CZ);
    gsap.to(canvasEl, { opacity: 1, duration: 0.6, overwrite: 'auto' });
    markDirty();
  }

  function scrubModelOrbit(subP) {
    if (!camera) return;
    var t = smoothstep(subP);

    // Dramatic left-to-right pan: camera sweeps from left to right, staying close
    camera.position.set(
      CX - 25 + 50 * t,   // sweep from -25 to +25 (left to right)
      18 + 6 * t,          // slight rise 18 → 24
      ADU_D + 18 - 4 * t   // subtle push in
    );
    camera.lookAt(CX, 3, CZ);
    markDirty();
  }

  function cleanupModelOrbit() {
    // Canvas opacity managed by next step's prepare
  }

  // ── Step 3: Money Rain (scroll-driven particle system) ──
  function prepareMoneyRain() {
    if (!fxEl) return;
    if (canvasEl) gsap.to(canvasEl, { opacity: 0.25, duration: 0.4, overwrite: 'auto' });

    if (!moneyCanvas) {
      moneyCanvas = document.createElement('canvas');
      moneyCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    }
    fxEl.appendChild(moneyCanvas);
    gsap.set(moneyCanvas, { opacity: 0 });
    gsap.to(moneyCanvas, { opacity: 1, duration: 0.4 });

    var w = fxEl.clientWidth;
    var h = fxEl.clientHeight;
    moneyCanvas.width = w;
    moneyCanvas.height = h;

    // Pre-compute bill properties for scroll-driven rendering
    if (!moneyCanvas._bills) {
      var bills = [];
      for (var i = 0; i < 50; i++) {
        bills.push({
          x: Math.random() * w,
          startY: -60 - Math.random() * h,
          w: 28 + Math.random() * 20,
          h: 14 + Math.random() * 10,
          baseRot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 6,
          speed: 1.2 + Math.random() * 1.8,
          wobble: 3 + Math.random() * 5,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.5 + Math.random() * 0.5,
        });
      }
      moneyCanvas._bills = bills;
    }

    // Render initial frame
    scrubMoneyRain(0);
  }

  function scrubMoneyRain(subP) {
    if (!moneyCanvas || !moneyCanvas._bills) return;
    var ctx = moneyCanvas.getContext('2d');
    var w = moneyCanvas.width;
    var h = moneyCanvas.height;
    if (w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);

    var bills = moneyCanvas._bills;
    bills.forEach(function (b) {
      // Y position: fall from above into view based on scroll
      var totalTravel = (h + 120) * b.speed;
      var y = b.startY + subP * totalTravel;
      // Wrap within visible range
      var range = h + 80;
      y = ((y % range) + range) % range - 40;

      // X wobble based on scroll
      var x = b.x + Math.sin(subP * b.wobble + b.phase) * 25;
      var rot = b.baseRot + subP * b.rotSpeed;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = b.opacity;

      ctx.fillStyle = '#4a8c5c';
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.strokeStyle = '#2d6b3f';
      ctx.lineWidth = 1;
      ctx.strokeRect(-b.w / 2 + 2, -b.h / 2 + 2, b.w - 4, b.h - 4);

      ctx.fillStyle = '#2d6b3f';
      ctx.font = 'bold ' + Math.round(b.h * 0.7) + 'px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0);

      ctx.restore();
    });
  }

  function cleanupMoneyRain() {
    if (moneyCanvas && moneyCanvas.parentElement) {
      gsap.to(moneyCanvas, {
        opacity: 0, duration: 0.3,
        onComplete: function () {
          if (moneyCanvas.parentElement) moneyCanvas.parentElement.removeChild(moneyCanvas);
        }
      });
    }
  }

  // ── Step 4: Permit Stamp (scrub-driven wax seal) ──
  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function prepareStamp() {
    if (!fxEl) return;
    if (canvasEl) gsap.to(canvasEl, { opacity: 0.15, duration: 0.3, overwrite: 'auto' });

    if (!stampSvg) {
      stampSvg = svgEl('svg', {
        viewBox: '0 0 500 500',
        preserveAspectRatio: 'xMidYMid meet',
      });
      stampSvg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
      stampSvg.appendChild(svgEl('defs'));

      var sg = svgEl('g');
      stampSvg.appendChild(sg);

      // Minimal stamp — thin cream circles + clean text
      var strokeColor = 'rgba(240, 237, 232, 0.6)';
      var textColor = 'rgba(240, 237, 232, 0.9)';
      var dimColor = 'rgba(240, 237, 232, 0.35)';

      // Outer circle
      sg.appendChild(svgEl('circle', {
        r: '120', fill: 'none', stroke: strokeColor, 'stroke-width': '1.5',
      }));
      // Inner circle
      sg.appendChild(svgEl('circle', {
        r: '105', fill: 'none', stroke: strokeColor, 'stroke-width': '0.5',
      }));

      // Horizontal rules flanking text
      sg.appendChild(svgEl('line', {
        x1: '-80', y1: '-16', x2: '-20', y2: '-16',
        stroke: dimColor, 'stroke-width': '0.5',
      }));
      sg.appendChild(svgEl('line', {
        x1: '20', y1: '-16', x2: '80', y2: '-16',
        stroke: dimColor, 'stroke-width': '0.5',
      }));
      sg.appendChild(svgEl('line', {
        x1: '-80', y1: '22', x2: '-20', y2: '22',
        stroke: dimColor, 'stroke-width': '0.5',
      }));
      sg.appendChild(svgEl('line', {
        x1: '20', y1: '22', x2: '80', y2: '22',
        stroke: dimColor, 'stroke-width': '0.5',
      }));

      // "PERMIT" — small caps above
      sg.appendChild(Object.assign(svgEl('text', {
        y: '-32', 'text-anchor': 'middle', fill: dimColor,
        'font-size': '10', 'font-family': 'DM Sans, sans-serif',
        'font-weight': '500', 'letter-spacing': '0.35em',
      }), { textContent: 'BUILDING PERMIT' }));

      // "APPROVED" — main text
      sg.appendChild(Object.assign(svgEl('text', {
        y: '12', 'text-anchor': 'middle', fill: textColor,
        'font-size': '34', 'font-family': 'DM Serif Display, serif',
        'font-weight': '400', 'letter-spacing': '0.08em',
      }), { textContent: 'APPROVED' }));

      // Permit number
      sg.appendChild(Object.assign(svgEl('text', {
        y: '42', 'text-anchor': 'middle', fill: dimColor,
        'font-size': '7.5', 'font-family': 'DM Sans, sans-serif',
        'letter-spacing': '0.15em',
      }), { textContent: 'NO. 2025-ADU-04782' }));

      stampSvg._stamp = sg;
    }

    fxEl.appendChild(stampSvg);
    gsap.set(stampSvg, { opacity: 1 });

    // Position above — scrub will bring it down
    var sg = stampSvg._stamp;
    sg.setAttribute('transform', 'translate(250,-200) rotate(-8) scale(2.5)');
  }

  function scrubStamp(subP) {
    if (!stampSvg || !stampSvg._stamp) return;
    var sg = stampSvg._stamp;
    var t = smoothstep(subP);

    // Interpolate from above viewport to center
    var y = -200 + 450 * t;
    var rot = -8 + 4 * t;
    var scale = 2.5 - 1.5 * t;

    sg.setAttribute('transform',
      'translate(250,' + y.toFixed(0) + ') rotate(' + rot.toFixed(1) + ') scale(' + scale.toFixed(3) + ')'
    );
  }

  function cleanupStamp() {
    if (stampSvg && stampSvg.parentElement) {
      gsap.to(stampSvg, {
        opacity: 0, duration: 0.3,
        onComplete: function () {
          if (stampSvg.parentElement) stampSvg.parentElement.removeChild(stampSvg);
        },
      });
    }
    if (fxEl) gsap.set(fxEl, { x: 0, y: 0 });
  }

  // ── Step 5: Construction — Scrub-Driven Building ──
  function prepareConstruction() {
    if (!canvasEl || !camera) return;

    // Reset all groups to invisible
    setGroupsVisible(false);

    // Lights off at start — will turn on as building progresses
    setLightsIntensity(0);

    // Reset material states
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = 0;
        obj.material.needsUpdate = true;
      }
    });

    // Reset positions and scales
    aduGroups.foundation.position.y = -2;
    aduGroups.floors.scale.y = 0;
    aduGroups.walls.scale.set(1, 0, 1);
    aduGroups.furniture.children.forEach(function (piece) {
      piece.scale.set(0, 0, 0);
    });

    // Camera: pulled back but not too far — watch it build
    camera.position.set(CX - 12, 28, ADU_D + 28);
    camera.lookAt(CX, 3, CZ);
    gsap.to(canvasEl, { opacity: 1, duration: 0.5, overwrite: 'auto' });
    markDirty();
  }

  function scrubConstruction(subP) {
    if (!aduGroups.foundation) return;

    // Foundation: 0% – 12%
    var foundP = smoothstep(remap(subP, 0, 0.12));
    aduGroups.foundation.visible = subP > 0.01;
    aduGroups.foundation.position.y = -2 + 2 * foundP;

    // Floors: 8% – 20%
    var floorP = smoothstep(remap(subP, 0.08, 0.20));
    aduGroups.floors.visible = subP > 0.06;
    aduGroups.floors.scale.y = floorP;

    // Walls: 18% – 45%
    var wallP = smoothstep(remap(subP, 0.18, 0.45));
    aduGroups.walls.visible = subP > 0.16;
    aduGroups.walls.scale.y = wallP;

    // Openings (doors/windows): 40% – 55%
    var openP = remap(subP, 0.40, 0.55);
    aduGroups.openings.visible = subP > 0.38;
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = openP;
        obj.material.needsUpdate = true;
      }
    });

    // Furniture: 50% – 80% (staggered per piece)
    var count = aduGroups.furniture.children.length;
    aduGroups.furniture.visible = subP > 0.48;
    aduGroups.furniture.children.forEach(function (piece, i) {
      var pieceStart = 0.50 + (i / count) * 0.22;
      var pieceP = remap(subP, pieceStart, pieceStart + 0.10);
      var s = easeOutBack(pieceP);
      piece.scale.set(s, s, s);
    });

    // Ceiling lights fade on as furniture appears (60% – 85%)
    var lightP = smoothstep(remap(subP, 0.60, 0.85));
    setLightsIntensity(lightP);

    // Show card after build completes (80%+)
    if (subP > 0.80 && !step5CardShown) {
      step5CardShown = true;
      showStep5Card();
    }

    markDirty();
  }

  function cleanupConstruction() {
    // Canvas opacity managed by next step's prepare
  }

  // ── Step 6: Warm Glow (scrub-driven) ──
  function prepareWarmGlow() {
    if (!canvasEl || !camera) return;

    // Ensure full model visible with solid materials
    setGroupsVisible(true);
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material) {
        obj.material.transparent = true;
        obj.material.opacity = 1;
        obj.material.needsUpdate = true;
      }
    });
    aduGroups.foundation.position.y = 0;
    aduGroups.walls.scale.set(1, 1, 1);
    aduGroups.furniture.children.forEach(function (p) { p.scale.set(1, 1, 1); });

    // Start with normal ceiling lights
    setLightsIntensity(1);

    gsap.to(canvasEl, { opacity: 1, duration: 0.6, overwrite: 'auto' });
    markDirty();
  }

  function scrubWarmGlow(subP) {
    if (!camera) return;
    var t = smoothstep(subP);

    // Camera sweeps to hero angle — close and intimate
    camera.position.set(
      CX - 12 + 22 * t,
      28 - 8 * t,
      ADU_D + 28 - 6 * t
    );
    camera.lookAt(CX, 3, CZ);

    // Boost ceiling lights from normal (1x) to warm glow (1.6x)
    var boostFactor = 1 + 0.6 * t;
    setLightsIntensity(boostFactor);

    // Window glass warms to golden
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material && obj.material.transparent) {
        obj.material.color.setRGB(
          0.529 + (1 - 0.529) * t,
          0.808 + (0.9 - 0.808) * t,
          0.922 + (0.5 - 0.922) * t
        );
        obj.material.opacity = 0.3 + 0.4 * t;
        if (obj.material.emissive) {
          obj.material.emissive.setRGB(t * 0.15, t * 0.12, t * 0.05);
        }
        obj.material.needsUpdate = true;
      }
    });

    markDirty();
  }

  function cleanupWarmGlow() {
    setLightsIntensity(1);
    resetWindowGlass();
    markDirty();
  }

  // Set all ceiling lights to a fraction of their max intensity (0=off, 1=normal, >1=boosted)
  function setLightsIntensity(fraction) {
    var lights = aduGroups.interior && aduGroups.interior.userData.lights;
    if (!lights) return;
    lights.forEach(function (light) {
      light.intensity = (light.userData._maxIntensity || 6) * fraction;
    });
  }

  // Reset window glass to default cool blue
  function resetWindowGlass() {
    if (!aduGroups.openings) return;
    aduGroups.openings.traverse(function (obj) {
      if (obj.isMesh && obj.material && obj.material.transparent) {
        obj.material.color.setRGB(0.529, 0.808, 0.922);
        obj.material.opacity = 0.3;
        if (obj.material.emissive) obj.material.emissive.setRGB(0, 0, 0);
        obj.material.needsUpdate = true;
      }
    });
  }

  function setGroupsVisible(visible) {
    Object.keys(aduGroups).forEach(function (key) {
      if (key === 'environment') return; // always visible
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

    // Initialize cards — first card at its layout position, rest hidden
    var firstX = getCardX(cardPositions[0]);
    cards.forEach(function (card, i) {
      if (i === 0) {
        gsap.set(card, { opacity: 1, xPercent: -50, yPercent: -50, x: firstX, y: 0, scale: 1 });
      } else {
        gsap.set(card, { opacity: 0, xPercent: -50, yPercent: -50 });
      }
    });
    currentStep = 0;

    if (!isMobile && typeof THREE !== 'undefined' && visualEl) {
      // Dark background so 2D overlay steps (money rain, stamp) stay dark
      visualEl.style.backgroundColor = '#0B0E18';

      // Create Three.js canvas
      canvasEl = document.createElement('canvas');
      canvasEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;';
      visualEl.insertBefore(canvasEl, visualEl.firstChild);

      // Build scene
      createScene(canvasEl);

      // Initially hide all groups (construction step reveals them)
      setGroupsVisible(false);
    }

    // Initialize first step visual
    activeVisual = 0;
    prepareVisual(0);

    if (!isMobile) {
      var stepFrac = 1 / (totalSteps - 1);

      // Scroll-lock: pin the section and scrub through steps
      ScrollTrigger.create({
        trigger: pinned,
        start: 'top top',
        end: '+=' + (window.innerHeight * (totalSteps + 2)),  // extra scroll range for slower feel
        pin: true,
        scrub: 2,
        snap: {
          snapTo: 1 / (totalSteps - 1),
          duration: { min: 0.3, max: 0.8 },
          delay: 0.4,
          ease: 'power2.inOut',
          inertia: false,
        },
        onUpdate: function (self) {
          var progress = self.progress;
          var step = Math.round(progress * (totalSteps - 1));
          step = Math.max(0, Math.min(totalSteps - 1, step));

          // Card transitions
          transitionToStep(cards, step, navEl);
          updateProgressBar(navEl, progress);

          // Sub-progress: how far into this step's scroll-driven animation
          // All steps are scroll-driven — subP goes 0→1 within each step's range
          var subP;
          if (step === 0) {
            // Step 0: animate from progress 0 to halfway toward step 1
            var halfStep = 0.5 * stepFrac;
            subP = Math.max(0, Math.min(1, progress / halfStep));
          } else {
            var midpoint = (step - 0.5) * stepFrac;
            var snapPos = step * stepFrac;
            subP = Math.max(0, Math.min(1, (progress - midpoint) / (snapPos - midpoint)));
          }

          // Switch visual mode when step changes
          if (step !== activeVisual) {
            cleanupVisual(activeVisual);
            prepareVisual(step);
            activeVisual = step;
          }

          // Scrub the current step's animation
          scrubVisual(step, subP);
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
