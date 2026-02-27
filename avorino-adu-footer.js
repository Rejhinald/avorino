(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
  var lenis = new Lenis({
    duration: 1.4,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', function () { lenis.resize(); });

  /* ═══════════════════════════════════════════════
     UTILITY — TEXT SPLITTING
     ═══════════════════════════════════════════════ */
  function splitIntoWords(el) {
    var text = el.textContent.trim();
    var align = window.getComputedStyle(el).textAlign;
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
    if (align === 'center') el.style.justifyContent = 'center';
    var wordEls = [];
    text.split(/\s+/).forEach(function (word) {
      var wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'top';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = word;
      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      wordEls.push(inner);
    });
    return wordEls;
  }

  function splitIntoChars(el) {
    var text = el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
    var charEls = [];
    text.split(/\s+/).forEach(function (word) {
      var wordWrap = document.createElement('span');
      wordWrap.style.display = 'inline-flex';
      wordWrap.style.overflow = 'hidden';
      for (var i = 0; i < word.length; i++) {
        var charSpan = document.createElement('span');
        charSpan.style.display = 'inline-block';
        charSpan.textContent = word[i];
        wordWrap.appendChild(charSpan);
        charEls.push(charSpan);
      }
      el.appendChild(wordWrap);
    });
    return charEls;
  }

  /* ═══════════════════════════════════════════════
     HERO — Three.js Blueprint Grid Reveal
     ═══════════════════════════════════════════════ */
  function initHero() {
    var hero = document.getElementById('adu-hero');
    if (!hero) return;

    /* ── Text entrance animations ── */
    var h1 = hero.querySelector('h1');
    var goldLine = hero.querySelector('.adu-hero-gold-line');
    var subtitle = hero.querySelector('.adu-hero-subtitle');
    var label = hero.querySelector('.adu-hero-label');

    if (label) {
      label.removeAttribute('data-animate');
      gsap.fromTo(label,
        { opacity: 0, y: 20 },
        { opacity: 0.45, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
    }

    if (h1) {
      h1.removeAttribute('data-animate');
      var chars = splitIntoChars(h1);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.025, ease: 'elastic.out(1, 0.6)', delay: 0.4,
      });
    }

    if (goldLine) {
      gsap.to(goldLine, { width: '80px', duration: 1, delay: 1, ease: 'power3.inOut' });
    }

    if (subtitle) {
      subtitle.removeAttribute('data-animate');
      gsap.fromTo(subtitle,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 0.55, y: 0, filter: 'blur(0px)', duration: 1, delay: 1.2, ease: 'power3.out' }
      );
    }

    var heroContent = hero.querySelector('.adu-hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }

    var hint = hero.querySelector('.adu-hero-scroll-hint');
    if (hint) {
      hint.removeAttribute('data-animate');
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 0.3, duration: 1, delay: 2, ease: 'power2.out' });
      gsap.to(hint, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '30% top', scrub: 1 },
      });
    }

    /* ── Three.js Blueprint Grid ── */
    initHero3D();
  }

  function initHero3D() {
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('hero-canvas');
    if (!wrap) return;

    /* ── Setup ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 1000);
    camera.position.set(18, 14, 24);
    camera.lookAt(0, 3, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var pl1 = new THREE.PointLight(0xc9a96e, 0.8, 80);
    pl1.position.set(18, 22, 22);
    scene.add(pl1);
    var pl2 = new THREE.PointLight(0xc8222a, 0.2, 60);
    pl2.position.set(-18, 6, 12);
    scene.add(pl2);

    /* ── Colors / Materials ── */
    var GOLD = 0xc9a96e, CREAM = 0xf0ede8, SLATE = 0x555555;

    function makeMat(c) { return new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }); }
    var gridMat = makeMat(CREAM);
    var foundMat = makeMat(GOLD);
    var structMat = makeMat(SLATE);
    var detailMat = makeMat(SLATE);
    var accentMat = makeMat(GOLD);

    /* ── Geometry Helpers ── */
    function wireBox(w, h, d, mat) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat);
    }
    function wirePlane(w, h, mat) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)), mat);
    }
    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }
    function windowFrame(cx, cy, cz, w, h, axis) {
      var hw = w / 2, hh = h / 2, pts = [];
      if (axis === 'x') {
        pts.push(cx,cy-hh,cz-hw, cx,cy-hh,cz+hw, cx,cy-hh,cz+hw, cx,cy+hh,cz+hw,
          cx,cy+hh,cz+hw, cx,cy+hh,cz-hw, cx,cy+hh,cz-hw, cx,cy-hh,cz-hw,
          cx,cy,cz-hw, cx,cy,cz+hw, cx,cy-hh,cz, cx,cy+hh,cz);
      } else {
        pts.push(cx-hw,cy-hh,cz, cx+hw,cy-hh,cz, cx+hw,cy-hh,cz, cx+hw,cy+hh,cz,
          cx+hw,cy+hh,cz, cx-hw,cy+hh,cz, cx-hw,cy+hh,cz, cx-hw,cy-hh,cz,
          cx-hw,cy,cz, cx+hw,cy,cz, cx,cy-hh,cz, cx,cy+hh,cz);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, detailMat);
    }

    var sg = new THREE.Group();
    scene.add(sg);

    /* GROUP 1: Blueprint Grid */
    var gGrid = new THREE.Group(), gp = [];
    for (var i = -10; i <= 10; i += 2) { gp.push(i, 0, -8, i, 0, 8); }
    for (var i = -8; i <= 8; i += 2) { gp.push(-10, 0, i, 10, 0, i); }
    gGrid.add(lineSegs(gp, gridMat));
    sg.add(gGrid);

    /* GROUP 2: Foundation */
    var gFound = new THREE.Group();
    var mf = wireBox(10, 0.12, 7, foundMat); mf.position.set(0, 0.06, 0); gFound.add(mf);
    var df = wireBox(3, 0.08, 1, foundMat); df.position.set(1, 0.04, -4); gFound.add(df);
    gFound.add(lineSegs([0, 0.08, -3.5, 0, 0.08, 3.5, -3, 0.08, -3.5, -3, 0.08, 3.5], foundMat));
    sg.add(gFound);

    /* GROUP 3: Structure */
    var gStruct = new THREE.Group();
    var mv = wireBox(10, 7, 7, structMat); mv.position.set(0, 3.5, 0); gStruct.add(mv);
    gStruct.add(lineSegs([
      -3,0,-3.5, -3,7,-3.5, -3,0,3.5, -3,7,3.5,
      2,0,-3.5, 2,7,-3.5, 2,0,3.5, 2,7,3.5,
      0,0,-3.5, 0,7,-3.5,
      -5,0,0, -5,7,0, -3,0,0, -3,7,0,
      -5,0,-1.5, -3,0,-1.5, -5,7,-1.5, -3,7,-1.5
    ], structMat));
    var flp = wirePlane(10, 7, structMat);
    flp.rotation.x = -Math.PI / 2; flp.position.set(0, 3.5, 0); gStruct.add(flp);
    sg.add(gStruct);

    /* GROUP 4: Windows + Door */
    var gDetail = new THREE.Group();
    gDetail.add(windowFrame(-3.5, 2.5, -3.51, 1.6, 2, 'z'));
    gDetail.add(windowFrame(-1, 2.5, -3.51, 1.6, 2, 'z'));
    gDetail.add(windowFrame(2.5, 2.5, -3.51, 1.6, 2, 'z'));
    gDetail.add(windowFrame(-2.5, 5.5, -3.51, 2.4, 1.8, 'z'));
    gDetail.add(windowFrame(2, 5.5, -3.51, 2.4, 1.8, 'z'));
    gDetail.add(windowFrame(-5.01, 2.5, -1, 1.4, 1.8, 'x'));
    gDetail.add(windowFrame(-5.01, 5.5, -1, 1.4, 1.8, 'x'));
    gDetail.add(windowFrame(-5.01, 2.5, 2, 1.4, 1.8, 'x'));
    gDetail.add(windowFrame(-1, 2.5, 3.51, 2, 1.8, 'z'));
    gDetail.add(windowFrame(3, 2.5, 3.51, 1.4, 1.8, 'z'));
    var door = wirePlane(1.4, 2.8, detailMat); door.position.set(1, 1.4, -3.52); gDetail.add(door);
    sg.add(gDetail);

    /* GROUP 5: Gold Accents */
    var gAccent = new THREE.Group();
    gAccent.add(lineSegs([
      -5.5,7.15,-4, 5.5,7.15,-4, 5.5,7.15,-4, 5.5,7.15,4,
      5.5,7.15,4, -5.5,7.15,4, -5.5,7.15,4, -5.5,7.15,-4
    ], accentMat));
    gAccent.add(lineSegs([
      -5.5,7.15,-4, -5,7,-3.5, 5.5,7.15,-4, 5,7,-3.5,
      -5.5,7.15,4, -5,7,3.5, 5.5,7.15,4, 5,7,3.5
    ], accentMat));
    gAccent.add(lineSegs([
      0,7.8,-4, 0,7.8,4,
      -5.5,7.15,-4, 0,7.8,-4, 5.5,7.15,-4, 0,7.8,-4,
      -5.5,7.15,4, 0,7.8,4, 5.5,7.15,4, 0,7.8,4
    ], accentMat));
    gAccent.add(lineSegs([
      -0.5,2.8,-3.51, -0.5,2.8,-4.5, 2.5,2.8,-3.51, 2.5,2.8,-4.5,
      -0.5,2.8,-4.5, 2.5,2.8,-4.5,
      -0.5,2.8,-4.5, -0.5,0,-3.51, 2.5,2.8,-4.5, 2.5,0,-3.51
    ], accentMat));
    sg.add(gAccent);

    /* PARTICLES */
    var PC = 40, pArr = new Float32Array(PC * 3), pVel = [];
    for (var i = 0; i < PC; i++) {
      pArr[i * 3] = (Math.random() - 0.5) * 22;
      pArr[i * 3 + 1] = Math.random() * 14;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 18;
      pVel.push(0.003 + Math.random() * 0.007);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({ color: GOLD, size: 0.1, transparent: true, opacity: 0, sizeAttenuation: true });
    sg.add(new THREE.Points(pGeo, pMat));

    /* ── Mouse Parallax ── */
    var mouse = { x: 0, y: 0 };
    var targetRot = { x: 0, y: 0 };
    document.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Scroll progress ── */
    var scrollP = 0;
    ScrollTrigger.create({
      trigger: '#adu-hero', start: 'top top', end: 'bottom top',
      onUpdate: function (s) { scrollP = s.progress; },
    });

    /* ── Visibility Gate ── */
    var isVisible = true;
    new IntersectionObserver(function (e) { isVisible = e[0].isIntersecting; }, { threshold: 0.01 }).observe(wrap);

    /* ── Render Loop — Timed progressive reveal ── */
    var clock = new THREE.Clock();
    var baseRot = -0.3;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;
      var t = clock.getElapsedTime();

      /* Timed reveal — groups fade in sequentially */
      gridMat.opacity = clamp(t / 0.8) * 0.15;
      var fv = ease(clamp((t - 0.4) / 0.8));
      foundMat.opacity = fv * 0.5; gFound.position.y = -1.5 * (1 - fv);
      var sv = ease(clamp((t - 1.0) / 1.0));
      structMat.opacity = sv * 0.35; gStruct.position.y = -5 * (1 - sv);
      detailMat.opacity = ease(clamp((t - 1.8) / 0.8)) * 0.4;
      accentMat.opacity = ease(clamp((t - 2.3) / 0.8)) * 0.65;
      pMat.opacity = clamp((t - 2.8) / 1.0) * 0.35;

      /* Slow orbit + mouse parallax */
      targetRot.y = baseRot + t * 0.03 + scrollP * 0.5;
      targetRot.x = mouse.y * 0.04;
      sg.rotation.y += (targetRot.y + mouse.x * 0.12 - sg.rotation.y) * 0.015;
      sg.rotation.x += (targetRot.x - sg.rotation.x) * 0.015;

      var breathe = 1 + Math.sin(t * 0.4) * 0.008;
      sg.scale.setScalar(breathe);

      camera.position.y = 14 - scrollP * 6;
      camera.lookAt(0, 3, 0);

      /* Particles */
      var pa = pGeo.attributes.position.array;
      for (var j = 0; j < PC; j++) {
        pa[j * 3 + 1] += pVel[j];
        if (pa[j * 3 + 1] > 16) {
          pa[j * 3 + 1] = -1;
          pa[j * 3] = (Math.random() - 0.5) * 22;
          pa[j * 3 + 2] = (Math.random() - 0.5) * 18;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      /* Lights */
      pl1.position.x = 18 + Math.sin(t * 0.25) * 3;
      pl1.position.z = 22 + Math.cos(t * 0.18) * 3;

      renderer.render(scene, camera);
    }
    animate();

    /* ── Resize ── */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        /* Canvas stays visible on all viewports */
        var w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    });
  }

  /* ═══════════════════════════════════════════════
     TYPES SHOWCASE — Three.js Morphing Buildings + Scroll-Lock
     ═══════════════════════════════════════════════ */
  function initTypesShowcase() {
    var cards = document.querySelectorAll('.adu-type-card');
    var dots = document.querySelectorAll('.adu-tdot');
    var fill = document.querySelector('.adu-types-fill');
    var typesEl = document.getElementById('adu-types');
    if (!typesEl || !cards.length) return;

    var lastStep = 0;

    function setTypeStep(step) {
      if (step === lastStep) return;
      cards.forEach(function (card, i) {
        gsap.to(card, {
          opacity: i === step ? 1 : 0,
          y: i === step ? '-50%' : (i < step ? '-80%' : '-20%'),
          duration: 0.5, ease: 'power2.out', overwrite: true,
        });
      });
      dots.forEach(function (d, i) { d.classList.toggle('active', i <= step); });
      if (fill) fill.style.width = (step / 3 * 100) + '%';
      typesEl.dispatchEvent(new CustomEvent('type-change', { detail: { step: step } }));
      lastStep = step;
    }

    ScrollTrigger.create({
      trigger: '#adu-types',
      start: 'top top',
      end: '+=' + (window.innerHeight * 4),
      pin: true,
      scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress;
        var step = Math.min(Math.floor(p * 4), 3);
        setTypeStep(step);
      },
    });

    /* ── Three.js Morphing Buildings ── */
    initTypes3D(typesEl);
  }

  function initTypes3D(typesEl) {
    if (typeof THREE === 'undefined') return;

    var wrap = document.getElementById('types-canvas');
    if (!wrap) return;

    /* ── Setup ── */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 1000);
    camera.position.set(20, 16, 28);
    camera.lookAt(0, 2, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xf0ede8, 0.3));
    var pl1 = new THREE.PointLight(0xc9a96e, 0.8, 80);
    pl1.position.set(18, 22, 22);
    scene.add(pl1);

    /* ── Materials ── */
    var GOLD = 0xc9a96e, DARK = 0x222222, LIGHT_GRAY = 0xbbbbbb;
    var gridMat = new THREE.LineBasicMaterial({ color: LIGHT_GRAY, transparent: true, opacity: 0.15 });
    var buildMat = new THREE.LineBasicMaterial({ color: DARK, transparent: true, opacity: 0.35 });
    var accentMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.4 });

    var sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    function lineSegs(pts, mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, mat);
    }

    /* Ground Grid */
    var gp = [];
    for (var i = -10; i <= 10; i += 2) { gp.push(i, 0, -8, i, 0, 8); }
    for (var i = -8; i <= 8; i += 2) { gp.push(-10, 0, i, 10, 0, i); }
    sceneGroup.add(lineSegs(gp, gridMat));

    /* ═══ MORPH INFRASTRUCTURE ═══ */
    var SEG = 120, FC = SEG * 6;
    function pad(a) { var r = new Float32Array(FC); for (var j = 0; j < a.length && j < FC; j++) r[j] = a[j]; return r; }
    function bx(cx, cy, cz, w, h, d) {
      var hw = w/2, hh = h/2, hd = d/2, x0 = cx-hw, x1 = cx+hw, y0 = cy-hh, y1 = cy+hh, z0 = cz-hd, z1 = cz+hd;
      return [x0,y0,z0,x1,y0,z0, x1,y0,z0,x1,y0,z1, x1,y0,z1,x0,y0,z1, x0,y0,z1,x0,y0,z0,
        x0,y1,z0,x1,y1,z0, x1,y1,z0,x1,y1,z1, x1,y1,z1,x0,y1,z1, x0,y1,z1,x0,y1,z0,
        x0,y0,z0,x0,y1,z0, x1,y0,z0,x1,y1,z0, x1,y0,z1,x1,y1,z1, x0,y0,z1,x0,y1,z1];
    }
    function ws(x0, y0, z, x1, y1) { return [x0,y0,z,x1,y0,z, x1,y0,z,x1,y1,z, x1,y1,z,x0,y1,z, x0,y1,z,x0,y0,z]; }
    function wx(x, y0, z0, y1, z1) { return [x,y0,z0,x,y0,z1, x,y0,z1,x,y1,z1, x,y1,z1,x,y1,z0, x,y1,z0,x,y0,z0]; }
    function vl(x, y0, y1, z) { return [x,y0,z,x,y1,z]; }
    function hl(x0, x1, y, z) { return [x0,y,z,x1,y,z]; }
    function flat(a) { var r = []; for (var j = 0; j < a.length; j++) { if (Array.isArray(a[j])) for (var k = 0; k < a[j].length; k++) r.push(a[j][k]); else r.push(a[j]); } return r; }

    /* T0: Detached ADU — simple gable house */
    var t0 = flat([].concat(
      bx(0, 3.5, 0, 8, 7, 6),
      [0, 8, -3, 0, 8, 3],
      [-4, 7, -3, 0, 8, -3], [4, 7, -3, 0, 8, -3],
      [-4, 7, 3, 0, 8, 3], [4, 7, 3, 0, 8, 3],
      [-4, 7, -3, 0, 8, -3], [0, 8, -3, 4, 7, -3],
      [-4, 7, 3, 0, 8, 3], [0, 8, 3, 4, 7, 3]
    ));

    /* T1: Attached ADU — main house + wing */
    var t1 = flat([].concat(
      bx(-2, 4, 0, 10, 8, 7),
      bx(6, 3, 0, 5, 6, 6),
      [-2, 8.5, -3.5, -2, 8.5, 3.5],
      [-7, 8, -3.5, -2, 8.5, -3.5], [3, 8, -3.5, -2, 8.5, -3.5],
      [-7, 8, 3.5, -2, 8.5, 3.5], [3, 8, 3.5, -2, 8.5, 3.5],
      [3.5, 6, -3, 8.5, 6, -3], [8.5, 6, -3, 8.5, 6, 3],
      [8.5, 6, 3, 3.5, 6, 3], [3.5, 6, 3, 3.5, 6, -3]
    ));

    /* T2: Garage Conversion — wide low box */
    var t2 = flat([].concat(
      bx(0, 2.5, 0, 10, 5, 7),
      [-5.3, 5.1, -3.8, 5.3, 5.1, -3.8],
      [5.3, 5.1, -3.8, 5.3, 5.1, 3.8],
      [5.3, 5.1, 3.8, -5.3, 5.1, 3.8],
      [-5.3, 5.1, 3.8, -5.3, 5.1, -3.8],
      [-2.5, 0, -3.51, -2.5, 4, -3.51],
      [2.5, 0, -3.51, 2.5, 4, -3.51],
      [-2.5, 4, -3.51, 2.5, 4, -3.51]
    ));

    /* T3: Above-Garage ADU — two-story box */
    var t3 = flat([].concat(
      bx(0, 2.5, 0, 10, 5, 7),
      bx(0, 7.5, 0, 10, 5, 7),
      [-5, 5, -3.5, 5, 5, -3.5], [-5, 5, 3.5, 5, 5, 3.5],
      [0, 10.8, -3.5, 0, 10.8, 3.5],
      [-5, 10, -3.5, 0, 10.8, -3.5], [5, 10, -3.5, 0, 10.8, -3.5],
      [-5, 10, 3.5, 0, 10.8, 3.5], [5, 10, 3.5, 0, 10.8, 3.5]
    ));

    var morphTargets = [pad(t0), pad(t1), pad(t2), pad(t3)];

    /* Building geometry (morphable) */
    var buildPos = new Float32Array(FC), accentPos = new Float32Array(FC);
    for (var i = 0; i < FC; i++) { buildPos[i] = morphTargets[0][i]; accentPos[i] = morphTargets[0][i]; }

    var buildGeo = new THREE.BufferGeometry();
    buildGeo.setAttribute('position', new THREE.Float32BufferAttribute(buildPos, 3));
    sceneGroup.add(new THREE.LineSegments(buildGeo, buildMat));

    var accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.Float32BufferAttribute(accentPos, 3));
    sceneGroup.add(new THREE.LineSegments(accentGeo, accentMat));

    /* Particles */
    var PC = 25, pArr = new Float32Array(PC * 3), pVel = [];
    for (var i = 0; i < PC; i++) {
      pArr[i * 3] = (Math.random() - 0.5) * 24;
      pArr[i * 3 + 1] = Math.random() * 14;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 20;
      pVel.push(0.002 + Math.random() * 0.006);
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({ color: GOLD, size: 0.06, transparent: true, opacity: 0.15, sizeAttenuation: true });
    sceneGroup.add(new THREE.Points(pGeo, pMat));

    /* Morph state */
    var currentTarget = 0;
    typesEl.addEventListener('type-change', function (e) { currentTarget = e.detail.step; });

    /* ── Mouse Parallax ── */
    var mouse = { x: 0, y: 0 };
    var targetRot = { x: 0, y: 0 };
    document.addEventListener('mousemove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Visibility Gate ── */
    var isVisible = false;
    new IntersectionObserver(function (e) { isVisible = e[0].isIntersecting; }, { threshold: 0.01 }).observe(typesEl);

    /* ── Render Loop ── */
    var clock = new THREE.Clock();
    var baseRot = -0.3;

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;
      var t = clock.getElapsedTime();

      /* Slow orbit + mouse parallax */
      targetRot.y = baseRot + mouse.x * 0.12 + t * 0.025;
      targetRot.x = mouse.y * 0.05;
      sceneGroup.rotation.y += (targetRot.y - sceneGroup.rotation.y) * 0.015;
      sceneGroup.rotation.x += (targetRot.x - sceneGroup.rotation.x) * 0.015;

      var breathe = 1 + Math.sin(t * 0.35) * 0.006;
      sceneGroup.scale.setScalar(breathe);

      /* Morph */
      var target = morphTargets[currentTarget];
      var bArr = buildGeo.attributes.position.array;
      var aArr = accentGeo.attributes.position.array;
      var morphing = false;
      for (var j = 0; j < FC; j++) {
        var diff = target[j] - bArr[j];
        if (Math.abs(diff) > 0.01) { morphing = true; bArr[j] += diff * 0.04; aArr[j] += diff * 0.04; }
      }
      if (morphing) { buildGeo.attributes.position.needsUpdate = true; accentGeo.attributes.position.needsUpdate = true; }
      accentMat.opacity = morphing ? 0.2 : 0.5;
      buildMat.opacity = morphing ? 0.25 : 0.4;

      /* Particles */
      var pa = pGeo.attributes.position.array;
      for (var k = 0; k < PC; k++) {
        pa[k * 3 + 1] += pVel[k];
        if (pa[k * 3 + 1] > 18) {
          pa[k * 3 + 1] = -1;
          pa[k * 3] = (Math.random() - 0.5) * 24;
          pa[k * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      /* Lights */
      pl1.position.x = 18 + Math.sin(t * 0.25) * 3;
      pl1.position.z = 22 + Math.cos(t * 0.18) * 3;

      renderer.render(scene, camera);
    }
    animate();

    /* ── Resize ── */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        /* Canvas stays visible on all viewports */
        var w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS — data-animate handlers
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { y: 50, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );
    });

    /* word-stagger-elastic */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function (el) {
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    });

    /* parallax-depth */
    document.querySelectorAll('[data-animate="parallax-depth"]').forEach(function (el) {
      gsap.to(el, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    /* line-wipe */
    document.querySelectorAll('[data-animate="line-wipe"]').forEach(function (el) {
      var lineEls = el.querySelectorAll('.line');
      if (!lineEls.length) {
        var html = el.innerHTML;
        var texts;
        if (/<br\s*\/?>/i.test(html)) {
          texts = html.split(/<br\s*\/?>/i).map(function (s) {
            return s.replace(/<[^>]*>/g, '').trim();
          }).filter(Boolean);
        } else {
          texts = [el.textContent.trim()];
        }
        el.innerHTML = '';
        texts.forEach(function (t) {
          var d = document.createElement('div');
          d.className = 'line';
          d.textContent = t;
          el.appendChild(d);
        });
        lineEls = el.querySelectorAll('.line');
      }
      lineEls.forEach(function (line, i) {
        gsap.set(line, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(line, {
          clipPath: 'inset(0 0% 0 0)', ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top ' + (85 - i * 12) + '%',
            end: 'top ' + (65 - i * 12) + '%',
            scrub: 1,
          },
        });
      });
    });

    /* Label line expand */
    document.querySelectorAll('.av-label-line').forEach(function (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line.parentElement, start: 'top 85%' } }
      );
    });

    /* Magnetic buttons (desktop) */
    if (window.innerWidth >= 992) {
      document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.15;
          var y = (e.clientY - r.top - r.height / 2) * 0.15;
          gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', function () {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  /* ═══════════════════════════════════════════════
     TIMELINE — SVG Vertical Line Draw + Node Activation
     ═══════════════════════════════════════════════ */
  function initTimeline() {
    var drawLine = document.querySelector('.adu-tl-draw');
    var tlSteps = document.querySelectorAll('.adu-tl-step');
    if (!drawLine || !tlSteps.length) return;

    var lineLen = 1000;
    gsap.set(drawLine, { attr: { 'stroke-dasharray': lineLen, 'stroke-dashoffset': lineLen } });

    var activated = [false, false, false];
    ScrollTrigger.create({
      trigger: '#adu-timeline',
      start: 'top 75%',
      end: 'bottom 70%',
      scrub: 0.5,
      onUpdate: function (self) {
        var p = self.progress;
        gsap.set(drawLine, { attr: { 'stroke-dashoffset': lineLen * (1 - p) } });

        tlSteps.forEach(function (step, i) {
          var threshold = i / tlSteps.length;
          var node = step.querySelector('.adu-tl-node');
          if (p >= threshold + 0.05 && !activated[i]) {
            activated[i] = true;
            node.classList.add('active');
            gsap.to(step.querySelectorAll('.adu-tl-title .word'), {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out',
            });
            gsap.to(step.querySelector('.adu-tl-time'), {
              opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out',
            });
            gsap.to(step.querySelector('.adu-tl-desc'), {
              opacity: 0.6, filter: 'blur(0px)', y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out',
            });
          }
        });
      },
    });
  }

  /* ═══════════════════════════════════════════════
     CTA — Word Stagger Elastic + Magnetic Buttons + Ambient Glow
     ═══════════════════════════════════════════════ */
  function initCTA() {
    var ctaSection = document.querySelector('.adu-cta-container');
    if (!ctaSection) return;

    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
      'width:140%;height:140%;border-radius:50%;pointer-events:none;z-index:0;',
      'background:radial-gradient(ellipse at center, rgba(200,34,42,0.06) 0%, transparent 60%);',
      'opacity:0;',
    ].join('');
    ctaSection.style.position = 'relative';
    ctaSection.insertBefore(glow, ctaSection.firstChild);

    ScrollTrigger.create({
      trigger: ctaSection,
      start: 'top 80%',
      onEnter: function () {
        gsap.to(glow, {
          opacity: 1, duration: 1.5, ease: 'power2.out',
          onComplete: function () {
            gsap.to(glow, { opacity: 0.4, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          },
        });
      },
      onLeaveBack: function () {
        gsap.to(glow, { opacity: 0, duration: 0.5, overwrite: true });
      },
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initHero();
    initTypesShowcase();
    initTimeline();
    initScrollAnimations();
    initCTA();
  });
})();
