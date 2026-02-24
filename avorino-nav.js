/* ═══════════════════════════════════════════════════════════════
   Avorino — Navigation Controller
   Hover-intent dropdowns, staggered reveals, scroll states,
   burger toggle, mobile accordion, keyboard support.
   No dependencies — vanilla JS only.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Config ──
  var HOVER_ENTER  = 80;    // ms before dropdown opens (prevents accidental triggers)
  var HOVER_LEAVE  = 350;   // ms grace period before closing (prevents flicker between items)
  var SCROLL_TOP   = 10;    // px — add glass bg after this
  var STAGGER_MS   = 35;    // ms between each content item fade-in

  // ── Cached Elements ──
  var nav       = document.querySelector('.site-nav');
  var burger    = document.querySelector('[data-el="nav-burger"]');
  var overlay   = document.querySelector('[data-el="nav-mobile-overlay"]');
  var navItems  = document.querySelectorAll('.nav-item');
  var accordion = document.querySelector('[data-el="nav-accordion-cities"]');
  var accBody   = document.querySelector('[data-el="nav-accordion-cities-body"]');

  if (!nav) return;

  /* ═══════════════════════════════════════════
     DESKTOP DROPDOWNS — Hover Intent
     ═══════════════════════════════════════════ */
  var activeItem   = null;
  var enterTimer   = null;
  var leaveTimer   = null;

  function openDropdown(item) {
    if (activeItem === item) return;
    closeAll(true); // skip transition-out for swap

    activeItem = item;
    item.classList.add('is-open');
    nav.classList.add('nav--dropdown-open');

    // Stagger child elements for reveal animation
    var dd = item.querySelector('.nav-dropdown');
    if (dd) {
      var children = dd.querySelectorAll(
        '.nav-dd-service-card, .nav-dd-link, .nav-dd-link--featured, ' +
        '.nav-dd-city-col, .nav-dd-label, .nav-dd-divider'
      );
      for (var i = 0; i < children.length; i++) {
        children[i].style.animationDelay = (i * STAGGER_MS) + 'ms';
      }
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
        setTimeout(function () { closing.classList.remove('is-closing'); }, 350);
      }
      activeItem = null;
    }
    nav.classList.remove('nav--dropdown-open');
  }

  // Attach hover listeners to each nav-item
  for (var i = 0; i < navItems.length; i++) {
    (function (item) {
      item.addEventListener('mouseenter', function () {
        clearTimeout(leaveTimer);
        clearTimeout(enterTimer);
        enterTimer = setTimeout(function () { openDropdown(item); }, HOVER_ENTER);
      });

      item.addEventListener('mouseleave', function () {
        clearTimeout(enterTimer);
        leaveTimer = setTimeout(function () { closeAll(false); }, HOVER_LEAVE);
      });
    })(navItems[i]);
  }

  // Also listen on the dropdown panels themselves (keep open while hovering content)
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  for (var d = 0; d < dropdowns.length; d++) {
    dropdowns[d].addEventListener('mouseenter', function () {
      clearTimeout(leaveTimer);
    });
    dropdowns[d].addEventListener('mouseleave', function () {
      clearTimeout(enterTimer);
      leaveTimer = setTimeout(function () { closeAll(false); }, HOVER_LEAVE);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll(false);
      if (overlay && overlay.classList.contains('open')) closeMobile();
    }
  });

  // Close on click outside nav
  document.addEventListener('click', function (e) {
    if (activeItem && !nav.contains(e.target)) closeAll(false);
  });

  /* ═══════════════════════════════════════════
     SCROLL STATE — frosted glass nav bg
     ═══════════════════════════════════════════ */
  var ticking = false;

  function onScroll() {
    if (window.scrollY > SCROLL_TOP) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  onScroll(); // initial check

  /* ═══════════════════════════════════════════
     MOBILE — Burger Toggle
     ═══════════════════════════════════════════ */
  function openMobile() {
    burger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    burger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burger && overlay) {
    burger.addEventListener('click', function () {
      burger.classList.contains('open') ? closeMobile() : openMobile();
    });

    // Close when tapping a link in mobile overlay
    var mobileLinks = overlay.querySelectorAll('a');
    for (var m = 0; m < mobileLinks.length; m++) {
      mobileLinks[m].addEventListener('click', closeMobile);
    }
  }

  /* ═══════════════════════════════════════════
     MOBILE — City Accordion
     ═══════════════════════════════════════════ */
  if (accordion && accBody) {
    accordion.addEventListener('click', function () {
      accordion.classList.toggle('is-open');
      accBody.classList.toggle('is-open');
    });
  }

})();
