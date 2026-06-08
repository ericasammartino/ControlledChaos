const screens = Array.from(document.querySelectorAll("[data-screen]"));
const menu = document.querySelector(".mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const navLinks = Array.from(document.querySelectorAll(".mobile-menu a"));
const accordions = Array.from(document.querySelectorAll(".accordion"));
const forms = Array.from(document.querySelectorAll("form[data-success-target]"));

const defaultScreen = "home";

function getTargetScreen() {
  const hash = window.location.hash.replace("#", "");
  return screens.some((screen) => screen.dataset.screen === hash) ? hash : defaultScreen;
}

function setActiveScreen(screenName) {
  screens.forEach((screen) => {
    const isActive = screen.dataset.screen === screenName;
    screen.classList.toggle("is-active", isActive);
    screen.setAttribute("aria-hidden", String(!isActive));
  });
}

function closeMenu() {
  menu.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

function openMenu() {
  menu.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
}

function syncRoute() {
  setActiveScreen(getTargetScreen());
  closeMenu();
  window.scrollTo({ top: 0, behavior: "auto" });
}

menuToggle.addEventListener("click", () => {
  if (menu.hidden) {
    openMenu();
  } else {
    closeMenu();
  }
});

menuClose.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  const clickedMenu = menu.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!menu.hidden && !clickedMenu && !clickedToggle) {
    closeMenu();
  }
});

accordions.forEach((accordion) => {
  accordion.addEventListener("click", () => {
    const isExpanded = accordion.getAttribute("aria-expanded") === "true";
    accordion.setAttribute("aria-expanded", String(!isExpanded));
    accordion.querySelector("strong").textContent = isExpanded ? "+" : "-";
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    form.reset();
    window.location.hash = form.dataset.successTarget;
  });
});

window.addEventListener("hashchange", syncRoute);

if (!window.location.hash) {
  window.location.hash = defaultScreen;
} else {
  syncRoute();
}
