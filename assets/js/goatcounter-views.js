/**
 * Fill elements with class "goatcounter-views" using GoatCounter's public JSON API.
 * Each element should have data-path="/blog/2025/slug/" (or omit to use location.pathname).
 * Counts are cached by GoatCounter for up to ~4 hours.
 */
(function () {
  const code = window.GOATCOUNTER_CODE;
  if (!code) return;

  const endpoint = (path) =>
    `https://${code}.goatcounter.com/counter/${encodeURIComponent(path)}.json`;

  const normalizePaths = (path) => {
    if (!path) return [];
    const paths = [path];
    // GoatCounter sometimes records with/without a trailing slash.
    if (path.length > 1 && path.endsWith("/")) {
      paths.push(path.slice(0, -1));
    } else if (path.length > 1) {
      paths.push(path + "/");
    }
    return paths;
  };

  async function fetchCount(path) {
    for (const candidate of normalizePaths(path)) {
      try {
        const res = await fetch(endpoint(candidate));
        if (!res.ok) continue;
        const data = await res.json();
        if (data && data.count != null) return data.count;
      } catch (_) {
        // try next candidate
      }
    }
    return null;
  }

  async function fill(el) {
    const path = el.getAttribute("data-path") || window.location.pathname;
    const count = await fetchCount(path);
    if (count == null) {
      el.textContent = "—";
      el.classList.add("goatcounter-views--missing");
      return;
    }
    el.textContent = count;
    el.classList.add("goatcounter-views--ready");
  }

  function init() {
    const els = document.querySelectorAll(".goatcounter-views");
    els.forEach((el) => fill(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
