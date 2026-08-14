var savedTheme = localStorage.getItem("theme");
var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
var initialTheme = savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : (systemDark ? "dark" : "light");
var themeToggle = document.querySelector("[data-theme-toggle]");
var themeIcon = document.querySelector("[data-theme-icon]");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle && themeIcon) {
    var next = theme === "dark" ? "light" : "dark";
    themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", "Switch to " + next + " mode");
    themeToggle.title = "Switch to " + next + " mode";
  }
}

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

var copyButton = document.querySelector("[data-copy-bibtex]");
var bibtex = document.querySelector("[data-bibtex]");

if (copyButton && bibtex && navigator.clipboard) {
  copyButton.addEventListener("click", function () {
    var original = copyButton.textContent;
    navigator.clipboard.writeText(bibtex.textContent.trim()).then(function () {
      copyButton.textContent = "Copied";
    }, function () {
      copyButton.textContent = "Select to copy";
    }).then(function () {
      window.setTimeout(function () {
        copyButton.textContent = original;
      }, 1600);
    });
  });
}
