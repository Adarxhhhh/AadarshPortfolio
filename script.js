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

const sprinkleThemeSparkles = () => {
  if (reduceMotion.matches) return;

  const layer = ensureSparkleLayer();
  const w = window.innerWidth;
  const h = window.innerHeight;

  const count = w < 640 ? 45 : 70;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "sparkle-star";

    const x = Math.random() * w;
    const y = Math.random() * h;

    const size = 3 + Math.random() * 5; // tiny sparkles
    const delay = Math.random() * 180;
    const dur = 750 + Math.random() * 650;

    const tx = (Math.random() - 0.5) * 80;
    const ty = 40 + Math.random() * 140;

    const rot = Math.floor(Math.random() * 360);

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.setProperty("--size", `${size}px`);
    star.style.setProperty("--delay", `${delay}ms`);
    star.style.setProperty("--dur", `${dur}ms`);
    star.style.setProperty("--tx", `${tx}px`);
    star.style.setProperty("--ty", `${ty}px`);
    star.style.setProperty("--rot", `${rot}deg`);

    layer.appendChild(star);
    star.addEventListener("animationend", () => star.remove());
  }
};

// Theme init
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(prefersDark.matches ? "dark" : "light");
}

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    sprinkleThemeSparkles();
  });
}

// OS theme change (only if user hasn't chosen manually)
prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

// Smooth in-page navigation
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

// Education flip cards
const flipCards = document.querySelectorAll(".flip-card");
flipCards.forEach((card) => {
  const toggleFlip = () => {
    card.classList.toggle("is-flipped");
    const pressed = card.getAttribute("aria-pressed") === "true";
    card.setAttribute("aria-pressed", String(!pressed));
  };

  card.addEventListener("click", toggleFlip);

  // Optional: Escape to flip back when focused
  card.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && card.classList.contains("is-flipped")) {
      e.preventDefault();
      toggleFlip();
    }
  });
});
