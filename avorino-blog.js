(function() {
  'use strict';

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function init() {
    // Blog listing: cards
    var cards = document.querySelectorAll('.blog-card');
    cards.forEach(function(card) { observer.observe(card); });

    // Blog listing: hero
    var hero = document.querySelector('.av-section-dark');
    if (hero) observer.observe(hero);

    var blogHero = document.querySelector('.blog-hero');
    if (blogHero) observer.observe(blogHero);

    // Blog post template
    var btHero = document.querySelector('.bt-hero');
    if (btHero) observer.observe(btHero);

    var btImg = document.querySelector('.bt-img-wrap');
    if (btImg) observer.observe(btImg);

    var btArticle = document.querySelector('.bt-article-inner');
    if (btArticle) observer.observe(btArticle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
