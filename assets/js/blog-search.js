// Blog listing: keyword search + tag filter.
(function () {
  var toolbar = document.querySelector(".blog-toolbar");
  if (!toolbar) return;

  var searchInput = document.getElementById("blog-search-input");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".blog-post-card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".blog-filter-chip"));
  var empty = document.getElementById("no-posts-found-message");
  var featured = document.querySelector(".featured-posts");
  var featuredRule = featured ? featured.nextElementSibling : null;

  var state = {
    mode: toolbar.getAttribute("data-mode") || "search",
    query: "",
    tags: []
  };

  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function unique(list) {
    var out = [];
    list.forEach(function (item) {
      if (item && out.indexOf(item) === -1) out.push(item);
    });
    return out;
  }

  function parseUrl() {
    var params = new URLSearchParams(window.location.search);
    state.query = params.get("q") || "";
    state.tags = unique(params.getAll("tag"));
    if (state.query) state.mode = "search";
    else if (state.tags.length) state.mode = "filter";
  }

  function writeUrl() {
    var params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    state.tags.forEach(function (tag) {
      params.append("tag", tag);
    });
    var qs = params.toString();
    var next = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
    window.history.replaceState({}, "", next);
  }

  function setMode(mode, opts) {
    state.mode = mode;
    toolbar.setAttribute("data-mode", mode);
    toolbar.querySelectorAll(".blog-mode-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-mode") === mode);
    });
    toolbar.querySelectorAll(".blog-toolbar-panel").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== mode;
    });
    if (mode === "search" && searchInput && opts && opts.focus) {
      window.setTimeout(function () {
        searchInput.focus();
      }, 0);
    }
  }

  function cardVisible(card) {
    if (state.tags.length) {
      var tags = (card.getAttribute("data-tags") || "").split(",").filter(Boolean);
      var hit = state.tags.some(function (tag) {
        return tags.indexOf(tag) !== -1;
      });
      if (!hit) return false;
    }
    if (state.query) {
      var hay = normalize(card.getAttribute("data-search"));
      var words = normalize(state.query).split(" ").filter(Boolean);
      if (!words.every(function (word) { return hay.indexOf(word) !== -1; })) {
        return false;
      }
    }
    return true;
  }

  function apply() {
    var shown = 0;
    var featuredShown = 0;
    cards.forEach(function (card) {
      var on = cardVisible(card);
      card.style.display = on ? "" : "none";
      if (on) {
        shown += 1;
        if (featured && featured.contains(card)) featuredShown += 1;
      }
    });
    if (empty) empty.style.display = shown ? "none" : "block";
    if (featured) featured.style.display = featuredShown ? "" : "none";
    if (featuredRule && featuredRule.tagName === "HR") {
      featuredRule.style.display = featuredShown ? "" : "none";
    }
    chips.forEach(function (chip) {
      var active = state.tags.indexOf(chip.getAttribute("data-tag")) !== -1;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (searchInput && searchInput.value !== state.query) searchInput.value = state.query;
  }

  function toggleTag(slug) {
    if (!slug) return;
    var i = state.tags.indexOf(slug);
    if (i === -1) state.tags.push(slug);
    else state.tags.splice(i, 1);
    setMode("filter", { focus: false });
    writeUrl();
    apply();
  }

  toolbar.querySelectorAll(".blog-mode-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.getAttribute("data-mode"), { focus: true });
    });
  });

  if (searchInput) {
    var timer;
    searchInput.addEventListener("input", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        state.query = searchInput.value;
        writeUrl();
        apply();
      }, 80);
    });
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        searchInput.value = "";
        state.query = "";
        writeUrl();
        apply();
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      toggleTag(chip.getAttribute("data-tag"));
    });
  });

  document.querySelectorAll(".blog-post-card .tag-link[data-tag]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleTag(el.getAttribute("data-tag"));
    });
  });

  parseUrl();
  setMode(state.mode, { focus: false });
  apply();
})();
