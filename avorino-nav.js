/*
  Avorino Navigation Controller
  Hover-intent dropdowns, staggered reveals, scroll states,
  burger toggle, mobile accordion, keyboard support.
  No dependencies - vanilla JS only.
*/
(function () {
  'use strict';

  var INIT_FLAG = '__avorinoNavInitialized';

  function init() {
    var nav = document.querySelector('.site-nav');
    var burger = document.querySelector('[data-el="nav-burger"]');
    var overlay = document.querySelector('[data-el="nav-mobile-overlay"]');
    var navItems = document.querySelectorAll('.nav-item');
    var accordion = document.querySelector('[data-el="nav-accordion-cities"]');
    var accBody = document.querySelector('[data-el="nav-accordion-cities-body"]');

    if (!nav || nav[INIT_FLAG]) {
      return;
    }

    nav[INIT_FLAG] = true;

    var HOVER_ENTER = 80;
    var HOVER_LEAVE = 350;
    var STAGGER_MS = 35;

    var activeItem = null;
    var enterTimer = null;
    var leaveTimer = null;
    var ticking = false;

    function openDropdown(item) {
      if (activeItem === item) {
        return;
      }

      closeAll(true);
      activeItem = item;
      item.classList.add('is-open');
      nav.classList.add('nav--dropdown-open');

      var dropdown = item.querySelector('.nav-dropdown');
      if (!dropdown) {
        return;
      }

      var children = dropdown.querySelectorAll(
        '.nav-dd-service-card, .nav-dd-tool-card, .nav-dd-link, .nav-dd-link--featured, ' +
        '.nav-dd-city-col, .nav-dd-label, .nav-dd-tools-badge, .nav-dd-divider'
      );

      for (var i = 0; i < children.length; i++) {
        children[i].style.animationDelay = (i * STAGGER_MS) + 'ms';
      }
    }

    function closeAll(instant) {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);

      if (activeItem) {
        if (instant) {
          activeItem.classList.remove('is-open');
        } else {
          activeItem.classList.add('is-closing');
          activeItem.classList.remove('is-open');

          var closing = activeItem;
          setTimeout(function () {
            closing.classList.remove('is-closing');
          }, 350);
        }

        activeItem = null;
      }

      nav.classList.remove('nav--dropdown-open');
    }

    function openMobile() {
      if (!burger || !overlay) {
        return;
      }

      burger.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMobile() {
      if (!burger || !overlay) {
        return;
      }

      burger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function onScroll() {
      var hero = document.querySelector('.hero');
      var threshold = hero ? hero.offsetHeight * 0.5 : 100;

      if (window.scrollY > threshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      ticking = false;
    }

    for (var navIndex = 0; navIndex < navItems.length; navIndex++) {
      (function (item) {
        item.addEventListener('mouseenter', function () {
          clearTimeout(leaveTimer);
          clearTimeout(enterTimer);
          enterTimer = setTimeout(function () {
            openDropdown(item);
          }, HOVER_ENTER);
        });

        item.addEventListener('mouseleave', function () {
          clearTimeout(enterTimer);
          leaveTimer = setTimeout(function () {
            closeAll(false);
          }, HOVER_LEAVE);
        });
      })(navItems[navIndex]);
    }

    var dropdowns = document.querySelectorAll('.nav-dropdown');
    for (var dropdownIndex = 0; dropdownIndex < dropdowns.length; dropdownIndex++) {
      dropdowns[dropdownIndex].addEventListener('mouseenter', function () {
        clearTimeout(leaveTimer);
      });

      dropdowns[dropdownIndex].addEventListener('mouseleave', function () {
        clearTimeout(enterTimer);
        leaveTimer = setTimeout(function () {
          closeAll(false);
        }, HOVER_LEAVE);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') {
        return;
      }

      closeAll(false);
      if (overlay && overlay.classList.contains('open')) {
        closeMobile();
      }
    });

    document.addEventListener('click', function (event) {
      if (activeItem && !nav.contains(event.target)) {
        closeAll(false);
      }
    });

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    onScroll();

    if (burger && overlay) {
      burger.addEventListener('click', function () {
        if (burger.classList.contains('open')) {
          closeMobile();
        } else {
          openMobile();
        }
      });

      var mobileLinks = overlay.querySelectorAll('a');
      for (var linkIndex = 0; linkIndex < mobileLinks.length; linkIndex++) {
        mobileLinks[linkIndex].addEventListener('click', closeMobile);
      }
    }

    if (accordion && accBody) {
      accordion.addEventListener('click', function () {
        accordion.classList.toggle('is-open');
        accBody.classList.toggle('is-open');
      });
    }
  }

  function tryInit(attempts) {
    var nav = document.querySelector('.site-nav');
    if (nav) {
      init();
    } else if (attempts < 20) {
      setTimeout(function() { tryInit(attempts + 1); }, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { tryInit(0); });
  } else {
    tryInit(0);
  }
})();
