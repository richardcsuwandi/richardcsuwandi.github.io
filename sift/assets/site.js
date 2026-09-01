const savedTheme = localStorage.getItem("theme");
const systemDark = window.matchMedia
  ? window.matchMedia("(prefers-color-scheme: dark)").matches
  : false;
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

function scrollToBottom(screen) {
  screen.scrollTop = screen.scrollHeight;
}

function appendCliLine(screen, className, html) {
  const p = document.createElement("p");
  if (className) p.className = className;
  p.innerHTML = html;
  screen.appendChild(p);
  scrollToBottom(screen);
  return p;
}

function typeCliCommand(screen, command, done) {
  const p = document.createElement("p");
  p.innerHTML = '<span class="cli-prompt">›</span> <span class="cli-typed"></span><span class="cli-cursor"></span>';
  screen.appendChild(p);
  const typed = p.querySelector(".cli-typed");
  const cursor = p.querySelector(".cli-cursor");
  let i = 0;
  (function step() {
    if (i <= command.length) {
      typed.textContent = command.slice(0, i);
      i += 1;
      scrollToBottom(screen);
      window.setTimeout(step, 28);
    } else {
      cursor.remove();
      window.setTimeout(done, 400);
    }
  })();
}

const demoScreen = document.querySelector("[data-cli-demo]");
const replayButton = document.querySelector("[data-cli-replay]");
const demoTabs = document.querySelectorAll("[data-demo-tab]");

const demoScripts = {
  find: {
    ready: "269 files indexed",
    cmd: "where is my March invoice?",
    run: function (screen) {
      appendCliLine(screen, "cli-answer", "The paid Northstar invoice is in <b>scan_0042.pdf</b>. Total: $106.92.");
      appendCliLine(screen, "cli-result", "[1] scan_0042.pdf<br><span>/Users/you/Downloads/scan_0042.pdf</span>");
    }
  },
  vision: {
    ready: "269 files indexed, 41 images read",
    cmd: "find the screenshot with the error message",
    run: function (screen) {
      appendCliLine(screen, "cli-answer", "The failed build log is in <b>screenshot_2026-01-14.png</b>, showing a red stack trace.");
      appendCliLine(screen, "cli-result", "[1] screenshot_2026-01-14.png<br><span>/Users/you/Downloads/screenshot_2026-01-14.png</span>");
    }
  },
  organize: {
    ready: "269 files indexed",
    cmd: "/organize",
    run: function (screen) {
      appendCliLine(screen, "cli-plan", "38 proposed changes &nbsp; <span>ORGANIZE</span>");
      appendCliLine(screen, "cli-answer", "Invoices/ &middot; Screenshots/ &middot; Papers/ &middot; Software/");
    }
  },
  review: {
    ready: "269 files indexed",
    cmd: "move installers into Software",
    run: function (screen) {
      appendCliLine(screen, "cli-plan", "3 proposed changes &nbsp; <span>MOVE</span>");
      appendCliLine(screen, "cli-review", "Apply 3 selected changes? <b>[y]</b> yes · <b>[n]</b> no · <b>[t N]</b> toggle · <b>[e N]</b> edit");
      window.setTimeout(function () {
        appendCliLine(screen, "cli-answer", "Applied. Type <code>/undo</code> to restore the previous state, including files sent to the Trash.");
      }, 900);
    }
  }
};

let activeDemo = "find";

function playCliDemo(name) {
  if (!demoScreen) return;
  const script = demoScripts[name] || demoScripts.find;
  activeDemo = name && demoScripts[name] ? name : "find";
  demoScreen.innerHTML = "";
  const wordmark = document.createElement("img");
  wordmark.className = "cli-wordmark";
  wordmark.src = "assets/figures/sift-cli-wordmark.svg";
  wordmark.alt = "Sift";
  demoScreen.appendChild(wordmark);
  const meta = document.createElement("div");
  meta.className = "cli-meta";
  meta.innerHTML = "<span>folder</span> /Users/you/Downloads<br><span>chat</span> qwen3:4b<br><span>index</span> 269 files";
  demoScreen.appendChild(meta);
  appendCliLine(demoScreen, "cli-ready", "<b>Ready.</b> " + script.ready);
  typeCliCommand(demoScreen, script.cmd, function () {
    script.run(demoScreen);
  });
}

