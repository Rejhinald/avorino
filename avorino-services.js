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
     UTILITY — TEXT SPLITTING
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

  /* ═══════════════════════════════════════════════
     SERVICE DATA
     ═══════════════════════════════════════════════ */
  var SERVICES = [
    {
      number: '01 / 06', title: 'ADU Construction',
      desc: 'Detached, attached, and garage conversion ADUs. Fully permitted, built to maximize property value and rental income.',
      features: ['Detached & attached units', 'Full permit handling', 'ROI-optimized design'],
      href: '/adu',
    },
    {
      number: '02 / 06', title: 'Garage Conversion',
      desc: 'Transform your existing garage into a functional living space. The most affordable path to additional square footage.',
      features: ['Budget-friendly from $75K', 'No new foundation needed', 'Quick 8\u201312 week timeline'],
      href: '/garageconversion',
    },
    {
      number: '03 / 06', title: 'Custom Homes',
      desc: 'Ground-up custom residences tailored to your vision. Full design-to-build service with architectural precision.',
      features: ['Bespoke floor plans', 'Premium materials', 'Design-build integration'],
      href: '/buildcustomhome',
    },
    {
      number: '04 / 06', title: 'New Construction',
      desc: 'New builds for landowners. Engineering, permits, and construction managed end-to-end from raw lot to move-in.',
      features: ['Site preparation & grading', 'Full engineering services', 'Turnkey delivery'],
      href: '/newconstruction',
    },
    {
      number: '05 / 06', title: 'Additions',
      desc: 'Expand your living space with room additions, second stories, and home extensions that blend seamlessly.',
      features: ['Second story additions', 'Room extensions', 'Structural reinforcement'],
      href: '/addition',
    },
    {
      number: '06 / 06', title: 'Commercial',
      desc: 'Tenant improvements, commercial renovations, and build-outs in Orange County for businesses of all sizes.',
      features: ['Tenant improvements', 'Retail & office build-outs', 'ADA compliance'],
      href: '/commercial',
    },
  ];

  /* ═══════════════════════════════════════════════
     FIND EXISTING DOM (built by Webflow builder)
     ═══════════════════════════════════════════════ */
  function findExistingDOM() {
    var showcase = document.querySelector('.sv-showcase');
    if (!showcase) return null;
    var panelEls = Array.prototype.slice.call(showcase.querySelectorAll('.sv-service-panel'));
    if (!panelEls.length) return null;
    return {
      showcase: showcase,
      panelEls: panelEls,
      counter: showcase.querySelector('.sv-counter'),
      barFill: showcase.querySelector('.sv-bar-fill'),
      barDots: Array.prototype.slice.call(showcase.querySelectorAll('.sv-bar-dot')),
    };
  }

  /* ═══════════════════════════════════════════════
     BUILD DOM (fallback if not built by Webflow)
     ═══════════════════════════════════════════════ */
  function buildShowcaseSection() {
    var showcase = document.createElement('section');
    showcase.className = 'sv-showcase';
    showcase.id = 'sv-showcase';

    // Canvas wrap
    var canvasWrap = document.createElement('div');
    canvasWrap.className = 'sv-canvas-wrap';
    showcase.appendChild(canvasWrap);

    // Content grid
    var content = document.createElement('div');
    content.className = 'sv-showcase-content';

    // Left: Info
    var info = document.createElement('div');
    info.className = 'sv-showcase-info';

    var panelEls = [];
    SERVICES.forEach(function (svc, i) {
      var panel = document.createElement('div');
      panel.className = 'sv-service-panel' + (i === 0 ? ' is-active' : '');

      var label = document.createElement('div');
      label.className = 'sv-service-label';
      label.textContent = svc.number;

      var title = document.createElement('h3');
      title.className = 'sv-service-title';
      title.textContent = svc.title;

      var desc = document.createElement('p');
      desc.className = 'sv-service-desc';
      desc.textContent = svc.desc;

      var features = document.createElement('div');
      features.className = 'sv-service-features';
      svc.features.forEach(function (f) {
        var feat = document.createElement('div');
        feat.className = 'sv-service-feature';
        feat.textContent = f;
        features.appendChild(feat);
      });

      var cta = document.createElement('a');
      cta.className = 'sv-service-cta';
      cta.href = svc.href;
      cta.textContent = 'Explore ' + svc.title + ' \u2192';

      panel.appendChild(label);
      panel.appendChild(title);
      panel.appendChild(desc);
      panel.appendChild(features);
      panel.appendChild(cta);
      info.appendChild(panel);
      panelEls.push(panel);
    });

    // Right column empty (Three.js fills canvas-wrap)
    var right = document.createElement('div');

    content.appendChild(info);
    content.appendChild(right);
    showcase.appendChild(content);

    // Counter
    var counter = document.createElement('div');
    counter.className = 'sv-counter';
    counter.textContent = '01';
    showcase.appendChild(counter);

    // Progress bar
    var progressBar = document.createElement('div');
    progressBar.className = 'sv-progress-bar';
    progressBar.innerHTML = '<div class="sv-bar-track"></div><div class="sv-bar-fill"></div>';
    var barDots = [];
    SERVICES.forEach(function (_, i) {
      var dot = document.createElement('div');
      dot.className = 'sv-bar-dot' + (i === 0 ? ' is-active' : '');
      progressBar.appendChild(dot);
      barDots.push(dot);
    });
    showcase.appendChild(progressBar);

    // Insert after hero or at start of main
    var heroEl = document.getElementById('sv-hero');
    if (heroEl && heroEl.parentElement) {
      heroEl.parentElement.insertBefore(showcase, heroEl.nextSibling);
    } else {
      var main = document.querySelector('main') || document.body;
      if (main.firstChild) main.insertBefore(showcase, main.firstChild);
      else main.appendChild(showcase);
    }

    return {
      showcase: showcase,
      panelEls: panelEls,
      counter: counter,
      barFill: showcase.querySelector('.sv-bar-fill'),
      barDots: barDots,
    };
  }

  /* ═══════════════════════════════════════════════
     HERO ENTRANCE
     ═══════════════════════════════════════════════ */
  function initHeroEntrance() {
    var hero = document.getElementById('sv-hero');
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
    var heroContent = hero.querySelector('[class*="hero-content"]') || hero.querySelector('div');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0, y: -40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  /* ═══════════════════════════════════════════════
     SERVICE SHOWCASE — SCROLL-DRIVEN CYCLING
     ═══════════════════════════════════════════════ */
  function initShowcase() {
    var dom = findExistingDOM() || buildShowcaseSection();
    var total = dom.panelEls.length;
    var currentStep = 0;
    var nums = [];
    for (var i = 0; i < total; i++) nums.push(String(i + 1).padStart(2, '0'));

    // Ensure first panel is active
    dom.panelEls.forEach(function (el, i) {
      if (i === 0) { el.classList.add('is-active'); el.style.opacity = '1'; el.style.pointerEvents = 'auto'; }
      else { el.classList.remove('is-active'); el.style.opacity = '0'; el.style.pointerEvents = 'none'; }
    });
    if (dom.barDots.length) dom.barDots[0].classList.add('is-active');

    function goToStep(step) {
      if (step === currentStep) return;
      currentStep = step;

      // Counter crossfade
      gsap.to(dom.counter, {
        opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', overwrite: true,
        onComplete: function () {
          dom.counter.textContent = nums[step];
          gsap.to(dom.counter, { opacity: 0.12, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
        },
      });

      // Panel crossfade
      dom.panelEls.forEach(function (el, i) {
        if (i === step) {
          el.classList.add('is-active');
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
        } else {
          el.classList.remove('is-active');
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        }
      });

      // Dots
      dom.barDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i <= step);
      });

      // Dispatch event for 3D scene
      dom.showcase.dispatchEvent(new CustomEvent('sv-service-change', { detail: { step: step } }));
    }

    // Scroll-driven
    ScrollTrigger.create({
      trigger: dom.showcase,
      start: 'top top',
      end: '+=600%',
      pin: true,
      scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress;

        // Progress bar fill
        if (dom.barFill) dom.barFill.style.transform = 'translateY(-50%) scaleX(' + p + ')';

        // Determine active step
        var step = Math.min(Math.floor(p * total), total - 1);
        if (step !== currentStep) goToStep(step);
      },
    });

    // Entrance animations for showcase elements
    var firstPanel = dom.panelEls[0];
    if (firstPanel) {
      gsap.fromTo(firstPanel.querySelector('.sv-service-label'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 0.8, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: dom.showcase, start: 'top 90%' } }
      );
      gsap.fromTo(firstPanel.querySelector('.sv-service-title'),
        { y: 30, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: dom.showcase, start: 'top 85%' } }
      );
    }
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS (data-animate handlers)
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

    /* word-stagger-elastic */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function (el) {
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%' }
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
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  function init() {
    initHeroEntrance();
    initShowcase();
    initScrollAnimations();
    // Note: process section is handled by avorino-about-process3d.js
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
