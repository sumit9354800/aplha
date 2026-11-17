
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

  // About page selectors
  ".about-intro-label",
  ".about-intro-content",
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
