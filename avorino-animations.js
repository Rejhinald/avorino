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
     MAGNETIC BUTTONS
     ═══════════════════════════════════════════════ */
  if (window.innerWidth > 768) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var dx = e.clientX - (rect.left + rect.width / 2);
        var dy = e.clientY - (rect.top + rect.height / 2);
        gsap.to(btn, { x: dx * 0.25, y: dy * 0.25, duration: 0.4, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ═══════════════════════════════════════════════
     UTILITY — TEXT SPLITTING
     ═══════════════════════════════════════════════ */
  function splitIntoWords(el) {
    var computed = getComputedStyle(el);
    var textAlign = computed.textAlign;
    var text = el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
    if (textAlign === 'center') el.style.justifyContent = 'center';
    else if (textAlign === 'right' || textAlign === 'end') el.style.justifyContent = 'flex-end';
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
     HERO ENTRANCE (generic — works on any page)
     ═══════════════════════════════════════════════ */
  function initHeroEntrance() {
    var hero = document.querySelector('section[id$="-hero"]');
    if (!hero) return;

    var h1 = hero.querySelector('h1');
    var subtitle = hero.querySelector('p');

    /* Skip elements that have data-animate — a page-specific footer
       script (adu-footer, construction-footer, etc.) handles those. */
    if (h1 && !h1.hasAttribute('data-animate')) {
      var words = splitIntoWords(h1);
      gsap.set(words, { yPercent: 110, opacity: 0, filter: 'blur(6px)' });
      gsap.timeline({ delay: 0.4 }).to(words, {
        yPercent: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1.4, stagger: 0.08, ease: 'power4.out',
      });
    }

    if (subtitle && !subtitle.hasAttribute('data-animate')) {
      gsap.set(subtitle, { opacity: 0, y: 30, filter: 'blur(4px)' });
      gsap.to(subtitle, {
        opacity: 0.6, y: 0, filter: 'blur(0px)',
        duration: 1, ease: 'power3.out', delay: 1.2,
      });
    }
  }

  /* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS (data-animate handlers)
     ═══════════════════════════════════════════════ */
  function initScrollAnimations() {

    /* fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      el.removeAttribute('data-animate');
      gsap.fromTo(el,
        { y: 50, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%',
            toggleActions: 'play none none reverse' } }
      );
    });

    /* opacity-sweep */
    document.querySelectorAll('[data-animate="opacity-sweep"]').forEach(function (el) {
      el.removeAttribute('data-animate');
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

    /* blur-focus */
    document.querySelectorAll('[data-animate="blur-focus"]').forEach(function (el) {
      el.removeAttribute('data-animate');
      gsap.fromTo(el,
        { filter: 'blur(14px)', opacity: 0.08, y: 20 },
        { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 20%',
            toggleActions: 'play reverse play reverse' } }
      );
    });

    /* word-stagger-elastic */
    document.querySelectorAll('[data-animate="word-stagger-elastic"]').forEach(function (el) {
      el.removeAttribute('data-animate');
      var words = splitIntoWords(el);
      gsap.set(words, { yPercent: 120 });
      gsap.to(words, {
        yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    /* parallax-depth */
    document.querySelectorAll('[data-animate="parallax-depth"]').forEach(function (el) {
      el.removeAttribute('data-animate');
      gsap.to(el, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    /* fade-up-stagger */
    document.querySelectorAll('[data-animate="fade-up-stagger"]').forEach(function (el) {
      el.removeAttribute('data-animate');
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
      el.removeAttribute('data-animate');
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
      el.removeAttribute('data-animate');
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

    /* Label line expand (generic — matches any class containing "label-line") */
    document.querySelectorAll('[class*="label-line"]').forEach(function (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line.parentElement, start: 'top 85%' } }
      );
    });

    /* Image placeholder reveal (generic) */
    document.querySelectorAll('[class*="img-placeholder"], [class*="story-img"]').forEach(function (img) {
      gsap.fromTo(img,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut',
          scrollTrigger: { trigger: img, start: 'top 80%' } }
      );
    });
  }

  /* ═══════════════════════════════════════════════
     STAT COUNTER (generic — any section with stat items)
     ═══════════════════════════════════════════════ */
  function initStatCounters() {
    document.querySelectorAll('[class*="stats-grid"], [class*="stat-grid"]').forEach(function (grid) {
      var items = grid.querySelectorAll('[class*="stat-item"]');
      if (!items.length) return;
      var hasAnimated = false;

      ScrollTrigger.create({
        trigger: grid, start: 'top 72%', once: true,
        onEnter: function () {
          if (hasAnimated) return;
          hasAnimated = true;
          items.forEach(function (item, idx) {
            var numEl = item.querySelector('[class*="stat-num"], [class*="stat-number"]');
            var labelEl = item.querySelector('[class*="stat-label"]');

            gsap.fromTo(item,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: idx * 0.2 }
            );

            if (numEl) {
              var text = numEl.textContent.trim();
              var match = text.match(/^(\d+)(.*)$/);
              if (match) {
                var target = parseInt(match[1]);
                var suffix = match[2];
                numEl.textContent = '0' + suffix;
                gsap.to({ val: 0 }, {
                  val: target, duration: 2.2, ease: 'power2.out', delay: idx * 0.2 + 0.3,
                  onUpdate: function () { numEl.textContent = Math.round(this.targets()[0].val) + suffix; },
                  onComplete: function () {
                    numEl.textContent = target + suffix;
                    gsap.fromTo(numEl, { scale: 1 }, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
                  }
                });
              }
            }

            if (labelEl) { scrambleDecode(labelEl, idx * 0.2 + 0.6); }
          });
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════
     SCRAMBLE DECODE
     ═══════════════════════════════════════════════ */
  function scrambleDecode(el, delay) {
    var originalText = el.textContent;
    var chars = '\u2588\u2593\u2591\u2592ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var frame = 0, totalFrames = 24;
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
      }, 40);
    }, delay * 1000);
  }

  /* ═══════════════════════════════════════════════
     SECTION TRANSITIONS
     ═══════════════════════════════════════════════ */
  function initSectionTransitions() {
    document.querySelectorAll('.av-section-warm, .av-section-dark, .av-section-cream').forEach(function (sec) {
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
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initHeroEntrance();
    initScrollAnimations();
    initStatCounters();
    initSectionTransitions();

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  });
})();
