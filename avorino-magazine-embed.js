/*
  Avorino Magazine Embed
  Injects FlipHTML5 magazine sections into pages.
  Usage — add TWO script tags to footer code:

  1. Config (inline):
    <script>
    window.__avMagazines = [{
      url: "https://online.fliphtml5.com/avorino/...",
      title: "Magazine Title",
      heading: "Section Heading",
      desc: "Description text.",
      insert: "before-cta"
    }];
    </script>

  2. This script (external):
    <script src="...avorino-magazine-embed.js"></script>

  No other dependencies.
*/
(function () {
  'use strict';

  var configs = window.__avMagazines;
  if (!configs || !configs.length) return;

  configs.forEach(function (cfg) {
    var url = cfg.url;
    var title = cfg.title || 'Magazine';
    var heading = cfg.heading || 'Explore Our Magazine';
    var desc = cfg.desc || '';
    var insertMode = cfg.insert || 'before-cta';

    if (!url) return;

    /* ── Build the section ── */
    var section = document.createElement('section');
    section.className = 'av-magazine';
    section.innerHTML =
      '<div class="av-magazine-inner">' +
        '<div class="av-magazine-header">' +
          '<div class="av-magazine-label">// Magazine</div>' +
          '<h2 class="av-magazine-heading">' + heading + '</h2>' +
          (desc ? '<p class="av-magazine-desc">' + desc + '</p>' : '') +
        '</div>' +
        '<div class="av-magazine-frame">' +
          '<div class="av-magazine-overlay" data-el="magazine-overlay">' +
            '<div class="av-magazine-overlay-content">' +
              '<div class="av-magazine-overlay-icon">' +
                '<svg width="48" height="48" viewBox="0 0 48 48" fill="none">' +
                  '<rect x="6" y="8" width="36" height="32" rx="3" stroke="rgba(201,169,110,0.6)" stroke-width="1.5"/>' +
                  '<path d="M6 16h36" stroke="rgba(201,169,110,0.3)" stroke-width="1"/>' +
                  '<path d="M24 16v24" stroke="rgba(201,169,110,0.2)" stroke-width="1"/>' +
                  '<path d="M15 24h-3M15 28h-3M15 32h-3" stroke="rgba(201,169,110,0.3)" stroke-width="1" stroke-linecap="round"/>' +
                  '<path d="M33 24h3M33 28h3M33 32h3" stroke="rgba(201,169,110,0.3)" stroke-width="1" stroke-linecap="round"/>' +
                '</svg>' +
              '</div>' +
              '<span class="av-magazine-overlay-title">' + title + '</span>' +
              '<span class="av-magazine-overlay-cta">Click to explore magazine</span>' +
              '<span class="av-magazine-overlay-hint">Use arrows or swipe to flip pages</span>' +
            '</div>' +
          '</div>' +
          '<div class="av-magazine-close" data-el="magazine-close" style="display:none;">✕ Back to page</div>' +
          '<iframe class="av-magazine-iframe" src="" data-src="' + url + '" title="' + title + '" allowfullscreen style="pointer-events:none;"></iframe>' +
        '</div>' +
      '</div>';

    /* ── Insert into page ── */
    var target = null;
    if (insertMode === 'before-cta') {
      target = document.querySelector('.av-cta, [class*="cta-section"], section:last-of-type');
    } else if (insertMode === 'after-hero') {
      target = document.querySelector('[id*="hero"]');
      if (target) target = target.nextElementSibling;
    } else {
      target = document.querySelector('footer') || document.body.lastElementChild;
    }

    if (target && target.parentNode) {
      target.parentNode.insertBefore(section, target);
    } else {
      document.body.appendChild(section);
    }

    /* ── Interaction logic ── */
    var overlay = section.querySelector('[data-el="magazine-overlay"]');
    var closeBtn = section.querySelector('[data-el="magazine-close"]');
    var iframe = section.querySelector('.av-magazine-iframe');
    var frame = section.querySelector('.av-magazine-frame');
    var isActive = false;

    function activateMagazine() {
      if (isActive) return;
      isActive = true;
      /* Load iframe src on first click (lazy) */
      if (!iframe.src || iframe.src === '' || iframe.src === window.location.href) {
        iframe.src = iframe.getAttribute('data-src');
      }
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(function () { overlay.style.display = 'none'; }, 400);
      iframe.style.pointerEvents = 'auto';
      closeBtn.style.display = 'flex';
      frame.classList.add('av-magazine-frame--active');
      /* Pause Lenis so page doesn't scroll while interacting */
      if (window.__lenis) window.__lenis.stop();
    }

    function deactivateMagazine() {
      if (!isActive) return;
      isActive = false;
      overlay.style.display = 'flex';
      setTimeout(function () {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }, 50);
      iframe.style.pointerEvents = 'none';
      closeBtn.style.display = 'none';
      frame.classList.remove('av-magazine-frame--active');
      if (window.__lenis) window.__lenis.start();
    }

    overlay.addEventListener('click', activateMagazine);
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      deactivateMagazine();
    });

    /* ESC key exits */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isActive) deactivateMagazine();
    });
  });

  /* ── Inject styles (once) ── */
  if (document.getElementById('av-magazine-styles')) return;
  var style = document.createElement('style');
  style.id = 'av-magazine-styles';
  style.textContent =
    '.av-magazine {' +
      'padding: 128px 80px;' +
      'background-color: #111111;' +
      'color: #f0ede8;' +
      'position: relative;' +
      'overflow: hidden;' +
    '}' +
    '.av-magazine-inner {' +
      'max-width: 1280px;' +
      'margin: 0 auto;' +
    '}' +
    '.av-magazine-header {' +
      'margin-bottom: 64px;' +
    '}' +
    '.av-magazine-label {' +
      'font-family: "DM Sans", system-ui, sans-serif;' +
      'font-size: 13px;' +
      'font-weight: 400;' +
      'letter-spacing: 0.3em;' +
      'text-transform: uppercase;' +
      'color: #f0ede8;' +
      'opacity: 0.35;' +
      'margin-bottom: 28px;' +
    '}' +
    '.av-magazine-heading {' +
      'font-family: "DM Serif Display", Georgia, serif;' +
      'font-size: clamp(32px, 3.5vw, 56px);' +
      'font-weight: 400;' +
      'line-height: 1.12;' +
      'letter-spacing: -0.02em;' +
      'color: #f0ede8;' +
      'margin-bottom: 16px;' +
    '}' +
    '.av-magazine-desc {' +
      'font-family: "DM Sans", system-ui, sans-serif;' +
      'font-size: 18px;' +
      'line-height: 1.7;' +
      'color: #f0ede8;' +
      'opacity: 0.5;' +
      'max-width: 560px;' +
    '}' +
    /* Frame container */
    '.av-magazine-frame {' +
      'position: relative;' +
      'width: 100%;' +
      'height: 85vh;' +
      'min-height: 600px;' +
      'border-radius: 16px;' +
      'overflow: hidden;' +
      'border: 1px solid rgba(201, 169, 110, 0.1);' +
      'background-color: #0a0a0a;' +
      'box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 169, 110, 0.06);' +
      'transition: border-color 0.4s ease, box-shadow 0.4s ease;' +
    '}' +
    '.av-magazine-frame--active {' +
      'border-color: rgba(201, 169, 110, 0.25);' +
      'box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 169, 110, 0.08), inset 0 1px 0 rgba(201, 169, 110, 0.1);' +
    '}' +
    /* Overlay */
    '.av-magazine-overlay {' +
      'position: absolute;' +
      'inset: 0;' +
      'z-index: 3;' +
      'display: flex;' +
      'align-items: center;' +
      'justify-content: center;' +
      'background: radial-gradient(ellipse at center, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 0.92) 100%);' +
      'cursor: pointer;' +
      'transition: opacity 0.4s ease;' +
    '}' +
    '.av-magazine-overlay:hover .av-magazine-overlay-cta {' +
      'color: rgba(201, 169, 110, 1);' +
      'gap: 10px;' +
    '}' +
    '.av-magazine-overlay:hover .av-magazine-overlay-icon svg {' +
      'transform: scale(1.08);' +
    '}' +
    '.av-magazine-overlay-content {' +
      'display: flex;' +
      'flex-direction: column;' +
      'align-items: center;' +
      'gap: 16px;' +
      'text-align: center;' +
    '}' +
    '.av-magazine-overlay-icon {' +
      'margin-bottom: 8px;' +
    '}' +
    '.av-magazine-overlay-icon svg {' +
      'transition: transform 0.3s ease;' +
    '}' +
    '.av-magazine-overlay-title {' +
      'font-family: "DM Serif Display", Georgia, serif;' +
      'font-size: 28px;' +
      'color: #f0ede8;' +
      'opacity: 0.9;' +
    '}' +
    '.av-magazine-overlay-cta {' +
      'font-family: "DM Sans", system-ui, sans-serif;' +
      'font-size: 14px;' +
      'font-weight: 500;' +
      'letter-spacing: 0.1em;' +
      'text-transform: uppercase;' +
      'color: rgba(201, 169, 110, 0.75);' +
      'display: inline-flex;' +
      'align-items: center;' +
      'gap: 6px;' +
      'transition: color 0.3s ease, gap 0.3s ease;' +
    '}' +
    '.av-magazine-overlay-hint {' +
      'font-family: "DM Sans", system-ui, sans-serif;' +
      'font-size: 12px;' +
      'color: #f0ede8;' +
      'opacity: 0.25;' +
      'margin-top: 4px;' +
    '}' +
    /* Close button */
    '.av-magazine-close {' +
      'position: absolute;' +
      'top: 16px;' +
      'right: 20px;' +
      'z-index: 4;' +
      'font-family: "DM Sans", system-ui, sans-serif;' +
      'font-size: 13px;' +
      'font-weight: 500;' +
      'letter-spacing: 0.06em;' +
      'color: rgba(201, 169, 110, 0.7);' +
      'background: rgba(17, 17, 17, 0.85);' +
      'backdrop-filter: blur(8px);' +
      '-webkit-backdrop-filter: blur(8px);' +
      'padding: 8px 16px;' +
      'border-radius: 100px;' +
      'border: 1px solid rgba(201, 169, 110, 0.12);' +
      'cursor: pointer;' +
      'display: flex;' +
      'align-items: center;' +
      'gap: 6px;' +
      'transition: color 0.3s ease, border-color 0.3s ease;' +
    '}' +
    '.av-magazine-close:hover {' +
      'color: rgba(201, 169, 110, 1);' +
      'border-color: rgba(201, 169, 110, 0.3);' +
    '}' +
    /* Iframe */
    '.av-magazine-iframe {' +
      'width: 100%;' +
      'height: 100%;' +
      'border: none;' +
      'display: block;' +
    '}' +
    /* Responsive */
    '@media (max-width: 767px) {' +
      '.av-magazine { padding: 80px 24px; }' +
      '.av-magazine-frame { height: 75vh; min-height: 500px; border-radius: 12px; }' +
      '.av-magazine-overlay-title { font-size: 22px; }' +
    '}' +
    '@media (max-width: 478px) {' +
      '.av-magazine { padding: 64px 16px; }' +
      '.av-magazine-frame { height: 70vh; min-height: 450px; }' +
    '}';

  document.head.appendChild(style);
})();
