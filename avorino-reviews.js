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
     REVIEW DATA
     ═══════════════════════════════════════════════ */
  var REVIEWS = [
    { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined.', author: 'S S.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. I highly recommend them.', author: 'Sam W.', location: 'Oakland, CA', stars: 5 },
    { quote: 'Raja uses technology and shared spreadsheets that really helped me stay on track with ordering finishes and the progress of the overall project. Absolutely amazing and 10/10 experience.', author: 'S S.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Owner Raja was warm and friendly. Coordinator Jay was a gem. She worked to keep everything going on time. The team worked efficiently to get the work done.', author: 'Peter H.', location: 'Lakewood, CA', stars: 4 },
    { quote: 'Raja treated my project as if it was his own and I knew I was definitely in good hands. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Santa Ana, CA', stars: 5 },
    { quote: 'Avorino built me a custom home. We loved how great they executed our project. The team was incredibly professional throughout the entire build process.', author: 'M. R.', location: 'Newport Beach, CA', stars: 5 },
    { quote: 'We had Avorino build us an ADU in our property recently. They provided the full design and rendering. Everything came out beautifully and on time.', author: 'L. T.', location: 'Dana Point, CA', stars: 5 },
    { quote: 'They were professional, courteous, and precise. Could not have asked for a better experience building our dream home addition.', author: 'D. K.', location: 'Mission Viejo, CA', stars: 5 },
    { quote: 'We\'ve been thrilled with how our project has turned out. This company is VERY communicative, professional and cost friendly. They got the job done in a timely manner.', author: 'K. M.', location: 'Laguna Beach, CA', stars: 5 },
    { quote: 'Raja was extremely responsive and thorough with helping guide us through our first remodeling project. We couldn\'t be happier with the results.', author: 'J. L.', location: 'Costa Mesa, CA', stars: 5 },
    { quote: 'Raja is a great project manager and easy to work with. Our architect made mistakes on the plans but Raja and team helped work through all issues expertly.', author: 'R. C.', location: 'Tustin, CA', stars: 5 },
    { quote: 'The entire team at Avorino was fantastic. From design to final walkthrough, they kept us informed every step of the way. Highly recommend.', author: 'M. P.', location: 'San Clemente, CA', stars: 5 },
    { quote: 'Best construction company in Orange County. Raja and his team deliver on their promises. Our ADU is exactly what we envisioned.', author: 'T. H.', location: 'Huntington Beach, CA', stars: 5 },
    { quote: 'Outstanding work on our custom home renovation. The attention to detail was impressive and the project was completed on schedule and within budget.', author: 'J. W.', location: 'Yorba Linda, CA', stars: 5 },
    { quote: 'Avorino made the ADU building process stress-free. Weekly updates and transparent pricing. Highly recommend to anyone in Orange County.', author: 'S. G.', location: 'Aliso Viejo, CA', stars: 5 },
  ];

  // Show 5 featured reviews in the scroll section
  var FEATURED = [REVIEWS[0], REVIEWS[5], REVIEWS[8], REVIEWS[3], REVIEWS[12]];

  /* ═══════════════════════════════════════════════
     BUILD DOM
     ═══════════════════════════════════════════════ */
  function buildReviewSection() {
    var existing = document.querySelector('.rv-wall');
    if (existing) existing.remove();

    var wall = document.createElement('section');
    wall.className = 'rv-wall';

    // Three.js canvas wrapper
    var canvasWrap = document.createElement('div');
    canvasWrap.className = 'rv-canvas-wrap';
    wall.appendChild(canvasWrap);

    // Content grid
    var content = document.createElement('div');
    content.className = 'rv-content';

    // ── Left: Header ──
    var header = document.createElement('div');
    header.className = 'rv-header';

    var label = document.createElement('div');
    label.className = 'rv-label';
    label.textContent = 'Client Reviews';

    var heading = document.createElement('h2');
    heading.className = 'rv-heading';
    heading.textContent = 'What our clients say';

    var stats = document.createElement('div');
    stats.className = 'rv-stats';
    var statsStars = document.createElement('span');
    statsStars.className = 'rv-stats-stars';
    statsStars.textContent = '\u2605\u2605\u2605\u2605\u2605';
    var statsText = document.createElement('span');
    statsText.textContent = '4.9 average from 35+ reviews';
    stats.appendChild(statsStars);
    stats.appendChild(statsText);

    var counter = document.createElement('div');
    counter.className = 'rv-counter';
    counter.setAttribute('data-el', 'rv-counter');
    counter.textContent = '01';

    var nav = document.createElement('div');
    nav.className = 'rv-nav';
    var arrowL = document.createElement('button');
    arrowL.className = 'rv-arrow';
    arrowL.innerHTML = '&#8249;';
    arrowL.setAttribute('aria-label', 'Previous review');
    var arrowR = document.createElement('button');
    arrowR.className = 'rv-arrow';
    arrowR.innerHTML = '&#8250;';
    arrowR.setAttribute('aria-label', 'Next review');
    nav.appendChild(arrowL);
    nav.appendChild(arrowR);

    header.appendChild(label);
    header.appendChild(heading);
    header.appendChild(stats);
    header.appendChild(counter);
    header.appendChild(nav);

    // ── Right: Review Area ──
    var reviewArea = document.createElement('div');
    reviewArea.className = 'rv-review-area';

    var reviewEls = [];
    FEATURED.forEach(function (review, i) {
      var el = document.createElement('div');
      el.className = 'rv-review' + (i === 0 ? ' is-active' : '');

      var stars = document.createElement('div');
      stars.className = 'rv-stars';
      stars.textContent = '\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars);

      var quote = document.createElement('blockquote');
      quote.className = 'rv-quote';
      quote.textContent = '\u201C' + review.quote + '\u201D';

      var sep = document.createElement('div');
      sep.className = 'rv-sep';

      var author = document.createElement('div');
      author.className = 'rv-author';
      author.textContent = review.author;

      var loc = document.createElement('div');
      loc.className = 'rv-location';
      loc.textContent = review.location;

      el.appendChild(stars);
      el.appendChild(quote);
      el.appendChild(sep);
      el.appendChild(author);
      el.appendChild(loc);
      reviewArea.appendChild(el);
      reviewEls.push(el);
    });

    content.appendChild(header);
    content.appendChild(reviewArea);
    wall.appendChild(content);

    // ── Progress Bar ──
    var progressBar = document.createElement('div');
    progressBar.className = 'rv-progress-bar';
    progressBar.innerHTML = '<div class="rv-bar-track"></div><div class="rv-bar-fill" data-el="rv-bar-fill"></div>';
    var barDots = [];
    FEATURED.forEach(function (_, i) {
      var dot = document.createElement('div');
      dot.className = 'rv-bar-dot' + (i === 0 ? ' is-active' : '');
      progressBar.appendChild(dot);
      barDots.push(dot);
    });
    wall.appendChild(progressBar);

    // Insert into page
    var main = document.querySelector('main') || document.body;
    var navEl = document.querySelector('.nav');
    if (navEl && navEl.parentElement === main) {
      main.insertBefore(wall, navEl.nextSibling);
    } else if (main.firstChild) {
      main.insertBefore(wall, main.firstChild);
    } else {
      main.appendChild(wall);
    }

    return {
      wall: wall,
      reviewEls: reviewEls,
      counter: counter,
      barFill: progressBar.querySelector('[data-el="rv-bar-fill"]'),
      barDots: barDots,
      arrowL: arrowL,
      arrowR: arrowR,
    };
  }

  /* ═══════════════════════════════════════════════
     FIND EXISTING DOM (built by Webflow builder)
     ═══════════════════════════════════════════════ */
  function findExistingDOM() {
    var wall = document.querySelector('.rv-wall');
    if (!wall) return null;
    var reviewEls = Array.prototype.slice.call(wall.querySelectorAll('.rv-review'));
    var arrows = wall.querySelectorAll('.rv-arrow');
    if (!reviewEls.length || arrows.length < 2) return null;
    return {
      wall: wall,
      reviewEls: reviewEls,
      counter: wall.querySelector('.rv-counter'),
      barFill: wall.querySelector('.rv-bar-fill'),
      barDots: Array.prototype.slice.call(wall.querySelectorAll('.rv-bar-dot')),
      arrowL: arrows[0],
      arrowR: arrows[1],
    };
  }

  /* ═══════════════════════════════════════════════
     SCROLL-DRIVEN REVIEW CYCLING
     ═══════════════════════════════════════════════ */
  function initReviews() {
    // Use existing DOM from Webflow builder, fall back to runtime build
    var dom = findExistingDOM() || buildReviewSection();
    var total = dom.reviewEls.length;
    var currentStep = 0;
    var nums = [];
    for (var i = 0; i < total; i++) nums.push(String(i + 1).padStart(2, '0'));

    function goToStep(step) {
      if (step === currentStep) return;
      var prev = currentStep;
      currentStep = step;

      // Counter crossfade
      gsap.to(dom.counter, {
        opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', overwrite: true,
        onComplete: function () {
          dom.counter.textContent = nums[step];
          gsap.to(dom.counter, { opacity: 0.06, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
        },
      });

      // Review crossfade
      dom.reviewEls.forEach(function (el, i) {
        if (i === step) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      });

      // Dots
      dom.barDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i <= step);
      });
    }

    // Manual arrow navigation (for non-scroll interaction)
    dom.arrowL.addEventListener('click', function () {
      var next = currentStep > 0 ? currentStep - 1 : total - 1;
      goToStep(next);
    });
    dom.arrowR.addEventListener('click', function () {
      var next = currentStep < total - 1 ? currentStep + 1 : 0;
      goToStep(next);
    });

    // Scroll-driven
    ScrollTrigger.create({
      trigger: dom.wall,
      start: 'top top',
      end: '+=300%',
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

    // Entrance animations
    gsap.fromTo(dom.wall.querySelector('.rv-label'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 0.4, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: dom.wall, start: 'top 90%' } }
    );
    gsap.fromTo(dom.wall.querySelector('.rv-heading'),
      { y: 30, opacity: 0, filter: 'blur(6px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: dom.wall, start: 'top 85%' } }
    );
    gsap.fromTo(dom.wall.querySelector('.rv-stats'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 0.55, duration: 1, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: dom.wall, start: 'top 85%' } }
    );
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', function () {
    initReviews();
  });
})();
