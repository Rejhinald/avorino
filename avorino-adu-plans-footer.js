(function() {
  'use strict';

  if (window.__AVORINO_ADU_PLANS_RUNTIME__) return;
  window.__AVORINO_ADU_PLANS_RUNTIME__ = { version: 'inline-runtime-v1' };

  function initLenis() {
    if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;
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

  function injectResponsiveOverrides() {
    if (document.getElementById('adu-plans-runtime-overrides')) return;

    var style = document.createElement('style');
    style.id = 'adu-plans-runtime-overrides';
    style.textContent = [
      ':root{--adu-plans-dark:#111111;--adu-plans-cream:#f0ede8;--adu-plans-gold:#c8a86e;}',
      'html,body{overflow-x:hidden !important;}',
      '#adu-plans-hero{position:relative;isolation:isolate;}',
      '#adu-plans-hero [data-adu-role="hero-inner"]{width:min(100%,1440px);margin-inline:auto;}',
      '#adu-plans-hero [data-adu-role="hero-media"]{display:block;}',
      '#adu-plans-hero-canvas{display:block;width:100% !important;height:100% !important;}',
      '[data-adu-plan-section]{position:relative;}',
      '[data-adu-plan-section] [data-adu-role="plan-layout"]{align-items:flex-start;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"],[data-adu-plan-section] [data-adu-role="plan-panel"]{will-change:transform,opacity;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"] iframe{display:block;width:100% !important;}',
      '[data-adu-main-image]{display:block;width:100% !important;height:100% !important;object-fit:cover;}',
      '[data-adu-thumbs]{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px !important;}',
      '[data-adu-thumb]{cursor:pointer;transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease,opacity .35s ease;transform:translateY(0);}',
      '[data-adu-thumb]:hover{transform:translateY(-2px);border-color:rgba(200,168,110,.45) !important;}',
      '[data-adu-thumb].is-active{transform:translateY(-2px);border-color:rgba(200,168,110,.6) !important;box-shadow:0 18px 40px rgba(17,17,17,.12);}',
      '@media (max-width: 991px){',
      '  #adu-plans-hero{padding:104px 24px 56px !important;min-height:auto !important;}',
      '  #adu-plans-hero [data-adu-role="hero-inner"]{display:grid !important;grid-template-columns:minmax(0,1fr) !important;gap:32px !important;}',
      '  #adu-plans-hero [data-adu-role="hero-media"]{order:2;}',
      '  #adu-plans-hero h1{font-size:clamp(42px,9vw,56px) !important;max-width:12ch !important;}',
      '  #adu-plans-hero p{max-width:none !important;}',
      '  #adu-plans-hero-canvas{min-height:320px !important;height:clamp(320px,56vw,440px) !important;max-height:440px !important;}',
      '  [data-adu-plan-section]{padding:88px 24px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-layout"]{display:flex !important;flex-direction:column !important;gap:36px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"],',
      '  [data-adu-plan-section] [data-adu-role="plan-panel"]{width:100% !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:520px !important;height:520px !important;}',
      '  [data-adu-plan-section] [data-adu-main-image]{height:420px !important;}',
      '}',
      '@media (max-width: 767px){',
      '  #adu-plans-hero{padding:92px 16px 44px !important;}',
      '  #adu-plans-hero [data-adu-role="hero-inner"]{gap:24px !important;}',
      '  #adu-plans-hero h1{font-size:clamp(36px,12vw,48px) !important;line-height:1.02 !important;}',
      '  #adu-plans-hero p{font-size:16px !important;line-height:1.65 !important;}',
      '  #adu-plans-hero-canvas{min-height:280px !important;height:clamp(280px,64vw,360px) !important;max-height:360px !important;}',
      '  [data-adu-plan-section]{padding:72px 16px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:400px !important;height:400px !important;}',
      '  [data-adu-plan-section] [data-adu-main-image]{height:280px !important;}',
      '  [data-adu-plan-section] h2{font-size:clamp(32px,10vw,44px) !important;line-height:1.04 !important;}',
      '  [data-adu-plan-section] p{font-size:15px !important;line-height:1.7 !important;}',
      '  [data-adu-thumbs]{gap:10px !important;}',
      '  [data-adu-thumb]{min-height:96px !important;}',
      '}',
      '@media (prefers-reduced-motion: reduce){',
      '  [data-adu-thumb]{transition:none !important;}',
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
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x111111, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(14, 10, 14);
    camera.lookAt(0, 2, 0);

    var wireMat = new THREE.LineBasicMaterial({ color: 0xc8a86e, transparent: true, opacity: 0.6 });
    var ghostMat = new THREE.LineBasicMaterial({ color: 0xc8a86e, transparent: true, opacity: 0.15 });
    var houseGroup = new THREE.Group();

    var baseGeo = new THREE.BoxGeometry(8, 5, 6);
    var baseLine = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), wireMat);
    baseLine.position.y = 2.5;
    houseGroup.add(baseLine);

    var roofVerts = [
      new THREE.Vector3(-4, 5, -3), new THREE.Vector3(-4, 5, 3),
      new THREE.Vector3(4, 5, 3), new THREE.Vector3(4, 5, -3),
      new THREE.Vector3(0, 7.5, -3), new THREE.Vector3(0, 7.5, 3)
    ];
    var roofPairs = [[0, 4], [4, 3], [1, 5], [5, 2], [0, 1], [3, 2], [4, 5], [0, 3], [1, 2]];
    var roofPts = [];
    roofPairs.forEach(function(pair) {
      roofPts.push(roofVerts[pair[0]], roofVerts[pair[1]]);
    });
    houseGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(roofPts), wireMat));

    var aduLine = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4, 3.5, 4)), wireMat);
    aduLine.position.set(6, 1.75, -1);
    houseGroup.add(aduLine);

    var aduRoofLine = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.4, 0.2, 4.4)), wireMat);
    aduRoofLine.position.set(6, 3.6, -1);
    houseGroup.add(aduRoofLine);

    var lotGrid = new THREE.Group();
    [-10, -5, 0, 5, 10].forEach(function(offset) {
      var lineX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-12, 0, offset),
        new THREE.Vector3(12, 0, offset)
      ]);
      var lineZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(offset, 0, -12),
        new THREE.Vector3(offset, 0, 12)
      ]);
      lotGrid.add(new THREE.LineSegments(lineX, ghostMat));
      lotGrid.add(new THREE.LineSegments(lineZ, ghostMat));
    });

    scene.add(lotGrid);
    scene.add(houseGroup);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
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

    function animate() {
      requestAnimationFrame(animate);
      if (!heroVisible) return;
      houseGroup.rotation.y += 0.003;
      lotGrid.rotation.y -= 0.0015;
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
      if (button.getAttribute('data-adu-thumb') === activeName) {
        button.classList.add('is-active');
      } else {
        button.classList.remove('is-active');
      }
    });
  }

  function selectRoom(planKey, roomName) {
    var section = document.querySelector('[data-adu-plan-section="' + planKey + '"]');
    if (!section) return;

    var normalized = normalizeRoomName(roomName);
    if (!normalized || normalized === 'Overview') {
      setActiveThumbs(section, '__none__');
      return;
    }

    var thumb = findThumb(section, normalized);
    if (!thumb) return;

    var image = section.querySelector('[data-adu-main-image]');
    var thumbImage = thumb.querySelector('img');

    if (image && thumbImage && thumbImage.getAttribute('src')) {
      image.setAttribute('src', thumbImage.getAttribute('src'));
      image.setAttribute('alt', normalized);
    }

    setActiveThumbs(section, thumb.getAttribute('data-adu-thumb'));
  }

  function initPlanSections() {
    Array.prototype.slice.call(document.querySelectorAll('[data-adu-plan-section]')).forEach(function(section) {
      var planKey = section.getAttribute('data-adu-plan-section');
      Array.prototype.slice.call(section.querySelectorAll('[data-adu-thumb]')).forEach(function(button) {
        if (button.dataset.bound === '1') return;
        button.dataset.bound = '1';
        button.addEventListener('click', function() {
          selectRoom(planKey, button.getAttribute('data-adu-thumb'));
        });
      });
      setActiveThumbs(section, '__none__');
    });
  }

  function initMessaging() {
    window.addEventListener('message', function(event) {
      var data = event && event.data;
      if (!data || data.type !== 'adu-plan-room-select' || !data.plan || !data.room) return;
      selectRoom(data.plan, data.room);
    });
  }

  function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    var hero = document.getElementById('adu-plans-hero');
    var heroTargets = document.querySelectorAll('#adu-plans-hero [data-adu-animate]');
    var heroCopyTargets = document.querySelectorAll('#adu-plans-hero [data-adu-animate="hero-copy"]');
    var heroCanvas = document.getElementById('adu-plans-hero-canvas');
    var heroScrollLine = document.querySelector('.adu-plans-hero-scroll-line');

    if (heroTargets.length) {
      gsap.from(heroTargets, {
        opacity: 0,
        y: 28,
        duration: 0.95,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    if (heroScrollLine) {
      gsap.fromTo(heroScrollLine,
        { scaleY: 0.25, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }

    if (hero && heroCopyTargets.length) {
      gsap.to(heroCopyTargets, {
        y: -72,
        opacity: 0,
        ease: 'none',
        stagger: 0.02,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.65
        }
      });
    }

    if (hero && heroCanvas) {
      gsap.to(heroCanvas, {
        yPercent: -8,
        scale: 1.05,
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
    injectResponsiveOverrides();
    initHeroWireframe();
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
