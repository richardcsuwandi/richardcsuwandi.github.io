(function () {
  'use strict';

  var REVEAL_SELECTORS = [
    '.post-header',
    '.profile',
    '.post article h2',
    '.news .news-item',
    '.post-list li',
    '.card',
    '.media-card',
    '.service-card',
    '.publications ol.bibliography > li',
  ];

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function enableRevealAnimations() {
    if (prefersReducedMotion()) return;

    document.body.classList.add('reveal-js-enabled');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    REVEAL_SELECTORS.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el, i) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          // Stagger siblings of same type
          var delay = Math.min(i * 60, 360);
          el.style.transitionDelay = delay + 'ms';
        }
        observer.observe(el);
      });
    });
  }

  function init() {
    if (typeof IntersectionObserver === 'undefined') return;
    enableRevealAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
