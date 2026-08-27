// Clamp about-page Research / Projects lists so a few items (or rows) stay
// visible and the rest scroll inside the section.
// Nested overflow regions trap the wheel at their edges; chain leftover
// delta to the page so scrolling can continue past the last (or first) item.
(function () {
  var NESTED_SCROLL_SELECTOR = ".about-scroll, .news-container, .awards-scrollable";
  var BOUNDARY = 1;

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

  function normalizeDeltaY(e) {
    if (e.deltaMode === 1) return e.deltaY * 16;
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
    return e.deltaY;
  }

  function scrollPageBy(deltaY) {
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    try {
      window.scrollBy({ top: deltaY, left: 0, behavior: "instant" });
    } catch (err) {
      window.scrollBy(0, deltaY);
    }
    html.style.scrollBehavior = prev;
  }

  function chainScroll(el, deltaY, event) {
    if (!deltaY) return false;
    var maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= BOUNDARY) {
      scrollPageBy(deltaY);
      if (event.cancelable) event.preventDefault();
      return true;
    }
    var next = el.scrollTop + deltaY;
    var clamped = Math.min(maxScroll, Math.max(0, next));
    var leftover = next - clamped;
    if (leftover === 0) return false;
    el.scrollTop = clamped;
    scrollPageBy(leftover);
    if (event.cancelable) event.preventDefault();
    return true;
  }

  function enableScrollChain(el) {
    if (el.dataset.scrollChain === "1") return;
    el.dataset.scrollChain = "1";

    el.addEventListener(
      "wheel",
      function (e) {
        if (e.ctrlKey || e.metaKey) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        chainScroll(el, normalizeDeltaY(e), e);
      },
      { passive: false }
    );

    var lastTouchY = 0;
    el.addEventListener(
      "touchstart",
      function (e) {
        if (!e.touches.length) return;
        lastTouchY = e.touches[0].clientY;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchmove",
      function (e) {
        if (!e.touches.length) return;
        var y = e.touches[0].clientY;
        var deltaY = lastTouchY - y;
        lastTouchY = y;
        chainScroll(el, deltaY, e);
      },
      { passive: false }
    );
  }

  function setupScrollChain() {
    document.querySelectorAll(NESTED_SCROLL_SELECTOR).forEach(enableScrollChain);
  }

  function start() {
    apply();
    setupObservers();
    setupScrollChain();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", apply);
  window.addEventListener("resize", applyDebounced);
})();
