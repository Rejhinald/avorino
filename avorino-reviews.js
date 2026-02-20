(function() {
  'use strict';

  // ── Review data ──
  // Sources: Avorino Yelp page (4.8★, 35 reviews), avorino.com testimonials
  var REVIEWS = [
    { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Irvine, CA', stars: 5 },
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

  // ── Card color variants (cycle through these) ──
  var VARIANTS = ['', '--dark', '--red', '--warm', '--slate'];

  // Cards per set — enough so 2× duplication fills 250vmax on large screens
  var CARDS_PER_SET = 25;

  // ── Column config: offset into REVIEWS + speed + direction ──
  // 7 columns for wide-screen coverage
  var COLUMNS = [
    { offset: 0,  speed: '80s', dir: 'up' },
    { offset: 2,  speed: '100s', dir: 'down' },
    { offset: 5,  speed: '70s', dir: 'up' },
    { offset: 8,  speed: '110s', dir: 'down' },
    { offset: 11, speed: '90s', dir: 'up' },
  ];

  function createCard(review, variant) {
    var card = document.createElement('div');
    card.className = 'rv-card' + (variant ? ' rv-card' + variant : '');

    var stars = document.createElement('div');
    stars.className = 'rv-stars';
    stars.textContent = '\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars);

    var quote = document.createElement('p');
    quote.className = 'rv-quote';
    quote.textContent = '\u201C' + review.quote + '\u201D';

    var attrib = document.createElement('div');
    attrib.className = 'rv-attrib';

    var author = document.createElement('span');
    author.className = 'rv-author';
    author.textContent = review.author;

    var loc = document.createElement('span');
    loc.className = 'rv-location';
    loc.textContent = review.location;

    attrib.appendChild(author);
    attrib.appendChild(loc);
    card.appendChild(stars);
    card.appendChild(quote);
    card.appendChild(attrib);

    return card;
  }

  function buildCarousel(wall) {
    var carousel = document.createElement('div');
    carousel.className = 'rv-carousel';

    // Arrows
    var arrowL = document.createElement('button');
    arrowL.className = 'rv-carousel-arrow rv-carousel-arrow--left';
    arrowL.innerHTML = '&#8249;';
    arrowL.setAttribute('aria-label', 'Previous review');

    var arrowR = document.createElement('button');
    arrowR.className = 'rv-carousel-arrow rv-carousel-arrow--right';
    arrowR.innerHTML = '&#8250;';
    arrowR.setAttribute('aria-label', 'Next review');

    // Viewport
    var viewport = document.createElement('div');
    viewport.className = 'rv-carousel-viewport';

    // Track
    var track = document.createElement('div');
    track.className = 'rv-carousel-track';

    // Build slides
    var slides = [];
    REVIEWS.forEach(function(review) {
      var slide = document.createElement('div');
      slide.className = 'rv-carousel-slide';

      var card = document.createElement('div');
      card.className = 'rv-carousel-card';

      var stars = document.createElement('div');
      stars.className = 'rv-stars';
      stars.textContent = '\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars);

      var quote = document.createElement('p');
      quote.className = 'rv-quote';
      quote.textContent = '\u201C' + review.quote + '\u201D';

      var attrib = document.createElement('div');
      attrib.className = 'rv-attrib';

      var author = document.createElement('span');
      author.className = 'rv-author';
      author.textContent = review.author;

      var loc = document.createElement('span');
      loc.className = 'rv-location';
      loc.textContent = review.location;

      attrib.appendChild(author);
      attrib.appendChild(loc);
      card.appendChild(stars);
      card.appendChild(quote);
      card.appendChild(attrib);
      slide.appendChild(card);
      track.appendChild(slide);
      slides.push(slide);
    });

    viewport.appendChild(track);
    carousel.appendChild(arrowL);
    carousel.appendChild(viewport);
    carousel.appendChild(arrowR);
    wall.appendChild(carousel);

    // ── Carousel logic ──
    var current = 0;
    var total = slides.length;
    var autoTimer = null;
    var isMobile = window.matchMedia('(max-width: 767px)');

    function getSlideWidth() {
      return isMobile.matches ? 100 : 100 / 3;
    }

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      var offset = current * getSlideWidth();
      // Center the active card: shift back by one card width (for 3-peek)
      if (!isMobile.matches) {
        offset -= getSlideWidth();
      }
      track.style.transform = 'translateX(-' + offset + '%)';

      slides.forEach(function(s, i) {
        s.classList.toggle('is-active', i === current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 5000);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    arrowR.addEventListener('click', function() { stopAuto(); next(); startAuto(); });
    arrowL.addEventListener('click', function() { stopAuto(); prev(); startAuto(); });

    // Touch / swipe
    var touchStartX = 0;
    var touchEndX = 0;
    viewport.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAuto();
    }, { passive: true });
    viewport.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { next(); } else { prev(); }
      }
      startAuto();
    }, { passive: true });

    // Recalc on resize
    isMobile.addEventListener('change', function() { goTo(current); });

    // Init
    goTo(0);
    startAuto();
  }

  function buildWall() {
    var wall = document.createElement('section');
    wall.className = 'rv-wall';

    var grid = document.createElement('div');
    grid.className = 'rv-grid';

    COLUMNS.forEach(function(colConfig, colIdx) {
      var col = document.createElement('div');
      col.className = 'rv-col rv-col--' + colConfig.dir;
      col.style.setProperty('--rv-speed', colConfig.speed);

      var track = document.createElement('div');
      track.className = 'rv-col-track';

      // Build cards twice for seamless marquee loop
      for (var dup = 0; dup < 2; dup++) {
        for (var i = 0; i < CARDS_PER_SET; i++) {
          var review = REVIEWS[(i + colConfig.offset) % REVIEWS.length];
          var variant = VARIANTS[(i + colIdx) % VARIANTS.length];
          track.appendChild(createCard(review, variant));
        }
      }

      col.appendChild(track);
      grid.appendChild(col);
    });

    wall.appendChild(grid);

    // ── Foreground carousel ──
    buildCarousel(wall);

    // Insert wall after nav, or as first element
    var main = document.querySelector('main') || document.body;
    var nav = document.querySelector('.nav');
    if (nav && nav.parentElement === main) {
      main.insertBefore(wall, nav.nextSibling);
    } else if (main.firstChild) {
      main.insertBefore(wall, main.firstChild);
    } else {
      main.appendChild(wall);
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWall);
  } else {
    buildWall();
  }
})();
