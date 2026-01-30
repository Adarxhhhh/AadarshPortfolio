const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";
};

const ensureSparkleLayer = () => {
  let layer = document.querySelector(".sparkle-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "sparkle-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
  }
  return layer;
};

const pulseToggle = () => {
  if (!themeToggle || reduceMotion.matches) return;

  const sparkle = document.createElement("span");
  sparkle.classList.add("sparkle");
  themeToggle.appendChild(sparkle);
  sparkle.addEventListener("animationend", () => sparkle.remove());
};

const burstSparkles = () => {
  if (!themeToggle || reduceMotion.matches) return;

  const layer = ensureSparkleLayer();
  const rect = themeToggle.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const count = 22;

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "sparkle-particle";

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 180;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const size = 6 + Math.random() * 10;
    const delay = Math.random() * 120;
    const dur = 650 + Math.random() * 450;

    s.style.left = `${originX}px`;
    s.style.top = `${originY}px`;
    s.style.setProperty("--tx", `${tx}px`);
    s.style.setProperty("--ty", `${ty}px`);
    s.style.setProperty("--size", `${size}px`);
    s.style.setProperty("--delay", `${delay}ms`);
    s.style.setProperty("--dur", `${dur}ms`);

    layer.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
};

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(prefersDark.matches ? "dark" : "light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    pulseToggle();
    burstSparkles();
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
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
