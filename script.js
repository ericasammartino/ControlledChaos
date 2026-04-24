const slider = document.getElementById("serviceSlider");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (slider && prevSlide && nextSlide) {
  const scrollByCard = () => {
    const card = slider.querySelector(".service-card");
    if (!card) {
      return 280;
    }
    return card.getBoundingClientRect().width + 16;
  };

  prevSlide.addEventListener("click", () => {
    slider.scrollBy({ left: -scrollByCard(), behavior: "smooth" });
  });

  nextSlide.addEventListener("click", () => {
    slider.scrollBy({ left: scrollByCard(), behavior: "smooth" });
  });
}
