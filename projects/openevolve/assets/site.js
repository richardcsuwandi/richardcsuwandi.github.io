const savedTheme = localStorage.getItem("theme");
const systemDark = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
const initialTheme = savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : (systemDark ? "dark" : "light");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle && themeIcon) {
    const next = theme === "dark" ? "light" : "dark";
    themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
    themeToggle.title = `Switch to ${next} mode`;
  }
}

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

const copyButton = document.querySelector("[data-copy-bibtex]");
const bibtex = document.querySelector("[data-bibtex]");

if (copyButton && bibtex && navigator.clipboard) {
  copyButton.addEventListener("click", async () => {
    const original = copyButton.textContent;
    try {
      await navigator.clipboard.writeText(bibtex.textContent.trim());
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Select to copy";
    }
    window.setTimeout(() => { copyButton.textContent = original; }, 1600);
  });
}
