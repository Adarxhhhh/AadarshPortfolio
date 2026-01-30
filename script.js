const root = document.documentElement;
const toggleButton = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }
  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }
};

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(prefersDark.matches ? "dark" : "light");
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
