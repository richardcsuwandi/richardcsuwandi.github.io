// Native adaptations of Motion Primitives' In View and Spotlight patterns.
// Content stays visible in the document, including when JavaScript is unavailable.
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var runningAnimations = new Set();

  function initCardGlow() {
    var selector = '.opensource-card, .service-card, .media-card, .blog-post-card-horizontal';
    document.addEventListener('pointermove', function (event) {
      if (reducedMotion.matches || !finePointer.matches) return;
      var target = event.target.closest ? event.target.closest(selector) : null;
      if (!target) return;
      var rect = target.getBoundingClientRect();
      target.style.setProperty('--glow-x', ((event.clientX - rect.left) / rect.width) * 100 + '%');
      target.style.setProperty('--glow-y', ((event.clientY - rect.top) / rect.height) * 100 + '%');
      target.classList.add('glow-active');
    });

    document.addEventListener('pointerout', function (event) {
      var target = event.target.closest ? event.target.closest(selector) : null;
      if (!target || (event.relatedTarget && target.contains(event.relatedTarget))) return;
      target.classList.remove('glow-active');
    });
  }

  function initScrollReveal() {
    if (reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

    var observer = new IntersectionObserver(function (entries) {
      var stagger = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // Keyboard navigation should never wait for a reveal.
        if (reducedMotion.matches || entry.target.contains(document.activeElement)) return;
        var animation = entry.target.animate(
          [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 380, delay: Math.min(stagger++ * 45, 135), easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
        );
        runningAnimations.add(animation);
        animation.onfinish = animation.oncancel = function () { runningAnimations.delete(animation); };
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      '.post article > h2, .opensource-card, .service-card, .media-card, .blog-post-card-horizontal'
    ).forEach(function (element) {
      var rect = element.getBoundingClientRect();
      // Preserve the initial viewport. Only animate content reached by scrolling.
      if (rect.top >= window.innerHeight) observer.observe(element);
    });

    document.addEventListener('focusin', function (event) {
      runningAnimations.forEach(function (animation) {
        if (animation.effect.target.contains(event.target)) animation.cancel();
      });
    });
  }

  reducedMotion.addEventListener('change', function () {
    if (!reducedMotion.matches) return;
    runningAnimations.forEach(function (animation) { animation.cancel(); });
    document.querySelectorAll('.glow-active').forEach(function (element) {
      element.classList.remove('glow-active');
    });
  });

  function init() {
    initCardGlow();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
