"use strict";

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const container = document.querySelector(".service-card-container");
const cards = document.querySelectorAll(".service-card");
const dotsContainer = document.querySelector(".scroll-dots");
const steps = document.querySelectorAll(".about-sub");

// HAMBURGER TRANSITION
if (hamburger && menu) {
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    menu.classList.toggle("show-menu");
  });
}

// FLIP CARD
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".service-card.flipped").forEach((flippedCard) => {
      if (flippedCard !== card) flippedCard.classList.remove("flipped");
    });

    card.classList.toggle("flipped");
  });
});

if (container && dotsContainer && cards.length > 0) {
  // CREATE DOTS
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".scroll-dots button");

  // GET TRUE SCROLL STEP
  function getScrollStep() {
    const card = cards[0];
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.gap, 10) || 0;
    return card.offsetWidth + gap;
  }

  // UPDATE ACTIVE DOT ON SCROLL
  container.addEventListener("scroll", () => {
    const step = getScrollStep();
    const index = Math.round(container.scrollLeft / step);

    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  });

  // CLICK DOT -> SCROLL
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const step = getScrollStep();
      container.scrollTo({
        left: i * step,
        behavior: "smooth",
      });
    });
  });
}

// CHECK BOXES
steps.forEach((step) => {
  const img = step.querySelector("img");
  if (!img) return;

  const original = img.src;
  const hover = img.dataset.hover;
  if (!hover) return;

  step.addEventListener("mouseenter", () => {
    img.src = hover;
  });

  step.addEventListener("mouseleave", () => {
    img.src = original;
  });
});
