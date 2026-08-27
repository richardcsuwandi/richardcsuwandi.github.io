// Clamp about-page Research / Projects lists so a few items (or rows) stay
// visible and the rest scroll inside the section.
(function () {
  function heightToElement(container, el) {
    var cRect = container.getBoundingClientRect();
    var eRect = el.getBoundingClientRect();
    var style = window.getComputedStyle(el);
    var marginBottom = parseFloat(style.marginBottom) || 0;
    return eRect.bottom - cRect.top + container.scrollTop + marginBottom;
  }

  function clampByCount(container, selector, count) {
    var items = container.querySelectorAll(selector);
    if (items.length <= count) {
      container.style.maxHeight = "";
      return;
    }
    container.style.maxHeight = heightToElement(container, items[count - 1]) + "px";
  }

  function clampByRows(container, selector, rows) {
    var items = container.querySelectorAll(selector);
    if (!items.length) return;

    var lastInView = items[0];
    var rowTop = items[0].offsetTop;
    var row = 1;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.offsetTop > rowTop + 2) {
        row += 1;
        rowTop = item.offsetTop;
        if (row > rows) break;
      }
      lastInView = item;
    }

    if (row <= rows && lastInView === items[items.length - 1]) {
      container.style.maxHeight = "";
      return;
    }

    container.style.maxHeight = heightToElement(container, lastInView) + "px";
  }

  function apply() {
    document.querySelectorAll(".about-scroll[data-scroll-items]").forEach(function (el) {
      var count = parseInt(el.getAttribute("data-scroll-items"), 10);
      var selector = el.getAttribute("data-scroll-selector") || ".blog-post-card-horizontal";
      if (count > 0) clampByCount(el, selector, count);
    });

    document.querySelectorAll(".about-scroll[data-scroll-rows]").forEach(function (el) {
      var rows = parseInt(el.getAttribute("data-scroll-rows"), 10);
      var selector = el.getAttribute("data-scroll-selector") || ".opensource-card";
      if (rows > 0) clampByRows(el, selector, rows);
    });
  }

  var resizeTimer;
  var applying = false;
  function applyDebounced() {
    if (applying) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      applying = true;
      apply();
      applying = false;
    }, 120);
  }

  function setupObservers() {
    if (typeof ResizeObserver === "undefined") return;
    var observer = new ResizeObserver(applyDebounced);
    document.querySelectorAll(".about-scroll").forEach(function (el) {
      Array.prototype.forEach.call(el.children, function (child) {
        observer.observe(child);
      });
    });
  }

  function start() {
    apply();
    setupObservers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", apply);
  window.addEventListener("resize", applyDebounced);
})();
