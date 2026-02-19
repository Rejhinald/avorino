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

  // ── Column config: card indices + speed + direction ──
  var COLUMNS = [
    { indices: [0, 5, 10, 3, 8, 13, 6],  speed: '35s', dir: 'up' },
    { indices: [1, 6, 11, 4, 9, 14, 7],  speed: '48s', dir: 'down' },
    { indices: [2, 7, 12, 0, 5, 10, 3],  speed: '32s', dir: 'up' },
    { indices: [3, 8, 13, 1, 6, 11, 4],  speed: '52s', dir: 'down' },
    { indices: [4, 9, 14, 2, 7, 12, 5],  speed: '42s', dir: 'up' },
  ];

  function createCard(review) {
    var card = document.createElement('div');
    card.className = 'rv-card';

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

  function buildWall() {
    var wall = document.createElement('section');
    wall.className = 'rv-wall';

    var grid = document.createElement('div');
    grid.className = 'rv-grid';

    COLUMNS.forEach(function(colConfig) {
      var col = document.createElement('div');
      col.className = 'rv-col rv-col--' + colConfig.dir;
      col.style.setProperty('--rv-speed', colConfig.speed);

      var track = document.createElement('div');
      track.className = 'rv-col-track';

      // Build cards twice for seamless marquee loop
      for (var dup = 0; dup < 2; dup++) {
        colConfig.indices.forEach(function(idx) {
          var review = REVIEWS[idx % REVIEWS.length];
          track.appendChild(createCard(review));
        });
      }

      col.appendChild(track);
      grid.appendChild(col);
    });

    wall.appendChild(grid);

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
