const root = document.documentElement;
const toggleButton = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeToggle = document.querySelector(".theme-toggle");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
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
    if (themeToggle) {
      const sparkle = document.createElement("span");
      sparkle.classList.add("sparkle");
      themeToggle.appendChild(sparkle);
      sparkle.addEventListener("animationend", () => {
        sparkle.remove();
      });
    }
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
