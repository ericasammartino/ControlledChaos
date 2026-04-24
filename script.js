const slider = document.getElementById("serviceSlider");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const yearEl = document.getElementById("year");
const checkoutButtons = document.querySelectorAll(".checkout-btn");
const checkoutStatus = document.getElementById("checkoutStatus");

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

const renderCheckoutMessage = () => {
  if (!checkoutStatus) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");

  if (status === "success") {
    checkoutStatus.textContent =
      "Payment successful! Thank you for your order. We will send your shipment details soon.";
    checkoutStatus.classList.add("checkout-status", "checkout-status-success");
    checkoutStatus.classList.remove("checkout-status-error");
  } else if (status === "cancelled") {
    checkoutStatus.textContent = "Checkout cancelled. Your cart has not been charged.";
    checkoutStatus.classList.add("checkout-status", "checkout-status-error");
    checkoutStatus.classList.remove("checkout-status-success");
  } else {
    checkoutStatus.textContent = "";
    checkoutStatus.className = "checkout-status";
  }
};

const handleCheckout = async (button) => {
  const productId = button.dataset.productId;
  if (!productId) {
    return;
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Redirecting...";

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId })
    });

    const result = await response.json();
    if (!response.ok || !result.url) {
      throw new Error(result.error || "Unable to start Stripe Checkout.");
    }

    window.location.href = result.url;
  } catch (error) {
    if (checkoutStatus) {
      checkoutStatus.textContent = error.message;
      checkoutStatus.classList.add("checkout-status", "checkout-status-error");
      checkoutStatus.classList.remove("checkout-status-success");
    }
    button.disabled = false;
    button.textContent = originalText;
  }
};

if (checkoutButtons.length > 0) {
  checkoutButtons.forEach((button) => {
    button.addEventListener("click", () => handleCheckout(button));
  });
}

renderCheckoutMessage();
