const savedTheme = localStorage.getItem("theme");
const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemDark ? "dark" : "light";
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
    window.setTimeout(() => {
      copyButton.textContent = original;
    }, 1600);
  });
}

const toc = document.querySelector(".paper-toc");
if (toc) {
  const heading = toc.querySelector("h3");
  const toggle = document.createElement("button");
  toggle.className = "toc-toggle";
  toggle.type = "button";
  toggle.textContent = "Contents";
  toggle.setAttribute("aria-expanded", "false");
  const label = document.createElement("span");
  label.className = "toc-desktop-label";
  label.textContent = heading.textContent;
  heading.replaceChildren(label, toggle);
  const media = window.matchMedia("(max-width: 1279px)");
  function setTocMode() {
    toc.dataset.collapsed = String(media.matches);
    toggle.setAttribute("aria-expanded", String(!media.matches));
    label.hidden = media.matches;
  }
  setTocMode();
  media.addEventListener("change", setTocMode);
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(expanded));
    toc.dataset.collapsed = String(!expanded);
  });
}
