(function () {
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
     UTILITY — TEXT SPLITTING (WORDS)
     ═══════════════════════════════════════════════ */
  function splitIntoWords(el) {
    var text = el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
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

  /* ═══════════════════════════════════════════════
     UTILITY — TEXT SPLITTING (CHARACTERS)
     ═══════════════════════════════════════════════ */
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
     HERO ENTRANCE — Character Cascade
     ═══════════════════════════════════════════════ */
  function initHeroEntrance() {
    var hero = document.getElementById('about-hero');
    if (!hero) return;

    var h1 = hero.querySelector('h1');
    var subtitle = hero.querySelector('p');

    if (h1) {
      h1.removeAttribute('data-animate');
      var chars = splitIntoChars(h1);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      var tl = gsap.timeline({ delay: 0.3 });
      tl.to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.03, ease: 'elastic.out(1, 0.6)',
      }, 0);
    }

    if (subtitle) {
      subtitle.removeAttribute('data-animate');

      var goldLine = document.createElement('div');
      goldLine.style.cssText = 'width:0;height:1px;background:#c9a96e;margin-bottom:16px;will-change:width;';
      subtitle.parentElement.insertBefore(goldLine, subtitle);

      gsap.set(subtitle, { opacity: 0, y: 20, filter: 'blur(4px)' });

      var subTl = gsap.timeline({ delay: 0.9 });
      subTl.to(goldLine, { width: '60px', duration: 0.8, ease: 'power3.inOut' }, 0);
      subTl.to(subtitle, {
        opacity: 0.6, y: 0, filter: 'blur(0px)',
        duration: 1, ease: 'power3.out',
      }, 0.3);
    }

    // Hero content fades out on scroll
    var heroContent = hero.querySelector('.about-hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // Ken Burns zoom
    gsap.fromTo(hero,
      { backgroundSize: '105%' },
      { backgroundSize: '115%', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } }
    );
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { y: 50, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%',
            toggleActions: 'play none none reverse' } }
      );
    });

    /* opacity-sweep */
    document.querySelectorAll('[data-animate="opacity-sweep"]').forEach(function (el) {
      var text = el.textContent.trim();
      var wordParts = text.split(/(\s+)/);
      el.innerHTML = '';
      var allSpans = [];
      wordParts.forEach(function (segment) {
        if (/^\s+$/.test(segment)) {
          var s = document.createElement('span');
          s.textContent = ' '; s.style.opacity = '0.05';
          el.appendChild(s); allSpans.push(s);
        } else {
          var w = document.createElement('span');
          w.style.whiteSpace = 'nowrap'; w.style.display = 'inline';
          for (var i = 0; i < segment.length; i++) {
            var c = document.createElement('span');
            c.style.opacity = '0.05'; c.style.display = 'inline-block';
            c.style.transition = 'none'; c.textContent = segment[i];
            w.appendChild(c); allSpans.push(c);
          }
          el.appendChild(w);
        }
      });
      gsap.to(allSpans, {
        opacity: 0.8, stagger: 0.005, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: 1,
          onLeave: function () { allSpans.forEach(function (s) { s.style.opacity = '0.8'; }); } }
      });
    });

    /* char-cascade — fallback for elements not caught by initHeroEntrance */
    document.querySelectorAll('[data-animate="char-cascade"]').forEach(function (el) {
      var chars = splitIntoChars(el);
      gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -90, filter: 'blur(8px)' });
      gsap.to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.03, ease: 'elastic.out(1, 0.6)',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    });

    /* blur-focus */
    document.querySelectorAll('[data-animate="blur-focus"]').forEach(function (el) {
      gsap.fromTo(el,
        { filter: 'blur(14px)', opacity: 0.08, y: 20 },
        { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 20%',
            toggleActions: 'play reverse play reverse' } }
      );
    });

    /* word-stagger-elastic */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function (el) {
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    /* parallax-depth */
    document.querySelectorAll('[data-animate="parallax-depth"]').forEach(function (el) {
      gsap.to(el, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    /* fade-up-stagger */
    document.querySelectorAll('[data-animate="fade-up-stagger"]').forEach(function (el) {
      var children = el.children;
      if (!children.length) return;
      gsap.fromTo(children,
        { y: 60, opacity: 0, scale: 0.96, filter: 'blur(3px)' },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
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

    /* split-text-reveal */
    document.querySelectorAll('[data-animate="split-text-reveal"]').forEach(function (el) {
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 105, opacity: 0 });
      gsap.to(words, {
        yPercent: 0, opacity: 1,
        duration: 1.2, stagger: 0.04, ease: 'power4.out',
        scrollTrigger: {
          trigger: el, start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    /* Label line expand */
    document.querySelectorAll('.about-label-line').forEach(function (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line.parentElement, start: 'top 85%' } }
      );
    });

    /* Image placeholder reveal — diagonal polygon clip-path */
    document.querySelectorAll('.about-story-img, .about-comm-img').forEach(function (img) {
      gsap.fromTo(img,
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.6, ease: 'power4.inOut',
          scrollTrigger: { trigger: img, start: 'top 80%' } }
      );
    });

    /* ScrollTrigger refresh */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  /* ═══════════════════════════════════════════════
     FLIP-CLOCK STATS — Ported from v7
     Split-flap digit cards with perspective flip animation.
     ═══════════════════════════════════════════════ */
  function initFlipClock() {
    var statsSection = document.getElementById('about-stats');
    if (!statsSection) return;
    var hasFlipped = false;
    ScrollTrigger.create({
      trigger: statsSection, start: 'top 70%',
      onEnter: function () { if (hasFlipped) return; hasFlipped = true; animateAllFlipClocks(); }
    });
  }

  function animateAllFlipClocks() {
    document.querySelectorAll('[data-animate="flip-clock"]').forEach(function (item, itemIdx) {
      var cards = item.querySelectorAll('[data-el="flip-card"]');
      var suffix = item.querySelector('[data-el="stat-suffix"]');
      var separator = item.querySelector('[data-el="stat-separator"]');
      cards.forEach(function (card, cardIdx) {
        var target = parseInt(card.getAttribute('data-digit'));
        var topSpan = card.querySelector('[data-el="flip-card-top"] span');
        var bottomSpan = card.querySelector('[data-el="flip-card-bottom"] span');
        animateSingleDigit(card, topSpan, bottomSpan, target, (itemIdx * 0.5) + (cardIdx * 0.2));
      });
      var sd = (itemIdx * 0.5) + (cards.length * 0.2) + 1.6;
      if (suffix) gsap.to(suffix, { opacity: 1, duration: 0.4, delay: sd, ease: 'power2.out' });
      if (separator) gsap.to(separator, { opacity: 1, duration: 0.4, delay: (itemIdx * 0.5) + 0.4, ease: 'power2.out' });
      var label = item.querySelector('[data-animate="scramble"]');
      if (label) scrambleDecode(label, sd + 0.2);
    });
  }

  function animateSingleDigit(card, topSpan, bottomSpan, target, delay) {
    var inner = card.querySelector('[data-el="flip-card-inner"]');
    var flipDuration = 0.3;
    var steps = [];
    if (target === 0) { steps.push(8, 4, 0); }
    else if (target <= 3) { for (var i = 1; i <= target; i++) steps.push(i); }
    else {
      var step = Math.max(1, Math.floor(target / 3));
      for (var v = step; v < target; v += step) steps.push(v);
      if (steps[steps.length - 1] !== target) steps.push(target);
    }
    var currentDigit = 0, stepIndex = 0;
    function doNextFlip() {
      if (stepIndex >= steps.length) return;
      var nd = steps[stepIndex];
      topSpan.textContent = nd;
      var o = document.createElement('div');
      o.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:50%;overflow:hidden;display:flex;align-items:flex-start;justify-content:center;font-family:"DM Serif Display",Georgia,serif;font-size:48px;color:#f0ede8;background:#1a1a1a;border-radius:6px 6px 0 0;transform-origin:bottom center;z-index:4;';
      o.innerHTML = '<span style="display:block;line-height:96px;text-align:center;width:100%;">' + currentDigit + '</span>';
      inner.appendChild(o);
      gsap.set(o, { rotateX: 0, transformPerspective: 400 });
      gsap.to(o, {
        rotateX: -90, duration: flipDuration, ease: 'power2.in',
        onComplete: function () { o.remove(); bottomSpan.textContent = nd; currentDigit = nd; stepIndex++; doNextFlip(); }
      });
    }
    gsap.delayedCall(delay, doNextFlip);
  }

  /* ═══════════════════════════════════════════════
     SCRAMBLE DECODE
     ═══════════════════════════════════════════════ */
  function scrambleDecode(el, delay) {
    var originalText = el.textContent;
    var chars = '\u2588\u2593\u2591\u2592ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var frame = 0, totalFrames = 30;
    setTimeout(function () {
      var interval = setInterval(function () {
        frame++;
        var decoded = '';
        for (var i = 0; i < originalText.length; i++) {
          if (originalText[i] === ' ') decoded += ' ';
          else if (i < (frame / totalFrames) * originalText.length) decoded += originalText[i];
          else decoded += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = decoded;
        if (frame >= totalFrames) { clearInterval(interval); el.textContent = originalText; }
      }, 50);
    }, delay * 1000);
  }

  /* ═══════════════════════════════════════════════
     SECTION PARALLAX
     ═══════════════════════════════════════════════ */
  function initSectionParallax() {
    var stats = document.getElementById('about-stats');
    if (stats) {
      gsap.fromTo(stats,
        { backgroundSize: '110%' },
        { backgroundSize: '100%', ease: 'none',
          scrollTrigger: { trigger: stats, start: 'top bottom', end: 'bottom top', scrub: 1 } }
      );
    }

    var storySection = document.getElementById('about-story');
    if (storySection) {
      var storyGrid = storySection.querySelector('.av-grid-2col');
      if (storyGrid && storyGrid.children.length >= 2) {
        gsap.to(storyGrid.children[0], { y: -25, ease: 'none',
          scrollTrigger: { trigger: storyGrid, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.to(storyGrid.children[1], { y: 25, ease: 'none',
          scrollTrigger: { trigger: storyGrid, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      }
    }
  }

  /* ═══════════════════════════════════════════════
     SECTION TRANSITIONS
     ═══════════════════════════════════════════════ */
  function initSectionTransitions() {
    document.querySelectorAll('.av-section-warm, .av-section-dark').forEach(function (sec) {
      gsap.fromTo(sec,
        { opacity: 0.92 },
        { opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: sec, start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  /* ═══════════════════════════════════════════════
     CTA AMBIENT GLOW — Enhanced pulsing
     ═══════════════════════════════════════════════ */
  function initCTAGlow() {
    var ctaSection = document.querySelector('.about-cta-container');
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
            gsap.to(glow, {
              opacity: 0.4, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut',
            });
          },
        });
      },
      onLeaveBack: function () {
        gsap.to(glow, { opacity: 0, duration: 0.5, overwrite: true });
      },
    });
  }

  /* ═══════════════════════════════════════════════
     MISSION / VISION — Cinematic Scroll-Lock
     Full-screen phrase reveal → Mission → Vision crossfade
     ═══════════════════════════════════════════════ */
  function initMissionVision() {
    var section = document.getElementById('about-mission-vision');
    if (!section) return;

    var phraseEl = section.querySelector('[data-mv-phrase]');
    var missionPanel = section.querySelector('[data-mv="mission"]');
    var visionPanel = section.querySelector('[data-mv="vision"]');
    if (!phraseEl || !missionPanel || !visionPanel) return;

    // Mobile: skip pinning, show content stacked
    if (window.innerWidth < 992) {
      var phraseLayer = section.querySelector('.mv-phrase-layer');
      if (phraseLayer) phraseLayer.style.display = 'none';
      [missionPanel, visionPanel].forEach(function (p) {
        p.style.position = 'relative';
        p.style.opacity = '1';
        p.style.height = 'auto';
        p.style.padding = '64px 0';
        var line = p.querySelector('.mv-panel-line');
        if (line) line.style.width = '60px';
        var body = p.querySelector('.mv-panel-body');
        if (body) body.style.opacity = '0.55';
      });
      section.style.minHeight = 'auto';
      return;
    }

    // Progress bar — subtle gold line at bottom
    var progressBar = document.createElement('div');
    progressBar.className = 'mv-progress-bar';
    section.appendChild(progressBar);

    // Split phrase into words
    var text = phraseEl.textContent.trim();
    phraseEl.innerHTML = '';
    phraseEl.style.display = 'flex';
    phraseEl.style.flexWrap = 'wrap';
    phraseEl.style.justifyContent = 'center';
    phraseEl.style.gap = '0 0.22em';
    var wordEls = [];
    text.split(/\s+/).forEach(function (word) {
      var span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word;
      phraseEl.appendChild(span);
      wordEls.push(span);
    });
    gsap.set(wordEls, { opacity: 0, scale: 0.8, y: 30 });

    var mLine = missionPanel.querySelector('.mv-panel-line');
    var mBody = missionPanel.querySelector('.mv-panel-body');
    var vLine = visionPanel.querySelector('.mv-panel-line');
    var vBody = visionPanel.querySelector('.mv-panel-body');

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1,
      onUpdate: function (self) {
        var p = self.progress;

        // Progress bar
        progressBar.style.transform = 'scaleX(' + p + ')';

        // Phase 1 (0–30%): Words scale in
        if (p < 0.3) {
          var wp = p / 0.3;
          phraseEl.parentElement.style.opacity = '1';
          wordEls.forEach(function (w, i) {
            var threshold = i / wordEls.length;
            var wP = Math.max(0, Math.min(1, (wp - threshold) / 0.35));
            gsap.set(w, { opacity: wP, scale: 0.8 + 0.2 * wP, y: 30 * (1 - wP) });
          });
          missionPanel.style.opacity = '0';
          visionPanel.style.opacity = '0';
        }
        // Phase 2 (30–42%): Phrase fades → Mission fades in
        else if (p < 0.42) {
          var tp = (p - 0.3) / 0.12;
          phraseEl.parentElement.style.opacity = String(1 - tp);
          missionPanel.style.opacity = String(tp);
          visionPanel.style.opacity = '0';
          if (mLine) mLine.style.width = (60 * tp) + 'px';
          if (mBody) mBody.style.opacity = String(tp * 0.55);
        }
        // Phase 3 (42–65%): Mission holds
        else if (p < 0.65) {
          phraseEl.parentElement.style.opacity = '0';
          missionPanel.style.opacity = '1';
          visionPanel.style.opacity = '0';
          if (mLine) mLine.style.width = '60px';
          if (mBody) mBody.style.opacity = '0.55';
        }
        // Phase 4 (65–78%): Mission → Vision crossfade
        else if (p < 0.78) {
          var vp = (p - 0.65) / 0.13;
          phraseEl.parentElement.style.opacity = '0';
          missionPanel.style.opacity = String(1 - vp);
          visionPanel.style.opacity = String(vp);
          if (vLine) vLine.style.width = (60 * vp) + 'px';
          if (vBody) vBody.style.opacity = String(vp * 0.55);
        }
        // Phase 5 (78–100%): Vision holds
        else {
          phraseEl.parentElement.style.opacity = '0';
          missionPanel.style.opacity = '0';
          visionPanel.style.opacity = '1';
          if (vLine) vLine.style.width = '60px';
          if (vBody) vBody.style.opacity = '0.55';
        }
      },
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initHeroEntrance();
    initScrollAnimations();
    initFlipClock();
    initMissionVision();
    initSectionParallax();
    initSectionTransitions();
    initCTAGlow();
  });
})();
