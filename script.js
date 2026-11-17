/* =========================================
   ALPHA SOLUTION — INTERACTIONS
========================================= */

const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* -----------------------------------------
   1. STICKY NAVBAR
----------------------------------------- */

function updateNavbar() {
  if (!navbar) return;

  navbar.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateNavbar, {
  passive: true,
});

updateNavbar();

/* -----------------------------------------
   2. MOBILE NAVIGATION
----------------------------------------- */

function closeMobileMenu() {
  if (!navLinks || !menuToggle) return;

  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });
}

/* -----------------------------------------
   3. SCROLL REVEAL ANIMATIONS
----------------------------------------- */

function initializeScrollAnimations() {
  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  document.body.classList.add("js-motion");

const revealElements = [
  // Existing Home page selectors
  ".section-heading",
  ".intro-visual",
  ".intro-content",
  ".intro-highlights article",
  ".service-card",
  ".capabilities-content",
  ".capability-list > div",
  ".work-heading > div",
  ".work-heading > p",
  ".project-card",
  ".why-card",
  ".process-step",
  ".process-detail",
  ".results-grid > div",
  ".team-card",
  ".testimonial-placeholder",
  ".industry-grid > div",
  ".final-cta",

  // New story selectors
  ".problem-intro",
  ".problem-card",
  ".problem-turn",
  ".stat",

  // Contact page selectors
  ".contact-intro-grid > div",
  ".contact-information",
  ".contact-form-wrapper",
  ".contact-process-card",
  ".contact-process-heading > div",
  ".contact-faq-item",
  ".contact-cta-panel",

  // About page selectors
  ".about-intro-label",
  ".about-intro-content",
  ".manifesto .chapter",
  ".about-statement h2",
  ".vision-heading > div",
  ".vision-heading > p",
  ".vision-card",
  ".value-card",
  ".thinking-image",
  ".thinking-content",
  ".thinking-points article",
  ".partnership-card",
  ".about-team-content",
  ".about-team-visual",
  ".about-capabilities-heading > div",
  ".about-capabilities-heading > p",
  ".about-capabilities-list a",
  ".about-cta-inner"
];

  const elements = document.querySelectorAll(
    revealElements.join(", ")
  );

  elements.forEach((element, index) => {
    element.classList.add("reveal");

    const parent = element.parentElement;
    const siblings = parent
      ? Array.from(parent.children).filter((child) =>
          child.classList.contains("reveal")
        )
      : [];

    const siblingIndex = siblings.indexOf(element);

    element.style.setProperty(
      "--delay",
      `${Math.min(siblingIndex, 5) * 90}ms`
    );
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -45px 0px",
    }
  );

  elements.forEach((element) => observer.observe(element));
}

initializeScrollAnimations();

/* -----------------------------------------
   4. FOOTER YEAR
----------------------------------------- */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* -----------------------------------------
   CONTACT FORM — EMAIL DRAFT
----------------------------------------- */

