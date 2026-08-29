// Clamp Research page paragraphs to 3 lines with an inline "read more..."
// control, matching the gray "N more authors" toggle on publication cards.

(function () {
  var LINES = 3;

  function lineHeightPx(el) {
    var styles = window.getComputedStyle(el);
    var lh = styles.lineHeight;
    var fs = parseFloat(styles.fontSize);
    if (lh === "normal") {
      return fs * 1.5;
    }
    if (lh.slice(-2) === "px") {
      return parseFloat(lh);
    }
    return parseFloat(lh) * fs;
  }

  function overflowHeight(p) {
    return p.scrollHeight - lineHeightPx(p) * LINES;
  }

  function isOverflowing(p) {
    return overflowHeight(p) > 2;
  }

  function applyClampHeight(wrap, p) {
    wrap.style.setProperty("--clamp-height", lineHeightPx(p) * LINES + "px");
  }

  function expand(wrap, btn) {
    wrap.classList.remove("is-clamped");
    wrap.classList.add("is-expanded");
    wrap.style.removeProperty("--clamp-height");
    btn.remove();
  }

  function enhance(p) {
    if (p.closest(".research-pubs") || p.closest(".research-clamp")) {
      return;
    }
    if (!isOverflowing(p)) {
      return;
    }

    var wrap = document.createElement("div");
    wrap.className = "research-clamp is-clamped";
    p.parentNode.insertBefore(wrap, p);
    wrap.appendChild(p);
    applyClampHeight(wrap, p);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "research-clamp-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "read more...";
    btn.addEventListener("click", function () {
      expand(wrap, btn);
    });
    wrap.appendChild(btn);
  }

  function init() {
    var nodes = document.querySelectorAll(".post article > p");
    nodes.forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
