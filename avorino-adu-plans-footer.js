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
      '#adu-plans-hero{position:relative;isolation:isolate;background:var(--adu-plans-dark);}',
      '#adu-plans-hero #hero-canvas{position:absolute;inset:0;z-index:1;pointer-events:none;}',
      '#adu-plans-hero-canvas{display:block;width:100% !important;height:100% !important;}',
      '[data-adu-plan-section]{position:relative;background:var(--adu-plans-cream);}',
      '[data-adu-plan-section="casielo"]{background:var(--adu-plans-warm);}',
      '[data-adu-plan-section] [data-adu-role="plan-layout"]{align-items:flex-start;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"],[data-adu-plan-section] [data-adu-role="plan-panel"]{will-change:transform,opacity;}',
      '[data-adu-plan-section] [data-adu-role="plan-stage"] iframe{display:block;width:100% !important;background:var(--adu-plans-surface) !important;}',
      '[data-adu-gallery-hero],[data-adu-main-image]{cursor:zoom-in;}',
      '[data-adu-main-image]{display:block;width:100% !important;height:100% !important;object-fit:cover;}',
      '[data-adu-thumbs]{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px !important;}',
      '[data-adu-thumb]{cursor:pointer;transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease,opacity .35s ease;transform:translateY(0);}',
      '[data-adu-thumb]:hover{transform:translateY(-2px);border-color:rgba(200,168,110,.45) !important;}',
      '[data-adu-thumb].is-active{transform:translateY(-2px);border-color:rgba(200,168,110,.6) !important;box-shadow:0 18px 40px rgba(17,17,17,.12);}',
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
      '@media (max-width: 991px){',
      '  #adu-plans-hero{padding:120px 24px 56px !important;min-height:72vh !important;}',
      '  #adu-plans-hero h1{font-size:clamp(48px,11vw,64px) !important;max-width:10ch !important;}',
      '  #adu-plans-hero p{max-width:540px !important;}',
      '  [data-adu-plan-section]{padding:88px 24px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-layout"]{display:flex !important;flex-direction:column !important;gap:36px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"],[data-adu-plan-section] [data-adu-role="plan-panel"]{width:100% !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:520px !important;height:520px !important;}',
      '  [data-adu-plan-section] [data-adu-main-image]{height:420px !important;}',
      '}',
      '@media (max-width: 767px){',
      '  #adu-plans-hero{padding:104px 16px 44px !important;min-height:66vh !important;}',
      '  #adu-plans-hero h1{font-size:clamp(40px,13vw,52px) !important;line-height:1.02 !important;}',
      '  #adu-plans-hero p{font-size:16px !important;line-height:1.7 !important;max-width:none !important;}',
      '  [data-adu-plan-section]{padding:72px 16px !important;}',
      '  [data-adu-plan-section] [data-adu-role="plan-stage"] iframe{min-height:400px !important;height:400px !important;}',
      '  [data-adu-plan-section] [data-adu-main-image]{height:280px !important;}',
      '  [data-adu-plan-section] h2{font-size:clamp(32px,10vw,44px) !important;line-height:1.04 !important;}',
      '  [data-adu-plan-section] p{font-size:15px !important;line-height:1.7 !important;}',
      '  [data-adu-thumbs]{gap:10px !important;}',
      '  [data-adu-thumb]{min-height:96px !important;}',
      '  #adu-plans-lightbox .adu-plans-lightbox-btn{width:42px;height:42px;}',
      '  #adu-plans-lightbox .adu-plans-lightbox-prev{left:12px;}',
      '  #adu-plans-lightbox .adu-plans-lightbox-next{right:12px;}',
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
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x111111, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(12, 10, 15);
    camera.lookAt(0, 0, 0);

    var wireMat = new THREE.LineBasicMaterial({ color: 0xc8a86e, transparent: true, opacity: 0.62 });
    var ghostMat = new THREE.LineBasicMaterial({ color: 0xc8a86e, transparent: true, opacity: 0.12 });

    var gridGroup = new THREE.Group();
    var planGroup = new THREE.Group();

    function addLine(group, x1, z1, x2, z2, material) {
      var geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, 0, z1),
        new THREE.Vector3(x2, 0, z2)
      ]);
      group.add(new THREE.Line(geometry, material));
    }

    function addRect(group, width, depth, x, z, material) {
      var hw = width / 2;
      var hd = depth / 2;
      addLine(group, x - hw, z - hd, x + hw, z - hd, material);
      addLine(group, x + hw, z - hd, x + hw, z + hd, material);
      addLine(group, x + hw, z + hd, x - hw, z + hd, material);
      addLine(group, x - hw, z + hd, x - hw, z - hd, material);
    }

    var gridSize = 16;
    var gridStep = 2;
    for (var pos = -gridSize; pos <= gridSize; pos += gridStep) {
      addLine(gridGroup, -gridSize, pos, gridSize, pos, ghostMat);
      addLine(gridGroup, pos, -gridSize, pos, gridSize, ghostMat);
    }

    addRect(planGroup, 9, 6, 0, 0, wireMat);
    addLine(planGroup, -1.5, -3, -1.5, 3, wireMat);
    addLine(planGroup, 2.25, -3, 2.25, 0.75, wireMat);
    addLine(planGroup, -1.5, 0.75, 2.25, 0.75, wireMat);
    addRect(planGroup, 3.75, 3.75, 6.2, -1.15, wireMat);
    addLine(planGroup, 4.35, -3.025, 4.35, 0.725, wireMat);
    addLine(planGroup, 0.9, -3, 1.9, -3, wireMat);
    addLine(planGroup, 2.2, -3, 3.4, -3, wireMat);
    addLine(planGroup, 6.2, 0.725, 7.3, 0.725, wireMat);

    gridGroup.rotation.y = -0.24;
    planGroup.rotation.y = -0.24;
    scene.add(gridGroup);
    scene.add(planGroup);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

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
        entries.forEach(function(entry) {
          heroVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!heroVisible) return;
      planGroup.rotation.y += 0.0014;
      gridGroup.rotation.y += 0.00055;
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

  function initHeroCharCascade() {
    var h1 = document.querySelector('#adu-plans-hero h1');
    if (!h1 || h1.dataset.cascadeBound === '1') return;
    h1.dataset.cascadeBound = '1';

    var text = h1.textContent || '';
    h1.textContent = '';
    h1.style.opacity = '1';

    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === '\n') {
        h1.appendChild(document.createElement('br'));
        continue;
      }
      var span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(24px)';
      h1.appendChild(span);
      chars.push(span);
    }

    if (window.gsap && chars.length) {
      window.gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.2
      });
    }
  }

  function initHeroGoldLine() {
    var hero = document.getElementById('adu-plans-hero');
    if (!hero || !window.gsap) return;
    var lines = hero.querySelectorAll('[class*="gold-line"]');
    if (!lines.length) return;
    window.gsap.to(lines, {
      width: '80px',
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.8
    });
  }

  function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    var hero = document.getElementById('adu-plans-hero');
    var heroCanvas = document.getElementById('adu-plans-hero-canvas');

    var heroLabel = hero ? hero.querySelector('[data-animate="fade-up"]') : null;
    var heroSubtitle = hero ? hero.querySelector('p[data-animate="fade-up"]') : null;
    var heroScrollHint = hero ? hero.querySelector('div[data-animate="fade-up"]:last-of-type') : null;
    var heroScrollLine = hero ? hero.querySelector('[class*="scroll-line"]') : null;

    var fadeUpTargets = hero ? hero.querySelectorAll('[data-animate="fade-up"]') : [];
    if (fadeUpTargets.length) {
      gsap.from(fadeUpTargets, {
        opacity: 0,
        y: 28,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.1
      });
    }

    if (heroScrollLine) {
      gsap.fromTo(heroScrollLine,
        { scaleY: 0.25, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }

    if (hero) {
      var heroContent = hero.querySelectorAll('[data-animate]');
      if (heroContent.length) {
        gsap.to(heroContent, {
          y: -72,
          opacity: 0,
          ease: 'none',
          stagger: 0.03,
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65
          }
        });
      }
    }

    if (hero && heroCanvas) {
      gsap.to(heroCanvas, {
        yPercent: -6,
        scale: 1.04,
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
    injectRuntimeStyles();
    initHeroWireframe();
    initHeroCharCascade();
    initHeroGoldLine();
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
