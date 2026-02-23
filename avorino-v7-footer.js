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

  // CUSTOM CURSOR
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorDot = document.querySelector('.cursor-dot');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (cursorRing && cursorDot && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });
    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(cursorRing, { x: ringX, y: ringY });
    });
    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover-link'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover-link'));
    });
    document.querySelectorAll('.hero-image, .featured-image-wrap, .service-card-image').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hover-image');
        cursorRing.classList.remove('hover-link');
      });
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover-image'));
    });
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
  }

  // PRELOADER
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const curtain = document.querySelector('.preloader-curtain');
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) gsap.set(heroImage, { clipPath: 'inset(6%)', scale: 1.25 });
    gsap.set('.preloader-char', { opacity: 0, y: 60, rotateX: -90, filter: 'blur(4px)' });
    if (preloader) gsap.set(preloader, { display: 'flex' });

    if (!preloader) {
      initScrollAnimations();
      initHeroEntrance(heroImage);
      return;
    }

    const chars = preloader.querySelectorAll('.preloader-char');
    lenis.stop();

    const tl = gsap.timeline({
      onComplete: () => { preloader.style.display = 'none'; lenis.start(); initScrollAnimations(); }
    });

    tl.to(chars, { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.025, ease: 'power4.out' }, 0);
    tl.to({}, { duration: 0.4 });
    tl.to(chars, { y: -60, opacity: 0, duration: 0.4, stagger: 0.01, ease: 'power3.in' });
    tl.set(preloader, { background: 'transparent' });
    if (curtain) tl.to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' });
    if (heroImage) tl.to(heroImage, { clipPath: 'inset(0%)', scale: 1, duration: 1.8, ease: 'power4.inOut' }, '-=0.8');
    // Hero text entrance (staggered word rows)
    initHeroTextEntrance();
  }

  // HERO ENTRANCE (no-preloader fallback)
  function initHeroEntrance(heroImage) {
    const tl = gsap.timeline({ delay: 0.3 });
    if (heroImage) tl.to(heroImage, { clipPath: 'inset(0%)', scale: 1, duration: 1.8, ease: 'power4.inOut' }, 0);
    initHeroTextEntrance();
  }

  // HERO TEXT — staggered entrance + scroll-driven parallax
  function initHeroTextEntrance() {
    const heroContent = document.querySelector('[data-el="hero-content"]');
    const rows = document.querySelectorAll('[data-hero-row]');
    const subtitle = document.querySelector('[data-el="hero-subtitle"]');
    const cta = document.querySelector('[data-el="hero-cta"]');
    const scrollIndicator = document.querySelector('[data-el="hero-scroll"]');
    const heroImage = document.querySelector('.hero-image');
    if (!heroContent) return;

    // Set initial states
    rows.forEach(row => {
      gsap.set(row.querySelector('.hero-word'), { opacity: 0, y: 60, filter: 'blur(6px)' });
    });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 });
    if (cta) gsap.set(cta, { opacity: 0, y: 20 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

    // Staggered entrance timeline
    const tl = gsap.timeline({ delay: 0.6 });

    rows.forEach((row, i) => {
      const word = row.querySelector('.hero-word');
      tl.to(word, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.2, ease: 'power4.out'
      }, i * 0.15);
    });

    if (subtitle) {
      tl.to(subtitle, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5);
    }
    if (cta) {
      tl.to(cta, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.7);
    }
    if (scrollIndicator) {
      tl.to(scrollIndicator, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 1.2);
    }

    // SCROLL-DRIVEN PARALLAX — each row moves up at a different speed
    if (window.innerWidth > 767) {
      const hero = document.querySelector('.hero');
      if (!hero) return;

      rows.forEach((row, i) => {
        const speed = 80 + i * 40; // row 0: 80px, row 1: 120px, row 2: 160px
        gsap.to(row, {
          y: -speed, ease: 'none',
          scrollTrigger: {
            trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6
          }
        });
      });

      // Subtitle and CTA parallax (faster, fades out)
      if (subtitle) {
        gsap.to(subtitle, {
          y: -200, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: 0.6 }
        });
      }
      if (cta) {
        gsap.to(cta, {
          y: -180, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '50% top', scrub: 0.6 }
        });
      }

      // Hero image scale on scroll (subtle zoom)
      if (heroImage) {
        gsap.to(heroImage, {
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
      end: function() { return '+=' + (window.innerHeight * 2.5); },
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

          // Number crossfade
          if (numEl) {
            gsap.to(numEl, { opacity: 0, y: -15, duration: 0.25, ease: 'power2.in', overwrite: true, onComplete: function() {
              numEl.textContent = nums[step] || '01';
              gsap.to(numEl, { opacity: 0.06, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
            }});
          }

          // Slide crossfade
          slides.forEach(function(slide, i) {
            if (i === step) {
              gsap.to(slide, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', overwrite: true });
              slide.classList.add('is-active');
            } else {
              var dir = i < step ? -1 : 1;
              gsap.to(slide, { opacity: 0, y: 30 * dir, duration: 0.35, ease: 'power2.in', overwrite: true });
              slide.classList.remove('is-active');
            }
          });

          // Illustration crossfade
          illusEls.forEach(function(el, i) {
            if (i === step) {
              gsap.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: true });
              // Reset its timeline so it plays from start
              if (illusTimelines[i]) illusTimelines[i].progress(0);
            } else {
              gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: true });
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

  // TESTIMONIAL NAVIGATION
  function initTestimonials() {
    const card = document.querySelector('.testimonial-card');
    if (!card) return;
    const dots = card.querySelectorAll('.testimonial-dot');
    const slides = card.querySelectorAll('.testimonial-slide');
    const arrows = card.querySelectorAll('.testimonial-arrow');
    const total = slides.length;
    let current = 0, isAnimating = false;
    if (!slides.length) return;

    // Auto-advance timer
    let autoTimer = null;
    function startAuto() { stopAuto(); autoTimer = setInterval(function() { goToSlide(current + 1 < total ? current + 1 : 0); }, 3000); }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function resetAuto() { stopAuto(); startAuto(); }

    function goToSlide(target) {
      if (target === current || isAnimating || target < 0 || target >= total) return;
      isAnimating = true;
      const dir = target > current ? 1 : -1;
      dots.forEach(d => d.classList.remove('active'));
      if (dots[target]) dots[target].classList.add('active');
      const oldSlide = slides[current], newSlide = slides[target];
      gsap.to(oldSlide, {
        opacity: 0, x: -20 * dir, duration: 0.35, ease: 'power2.in',
        onComplete: () => {
          oldSlide.classList.remove('active'); gsap.set(oldSlide, { x: 0 });
          newSlide.classList.add('active');
          gsap.fromTo(newSlide, { opacity: 0, x: 20 * dir }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', onComplete: () => { current = target; isAnimating = false; } });
        }
      });
    }
    dots.forEach(dot => { dot.addEventListener('click', (e) => { e.stopPropagation(); resetAuto(); goToSlide(parseInt(dot.getAttribute('data-goto'))); }); });
    arrows.forEach(arrow => {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        resetAuto();
        if (arrow.getAttribute('data-dir') === 'next') goToSlide(current + 1 < total ? current + 1 : 0);
        else goToSlide(current - 1 >= 0 ? current - 1 : total - 1);
      });
    });

    // Pause on hover, resume on leave
    card.addEventListener('mouseenter', stopAuto);
    card.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  // INIT
  window.addEventListener('DOMContentLoaded', () => {
    initTestimonials();
    initPreloader();
  });
})();
