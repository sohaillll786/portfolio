/* =========================================================
   CONFIGURATION
   Edit these values to customize the site.
========================================================= */
const CONTACT_CONFIG = {
  endpoint: "https://api.web3forms.com/submit",
  // Replace YOUR_WEB3FORMS_ACCESS_KEY with your Web3Forms access key.
  accessKey: "54705278-aebe-4c42-979c-90b26578e104"
};

const SOCIAL_LINKS = {
  instagram: "https://instagram.com/mohammed.sohaillll",
  linkedin: "https://linkedin.com/in/mohammed-sohail-ahmed-ansari",
  github: "https://github.com/sohaillll786",
  x: "https://x.com/mohdsohailll"
};

const LOADER_MAX_TIMEOUT = 5000; // ms — safety cap for the loading screen

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initBackgroundVideo();
  initNavigation();
  initMobileMenu();
  initScrollSpy();
  initCustomCursor();
  initRippleEffects();
  initPointerGlow();
  initScrollReveal();
  initPortfolioFilters();
  initContactForm();
  initBackToTop();
  initCurrentYear();
});

/* =========================================================
   LOADING SCREEN
========================================= */
function initLoadingScreen() {
  const loader = document.getElementById("loader");
  const fill = document.getElementById("loaderFill");
  if (!loader) return;

  let progress = 0;
  let hidden = false;

  const tick = window.setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 92);
    if (fill) fill.style.width = progress + "%";
  }, 220);

  function reveal() {
    if (hidden) return;
    hidden = true;
    window.clearInterval(tick);
    if (fill) fill.style.width = "100%";
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
    }, 220);
  }

  window.addEventListener("load", () => window.setTimeout(reveal, 400));
  window.setTimeout(reveal, LOADER_MAX_TIMEOUT);
}

/* =========================================================
   BACKGROUND VIDEO
========================================= */
function initBackgroundVideo() {
  const video = document.getElementById("bgVideo");
  const bgWrap = document.querySelector(".bg-wrap");
  if (!video) return;

  let attempted = false;

  function attemptPlay() {
    if (attempted) return;
    attempted = true;
    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        activateFallback();
      });
    }
  }

  function activateFallback() {
    if (bgWrap) bgWrap.classList.add("video-unavailable");
    video.style.display = "none";
  }

  video.addEventListener("error", activateFallback, { once: true });
  attemptPlay();
}

/* =========================================================
   NAVIGATION (smooth scroll handled natively via CSS)
========================================= */
function initNavigation() {
  const links = document.querySelectorAll('.nav-link, .mobile-link, a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* =========================================================
   MOBILE MENU
========================================= */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;

  function open() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  function close() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? close() : open();
  });

  menu.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) close();
  });
}

/* =========================================================
   SCROLL SPY (active nav state)
========================================= */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-link");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const match = link.dataset.section === id;
          link.classList.toggle("is-active", match);
          if (match) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   CUSTOM CURSOR
========================================= */
function initCustomCursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFinePointer || reducedMotion) return;

  document.body.classList.add("has-custom-cursor");

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;
  let raf = null;

  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.left = targetX + "px";
    dot.style.top = targetY + "px";
    if (!raf) raf = requestAnimationFrame(animateRing);
  }

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    if (Math.abs(targetX - ringX) > 0.3 || Math.abs(targetY - ringY) > 0.3) {
      raf = requestAnimationFrame(animateRing);
    } else {
      raf = null;
    }
  }

  window.addEventListener("pointermove", onMove, { passive: true });

  const interactiveSelector = "a, button, input, textarea, select, .glass-card, [data-cursor-hover]";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      ring.classList.add("is-active");
    }
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      ring.classList.remove("is-active");
    }
  });
}

/* =========================================================
   RIPPLE EFFECT
========================================= */
function initRippleEffects() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-ripple], .filter-btn, .nav-link, .mobile-link");
    if (!target) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";

    const computedPosition = getComputedStyle(target).position;
    if (computedPosition === "static") target.style.position = "relative";
    target.style.overflow = target.style.overflow || "hidden";

    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

/* =========================================================
   POINTER-TRACKING GLASS LIGHT
========================================= */
function initPointerGlow() {
  const cards = document.querySelectorAll(".pointer-glow");
  if (!cards.length) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) return;

  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });
  });
}

/* =========================================================
   SCROLL REVEAL
========================================= */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => entry.target.classList.add("is-visible"), i * 60);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* =========================================================
   PORTFOLIO FILTERS
========================================= */
function initPortfolioFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });
}

/* =========================================================
   CONTACT FORM (Web3Forms)
========================================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const btnLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
  const statusEl = document.getElementById("formStatus");

  const fields = {
    name: { input: document.getElementById("name"), error: document.getElementById("nameError") },
    email: { input: document.getElementById("email"), error: document.getElementById("emailError") },
    projectType: { input: document.getElementById("projectType"), error: document.getElementById("projectTypeError") },
    message: { input: document.getElementById("message"), error: document.getElementById("messageError") }
  };

  function setFieldError(field, message) {
    if (!field.error) return;
    field.error.textContent = message || "";
  }

  function validate() {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      setFieldError(fields.name, "Please enter your name.");
      valid = false;
    } else setFieldError(fields.name, "");

    const emailVal = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailPattern.test(emailVal)) {
      setFieldError(fields.email, "Please enter a valid email address.");
      valid = false;
    } else setFieldError(fields.email, "");

    if (!fields.projectType.input.value) {
      setFieldError(fields.projectType, "Please select a project type.");
      valid = false;
    } else setFieldError(fields.projectType, "");

    if (!fields.message.input.value.trim()) {
      setFieldError(fields.message, "Please add a short message.");
      valid = false;
    } else setFieldError(fields.message, "");

    return valid;
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type);
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.classList.toggle("is-loading", isLoading);
    submitBtn.disabled = isLoading;
    if (btnLabel) btnLabel.textContent = isLoading ? "Sending..." : "Send Message";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", null);

    // honeypot check
    const honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.value) return;

    if (!validate()) {
      setStatus("Please fix the highlighted fields.", "is-error");
      return;
    }

    setLoading(true);

    const payload = {
      access_key: CONTACT_CONFIG.accessKey,
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      project_type: fields.projectType.input.value,
      message: fields.message.input.value.trim(),
      subject: "New message from portfolio contact form"
    };

    try {
      const response = await fetch(CONTACT_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLoading(false);
        if (btnLabel) btnLabel.textContent = "Message Sent";
        if (submitBtn) submitBtn.classList.add("is-success");
        setStatus("Thanks — I'll get back to you soon.", "is-success");
        form.reset();
      } else {
        throw new Error(result.message || "Request failed");
      }
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setLoading(false);
      if (btnLabel) btnLabel.textContent = "Try Again";
      setStatus("Something went wrong. Please try again or email me directly.", "is-error");
    }
  });

  Object.values(fields).forEach(({ input, error }) => {
    if (!input) return;
    input.addEventListener("input", () => setFieldError({ error }, ""));
  });
}

/* =========================================================
   BACK TO TOP
========================================= */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  btn.hidden = false;

  function onScroll() {
    const show = window.scrollY > window.innerHeight * 0.6;
    btn.classList.toggle("is-visible", show);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   CURRENT YEAR
========================================= */
function initCurrentYear() {
  const el = document.getElementById("year");
  if (!el) return;
  el.textContent = new Date().getFullYear();
}