const contactForm = document.getElementById("projectContactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);

    const name = formData.get("name")?.trim();
    const company = formData.get("company")?.trim() || "Not provided";
    const email = formData.get("email")?.trim();
    const phone = formData.get("phone")?.trim() || "Not provided";
    const service = formData.get("service");
    const budget = formData.get("budget") || "Not specified";
    const timeline = formData.get("timeline") || "Not specified";
    const message = formData.get("message")?.trim();

    const subject = `New Project Enquiry — ${name}`;

    const body = `
Hello Alpha Solution,

I would like to discuss a project.

CONTACT DETAILS
-------------------------
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}

PROJECT DETAILS
-------------------------
Service: ${service}
Budget: ${budget}
Timeline: ${timeline}

PROJECT DESCRIPTION
-------------------------
${message}

Regards,
${name}
`;

    const mailtoUrl =
      `mailto:hello@alphasolution.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formFeedback.className = "form-feedback success";
    formFeedback.textContent =
      "Your email application is opening with your enquiry details. Please send the email to complete your enquiry.";

    window.location.href = mailtoUrl;
  });
}


/* =========================================
   PREMIUM INTERACTIONS
========================================= */

/* 5. SCROLL PROGRESS + PARALLAX */

const progressBar = document.getElementById("scrollProgress");
const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
let ticking = false;

function onScrollFrame() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

  if (progressBar) progressBar.style.setProperty("--progress", progress);

  if (!reducedMotion && window.innerWidth > 760) {
    parallaxItems.forEach((item) => {
      const speed = parseFloat(item.dataset.parallax) || 0.1;
      const y = Math.min(window.scrollY, 900) * speed;
      item.style.transform = `translate3d(0, ${y}px, 0) scale(1.06)`;
    });
  }

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  },
  { passive: true }
);

onScrollFrame();

/* 6. COUNT-UP NUMBERS */

const counters = document.querySelectorAll("[data-count]");

function runCounter(el) {
  const target = parseInt(el.dataset.count, 10) || 0;

  if (reducedMotion) {
    el.textContent = target;
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if (counters.length) {
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }
}

/* 7. INTERACTIVE PROCESS */

const processSteps = document.querySelectorAll(".process-step[data-step]");
const processDetail = document.getElementById("processDetail");

const processContent = [
  {
    label: "01 / DISCOVER",
    title: "First, we listen. Then we build.",
    text: "We get to know your business, audience, challenges and ambitions. This gives us the context to make better decisions and define what success should look like.",
    points: [
      "Understand your business objectives",
      "Identify user needs and opportunities",
      "Align on scope and priorities",
    ],
  },
  {
    label: "02 / DEFINE & STRATEGIZE",
    title: "Turn what we learned into a clear direction.",
    text: "Insights become a plan. We shape the structure, features and priorities so every decision that follows has a reason behind it.",
    points: [
      "Define the scope, features and roadmap",
      "Map the user journey end to end",
      "Choose the right technology approach",
    ],
  },
  {
    label: "03 / DESIGN",
    title: "Make it clear, human and unmistakably yours.",
    text: "We design interfaces and experiences that feel intuitive, look refined and carry your brand with confidence across every screen.",
    points: [
      "Wireframes and interactive prototypes",
      "Visual design and brand consistency",
      "Feedback rounds before development begins",
    ],
  },
  {
    label: "04 / DEVELOP",
    title: "Careful engineering behind every detail.",
    text: "Designs become fast, responsive and reliable products. We build with performance, security and long-term maintainability in mind.",
    points: [
      "Clean, scalable and responsive development",
      "Testing across devices and browsers",
      "Regular progress updates and reviews",
    ],
  },
  {
    label: "05 / LAUNCH & IMPROVE",
    title: "Launch is the beginning, not the end.",
    text: "We go live with confidence, then keep learning: measuring, refining and supporting so your product keeps getting better.",
    points: [
      "Smooth, well-planned launch",
      "Performance monitoring and optimization",
      "Ongoing support and future development",
    ],
  },
];

function renderProcess(index) {
  if (!processDetail) return;

  const data = processContent[index];
  const body = processDetail.querySelector(".detail-body");
  if (!data || !body) return;

  processDetail.classList.add("is-swapping");

  setTimeout(() => {
    body.innerHTML = "";

    const label = document.createElement("span");
    label.className = "detail-number";
    label.textContent = data.label;

    const title = document.createElement("h3");
    title.textContent = data.title;

    const text = document.createElement("p");
    text.textContent = data.text;

    const list = document.createElement("ul");
    list.className = "check-list";

    data.points.forEach((point) => {
      const li = document.createElement("li");
      const tick = document.createElement("span");
      tick.textContent = "✓";
      li.append(tick, ` ${point}`);
      list.appendChild(li);
    });

    body.append(label, title, text, list);
    processDetail.classList.remove("is-swapping");
  }, reducedMotion ? 0 : 220);
}

function activateStep(step) {
  processSteps.forEach((item) => {
    const isActive = item === step;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  renderProcess(parseInt(step.dataset.step, 10));
}

processSteps.forEach((step) => {
  step.addEventListener("click", () => activateStep(step));
  step.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateStep(step);
    }
  });
});

/* 8. CARD SPOTLIGHT (cursor glow) */

if (window.matchMedia("(hover: hover)").matches) {
  const spotlightCards = document.querySelectorAll(
    ".service-card, .why-card, .value-card, .partnership-card, .contact-process-card, .vision-card, .industry-grid > div"
  );

  spotlightCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

/* 9. MANIFESTO WORD REVEAL (About page) */

const manifesto = document.getElementById("manifestoText");

if (manifesto) {
  const words = [];

  function wrapWords(node, highlight) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();

        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;

          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }

          const span = document.createElement("span");
          span.className = highlight ? "w hl" : "w";
          span.textContent = part;
          words.push(span);
          fragment.appendChild(span);
        });

        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child, child.classList.contains("hl"));
      }
    });
  }

  wrapWords(manifesto, false);

  function updateManifesto() {
    if (reducedMotion) {
      words.forEach((w) => w.classList.add("on"));
      return;
    }

    const rect = manifesto.getBoundingClientRect();
    const viewport = window.innerHeight;
    const start = viewport * 0.85;
    const end = viewport * 0.3;
    const progress = Math.min(Math.max((start - rect.top) / (start - end + rect.height * 0.6), 0), 1);
    const visibleCount = Math.round(progress * words.length);

    words.forEach((w, i) => w.classList.toggle("on", i < visibleCount));
  }

  window.addEventListener("scroll", updateManifesto, { passive: true });
  window.addEventListener("resize", updateManifesto);
  updateManifesto();
}