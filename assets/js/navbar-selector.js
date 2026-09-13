// Shared moving background for navbar links and profile contact actions.
(function () {
  function attachSelector(track, linkSelector, activeSelector) {
    if (!track) return;
    var links = Array.from(track.querySelectorAll(linkSelector));
    if (!links.length) return;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var highlight = document.createElement(track.tagName === 'UL' ? 'li' : 'span');
    highlight.className = 'nav-selector-highlight';
    highlight.setAttribute('aria-hidden', 'true');
    highlight.setAttribute('role', 'presentation');
    track.appendChild(highlight);

    function move(link) {
      if (!link || !link.getClientRects().length) {
        highlight.style.opacity = '0';
        return;
      }
      var parent = track.getBoundingClientRect();
      var rect = link.getBoundingClientRect();
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
      highlight.style.transform = 'translate(' + (rect.left - parent.left - track.clientLeft) + 'px, ' + (rect.top - parent.top - track.clientTop) + 'px)';
      highlight.style.opacity = '1';
    }

    function reset() {
      var focused = links.find(function (link) { return link === document.activeElement; });
      move(focused || (activeSelector ? track.querySelector(activeSelector) : null));
    }

    links.forEach(function (link) {
      link.addEventListener('pointerenter', function () {
        if (finePointer.matches) move(link);
      });
      link.addEventListener('focus', function () { move(link); });
    });
    track.addEventListener('pointerleave', reset);
    track.addEventListener('focusout', function () { requestAnimationFrame(reset); });
    window.addEventListener('resize', reset);
    if ('ResizeObserver' in window) new ResizeObserver(reset).observe(track);
    if (document.fonts) document.fonts.ready.then(reset);
    reset();
    track.classList.add('selector-ready');
  }
  function init() {
    attachSelector(document.querySelector('#navbar .navbar-nav'), '.nav-link', '.nav-item.active > .nav-link');
    document.querySelectorAll('.profile-actions').forEach(function (track) {
      attachSelector(track, '.profile-action');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
