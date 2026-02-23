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
     For char-cascade animation on hero h1
     ═══════════════════════════════════════════════ */
  function splitIntoChars(el) {
    var text = el.textContent.trim();
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.gap = '0 0.3em';
    var charEls = [];
    text.split(/\s+/).forEach(function (word, wi) {
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
     Each character rises with rotateX + blur,
     gold accent line draws before subtitle fades in.
     Hero content fades out on scroll past.
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

      // Gold accent line that draws before text
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

    // Hero content fades out as user scrolls past
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

    // Ken Burns zoom on hero background
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

    /* opacity-sweep — character-by-character reveal on scroll */
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

    /* char-cascade — used by hero h1 on scroll (fallback for elements not caught by initHeroEntrance) */
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

    /* line-wipe — text revealed by clip-path wipe left-to-right */
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

    /* Mission/Vision cards: "book-open" reveal — cards split apart from center with rotateY */
    var mvSection = document.getElementById('about-mission-vision');
    if (mvSection) {
      var mvGrid = mvSection.querySelector('.av-grid-2col');
      if (mvGrid) mvGrid.style.perspective = '1200px';

      var mvCards = mvSection.querySelectorAll('.av-card-dark');
      mvCards.forEach(function (card, i) {
        card.removeAttribute('data-animate');

        // Cards start overlapping at center, split apart
        gsap.fromTo(card,
          { x: i === 0 ? 60 : -60, opacity: 0, rotateY: i === 0 ? 8 : -8,
            scale: 0.92, filter: 'blur(6px)' },
          { x: 0, opacity: 1, rotateY: 0, scale: 1, filter: 'blur(0px)',
            duration: 1.8, ease: 'power3.out',
            scrollTrigger: { trigger: mvSection, start: 'top 75%',
              toggleActions: 'play none none reverse' },
            onComplete: function () {
              // Internal content stagger after card arrives
              var children = card.children;
              for (var c = 0; c < children.length; c++) {
                gsap.fromTo(children[c],
                  { y: 20, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: c * 0.12 }
                );
              }
            }
          }
        );
      });
    }

    /* ScrollTrigger refresh */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  /* ═══════════════════════════════════════════════
     VALUES SNAKE ZIGZAG — Enhanced with gold glow trail + node dots
     ═══════════════════════════════════════════════ */
  function initValuesSnake() {
    var section = document.getElementById('about-values');
    if (!section) return;
    var zigzag = section.querySelector('.about-values-zigzag');
    if (!zigzag) return;
    var rows = zigzag.querySelectorAll('[data-values-row]');
    if (!rows.length) return;

    var anchor = document.getElementById('values-snake-anchor');
    if (anchor) {
      function buildSnakePath() {
        var oldSvg = anchor.querySelector('svg');
        if (oldSvg) anchor.removeChild(oldSvg);

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.overflow = 'visible';
        svg.style.pointerEvents = 'none';

        var containerRect = zigzag.getBoundingClientRect();
        var w = containerRect.width;
        var h = containerRect.height;
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        svg.setAttribute('preserveAspectRatio', 'none');

        var points = [];
        rows.forEach(function (row, i) {
          var rect = row.getBoundingClientRect();
          var centerY = rect.top + rect.height / 2 - containerRect.top;
          var xPos = i % 2 === 0 ? w * 0.25 : w * 0.75;
          points.push({ x: xPos, y: centerY });
        });

        if (points.length < 2) return;

        // Build smooth cubic bezier path
        var d = 'M ' + (w / 2) + ' 0';
        points.forEach(function (pt, i) {
          var prev = i === 0 ? { x: w / 2, y: 0 } : points[i - 1];
          var cpY = prev.y + (pt.y - prev.y) / 2;
          d += ' C ' + prev.x + ' ' + cpY + ', ' + pt.x + ' ' + cpY + ', ' + pt.x + ' ' + pt.y;
        });
        var lastPt = points[points.length - 1];
        d += ' C ' + lastPt.x + ' ' + (lastPt.y + (h - lastPt.y) / 2) + ', ' +
             (w / 2) + ' ' + (lastPt.y + (h - lastPt.y) / 2) + ', ' +
             (w / 2) + ' ' + h;

        // SVG filter for gold glow
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'gold-glow');
        filter.setAttribute('x', '-20%'); filter.setAttribute('y', '-20%');
        filter.setAttribute('width', '140%'); filter.setAttribute('height', '140%');
        var blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('in', 'SourceGraphic');
        blur.setAttribute('stdDeviation', '4');
        filter.appendChild(blur);
        defs.appendChild(filter);
        svg.appendChild(defs);

        // Background path
        var bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bgPath.setAttribute('d', d);
        bgPath.setAttribute('class', 'about-values-snake-path-bg');
        svg.appendChild(bgPath);

        // Gold glow trail (drawn behind the red path)
        var glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        glowPath.setAttribute('d', d);
        glowPath.style.fill = 'none';
        glowPath.style.stroke = '#c9a96e';
        glowPath.style.strokeWidth = '3';
        glowPath.style.strokeLinecap = 'round';
        glowPath.style.filter = 'url(#gold-glow)';
        glowPath.style.opacity = '0.5';
        svg.appendChild(glowPath);

        // Animated foreground path (red)
        var fgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        fgPath.setAttribute('d', d);
        fgPath.setAttribute('class', 'about-values-snake-path');
        svg.appendChild(fgPath);

        // Node dots at each waypoint
        points.forEach(function (pt) {
          var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('cx', String(pt.x));
          dot.setAttribute('cy', String(pt.y));
          dot.setAttribute('r', '0');
          dot.style.fill = '#c9a96e';
          dot.style.transition = 'r 0.4s ease';
          svg.appendChild(dot);
        });

        anchor.appendChild(svg);

        var pathLength = fgPath.getTotalLength();
        var glowLength = glowPath.getTotalLength();
        gsap.set(fgPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.set(glowPath, { strokeDasharray: glowLength, strokeDashoffset: glowLength });

        // Scrub-draw both paths + scale node dots
        var nodeDots = svg.querySelectorAll('circle');
        gsap.to([fgPath, glowPath], {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: zigzag,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
            onUpdate: function (self) {
              // Scale up node dots as path reaches them
              var p = self.progress;
              nodeDots.forEach(function (dot, i) {
                var threshold = (i + 0.5) / points.length;
                var dotScale = p > threshold ? 5 : 0;
                dot.setAttribute('r', String(dotScale));
              });
            },
          },
        });
      }

      requestAnimationFrame(function () {
        requestAnimationFrame(buildSnakePath);
      });
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildSnakePath, 200);
      });
    }

    /* Card entrance animations with internal stagger */
    rows.forEach(function (row, i) {
      var card = row.querySelector('.about-values-card');
      if (!card) return;
      var isLeft = i % 2 === 0;

      gsap.fromTo(card,
        { x: isLeft ? -80 : 80, opacity: 0, rotateY: isLeft ? 4 : -4, filter: 'blur(4px)' },
        { x: 0, opacity: 1, rotateY: 0, filter: 'blur(0px)',
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: {
            trigger: row, start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
          onComplete: function () {
            // Internal stagger: number → title → description
            var children = card.children;
            for (var c = 0; c < children.length; c++) {
              gsap.fromTo(children[c],
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: c * 0.1 }
              );
            }
          },
        }
      );

      // Subtle parallax depth
      gsap.to(card, {
        yPercent: -8 + (i % 3) * 3,
        ease: 'none',
        scrollTrigger: {
          trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1,
        },
      });
    });
  }

  /* ═══════════════════════════════════════════════
     STAT COUNTER — Enhanced with gold glow pulse + elastic suffix
     ═══════════════════════════════════════════════ */
  function initStatCounter() {
    var statsSection = document.getElementById('about-stats');
    if (!statsSection) return;
    var statItems = statsSection.querySelectorAll('.about-stat-item');
    if (!statItems.length) return;
    var hasAnimated = false;

    ScrollTrigger.create({
      trigger: statsSection, start: 'top 72%',
      once: true,
      onEnter: function () {
        if (hasAnimated) return;
        hasAnimated = true;
        statItems.forEach(function (item, idx) {
          var numEl = item.querySelector('.about-stat-number');
          var labelEl = item.querySelector('.about-stat-label');

          // Fade the item in with stagger
          gsap.fromTo(item,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: idx * 0.2 }
          );

          // Count up the number
          if (numEl) {
            var text = numEl.textContent.trim();
            var match = text.match(/^(\d+)(.*)$/);
            if (match) {
              var target = parseInt(match[1]);
              var suffix = match[2];

              // Wrap suffix in a span for elastic bounce
              numEl.textContent = '';
              var numSpan = document.createElement('span');
              numSpan.textContent = '0';
              var suffixSpan = document.createElement('span');
              suffixSpan.style.display = 'inline-block';
              suffixSpan.style.opacity = '0';
              suffixSpan.style.transform = 'scale(0)';
              suffixSpan.textContent = suffix;
              numEl.appendChild(numSpan);
              numEl.appendChild(suffixSpan);

              gsap.to({ val: 0 }, {
                val: target, duration: 2.2, ease: 'power2.out', delay: idx * 0.2 + 0.3,
                onUpdate: function () { numSpan.textContent = String(Math.round(this.targets()[0].val)); },
                onComplete: function () {
                  numSpan.textContent = String(target);

                  // Suffix bounces in with elastic ease
                  gsap.to(suffixSpan, {
                    opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1.2, 0.4)',
                  });

                  // Gold glow pulse on the number
                  gsap.fromTo(numEl,
                    { textShadow: '0 0 0px rgba(201, 169, 110, 0)' },
                    { textShadow: '0 0 20px rgba(201, 169, 110, 0.4)',
                      duration: 0.6, yoyo: true, repeat: 1, ease: 'power2.inOut',
                      onComplete: function () {
                        numEl.style.textShadow = 'none';
                      }
                    }
                  );
                }
              });
            }
          }

          if (labelEl) { scrambleDecode(labelEl, idx * 0.2 + 0.6); }
        });
      }
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
     SECTION PARALLAX
     ═══════════════════════════════════════════════ */
  function initSectionParallax() {
    // Stats background parallax
    var stats = document.getElementById('about-stats');
    if (stats) {
      gsap.fromTo(stats,
        { backgroundSize: '110%' },
        { backgroundSize: '100%', ease: 'none',
          scrollTrigger: { trigger: stats, start: 'top bottom', end: 'bottom top', scrub: 1 } }
      );
    }

    // Story grid column parallax (image up, text down)
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
     CTA AMBIENT GLOW
     Subtle pulsing red radial gradient behind CTA content
     ═══════════════════════════════════════════════ */
  function initCTAGlow() {
    var ctaSection = document.querySelector('.about-cta-container');
    if (!ctaSection) return;

    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
      'width:120%;height:120%;border-radius:50%;pointer-events:none;z-index:0;',
      'background:radial-gradient(ellipse at center, rgba(200,34,42,0.04) 0%, transparent 70%);',
      'opacity:0;',
    ].join('');
    ctaSection.style.position = 'relative';
    ctaSection.insertBefore(glow, ctaSection.firstChild);

    // Pulse on scroll enter
    ScrollTrigger.create({
      trigger: ctaSection,
      start: 'top 80%',
      onEnter: function () {
        gsap.to(glow, {
          opacity: 1, duration: 1.5, ease: 'power2.out',
          onComplete: function () {
            gsap.to(glow, {
              opacity: 0.5, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut',
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
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initHeroEntrance();
    initScrollAnimations();
    initValuesSnake();
    // Process section handled by avorino-about-process3d.js (Three.js)
    initStatCounter();
    initSectionParallax();
    initSectionTransitions();
    initCTAGlow();
  });
})();
