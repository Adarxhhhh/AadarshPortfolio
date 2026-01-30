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

    const size = 3 + Math.random() * 5; // tiny
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

/* ===== Education flip cards (dynamic height) ===== */
const flipCards = document.querySelectorAll(".flip-card");

const measureFaceHeight = (card, faceSelector) => {
  const inner = card.querySelector(".flip-inner");
  const face = card.querySelector(faceSelector);
  if (!inner || !face) return 300;

  const width = inner.getBoundingClientRect().width || card.getBoundingClientRect().width || 320;

  const clone = face.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.pointerEvents = "none";
  clone.style.transform = "none";
  clone.style.inset = "auto";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = `${width}px`;
  clone.style.height = "auto";
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";
  clone.style.backfaceVisibility = "visible";

  document.body.appendChild(clone);
  const h = Math.ceil(clone.getBoundingClientRect().height);
  clone.remove();

  return Math.max(h, 260);
};

const computeAndStoreHeights = (card) => {
  const frontH = measureFaceHeight(card, ".flip-front");
  const backH = measureFaceHeight(card, ".flip-back");
  card.dataset.frontH = String(frontH);
  card.dataset.backH = String(backH);
};

const syncCardHeight = (card) => {
  const inner = card.querySelector(".flip-inner");
  if (!inner) return;

  const isFlipped = card.classList.contains("is-flipped");
  const frontH = Number(card.dataset.frontH || 300);
  const backH = Number(card.dataset.backH || 340);

  inner.style.setProperty("--cardH", `${isFlipped ? backH : frontH}px`);
};

flipCards.forEach((card) => {
  computeAndStoreHeights(card);
  syncCardHeight(card);

  const toggleFlip = () => {
    card.classList.toggle("is-flipped");
    const pressed = card.getAttribute("aria-pressed") === "true";
    card.setAttribute("aria-pressed", String(!pressed));

    // after flip starts, update to the other side's height
    requestAnimationFrame(() => syncCardHeight(card));
  };

  card.addEventListener("click", toggleFlip);

  card.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && card.classList.contains("is-flipped")) {
      e.preventDefault();
      toggleFlip();
    }
  });
});

// Keep heights correct on resize / orientation
window.addEventListener("resize", () => {
  flipCards.forEach((card) => {
    computeAndStoreHeights(card);
    syncCardHeight(card);
  });
});
