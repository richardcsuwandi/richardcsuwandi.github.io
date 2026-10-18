// Highlight the sidebar link for the section currently in view on the homepage.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.profile-toc a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var sections = links
    .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      var on = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function atBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
  }

  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
    // The last section can be too short to reach the middle band, so pick it at the bottom of the page.
    if (atBottom()) { setActive(sections[sections.length - 1].id); return; }
    // Otherwise the first section (in page order) that is on screen wins.
    for (var i = 0; i < sections.length; i++) {
      if (visible[sections[i].id]) { setActive(sections[i].id); return; }
    }
  }, { rootMargin: '-20% 0px -55% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
  window.addEventListener('scroll', function () {
    if (atBottom()) setActive(sections[sections.length - 1].id);
  }, { passive: true });
  setActive(sections[0].id);
})();
