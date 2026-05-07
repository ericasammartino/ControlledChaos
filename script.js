const nav = document.getElementById("site-nav");

if (!nav) {
  throw new Error("Expected #site-nav in the document.");
}

const setNavContrast = (mode) => {
  nav.classList.toggle("is-light", mode === "light");
  nav.classList.toggle("is-dark", mode === "dark");
};

const updateNavByScrollPosition = () => {
  // Probe the page at the vertical center of the nav.
  const navRect = nav.getBoundingClientRect();
  const probeX = Math.min(window.innerWidth - 1, Math.max(0, navRect.left + navRect.width / 2));
  const probeY = Math.min(
    window.innerHeight - 1,
    Math.max(0, navRect.top + navRect.height / 2)
  );

  const elementUnderNav = document.elementFromPoint(probeX, probeY);
  const contrastContainer = elementUnderNav?.closest("[data-nav-contrast]");
  const requestedMode = contrastContainer?.getAttribute("data-nav-contrast");

  setNavContrast(requestedMode === "dark" ? "dark" : "light");
};

const onScrollOrResize = () => {
  window.requestAnimationFrame(updateNavByScrollPosition);
};

updateNavByScrollPosition();
window.addEventListener("scroll", onScrollOrResize, { passive: true });
window.addEventListener("resize", onScrollOrResize);
