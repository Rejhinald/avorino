(function() {
  'use strict';

  // ── Scroll-triggered fade-in using IntersectionObserver ──
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function init() {
    // Observe blog cards
    var cards = document.querySelectorAll('.blog-card');
    cards.forEach(function(card) { observer.observe(card); });

    // Observe hero section
    var hero = document.querySelector('.av-section-dark');
    if (hero) observer.observe(hero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