if (demoScreen) {
  if (window.IntersectionObserver) {
    const demoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          playCliDemo(activeDemo);
          demoObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    demoObserver.observe(demoScreen);
  }
}

if (replayButton) {
  replayButton.addEventListener("click", function () { playCliDemo(activeDemo); });
}

demoTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    demoTabs.forEach(function (t) { t.classList.remove("is-active"); });
    tab.classList.add("is-active");
    playCliDemo(tab.getAttribute("data-demo-tab"));
  });
});

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

const liveScreen = document.querySelector("[data-cli-live]");
const liveInput = document.querySelector("[data-cli-live-input]");
const liveHints = document.querySelectorAll("[data-cli-live-hint]");

const liveResponses = [
  { match: /summarize|summary/i, run: function () { appendCliLine(liveScreen, "cli-answer", "This folder holds 269 files across six broad groups: papers, invoices, screenshots, installers, code, and media. About a third look like duplicates or old installers."); } },
  { match: /space|large|biggest/i, run: function () { appendCliLine(liveScreen, "cli-answer", "The largest items are three .dmg installers (4.1 GB total) and a video export in <b>Exports/</b> (1.8 GB)."); } },
  { match: /roadmap|mention/i, run: function () {
    appendCliLine(liveScreen, "cli-answer", "<b>roadmap.pdf</b> mentions this twice, both under “Windows support timeline.”");
    appendCliLine(liveScreen, "cli-result", "[1] roadmap.pdf<br><span>/Users/you/Downloads/roadmap.pdf</span>");
  } },
  { match: /rename|screenshot/i, run: function () { appendCliLine(liveScreen, "cli-plan", "12 proposed changes &nbsp; <span>RENAME</span>"); } },
  { match: /duplicate|trash/i, run: function () { appendCliLine(liveScreen, "cli-plan", "5 proposed changes &nbsp; <span>TRASH</span>"); } },
  { match: /undo/i, run: function () { appendCliLine(liveScreen, "cli-answer", "Last batch restored. Files moved back to where they were."); } },
  { match: /help/i, run: function () { appendCliLine(liveScreen, "cli-answer", "Try: /scan, /organize, /plan, /apply, /undo, /model, /status, /reveal, /clear, /exit"); } }
];

function runLiveCommand(command) {
  if (!liveScreen || !command.trim()) return;
  appendCliLine(liveScreen, "", '<span class="cli-prompt">›</span> ' + escapeHtml(command));
  window.setTimeout(function () {
    const matched = liveResponses.find(function (r) { return r.match.test(command); });
    if (matched) {
      matched.run();
    } else {
      appendCliLine(liveScreen, "cli-answer", "Searching for the closest match to “" + escapeHtml(command) + "” and showing the file as evidence.");
    }
  }, 260);
}

if (liveInput) {
  liveInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const value = liveInput.value;
      liveInput.value = "";
      runLiveCommand(value);
    }
  });
}

liveHints.forEach(function (btn) {
  btn.addEventListener("click", function () {
    runLiveCommand(btn.getAttribute("data-cli-live-hint"));
    if (liveInput) liveInput.focus();
  });
});

const copyButton = document.querySelector("[data-copy-bibtex]");
const bibtex = document.querySelector("[data-bibtex]");

if (copyButton && bibtex && navigator.clipboard) {
  copyButton.addEventListener("click", async () => {
    const original = copyButton.textContent;
    try {
      await navigator.clipboard.writeText(bibtex.textContent.trim());
      copyButton.textContent = "Copied";
    } catch (error) {
      copyButton.textContent = "Select to copy";
    }
    window.setTimeout(() => { copyButton.textContent = original; }, 1600);
  });
}
