(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  // Keep Lenis scroll limits in sync when ScrollTrigger adds/removes pin-spacers
  ScrollTrigger.addEventListener('refresh', () => lenis.resize());

  // MAGNETIC BUTTONS
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, { x: dx * 0.25, y: dy * 0.25, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // PRELOADER — Blueprint Wireframe Build
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const curtain = document.querySelector('.preloader-curtain');
    if (preloader) gsap.set(preloader, { display: 'flex' });

    if (!preloader) {
      initScrollAnimations();
      initHeroEntrance();
      return;
    }

    // Skip animation for repeat visitors in same session
    if (sessionStorage.getItem('avorino-visited')) {
      gsap.set(preloader, { display: 'none' });
      lenis.start();
      initScrollAnimations();
      initHeroContentEntrance();
      return;
    }
    sessionStorage.setItem('avorino-visited', '1');

    lenis.stop();

    const grid = preloader.querySelector('[data-el="preloader-grid"]');
    const house = preloader.querySelector('[data-el="preloader-house"]');
    const logoWrap = preloader.querySelector('[data-el="preloader-logo-wrap"]');
    if (logoWrap) gsap.set(logoWrap, { xPercent: -50, yPercent: -50, scale: 0.9 });

    // Guard: if old preloader HTML without blueprint SVG, skip animation gracefully
    if (!house) {
      preloader.style.display = 'none';
      lenis.start();
      initScrollAnimations();
      initHeroContentEntrance();
      return;
    }

    const foundation = house.querySelector('.house-foundation');
    const walls = house.querySelectorAll('.house-wall');
    const roofLines = house.querySelectorAll('.house-roof');
    const door = house.querySelector('.house-door');
    const windows = house.querySelectorAll('.house-window');

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        lenis.start();
        initScrollAnimations();
        initHeroContentEntrance();
      }
    });

    // 0s: Blueprint grid fades in
    tl.to(grid, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);

    // 0.3s: Foundation draws left→right
    tl.to(foundation, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.3);

    // 0.7s: Walls draw upward
    tl.to(walls, { strokeDashoffset: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 0.7);

    // 1.0s: Roof draws from peak outward
    tl.to(roofLines, { strokeDashoffset: 0, duration: 0.4, stagger: 0.05, ease: 'power2.inOut' }, 1.0);

    // 1.3s: Door and windows fade in
    tl.to(door, { opacity: 0.6, duration: 0.3, ease: 'power2.out' }, 1.3);
    tl.to(windows, { opacity: 0.5, duration: 0.25, stagger: 0.1, ease: 'power2.out' }, 1.4);

    // 1.7s: Lines glow red briefly
    tl.to(house.querySelectorAll('line, rect'), {
      stroke: '#c8222a', duration: 0.3, ease: 'power2.out'
    }, 1.7);
    tl.to(house.querySelectorAll('line, rect'), {
      stroke: '#f0ede8', duration: 0.4, ease: 'power2.out'
    }, 2.0);

    // 2.2s: Wireframe fades + scales down, logo fades in
    tl.to(house, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' }, 2.2);
    tl.to(grid, { opacity: 0, duration: 0.3 }, 2.2);
    tl.to(logoWrap, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 0.6, ease: 'power3.out' }, 2.4);

    // 3.0s: Hold logo briefly, then exit
    tl.to({}, { duration: 0.4 }, 3.0);
    tl.to(logoWrap, { opacity: 0, xPercent: -50, yPercent: -50, duration: 0.3, ease: 'power2.in' }, 3.4);
    tl.set(preloader, { background: 'transparent' });
    if (curtain) tl.to(curtain, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 3.4);
  }

  // HERO ENTRANCE (no-preloader fallback)
  function initHeroEntrance() {
    initHeroContentEntrance();
  }

  // HERO CONTENT — subtitle + CTA entrance + scroll-driven effects
  function initHeroContentEntrance() {
    const heroContent = document.querySelector('[data-el="hero-content"]');
    const subtitle = document.querySelector('[data-el="hero-subtitle"]');
    const cta = document.querySelector('[data-el="hero-cta"]');
    const scrollIndicator = document.querySelector('[data-el="hero-scroll"]');
    const heroVideo = document.querySelector('.hero-container video');
    if (!heroContent) return;

    // Set initial states
    if (subtitle) gsap.set(subtitle, { opacity: 0, x: -20 });
    if (cta) gsap.set(cta, { opacity: 0, x: -20 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

    // Entrance timeline
    const tl = gsap.timeline({ delay: 0.6 });

    if (subtitle) {
      tl.to(subtitle, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0);
    }
    if (cta) {
      tl.to(cta, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0.2);
    }
    if (scrollIndicator) {
      tl.to(scrollIndicator, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0.8);
    }

    // SCROLL-DRIVEN EFFECTS (desktop only)
    if (window.innerWidth > 767) {
      const hero = document.querySelector('.hero');
      if (!hero) return;

      // Subtitle and CTA fade out on scroll
      if (subtitle) {
        gsap.to(subtitle, {
          y: -80, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '50% top', scrub: 0.6 }
        });
      }
      if (cta) {
        gsap.to(cta, {
          y: -60, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '40% top', scrub: 0.6 }
        });
      }

      // Video subtle zoom on scroll
      if (heroVideo) {
        gsap.to(heroVideo, {
          scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
        });
      }

      // Scroll indicator fades out quickly
      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          opacity: 0, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: 0.6 }
        });
      }
    }
  }

  // SCROLL ANIMATIONS
  function initScrollAnimations() {
    // Line-wipe: animate .line children (or auto-detect if none exist)
    document.querySelectorAll('[data-animate="line-wipe"]').forEach(function(el) {
      var lineEls = el.querySelectorAll('.line');
      if (!lineEls.length) {
        // Fallback: no .line children, try <br> split or auto-detect
        var html = el.innerHTML;
        var texts;
        if (/<br\s*\/?>/i.test(html)) {
          texts = html.split(/<br\s*\/?>/i).map(function(s) { return s.replace(/<[^>]*>/g, '').trim(); }).filter(Boolean);
        } else {
          texts = [el.textContent.trim()];
        }
        el.innerHTML = '';
        texts.forEach(function(t) {
          var d = document.createElement('div');
          d.className = 'line';
          d.textContent = t;
          el.appendChild(d);
        });
        lineEls = el.querySelectorAll('.line');
      }
      // Animate each .line sequentially (no overlap between lines)
      lineEls.forEach(function(line, i) {
        gsap.set(line, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(line, {
          clipPath: 'inset(0 0% 0 0)', ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top ' + (88 - i * 20) + '%', end: 'top ' + (68 - i * 20) + '%', scrub: 1 }
        });
      });
    });

    // Opacity-sweep
    document.querySelectorAll('[data-animate="opacity-sweep"]').forEach(el => {
      const words = el.textContent.trim().split(/(\s+)/);
      el.innerHTML = '';
      const allSpans = [];
      words.forEach(segment => {
        if (/^\s+$/.test(segment)) {
          const s = document.createElement('span'); s.textContent = ' '; s.style.opacity = '0.05';
          el.appendChild(s); allSpans.push(s);
        } else {
          const w = document.createElement('span'); w.style.whiteSpace = 'nowrap'; w.style.display = 'inline';
          for (let i = 0; i < segment.length; i++) {
            const s = document.createElement('span'); s.style.opacity = '0.05'; s.textContent = segment[i];
            w.appendChild(s); allSpans.push(s);
          }
          el.appendChild(w);
        }
      });
      gsap.to(allSpans, {
        opacity: 0.7, stagger: 0.006, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: 1, onLeave: () => { allSpans.forEach(s => s.style.opacity = '0.7'); } }
      });
    });

    // Blur-focus
    document.querySelectorAll('[data-animate="blur-focus"]').forEach(el => {
      gsap.fromTo(el, { filter: 'blur(12px)', opacity: 0.1 }, {
        filter: 'blur(0px)', opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 }
      });
    });

    // Fade-up
    document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Fade-up stagger: Press logos
    document.querySelectorAll('[data-animate="fade-up-stagger"]').forEach(el => {
      const children = el.querySelectorAll('.press-logos > span');
      gsap.from(children, { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Line-draw: Press border
    const pressBorder = document.querySelector('.press');
    if (pressBorder) {
      gsap.from(pressBorder, { borderTopColor: 'rgba(17,17,17,0)', ease: 'none', scrollTrigger: { trigger: pressBorder, start: 'top 90%', end: 'top 60%', scrub: 1 } });
    }

    initServicesScroll();
    initFlipClock();
    initFeaturedReveal();
    initProcessTimeline();
    initCTAAnimation();
    initToolsAnimation();
    initFloatingElements();

    // Parallax depth
    document.querySelectorAll('[data-animate="parallax-depth"]').forEach(el => {
      gsap.to(el, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });

    // Refresh ScrollTrigger after layout settles (pin needs a render frame)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { ScrollTrigger.refresh(); });
    });
    // Safety net: refresh again after all images/fonts finish loading
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }
  }

  // FLOATING ELEMENTS
  function initFloatingElements() {
    const floats = document.querySelectorAll('.float-el');
    if (!floats.length) return;
    gsap.to(floats, { opacity: 1, duration: 2, stagger: 0.3, delay: 1 });
    floats.forEach(el => {
      const yD = 8 + Math.random() * 12, xD = 4 + Math.random() * 6, dur = 4 + Math.random() * 3;
      gsap.to(el, { y: yD, x: xD, duration: dur, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to(el, { yPercent: -30 - Math.random() * 40, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
  }

  // SERVICES HORIZONTAL SCROLL
  function initServicesScroll() {
    const section = document.querySelector('.services');
    const track = document.querySelector('.services-track');
    const progressBar = document.querySelector('.services-progress-bar');
    const counter = document.querySelector('.services-counter');
    if (!section || !track) return;
    const cards = track.querySelectorAll('.service-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;
    cards.forEach(function(c) { c.style.flexShrink = '0'; });
    function setTrackWidth() {
      var tw = 0; cards.forEach(function(c) { tw += c.offsetWidth; });
      var gap = parseFloat(getComputedStyle(track).gap) || 32;
      tw += (totalCards - 1) * gap;
      var cs = getComputedStyle(track);
      tw += parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      track.style.width = tw + 'px';
    }
    setTrackWidth();
    const getScrollAmount = () => Math.max(track.scrollWidth - window.innerWidth, 0);
    gsap.to(track, {
      x: () => -getScrollAmount(), ease: 'none',
      scrollTrigger: {
        trigger: section, pin: true, anticipatePin: 1, start: 'top top',
        end: () => '+=' + (getScrollAmount() * 1.2), scrub: 1, invalidateOnRefresh: true,
        onRefreshInit: setTrackWidth,
        onUpdate: (self) => {
          if (progressBar) gsap.set(progressBar, { scaleX: self.progress });
          if (counter && totalCards > 0) {
            const cur = Math.min(Math.floor(self.progress * totalCards) + 1, totalCards);
            counter.textContent = String(cur).padStart(2, '0') + ' / ' + String(totalCards).padStart(2, '0');
          }
        }
      }
    });
  }

  // FLIP CLOCK STATS
  function initFlipClock() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    let hasFlipped = false;
    ScrollTrigger.create({
      trigger: statsSection, start: 'top 70%',
      onEnter: () => { if (hasFlipped) return; hasFlipped = true; animateAllFlipClocks(); }
    });
  }

  function animateAllFlipClocks() {
    document.querySelectorAll('[data-animate="flip-clock"]').forEach((item, itemIdx) => {
      const cards = item.querySelectorAll('.flip-card');
      const suffix = item.querySelector('.stat-suffix');
      const separator = item.querySelector('.stat-separator');
      cards.forEach((card, cardIdx) => {
        const target = parseInt(card.getAttribute('data-digit'));
        const topSpan = card.querySelector('.flip-card-top span');
        const bottomSpan = card.querySelector('.flip-card-bottom span');
        animateSingleDigit(card, topSpan, bottomSpan, target, (itemIdx * 0.5) + (cardIdx * 0.2));
      });
      const sd = (itemIdx * 0.5) + (cards.length * 0.2) + 1.6;
      if (suffix) gsap.to(suffix, { opacity: 1, duration: 0.4, delay: sd, ease: 'power2.out' });
      if (separator) gsap.to(separator, { opacity: 1, duration: 0.4, delay: (itemIdx * 0.5) + 0.4, ease: 'power2.out' });
      const label = item.querySelector('[data-animate="scramble"]');
      if (label) scrambleDecode(label, sd + 0.2);
    });
  }

  function animateSingleDigit(card, topSpan, bottomSpan, target, delay) {
    const inner = card.querySelector('.flip-card-inner');
    const flipDuration = 0.3;
    const steps = [];
    if (target === 0) { steps.push(8, 4, 0); }
    else if (target <= 3) { for (let i = 1; i <= target; i++) steps.push(i); }
    else {
      const step = Math.max(1, Math.floor(target / 3));
      for (let v = step; v < target; v += step) steps.push(v);
      if (steps[steps.length - 1] !== target) steps.push(target);
    }
    let currentDigit = 0, stepIndex = 0;
    function doNextFlip() {
      if (stepIndex >= steps.length) return;
      const nd = steps[stepIndex];
      topSpan.textContent = nd;
      const o = document.createElement('div');
      o.className = 'flip-card-flip-top';
      o.innerHTML = '<span>' + currentDigit + '</span>';
      o.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:50%;overflow:hidden;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;font-size:48px;color:#f0ede8;background:#1a1a1a;border-radius:6px 6px 0 0;transform-origin:bottom center;z-index:4;';
      inner.appendChild(o);
      gsap.set(o, { rotateX: 0, transformPerspective: 400 });
      gsap.to(o, {
        rotateX: -90, duration: flipDuration, ease: 'power2.in',
        onComplete: () => { o.remove(); bottomSpan.textContent = nd; currentDigit = nd; stepIndex++; doNextFlip(); }
      });
    }
    gsap.delayedCall(delay, doNextFlip);
  }

  // SCRAMBLE-DECODE
  function scrambleDecode(el, delay) {
    const originalText = el.textContent;
    const chars = '\u2588\u2593\u2591\u2592ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frame = 0; const totalFrames = 30;
    setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        let decoded = '';
        for (let i = 0; i < originalText.length; i++) {
          if (originalText[i] === ' ') decoded += ' ';
          else if (i < (frame / totalFrames) * originalText.length) decoded += originalText[i];
          else decoded += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = decoded;
        if (frame >= totalFrames) { clearInterval(interval); el.textContent = originalText; }
      }, 50);
    }, delay * 1000);
  }

  // FEATURED PROJECT REVEAL
  function initFeaturedReveal() {
    const imageWrap = document.querySelector('.featured-image-wrap');
    const image = document.querySelector('.featured-image');
    const panel = document.querySelector('.featured-panel');
    if (imageWrap) gsap.set(imageWrap, { clipPath: 'inset(100% 0 0 0)' });
    if (image) gsap.set(image, { scale: 1.3 });
    if (imageWrap) {
      gsap.to(imageWrap, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut', scrollTrigger: { trigger: imageWrap, start: 'top 70%' } });
      if (image) {
        gsap.to(image, { scale: 1, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: imageWrap, start: 'top 70%' } });
        imageWrap.addEventListener('mouseenter', () => { gsap.to(image, { scale: 1.04, duration: 6, ease: 'power2.out' }); });
        imageWrap.addEventListener('mouseleave', () => { gsap.to(image, { scale: 1, duration: 2, ease: 'power2.out' }); });
      }
    }
    if (panel) {
      gsap.to(panel, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 90%' } });
    }
  }

  // PROCESS SCROLL-LOCK
  function initProcessTimeline() {
    var section = document.querySelector('.process');
    var stage = document.querySelector('[data-el="process-stage"]');
    if (!section || !stage) return;

    var slides = document.querySelectorAll('[data-el="process-slide"]');
    var illusEls = document.querySelectorAll('[data-el="process-vis-illus"]');
    var numEl = document.querySelector('[data-el="process-num"]');
    var barFill = document.querySelector('[data-el="process-bar-fill"]');
    var barDots = document.querySelectorAll('[data-el="process-bar-dot"]');
    var totalSteps = slides.length;
    if (!totalSteps) return;

    var nums = ['01', '02', '03'];
    var currentStep = 0;

    // Build scrub-driven timelines for each illustration
    var illusTimelines = buildIllusTimelines(illusEls);

    // Set initial states — first slide & illus visible
    gsap.set(slides[0], { opacity: 1, y: 0 });
    gsap.set(illusEls[0], { opacity: 1 });
    for (var i = 1; i < totalSteps; i++) {
      gsap.set(slides[i], { opacity: 0, y: 30 });
      gsap.set(illusEls[i], { opacity: 0 });
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: function() { return '+=' + (window.innerHeight * 1.5); },
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function(self) {
        var p = self.progress;

        // Progress bar fill
        if (barFill) barFill.style.transform = 'translateY(-50%) scaleX(' + p + ')';

        // Determine active step
        var step = Math.min(Math.floor(p * totalSteps), totalSteps - 1);

        // Step-local progress (0–1 within each step)
        var stepStart = step / totalSteps;
        var stepWidth = 1 / totalSteps;
        var stepP = Math.min((p - stepStart) / stepWidth, 1);

        // Drive current illustration timeline
        if (illusTimelines[step]) illusTimelines[step].progress(stepP);

        // Update dots
        barDots.forEach(function(dot, i) {
          dot.classList.toggle('is-active', i <= step);
        });

        // Switch step on change
        if (step !== currentStep) {
          var prev = currentStep;
          currentStep = step;

          // Alternate layout: step 2 (index 1) has vis on left, text on right
          if (step % 2 === 1) {
            stage.classList.add('is-reversed');
          } else {
            stage.classList.remove('is-reversed');
          }

          // Number crossfade
          if (numEl) {
            gsap.to(numEl, { opacity: 0, y: -15, duration: 0.25, ease: 'power2.in', overwrite: true, onComplete: function() {
              numEl.textContent = nums[step] || '01';
              gsap.to(numEl, { opacity: 0.06, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
            }});
          }

          // Slide transition with direction-aware entrance/exit
          slides.forEach(function(slide, i) {
            if (i === step) {
              // Incoming: fade in + slide from right
              gsap.fromTo(slide,
                { opacity: 0, x: 40, filter: 'blur(4px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', overwrite: true }
              );
              slide.classList.add('is-active');
            } else if (i === prev) {
              // Outgoing: fade out + slide left
              gsap.to(slide, {
                opacity: 0, x: -40, filter: 'blur(4px)',
                duration: 0.35, ease: 'power2.in', overwrite: true
              });
              slide.classList.remove('is-active');
            } else {
              gsap.set(slide, { opacity: 0 });
              slide.classList.remove('is-active');
            }
          });

          // Illustration transition with scale
          illusEls.forEach(function(el, i) {
            if (i === step) {
              gsap.fromTo(el,
                { opacity: 0, scale: 0.85 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: true }
              );
              if (illusTimelines[i]) illusTimelines[i].progress(0);
            } else if (i === prev) {
              gsap.to(el, {
                opacity: 0, scale: 0.9,
                duration: 0.3, ease: 'power2.in', overwrite: true
              });
            } else {
              gsap.set(el, { opacity: 0 });
            }
          });
        }
      }
    });
  }

  // Build GSAP timelines for each illustration (paused, driven by .progress())
  function buildIllusTimelines(illusEls) {
    var timelines = [];

    illusEls.forEach(function(el) {
      var type = el.getAttribute('data-illus');
      var tl = gsap.timeline({ paused: true });

      if (type === 'stamp') {
        var blueprint = el.querySelector('.illus-blueprint');
        var lines = el.querySelectorAll('.illus-blueprint-line');
        var stamp = el.querySelector('.illus-stamp');
        var check = el.querySelector('.illus-check');
        if (check) { check.style.strokeDasharray = '80'; check.style.strokeDashoffset = '80'; }

        // 0–0.3: blueprint + lines fade in
        tl.to(blueprint, { opacity: 0.25, duration: 0.25, ease: 'power2.out' }, 0);
        tl.to(lines, { opacity: 0.15, duration: 0.15, stagger: 0.05, ease: 'power2.out' }, 0.05);
        // 0.35–0.55: stamp slams
        tl.fromTo(stamp, { opacity: 0, scale: 2.5, transformOrigin: 'center center' },
          { opacity: 0.9, scale: 1, duration: 0.15, ease: 'power4.in' }, 0.35);
        // 0.55–0.75: check draws
        tl.to(check, { opacity: 1, strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, 0.55);

      } else if (type === 'house') {
        var foundation = el.querySelector('.illus-foundation');
        var walls = el.querySelector('.illus-walls');
        var roof = el.querySelector('.illus-roof');
        var door = el.querySelector('.illus-door');
        var windows = el.querySelectorAll('.illus-window');
        if (roof) { roof.style.strokeDasharray = '400'; roof.style.strokeDashoffset = '400'; }

        // 0–0.15: foundation
        tl.to(foundation, { opacity: 0.3, duration: 0.12, ease: 'power2.out' }, 0);
        // 0.15–0.35: walls rise
        tl.fromTo(walls, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
          { opacity: 0.25, scaleY: 1, duration: 0.2, ease: 'power3.out' }, 0.15);
        // 0.35–0.55: roof draws
        tl.to(roof, { opacity: 0.9, strokeDashoffset: 0, duration: 0.2, ease: 'power2.inOut' }, 0.35);
        // 0.55–0.65: door
        tl.to(door, { opacity: 0.25, duration: 0.1, ease: 'power2.out' }, 0.55);
        // 0.65–0.8: windows
        tl.to(windows, { opacity: 0.25, duration: 0.1, stagger: 0.05, ease: 'power2.out' }, 0.65);

      } else if (type === 'keys') {
        var keyring = el.querySelector('.illus-keyring');
        var shaft = el.querySelector('.illus-keyshaft');
        var teeth = el.querySelector('.illus-teeth');
        var sparkles = el.querySelectorAll('.illus-sparkle');
        if (keyring) { keyring.style.strokeDasharray = '230'; keyring.style.strokeDashoffset = '230'; }
        if (shaft) { shaft.style.strokeDasharray = '80'; shaft.style.strokeDashoffset = '80'; }

        // 0–0.2: keyring draws
        tl.to(keyring, { opacity: 0.3, strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, 0);
        // 0.2–0.4: shaft draws
        tl.to(shaft, { opacity: 0.3, strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, 0.2);
        // 0.4–0.6: teeth appear
        tl.to(teeth, { opacity: 0.9, duration: 0.15, ease: 'power2.out' }, 0.4);
        // 0.6–0.85: sparkles
        tl.to(sparkles, { opacity: 0.9, duration: 0.1, stagger: 0.08, ease: 'power2.out' }, 0.6);
      }

      timelines.push(tl);
    });

    return timelines;
  }

  // CTA WORD STAGGER ELASTIC
  function initCTAAnimation() {
    const ctaTitle = document.querySelector('[data-animate="word-stagger-elastic"]');
    if (!ctaTitle) return;
    const text = ctaTitle.textContent.trim();
    ctaTitle.innerHTML = '';
    const wordEls = [];
    text.split(/\s+/).forEach(word => {
      const wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block'; wrapper.style.overflow = 'hidden'; wrapper.style.marginRight = '0.3em';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block'; inner.textContent = word;
      wrapper.appendChild(inner); ctaTitle.appendChild(wrapper); wordEls.push(inner);
    });
    gsap.from(wordEls, { yPercent: 120, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)', scrollTrigger: { trigger: ctaTitle, start: 'top 80%' } });
  }

  // TOOLS ACCORDION ANIMATION
  function initToolsAnimation() {
    var panels = document.querySelectorAll('.tool-panel');
    if (!panels.length) return;
    var container = panels[0].parentElement;

    // Staggered entrance on scroll
    panels.forEach(function(panel, i) {
      gsap.fromTo(panel,
        { opacity: 0, x: 40, filter: 'blur(4px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: container, start: 'top 80%' } }
      );
    });
  }

  // TESTIMONIAL CAROUSEL — 25 Reviews
  function initTestimonials() {
    var REVIEWS = [
      { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Irvine, CA' },
      { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. Our architect made mistakes on the plans but Raja and team helped work through all issues. I highly recommend them.', author: 'Sam W.', location: 'Oakland, CA' },
      { quote: 'These guys helped us out, converting our one car garage into a junior ADU. The city was difficult to work with, and they took care of everything. Raja was excellent and easy to work with. Their cost was very competitive. I would definitely work with them again.', author: 'Alex D.', location: 'Los Angeles, CA' },
      { quote: 'We had Avorino build us an ADU in our property recently. They provided the full design and rendering. They pulled permits and built our 1,000 sqft ADU from start to finish. They are really easy to work with and their prices are very competitive.', author: 'Ray W.', location: 'Irvine, CA' },
      { quote: 'This was my first kitchen remodeling experience and I was very nervous. From the first time I made contact, it was a smooth and professional experience. They executed my vision in every detail. The work was completed in less time than estimated and perfectly within budget.', author: 'Tina C.', location: 'Dana Point, CA' },
      { quote: 'What a wonderful experience working with Raja and his team! Raja was extremely professional, timely, and had clear communication the entire time. My parents were so happy with how their ADU turned out and I am impressed with the care and service I received!', author: 'Alarah R.', location: 'Orange County, CA' },
      { quote: "It's so rare to find a contractor that you have a good experience with. They got the work done quickly and made sure every little detail was completed without me having to be on top of them. I highly recommend and will definitely use them again!", author: 'Nikki B.', location: 'Laguna Niguel, CA' },
      { quote: 'These are the best people in the business. They beat every single price that I got on top of that they did an excellent job finishing it in no time. They are truly the best of the best, highly recommended.', author: 'Shahin S.', location: 'Los Angeles, CA' },
      { quote: 'Avorino built me a custom home. We loved how great they executed our project. We were impressed that they finished before the estimated timeline. They communicated every step. Love this company.', author: 'Hooman E.', location: 'Irvine, CA' },
      { quote: 'Raja and William were great to work with. After our consultation they started the work within a week. They were professional, courteous, and precise. The job turned out great. I would totally recommend them.', author: 'Ryan J.', location: 'Brentwood, CA' },
      { quote: 'They responded very quickly and showed up the next day to give a quote. Always responded and showed up on time. The job was done on time and I love the fine look and clear way of working. I highly recommend this business!', author: 'Pazit B.', location: 'Irvine, CA' },
      { quote: "Raja was attentive, responsive and communicative with the entire process. He gave us good ideas throughout and supported us in selecting the various fixtures and tiles. We've been thrilled with how the kitchen has turned out!", author: 'Peeb P.', location: 'Irvine, CA' },
      { quote: 'William and Raja are hands down the best around! They are with you from start to finish and are incredibly helpful, communicative and understanding. We have used them for multiple projects at home and at our two businesses.', author: 'Kristle J.', location: 'San Clemente, CA' },
      { quote: 'Did a bathroom remodel. Full service company. Accommodates changes along the way, and fixing anything we point out or that we wanted changed. Fast and things get done, thanks Raja!', author: 'Tony H.', location: 'Irvine, CA' },
      { quote: 'They did an excellent job and actually at a good price. We did a retile plus new fixtures and it came out looking like a high end resort bathroom.', author: 'Amy D.', location: 'San Clemente, CA' },
      { quote: 'They were exceptional. The expertise, responsiveness, professionalism, cleanliness, creative and ingenuity is top of the line. Their work is so good and most important, honest.', author: 'Boris B.', location: 'Newport Beach, CA' },
      { quote: 'Such a professional and creative team! They walked into my house with confidence that they would remodel my horrific 1960s fireplace to a clean cut, modern, cozy and budget friendly replacement. And so they did!', author: 'Teri N.', location: 'Irvine, CA' },
      { quote: 'William and his team did a spectacular job on our new front porch! I rehired him due to his responsiveness, honesty and speedy, quality work! His team got our porch done in literally a day and a half.', author: 'Courtney C.', location: 'Mission Viejo, CA' },
      { quote: "Raja and Amir are easily the most friendly and up front contractors we've worked with. Highly recommend them for being super easy to work with and good quality.", author: 'Allen D.', location: 'San Clemente, CA' },
      { quote: 'This company is VERY communicative, professional and cost friendly. They got the job done in a timely manner. Every pre-existing issue I had they went over and beyond to fix. 100/100 across the board.', author: 'Jeremy C.', location: 'Long Beach, CA' },
      { quote: 'Raja and his team came in with a reasonable price and worked after hours to get the job done! His team was respectful, clean, and worked after hours. I cannot recommend them enough.', author: 'Behrooz S.', location: 'Huntington Beach, CA' },
      { quote: "We had them complete our media wall and absolutely loved working with their team! They were so professional from the beginning and set very realistic expectations. Our final product was better than I had imagined.", author: 'Srishti P.', location: 'Burbank, CA' },
      { quote: 'I am very happy with my decision and the final outcome is fabulous! All the workers were on time, professional and respectful. The work is top notch!', author: 'Theresa F.', location: 'Laguna Niguel, CA' },
      { quote: "Raja gave me the kitchen of my dreams. I couldn't have made a better decision. He was honest and very easy to work with. They were always on time and completed the work in record time.", author: 'Sonia H.', location: 'Irvine, CA' },
      { quote: 'William was wonderful in relieving my fears and reassuring me they could take care of everything! He was professional as was his crew. I would certainly recommend them!', author: 'Marcia R.', location: 'San Clemente, CA' },
    ];

    var card = document.querySelector('[data-el="testimonial-card"]');
    if (!card) return;

    var slidesWrap = card.querySelector('[data-el="testimonial-slides-wrap"]');
    if (!slidesWrap) return; // Guard: old HTML without new testimonial structure
    var counterEl = card.querySelector('[data-el="testimonial-counter"]');
    var progressFill = card.querySelector('[data-el="testimonial-progress-fill"]');
    var arrows = card.querySelectorAll('[data-el="testimonial-arrow"]');
    var total = REVIEWS.length;
    var current = 0;
    var isAnimating = false;
    var cycleCount = 0;

    // Build slides
    REVIEWS.forEach(function(review, i) {
      var slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML =
        '<div class="testimonial-stars">\u2605\u2605\u2605\u2605\u2605</div>' +
        '<blockquote class="testimonial-quote">\u201C' + review.quote + '\u201D</blockquote>' +
        '<div><p class="testimonial-author">\u2014 ' + review.author + '</p>' +
        '<p class="testimonial-location">' + review.location + '</p></div>';
      slidesWrap.appendChild(slide);
    });

    var slides = slidesWrap.querySelectorAll('.testimonial-slide');

    function updateCounter() {
      if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
      if (progressFill) progressFill.style.width = ((current + 1) / total * 100) + '%';
    }
    updateCounter();

    // Auto-advance
    var autoTimer = null;
    function startAuto() {
      stopAuto();
      if (cycleCount >= total) return; // stop after one full rotation
      autoTimer = setInterval(function() {
        var next = current + 1 < total ? current + 1 : 0;
        if (next === 0) cycleCount += current + 1;
        goToSlide(next);
        if (cycleCount >= total) stopAuto();
      }, 5000);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function resetAuto() { stopAuto(); startAuto(); }

    function goToSlide(target) {
      if (target === current || isAnimating || target < 0 || target >= total) return;
      isAnimating = true;
      var dir = target > current ? 1 : -1;
      var oldSlide = slides[current];
      var newSlide = slides[target];

      // Update counter immediately (no lag)
      current = target;
      updateCounter();

      gsap.to(oldSlide, {
        opacity: 0, x: -20 * dir, duration: 0.35, ease: 'power2.in',
        onComplete: function() {
          oldSlide.classList.remove('active');
          gsap.set(oldSlide, { x: 0 });
          newSlide.classList.add('active');
          gsap.fromTo(newSlide,
            { opacity: 0, x: 20 * dir },
            { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out',
              onComplete: function() { isAnimating = false; }
            }
          );
        }
      });
    }

    // Arrow navigation
    arrows.forEach(function(arrow) {
      arrow.addEventListener('click', function(e) {
        e.stopPropagation();
        resetAuto();
        cycleCount = 0; // reset cycle on manual interaction
        if (arrow.getAttribute('data-dir') === 'next') goToSlide(current + 1 < total ? current + 1 : 0);
        else goToSlide(current - 1 >= 0 ? current - 1 : total - 1);
      });
    });

    // Pause on hover
    card.addEventListener('mouseenter', stopAuto);
    card.addEventListener('mouseleave', function() { cycleCount = 0; startAuto(); });

    startAuto();
  }

  // INIT
  window.addEventListener('DOMContentLoaded', () => {
    initTestimonials();
    initPreloader();
  });
})();
