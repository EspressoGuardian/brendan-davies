(function () {
  const storageKey = "hubsays-theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: light)");

  function labelFor(mode) {
    if (mode === "light") return "Theme: Light";
    if (mode === "dark") return "Theme: Dark";
    return "Theme: Auto";
  }

  function iconFor(mode) {
    if (mode === "light") return "☼";
    if (mode === "dark") return "☾";
    return "◐";
  }

  function currentMode() {
    const saved = localStorage.getItem(storageKey);
    return saved === "light" || saved === "dark" ? saved : "auto";
  }

  function themeButtons() {
    return Array.from(document.querySelectorAll("#theme-toggle, [data-theme-toggle]"));
  }

  function ensureGlobalButton() {
    if (document.querySelector('[data-theme-toggle="global"]')) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "global-theme-toggle";
    button.setAttribute("data-theme-toggle", "global");
    button.setAttribute("aria-label", "Toggle light and dark theme");
    document.body.appendChild(button);
  }

  function applyTheme(mode) {
    if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);
    else root.removeAttribute("data-theme");
    themeButtons().forEach((button) => {
      button.textContent = iconFor(mode);
      button.title = labelFor(mode);
      button.setAttribute("aria-label", labelFor(mode));
    });
  }

  function cycleTheme() {
    const mode = currentMode();
    const next = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    localStorage.setItem(storageKey, next);
    applyTheme(next);
  }

  function bindThemeButtons() {
    themeButtons().forEach((button) => {
      if (button.dataset.themeBound === "true") return;
      button.dataset.themeBound = "true";
      button.addEventListener("click", cycleTheme);
    });
  }

  function bindProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar || progressBar.dataset.progressBound === "true") return;
    progressBar.dataset.progressBound = "true";

    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      progressBar.style.width = value + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  function boot() {
    ensureGlobalButton();
    bindThemeButtons();
    applyTheme(currentMode());
    bindProgressBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  media.addEventListener("change", function () {
    if (currentMode() === "auto") {
      applyTheme("auto");
    }
  });
})();
