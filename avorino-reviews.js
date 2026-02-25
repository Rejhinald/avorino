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
    { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. Our architect made mistakes on the plans but Raja and team helped work through all issues. I highly recommend them.', author: 'Sam W.', location: 'Oakland, CA', stars: 5 },
    { quote: 'These guys helped us out, converting our one car garage into a junior ADU. The city was difficult to work with, and they took care of everything. Raja was excellent and easy to work with. Their cost was very competitive. I would definitely work with them again.', author: 'Alex D.', location: 'Los Angeles, CA', stars: 5 },
    { quote: 'We had Avorino build us an ADU in our property recently. They provided the full design and rendering. They pulled permits and built our 1,000 sqft ADU from start to finish. They are really easy to work with and their prices are very competitive.', author: 'Ray W.', location: 'Irvine, CA', stars: 5 },
    { quote: 'This was my first kitchen remodeling experience and I was very nervous. From the first time I made contact, it was a smooth and professional experience. They executed my vision in every detail. The work was completed in less time than estimated and perfectly within budget.', author: 'Tina C.', location: 'Dana Point, CA', stars: 5 },
    { quote: 'What a wonderful experience working with Raja and his team! Raja was extremely professional, timely, and had clear communication the entire time. My parents were so happy with how their ADU turned out and I am impressed with the care and service I received!', author: 'Alarah R.', location: 'Orange County, CA', stars: 5 },
    { quote: 'It\'s so rare to find a contractor that you have a good experience with. They got the work done quickly and made sure every little detail was completed without me having to be on top of them. I highly recommend and will definitely use them again!', author: 'Nikki B.', location: 'Laguna Niguel, CA', stars: 5 },
    { quote: 'These are the best people in the business. They beat every single price that I got on top of that they did an excellent job finishing it in no time. They are truly the best of the best, highly recommended.', author: 'Shahin S.', location: 'Los Angeles, CA', stars: 5 },
    { quote: 'Avorino built me a custom home. We loved how great they executed our project. We were impressed that they finished before the estimated timeline. They communicated every step. Love this company.', author: 'Hooman E.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Raja and William were great to work with. After our consultation they started the work within a week. They were professional, courteous, and precise. The job turned out great. I would totally recommend them.', author: 'Ryan J.', location: 'Brentwood, CA', stars: 5 },
    { quote: 'They responded very quickly and showed up the next day to give a quote. Always responded and showed up on time. The job was done on time and I love the fine look and clear way of working. I highly recommend this business!', author: 'Pazit B.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Raja was attentive, responsive and communicative with the entire process. He gave us good ideas throughout and supported us in selecting the various fixtures and tiles. We\'ve been thrilled with how the kitchen has turned out!', author: 'Peeb P.', location: 'Irvine, CA', stars: 5 },
    { quote: 'William and Raja are hands down the best around! They are with you from start to finish and are incredibly helpful, communicative and understanding. We have used them for multiple projects at home and at our two businesses.', author: 'Kristle J.', location: 'San Clemente, CA', stars: 5 },
    { quote: 'Did a bathroom remodel. Full service company. Accommodates changes along the way, and fixing anything we point out or that we wanted changed. Fast and things get done, thanks Raja!', author: 'Tony H.', location: 'Irvine, CA', stars: 5 },
    { quote: 'They did an excellent job and actually at a good price. We did a retile plus new fixtures and it came out looking like a high end resort bathroom.', author: 'Amy D.', location: 'San Clemente, CA', stars: 5 },
    { quote: 'They were exceptional. The expertise, responsiveness, professionalism, cleanliness, creative and ingenuity is top of the line. Their work is so good and most important, honest.', author: 'Boris B.', location: 'Newport Beach, CA', stars: 5 },
    { quote: 'Such a professional and creative team! They walked into my house with confidence that they would remodel my horrific 1960s fireplace to a clean cut, modern, cozy and budget friendly replacement. And so they did!', author: 'Teri N.', location: 'Irvine, CA', stars: 5 },
    { quote: 'William and his team did a spectacular job on our new front porch! I rehired him due to his responsiveness, honesty and speedy, quality work! His team got our porch done in literally a day and a half.', author: 'Courtney C.', location: 'Mission Viejo, CA', stars: 5 },
    { quote: 'Raja and Amir are easily the most friendly and up front contractors we\'ve worked with. Highly recommend them for being super easy to work with and good quality.', author: 'Allen D.', location: 'San Clemente, CA', stars: 5 },
    { quote: 'This company is VERY communicative, professional and cost friendly. They got the job done in a timely manner. Every pre-existing issue I had they went over and beyond to fix. 100/100 across the board.', author: 'Jeremy C.', location: 'Long Beach, CA', stars: 5 },
    { quote: 'Raja and his team came in with a reasonable price and worked after hours to get the job done! His team was respectful, clean, and worked after hours. I cannot recommend them enough.', author: 'Behrooz S.', location: 'Huntington Beach, CA', stars: 5 },
    { quote: 'We had them complete our media wall and absolutely loved working with their team! They were so professional from the beginning and set very realistic expectations. Our final product was better than I had imagined.', author: 'Srishti P.', location: 'Burbank, CA', stars: 5 },
    { quote: 'I am very happy with my decision and the final outcome is fabulous! All the workers were on time, professional and respectful. The work is top notch!', author: 'Theresa F.', location: 'Laguna Niguel, CA', stars: 5 },
    { quote: 'Raja gave me the kitchen of my dreams. I couldn\'t have made a better decision. He was honest and very easy to work with. They were always on time and completed the work in record time.', author: 'Sonia H.', location: 'Irvine, CA', stars: 5 },
    { quote: 'William was wonderful in relieving my fears and reassuring me they could take care of everything! He was professional as was his crew. I would certainly recommend them!', author: 'Marcia R.', location: 'San Clemente, CA', stars: 5 },
    { quote: 'Excellent work, reliable \u2014 highly recommend them. They are very tidy and the results speak for themselves.', author: 'Ellen C.', location: 'San Francisco, CA', stars: 5 },
  ];

  // 10 featured reviews shown in the scroll section
  var FEATURED = [REVIEWS[0], REVIEWS[1], REVIEWS[3], REVIEWS[5], REVIEWS[8], REVIEWS[4], REVIEWS[15], REVIEWS[19], REVIEWS[12], REVIEWS[23]];

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
          gsap.to(dom.counter, { opacity: 0.12, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
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
