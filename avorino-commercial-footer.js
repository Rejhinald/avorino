(function() {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ── Preserve original text before avorino-animations.js modifies DOM ── */
  document.querySelectorAll('#cm-hero h1, #cm-comparison h2, #cm-precon h2, #cm-types h2, #cm-fit h2, #cm-process h2, .av-cta-heading').forEach(function(el) {
    if (!el.dataset.origText) el.dataset.origText = el.textContent.trim();
  });

  /* ── Remove data-animate from elements this script handles ── */
  document.querySelectorAll('#cm-trust-strip [data-animate], .cm-comparison-row, .cm-proof-stat, .cm-type-item, .cm-fit-item, .cm-fit-proof, .cm-process-step, .av-cta-heading, .av-cta-btn, .av-cta-btns, .av-cta-subtitle').forEach(function(el) {
    el.removeAttribute('data-animate');
  });

  /* ═══════════════════════════════════════════════
     SHARED RUNTIME STATE
     ═══════════════════════════════════════════════ */
  var MOBILE_BP = 768;
  var runtime = {
    lenis: null,
    heroRenderer: null,
    heroRaf: null,
    heroDisposed: false,
    preconRenderer: null,
    preconTriggers: [],
    isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isMobile: window.innerWidth < MOBILE_BP,
    onHeroResize: null,
  };
  var resizeTimer = null;

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
  function initLenis() {
    if (window.__lenis) { try { window.__lenis.destroy(); } catch(e) {} }
    var lenis = new Lenis({
      duration: 1.4,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smooth: true, smoothTouch: false,
    });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.addEventListener('refresh', function() { lenis.resize(); });
    return lenis;
  }

  /* ═══════════════════════════════════════════════
     TEXT UTILITIES
     ═══════════════════════════════════════════════ */
  function splitIntoChars(el) {
    var text = el.dataset.origText || el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex'; el.style.flexWrap = 'wrap'; el.style.gap = '0 0.3em';
    var charEls = [];
    text.split(/\s+/).forEach(function(word) {
      var wordWrap = document.createElement('span');
      wordWrap.style.display = 'inline-flex'; wordWrap.style.overflow = 'hidden';
      for (var i = 0; i < word.length; i++) {
        var cs = document.createElement('span');
        cs.style.display = 'inline-block'; cs.textContent = word[i];
        wordWrap.appendChild(cs); charEls.push(cs);
      }
      el.appendChild(wordWrap);
    });
    return charEls;
  }

  function splitIntoWords(el) {
    var text = el.dataset.origText || el.textContent.trim();
    var align = window.getComputedStyle(el).textAlign;
    el.innerHTML = '';
    el.style.display = 'flex'; el.style.flexWrap = 'wrap'; el.style.gap = '0 0.3em';
    if (align === 'center') el.style.justifyContent = 'center';
    var wordEls = [];
    text.split(/\s+/).forEach(function(word) {
      var wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block'; wrapper.style.overflow = 'hidden'; wrapper.style.verticalAlign = 'top';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block'; inner.textContent = word;
      wrapper.appendChild(inner); el.appendChild(wrapper);
      wordEls.push(inner);
    });
    return wordEls;
  }

  /* ═══════════════════════════════════════════════
     HERO LIFECYCLE
     ═══════════════════════════════════════════════ */
  function teardownHero(rt) {
    if (rt.heroDisposed) return;
    rt.heroDisposed = true;
    if (rt.heroRaf) cancelAnimationFrame(rt.heroRaf);
    if (rt.onHeroResize) rt.onHeroResize = null;
    if (rt.heroRenderer) {
      rt.heroRenderer.dispose();
      rt.heroRenderer.forceContextLoss();
      rt.heroRenderer.domElement.remove();
      rt.heroRenderer = null;
    }
  }

  /* ═══════════════════════════════════════════════
     PRECON LIFECYCLE
     ═══════════════════════════════════════════════ */
  function teardownPrecon(rt) {
    rt.preconTriggers.forEach(function(st) { st.kill(); });
    rt.preconTriggers = [];
    if (rt.preconRenderer) {
      rt.preconRenderer.dispose();
      rt.preconRenderer.forceContextLoss();
      rt.preconRenderer.domElement.remove();
      rt.preconRenderer = null;
    }
  }

  function reconcilePrecon(rt) {
    var wasMobile = rt.isMobile;
    rt.isMobile = window.innerWidth < MOBILE_BP;
    if (rt.isReduced) return;
    if (wasMobile && !rt.isMobile && !rt.preconRenderer) {
      initCommercialPrecon(rt);
    }
    if (!wasMobile && rt.isMobile && rt.preconRenderer) {
      teardownPrecon(rt);
    }
  }

  /* ═══════════════════════════════════════════════
     RESIZE HANDLER
     ═══════════════════════════════════════════════ */
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      reconcilePrecon(runtime);
      if (runtime.onHeroResize && !runtime.heroDisposed) runtime.onHeroResize();
      ScrollTrigger.refresh();
      runtime.lenis.resize();
    }, 250);
  }

  /* ═══════════════════════════════════════════════
     initCommercialMotion — All GSAP animations
     (trust strip, comparison, types, fit, process, CTA)
     ═══════════════════════════════════════════════ */
  function initCommercialMotion(rt) {
    var dur = rt.isReduced ? 0 : undefined;

    // ── Trust Strip: word stagger ──
    var trustWords = document.querySelectorAll('#cm-trust-strip .cm-trust-word');
    if (trustWords.length) {
      gsap.fromTo(trustWords, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-trust-strip', start: 'top 85%', once: true },
      });
    }

    // ── Comparison: row stagger with left/right offset ──
    var compRows = document.querySelectorAll('#cm-comparison .cm-comparison-row');
    compRows.forEach(function(row, i) {
      var typical = row.querySelector('.cm-comp-typical');
      var avorino = row.querySelector('.cm-comp-avorino');
      var tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      });
      if (typical) tl.fromTo(typical, { x: -20, opacity: 0 }, { x: 0, opacity: 0.35, duration: dur || 0.6, ease: 'power3.out' }, 0);
      if (avorino) tl.fromTo(avorino, { x: 20, opacity: 0 }, { x: 0, opacity: 0.85, duration: dur || 0.6, ease: 'power3.out' }, 0.1);
    });

    // ── Comparison: proof stat ──
    var proofStat = document.querySelector('#cm-comparison .cm-proof-stat');
    if (proofStat) {
      gsap.fromTo(proofStat, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: proofStat, start: 'top 90%', once: true },
      });
    }

    // ── Project Types: item stagger ──
    var typeItems = document.querySelectorAll('#cm-types .cm-type-item');
    if (typeItems.length) {
      gsap.fromTo(typeItems, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-types', start: 'top 80%', once: true },
      });
    }

    // ── Ideal Fit: item stagger ──
    var fitItems = document.querySelectorAll('#cm-fit .cm-fit-item');
    if (fitItems.length) {
      gsap.fromTo(fitItems, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-fit .cm-fit-items', start: 'top 85%', once: true },
      });
    }
    var fitProof = document.querySelector('#cm-fit .cm-fit-proof');
    if (fitProof) {
      gsap.fromTo(fitProof, { y: 15, opacity: 0 }, {
        y: 0, opacity: 0.45, duration: dur || 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: fitProof, start: 'top 90%', once: true },
      });
    }

    // ── Process: card stagger ──
    var processSteps = document.querySelectorAll('#cm-process .cm-process-step');
    if (processSteps.length) {
      gsap.fromTo(processSteps, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: dur || 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '#cm-process .cm-process-grid', start: 'top 85%', once: true },
      });
    }

    // ── CTA: heading word stagger + button entrance ──
    var ctaHeading = document.querySelector('.av-cta-heading');
    if (ctaHeading) {
      var ctaWords = splitIntoWords(ctaHeading);
      gsap.fromTo(ctaWords, { yPercent: 100, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: dur || 0.8, stagger: 0.04, ease: 'elastic.out(1, 0.6)',
        scrollTrigger: { trigger: '.av-cta', start: 'top 80%', once: true },
      });
    }
    var ctaBtns = document.querySelector('.av-cta-btns');
    if (ctaBtns) {
      gsap.fromTo(ctaBtns.children, { y: 30, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: dur || 0.8, stagger: 0.15, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.av-cta', start: 'top 85%', once: true },
      });
    }

    // ── Precon mobile: card stagger (only runs on mobile) ──
    if (rt.isMobile) {
      var preconMobileSteps = document.querySelectorAll('.cm-precon-mobile .cm-precon-mobile-step');
      if (preconMobileSteps.length) {
        gsap.fromTo(preconMobileSteps, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: dur || 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.cm-precon-mobile', start: 'top 85%', once: true },
        });
      }
    }
  }

  /* ═══════════════════════════════════════════════
     PLACEHOLDER: initCommercialHero (Task 6)
     ═══════════════════════════════════════════════ */
  function initCommercialHero(rt) {
    // Implemented in Task 6
  }

  /* ═══════════════════════════════════════════════
     PLACEHOLDER: initCommercialPrecon (Task 7)
     ═══════════════════════════════════════════════ */
  function initCommercialPrecon(rt) {
    // Implemented in Task 7
  }

  /* ═══════════════════════════════════════════════
     BOOTSTRAP
     ═══════════════════════════════════════════════ */
  function bootstrap() {
    runtime.lenis = initLenis();

    if (!runtime.isReduced) {
      initCommercialHero(runtime);
      if (!runtime.isMobile) initCommercialPrecon(runtime);
    }
    initCommercialMotion(runtime);

    ScrollTrigger.create({
      trigger: '#cm-comparison',
      start: 'top bottom',
      once: true,
      onEnter: function() { teardownHero(runtime); },
    });

    window.addEventListener('resize', onResize);
  }

  window.addEventListener('DOMContentLoaded', bootstrap);
})();
