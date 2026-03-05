/* ===== Constants ===== */
const BREAKPOINT_MOBILE = 640;
const SPARKLE_COUNT_MOBILE = 60;
const SPARKLE_COUNT_DESKTOP = 95;
const SPARKLE_MIN_SIZE = 4;
const SPARKLE_SIZE_RANGE = 6;
const SPARKLE_MAX_DELAY = 180;
const SPARKLE_BASE_DURATION = 750;
const SPARKLE_DURATION_RANGE = 650;
const FLIP_CARD_MIN_HEIGHT = 320;

const root = document.documentElement;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);

  const moonIcon = document.querySelector(".theme-icon-moon");
  const sunIcon = document.querySelector(".theme-icon-sun");
  const isDark = theme === "dark";

  if (moonIcon && sunIcon) {
    moonIcon.style.display = isDark ? "none" : "block";
    sunIcon.style.display = isDark ? "block" : "none";
  }
};

/* ===== Sparkle stars on theme switch ===== */
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

  const count = w < BREAKPOINT_MOBILE ? SPARKLE_COUNT_MOBILE : SPARKLE_COUNT_DESKTOP;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "sparkle-star";

    const x = Math.random() * w;
    const y = Math.random() * h;

    const size = SPARKLE_MIN_SIZE + Math.random() * SPARKLE_SIZE_RANGE;
    const delay = Math.random() * SPARKLE_MAX_DELAY;
    const dur = SPARKLE_BASE_DURATION + Math.random() * SPARKLE_DURATION_RANGE;

    const tx = (Math.random() - 0.5) * 90;
    const ty = 55 + Math.random() * 170;
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

/* ===== Theme init ===== */
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(prefersDark.matches ? "dark" : "light");
}

const initThemeToggle = () => {
  const themeToggle = document.querySelector(".theme-toggle");
  applyTheme(root.getAttribute("data-theme") || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      applyTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
      sprinkleThemeSparkles();
    });
  }

  prefersDark.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
};

/* ===== Smooth in-page navigation ===== */
const initSmoothNavigation = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
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
};

/* ===== Education flip cards (uniform size across all cards) ===== */
const initEducationFlipCards = () => {
  const flipCards = document.querySelectorAll(".flip-card");
  if (!flipCards.length) return;

  const measureFaceHeight = (card, faceSelector) => {
    const inner = card.querySelector(".flip-inner");
    const face = card.querySelector(faceSelector);
    if (!inner || !face) return FLIP_CARD_MIN_HEIGHT;

    const width =
      inner.getBoundingClientRect().width ||
      card.getBoundingClientRect().width ||
      FLIP_CARD_MIN_HEIGHT;

    const clone = face.cloneNode(true);
    clone.style.position = "relative";
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

    return Math.max(h, FLIP_CARD_MIN_HEIGHT);
  };

  const setUniformEducationHeight = () => {
    let maxH = FLIP_CARD_MIN_HEIGHT;

    flipCards.forEach((card) => {
      const frontH = measureFaceHeight(card, ".flip-front");
      const backH = measureFaceHeight(card, ".flip-back");
      maxH = Math.max(maxH, frontH, backH);
    });

    flipCards.forEach((card) => {
      const inner = card.querySelector(".flip-inner");
      if (inner) inner.style.setProperty("--cardH", `${maxH}px`);
    });
  };

  flipCards.forEach((card) => {
    const toggleFlip = () => {
      card.classList.toggle("is-flipped");
      const pressed = card.getAttribute("aria-pressed") === "true";
      card.setAttribute("aria-pressed", String(!pressed));
    };

    card.addEventListener("click", toggleFlip);

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
      if (e.key === "Escape" && card.classList.contains("is-flipped")) {
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  setUniformEducationHeight();
  window.addEventListener("resize", setUniformEducationHeight);
};

/* ===== Contact form handling ===== */
const initContactForm = () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    const originalText = btn.innerHTML;

    btn.innerHTML = "Sending...";
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        btn.innerHTML = "Sent!";
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      btn.innerHTML = "Error — Try again";
      btn.disabled = false;
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 3000);
    }
  });
};

/* ===== Component loader ===== */
const loadComponent = async (selector, filePath) => {
  const mount = document.querySelector(selector);
  if (!mount) return;

  const res = await fetch(filePath);
  if (!res.ok) {
    throw new Error(`Failed to load ${filePath} (${res.status})`);
  }

  const html = await res.text();
  // Use insertAdjacentHTML instead of innerHTML for safer DOM insertion
  mount.insertAdjacentHTML("beforeend", html);
};

/* ===== Prioritized component loading ===== */
const loadAllComponents = async () => {
  // Load above-fold content first (header + hero)
  await Promise.all([
    loadComponent("#header-container", "components/header.html"),
    loadComponent("#hero-container", "components/hero.html"),
  ]);

  // Then load remaining content
  await Promise.all([
    loadComponent("#experience-container", "components/experience.html"),
    loadComponent("#education-container", "components/education.html"),
    loadComponent("#projects-container", "components/projects.html"),
    loadComponent("#skills-container", "components/skills.html"),
    loadComponent("#contact-container", "components/contact.html"),
    loadComponent("#footer-container", "components/footer.html"),
  ]);
};

const initPage = async () => {
  try {
    await loadAllComponents();
    initThemeToggle();
    initSmoothNavigation();
    initEducationFlipCards();
    initContactForm();
  } catch (error) {
    console.error("Component load error:", error);
  }
};

initPage();
