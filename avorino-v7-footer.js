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

  // TEXT SPLITTING
  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      span.style.display = 'inline-block';
      if (text[i] === ' ') { span.innerHTML = '&nbsp;'; } else { span.textContent = text[i]; }
      el.appendChild(span);
    }
    return el.querySelectorAll('.char');
  }

  // HERO TITLE CHAR-CASCADE
  function splitHeroTitle(titleEl) {
    const titleCharsAll = [];
    function splitTitleNode(node, parent) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ');
        if (!text.trim()) { parent.removeChild(node); return; }
        const words = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(word => {
          if (/^\s+$/.test(word)) {
            const s = document.createElement('span');
            s.classList.add('char'); s.style.display = 'inline-block';
            s.innerHTML = '&nbsp;'; s.style.opacity = '0';
            s.style.transform = 'translateY(60px) rotateX(-90deg)';
            s.style.filter = 'blur(4px)';
            frag.appendChild(s); titleCharsAll.push(s);
          } else if (word) {
            const w = document.createElement('span');
            w.style.whiteSpace = 'nowrap'; w.style.display = 'inline';
            for (let i = 0; i < word.length; i++) {
              const s = document.createElement('span');
              s.classList.add('char'); s.style.display = 'inline-block';
              s.style.opacity = '0'; s.style.transform = 'translateY(60px) rotateX(-90deg)';
              s.style.filter = 'blur(4px)'; s.textContent = word[i];
              w.appendChild(s); titleCharsAll.push(s);
            }
            frag.appendChild(w);
          }
        });
        parent.insertBefore(frag, node);
        parent.removeChild(node);
      } else if (node.nodeName === 'BR') {
        // keep
      } else {
        Array.from(node.childNodes).forEach(child => splitTitleNode(child, node));
      }
    }
    Array.from(titleEl.childNodes).forEach(child => splitTitleNode(child, titleEl));
    return titleCharsAll;
  }

  // PRELOADER
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const curtain = document.querySelector('.preloader-curtain');
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const nav = document.querySelector('.site-nav') || document.querySelector('.nav');

    if (nav) gsap.set(nav, { opacity: 0 });
    if (heroImage) gsap.set(heroImage, { clipPath: 'inset(6%)', scale: 1.25 });
    gsap.set('.preloader-char', { opacity: 0, y: 60, rotateX: -90, filter: 'blur(4px)' });
    if (preloader) gsap.set(preloader, { display: 'flex' });

    if (!preloader) {
      initScrollAnimations();
      initHeroEntrance(heroImage, heroTitle, heroSubtitle, nav);
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
    if (heroTitle) {
      const vc = splitHeroTitle(heroTitle);
      tl.to(vc, { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.025, ease: 'power4.out' }, '-=1.2');
    }
    if (heroSubtitle) tl.from(heroSubtitle, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6');
    if (nav) tl.to(nav, { opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');
  }

  // HERO ENTRANCE (no-preloader)
  function initHeroEntrance(heroImage, heroTitle, heroSubtitle, nav) {
    const tl = gsap.timeline({ delay: 0.3 });
    if (heroImage) tl.to(heroImage, { clipPath: 'inset(0%)', scale: 1, duration: 1.8, ease: 'power4.inOut' }, 0);
    if (heroTitle) {
      const tc = splitHeroTitle(heroTitle);
      tl.to(tc, { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.025, ease: 'power4.out' }, 0.6);
    }
    if (heroSubtitle) tl.from(heroSubtitle, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6');
    if (nav) tl.to(nav, { opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');
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

    // Refresh ScrollTrigger after all images/fonts load so measurements are correct
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
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

  // PROCESS TIMELINE
  function initProcessTimeline() {
    const timeline = document.querySelector('.process-timeline');
    const lineEl = document.querySelector('.process-line');
    const lineFill = document.querySelector('.process-line-fill');
    const steps = document.querySelectorAll('.process-step');
    const dots = document.querySelectorAll('.process-step-dot');
    if (!timeline || !lineFill || dots.length < 2) return;
    function alignLine() {
      const tR = timeline.getBoundingClientRect();
      const fD = dots[0].getBoundingClientRect();
      const lD = dots[dots.length - 1].getBoundingClientRect();
      const top = fD.top + fD.height / 2 - tR.top;
      const bot = lD.top + lD.height / 2 - tR.top;
      lineEl.style.setProperty('--line-top', top + 'px');
      lineEl.style.setProperty('--line-h', (bot - top) + 'px');
      return bot - top;
    }
    const lineH = alignLine();
    window.addEventListener('resize', alignLine);
    gsap.to(lineFill, { height: lineH, ease: 'none', scrollTrigger: { trigger: timeline, start: 'top 60%', end: 'bottom 40%', scrub: 1, invalidateOnRefresh: true } });
    const numbers = document.querySelectorAll('.process-step-number');
    steps.forEach((step, i) => {
      const title = step.querySelector('.process-step-title');
      const body = step.querySelector('.process-step-body');
      if (title) gsap.from(title, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 75%' } });
      if (body) gsap.from(body, { y: 20, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 75%' } });
      if (numbers[i]) gsap.from(numbers[i], { opacity: 0, scale: 0.8, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 75%' } });
      if (dots[i]) ScrollTrigger.create({ trigger: step, start: 'top 60%', onEnter: () => dots[i].classList.add('active'), onLeaveBack: () => dots[i].classList.remove('active') });
    });
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

  // TOOLS FLOATING CARDS
  function initToolsAnimation() {
    document.querySelectorAll('[data-animate="fade-up-tool"]').forEach((card, i) => {
      gsap.from(card, { y: 60, opacity: 0, duration: 1.2, delay: i * 0.15, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
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
    dots.forEach(dot => { dot.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(parseInt(dot.getAttribute('data-goto'))); }); });
    arrows.forEach(arrow => {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (arrow.getAttribute('data-dir') === 'next') goToSlide(current + 1 < total ? current + 1 : 0);
        else goToSlide(current - 1 >= 0 ? current - 1 : total - 1);
      });
    });
  }

  // MOBILE NAV
  function initMobileNav() {
    const burger = document.querySelector('.nav-burger');
    const overlay = document.querySelector('.nav-mobile-overlay');
    if (!burger || !overlay) return;
    burger.addEventListener('click', () => {
      burger.classList.toggle('open'); overlay.classList.toggle('open');
      if (overlay.classList.contains('open')) lenis.stop(); else lenis.start();
    });
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { burger.classList.remove('open'); overlay.classList.remove('open'); lenis.start(); });
    });
  }

  // NAV SCROLL THEME — check if nav midpoint is inside a dark section
  function initNavTheme() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var darkEls = document.querySelectorAll('.hero-container,.cta-container');
    if (!darkEls.length) return;
    function update() {
      var rect = nav.getBoundingClientRect();
      var navMid = rect.top + rect.height / 2;
      var onDark = false;
      darkEls.forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top <= navMid && r.bottom >= navMid) onDark = true;
      });
      nav.classList.toggle('nav--dark', onDark);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // INIT
  window.addEventListener('DOMContentLoaded', () => {
    initNavTheme();
    initTestimonials();
    initMobileNav();
    initPreloader();
  });
})();
